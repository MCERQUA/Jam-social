# Quick Start Guide - File Storage System

## Prerequisites

- PostgreSQL database (installed and running)
- Node.js 18+
- Hetzner VPS with volume attached
- FFmpeg installed (for video thumbnails)

## Step 1: Set up Hetzner Volume

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Create mount point
mkdir -p /mnt/user-storage/users

# Find your volume ID
ls -la /dev/disk/by-id/ | grep HC_Volume

# Mount the volume (replace XXXXX with your volume ID)
mount /dev/disk/by-id/scsi-0HC_Volume_XXXXX /mnt/user-storage

# Add to /etc/fstab for auto-mount
echo '/dev/disk/by-id/scsi-0HC_Volume_XXXXX /mnt/user-storage ext4 defaults 0 0' >> /etc/fstab

# Set permissions
chmod 755 /mnt/user-storage
```

## Step 2: Install Dependencies

```bash
# Install FFmpeg (for video processing)
sudo apt update
sudo apt install ffmpeg -y

# Verify installation
ffmpeg -version

# Install PostgreSQL if not already installed
sudo apt install postgresql postgresql-contrib -y
```

## Step 3: Set up Database

```bash
# Create database
sudo -u postgres createdb jamsocial

# Create user and grant privileges
sudo -u postgres psql -c "CREATE USER jamapp WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jamsocial TO jamapp;"

# Run schema
cd /mnt/HC_Volume_103321268/isolated-projects/Jam-social
sudo -u postgres psql jamsocial < database/schema.sql
```

## Step 4: Configure Environment

```bash
# Copy environment example
cd server
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Required variables:**
```env
DATABASE_URL=postgresql://jamapp:your_secure_password@localhost:5432/jamsocial
USER_STORAGE_ROOT=/mnt/user-storage/users
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Step 5: Install and Start Server

```bash
# Install dependencies
cd server
npm install

# Start development server
npm run dev

# OR start production server
npm start
```

## Step 6: Set up PM2 (Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start src/server.js --name jam-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# View logs
pm2 logs jam-api
```

## Step 7: Test the API

```bash
# Health check
curl http://localhost:3001/health

# Should return: {"success":true,"status":"healthy",...}
```

## Step 8: Update Frontend

Add the API URL to your Astro project's .env:

```env
PUBLIC_API_URL=http://localhost:3001/api
# Or for production:
PUBLIC_API_URL=https://api.jamsocial.app/api
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
sudo -u postgres psql -l | grep jamsocial

# Test connection
psql postgresql://jamapp:password@localhost:5432/jamsocial -c "SELECT NOW();"
```

### Storage Permission Issues

```bash
# Check mount point
df -h | grep user-storage

# Fix permissions
sudo chmod -R 755 /mnt/user-storage
sudo chown -R $USER:$USER /mnt/user-storage
```

### FFmpeg Not Found

```bash
# Install FFmpeg
sudo apt update
sudo apt install ffmpeg -y

# Verify
which ffmpeg
```

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Set strong CLERK_SECRET_KEY
- [ ] Configure firewall to allow only necessary ports
- [ ] Use HTTPS in production
- [ ] Set up automated backups
- [ ] Enable rate limiting
- [ ] Configure CORS for your domain only

## Next Steps

1. ✅ Test file upload from dashboard
2. ✅ Verify storage calculations
3. ✅ Set up SSL certificate (Let's Encrypt)
4. ✅ Configure nginx as reverse proxy
5. ✅ Set up automated backups
6. ✅ Monitor disk usage

## Common Commands

```bash
# View server logs
pm2 logs jam-api

# Restart server
pm2 restart jam-api

# Check disk usage
du -sh /mnt/user-storage/users/*

# Database backup
pg_dump jamsocial > backup_$(date +%Y%m%d).sql

# Restore database
psql jamsocial < backup_20241020.sql
```
