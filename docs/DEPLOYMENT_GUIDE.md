# CSOAI Dashboard Deployment Guide

**Version:** 1.0  
**Last Updated:** January 2026  
**Author:** CSOAI Development Team

---

## Overview

This guide covers the deployment process for the CSOAI Dashboard, including environment setup, database configuration, and production deployment best practices.

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- PostgreSQL 14+ database
- Redis (optional, for caching)
- Domain with SSL certificate
- Environment variables configured

---

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/csoai_db

# Authentication
JWT_SECRET=your-secure-jwt-secret-min-32-chars
OAUTH_SERVER_URL=https://auth.csoai.org

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx

# Sentry Error Tracking
SENTRY_DSN=https://xxxx@sentry.io/xxxx

# Application
VITE_APP_TITLE=CSOAI Dashboard
VITE_FRONTEND_URL=https://your-domain.com
```

---

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE csoai_db;
CREATE USER csoai_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE csoai_db TO csoai_user;
```

### 2. Run Migrations

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:push
```

### 3. Seed Initial Data (Optional)

```bash
pnpm db:seed
```

---

## Build Process

### Development Build

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Deployment Options

### Option 1: Manus Hosting (Recommended)

The CSOAI Dashboard is designed to work seamlessly with Manus hosting:

1. Create a checkpoint using `webdev_save_checkpoint`
2. Click the **Publish** button in the Management UI
3. Configure custom domain in Settings → Domains

### Option 2: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
# Build and run
docker build -t csoai-dashboard .
docker run -p 3000:3000 --env-file .env csoai-dashboard
```

### Option 3: Manual Server Deployment

```bash
# On your server
git clone https://github.com/your-org/csoai-dashboard.git
cd csoai-dashboard

# Install dependencies
pnpm install

# Build
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'csoai-dashboard',
    script: 'dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

---

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Health Checks

The application exposes health check endpoints:

```bash
# Basic health check
GET /api/health

# Detailed health check (authenticated)
GET /api/health/detailed
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-07T12:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "email": "configured"
  }
}
```

---

## Monitoring

### Sentry Integration

Error tracking is automatically configured when `SENTRY_DSN` is set:

```javascript
// Errors are automatically captured
Sentry.captureException(error);

// Custom events
Sentry.captureMessage('Custom event', 'info');
```

### Application Logs

Logs are output to stdout in JSON format:

```json
{
  "level": "info",
  "timestamp": "2026-01-07T12:00:00Z",
  "message": "Server started",
  "port": 3000
}
```

---

## Database Backups

### Automated Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
gzip backup_$DATE.sql

# Upload to S3 (optional)
aws s3 cp backup_$DATE.sql.gz s3://your-bucket/backups/
```

### Restore from Backup

```bash
gunzip backup_20260107_120000.sql.gz
psql $DATABASE_URL < backup_20260107_120000.sql
```

---

## Scaling Considerations

### Horizontal Scaling

1. Use a load balancer (nginx, HAProxy, or cloud LB)
2. Configure session storage in Redis
3. Use database connection pooling

### Database Connection Pooling

```javascript
// drizzle.config.ts
export default {
  connection: {
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum connections
    idleTimeoutMillis: 30000,
  }
};
```

---

## Security Checklist

- [ ] All environment variables are set
- [ ] Database uses SSL connection
- [ ] JWT secret is at least 32 characters
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Helmet.js security headers are active
- [ ] Input validation is in place
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens for forms

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check connection string
psql $DATABASE_URL

# Verify SSL mode
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules .next dist
pnpm install
pnpm build
```

**Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## Support

For deployment support:
- Documentation: https://docs.csoai.org
- Email: support@csoai.org
- Status: https://status.csoai.org
