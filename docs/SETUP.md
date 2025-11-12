# PicForge Complete Setup Guide

This is the comprehensive setup guide for PicForge, covering all required services, APIs, and configuration needed to run the application in development and production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables Overview](#environment-variables-overview)
3. [InstantDB Setup](#instantdb-setup)
4. [AI Provider Setup](#ai-provider-setup)
   - [Google Gemini](#google-gemini)
   - [Anthropic Claude](#anthropic-claude)
   - [Replicate (NSFW)](#replicate-nsfw)
   - [OpenAI DALL-E](#openai-dall-e)
5. [Rate Limiting Setup (Vercel KV)](#rate-limiting-setup-vercel-kv)
6. [Stripe Payment Setup](#stripe-payment-setup)
7. [Analytics Setup (GA4)](#analytics-setup-ga4)
8. [Google Search Console](#google-search-console)
9. [Development Server](#development-server)
10. [Production Deployment](#production-deployment)
11. [Verification Checklist](#verification-checklist)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- Git installed
- A Vercel account (for hosting and KV)
- A Stripe account (for payments)
- A Google account (for Analytics and Search Console)
- Credit cards for AI API billing (Gemini, Anthropic, Replicate, OpenAI)

**Time to Complete Full Setup:** 2-3 hours

---

## Environment Variables Overview

PicForge requires 20+ environment variables. Create a `.env.local` file in your project root with these categories:

### Required (Application Won't Run Without These)
```bash
# InstantDB - Database and Auth (REQUIRED)
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id_here

# Google Gemini - Main Image Editor (REQUIRED)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Recommended (Core Features)
```bash
# Anthropic Claude - AI Prompt Assistant (Pro Feature)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Stripe - Payments (Needed for monetization)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_1...
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_1...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vercel KV - Rate Limiting (Prevents API abuse)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### Optional (Advanced Features)
```bash
# Replicate - NSFW Image Editor (~$0.023/image)
REPLICATE_API_TOKEN=r8_...

# OpenAI - Canvas Text-to-Image ($0.040-$0.080/image)
OPENAI_API_KEY=sk-...

# Google Analytics 4 - Usage Tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
```

---

## InstantDB Setup

**Time:** 5 minutes
**Cost:** Free (generous tier)
**Required:** Yes

InstantDB is your single source of truth for all data: users, images, favorites, usage tracking, subscriptions, etc.

### Steps

1. **Create InstantDB Account**
   - Go to [instantdb.com](https://instantdb.com)
   - Sign up with GitHub/Google

2. **Create New App**
   - Click "Create App"
   - Name: `PicForge` or `pic-forge`

3. **Get App ID**
   - Copy your App ID from the dashboard
   - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

4. **Add to Environment Variables**
   ```bash
   NEXT_PUBLIC_INSTANT_APP_ID=your_app_id_here
   ```

5. **Schema is Auto-Created**
   - InstantDB schema is defined in `lib/instantdb.ts`
   - Entities: users, images, favorites, usage, promoCodes, showcaseSubmissions, etc.
   - No manual schema setup needed!

### Verification
```bash
npm run dev
# Visit http://localhost:3000
# Try signing in with magic link
# Check InstantDB dashboard for new user
```

**References:**
- InstantDB docs: https://instantdb.com/docs
- Schema definition: `lib/instantdb.ts`

---

## AI Provider Setup

### Google Gemini

**Time:** 5 minutes
**Cost:** Free tier (then ~$0.00004/image)
**Required:** Yes (main editor)

Gemini powers the main image transformation editor (272+ prompts).

#### Steps

1. **Get API Key**
   - Go to [ai.google.dev](https://ai.google.dev)
   - Click "Get API Key"
   - Create new key or use existing

2. **Add to Environment**
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Billing Setup** (for production)
   - Gemini Vision API costs ~$0.00004 per image
   - Free tier: 1,500 requests/day
   - Enable billing at [console.cloud.google.com/billing](https://console.cloud.google.com/billing)

#### Verification
```bash
npm run dev
# Visit /forge
# Upload image and transform with any prompt
# Should work without errors
```

---

### Anthropic Claude

**Time:** 5 minutes
**Cost:** Pay-as-you-go (~$0.003 per prompt enhancement)
**Required:** No (Pro feature only)

Claude powers the AI Prompt Assistant that helps users create better prompts.

#### Steps

1. **Get API Key**
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Sign up and verify email
   - Go to API Keys section
   - Create new key

2. **Add to Environment**
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

3. **Add Credits**
   - Purchase credits at console.anthropic.com/settings/billing
   - Minimum: $5

#### Verification
```bash
npm run dev
# Sign in as Pro user
# Visit /forge
# Click "AI Prompt Assistant" button
# Type "make it look like a painting"
# Should generate 3 prompt variations
```

---

### Replicate (NSFW)

**Time:** 5 minutes
**Cost:** ~$0.023 per NSFW image
**Required:** No (NSFW editor only)

Replicate SDXL bypasses Gemini's content restrictions for 18+ transformations.

#### Steps

1. **Get API Token**
   - Go to [replicate.com](https://replicate.com)
   - Sign up
   - Go to Account → API Tokens
   - Create token

2. **Add to Environment**
   ```bash
   REPLICATE_API_TOKEN=r8_...
   ```

3. **Add Billing**
   - Add credit card at replicate.com/account/billing
   - Cost: ~$2 for 86 images

#### Verification
```bash
npm run dev
# Visit /forge-nsfw (18+ editor)
# Upload image and transform
# Check billing dashboard for charge
```

---

### OpenAI DALL-E

**Time:** 5 minutes
**Cost:** $0.040-$0.080 per image
**Required:** No (Canvas feature only)

DALL-E powers the text-to-image Canvas generator.

#### Steps

1. **Get API Key**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new secret key

2. **Add to Environment**
   ```bash
   OPENAI_API_KEY=sk-...
   ```

3. **Add Billing**
   - Add payment method at platform.openai.com/account/billing

#### Verification
```bash
npm run dev
# Visit /canvas
# Enter prompt: "A futuristic cityscape"
# Click generate
# Should create image
```

---

## Rate Limiting Setup (Vercel KV)

**Time:** 15 minutes
**Cost:** Free tier (30k commands/month), then $0.25/100k
**Required:** Highly Recommended (prevents abuse)

**⚠️ WITHOUT RATE LIMITING:** Your APIs are vulnerable to unlimited abuse. Potential cost: $10,000+/month if discovered by bots.

### Why You Need This

Without Vercel KV configured, rate limiting is disabled:
- Attackers can make unlimited requests to expensive AI APIs
- Gemini: $0.0025-$0.0125 per image
- Replicate: $0.023 per NSFW image
- DALL-E: $0.040-$0.080 per image

With rate limiting:
- 500 requests/day/IP for main editor
- 200 requests/day/IP for NSFW editor
- 100 requests/day/IP for Canvas
- Vercel KV cost: ~$1/month
- Protected from abuse

### Steps

1. **Create KV Database**
   - Go to [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
   - Click "Create Database"
   - Select "KV (Redis)"
   - Name: `picforge-rate-limit`
   - Region: `us-east-1` (or closest to users)
   - Click "Create"

2. **Get Environment Variables**
   - After creation, click ".env.local" tab
   - Copy all 4 variables:
   ```bash
   KV_URL=redis://...
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   ```

3. **Add to Vercel Project**
   - Dashboard → Your Project → Settings → Environment Variables
   - Add each variable to Production, Preview, Development
   - Click "Save"

4. **Add to Local .env.local**
   - Paste the 4 variables
   - Restart dev server

5. **Redeploy**
   ```bash
   git push origin main
   # Or manual redeploy in Vercel dashboard
   ```

### Current Rate Limits

| Endpoint | Limit | Reset | API Cost |
|----------|-------|-------|----------|
| `/api/process-image` | 500/day | 24h | ~$0.00004/req |
| `/api/process-image-nsfw` | 200/day | 24h | $0.023/req |
| `/api/generate-canvas` | 100/day | 24h | $0.040-$0.080/req |
| `/api/roast` | 300/day | 24h | ~$0.00004/req |

### Verification

```bash
# Test locally
npm run test:rate-limit

# Check logs
# Vercel Dashboard → Logs → Filter "rate-limit"
# Should see: "Rate limit check: ip:xxx - 499 remaining"
```

**See:** `docs/archive/setup/VERCEL_KV_SETUP.md` for detailed troubleshooting

---

## Stripe Payment Setup

**Time:** 30 minutes
**Cost:** Stripe fees (2.9% + $0.30 per transaction)
**Required:** Yes (for monetization)

Stripe handles Pro subscription payments ($14/month or $119/year).

### Critical Issue Check

**⚠️ Check your `.env.local` line 27:**
```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

If it says `whsec_YOUR_SECRET_HERE`, your webhook is NOT configured. Paying customers won't get Pro access automatically.

### Steps

1. **Verify Stripe Products Exist**
   - Go to [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
   - Should see: "PicForge Pro Monthly" ($14) and "PicForge Pro Yearly" ($119)
   - Copy the Price IDs

2. **Add Stripe Keys to Vercel**
   ```bash
   STRIPE_SECRET_KEY=sk_live_51...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
   NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_1...
   NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_1...
   ```

3. **Create Webhook Endpoint** (THE CRITICAL STEP)
   - Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - URL: `https://pic-forge.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Click "Add endpoint"
   - **Copy the webhook signing secret** (starts with `whsec_...`)

4. **Add Webhook Secret to Vercel**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...  # From step 3
   ```

5. **Redeploy**
   ```bash
   git push origin main
   ```

### Payment Flow

```
User clicks "Upgrade to Pro" on /pricing
→ /api/create-checkout-session creates Stripe session
→ User redirected to Stripe Checkout
→ User enters payment info
→ Stripe processes payment
→ Stripe sends webhook to /api/webhooks/stripe
→ Webhook updates InstantDB: tier = 'pro'
→ User redirected to /success
→ User now has unlimited images + no watermark
```

### Verification

**Test Mode (Free Testing):**
1. Switch Stripe to TEST mode
2. Go to /pricing
3. Click "Upgrade to Pro"
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify user upgraded to Pro tier
7. Verify watermark removed

**Live Mode (Real Money):**
- Only test when ready to go live
- Use real credit card
- Verify actual charge
- Verify Pro access granted

### Monitoring

- Webhook logs: [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
- Payment logs: [dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- Successful webhook: `200 OK { "received": true }`
- Failed webhook: `401 Unauthorized` (wrong secret)

**See:** `docs/archive/setup/STRIPE_WEBHOOK_SETUP.md` for detailed troubleshooting

---

## Analytics Setup (GA4)

**Time:** 20 minutes
**Cost:** Free
**Required:** Recommended (track usage, conversions)

Google Analytics 4 tracks user behavior, feature usage, and conversions.

### Steps

1. **Create GA4 Property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Admin → Create Property
   - Name: `PicForge`
   - Industry: Technology/SaaS
   - Add Data Stream → Web
   - URL: `https://pic-forge.com`

2. **Get Measurement ID**
   - Copy Measurement ID (format: `G-XXXXXXXXXX`)

3. **Add to Environment**
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. **Enable Enhanced Measurement**
   - In Data Stream settings, enable:
     - Page views
     - Scrolls (90% depth)
     - Outbound clicks
     - Site search
     - File downloads

5. **Configure Custom Dimensions**
   - Go to Configure → Custom definitions
   - Create dimensions:

   | Name | Scope | Event Parameter |
   |------|-------|----------------|
   | user_tier | User | user_tier |
   | prompt_category | Event | prompt_category |
   | share_platform | Event | platform |
   | is_nsfw | Event | is_nsfw |

6. **Mark Conversions**
   - Go to Configure → Events
   - Wait 24-48 hours for events to populate
   - Mark as conversion:
     - `sign_up`
     - `promo_code_redemption`
     - `tier_change`
     - `image_transformation`

### Key Events Tracked

| Event | Description | Parameters |
|-------|-------------|------------|
| `image_transformation` | User transforms image | prompt_category, locked_composition, is_nsfw |
| `sign_up` | User creates account | method |
| `promo_code_redemption` | User redeems code | code_tier, code_type |
| `social_share` | User shares image | platform, content_type |
| `prompt_usage` | User uses prompt | prompt_category, prompt_title, source |
| `batch_process` | Batch processing | image_count, effect_type |
| `roulette_spin` | Roulette spin | category, prompt_title, streak |

### Verification

```bash
npm run dev
# Visit site and perform actions
# GA4 → Realtime report
# Should see events appear within 30 seconds
```

### Cookie Consent Compliance

- GA4 loads ONLY after user accepts cookies
- Consent Mode v2 implemented
- IP anonymization enabled
- GDPR compliant
- Cookie banner in `components/CookieConsent.tsx`

**See:** `docs/archive/setup/ANALYTICS_SETUP.md` for detailed event reference and custom reports

---

## Google Search Console

**Time:** 10 minutes
**Cost:** Free
**Required:** Recommended (SEO)

Search Console monitors SEO performance and search visibility.

### Steps

1. **Add Property**
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Click "Add Property"
   - Select "URL prefix"
   - Enter: `https://pic-forge.com`

2. **Verify Ownership** (Meta Tag Method)
   - Copy verification code from Search Console
   - Add to environment:
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abcd1234efgh5678
   ```
   - Verification tag already in `app/layout.tsx` (line 112)
   - Deploy and verify

3. **Submit Sitemap**
   - In Search Console → Sitemaps
   - Add: `https://pic-forge.com/sitemap.xml`
   - Click "Submit"
   - Wait 24-48 hours for initial crawl

4. **Request Indexing** (Optional)
   - URL Inspection tool
   - Test important pages:
     - / (homepage)
     - /prompts
     - /batch
     - /canvas
     - /roulette
     - /pricing
   - Click "Request Indexing" for each

### Verification

- URL Inspection → Test any page
- Should show: "URL is on Google"
- Coverage report → Monitor indexing status
- Performance report → Track rankings and clicks

---

## Development Server

**Time:** 2 minutes

```bash
# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev

# Server starts at http://localhost:3000
# (or http://localhost:3001 if 3000 is taken)
```

### Development Tips

- Enable GA4 in dev (optional):
  ```bash
  NEXT_PUBLIC_GA_DEBUG=true
  ```
- Test with Stripe CLI for webhooks:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

---

## Production Deployment

**Time:** 10 minutes (first deploy)

### Vercel Deployment

1. **Connect GitHub Repo**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Configure project

2. **Add All Environment Variables**
   - Settings → Environment Variables
   - Add ALL variables from `.env.local`
   - Select: Production, Preview, Development

3. **Deploy**
   ```bash
   git push origin main
   # Vercel auto-deploys
   ```

4. **Configure Custom Domain** (Optional)
   - Settings → Domains
   - Add `pic-forge.com`
   - Update DNS records as instructed

### Post-Deployment Checks

- [ ] Site loads at production URL
- [ ] Can sign in with magic link
- [ ] Can transform images
- [ ] Payment flow works
- [ ] Stripe webhook returns 200 OK
- [ ] GA4 events tracked
- [ ] Rate limiting active
- [ ] No console errors in browser

---

## Verification Checklist

Use this checklist to verify your complete setup:

### Core Functionality
- [ ] InstantDB connected (can sign in)
- [ ] Gemini API working (can transform images)
- [ ] Image transformation works on /forge
- [ ] User tier system works (Free shows 20/day limit)

### Monetization
- [ ] Stripe checkout flow works
- [ ] Webhook endpoint configured (not placeholder)
- [ ] Test payment completes successfully
- [ ] User upgraded to Pro tier after payment
- [ ] Watermark removed for Pro users
- [ ] Stripe webhook logs show 200 OK

### Security & Limits
- [ ] Vercel KV configured
- [ ] Rate limiting active (429 responses after limit)
- [ ] Webhook signature verification works
- [ ] Environment variables not exposed in browser

### Analytics & SEO
- [ ] GA4 Realtime shows live traffic
- [ ] Custom events firing
- [ ] Cookie consent banner appears
- [ ] Search Console verified
- [ ] Sitemap submitted

### Optional Features
- [ ] Anthropic API (AI Prompt Assistant)
- [ ] Replicate API (NSFW editor)
- [ ] OpenAI API (Canvas generator)

---

## Troubleshooting

### "InstantDB connection error"
- Verify `NEXT_PUBLIC_INSTANT_APP_ID` is correct
- Check InstantDB dashboard for app status
- Ensure app ID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### "Gemini API key invalid"
- Verify key starts with correct format
- Check billing enabled at console.cloud.google.com
- Try regenerating key

### "Stripe webhook returns 401"
- Webhook secret mismatch
- Go to dashboard.stripe.com/webhooks
- Roll secret and update Vercel env vars
- Redeploy

### "Rate limiting not working"
- Check all 4 KV variables set in Vercel
- Verify variables enabled for Production
- Redeploy after adding variables
- Check logs for "KV not configured" warning

### "GA4 not tracking"
- Check Measurement ID format: `G-XXXXXXXXXX`
- Verify user accepted cookies
- Disable ad blockers
- Wait 30-60 seconds for events to appear

### "User paid but still Free tier"
- Check Stripe webhook logs for errors
- Verify webhook secret correct
- Check Vercel function logs
- Manually update tier in InstantDB if needed

---

## Quick Reference

### Important Links
- **InstantDB Dashboard**: https://instantdb.com/dash
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com
- **GA4 Dashboard**: https://analytics.google.com
- **Search Console**: https://search.google.com/search-console

### Environment Variables Summary
```bash
# Required
NEXT_PUBLIC_INSTANT_APP_ID=...
GEMINI_API_KEY=...

# Recommended
ANTHROPIC_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

# Optional
REPLICATE_API_TOKEN=...
OPENAI_API_KEY=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
```

### Key Files
- `lib/instantdb.ts` - Database schema
- `lib/analytics.ts` - GA4 event tracking
- `app/api/webhooks/stripe/route.ts` - Payment webhook
- `lib/rateLimitKv.ts` - Rate limiting logic
- `.env.local` - Local environment variables (gitignored)

---

## Support Resources

- **InstantDB Docs**: https://instantdb.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GA4 Docs**: https://support.google.com/analytics

For detailed setup of specific components, see:
- Analytics: `docs/archive/setup/ANALYTICS_SETUP.md`
- Stripe: `docs/archive/setup/STRIPE_WEBHOOK_SETUP.md`
- Rate Limiting: `docs/archive/setup/VERCEL_KV_SETUP.md`

---

**Last Updated**: 2025-10-31
**Setup Version**: 2.0

**Ready to launch? Complete the Verification Checklist and you're good to go!**
