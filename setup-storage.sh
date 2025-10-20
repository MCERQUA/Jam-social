#!/bin/bash

# Jam Social Media - Storage System Setup Script
# Run this script as root or with sudo

set -e  # Exit on error

echo "========================================="
echo "Jam Social Media - Storage Setup"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root or with sudo${NC}"
  exit 1
fi

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
  echo "FFmpeg not found. Installing..."
  apt update && apt install -y ffmpeg
else
  echo -e "${GREEN}✓ FFmpeg is installed${NC}"
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
  echo "PostgreSQL not found. Installing..."
  apt update && apt install -y postgresql postgresql-contrib
else
  echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Please install Node.js 18+ first${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Node.js is installed ($(node --version))${NC}"
fi

# Step 2: Set up storage directory
echo ""
echo -e "${YELLOW}Step 2: Setting up storage directory...${NC}"

read -p "Enter mount point path [/mnt/user-storage]: " MOUNT_POINT
MOUNT_POINT=${MOUNT_POINT:-/mnt/user-storage}

if [ ! -d "$MOUNT_POINT" ]; then
  mkdir -p "$MOUNT_POINT/users"
  echo -e "${GREEN}✓ Created directory: $MOUNT_POINT/users${NC}"
else
  echo -e "${GREEN}✓ Directory exists: $MOUNT_POINT${NC}"
fi

# Set permissions
chmod 755 "$MOUNT_POINT"
chown -R $(logname):$(logname) "$MOUNT_POINT/users" 2>/dev/null || true
echo -e "${GREEN}✓ Permissions set${NC}"

# Step 3: Database setup
echo ""
echo -e "${YELLOW}Step 3: Setting up database...${NC}"

read -p "Database name [jamsocial]: " DB_NAME
DB_NAME=${DB_NAME:-jamsocial}

read -p "Database user [jamapp]: " DB_USER
DB_USER=${DB_USER:-jamapp}

read -sp "Database password: " DB_PASS
echo ""

# Start PostgreSQL if not running
systemctl start postgresql 2>/dev/null || true

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

echo -e "${GREEN}✓ Database created${NC}"

# Run schema
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/database/schema.sql" ]; then
  sudo -u postgres psql $DB_NAME < "$SCRIPT_DIR/database/schema.sql"
  echo -e "${GREEN}✓ Database schema applied${NC}"
else
  echo -e "${YELLOW}! Schema file not found. Please run manually:${NC}"
  echo "  sudo -u postgres psql $DB_NAME < database/schema.sql"
fi

# Step 4: Configure server environment
echo ""
echo -e "${YELLOW}Step 4: Configuring server...${NC}"

if [ -d "$SCRIPT_DIR/server" ]; then
  cd "$SCRIPT_DIR/server"

  if [ ! -f ".env" ]; then
    cp .env.example .env

    # Update .env with actual values
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME|" .env
    sed -i "s|USER_STORAGE_ROOT=.*|USER_STORAGE_ROOT=$MOUNT_POINT/users|" .env

    echo -e "${GREEN}✓ Environment file created${NC}"
    echo -e "${YELLOW}! Please edit server/.env and add your CLERK_SECRET_KEY${NC}"
  else
    echo -e "${GREEN}✓ Environment file exists${NC}"
  fi

  # Install dependencies
  echo "Installing server dependencies..."
  npm install
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo -e "${RED}✗ Server directory not found${NC}"
fi

# Step 5: PM2 setup (optional)
echo ""
read -p "Install PM2 for production? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm install -g pm2
  echo -e "${GREEN}✓ PM2 installed${NC}"
fi

# Summary
echo ""
echo "========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your CLERK_SECRET_KEY"
echo "2. Start the server:"
echo "   cd server && npm run dev"
echo ""
echo "Or with PM2:"
echo "   cd server && pm2 start src/server.js --name jam-api"
echo ""
echo "Documentation:"
echo "  - QUICK_START.md - Quick start guide"
echo "  - STORAGE_SETUP_GUIDE.md - Detailed setup"
echo "  - IMPLEMENTATION_SUMMARY.md - Complete overview"
echo ""
echo "Test the server:"
echo "  curl http://localhost:3001/health"
echo ""
