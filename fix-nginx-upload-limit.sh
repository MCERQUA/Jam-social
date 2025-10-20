#!/bin/bash

##############################################
# Fix nginx Upload Size Limit
# Run with: sudo bash fix-nginx-upload-limit.sh
##############################################

set -e  # Exit on error

echo "========================================="
echo "Fixing nginx Upload Size Limit"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Error: Please run as root (sudo bash fix-nginx-upload-limit.sh)"
    exit 1
fi

DOMAIN="api.jamsocial.app"
CONFIG_FILE="/etc/nginx/sites-available/${DOMAIN}"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: nginx config file not found: $CONFIG_FILE"
    exit 1
fi

echo "Updating nginx configuration..."

# Backup the config
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Created backup: ${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Add client_max_body_size to the server block
# This allows uploads up to 120MB (matching the backend MAX_FILE_SIZE)
sed -i '/server_name api.jamsocial.app;/a\    \n    # Allow large file uploads (120MB max)\n    client_max_body_size 120M;' "$CONFIG_FILE"

echo "✅ Updated nginx configuration to allow 120MB uploads"
echo ""

echo "Testing nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ nginx configuration test failed!"
    echo "Restoring backup..."
    cp "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)" "$CONFIG_FILE"
    exit 1
fi

echo "✅ nginx configuration test passed"
echo ""

echo "Reloading nginx..."
systemctl reload nginx

echo "✅ nginx reloaded"
echo ""

echo "========================================="
echo "✅ Upload Limit Fixed!"
echo "========================================="
echo ""
echo "Current configuration:"
grep -A 2 "client_max_body_size" "$CONFIG_FILE" || echo "client_max_body_size setting added successfully"
echo ""
echo "You can now upload files up to 120MB in size!"
echo ""
echo "Test by uploading a file at: https://jamsocial.app/dashboard/"
echo ""
