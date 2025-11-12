# Stripe Webhook Testing Guide

## Overview

This guide shows you how to test Stripe webhooks locally using the Stripe CLI before deploying to production.

---

## Installation

### Install Stripe CLI

**Windows:**
```bash
# Using Scoop (recommended)
scoop install stripe

# Or download from:
# https://github.com/stripe/stripe-cli/releases
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Verify installation:**
```bash
stripe --version
# Should show: stripe version X.X.X
```

---

## Setup

### 1. Login to Stripe

```bash
stripe login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Create a local config file

### 2. Listen for Webhooks

In a **separate terminal window**, run:

```bash
stripe listen --forward-to localhost:3003/api/webhooks/stripe
```

**Expected output:**
```
> Ready! Your webhook signing secret is whsec_1a2b3c4d5e6f... (^C to quit)
```

**Copy the webhook signing secret** (starts with `whsec_...`)

### 3. Update Local Environment

1. Open: `C:\Users\derek\OneDrive\Desktop\nano\.env.local`
2. Update:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_1a2b3c4d5e6f... # Paste secret from step 2
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

**IMPORTANT:** This secret is DIFFERENT from production. It's only for local testing.

---

## Testing Scenarios

### Test Case 1: Successful Subscription

**Goal:** User subscribes to Pro, webhook fires, user upgraded

**Steps:**

1. Start dev server (Terminal 1):
   ```bash
   npm run dev
   ```

2. Start webhook listener (Terminal 2):
   ```bash
   stripe listen --forward-to localhost:3003/api/webhooks/stripe
   ```

3. Open browser:
   ```
   http://localhost:3003/pricing
   ```

4. Sign in with test account

5. Click **"Upgrade to Pro"**

6. Use test card:
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** `12/25`
   - **CVC:** `123`
   - **ZIP:** `12345`

7. Complete checkout

8. **Watch Terminal 2** for webhook event:
   ```
   --> checkout.session.completed [evt_123]
   <-- [200] POST http://localhost:3003/api/webhooks/stripe [evt_123]
   ```

9. **Check user tier:**
   - Go to: http://localhost:3003/profile
   - Should show: **"Pro"** tier
   - Remaining images: **"Unlimited"**

10. **Test watermark removal:**
    - Go to editor
    - Transform an image
    - Download it
    - Verify: **No watermark**

**Expected Webhook Payload:**
```json
{
  "id": "evt_test_123",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "subscription": "sub_test_123",
      "customer": "cus_test_123",
      "metadata": {
        "userId": "your_user_id_here"
      }
    }
  }
}
```

**Expected Console Output (Terminal running dev server):**
```
📥 Stripe webhook received: checkout.session.completed
✅ User your_user_id_here upgraded to Pro tier
```

---

### Test Case 2: Subscription Cancellation

**Goal:** User cancels subscription, webhook fires, user downgraded

**Steps:**

1. With Stripe CLI still listening, run trigger command:
   ```bash
   stripe trigger customer.subscription.deleted
   ```

2. **Watch Terminal 2** for webhook event:
   ```
   --> customer.subscription.deleted [evt_456]
   <-- [200] POST http://localhost:3003/api/webhooks/stripe [evt_456]
   ```

3. **Check user tier:**
   - Refresh profile page
   - Should show: **"Free"** tier
   - Remaining images: **"20/day"**

**Expected Console Output:**
```
📥 Stripe webhook received: customer.subscription.deleted
✅ User your_user_id_here downgraded to Free tier
```

---

### Test Case 3: Failed Payment

**Goal:** Payment fails, user NOT upgraded

**Steps:**

1. Use declining test card:
   - **Card:** `4000 0000 0000 0002` (generic decline)
   - **Expiry:** `12/25`
   - **CVC:** `123`
   - **ZIP:** `12345`

2. Complete checkout

3. **Payment should fail**

4. **No webhook should fire**

5. **User should remain Free tier**

**Test Cards for Different Failures:**

| Card Number | Decline Reason |
|-------------|----------------|
| `4000 0000 0000 0002` | Generic decline |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0127` | Incorrect CVC |

---

### Test Case 4: Subscription Status Change

**Goal:** Subscription moves from active → unpaid → active

**Steps:**

1. Trigger unpaid status:
   ```bash
   stripe trigger customer.subscription.updated
   ```

2. Edit the event payload to set status: `unpaid`:
   ```json
   {
     "status": "unpaid"
   }
   ```

3. **Check user tier** - should downgrade to Free

4. Trigger active status:
   ```bash
   stripe trigger customer.subscription.updated
   ```

5. Edit the event payload to set status: `active`:
   ```json
   {
     "status": "active"
   }
   ```

6. **Check user tier** - should upgrade to Pro

---

### Test Case 5: Invalid Webhook Signature

**Goal:** Verify webhook rejects tampered requests

**Steps:**

1. Send fake webhook request:
   ```bash
   curl -X POST http://localhost:3003/api/webhooks/stripe \
     -H "Content-Type: application/json" \
     -H "stripe-signature: invalid_signature" \
     -d '{"type":"checkout.session.completed","data":{"object":{}}}'
   ```

2. **Expected Response:**
   ```json
   {
     "error": "Invalid webhook signature",
     "status": 401
   }
   ```

3. **Expected Console Output:**
   ```
   Webhook signature verification failed: [error details]
   ```

---

## Manual Webhook Testing

### Trigger Specific Events

**Checkout session completed:**
```bash
stripe trigger checkout.session.completed
```

**Subscription created:**
```bash
stripe trigger customer.subscription.created
```

**Subscription deleted:**
```bash
stripe trigger customer.subscription.deleted
```

**Subscription updated:**
```bash
stripe trigger customer.subscription.updated
```

**Payment succeeded:**
```bash
stripe trigger invoice.payment_succeeded
```

**Payment failed:**
```bash
stripe trigger invoice.payment_failed
```

---

## Debugging Tips

### Check Webhook Logs

**In Stripe CLI Terminal:**
- Shows all incoming webhook events
- Shows HTTP status codes
- Shows request/response

**In Dev Server Terminal:**
- Shows console.log output from webhook handler
- Shows errors and stack traces

**In Stripe Dashboard:**
- Go to: https://dashboard.stripe.com/test/webhooks
- View logs for each endpoint
- See raw payloads

### Common Issues

#### Issue: Webhook returns 404 Not Found

**Cause:** Wrong URL in forward-to parameter

**Fix:**
```bash
# Make sure URL matches your dev server
stripe listen --forward-to localhost:3003/api/webhooks/stripe

# NOT localhost:3000 or localhost:3001
```

#### Issue: Webhook signature verification fails

**Cause:** Stale webhook secret in .env.local

**Fix:**
1. Restart Stripe CLI listener
2. Copy NEW secret from output
3. Update .env.local
4. Restart dev server

#### Issue: User tier doesn't update

**Cause:** Missing userId in webhook metadata

**Fix:**
1. Check checkout session creation in `/api/create-checkout-session`
2. Verify metadata includes userId:
   ```typescript
   metadata: {
     userId: userId,  // Must be set!
   }
   ```

#### Issue: Multiple webhooks firing

**Cause:** Multiple Stripe CLI listeners running

**Fix:**
1. Kill all Stripe CLI processes
2. Start only ONE listener

---

## Webhook Handler Code Reference

**Location:** `C:\Users\derek\OneDrive\Desktop\nano\app\api\webhooks\stripe\route.ts`

**Key Functions:**

### upgradeUserToPro(userId, subscriptionId)

**What it does:**
1. Queries InstantDB for user's usage record
2. Updates tier to 'pro'
3. Stores subscriptionId for future reference
4. Logs success message

**InstantDB Transaction:**
```typescript
await db.transact([
  db.tx.usage[usageId].update({
    userId: userId,
    tier: 'pro',
    subscriptionId: subscriptionId,
  })
]);
```

### downgradeUserToFree(userId)

**What it does:**
1. Queries InstantDB for user's usage record
2. Updates tier to 'free'
3. Removes subscriptionId
4. Logs success message

**InstantDB Transaction:**
```typescript
await db.transact([
  db.tx.usage[usage.id].update({
    tier: 'free',
    subscriptionId: null,
  })
]);
```

---

## Production Testing

### After Deploying to Vercel

1. **Update webhook endpoint in Stripe:**
   - URL: `https://pic-forge.com/api/webhooks/stripe`
   - Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
   - Copy LIVE webhook secret

2. **Update Vercel env vars:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Set `STRIPE_WEBHOOK_SECRET` to LIVE secret
   - Redeploy

3. **Test with real payment:**
   - Go to https://pic-forge.com/pricing
   - Use real credit card (you'll be charged)
   - Verify upgrade works

4. **Monitor logs:**
   - Stripe Dashboard → Webhooks → Logs
   - Vercel Dashboard → Logs (filter by `/api/webhooks/stripe`)

---

## Expected Webhook Flow

### Happy Path:

```
1. User clicks "Upgrade to Pro"
   → API: POST /api/create-checkout-session
   → Response: { sessionId, url }

2. User redirected to Stripe Checkout
   → User enters payment
   → Stripe processes payment

3. Stripe sends webhook: checkout.session.completed
   → POST https://pic-forge.com/api/webhooks/stripe
   → Headers: { stripe-signature: "..." }
   → Body: { type: "checkout.session.completed", data: {...} }

4. Webhook handler:
   → Verify signature
   → Extract userId from metadata
   → Extract subscriptionId
   → Call upgradeUserToPro(userId, subscriptionId)
   → Update InstantDB

5. User redirected to /success
   → User sees "Welcome to Pro!" message
   → User profile shows Pro tier
   → User has unlimited images
   → Downloads have no watermark
```

---

## Webhook Security

### What the Handler Checks:

1. **Signature verification:**
   ```typescript
   event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
   ```
   - Prevents fake webhooks
   - Ensures request is from Stripe
   - Uses HMAC SHA256

2. **Metadata validation:**
   ```typescript
   const userId = session.metadata?.userId;
   if (!userId) return; // Ignore if no userId
   ```

3. **Event type filtering:**
   ```typescript
   switch (event.type) {
     case 'checkout.session.completed':
     case 'customer.subscription.updated':
     case 'customer.subscription.deleted':
     default: // Ignore unknown events
   }
   ```

---

## Testing Checklist

- [ ] Stripe CLI installed
- [ ] Logged into Stripe account
- [ ] Webhook listener running
- [ ] Webhook secret updated in .env.local
- [ ] Dev server restarted
- [ ] Test Case 1: Successful subscription ✓
- [ ] Test Case 2: Subscription cancellation ✓
- [ ] Test Case 3: Failed payment ✓
- [ ] Test Case 4: Status change ✓
- [ ] Test Case 5: Invalid signature ✓
- [ ] User tier updates correctly
- [ ] Watermark removal works
- [ ] Console logs show success messages
- [ ] No errors in webhook handler

---

## Next Steps

After local testing passes:

1. Deploy to Vercel
2. Update webhook endpoint in Stripe Dashboard (LIVE MODE)
3. Test with real payment (small amount)
4. Monitor webhook logs for first 24 hours
5. Set up alerts for webhook failures
6. Add customer support for payment issues

---

**Questions? Check webhook logs first, then refer to the main setup guide.**
