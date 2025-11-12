# PicForge Referral System

## Overview

A viral referral system that rewards both referrers and new users with 10 bonus images each. Built with InstantDB for real-time tracking and seamless user experience.

## How It Works

### For Existing Users (Referrers)
1. Every user automatically gets a unique referral code when they sign in
2. Format: `USERNAME-ABC123` (first 4 chars of email + random 6-char string)
3. Share the referral link via:
   - Copy to clipboard (one-click)
   - Twitter
   - Email
   - WhatsApp
4. When a friend signs up using your code:
   - You get 10 bonus images (reduces your usage count by 10)
   - Your friend gets 10 bonus images
   - Your referral counter increases

### For New Users (Referred)
1. Click a referral link: `https://pic-forge.com/referral?code=DEREK-ABC123`
2. See welcome page with bonus details
3. Sign in with magic link (InstantDB auth)
4. Automatically receive 10 bonus images
5. Can start creating immediately

## Technical Architecture

### Database Schema

**`referrals` entity in InstantDB:**
```typescript
{
  id: string;
  referrerId: string;        // User who created the code
  referralCode: string;       // Unique code (e.g., "DEREK-ABC123")
  referredUserId?: string;    // User who redeemed the code
  status: 'pending' | 'completed';
  bonusImagesReferrer: 10;    // Always 10
  bonusImagesReferred: 10;    // Always 10
  createdAt: number;
  redeemedAt?: number;
}
```

### Key Files

#### Hooks
- **`hooks/useReferral.ts`** - Main referral logic
  - Auto-generates referral codes on first sign-in
  - Tracks referral redemptions
  - Calculates bonus image totals
  - Prevents self-referral and duplicate redemptions
  - Updates usage counts for both users

#### Components
- **`components/ReferralShareButton.tsx`** - Social sharing UI
  - Copy to clipboard with confirmation
  - Twitter share with pre-filled message
  - Email share with subject and body
  - WhatsApp share
  - Two variants: `default` (full) and `compact` (minimal)

#### Pages
- **`app/referral/page.tsx`** - Referral landing page
  - Shows welcome message to non-signed-in users
  - Auto-redeems code after sign-in
  - Success celebration page
  - Error handling for invalid/used codes

- **`app/profile/page.tsx`** - Profile with referral UI
  - Full-width gradient banner showing stats
  - Referral code display
  - Share buttons
  - Completed referrals counter
  - Total bonus images earned

### Viral Mechanics

#### Natural Sharing Moments
1. **Immediate value** - "Share to give your friend 10 free images"
2. **Self-interest** - "You get 10 free images for each friend"
3. **Social proof** - Display referral count and bonus images earned
4. **Easy sharing** - One-click copy, social media buttons
5. **No limits** - Unlimited referrals, unlimited bonus images

#### Growth Loop
```
User creates images → Loves PicForge → Shares referral link
    ↓
Friend clicks link → Signs up → Gets 10 bonus images
    ↓
Both users create more images → Share more → Invite more friends
    ↓
Cycle repeats exponentially
```

#### Hook Points
- **Post-image creation** - "Share your results and earn bonus images"
- **Daily limit reached** - "Invite friends to get more images today"
- **Profile page** - Prominent referral banner with stats
- **Success moments** - Celebrate when referrals convert

### Reward Distribution

#### How Bonus Images Work
- Bonus images are tracked by **reducing the usage count**
- Example: User has used 15/20 images today
  - Friend redeems their referral code
  - Usage count drops to 5/20 (effectively +10 free images)
  - Friend starts at -10/20 (10 bonus images to use)

#### Edge Cases Handled
1. **Self-referral prevention** - Can't use your own code
2. **One-time redemption** - Each user can only redeem one referral code
3. **Unique codes** - Each referral code can only be used once
4. **Auto-generation** - Codes created automatically on sign-in
5. **Existing user codes** - If user already has a pending code, reuse it

### Analytics & Tracking

#### Metrics to Monitor
- **Viral Coefficient (K)** - How many new users each user brings
  - Formula: `K = (completedReferrals / totalUsers) * conversionRate`
  - Target: K > 1.0 for viral growth

- **Referral Conversion Rate** - % of referral links that result in signups
  - Track clicks on referral links
  - Track successful redemptions
  - Target: 20%+ conversion

- **Time to First Referral** - How long before users share
  - Track days between signup and first referral share
  - Target: <7 days

- **Referral Attribution** - Which sharing method works best
  - Track shares by platform (copy/Twitter/email/WhatsApp)
  - Optimize most effective channels

#### Dashboard Queries

```typescript
// Total referrals by user
const { data } = db.useQuery({
  referrals: {
    $: { where: { referrerId: userId, status: 'completed' } }
  }
});

// Top referrers leaderboard
const { data } = db.useQuery({
  referrals: {
    $: { where: { status: 'completed' } }
  }
});
// Group by referrerId, count completedReferrals

// Conversion rate
const pendingCodes = referrals.filter(r => r.status === 'pending').length;
const completedCodes = referrals.filter(r => r.status === 'completed').length;
const conversionRate = (completedCodes / (pendingCodes + completedCodes)) * 100;
```

### Future Enhancements

#### Phase 2 - Gamification
- [ ] **Leaderboard** - Top referrers with rewards
- [ ] **Milestones** - Badges at 5, 10, 25, 50, 100 referrals
- [ ] **Tier bonuses** - 5 referrals = Pro for 1 month, 10 = Pro for 3 months
- [ ] **Referral challenges** - "First 100 users to get 10 referrals get lifetime Pro"

#### Phase 3 - Advanced Features
- [ ] **Custom referral codes** - Let users choose their code (e.g., "DEREK")
- [ ] **Referral analytics dashboard** - Show which channels perform best
- [ ] **Email notifications** - Alert users when friends sign up
- [ ] **Referral rewards tiers** - More bonuses for power users
- [ ] **Time-limited campaigns** - "Double rewards this week!"

#### Phase 4 - Viral Amplification
- [ ] **Social proof widgets** - "Join 10,000+ users" on landing pages
- [ ] **Referral contests** - Monthly prizes for top referrers
- [ ] **Team referrals** - Collaborate with friends to hit group goals
- [ ] **Integration with showcase** - Auto-share showcase submissions with referral link
- [ ] **In-app referral prompts** - Contextual nudges to share

## Testing Checklist

- [x] User auto-generates referral code on first sign-in
- [ ] Referral link works correctly (`/referral?code=XXX`)
- [ ] New user can sign in via referral landing page
- [ ] Both users receive 10 bonus images after redemption
- [ ] Self-referral is blocked
- [ ] Duplicate redemptions are prevented
- [ ] Share buttons (copy/Twitter/email/WhatsApp) work
- [ ] Profile page displays referral stats correctly
- [ ] Referral banner shows correct counts
- [ ] Usage count decreases by 10 for both users

## Marketing Copy

### Profile Banner
> **Invite Friends, Earn Free Images**
> Give your friends 10 bonus images, get 10 for yourself!

### Referral Landing Page
> **You've Been Invited!**
> A friend wants to give you 10 FREE bonus images on PicForge!

### Share Message (Twitter/WhatsApp)
> Hey! I'm using PicForge to transform images with AI. Sign up with my referral code [CODE] and we both get 10 FREE bonus images! [LINK]

### Email Subject
> Join me on PicForge - Get 10 FREE Images!

### Success Message
> **Welcome to PicForge!**
> Success! You both got 10 bonus images!

## Growth Targets

### Week 1 (Launch)
- 100 referral codes generated
- 20 successful referrals (20% conversion)
- K-factor: 0.2

### Month 1
- 1,000 referral codes generated
- 300 successful referrals (30% conversion)
- K-factor: 0.6

### Month 3
- 5,000 referral codes generated
- 2,000 successful referrals (40% conversion)
- K-factor: 1.2 (viral growth!)

### Success Metrics
- **Primary**: Viral coefficient K > 1.0
- **Secondary**: 25%+ referral conversion rate
- **Tertiary**: 50%+ of new users come via referral

## Integration Points

### With Existing Features

1. **Image Editor**
   - Add "Share & Earn" button after image creation
   - Show remaining bonus images counter

2. **Batch Processor**
   - "Invite friends for unlimited batch processing" CTA
   - Show referral stats in batch results

3. **Showcase**
   - Auto-include referral link in showcase submissions
   - "Share this transformation and earn bonuses"

4. **Pricing Page**
   - "Or invite 10 friends for unlimited access" alternative
   - Calculate referral value vs. Pro pricing

5. **Navigation**
   - Add referral link counter to header (e.g., "3 friends joined!")
   - Quick share button in user dropdown

## API Endpoints (Future)

For advanced analytics and admin features:

```typescript
// Track referral link clicks
POST /api/referral/track-click
{ referralCode: string, source: 'twitter' | 'email' | 'copy' | 'whatsapp' }

// Get referral stats
GET /api/referral/stats/:userId
Response: { totalReferrals, bonusEarned, conversionRate, clickCount }

// Admin: Top referrers
GET /api/admin/referrals/leaderboard
Response: [{ userId, email, referralCount, bonusEarned }]

// Admin: Referral analytics
GET /api/admin/referrals/analytics
Response: { totalCodes, pendingCodes, completedCodes, conversionRate, viralCoefficient }
```

## Deployment Notes

1. **InstantDB Schema** - Referrals entity is added to `lib/instantdb.ts`
2. **Environment Variables** - No new env vars required (uses existing InstantDB)
3. **Migration** - No data migration needed (new feature)
4. **Testing** - Test with 2+ user accounts to verify both users get bonuses
5. **Monitoring** - Watch for referral fraud (automated signups, fake accounts)

## Support & Troubleshooting

### Common Issues

**Q: Referral code not generating**
A: Check InstantDB connection. Code auto-generates on first sign-in.

**Q: Bonus images not applied**
A: Check usage count in profile. Bonus reduces count by 10.

**Q: Self-referral warning**
A: This is intentional. Users can't refer themselves.

**Q: "Already redeemed" error**
A: Each user can only redeem one referral code, ever.

**Q: Referral link not working**
A: Ensure format is correct: `/referral?code=XXXX-XXXXXX`

## Conclusion

This referral system is designed for viral growth with minimal friction. Every user automatically becomes a potential growth channel, and the dual-sided rewards create a powerful incentive to share.

**Key Success Factors:**
1. Automatic code generation (no signup required)
2. Immediate value for both parties (10 images each)
3. Easy sharing (one-click copy + social buttons)
4. Clear tracking (see your impact in real-time)
5. No limits (unlimited referrals = unlimited growth)

Expected outcome: **30-50% of new users will come via referrals within 60 days**, creating a self-sustaining growth loop.
