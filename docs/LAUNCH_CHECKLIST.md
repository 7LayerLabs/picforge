# PicForge.com Launch Checklist

**Version:** 1.0
**Last Updated:** October 23, 2025
**Status:** Pre-Launch Testing Phase

---

## Overview

This checklist ensures all security fixes, integrations, and features are properly tested and verified before public launch. **Do not skip any items marked as CRITICAL.**

---

## Phase 1: Pre-Launch Security Checks

### 1.1 Environment Configuration
- [ ] **CRITICAL:** Run `npm run check-env` - all variables must pass validation
- [ ] **CRITICAL:** Verify `.env.local` is in `.gitignore` (run: `git check-ignore .env.local`)
- [ ] **CRITICAL:** No placeholder values (YOUR_KEY_HERE, etc.) in production `.env`
- [ ] **CRITICAL:** All API keys have appropriate restrictions/scopes
- [ ] Verify `NEXT_PUBLIC_*` variables are safe for client exposure
- [ ] Confirm Vercel environment variables match local `.env.local`
- [ ] Test with missing env vars to ensure graceful degradation

**Pass Criteria:** All env vars valid, no secrets exposed, graceful error handling

---

### 1.2 Rate Limiting Verification
- [ ] **CRITICAL:** Run `npm run test:rate-limiting`
- [ ] Verify 500 requests/day per IP limit enforced
- [ ] Test request 501 returns `429 Too Many Requests`
- [ ] Verify different IPs have independent limits
- [ ] Check rate limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- [ ] Test rate limit resets after 24 hours
- [ ] Verify Vercel KV connection successful
- [ ] Test rate limiting on all API endpoints:
  - `/api/process-image`
  - `/api/process-image-nsfw`
  - `/api/roast`
  - `/api/generate-canvas`

**Pass Criteria:** Rate limiting works correctly, no bypasses possible

---

### 1.3 Security Audit
- [ ] **CRITICAL:** Run `npm run security-audit`
- [ ] No exposed secrets in client-side bundles
- [ ] API routes require proper authentication where needed
- [ ] CORS configuration is restrictive (not `*`)
- [ ] XSS prevention tested (sanitize user inputs)
- [ ] CSRF protection enabled for state-changing operations
- [ ] SQL injection prevention (if using raw queries)
- [ ] File upload validation (size, type, malicious content)
- [ ] Verify admin routes only accessible to `derek.bobola@gmail.com`

**Pass Criteria:** Zero security vulnerabilities found

---

## Phase 2: Integration Testing

### 2.1 Payment Flow (Stripe)
- [ ] **CRITICAL:** Complete `scripts/test-payment-flow.md` checklist
- [ ] Test checkout flow in Stripe Test Mode
- [ ] Verify webhook receives `checkout.session.completed` event
- [ ] Confirm user tier upgrades from Free → Pro
- [ ] Verify watermark removal for Pro users
- [ ] Test unlimited image generation for Pro users
- [ ] Test subscription cancellation → downgrade to Free
- [ ] Verify failed payment handling
- [ ] Test promo code redemption (Unlimited tier)
- [ ] Confirm webhook signature validation works

**Pass Criteria:** Payment flow works end-to-end, webhook processes correctly

---

### 2.2 Email System (Resend)
- [ ] **CRITICAL:** Run `npm run test:emails`
- [ ] Send all 4 email templates:
  - Welcome email (on signup)
  - Rate limit warning (at 15 images)
  - Daily limit reached (at 20 images)
  - Pro upgrade confirmation
- [ ] Test delivery to Gmail, Outlook, Yahoo
- [ ] Verify unsubscribe links work
- [ ] Test opt-out preferences persist in InstantDB
- [ ] Check email rendering on mobile devices
- [ ] Verify "From" address matches domain
- [ ] Test email tracking (opens, clicks)

**Pass Criteria:** All emails deliver successfully, unsubscribe works

---

### 2.3 Analytics (Google Analytics 4)
- [ ] **CRITICAL:** Complete `scripts/test-analytics.md` checklist
- [ ] Verify GA4 Measurement ID in `.env.local`
- [ ] Test cookie consent banner (accept/decline)
- [ ] Verify events fire in GA4 DebugView:
  - `page_view` (all pages)
  - `image_upload`
  - `image_transform`
  - `prompt_select`
  - `batch_process_start`
  - `batch_process_complete`
  - `pro_upgrade`
  - `rate_limit_reached`
  - `share_image`
  - `download_image`
- [ ] Check Real-Time dashboard shows active users
- [ ] Verify custom dimensions tracked (user tier, prompt category)
- [ ] Test opt-out honors user preferences

**Pass Criteria:** All events track correctly, consent management works

---

### 2.4 Database (InstantDB)
- [ ] **CRITICAL:** Verify InstantDB App ID in `.env.local`
- [ ] Test magic link authentication (signup/login)
- [ ] Verify user data persists across sessions
- [ ] Test image history tracking
- [ ] Verify favorites system works
- [ ] Test usage limit tracking (20 images/day free tier)
- [ ] Confirm promo code redemption updates tier
- [ ] Test referral tracking (bonus images)
- [ ] Verify showcase submissions and voting
- [ ] Test email preferences persistence
- [ ] Confirm roulette game state management

**Pass Criteria:** All InstantDB operations work, data persists correctly

---

## Phase 3: Feature Testing

### 3.1 Core Image Transformations
- [ ] Test single image editor with 272+ prompts
- [ ] Verify Lock Composition feature works
- [ ] Test custom prompt input
- [ ] Verify batch processor handles 100+ images
- [ ] Test all 21 client-side effects (sharpen, vignette, etc.)
- [ ] Verify AI Canvas generation (DALL-E, Pollinations, HuggingFace)
- [ ] Test Transform Roulette (8 categories, 320 prompts)
- [ ] Verify Roast Mode (3 intensity levels)
- [ ] Test Prompt Wizard (5-step builder)

**Pass Criteria:** All transformation modes work without errors

---

### 3.2 User Experience Features
- [ ] Test Before/After slider
- [ ] Verify Creative Journey gallery (masonry layout)
- [ ] Test Download All (ZIP export)
- [ ] Verify Share Modal (social sharing)
- [ ] Test Templates Gallery (110+ samples)
- [ ] Verify Prompts Library (325+ prompts, search, filter)
- [ ] Test Favorites page (export functionality)
- [ ] Verify Tips & Tricks page
- [ ] Test Showcase gallery (user submissions)

**Pass Criteria:** All UX features work smoothly

---

### 3.3 NSFW Content Handling
- [ ] Verify `/editor-nsfw` shows "Coming Soon" page (Q1 2026)
- [ ] Test `/batch-nsfw` works with Replicate API
- [ ] Verify age verification warnings display
- [ ] Test dark theme (red/gray/orange gradient)
- [ ] Confirm legal disclaimers visible
- [ ] Verify no content storage (ephemeral only)

**Pass Criteria:** NSFW routes work as designed, legal compliance

---

## Phase 4: Performance & Optimization

### 4.1 Performance Benchmarks
- [ ] **CRITICAL:** Run `npm run test:performance`
- [ ] Lighthouse scores target:
  - Performance: **90+**
  - Accessibility: **95+**
  - Best Practices: **95+**
  - SEO: **95+**
- [ ] Bundle size < 500kb (gzip)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Image processing speed < 5s per image
- [ ] Batch processing: 100 images < 2 minutes

**Pass Criteria:** All performance targets met

---

### 4.2 Cross-Browser Testing
- [ ] **CRITICAL:** Complete `docs/BROWSER_TESTING.md` checklist
- [ ] Chrome (desktop + mobile) ✓
- [ ] Firefox (desktop) ✓
- [ ] Safari (iOS + macOS) ✓
- [ ] Edge (desktop) ✓
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify touch gestures work on mobile
- [ ] Test file upload on all browsers

**Pass Criteria:** Works on all major browsers, responsive design correct

---

### 4.3 Load Testing
- [ ] Test 100 concurrent users
- [ ] Verify server response times < 200ms (avg)
- [ ] Test image upload with large files (10MB+)
- [ ] Verify batch processor handles 100+ images
- [ ] Test rate limiting under high load

**Pass Criteria:** App handles expected traffic, no crashes

---

## Phase 5: Legal & Compliance

### 5.1 Legal Documents
- [ ] **CRITICAL:** Privacy Policy published and accessible
- [ ] **CRITICAL:** Terms of Service published and accessible
- [ ] Cookie consent banner displays on first visit
- [ ] Verify data collection notice (GDPR compliance)
- [ ] Test unsubscribe flow (CAN-SPAM compliance)
- [ ] Confirm NSFW content disclaimers (18+ warning)
- [ ] Verify DMCA policy accessible
- [ ] Test "Contact Us" form works

**Pass Criteria:** All legal requirements met, documents accessible

---

### 5.2 Data Privacy
- [ ] User emails stored securely (InstantDB encryption)
- [ ] No images stored on server (ephemeral processing)
- [ ] Verify image URLs expire after 24 hours
- [ ] Test data deletion requests (GDPR right to erasure)
- [ ] Confirm no third-party data sharing (without consent)
- [ ] Verify cookie consent honored

**Pass Criteria:** Full GDPR/CCPA compliance

---

## Phase 6: Monitoring & Observability

### 6.1 Cost Monitoring
- [ ] **CRITICAL:** Run `npm run monitor:costs`
- [ ] Set up cost alerts:
  - Gemini API: $100/day threshold
  - Replicate API: $50/day threshold
  - Vercel bandwidth: 1TB/month threshold
- [ ] Track daily API usage
- [ ] Estimate monthly costs ($500-$1000 projected)
- [ ] Verify cost-per-user metrics

**Pass Criteria:** Cost monitoring active, alerts configured

---

### 6.2 Error Tracking
- [ ] Set up Sentry (or error tracking service)
- [ ] Test error reporting (trigger intentional error)
- [ ] Verify API error logging
- [ ] Set up alert thresholds (>10 errors/hour)
- [ ] Test user-facing error messages (friendly, not technical)

**Pass Criteria:** All errors tracked, alerts working

---

### 6.3 Uptime Monitoring
- [ ] Set up uptime monitoring (Vercel Analytics or Pingdom)
- [ ] Test alert notifications (email, SMS)
- [ ] Monitor API endpoint health:
  - `/api/process-image` (every 5 min)
  - `/api/generate-canvas` (every 5 min)
- [ ] Set up status page (status.picforge.com)

**Pass Criteria:** Uptime monitoring active, 99.9% target

---

## Phase 7: Full User Journey Test

### 7.1 New User Onboarding
- [ ] **CRITICAL:** Complete `scripts/test-full-user-journey.md`
- [ ] Visit site → accept cookies
- [ ] Sign up with magic link (verify email delivery)
- [ ] Upload first image → transform
- [ ] Try 3 different prompt categories
- [ ] Save favorite prompts
- [ ] Use Transform Roulette
- [ ] Generate 15 images (trigger rate limit warning email)
- [ ] Generate 20 images (trigger limit reached email)
- [ ] Attempt 21st image (verify blocked)
- [ ] Upgrade to Pro (test Stripe checkout)
- [ ] Verify unlimited access post-upgrade
- [ ] Test watermark removed for Pro user
- [ ] Check all GA4 events tracked

**Pass Criteria:** Complete user journey works flawlessly

---

### 7.2 Returning User Experience
- [ ] Login with existing account (magic link)
- [ ] Verify image history persists
- [ ] Check favorites still saved
- [ ] Test usage limit reset after 24 hours
- [ ] Verify Pro subscription active

**Pass Criteria:** Returning user experience smooth

---

## Phase 8: Go/No-Go Decision

### 8.1 Critical Requirements (MUST PASS ALL)
- [ ] ✅ Zero security vulnerabilities
- [ ] ✅ Rate limiting works (500/day/IP)
- [ ] ✅ Payment flow works (Stripe webhook)
- [ ] ✅ Email delivery works (Resend)
- [ ] ✅ Analytics tracking works (GA4)
- [ ] ✅ Legal documents published
- [ ] ✅ Performance targets met (Lighthouse 90+)
- [ ] ✅ Cross-browser compatibility
- [ ] ✅ Cost monitoring active

**GO Decision:** All critical requirements ✅
**NO-GO Decision:** Any critical requirement ❌ → Fix before launch

---

### 8.2 Nice-to-Have (Can Launch Without)
- [ ] Showcase gallery populated (10+ submissions)
- [ ] Social media accounts created (@PicForge)
- [ ] Blog posts published (3+ SEO articles)
- [ ] Affiliate program set up
- [ ] Mobile app planned

**Note:** These can be completed post-launch

---

## Phase 9: Launch Day Checklist

### 9.1 Pre-Launch (T-24 hours)
- [ ] Final security audit pass
- [ ] Verify all monitoring alerts active
- [ ] Test production environment (staging → production)
- [ ] Clear caches (Vercel, CDN)
- [ ] Warm up servers (pre-cache assets)
- [ ] Notify team of launch time
- [ ] Prepare rollback plan

---

### 9.2 Launch (T-0)
- [ ] Deploy to production (`git push origin main`)
- [ ] Verify deployment successful (check Vercel dashboard)
- [ ] Test live site (smoke test all features)
- [ ] Monitor error rates (first 15 minutes)
- [ ] Check analytics tracking live
- [ ] Verify payment flow works in production
- [ ] Test rate limiting on production
- [ ] Post launch announcement (social media, email list)

---

### 9.3 Post-Launch Monitoring (First 48 Hours)
- [ ] Monitor server response times (every hour)
- [ ] Track error rates (alert if >5 errors/hour)
- [ ] Check rate limit hits (expect 100-500/day)
- [ ] Monitor Stripe webhook success rate (>99%)
- [ ] Track email delivery rate (>95%)
- [ ] Verify GA4 events flowing (check Real-Time dashboard)
- [ ] Monitor API costs (Gemini, Replicate)
- [ ] Track user signups (target: 50+ in 48 hours)
- [ ] Respond to user feedback (support emails)

**Critical Metrics (First 48 Hours):**
- Uptime: **99.9%+**
- Error rate: **<1%**
- API response time: **<500ms avg**
- Payment success rate: **>95%**
- Email delivery: **>95%**

---

## Phase 10: Post-Launch Review

### 10.1 Week 1 Retrospective
- [ ] Review key metrics:
  - Total signups
  - Free → Pro conversion rate
  - Daily active users
  - Image transformations per user
  - Revenue (Stripe dashboard)
  - API costs vs revenue
- [ ] Identify top issues (bug reports, support tickets)
- [ ] Prioritize fixes/improvements
- [ ] Update documentation based on learnings
- [ ] Thank the team 🎉

---

## Emergency Contacts

**Technical Issues:**
- Derek Bobola: derek.bobola@gmail.com
- Vercel Support: vercel.com/support
- InstantDB Support: support@instantdb.com

**Service Outages:**
- Vercel Status: vercel-status.com
- Stripe Status: status.stripe.com
- Resend Status: status.resend.com

**Rollback Procedure:**
1. Revert to previous Git commit: `git revert HEAD`
2. Force deploy: `git push origin main --force`
3. Clear Vercel cache
4. Monitor for 15 minutes
5. Notify users via status page

---

## Sign-Off

**Completed By:** _______________________
**Date:** _______________________
**Launch Approved:** [ ] YES / [ ] NO

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Appendix: Testing Scripts

All testing scripts located in `/scripts/` directory:
- `test-rate-limiting.ts` - Rate limit verification
- `test-payment-flow.md` - Payment flow checklist
- `test-analytics.md` - GA4 testing checklist
- `test-emails.ts` - Email delivery tests
- `security-audit.ts` - Security vulnerability scan
- `test-performance.ts` - Performance benchmarks
- `monitor-costs.ts` - Cost tracking script
- `test-full-user-journey.md` - End-to-end user flow

**Documentation:**
- `docs/BROWSER_TESTING.md` - Cross-browser checklist
- `docs/MONITORING.md` - Post-launch monitoring guide

---

**Good luck with the launch, Derek! 🚀**
