# PicForge Email Notification System

Complete email automation system built with Resend and React Email. Sends beautiful, branded emails for user engagement and retention.

## Features

- **5 Email Templates** - Welcome, limit warnings, limit reached, promo redeemed, weekly digest
- **Automated Triggers** - Emails sent automatically based on user actions
- **User Preferences** - Full control over email frequency and types
- **Mobile Responsive** - All templates work perfectly on mobile devices
- **Brand Consistent** - Matches PicForge's edgy, direct tone

## Quick Setup

### 1. Install Resend Account (FREE)

1. Go to https://resend.com/signup
2. Create a free account (3,000 emails/month free forever)
3. Verify your email address

### 2. Get API Key

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "PicForge Production"
4. Copy the API key (starts with `re_`)

### 3. Configure Domain

**Option A: Use Your Domain (pic-forge.com)**
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: `pic-forge.com`
4. Add these DNS records to your domain provider (Vercel):
   - **SPF**: `v=spf1 include:amazonses.com ~all`
   - **DKIM**: Copy the TXT records Resend provides
   - **DMARC**: `v=DMARC1; p=none;`
5. Wait for verification (usually 15-30 minutes)
6. Emails will send from: `no-reply@pic-forge.com`

**Option B: Test with Free Email (Quick Start)**
1. Go to https://resend.com/domains
2. Use the default test domain (e.g., `onboarding.resend.dev`)
3. Emails will send from: `onboarding@resend.dev`
4. Good for testing, but upgrade to custom domain for production

### 4. Add API Key to Environment

Edit `.env.local`:

```bash
# Resend API Key (for email notifications)
RESEND_API_KEY=re_your_actual_api_key_here
```

### 5. Test the System

Restart your dev server:

```bash
npm run dev
```

Then test each email type:

**Test Welcome Email:**
1. Sign out if logged in
2. Sign up with a new email
3. Check your inbox for welcome email

**Test Limit Warning:**
1. Generate 15 images (if on free tier)
2. Check email after 15th image

**Test Limit Reached:**
1. Generate 20 images total
2. Check email after hitting limit

**Test Promo Code:**
1. Go to /profile
2. Redeem code: `DEREK-FOUNDER-2025`
3. Check email for confirmation

## Email Templates

### 1. Welcome Email
**Trigger:** New user signup (within 60 seconds)
**Location:** `emails/WelcomeEmail.tsx`
**Features:**
- Introduces PicForge features
- Explains daily limits
- Links to quick tips
- Brand callout: "(re)Imagine. Everything."

### 2. Limit Warning Email
**Trigger:** User has 5 images remaining (free tier)
**Location:** `emails/LimitWarningEmail.tsx`
**Features:**
- Shows remaining images
- Promotes Pro upgrade
- Links to promo code redemption

### 3. Limit Reached Email
**Trigger:** User hits 20 image daily limit (free tier)
**Location:** `emails/LimitReachedEmail.tsx`
**Features:**
- Shows reset time
- Pricing comparison
- Promo code reminder

### 4. Promo Code Redeemed Email
**Trigger:** User successfully redeems promo code
**Location:** `emails/PromoCodeRedeemedEmail.tsx`
**Features:**
- Confirms unlimited access
- Lists new benefits
- Encourages experimentation

### 5. Weekly Digest Email
**Trigger:** Manual (via cron job or admin panel)
**Location:** `emails/WeeklyDigestEmail.tsx`
**Features:**
- Shows transformation count
- Displays top images
- Lists favorite prompts
- Community trends

## Email Preferences Page

Users can control their email settings at: `/email-preferences`

**Settings Available:**
- Welcome Emails (on signup)
- Daily Limit Warnings (free tier)
- Weekly Digests (stats recap)
- Marketing & Updates (new features)

**Important:** Transactional emails (receipts, confirmations) always send regardless of preferences.

## Integration Points

### useImageTracking Hook
Location: `hooks/useImageTracking.ts`

Automatically sends:
- Limit warning at 5 images remaining
- Limit reached at 20 images

### usePromoCode Hook
Location: `hooks/usePromoCode.ts`

Automatically sends:
- Promo redeemed confirmation

### AuthButton Component
Location: `components/AuthButton.tsx`

Automatically sends:
- Welcome email for new users

## API Routes

### POST /api/send-email
Sends any email type.

**Request Body:**
```json
{
  "to": "user@example.com",
  "type": "welcome",
  "data": {
    "userName": "John",
    "userEmail": "user@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully to user@example.com"
}
```

**Email Types:**
- `welcome` - Welcome new users
- `limit-warning` - Warn about approaching limit
- `limit-reached` - Notify about hitting limit
- `promo-redeemed` - Confirm promo code redemption
- `weekly-digest` - Send weekly stats recap

## Email Design System

All templates use PicForge brand colors:
- **Primary:** Teal (#14b8a6)
- **Black:** #000000
- **White:** #ffffff
- **Gray:** #333333, #666666

**Tone:**
- Edgy, direct, NOT corporate
- Bold statements
- "Nothing is real anymore"
- "Make them weird. Make them epic. Make them yours."

## Cost Breakdown

**Resend Pricing:**
- **FREE Tier:** 3,000 emails/month
- **Pro Tier:** $20/month for 50,000 emails
- **Business Tier:** $80/month for 250,000 emails

**Expected Usage:**
- Welcome: ~100/month (new signups)
- Limit Warnings: ~500/month (active free users)
- Limit Reached: ~300/month (free users hitting limit)
- Promo Redeemed: ~20/month
- Weekly Digests: ~400/month (active users)

**Total:** ~1,320 emails/month = **$0/month** (well within free tier)

## Deliverability Best Practices

1. **Domain Authentication** - Always use custom domain with proper DNS
2. **Warm Up Sending** - Start slow, gradually increase volume
3. **Monitor Bounce Rates** - Keep under 5%
4. **Unsubscribe Links** - All marketing emails include them
5. **List Hygiene** - Remove inactive emails regularly

## Testing Emails Locally

### Preview Templates
```bash
cd emails
npm run dev
```

Opens React Email preview at `http://localhost:3000`

### Send Test Email
```javascript
// In your browser console
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'your-email@example.com',
    type: 'welcome',
    data: {
      userName: 'Test User',
      userEmail: 'your-email@example.com'
    }
  })
});
```

## Troubleshooting

### Email Not Sending
1. Check API key is correct in `.env.local`
2. Verify domain is verified in Resend dashboard
3. Check browser console for errors
4. Look at Resend logs: https://resend.com/logs

### Email Goes to Spam
1. Verify SPF, DKIM, DMARC records
2. Check sender reputation: https://senderscore.org
3. Reduce sending frequency
4. Add plain text version of emails

### Domain Not Verifying
1. Wait 24-48 hours for DNS propagation
2. Use `nslookup` to verify records
3. Contact Resend support if stuck

## Future Enhancements

### Planned Features:
- [ ] A/B test subject lines
- [ ] Personalized send times (optimal for each user)
- [ ] Re-engagement campaign (inactive users)
- [ ] Referral program emails
- [ ] Showcase feature highlights
- [ ] Holiday/seasonal campaigns
- [ ] User milestone celebrations (100th image, etc)

### Analytics Integration:
- [ ] Track open rates
- [ ] Track click-through rates
- [ ] Conversion tracking (email → upgrade)
- [ ] Revenue attribution

## Support

**Resend Docs:** https://resend.com/docs
**React Email Docs:** https://react.email/docs

**Issues?** Contact derek.bobola@gmail.com
