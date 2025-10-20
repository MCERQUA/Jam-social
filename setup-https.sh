#!/bin/bash

##############################################
# HTTPS Setup Script for Jam Social API
# Run with: sudo bash setup-https.sh
##############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="api.jamsocial.app"
BACKEND_PORT="3007"
EMAIL="mikecerqua@gmail.com"
PROJECT_DIR="/mnt/HC_Volume_103321268/isolated-projects/Jam-social"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Jam Social API - HTTPS Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Please run as root (sudo bash setup-https.sh)${NC}"
    exit 1
fi

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Error: nginx is not installed${NC}"
    echo "Install with: sudo apt update && sudo apt install nginx -y"
    exit 1
fi
echo -e "${GREEN}✓ nginx is installed${NC}"

# Check if backend is running
if ! netstat -tuln | grep -q ":${BACKEND_PORT}"; then
    echo -e "${YELLOW}Warning: Backend doesn't appear to be running on port ${BACKEND_PORT}${NC}"
    echo "Make sure your backend is running before continuing"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ Backend is running on port ${BACKEND_PORT}${NC}"
fi

# Step 2: Install certbot if needed
echo -e "\n${YELLOW}Step 2: Installing certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt update
    apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✓ certbot installed${NC}"
else
    echo -e "${GREEN}✓ certbot already installed${NC}"
fi

# Step 3: Create nginx configuration
echo -e "\n${YELLOW}Step 3: Creating nginx configuration...${NC}"

# Backup existing config if it exists
if [ -f "/etc/nginx/sites-available/${DOMAIN}" ]; then
    cp "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-available/${DOMAIN}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "Backed up existing configuration"
fi

# Create nginx config
cat > "/etc/nginx/sites-available/${DOMAIN}" <<EOF
# Jam Social API - HTTP (temporary, for SSL certificate generation)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Root directory (needed for certbot verification)
    root /var/www/html;

    # Allow certbot verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files \$uri =404;
    }

    # Proxy all other requests to backend
    location / {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:${BACKEND_PORT}/health;
        access_log off;
    }
}
EOF

echo -e "${GREEN}✓ nginx configuration created${NC}"

# Step 4: Enable the site
echo -e "\n${YELLOW}Step 4: Enabling site...${NC}"

# Create symlink if it doesn't exist
if [ ! -L "/etc/nginx/sites-enabled/${DOMAIN}" ]; then
    ln -s "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/"
    echo -e "${GREEN}✓ Site enabled${NC}"
else
    echo -e "${GREEN}✓ Site already enabled${NC}"
fi

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: nginx configuration test failed${NC}"
    exit 1
fi

# Reload nginx
echo "Reloading nginx..."
systemctl reload nginx
echo -e "${GREEN}✓ nginx reloaded${NC}"

# Step 5: DNS Check
echo -e "\n${YELLOW}Step 5: Checking DNS configuration...${NC}"
echo "Checking if ${DOMAIN} points to this server..."

SERVER_IP=$(hostname -I | awk '{print $1}')
DOMAIN_IP=$(dig +short ${DOMAIN} | tail -n1)

if [ -z "$DOMAIN_IP" ]; then
    echo -e "${RED}Warning: ${DOMAIN} does not resolve to any IP${NC}"
    echo "Please add DNS A record:"
    echo "  Type: A"
    echo "  Name: api"
    echo "  Value: ${SERVER_IP}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
elif [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo -e "${YELLOW}Warning: ${DOMAIN} points to ${DOMAIN_IP}, but this server is ${SERVER_IP}${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ DNS is correctly configured${NC}"
fi

# Step 6: Obtain SSL certificate
echo -e "\n${YELLOW}Step 6: Obtaining SSL certificate...${NC}"
echo -e "${YELLOW}Note: You need to update EMAIL variable in this script first!${NC}"
echo "Email for Let's Encrypt notifications: ${EMAIL}"

if [ "$EMAIL" == "your-email@example.com" ]; then
    echo -e "${RED}Error: Please edit this script and set a valid email address${NC}"
    exit 1
fi

read -p "Proceed with certbot? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping SSL certificate generation"
    echo "Run manually with:"
    echo "  sudo certbot --nginx -d ${DOMAIN} --email ${EMAIL} --agree-tos --no-eff-email"
    exit 0
fi

# Run certbot
certbot --nginx -d ${DOMAIN} --email ${EMAIL} --agree-tos --no-eff-email --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate obtained and installed${NC}"
else
    echo -e "${RED}Error: Failed to obtain SSL certificate${NC}"
    echo "You may need to run certbot manually"
    exit 1
fi

# Step 7: Final verification
echo -e "\n${YELLOW}Step 7: Final verification...${NC}"

# Test HTTPS endpoint
sleep 2
if curl -sf https://${DOMAIN}/health > /dev/null; then
    echo -e "${GREEN}✓ HTTPS endpoint is working!${NC}"
    curl -s https://${DOMAIN}/health | jq . || curl -s https://${DOMAIN}/health
else
    echo -e "${YELLOW}Warning: Could not verify HTTPS endpoint${NC}"
fi

# Step 8: Next steps
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Update Netlify configuration:"
echo "   cd ${PROJECT_DIR}"
echo "   Edit netlify.toml and change:"
echo "   to = \"https://${DOMAIN}/api/:splat\""
echo ""
echo "2. Test the API:"
echo "   curl https://${DOMAIN}/health"
echo ""
echo "3. Update CORS if needed:"
echo "   cd ${PROJECT_DIR}/server"
echo "   Edit .env and ensure CORS_ORIGIN includes:"
echo "   CORS_ORIGIN=http://localhost:4321,https://jamsocial.app"
echo ""
echo "4. Set up PM2 for production:"
echo "   cd ${PROJECT_DIR}/server"
echo "   pm2 start src/server.js --name jam-api"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "5. Monitor SSL certificate renewal:"
echo "   sudo certbot renew --dry-run"
echo ""
echo -e "${GREEN}Your API is now accessible at: https://${DOMAIN}${NC}"
echo ""
