# CSOAI Dashboard Troubleshooting Guide

**Version:** 1.0  
**Last Updated:** January 2026

---

## Common Issues and Solutions

### Authentication Issues

#### Problem: "Invalid or expired token"

**Symptoms:**
- 401 Unauthorized errors
- Redirected to login page unexpectedly

**Solutions:**
1. Clear browser cookies and local storage
2. Log out and log back in
3. Check if JWT_SECRET environment variable is set correctly
4. Verify token expiration settings

```bash
# Check JWT configuration
echo $JWT_SECRET | wc -c  # Should be at least 32 characters
```

#### Problem: OAuth login fails

**Symptoms:**
- Redirect loop during login
- "Authentication failed" message

**Solutions:**
1. Verify OAUTH_SERVER_URL is correct
2. Check callback URL configuration
3. Ensure cookies are enabled in browser

---

### Database Issues

#### Problem: "Connection refused" to database

**Symptoms:**
- Application won't start
- 500 errors on all API calls

**Solutions:**
1. Verify DATABASE_URL format:
```bash
# Correct format
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

2. Test connection manually:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

3. Check firewall rules allow port 5432

#### Problem: "Relation does not exist"

**Symptoms:**
- Errors mentioning missing tables
- Database queries fail

**Solutions:**
1. Run database migrations:
```bash
pnpm db:push
```

2. Check migration status:
```bash
pnpm db:studio  # Opens Drizzle Studio
```

#### Problem: Slow database queries

**Symptoms:**
- Pages load slowly
- Timeouts on data-heavy pages

**Solutions:**
1. Check for missing indexes:
```sql
EXPLAIN ANALYZE SELECT * FROM your_query;
```

2. Add recommended indexes:
```bash
# Run index optimization script
node server/utils/dbIndexOptimization.ts
```

3. Enable query caching

---

### Email Issues

#### Problem: Emails not sending

**Symptoms:**
- No confirmation emails
- Notification emails missing

**Solutions:**
1. Verify RESEND_API_KEY is set
2. Check Resend dashboard for errors
3. Verify sender domain is configured

```bash
# Test email sending
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"from":"test@yourdomain.com","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

#### Problem: Emails going to spam

**Solutions:**
1. Configure SPF records
2. Set up DKIM signing
3. Add DMARC policy
4. Use verified sending domain

---

### Payment Issues

#### Problem: Stripe webhook failures

**Symptoms:**
- Payments not recorded
- Subscription status not updating

**Solutions:**
1. Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
2. Check webhook endpoint is accessible:
```bash
curl -X POST https://your-domain.com/api/stripe/webhook
```

3. Review Stripe webhook logs in dashboard

#### Problem: "Invalid API key"

**Solutions:**
1. Verify using correct key type (test vs live)
2. Check STRIPE_SECRET_KEY is set
3. Ensure no extra whitespace in key

---

### WebSocket Issues

#### Problem: Real-time updates not working

**Symptoms:**
- Council voting doesn't update live
- Notifications don't appear

**Solutions:**
1. Check WebSocket connection in browser console:
```javascript
// In browser console
new WebSocket('wss://your-domain.com/ws')
```

2. Verify nginx WebSocket configuration:
```nginx
location /ws {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

3. Check for firewall blocking WebSocket ports

---

### Build Issues

#### Problem: TypeScript compilation errors

**Symptoms:**
- Build fails with type errors
- IDE shows many red underlines

**Solutions:**
1. Clear TypeScript cache:
```bash
rm -rf node_modules/.cache
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
pnpm install
```

3. Check TypeScript version compatibility

#### Problem: Out of memory during build

**Symptoms:**
- Build crashes with "JavaScript heap out of memory"

**Solutions:**
1. Increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

2. Close other memory-intensive applications

---

### Performance Issues

#### Problem: Slow page loads

**Symptoms:**
- Pages take >3 seconds to load
- High Time to First Byte (TTFB)

**Solutions:**
1. Enable caching:
```typescript
// Use query cache
import { queryCache } from './utils/queryCache';
```

2. Check database query performance
3. Enable CDN for static assets
4. Implement pagination for large datasets

#### Problem: High memory usage

**Symptoms:**
- Server memory keeps increasing
- Eventually crashes

**Solutions:**
1. Check for memory leaks:
```bash
node --inspect server/index.js
# Use Chrome DevTools to profile
```

2. Implement connection pooling
3. Clear unused caches periodically

---

### Deployment Issues

#### Problem: Application won't start in production

**Symptoms:**
- Server exits immediately
- No logs appear

**Solutions:**
1. Check all required environment variables are set
2. Verify build completed successfully:
```bash
ls -la dist/
```

3. Check for port conflicts:
```bash
lsof -i :3000
```

4. Review startup logs:
```bash
NODE_ENV=production node dist/server/index.js 2>&1 | head -100
```

#### Problem: SSL certificate issues

**Symptoms:**
- "Your connection is not private"
- Certificate errors

**Solutions:**
1. Verify certificate is valid:
```bash
openssl s_client -connect your-domain.com:443
```

2. Check certificate chain is complete
3. Renew if expired:
```bash
certbot renew
```

---

## Diagnostic Commands

### Health Check

```bash
# Check application health
curl https://your-domain.com/api/health

# Check database connection
curl https://your-domain.com/api/health/detailed
```

### Log Analysis

```bash
# View recent errors
grep -i error /var/log/csoai/*.log | tail -50

# Check for specific issues
grep -i "database\|connection\|timeout" /var/log/csoai/*.log
```

### Performance Check

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/

# Monitor real-time
watch -n 1 'curl -s https://your-domain.com/api/health'
```

---

## Getting Help

If you can't resolve an issue:

1. **Check Documentation:** https://docs.csoai.org
2. **Search Issues:** https://github.com/csoai/dashboard/issues
3. **Contact Support:** support@csoai.org
4. **Status Page:** https://status.csoai.org

When reporting issues, include:
- Error messages (full text)
- Steps to reproduce
- Environment details (OS, Node version)
- Relevant logs
