# Analytics Tracking TODO

This document lists files that still need GA4 tracking implemented. These are lower priority features that can be tracked when time permits.

## Status Legend
- ✅ Complete - Tracking fully implemented
- 🔄 Partial - Some tracking, needs more
- ⏳ Todo - No tracking yet

---

## Core Pages

### ✅ Main Editor (app/page.tsx)
**Status**: Complete
**Events Tracked**:
- `image_transformation` - When user transforms image
- User properties set via `useImageTracking` hook
- Download events tracked in ImageGallery component

**No Changes Needed**

---

### ✅ Canvas Page (app/canvas/page.tsx)
**Status**: Complete (just updated)
**Events Tracked**:
- `canvas_generation` - Success/failure tracking
- `download_image` - Canvas downloads

**Recently Added** (October 22, 2025):
```typescript
// Track generation
trackCanvasGeneration(prompt, '1024x1024', 'standard', success);

// Track downloads
trackDownload('canvas');
```

---

### ✅ Roulette Page (app/roulette/page.tsx)
**Status**: Complete (just updated)
**Events Tracked**:
- `roulette_spin` - Spin with category, prompt, streak
- `download_image` - Roulette result downloads

**Recently Added** (October 22, 2025):
```typescript
// Track spin
trackRouletteSpinned({
  category: categoryName,
  prompt_title: randomPrompt,
  spin_number: stats.totalSpins,
  streak: stats.streak
});

// Track downloads
trackDownload('roulette');
```

---

### 🔄 Batch Page (app/batch/page.tsx)
**Status**: Partial - Needs implementation
**Events Needed**:
- `batch_process` - When batch starts
- `download_image` - When batch results downloaded

**Code to Add**:

```typescript
import { trackBatchProcess, trackDownload } from '@/lib/analytics';

// When batch processing starts
const handleBatchStart = (images: File[], effect: string) => {
  trackBatchProcess(
    images.length,
    effect,
    false // is_nsfw
  );

  // Process images...
};

// When downloading batch results
const handleBatchDownload = () => {
  trackDownload('batch');

  // Perform download...
};
```

**Priority**: Medium
**Estimated Time**: 5 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\batch\page.tsx`

---

### ⏳ Roast Page (app/roast/page.tsx)
**Status**: Todo
**Events Needed**:
- `roast_generation` - When roast is generated
- `download_image` - When roast downloaded

**Code to Add**:

```typescript
import { trackRoastGeneration, trackDownload } from '@/lib/analytics';

// When roast is generated
const handleGenerateRoast = async (intensity: 'mild' | 'spicy' | 'nuclear') => {
  // Track before API call
  trackRoastGeneration(intensity);

  const response = await fetch('/api/roast', {
    method: 'POST',
    body: JSON.stringify({ image, intensity })
  });

  // Handle response...
};

// When downloading roast
const handleDownload = () => {
  trackDownload('roast');
  // Download logic...
};
```

**Priority**: Medium
**Estimated Time**: 5 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\roast\page.tsx`

---

### ⏳ Prompt Wizard (app/prompt-wizard/page.tsx)
**Status**: Todo
**Events Needed**:
- `prompt_wizard_complete` - When wizard completes

**Code to Add**:

```typescript
import { trackPromptWizardComplete } from '@/lib/analytics';

// When wizard completes all steps
const handleComplete = (finalPrompt: string) => {
  trackPromptWizardComplete(
    5, // steps_completed (adjust to actual number)
    finalPrompt.length
  );

  // Navigate or show result...
};
```

**Priority**: Low
**Estimated Time**: 2 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\prompt-wizard\page.tsx`

---

## Components

### ⏳ ShareModal (components/ShareModal.tsx)
**Status**: Todo
**Events Needed**:
- `social_share` - When user clicks social platform

**Code to Add**:

```typescript
import { trackSocialShare } from '@/lib/analytics';

// Twitter share
const handleTwitterShare = () => {
  trackSocialShare({
    platform: 'twitter',
    content_type: originalImageUrl ? 'before_after' : 'single'
  });

  // Open Twitter share...
};

// Instagram share
const handleInstagramShare = () => {
  trackSocialShare({
    platform: 'instagram',
    content_type: originalImageUrl ? 'before_after' : 'single'
  });

  // Open Instagram...
};

// Direct download from share modal
const handleShareDownload = () => {
  trackSocialShare({
    platform: 'download',
    content_type: originalImageUrl ? 'before_after' : 'single'
  });

  // Download...
};
```

**Priority**: High (social sharing is important for growth)
**Estimated Time**: 10 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\components\ShareModal.tsx`

---

### 🔄 TemplateSelector (components/TemplateSelector.tsx)
**Status**: Partial - Hook already tracks, but needs component-level tracking
**Events Needed**:
- `template_used` - When template selected

**Code to Add**:

```typescript
import { trackTemplateUsed } from '@/lib/analytics';

const handleTemplateClick = (template: Template) => {
  trackTemplateUsed(template.name, 'editor');

  // Apply template...
  onSelectTemplate(template.prompt, template.name);
};
```

**Priority**: Medium
**Estimated Time**: 3 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\components\TemplateSelector.tsx`

---

### ⏳ AuthButton (components/AuthButton.tsx)
**Status**: Todo
**Events Needed**:
- `sign_up` - When new user signs up
- `sign_in` - When existing user signs in

**Code to Add**:

```typescript
import { trackSignUp, trackSignIn } from '@/lib/analytics';
import { useEffect, useRef } from 'react';

const AuthButton = () => {
  const { user } = db.useAuth();
  const isNewUser = useRef(false);

  useEffect(() => {
    if (user) {
      // Check if this is a new user (implement your logic)
      if (isNewUser.current) {
        trackSignUp('magic_link');
      } else {
        trackSignIn('magic_link');
      }
    }
  }, [user]);

  // Rest of component...
};
```

**Priority**: High (important for conversion tracking)
**Estimated Time**: 15 minutes (need to determine new vs. returning user)
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\components\AuthButton.tsx`

**Note**: May need to add `isNewUser` flag to InstantDB user record to distinguish sign-up from sign-in.

---

### ⏳ WatermarkPreviewNotice (components/WatermarkPreviewNotice.tsx)
**Status**: Todo
**Events Needed**:
- `upgrade_click` - When user clicks upgrade from watermark notice

**Code to Add**:

```typescript
import { trackUpgradeClick } from '@/lib/analytics';

const handleUpgradeClick = () => {
  trackUpgradeClick({
    source: 'watermark_notice',
    tier_clicked: 'pro'
  });

  // Navigate to pricing...
  router.push('/pricing');
};
```

**Priority**: High (tracks upgrade intent)
**Estimated Time**: 3 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\components\WatermarkPreviewNotice.tsx`

---

## Showcase Pages

### ⏳ Showcase Gallery (app/showcase/page.tsx)
**Status**: Todo
**Events Needed**:
- `showcase_vote` - When user votes on submission

**Code to Add**:

```typescript
import { trackShowcaseVote } from '@/lib/analytics';

const handleVote = async (submissionId: string) => {
  // Track vote
  trackShowcaseVote(submissionId, 'like');

  // Submit vote to API...
  await voteOnSubmission(submissionId);
};
```

**Priority**: Medium
**Estimated Time**: 5 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\showcase\page.tsx`

---

### ⏳ Showcase Submit (app/showcase/submit/page.tsx or ShowcaseSubmitClient.tsx)
**Status**: Todo
**Events Needed**:
- `showcase_submit` - When user submits to showcase

**Code to Add**:

```typescript
import { trackShowcaseSubmit } from '@/lib/analytics';

const handleSubmit = async (formData: FormData) => {
  const description = formData.get('description') as string;
  const prompt = formData.get('prompt') as string;

  // Submit to API
  const response = await fetch('/api/showcase/submit', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    // Track successful submission
    trackShowcaseSubmit({
      has_description: !!description && description.length > 0,
      prompt_used: prompt
    });
  }
};
```

**Priority**: Medium
**Estimated Time**: 5 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\showcase\submit\ShowcaseSubmitClient.tsx`

---

## Pricing & Profile Pages

### ⏳ Pricing Page (app/pricing/page.tsx)
**Status**: Todo
**Events Needed**:
- `upgrade_click` - When user clicks pricing tiers

**Code to Add**:

```typescript
import { trackUpgradeClick } from '@/lib/analytics';

const PricingCard = ({ tier }: { tier: 'pro' | 'yearly' }) => {
  const handleClick = () => {
    trackUpgradeClick({
      source: 'pricing_page',
      tier_clicked: tier
    });

    // Handle upgrade...
  };

  return (
    <button onClick={handleClick}>
      Upgrade to {tier}
    </button>
  );
};
```

**Priority**: High (direct revenue impact)
**Estimated Time**: 5 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\pricing\page.tsx`

---

### 🔄 Profile Page (app/profile/page.tsx)
**Status**: Partial - Promo redemption tracked via `usePromoCode` hook
**Events Already Tracked**:
- `promo_code_redemption` ✅

**Events Needed**:
- `upgrade_click` - When user clicks upgrade from profile

**Code to Add**:

```typescript
import { trackUpgradeClick } from '@/lib/analytics';

const handleUpgradeFromProfile = () => {
  trackUpgradeClick({
    source: 'profile',
    tier_clicked: 'pro'
  });

  router.push('/pricing');
};
```

**Priority**: Medium
**Estimated Time**: 3 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\profile\page.tsx`

---

## Prompts Pages

### ⏳ Prompts Library (app/prompts/page.tsx)
**Status**: Todo
**Events Needed**:
- `prompt_usage` - When user copies/uses prompt

**Code to Add**:

```typescript
import { trackPromptUsage } from '@/lib/analytics';

const handlePromptCopy = (prompt: Prompt) => {
  trackPromptUsage({
    prompt_category: prompt.category,
    prompt_title: prompt.title,
    source: 'library'
  });

  // Copy to clipboard...
  navigator.clipboard.writeText(prompt.description);
};
```

**Priority**: Medium
**Estimated Time**: 5 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\prompts\page.tsx`

---

## Batch NSFW Page

### ⏳ Batch NSFW (app/batch-nsfw/page.tsx)
**Status**: Todo
**Events Needed**:
- `batch_process` - When NSFW batch starts (with is_nsfw: true)

**Code to Add**:

```typescript
import { trackBatchProcess } from '@/lib/analytics';

const handleNSFWBatchStart = (images: File[], effect: string) => {
  trackBatchProcess(
    images.length,
    effect,
    true // is_nsfw
  );

  // Process...
};
```

**Priority**: Low (feature not fully launched yet)
**Estimated Time**: 3 minutes
**Location**: `C:\Users\derek\OneDrive\Desktop\nano\app\batch-nsfw\page.tsx`

---

## Error Tracking

### Global Error Boundary
**Status**: Todo
**Events Needed**:
- `error_occurred` - When unhandled errors happen

**Code to Add**:

Create `C:\Users\derek\OneDrive\Desktop\nano\app\error.tsx`:

```typescript
'use client'

import { useEffect } from 'react';
import { trackError } from '@/lib/analytics';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Track error
    trackError({
      error_type: 'unhandled_error',
      error_message: error.message,
      page_path: window.location.pathname
    });
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Priority**: High (important for monitoring)
**Estimated Time**: 10 minutes
**Location**: New file - `C:\Users\derek\OneDrive\Desktop\nano\app\error.tsx`

---

## API Route Tracking

### ⏳ API Error Tracking
**Status**: Todo

Track errors in API routes:

```typescript
// Example: app/api/process-image/route.ts
import { trackError } from '@/lib/analytics';

export async function POST(req: Request) {
  try {
    // Process image...
  } catch (error) {
    // Log error to GA (server-side - needs different approach)
    // Consider using server-side GA4 Measurement Protocol
    console.error('API Error:', error);

    return NextResponse.json({
      error: 'Processing failed'
    }, { status: 500 });
  }
}
```

**Note**: API route tracking requires server-side GA4 Measurement Protocol API, which is more complex. Consider logging to a service like Sentry instead.

**Priority**: Low (client-side tracking covers most use cases)
**Estimated Time**: 2 hours (requires Measurement Protocol setup)

---

## Summary

### Completed (7 files)
✅ Main Editor (app/page.tsx)
✅ Canvas Page (app/canvas/page.tsx) - **Just Updated**
✅ Roulette Page (app/roulette/page.tsx) - **Just Updated**
✅ Image Tracking Hook (hooks/useImageTracking.ts)
✅ Promo Code Hook (hooks/usePromoCode.ts)
✅ Layout (app/layout.tsx)
✅ GoogleAnalytics Component (components/GoogleAnalytics.tsx)

### High Priority (5 files - ~45 minutes)
1. ⏳ ShareModal (components/ShareModal.tsx) - 10 min
2. ⏳ AuthButton (components/AuthButton.tsx) - 15 min
3. ⏳ Pricing Page (app/pricing/page.tsx) - 5 min
4. ⏳ WatermarkPreviewNotice (components/WatermarkPreviewNotice.tsx) - 3 min
5. ⏳ Error Boundary (app/error.tsx) - 10 min

### Medium Priority (9 files - ~60 minutes)
6. 🔄 Batch Page (app/batch/page.tsx) - 5 min
7. ⏳ Roast Page (app/roast/page.tsx) - 5 min
8. 🔄 TemplateSelector (components/TemplateSelector.tsx) - 3 min
9. 🔄 Profile Page (app/profile/page.tsx) - 3 min
10. ⏳ Prompts Library (app/prompts/page.tsx) - 5 min
11. ⏳ Showcase Gallery (app/showcase/page.tsx) - 5 min
12. ⏳ Showcase Submit (app/showcase/submit/ShowcaseSubmitClient.tsx) - 5 min

### Low Priority (3 files - ~20 minutes)
13. ⏳ Prompt Wizard (app/prompt-wizard/page.tsx) - 2 min
14. ⏳ Batch NSFW (app/batch-nsfw/page.tsx) - 3 min
15. ⏳ API Routes (server-side tracking) - 2 hours (complex)

**Total Estimated Time**: ~2-3 hours to complete all high/medium priority tracking

---

## Quick Implementation Guide

When adding tracking to a new file:

1. **Import the tracking function**
   ```typescript
   import { trackEventName } from '@/lib/analytics';
   ```

2. **Call it at the right time**
   ```typescript
   const handleAction = () => {
     trackEventName(params);
     // Your action logic...
   };
   ```

3. **Test in development**
   - Enable `NEXT_PUBLIC_GA_DEBUG=true`
   - Check console for: `GA Event (dev): event_name`

4. **Verify in GA4**
   - Go to Real-time view
   - Perform action
   - See event appear (5-10 second delay)

---

Last Updated: October 22, 2025
Status: 7/15 files complete (47%)
Remaining Work: 2-3 hours
