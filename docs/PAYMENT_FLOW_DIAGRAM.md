# PicForge Payment Flow Documentation

## Complete Payment Journey

### User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PICFORGE PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: User Discovers Limitations
───────────────────────────────────
Location: /editor or /batch
Trigger: User hits 20 image limit OR sees watermark

   ┌─────────────────────────────────────┐
   │  "You've reached your daily limit"  │
   │  [Upgrade to Pro] button            │
   └─────────────────────────────────────┘
                  │
                  ▼
           Clicks "Upgrade"
                  │
                  ▼


Step 2: Pricing Page
─────────────────────
Location: /pricing
Components: PricingCard, useImageTracking, useReferral

   ┌─────────────────────────────────────────────────────┐
   │  FREE          │  PRO (⭐)      │  UNLIMITED        │
   │  $0/mo         │  $14/mo        │  Promo Code Only  │
   │  20 imgs/day   │  Unlimited     │  Everything       │
   │  Watermarks    │  No watermark  │  + NSFW           │
   │                │                │                   │
   │  [Start Free]  │  [Upgrade]     │  [Redeem Code]   │
   └─────────────────────────────────────────────────────┘
                        │
                User clicks "Upgrade to Pro"
                        │
                        ▼


Step 3: Frontend Checkout Request
──────────────────────────────────
File: app/pricing/page.tsx (line 24-69)

   Frontend Action:
   ┌──────────────────────────────────────────────────┐
   │  const handleUpgrade = async (tier: 'pro') => {  │
   │    if (!user) {                                   │
   │      alert('Please sign in');                     │
   │      return;                                      │
   │    }                                              │
   │                                                   │
   │    const priceId = billingPeriod === 'monthly'   │
   │      ? 'price_1SIcgtDlxrM8ZIxcgNwPSV1Y'         │
   │      : 'price_1SIchxDlxrM8ZIxcRxrH56WL';        │
   │                                                   │
   │    fetch('/api/create-checkout-session', {       │
   │      method: 'POST',                              │
   │      body: JSON.stringify({                       │
   │        priceId,                                   │
   │        userId: user.id,                           │
   │        userEmail: user.email,                     │
   │      })                                           │
   │    });                                            │
   │  }                                                │
   └──────────────────────────────────────────────────┘
                        │
                        ▼
              API Call to Backend


Step 4: Backend Creates Checkout Session
─────────────────────────────────────────
File: app/api/create-checkout-session/route.ts

   Backend Action:
   ┌──────────────────────────────────────────────────────┐
   │  const session = await stripe.checkout.sessions.create({  │
   │    mode: 'subscription',                             │
   │    payment_method_types: ['card'],                   │
   │    line_items: [{ price: priceId, quantity: 1 }],    │
   │    success_url: 'https://pic-forge.com/success?session_id={CHECKOUT_SESSION_ID}', │
   │    cancel_url: 'https://pic-forge.com/pricing',      │
   │    customer_email: userEmail,                        │
   │    metadata: {                                       │
   │      userId: userId,  // ⚠️ CRITICAL FOR WEBHOOK     │
   │    },                                                │
   │    allow_promotion_codes: true,                      │
   │  });                                                 │
   │                                                      │
   │  return { sessionId: session.id, url: session.url }; │
   └──────────────────────────────────────────────────────┘
                        │
                        ▼
              Returns Stripe Checkout URL


Step 5: User Redirected to Stripe
──────────────────────────────────
URL: https://checkout.stripe.com/c/pay/cs_test_...

   ┌─────────────────────────────────────────┐
   │         STRIPE CHECKOUT PAGE            │
   │  ┌───────────────────────────────────┐  │
   │  │  PicForge Pro - $14/month         │  │
   │  │                                   │  │
   │  │  Email: user@example.com          │  │
   │  │  Card: [____][____][____][____]   │  │
   │  │  Expiry: [__/__]  CVC: [___]      │  │
   │  │                                   │  │
   │  │  [Pay $14]                        │  │
   │  └───────────────────────────────────┘  │
   │                                         │
   │  Powered by Stripe                      │
   └─────────────────────────────────────────┘
                        │
                User enters payment info
                        │
                        ▼
              Stripe processes payment


Step 6: TWO THINGS HAPPEN SIMULTANEOUSLY
─────────────────────────────────────────

   Path A: User Redirect                Path B: Webhook Fires
   ─────────────────────                ─────────────────────
           │                                    │
           ▼                                    ▼
   ┌──────────────────┐            ┌────────────────────────┐
   │  Stripe sends    │            │  Stripe sends webhook  │
   │  user back to:   │            │  to backend:           │
   │                  │            │                        │
   │  /success?       │            │  POST /api/webhooks/   │
   │  session_id=...  │            │       stripe           │
   └──────────────────┘            └────────────────────────┘
           │                                    │
           ▼                                    ▼


Step 7A: Success Page Displays
───────────────────────────────
File: app/success/page.tsx

   ┌─────────────────────────────────────────┐
   │  ✅  Welcome to PicForge Pro! 🎉        │
   │                                         │
   │  Your payment was successful.           │
   │                                         │
   │  Pro Features Unlocked:                 │
   │  ✓ Unlimited image transformations      │
   │  ✓ No watermarks                        │
   │  ✓ Priority processing                  │
   │  ✓ All 272+ templates                   │
   │                                         │
   │  [Start Creating Images]                │
   │  [View My Account]                      │
   └─────────────────────────────────────────┘


Step 7B: Webhook Handler Processes Event
─────────────────────────────────────────
File: app/api/webhooks/stripe/route.ts

   Webhook Handler:
   ┌──────────────────────────────────────────────────┐
   │  1. Verify Signature                             │
   │     const event = stripe.webhooks.constructEvent(│
   │       body, signature, WEBHOOK_SECRET            │
   │     );                                            │
   │                                                   │
   │  2. Parse Event Type                             │
   │     switch (event.type) {                        │
   │       case 'checkout.session.completed':         │
   │                                                   │
   │  3. Extract User Data                            │
   │     const userId = session.metadata?.userId;     │
   │     const subscriptionId = session.subscription; │
   │                                                   │
   │  4. Update Database                              │
   │     await upgradeUserToPro(userId, subscriptionId); │
   │                                                   │
   │  5. Log Success                                  │
   │     console.log('✅ User upgraded to Pro');      │
   │     }                                             │
   └──────────────────────────────────────────────────┘
                        │
                        ▼
              InstantDB Updated


Step 8: Database Update
────────────────────────
Database: InstantDB
Table: usage

   Before Payment:
   ┌─────────────────────────────────────────┐
   │  userId: "user_abc123"                  │
   │  tier: "free"                           │
   │  count: 18                              │
   │  lastReset: 1738234567890               │
   │  subscriptionId: null                   │
   └─────────────────────────────────────────┘

                        │
                   Webhook runs
                        │
                        ▼

   After Payment:
   ┌─────────────────────────────────────────┐
   │  userId: "user_abc123"                  │
   │  tier: "pro"          ⬅ CHANGED         │
   │  count: 18                              │
   │  lastReset: 1738234567890               │
   │  subscriptionId: "sub_123"  ⬅ ADDED    │
   └─────────────────────────────────────────┘


Step 9: User Experience Changes
────────────────────────────────
Hook: useImageTracking()
Logic: Based on tier value

   BEFORE (tier: "free"):
   ┌─────────────────────────────────┐
   │  hasReachedLimit() → true       │
   │  getRemainingImages() → "2"     │
   │  Watermark: YES                 │
   └─────────────────────────────────┘

                        │
                   User refreshes page
                        │
                        ▼

   AFTER (tier: "pro"):
   ┌─────────────────────────────────┐
   │  hasReachedLimit() → false      │
   │  getRemainingImages() → "Unlimited" │
   │  Watermark: NO                  │
   └─────────────────────────────────┘


Step 10: User Creates Images Without Limits
────────────────────────────────────────────

   Location: /editor or /batch

   ┌─────────────────────────────────────────┐
   │  [Transform Image]                      │
   │                                         │
   │  Status: ⭐ Pro - Unlimited images      │
   │                                         │
   │  [Download]  ⬅ No watermark!           │
   └─────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          CANCELLATION FLOW
═══════════════════════════════════════════════════════════════════════════════

Step 1: User Cancels Subscription
──────────────────────────────────
Location: Stripe Customer Portal OR Stripe Dashboard

   Stripe Action:
   ┌──────────────────────────────────────────┐
   │  User clicks "Cancel subscription"       │
   │  Stripe marks subscription as "canceled" │
   └──────────────────────────────────────────┘
                        │
                        ▼


Step 2: Webhook Fires
──────────────────────
Event: customer.subscription.deleted

   ┌──────────────────────────────────────────────────┐
   │  POST /api/webhooks/stripe                       │
   │  {                                               │
   │    "type": "customer.subscription.deleted",      │
   │    "data": {                                     │
   │      "object": {                                 │
   │        "id": "sub_123",                          │
   │        "metadata": { "userId": "user_abc123" }   │
   │      }                                           │
   │    }                                             │
   │  }                                               │
   └──────────────────────────────────────────────────┘
                        │
                        ▼


Step 3: Webhook Handler Downgrades User
────────────────────────────────────────

   Handler Action:
   ┌──────────────────────────────────────────────────┐
   │  switch (event.type) {                           │
   │    case 'customer.subscription.deleted':         │
   │      await downgradeUserToFree(userId);          │
   │  }                                               │
   │                                                  │
   │  async function downgradeUserToFree(userId) {    │
   │    await db.tx.usage[usageId].update({           │
   │      tier: 'free',                               │
   │      subscriptionId: null,                       │
   │    });                                           │
   │  }                                               │
   └──────────────────────────────────────────────────┘
                        │
                        ▼


Step 4: User Reverted to Free Tier
───────────────────────────────────

   Database Update:
   ┌─────────────────────────────────────────┐
   │  userId: "user_abc123"                  │
   │  tier: "free"         ⬅ CHANGED BACK   │
   │  count: 0             ⬅ RESET          │
   │  lastReset: [now]     ⬅ NEW TIMESTAMP  │
   │  subscriptionId: null ⬅ REMOVED        │
   └─────────────────────────────────────────┘

   User Experience:
   ┌─────────────────────────────────────┐
   │  Daily limit: 20 images             │
   │  Watermark: YES                     │
   │  Remaining: 20/20                   │
   └─────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          WATERMARK LOGIC
═══════════════════════════════════════════════════════════════════════════════

File: lib/watermark.ts

   Function: addWatermarkIfFree(imageDataUrl, tier, options)

   ┌──────────────────────────────────────────────────┐
   │  export async function addWatermarkIfFree(       │
   │    imageDataUrl: string,                         │
   │    tier: 'free' | 'pro' | 'unlimited' | undefined, │
   │    options: WatermarkOptions = {}                │
   │  ): Promise<string> {                            │
   │                                                  │
   │    // Only add watermark for free tier users    │
   │    if (tier === 'free') {                        │
   │      return addWatermark(imageDataUrl, options); │
   │    }                                             │
   │                                                  │
   │    // Return original image for pro/unlimited   │
   │    return imageDataUrl;                          │
   │  }                                               │
   └──────────────────────────────────────────────────┘

   Watermark Placement:
   ┌─────────────────────────────────────────┐
   │  Pic-Forge.com  ⬅ Top-right             │
   │                                         │
   │          [IMAGE]                        │
   │                                         │
   │  Pic-Forge.com  ⬅ Bottom-left           │
   └─────────────────────────────────────────┘

   Why dual watermarks?
   → Prevents easy cropping
   → Maintains brand visibility
   → Encourages Pro upgrade


═══════════════════════════════════════════════════════════════════════════════
                          USAGE TRACKING
═══════════════════════════════════════════════════════════════════════════════

File: hooks/useImageTracking.ts

   Logic Flow:
   ┌──────────────────────────────────────────────────┐
   │  const hasReachedLimit = () => {                 │
   │    if (!user || !usage) return false;            │
   │                                                  │
   │    // Pro and Unlimited users have no limits    │
   │    if (usage.tier === 'pro' ||                   │
   │        usage.tier === 'unlimited') {             │
   │      return false;                               │
   │    }                                             │
   │                                                  │
   │    // Free tier: 20 images per day              │
   │    return usage.count >= 20;                     │
   │  }                                               │
   │                                                  │
   │  const getRemainingImages = () => {              │
   │    if (!user || !usage) return null;             │
   │                                                  │
   │    if (usage.tier === 'pro' ||                   │
   │        usage.tier === 'unlimited') {             │
   │      return 'Unlimited';                         │
   │    }                                             │
   │                                                  │
   │    const remaining = Math.max(0, 20 - usage.count); │
   │    return remaining;                             │
   │  }                                               │
   └──────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          CRITICAL DEPENDENCIES
═══════════════════════════════════════════════════════════════════════════════

1. Stripe Publishable Key (Frontend)
   ├─ Used in: app/pricing/page.tsx
   ├─ Env var: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   └─ Current: pk_live_51RyEptDlxrM8ZIxc...

2. Stripe Secret Key (Backend)
   ├─ Used in: app/api/create-checkout-session/route.ts
   ├─ Env var: STRIPE_SECRET_KEY
   └─ Current: sk_live_51RyEptDlxrM8ZIxc...

3. Stripe Webhook Secret (Backend)
   ├─ Used in: app/api/webhooks/stripe/route.ts
   ├─ Env var: STRIPE_WEBHOOK_SECRET
   └─ Current: whsec_YOUR_SECRET_HERE  ⚠️ PLACEHOLDER!

4. Price IDs (Frontend & Backend)
   ├─ Monthly: price_1SIcgtDlxrM8ZIxcgNwPSV1Y
   └─ Yearly: price_1SIchxDlxrM8ZIxcRxrH56WL

5. InstantDB App ID
   ├─ Used in: lib/instantdb.ts
   ├─ Env var: NEXT_PUBLIC_INSTANT_APP_ID
   └─ Current: 59da2600-08d9-476c-a591-ddc662b14847


═══════════════════════════════════════════════════════════════════════════════
                          REVENUE TRACKING
═══════════════════════════════════════════════════════════════════════════════

Recommended Metrics to Track:

1. Monthly Recurring Revenue (MRR)
   ├─ Monthly subscribers × $14
   └─ Yearly subscribers × ($119/12) = $9.92/mo

2. Conversion Rate
   ├─ (Paid users / Total users) × 100
   └─ Target: 2-5% (SaaS industry average)

3. Churn Rate
   ├─ (Canceled subscriptions / Total subscriptions) × 100
   └─ Target: <5% monthly

4. Average Revenue Per User (ARPU)
   ├─ Total revenue / Total active users
   └─ Includes free, pro, and unlimited tiers

5. Customer Lifetime Value (CLV)
   ├─ ARPU × Average customer lifespan (months)
   └─ Compare to customer acquisition cost (CAC)


═══════════════════════════════════════════════════════════════════════════════
                          MONITORING & ALERTS
═══════════════════════════════════════════════════════════════════════════════

What to Monitor:

1. Webhook Success Rate
   ├─ Location: Stripe Dashboard → Webhooks → Logs
   ├─ Target: >99% success rate
   └─ Alert if: <95% in last hour

2. Payment Success Rate
   ├─ Location: Stripe Dashboard → Payments
   ├─ Target: >90% (depends on card decline rates)
   └─ Alert if: <80% in last 24 hours

3. User Tier Sync Issues
   ├─ Check: Users with subscriptionId but tier='free'
   ├─ Check: Users with tier='pro' but no subscriptionId
   └─ Alert if: Any discrepancies found

4. Revenue Anomalies
   ├─ Check: Daily revenue vs. 7-day average
   ├─ Alert if: >50% drop from average
   └─ Alert if: Spike >200% (potential fraud)


═══════════════════════════════════════════════════════════════════════════════
                          SECURITY CONSIDERATIONS
═══════════════════════════════════════════════════════════════════════════════

✅ Implemented:
├─ Webhook signature verification (prevents fake requests)
├─ HTTPS-only endpoints (enforced by Vercel)
├─ Environment variables secured in Vercel
├─ No API keys in client-side code
└─ Metadata validation (userId must exist)

⚠️ Recommended Additions:
├─ Rate limiting on checkout API (prevent abuse)
├─ CAPTCHA on pricing page (prevent bots)
├─ Fraud detection (monitor unusual payment patterns)
├─ Email verification before checkout (reduce chargebacks)
└─ 2FA for account changes (protect against account takeover)


═══════════════════════════════════════════════════════════════════════════════
                          SUPPORT WORKFLOW
═══════════════════════════════════════════════════════════════════════════════

Common User Issues:

1. "I paid but still see Free tier"
   ├─ Check: Stripe webhook logs
   ├─ Check: InstantDB usage table for user
   ├─ Fix: Manually trigger webhook or update tier
   └─ Refund if issue persists

2. "Watermark still shows after upgrade"
   ├─ Check: User tier in database
   ├─ Ask: User to refresh page and clear cache
   ├─ Check: Watermark logic in download function
   └─ Verify: tier value passed to addWatermarkIfFree()

3. "Payment failed but I want Pro"
   ├─ Check: Stripe payment logs for error
   ├─ Common: Insufficient funds, expired card, incorrect CVC
   ├─ Ask: User to try different payment method
   └─ Offer: Alternative payment options (PayPal, etc.)

4. "I want to cancel my subscription"
   ├─ Direct: User to Stripe Customer Portal
   ├─ Alternative: Cancel from Stripe Dashboard
   ├─ Note: Downgrade happens automatically via webhook
   └─ Retention: Offer discount or pause instead?


═══════════════════════════════════════════════════════════════════════════════

**NEXT STEP:** Configure webhook secret in Stripe Dashboard and Vercel.

See: docs/STRIPE_WEBHOOK_SETUP.md for detailed instructions.

═══════════════════════════════════════════════════════════════════════════════
