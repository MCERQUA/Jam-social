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

  // Initialize storage for new users (will do nothing if already exists)
  const { initializeUserStorage } = await import('./storageService.js');
  await initializeUserStorage(userId);

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

  // Save file metadata to database with DAM fields
  const result = await query(
    `INSERT INTO user_files (
      user_id, file_name, original_name, file_type, mime_type,
      file_size, file_path, thumbnail_path, resolution,
      duration, package_name, tags,
      asset_category, usage_tags, character_names, object_description,
      scene_location, has_alpha_channel,
      audio_category, audio_duration_seconds, audio_style, audio_vocals,
      audio_lyrics, audio_tempo, audio_key, voiceover_type, voiceover_script,
      ai_metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
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
      // DAM metadata
      metadata.assetCategory || null,
      metadata.usageTags || [],
      metadata.characterNames || [],
      metadata.objectDescription || null,
      metadata.sceneLocation || null,
      metadata.hasAlphaChannel || false,
      // Audio metadata
      metadata.audioCategory || null,
      metadata.audioDurationSeconds || null,
      metadata.audioStyle || null,
      metadata.audioVocals || false,
      metadata.audioLyrics || null,
      metadata.audioTempo || null,
      metadata.audioKey || null,
      metadata.voiceoverType || null,
      metadata.voiceoverScript || null,
      // AI metadata
      metadata.aiMetadata || {},
    ]
  );

  return formatFileResponse(result.rows[0]);
}

/**
 * Get user's files with optional filters (including DAM filters)
 */
export async function getUserFiles(userId, options = {}) {
  const {
    fileType,
    isFavorite,
    packageName,
    tags,
    assetCategory,
    usageTags,
    audioCategory,
    characterNames,
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

  // DAM filters
  if (assetCategory) {
    queryText += ` AND asset_category = $${paramIndex}`;
    params.push(assetCategory);
    paramIndex++;
  }

  if (usageTags && usageTags.length > 0) {
    queryText += ` AND usage_tags && $${paramIndex}`;
    params.push(usageTags);
    paramIndex++;
  }

  if (audioCategory) {
    queryText += ` AND audio_category = $${paramIndex}`;
    params.push(audioCategory);
    paramIndex++;
  }

  if (characterNames && characterNames.length > 0) {
    queryText += ` AND character_names && $${paramIndex}`;
    params.push(characterNames);
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
 * Format file response with DAM metadata
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

    // DAM metadata
    assetCategory: file.asset_category,
    usageTags: file.usage_tags || [],
    characterNames: file.character_names || [],
    objectDescription: file.object_description,
    sceneLocation: file.scene_location,
    hasAlphaChannel: file.has_alpha_channel || false,

    // Audio metadata
    audioCategory: file.audio_category,
    audioDurationSeconds: file.audio_duration_seconds,
    audioStyle: file.audio_style,
    audioVocals: file.audio_vocals || false,
    audioLyrics: file.audio_lyrics,
    audioTempo: file.audio_tempo,
    audioKey: file.audio_key,
    voiceoverType: file.voiceover_type,
    voiceoverScript: file.voiceover_script,

    // AI metadata
    aiMetadata: file.ai_metadata || {},
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
