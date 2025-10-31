# Stripe Webhook Setup Guide for PicForge.com

## CRITICAL ISSUE

**Your Stripe webhook secret is currently a placeholder (`whsec_YOUR_SECRET_HERE`).**

This means:
- Payments won't grant Pro access automatically
- Users who pay won't receive their benefits
- Webhook signature verification will fail
- Potential security vulnerability

**Status:** Payment flow is 90% complete. You just need to configure the webhook in Stripe Dashboard.

---

## Payment Flow (How It Works)

### Current Implementation:

```
User clicks "Upgrade to Pro"
  → PicForge calls /api/create-checkout-session
  → Stripe creates checkout session with metadata: { userId: "xxx" }
  → User redirected to Stripe Checkout page
  → User enters payment info
  → Stripe processes payment
  → User redirected to /success page

  [MEANWHILE - IN THE BACKGROUND]
  → Stripe sends webhook to /api/webhooks/stripe
  → Webhook handler verifies signature (CURRENTLY FAILS - PLACEHOLDER SECRET)
  → Handler updates user tier in InstantDB: "free" → "pro"
  → User now has unlimited images + no watermarks
```

### What's Already Built:

✅ **Stripe Checkout API** (`/api/create-checkout-session`)
- Creates subscription checkout sessions
- Passes userId and userEmail as metadata
- Monthly price: $14/mo (`price_1SIcgtDlxrM8ZIxcgNwPSV1Y`)
- Yearly price: $119/yr (`price_1SIchxDlxrM8ZIxcRxrH56WL`)
- Allows promo codes at checkout

✅ **Webhook Handler** (`/api/webhooks/stripe/route.ts`)
- Handles `checkout.session.completed` (new subscriptions)
- Handles `customer.subscription.updated` (status changes)
- Handles `customer.subscription.deleted` (cancellations)
- Updates InstantDB usage table with tier and subscriptionId
- Signature verification ready (just needs valid secret)

✅ **Pricing Page** (`/pricing`)
- Monthly/Yearly toggle with 29% savings badge
- Real Stripe checkout integration
- Clear tier comparison (Free, Pro, Unlimited)

✅ **Success Page** (`/success`)
- Shows after payment completion
- Displays unlocked features
- Links to start creating images

✅ **Tier Benefits System**
- `useImageTracking()` hook checks user tier
- Free: 20 images/day, watermarks
- Pro: Unlimited images, no watermarks
- Watermark logic in `lib/watermark.ts` (automatically skips for Pro users)

---

## 30-Minute Setup Checklist

### Step 1: Access Stripe Dashboard (2 minutes)

1. Go to: **https://dashboard.stripe.com**
2. Sign in with your Stripe account
3. Make sure you're in **LIVE MODE** (toggle in top-right)
   - Test mode = `sk_test_...` and `whsec_test_...`
   - Live mode = `sk_live_...` and `whsec_...`

**Pro Tip:** Start in TEST MODE first to verify everything works, then switch to LIVE.

---

### Step 2: Verify Your Products Exist (5 minutes)

1. Go to: **https://dashboard.stripe.com/products**
2. You should see two products:
   - **PicForge Pro Monthly** - $14.00/month
   - **PicForge Pro Yearly** - $119.00/year

**If products DON'T exist, create them:**

#### Create Monthly Product:
- Click **"Add product"**
- **Name:** `PicForge Pro Monthly`
- **Description:** `Unlimited AI image transformations, no watermarks, all features`
- **Pricing model:** `Recurring`
- **Price:** `$14.00 USD`
- **Billing period:** `Monthly`
- Click **"Save product"**
- **Copy the Price ID** (looks like `price_1ABC...`)
- Update `.env.local`: `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_1ABC...`

#### Create Yearly Product:
- Click **"Add product"**
- **Name:** `PicForge Pro Yearly`
- **Description:** `Unlimited AI image transformations, no watermarks - Save 29%!`
- **Pricing model:** `Recurring`
- **Price:** `$119.00 USD`
- **Billing period:** `Yearly`
- Click **"Save product"**
- **Copy the Price ID** (looks like `price_1XYZ...`)
- Update `.env.local`: `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_1XYZ...`

**Current Price IDs in your .env:**
- Monthly: `price_1SIcgtDlxrM8ZIxcgNwPSV1Y`
- Yearly: `price_1SIchxDlxrM8ZIxcRxrH56WL`

If these IDs work in Stripe Dashboard, you're good! Otherwise, update them.

---

### Step 3: Create Webhook Endpoint (10 minutes) - THE CRITICAL STEP

1. Go to: **https://dashboard.stripe.com/webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL:**
   ```
   https://pic-forge.com/api/webhooks/stripe
   ```

4. **Description:** `PicForge subscription webhook`

5. **Version:** Select `2025-09-30.clover` (matches your API version)

6. **Events to send** - Click "Select events" and choose these 3:
   ```
   ✓ checkout.session.completed
   ✓ customer.subscription.updated
   ✓ customer.subscription.deleted
   ```

   **What each event does:**
   - `checkout.session.completed` - Fires when user completes payment → Upgrades user to Pro
   - `customer.subscription.updated` - Fires when subscription status changes (active/canceled/unpaid) → Updates tier
   - `customer.subscription.deleted` - Fires when subscription is canceled → Downgrades user to Free

7. Click **"Add endpoint"**

8. **COPY THE WEBHOOK SIGNING SECRET** (starts with `whsec_...`)
   - This is shown ONLY ONCE after creating the endpoint
   - If you miss it, click "Roll secret" to generate a new one

---

### Step 4: Add Webhook Secret to Vercel (5 minutes)

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to: **https://vercel.com/dashboard**
2. Select your **PicForge project**
3. Click **Settings** → **Environment Variables**
4. Find `STRIPE_WEBHOOK_SECRET` or add new variable:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_YOUR_ACTUAL_SECRET_FROM_STRIPE`
   - **Environments:** Production, Preview, Development
5. Click **"Save"**
6. **Redeploy** your app:
   - Go to **Deployments**
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

**Option B: Via Local .env.local (For Testing Locally)**

1. Open: `C:\Users\derek\OneDrive\Desktop\nano\.env.local`
2. Update line 27:
   ```bash
   # BEFORE:
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

   # AFTER:
   STRIPE_WEBHOOK_SECRET=whsec_1a2b3c4d5e6f7g8h9i0j...
   ```
3. Save file
4. Restart dev server: `npm run dev`

**IMPORTANT:** Both local AND Vercel need the secret updated!

---

### Step 5: Test the Webhook (8 minutes)

#### Test in LIVE MODE (Real Payment):

**DO NOT DO THIS YET** - Only if you want to test with real money.

1. Go to: **http://localhost:3003/pricing** (or **https://pic-forge.com/pricing**)
2. Sign in with a test account
3. Click **"Upgrade to Pro"**
4. Use a **real credit card** (you'll be charged)
5. Complete checkout
6. You should be redirected to `/success`
7. Check your profile - tier should show **"Pro"**
8. Download an image - **no watermark** should appear

#### Test in TEST MODE (Free Testing):

1. Switch Stripe Dashboard to **TEST MODE** (toggle top-right)
2. Create test webhook endpoint:
   - URL: `https://pic-forge.com/api/webhooks/stripe`
   - Same 3 events
   - Copy **test** webhook secret (`whsec_test_...`)
3. Update Vercel env var with **test** secret
4. Go to pricing page, sign in, click "Upgrade to Pro"
5. Use Stripe test card:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., `12/25`)
   - **CVC:** Any 3 digits (e.g., `123`)
   - **ZIP:** Any 5 digits (e.g., `12345`)
6. Complete checkout
7. Verify user upgraded to Pro tier

---

### Step 6: Monitor Webhook Events (Ongoing)

1. Go to: **https://dashboard.stripe.com/webhooks**
2. Click on your webhook endpoint
3. View **"Logs"** tab to see all incoming events

**Successful webhook log should show:**
```
✓ checkout.session.completed - 200 OK
  Response: { "received": true }
```

**Failed webhook log might show:**
```
✗ checkout.session.completed - 401 Unauthorized
  Error: Invalid webhook signature
```

**If you see failures:**
- Verify webhook secret is correct in Vercel
- Check webhook endpoint URL is exactly: `https://pic-forge.com/api/webhooks/stripe`
- Redeploy Vercel after updating env vars

---

## Troubleshooting Guide

### Problem: Webhook returns 401 Unauthorized

**Cause:** Webhook secret mismatch

**Fix:**
1. Go to Stripe Dashboard → Webhooks
2. Click your endpoint
3. Click **"Roll secret"** to generate new one
4. Copy new secret
5. Update Vercel env var
6. Redeploy

### Problem: User paid but still shows Free tier

**Cause:** Webhook not firing or failing silently

**Fix:**
1. Check Stripe webhook logs for errors
2. Verify webhook events include `checkout.session.completed`
3. Check Vercel function logs:
   - Go to Vercel Dashboard → Project → Logs
   - Filter by `/api/webhooks/stripe`
   - Look for errors

### Problem: Webhook signature verification fails

**Cause:** Wrong API version or secret

**Fix:**
1. Verify webhook API version matches: `2025-09-30.clover`
2. Verify endpoint URL is EXACTLY: `https://pic-forge.com/api/webhooks/stripe` (no trailing slash)
3. Roll webhook secret and update Vercel

### Problem: User tier updates but watermark still shows

**Cause:** Frontend cache or tier not refreshing

**Fix:**
1. Have user refresh page
2. Check InstantDB to verify tier = "pro"
3. Verify watermark logic in `lib/watermark.ts`:
   ```typescript
   if (tier === 'free') {
     return addWatermark(imageDataUrl, options);
   }
   return imageDataUrl; // Pro/Unlimited users get no watermark
   ```

---

## Testing Checklist

### Test Case 1: New Subscription (Happy Path)

- [ ] User clicks "Upgrade to Pro" on /pricing
- [ ] User redirected to Stripe Checkout
- [ ] User enters payment info and submits
- [ ] User redirected to /success page
- [ ] User tier updated to "pro" in InstantDB
- [ ] User can generate unlimited images
- [ ] Downloaded images have no watermark
- [ ] Stripe webhook log shows 200 OK

### Test Case 2: Subscription Cancellation

- [ ] User cancels subscription in Stripe Customer Portal
- [ ] `customer.subscription.deleted` webhook fires
- [ ] User tier downgraded to "free" in InstantDB
- [ ] User limited to 20 images/day
- [ ] Downloaded images have watermarks

### Test Case 3: Payment Failure

- [ ] Use test card: `4000 0000 0000 0341` (requires authentication)
- [ ] Payment fails or is declined
- [ ] User NOT upgraded to Pro
- [ ] User remains on Free tier

### Test Case 4: Webhook Signature Attack

- [ ] Send fake webhook request to /api/webhooks/stripe
- [ ] Webhook handler rejects with 401 Unauthorized
- [ ] User tier NOT changed

---

## Production Deployment Checklist

### Before Going Live:

- [ ] Stripe is in **LIVE MODE** (not test mode)
- [ ] Webhook endpoint uses **live** secret (`whsec_...`, not `whsec_test_...`)
- [ ] Vercel env vars updated with **live** Stripe keys
- [ ] Price IDs point to **live** products
- [ ] Test full payment flow with real card
- [ ] Verify webhook logs show successful events
- [ ] Verify user tier updates correctly
- [ ] Verify watermark removal works for Pro users
- [ ] Set up Stripe Customer Portal for subscription management
- [ ] Add cancellation link to user profile page

### Security Checks:

- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced on webhook endpoint
- [ ] Environment variables secured in Vercel
- [ ] No API keys exposed in client-side code
- [ ] Rate limiting enabled on checkout API
- [ ] Error messages don't leak sensitive data

---

## Customer Portal Setup (Optional - Recommended)

Allow users to manage subscriptions, update payment methods, and view invoices:

1. Go to: **https://dashboard.stripe.com/settings/billing/portal**
2. Click **"Activate test link"** or **"Activate"**
3. Configure settings:
   - [ ] Allow customers to update payment methods
   - [ ] Allow customers to cancel subscriptions
   - [ ] Allow customers to view invoices
4. Add customer portal link to user profile page:

```typescript
// Add to app/profile/page.tsx
const handleManageSubscription = async () => {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id }),
  });
  const { url } = await response.json();
  window.location.href = url;
};
```

**Create portal session API:**
```typescript
// app/api/create-portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  // Get user's subscriptionId from InstantDB
  // Then create portal session:

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${req.headers.get('origin')}/profile`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

## Webhook Event Reference

### checkout.session.completed

**When it fires:** User completes payment at Stripe Checkout

**Payload example:**
```json
{
  "id": "cs_test_123",
  "object": "checkout.session",
  "subscription": "sub_123",
  "customer": "cus_123",
  "metadata": {
    "userId": "user_abc123"
  }
}
```

**What webhook handler does:**
1. Extracts `userId` from `metadata`
2. Extracts `subscriptionId` from `subscription`
3. Calls `upgradeUserToPro(userId, subscriptionId)`
4. Updates InstantDB usage table: `tier = 'pro'`

---

### customer.subscription.updated

**When it fires:** Subscription status changes (active → canceled, active → unpaid, etc.)

**Payload example:**
```json
{
  "id": "sub_123",
  "object": "subscription",
  "status": "canceled",
  "metadata": {
    "userId": "user_abc123"
  }
}
```

**What webhook handler does:**
1. Checks `status` field
2. If `status === 'active'` → Upgrade to Pro
3. If `status === 'canceled' || status === 'unpaid'` → Downgrade to Free

---

### customer.subscription.deleted

**When it fires:** Subscription is permanently deleted

**Payload example:**
```json
{
  "id": "sub_123",
  "object": "subscription",
  "metadata": {
    "userId": "user_abc123"
  }
}
```

**What webhook handler does:**
1. Extracts `userId` from `metadata`
2. Calls `downgradeUserToFree(userId)`
3. Updates InstantDB usage table: `tier = 'free'`, `subscriptionId = null`

---

## Next Steps After Setup

1. **Test payment flow end-to-end**
2. **Monitor webhook logs for first week**
3. **Add customer portal for subscription management**
4. **Set up email notifications for payment events** (use Resend API)
5. **Add usage analytics to admin panel** (MRR, churn rate, conversion rate)
6. **Create cancellation flow** (exit survey, retention offers)
7. **Add promo code support at checkout** (already enabled in checkout session)

---

## Support & Resources

- **Stripe Webhooks Docs:** https://stripe.com/docs/webhooks
- **Stripe Test Cards:** https://stripe.com/docs/testing
- **Stripe CLI for local testing:** https://stripe.com/docs/stripe-cli
- **InstantDB Docs:** https://instantdb.com/docs
- **PicForge Webhook Handler:** `C:\Users\derek\OneDrive\Desktop\nano\app\api\webhooks\stripe\route.ts`

---

## Summary: What Derek Needs to Do

**Total time: 30 minutes**

1. **Go to Stripe Dashboard webhooks page** (5 min)
2. **Create webhook endpoint:** `https://pic-forge.com/api/webhooks/stripe` (5 min)
3. **Select 3 events:** checkout.session.completed, customer.subscription.updated, customer.subscription.deleted (2 min)
4. **Copy webhook signing secret** (1 min)
5. **Add secret to Vercel env vars** (5 min)
6. **Redeploy Vercel** (2 min)
7. **Test with Stripe test card** (10 min)
8. **Verify user upgraded to Pro** (1 min)

**That's it!** After this, paying customers will automatically get Pro access.

---

**Questions? Check the troubleshooting section or Stripe webhook logs first.**
