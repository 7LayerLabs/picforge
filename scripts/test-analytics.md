# Google Analytics 4 (GA4) Testing Checklist

**Version:** 1.0
**Test Environment:** Production + DebugView
**Tester:** _______________
**Date:** _______________

---

## Overview

This checklist verifies that Google Analytics 4 is correctly tracking all user interactions, events, and conversions on PicForge.com.

**Duration:** 45-60 minutes
**Prerequisites:**
- GA4 Measurement ID in `.env.local`
- Access to GA4 Dashboard (ask Derek for access)
- Chrome browser with GA4 DebugView extension (or use `debug_mode=true`)

---

## Setup

### Step 1: Verify GA4 Configuration

- [ ] Check `.env.local` has: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- [ ] Verify Measurement ID matches GA4 property (check GA4 Admin → Data Streams)
- [ ] Open browser DevTools → Network tab
- [ ] Visit PicForge.com
- [ ] Filter network requests for: `google-analytics.com/g/collect`
- [ ] Verify GA4 requests are being sent

**Expected Result:** GA4 requests visible in Network tab ✅

---

### Step 2: Enable DebugView

**Method 1: Chrome Extension (Recommended)**
- [ ] Install "Google Analytics Debugger" Chrome extension
- [ ] Visit PicForge.com with extension enabled
- [ ] Open GA4 Dashboard → Reports → DebugView
- [ ] Verify your session appears in DebugView

**Method 2: URL Parameter**
- [ ] Visit: `https://picforge.com?debug_mode=true`
- [ ] Check DebugView for your session

**Expected Result:** Your session visible in GA4 DebugView ✅

---

## Test 1: Page View Tracking

### 1.1 Home Page

- [ ] Visit: `https://picforge.com`
- [ ] In DebugView, verify event: `page_view`
- [ ] Check parameters:
  - `page_location`: https://picforge.com/
  - `page_title`: PicForge - (re)Imagine. Everything.
  - `page_referrer`: (previous site or empty)

**Expected Result:** Home page view tracked ✅

---

### 1.2 Editor Page

- [ ] Visit: `/editor` (or main editor route)
- [ ] Verify `page_view` event with:
  - `page_location`: https://picforge.com/editor
  - `page_title`: Image Editor - PicForge

**Expected Result:** Editor page view tracked ✅

---

### 1.3 Other Key Pages

Test page views for:
- [ ] `/batch` - Batch Processor
- [ ] `/canvas` - AI Canvas
- [ ] `/roulette` - Transform Roulette
- [ ] `/roast` - Roast Mode
- [ ] `/prompts` - Prompts Library
- [ ] `/profile` - User Profile
- [ ] `/checkout` - Checkout Page (if accessible)

**Expected Result:** All page views tracked ✅

---

## Test 2: Cookie Consent

### 2.1 First Visit (No Consent)

- [ ] Clear cookies and local storage
- [ ] Visit PicForge.com
- [ ] Verify cookie consent banner appears
- [ ] Before accepting, check DebugView
- [ ] Verify NO events tracked (or only essential `page_view`)

**Expected Result:** No tracking before consent ✅

---

### 2.2 Accept Cookies

- [ ] Click "Accept All" on consent banner
- [ ] Verify banner disappears
- [ ] Generate an image
- [ ] Check DebugView - verify events now tracked
- [ ] Refresh page - verify banner doesn't reappear

**Expected Result:** Tracking enabled after consent, preference persists ✅

---

### 2.3 Decline Cookies

- [ ] Clear cookies/storage again
- [ ] Visit site
- [ ] Click "Decline" or "Reject All" on consent banner
- [ ] Generate an image
- [ ] Verify NO analytics events tracked (except essential page views)

**Expected Result:** No tracking after declining consent ✅

---

## Test 3: Image Transformation Events

### 3.1 Image Upload

- [ ] Upload an image on editor page
- [ ] Verify event: `image_upload`
- [ ] Check parameters:
  - `method`: 'drag_drop' or 'file_select'
  - `file_size`: (size in bytes)
  - `file_type`: 'image/jpeg', 'image/png', etc.

**Expected Result:** Upload event tracked with metadata ✅

---

### 3.2 Prompt Selection

- [ ] Select a prompt from templates
- [ ] Verify event: `prompt_select`
- [ ] Check parameters:
  - `prompt_category`: 'Art Styles', 'Nature', etc.
  - `prompt_text`: (actual prompt text)
  - `prompt_source`: 'template' or 'custom'

**Expected Result:** Prompt selection tracked ✅

---

### 3.3 Image Transformation

- [ ] Click "Transform" button
- [ ] Wait for transformation to complete
- [ ] Verify event: `image_transform`
- [ ] Check parameters:
  - `transformation_type`: 'ai_prompt' or effect name
  - `locked_composition`: true/false
  - `processing_time`: (time in milliseconds)
  - `user_tier`: 'free', 'pro', or 'unlimited'

**Expected Result:** Transform event tracked with details ✅

---

### 3.4 Custom Prompt

- [ ] Enter custom prompt: "turn into a zombie"
- [ ] Transform image
- [ ] Verify `prompt_select` event with:
  - `prompt_source`: 'custom'
  - `prompt_text`: "turn into a zombie"

**Expected Result:** Custom prompts tracked ✅

---

## Test 4: Batch Processing Events

### 4.1 Batch Upload

- [ ] Go to `/batch`
- [ ] Upload 10 images
- [ ] Verify event: `batch_upload`
- [ ] Check parameters:
  - `image_count`: 10
  - `total_size`: (total bytes)

**Expected Result:** Batch upload tracked ✅

---

### 4.2 Batch Process Start

- [ ] Select an effect (e.g., "Sharpen")
- [ ] Click "Process All"
- [ ] Verify event: `batch_process_start`
- [ ] Check parameters:
  - `effect_type`: 'sharpen'
  - `image_count`: 10

**Expected Result:** Batch start event tracked ✅

---

### 4.3 Batch Process Complete

- [ ] Wait for all images to process
- [ ] Verify event: `batch_process_complete`
- [ ] Check parameters:
  - `image_count`: 10
  - `processing_time`: (total milliseconds)
  - `success_count`: 10
  - `error_count`: 0

**Expected Result:** Batch completion tracked ✅

---

## Test 5: User Engagement Events

### 5.1 Download Image

- [ ] Transform an image
- [ ] Click "Download" button
- [ ] Verify event: `download_image`
- [ ] Check parameters:
  - `image_format`: 'png', 'jpg', etc.
  - `image_size`: (bytes)
  - `has_watermark`: true/false

**Expected Result:** Download tracked ✅

---

### 5.2 Share Image

- [ ] Click "Share" button
- [ ] Verify event: `share_image`
- [ ] Check parameters:
  - `share_method`: 'social' or 'copy_link'
  - `platform`: 'twitter', 'facebook', 'link', etc.

**Expected Result:** Share event tracked ✅

---

### 5.3 Favorite Prompt

- [ ] In prompts library, click heart icon to favorite
- [ ] Verify event: `favorite_prompt`
- [ ] Check parameters:
  - `prompt_id`: (prompt identifier)
  - `prompt_category`: 'Art Styles', etc.

**Expected Result:** Favorite tracked ✅

---

## Test 6: Gamification Events

### 6.1 Roulette Spin

- [ ] Go to `/roulette`
- [ ] Click "Spin" button
- [ ] Verify event: `roulette_spin`
- [ ] Check parameters:
  - `category_landed`: 'Art Styles', 'Movie Magic', etc.
  - `prompt_selected`: (prompt text)

**Expected Result:** Roulette spin tracked ✅

---

### 6.2 Roast Image

- [ ] Go to `/roast`
- [ ] Upload image
- [ ] Select intensity: "Nuclear"
- [ ] Verify event: `roast_image`
- [ ] Check parameters:
  - `intensity_level`: 'mild', 'spicy', or 'nuclear'

**Expected Result:** Roast event tracked ✅

---

## Test 7: Conversion Events

### 7.1 Begin Checkout

- [ ] As Free user, hit rate limit (20 images)
- [ ] Click "Upgrade to Pro"
- [ ] Verify event: `begin_checkout`
- [ ] Check parameters:
  - `value`: 9.99
  - `currency`: 'USD'
  - `items`: [{ item_name: 'Pro Subscription', price: 9.99 }]

**Expected Result:** Checkout initiation tracked ✅

---

### 7.2 Purchase (Pro Upgrade)

- [ ] Complete Stripe checkout with test card
- [ ] After successful payment, verify event: `purchase`
- [ ] Check parameters:
  - `transaction_id`: (Stripe session ID)
  - `value`: 9.99
  - `currency`: 'USD'
  - `items`: [{ item_name: 'Pro Subscription', price: 9.99 }]
  - `user_tier`: 'pro' (after upgrade)

**Expected Result:** Purchase event tracked with transaction ID ✅

---

### 7.3 Pro Upgrade (Custom Event)

- [ ] After purchase, verify custom event: `pro_upgrade`
- [ ] Check parameters:
  - `upgrade_method`: 'stripe' or 'promo_code'
  - `previous_tier`: 'free'
  - `new_tier`: 'pro'

**Expected Result:** Pro upgrade event tracked ✅

---

### 7.4 Promo Code Redemption

- [ ] As new user, redeem promo code: `DEREK-FOUNDER-2025`
- [ ] Verify event: `promo_code_redeem`
- [ ] Check parameters:
  - `promo_code`: 'DEREK-FOUNDER-2025'
  - `tier_granted`: 'unlimited'

**Expected Result:** Promo redemption tracked ✅

---

## Test 8: Rate Limiting Events

### 8.1 Rate Limit Warning

- [ ] As Free user, generate 15 images (75% of limit)
- [ ] Verify event: `rate_limit_warning`
- [ ] Check parameters:
  - `images_used`: 15
  - `images_remaining`: 5
  - `limit`: 20

**Expected Result:** Warning event tracked at 75% ✅

---

### 8.2 Rate Limit Reached

- [ ] Generate 5 more images (total 20)
- [ ] Verify event: `rate_limit_reached`
- [ ] Check parameters:
  - `images_used`: 20
  - `limit`: 20
  - `user_tier`: 'free'

**Expected Result:** Limit reached event tracked ✅

---

## Test 9: User Properties

### 9.1 User Tier

- [ ] In DebugView, expand any event
- [ ] Check "User Properties" section
- [ ] Verify property: `user_tier` = 'free', 'pro', or 'unlimited'

**Expected Result:** User tier tracked as user property ✅

---

### 9.2 Account Age

- [ ] Verify user property: `account_age_days` = (days since signup)

**Expected Result:** Account age tracked ✅

---

### 9.3 Total Images Generated

- [ ] Verify user property: `total_images_generated` = (lifetime count)

**Expected Result:** Total images tracked ✅

---

## Test 10: E-commerce Reporting

### 10.1 GA4 Ecommerce Report

- [ ] In GA4, go to: Reports → Monetization → Ecommerce purchases
- [ ] Verify purchases appear (may take 24 hours)
- [ ] Check:
  - [ ] Transaction ID matches Stripe
  - [ ] Revenue = $9.99
  - [ ] Item name = "Pro Subscription"

**Expected Result:** Purchases visible in Ecommerce report ✅

---

## Test 11: Real-Time Dashboard

### 11.1 Active Users

- [ ] Go to: Reports → Realtime → Overview
- [ ] Verify your active session appears
- [ ] Check:
  - [ ] Users: 1+
  - [ ] Event count increasing as you interact

**Expected Result:** Real-time data flowing ✅

---

### 11.2 Top Events

- [ ] In Realtime dashboard, check "Event count by Event name"
- [ ] Verify events appear:
  - `page_view`
  - `image_transform`
  - `download_image`
  - etc.

**Expected Result:** Top events tracked in real-time ✅

---

## Test 12: Opt-Out Functionality

### 12.1 User Opts Out

- [ ] Go to user profile or settings
- [ ] Toggle "Allow analytics tracking" to OFF
- [ ] Save preferences
- [ ] Generate an image
- [ ] Check DebugView - verify NO events tracked

**Expected Result:** Opt-out honored, no tracking ✅

---

### 12.2 User Opts Back In

- [ ] Toggle "Allow analytics tracking" to ON
- [ ] Generate an image
- [ ] Verify events tracked again

**Expected Result:** Opt-in restores tracking ✅

---

## Summary

### Event Tracking Summary

| Event Category | Event Name | Status |
|----------------|------------|--------|
| **Page Views** | `page_view` | [ ] ✅ / [ ] ❌ |
| **Consent** | Cookie consent working | [ ] ✅ / [ ] ❌ |
| **Image Upload** | `image_upload` | [ ] ✅ / [ ] ❌ |
| **Prompts** | `prompt_select` | [ ] ✅ / [ ] ❌ |
| **Transform** | `image_transform` | [ ] ✅ / [ ] ❌ |
| **Batch Upload** | `batch_upload` | [ ] ✅ / [ ] ❌ |
| **Batch Start** | `batch_process_start` | [ ] ✅ / [ ] ❌ |
| **Batch Complete** | `batch_process_complete` | [ ] ✅ / [ ] ❌ |
| **Download** | `download_image` | [ ] ✅ / [ ] ❌ |
| **Share** | `share_image` | [ ] ✅ / [ ] ❌ |
| **Favorite** | `favorite_prompt` | [ ] ✅ / [ ] ❌ |
| **Roulette** | `roulette_spin` | [ ] ✅ / [ ] ❌ |
| **Roast** | `roast_image` | [ ] ✅ / [ ] ❌ |
| **Begin Checkout** | `begin_checkout` | [ ] ✅ / [ ] ❌ |
| **Purchase** | `purchase` | [ ] ✅ / [ ] ❌ |
| **Pro Upgrade** | `pro_upgrade` | [ ] ✅ / [ ] ❌ |
| **Promo Code** | `promo_code_redeem` | [ ] ✅ / [ ] ❌ |
| **Rate Limit Warning** | `rate_limit_warning` | [ ] ✅ / [ ] ❌ |
| **Rate Limit Reached** | `rate_limit_reached` | [ ] ✅ / [ ] ❌ |
| **User Properties** | User tier, account age, total images | [ ] ✅ / [ ] ❌ |
| **Real-Time** | Dashboard updates live | [ ] ✅ / [ ] ❌ |
| **Opt-Out** | User can disable tracking | [ ] ✅ / [ ] ❌ |

**Total Passed:** _____ / 21
**Total Failed:** _____ / 21

---

### Critical Issues Found

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

---

### Final Sign-Off

**Tester Name:** _______________________
**Date:** _______________________
**Status:** [ ] PASS - Analytics Ready / [ ] FAIL - Requires Fixes

---

## Appendix: Debugging Tips

### Not Seeing Events in DebugView?

1. **Check browser extensions:**
   - Ad blockers may block GA4
   - Disable uBlock Origin, Privacy Badger, etc.

2. **Verify Measurement ID:**
   - Inspect page source → search for `G-XXXXXXXXXX`
   - Must match your GA4 property

3. **Check Network tab:**
   - Filter for: `google-analytics.com`
   - Verify requests return `200 OK` (not `403` or blocked)

4. **Wait 5-10 seconds:**
   - DebugView has slight delay

5. **Clear cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

### Events Not Appearing in Reports?

- **Wait 24-48 hours:** Standard reports have processing delay
- **Use DebugView for instant verification:** Realtime debugging only
- **Check date range:** Ensure reports use correct time frame

---

### Custom Events Not Firing?

- Check browser console for JavaScript errors
- Verify event name spelling (case-sensitive)
- Ensure event parameters are valid (no undefined values)

---

**GA4 Documentation:** https://support.google.com/analytics/answer/9304153
