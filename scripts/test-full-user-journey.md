# Full User Journey Integration Test

**Version:** 1.0
**Test Type:** End-to-End Manual Testing
**Tester:** _______________
**Date:** _______________
**Duration:** 60-90 minutes

---

## Overview

This test simulates a complete user journey from first visit to Pro upgrade, verifying all systems work together:
- Cookie consent & GA4 tracking
- User authentication (InstantDB)
- Image transformations (Gemini API)
- Rate limiting (Vercel KV)
- Email notifications (Resend)
- Payment flow (Stripe)

**Environment:** Production (https://picforge.com)

---

## Pre-Test Setup

### 1. Clear Browser Data
- [ ] Clear all cookies
- [ ] Clear localStorage
- [ ] Clear sessionStorage
- [ ] Close all PicForge tabs

### 2. Open Monitoring Dashboards
- [ ] GA4 DebugView: https://analytics.google.com/analytics/web/#/report/DebugView
- [ ] Resend Dashboard: https://resend.com/emails
- [ ] Stripe Dashboard: https://dashboard.stripe.com
- [ ] InstantDB Dashboard: https://www.instantdb.com/dash

### 3. Prepare Test Assets
- [ ] Download 3 test images (JPG/PNG, 1-5MB each)
- [ ] Have test email ready: `test-user-[timestamp]@example.com`
- [ ] Have Stripe test card ready: `4242 4242 4242 4242`

---

## Journey Step 1: First Visit & Cookie Consent

**Time:** T+0 minutes

### Actions:
1. [ ] Open incognito/private browser window
2. [ ] Navigate to: https://picforge.com
3. [ ] Wait for page to fully load

### Expected Results:
- [ ] Cookie consent banner appears at bottom/top
- [ ] Banner has "Accept All" and "Decline" buttons
- [ ] Banner explains cookie usage (analytics, essential)
- [ ] No GA4 events tracked yet (check DebugView)

### Verification:
- [ ] Click "Accept All"
- [ ] Banner disappears
- [ ] `page_view` event appears in GA4 DebugView
- [ ] Consent preference saved (refresh page → no banner)

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 2: Sign Up with Magic Link

**Time:** T+2 minutes

### Actions:
1. [ ] Click "Sign In" or "Get Started" button
2. [ ] Enter email: `test-user-[timestamp]@example.com`
3. [ ] Click "Send Magic Link"

### Expected Results:
- [ ] Success message: "Check your email for magic link"
- [ ] Email sent within 30 seconds (check Resend dashboard)
- [ ] Email subject: "Sign in to PicForge" or similar
- [ ] Email contains clickable magic link

### Verification:
1. [ ] Open email inbox
2. [ ] Find magic link email
3. [ ] Click magic link in email
4. [ ] Redirected to PicForge (logged in)

### Post-Login Checks:
- [ ] "Sign In" button changes to user icon or "Profile"
- [ ] Welcome email sent (check Resend dashboard)
- [ ] `sign_up` event tracked in GA4
- [ ] User created in InstantDB (check dashboard)
- [ ] User tier: **Free** (20 images/day limit)

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 3: First Image Transformation

**Time:** T+5 minutes

### Actions:
1. [ ] Go to editor page: `/`
2. [ ] Upload test image #1 (drag & drop or file picker)
3. [ ] Wait for image preview
4. [ ] Select prompt: "Turn into Van Gogh painting" (Art Styles category)
5. [ ] Click "Transform" button

### Expected Results:
- [ ] Image uploads successfully
- [ ] Preview displays
- [ ] Prompt selector works
- [ ] Transform button enabled
- [ ] Processing starts (loading spinner)
- [ ] Result displays within 5-10 seconds
- [ ] Before/After slider works
- [ ] Download button enabled

### GA4 Events (Check DebugView):
- [ ] `image_upload` (with file size, type)
- [ ] `prompt_select` (with prompt text, category)
- [ ] `image_transform` (with user_tier: 'free', locked_composition: false)

### InstantDB Checks:
- [ ] Image history updated (1 image)
- [ ] Usage counter: 1/20 images used today
- [ ] Transformed image URL saved

### Verification:
- [ ] Download image works
- [ ] Image has watermark: "PicForge.com" (Free tier)
- [ ] Profile page shows: "1 image generated today"

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 4: Try Multiple Features

**Time:** T+10 minutes

### Actions:
1. [ ] **Try custom prompt:**
   - Enter: "turn into a zombie"
   - Transform
   - Verify result

2. [ ] **Try Lock Composition:**
   - Check "Lock Composition" checkbox
   - Apply new prompt: "make it blue"
   - Verify image structure preserved, only color changed

3. [ ] **Add to Favorites:**
   - Go to Prompts Library: `/prompts`
   - Click heart icon on 3 prompts
   - Go to Favorites: `/prompts/favorites`
   - Verify 3 favorites saved

4. [ ] **Try Transform Roulette:**
   - Go to: `/roulette`
   - Click "Spin" button
   - Upload image
   - Apply random prompt
   - Verify transformation works

5. [ ] **Try Roast Mode:**
   - Go to: `/roast`
   - Upload image
   - Select intensity: "Spicy"
   - Verify roast appears

### Expected Results:
- [ ] All features work smoothly
- [ ] No errors in console
- [ ] Usage counter increments (now 5/20 images used)
- [ ] All GA4 events tracked

### GA4 Events to Verify:
- [ ] `roulette_spin`
- [ ] `roast_image`
- [ ] `favorite_prompt` (3 times)

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 5: Approach Rate Limit (15 Images)

**Time:** T+20 minutes

### Actions:
1. [ ] Generate 10 more images (total 15/20)
2. [ ] Use any prompts/features
3. [ ] Check profile page

### Expected Results:
- [ ] Profile shows: "15 images generated today"
- [ ] "5 images remaining today" displayed
- [ ] Rate limit warning email sent (check Resend dashboard)

### Email Verification:
- [ ] Email subject: "You're Running Low on Daily Transforms"
- [ ] Email content mentions: "5 transformations remaining"
- [ ] Email has "Upgrade to Pro" CTA
- [ ] Email received within 1 minute of hitting 15 images

### GA4 Events:
- [ ] `rate_limit_warning` (at 15 images, 75% of limit)

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 6: Hit Rate Limit (20 Images)

**Time:** T+30 minutes

### Actions:
1. [ ] Generate 5 more images (total 20/20)
2. [ ] Attempt 21st image transformation

### Expected Results:
- [ ] First 5 images succeed
- [ ] Profile shows: "20 images generated today"
- [ ] Daily limit reached email sent (check Resend)
- [ ] 21st image blocked with upgrade prompt modal

### Email Verification:
- [ ] Email subject: "Daily Transformation Limit Reached"
- [ ] Email explains limit reached
- [ ] Email has "Upgrade to Pro" CTA
- [ ] Email received within 1 minute

### Error Modal Checks:
- [ ] Modal appears on 21st transform attempt
- [ ] Modal explains: "Daily limit of 20 images reached"
- [ ] Modal shows: "Limit resets in X hours"
- [ ] "Upgrade to Pro" button visible
- [ ] "Redeem Promo Code" link visible

### GA4 Events:
- [ ] `rate_limit_reached` (at 20 images)

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 7: Upgrade to Pro (Stripe Checkout)

**Time:** T+35 minutes

### Actions:
1. [ ] Click "Upgrade to Pro" button in modal
2. [ ] Verify redirect to Stripe Checkout
3. [ ] Fill in payment form:
   - Email: (pre-filled or enter test email)
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - ZIP: `12345`
4. [ ] Click "Subscribe" / "Pay"
5. [ ] Wait for redirect

### Expected Results:
- [ ] Stripe Checkout page loads
- [ ] Pricing shows: $9.99/month
- [ ] Form fields render correctly
- [ ] Test card accepted
- [ ] Redirect to success page: `/checkout/success`

### GA4 Events:
- [ ] `begin_checkout` (when clicking "Upgrade to Pro")
- [ ] `purchase` (after successful payment)
  - `transaction_id`: (Stripe session ID)
  - `value`: 9.99
  - `currency`: USD

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 8: Verify Pro Tier Upgrade

**Time:** T+40 minutes

### Actions:
1. [ ] Check Stripe webhook (Dashboard → Developers → Webhooks)
2. [ ] Verify `checkout.session.completed` event received
3. [ ] Go to profile page: `/profile`
4. [ ] Check user tier and limits

### Expected Results:

#### Stripe Dashboard:
- [ ] Customer created with test email
- [ ] Subscription status: **Active**
- [ ] Payment successful: $9.99
- [ ] Webhook status: **200 OK**

#### Profile Page:
- [ ] User tier: **Pro** (or badge/indicator)
- [ ] Daily limit: **Unlimited**
- [ ] "20 images generated today" still shown (count doesn't reset)
- [ ] "Manage Subscription" button visible

#### InstantDB:
- [ ] User tier updated to "pro"
- [ ] promoCodeUsed: null (upgraded via Stripe, not promo)

#### Email (Resend):
- [ ] Pro upgrade confirmation email sent
- [ ] Subject: "Welcome to PicForge Pro!" or similar
- [ ] Email lists Pro benefits
- [ ] Email includes receipt/invoice link

### GA4 Events:
- [ ] `pro_upgrade` (custom event)
  - `upgrade_method`: 'stripe'
  - `previous_tier`: 'free'
  - `new_tier`: 'pro'

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 9: Test Unlimited Access

**Time:** T+45 minutes

### Actions:
1. [ ] Generate 10 more images (total 30+)
2. [ ] Verify no rate limit errors
3. [ ] Download an image
4. [ ] Check for watermark

### Expected Results:
- [ ] All 10 images process successfully
- [ ] No rate limit modal appears
- [ ] Profile shows: "30 images generated today" (or higher)
- [ ] Daily limit: **Unlimited**
- [ ] Downloaded images have **NO watermark**

### Verification:
- [ ] Open downloaded image in image viewer
- [ ] Zoom to corners and edges
- [ ] Confirm no "PicForge.com" text visible

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 10: Test Subscription Management

**Time:** T+50 minutes

### Actions:
1. [ ] Go to profile page
2. [ ] Click "Manage Subscription" button
3. [ ] Verify redirect to Stripe Customer Portal

### Expected Results:
- [ ] Stripe Customer Portal loads
- [ ] Shows active subscription: $9.99/month
- [ ] Shows payment method: •••• 4242
- [ ] Options available:
  - Update payment method
  - View invoices
  - Cancel subscription

### Test Cancellation (Optional):
- [ ] Click "Cancel subscription"
- [ ] Confirm cancellation
- [ ] Verify webhook: `customer.subscription.deleted`
- [ ] Return to PicForge profile
- [ ] Verify tier reverted to: **Free**
- [ ] Verify daily limit: **20 images/day**
- [ ] Generate new image → watermark restored

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 11: Test Session Persistence

**Time:** T+55 minutes

### Actions:
1. [ ] Close browser completely
2. [ ] Reopen browser
3. [ ] Navigate to: https://picforge.com
4. [ ] Check if still logged in

### Expected Results:
- [ ] User still logged in (InstantDB session persists)
- [ ] Profile page shows correct tier and usage
- [ ] Image history still visible
- [ ] Favorites still saved

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Journey Step 12: Test Analytics Tracking

**Time:** T+60 minutes

### Actions:
1. [ ] Open GA4 Dashboard: Reports → Realtime → Overview
2. [ ] Review all events tracked during test

### Expected Events (Minimum):
- [ ] `page_view` (10+ times)
- [ ] `sign_up`
- [ ] `image_upload` (30+ times)
- [ ] `prompt_select` (30+ times)
- [ ] `image_transform` (30+ times)
- [ ] `favorite_prompt` (3 times)
- [ ] `roulette_spin`
- [ ] `roast_image`
- [ ] `rate_limit_warning`
- [ ] `rate_limit_reached`
- [ ] `begin_checkout`
- [ ] `purchase`
- [ ] `pro_upgrade`
- [ ] `download_image` (multiple)

### Verification:
- [ ] All events have correct parameters
- [ ] User properties tracked:
  - `user_tier`: 'free' → 'pro'
  - `total_images_generated`: 30+
- [ ] Conversion events tracked in GA4 Conversions report

**Actual Result:**
_____________________________________________________________

**Issues:** [ ] None / [ ] See notes below
_____________________________________________________________

---

## Post-Test Cleanup

### 1. Test Data Cleanup
- [ ] Delete test user from InstantDB (optional)
- [ ] Cancel test subscription in Stripe
- [ ] Archive test emails in Resend

### 2. Documentation
- [ ] Screenshot key steps (optional)
- [ ] Note any bugs or issues
- [ ] Save GA4 event log (export from DebugView)

---

## Summary

### Journey Completion

| Step | Description | Status |
|------|-------------|--------|
| 1 | First Visit & Cookie Consent | [ ] ✅ / [ ] ❌ |
| 2 | Sign Up with Magic Link | [ ] ✅ / [ ] ❌ |
| 3 | First Image Transformation | [ ] ✅ / [ ] ❌ |
| 4 | Try Multiple Features | [ ] ✅ / [ ] ❌ |
| 5 | Approach Rate Limit (15 images) | [ ] ✅ / [ ] ❌ |
| 6 | Hit Rate Limit (20 images) | [ ] ✅ / [ ] ❌ |
| 7 | Upgrade to Pro (Stripe) | [ ] ✅ / [ ] ❌ |
| 8 | Verify Pro Tier Upgrade | [ ] ✅ / [ ] ❌ |
| 9 | Test Unlimited Access | [ ] ✅ / [ ] ❌ |
| 10 | Test Subscription Management | [ ] ✅ / [ ] ❌ |
| 11 | Test Session Persistence | [ ] ✅ / [ ] ❌ |
| 12 | Test Analytics Tracking | [ ] ✅ / [ ] ❌ |

**Total Steps Passed:** _____ / 12
**Total Steps Failed:** _____ / 12

---

### Critical Issues Found

**Issue #1:**
- Step: _________
- Severity: Critical / High / Medium / Low
- Description: _____________________________________________
- Impact: _____________________________________________

**Issue #2:**
- Step: _________
- Severity: Critical / High / Medium / Low
- Description: _____________________________________________
- Impact: _____________________________________________

**Issue #3:**
- Step: _________
- Severity: Critical / High / Medium / Low
- Description: _____________________________________________
- Impact: _____________________________________________

---

### Integration Points Verified

| Integration | Status | Notes |
|-------------|--------|-------|
| InstantDB (Auth & Database) | [ ] ✅ / [ ] ❌ | |
| Gemini API (Image Processing) | [ ] ✅ / [ ] ❌ | |
| Vercel KV (Rate Limiting) | [ ] ✅ / [ ] ❌ | |
| Resend (Email Delivery) | [ ] ✅ / [ ] ❌ | |
| Stripe (Payments & Webhooks) | [ ] ✅ / [ ] ❌ | |
| Google Analytics 4 (Tracking) | [ ] ✅ / [ ] ❌ | |

---

### Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Page Load Time | <3s | ___s | [ ] ✅ / [ ] ❌ |
| Image Processing | <10s | ___s | [ ] ✅ / [ ] ❌ |
| Stripe Checkout Load | <2s | ___s | [ ] ✅ / [ ] ❌ |
| Email Delivery | <1min | ___s | [ ] ✅ / [ ] ❌ |
| Webhook Processing | <5s | ___s | [ ] ✅ / [ ] ❌ |

---

### Final Sign-Off

**Tester Name:** _______________________
**Date:** _______________________
**Duration:** _______ minutes

**Overall Status:** [ ] PASS - Ready for Launch / [ ] FAIL - Requires Fixes

**Confidence Level:** [ ] High / [ ] Medium / [ ] Low

**Recommendation:**
[ ] Launch immediately
[ ] Fix critical issues first
[ ] Requires major rework

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

**User Journey Testing Complete!**

If all steps passed, the complete end-to-end flow is working correctly and PicForge is ready for public launch.
