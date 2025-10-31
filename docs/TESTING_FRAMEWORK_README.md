# PicForge Testing Framework

**Version:** 1.0
**Created:** October 23, 2025
**Purpose:** Comprehensive testing framework for PicForge.com launch readiness

---

## Overview

This testing framework ensures PicForge.com is secure, performant, and ready for public launch. It consists of automated tests, manual checklists, and monitoring tools.

---

## Quick Start

### 1. Run All Automated Tests

```bash
# Environment validation
npm run check-env

# Security audit
npm run security-audit

# Rate limiting tests
npm run test:rate-limiting

# Email delivery tests
npm run test:emails

# Performance tests
npm run test:performance

# Cost monitoring
npm run monitor:costs
```

### 2. Complete Manual Checklists

- [ ] `scripts/test-payment-flow.md` - Stripe checkout testing
- [ ] `scripts/test-analytics.md` - GA4 event tracking
- [ ] `scripts/test-full-user-journey.md` - End-to-end user flow
- [ ] `docs/BROWSER_TESTING.md` - Cross-browser compatibility

### 3. Review Master Checklist

- [ ] `docs/LAUNCH_CHECKLIST.md` - Complete launch readiness

---

## Testing Scripts

### Automated Tests

#### 1. Rate Limiting Test
**File:** `scripts/test-rate-limiting.ts`
**Command:** `npm run test:rate-limiting`
**Duration:** 5-10 minutes

**Tests:**
- 500 requests/day per IP limit enforced
- Request 501 returns 429 error
- Different IPs have independent limits
- Rate limit headers correct
- TTL expires after 24 hours
- Vercel KV connection working

**Pass Criteria:** All 6 tests pass

---

#### 2. Email Testing
**File:** `scripts/test-emails.ts`
**Command:** `npm run test:emails`
**Duration:** 2-3 minutes

**Tests:**
- Welcome email sends
- Rate limit warning email sends
- Daily limit reached email sends
- Pro upgrade confirmation email sends

**Pass Criteria:** All 4 emails delivered successfully

**Note:** Update `TEST_EMAIL` variable in script to your email address.

---

#### 3. Security Audit
**File:** `scripts/security-audit.ts`
**Command:** `npm run security-audit`
**Duration:** 2-3 minutes

**Tests:**
- Environment variables configured
- No exposed secrets in client code
- API routes authenticated
- CORS properly configured
- XSS vulnerabilities checked
- File upload validation
- Admin access restricted

**Pass Criteria:** Zero critical vulnerabilities

---

#### 4. Performance Test
**File:** `scripts/test-performance.ts`
**Command:** `npm run test:performance`
**Duration:** 5-10 minutes (Lighthouse scan can take 30-60 seconds)

**Tests:**
- Bundle size < 500KB
- Lighthouse scores (Performance, A11y, Best Practices, SEO)
- API response times < 500ms
- Image processing speed
- Build time

**Pass Criteria:** Performance score 90%+

**Requirements:**
- Lighthouse CLI installed: `npm install -g lighthouse`
- Production build exists: `npm run build`

---

#### 5. Cost Monitoring
**File:** `scripts/monitor-costs.ts`
**Command:** `npm run monitor:costs`
**Duration:** 1-2 minutes

**Features:**
- Daily cost breakdown (Gemini, Replicate, OpenAI, Vercel, Resend)
- 7-day cost history
- Projected monthly costs
- Cost optimization recommendations
- CSV export: `npm run monitor:costs -- --export`

**Pass Criteria:** Daily costs within budget ($100/day threshold)

---

### Manual Checklists

#### 1. Payment Flow Testing
**File:** `scripts/test-payment-flow.md`
**Duration:** 30-45 minutes

**Steps:**
1. Create Free user account
2. Trigger rate limit (20 images)
3. Initiate Stripe checkout
4. Complete test payment
5. Verify webhook received
6. Verify tier upgrade to Pro
7. Test unlimited access
8. Test subscription cancellation

**Pass Criteria:** 24/24 tests pass

**Requirements:**
- Stripe Test Mode enabled
- Webhook configured
- Test email account

---

#### 2. Analytics Testing
**File:** `scripts/test-analytics.md`
**Duration:** 45-60 minutes

**Steps:**
1. Verify GA4 configuration
2. Enable DebugView
3. Test page view tracking
4. Test cookie consent
5. Test all custom events (image_transform, purchase, etc.)
6. Verify Real-Time dashboard
7. Test opt-out functionality

**Pass Criteria:** 21/21 tests pass

**Requirements:**
- GA4 access
- Chrome browser with GA4 Debugger extension

---

#### 3. Full User Journey
**File:** `scripts/test-full-user-journey.md`
**Duration:** 60-90 minutes

**Steps:**
1. First visit & cookie consent
2. Sign up with magic link
3. First image transformation
4. Try multiple features (Roulette, Roast, etc.)
5. Approach rate limit (15 images)
6. Hit rate limit (20 images)
7. Upgrade to Pro via Stripe
8. Verify Pro tier benefits
9. Test unlimited access
10. Test subscription management
11. Test session persistence
12. Verify all analytics events

**Pass Criteria:** 12/12 steps pass

**Requirements:**
- Production environment
- GA4 DebugView access
- Stripe Test Mode
- Resend dashboard access
- InstantDB dashboard access

---

#### 4. Cross-Browser Testing
**File:** `docs/BROWSER_TESTING.md`
**Duration:** 2-3 hours

**Browsers:**
- Chrome (desktop + mobile)
- Firefox (desktop)
- Safari (desktop + iOS + iPad)
- Edge (desktop)

**Tests:**
- Core features (upload, transform, download)
- Touch interactions (mobile)
- Responsive design (5 breakpoints)
- Keyboard navigation
- Screen reader compatibility

**Pass Criteria:** All major browsers pass

---

## Documentation

### Master Launch Checklist
**File:** `docs/LAUNCH_CHECKLIST.md`

Complete pre-launch checklist with 10 phases:
1. Pre-Launch Security Checks
2. Integration Testing
3. Feature Testing
4. Performance & Optimization
5. Legal & Compliance
6. Monitoring & Observability
7. Full User Journey Test
8. Go/No-Go Decision
9. Launch Day Checklist
10. Post-Launch Review

**Use this as your master checklist - don't skip any critical items!**

---

### Post-Launch Monitoring
**File:** `docs/MONITORING.md`

Comprehensive monitoring guide covering:
- Critical metrics dashboard
- Rate limiting health
- Payment & webhook health
- Email delivery health
- Analytics tracking health
- Database & auth health
- Error monitoring
- Performance monitoring
- Security monitoring
- Daily/weekly/monthly review schedule
- Alert configuration
- Incident response procedures

**Use this for ongoing operational monitoring after launch.**

---

### Browser Testing Checklist
**File:** `docs/BROWSER_TESTING.md`

Detailed cross-browser testing checklist with:
- Test matrix (Chrome, Firefox, Safari, Edge)
- Core features to test per browser
- Mobile-specific tests (iOS Safari, Samsung Internet)
- Accessibility testing (keyboard, screen reader, contrast)
- Responsive breakpoints (320px - 2560px)
- Performance benchmarks per browser

---

### Launch Sign-Off Template
**File:** `docs/LAUNCH_SIGN_OFF_TEMPLATE.md`

Final sign-off document covering:
- Security verification summary
- Integration testing results
- Performance metrics
- Cross-browser compatibility
- User journey test results
- Legal & compliance verification
- Cost & monitoring setup
- Critical issues log
- Go/No-Go decision
- Launch plan & rollback procedures

**Fill this out as you complete testing and use for final launch approval.**

---

## Testing Workflow

### Recommended Testing Order

#### Phase 1: Pre-Testing (30 minutes)
1. Run `npm run check-env` - Verify environment variables
2. Run `npm run build` - Create production build
3. Review `docs/LAUNCH_CHECKLIST.md` - Understand requirements

#### Phase 2: Automated Tests (30 minutes)
1. `npm run security-audit` - Must pass before proceeding
2. `npm run test:rate-limiting` - Verify rate limiting works
3. `npm run test:emails` - Test email delivery
4. `npm run test:performance` - Check performance benchmarks
5. `npm run monitor:costs` - Review cost projections

**Stop if any critical tests fail. Fix issues before continuing.**

#### Phase 3: Manual Integration Tests (3-4 hours)
1. Complete `scripts/test-payment-flow.md` (45 min)
2. Complete `scripts/test-analytics.md` (60 min)
3. Complete `scripts/test-full-user-journey.md` (90 min)

#### Phase 4: Browser Testing (2-3 hours)
1. Complete `docs/BROWSER_TESTING.md`
2. Test on real devices when possible
3. Document any browser-specific issues

#### Phase 5: Final Review (1 hour)
1. Review all test results
2. Document critical issues
3. Complete `docs/LAUNCH_SIGN_OFF_TEMPLATE.md`
4. Make Go/No-Go decision

**Total Testing Time:** 6-9 hours (spread over 2-3 days)

---

## Pass/Fail Criteria

### Critical Requirements (All Must Pass)

1. **Security Audit:** Zero critical vulnerabilities
2. **Rate Limiting:** All 6 tests pass
3. **Payment Flow:** 24/24 tests pass
4. **Email Delivery:** All 4 email templates delivered
5. **Analytics:** 21/21 events tracked correctly
6. **Performance:** Lighthouse score 90+ (all categories)
7. **User Journey:** 12/12 steps completed successfully
8. **Cross-Browser:** Chrome, Firefox, Safari, Edge all pass

**If any critical requirement fails, DO NOT LAUNCH until fixed.**

---

## Common Issues & Solutions

### Issue: Rate limiting tests fail
**Solution:**
- Check Vercel KV connection
- Verify KV environment variables
- Test KV manually: `kv.set('test', 'value')`

---

### Issue: Email tests fail
**Solution:**
- Verify Resend API key
- Check domain verification
- Review Resend dashboard for errors
- Test with personal email first

---

### Issue: Payment flow tests fail
**Solution:**
- Verify Stripe webhook configured
- Check webhook signature secret
- Test webhook manually from Stripe dashboard
- Review Stripe logs for errors

---

### Issue: Analytics events not tracked
**Solution:**
- Verify GA4 Measurement ID
- Check cookie consent accepted
- Disable ad blockers
- Use DebugView for real-time verification

---

### Issue: Performance tests fail
**Solution:**
- Optimize images (use WebP, lazy loading)
- Reduce bundle size (code splitting)
- Enable Vercel compression
- Review Next.js performance recommendations

---

## Environment Variables Required

All tests require these environment variables in `.env.local`:

```bash
# Required
GEMINI_API_KEY=your_gemini_key
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_INSTANT_APP_ID=your_instantdb_app_id

# Required for testing
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_read_token

# Required for email tests
RESEND_API_KEY=your_resend_key

# Required for payment tests
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Required for analytics tests
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional
OPENAI_API_KEY=your_openai_key
TOGETHER_API_KEY=your_together_key
```

---

## Test Reports

### Generated Reports

All tests generate JSON reports in the project root:

- `security-audit-report.json` - Security audit results
- `performance-report.json` - Performance test results
- `cost-report.json` - Daily cost breakdown
- `cost-history.csv` - 30-day cost history

**Save these reports for documentation and future reference.**

---

## Continuous Testing

### After Launch

**Daily:**
- Run `npm run monitor:costs` (9 AM)
- Check Vercel dashboard for errors
- Review GA4 Real-Time dashboard
- Monitor Stripe dashboard

**Weekly:**
- Run `npm run test:performance`
- Review analytics trends
- Check cost vs revenue
- Update monitoring dashboards

**Monthly:**
- Run `npm run security-audit`
- Full performance audit (Lighthouse)
- Review all integrations
- Update dependencies

---

## Support

**Issues with Testing Framework:**
- Review CLAUDE.md for project context
- Check individual script comments
- Consult documentation in `/docs/`

**Emergency Contact:**
- Derek Bobola: derek.bobola@gmail.com

---

## Version History

**v1.0 (October 23, 2025)**
- Initial testing framework
- All automated tests created
- Manual checklists completed
- Documentation finalized

---

## License

Internal use only - PicForge.com testing framework.

---

**Ready to launch? Follow the testing workflow above and complete all checklists. Good luck! 🚀**
