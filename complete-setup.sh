#!/bin/bash

##############################################
# Complete Setup for Jam Social API
# Fixes database permissions AND creates storage directories
# Run with: sudo bash complete-setup.sh
##############################################

set -e  # Exit on error

echo "========================================="
echo "Jam Social API - Complete Setup"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Error: Please run as root (sudo bash complete-setup.sh)"
    exit 1
fi

# Step 1: Fix database permissions
echo "Step 1: Fixing database permissions..."
sudo -u postgres psql -d koolfoam <<EOF
-- Grant all privileges on tables to koolfoam user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO koolfoam;

-- Grant all privileges on sequences to koolfoam user
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO koolfoam;

-- Grant execute on all functions to koolfoam user
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO koolfoam;

-- Make koolfoam owner of the tables (fixes future permission issues)
ALTER TABLE user_files OWNER TO koolfoam;
ALTER TABLE user_storage OWNER TO koolfoam;

-- Verify permissions
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\q
EOF

echo "✅ Database permissions fixed!"
echo ""

# Step 2: Create storage directory
echo "Step 2: Creating storage directory..."
mkdir -p /mnt/koolfoam/users
chown mikecerqua:mikecerqua /mnt/koolfoam/users
chmod 755 /mnt/koolfoam/users
echo "✅ Storage directory created: /mnt/koolfoam/users"
echo ""

# Step 3: Create temp upload directory
echo "Step 3: Creating temp upload directory..."
mkdir -p /tmp/jam-uploads
chown mikecerqua:mikecerqua /tmp/jam-uploads
chmod 755 /tmp/jam-uploads
echo "✅ Temp upload directory created: /tmp/jam-uploads"
echo ""

# Step 4: Verify setup
echo "Step 4: Verifying setup..."
echo ""

echo "Database connection test:"
PGPASSWORD='koolfoam2000$' psql -U koolfoam -d koolfoam -c "SELECT COUNT(*) as user_files_count FROM user_files; SELECT COUNT(*) as user_storage_count FROM user_storage;"
echo ""

echo "Storage directories:"
ls -la /mnt/koolfoam/
ls -la /tmp/ | grep jam-uploads
echo ""

echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Restart the API:"
echo "   pm2 restart jam-api"
echo ""
echo "2. Monitor logs:"
echo "   pm2 logs jam-api --lines 50"
echo ""
echo "3. Test upload functionality:"
echo "   Try uploading a file in the dashboard at https://jamsocial.app/dashboard/"
echo ""
echo "4. If issues persist, check logs for errors:"
echo "   pm2 logs jam-api --err --lines 100"
echo ""
