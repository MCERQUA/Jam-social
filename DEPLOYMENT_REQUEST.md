# HTTPS Deployment Request for Jam Social API

## Request Date
October 20, 2025

## Project
Jam Social Media Storage API

## Current Status
- **Backend API**: Running on HTTP port 3007
- **Issue**: Netlify requires HTTPS for backend proxy connections
- **Impact**: Dashboard cannot connect to API (504 Gateway Timeout)

## Required Setup

### 1. Domain/Subdomain
**Requested domain**: `api.jamsocial.app`

**Alternative options**:
- `backend.jamsocial.app`
- `storage.jamsocial.app`
- Or any subdomain you prefer

### 2. SSL/TLS Certificate
**Requirement**: Valid SSL certificate (Let's Encrypt recommended)

### 3. Nginx Reverse Proxy Configuration

**Requested nginx configuration**:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.jamsocial.app;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.jamsocial.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.jamsocial.app/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to backend API
    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3007/health;
        access_log off;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name api.jamsocial.app;

    return 301 https://$server_name$request_uri;
}
```

### 4. Firewall Rules
**Required ports**:
- Port 80 (HTTP - for Let's Encrypt verification & redirect)
- Port 443 (HTTPS - for API traffic)
- Port 3007 (internal - already open)

### 5. DNS Configuration
**Required DNS record**:
```
Type: A
Name: api
Value: 178.156.181.117
TTL: 300 (or default)
```

## Backend Configuration

### Current Setup
- **Port**: 3007
- **Binding**: All interfaces (0.0.0.0:3007)
- **Protocol**: HTTP only
- **Status**: Running and functional

### No Changes Required
The backend application is ready and doesn't need modifications. It will continue running on port 3007 (HTTP), and nginx will handle SSL termination.

## Testing After Setup

### 1. Test HTTPS endpoint:
```bash
curl https://api.jamsocial.app/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-20T...",
  "uptime": 123.45
}
```

### 2. Test API with authentication:
```bash
curl -H "Authorization: Bearer <CLERK_TOKEN>" \
     https://api.jamsocial.app/api/storage/usage
```

### 3. Verify Netlify integration:
- Update `netlify.toml` to use HTTPS endpoint
- Test dashboard at https://jamsocial.app/dashboard/
- Verify file uploads, storage display, etc.

## Priority
**HIGH** - Application is non-functional without HTTPS

The frontend is deployed and ready, but cannot communicate with the backend due to Netlify's HTTPS requirement for proxy targets.

## Project Details
- **Project Path**: `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/`
- **Backend Port**: 3007
- **Process Manager**: Running via nodemon (dev) - will need PM2 for production
- **Database**: PostgreSQL (koolfoam) - already configured

## Post-Deployment Tasks

After HTTPS is set up, I will:
1. Update `netlify.toml` to point to `https://api.jamsocial.app`
2. Update CORS settings if needed
3. Test all API endpoints
4. Set up PM2 for production process management
5. Configure log rotation

## Contact
This is an isolated project under development. Once HTTPS is configured, the application will be fully functional.

---

## Alternative Solutions (If HTTPS Setup Delayed)

### Option 1: Cloudflare Tunnel
Could use Cloudflare Tunnel (cloudflared) to expose the HTTP backend with HTTPS, no nginx changes needed.

### Option 2: Self-Hosted HTTPS
Could run Node.js HTTPS server directly (requires access to port 443 and Let's Encrypt setup).

### Option 3: ngrok/LocalTunnel (Temporary)
For testing only - not suitable for production.

Please advise on preferred approach for HTTPS setup.
