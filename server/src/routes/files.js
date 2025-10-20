import express from 'express';
import { upload, handleUploadErrors } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import * as fileService from '../services/fileService.js';
import { getVideoDuration } from '../services/thumbnailService.js';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

/**
 * POST /api/files/upload
 * Upload one or more files
 */
router.post(
  '/upload',
  requireAuth,
  upload.array('files', 10),
  handleUploadErrors,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded',
        });
      }

      const uploadedFiles = [];
      const errors = [];

      for (const file of req.files) {
        try {
          // Get video duration if it's a video
          let duration = null;
          if (file.mimetype.startsWith('video/')) {
            duration = await getVideoDuration(file.path).catch(() => null);
          }

          const metadata = {
            fileType: req.body.fileType,
            packageName: req.body.packageName,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            duration,
          };

          const savedFile = await fileService.saveUserFile(
            req.userId,
            file,
            metadata
          );

          uploadedFiles.push(savedFile);
        } catch (error) {
          errors.push({
            filename: file.originalname,
            error: error.message,
          });

          // Clean up temp file if it still exists
          try {
            await fs.unlink(file.path);
          } catch {}
        }
      }

      res.json({
        success: true,
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/files
 * List user's files with optional filters
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const options = {
      fileType: req.query.type,
      isFavorite: req.query.favorite === 'true' ? true : undefined,
      packageName: req.query.package,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0,
      sortBy: req.query.sortBy || 'upload_date',
      sortOrder: req.query.sortOrder || 'DESC',
    };

    const files = await fileService.getUserFiles(req.userId, options);

    res.json({
      success: true,
      files,
      count: files.length,
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/files/:id
 * Get file details
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id, req.userId);

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/files/:id/download
 * Download file
 */
router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id, req.userId);

    const fullPath = path.join(
      process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users',
      file.filePath
    );

    // Check if file exists
    await fs.access(fullPath);

    // Set headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalName)}"`
    );

    // Stream the file
    const fileStream = (await import('fs')).createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'File not found',
    });
  }
});

/**
 * GET /api/files/:id/thumbnail
 * Get file thumbnail
 */
router.get('/:id/thumbnail', requireAuth, async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id, req.userId);

    if (!file.thumbnailPath) {
      return res.status(404).json({
        success: false,
        error: 'Thumbnail not available',
      });
    }

    const fullPath = path.join(
      process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users',
      file.thumbnailPath
    );

    // Check if file exists
    await fs.access(fullPath);

    // Stream the thumbnail
    const fileStream = (await import('fs')).createReadStream(fullPath);
    res.setHeader('Content-Type', 'image/jpeg');
    fileStream.pipe(res);
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Thumbnail not found',
    });
  }
});

/**
 * DELETE /api/files/:id
 * Delete file
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await fileService.deleteFile(req.params.id, req.userId);

    res.json({
      success: true,
      message: 'File deleted successfully',
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/files/:id/favorite
 * Toggle favorite status
 */
router.post('/:id/favorite', requireAuth, async (req, res) => {
  try {
    const file = await fileService.toggleFavorite(req.params.id, req.userId);

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/files/:id/tags
 * Update file tags
 */
router.put('/:id/tags', requireAuth, async (req, res) => {
  try {
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        error: 'Tags must be an array',
      });
    }

    const file = await fileService.updateFileTags(
      req.params.id,
      req.userId,
      tags
    );

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
