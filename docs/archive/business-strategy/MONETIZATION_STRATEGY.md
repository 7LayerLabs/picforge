# Monetization Strategy

## Overview
Add a freemium pricing model to cover API costs and generate revenue while maintaining viral growth potential.

## Recommended Model: Freemium

### Free Tier
- **10 images/day** per user (IP-based tracking)
- Full access to all templates
- Watermark on generated images (optional)
- Perfect for viral sharing and discovery

### Pro Tier - $4.99/month
- **500 images/month**
- No watermarks
- Priority processing (faster queue)
- Early access to new templates
- Download history access
- Commercial use rights

### Optional: Credit Packs (Alternative)
- 20 images for $5
- 100 images for $20
- 500 images for $75
- Credits never expire
- Good for occasional users who don't want monthly commitment

## Cost Analysis

### Current API Costs (Gemini)
- Estimated $0.01-0.05 per image
- At scale: ~$0.02 average

### Revenue Projection (Conservative)
- 100 paid users × $4.99 = **$499/month**
- Average usage: 200 images/user/month = 20,000 images
- API costs: 20,000 × $0.02 = **$400**
- **Net profit: ~$100/month** (plus room for growth)

### Revenue Projection (Moderate Growth)
- 500 paid users × $4.99 = **$2,495/month**
- Average usage: 200 images/user/month = 100,000 images
- API costs: 100,000 × $0.02 = **$2,000**
- **Net profit: ~$500/month**

## Implementation Features

### 1. User Accounts (Required)
- Email/password auth OR social login
- Track usage per user instead of IP
- Store user's generation history
- Manage subscription status

### 2. Payment Integration
- **Stripe** (recommended)
  - Easy setup
  - Handles subscriptions automatically
  - PCI compliant
  - 2.9% + $0.30 per transaction
- Alternative: Paddle, LemonSqueezy

### 3. Usage Tracking
- Count images generated per user
- Daily reset for free tier
- Monthly reset for pro tier
- Show usage in dashboard

### 4. Paywall UI
```
When user hits limit:

┌─────────────────────────────────────┐
│  🎨 You've Used Your 10 Free Images │
│                                     │
│  Upgrade to Pro for unlimited fun!  │
│                                     │
│  ✓ 500 images/month                │
│  ✓ No watermarks                   │
│  ✓ Priority processing             │
│  ✓ Commercial rights               │
│                                     │
│  [Upgrade to Pro - $4.99/mo]       │
│  or wait 24 hours for free reset   │
└─────────────────────────────────────┘
```

### 5. Additional Revenue Streams

**Enterprise/API Access**
- $99/month for 10,000 images
- API key for developers
- White-label option

**Custom Template Store**
- Premium templates for $0.99 each
- Template packs for $4.99
- User-submitted templates (revenue share)

**Print/Download Upgrades**
- $1.99 for high-res download (8K)
- $9.99 for commercial license per image

## Technical Requirements

### Database Schema
```sql
users:
  - id
  - email
  - subscription_tier (free/pro)
  - images_used_today (for free tier)
  - images_used_month (for pro tier)
  - subscription_expires_at
  - stripe_customer_id

subscriptions:
  - user_id
  - stripe_subscription_id
  - status (active/cancelled/expired)
  - plan (monthly/annual)
  - created_at
```

### API Changes
- Add authentication middleware
- Check usage limits before processing
- Return usage stats in response
- Handle payment webhooks from Stripe

### Frontend Changes
- Login/signup modal
- User dashboard with usage stats
- Upgrade/billing page
- Show remaining images counter

## Launch Strategy

### Phase 1: Soft Launch (Week 1-2)
1. Deploy free tier only
2. Test usage patterns
3. Gather user feedback
4. Optimize API costs

### Phase 2: Paid Launch (Week 3-4)
1. Add Stripe integration
2. Launch Pro tier
3. Email existing users about upgrade option
4. Monitor conversion rate (target: 2-5%)

### Phase 3: Optimization (Month 2+)
1. A/B test pricing ($4.99 vs $7.99)
2. Add annual plan discount (2 months free)
3. Implement referral program (free credits)
4. Add template marketplace

## Key Metrics to Track
- Free → Pro conversion rate (target: 3%)
- Churn rate (target: <10%/month)
- Average images per user
- Revenue per user
- API cost per image
- Customer acquisition cost

## Why This Works for PicForge
✅ Low entry barrier (free tier = viral growth)
✅ Clear value prop (remove limits, no watermarks)
✅ Fair pricing ($5/mo is impulse buy territory)
✅ Scalable (more users = more revenue)
✅ Covers costs + profit margin
✅ Room for upsells (templates, high-res, etc.)

## Next Steps When Ready to Implement
1. Set up Stripe account
2. Add authentication (NextAuth.js recommended)
3. Create user dashboard
4. Implement usage tracking
5. Add paywall UI
6. Test payment flow
7. Deploy gradually (beta users first)
