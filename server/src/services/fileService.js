import fs from 'fs/promises';
import path from 'path';
import { query } from '../config/database.js';
import {
  ensureUserDirectories,
  getUserFilePath,
  getFileTypeFromMime,
  formatBytes,
} from '../config/storage.js';
import { checkStorageAvailable } from './storageService.js';
import { generateThumbnail } from './thumbnailService.js';

/**
 * Save uploaded file to user's storage
 */
export async function saveUserFile(userId, file, metadata = {}) {
  // Ensure user directories exist
  await ensureUserDirectories(userId);

  // Determine file type
  const fileType = metadata.fileType || getFileTypeFromMime(file.mimetype);

  if (!fileType) {
    throw new Error('Unsupported file type');
  }

  // Check storage availability
  const hasSpace = await checkStorageAvailable(userId, file.size);

  if (!hasSpace) {
    // Clean up temp file
    await fs.unlink(file.path);
    throw new Error('Storage quota exceeded');
  }

  // Generate safe filename
  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const filename = `${timestamp}-${path.basename(file.originalname, ext)}${ext}`;
  const filePath = getUserFilePath(userId, fileType, filename);

  // Move file from temp to permanent storage
  await fs.rename(file.path, filePath);

  // Generate thumbnail for images and videos
  let thumbnailPath = null;
  let resolution = metadata.resolution || null;

  if (fileType === 'image' || fileType === 'video') {
    try {
      const thumbResult = await generateThumbnail(filePath, userId, fileType);
      thumbnailPath = thumbResult.thumbnailPath;
      resolution = thumbResult.resolution;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  // Save file metadata to database
  const result = await query(
    `INSERT INTO user_files (
      user_id, file_name, original_name, file_type, mime_type,
      file_size, file_path, thumbnail_path, resolution,
      duration, package_name, tags
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      userId,
      filename,
      file.originalname,
      fileType,
      file.mimetype,
      file.size,
      path.relative(process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users', filePath),
      thumbnailPath,
      resolution,
      metadata.duration || null,
      metadata.packageName || null,
      metadata.tags || [],
    ]
  );

  return formatFileResponse(result.rows[0]);
}

/**
 * Get user's files with optional filters
 */
export async function getUserFiles(userId, options = {}) {
  const {
    fileType,
    isFavorite,
    packageName,
    tags,
    limit = 50,
    offset = 0,
    sortBy = 'upload_date',
    sortOrder = 'DESC',
  } = options;

  let queryText = 'SELECT * FROM user_files WHERE user_id = $1';
  const params = [userId];
  let paramIndex = 2;

  if (fileType) {
    queryText += ` AND file_type = $${paramIndex}`;
    params.push(fileType);
    paramIndex++;
  }

  if (isFavorite !== undefined) {
    queryText += ` AND is_favorite = $${paramIndex}`;
    params.push(isFavorite);
    paramIndex++;
  }

  if (packageName) {
    queryText += ` AND package_name = $${paramIndex}`;
    params.push(packageName);
    paramIndex++;
  }

  if (tags && tags.length > 0) {
    queryText += ` AND tags && $${paramIndex}`;
    params.push(tags);
    paramIndex++;
  }

  queryText += ` ORDER BY ${sortBy} ${sortOrder}`;
  queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(queryText, params);

  return result.rows.map(formatFileResponse);
}

/**
 * Get single file by ID
 */
export async function getFileById(fileId, userId) {
  const result = await query(
    'SELECT * FROM user_files WHERE id = $1 AND user_id = $2',
    [fileId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  return formatFileResponse(result.rows[0]);
}

/**
 * Delete file
 */
export async function deleteFile(fileId, userId) {
  // Get file info
  const file = await getFileById(fileId, userId);

  // Delete from database (trigger will update storage)
  await query(
    'DELETE FROM user_files WHERE id = $1 AND user_id = $2',
    [fileId, userId]
  );

  // Delete physical files
  try {
    const fullPath = path.join(
      process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users',
      file.filePath
    );
    await fs.unlink(fullPath);

    // Delete thumbnail if exists
    if (file.thumbnailPath) {
      const thumbPath = path.join(
        process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users',
        file.thumbnailPath
      );
      await fs.unlink(thumbPath).catch(() => {});
    }
  } catch (error) {
    console.error('Error deleting physical file:', error);
  }

  return { success: true, deletedFile: file };
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(fileId, userId) {
  const result = await query(
    `UPDATE user_files
     SET is_favorite = NOT is_favorite
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [fileId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  return formatFileResponse(result.rows[0]);
}

/**
 * Update file tags
 */
export async function updateFileTags(fileId, userId, tags) {
  const result = await query(
    `UPDATE user_files
     SET tags = $3
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [fileId, userId, tags]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  return formatFileResponse(result.rows[0]);
}

/**
 * Format file response
 */
function formatFileResponse(file) {
  return {
    id: file.id,
    userId: file.user_id,
    fileName: file.file_name,
    originalName: file.original_name,
    fileType: file.file_type,
    mimeType: file.mime_type,
    fileSize: parseInt(file.file_size),
    fileSizeFormatted: formatBytes(file.file_size),
    filePath: file.file_path,
    thumbnailPath: file.thumbnail_path,
    resolution: file.resolution,
    duration: file.duration,
    packageName: file.package_name,
    tags: file.tags || [],
    isFavorite: file.is_favorite,
    uploadDate: file.upload_date,
    createdAt: file.created_at,
  };
}

export default {
  saveUserFile,
  getUserFiles,
  getFileById,
  deleteFile,
  toggleFavorite,
  updateFileTags,
};
