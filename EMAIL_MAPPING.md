# PicForge Email Addresses

This document maps all PicForge email addresses to their purposes and where they're used in the codebase.

---

## 📧 Email Directory

### 1. **no-reply@pic-forge.com**
**Purpose:** Automated emails that don't require user replies
**Used For:**
- Welcome emails
- Daily limit warnings
- Promo code redemption confirmations
- Pro upgrade notifications
- Weekly digests

**Code Locations:**
- `lib/email.ts` (line 115) - Resend "from" address
- All email templates inherit this from the email service

**Why no-reply?** This is standard practice for transactional emails. Users can still manage preferences or contact support, but replies to automated emails go nowhere to avoid cluttering support inbox.

---

### 2. **support@pic-forge.com**
**Purpose:** Customer support and help requests
**Used For:**
- Bug reports
- General questions
- Technical support
- Feature requests
- User feedback

**Code Locations:**
- `app/contact/page.tsx` (lines 22, 37) - Contact form mailto
- `app/legal/privacy/page.tsx` (line 667) - Privacy policy support link
- `app/legal/terms/page.tsx` (line 716) - Terms support link
- `app/unsubscribe/page.tsx` (line 199) - Unsubscribe feedback link

**Email Flow:**
User → Contact Form → Opens email client → support@pic-forge.com

---

### 3. **hello@pic-forge.com**
**Purpose:** General inquiries, partnerships, and marketing connections
**Used For:**
- Business inquiries
- Partnership requests
- Media inquiries
- General questions from non-users
- Marketing outreach

**Code Locations:**
- `components/Footer.tsx` (line 74) - Footer contact email

**Why separate from support?** This keeps business/partnership emails separate from customer support tickets, allowing you to prioritize differently.

---

### 4. **showcase@pic-forge.com**
**Purpose:** User submissions for the Showcase gallery
**Used For:**
- Showcase transformations submissions
- Before/after image submissions
- User-created content for gallery

**Code Locations:**
- `app/submit/page.tsx` (line 22) - Submit creation form mailto

**Email Flow:**
User → Submit Form → Opens email client with pre-filled message → showcase@pic-forge.com → User attaches images → Sends

**Note:** Users submit their creations via email with attachments. You can review and add to showcase manually.

---

### 5. **derek@pic-forge.com**
**Purpose:** Derek's personal email for PicForge, legal/privacy inquiries
**Used For:**
- Privacy requests (GDPR/CCPA)
- Legal inquiries
- Data protection contact
- EU representative contact
- Official business communications

**Code Locations:**
- `app/legal/privacy/page.tsx` (lines 616, 629) - Data protection contact
- `app/legal/terms/page.tsx` (line 676) - Terms contact

**Why separate?** Legal and privacy requests require specific handling and may have regulatory deadlines (30-45 days). This ensures they don't get lost in general support emails.

---

## 📊 Email Usage Matrix

| Email Address | Purpose | User-Facing | Auto-Reply | Priority |
|---------------|---------|-------------|-----------|----------|
| no-reply@pic-forge.com | Automated emails | ✅ Yes | ❌ No | Low (outbound only) |
| support@pic-forge.com | Customer support | ✅ Yes | ✅ Yes | High |
| hello@pic-forge.com | Business/partnerships | ✅ Yes | ✅ Yes | Medium |
| showcase@pic-forge.com | Showcase submissions | ✅ Yes | ✅ Yes | Medium |
| derek@pic-forge.com | Legal/privacy | ✅ Yes | ✅ Yes | High (regulatory) |

---

## 🔧 Email Setup Requirements

### For Resend (Transactional Emails)
All 5 email addresses need to be added to your Resend domain verification:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add domain: `pic-forge.com`
3. Add DNS records (SPF, DKIM, DMARC)
4. Verify domain
5. All emails (@pic-forge.com) will work once domain is verified

**DNS Records Needed:**
```
Type  | Name                    | Value
------|-------------------------|----------------------------------
TXT   | pic-forge.com           | v=spf1 include:_spf.resend.com ~all
TXT   | resend._domainkey       | [Resend will provide this]
TXT   | _dmarc                  | v=DMARC1; p=none; rua=mailto:derek@pic-forge.com
```

### For Receiving Emails
You'll need an email hosting service to *receive* emails at these addresses. Options:

**Option 1: Google Workspace (Recommended)**
- $6/user/month
- Professional, reliable
- Derek already familiar with Gmail
- Setup: Add pic-forge.com domain, create 5 email accounts

**Option 2: Microsoft 365**
- $6/user/month
- Similar to Google Workspace

**Option 3: Cloudflare Email Routing (Free!)**
- Route to existing email (e.g., derek.bobola@gmail.com)
- Free for up to 200 addresses
- Good for forwarding, not sending
- Setup guide: https://developers.cloudflare.com/email-routing/

**Option 4: Zoho Mail (Cheap)**
- $1/user/month
- Good for small teams

---

## 🎯 Recommended Setup (Cloudflare Free)

Since you already use Vercel and likely Cloudflare for DNS, this is the easiest:

1. **Go to Cloudflare Dashboard** → Email → Email Routing
2. **Enable Email Routing** for pic-forge.com
3. **Add Routing Rules:**
   - `support@pic-forge.com` → `derek.bobola@gmail.com` (labeled "Support")
   - `hello@pic-forge.com` → `derek.bobola@gmail.com` (labeled "Business")
   - `showcase@pic-forge.com` → `derek.bobola@gmail.com` (labeled "Showcase")
   - `derek@pic-forge.com` → `derek.bobola@gmail.com` (labeled "Legal")
   - `no-reply@pic-forge.com` → (don't route, it's send-only)

**Benefits:**
- ✅ Free
- ✅ All emails forward to your existing Gmail
- ✅ Gmail labels help you organize
- ✅ No new inbox to check
- ✅ Setup in 10 minutes

**Limitations:**
- Can't send *from* these addresses in Gmail (you'll reply from derek.bobola@gmail.com)
- For that, use Google Workspace or Gmail SMTP with custom domain

---

## 📱 Gmail Filters (Optional)

Once forwarding is set up, create Gmail filters:

### Filter 1: Support Emails
- **To:** support@pic-forge.com
- **Apply label:** PicForge/Support
- **Mark as important**

### Filter 2: Business Emails
- **To:** hello@pic-forge.com
- **Apply label:** PicForge/Business

### Filter 3: Showcase Submissions
- **To:** showcase@pic-forge.com
- **Apply label:** PicForge/Showcase
- **Has attachment**

### Filter 4: Legal/Privacy
- **To:** derek@pic-forge.com
- **Apply label:** PicForge/Legal
- **Star**
- **Mark as important**

---

## 🚀 Quick Start Checklist

### Step 1: Domain Verification (Resend)
- [ ] Add pic-forge.com to Resend
- [ ] Add SPF record to DNS
- [ ] Add DKIM record to DNS
- [ ] Add DMARC record to DNS
- [ ] Verify domain in Resend
- [ ] Test sending from no-reply@pic-forge.com

### Step 2: Email Forwarding (Cloudflare)
- [ ] Enable Email Routing in Cloudflare
- [ ] Add routing rule: support → derek.bobola@gmail.com
- [ ] Add routing rule: hello → derek.bobola@gmail.com
- [ ] Add routing rule: showcase → derek.bobola@gmail.com
- [ ] Add routing rule: derek → derek.bobola@gmail.com
- [ ] Send test emails to each address
- [ ] Verify they arrive in Gmail

### Step 3: Gmail Organization
- [ ] Create labels: PicForge/Support, PicForge/Business, PicForge/Showcase, PicForge/Legal
- [ ] Set up filters for auto-labeling
- [ ] Test that emails are labeled correctly

### Step 4: Verify in Production
- [ ] Submit test via Contact Form → should go to support@
- [ ] Submit test via Submit Page → should go to showcase@
- [ ] Check Privacy Policy → shows derek@ for legal
- [ ] Check Footer → shows hello@ for general inquiries
- [ ] Trigger test welcome email → should come from no-reply@

---

## 📖 Usage Guidelines

### When to use which email?

**support@pic-forge.com**
- "My images aren't processing"
- "I can't log in"
- "How do I use Lock Composition?"
- "I found a bug"

**hello@pic-forge.com**
- "I'd like to partner with PicForge"
- "Can I write about PicForge?"
- "I have a business opportunity"
- "General question before signing up"

**showcase@pic-forge.com**
- "Here's my awesome transformation!"
- "Can you feature my work?"
- Only received via Submit form (pre-formatted)

**derek@pic-forge.com**
- "I want to delete my account (GDPR)"
- "Send me all my data (CCPA)"
- "I have a legal question about the Terms"
- "Privacy complaint"

**no-reply@pic-forge.com**
- Automated system emails only
- Users see it as sender, but can't reply

---

## 🎨 Email Templates

All transactional emails use `no-reply@pic-forge.com` as the sender:

1. **WelcomeEmail** - Sent when user signs up
2. **LimitWarningEmail** - Sent at 15/20 images (free tier)
3. **LimitReachedEmail** - Sent at 20/20 images (free tier)
4. **PromoCodeRedeemedEmail** - Sent when promo code redeemed
5. **ProUpgradeEmail** - Sent when user upgrades to Pro
6. **WeeklyDigestEmail** - Sent weekly (future feature)

All include unsubscribe link and preferences link.

---

## 📝 Maintenance

### Update Email Addresses
If you need to change an email address:

1. **Update code files** (see "Code Locations" above)
2. **Update Resend domain** (if sending from that address)
3. **Update Cloudflare routing** (if receiving at that address)
4. **Update this documentation**
5. **Test thoroughly**

### Monitor Deliverability
- Check Resend dashboard for bounce rates
- Monitor Gmail spam folder for forwarded emails
- Check DMARC reports weekly

---

## ❓ FAQ

**Q: Can users reply to no-reply emails?**
A: Technically yes, but replies go nowhere. Each email includes links to support or preferences.

**Q: What if showcase submissions have attachments?**
A: Gmail handles attachments fine. You'll see them in your forwarded email.

**Q: Can I respond *from* support@pic-forge.com in Gmail?**
A: Not with basic forwarding. You'd need Google Workspace or Gmail SMTP setup.

**Q: How do I avoid confusion between emails?**
A: Use Gmail labels and filters (see above). Each email type auto-labels.

**Q: What about spam?**
A: Cloudflare Email Routing has built-in spam filtering. Plus, all PicForge emails go through contact forms (not public addresses), reducing spam risk.

---

## 🔗 Helpful Links

- [Resend Docs - Domain Verification](https://resend.com/docs/dashboard/domains/introduction)
- [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/)
- [Gmail Filter Documentation](https://support.google.com/mail/answer/6579)
- [SPF Record Checker](https://mxtoolbox.com/spf.aspx)
- [DMARC Analyzer](https://dmarc.org/)

---

**Last Updated:** October 23, 2025
**Maintained By:** Derek Bobola

For questions about this email setup, contact derek@pic-forge.com 😄
