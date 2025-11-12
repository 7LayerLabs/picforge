# Post-Launch Monitoring Guide

**Version:** 1.0
**Last Updated:** October 23, 2025

---

## Overview

This guide outlines monitoring procedures, key metrics, alert thresholds, and response protocols for PicForge.com after launch.

**Monitoring Philosophy:** Proactive detection, rapid response, continuous improvement.

---

## Quick Reference

**Emergency Contacts:**
- Derek Bobola: derek.bobola@gmail.com
- Vercel Support: vercel.com/support
- Stripe Support: support@stripe.com

**Status Pages:**
- Vercel: vercel-status.com
- Stripe: status.stripe.com
- Resend: status.resend.com
- InstantDB: status.instantdb.com

---

## 1. Critical Metrics Dashboard

### 1.1 Application Health

Monitor every **5 minutes** (automated):

| Metric | Target | Alert Threshold | Action |
|--------|--------|----------------|--------|
| **Uptime** | 99.9% | <99.5% | Check Vercel logs |
| **Response Time** | <500ms | >1000ms | Investigate slow endpoints |
| **Error Rate** | <1% | >5% | Review error logs |
| **API Success Rate** | >95% | <90% | Check external APIs |

**Monitoring Tools:**
- Vercel Analytics (built-in)
- UptimeRobot (external ping)
- Custom health check: `/api/health`

---

### 1.2 User Engagement Metrics

Monitor every **hour** (GA4 Real-Time):

| Metric | Target (Day 1) | Target (Week 1) | Alert |
|--------|----------------|-----------------|-------|
| **Active Users** | 50+ | 500+ | <10 users for 2+ hours |
| **Bounce Rate** | <60% | <50% | >80% |
| **Avg Session Duration** | >3 min | >5 min | <1 min |
| **Images Transformed** | 200+ | 2000+ | <50/hour |

**Monitoring Tools:**
- GA4 Real-Time Dashboard
- GA4 Mobile App (for on-the-go monitoring)

---

### 1.3 Business Metrics

Monitor every **day** (morning check-in):

| Metric | Target (Day 1) | Target (Week 1) | Alert |
|--------|----------------|-----------------|-------|
| **New Signups** | 50+ | 500+ | <10/day |
| **Free → Pro Conversion** | 2%+ | 5%+ | <1% |
| **Daily Revenue** | $50+ | $500+ | $0 (no conversions) |
| **Churn Rate** | N/A | <5% | >10% |

**Monitoring Tools:**
- Stripe Dashboard (Revenue)
- InstantDB Dashboard (Signups)
- Custom analytics dashboard (if built)

---

### 1.4 Infrastructure Costs

Monitor every **day** (morning check-in):

| Service | Budget (Day 1) | Budget (Month 1) | Alert |
|---------|----------------|------------------|-------|
| **Gemini API** | <$50 | <$1000 | >$100/day |
| **Replicate API** | <$20 | <$500 | >$50/day |
| **Vercel Hosting** | Free tier | <$100 | Bandwidth limit |
| **Resend Emails** | Free tier | <$50 | >3000 emails/day |
| **InstantDB** | Free tier | Free tier | Usage warning |

**Monitoring Tools:**
- `npm run monitor:costs` (custom script)
- Vercel Usage Dashboard
- Stripe API logs

---

## 2. Rate Limiting Health

### 2.1 Rate Limit Metrics

Monitor every **hour**:

| Metric | Normal Range | Alert Threshold |
|--------|--------------|----------------|
| **Rate Limit Hits** | 10-50/hour | >100/hour |
| **Unique IPs Blocked** | 5-20/day | >50/day |
| **Bypass Attempts** | 0 | >1 |

**Check:**
```bash
# Get today's rate limit hits
curl https://picforge.com/api/rate-limit-stats
```

**Red Flags:**
- Single IP hitting limit repeatedly → Potential bot/scraper
- Many IPs hitting limit → May need to increase free tier limit
- Zero rate limit hits → Rate limiting may be broken

---

## 3. Payment & Webhook Health

### 3.1 Stripe Webhook Monitoring

Monitor every **15 minutes** (Stripe Dashboard):

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| **Webhook Success Rate** | 100% | <95% |
| **Webhook Response Time** | <5s | >10s |
| **Failed Webhooks** | 0 | >5/hour |

**Alert Response:**
1. Check Stripe webhook logs for error details
2. Verify `/api/webhooks/stripe` is reachable
3. Test webhook signature validation
4. Manually retry failed webhooks if needed

---

### 3.2 Payment Metrics

Monitor every **day**:

| Metric | Target | Alert |
|--------|--------|-------|
| **Successful Payments** | 90%+ | <80% |
| **Failed Payments** | <10% | >20% |
| **Declined Cards** | <5% | >15% |

**Common Decline Reasons:**
- Insufficient funds (customer issue)
- Expired card (customer issue)
- Security block (contact Stripe)

---

## 4. Email Delivery Health

### 4.1 Resend Metrics

Monitor every **day** (Resend Dashboard):

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| **Delivery Rate** | >95% | <90% |
| **Bounce Rate** | <2% | >5% |
| **Spam Complaints** | <0.1% | >1% |
| **Unsubscribe Rate** | <2% | >5% |

**Email Types to Monitor:**
- Welcome email (on signup) - expect 100% delivery
- Rate limit warning - expect 95%+ delivery
- Daily limit reached - expect 95%+ delivery
- Pro upgrade confirmation - expect 100% delivery

**Alert Response:**
1. Check Resend logs for bounce/block reasons
2. Verify email templates don't trigger spam filters
3. Review email content for spammy keywords
4. Check domain reputation (senderscore.org)

---

## 5. Analytics Tracking Health

### 5.1 GA4 Event Tracking

Monitor every **day**:

| Event | Expected Volume (Day 1) | Alert If |
|-------|-------------------------|----------|
| `page_view` | 500+ | <100 |
| `image_transform` | 200+ | <50 |
| `sign_up` | 50+ | <10 |
| `purchase` | 2+ | 0 (if traffic exists) |

**Check GA4 DebugView:**
- Events firing correctly
- Parameters populated
- User properties tracked

**Common Issues:**
- GA4 not loading → Check Measurement ID
- Events not firing → Check consent banner
- Parameters missing → Check event code

---

## 6. Database & Auth Health

### 6.1 InstantDB Monitoring

Monitor every **hour**:

| Metric | Normal Range | Alert Threshold |
|--------|--------------|----------------|
| **Read Operations** | 1000+/hour | Quota warning |
| **Write Operations** | 100+/hour | Quota warning |
| **Auth Failures** | <1% | >5% |

**Check InstantDB Dashboard:**
- User signup rate
- Active sessions
- Error logs
- Storage usage

**Alert Response:**
- High read/write → Optimize queries, add caching
- Auth failures → Check magic link delivery
- Storage warning → Clean up old data

---

## 7. Error Monitoring

### 7.1 Error Types & Thresholds

| Error Type | Severity | Alert Threshold | Response Time |
|------------|----------|----------------|---------------|
| **500 Internal Server Error** | Critical | >5/hour | Immediate |
| **429 Rate Limit Exceeded** | Medium | >100/hour | 1 hour |
| **401 Unauthorized** | Low | >50/hour | 24 hours |
| **API Timeouts** | High | >10/hour | 2 hours |

**Error Monitoring Tools:**
- Vercel Logs (Functions tab)
- Browser Console (for client errors)
- Sentry (if integrated)

**Error Response Protocol:**
1. **Immediate (Critical Errors):**
   - Check Vercel deployment status
   - Review recent code changes
   - Rollback if necessary

2. **Within 1 Hour (High Priority):**
   - Investigate error logs
   - Reproduce issue locally
   - Deploy hotfix if needed

3. **Within 24 Hours (Medium/Low Priority):**
   - Create GitHub issue
   - Schedule fix in next sprint
   - Monitor for escalation

---

## 8. Performance Monitoring

### 8.1 Core Web Vitals

Monitor every **week** (Vercel Analytics):

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| **First Contentful Paint (FCP)** | <1.5s | >2.5s |
| **Largest Contentful Paint (LCP)** | <2.5s | >4.0s |
| **Cumulative Layout Shift (CLS)** | <0.1 | >0.25 |
| **First Input Delay (FID)** | <100ms | >300ms |

**Monitoring Tools:**
- Vercel Analytics → Speed Insights
- Google PageSpeed Insights (weekly manual check)
- Chrome DevTools Lighthouse (monthly audit)

**Alert Response:**
- Slow LCP → Optimize images, lazy loading
- High CLS → Add dimensions to images/ads
- High FID → Reduce JavaScript execution time

---

## 9. User Feedback Monitoring

### 9.1 Support Channels

Monitor every **4 hours**:

| Channel | Response Time Target | Escalation |
|---------|---------------------|------------|
| **Email** (derek.bobola@gmail.com) | <4 hours | Critical: immediate |
| **Social Media** (if active) | <2 hours | Public complaints |
| **Showcase Comments** | Daily review | Spam/abuse |

**Common Issues to Watch For:**
- "Images not processing" → Check Gemini API
- "Can't log in" → Check InstantDB auth
- "Payment failed" → Check Stripe logs
- "Rate limit too low" → Consider increasing free tier

---

## 10. Security Monitoring

### 10.1 Security Alerts

Monitor every **day**:

| Alert Type | Severity | Response Time |
|------------|----------|---------------|
| **Unusual API traffic** | High | 1 hour |
| **Failed auth attempts** | Medium | 24 hours |
| **DDoS indicators** | Critical | Immediate |
| **Suspicious promo code redemptions** | Medium | 24 hours |

**Security Checks:**
- Review InstantDB audit logs
- Check Vercel access logs for suspicious IPs
- Monitor rate limit bypass attempts
- Review promo code redemption patterns

**Incident Response:**
1. **Identify threat** (bot, scraper, attacker)
2. **Block offending IPs** (Vercel Firewall)
3. **Review damage** (data leaked? costs incurred?)
4. **Strengthen defenses** (stricter rate limits, CAPTCHA)
5. **Document incident** (for future reference)

---

## 11. Monitoring Schedule

### Daily Check-In (30 minutes - 9 AM)

**Morning Routine:**
1. [ ] Check Vercel deployment status (uptime, errors)
2. [ ] Review GA4 Real-Time dashboard (active users, top events)
3. [ ] Check Stripe dashboard (new subscriptions, revenue)
4. [ ] Run cost monitoring: `npm run monitor:costs`
5. [ ] Check email inbox for support requests
6. [ ] Review Resend dashboard (email delivery)
7. [ ] Scan Vercel logs for errors (past 24 hours)

**Red Flags (requires immediate action):**
- Uptime <99%
- Zero new signups
- Payment webhook failures
- API costs >$100/day

---

### Weekly Review (1 hour - Monday Morning)

**Week in Review:**
1. [ ] GA4 full dashboard review:
   - User acquisition sources
   - Top pages/features
   - Conversion funnel
   - Drop-off points
2. [ ] Stripe revenue report:
   - Total revenue
   - New subscriptions
   - Cancellations
   - Average customer lifetime value
3. [ ] Performance audit (Lighthouse):
   - Desktop & mobile scores
   - Core Web Vitals
4. [ ] Cost analysis:
   - Total weekly costs
   - Cost per user
   - Cost per conversion
   - Profitability check
5. [ ] User feedback review:
   - Common complaints
   - Feature requests
   - Bug reports
6. [ ] Security review:
   - Unusual activity
   - Rate limit abuse
   - Failed auth attempts

**Deliverable:** Weekly summary report (email to Derek)

---

### Monthly Review (2 hours - 1st of Month)

**Month in Review:**
1. [ ] Business metrics:
   - Total signups
   - Free → Pro conversion rate
   - Monthly recurring revenue (MRR)
   - Churn rate
2. [ ] Infrastructure review:
   - Vercel usage (bandwidth, functions)
   - API costs vs budget
   - Database storage
3. [ ] Performance trends:
   - Core Web Vitals over time
   - Page load times
   - API response times
4. [ ] User retention:
   - 30-day retention rate
   - Average session frequency
   - Power user identification
5. [ ] Feature usage analysis:
   - Most popular prompts
   - Roulette vs Editor usage
   - Batch processor adoption
6. [ ] Security audit:
   - Run `npm run security-audit`
   - Review access logs
   - Update dependencies

**Deliverable:** Monthly report + roadmap updates

---

## 12. Alert Configuration

### 12.1 Email Alerts

Set up automated email alerts for:

**Critical (Immediate):**
- Uptime <99% for >5 minutes
- Error rate >10% for >5 minutes
- Payment webhook failures >5 in 1 hour
- API costs >$100/day

**High Priority (Within 1 Hour):**
- Response time >2s for >15 minutes
- Rate limit hits >100/hour
- Email delivery rate <90%

**Medium Priority (Daily Digest):**
- New signups <10/day
- Zero conversions for 24 hours
- Performance degradation >20%

**Setup:**
- Vercel: Integrations → Notifications
- Stripe: Settings → Webhooks → Alerts
- Custom: Add to monitoring script

---

### 12.2 SMS Alerts (Optional)

For critical issues only:
- Downtime >5 minutes
- Security breach detected
- API costs >$500/day

**Setup:** Use Twilio or similar service

---

## 13. Rollback Procedures

### 13.1 Emergency Rollback

**When to Rollback:**
- Critical bug affecting all users
- Security vulnerability
- Data corruption risk

**Rollback Steps:**
1. [ ] Identify last stable commit: `git log`
2. [ ] Revert to previous version: `git revert HEAD` or `git checkout [commit-hash]`
3. [ ] Deploy to production: `git push origin main --force`
4. [ ] Clear Vercel cache
5. [ ] Monitor for 15 minutes
6. [ ] Notify users (status page, email)

**Rollback Time Target:** <10 minutes

---

### 13.2 Database Rollback (InstantDB)

**If data corruption occurs:**
1. Contact InstantDB support immediately
2. Request point-in-time restore
3. Verify data integrity
4. Notify affected users

---

## 14. Incident Response Template

### Incident Log

**Date:** _______________
**Time:** _______________
**Severity:** Critical / High / Medium / Low

**Issue Description:**
_____________________________________________________________

**Impact:**
- Users affected: _____
- Services down: _____
- Revenue impact: $_____

**Timeline:**
- Issue detected: _____
- Investigation started: _____
- Root cause identified: _____
- Fix deployed: _____
- Issue resolved: _____

**Root Cause:**
_____________________________________________________________

**Resolution:**
_____________________________________________________________

**Preventive Measures:**
_____________________________________________________________

**Lessons Learned:**
_____________________________________________________________

---

## 15. Dashboard URLs

**Quick Access Links:**

| Service | URL | Purpose |
|---------|-----|---------|
| **Vercel Dashboard** | vercel.com/dashboard | Deployments, logs, analytics |
| **GA4 Real-Time** | analytics.google.com | Live user activity |
| **Stripe Dashboard** | dashboard.stripe.com | Payments, subscriptions |
| **Resend Dashboard** | resend.com/emails | Email delivery |
| **InstantDB Dashboard** | instantdb.com/dash | User data, auth |
| **UptimeRobot** | uptimerobot.com/dashboard | Uptime monitoring |

**Save these as browser bookmarks for quick access!**

---

## 16. Monitoring Automation

### 16.1 Cron Jobs (Vercel Cron)

Set up automated checks:

```typescript
// /api/cron/health-check.ts
// Runs every 5 minutes
export async function GET() {
  // Check health endpoints
  // Log metrics to Vercel KV
  // Send alerts if thresholds exceeded
}
```

```typescript
// /api/cron/daily-report.ts
// Runs every day at 9 AM
export async function GET() {
  // Compile daily metrics
  // Email report to Derek
}
```

---

### 16.2 Monitoring Scripts (package.json)

Add to `package.json`:

```json
{
  "scripts": {
    "monitor:costs": "tsx scripts/monitor-costs.ts",
    "monitor:health": "tsx scripts/health-check.ts",
    "test:rate-limiting": "tsx scripts/test-rate-limiting.ts"
  }
}
```

**Run daily:**
- `npm run monitor:costs` (morning check-in)
- `npm run monitor:health` (any time)

---

## 17. Success Metrics (First 30 Days)

**Targets:**

| Metric | Week 1 | Week 2 | Week 3 | Week 4 |
|--------|--------|--------|--------|--------|
| **Total Users** | 500 | 1,000 | 2,000 | 4,000 |
| **Pro Subscribers** | 10 | 30 | 75 | 150 |
| **MRR** | $100 | $300 | $750 | $1,500 |
| **Daily Active Users** | 100 | 250 | 500 | 1,000 |
| **Uptime** | 99.9% | 99.9% | 99.9% | 99.9% |

**If Underperforming:**
- Review marketing efforts
- Analyze user drop-off points
- Test pricing changes
- Add viral features

---

## 18. Contact Escalation

**Level 1 - Derek (Self-Monitoring):**
- Daily check-ins
- Weekly reviews
- Minor bug fixes

**Level 2 - External Support:**
- Vercel support (infrastructure issues)
- Stripe support (payment issues)
- InstantDB support (database issues)

**Level 3 - Expert Consultation:**
- Performance optimization specialist
- Security audit firm
- Legal counsel (if data breach)

---

## Monitoring Checklist Summary

**Daily (30 min):**
- [ ] Vercel uptime & errors
- [ ] GA4 active users
- [ ] Stripe revenue
- [ ] Cost monitoring
- [ ] Email inbox
- [ ] Resend delivery

**Weekly (1 hour):**
- [ ] Full GA4 review
- [ ] Revenue analysis
- [ ] Performance audit
- [ ] Cost analysis
- [ ] User feedback
- [ ] Security check

**Monthly (2 hours):**
- [ ] Business metrics
- [ ] Infrastructure review
- [ ] Retention analysis
- [ ] Feature usage
- [ ] Security audit
- [ ] Roadmap update

---

**Remember:** Monitoring is not just about catching problems—it's about understanding user behavior, optimizing costs, and continuously improving the product.

**Good luck with the launch, Derek! 🚀**
