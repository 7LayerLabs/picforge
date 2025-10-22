# Google Analytics 4 & Search Console Deployment Checklist

**Quick deployment guide to get PicForge tracking and indexed in Google.**

---

## ⏱️ Time Required: 45 minutes

- Google Analytics 4 Setup: 15 minutes
- Google Search Console Setup: 10 minutes
- Environment Configuration: 5 minutes
- Deployment & Testing: 15 minutes

---

## Part 1: Google Analytics 4 Setup (15 min)

### Step 1: Create GA4 Property

1. Go to https://analytics.google.com/
2. Click **Admin** (gear icon, bottom left)
3. Click **Create** → **Property**
4. Fill in:
   - Property name: **PicForge**
   - Reporting time zone: **Your timezone**
   - Currency: **USD**
5. Click **Next**
6. Business details:
   - Industry: **Technology**
   - Business size: **Small**
7. Select objectives:
   - ✅ Generate leads
   - ✅ Examine user behavior
   - ✅ Measure customer engagement
8. Click **Create** → Accept Terms

### Step 2: Get Measurement ID

1. In Admin, click **Data Streams**
2. Click **Add stream** → **Web**
3. Enter:
   - Website URL: `https://pic-forge.com`
   - Stream name: **PicForge Production**
4. Click **Create stream**
5. **COPY YOUR MEASUREMENT ID** (format: G-XXXXXXXXXX)
   - You'll need this for .env.local

### Step 3: Enable Enhanced Measurement

1. In your new data stream, scroll to **Enhanced measurement**
2. Toggle ON (should be enabled by default)
3. Verify these are checked:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Form interactions
   - ✅ File downloads

### Step 4: Create Custom Dimensions

1. Go to **Configure** → **Custom definitions**
2. Click **Create custom dimension** (do this 6 times):

**Dimension 1:**
- Dimension name: `user_tier`
- Scope: **User**
- Description: User subscription tier
- Event parameter: `user_tier`

**Dimension 2:**
- Dimension name: `prompt_category`
- Scope: **Event**
- Description: Category of AI prompt used
- Event parameter: `prompt_category`

**Dimension 3:**
- Dimension name: `share_platform`
- Scope: **Event**
- Description: Social sharing platform
- Event parameter: `platform`

**Dimension 4:**
- Dimension name: `referral_source`
- Scope: **User**
- Description: Referral code used
- Event parameter: `referral_code`

**Dimension 5:**
- Dimension name: `is_nsfw`
- Scope: **Event**
- Description: NSFW content flag
- Event parameter: `is_nsfw`

**Dimension 6:**
- Dimension name: `locked_composition`
- Scope: **Event**
- Description: Lock composition feature
- Event parameter: `locked_composition`

### Step 5: Mark Conversion Events

1. Go to **Configure** → **Events**
2. After deploying (you'll have some events), mark these as conversions:
   - `sign_up`
   - `promo_code_redemption`
   - `referral_signup`
   - `upgrade_click`
   - `showcase_submit`

**Note**: You can only mark events as conversions AFTER they've been tracked at least once. Come back to this step after deployment.

---

## Part 2: Google Search Console Setup (10 min)

### Step 1: Add Property

1. Go to https://search.google.com/search-console/welcome
2. Click **Add Property**
3. Choose **URL prefix** (not domain)
4. Enter: `https://pic-forge.com`
5. Click **Continue**

### Step 2: Get Verification Code

1. Choose verification method: **HTML tag** (recommended)
2. Copy the meta tag
3. Extract ONLY the verification code
   - From: `<meta name="google-site-verification" content="abc123xyz" />`
   - Copy: `abc123xyz` (just the content value)
4. Save this code - you'll add it to .env.local

**Don't click Verify yet!** We need to deploy first.

### Step 3: Prepare for Verification

The verification meta tag is already in `app/layout.tsx` (line 112). You just need to add the verification code to your environment variables.

---

## Part 3: Environment Configuration (5 min)

### Add Environment Variables

1. Open your `.env.local` file (create if it doesn't exist)
2. Add these lines:

```bash
# Google Analytics 4 (required)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console (required)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code_here

# Optional: Enable GA4 in development mode
NEXT_PUBLIC_GA_DEBUG=false
```

3. Replace `G-XXXXXXXXXX` with your actual measurement ID from Step 2 of GA4 setup
4. Replace `your_verification_code_here` with your verification code from Search Console
5. Save the file

### Add to Vercel Environment Variables

If deploying on Vercel:

```bash
# Using Vercel CLI
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
# Paste your measurement ID when prompted

vercel env add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
# Paste your verification code when prompted
```

Or in Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add both variables
4. Select: Production, Preview, Development

---

## Part 4: Deployment & Testing (15 min)

### Step 1: Build and Deploy

```bash
# Test build locally
npm run build

# If successful, commit and push
git add .
git commit -m "Add GA4 analytics and Search Console integration"
git push origin main
```

Vercel will auto-deploy from your main branch.

### Step 2: Verify GA4 is Working

1. Wait 2-3 minutes for deployment
2. Visit https://pic-forge.com
3. Open https://analytics.google.com/analytics/web/
4. Go to **Reports** → **Realtime**
5. You should see yourself as an active user (30-60 second delay)

**Test some events:**
- Click around the site
- Search for a prompt
- Transform an image (if you have credits)
- Check Realtime report for events

### Step 3: Verify Search Console

1. Go back to Search Console verification page
2. Click **Verify**
3. Should see: "✅ Ownership verified"

If verification fails:
- Check env var is set correctly
- View page source, verify meta tag is in `<head>`
- Wait 2 minutes and try again

### Step 4: Submit Sitemap

1. In Search Console, go to **Sitemaps**
2. Enter sitemap URL: `sitemap.xml`
3. Click **Submit**
4. Status should change to "✅ Success" within minutes

### Step 5: Test Structured Data

1. Go to https://search.google.com/test/rich-results
2. Enter URL: `https://pic-forge.com`
3. Click **Test URL**
4. Should show valid structured data:
   - WebSite
   - WebApplication
   - SoftwareApplication
   - Organization
   - BreadcrumbList

### Step 6: Test Mobile-Friendly

1. Go to https://search.google.com/test/mobile-friendly
2. Enter URL: `https://pic-forge.com`
3. Click **Test URL**
4. Should show: "✅ Page is mobile-friendly"

---

## ✅ Deployment Checklist

Print this and check off as you go:

### Google Analytics 4
- [ ] Created GA4 property
- [ ] Got measurement ID (G-XXXXXXXXXX)
- [ ] Enabled enhanced measurement
- [ ] Created 6 custom dimensions
- [ ] Added measurement ID to .env.local
- [ ] Verified tracking works in Realtime report
- [ ] Marked conversion events (after deployment)

### Google Search Console
- [ ] Added property to Search Console
- [ ] Got verification code
- [ ] Added verification code to .env.local
- [ ] Deployed to production
- [ ] Verified ownership
- [ ] Submitted sitemap
- [ ] Checked sitemap was found

### Testing & Verification
- [ ] GA4 shows realtime users
- [ ] GA4 shows events firing
- [ ] Search Console verified
- [ ] Sitemap submitted successfully
- [ ] Rich results test passes
- [ ] Mobile-friendly test passes
- [ ] Page speed score 90+ (pagespeed.web.dev)

---

## Common Issues

### "GA4 not tracking"

**Problem**: No events appearing in Realtime report

**Solutions**:
1. Wait 30-60 seconds (there's a delay)
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify measurement ID format: `G-XXXXXXXXXX`
5. Disable ad blockers
6. Try incognito mode

**Debug mode**:
```bash
# Enable debug logs
NEXT_PUBLIC_GA_DEBUG=true npm run dev
# Check console for "GA Event (dev): ..." logs
```

---

### "Search Console verification failed"

**Problem**: Verification fails when clicking "Verify"

**Solutions**:
1. View page source (`Ctrl+U`) and search for "google-site-verification"
2. Verify the meta tag is in `<head>` section
3. Check env var is set: `echo $NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
4. Wait 2 minutes after deployment, then retry
5. Try alternative verification method (HTML file upload)

**HTML file method**:
1. Download verification file from Search Console
2. Place in `public/` directory
3. Redeploy
4. Verify file accessible: `https://pic-forge.com/googleXXXXXX.html`

---

### "Sitemap not found"

**Problem**: Search Console can't find sitemap

**Solutions**:
1. Verify sitemap accessible: `https://pic-forge.com/sitemap.xml`
2. Check for XML formatting errors
3. Verify sitemap URL uses HTTPS (not HTTP)
4. Check `app/robots.ts` includes: `sitemap: 'https://pic-forge.com/sitemap.xml'`
5. Re-submit with full URL: `https://pic-forge.com/sitemap.xml`

---

## What's Next?

### Immediate (Week 1)
- [ ] Add event tracking to main editor component
- [ ] Add tracking to prompts library search
- [ ] Add tracking to user signup flow
- [ ] Monitor GA4 Realtime to ensure events are firing
- [ ] Check Search Console daily for crawl errors

### Short-term (Month 1)
- [ ] Submit to 10+ AI tool directories (see SEO_CHECKLIST.md)
- [ ] Write 3 SEO-optimized blog posts
- [ ] Launch on Product Hunt
- [ ] Create custom GA4 reports
- [ ] Monitor keyword rankings

### Long-term (Quarter 1)
- [ ] Grow organic traffic to 10,000+ monthly sessions
- [ ] Acquire 100+ quality backlinks
- [ ] Rank page 1 for 5+ target keywords
- [ ] Achieve Domain Authority 40+
- [ ] Build email list of 1,000+ subscribers

---

## Documentation

For complete implementation details, see:

- **Setup Guide**: `docs/ANALYTICS_SETUP.md`
- **Quick Reference**: `docs/ANALYTICS_QUICK_REFERENCE.md`
- **Implementation Examples**: `docs/ANALYTICS_IMPLEMENTATION_EXAMPLES.md`
- **SEO Checklist**: `docs/SEO_CHECKLIST.md`
- **Master Guide**: `docs/SEO_ANALYTICS_MASTER_GUIDE.md`

---

## Support

**Questions?** Contact: derek.bobola@gmail.com

**Resources**:
- GA4 Help: https://support.google.com/analytics/
- Search Console Help: https://support.google.com/webmasters/
- Next.js SEO: https://nextjs.org/learn/seo/introduction-to-seo

---

**Created**: October 22, 2025
**Status**: Ready for Production ✅
