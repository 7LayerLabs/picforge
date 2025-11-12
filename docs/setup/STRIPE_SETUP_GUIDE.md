# PicForge Stripe Payment Integration - Setup Guide

## ✅ What's Been Implemented

I've integrated Stripe payments into PicForge! Here's what's ready:

### Code Changes:
- ✅ Stripe checkout API route (`/api/create-checkout-session`)
- ✅ Webhook handler for subscription events (`/api/webhooks/stripe`)
- ✅ Updated pricing page with real Stripe checkout buttons
- ✅ Success page after payment (`/success`)
- ✅ InstantDB integration for automatic tier upgrades
- ✅ Support for monthly ($14) and yearly ($119) billing

### Files Created:
1. `app/api/create-checkout-session/route.ts` - Creates Stripe checkout sessions
2. `app/api/webhooks/stripe/route.ts` - Handles subscription webhooks
3. `app/success/page.tsx` - Post-checkout success page
4. Updated `app/pricing/page.tsx` - Real Stripe checkout flow
5. Updated `lib/instantdb.ts` - Added subscriptionId field

---

## 🔧 What You Need to Do in Stripe Dashboard

### Step 1: Get Your API Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Copy these values:

   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### Step 2: Create Products

1. Go to: https://dashboard.stripe.com/products
2. Click "Add product"

#### Product #1: PicForge Pro Monthly
- **Name:** `PicForge Pro Monthly`
- **Description:** `Unlimited AI image transformations, no watermarks, all features`
- **Pricing model:** `Recurring`
- **Price:** `$14.00 USD`
- **Billing period:** `Monthly`
- Click "Save product"
- **Copy the Price ID** (looks like `price_1ABC...`)

#### Product #2: PicForge Pro Yearly
- **Name:** `PicForge Pro Yearly`
- **Description:** `Unlimited AI image transformations, no watermarks, all features - Save 29%!`
- **Pricing model:** `Recurring`
- **Price:** `$119.00 USD`
- **Billing period:** `Yearly`
- Click "Save product"
- **Copy the Price ID** (looks like `price_1XYZ...`)

### Step 3: Set Up Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://pic-forge.com/api/webhooks/stripe`
4. **Description:** `PicForge subscription webhook`
5. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click "Add endpoint"
7. **Copy the Webhook signing secret** (starts with `whsec_...`)

---

## 📝 Update Your .env.local File

Open `C:\Users\derek\OneDrive\Desktop\nano\.env.local` and replace the placeholder values:

```bash
# Stripe Payment Integration
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE

# Product Price IDs
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_MONTHLY_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_YOUR_YEARLY_PRICE_ID_HERE
```

---

## 🧪 Testing the Integration

### Test Mode (Recommended First)

1. Use **test mode** API keys (starts with `sk_test_` and `pk_test_`)
2. Create test products in Stripe dashboard
3. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

### Test Flow:

1. Go to http://localhost:3003/pricing
2. Sign in with your account
3. Click "Upgrade to Pro Now"
4. You should be redirected to Stripe Checkout
5. Enter test card: `4242 4242 4242 4242`
6. Complete checkout
7. You'll be redirected to `/success`
8. Your account should now show "Pro" tier with unlimited images!

### Live Mode (After Testing)

1. Switch to **live mode** in Stripe dashboard
2. Create live products
3. Update `.env.local` with live API keys (`sk_live_`, `pk_live_`)
4. Update webhook endpoint URL to production domain
5. **Important:** Update Vercel environment variables with live keys

---

## 🔄 How It Works

### User Clicks "Upgrade to Pro":

1. Frontend calls `/api/create-checkout-session`
2. API creates Stripe checkout session
3. User is redirected to Stripe's hosted checkout page
4. User enters payment info
5. Stripe processes payment

### After Successful Payment:

1. User is redirected to `/success?session_id=...`
2. Stripe sends webhook to `/api/webhooks/stripe`
3. Webhook handler verifies the event
4. InstantDB user tier is upgraded to `pro`
5. User now has unlimited images + no watermarks!

### Subscription Management:

- **Cancellation:** Handled via Stripe Customer Portal (you can add this later)
- **Downgrades:** Webhook automatically downgrades user when subscription ends
- **Failed Payments:** Webhook handles `customer.subscription.updated` with status changes

---

##Human: nice. in stripe dash, when i make a product, there is monthly, one time, etc. Which one?