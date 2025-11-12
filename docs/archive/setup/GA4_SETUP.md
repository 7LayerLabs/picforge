# Google Analytics 4 Setup Guide for PicForge.com

This guide walks you through setting up Google Analytics 4 tracking for PicForge.com, including GDPR-compliant cookie consent.

---

## Table of Contents

1. [Create GA4 Property](#1-create-ga4-property)
2. [Get Measurement ID](#2-get-measurement-id)
3. [Configure Vercel Environment Variables](#3-configure-vercel-environment-variables)
4. [Verify Tracking](#4-verify-tracking)
5. [Configure Custom Events](#5-configure-custom-events)
6. [Set Up Conversion Goals](#6-set-up-conversion-goals)
7. [Testing & Debugging](#7-testing--debugging)
8. [Privacy Compliance](#8-privacy-compliance)

---

## 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom-left)
3. Under **Account**, click **+ Create Account** (or select existing)
4. Fill in account details:
   - Account Name: `PicForge` or `Derek's Projects`
   - Check all data sharing settings
5. Click **Next**
6. Create a Property:
   - Property Name: `PicForge.com`
   - Time Zone: Your timezone (e.g., `America/New_York`)
   - Currency: `USD`
7. Click **Next**
8. Fill in business details:
   - Industry: `Technology` or `Software & Web Apps`
   - Business Size: Choose your size
9. Select objectives (optional):
   - Generate leads
   - Examine user behavior
10. Click **Create**
11. Accept Terms of Service

---

## 2. Get Measurement ID

After creating the property:

1. You'll see **Data Streams** setup screen
2. Click **Web**
3. Fill in stream details:
   - Website URL: `https://pic-forge.com`
   - Stream name: `PicForge Production`
   - Enable **Enhanced Measurement** (recommended)
4. Click **Create Stream**
5. You'll see your **Measurement ID** in the format: `G-XXXXXXXXXX`

**IMPORTANT:** Copy this Measurement ID - you'll need it in the next step!

Example: `G-ABC123XYZ4`

---

## 3. Configure Vercel Environment Variables

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `pic-forge` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** Your Measurement ID (e.g., `G-ABC123XYZ4`)
   - **Environments:** Check `Production`, `Preview`, and `Development`
5. Click **Save**
6. Redeploy your application:
   - Go to **Deployments** tab
   - Click `...` on latest deployment
   - Click **Redeploy**

### Option B: Via Local `.env.local` File (Development)

1. In your project root, create or edit `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC123XYZ4
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

**Note:** `.env.local` is gitignored and only for local development. Production uses Vercel environment variables.

---

## 4. Verify Tracking

### A. Enable GA4 in Development (Optional)

By default, GA4 is disabled in development to avoid polluting production data.

To enable GA4 in development:

1. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_DEBUG=true
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC123XYZ4
   ```

2. Restart dev server

### B. Test with GA4 DebugView

1. Go to GA4 Dashboard
2. Click **Configure** → **DebugView** (left sidebar)
3. Visit your production site: `https://pic-forge.com`
4. Accept cookie consent banner
5. Wait 30 seconds - you should see:
   - Your visit in real-time
   - `page_view` events
   - `session_start` events

### C. Test with Real-Time Reports

1. Go to GA4 Dashboard
2. Click **Reports** → **Realtime** (left sidebar)
3. Visit your site and accept cookies
4. You should see:
   - Active users count increase
   - Page views in last 30 minutes
   - Events firing in real-time

### D. Test Cookie Consent

1. Open your site in incognito/private mode
2. Open browser DevTools → **Network** tab
3. You should **NOT** see `google-analytics.com` requests (no consent yet)
4. Click **Accept Cookies** on the banner
5. Refresh the page
6. You should now see `google-analytics.com` requests
7. Check localStorage: `cookie-consent` should be `"accepted"`

---

## 5. Configure Custom Events

PicForge tracks 50+ custom events automatically. Here's what gets tracked:

### A. Core Engagement Events

| Event Name | When It Fires | Parameters |
|------------|---------------|------------|
| `image_transformation` | User transforms an image | `prompt_category`, `locked_composition`, `is_nsfw` |
| `batch_process` | User processes batch images | `image_count`, `effect_type` |
| `roast_generation` | User generates AI roast | `intensity` |
| `canvas_generation` | User generates AI image | `size`, `quality`, `success` |
| `roulette_spin` | User spins transform roulette | `category`, `prompt_title`, `streak` |

### B. Conversion Events

| Event Name | When It Fires | Parameters |
|------------|---------------|------------|
| `promo_code_redemption` | User redeems promo code | `code_tier`, `code_type` |
| `sign_up` | New user signs up | `method` |
| `tier_change` | User tier changes | `from_tier`, `to_tier`, `method` |
| `daily_limit_reached` | Free user hits limit | `current_count`, `limit` |

### C. Content Events

| Event Name | When It Fires | Parameters |
|------------|---------------|------------|
| `prompt_usage` | User uses a prompt | `prompt_category`, `prompt_title`, `source` |
| `favorite_prompt` | User favorites a prompt | `action`, `category` |
| `showcase_submit` | User submits showcase | `has_description` |
| `showcase_vote` | User likes showcase item | `submission_id` |

### D. View Custom Events in GA4

1. Go to GA4 Dashboard
2. Click **Configure** → **Events** (left sidebar)
3. Wait 24-48 hours for custom events to appear
4. You'll see all tracked events with counts

---

## 6. Set Up Conversion Goals

Mark important events as conversions for better tracking:

### A. Create Conversions

1. Go to GA4 Dashboard
2. Click **Configure** → **Events**
3. Wait for custom events to populate (24-48 hours)
4. Toggle **Mark as conversion** for:
   - `promo_code_redemption` (KEY CONVERSION)
   - `sign_up` (KEY CONVERSION)
   - `tier_change` (KEY CONVERSION)
   - `image_transformation` (engagement)
   - `batch_process` (engagement)
   - `showcase_submit` (engagement)

### B. Track Conversion Metrics

After marking conversions, you can:

1. View conversion rates:
   - **Reports** → **Engagement** → **Conversions**
2. Create custom reports:
   - **Explore** → **Create new exploration**
3. Set up conversion funnels:
   - **Explore** → **Funnel exploration**

### C. Suggested Conversion Funnels

**Pro Upgrade Funnel:**
1. `page_view` (pricing page)
2. `upgrade_click`
3. `promo_code_redemption` OR `tier_change`

**User Activation Funnel:**
1. `sign_up`
2. `image_transformation` (first transformation)
3. `favorite_prompt` (engaged user)

**Viral Loop Funnel:**
1. `image_transformation`
2. `social_share`
3. `referral_signup`

---

## 7. Testing & Debugging

### A. Use GA4 DebugView

Best for real-time debugging:

1. Install [GA Debug Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable the extension
3. Open DevTools → **Console** tab
4. Visit your site
5. You'll see detailed GA4 event logs in console

### B. Test Custom Events

```javascript
// Open browser console on pic-forge.com
// Test promo code redemption tracking
localStorage.setItem('cookie-consent', 'accepted');
// Then redeem a promo code - check DebugView

// Test image transformation tracking
// Upload an image and transform it - check DebugView
```

### C. Test Cookie Consent Flows

**Test Accept Flow:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Accept cookies
4. Check: `localStorage.getItem('cookie-consent')` → `"accepted"`
5. Check: GA4 requests in Network tab → present

**Test Decline Flow:**
1. Clear localStorage
2. Refresh page
3. Decline cookies
4. Check: `localStorage.getItem('cookie-consent')` → `"declined"`
5. Check: GA4 requests in Network tab → none

### D. Verify Event Parameters

1. Go to **Configure** → **DebugView**
2. Click on any event (e.g., `image_transformation`)
3. Expand **Event Parameters**
4. Verify parameters match expected values:
   - `prompt_category`: "Art Styles"
   - `locked_composition`: true/false
   - `is_nsfw`: false

---

## 8. Privacy Compliance

PicForge's GA4 implementation is fully GDPR-compliant:

### A. Consent Mode

- Uses Google's **Consent Mode v2**
- Analytics blocked until user accepts cookies
- IP anonymization enabled
- No advertising cookies

### B. What We Track

**We track:**
- Page views and navigation
- Feature usage (which prompts, effects used)
- Conversion events (promo redemptions, signups)
- Engagement metrics (time on site, interactions)

**We DON'T track:**
- Personal information (names, emails stored separately in InstantDB)
- User images (processed client-side, never sent to GA4)
- Cross-site behavior
- Advertising data

### C. Cookie Consent Banner

Located in `components/CookieConsent.tsx`:

- Shows on first visit
- Stores choice in localStorage: `cookie-consent`
- Links to Privacy Policy
- Clear Accept/Decline buttons
- GDPR-compliant messaging

### D. Privacy Policy Integration

Make sure `/legal/privacy` page includes:

- What analytics we collect
- Why we collect it (improve product)
- How long we keep it (GA4 default: 14 months)
- User rights (opt-out, data deletion)
- Contact info for data requests

---

## Verification Checklist

Before going live, verify:

- [ ] GA4 property created with correct domain
- [ ] Measurement ID added to Vercel environment variables
- [ ] Cookie consent banner appears on first visit
- [ ] GA4 loads only after cookie acceptance
- [ ] GA4 does NOT load if cookies declined
- [ ] Real-Time reports show live traffic
- [ ] Custom events appear in DebugView
- [ ] Conversions marked in Events dashboard
- [ ] Privacy Policy page updated with GA4 info

---

## Troubleshooting

### Problem: GA4 not loading

**Solutions:**
1. Check Vercel env vars are set and deployed
2. Verify Measurement ID format: `G-XXXXXXXXXX`
3. Accept cookie consent banner
4. Check browser console for errors
5. Disable ad blockers (they block GA4)

### Problem: Events not showing in GA4

**Solutions:**
1. Wait 24-48 hours (GA4 has processing delay)
2. Use DebugView for real-time events
3. Check event names match exactly (case-sensitive)
4. Verify cookie consent accepted

### Problem: Cookie banner not showing

**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Try incognito/private window
4. Check browser console for errors

### Problem: GA4 loads in development

**Solution:**
1. Remove `NEXT_PUBLIC_GA_DEBUG=true` from `.env.local`
2. Restart dev server

---

## Next Steps

1. **Week 1:** Monitor Real-Time reports to verify tracking
2. **Week 2:** Review custom events in Events dashboard
3. **Month 1:** Analyze conversion funnels and user behavior
4. **Month 2:** Set up custom reports and dashboards
5. **Ongoing:** Review Privacy Policy compliance quarterly

---

## Support Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Consent Mode v2 Guide](https://support.google.com/analytics/answer/9976101)
- [Custom Events Best Practices](https://support.google.com/analytics/answer/9267735)
- [DebugView Guide](https://support.google.com/analytics/answer/7201382)

---

## Contact

Questions about GA4 setup? Contact Derek at derek.bobola@gmail.com
