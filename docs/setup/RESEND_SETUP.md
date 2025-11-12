# Resend Email Service Setup Guide

This guide will help you configure the Resend email service for PicForge.com to enable transactional emails (welcome, limit notifications, promo code confirmations, etc.).

## Prerequisites

- A Resend account (free tier includes 100 emails/day, 3,000/month)
- Domain ownership of `pic-forge.com`
- Access to DNS settings for your domain
- Vercel project access to set environment variables

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" or "Get Started"
3. Sign up with your email (use `derek.bobola@gmail.com`)
4. Verify your email address

## Step 2: Add and Verify Domain

### Add Domain

1. In the Resend dashboard, navigate to **Domains**
2. Click "Add Domain"
3. Enter: `pic-forge.com`
4. Click "Add"

### Configure DNS Records

Resend will provide you with DNS records to add. You'll need to add these to your domain's DNS settings (likely through your domain registrar or hosting provider).

**DNS Records to Add:**

1. **SPF Record** (TXT)
   - Name: `@` or `pic-forge.com`
   - Value: `v=spf1 include:_spf.resend.com ~all`
   - TTL: 3600 (or default)

2. **DKIM Record** (TXT)
   - Name: `resend._domainkey` (Resend will provide exact subdomain)
   - Value: (Long string provided by Resend)
   - TTL: 3600 (or default)

3. **DMARC Record** (TXT) - Optional but recommended
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:derek.bobola@gmail.com`
   - TTL: 3600 (or default)

**Example DNS Configuration:**

```
Type  | Name                    | Value
------|-------------------------|---------------------------------------
TXT   | @                       | v=spf1 include:_spf.resend.com ~all
TXT   | resend._domainkey       | k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4...
TXT   | _dmarc                  | v=DMARC1; p=none; rua=mailto:derek.bobola@gmail.com
```

### Verify Domain

1. After adding DNS records, return to Resend dashboard
2. Click "Verify" next to your domain
3. Resend will check DNS records (may take up to 48 hours for DNS propagation)
4. Once verified, you'll see a green checkmark

**Note:** DNS propagation can take anywhere from a few minutes to 48 hours. You can check DNS propagation status using tools like:
- [whatsmydns.net](https://www.whatsmydns.net/)
- [dnschecker.org](https://dnschecker.org/)

## Step 3: Get API Key

1. In the Resend dashboard, go to **API Keys**
2. Click "Create API Key"
3. Name it: `PicForge Production`
4. Select permission: **Sending access** (full access)
5. Click "Create"
6. **Copy the API key immediately** (you won't be able to see it again)

Example API key format: `re_123abc456def789ghi012jkl345mno678`

## Step 4: Add Environment Variable to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your PicForge project
3. Navigate to **Settings** > **Environment Variables**
4. Click "Add New"
5. Enter:
   - **Key:** `RESEND_API_KEY`
   - **Value:** (paste your Resend API key)
   - **Environments:** Select all (Production, Preview, Development)
6. Click "Save"

### Option B: Via Local `.env.local`

For local development, add to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
```

## Step 5: Test Email Sending

### Test with API Route

You can test email sending using curl or a tool like Postman:

```bash
curl -X POST https://pic-forge.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "derek.bobola@gmail.com",
    "type": "welcome",
    "data": {
      "userName": "Derek",
      "userEmail": "derek.bobola@gmail.com"
    }
  }'
```

### Test with Script

Run the test script from your project root:

```bash
npm run test:email
```

This will send test emails of all types to `derek.bobola@gmail.com`.

## Step 6: Verify Email Delivery

### Check Inbox

1. Check your inbox for test emails
2. Verify emails are:
   - Delivered (not in spam)
   - Properly formatted
   - Links work correctly
   - Unsubscribe links are functional

### Check Resend Dashboard

1. Go to Resend dashboard > **Emails**
2. View sent emails and delivery status
3. Check open rates and click rates
4. Review any bounces or complaints

### Common Issues

**Emails going to spam:**
- Ensure DNS records are properly configured
- Verify domain is fully authenticated
- Check SPF and DKIM records are valid
- Add PicForge to email whitelist for testing

**Emails not sending:**
- Verify `RESEND_API_KEY` is set correctly
- Check Resend API key has sending permissions
- Review error logs in Vercel or local console
- Ensure you're not exceeding rate limits (100/day on free tier)

**DNS not verifying:**
- Wait 24-48 hours for DNS propagation
- Use DNS checker tools to verify records
- Ensure no typos in DNS values
- Check with your DNS provider for any restrictions

## Email Types Available

PicForge currently supports these email types:

1. **welcome** - Sent when user signs up
2. **limit-warning** - Sent at 5 images remaining (free tier)
3. **limit-reached** - Sent when user hits 20 image limit
4. **promo-redeemed** - Sent when promo code is successfully redeemed
5. **weekly-digest** - Weekly summary (future implementation)

## Email Preferences

Users can manage email preferences at:
- **Profile page:** `https://pic-forge.com/profile/emails`
- **Quick unsubscribe:** `https://pic-forge.com/unsubscribe`

All emails include unsubscribe links in the footer (CAN-SPAM compliance).

## Rate Limits

**Resend Free Tier:**
- 100 emails per day
- 3,000 emails per month
- 1 domain verified

**When to Upgrade:**
If you exceed these limits, consider upgrading to Resend Pro:
- $20/month
- 50,000 emails/month
- Multiple domains
- Dedicated IP (optional)
- Advanced analytics

## Monitoring and Analytics

### Resend Dashboard

Monitor email performance in Resend dashboard:
- **Deliverability rate** - % of emails successfully delivered
- **Open rate** - % of emails opened (tracked via invisible pixel)
- **Click rate** - % of links clicked
- **Bounce rate** - % of emails that bounced
- **Complaint rate** - % marked as spam

### Expected Benchmarks

- **Deliverability:** >95%
- **Open rate:** 20-30% (transactional emails typically higher)
- **Click rate:** 3-5%
- **Bounce rate:** <2%
- **Complaint rate:** <0.1%

## Troubleshooting

### Email Not Received

1. Check spam/junk folder
2. Verify email address is correct
3. Check Resend dashboard for delivery status
4. Review error logs in Vercel or browser console
5. Test with different email provider (Gmail, Outlook, etc.)

### Domain Not Verifying

1. Wait 24-48 hours for DNS propagation
2. Use `nslookup` or `dig` to verify DNS records:
   ```bash
   nslookup -type=txt pic-forge.com
   nslookup -type=txt resend._domainkey.pic-forge.com
   ```
3. Contact your DNS provider if records aren't propagating
4. Verify no conflicting DNS records exist

### API Key Not Working

1. Regenerate API key in Resend dashboard
2. Update environment variable in Vercel
3. Redeploy application to pick up new env var
4. Clear browser cache and test again

### Rate Limit Exceeded

1. Check current usage in Resend dashboard
2. Upgrade to paid plan if needed
3. Implement email queuing to batch sends
4. Consider reducing email frequency

## Support

**Resend Support:**
- Documentation: [resend.com/docs](https://resend.com/docs)
- Email: support@resend.com
- Discord: [resend.com/discord](https://resend.com/discord)

**PicForge Issues:**
- Contact: derek.bobola@gmail.com
- Check logs in Vercel dashboard
- Review email templates in `/emails` folder

## Next Steps

After setting up Resend:

1. Test all email types thoroughly
2. Monitor deliverability rates for first week
3. Add custom email domain (if desired): `no-reply@pic-forge.com`
4. Set up email preferences page for users
5. Implement weekly digest emails (optional)
6. Configure Stripe webhook for Pro upgrade emails

## Security Notes

- **Never commit API keys to Git** - Always use `.env.local` or Vercel env vars
- **Rotate API keys** regularly (every 90 days recommended)
- **Monitor for abuse** - Check Resend dashboard for unusual sending patterns
- **Rate limit API endpoint** - Prevent spam or abuse of email sending
- **Validate email addresses** - Ensure proper format before sending

## CAN-SPAM Compliance

PicForge emails are compliant with CAN-SPAM Act:

- Clear "From" name (PicForge)
- Accurate subject lines
- Physical mailing address in footer (optional but recommended)
- Unsubscribe link in every email
- One-click unsubscribe process
- Unsubscribe honored within 10 business days

## Production Checklist

Before going live:

- [ ] Domain verified in Resend
- [ ] DNS records added and verified (SPF, DKIM, DMARC)
- [ ] API key generated and added to Vercel
- [ ] Test emails sent successfully
- [ ] Emails not going to spam
- [ ] Unsubscribe links working
- [ ] Email preferences page functional
- [ ] All email templates reviewed and approved
- [ ] Rate limiting implemented on API endpoint
- [ ] Monitoring set up in Resend dashboard

---

**Last Updated:** October 23, 2025
**Maintained By:** Derek Bobola (derek.bobola@gmail.com)
