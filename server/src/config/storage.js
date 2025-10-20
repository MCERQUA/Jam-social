import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

export const STORAGE_CONFIG = {
  USER_STORAGE_ROOT: process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users',
  MAX_STORAGE_PER_USER: parseInt(process.env.MAX_STORAGE_PER_USER) || 10737418240, // 10GB
  TEMP_UPLOAD_DIR: process.env.TEMP_UPLOAD_DIR || '/tmp/jam-uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 2147483648, // 2GB
};

export const FILE_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  SCENE: 'scene',
  PROJECT: 'project',
  AUDIO: 'audio',
};

export const ALLOWED_MIME_TYPES = {
  video: (process.env.ALLOWED_VIDEO_TYPES || 'video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm').split(','),
  image: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml').split(','),
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'],
};

// Get user's storage directory path
export function getUserStoragePath(userId) {
  return path.join(STORAGE_CONFIG.USER_STORAGE_ROOT, userId);
}

// Get user's file path
export function getUserFilePath(userId, fileType, filename) {
  return path.join(getUserStoragePath(userId), fileType, filename);
}

// Ensure user storage directories exist
export async function ensureUserDirectories(userId) {
  const userPath = getUserStoragePath(userId);
  const directories = [
    userPath,
    path.join(userPath, FILE_TYPES.VIDEO),
    path.join(userPath, FILE_TYPES.IMAGE),
    path.join(userPath, FILE_TYPES.SCENE),
    path.join(userPath, FILE_TYPES.PROJECT),
    path.join(userPath, FILE_TYPES.AUDIO),
    path.join(userPath, 'thumbnails'),
  ];

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true, mode: 0o700 });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  return userPath;
}

// Format bytes to human readable
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get file type from mime type
export function getFileTypeFromMime(mimeType) {
  if (mimeType.startsWith('video/')) return FILE_TYPES.VIDEO;
  if (mimeType.startsWith('image/')) return FILE_TYPES.IMAGE;
  if (mimeType.startsWith('audio/')) return FILE_TYPES.AUDIO;
  return null;
}

// Validate mime type
export function isAllowedMimeType(mimeType) {
  return Object.values(ALLOWED_MIME_TYPES).flat().includes(mimeType);
}

export default STORAGE_CONFIG;
