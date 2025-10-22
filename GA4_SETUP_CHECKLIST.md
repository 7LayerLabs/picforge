# GA4 Setup & Deployment Checklist

## Pre-Deployment Setup

### 1. Create GA4 Property

- [ ] Go to [Google Analytics](https://analytics.google.com/)
- [ ] Click "Admin" (bottom left)
- [ ] Under "Property", click "Create Property"
- [ ] Property name: `PicForge` (or your preferred name)
- [ ] Select timezone and currency
- [ ] Click "Next" and complete setup wizard
- [ ] Note your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Data Stream

- [ ] In Property settings, go to "Data Streams"
- [ ] Click "Add stream" > "Web"
- [ ] Website URL: `https://pic-forge.com`
- [ ] Stream name: `PicForge Production`
- [ ] **Enhanced measurement**: Enable all (recommended)
  - Page views ✓
  - Scrolls ✓
  - Outbound clicks ✓
  - Site search ✓
  - Video engagement ✓
  - File downloads ✓
- [ ] Copy your **Measurement ID** from stream details

### 3. Update Environment Variables

Add to `.env.local`:

```bash
# Google Analytics 4 - REQUIRED
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Enable in development
NEXT_PUBLIC_GA_DEBUG=true

# Google Search Console Verification (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code_here
```

### 4. Set Vercel Environment Variables

Go to Vercel Dashboard > Your Project > Settings > Environment Variables:

```
Name: NEXT_PUBLIC_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
Environment: Production, Preview, Development
```

**Important**: Must use `NEXT_PUBLIC_` prefix for client-side access!

## Testing Checklist

### Local Testing

- [ ] Set `NEXT_PUBLIC_GA_DEBUG=true` in `.env.local`
- [ ] Run `npm run dev`
- [ ] Open browser DevTools Console
- [ ] Look for: `Google Analytics initialized: G-XXXXXXXXXX`
- [ ] Navigate to different pages
- [ ] Verify console logs show: `GA Event (dev): page_view`

### Test Core Events

Test each event in your local environment:

- [ ] **Page View**: Navigate to `/` → `/prompts` → `/canvas`
  - Console should show: `GA Event (dev): page_view`

- [ ] **Sign Up/In**: Click "Sign In" button
  - Should trigger authentication flow

- [ ] **Image Transformation**: Upload image, apply transformation
  - Console: `GA Event (dev): image_transformation`

- [ ] **Download**: Click any download button
  - Console: `GA Event (dev): download_image`

- [ ] **Canvas Generation**: Generate AI image
  - Console: `GA Event (dev): canvas_generation`

- [ ] **Roulette Spin**: Spin the wheel
  - Console: `GA Event (dev): roulette_spin`

- [ ] **Favorite Prompt**: Add/remove favorite
  - Console: `GA Event (dev): favorite_prompt`

- [ ] **Promo Code**: Redeem a code
  - Console: `GA Event (dev): promo_code_redemption`

### Production Testing

After deploying to production:

- [ ] Go to GA4 > Reports > **Real-time**
- [ ] Open your production site in incognito window
- [ ] Perform test actions
- [ ] Verify events appear in Real-time view (5-10 second delay)

**Events to verify**:
- [ ] Page views show up
- [ ] Custom events appear with correct parameters
- [ ] User count increases
- [ ] Geographic data is correct

## GA4 Configuration

### Set Up Custom Definitions (Optional)

Go to Admin > Property > Custom Definitions:

**Custom Dimensions** (Event-scoped):
- [ ] `prompt_category` - Text
- [ ] `user_tier` - Text
- [ ] `locked_composition` - Boolean
- [ ] `is_nsfw` - Boolean
- [ ] `effect_type` - Text
- [ ] `intensity` - Text

**Custom Metrics**:
- [ ] `processing_time_ms` - Standard (milliseconds)
- [ ] `image_count` - Standard (count)
- [ ] `spin_number` - Standard (count)
- [ ] `streak` - Standard (count)

### Create Conversion Events

Go to Admin > Property > Events > Mark as conversion:

- [ ] `promo_code_redemption` ← Mark as conversion
- [ ] `sign_up` ← Mark as conversion
- [ ] `upgrade_click` ← Mark as conversion (if applicable)

### Set Data Retention

- [ ] Go to Admin > Property > Data Settings > Data Retention
- [ ] Set to: **14 months** (maximum for free tier)
- [ ] Enable "Reset on new activity": **ON**

## Privacy & Compliance

### GDPR Compliance

- [ ] Update Privacy Policy with GA4 disclosure
- [ ] Mention cookie usage (\_ga, \_gid, \_ga_<container-id>)
- [ ] Provide opt-out instructions
- [ ] Link to [Google's Privacy Policy](https://policies.google.com/privacy)

### Cookie Consent (if required)

If you need cookie consent:

```typescript
// Install cookie consent library
npm install react-cookie-consent

// Add to layout.tsx
import CookieConsent from 'react-cookie-consent';

<CookieConsent>
  This site uses cookies for analytics...
</CookieConsent>
```

### Data Deletion Requests

Set up process for data deletion:
1. User contacts support
2. Get their User ID from InstantDB
3. Go to GA4 > Admin > Property > Data Deletion Requests
4. Submit request with User ID

## Monitoring & Alerts

### Set Up Alerts

Go to Admin > Property > Custom Alerts:

**Alert 1: High Error Rate**
- [ ] Alert name: "High Error Rate"
- [ ] Condition: `error_occurred` count > 50 in 1 hour
- [ ] Notify: Your email

**Alert 2: Low Daily Users**
- [ ] Alert name: "Low Active Users"
- [ ] Condition: Daily active users < 10
- [ ] Notify: Your email

**Alert 3: Conversion Drop**
- [ ] Alert name: "Sign-Up Drop"
- [ ] Condition: `sign_up` count < 5 in 1 day
- [ ] Notify: Your email

## Dashboard Setup

### Create Custom Dashboard

1. Go to Reports > Library
2. Click "Create new report"
3. Name: "PicForge Overview"

**Recommended Metrics**:

**User Engagement**
- [ ] Active Users (last 7 days)
- [ ] Sessions
- [ ] Average Session Duration
- [ ] Events per Session

**Feature Usage**
- [ ] `image_transformation` count
- [ ] `canvas_generation` count
- [ ] `roulette_spin` count
- [ ] `batch_process` count

**Conversions**
- [ ] `sign_up` count
- [ ] `promo_code_redemption` count
- [ ] `upgrade_click` count

**Errors**
- [ ] `error_occurred` count
- [ ] Top error types

### Set Up Funnels

Go to Explore > Funnel Exploration:

**Funnel 1: User Activation**
1. `page_view` (/)
2. `sign_up`
3. `image_transformation`
4. `download_image`

**Funnel 2: Upgrade Path**
1. `daily_limit_reached`
2. `upgrade_click`
3. `promo_code_redemption`

## Integration with Other Tools

### Google Search Console

- [ ] Go to [Search Console](https://search.google.com/search-console)
- [ ] Add property: `https://pic-forge.com`
- [ ] Verify via HTML tag method
- [ ] Copy verification code
- [ ] Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...`
- [ ] Deploy and verify

### Google Tag Manager (Optional)

If you want to use GTM instead:

1. Create GTM container
2. Install GTM script (replaces current GA4 script)
3. Add GA4 Configuration Tag
4. Set trigger: All Pages

## Troubleshooting

### Events Not Showing

**Symptom**: No events in Real-time view

**Check**:
- [ ] Measurement ID is correct in env vars
- [ ] `NEXT_PUBLIC_` prefix is used
- [ ] Vercel env vars are set
- [ ] Browser allows cookies
- [ ] No ad blockers active
- [ ] Check browser console for errors

### Events Show Locally, Not in Production

**Check**:
- [ ] Vercel environment variables are set for "Production"
- [ ] Recent deployment after env var change
- [ ] Hard refresh production site (Ctrl+Shift+R)
- [ ] Check Network tab for gtag.js loading

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### GA4 Shows Wrong Location

GA4 determines location by IP address. If using VPN or proxy, location may be incorrect. This is expected and doesn't affect other tracking.

## Post-Deployment Verification

Wait 24-48 hours after deployment, then verify:

- [ ] Go to GA4 > Reports > Real-time
- [ ] Check active users count
- [ ] Go to Reports > Engagement > Events
- [ ] Verify all custom events are logging
- [ ] Check Reports > User Attributes > Overview
- [ ] Verify user properties (user_tier, etc.) are being set

## Maintenance

### Weekly

- [ ] Check Real-time view for anomalies
- [ ] Review error_occurred events
- [ ] Monitor conversion rates

### Monthly

- [ ] Review most popular features
- [ ] Analyze user funnels
- [ ] Check for new error patterns
- [ ] Review data quality

### Quarterly

- [ ] Review and update custom events
- [ ] Audit event parameters
- [ ] Update privacy policy if needed
- [ ] Review data retention settings

## Files Modified in This Implementation

```
✅ C:\Users\derek\OneDrive\Desktop\nano\components\GoogleAnalytics.tsx
✅ C:\Users\derek\OneDrive\Desktop\nano\lib\analytics.ts
✅ C:\Users\derek\OneDrive\Desktop\nano\hooks\useImageTracking.ts
✅ C:\Users\derek\OneDrive\Desktop\nano\hooks\usePromoCode.ts
✅ C:\Users\derek\OneDrive\Desktop\nano\app\layout.tsx
✅ C:\Users\derek\OneDrive\Desktop\nano\app\roulette\page.tsx
✅ C:\Users\derek\OneDrive\Desktop\nano\app\canvas\page.tsx
✅ C:\Users\derek\OneDrive\Desktop\nano\.env.local (update required)
```

## Support Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [Debug View](https://support.google.com/analytics/answer/7201382)

## Quick Reference

**Your Measurement ID**: `____________________` (fill in after setup)

**Real-time View**: https://analytics.google.com/analytics/web/#/p[PROPERTY_ID]/realtime/overview

**Debug View**: Admin > Property > DebugView (only shows debug mode traffic)

**Data Retention**: 14 months

**Implementation Status**: ✅ Complete - Ready for Production

---

Last Updated: October 22, 2025
Created By: Analytics Implementation Specialist
Status: Ready for Deployment
