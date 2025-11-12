# GA4 Dashboards & Reports for PicForge.com

This guide shows you how to create custom dashboards and reports to track what actually matters for PicForge's business.

---

## Overview

PicForge tracks user behavior across 5 key areas:

1. **User Acquisition** - Where users come from
2. **Feature Usage** - Which features drive engagement
3. **Conversion Funnels** - Path to Pro/Unlimited upgrades
4. **Retention & Engagement** - What keeps users coming back
5. **Content Performance** - Which prompts/effects are most popular

---

## Key Metrics Dashboard

### 1. User Acquisition (Where Are Users Coming From?)

**How to Create:**

1. Go to GA4 → **Explore** → **Create new exploration**
2. Select **Free form** template
3. Add dimensions:
   - Session source
   - Session medium
   - Session campaign
4. Add metrics:
   - New users
   - Sessions
   - Engagement rate
   - Average engagement time
5. Create visualization: **Table**
6. Save as: "User Acquisition Report"

**What to Track:**
- Organic search (Google)
- Direct traffic (returning users)
- Social media (Twitter, Instagram, TikTok)
- Referrals (other websites)
- Email campaigns

**Action Items:**
- If organic search is low → improve SEO
- If social is high → double down on social content
- If direct is high → users love you (retention win!)

---

### 2. Feature Usage (What Do Users Actually Use?)

**Create Custom Report:**

1. Go to **Explore** → **Create new exploration**
2. Select **Free form**
3. Add events:
   - `image_transformation` (main editor usage)
   - `batch_process` (batch processor usage)
   - `roast_generation` (roast mode usage)
   - `canvas_generation` (AI canvas usage)
   - `roulette_spin` (transform roulette usage)
   - `prompt_usage` (prompt library usage)
4. Add metrics:
   - Event count
   - Users
   - Events per user
5. Visualization: **Bar chart**
6. Save as: "Feature Usage Report"

**What to Track:**
- Most-used features
- Underused features (need promotion?)
- Feature adoption rate
- Power users (high events per user)

**Action Items:**
- Promote underused features (blog posts, tutorials)
- Double down on popular features
- Remove features with <5% adoption after 3 months

---

### 3. Conversion Funnel (Free → Pro/Unlimited)

**Create Funnel Exploration:**

1. Go to **Explore** → **Funnel exploration**
2. Create funnel steps:

**Step 1:** First visit
   - Event: `session_start`

**Step 2:** First transformation
   - Event: `image_transformation`

**Step 3:** Hit daily limit
   - Event: `daily_limit_reached`

**Step 4:** View pricing
   - Event: `page_view`
   - Condition: page_path contains "pricing"

**Step 5:** Upgrade (Conversion!)
   - Event: `promo_code_redemption` OR `tier_change`

3. Add breakdown: `user_tier`
4. Save as: "Conversion Funnel"

**What to Track:**
- Drop-off rates at each step
- Time to conversion
- Conversion rate (Step 1 → Step 5)

**Ideal Funnel:**
- Step 1 → Step 2: 80%+ (users try the product)
- Step 2 → Step 3: 40%+ (users engaged enough to hit limit)
- Step 3 → Step 4: 30%+ (users interested in upgrade)
- Step 4 → Step 5: 10-20% (users convert)

**Action Items:**
- High drop-off at Step 2? → Improve onboarding
- High drop-off at Step 4? → Pricing too high or unclear value
- Low Step 5? → Add urgency or better CTAs

---

### 4. Prompt Performance (Which Prompts Are Most Popular?)

**Create Custom Report:**

1. Go to **Explore** → **Create new exploration**
2. Select **Free form**
3. Add dimensions:
   - Event parameter: `prompt_category`
   - Event parameter: `prompt_title`
4. Filter: Event name = `image_transformation` OR `prompt_usage`
5. Add metrics:
   - Event count
   - Users
   - Engagement rate
6. Visualization: **Table** (sorted by event count)
7. Save as: "Prompt Performance"

**What to Track:**
- Most-used prompt categories (e.g., "Art Styles", "People", "Fantasy")
- Top 10 individual prompts
- Locked composition usage rate
- NSFW editor usage

**Action Items:**
- Create more prompts in popular categories
- Promote underused categories
- Feature top prompts on homepage
- Build "Trending Prompts" section

---

### 5. Retention Dashboard (Are Users Coming Back?)

**Create Cohort Exploration:**

1. Go to **Explore** → **Cohort exploration**
2. Cohort definition:
   - Cohort inclusion: `sign_up` event
   - Cohort size: Daily (or Weekly)
3. Return criteria: `session_start` event
4. Add metrics:
   - User retention
   - Active users
   - Events per user
5. Time granularity: Days (0-30)
6. Save as: "User Retention Report"

**What to Track:**
- Day 1 retention (users return next day)
- Day 7 retention (users still engaged after a week)
- Day 30 retention (long-term stickiness)

**Healthy Retention:**
- Day 1: 40-60% (users find value immediately)
- Day 7: 20-40% (product has staying power)
- Day 30: 10-20% (core loyal users)

**Action Items:**
- Low Day 1? → Improve first-time user experience
- Low Day 7? → Add email reminders, new features
- Low Day 30? → Build habit loops, gamification

---

### 6. Pro User Behavior (What Do Paying Users Do Differently?)

**Create Segment Comparison:**

1. Go to **Explore** → **Create new exploration**
2. Create two segments:

**Segment 1: Free Users**
   - Condition: User property `user_tier` = "free"

**Segment 2: Pro/Unlimited Users**
   - Condition: User property `user_tier` = "pro" OR "unlimited"

3. Compare metrics:
   - Sessions per user
   - Events per session
   - Engagement time
   - Feature usage (batch, roast, canvas)
4. Visualization: **Bar chart** (side-by-side comparison)
5. Save as: "Free vs Pro Behavior"

**What to Track:**
- Features Pro users love (promote these!)
- Behaviors that predict upgrade (model for free users)
- Pro user churn signals

**Action Items:**
- Promote features Pro users love to free users
- Identify "power user" behaviors → target for upgrade
- If Pro users use fewer features → simplify pricing

---

### 7. Real-Time Operations Dashboard

**Create for Daily Monitoring:**

1. Go to **Reports** → **Realtime**
2. Customize cards:
   - Active users right now
   - Top pages being viewed
   - Top events (image_transformation, batch_process)
   - Conversions in last 30 minutes
3. Pin to sidebar for quick access

**What to Monitor:**
- Traffic spikes (viral moment?)
- System issues (no events = something broke)
- Conversion velocity (promo codes working?)
- Geographic distribution (expand to new markets?)

---

### 8. Conversion Attribution (What Drives Upgrades?)

**Create Path Exploration:**

1. Go to **Explore** → **Path exploration**
2. Start point: `session_start`
3. End point: `promo_code_redemption` OR `tier_change`
4. Show paths between start and end
5. Add dimensions:
   - Session source/medium
   - Landing page
6. Save as: "Conversion Paths"

**What to Track:**
- Common user journeys to upgrade
- Landing pages that convert best
- Number of sessions before conversion
- Time to conversion

**Action Items:**
- Optimize high-converting landing pages
- Replicate successful user journeys
- Add CTAs on popular pre-conversion pages

---

### 9. Content Engagement (Which Pages Keep Users?)

**Create Engagement Report:**

1. Go to **Explore** → **Create new exploration**
2. Add dimensions:
   - Page path
   - Page title
3. Add metrics:
   - Views
   - Users
   - Average engagement time
   - Engaged sessions
   - Engagement rate
4. Visualization: **Table** (sorted by engagement rate)
5. Save as: "Content Engagement"

**What to Track:**
- Pages with highest engagement time
- Pages with low bounce rates
- Entry pages (first impression)
- Exit pages (last page before leaving)

**Action Items:**
- High engagement? → Feature more prominently
- Low engagement? → Improve content or remove
- High exit rate? → Add CTAs to next logical step

---

### 10. Weekly Executive Summary

**Custom Report for Derek:**

1. Go to **Library** → **Create new report**
2. Add sections:

**User Acquisition:**
- New users (this week vs last week)
- Top traffic sources

**Engagement:**
- Total image transformations
- Average transformations per user
- Most-used features

**Revenue (Conversions):**
- Promo codes redeemed
- New Pro/Unlimited users
- Conversion rate

**Retention:**
- Day 7 retention rate
- Active users (DAU, WAU, MAU)

**Content:**
- Top 5 prompts
- Top 5 pages

3. Schedule email delivery: Weekly on Monday mornings
4. Save as: "Weekly Executive Summary"

---

## Pre-Built Report Templates

Copy-paste these into GA4 Explorations:

### Template 1: "New User Journey"

**Goal:** Understand what new users do in first session

**Setup:**
- Filter: User type = "new"
- Events: `session_start` → `image_transformation` → `prompt_usage` → `download_image`
- Metrics: Users, event count, conversion rate
- Visualization: Funnel

**Use Case:** Optimize onboarding flow

---

### Template 2: "Power Users Analysis"

**Goal:** Identify and understand power users

**Setup:**
- Filter: Users with 10+ `image_transformation` events
- Dimensions: User properties (tier, signup date)
- Metrics: Sessions, events per session, favorite categories
- Visualization: Scatter plot (engagement vs conversions)

**Use Case:** Build features for your best users

---

### Template 3: "Viral Growth Tracking"

**Goal:** Track referral and social sharing

**Setup:**
- Events: `social_share`, `referral_signup`
- Dimensions: Share platform, content type
- Metrics: Share count, signups from shares, conversion rate
- Visualization: Sankey diagram (share → signup → conversion)

**Use Case:** Optimize viral loops

---

## Setting Up Automated Reports

### Daily Email Reports

1. Go to any saved Exploration
2. Click **Share** → **Schedule email delivery**
3. Choose:
   - Frequency: Daily at 8 AM
   - Recipients: derek.bobola@gmail.com
   - Format: PDF or Link

**Recommended Daily Reports:**
- Real-Time Operations Dashboard
- Conversion Funnel (yesterday's data)

### Weekly Email Reports

1. Same process as above
2. Frequency: Weekly on Monday at 9 AM

**Recommended Weekly Reports:**
- Weekly Executive Summary
- Feature Usage Report
- Prompt Performance

### Monthly Email Reports

**Recommended Monthly Reports:**
- User Retention Report
- Free vs Pro Behavior
- Content Engagement

---

## Google Data Studio (Looker Studio) Integration

For even more customization, connect GA4 to Google Data Studio:

1. Go to [datastudio.google.com](https://datastudio.google.com/)
2. Create → Data Source → Google Analytics 4
3. Select your PicForge property
4. Create custom dashboards with:
   - Real-time KPI cards
   - Trend charts
   - Geographic heat maps
   - Conversion funnels
   - Custom SQL queries

**Benefits:**
- More visual customization
- Combine GA4 with other data (InstantDB, Stripe)
- Shareable public dashboards
- Embedded dashboards in internal tools

---

## Mobile App (GA4 iOS/Android)

Stay connected on the go:

1. Download **Google Analytics** app (iOS/Android)
2. Sign in with your Google account
3. Select PicForge property
4. View real-time data, reports, and alerts
5. Set up push notifications for:
   - Traffic spikes
   - Conversion events
   - System anomalies

---

## Alerts & Notifications

Set up intelligent alerts:

1. Go to **Admin** → **Custom Alerts** (under Property)
2. Create alerts:

**Alert 1: Traffic Spike**
- Condition: Sessions increase by 50% compared to previous day
- Action: Email Derek

**Alert 2: Conversion Drop**
- Condition: Promo code redemptions < 5 per day
- Action: Email + SMS

**Alert 3: System Issue**
- Condition: No `image_transformation` events for 1 hour
- Action: Urgent email (something's broken!)

**Alert 4: Viral Moment**
- Condition: `social_share` events > 100 per hour
- Action: Email Derek (capitalize on momentum!)

---

## Best Practices

### 1. Start Simple
- Week 1: Monitor Real-Time reports only
- Week 2-4: Add Feature Usage and Conversions
- Month 2: Build custom funnels and segments
- Month 3+: Advanced attribution and cohorts

### 2. Focus on Actionable Metrics
Don't track vanity metrics. Track metrics that drive decisions:
- **Good:** Conversion rate, retention rate, revenue per user
- **Bad:** Total page views, bounce rate without context

### 3. Review Weekly, Adjust Monthly
- Weekly: Check trends, celebrate wins, spot issues
- Monthly: Deep dive, adjust strategy, build new reports

### 4. Benchmark Against Yourself
- Compare week-over-week
- Track month-over-month growth
- Celebrate improvements (even small ones!)

### 5. Share Insights with Team
- Create public dashboards (read-only)
- Weekly standup: Share 1-2 key insights
- Monthly review: Deep dive into trends

---

## Troubleshooting Reports

**Problem: No data in custom report**
- Wait 24-48 hours after creating events
- Check filters aren't too restrictive
- Verify events are firing (DebugView)

**Problem: Numbers don't match between reports**
- Different date ranges
- Different definitions (users vs sessions)
- Sampling (large datasets only show sample)

**Problem: Conversions not showing**
- Mark events as conversions (Configure → Events)
- Wait 24-48 hours
- Check conversion happened within attribution window (default: 30 days)

---

## Next Steps

1. **Week 1:** Set up Real-Time dashboard
2. **Week 2:** Create Conversion Funnel
3. **Week 3:** Build Feature Usage report
4. **Week 4:** Configure weekly email reports
5. **Month 2:** Add retention and cohort analysis
6. **Month 3:** Connect to Data Studio for advanced viz

---

## Resources

- [GA4 Explorations Guide](https://support.google.com/analytics/answer/9327972)
- [Funnel Exploration](https://support.google.com/analytics/answer/9327974)
- [Cohort Exploration](https://support.google.com/analytics/answer/9327975)
- [Data Studio Templates](https://datastudio.google.com/gallery)

---

Questions? derek.bobola@gmail.com
