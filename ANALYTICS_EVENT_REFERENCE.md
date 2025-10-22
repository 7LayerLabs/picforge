# GA4 Event Reference for PicForge

Quick reference for all available analytics tracking functions. Copy/paste and customize as needed.

---

## Import Statement

```typescript
import {
  trackImageTransformation,
  trackPromptUsage,
  trackSignUp,
  trackSignIn,
  trackPromoCodeRedemption,
  trackDailyLimitReached,
  trackUpgradeClick,
  trackSocialShare,
  trackDownload,
  trackFavoritePrompt,
  trackBatchProcess,
  trackRoastGeneration,
  trackCanvasGeneration,
  trackRouletteSpinned,
  trackPromptWizardComplete,
  trackTemplateUsed,
  trackError,
  setUserProperties,
} from '@/lib/analytics'
```

---

## 1. Image Transformation (Main Editor)

**When to track:** After user successfully transforms an image

```typescript
trackImageTransformation({
  prompt_title: 'Van Gogh Style',           // or 'Custom Prompt'
  prompt_category: 'Art Styles',            // or 'custom'
  locked_composition: false,                // true if Lock Composition checked
  is_nsfw: false,                           // true for NSFW editor
  processing_time: 3500,                    // milliseconds (optional)
  image_size: 2048576                       // bytes (optional)
})
```

**Parameters:**
- `prompt_title`: Name of prompt used (or "Custom Prompt")
- `prompt_category`: Category name or "custom"
- `locked_composition`: Boolean - was Lock Composition enabled?
- `is_nsfw`: Boolean - regular editor (false) or NSFW (true)
- `processing_time`: Optional - how long transformation took (ms)
- `image_size`: Optional - size of uploaded image (bytes)

---

## 2. Prompt Usage (Library)

**When to track:** User copies a prompt from the library

```typescript
trackPromptUsage({
  prompt_category: 'Art Styles',
  prompt_title: 'Van Gogh Starry Night',
  source: 'library'                        // or 'custom', 'template', 'roulette', 'wizard'
})
```

**Parameters:**
- `prompt_category`: The category the prompt belongs to
- `prompt_title`: The specific prompt name
- `source`: Where the prompt came from
  - `'library'` - Prompt library page
  - `'custom'` - User typed it
  - `'template'` - Template selector
  - `'roulette'` - Roulette game
  - `'wizard'` - Prompt wizard

---

## 3. User Sign Up

**When to track:** New user creates account (first time)

```typescript
trackSignUp('magic_link')                  // or 'email'
```

**Parameters:**
- `method`: Authentication method used
  - `'magic_link'` - InstantDB magic link
  - `'email'` - Email/password (if you add it)

---

## 4. User Sign In

**When to track:** Returning user signs in

```typescript
trackSignIn('magic_link')                  // or 'email'
```

**Parameters:**
- Same as Sign Up

---

## 5. Promo Code Redemption

**When to track:** User successfully redeems a promo code

```typescript
trackPromoCodeRedemption({
  code_tier: 'unlimited',                  // or 'pro'
  code_type: 'founder'                     // or 'promo', 'referral', 'beta'
})
```

**Parameters:**
- `code_tier`: What tier the code unlocks
  - `'unlimited'` - Unlimited access
  - `'pro'` - Pro tier
- `code_type`: Type of code
  - `'founder'` - Founder codes
  - `'promo'` - Promotional codes
  - `'referral'` - Referral rewards
  - `'beta'` - Beta tester codes

---

## 6. Daily Limit Reached

**When to track:** User hits their free tier daily limit

```typescript
trackDailyLimitReached(
  18,                                      // current count
  20                                       // max limit
)
```

**Parameters:**
- `currentCount`: How many images they've generated today
- `limit`: Their daily limit (20 for free tier)

---

## 7. Upgrade Button Click

**When to track:** User clicks any upgrade/pricing CTA

```typescript
trackUpgradeClick({
  source: 'pricing_page',                  // where the button is
  tier_clicked: 'pro'                      // which tier they clicked
})
```

**Parameters:**
- `source`: Where the CTA is located
  - `'pricing_page'` - Main pricing page
  - `'limit_reached'` - Modal when limit hit
  - `'profile'` - Profile page
  - `'watermark_notice'` - Watermark upgrade prompt
- `tier_clicked`: Which plan
  - `'pro'` - Monthly pro plan
  - `'yearly'` - Yearly plan

---

## 8. Social Share

**When to track:** User shares an image (already implemented in ShareModal)

```typescript
trackSocialShare({
  platform: 'twitter',                     // or 'instagram', 'tiktok', 'download'
  content_type: 'single'                   // or 'before_after'
})
```

**Parameters:**
- `platform`: Where they're sharing
  - `'twitter'`
  - `'instagram'`
  - `'tiktok'`
  - `'download'` - Downloaded to device
- `content_type`: What they're sharing
  - `'single'` - Just the transformed image
  - `'before_after'` - Before/after comparison

---

## 9. Image Download

**When to track:** User downloads an image

```typescript
trackDownload('main_editor')               // or 'batch', 'share_modal', 'gallery'
```

**Parameters:**
- `source`: Where the download happened
  - `'main_editor'` - Main transformation page
  - `'batch'` - Batch processor
  - `'share_modal'` - Share modal download
  - `'gallery'` - From image gallery/history

---

## 10. Favorite Prompt

**When to track:** User favorites or unfavorites a prompt

```typescript
trackFavoritePrompt(
  'Van Gogh Starry Night',                 // prompt title
  'Art Styles',                            // category
  'add'                                    // or 'remove'
)
```

**Parameters:**
- `promptTitle`: Name of the prompt
- `category`: Category it belongs to
- `action`: What happened
  - `'add'` - Added to favorites
  - `'remove'` - Removed from favorites

---

## 11. Batch Processing

**When to track:** Batch processing completes

```typescript
trackBatchProcess(
  25,                                      // number of images
  'grayscale',                             // effect applied
  false                                    // is NSFW?
)
```

**Parameters:**
- `imageCount`: How many images were processed
- `effectType`: Name of effect/prompt used
- `isNSFW`: Boolean - regular batch (false) or NSFW batch (true)

---

## 12. Roast Generation

**When to track:** User generates a photo roast

```typescript
trackRoastGeneration('spicy')              // or 'mild', 'nuclear'
```

**Parameters:**
- `intensity`: Roast intensity level
  - `'mild'` - Gentle roast
  - `'spicy'` - Medium roast
  - `'nuclear'` - Brutal roast

---

## 13. Canvas Generation (AI Image from Text)

**When to track:** User generates image from text prompt

```typescript
trackCanvasGeneration(
  'A serene mountain landscape',           // prompt text
  '1024x1024',                             // image size
  'standard',                              // quality
  true                                     // success/failure
)
```

**Parameters:**
- `prompt`: The text prompt used
- `size`: Image dimensions
  - `'1024x1024'` - Square
  - `'1792x1024'` - Landscape
  - `'1024x1792'` - Portrait
- `quality`: Generation quality
  - `'standard'` - Normal quality
  - `'hd'` - High definition
- `success`: Boolean - did it work?

---

## 14. Transform Roulette

**When to track:** User spins the roulette wheel

```typescript
trackRouletteSpinned(
  'Art Styles',                            // category selected
  'Van Gogh Starry Night'                  // prompt that came up
)
```

**Parameters:**
- `category`: Which category they spun
- `promptTitle`: Which prompt was randomly selected

---

## 15. Prompt Wizard Complete

**When to track:** User completes the prompt wizard

```typescript
trackPromptWizardComplete(
  5,                                       // steps completed
  127                                      // final prompt length
)
```

**Parameters:**
- `steps_completed`: How many wizard steps they finished
- `final_prompt_length`: Character count of final prompt

---

## 16. Template Used

**When to track:** User applies a template from template selector

```typescript
trackTemplateUsed('Professional Headshot') // template name
```

**Parameters:**
- `templateName`: Name of the template applied

---

## 17. Error Tracking

**When to track:** When errors occur (optional but recommended)

```typescript
trackError({
  error_type: 'API_FAILURE',               // type of error
  error_message: 'Rate limit exceeded',    // error message
  page_path: '/batch'                      // where it happened
})
```

**Parameters:**
- `error_type`: Category of error
  - `'API_FAILURE'` - API call failed
  - `'UPLOAD_ERROR'` - Image upload failed
  - `'PROCESSING_ERROR'` - Transformation failed
  - `'NETWORK_ERROR'` - Network issue
- `error_message`: The actual error message
- `page_path`: Which page user was on

---

## 18. Set User Properties (Segmentation)

**When to track:** When user tier changes or significant milestones

```typescript
setUserProperties({
  user_tier: 'pro',                        // or 'free', 'unlimited'
  has_generated_images: true,
  total_transformations: 42,
  favorite_category: 'Art Styles'
})
```

**Properties:**
- `user_tier`: Their subscription level
- `has_generated_images`: Have they used the app?
- `total_transformations`: Total images created
- `favorite_category`: Most-used prompt category

**Use this for:**
- User segmentation in GA4 reports
- Comparing behavior between free vs. pro users
- Understanding power users vs. casual users

---

## Common Patterns

### Pattern 1: Always Wrap in Try/Catch

```typescript
try {
  trackImageTransformation({ ... })
} catch (error) {
  console.error('GA tracking failed:', error)
  // Don't break the app if analytics fail
}
```

### Pattern 2: Track Success AND Failure

```typescript
try {
  const result = await processImage()
  trackCanvasGeneration(prompt, size, quality, true)  // success
  return result
} catch (error) {
  trackCanvasGeneration(prompt, size, quality, false) // failure
  throw error
}
```

### Pattern 3: Track with Timestamps

```typescript
const startTime = Date.now()

// ... do processing ...

const processingTime = Date.now() - startTime
trackImageTransformation({
  ...,
  processing_time: processingTime
})
```

### Pattern 4: Track User Journey

```typescript
// Step 1: User uploads image
trackEvent('image_upload', { source: 'drag_drop' })

// Step 2: User selects prompt
trackPromptUsage({ ... })

// Step 3: User transforms
trackImageTransformation({ ... })

// Step 4: User downloads
trackDownload('main_editor')
```

---

## Testing Events

### Development Mode

```bash
# .env.local
NEXT_PUBLIC_GA_DEBUG=true
```

Console output:
```
GA Event (dev): image_transformation { prompt_category: 'Art Styles', ... }
```

### Production Mode

1. Open DevTools → Network tab
2. Filter by "collect"
3. Trigger event
4. See POST to `google-analytics.com/g/collect`

### Real-Time Reports

1. Go to GA4 dashboard
2. Reports → Realtime
3. See events within 10-30 seconds

---

## Event Naming Conventions

All events use:
- **Lowercase with underscores**: `image_transformation` (NOT `imageTransformation`)
- **Descriptive names**: `prompt_usage` (NOT `prompt_click`)
- **Consistent structure**: `{action}_{object}` or `{object}_{action}`

Examples:
- `image_transformation` - User transformed image
- `prompt_usage` - User used a prompt
- `social_share` - User shared content
- `upgrade_click` - User clicked upgrade

---

## Custom Events (Not Pre-Built)

Need to track something custom? Use the generic `trackEvent`:

```typescript
import { trackEvent } from '@/lib/analytics'

trackEvent('custom_event_name', {
  custom_param_1: 'value',
  custom_param_2: 123,
  custom_param_3: true
})
```

**Examples:**

```typescript
// Track keyboard shortcuts
trackEvent('keyboard_shortcut_used', {
  shortcut: 'Ctrl+S',
  action: 'save'
})

// Track tutorial completion
trackEvent('tutorial_completed', {
  tutorial_name: 'First Transformation',
  time_spent: 180
})

// Track feature discovery
trackEvent('feature_discovered', {
  feature_name: 'Lock Composition',
  discovery_method: 'tooltip'
})
```

---

## GA4 Dashboard Setup

Once events are flowing, create these reports:

### Popular Prompts Report
- Dimension: `prompt_title`
- Metric: Event count
- Filter: `event_name = prompt_usage`
- Sort: Descending by count

### Conversion Funnel
1. `page_view` → Home page
2. `image_upload` → User uploads
3. `image_transformation` → User transforms
4. `download_image` → User downloads
5. Shows drop-off at each stage

### Power Users Report
- Dimension: `user_tier`
- Metrics:
  - Total transformations
  - Average session duration
  - Pages per session
- Compare free vs. pro behavior

### Upgrade Attribution
- Dimension: `source` (from upgrade_click)
- Metric: Event count
- Shows which CTAs drive upgrades

---

## Summary

**18 pre-built tracking functions** covering:
- Core features (transformations, batch, canvas)
- User journey (sign up, upgrades, limits)
- Engagement (shares, downloads, favorites)
- Gamification (roulette, roast, wizard)

**All functions are type-safe** with proper TypeScript interfaces.

**All functions are non-blocking** - wrapped in try/catch so analytics never breaks your app.

**All functions log to console in dev mode** for easy debugging.

---

**Next steps:**
1. Pick the events most important to you
2. Add tracking calls where those actions happen
3. Test in dev mode (check console)
4. Deploy to production
5. Watch data flow in GA4 Realtime reports
6. Create custom dashboards for your KPIs

**Pro tip:** Start with the highest-value events first:
1. `trackImageTransformation` - Core feature usage
2. `trackUpgradeClick` - Revenue driver
3. `trackBatchProcess` - Feature adoption
4. `trackPromptUsage` - Content performance
