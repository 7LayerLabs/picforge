# Analytics Quick Reference Guide

Quick cheat sheet for implementing analytics tracking in PicForge components.

## Import Events

```typescript
import {
  trackImageTransformation,
  trackPromptUsage,
  trackSignUp,
  trackPromoCodeRedemption,
  trackSocialShare,
  trackDownload,
  trackFavoritePrompt,
  trackPromptSearch,
  trackFilterUsage,
  trackButtonClick,
  trackModalOpen,
  trackBatchProcess,
  trackRouletteSpinned,
  trackCanvasGeneration,
  trackShowcaseSubmit,
  trackError,
  setUserProperties,
} from '@/lib/analytics';
```

## Common Use Cases

### Track Image Transformation
```typescript
// When user transforms an image
trackImageTransformation({
  prompt_category: 'Art Styles',
  prompt_title: 'Van Gogh Painting',
  locked_composition: isLocked,
  is_nsfw: false,
  processing_time: endTime - startTime,
  image_size: imageFile.size,
});
```

### Track Button Click
```typescript
// On button click
<button onClick={() => {
  trackButtonClick('transform_image', 'main_editor');
  handleTransform();
}}>
  Transform
</button>
```

### Track Modal Open
```typescript
// When opening a modal
const openShareModal = () => {
  trackModalOpen('share_modal', 'gallery');
  setIsOpen(true);
};
```

### Track Search
```typescript
// When user searches prompts
const handleSearch = (query: string) => {
  const results = filterPrompts(query);
  trackPromptSearch(query, results.length);
  setSearchResults(results);
};
```

### Track Download
```typescript
// When user downloads image
const handleDownload = () => {
  trackDownload('main_editor');
  downloadImage();
};
```

### Track Form Submission
```typescript
// When submitting a form
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    trackFormSubmission('contact_form', true);
  } catch (error) {
    trackFormSubmission('contact_form', false, error.message);
  }
};
```

### Set User Properties
```typescript
// After user signs up or tier changes
useEffect(() => {
  if (user) {
    setUserProperties({
      user_tier: user.tier,
      has_generated_images: imageHistory.length > 0,
      total_transformations: imageHistory.length,
      favorite_category: getMostUsedCategory(),
      registration_date: user.createdAt,
    });
  }
}, [user, imageHistory]);
```

### Track Errors
```typescript
// In error boundaries or catch blocks
try {
  await processImage();
} catch (error) {
  trackError({
    error_type: 'image_processing_error',
    error_message: error.message,
    page_path: window.location.pathname,
  });
  showError(error);
}
```

## Event Categories

All events use these categories:

- **engagement**: User interactions (clicks, searches, filters)
- **conversion**: High-value actions (signups, upgrades)
- **user**: User-related events (login, preferences)
- **content**: Content interactions (prompts, templates)
- **error**: Error tracking and monitoring

## Testing

### Development Mode
```bash
# Enable GA4 in dev
NEXT_PUBLIC_GA_DEBUG=true npm run dev

# Check console for event logs
# Events log as: "GA Event (dev): event_name { params }"
```

### Production Testing
1. Open GA4 Realtime report
2. Perform action on site
3. Check Realtime for event (30-60 second delay)

## Custom Dimensions

Track these parameters as custom dimensions in GA4:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_tier` | User | free/pro/unlimited |
| `prompt_category` | Event | Prompt category used |
| `platform` | Event | Social share platform |
| `is_nsfw` | Event | NSFW content flag |
| `locked_composition` | Event | Lock composition enabled |

## Conversion Events

Mark these as conversions in GA4:

- `sign_up` - User creates account
- `promo_code_redemption` - User upgrades
- `referral_signup` - Referral conversion
- `upgrade_click` - Upgrade intent
- `showcase_submit` - User shares creation

## Best Practices

1. **Always track user actions**, not just page views
2. **Include context** - add relevant parameters
3. **Be consistent** - use existing event names
4. **Test locally** - enable GA_DEBUG mode
5. **Don't track PII** - no emails, names, etc.

## Common Patterns

### Track User Journey
```typescript
// Landing
trackPageView('/');

// Interaction
trackPromptUsage({ /* ... */ });

// Transformation
trackImageTransformation({ /* ... */ });

// Share
trackSocialShare({ /* ... */ });

// Conversion
trackSignUp('magic_link');
```

### Track Feature Usage
```typescript
// Feature discovery
trackButtonClick('try_batch_processing', 'homepage');

// Feature use
trackBatchProcess(10, 'sharpen', false);

// Feature completion
trackDownload('batch');
```

### Track Conversion Funnel
```typescript
// 1. Visit pricing page
trackPageView('/pricing');

// 2. Click upgrade
trackButtonClick('upgrade_pro', 'pricing_page');

// 3. Hit daily limit
trackDailyLimitReached(20, 20);

// 4. Upgrade click
trackUpgradeClick({ source: 'limit_reached', tier_clicked: 'pro' });

// 5. Complete signup
trackSignUp('magic_link');

// 6. Redeem code
trackPromoCodeRedemption({ code_tier: 'unlimited', code_type: 'promo' });
```

## Environment Setup

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code_here
NEXT_PUBLIC_GA_DEBUG=false  # Enable for local testing
```

## Quick Troubleshooting

**Events not appearing?**
- Check measurement ID is correct (G-XXXXXXXXXX)
- Wait 30-60 seconds for Realtime report
- Disable ad blockers
- Check browser console for errors

**Can't see custom dimensions?**
- Create them in GA4 Configure → Custom definitions
- Wait 24 hours after creation
- Must have at least 10 events with that parameter

**Conversions not tracking?**
- Mark event as conversion in GA4
- Check event name is exact match
- Verify conversion value is set

---

For complete documentation, see: `docs/ANALYTICS_SETUP.md`
