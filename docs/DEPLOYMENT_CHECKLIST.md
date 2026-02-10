# COAI Dashboard - Production Deployment Checklist

## Quick Reference for Deployment

### Pre-Deployment (15 minutes)

- [ ] **Code Review**
  - [ ] All changes reviewed and approved
  - [ ] No uncommitted changes
  - [ ] Git history is clean

- [ ] **Environment Setup**
  - [ ] DATABASE_URL is set and valid
  - [ ] JWT_SECRET is set
  - [ ] NODE_ENV=production
  - [ ] All required env vars configured

- [ ] **Backups**
  - [ ] Code backup created
  - [ ] Database backup created
  - [ ] Backup location documented
  - [ ] Backup restoration tested

### Build & Test (20 minutes)

- [ ] **Dependencies**
  - [ ] `pnpm install --frozen-lockfile` completed
  - [ ] No dependency conflicts
  - [ ] Lock file is up to date

- [ ] **Type Safety**
  - [ ] `pnpm tsc --noEmit` passes with 0 errors
  - [ ] No TypeScript warnings
  - [ ] All imports resolved

- [ ] **Unit Tests**
  - [ ] `pnpm test` passes
  - [ ] All test suites passing
  - [ ] No skipped tests in critical paths
  - [ ] Coverage > 80%

- [ ] **E2E Tests** (Optional)
  - [ ] `pnpm exec playwright test` passes
  - [ ] All critical flows tested
  - [ ] No flaky tests

- [ ] **Build**
  - [ ] `pnpm build` completes successfully
  - [ ] No build warnings
  - [ ] Build artifacts generated
  - [ ] Build size is reasonable

### Database (10 minutes)

- [ ] **Connection**
  - [ ] Database connection verified
  - [ ] Connection pool configured
  - [ ] SSL/TLS enabled (if required)

- [ ] **Migrations**
  - [ ] `pnpm db:push` completes
  - [ ] No migration errors
  - [ ] Schema is up to date
  - [ ] Data integrity verified

### Deployment (5 minutes)

- [ ] **Code Push**
  - [ ] All changes committed
  - [ ] Commit message is descriptive
  - [ ] Code pushed to main branch
  - [ ] CI/CD pipeline passes

- [ ] **Manus Deployment**
  - [ ] Open Management UI
  - [ ] Click "Publish" button
  - [ ] Select production environment
  - [ ] Confirm deployment
  - [ ] Wait for deployment to complete

### Verification (10 minutes)

- [ ] **Health Checks**
  - [ ] API endpoint responds
  - [ ] Database connection healthy
  - [ ] All services running
  - [ ] No error logs

- [ ] **Fix Verification**
  - [ ] Authentication fixes working
  - [ ] Session management operational
  - [ ] Database pooling active
  - [ ] Retry logic functional

- [ ] **Critical Flows**
  - [ ] User login works
  - [ ] API requests succeed
  - [ ] Database queries execute
  - [ ] Error handling active

### Post-Deployment (Ongoing)

- [ ] **Immediate (5 min)**
  - [ ] Check Sentry dashboard
  - [ ] Monitor error rate
  - [ ] Check application logs
  - [ ] Verify response times

- [ ] **Short-term (24 hours)**
  - [ ] Monitor error trends
  - [ ] Check performance metrics
  - [ ] Review user feedback
  - [ ] Verify all features working

- [ ] **Long-term (1 week)**
  - [ ] Analyze deployment impact
  - [ ] Review Sentry reports
  - [ ] Check performance trends
  - [ ] Update documentation

---

## Deployment Commands

### Step-by-Step Commands

```bash
# 1. Navigate to project
cd /home/ubuntu/coai-dashboard

# 2. Create backup
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
tar -czf backups/$(date +%Y%m%d_%H%M%S)/backup.tar.gz \
  --exclude=node_modules --exclude=.git --exclude=dist .

# 3. Install dependencies
pnpm install --frozen-lockfile

# 4. Type check
pnpm tsc --noEmit

# 5. Run tests
pnpm test

# 6. Build
pnpm build

# 7. Database migrations
pnpm db:push

# 8. Deploy via Manus UI
# (Click Publish button in Management UI)

# 9. Verify deployment
curl -s https://your-domain.com/api/health | jq .
```

### Automated Deployment

```bash
# Run automated deployment script
chmod +x DEPLOYMENT_SCRIPT.sh
./DEPLOYMENT_SCRIPT.sh --dry-run  # Test
./DEPLOYMENT_SCRIPT.sh            # Deploy
```

---

## Rollback Commands

### Quick Rollback

```bash
# 1. Stop deployment in Manus UI
# 2. Restore from backup
tar -xzf backups/LATEST/backup.tar.gz
# 3. Redeploy
# (Click Publish in Manus UI)
```

### Full Rollback

```bash
# Use Manus checkpoint rollback:
# 1. Open Management UI → Dashboard
# 2. Find previous checkpoint
# 3. Click "Rollback"
# 4. Confirm
```

---

## Monitoring Dashboard

### Key Metrics to Watch

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Error Rate | < 1% | > 5% |
| Response Time (p95) | < 500ms | > 1s |
| Database Latency | < 100ms | > 500ms |
| Uptime | > 99.9% | < 99.5% |
| Active Connections | < 8 | > 10 |

### Monitoring URLs

- **Sentry**: https://sentry.io/organizations/coai
- **Manus Dashboard**: Management UI
- **Database Health**: `/api/db-health`
- **API Health**: `/api/health`

---

## Contact & Support

- **Deployment Issues**: Check DEPLOYMENT_GUIDE.md
- **Sentry Errors**: Review SENTRY_DETAILED_FIXES.md
- **Code Questions**: Review source code documentation
- **Emergency Rollback**: Use Manus checkpoint rollback

---

## Deployment Record

| Date | Time | Status | Deployed By | Notes |
|------|------|--------|-------------|-------|
| | | | | |

---

## Sign-Off

- [ ] Deployment Manager: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______
- [ ] DevOps Lead: _________________ Date: _______

---

**Last Updated**: [Current Date]  
**Version**: 1.0  
**Status**: Ready for Production
