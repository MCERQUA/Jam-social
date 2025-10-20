import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { getUserStoragePath } from '../config/storage.js';

/**
 * Generate thumbnail for image or video
 */
export async function generateThumbnail(filePath, userId, fileType) {
  const thumbnailsDir = path.join(getUserStoragePath(userId), 'thumbnails');
  await fs.mkdir(thumbnailsDir, { recursive: true });

  const thumbnailName = `thumb-${crypto.randomBytes(8).toString('hex')}.jpg`;
  const thumbnailPath = path.join(thumbnailsDir, thumbnailName);

  let resolution = null;

  if (fileType === 'image') {
    // Generate image thumbnail using sharp
    const metadata = await sharp(filePath).metadata();
    resolution = `${metadata.width}x${metadata.height}`;

    await sharp(filePath)
      .resize(400, 225, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
  } else if (fileType === 'video') {
    // Generate video thumbnail using ffmpeg
    resolution = await new Promise((resolve, reject) => {
      let videoResolution = null;

      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('FFprobe error:', err);
          return reject(err);
        }

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        if (videoStream) {
          videoResolution = `${videoStream.width}x${videoStream.height}`;
        }

        ffmpeg(filePath)
          .screenshots({
            timestamps: ['00:00:02'],
            filename: thumbnailName,
            folder: thumbnailsDir,
            size: '400x225',
          })
          .on('end', () => resolve(videoResolution))
          .on('error', reject);
      });
    });
  }

  const relativePath = path.relative(
    process.env.USER_STORAGE_ROOT || '/mnt/user-storage/users',
    thumbnailPath
  );

  return {
    thumbnailPath: relativePath,
    resolution,
  };
}

/**
 * Get video duration
 */
export async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      const duration = metadata.format.duration;
      if (!duration) return resolve(null);

      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);

      const formatted = hours > 0
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      resolve(formatted);
    });
  });
}

export default {
  generateThumbnail,
  getVideoDuration,
};
