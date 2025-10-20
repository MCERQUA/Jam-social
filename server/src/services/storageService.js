import { query } from '../config/database.js';
import { STORAGE_CONFIG, formatBytes } from '../config/storage.js';

/**
 * Get user's storage usage information
 */
export async function getUserStorageInfo(userId) {
  const result = await query(
    'SELECT * FROM get_user_storage($1)',
    [userId]
  );

  if (result.rows.length === 0) {
    // User doesn't exist yet, return default values
    return {
      userId,
      totalBytes: 0,
      maxBytes: STORAGE_CONFIG.MAX_STORAGE_PER_USER,
      fileCount: 0,
      percentage: 0,
      totalFormatted: '0 Bytes',
      maxFormatted: formatBytes(STORAGE_CONFIG.MAX_STORAGE_PER_USER),
      availableBytes: STORAGE_CONFIG.MAX_STORAGE_PER_USER,
      availableFormatted: formatBytes(STORAGE_CONFIG.MAX_STORAGE_PER_USER),
    };
  }

  const storage = result.rows[0];
  const availableBytes = storage.max_bytes - storage.total_bytes;

  return {
    userId: storage.user_id,
    totalBytes: parseInt(storage.total_bytes),
    maxBytes: parseInt(storage.max_bytes),
    fileCount: parseInt(storage.file_count),
    percentage: parseFloat(storage.percentage),
    totalFormatted: formatBytes(storage.total_bytes),
    maxFormatted: formatBytes(storage.max_bytes),
    availableBytes: Math.max(0, availableBytes),
    availableFormatted: formatBytes(Math.max(0, availableBytes)),
  };
}

/**
 * Check if user has enough storage space for a file
 */
export async function checkStorageAvailable(userId, fileSize) {
  const result = await query(
    'SELECT check_storage_available($1, $2) as has_space',
    [userId, fileSize]
  );

  return result.rows[0].has_space;
}

/**
 * Initialize storage record for a new user
 */
export async function initializeUserStorage(userId, maxBytes = null) {
  const max = maxBytes || STORAGE_CONFIG.MAX_STORAGE_PER_USER;

  await query(
    `INSERT INTO user_storage (user_id, max_bytes)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId, max]
  );

  return getUserStorageInfo(userId);
}

/**
 * Update user's storage quota
 */
export async function updateStorageQuota(userId, newMaxBytes) {
  await query(
    `UPDATE user_storage
     SET max_bytes = $2, updated_at = NOW()
     WHERE user_id = $1`,
    [userId, newMaxBytes]
  );

  return getUserStorageInfo(userId);
}

/**
 * Get storage statistics for all users (admin)
 */
export async function getAllUsersStorageStats() {
  const result = await query(`
    SELECT
      COUNT(*) as total_users,
      SUM(total_bytes) as total_used,
      SUM(max_bytes) as total_quota,
      AVG(total_bytes) as avg_used,
      SUM(file_count) as total_files
    FROM user_storage
  `);

  const stats = result.rows[0];

  return {
    totalUsers: parseInt(stats.total_users) || 0,
    totalUsed: parseInt(stats.total_used) || 0,
    totalQuota: parseInt(stats.total_quota) || 0,
    avgUsed: parseFloat(stats.avg_used) || 0,
    totalFiles: parseInt(stats.total_files) || 0,
    totalUsedFormatted: formatBytes(stats.total_used || 0),
    totalQuotaFormatted: formatBytes(stats.total_quota || 0),
    avgUsedFormatted: formatBytes(stats.avg_used || 0),
  };
}

export default {
  getUserStorageInfo,
  checkStorageAvailable,
  initializeUserStorage,
  updateStorageQuota,
  getAllUsersStorageStats,
};
