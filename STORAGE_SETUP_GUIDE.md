# User Storage System Setup Guide

## Overview
Implementation guide for setting up per-user file storage using Hetzner Volumes with 10GB per paying client.

## Architecture

### Components
1. **Hetzner Volumes**: Physical storage (10GB per user)
2. **Database**: PostgreSQL/MySQL for file metadata and user storage tracking
3. **API Backend**: Node.js/Express endpoints for file operations
4. **Frontend**: React components for upload/download
5. **Storage Service**: Tracks usage and enforces limits

---

## Part 1: Hetzner Volume Setup

### Option A: Single Large Volume (Recommended for <100 users)
```bash
# Create a single large volume and partition it per user
# More cost-effective, easier management

# 1. Create volume via Hetzner Cloud Console or CLI
hcloud volume create \
  --name user-storage-main \
  --size 100 \
  --server jam-social-vps \
  --format ext4

# 2. Mount the volume
mkdir -p /mnt/user-storage
mount /dev/disk/by-id/scsi-0HC_Volume_XXXXX /mnt/user-storage

# 3. Add to /etc/fstab for auto-mount on reboot
echo '/dev/disk/by-id/scsi-0HC_Volume_XXXXX /mnt/user-storage ext4 defaults 0 0' >> /etc/fstab

# 4. Create directory structure
mkdir -p /mnt/user-storage/users
chmod 755 /mnt/user-storage/users
```

### Option B: Per-User Volumes (Recommended for >100 users or strict isolation)
```bash
# Create separate volumes per user
# Better isolation, easier to scale

# Script to create user volume
create_user_volume() {
  USER_ID=$1
  hcloud volume create \
    --name "user-${USER_ID}-storage" \
    --size 10 \
    --server jam-social-vps \
    --format ext4

  mkdir -p "/mnt/user-storage/${USER_ID}"
  mount "/dev/disk/by-id/scsi-0HC_Volume_user_${USER_ID}" "/mnt/user-storage/${USER_ID}"
}
```

### Recommended Approach: Single Volume with User Directories
```bash
# Create user storage directories on demand
USER_STORAGE_ROOT="/mnt/user-storage/users"

create_user_directory() {
  USER_ID=$1
  USER_DIR="${USER_STORAGE_ROOT}/${USER_ID}"

  mkdir -p "${USER_DIR}/videos"
  mkdir -p "${USER_DIR}/images"
  mkdir -p "${USER_DIR}/scenes"
  mkdir -p "${USER_DIR}/projects"
  mkdir -p "${USER_DIR}/audio"

  # Set ownership (assuming your app runs as 'jamapp' user)
  chown -R jamapp:jamapp "${USER_DIR}"
  chmod 700 "${USER_DIR}"
}
```

---

## Part 2: Database Schema

### PostgreSQL Schema
```sql
-- Users storage tracking table
CREATE TABLE user_storage (
  user_id VARCHAR(255) PRIMARY KEY,  -- Clerk user ID
  total_bytes BIGINT DEFAULT 0,
  max_bytes BIGINT DEFAULT 10737418240, -- 10GB in bytes
  file_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Files metadata table
CREATE TABLE user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES user_storage(user_id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'video', 'image', 'scene', 'project', 'audio'
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  file_path VARCHAR(1000) NOT NULL, -- Relative path on volume
  thumbnail_path VARCHAR(1000), -- For videos/images
  resolution VARCHAR(50), -- e.g., "1920x1080"
  duration VARCHAR(20), -- For videos, e.g., "00:02:30"
  package_name VARCHAR(100), -- Which package this belongs to
  tags TEXT[], -- Array of tags
  is_favorite BOOLEAN DEFAULT FALSE,
  upload_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_files_user_id ON user_files(user_id);
CREATE INDEX idx_user_files_type ON user_files(file_type);
CREATE INDEX idx_user_files_upload_date ON user_files(upload_date DESC);
CREATE INDEX idx_user_files_favorite ON user_files(is_favorite) WHERE is_favorite = TRUE;

-- Trigger to update user_storage when files are added/deleted
CREATE OR REPLACE FUNCTION update_user_storage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_storage
    SET total_bytes = total_bytes + NEW.file_size,
        file_count = file_count + 1,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_storage
    SET total_bytes = total_bytes - OLD.file_size,
        file_count = file_count - 1,
        updated_at = NOW()
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_storage
AFTER INSERT OR DELETE ON user_files
FOR EACH ROW EXECUTE FUNCTION update_user_storage();
```

---

## Part 3: Backend API Structure

### Required Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@clerk/clerk-sdk-node": "^4.13.0",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.11.0",
    "sharp": "^0.32.0",
    "fluent-ffmpeg": "^2.1.2",
    "dotenv": "^16.3.1"
  }
}
```

### Environment Variables Needed
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jamsocial

# Storage
USER_STORAGE_ROOT=/mnt/user-storage/users
MAX_STORAGE_PER_USER=10737418240

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key

# Server
PORT=3001
```

### API Endpoints Structure
```
POST   /api/files/upload          - Upload file
GET    /api/files                 - List user's files
GET    /api/files/:id             - Get file details
GET    /api/files/:id/download    - Download file
DELETE /api/files/:id             - Delete file
GET    /api/storage/usage         - Get user's storage usage
POST   /api/files/:id/favorite    - Toggle favorite
PUT    /api/files/:id/tags        - Update file tags
```

---

## Part 4: Implementation Files

### File Structure
```
/server
  /src
    /config
      database.js          - Database connection
      storage.js           - Storage configuration
    /middleware
      auth.js              - Clerk authentication
      upload.js            - Multer configuration
    /services
      storageService.js    - Storage tracking logic
      fileService.js       - File operations
      thumbnailService.js  - Generate thumbnails
    /routes
      files.js             - File routes
      storage.js           - Storage routes
    /utils
      validation.js        - File validation
    app.js                 - Express app
    server.js              - Server entry
  package.json
```

---

## Part 5: Quota Management

### Storage Enforcement
1. **Pre-upload check**: Verify user has space before accepting upload
2. **Real-time calculation**: Update storage on every upload/delete
3. **Periodic audit**: Cron job to verify actual disk usage matches database
4. **Cleanup old files**: Optional automatic cleanup of old temp files

### Monitoring Script
```bash
#!/bin/bash
# /usr/local/bin/check-storage-quotas.sh

USER_STORAGE_ROOT="/mnt/user-storage/users"

for user_dir in "$USER_STORAGE_ROOT"/*; do
  if [ -d "$user_dir" ]; then
    USER_ID=$(basename "$user_dir")
    ACTUAL_SIZE=$(du -sb "$user_dir" | cut -f1)
    echo "User: $USER_ID, Size: $ACTUAL_SIZE bytes"

    # Could update database here or send alerts
  fi
done
```

### Cron Job
```bash
# Add to crontab -e
# Run storage audit every 6 hours
0 */6 * * * /usr/local/bin/check-storage-quotas.sh >> /var/log/storage-audit.log 2>&1
```

---

## Part 6: Frontend Integration

### React Components Needed
1. **FileUploader.tsx** - Drag & drop upload component
2. **UploadProgress.tsx** - Show upload progress
3. **StorageIndicator.tsx** - Real storage display (replace current placeholder)
4. **FileManager.tsx** - Enhanced MediaCard with real data
5. **StorageWarning.tsx** - Alert when nearing quota

---

## Part 7: Security Considerations

### File Upload Security
1. **File type validation**: Only allow specified mime types
2. **File size limits**: Max 2GB per file (configurable)
3. **Virus scanning**: Optional ClamAV integration
4. **Sanitize filenames**: Remove special characters, prevent path traversal
5. **User authentication**: Verify Clerk session on every request
6. **CORS configuration**: Restrict to your domain
7. **Rate limiting**: Prevent abuse

### File Access Security
1. **Private storage**: Files not directly accessible via web
2. **Signed URLs**: Generate temporary download links
3. **User isolation**: Verify user owns file before serving
4. **No directory listing**: Disable directory browsing

---

## Part 8: Scaling Considerations

### Current Setup (Single VPS)
- **Suitable for**: <1000 users
- **Max capacity**: Depends on volume size (Hetzner allows up to 10TB volumes)
- **Backup**: Hetzner volume snapshots

### Future Scaling Options
1. **Object Storage (S3-compatible)**
   - Migrate to Hetzner Object Storage or AWS S3
   - Unlimited scalability
   - Better for >1000 users

2. **CDN Integration**
   - CloudFlare or BunnyCDN
   - Faster file delivery
   - Reduced server load

3. **Multiple VPS**
   - Load balancer + multiple storage nodes
   - For >10,000 users

---

## Part 9: Backup Strategy

### Automated Backups
```bash
#!/bin/bash
# /usr/local/bin/backup-user-storage.sh

BACKUP_DIR="/mnt/backups/user-storage"
STORAGE_DIR="/mnt/user-storage/users"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/user-storage-$DATE.tar.gz" "$STORAGE_DIR"

# Keep only last 7 days
find "$BACKUP_DIR" -name "user-storage-*.tar.gz" -mtime +7 -delete

# Optional: Upload to remote storage
# rclone copy "$BACKUP_DIR/user-storage-$DATE.tar.gz" remote:backups/
```

### Cron for Daily Backups
```bash
# Daily backup at 3 AM
0 3 * * * /usr/local/bin/backup-user-storage.sh >> /var/log/backups.log 2>&1
```

---

## Part 10: Cost Estimation

### Hetzner Volume Pricing (as of 2024)
- **Volume Storage**: €0.056 per GB/month
- **10GB per user**: €0.56/month per user
- **100GB volume**: €5.60/month (supports 10 users)
- **1TB volume**: €56/month (supports 100 users)

### Recommended Approach
1. Start with **200GB volume** (~€11/month) for first 20 users
2. Scale up volume as users grow (Hetzner allows online resizing)
3. Monitor usage and add volumes as needed
4. Pass cost to users via subscription pricing

---

## Next Steps

1. ✅ **Set up Hetzner volume** on current VPS
2. ✅ **Create database tables** (PostgreSQL recommended)
3. ✅ **Build API backend** with file upload endpoints
4. ✅ **Implement storage tracking** service
5. ✅ **Create upload UI** components
6. ✅ **Test with real files** and verify storage calculations
7. ✅ **Set up backups** and monitoring
8. ✅ **Deploy to production** with proper security

---

## Testing Checklist

- [ ] Upload video file (<1GB)
- [ ] Upload image file (<10MB)
- [ ] Verify storage calculation updates
- [ ] Verify storage bar shows correct percentage
- [ ] Try uploading when at quota (should fail)
- [ ] Delete file and verify storage decreases
- [ ] Download file
- [ ] Verify file is only accessible by owner
- [ ] Test thumbnail generation for videos
- [ ] Test concurrent uploads
- [ ] Test network interruption during upload
- [ ] Verify database triggers work correctly
