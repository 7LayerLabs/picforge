# PicForge Analytics Quick Start Guide

## Getting Started (5 Minutes)

### 1. Access the Dashboard

Navigate to: **https://pic-forge.com/admin**

You'll see 5 tabs:
- **Overview** - High-level metrics at a glance
- **Prompts** - Most popular prompts ranking
- **Users** - User behavior and segmentation
- **Codes** - Promo code management
- **Insights** - Advanced analytics (NEW!)

### 2. Daily Health Check (2 minutes)

Check these 4 metrics every morning:

1. **Daily Active Users (DAU)** - Overview tab, top right card
   - Goal: Growing trend
   - Red flag: Declining for 3+ days

2. **New Signups Today** - Overview tab, top left card
   - Goal: Consistent or growing
   - Red flag: Dropping to zero

3. **Activity Feed** - Insights tab, top section
   - Goal: Consistent stream of activities
   - Red flag: Long gaps in activity

4. **Trending Prompts** - Insights tab, right column
   - Goal: Mix of up/stable/down trends
   - Red flag: All declining

### 3. Weekly Deep Dive (10 minutes)

Every Monday, review:

1. **Retention Rates** - Overview tab, bottom section
   - Day 1: Target >50%
   - Day 7: Target >30%
   - Day 30: Target >15%

2. **Conversion Funnel** - Insights tab, top cards
   - Activation: Target >60%
   - Upgrade: Target >5%
   - Promo: Target >30%

3. **Usage Heatmap** - Insights tab, middle section
   - Find peak hours for:
     - Sending emails
     - Running promotions
     - Posting content

4. **Export Data** - All tabs have "Export CSV" button
   - Save weekly snapshots
   - Track long-term trends

## Key Metrics Cheat Sheet

### Health Indicators

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| DAU Growth | +10% weekly | Flat | -10% weekly |
| Activation Rate | >60% | 40-60% | <40% |
| Day 7 Retention | >30% | 15-30% | <15% |
| Upgrade Rate | >5% | 2-5% | <2% |
| Avg Images/User | >5 | 2-5 | <2 |

### What Each Metric Tells You

**Total Users**
- Measures: Overall growth
- Action: Track acquisition campaigns

**Daily Active Users**
- Measures: Engagement
- Action: Monitor for sudden drops

**Activation Rate**
- Measures: Onboarding success
- Action: Improve first-time experience

**Day 7 Retention**
- Measures: Product-market fit
- Action: Focus on aha moments

**Upgrade Rate**
- Measures: Monetization
- Action: Test pricing/features

**Avg Time to First Image**
- Measures: Onboarding friction
- Action: Simplify getting started

## Quick Actions

### If DAU is Dropping

1. Check Activity Feed - What stopped?
2. Review Trending Prompts - Content fresh?
3. Check Usage Heatmap - Timezone issues?
4. Email inactive users (Top users tab)

### If Signups are Down

1. Check referral programs
2. Review marketing campaigns
3. Monitor social media mentions
4. Test landing page changes

### If Activation is Low

1. Review onboarding flow
2. Check template examples
3. Test prompt suggestions
4. Add more tutorials

### If Retention is Dropping

1. Check trending prompts - stale?
2. Review power user behavior
3. Test re-engagement emails
4. Add new features

## Pro Tips

### Morning Routine (5 min)

1. Open /admin
2. Check Overview tab
3. Scroll Activity Feed
4. Note any anomalies
5. Close tab

### Weekly Analysis (15 min)

1. Export all 3 CSVs (Prompts, Users, Codes)
2. Open in Google Sheets
3. Create pivot tables
4. Track week-over-week changes
5. Document insights

### Monthly Planning (30 min)

1. Review 30-day trends
2. Identify top 10 prompts
3. Find churn patterns
4. Plan new features
5. Set next month goals

## Common Questions

**Q: How often does data update?**
A: Real-time! InstantDB updates as events occur.

**Q: Can I see historical data?**
A: Yes, charts show 30-day history. Export CSV for longer.

**Q: What's a good DAU number?**
A: Depends on total users. Aim for 20-30% of total users daily.

**Q: How do I improve retention?**
A: Focus on Day 7. If users come back after a week, they'll stay.

**Q: Should I worry about trending down prompts?**
A: Not immediately. Users cycle through prompts naturally.

**Q: What's the most important metric?**
A: Day 7 retention. It predicts long-term success.

## Benchmark Targets

### Year 1 Goals (Startup Phase)

- Total Users: 1,000+
- DAU: 200+ (20% of users)
- Activation Rate: 70%+
- Day 7 Retention: 35%+
- Upgrade Rate: 5%+

### Year 2 Goals (Growth Phase)

- Total Users: 10,000+
- DAU: 3,000+ (30% of users)
- Activation Rate: 75%+
- Day 7 Retention: 40%+
- Upgrade Rate: 10%+

### Year 3 Goals (Scale Phase)

- Total Users: 100,000+
- DAU: 40,000+ (40% of users)
- Activation Rate: 80%+
- Day 7 Retention: 45%+
- Upgrade Rate: 15%+

## Red Flags (Act Immediately)

1. **DAU drops 30%+ overnight** → Check servers
2. **Zero signups for 24h** → Check marketing
3. **Activation rate <30%** → Fix onboarding
4. **Day 7 retention <10%** → Product issue
5. **All trending prompts declining** → Add content

## Green Flags (Celebrate!)

1. **DAU growing 10%+ weekly** → Momentum building
2. **Activation rate >70%** → Easy to use
3. **Day 7 retention >40%** → Users love it
4. **Upgrade rate >10%** → Monetization working
5. **Diverse trending prompts** → Healthy usage

## Need Help?

**Dashboard Issues:**
- Check InstantDB connection
- Clear browser cache
- Try incognito mode
- Contact derek.bobola@gmail.com

**Metric Questions:**
- See full README: `ANALYTICS_DASHBOARD_README.md`
- Check InstantDB docs: instantdb.com/docs
- Ask Claude for analysis

---

**Remember:** Analytics are a compass, not a map. Use them to guide decisions, not dictate them.

**Last Updated:** October 22, 2025
