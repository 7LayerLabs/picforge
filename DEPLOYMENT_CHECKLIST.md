# Analytics Deployment Checklist

Complete this checklist to deploy Google Analytics 4 and Search Console integration to PicForge.

## Pre-Deployment Setup

### 1. Google Analytics 4 Setup
- [ ] Created GA4 property at [analytics.google.com](https://analytics.google.com/)
- [ ] Created Web Data Stream for pic-forge.com
- [ ] Copied Measurement ID (format: G-XXXXXXXXXX)
- [ ] Added Measurement ID to local `.env.local` for testing

**Measurement ID:** `G-________________` (fill in)

### 2. Google Search Console Setup
- [ ] Added property at [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Selected HTML tag verification method
- [ ] Copied verification code (without `google-site-verification=` prefix)
- [ ] Added verification code to local `.env.local` for testing

**Verification Code:** `______________________________` (fill in)

### 3. Local Testing
- [ ] Added both environment variables to `.env.local`
- [ ] Ran `npm run dev` and verified no build errors
- [ ] Opened browser DevTools > Console
- [ ] Confirmed "Google Analytics initialized" message appears
- [ ] Performed test actions (image generation, prompt selection)
- [ ] Verified "GA Event (dev)" logs appear in console

## Vercel Deployment

### 4. Add Environment Variables to Vercel
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Select PicForge project
- [ ] Go to **Settings** > **Environment Variables**
- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID`:
  - Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - Value: Your G-XXXXXXXXXX measurement ID
  - Environment: Production, Preview, Development (all checked)
- [ ] Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`:
  - Name: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  - Value: Your verification code (without prefix)
  - Environment: Production only
- [ ] Click **Save** for both variables

### 5. Deploy to Production
- [ ] Commit all changes:
  ```bash
  git add .
  git commit -m "Add Google Analytics 4 and Search Console integration"
  git push origin main
  ```
- [ ] Wait for Vercel deployment to complete
- [ ] Check deployment logs for any errors
- [ ] Visit production site: https://pic-forge.com

### 6. Verify GA4 Tracking
- [ ] Visit live site: https://pic-forge.com
- [ ] Open GA4: [analytics.google.com](https://analytics.google.com/)
- [ ] Go to **Reports** > **Realtime**
- [ ] Confirm you see your visit within 30 seconds
- [ ] Perform test actions on live site:
  - [ ] Generate an image
  - [ ] Select a prompt from library
  - [ ] Share to social media
  - [ ] Download an image
- [ ] Confirm events appear in Realtime report

### 7. Verify Search Console
- [ ] Return to Search Console verification page
- [ ] Click **Verify** button
- [ ] Confirm success message appears
- [ ] Go to **Overview** in Search Console
- [ ] Check that property is now verified (green checkmark)

### 8. Submit Sitemap
- [ ] In Search Console, go to **Sitemaps** (left sidebar)
- [ ] Enter sitemap URL: `https://pic-forge.com/sitemap.xml`
- [ ] Click **Submit**
- [ ] Wait 1-2 minutes, then refresh page
- [ ] Confirm status shows "Success" (not "Couldn't fetch")
- [ ] Note: Indexing takes 24-48 hours, this is normal

### 9. Verify Robots.txt
- [ ] Visit: https://pic-forge.com/robots.txt in browser
- [ ] Confirm it displays correctly with:
  - User-agent rules
  - Allow/disallow directives
  - Sitemap URL at bottom
- [ ] In Search Console, go to **Settings** > **Crawler stats**
- [ ] Click **View robots.txt**
- [ ] Confirm it matches what you see in browser

## Post-Deployment Verification

### 10. Test All Event Types
Visit your live site and perform each action to verify tracking:

**Image Transformation:**
- [ ] Upload image on main editor
- [ ] Enter custom prompt
- [ ] Toggle "Lock Composition" on
- [ ] Click "Transform"
- [ ] Check GA4 Realtime for `image_transformation` event

**Prompt Usage:**
- [ ] Go to /prompts page
- [ ] Click any prompt card
- [ ] Check GA4 Realtime for `prompt_usage` event

**Authentication:**
- [ ] Sign out (if signed in)
- [ ] Click "Sign In" button
- [ ] Enter email for magic link
- [ ] Check GA4 Realtime for `sign_up` or `sign_in` event

**Promo Code (if you have one):**
- [ ] Go to /profile page
- [ ] Enter a valid promo code
- [ ] Click "Redeem"
- [ ] Check GA4 Realtime for `promo_code_redemption` event

**Social Share:**
- [ ] Generate an image
- [ ] Click "Share" button
- [ ] Select Twitter tab
- [ ] Click "Share on X/Twitter"
- [ ] Check GA4 Realtime for `social_share` event

**Daily Limit (Free Tier):**
- [ ] Generate 20 images (if free tier)
- [ ] Try to generate 21st image
- [ ] See limit reached message
- [ ] Check GA4 Realtime for `daily_limit_reached` event

**Upgrade Click:**
- [ ] Go to /pricing page
- [ ] Click "Get Started" on Pro tier
- [ ] Check GA4 Realtime for `upgrade_click` event

**Batch Processing:**
- [ ] Go to /batch page
- [ ] Upload 5+ images
- [ ] Select an effect (e.g., Sharpen)
- [ ] Click "Apply to All"
- [ ] Check GA4 Realtime for `batch_process` event

**Roulette:**
- [ ] Go to /roulette page
- [ ] Click "Spin the Wheel"
- [ ] Wait for result
- [ ] Check GA4 Realtime for `roulette_spin` event

**Roast Mode:**
- [ ] Go to /roast page
- [ ] Upload image
- [ ] Select intensity level
- [ ] Click "Roast Me"
- [ ] Check GA4 Realtime for `roast_generation` event

### 11. Check Event Parameters
- [ ] In GA4 Realtime, click an `image_transformation` event
- [ ] Verify parameters appear:
  - prompt_category
  - prompt_title
  - locked_composition
  - is_nsfw
- [ ] Click other events to verify their parameters

### 12. Set Up Custom Reports (Day 2-3)
- [ ] Go to GA4 **Explore** tab
- [ ] Create **User Engagement** report:
  - Add dimensions: user_tier, prompt_category
  - Add metrics: total_events, active_users
- [ ] Create **Conversion Funnel**:
  - Steps: page_view → image_transformation → social_share → sign_up
- [ ] Create **Popular Prompts** report:
  - Dimension: prompt_title
  - Metric: event_count
  - Filter: event_name = prompt_usage

### 13. Mark Key Events (Conversions)
- [ ] Go to GA4 **Admin** > **Data display** > **Events**
- [ ] Find `promo_code_redemption` event
- [ ] Toggle "Mark as key event" to ON
- [ ] Repeat for:
  - [ ] `sign_up`
  - [ ] `upgrade_click`
  - [ ] `social_share` (optional)

### 14. Set Up Alerts (Optional)
- [ ] Go to GA4 **Admin** > **Custom insights**
- [ ] Create alert for:
  - **Daily Active Users drop** (>30% decrease)
  - **Error rate spike** (>10 errors per hour)
  - **Conversion rate drop** (sign_ups <5 per day)

## Monitoring & Maintenance

### 15. Week 1: Daily Checks
- [ ] Day 1: Check Realtime report multiple times
- [ ] Day 2: Review event parameters, fix any issues
- [ ] Day 3: Check Search Console for indexing progress
- [ ] Day 4: Review user behavior flow
- [ ] Day 5: Analyze top prompts and categories
- [ ] Day 6-7: Monitor for any tracking gaps

### 16. Week 2-4: Weekly Reviews
- [ ] Check **Acquisition** report (traffic sources)
- [ ] Review **Engagement** report (time on site, events per user)
- [ ] Analyze **Conversions** (sign-ups, promo codes)
- [ ] Review **Tech** report (browser/device breakdown)
- [ ] Check Search Console **Performance** (impressions, clicks)

### 17. Ongoing Monthly Tasks
- [ ] Review top-performing prompts
- [ ] Identify user drop-off points in funnel
- [ ] Analyze conversion rates by traffic source
- [ ] Check for any tracking errors or gaps
- [ ] Update custom reports based on business needs

## Troubleshooting

### If Events Not Showing in GA4:
1. Check browser console for errors
2. Verify Measurement ID is correct in Vercel env vars
3. Check if ad blocker is enabled (disable for testing)
4. Wait 24-48 hours (some reports have delay)
5. Use GA4 DebugView for detailed event inspection

### If Search Console Not Verifying:
1. Check that NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is in Vercel
2. Verify deployment completed successfully
3. Wait 10 minutes after deploy, then retry
4. View page source to confirm meta tag is present
5. Try alternative verification method (DNS or HTML file)

### If Sitemap Not Found:
1. Visit https://pic-forge.com/sitemap.xml directly
2. Check for XML formatting errors
3. Verify robots.txt includes sitemap URL
4. Resubmit sitemap in Search Console
5. Wait 24-48 hours for processing

## Success Criteria

Mark complete when ALL of the following are true:
- [ ] GA4 Realtime shows active users
- [ ] At least 5 different event types tracked successfully
- [ ] Event parameters populating correctly
- [ ] Search Console property verified
- [ ] Sitemap submitted and status is "Success"
- [ ] Robots.txt accessible and properly formatted
- [ ] No console errors related to analytics
- [ ] Custom reports created and showing data
- [ ] Key events marked for conversion tracking

## Next Steps After Completion

1. **Share results:** Post analytics dashboard to team Slack/Discord
2. **Document insights:** Create weekly reports on user behavior
3. **Optimize based on data:** Identify low-performing prompts to improve
4. **A/B testing:** Use GA4 audiences for testing different features
5. **Scale up:** Add more custom events as features are added

---

**Deployment Date:** ___/___/2025

**Completed By:** _______________

**Notes:**
- GA4 can take 24-48 hours to populate all reports
- Search Console indexing takes 1-2 weeks for full coverage
- Event tracking is real-time, but aggregate reports may lag
- If issues arise, check ANALYTICS_SETUP.md for detailed troubleshooting

**Status:** [ ] Not Started | [ ] In Progress | [ ] Complete
