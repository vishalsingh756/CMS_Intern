# MERN CMS - Deployment Guide

## Quick Start Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and connected
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] Security settings reviewed
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring set up

## Production Deployment Steps

### 1. Database Setup

#### MongoDB Atlas (Cloud)
```
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Configure network access
5. Get connection string
6. Add to environment variables
```

#### Self-Hosted MongoDB
```bash
# Installation on Ubuntu
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install mongodb-org
sudo systemctl start mongod
```

### 2. Backend Deployment Options

#### Option A: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-cms-app

# Set environment variables
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set JWT_SECRET="generate_random_secret"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-frontend.com"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option B: DigitalOcean App Platform

```bash
# Install doctl
brew install doctl

# Configure doctl
doctl auth init

# Create app.yaml in root directory
# Deploy
doctl apps create --spec app.yaml
```

#### Option C: AWS EC2

```bash
# Connect to instance
ssh -i key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd your-repo/backend

# Install dependencies
npm install

# Create .env file
sudo nano .env

# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name "cms-backend"

# Enable startup
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure Nginx to proxy to localhost:5000
```

### 3. Frontend Deployment Options

#### Option A: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod

# Configure in netlify.toml
```

#### Option C: AWS S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Create S3 bucket
aws s3 mb s3://your-cms-frontend

# Upload files
aws s3 sync dist/ s3://your-cms-frontend

# Create CloudFront distribution
# Point to S3 bucket
```

### 4. Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### 5. SSL/HTTPS Setup

#### Using Let's Encrypt on Ubuntu

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

#### On Heroku
- Automatic SSL provided

#### On Vercel
- Automatic SSL provided

### 6. Performance Optimization

#### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Implement caching
const redis = require('redis');
const client = redis.createClient();

// Database indexing
// Already implemented in models
```

#### Frontend
```bash
# Build optimization
npm run build

# Analyze bundle
npm install webpack-bundle-analyzer
```

### 7. Monitoring & Logging

#### Application Monitoring (Sentry)
```bash
# Backend
npm install @sentry/node
npm install @sentry/tracing
```

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-sentry-dsn" });
app.use(Sentry.Handlers.errorHandler());
```

#### Logging (Winston)
```bash
npm install winston
```

```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 8. Backup & Recovery

#### MongoDB Backup

```bash
# Create backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/cms_db" --out ./backup

# Restore from backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/cms_db" ./backup
```

#### Automated Backups

```bash
# Create backup script (backup.sh)
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
mongodump --uri="your_uri" --out "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"

# Schedule with cron
0 2 * * * /scripts/backup.sh
```

### 9. Environment Variables (Production)

```
# Backend .env.production
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/cms_db_prod
JWT_SECRET=your_very_long_and_secure_secret_key_minimum_32_characters
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 10. Performance Benchmarks

Expected performance targets:
- **API Response Time**: < 200ms (p95)
- **Frontend Load Time**: < 2s (first contentful paint)
- **Database Query Time**: < 100ms

Monitor with:
- Google Lighthouse
- Postman collections
- Browser DevTools
- Backend logs

### 11. Scaling Recommendations

For increasing traffic:

1. **Database**: Implement read replicas, sharding
2. **Backend**: Use load balancer (nginx, HAProxy)
3. **Frontend**: Use CDN (CloudFlare, CloudFront)
4. **Caching**: Implement Redis for session/data caching
5. **Storage**: Use S3/GCS for media files
6. **Monitoring**: Use APM tools (New Relic, DataDog)

### 12. Post-Deployment Checklist

- [ ] Test all critical features
- [ ] Verify SSL certificate
- [ ] Check database backups
- [ ] Monitor error logs
- [ ] Test email functionality (if implemented)
- [ ] Verify file uploads work
- [ ] Check performance metrics
- [ ] Test on different browsers/devices
- [ ] Verify search functionality
- [ ] Test comment moderation

## Troubleshooting Deployment Issues

### Application not starting
```bash
# Check logs
pm2 logs

# Verify environment variables
env | grep NODE_ENV

# Check port availability
netstat -tuln | grep 5000
```

### Database connection issues
```bash
# Test connection string
mongosh "your_connection_string"

# Check network access whitelist
# MongoDB Atlas dashboard -> Network Access
```

### High memory usage
```bash
# Monitor
pm2 monit

# Restart with memory limit
pm2 start app.js --max-memory-restart 1G
```

### 502 Bad Gateway
- Check if backend is running
- Verify network connectivity
- Check load balancer configuration
- Review application logs

## Maintenance & Updates

### Regular Tasks

```bash
# Weekly
npm audit
npm update

# Monthly
Create database backup
Review error logs
Analyze performance metrics

# Quarterly
Security audit
Dependency updates
Performance optimization review
```

## Support

For deployment issues:
1. Check logs: `pm2 logs` or service provider's dashboard
2. Verify configuration files
3. Test locally with same environment
4. Review error messages carefully
5. Check documentation for service provider
