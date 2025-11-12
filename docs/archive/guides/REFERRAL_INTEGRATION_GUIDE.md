# Referral System Integration Guide

Quick guide for adding referral CTAs to key pages in PicForge.

## Files Created

### Core System
- `lib/instantdb.ts` - Added `referrals` entity to schema
- `hooks/useReferral.ts` - Main referral logic and state management
- `components/ReferralShareButton.tsx` - Social sharing buttons
- `components/ReferralCTA.tsx` - Referral call-to-action component (3 variants)
- `app/referral/page.tsx` - Referral landing page for new users
- `app/profile/page.tsx` - Updated with referral UI

### Documentation
- `REFERRAL_SYSTEM.md` - Complete technical documentation
- `REFERRAL_INTEGRATION_GUIDE.md` - This file (integration instructions)

## Integration Points

### 1. Main Editor Page (`app/page.tsx`)

Add referral CTA after successful image transformation:

```tsx
import ReferralCTA from '@/components/ReferralCTA';

// Inside your component, after image result is displayed:
{transformedImage && (
  <div className="mt-8">
    <ReferralCTA variant="banner" showStats={true} />
  </div>
)}
```

**Hook Point:** After user creates their first transformation - they're excited and likely to share!

### 2. Batch Processor (`app/batch/page.tsx`)

Add compact referral CTA in results footer:

```tsx
import ReferralCTA from '@/components/ReferralCTA';

// After batch processing completes:
{completedImages.length > 0 && (
  <div className="mt-6">
    <ReferralCTA variant="compact" />
  </div>
)}
```

**Hook Point:** After processing multiple images - user sees value, wants to share with team/friends.

### 3. Canvas Generator (`app/canvas/page.tsx`)

Add modal-style CTA as overlay after generation:

```tsx
import ReferralCTA from '@/components/ReferralCTA';
import { useState } from 'react';

const [showReferralModal, setShowReferralModal] = useState(false);

// After AI image generation succeeds:
useEffect(() => {
  if (generatedImage) {
    // Show modal after 2 seconds
    setTimeout(() => setShowReferralModal(true), 2000);
  }
}, [generatedImage]);

// In render:
{showReferralModal && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="max-w-2xl w-full">
      <ReferralCTA variant="modal" showStats={true} />
      <button
        onClick={() => setShowReferralModal(false)}
        className="mt-4 w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
      >
        Maybe Later
      </button>
    </div>
  </div>
)}
```

**Hook Point:** After generating AI art - user is impressed, perfect sharing moment!

### 4. Showcase Page (`app/showcase/page.tsx`)

Add referral link to showcase submission flow:

```tsx
import { useReferral } from '@/hooks/useReferral';

const { activeReferralCode, referralLink } = useReferral();

// In showcase submission success message:
<p className="font-body text-white">
  Your transformation has been submitted!
  {referralLink && (
    <>
      {' '}
      <a href="/profile" className="text-teal-500 underline">
        Share your referral link
      </a> and earn bonus images!
    </>
  )}
</p>
```

**Hook Point:** After user submits to showcase - they're already in sharing mindset!

### 5. Pricing Page (`app/pricing/page.tsx`)

Add referral alternative to paid plans:

```tsx
import { useReferral } from '@/hooks/useReferral';

const { completedReferralsCount } = useReferral();

// Add as alternative option:
<div className="bg-gradient-to-r from-teal-500 to-purple-600 rounded-2xl p-8 text-center">
  <h3 className="font-heading text-3xl font-bold text-black mb-4">
    Or Get Free Images Forever
  </h3>
  <p className="font-body text-black text-lg mb-2">
    Invite 10 friends = 100 bonus images
  </p>
  <p className="font-body text-black text-sm mb-6">
    That's 5 months of free images! (Worth $50)
  </p>
  {completedReferralsCount > 0 ? (
    <p className="font-body text-black text-sm">
      You've already invited {completedReferralsCount} friends. Keep going!
    </p>
  ) : (
    <Link
      href="/profile"
      className="inline-block px-8 py-4 bg-black text-teal-500 rounded-xl font-bold hover:bg-gray-900 transition-all"
    >
      Get Your Referral Link
    </Link>
  )}
</div>
```

**Hook Point:** When users see pricing, offer free alternative via referrals!

### 6. Navigation Header (`components/Navigation.tsx`)

Add referral notification badge (optional):

```tsx
import { useReferral } from '@/hooks/useReferral';

const { completedReferralsCount, totalBonusImages } = useReferral();

// In profile dropdown:
{user && completedReferralsCount > 0 && (
  <div className="px-4 py-2 bg-teal-500 bg-opacity-20 rounded-lg mb-2">
    <p className="font-body text-teal-500 text-xs font-bold">
      🎉 {completedReferralsCount} friends joined!
    </p>
    <p className="font-body text-white text-xs">
      +{totalBonusImages} bonus images earned
    </p>
  </div>
)}
```

**Hook Point:** Persistent reminder of referral benefits!

## Recommended Rollout Strategy

### Phase 1 - Profile Page (DONE)
- ✅ Full referral UI on profile page
- ✅ Referral landing page for new users
- ✅ Share buttons and code display

### Phase 2 - Main Editor (HIGH PRIORITY)
1. Add banner CTA after image transformation
2. Show after user's 2nd or 3rd transformation (don't overwhelm on first use)
3. Only show to logged-in users
4. Dismissible with localStorage persistence

```tsx
const [showReferralCTA, setShowReferralCTA] = useState(false);
const [referralCTADismissed, setReferralCTADismissed] = useState(
  localStorage.getItem('referralCTADismissed') === 'true'
);

useEffect(() => {
  if (imageHistory.length >= 2 && !referralCTADismissed) {
    setShowReferralCTA(true);
  }
}, [imageHistory.length, referralCTADismissed]);

const dismissCTA = () => {
  localStorage.setItem('referralCTADismissed', 'true');
  setReferralCTADismissed(true);
  setShowReferralCTA(false);
};
```

### Phase 3 - Batch & Canvas
1. Add compact CTA to batch results
2. Add modal CTA to canvas generation
3. Test conversion rates

### Phase 4 - Showcase & Pricing
1. Add referral mentions to showcase flow
2. Add referral alternative to pricing page
3. A/B test messaging

### Phase 5 - Navigation & Notifications
1. Add referral badge to navigation
2. Email notifications when friends join (optional)
3. Push notifications for milestones (optional)

## A/B Testing Ideas

### Messaging Variants
1. **Value-focused:** "Earn 10 free images"
2. **Social-focused:** "Help your friends discover PicForge"
3. **Scarcity-focused:** "Limited time: Double rewards!"
4. **Achievement-focused:** "Unlock unlimited access with 10 referrals"

### CTA Placement
1. **Immediate:** Show right after transformation
2. **Delayed:** Show 5 seconds after result
3. **Modal:** Full-screen overlay (higher friction, higher conversion)
4. **Banner:** Inline banner (lower friction, lower conversion)

### Timing
1. **After 1st transformation:** Capture excitement early
2. **After 3rd transformation:** User understands value
3. **At daily limit:** "Need more? Invite friends!"
4. **Never show again:** Track dismissals and respect user preference

## Success Metrics

### Primary KPIs
- **Referral Conversion Rate:** Target 25%+ (referral codes redeemed / codes generated)
- **Viral Coefficient (K):** Target 1.0+ for viral growth
- **Referral Attribution:** Target 30%+ of new users via referral

### Secondary KPIs
- **Time to First Share:** Target <7 days from signup
- **Share Method Breakdown:** Which channels work best (copy/Twitter/email/WhatsApp)
- **Referral Leaderboard:** Top 10 users by referrals

### Tracking Implementation

```tsx
// Track referral link shares
const trackShare = (method: 'copy' | 'twitter' | 'email' | 'whatsapp') => {
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'referral_share', {
      method,
      referral_code: activeReferralCode,
      user_id: user?.id,
    });
  }
};

// Track CTA interactions
const trackCTAClick = (variant: string, location: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'referral_cta_click', {
      variant,
      location, // 'main_editor', 'batch_processor', etc.
      user_id: user?.id,
    });
  }
};
```

## Edge Cases & Considerations

### 1. Self-Referral Prevention
Already handled in `useReferral.ts` - users cannot redeem their own codes.

### 2. Bonus Image Overflow
If user has 18/20 images used and gets +10 bonus, they'll have 8/20 (10 bonus applied).
No overflow - bonus is capped at reducing count to 0.

### 3. Code Uniqueness
Codes are randomly generated. Collision is extremely unlikely (36^6 = 2.1 billion combinations).
If collision occurs, InstantDB will prevent duplicate entries.

### 4. Referral Fraud
Monitor for suspicious patterns:
- Multiple signups from same IP
- Rapid referral redemptions
- Email pattern matching (test@test.com, test1@test.com, etc.)
- Implement rate limiting if needed

### 5. Expired Codes
Currently no expiration. Could add in Phase 2:
- 90-day expiration for pending codes
- Cleanup job to delete expired codes
- Regenerate code button on profile

## Next Steps

1. **Deploy Phase 1** (Profile page) - DONE ✅
2. **Add to Main Editor** - Start here for maximum impact
3. **Track metrics** - Set up analytics dashboard
4. **Iterate on messaging** - A/B test CTAs
5. **Add gamification** - Leaderboards, badges, milestones

## Questions?

Refer to `REFERRAL_SYSTEM.md` for complete technical documentation.
