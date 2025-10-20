# CLAUDE.md - Jam Social Media Storage API

## 🎯 Project Overview

**Jam Social Media Storage API** - User media storage backend with FFmpeg processing for jamsocial.app

### Project Type
- **Isolated Project** (Located in `/mnt/HC_Volume_103321268/isolated-projects/`)
- **Environment**: Development/Staging (not yet in production)
- **Tech Stack**: Node.js, Express, PostgreSQL, FFmpeg, Clerk Authentication

## 🔌 Port Configuration

### ⚠️ CRITICAL: Port Assignment
- **Allocated Port**: `3007`
- **DO NOT USE**: Port 3001 (already in use on server)
- **Service Binding**: `127.0.0.1:3007` (localhost only)

**Why Port 3007?**
- Port 3001 was CONFLICTING with existing development server
- Port 3006 is reserved for LLM Router API
- Port 3007 is the first available safe port

### Testing the API
```bash
# Health check
curl http://localhost:3007/health

# Start server (development)
cd server && npm run dev

# Start with PM2 (production)
cd server && pm2 start src/server.js --name jam-api
```

## 🗄️ Database Configuration

### PostgreSQL Database
- **Database Name**: `koolfoam`
- **User**: `koolfoam`
- **Password**: (stored in `server/.env`)
- **Port**: 5432 (PostgreSQL default)
- **Connection**: `postgresql://koolfoam:password@localhost:5432/koolfoam`

### Database Schema
```sql
-- Tables
- user_files        # File metadata and storage tracking
- user_storage      # Storage quota tracking per user

-- Functions
- calculate_user_storage()  # Calculates total storage per user
- update_user_storage()     # Triggered on file changes
```

### Access Database
```bash
# Connect to database
psql -U koolfoam -d koolfoam

# View tables
\dt

# View user storage
SELECT * FROM user_storage;

# View files
SELECT * FROM user_files;
```

## 📁 Storage Configuration

### Storage Directory
- **Root**: `koolfoam/users/` (relative to project root)
- **Absolute Path**: `/home/mikecerqua/projects-extra-drive/isolated-projects/Jam-social/koolfoam/users/`
- **Structure**: `koolfoam/users/{userId}/{fileId}/{filename}`

### Storage Limits
- **Max per User**: 10 GB (configurable in `.env`)
- **Max File Size**: 2 GB (configurable in `.env`)
- **Temp Upload Dir**: `/tmp/jam-uploads`

### Supported File Types
- **Videos**: mp4, quicktime, avi, mkv
- **Images**: jpeg, png, gif, webp

## 🔧 Environment Configuration

### Required Environment Variables (`server/.env`)
```env
# Server
PORT=3007                     # ⚠️ MUST BE 3007
NODE_ENV=development

# Database
DATABASE_URL=postgresql://koolfoam:password@localhost:5432/koolfoam

# Storage
USER_STORAGE_ROOT=koolfoam/users
MAX_STORAGE_PER_USER=10737418240    # 10 GB
MAX_FILE_SIZE=2147483648            # 2 GB
TEMP_UPLOAD_DIR=/tmp/jam-uploads

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# CORS
CORS_ORIGIN=http://localhost:4321,https://jamsocial.app

# Security
RATE_LIMIT_WINDOW_MS=900000         # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Development Workflow

### First Time Setup
```bash
# 1. Run the setup script (already completed)
./setup-storage.sh

# 2. Configure environment
cd server
nano .env  # Add your CLERK_SECRET_KEY

# 3. Install dependencies (already done)
npm install

# 4. Start development server
npm run dev
```

### Development Commands
```bash
# Start dev server (with auto-reload)
npm run dev

# Start production server
npm start

# Run with PM2
pm2 start src/server.js --name jam-api
pm2 logs jam-api
pm2 restart jam-api
```

## 🌐 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint

### File Management
- `POST /upload` - Upload file (requires Clerk authentication)
- `GET /files` - List user's files
- `GET /files/:fileId` - Get specific file
- `DELETE /files/:fileId` - Delete file
- `GET /storage` - Get user's storage usage

### Streaming
- `GET /stream/:fileId` - Stream video file with range support

## 🔐 Authentication

### Clerk Integration
- All endpoints (except `/health`) require Clerk authentication
- User ID extracted from Clerk session
- JWT validation on every request

### Testing Authentication
```bash
# With valid Clerk token
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
     http://localhost:3007/files
```

## ⚠️ Isolation Constraints

### What You CAN Do
- ✅ Work within this project directory
- ✅ Use port 3007 (assigned)
- ✅ Access PostgreSQL database `koolfoam`
- ✅ Install npm packages locally
- ✅ Read system information
- ✅ Use FFmpeg for video processing

### What You CANNOT Do
- ❌ Use port 80/443 or other reserved ports
- ❌ Modify nginx configurations
- ❌ Restart system services (nginx, postgresql, docker)
- ❌ Install system packages with apt (FFmpeg already installed system-wide)
- ❌ Access files outside project directory
- ❌ Deploy to production domains without approval
- ❌ Modify firewall rules

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Check if port 3007 is in use
netstat -tuln | grep :3007

# If in use, find the process
lsof -i :3007

# Kill the process if needed (only your own processes!)
pkill -f "jam-api"
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Test connection
psql -U koolfoam -d koolfoam -c "SELECT 1;"
```

### Storage Permission Issues
```bash
# Ensure storage directory has correct permissions
chmod -R 755 koolfoam/users/
```

### FFmpeg Not Found
```bash
# Check FFmpeg installation
which ffmpeg
ffmpeg -version

# FFmpeg was installed system-wide during setup
# Location: /usr/bin/ffmpeg
```

## 📚 Documentation Files

- `README.md` - General project overview
- `QUICK_START.md` - Quick start guide
- `STORAGE_SETUP_GUIDE.md` - Detailed storage setup
- `IMPLEMENTATION_SUMMARY.md` - Complete technical overview
- `DASHBOARD_DESIGN_SPEC.md` - UI/UX specifications
- `LOGIN_DESIGN_SPECIFICATION.md` - Authentication flow

## 🔄 Deployment Checklist

### Before Production Deployment
- [ ] Update `CLERK_SECRET_KEY` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins for production domain
- [ ] Set up nginx reverse proxy (requires system admin)
- [ ] Configure SSL certificate (requires system admin)
- [ ] Set up PM2 for process management
- [ ] Configure log rotation
- [ ] Test rate limiting
- [ ] Verify storage quotas are enforced
- [ ] Test video streaming with large files

### Requesting Production Deployment
1. Create `DEPLOYMENT_REQUEST.md` in project root
2. Specify required domain: `api.jamsocial.app` (or other subdomain)
3. Confirm port: 3007
4. SSL required: Yes
5. Wait for system administrator approval

## 📊 Server Context

### This Server's Resources
- **Server**: mike-server (Hetzner VPS)
- **OS**: Ubuntu 24.04.3 LTS
- **Node.js**: v20.19.4
- **PostgreSQL**: 16.10
- **FFmpeg**: 7:6.1.1
- **Location**: `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/`

### Other Services on This Server
- Port 3001: Development server (DO NOT USE)
- Port 3003: DataStream Recorder
- Port 3006: LLM Router API (DO NOT USE)
- Port 4500-4501: Domain Manager
- Port 7100: Claude Code WebUI Backend
- Port 7200: DataStream Storage API
- Port 8500: Claude Code WebUI Frontend

### Disk Space Warning
- Main disk at **91% capacity** - Keep storage usage minimal
- Clean up old files and logs regularly
- Monitor storage with `df -h`

## 🔗 Related Projects

- **Frontend**: TBD (Astro/React app connecting to this API)
- **Authentication**: Clerk (clerk.com)
- **Deployment Target**: jamsocial.app

---

*Last Updated: October 20, 2025*
*Project Status: Development (Storage API ready, needs Clerk configuration)*
*Allocated Port: 3007*
*Database: koolfoam (PostgreSQL)*
