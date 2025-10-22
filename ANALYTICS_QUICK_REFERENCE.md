# Analytics Quick Reference Guide

## Common Tracking Patterns

### Track Image Transformation (Main Editor)

```typescript
import { trackImageTransformation, setUserProperties } from '@/lib/analytics';

// After successful transformation
trackImageTransformation({
  prompt_category: 'Art Styles',
  prompt_title: 'Turn into Van Gogh painting',
  locked_composition: false,
  is_nsfw: false,
  processing_time: 2500 // milliseconds
});

// Update user properties
setUserProperties({
  user_tier: 'free',
  total_transformations: 5,
  has_generated_images: true
});
```

### Track Download Button

```typescript
import { trackDownload } from '@/lib/analytics';

function DownloadButton({ imageUrl }: { imageUrl: string }) {
  const handleDownload = () => {
    // Track before download
    trackDownload('main_editor'); // or 'batch', 'roulette', 'canvas'

    // Perform download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.png';
    link.click();
  };

  return <button onClick={handleDownload}>Download</button>;
}
```

### Track Social Share

```typescript
import { trackSocialShare } from '@/lib/analytics';

// Track Twitter share
trackSocialShare({
  platform: 'twitter',
  content_type: 'before_after'
});

// Track download from share modal
trackSocialShare({
  platform: 'download',
  content_type: 'single'
});
```

### Track Batch Processing

```typescript
import { trackBatchProcess } from '@/lib/analytics';

// When batch starts
trackBatchProcess(
  25,          // image count
  'sharpen',   // effect type
  false        // is NSFW
);
```

### Track Canvas Generation

```typescript
import { trackCanvasGeneration } from '@/lib/analytics';

const handleGenerate = async () => {
  const startTime = Date.now();

  try {
    const response = await fetch('/api/generate-canvas-pollinations', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    const success = !!data.image;

    trackCanvasGeneration(
      prompt,
      '1024x1024',
      'standard',
      success
    );

  } catch (error) {
    trackCanvasGeneration(
      prompt,
      '1024x1024',
      'standard',
      false
    );
  }
};
```

### Track Roulette Spin

```typescript
import { trackRouletteSpinned } from '@/lib/analytics';

// After wheel lands
trackRouletteSpinned({
  category: 'Art Styles',
  prompt_title: 'Turn into Van Gogh painting',
  spin_number: 15,
  streak: 5
});
```

### Track Template Usage

```typescript
import { trackTemplateUsed } from '@/lib/analytics';

const handleTemplateSelect = (templateName: string) => {
  trackTemplateUsed(templateName, 'editor');

  // Apply template
  setInstructions(templatePrompt);
};
```

### Track Promo Code Redemption

```typescript
import { trackPromoCodeRedemption } from '@/lib/analytics';

// After successful redemption
trackPromoCodeRedemption({
  code_tier: 'unlimited',
  code_type: 'founder'
});
```

### Track Daily Limit Reached

```typescript
import { trackDailyLimitReached } from '@/lib/analytics';

// When user hits limit
if (usage.count >= 20) {
  trackDailyLimitReached(20, 20);

  // Show upgrade prompt
}
```

### Track Upgrade Button Click

```typescript
import { trackUpgradeClick } from '@/lib/analytics';

const handleUpgradeClick = () => {
  trackUpgradeClick({
    source: 'limit_reached',  // or 'pricing_page', 'watermark_notice'
    tier_clicked: 'pro'       // or 'yearly'
  });

  // Navigate to pricing
  router.push('/pricing');
};
```

### Track Authentication Events

```typescript
import { trackSignUp, trackSignIn } from '@/lib/analytics';

// After successful sign up
trackSignUp('magic_link');

// After successful sign in
trackSignIn('magic_link');
```

### Track Showcase Submission

```typescript
import { trackShowcaseSubmit } from '@/lib/analytics';

const handleSubmit = async (data: FormData) => {
  // Submit to API
  const response = await fetch('/api/showcase/submit', {
    method: 'POST',
    body: data
  });

  if (response.ok) {
    trackShowcaseSubmit({
      has_description: !!data.get('description'),
      prompt_used: data.get('prompt') as string
    });
  }
};
```

### Track Showcase Vote

```typescript
import { trackShowcaseVote } from '@/lib/analytics';

const handleVote = (submissionId: string) => {
  trackShowcaseVote(submissionId, 'like');

  // Update UI
};
```

### Track Favorite Prompt

```typescript
import { trackFavoritePrompt } from '@/lib/analytics';

// Add to favorites
trackFavoritePrompt(
  'Turn into Van Gogh painting',
  'Art Styles',
  'add'
);

// Remove from favorites
trackFavoritePrompt(
  'Turn into Van Gogh painting',
  'Art Styles',
  'remove'
);
```

### Track Errors

```typescript
import { trackError } from '@/lib/analytics';

try {
  await processImage();
} catch (error) {
  trackError({
    error_type: 'image_processing_failed',
    error_message: error.message,
    page_path: window.location.pathname
  });

  // Show error to user
}
```

### Set User Properties

```typescript
import { setUserProperties } from '@/lib/analytics';

// After user signs in or tier changes
setUserProperties({
  user_tier: 'pro',
  has_generated_images: true,
  total_transformations: 125,
  favorite_category: 'Art Styles',
  registration_date: '2025-10-22'
});
```

## Event Parameters Reference

### Standard Parameters

All events include:
- `event_category`: 'engagement', 'conversion', 'user', 'content', or 'error'
- `event_label`: Human-readable identifier
- `timestamp`: ISO 8601 timestamp (auto-added)

### Custom Parameters by Event

**image_transformation**:
- `prompt_category`: String (e.g., 'Art Styles')
- `prompt_title`: String (first 100 chars)
- `locked_composition`: Boolean
- `is_nsfw`: Boolean
- `processing_time_ms`: Number (optional)
- `image_size_bytes`: Number (optional)

**batch_process**:
- `image_count`: Number
- `effect_type`: String
- `is_nsfw`: Boolean

**canvas_generation**:
- `prompt_length`: Number
- `size`: String (e.g., '1024x1024')
- `quality`: String ('standard' or 'hd')
- `success`: Boolean

**roulette_spin**:
- `category`: String
- `prompt_title`: String
- `spin_number`: Number
- `streak`: Number

**promo_code_redemption**:
- `code_tier`: String ('unlimited' or 'pro')
- `code_type`: String ('founder', 'family', 'beta')
- `value`: Number (1 for conversion tracking)

**social_share**:
- `platform`: String ('twitter', 'instagram', 'tiktok', 'download')
- `content_type`: String ('single' or 'before_after')

**download_image**:
- `source`: String ('main_editor', 'batch', 'roulette', 'canvas', 'gallery')

**showcase_submit**:
- `has_description`: Boolean
- `prompt_used`: String

**favorite_prompt**:
- `action`: String ('add' or 'remove')
- `category`: String

## Testing Events

### Browser Console Testing

```javascript
// Open DevTools Console (F12)

// Test page view
gtag('event', 'page_view', { page_path: '/test' });

// Test custom event
gtag('event', 'image_transformation', {
  event_category: 'engagement',
  prompt_category: 'Art Styles',
  locked_composition: false,
  is_nsfw: false
});

// Check if gtag is loaded
console.log('gtag loaded:', typeof gtag !== 'undefined');
console.log('dataLayer:', window.dataLayer);
```

### Development Mode

Enable GA in development:

```bash
# .env.local
NEXT_PUBLIC_GA_DEBUG=true
```

Then all events will log to console:
```
GA Event (dev): image_transformation {
  event_category: 'engagement',
  prompt_category: 'Art Styles',
  ...
}
```

## GA4 Real-Time Verification

1. Go to GA4 > Reports > Real-time
2. Perform an action in your app
3. Event should appear within 5-10 seconds
4. Check event parameters by clicking the event

## Common Mistakes to Avoid

### ❌ Don't track PII
```typescript
// BAD - Contains email
trackEvent('user_action', { user_email: 'derek@example.com' });

// GOOD - Use anonymous ID
trackEvent('user_action', { user_id: 'user_abc123' });
```

### ❌ Don't track without checking window
```typescript
// BAD - Will error on server
window.gtag('event', 'my_event');

// GOOD - Use helper function
trackEvent('my_event', { ... });
```

### ❌ Don't track sensitive errors
```typescript
// BAD - API keys in error message
trackError({
  error_message: `API failed: ${apiKey}`
});

// GOOD - Generic message
trackError({
  error_message: 'API authentication failed'
});
```

### ❌ Don't forget event_category
```typescript
// BAD - Missing category
trackEvent('my_event', { custom_param: 'value' });

// GOOD - Always include category
trackEvent('my_event', {
  event_category: 'engagement',
  custom_param: 'value'
});
```

## Files Modified

If you need to add tracking to new pages, these files already have tracking implemented:

✅ `C:\Users\derek\OneDrive\Desktop\nano\app\page.tsx` - Main editor tracking
✅ `C:\Users\derek\OneDrive\Desktop\nano\hooks\useImageTracking.ts` - Image generation tracking
✅ `C:\Users\derek\OneDrive\Desktop\nano\hooks\usePromoCode.ts` - Promo code tracking
✅ `C:\Users\derek\OneDrive\Desktop\nano\app\roulette\page.tsx` - Roulette tracking (NEEDS UPDATE)
✅ `C:\Users\derek\OneDrive\Desktop\nano\app\canvas\page.tsx` - Canvas tracking (NEEDS UPDATE)

## Next Steps

To add tracking to a new feature:

1. Import tracking function from `@/lib/analytics`
2. Call function at appropriate time (button click, API success, etc.)
3. Test in development with console logging
4. Verify in GA4 Real-Time view
5. Check data in GA4 after 24-48 hours

---

Last Updated: October 22, 2025
