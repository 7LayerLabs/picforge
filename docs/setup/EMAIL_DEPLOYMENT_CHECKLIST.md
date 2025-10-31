# Email System Deployment Checklist

Use this checklist to ensure your email system is properly configured and tested before going live.

---

## Phase 1: Resend Account Setup

### Create Account
- [ ] Go to https://resend.com
- [ ] Click "Sign Up"
- [ ] Use email: `derek.bobola@gmail.com`
- [ ] Verify your email address
- [ ] Log in to Resend dashboard

**Time Required:** 2 minutes

---

## Phase 2: Domain Verification

### Add Domain
- [ ] In Resend dashboard, navigate to **Domains**
- [ ] Click "Add Domain"
- [ ] Enter: `pic-forge.com`
- [ ] Click "Add"

### Get DNS Records
- [ ] Copy SPF record value
- [ ] Copy DKIM record value (long string)
- [ ] Copy DMARC record value

**Example Records:**
```
Type  | Name                | Value
------|---------------------|--------------------------------
TXT   | @                   | v=spf1 include:_spf.resend.com ~all
TXT   | resend._domainkey   | k=rsa; p=MIGfMA0GC...
TXT   | _dmarc              | v=DMARC1; p=none; rua=mailto:derek.bobola@gmail.com
```

### Add to DNS Provider
- [ ] Log in to your domain registrar (GoDaddy, Cloudflare, etc.)
- [ ] Navigate to DNS settings for pic-forge.com
- [ ] Add SPF record (Type: TXT, Name: @)
- [ ] Add DKIM record (Type: TXT, Name: resend._domainkey)
- [ ] Add DMARC record (Type: TXT, Name: _dmarc)
- [ ] Save changes

### Wait for Propagation
- [ ] Check DNS propagation at https://whatsmydns.net
- [ ] Search for: `pic-forge.com`
- [ ] Type: TXT
- [ ] Verify all 3 records show up globally

**Time Required:** 5 minutes + DNS propagation (up to 48 hours, usually faster)

### Verify Domain
- [ ] Return to Resend dashboard
- [ ] Click "Verify" next to pic-forge.com
- [ ] Wait for green checkmark
- [ ] Domain status shows "Verified"

**Time Required:** 1 minute (after DNS propagates)

---

## Phase 3: API Key Configuration

### Generate API Key
- [ ] In Resend dashboard, go to **API Keys**
- [ ] Click "Create API Key"
- [ ] Name: `PicForge Production`
- [ ] Permission: Select "Sending access"
- [ ] Click "Create"
- [ ] **COPY THE KEY IMMEDIATELY** (starts with `re_`)
- [ ] Store in password manager (1Password, LastPass, etc.)

**Example Key:** `re_123abc456def789ghi012jkl345mno678`

**Time Required:** 1 minute

---

## Phase 4: Vercel Environment Setup

### Add to Vercel Production
- [ ] Go to https://vercel.com/dashboard
- [ ] Select PicForge project
- [ ] Navigate to **Settings** → **Environment Variables**
- [ ] Click "Add New"
- [ ] Enter:
  - **Name:** `RESEND_API_KEY`
  - **Value:** (paste your `re_` key)
  - **Environments:** Check "Production"
- [ ] Click "Save"

### Add to Vercel Preview
- [ ] Click "Add New" again
- [ ] Enter:
  - **Name:** `RESEND_API_KEY`
  - **Value:** (same `re_` key)
  - **Environments:** Check "Preview"
- [ ] Click "Save"

### Add to Vercel Development
- [ ] Click "Add New" again
- [ ] Enter:
  - **Name:** `RESEND_API_KEY`
  - **Value:** (same `re_` key)
  - **Environments:** Check "Development"
- [ ] Click "Save"

### Redeploy
- [ ] Go to **Deployments** tab
- [ ] Click "..." on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

**Time Required:** 3 minutes

---

## Phase 5: Local Development Setup

### Add to .env.local
- [ ] Open `.env.local` file in project root
- [ ] Add this line:
```bash
RESEND_API_KEY=re_your_api_key_here
```
- [ ] Save file
- [ ] **Never commit this file to Git** (already in .gitignore)

### Verify Environment
- [ ] Run: `npm run check-env`
- [ ] Verify `RESEND_API_KEY` shows as "Configured"
- [ ] If not, restart dev server

**Time Required:** 1 minute

---

## Phase 6: Local Testing

### Start Dev Server
- [ ] Run: `npm run dev`
- [ ] Wait for server to start (usually http://localhost:3000)
- [ ] Verify no errors in console

### Run Email Tests
- [ ] Open new terminal
- [ ] Run: `npm run test:email`
- [ ] Wait for tests to complete (~10 seconds)
- [ ] Verify "All tests passed!" message
- [ ] Check for any errors in output

### Check Inbox
- [ ] Open email inbox for `derek.bobola@gmail.com`
- [ ] Look for 6 emails from PicForge:
  1. Welcome to PicForge
  2. 5 images left today
  3. Daily limit reached
  4. Promo code activated
  5. Welcome to PicForge Pro
  6. Your week in transformations
- [ ] Verify none are in spam folder
- [ ] If in spam, add PicForge to safe senders

**Time Required:** 5 minutes

---

## Phase 7: Email Content Testing

### Test Email #1: Welcome Email
- [ ] Subject line: "Welcome to PicForge - (re)Imagine Everything"
- [ ] Preview text shows correctly
- [ ] All links work (Start Transforming, Template Gallery, Tips page)
- [ ] Unsubscribe link works
- [ ] Manage preferences link works
- [ ] Mobile responsive (test on phone)
- [ ] Images load correctly
- [ ] Teal CTA button visible

### Test Email #2: Limit Warning
- [ ] Subject shows "5 images left today"
- [ ] Counter displays "5" prominently
- [ ] Upgrade CTA button works
- [ ] Promo code link works
- [ ] Unsubscribe link works

### Test Email #3: Limit Reached
- [ ] Subject: "Daily limit reached"
- [ ] 20/20 display shows clearly
- [ ] Reset time formatted correctly
- [ ] Pricing card displays properly
- [ ] Upgrade button works
- [ ] Unsubscribe link works

### Test Email #4: Promo Code Redeemed
- [ ] Subject: "Promo code activated"
- [ ] Success checkmark displays
- [ ] Promo code shown in monospace font
- [ ] Tier upgrade confirmed
- [ ] Start Creating button works
- [ ] Unsubscribe link works

### Test Email #5: Pro Upgrade
- [ ] Subject: "Welcome to PicForge Pro"
- [ ] Success emoji displays
- [ ] Subscription details correct
- [ ] All Pro benefits listed
- [ ] Start Creating button works
- [ ] Unsubscribe link works

### Test Email #6: Weekly Digest
- [ ] Subject shows transformation count
- [ ] Stats box displays correctly
- [ ] Images show in before/after grid
- [ ] Favorite prompts list formatted
- [ ] View All button works
- [ ] Unsubscribe link works

**Time Required:** 10 minutes

---

## Phase 8: User Flow Testing

### Test Signup Flow
- [ ] Create test account with new email
- [ ] Complete magic link authentication
- [ ] Check inbox for welcome email
- [ ] Verify email received within 1 minute
- [ ] Verify correct user name in email

### Test Limit Warning Flow
- [ ] Use free tier account
- [ ] Generate 15 images
- [ ] Check inbox for limit warning
- [ ] Verify "5 images left" in subject
- [ ] Verify correct remaining count in email

### Test Limit Reached Flow
- [ ] Continue generating images (up to 20)
- [ ] Check inbox for limit reached email
- [ ] Verify reset time is accurate
- [ ] Test upgrade link works
- [ ] Verify CTA goes to profile page

### Test Promo Code Flow
- [ ] Redeem test promo code: `DEREK-FOUNDER-2025`
- [ ] Check inbox for confirmation email
- [ ] Verify promo code shown in email
- [ ] Verify tier upgrade to "unlimited"
- [ ] Test Start Creating button

**Time Required:** 15 minutes

---

## Phase 9: Preferences Testing

### Test Email Preferences Page
- [ ] Navigate to `/profile/emails`
- [ ] Verify all 4 preference toggles display
- [ ] Toggle welcome emails off
- [ ] Click "Save Preferences"
- [ ] Verify success message
- [ ] Refresh page, verify toggle stays off
- [ ] Toggle back on, save again
- [ ] Test "Unsubscribe from All" button
- [ ] Confirm it shows warning dialog
- [ ] Cancel and verify nothing changed

### Test Unsubscribe Page
- [ ] Navigate to `/unsubscribe`
- [ ] Verify warning message displays
- [ ] Click "Yes, Unsubscribe"
- [ ] Verify success message
- [ ] Check all preferences are disabled
- [ ] Test "Manage Preferences" link
- [ ] Re-enable preferences
- [ ] Test unsubscribe with URL param: `/unsubscribe?type=limit-warning`
- [ ] Verify only limit warnings disabled

**Time Required:** 10 minutes

---

## Phase 10: Production Testing

### Test Production Welcome Email
- [ ] Deploy to production
- [ ] Create new account on live site
- [ ] Check inbox for welcome email
- [ ] Verify email received
- [ ] Verify all links point to production URLs

### Test Production Limit Emails
- [ ] Use production free tier account
- [ ] Generate 15 images
- [ ] Check for limit warning email
- [ ] Generate 5 more images
- [ ] Check for limit reached email
- [ ] Verify both emails received

### Test Production Promo Code
- [ ] Redeem unused promo code in production
- [ ] Check for confirmation email
- [ ] Verify email shows correct tier
- [ ] Verify unlimited access granted

### Monitor Resend Dashboard
- [ ] Log in to Resend dashboard
- [ ] Go to **Emails** tab
- [ ] Verify all test emails show as "Delivered"
- [ ] Check for any bounce or complaint reports
- [ ] Monitor deliverability rate (should be >95%)

**Time Required:** 15 minutes

---

## Phase 11: Performance Monitoring

### Check Rate Limits
- [ ] Review current usage in Resend dashboard
- [ ] Verify under 100 emails/day (free tier)
- [ ] Set up alerts if approaching limits
- [ ] Plan upgrade if needed

### Check Deliverability
- [ ] Monitor open rates in Resend (target: 20-30%)
- [ ] Check bounce rate (should be <2%)
- [ ] Check complaint rate (should be <0.1%)
- [ ] Review spam folder placement

### Check Error Logs
- [ ] Open Vercel Functions logs
- [ ] Search for "email" errors
- [ ] Verify no 500 errors on `/api/send-email`
- [ ] Check for any Resend API errors
- [ ] Review InstantDB connection issues

**Time Required:** 10 minutes

---

## Phase 12: Documentation Review

### Internal Documentation
- [ ] Read `EMAIL_IMPLEMENTATION_COMPLETE.md`
- [ ] Review `docs/setup/EMAIL_QUICK_START.md`
- [ ] Bookmark `docs/setup/EMAIL_SYSTEM_SUMMARY.md`
- [ ] Save `docs/setup/RESEND_SETUP.md` for troubleshooting

### User-Facing Content
- [ ] Verify unsubscribe page accessible
- [ ] Test preference management page
- [ ] Check footer links in all emails
- [ ] Verify CAN-SPAM compliance footer

**Time Required:** 5 minutes

---

## Phase 13: Security Audit

### API Key Security
- [ ] Verify `RESEND_API_KEY` not in Git history
- [ ] Check `.env.local` is in `.gitignore`
- [ ] Confirm key only in Vercel env vars
- [ ] Store backup in password manager

### Rate Limiting
- [ ] Test `/api/send-email` rate limiting
- [ ] Verify IP-based throttling works
- [ ] Test concurrent request handling
- [ ] Check for abuse prevention

### Email Validation
- [ ] Test with invalid email format
- [ ] Test with missing email parameter
- [ ] Test with invalid email type
- [ ] Verify proper error messages

**Time Required:** 10 minutes

---

## Phase 14: Mobile Testing

### iOS Testing
- [ ] Forward test emails to iPhone
- [ ] Open in Mail app
- [ ] Verify layout responsive
- [ ] Test all links on mobile
- [ ] Check images load correctly
- [ ] Verify buttons are touch-friendly

### Android Testing
- [ ] Forward test emails to Android device
- [ ] Open in Gmail app
- [ ] Verify layout responsive
- [ ] Test all links on mobile
- [ ] Check images load correctly
- [ ] Verify buttons are touch-friendly

**Time Required:** 10 minutes

---

## Phase 15: Final Go-Live Checklist

### Pre-Launch
- [ ] All tests passed
- [ ] Domain verified in Resend
- [ ] API key configured in production
- [ ] Email templates reviewed and approved
- [ ] Preference pages functional
- [ ] Unsubscribe flow tested
- [ ] CAN-SPAM compliance verified
- [ ] Mobile responsive confirmed

### Launch Monitoring (First 24 Hours)
- [ ] Monitor Resend dashboard for deliverability
- [ ] Check Vercel logs for email errors
- [ ] Review user feedback on emails
- [ ] Monitor unsubscribe rates
- [ ] Check for spam complaints
- [ ] Verify email triggers working

### Launch Monitoring (First Week)
- [ ] Track email open rates
- [ ] Monitor click-through rates
- [ ] Check Pro conversion from emails
- [ ] Review promo code redemption rates
- [ ] Analyze user engagement
- [ ] Adjust subject lines if needed

**Time Required:** Ongoing

---

## Troubleshooting Common Issues

### Issue: Emails not sending

**Checklist:**
- [ ] Verify `RESEND_API_KEY` is set in Vercel
- [ ] Check domain is verified (green checkmark)
- [ ] Review Resend dashboard for errors
- [ ] Check rate limits not exceeded
- [ ] Review Vercel function logs
- [ ] Test locally with `npm run test:email`

### Issue: Emails going to spam

**Checklist:**
- [ ] Verify DNS records propagated
- [ ] Check SPF, DKIM, DMARC all present
- [ ] Wait 24-48 hours for domain reputation
- [ ] Add PicForge to safe senders
- [ ] Review email content for spam triggers
- [ ] Warm up domain with low volume

### Issue: Links not working

**Checklist:**
- [ ] Check URLs in email templates
- [ ] Verify production domain correct
- [ ] Test in different email clients
- [ ] Check for URL encoding issues
- [ ] Review link tracking settings

### Issue: Preferences not saving

**Checklist:**
- [ ] Check InstantDB connection
- [ ] Verify user is authenticated
- [ ] Review browser console for errors
- [ ] Check `useEmailPreferences` hook
- [ ] Test with different browsers
- [ ] Clear browser cache and retry

---

## Success Metrics

### Deliverability (Monitor in Resend)
- [ ] Delivery rate: >95%
- [ ] Bounce rate: <2%
- [ ] Complaint rate: <0.1%
- [ ] Spam placement: <5%

### Engagement (Week 1)
- [ ] Open rate: >20%
- [ ] Click-through rate: >3%
- [ ] Unsubscribe rate: <1%
- [ ] Pro conversion: >2% (from limit emails)

### Technical Performance
- [ ] API response time: <2 seconds
- [ ] Email delivery time: <1 minute
- [ ] Error rate: <1%
- [ ] Uptime: 99.9%

---

## Rollback Plan

If critical issues arise:

1. **Disable Email Sending:**
   - [ ] Remove `RESEND_API_KEY` from Vercel
   - [ ] Redeploy application
   - [ ] Verify emails stop sending

2. **Investigate Issue:**
   - [ ] Review Vercel logs
   - [ ] Check Resend dashboard
   - [ ] Test locally
   - [ ] Identify root cause

3. **Fix and Re-enable:**
   - [ ] Apply fix
   - [ ] Test locally
   - [ ] Re-add `RESEND_API_KEY`
   - [ ] Redeploy
   - [ ] Monitor closely

---

## Next Steps After Launch

### Week 1
- [ ] Monitor daily email metrics
- [ ] Review user feedback
- [ ] Adjust subject lines if needed
- [ ] Optimize send times

### Month 1
- [ ] Implement weekly digest cron job
- [ ] Integrate Stripe Pro upgrade email
- [ ] Add email analytics dashboard
- [ ] A/B test email variations

### Quarter 1
- [ ] Build drip campaign sequences
- [ ] Implement re-engagement emails
- [ ] Add SMS notifications (optional)
- [ ] Launch referral program emails

---

## Support Contacts

**Resend Issues:**
- Dashboard: https://resend.com/dashboard
- Docs: https://resend.com/docs
- Support: support@resend.com
- Discord: https://resend.com/discord

**Vercel Issues:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**PicForge Issues:**
- Email: derek.bobola@gmail.com
- Run tests: `npm run test:email`
- Check env: `npm run check-env`

---

## Estimated Time to Complete

| Phase | Time Required | Can Be Parallelized? |
|-------|--------------|---------------------|
| Phase 1: Resend Account | 2 min | No |
| Phase 2: Domain Verification | 5 min + DNS wait | No |
| Phase 3: API Key | 1 min | No |
| Phase 4: Vercel Setup | 3 min | No |
| Phase 5: Local Setup | 1 min | Yes |
| Phase 6: Local Testing | 5 min | Yes |
| Phase 7: Content Testing | 10 min | Yes |
| Phase 8: User Flow Testing | 15 min | Yes |
| Phase 9: Preferences Testing | 10 min | Yes |
| Phase 10: Production Testing | 15 min | No |
| Phase 11: Monitoring | 10 min | Yes |
| Phase 12: Documentation | 5 min | Yes |
| Phase 13: Security Audit | 10 min | Yes |
| Phase 14: Mobile Testing | 10 min | Yes |
| Phase 15: Final Checks | Ongoing | - |

**Total Active Time:** ~90 minutes
**Total Elapsed Time:** 1-2 days (waiting for DNS propagation)

---

**Status:** Ready for deployment
**Last Updated:** October 23, 2025
**Prepared By:** Claude (Email Marketing Specialist)
**For:** Derek Bobola - PicForge.com

---

## Start Now

```bash
# 1. Go to resend.com (2 min)
# Create account and add domain

# 2. Add DNS records (5 min + wait)
# SPF, DKIM, DMARC to your DNS provider

# 3. Get API key (1 min)
# Copy from Resend dashboard

# 4. Add to Vercel (3 min)
# RESEND_API_KEY in all environments

# 5. Test locally (10 min)
npm run dev
npm run test:email

# 6. Deploy to production (5 min)
# Redeploy Vercel project

# 7. Monitor and celebrate! 🎉
```

You're ready to launch! 🚀
