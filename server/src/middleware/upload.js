import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { STORAGE_CONFIG, isAllowedMimeType } from '../config/storage.js';

// Ensure temp directory exists
await fs.mkdir(STORAGE_CONFIG.TEMP_UPLOAD_DIR, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Create user-specific temp directory
      const userTempDir = path.join(STORAGE_CONFIG.TEMP_UPLOAD_DIR, req.userId);
      await fs.mkdir(userTempDir, { recursive: true });
      cb(null, userTempDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check mime type
  if (!isAllowedMimeType(file.mimetype)) {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    return;
  }

  cb(null, true);
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: STORAGE_CONFIG.MAX_FILE_SIZE, // 2GB default
    files: 100, // Max 100 files per request (increased for bulk uploads)
  },
});

// Error handling middleware for multer
export function handleUploadErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        maxSize: STORAGE_CONFIG.MAX_FILE_SIZE,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        maxFiles: 100,
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  next();
}

export default { upload, handleUploadErrors };
