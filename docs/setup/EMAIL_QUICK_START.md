# PicForge Email System - Quick Start Guide

## TL;DR

1. **Create Resend account** at [resend.com](https://resend.com)
2. **Verify pic-forge.com** (add 3 DNS records)
3. **Get API key** from Resend dashboard
4. **Add to Vercel:** `RESEND_API_KEY=re_your_key`
5. **Test:** `npm run test:email`

Done! Emails will auto-send.

---

## Step 1: Create Resend Account (2 minutes)

1. Go to https://resend.com
2. Click "Sign Up"
3. Use: `derek.bobola@gmail.com`
4. Verify email

**Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Perfect for launch!

---

## Step 2: Verify Domain (5 minutes + DNS propagation time)

### Add Domain

1. In Resend dashboard, click **Domains**
2. Click "Add Domain"
3. Enter: `pic-forge.com`

### Get DNS Records

Resend will show 3 DNS records to add. Example:

| Type | Name | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:_spf.resend.com ~all` |
| TXT | resend._domainkey | `k=rsa; p=MIGfMA0GC...` (long string) |
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:derek.bobola@gmail.com` |

### Add to Your DNS Provider

Go to your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and add these 3 TXT records.

**Important:** DNS can take up to 48 hours to propagate. Usually it's faster (minutes to hours).

### Verify

1. Wait for DNS to propagate (check at https://whatsmydns.net)
2. In Resend, click "Verify"
3. Green checkmark = you're good!

---

## Step 3: Get API Key (1 minute)

1. In Resend dashboard, go to **API Keys**
2. Click "Create API Key"
3. Name: `PicForge Production`
4. Permission: **Sending access**
5. Click "Create"
6. **COPY THE KEY NOW** (starts with `re_`)

**Example:** `re_123abc456def789ghi012jkl345mno678`

---

## Step 4: Add to Vercel (2 minutes)

### Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your PicForge project
3. Click **Settings** → **Environment Variables**
4. Click "Add New"
5. Add:
   - **Key:** `RESEND_API_KEY`
   - **Value:** (paste your `re_...` key)
   - **Environments:** Check all 3 (Production, Preview, Development)
6. Click "Save"
7. **Redeploy** your app to pick up the new variable

### For Local Development

Add to `.env.local`:

```bash
RESEND_API_KEY=re_your_api_key_here
```

---

## Step 5: Test Emails (3 minutes)

### Start Dev Server

```bash
npm run dev
```

### Run Email Tests

In a new terminal:

```bash
npm run test:email
```

This will send 6 test emails to `derek.bobola@gmail.com`:
1. Welcome email
2. Limit warning (5 left)
3. Limit reached
4. Promo code redeemed
5. Pro upgrade
6. Weekly digest

### Check Results

- Look for "All tests passed!" message
- Check inbox for 6 emails from PicForge
- Verify they're not in spam
- Click links to test functionality

---

## That's It!

Emails will now automatically send when:
- User signs up (welcome email)
- User hits 15 images (warning)
- User hits 20 images (limit reached)
- User redeems promo code
- User upgrades to Pro (via Stripe - when integrated)

---

## Quick Troubleshooting

### Emails not sending

**Check API key is set:**
```bash
# In Vercel dashboard
Settings → Environment Variables → Look for RESEND_API_KEY
```

**Check Resend dashboard:**
- Domain verified? (green checkmark)
- API key active?
- Rate limits not exceeded? (100/day free)

### Emails going to spam

**Check DNS records:**
```bash
# Use online checker
https://whatsmydns.net
# Search for: pic-forge.com
# Type: TXT
```

**Wait for DNS propagation:**
- Can take up to 48 hours
- Usually much faster (minutes)

### Test script fails

**Make sure dev server is running:**
```bash
npm run dev
```

**Check .env.local has API key:**
```bash
# Should have this line:
RESEND_API_KEY=re_your_key_here
```

---

## What Happens Next?

### Automatic Email Triggers

**Welcome Email:**
- Sent when user signs up
- Triggered in `components/AuthButton.tsx`
- No action needed!

**Limit Emails:**
- Warning at 15/20 images
- Reached at 20/20 images
- Triggered in `hooks/useImageTracking.ts`
- Only for free tier users

**Promo Code Email:**
- Sent when code redeemed
- Triggered in `hooks/usePromoCode.ts`
- Always sent (even if user opted out)

**Pro Upgrade Email:**
- Will be triggered by Stripe webhook
- Template ready, just needs webhook integration

### User Controls

Users can manage emails at:
- **Preferences:** https://pic-forge.com/profile/emails
- **Unsubscribe:** https://pic-forge.com/unsubscribe

All preferences sync instantly via InstantDB.

---

## Need More Help?

**Detailed Setup Guide:**
`docs/setup/RESEND_SETUP.md` - Comprehensive instructions with troubleshooting

**Full Documentation:**
`docs/setup/EMAIL_SYSTEM_SUMMARY.md` - Complete architecture overview

**Resend Support:**
- Docs: https://resend.com/docs
- Email: support@resend.com
- Discord: https://resend.com/discord

**Test Your Setup:**
```bash
# Send test emails
npm run test:email

# Check environment variables
npm run check-env
```

---

## Production Checklist

Before going live:

- [ ] Resend account created
- [ ] Domain verified (green checkmark)
- [ ] API key added to Vercel
- [ ] API key added to `.env.local`
- [ ] Test emails sent successfully
- [ ] Emails not in spam folder
- [ ] All links work (CTAs, unsubscribe)
- [ ] Mobile responsive (test on phone)
- [ ] Preferences page accessible
- [ ] Unsubscribe flow tested

**Total Setup Time:** ~15 minutes (plus DNS propagation wait)

---

**Last Updated:** October 23, 2025
**Contact:** derek.bobola@gmail.com
