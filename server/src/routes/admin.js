import express from 'express';
import { requireAuth, getUserInfo } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { clerkClient } from '@clerk/clerk-sdk-node';
import * as fileService from '../services/fileService.js';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all Clerk users (admin only)
 */
router.get('/users', requireAuth, getUserInfo, requireAdmin, async (req, res) => {
  try {
    console.log(`[ADMIN] ${req.userEmail} fetching user list`);

    // Fetch all users from Clerk
    const response = await clerkClient.users.getUserList({
      limit: 500, // Adjust as needed
      orderBy: '-created_at',
    });

    // The response is an array-like object, not { data: [...] }
    const userList = Array.isArray(response) ? response : (response.data || []);

    // Format user data
    const formattedUsers = userList.map(user => ({
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || 'No email',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      imageUrl: user.imageUrl,
    }));

    console.log(`[ADMIN] Found ${formattedUsers.length} users`);

    res.json({
      success: true,
      users: formattedUsers,
      count: formattedUsers.length,
    });
  } catch (error) {
    console.error('[ADMIN] Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/files/:userId
 * Get files for a specific user (admin only)
 */
router.get('/files/:userId', requireAuth, getUserInfo, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`[ADMIN] ${req.userEmail} fetching files for user ${userId}`);

    const options = {
      fileType: req.query.type,
      isFavorite: req.query.favorite === 'true' ? true : undefined,
      packageName: req.query.package,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,

      // DAM filters
      assetCategory: req.query.assetCategory,
      usageTags: req.query.usageTags ? req.query.usageTags.split(',') : undefined,
      audioCategory: req.query.audioCategory,
      characterNames: req.query.characterNames ? req.query.characterNames.split(',') : undefined,

      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0,
      sortBy: req.query.sortBy || 'upload_date',
      sortOrder: req.query.sortOrder || 'DESC',
    };

    const files = await fileService.getUserFiles(userId, options);

    console.log(`[ADMIN] Found ${files.length} files for user ${userId}`);

    res.json({
      success: true,
      files,
      count: files.length,
    });
  } catch (error) {
    console.error('[ADMIN] Error fetching files:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
