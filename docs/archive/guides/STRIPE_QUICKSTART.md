# Stripe Webhook - 30 Minute Setup

**CRITICAL ISSUE:** Your webhook secret is a placeholder. Payments won't grant Pro access until you fix this.

**Current Status:** 90% complete. Just needs webhook configuration.

---

## What's Already Done

✅ Stripe checkout API integrated
✅ Webhook handler code complete
✅ Pricing page with real Stripe buttons
✅ Success page after payment
✅ InstantDB tier upgrade logic
✅ Watermark removal for Pro users
✅ Usage tracking with unlimited for Pro

**All you need:** Configure webhook secret.

---

## 30-Minute Setup

### Step 1: Create Webhook (10 min)

1. Go to: **https://dashboard.stripe.com/webhooks**

2. Click **"Add endpoint"**

3. Enter these details:
   - **Endpoint URL:** `https://pic-forge.com/api/webhooks/stripe`
   - **Description:** `PicForge subscription webhook`
   - **Events:** Select these 3:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

4. Click **"Add endpoint"**

5. **COPY THE WEBHOOK SIGNING SECRET** (starts with `whsec_...`)
   - This is shown ONLY ONCE
   - If you miss it, click "Roll secret" to generate new one

---

### Step 2: Update Vercel (10 min)

1. Go to: **https://vercel.com/dashboard**

2. Select your **PicForge project**

3. Click **Settings** → **Environment Variables**

4. Find `STRIPE_WEBHOOK_SECRET` or add new:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste from Step 1)
   - **Environments:** Production, Preview, Development

5. Click **"Save"**

6. Go to **Deployments** → Click "..." on latest → **"Redeploy"**

---

### Step 3: Update Local .env (2 min)

1. Open: `C:\Users\derek\OneDrive\Desktop\nano\.env.local`

2. Update line 27:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_... # Paste from Step 1
   ```

3. Save file

4. Restart dev server: `npm run dev`

---

### Step 4: Test (8 min)

**Option A: Local Testing (Recommended First)**

1. Install Stripe CLI:
   ```bash
   # Windows
   scoop install stripe

   # Mac
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Start webhook listener:
   ```bash
   stripe listen --forward-to localhost:3003/api/webhooks/stripe
   ```

4. Copy test webhook secret from output (starts with `whsec_test_...`)

5. Update `.env.local` with test secret

6. Restart dev server

7. Go to: `http://localhost:3003/pricing`

8. Click "Upgrade to Pro"

9. Use test card:
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** `12/25`
   - **CVC:** `123`

10. Complete checkout

11. Verify: User tier = "Pro", no watermark on downloads

**Option B: Production Testing**

1. Complete Steps 1-2 above (webhook + Vercel)

2. Go to: `https://pic-forge.com/pricing`

3. Sign in with test account

4. Click "Upgrade to Pro"

5. Use test card (if in Stripe TEST mode) or real card (if LIVE mode)

6. Complete checkout

7. Verify: User profile shows "Pro" tier

8. Download an image: No watermark!

---

## Verification Checklist

After setup, verify these work:

- [ ] User clicks "Upgrade to Pro" → redirected to Stripe Checkout
- [ ] User enters payment → redirected to /success page
- [ ] Stripe webhook fires → Check logs: https://dashboard.stripe.com/webhooks
- [ ] User tier updated in InstantDB → Check profile page
- [ ] User has unlimited images → Check profile: "Unlimited"
- [ ] Downloads have no watermark → Download an image
- [ ] Webhook returns 200 OK → Check Stripe webhook logs

---

## Troubleshooting

### "Webhook returns 401 Unauthorized"

**Fix:**
1. Verify webhook secret in Vercel matches Stripe Dashboard
2. Redeploy Vercel after updating env var
3. Try rolling webhook secret in Stripe Dashboard

### "User paid but still shows Free tier"

**Fix:**
1. Check Stripe webhook logs: https://dashboard.stripe.com/webhooks
2. Look for errors or failed deliveries
3. Check Vercel function logs: Vercel Dashboard → Logs → Filter `/api/webhooks/stripe`
4. Manually update user tier in InstantDB if needed

### "Watermark still shows after upgrade"

**Fix:**
1. Have user refresh page (tier might be cached)
2. Check InstantDB: Verify tier = "pro" for that user
3. Check console: Should show no watermark logic firing

---

## Production Checklist

Before accepting real payments:

- [ ] Stripe in LIVE mode (not test mode)
- [ ] Webhook endpoint configured
- [ ] Webhook secret updated in Vercel
- [ ] All env vars present in Vercel Production
- [ ] Test payment completed successfully
- [ ] Webhook logs show 200 OK
- [ ] User tier updates correctly
- [ ] Watermark removal works

---

## Support

**Need Help?**

1. **Check webhook logs:** https://dashboard.stripe.com/webhooks
2. **Check Vercel logs:** Vercel Dashboard → Project → Logs
3. **Review setup guide:** `docs/STRIPE_WEBHOOK_SETUP.md`
4. **Review payment flow:** `docs/PAYMENT_FLOW_DIAGRAM.md`

---

## Quick Reference

**Webhook Endpoint:**
```
https://pic-forge.com/api/webhooks/stripe
```

**Required Events:**
```
checkout.session.completed
customer.subscription.updated
customer.subscription.deleted
```

**Test Card:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
ZIP: 12345
```

**Price IDs:**
```
Monthly: price_1SIcgtDlxrM8ZIxcgNwPSV1Y ($14/mo)
Yearly: price_1SIchxDlxrM8ZIxcRxrH56WL ($119/yr)
```

---

## What Happens When User Pays

```
1. User clicks "Upgrade to Pro"
2. Redirected to Stripe Checkout
3. User enters payment info
4. Stripe processes payment
5. Stripe sends webhook to /api/webhooks/stripe
6. Webhook handler updates InstantDB: tier = "pro"
7. User redirected to /success page
8. User now has unlimited images + no watermark
```

---

## Revenue at a Glance

**Monthly Plan:**
- $14/month per user
- Target: 100 users = $1,400/mo MRR

**Yearly Plan:**
- $119/year per user ($9.92/mo effective)
- 29% savings for user
- Better cash flow for you

**Break-even Analysis:**
- Gemini API cost: ~$0.00004/image
- At 1,000 images/user/month: $0.04 cost
- Profit per user: $14 - $0.04 = $13.96 (99.7% margin!)

---

**READY TO GO LIVE?** Follow Steps 1-4 above. Takes 30 minutes.

**Questions?** See `docs/STRIPE_WEBHOOK_SETUP.md` for detailed instructions.
