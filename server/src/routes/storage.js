import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as storageService from '../services/storageService.js';

const router = express.Router();

/**
 * GET /api/storage/usage
 * Get user's storage usage information
 */
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const storageInfo = await storageService.getUserStorageInfo(req.userId);

    res.json({
      success: true,
      storage: storageInfo,
    });
  } catch (error) {
    console.error('Error fetching storage info:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/storage/initialize
 * Initialize storage for a new user (creates record)
 */
router.post('/initialize', requireAuth, async (req, res) => {
  try {
    const { maxBytes } = req.body;

    const storageInfo = await storageService.initializeUserStorage(
      req.userId,
      maxBytes
    );

    res.json({
      success: true,
      storage: storageInfo,
    });
  } catch (error) {
    console.error('Error initializing storage:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/storage/quota
 * Update user's storage quota (admin only - TODO: add admin check)
 */
router.put('/quota', requireAuth, async (req, res) => {
  try {
    const { userId, maxBytes } = req.body;

    if (!userId || !maxBytes) {
      return res.status(400).json({
        success: false,
        error: 'userId and maxBytes are required',
      });
    }

    // TODO: Add admin authorization check here
    // For now, users can only update their own quota
    const targetUserId = userId === req.userId ? userId : req.userId;

    const storageInfo = await storageService.updateStorageQuota(
      targetUserId,
      maxBytes
    );

    res.json({
      success: true,
      storage: storageInfo,
    });
  } catch (error) {
    console.error('Error updating quota:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/storage/stats
 * Get overall storage statistics (admin only - TODO: add admin check)
 */
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // TODO: Add admin authorization check here
    const stats = await storageService.getAllUsersStorageStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
