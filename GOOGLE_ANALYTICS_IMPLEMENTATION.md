# Google Analytics 4 Implementation Guide

## Overview
PicForge uses Google Analytics 4 (GA4) for comprehensive user behavior tracking and business intelligence. This implementation is production-ready, privacy-compliant, and fully integrated across all major features.

## Setup Instructions

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use an existing one
3. Navigate to Admin > Data Streams > Web
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Enable GA in development
NEXT_PUBLIC_GA_DEBUG=true

# Google Search Console Verification (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code_here
```

### 3. Verify Installation

1. Start your development server: `npm run dev`
2. Open browser DevTools > Console
3. You should see: `Google Analytics initialized: G-XXXXXXXXXX`
4. Go to GA4 Real-Time view to see live data

### 4. Test Events

Use the browser console to test events:

```javascript
// Test page view
gtag('event', 'page_view', { page_path: '/test' });

// Test custom event
gtag('event', 'image_transformation', {
  prompt_category: 'Art Styles',
  locked_composition: false
});
```

## Architecture

### Component Structure

```
app/
  layout.tsx                    # GoogleAnalytics component mounted here
components/
  GoogleAnalytics.tsx           # Script loader and page view tracker
lib/
  analytics.ts                  # All tracking functions
hooks/
  useImageTracking.ts           # Image generation tracking (already integrated)
  usePromoCode.ts              # Promo code redemption tracking (already integrated)
```

### How It Works

1. **GoogleAnalytics Component** (`components/GoogleAnalytics.tsx`)
   - Loads gtag.js script via Next.js `<Script>` component
   - Initializes GA4 with configuration
   - Tracks route changes automatically
   - Respects development mode (disabled unless `NEXT_PUBLIC_GA_DEBUG=true`)

2. **Analytics Library** (`lib/analytics.ts`)
   - Provides type-safe tracking functions
   - Handles window.gtag safely
   - Logs events to console in development
   - Includes proper TypeScript interfaces

3. **Hook Integration** (already implemented)
   - `useImageTracking` tracks transformations and sets user properties
   - `usePromoCode` tracks redemptions and conversions

## Events Tracked

### Core Events

| Event Name | Description | Parameters | Where Used |
|------------|-------------|------------|------------|
| `page_view` | Automatic page navigation | `page_path` | All routes |
| `image_transformation` | Image edited/transformed | `prompt_category`, `locked_composition`, `is_nsfw` | Main editor, batch |
| `sign_up` | New user registration | `method` | AuthButton |
| `sign_in` | User login | `method` | AuthButton |
| `promo_code_redemption` | Code redeemed | `code_tier`, `code_type` | Profile page |
| `download_image` | Image downloaded | `source` | All download buttons |
| `social_share` | Share button clicked | `platform`, `content_type` | ShareModal |

### Feature Events

| Event Name | Description | Parameters | Where Used |
|------------|-------------|------------|------------|
| `batch_process` | Batch processing started | `image_count`, `effect_type`, `is_nsfw` | Batch pages |
| `canvas_generation` | AI image generated | `prompt_length`, `size`, `quality`, `success` | Canvas page |
| `roulette_spin` | Roulette wheel spun | `category`, `spin_number`, `streak` | Roulette page |
| `roast_generation` | AI roast created | `intensity` | Roast page |
| `prompt_wizard_complete` | Wizard completed | `steps_completed`, `final_prompt_length` | Prompt Wizard |
| `template_used` | Template selected | `template_name`, `source` | Template Selector |
| `prompt_usage` | Prompt from library | `prompt_category`, `prompt_title`, `source` | Prompts page |
| `favorite_prompt` | Prompt favorited | `action`, `category` | Everywhere |
| `showcase_submit` | Showcase submission | `has_description`, `prompt_used` | Showcase submit |
| `showcase_vote` | Showcase item voted | `submission_id`, `vote_type` | Showcase page |

### Business Events

| Event Name | Description | Parameters | Where Used |
|------------|-------------|------------|------------|
| `daily_limit_reached` | Free tier limit hit | `current_count`, `limit` | Editor (when limit reached) |
| `upgrade_click` | Upgrade button clicked | `source`, `tier_clicked` | Pricing, watermark notice |
| `error_occurred` | Error logged | `error_type`, `error_message`, `page_path` | Error boundaries |

## User Properties

User properties are automatically set for segmentation:

```typescript
{
  user_tier: 'free' | 'pro' | 'unlimited',
  has_generated_images: boolean,
  total_transformations: number,
  favorite_category: string,
  registration_date: string
}
```

These are tracked in `useImageTracking` hook.

## Adding Tracking to New Features

### Example 1: Track Button Click

```typescript
import { trackEvent } from '@/lib/analytics';

function MyButton() {
  const handleClick = () => {
    // Track the event
    trackEvent('my_custom_event', {
      event_category: 'engagement',
      button_location: 'header',
      user_action: 'clicked'
    });

    // Your logic here
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Example 2: Track Page Visit

```typescript
'use client'

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function MyPage() {
  useEffect(() => {
    trackPageView('/my-page');
  }, []);

  return <div>My Page Content</div>;
}
```

### Example 3: Track Form Submission

```typescript
import { trackEvent } from '@/lib/analytics';

const handleSubmit = async (formData: FormData) => {
  const startTime = Date.now();

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const processingTime = Date.now() - startTime;

      trackEvent('form_submission', {
        event_category: 'engagement',
        success: true,
        processing_time_ms: processingTime
      });
    }
  } catch (error) {
    trackEvent('form_submission', {
      event_category: 'engagement',
      success: false,
      error_message: error.message
    });
  }
};
```

## Testing Checklist

Before deploying to production, verify:

- [ ] GA4 Measurement ID is set in environment variables
- [ ] Events appear in GA4 Real-Time view
- [ ] Page views are tracked on all routes
- [ ] User properties are set correctly
- [ ] No PII (personally identifiable information) is tracked
- [ ] Events work in both dev and prod environments
- [ ] Error tracking doesn't include sensitive data

## Privacy & Compliance

### GDPR/CCPA Compliance

Our implementation is privacy-compliant:

1. **No PII Tracking**: We never track:
   - Email addresses
   - Full names
   - IP addresses (beyond GA4's anonymized collection)
   - Payment information

2. **User Control**: Users can:
   - Opt-out via browser Do Not Track
   - Clear cookies to reset tracking
   - Request data deletion

3. **Data Retention**: GA4 default retention (14 months)

### Cookie Usage

GA4 uses these cookies:
- `_ga`: Main cookie (2 years)
- `_ga_<container-id>`: Session cookie (2 years)
- `_gid`: User identification (24 hours)

All cookies are set with `SameSite=None;Secure` flags.

## GA4 Dashboard Setup

### Recommended Custom Reports

1. **User Journey Report**
   - Dimension: Event name
   - Metrics: Event count, Users, Sessions
   - Filter: Exclude `page_view`

2. **Conversion Funnel**
   - Steps: `page_view` → `sign_up` → `image_transformation` → `download_image`

3. **Feature Adoption**
   - Dimensions: `event_name`, `user_tier`
   - Metrics: Event count, Unique users

4. **Daily Limits Impact**
   - Event: `daily_limit_reached`
   - Secondary: `upgrade_click` where source = 'limit_reached'

### Key Metrics to Monitor

1. **Engagement Metrics**
   - Daily/Monthly Active Users (DAU/MAU)
   - Average transformations per user
   - Session duration on editor pages

2. **Conversion Metrics**
   - Sign-up rate
   - Promo code redemption rate
   - Free-to-Pro conversion rate

3. **Feature Usage**
   - Most popular prompt categories
   - Batch vs. single processing ratio
   - Roulette spin frequency

4. **Performance Indicators**
   - Daily limit hit rate
   - Error occurrence frequency
   - Average processing time

## Troubleshooting

### Events Not Showing in GA4

1. Check Measurement ID is correct
2. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
3. Look for console errors
4. Check GA4 Real-Time view (not standard reports - those have delays)
5. Ensure cookies are enabled in browser

### Events Show in Dev, Not Prod

1. Verify environment variable is set on Vercel
2. Check production build includes the variable
3. Verify no ad blockers are interfering

### TypeScript Errors

If you see TypeScript errors:

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Advanced Features

### Conversion Tracking for Google Ads

```typescript
import { trackConversion } from '@/lib/analytics';

// Track when user upgrades
trackConversion('upgrade_conversion', 29.99, 'USD');
```

### Custom Dimensions

Add to `lib/analytics.ts`:

```typescript
export const setCustomDimension = (
  dimension: string,
  value: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', dimension, value);
};
```

## Support

For issues or questions:
1. Check GA4 documentation: https://developers.google.com/analytics/devguides/collection/ga4
2. Review this guide
3. Test in development with `NEXT_PUBLIC_GA_DEBUG=true`
4. Check browser console for errors

## Files to Review

Key implementation files:

```
C:\Users\derek\OneDrive\Desktop\nano\components\GoogleAnalytics.tsx
C:\Users\derek\OneDrive\Desktop\nano\lib\analytics.ts
C:\Users\derek\OneDrive\Desktop\nano\hooks\useImageTracking.ts
C:\Users\derek\OneDrive\Desktop\nano\hooks\usePromoCode.ts
C:\Users\derek\OneDrive\Desktop\nano\app\layout.tsx
```

---

Implementation Date: October 22, 2025
Status: Production Ready
Version: 1.0
