# Payment Flow Test Checklist

**Version:** 1.0
**Test Mode:** Stripe Test Mode
**Tester:** _______________
**Date:** _______________

---

## Overview

This checklist guides you through manual testing of the complete payment flow using Stripe Test Mode. Since Stripe webhooks and checkout sessions require real user interaction, this cannot be fully automated.

**Duration:** 30-45 minutes
**Prerequisites:**
- Stripe Test Mode enabled
- Webhook endpoint configured (`/api/webhooks/stripe`)
- Test account logged in (not derek.bobola@gmail.com)

---

## Setup

### Step 1: Enable Stripe Test Mode

- [ ] Visit Stripe Dashboard: https://dashboard.stripe.com
- [ ] Toggle to **Test Mode** (top right corner - should see orange "TEST MODE" badge)
- [ ] Copy **Test Publishable Key** and **Test Secret Key**
- [ ] Update `.env.local`:
  ```
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_... (from webhook settings)
  ```

---

### Step 2: Configure Webhook

- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Click **Add endpoint**
- [ ] Endpoint URL: `https://picforge.com/api/webhooks/stripe` (or your staging URL)
- [ ] Events to listen to:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Copy **Signing secret** (`whsec_...`) to `.env.local`
- [ ] Test webhook is reachable (use "Send test webhook" button)

**Webhook Status:** [ ] Active ✅ / [ ] Failed ❌

---

## Test 1: Free User Checkout

### 1.1 Create Free User Account

- [ ] Visit PicForge.com
- [ ] Sign up with magic link using test email: `test-free-user@example.com`
- [ ] Verify welcome email received (check Resend dashboard)
- [ ] Confirm user tier is **Free** in profile page
- [ ] Note: User starts with 0/20 images used today

**Expected Result:** User created as Free tier ✅

---

### 1.2 Trigger Rate Limit

- [ ] Generate 20 images (to reach daily limit)
- [ ] Verify "rate limit warning" email sent at 15 images
- [ ] Verify "daily limit reached" email sent at 20 images
- [ ] Attempt 21st image → Should show upgrade prompt

**Expected Result:** Rate limit enforced, upgrade prompt shown ✅

---

### 1.3 Initiate Checkout

- [ ] Click "Upgrade to Pro" button
- [ ] Verify Stripe Checkout opens (new tab/modal)
- [ ] Confirm pricing shows: **$9.99/month** (or your configured price)
- [ ] Verify "Powered by Stripe" footer visible

**Expected Result:** Checkout session created ✅

---

### 1.4 Complete Test Payment

Use Stripe test card:
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

- [ ] Enter test card details
- [ ] Enter email: `test-free-user@example.com`
- [ ] Click **Subscribe** / **Pay**
- [ ] Verify redirect to success page: `/checkout/success`

**Expected Result:** Payment succeeds, redirects to success ✅

---

### 1.5 Verify Webhook Received

- [ ] Open Stripe Dashboard → Developers → Webhooks
- [ ] Find webhook endpoint, click to view events
- [ ] Verify `checkout.session.completed` event received
- [ ] Status should be: **Succeeded** (green checkmark)
- [ ] Expand event → Check response code: **200 OK**

**Expected Result:** Webhook processed successfully ✅

---

### 1.6 Verify Tier Upgrade

- [ ] Return to PicForge.com
- [ ] Go to profile page (`/profile`)
- [ ] Verify user tier shows: **Pro**
- [ ] Check "Images generated today" - should still show count from before upgrade
- [ ] Verify "Daily Limit" shows: **Unlimited**
- [ ] Generate a new image
- [ ] Verify watermark is **removed** (no "PicForge.com" text)

**Expected Result:** User upgraded to Pro, watermark removed ✅

---

### 1.7 Test Unlimited Images

- [ ] Generate 10 more images (total 30+)
- [ ] Verify no rate limit error
- [ ] Check profile → Daily limit still shows **Unlimited**

**Expected Result:** No rate limiting for Pro users ✅

---

### 1.8 Verify Subscription in Stripe

- [ ] Open Stripe Dashboard → Customers
- [ ] Find customer with email: `test-free-user@example.com`
- [ ] Verify subscription status: **Active**
- [ ] Check payment history - should show successful charge: **$9.99**

**Expected Result:** Subscription active in Stripe ✅

---

## Test 2: Subscription Cancellation

### 2.1 Cancel Subscription

- [ ] In Stripe Dashboard, find test customer
- [ ] Click subscription → Actions → Cancel subscription
- [ ] Choose "Cancel immediately" (not at period end)
- [ ] Confirm cancellation

**Expected Result:** Subscription canceled ✅

---

### 2.2 Verify Webhook for Cancellation

- [ ] Check webhook events for `customer.subscription.deleted`
- [ ] Verify response: **200 OK**

**Expected Result:** Cancellation webhook processed ✅

---

### 2.3 Verify Downgrade to Free

- [ ] Refresh PicForge profile page
- [ ] Verify user tier reverted to: **Free**
- [ ] Check daily limit: **20 images/day**
- [ ] Generate a new image
- [ ] Verify watermark is **added** again ("PicForge.com")

**Expected Result:** User downgraded to Free tier, watermark restored ✅

---

## Test 3: Failed Payment Handling

### 3.1 Create Another Free User

- [ ] Sign up with: `test-failed-payment@example.com`
- [ ] Verify Free tier active
- [ ] Hit rate limit (20 images)

---

### 3.2 Attempt Payment with Declined Card

Use Stripe's test card for declined payment:
- **Card Number:** `4000 0000 0000 0002` (decline card)
- **Expiry:** Any future date
- **CVC:** Any 3 digits

- [ ] Click "Upgrade to Pro"
- [ ] Enter declined test card
- [ ] Attempt payment
- [ ] Verify error message: "Your card was declined"

**Expected Result:** Payment fails gracefully, user stays on Free ✅

---

### 3.3 Retry with Valid Card

- [ ] User can retry payment
- [ ] Enter valid test card: `4242 4242 4242 4242`
- [ ] Complete payment successfully
- [ ] Verify upgrade to Pro works

**Expected Result:** User can retry and succeed ✅

---

## Test 4: Promo Code Redemption

### 4.1 Test Promo Code Path

- [ ] Sign up with: `test-promo-user@example.com`
- [ ] Go to profile page
- [ ] Enter promo code: `DEREK-FOUNDER-2025`
- [ ] Click "Redeem Code"
- [ ] Verify success message: "Promo code redeemed successfully!"

**Expected Result:** Promo code accepted ✅

---

### 4.2 Verify Unlimited Tier

- [ ] Check user tier: Should show **Unlimited**
- [ ] Verify daily limit: **Unlimited**
- [ ] Generate 50+ images (to verify truly unlimited)
- [ ] Verify watermark removed
- [ ] Check code cannot be reused (try redeeming again → should fail)

**Expected Result:** Unlimited tier granted, code single-use ✅

---

### 4.3 Verify No Stripe Subscription Created

- [ ] Check Stripe Dashboard → Customers
- [ ] Search for `test-promo-user@example.com`
- [ ] Verify **no customer exists** (promo codes don't create Stripe subscriptions)

**Expected Result:** No Stripe subscription for promo users ✅

---

## Test 5: Edge Cases

### 5.1 Duplicate Checkout Prevention

- [ ] As Pro user, try to access checkout page directly: `/checkout`
- [ ] Verify redirect to profile (should not allow double-checkout)

**Expected Result:** Pro users cannot checkout again ✅

---

### 5.2 Webhook Signature Validation

- [ ] In `/api/webhooks/stripe`, temporarily change `STRIPE_WEBHOOK_SECRET`
- [ ] Trigger a test webhook from Stripe Dashboard
- [ ] Verify webhook fails with **401 Unauthorized**
- [ ] Restore correct secret
- [ ] Retry webhook → should succeed

**Expected Result:** Invalid signatures rejected ✅

---

### 5.3 Race Condition Test

- [ ] Open two browser tabs as Free user
- [ ] In both tabs, click "Upgrade to Pro" simultaneously
- [ ] Complete checkout in Tab 1
- [ ] Verify Tab 2's checkout also succeeds (or gracefully cancels)
- [ ] Check Stripe → Only 1 subscription created

**Expected Result:** No duplicate subscriptions ✅

---

### 5.4 Test Webhook Retry Logic

- [ ] Temporarily break webhook endpoint (comment out InstantDB update)
- [ ] Complete a test checkout
- [ ] Verify webhook fails (check Stripe events - should show error)
- [ ] Fix webhook endpoint
- [ ] In Stripe, manually retry failed webhook
- [ ] Verify success on retry

**Expected Result:** Webhooks can be manually retried ✅

---

## Test 6: Subscription Management

### 6.1 Customer Portal Access

- [ ] As Pro user, visit profile page
- [ ] Click "Manage Subscription" button
- [ ] Verify redirects to Stripe Customer Portal
- [ ] Verify user can:
  - View payment history
  - Update payment method
  - Cancel subscription
  - Download invoices

**Expected Result:** Customer portal works ✅

---

### 6.2 Payment Method Update

- [ ] In Customer Portal, click "Update payment method"
- [ ] Enter new test card: `4000 0566 5566 5556` (Visa Debit)
- [ ] Save changes
- [ ] Verify webhook fired: `customer.updated`
- [ ] Next billing cycle should use new card

**Expected Result:** Payment method updates successfully ✅

---

## Test 7: Email Notifications

### 7.1 Pro Upgrade Email

- [ ] After successful Pro upgrade, check Resend dashboard
- [ ] Verify "Pro Upgrade Confirmation" email sent
- [ ] Email should include:
  - Congratulations message
  - Unlimited images badge
  - No watermark badge
  - Receipt/invoice link
  - Support contact

**Expected Result:** Pro upgrade email sent ✅

---

### 7.2 Subscription Cancellation Email

- [ ] After canceling subscription, check Resend
- [ ] Verify "Subscription Canceled" email sent (if implemented)
- [ ] Should include feedback survey link

**Expected Result:** Cancellation email sent ✅

---

## Test 8: Analytics Tracking

### 8.1 Verify GA4 Events

- [ ] Open GA4 DebugView
- [ ] As test user, complete checkout flow
- [ ] Verify events tracked:
  - `begin_checkout` (when clicking "Upgrade to Pro")
  - `purchase` (after successful payment)
  - `pro_upgrade` (custom event)
  - Event parameters:
    - `value`: 9.99
    - `currency`: USD
    - `transaction_id`: Stripe session ID

**Expected Result:** All checkout events tracked ✅

---

## Summary

### Pass/Fail Summary

| Test | Status |
|------|--------|
| 1.1 Free User Checkout | [ ] ✅ / [ ] ❌ |
| 1.2 Trigger Rate Limit | [ ] ✅ / [ ] ❌ |
| 1.3 Initiate Checkout | [ ] ✅ / [ ] ❌ |
| 1.4 Complete Test Payment | [ ] ✅ / [ ] ❌ |
| 1.5 Verify Webhook Received | [ ] ✅ / [ ] ❌ |
| 1.6 Verify Tier Upgrade | [ ] ✅ / [ ] ❌ |
| 1.7 Test Unlimited Images | [ ] ✅ / [ ] ❌ |
| 1.8 Verify Subscription in Stripe | [ ] ✅ / [ ] ❌ |
| 2.1 Cancel Subscription | [ ] ✅ / [ ] ❌ |
| 2.2 Verify Webhook for Cancellation | [ ] ✅ / [ ] ❌ |
| 2.3 Verify Downgrade to Free | [ ] ✅ / [ ] ❌ |
| 3.1 Failed Payment Handling | [ ] ✅ / [ ] ❌ |
| 3.2 Retry with Valid Card | [ ] ✅ / [ ] ❌ |
| 4.1 Promo Code Redemption | [ ] ✅ / [ ] ❌ |
| 4.2 Verify Unlimited Tier | [ ] ✅ / [ ] ❌ |
| 4.3 No Stripe Subscription Created | [ ] ✅ / [ ] ❌ |
| 5.1 Duplicate Checkout Prevention | [ ] ✅ / [ ] ❌ |
| 5.2 Webhook Signature Validation | [ ] ✅ / [ ] ❌ |
| 5.3 Race Condition Test | [ ] ✅ / [ ] ❌ |
| 5.4 Webhook Retry Logic | [ ] ✅ / [ ] ❌ |
| 6.1 Customer Portal Access | [ ] ✅ / [ ] ❌ |
| 6.2 Payment Method Update | [ ] ✅ / [ ] ❌ |
| 7.1 Pro Upgrade Email | [ ] ✅ / [ ] ❌ |
| 7.2 Cancellation Email | [ ] ✅ / [ ] ❌ |
| 8.1 GA4 Events Tracked | [ ] ✅ / [ ] ❌ |

**Total Passed:** _____ / 24
**Total Failed:** _____ / 24

---

### Critical Issues Found

List any critical issues that must be fixed before launch:

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

---

### Recommendations

Suggested improvements (nice-to-have, not blockers):

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

---

### Final Sign-Off

**Tester Name:** _______________________
**Date:** _______________________
**Status:** [ ] PASS - Ready for Launch / [ ] FAIL - Requires Fixes

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Appendix: Stripe Test Cards

### Successful Payments
- `4242 4242 4242 4242` - Visa (always succeeds)
- `5555 5555 5555 4444` - Mastercard (always succeeds)
- `3782 822463 10005` - American Express (always succeeds)

### Declined Payments
- `4000 0000 0000 0002` - Generic decline
- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 0069` - Expired card
- `4000 0000 0000 0127` - Incorrect CVC

### 3D Secure Authentication
- `4000 0025 0000 3155` - Requires authentication (test 3DS)
- `4000 0027 6000 3184` - Authentication fails

### Specific Card Types
- `4000 0566 5566 5556` - Visa Debit
- `5200 8282 8282 8210` - Mastercard Debit
- `6011 1111 1111 1117` - Discover

For more test cards: https://stripe.com/docs/testing#cards
