# GA4 Quick Start Guide - PicForge.com

Get up and running with Google Analytics 4 in 10 minutes.

---

## 5-Step Setup

### Step 1: Create GA4 Property (5 min)

1. Go to [analytics.google.com](https://analytics.google.com/)
2. Create Property: `PicForge.com`
3. Add Web Stream: `https://pic-forge.com`
4. Copy Measurement ID: `G-XXXXXXXXXX`

### Step 2: Add to Vercel (2 min)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select `pic-forge` project
3. Settings → Environment Variables
4. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
5. Redeploy

### Step 3: Verify Tracking (2 min)

1. Visit [pic-forge.com](https://pic-forge.com)
2. Accept cookie banner
3. Go to GA4 → Reports → Realtime
4. You should see 1 active user (you!)

### Step 4: Enable DebugView (1 min)

1. Install [GA Debug Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Visit your site
3. GA4 → Configure → DebugView
4. Watch events fire in real-time

### Step 5: Mark Conversions (Optional)

1. Wait 24-48 hours for events to populate
2. GA4 → Configure → Events
3. Toggle "Mark as conversion" for:
   - `promo_code_redemption`
   - `sign_up`
   - `tier_change`

---

## What Gets Tracked Automatically

### Core Features
- Image transformations (with prompt categories)
- Batch processing
- AI Roast generations
- Canvas/AI image generation
- Transform Roulette spins

### User Actions
- Promo code redemptions
- Sign ups / Sign ins
- Favorites added/removed
- Showcase submissions
- Social shares
- Downloads

### Conversions
- Pro upgrades
- Referral signups
- Daily limit warnings

---

## Testing Checklist

- [ ] Cookie banner shows on first visit
- [ ] Declining cookies = no GA4 tracking
- [ ] Accepting cookies = GA4 loads
- [ ] Events show in DebugView
- [ ] Real-Time shows active users

---

## Useful GA4 URLs

- **Real-Time Reports:** [GA4 Dashboard](https://analytics.google.com/) → Reports → Realtime
- **DebugView:** Configure → DebugView
- **Custom Events:** Configure → Events
- **Conversions:** Reports → Engagement → Conversions

---

## Cookie Consent Behavior

| User Action | GA4 Status | localStorage |
|-------------|------------|--------------|
| First visit | Not loaded | `null` |
| Accept cookies | Loaded | `"accepted"` |
| Decline cookies | Not loaded | `"declined"` |

---

## Common Issues

**GA4 not loading?**
- Check Vercel env vars deployed
- Accept cookie banner
- Disable ad blockers

**Events not showing?**
- Wait 24-48 hours (processing delay)
- Use DebugView for real-time
- Check cookie consent accepted

**Cookie banner not showing?**
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R

---

## Privacy Compliance

PicForge GA4 implementation is **GDPR compliant**:

- Consent required before tracking
- IP anonymization enabled
- No advertising cookies
- No cross-site tracking
- Images processed client-side (never sent to GA4)

---

## Full Documentation

See `docs/GA4_SETUP.md` for complete setup guide with conversion funnels, custom reports, and advanced configuration.

---

Need help? derek.bobola@gmail.com
