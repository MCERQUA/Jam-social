# HTTPS Setup Guide for Jam Social API

## Quick Start

### Step 1: Update Email in Script
Edit `setup-https.sh` and change this line:
```bash
EMAIL="your-email@example.com"  # UPDATE THIS!
```

To your actual email:
```bash
EMAIL="your@email.com"
```

### Step 2: Ensure DNS is Configured
Before running the script, make sure you've added the DNS A record:

**DNS Record**:
- **Type**: A
- **Name**: api
- **Value**: 178.156.181.117
- **TTL**: 300 (or default)

Check DNS propagation:
```bash
dig +short api.jamsocial.app
# Should return: 178.156.181.117
```

### Step 3: Run Setup Script
```bash
cd /mnt/HC_Volume_103321268/isolated-projects/Jam-social
sudo bash setup-https.sh
```

The script will:
1. Check that nginx and backend are running
2. Install certbot if needed
3. Create nginx configuration for api.jamsocial.app
4. Enable the site
5. Verify DNS configuration
6. Obtain SSL certificate from Let's Encrypt
7. Configure HTTPS redirect
8. Test the setup

### Step 4: Update Netlify Configuration
After HTTPS is set up, update the Netlify proxy:

Edit `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://api.jamsocial.app/api/:splat"  # Changed from http to https
  status = 200
  force = true
```

Then deploy to Netlify:
```bash
git add netlify.toml
git commit -m "Update API proxy to use HTTPS"
git push origin main
```

Netlify will auto-deploy the changes.

### Step 5: Test Everything

1. **Test HTTPS endpoint directly**:
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

2. **Test through Netlify**:
   ```bash
   curl https://jamsocial.app/api/health
   ```

   Should return the same response (proxied through Netlify).

3. **Test the dashboard**:
   - Open https://jamsocial.app/dashboard/
   - Should load without 504 errors
   - Should show storage usage and file list

## Troubleshooting

### Certificate Generation Fails

If certbot fails with "Unable to find a virtual host":
```bash
# Manually specify the nginx config
sudo certbot --nginx \
  --cert-name api.jamsocial.app \
  -d api.jamsocial.app \
  --nginx-server-root /etc/nginx/sites-available/api.jamsocial.app
```

### DNS Not Propagating

If DNS hasn't propagated yet:
```bash
# Use DNS challenge instead of HTTP challenge
sudo certbot certonly --manual \
  --preferred-challenges dns \
  -d api.jamsocial.app \
  --email your@email.com
```

Then manually update nginx to use the certificate.

### Port 80/443 Already in Use

Check what's using the ports:
```bash
sudo netstat -tuln | grep -E ":(80|443)"
sudo lsof -i :80
sudo lsof -i :443
```

If another service is using port 80/443, you'll need to stop it first.

### Backend Not Accessible

Verify backend is running:
```bash
curl http://localhost:3007/health
```

If not running:
```bash
cd /mnt/HC_Volume_103321268/isolated-projects/Jam-social/server
npm run dev
```

### Testing nginx Configuration

Test configuration syntax:
```bash
sudo nginx -t
```

View current configuration:
```bash
sudo cat /etc/nginx/sites-available/api.jamsocial.app
```

Reload nginx:
```bash
sudo systemctl reload nginx
```

View nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

## SSL Certificate Renewal

Certbot automatically renews certificates. Test automatic renewal:
```bash
sudo certbot renew --dry-run
```

To manually renew:
```bash
sudo certbot renew
```

## Production Deployment

### Set up PM2 for Process Management

After HTTPS is working, set up PM2 for production:

```bash
cd /mnt/HC_Volume_103321268/isolated-projects/Jam-social/server

# Stop nodemon (development)
# Press Ctrl+C or kill the process

# Start with PM2
pm2 start src/server.js --name jam-api

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the command it gives you (will be a sudo command)

# Monitor the app
pm2 logs jam-api
pm2 monit
```

### Monitor the Application

```bash
# View logs
pm2 logs jam-api

# Check status
pm2 status

# Restart if needed
pm2 restart jam-api

# View detailed info
pm2 info jam-api
```

## Security Considerations

### Firewall Configuration

If you have UFW enabled, allow HTTPS:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### CORS Configuration

Verify CORS is set correctly in `server/.env`:
```env
CORS_ORIGIN=http://localhost:4321,https://jamsocial.app
```

### Rate Limiting

The backend already has rate limiting configured (100 requests per 15 minutes). Adjust if needed in `server/.env`:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Rollback Procedure

If something goes wrong, rollback:

1. **Disable the nginx site**:
   ```bash
   sudo rm /etc/nginx/sites-enabled/api.jamsocial.app
   sudo systemctl reload nginx
   ```

2. **Restore backup**:
   ```bash
   sudo cp /etc/nginx/sites-available/api.jamsocial.app.backup.YYYYMMDD_HHMMSS \
           /etc/nginx/sites-available/api.jamsocial.app
   ```

3. **Revert Netlify config** (git revert the netlify.toml change)

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

**Need Help?**

Check the deployment request document:
- `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/DEPLOYMENT_REQUEST.md`

View this guide:
- `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/HTTPS-SETUP-GUIDE.md`
