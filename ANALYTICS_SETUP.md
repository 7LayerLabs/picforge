# Google Analytics 4 + Search Console Setup Guide

Complete analytics implementation for PicForge with event tracking and Search Console integration.

## Table of Contents
1. [Google Analytics 4 Setup](#google-analytics-4-setup)
2. [Google Search Console Setup](#google-search-console-setup)
3. [Environment Variables](#environment-variables)
4. [Event Tracking Reference](#event-tracking-reference)
5. [Testing & Verification](#testing--verification)
6. [Dashboard Setup](#dashboard-setup)

---

## Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. In the **Account** column, select your account or create new
4. In the **Property** column, click **Create Property**
5. Enter property details:
   - **Property name**: PicForge
   - **Reporting time zone**: Your timezone
   - **Currency**: USD
6. Click **Next** and fill in business information
7. Click **Create** and accept Terms of Service

### Step 2: Get Measurement ID

1. In Property Settings, go to **Data Streams**
2. Click **Add stream** > **Web**
3. Enter:
   - **Website URL**: https://pic-forge.com
   - **Stream name**: PicForge Production
4. Click **Create stream**
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Configure Environment Variable

Add to `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Step 4: Deploy & Verify

1. Commit changes and push to deploy
2. Visit your live site
3. In GA4, go to **Reports** > **Realtime**
4. You should see your visit within 30 seconds

---

## Google Search Console Setup

### Step 1: Add Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add Property** (top left dropdown)
3. Select **URL prefix** method
4. Enter: `https://pic-forge.com`
5. Click **Continue**

### Step 2: HTML Tag Verification Method

1. In the verification screen, select **HTML tag** method
2. Copy the verification code (format: `google-site-verification=XXXXXXXX`)
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXXXXX
   ```
4. Deploy changes
5. Return to Search Console and click **Verify**

### Step 3: Submit Sitemap

1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `https://pic-forge.com/sitemap.xml`
3. Click **Submit**
4. Wait 24-48 hours for indexing to begin

### Step 4: Verify Robots.txt

1. In Search Console, go to **Settings** > **Crawler stats**
2. Check robots.txt at: `https://pic-forge.com/robots.txt`
3. Ensure it's properly formatted and accessible

---

## Environment Variables

Complete `.env.local` configuration:

```bash
# Google Analytics 4
# Get from: https://analytics.google.com/analytics/web/ (Format: G-XXXXXXXXXX)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console Verification
# Get from: https://search.google.com/search-console (HTML tag method)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXXXXX

# Enable GA in development (optional, default: false)
# NEXT_PUBLIC_GA_DEBUG=true
```

**Important Notes:**
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Never commit actual values to Git (keep in `.env.local`)
- Add to Vercel environment variables for production

---

## Event Tracking Reference

All events are automatically tracked. Here's what's being monitored:

### Image Transformation Events

**Event:** `image_transformation`

Triggered when user generates an image with AI.

**Parameters:**
- `prompt_category` - Category of prompt (Art Styles, Nature, etc.)
- `prompt_title` - Actual prompt text (truncated to 100 chars)
- `locked_composition` - Boolean: was Lock Composition enabled?
- `is_nsfw` - Boolean: NSFW editor or regular?
- `processing_time_ms` - Time taken to process (optional)
- `image_size_bytes` - Size of uploaded image (optional)

**Where tracked:**
- Main editor (`/`)
- NSFW editor (`/editor-nsfw`)
- Batch processor (`/batch`)

### Prompt Library Events

**Event:** `prompt_usage`

Triggered when user selects a prompt from library.

**Parameters:**
- `prompt_category` - Category (Art Styles, Fantasy, etc.)
- `prompt_title` - Prompt name
- `source` - Where prompt was selected from (library, template, roulette, wizard, custom)

**Where tracked:**
- Prompts library (`/prompts`)
- Template selector
- Transform Roulette (`/roulette`)
- Prompt Wizard (`/prompt-wizard`)

### User Authentication Events

**Event:** `sign_up` / `sign_in`

Triggered on user authentication.

**Parameters:**
- `method` - Authentication method (magic_link, email)

**Where tracked:**
- AuthButton component

### Promo Code Events

**Event:** `promo_code_redemption`

Triggered when user successfully redeems a promo code.

**Parameters:**
- `code_tier` - Tier granted (unlimited, pro)
- `code_type` - Type of code (founder, family, beta)
- `value` - Conversion value (1 for unlimited, 0 for others)

**Where tracked:**
- Profile page (`/profile`)
- usePromoCode hook

### Daily Limit Events

**Event:** `daily_limit_reached`

Triggered when free tier user hits 20 image limit.

**Parameters:**
- `current_count` - Number of images generated
- `limit` - Daily limit (20 for free tier)

**Where tracked:**
- Before image processing (main editor, batch)

### Upgrade Click Events

**Event:** `upgrade_click`

Triggered when user clicks upgrade/pricing buttons.

**Parameters:**
- `source` - Where click originated (limit_reached, pricing_page, profile, watermark_notice)
- `tier_clicked` - Which tier (pro, yearly)

**Where tracked:**
- Pricing cards
- Limit reached modals
- Watermark notices

### Social Share Events

**Event:** `social_share`

Triggered when user shares or downloads images.

**Parameters:**
- `platform` - Platform shared to (twitter, instagram, tiktok, download)
- `content_type` - Type of content (single, before_after)

**Where tracked:**
- ShareModal component
- Download buttons

### Favorite Prompt Events

**Event:** `favorite_prompt`

Triggered when user favorites/unfavorites a prompt.

**Parameters:**
- `action` - Action taken (add, remove)
- `category` - Prompt category
- `event_label` - Prompt title

**Where tracked:**
- Prompt library (`/prompts`)
- Prompt cards

### Batch Processing Events

**Event:** `batch_process`

Triggered when batch processing completes.

**Parameters:**
- `image_count` - Number of images processed
- `effect_type` - Effect applied (sharpen, vignette, etc.)
- `is_nsfw` - Boolean: NSFW batch or regular?

**Where tracked:**
- Batch processor (`/batch`)
- NSFW batch (`/batch-nsfw`)

### Gamification Events

**Event:** `roast_generation`
- **Parameters:** `intensity` (mild, spicy, nuclear)
- **Where:** Roast Mode (`/roast`)

**Event:** `canvas_generation`
- **Parameters:** `size`, `quality`, `success`, `prompt_length`
- **Where:** AI Canvas (`/canvas`)

**Event:** `roulette_spin`
- **Parameters:** `category`, `event_label` (prompt title)
- **Where:** Transform Roulette (`/roulette`)

**Event:** `prompt_wizard_complete`
- **Parameters:** `steps_completed`, `final_prompt_length`
- **Where:** Prompt Wizard (`/prompt-wizard`)

**Event:** `template_used`
- **Parameters:** `event_label` (template name)
- **Where:** Template selector

### Error Tracking

**Event:** `error_occurred`

Triggered on application errors.

**Parameters:**
- `error_type` - Type of error
- `error_message` - Error message
- `page_path` - Where error occurred

---

## Testing & Verification

### Development Testing

Enable GA in development by adding to `.env.local`:
```bash
NEXT_PUBLIC_GA_DEBUG=true
```

Check browser console for GA events:
```javascript
// Open DevTools > Console
// Filter by "GA Event" to see tracked events
```

### Production Testing

1. **Real-time Reports:**
   - Go to GA4 > Reports > Realtime
   - Perform actions on your site
   - See events appear within 30 seconds

2. **Debug View (Chrome Extension):**
   - Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
   - Enable extension
   - Check Console for detailed GA debugging

3. **GA4 DebugView:**
   - In GA4, go to **Admin** > **DebugView**
   - Enable debug mode on your device
   - See real-time event tracking with full parameters

### Event Verification Checklist

Test each event type:
- [ ] Image transformation (main editor)
- [ ] Prompt selection (library)
- [ ] Sign up / Sign in
- [ ] Promo code redemption
- [ ] Daily limit reached
- [ ] Upgrade click
- [ ] Social share (Twitter, Instagram)
- [ ] Download image
- [ ] Favorite prompt (add/remove)
- [ ] Batch processing
- [ ] Roast generation
- [ ] Canvas generation
- [ ] Roulette spin
- [ ] Prompt wizard completion

---

## Dashboard Setup

### Custom Reports to Create

#### 1. User Engagement Dashboard

**Metrics:**
- Total users (last 7 days)
- Active users (last 24 hours)
- Images generated (custom metric)
- Prompts used (custom metric)
- Shares (custom metric)

**Dimensions:**
- User tier (free, pro, unlimited)
- Source/Medium
- Device category

#### 2. Conversion Funnel

Track user journey:
1. Page view → Main editor
2. Image upload
3. Prompt selection
4. Image transformation
5. Download/Share
6. Sign up
7. Promo code redemption OR upgrade click

**Create in GA4:**
- Go to **Explore** > **Funnel exploration**
- Add steps for each stage above

#### 3. Popular Prompts Report

**Primary dimension:** `prompt_title`
**Secondary dimension:** `prompt_category`
**Metrics:** Event count, Unique users

**Filter:** `event_name = prompt_usage`

#### 4. Conversion Report

Track revenue-driving events:
- Promo code redemptions (by tier)
- Upgrade clicks (by source)
- Sign ups (by source)

**Set up as Key Events:**
1. Go to **Admin** > **Data display** > **Events**
2. Mark as key events:
   - `promo_code_redemption`
   - `sign_up`
   - `upgrade_click`

#### 5. User Retention Analysis

**Cohort Analysis:**
- Go to **Explore** > **Cohort exploration**
- Cohort by: First visit date
- Return criteria: `image_transformation` event

### Custom Metrics & Dimensions

#### Custom Metrics to Create:
1. **Images Generated** - Count of `image_transformation` events
2. **Prompts Used** - Count of `prompt_usage` events
3. **Social Shares** - Count of `social_share` events

#### Custom Dimensions to Create:
1. **User Tier** - From `user_tier` user property
2. **Prompt Category** - From `prompt_category` event parameter
3. **Locked Composition** - From `locked_composition` event parameter

**To create:**
1. Go to **Admin** > **Data display** > **Custom definitions**
2. Click **Create custom dimension/metric**
3. Add each one with proper scope (User/Event)

---

## Conversion Goals

Set up goals to track key actions:

### Goal 1: First Image Generated
- **Event:** `image_transformation`
- **Condition:** First occurrence per user
- **Value:** 0 (just tracking)

### Goal 2: Power User (10+ Images)
- **Event:** `image_transformation`
- **Condition:** User property `total_transformations >= 10`
- **Value:** 0

### Goal 3: Promo Code Redemption
- **Event:** `promo_code_redemption`
- **Value:** 1 (assign conversion value)

### Goal 4: Upgrade Click
- **Event:** `upgrade_click`
- **Value:** 0 (leads to external payment)

**To set up:**
1. Go to **Admin** > **Data display** > **Events**
2. Click **Mark as key event** for each goal event
3. Use in **Explore** reports for conversion analysis

---

## Troubleshooting

### Events not showing in GA4?

1. **Check Measurement ID:** Ensure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correct
2. **Verify deployment:** Changes must be deployed to production
3. **Wait 24-48 hours:** Some reports have processing delay
4. **Check browser console:** Look for GA errors
5. **Disable ad blockers:** They often block GA scripts

### Search Console not verifying?

1. **Check meta tag:** View source on live site, look for verification tag
2. **Deployment delay:** Wait 5-10 minutes after deploy
3. **HTTPS required:** Ensure site is on HTTPS
4. **Try alternative method:** DNS verification or HTML file upload

### Sitemap not indexed?

1. **Check robots.txt:** Ensure it allows crawling
2. **Valid XML:** Visit `/sitemap.xml` directly to check format
3. **Give it time:** Can take 1-2 weeks for full indexing
4. **Check coverage report:** Look for specific errors in Search Console

---

## Next Steps

After setup is complete:

1. **Week 1:** Monitor real-time events, verify tracking works
2. **Week 2:** Analyze user behavior patterns
3. **Week 3:** Identify top-performing prompts and categories
4. **Week 4:** Track conversion funnel, identify drop-off points
5. **Ongoing:** Monthly reports on growth, retention, and revenue

### Key Metrics to Watch

**Daily:**
- Active users
- Images generated
- Errors occurred

**Weekly:**
- New sign-ups
- Promo code redemptions
- Popular prompts
- Social shares

**Monthly:**
- User retention (cohort analysis)
- Conversion rate (sign-up to power user)
- Top traffic sources
- Device breakdown

---

## Support Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Search Console Help](https://support.google.com/webmasters/answer/9128668)
- [Event Tracking Best Practices](https://support.google.com/analytics/answer/9267735)
- [Conversion Tracking Guide](https://support.google.com/analytics/answer/9267568)

---

## Files Modified

This implementation includes:

1. **`lib/analytics.ts`** - Core analytics tracking functions
2. **`components/GoogleAnalytics.tsx`** - GA4 script component
3. **`app/layout.tsx`** - Added GA to root layout
4. **`app/sitemap.ts`** - Dynamic sitemap generation
5. **`app/robots.ts`** - Robots.txt configuration
6. **`hooks/useImageTracking.ts`** - Added GA event tracking
7. **`hooks/usePromoCode.ts`** - Added promo code tracking
8. **`components/ShareModal.tsx`** - Added social share tracking
9. **`.env.local`** - Added GA and Search Console variables

All tracking is non-blocking and privacy-friendly. No personal data is collected without user consent.

---

**Setup Status:** ✅ Complete - Ready for production deployment

**Last Updated:** October 22, 2025
