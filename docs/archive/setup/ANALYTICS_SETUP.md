# Google Analytics 4 & Search Console Setup Guide

Complete guide for setting up GA4 analytics tracking and Google Search Console for PicForge.

## Table of Contents
- [Overview](#overview)
- [Part 1: Google Analytics 4 Setup](#part-1-google-analytics-4-setup)
- [Part 2: Google Search Console Setup](#part-2-google-search-console-setup)
- [Part 3: Event Tracking Reference](#part-3-event-tracking-reference)
- [Part 4: Custom Reports & Dashboards](#part-4-custom-reports--dashboards)
- [Part 5: Conversion Goals](#part-5-conversion-goals)
- [Part 6: Testing & Verification](#part-6-testing--verification)

---

## Overview

PicForge uses a comprehensive analytics stack to track user behavior, conversions, and SEO performance:

- **Google Analytics 4**: Event-based analytics for user behavior tracking
- **Google Search Console**: SEO performance and search visibility monitoring
- **Vercel Analytics**: Performance monitoring and page view tracking
- **InstantDB**: User data and conversion tracking

### Key Metrics Tracked
- Image transformations and prompt usage
- User signups and tier upgrades
- Social shares and downloads
- Search queries and filter usage
- Conversion funnels and user journeys

---

## Part 1: Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. Under **Account**, click **Create Account** (if needed)
4. Under **Property**, click **Create Property**
5. Fill in property details:
   - **Property name**: PicForge
   - **Reporting time zone**: Your timezone
   - **Currency**: USD
6. Click **Next**
7. Select business details:
   - **Industry**: Technology / Software as a Service
   - **Business size**: Small (1-10 employees)
8. Select business objectives:
   - Generate leads
   - Examine user behavior
   - Measure customer engagement
9. Click **Create**
10. Accept Terms of Service

### Step 2: Get Your Measurement ID

1. In GA4 Admin, go to **Data Streams**
2. Click **Add stream** → **Web**
3. Enter website URL: `https://pic-forge.com`
4. Stream name: `PicForge Production`
5. Click **Create stream**
6. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### Step 3: Configure Environment Variables

Add to your `.env.local` file:

```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Enable GA4 in development
NEXT_PUBLIC_GA_DEBUG=false
```

### Step 4: Enable Enhanced Measurement

In your GA4 Data Stream settings, enable:

- ✅ **Page views** (automatic)
- ✅ **Scrolls** (90% scroll depth)
- ✅ **Outbound clicks** (external links)
- ✅ **Site search** (URL query parameter: `search`)
- ✅ **Video engagement** (if applicable)
- ✅ **File downloads** (PDF, ZIP)

### Step 5: Configure User Properties

In GA4, go to **Configure** → **Custom definitions** → **Create custom dimensions**

Create these custom dimensions:

| Dimension Name | Scope | Description | Event Parameter |
|---------------|-------|-------------|----------------|
| user_tier | User | User's subscription tier | user_tier |
| prompt_category | Event | Category of prompt used | prompt_category |
| share_platform | Event | Social sharing platform | platform |
| referral_source | User | How user found the site | referral_code |
| is_nsfw | Event | NSFW content flag | is_nsfw |
| locked_composition | Event | Lock composition feature | locked_composition |

### Step 6: Deploy to Production

1. Push your changes to production
2. Visit https://pic-forge.com
3. Open GA4 Realtime report
4. Verify you see your session appear

---

## Part 2: Google Search Console Setup

### Step 1: Add Property to Search Console

1. Go to [Google Search Console](https://search.google.com/search-console/welcome)
2. Click **Add Property**
3. Select **URL prefix** method
4. Enter: `https://pic-forge.com`
5. Click **Continue**

### Step 2: Verify Ownership

You have two verification options:

#### Option A: Meta Tag Verification (Recommended)

1. Copy the verification meta tag from Search Console
2. Extract just the verification code (the part after `content="`)
3. Add to your `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abcd1234efgh5678ijkl
```

4. The verification tag is already in `app/layout.tsx` (line 112)
5. Deploy to production
6. Return to Search Console and click **Verify**

#### Option B: HTML File Verification

1. Download the verification file from Search Console
2. Place it in the `public/` directory
3. Deploy to production
4. Verify the file is accessible at: `https://pic-forge.com/googleXXXXXXXX.html`
5. Return to Search Console and click **Verify**

### Step 3: Submit Sitemap

1. In Search Console, go to **Sitemaps**
2. Add new sitemap URL: `https://pic-forge.com/sitemap.xml`
3. Click **Submit**
4. Wait 24-48 hours for initial crawl

### Step 4: Configure Settings

1. **URL Inspection Tool**: Test individual pages
2. **Coverage Report**: Monitor indexing status
3. **Performance Report**: Track search rankings and clicks
4. **Core Web Vitals**: Monitor page speed metrics

### Step 5: Request Indexing (Optional)

For important pages, manually request indexing:

1. Go to **URL Inspection**
2. Enter page URL (e.g., `https://pic-forge.com/prompts`)
3. Click **Request Indexing**
4. Repeat for key pages

Priority pages to index first:
- / (homepage)
- /prompts
- /batch
- /canvas
- /roulette
- /pricing

---

## Part 3: Event Tracking Reference

### Core Events

All events are tracked using the `trackEvent()` function from `lib/analytics.ts`.

#### Image Transformation
```typescript
import { trackImageTransformation } from '@/lib/analytics';

trackImageTransformation({
  prompt_category: 'Art Styles',
  prompt_title: 'Van Gogh Painting',
  locked_composition: true,
  is_nsfw: false,
  processing_time: 2500, // milliseconds
  image_size: 1024000, // bytes
});
```

#### Prompt Usage
```typescript
import { trackPromptUsage } from '@/lib/analytics';

trackPromptUsage({
  prompt_category: 'Art Styles',
  prompt_title: 'Van Gogh Painting',
  source: 'library', // 'library' | 'custom' | 'template' | 'roulette' | 'wizard'
});
```

#### User Signup
```typescript
import { trackSignUp } from '@/lib/analytics';

trackSignUp('magic_link'); // 'magic_link' | 'email'
```

#### Promo Code Redemption
```typescript
import { trackPromoCodeRedemption } from '@/lib/analytics';

trackPromoCodeRedemption({
  code_tier: 'unlimited', // 'free' | 'pro' | 'unlimited'
  code_type: 'founder', // 'founder' | 'referral' | 'promo'
});
```

#### Social Share
```typescript
import { trackSocialShare } from '@/lib/analytics';

trackSocialShare({
  platform: 'twitter', // 'twitter' | 'instagram' | 'tiktok' | 'download'
  content_type: 'before_after', // 'single' | 'before_after'
});
```

#### Prompt Search
```typescript
import { trackPromptSearch } from '@/lib/analytics';

trackPromptSearch(
  'Van Gogh', // search query
  15, // results count
  { category: 'Art Styles', tags: ['painting', 'artistic'] }
);
```

#### Filter Usage
```typescript
import { trackFilterUsage } from '@/lib/analytics';

trackFilterUsage(
  'category', // 'category' | 'tag'
  'Art Styles', // filter value
  42 // results count
);
```

#### Button Click
```typescript
import { trackButtonClick } from '@/lib/analytics';

trackButtonClick(
  'upgrade_to_pro', // button name
  'limit_reached_modal', // location
  { current_usage: 20, limit: 20 } // optional metadata
);
```

#### Modal Open
```typescript
import { trackModalOpen } from '@/lib/analytics';

trackModalOpen(
  'share_modal', // modal name
  'gallery' // source (optional)
);
```

#### Download
```typescript
import { trackDownload } from '@/lib/analytics';

trackDownload('main_editor'); // 'main_editor' | 'batch' | 'share_modal' | 'gallery' | 'roulette' | 'canvas'
```

#### Batch Processing
```typescript
import { trackBatchProcess } from '@/lib/analytics';

trackBatchProcess(
  25, // image count
  'sharpen', // effect type
  false // is_nsfw
);
```

#### Roulette Spin
```typescript
import { trackRouletteSpinned } from '@/lib/analytics';

trackRouletteSpinned({
  category: 'Art Styles',
  prompt_title: 'Abstract Expressionism',
  spin_number: 7,
  streak: 3,
});
```

#### Canvas Generation
```typescript
import { trackCanvasGeneration } from '@/lib/analytics';

trackCanvasGeneration(
  'A futuristic cityscape at sunset', // prompt
  '1024x1024', // size
  'standard', // quality
  true // success
);
```

#### Showcase Submission
```typescript
import { trackShowcaseSubmit } from '@/lib/analytics';

trackShowcaseSubmit({
  has_description: true,
  prompt_used: 'Van Gogh Painting',
});
```

#### Error Tracking
```typescript
import { trackError } from '@/lib/analytics';

trackError({
  error_type: 'api_error',
  error_message: 'Failed to process image',
  page_path: '/batch',
});
```

### User Properties

Set user properties for segmentation:

```typescript
import { setUserProperties } from '@/lib/analytics';

setUserProperties({
  user_tier: 'pro', // 'free' | 'pro' | 'unlimited'
  has_generated_images: true,
  total_transformations: 47,
  favorite_category: 'Art Styles',
  registration_date: '2025-10-22',
});
```

### Conversion Tracking

Track high-value conversions:

```typescript
import { trackEnhancedConversion } from '@/lib/analytics';

trackEnhancedConversion(
  'upgrade', // 'signup' | 'upgrade' | 'referral' | 'share'
  29.99, // value
  { from_tier: 'free', to_tier: 'pro' } // metadata
);
```

---

## Part 4: Custom Reports & Dashboards

### Recommended GA4 Explorations

#### 1. User Journey Funnel

Track the conversion funnel from landing to signup:

1. Go to **Explore** → **Blank** → **Funnel exploration**
2. Add steps:
   - Step 1: `page_view` (/)
   - Step 2: `image_transformation`
   - Step 3: `daily_limit_reached`
   - Step 4: `upgrade_click`
   - Step 5: `sign_up`
   - Step 6: `promo_code_redemption`

#### 2. Prompt Performance Report

Identify most popular prompts:

1. Go to **Explore** → **Blank** → **Free form**
2. Dimensions:
   - `prompt_category`
   - `prompt_title`
   - `source` (library/custom/roulette)
3. Metrics:
   - `Event count` (prompt_usage)
   - `Active users`
   - `Average engagement time`
4. Add filter: `event_name = prompt_usage`

#### 3. Feature Adoption Dashboard

Track which features users engage with:

1. Go to **Explore** → **Blank** → **Free form**
2. Dimensions:
   - `Event name`
   - `page_path`
3. Metrics:
   - `Event count`
   - `Total users`
   - `Events per user`
4. Add segments by `user_tier`

#### 4. Social Sharing Analysis

Understand which sharing platforms drive engagement:

1. Go to **Explore** → **Blank** → **Free form**
2. Dimensions:
   - `platform` (custom dimension)
   - `content_type` (custom dimension)
3. Metrics:
   - `Event count` (social_share)
   - `Active users`
4. Add filter: `event_name = social_share`

#### 5. User Tier Comparison

Compare behavior across free, pro, and unlimited users:

1. Go to **Explore** → **Blank** → **Free form**
2. Add segment: `user_tier` dimension
3. Compare metrics:
   - Total transformations
   - Average session duration
   - Bounce rate
   - Conversion rate

### Key Performance Indicators (KPIs)

Track these metrics weekly:

| KPI | Target | How to Track |
|-----|--------|--------------|
| Weekly Active Users | +10% MoM | GA4 → Reports → Engagement |
| Average Transformations per User | 5+ | Custom event: `image_transformation` |
| Signup Conversion Rate | 15% | Funnel: visitors → signups |
| Pro Upgrade Rate | 5% | Funnel: free users → pro users |
| Social Share Rate | 20% | `social_share` / `image_transformation` |
| Prompt Library Engagement | 60% | Users who visit `/prompts` |
| Batch Processing Adoption | 30% | Users who use `/batch` |
| Daily Limit Hit Rate | 40% | `daily_limit_reached` events |

---

## Part 5: Conversion Goals

### Primary Conversions

Set up these conversions in GA4:

1. Go to **Configure** → **Events**
2. Click **Mark as conversion** for these events:

| Event Name | Purpose | Value |
|------------|---------|-------|
| `sign_up` | User creates account | 1 |
| `promo_code_redemption` | User upgrades to unlimited | 5 |
| `referral_signup` | User signs up via referral | 2 |
| `upgrade_click` | User attempts to upgrade | 0.5 |
| `showcase_submit` | User shares creation | 0.25 |

### Google Ads Conversion Tracking

If running Google Ads, create conversion actions:

1. Go to **Admin** → **Conversions**
2. Click **New conversion event**
3. Create conversions:
   - **Sign Up**: Goal = Sign-up, Value = $1
   - **Pro Upgrade**: Goal = Purchase, Value = $29.99
   - **Unlimited Upgrade**: Goal = Purchase, Value = $49.99

### Attribution Models

Analyze which marketing channels drive conversions:

1. Go to **Advertising** → **Attribution**
2. Compare attribution models:
   - **Last click**: Default attribution
   - **First click**: Credit to first touchpoint
   - **Linear**: Equal credit to all touchpoints
   - **Time decay**: More credit to recent touchpoints

---

## Part 6: Testing & Verification

### Local Testing

Test GA4 events locally:

```bash
# Enable GA4 in development
NEXT_PUBLIC_GA_DEBUG=true npm run dev
```

Open browser console and perform actions. Events will log to console.

### Production Testing

1. Visit https://pic-forge.com
2. Open GA4 → **Realtime** report
3. Perform test actions:
   - Transform an image
   - Search for a prompt
   - Click upgrade button
   - Share an image
4. Verify events appear in Realtime report (30-second delay)

### GA4 Debug View

Enable debug mode to see detailed event data:

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension
2. Click extension icon to enable
3. Perform actions on site
4. Check GA4 → **Configure** → **DebugView**

### Search Console Verification

1. Go to Search Console → **URL Inspection**
2. Test key pages:
   - https://pic-forge.com/
   - https://pic-forge.com/prompts
   - https://pic-forge.com/batch
3. Verify:
   - ✅ URL is on Google
   - ✅ Sitemaps detected
   - ✅ Indexing allowed
   - ✅ Page is mobile-friendly

### Common Issues & Fixes

#### GA4 Not Tracking

**Issue**: No events showing in GA4 Realtime

**Solutions**:
1. Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Verify measurement ID format: `G-XXXXXXXXXX`
3. Check browser console for errors
4. Disable ad blockers
5. Wait 30-60 seconds for events to appear

#### Search Console Not Verifying

**Issue**: Verification fails

**Solutions**:
1. Ensure meta tag is in `<head>` of HTML
2. Check `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var is set
3. Deploy changes to production
4. Wait 1-2 minutes, then retry verification
5. Try alternative verification methods (HTML file, DNS)

#### Sitemap Not Found

**Issue**: Search Console can't find sitemap

**Solutions**:
1. Verify sitemap accessible: https://pic-forge.com/sitemap.xml
2. Check for XML formatting errors
3. Ensure sitemap URL uses HTTPS (not HTTP)
4. Re-submit sitemap in Search Console
5. Check `robots.ts` includes sitemap reference

---

## Event Tracking Best Practices

### Do's
- ✅ Track user actions, not page views (GA4 does this automatically)
- ✅ Use consistent event naming (snake_case)
- ✅ Include context with custom parameters
- ✅ Set user properties for segmentation
- ✅ Test events in development before deploying
- ✅ Document new events in this guide

### Don'ts
- ❌ Don't track personally identifiable information (PII)
- ❌ Don't send sensitive data (passwords, API keys)
- ❌ Don't track every minor interaction (creates noise)
- ❌ Don't use inconsistent parameter names
- ❌ Don't forget to mark key events as conversions

---

## Quick Reference

### Important Links
- **GA4 Property**: https://analytics.google.com/analytics/web/
- **Search Console**: https://search.google.com/search-console/
- **Sitemap URL**: https://pic-forge.com/sitemap.xml
- **Robots.txt**: https://pic-forge.com/robots.txt

### Environment Variables
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code_here
NEXT_PUBLIC_GA_DEBUG=false
```

### Key Files
- `lib/analytics.ts` - Event tracking functions
- `components/GoogleAnalytics.tsx` - GA4 initialization
- `app/layout.tsx` - Structured data & meta tags
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt configuration

---

## Support & Resources

### Google Documentation
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Tracking](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Search Console Help](https://support.google.com/webmasters/answer/9128668)
- [Structured Data Testing](https://search.google.com/test/rich-results)

### Internal Resources
- Analytics implementation: `lib/analytics.ts`
- Event tracking examples: See Part 3 above
- Custom reports: See Part 4 above

### Questions?
Contact: derek.bobola@gmail.com

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0
