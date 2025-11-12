# PicForge Analytics Dashboard

## Overview

The PicForge Analytics Dashboard provides comprehensive real-time insights into user behavior, prompt performance, conversion metrics, and business health. Built with InstantDB for real-time updates and Recharts for beautiful visualizations.

## Access

**Admin Only**: Available at `/admin` (requires authentication)

## Dashboard Sections

### 1. Overview Tab

The Overview tab provides high-level metrics and trends at a glance:

**Key Metrics Cards:**
- **Total Users** - Total registered users with today's new signups
- **Total Images** - All-time image generations with today's count
- **Daily Active Users (DAU)** - Unique users who generated images in last 24 hours (live updating)
- **Promo Codes** - Redeemed vs total promo codes

**Charts:**
- **Daily Signups (30 days)** - Line chart showing user registration trends
- **Daily Images Generated (30 days)** - Bar chart showing image generation volume
- **User Tier Distribution** - Pie chart breaking down Free/Pro/Unlimited users
- **User Retention** - Progress bars showing Day 1, Day 7, and Day 30 retention rates

**Quick Stats:**
- Average Images Per User
- Images Generated Last 7 Days
- Total Favorites Saved

### 2. Prompts Tab

Analyze which prompts users love most:

**Most Popular Prompts Table:**
- Rank by usage count
- Prompt text (truncated)
- Total uses
- Total favorites
- Last used date
- Export to CSV functionality

**Insights Provided:**
- Which prompts drive the most engagement
- Favorite vs. usage correlation
- Prompt lifecycle (when they were last used)

### 3. Users Tab

Deep dive into user behavior and segmentation:

**User Analytics Table:**
- User email
- Current tier (Free/Pro/Unlimited)
- Total images generated
- Join date
- Last active date
- Export to CSV functionality

**Sorting:**
- Users sorted by total images generated (most active first)

**Use Cases:**
- Identify power users
- Find inactive users for re-engagement
- Analyze tier distribution
- Track user lifecycle

### 4. Codes Tab

Manage and track promo code performance:

**Promo Code Generation:**
- **Generate Random Code** - Creates unique code with prefix "PICFORGE"
- **Create Custom Code** - Specify your own code (e.g., "DEREK-FOUNDER-2025")
- Select tier: Unlimited or Pro
- One-click copy to clipboard

**Promo Codes Table:**
- Code name
- Tier level
- Status (Available/Redeemed)
- Created date
- Redeemed date
- Export to CSV functionality

**Pre-Generated Codes:**
- DEREK-FOUNDER-2025 (Unlimited)
- BOBOLA-FAM-01, BOBOLA-FAM-02, BOBOLA-FAM-03 (Unlimited)
- BETA-VIP-001, BETA-VIP-002, BETA-VIP-003 (Unlimited)

### 5. Insights Tab (NEW)

Advanced analytics with real-time activity tracking:

#### Conversion Metrics

**Four Key Conversion Funnels:**

1. **Promo Code Redemption Rate**
   - Percentage of codes redeemed vs. created
   - Total codes redeemed count
   - Icon: Gift (purple)

2. **Referral Conversion Rate**
   - Percentage of referral codes that resulted in signups
   - Completed vs. pending referrals
   - Icon: Share (orange)

3. **User Activation Rate**
   - Percentage of users who generated at least one image
   - Critical metric for product-market fit
   - Icon: Users (teal)

4. **Free to Paid Upgrade Rate**
   - Percentage of users who upgraded from Free tier
   - Measures monetization effectiveness
   - Icon: Crown (cyan)

**Conversion Funnel Chart:**
- Bar chart comparing all four conversion rates
- Visual representation of user journey bottlenecks

**User Journey Insights:**
- **Average Time to First Image** - How quickly users activate after signup
- **Images per Active User** - Engagement depth metric
- **User Activation Percentage** - Overall activation success

#### Live Activity Feed

Real-time stream of user actions (last 20 activities):

**Activity Types:**
- **Image Generation** - User created a new transformation
  - Shows prompt excerpt
  - Teal icon
- **Favorite Saved** - User favorited a prompt
  - Shows prompt name
  - Pink heart icon
- **New Signup** - User registered
  - Shows email
  - Blue user icon
- **Promo Code Redeemed** - User upgraded
  - Shows code and tier
  - Purple sparkles icon

**Features:**
- Real-time updates (green pulsing indicator)
- Time ago labels (Just now, 5m ago, 2h ago, etc.)
- Scrollable feed with hover effects
- Auto-updates as new activities occur

#### Trending Prompts (7-Day Window)

Shows which prompts are gaining or losing popularity:

**Metrics:**
- **Current Count** - Uses in last 7 days
- **Previous Count** - Uses in previous 7 days
- **Trend Direction** - Up/Down/Stable
- **Percent Change** - Growth or decline percentage

**Trend Indicators:**
- Green up arrow: >10% growth
- Red down arrow: >10% decline
- Gray minus: Stable (within ±10%)

**Ranking:**
- Sorted by current usage count
- Top 15 prompts displayed
- Minimum 2 uses required to appear

**Use Cases:**
- Identify emerging trends
- Spot declining prompts
- Plan content strategy
- Update prompt library

#### Usage Heatmap

Visual representation of when users are most active:

**Grid Layout:**
- **Rows:** Days of the week (Sunday - Saturday)
- **Columns:** Hours of the day (0 - 23)
- **Colors:** Intensity-based gradient
  - Gray: No activity
  - Light teal: Low activity
  - Dark teal: High activity

**Insights Provided:**
- Peak usage hours
- Day-of-week patterns
- Optimal times for:
  - Sending emails
  - Running promotions
  - Scheduling maintenance
  - Posting social content

**Interactive:**
- Hover to see exact image count
- Shows day, hour, and count tooltip

#### Category Breakdown

Analyzes favorite prompts by category:

**Pie Chart:**
- Visual distribution of all 13 categories
- Percentages shown for categories >5%
- Legend with all categories

**Category List:**
- Colored dots matching pie chart
- Category name
- Percentage of total favorites
- Absolute count

**Categories Tracked:**
- Art Styles (teal)
- Nature (emerald)
- People (orange)
- Sports (blue)
- Politics (red)
- Wellness (purple)
- Events (pink)
- Pro Photography (amber)
- Fantasy (indigo)
- Abstract (cyan)
- Film (lime)
- Business (slate)
- Other (gray)

**Use Cases:**
- Understand user preferences
- Guide prompt library expansion
- Plan category-specific features
- Content strategy insights

## Technical Architecture

### Data Sources

All data comes from **InstantDB** with real-time updates:

```typescript
// Query structure (from useAdminAnalytics hook)
db.useQuery({ users: {} })
db.useQuery({ images: {} })
db.useQuery({ usage: {} })
db.useQuery({ favorites: {} })
db.useQuery({ promoCodes: {} })
db.useQuery({ referrals: {} })
```

### Key Components

**Admin Page:**
- `app/admin/page.tsx` - Main admin dashboard
- Tab-based navigation (Overview, Prompts, Users, Codes, Insights)
- Live data indicator (pulsing green dot)

**Analytics Hook:**
- `hooks/useAdminAnalytics.ts` - Data aggregation and calculations
- Memoized computations for performance
- Returns processed metrics and raw data

**Analytics Components:**
- `components/analytics/ActivityFeed.tsx` - Real-time activity stream
- `components/analytics/UsageHeatmap.tsx` - Hour/day usage patterns
- `components/analytics/CategoryBreakdown.tsx` - Favorite category distribution
- `components/analytics/TrendingPrompts.tsx` - 7-day prompt trends
- `components/analytics/ConversionMetrics.tsx` - Funnel analysis

### Dependencies

- **recharts** (v3.3.0) - Charts and visualizations
- **@instantdb/react** (v0.22.18) - Real-time database
- **date-fns** (v4.1.0) - Date formatting and calculations
- **lucide-react** (v0.544.0) - Icons
- **next** (v15.5.3) - Framework

### Performance Optimizations

1. **Memoization** - All calculations use `useMemo` to prevent unnecessary recalculations
2. **Real-time Updates** - InstantDB provides efficient subscriptions
3. **Pagination** - Activity feed limited to 20 most recent items
4. **CSV Export** - Large datasets can be exported for external analysis
5. **Lazy Loading** - Charts only render when tab is active

## Export Functionality

All major tables support **CSV export**:

**Included Data:**
- Prompts Analytics (prompt, uses, favorites, last used)
- User Analytics (email, tier, images, join date, last active)
- Promo Codes (code, tier, status, created, redeemed)

**Export Process:**
1. Click "Export CSV" button
2. File downloads automatically
3. Filename includes date: `prompts-analytics-2025-10-22.csv`

**Use Cases:**
- Import into Google Sheets/Excel
- Share with team members
- Create custom reports
- Backup historical data

## Key Metrics Definitions

### Retention Rates

**Day 1 Retention:**
- Users who joined yesterday and generated an image today
- Formula: (Active Yesterday Users / Joined Yesterday Users) × 100

**Day 7 Retention:**
- Users who joined 7 days ago and generated an image today
- Formula: (Active 7-Day Users / Joined 7 Days Ago Users) × 100

**Day 30 Retention:**
- Users who joined 30 days ago and generated an image today
- Formula: (Active 30-Day Users / Joined 30 Days Ago Users) × 100

### Conversion Rates

**Promo Code Redemption:**
- Formula: (Redeemed Codes / Total Codes) × 100
- Target: >30% is healthy

**User Activation:**
- Formula: (Users With Images / Total Users) × 100
- Target: >60% is excellent

**Upgrade Rate:**
- Formula: (Upgraded Users / Total Users) × 100
- Target: >10% is strong

### Engagement Metrics

**Average Images Per User:**
- Formula: Total Images / Total Users
- Benchmark: 5+ indicates high engagement

**Daily Active Users (DAU):**
- Unique users who generated images in last 24 hours
- Growth indicates product momentum

**Average Time to First Image:**
- Time between signup and first image generation
- Lower is better (indicates easy onboarding)

## Business Insights

### What to Monitor Daily

1. **DAU Trend** - Is user activity growing?
2. **New Signups** - Healthy acquisition rate?
3. **Activity Feed** - What are users doing right now?
4. **Trending Prompts** - What's hot today?

### What to Monitor Weekly

1. **Retention Rates** - Are users coming back?
2. **Conversion Funnels** - Where are drop-offs?
3. **Category Breakdown** - Shifting preferences?
4. **Usage Heatmap** - Optimal engagement times?

### What to Monitor Monthly

1. **User Growth Rate** - Month-over-month growth
2. **Tier Distribution** - Free to Paid ratio
3. **Promo Code Performance** - ROI on promotions
4. **Power User Analysis** - Top 10% behavior

### Red Flags to Watch For

- **DAU declining** - Engagement problem
- **Activation rate <40%** - Onboarding issues
- **Day 7 retention <20%** - Product-market fit concern
- **Time to first image >24h** - Too complex to start
- **Trending prompts all declining** - Content refresh needed

### Green Flags (Success Indicators)

- **DAU growing** - Strong engagement
- **Activation rate >60%** - Easy to use
- **Day 7 retention >40%** - Users coming back
- **Upgrade rate >5%** - Monetization working
- **Trending prompts diverse** - Healthy ecosystem

## Integration with Google Analytics

The dashboard tracks events using GA4:

**Tracked Events:**
- `image_transformation` - Every image generated
- `prompt_usage` - Prompt used from library
- `promo_code_redemption` - Code redeemed
- `favorite_prompt` - Prompt saved
- `sign_up` - New user registered

**User Properties:**
- `user_tier` - Free/Pro/Unlimited
- `has_generated_images` - Boolean
- `total_transformations` - Count

See `lib/analytics.ts` for complete event tracking implementation.

## Future Enhancements

### Planned Features

1. **A/B Testing Dashboard** - Compare prompt performance
2. **Cohort Analysis** - User behavior by signup date
3. **Revenue Analytics** - Stripe integration (when payment added)
4. **Geographic Distribution** - User location heatmap
5. **Session Recording** - Watch user interactions
6. **Anomaly Detection** - Automatic alerts for unusual patterns
7. **Predictive Analytics** - Churn prediction
8. **Custom Date Ranges** - Filter all charts by date
9. **Comparison Mode** - This week vs. last week
10. **Email Reports** - Daily/weekly summaries

### Enhancement Opportunities

- **Prompt Performance Score** - Composite metric (usage + favorites + shares)
- **User Journey Visualization** - Sankey diagram of user paths
- **LTV Calculation** - Lifetime value by acquisition channel
- **Referral Attribution** - Track referral chain depth
- **Feature Usage Matrix** - Which features drive retention
- **Seasonal Trends** - Year-over-year comparisons

## Troubleshooting

### Dashboard Not Loading

1. Check InstantDB connection (`NEXT_PUBLIC_INSTANT_APP_ID` in `.env.local`)
2. Verify user is authenticated
3. Check browser console for errors
4. Ensure all dependencies are installed (`npm install`)

### Data Not Updating

1. InstantDB queries are real-time - check network tab
2. Verify data exists in InstantDB dashboard
3. Clear browser cache and reload
4. Check `useAdminAnalytics` hook for query errors

### Charts Rendering Incorrectly

1. Ensure recharts is installed (`npm install recharts`)
2. Check responsive container dimensions
3. Verify data format matches chart expectations
4. Clear browser cache

### CSV Export Not Working

1. Check browser allows file downloads
2. Verify data exists to export
3. Check console for errors
4. Try different browser

## Best Practices

### For Derek (Admin)

1. **Check dashboard daily** - Monitor key metrics
2. **Export data weekly** - Backup for historical analysis
3. **Watch trending prompts** - Guide content strategy
4. **Monitor conversion rates** - Optimize marketing
5. **Review activity feed** - Understand user behavior

### For Data Analysis

1. **Compare time periods** - Week-over-week, month-over-month
2. **Segment users** - Free vs. Paid behavior differs
3. **Track cohorts** - Users from same signup period
4. **Correlate metrics** - How do prompts affect retention?
5. **Document insights** - Keep a changelog of learnings

## Support

**Questions?** Check:
- InstantDB docs: https://www.instantdb.com/docs
- Recharts docs: https://recharts.org/
- Next.js docs: https://nextjs.org/docs

**Issues?**
- File GitHub issue
- Contact derek.bobola@gmail.com

---

**Last Updated:** October 22, 2025
**Version:** 1.0
**Author:** Claude (Analytics Implementation Specialist)
