# Deployment Guide

## Overview

This document outlines the deployment workflow, monitoring setup, and troubleshooting procedures for the DRQ Website.

## Deployment Pipeline

### Environments

1. **Development**
   - Local development environment
   - Branch-specific configurations
   - URL: `http://localhost:3002`

2. **Staging**
   - Pre-production testing environment
   - URL: `https://{branch-name}.staging.disasterrecoveryqld.au`
   - Automated deployments from staging branch

3. **Production**
   - Live production environment
   - URL: `https://disasterrecoveryqld.au`
   - Automated deployments from main branch

### Workflow

1. **Code Changes**
   ```bash
   # Create feature branch
   npm run branch:create

   # Make changes and commit
   git add .
   git commit -m "feat: description"

   # Push changes
   git push origin feature/name
   ```

2. **Pull Request**
   - Create PR to staging branch
   - Automated validation runs
   - Code review required
   - All checks must pass

3. **Staging Deployment**
   - Automated deployment to staging
   - E2E tests run
   - Performance tests run
   - Manual QA verification

4. **Production Deployment**
   - Merge staging to main
   - Automated deployment to production
   - Performance monitoring enabled
   - Error tracking activated

## Environment Variables

### Management
1. Development: `.env.development`
2. Staging: `.env.staging`
3. Production: `.env.production`

### Secure Storage
- Production secrets in Vercel Environment Variables
- API keys in GitHub Secrets
- Sensitive data in environment-specific vaults

## Monitoring Setup

### Performance Monitoring
1. **New Relic**
   - Real-time performance metrics
   - Error tracking
   - Transaction monitoring

2. **LogRocket**
   - Session replay
   - User experience monitoring
   - Error reproduction

3. **Sentry**
   - Error tracking
   - Performance monitoring
   - Release tracking

### Alerts and Notifications
1. **Slack Integration**
   - Deployment notifications
   - Error alerts
   - Performance degradation warnings

2. **Email Notifications**
   - Critical error alerts
   - Deployment status updates
   - Security notifications

## Performance Optimization

### Automated Checks
1. **Lighthouse CI**
   ```bash
   # Run performance audit
   npm run lighthouse

   # View reports
   npm run lighthouse:view
   ```

2. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npm run build:analyze
   ```

### Asset Optimization
1. **Image Optimization**
   - Automatic WebP conversion
   - Responsive images
   - Lazy loading

2. **Script Optimization**
   - Code splitting
   - Tree shaking
   - Route-based chunking

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and node_modules
   npm run clean:full

   # Reinstall dependencies
   npm install

   # Rebuild
   npm run build
   ```

2. **Deployment Failures**
   ```bash
   # Check deployment logs
   vercel logs

   # Roll back deployment
   vercel rollback
   ```

3. **Performance Issues**
   ```bash
   # Run performance audit
   npm run audit:performance

   # Check monitoring dashboards
   npm run monitor:dashboard
   ```

### Rollback Procedures

1. **Staging Rollback**
   ```bash
   # Revert to last stable deployment
   vercel rollback staging
   ```

2. **Production Rollback**
   ```bash
   # Revert to last stable deployment
   vercel rollback production
   ```

## Maintenance

### Regular Tasks

1. **Daily**
   - Monitor error rates
   - Check performance metrics
   - Review deployment logs

2. **Weekly**
   - Run security scans
   - Update dependencies
   - Review monitoring alerts

3. **Monthly**
   - Full performance audit
   - Security penetration testing
   - Backup verification

### Emergency Procedures

1. **Site Down**
   ```bash
   # Check status
   vercel status

   # View logs
   vercel logs

   # Emergency rollback
   vercel rollback --force
   ```

2. **Security Incident**
   - Activate incident response plan
   - Isolate affected systems
   - Deploy security patches

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Dependencies updated
- [ ] Security scan completed

### Deployment
- [ ] Backup current version
- [ ] Deploy to staging
- [ ] Run E2E tests
- [ ] Verify monitoring setup
- [ ] Check performance metrics

### Post-Deployment
- [ ] Verify all routes
- [ ] Check error rates
- [ ] Monitor performance
- [ ] Verify SSL/TLS
- [ ] Test backup systems

## Contact Information

### Development Team
- Lead Developer: [Name]
- DevOps Engineer: [Name]
- Security Lead: [Name]

### Emergency Contacts
- On-Call Support: [Phone]
- Security Team: [Email]
- Infrastructure Team: [Slack Channel]
