# GA4 Integration Guide: Add Tracking in 6 Key Files

**Time Estimate:** 2-3 hours
**Difficulty:** Easy (copy/paste + small tweaks)

This guide shows you EXACTLY where to add tracking code in each file. All functions are ready - you just need to import and call them.

---

## Prerequisites

1. Add to Vercel Environment Variables:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
   ```
   (Get this from https://analytics.google.com)

2. Redeploy your app after adding the env variable

---

## File 1: Main Editor - Image Transformations

**File:** `C:\Users\derek\OneDrive\Desktop\nano\app\page.tsx`

### Step 1: Add Import (Top of File)

Find the imports section and add:

```typescript
import { trackImageTransformation } from '@/lib/analytics'
```

### Step 2: Add Tracking Call (Inside handleSubmit Function)

Find the section where the image is successfully processed (around line 565, after `trackImageGeneration`). Add this right after the InstantDB tracking:

```typescript
// After this block:
try {
  await trackImageGeneration({
    prompt: instructions,
    originalUrl: originalImage || currentImage || '',
    transformedUrl: result || '',
    locked: lockComposition,
  })
} catch (trackingError) {
  console.error('Failed to track image generation (non-critical):', trackingError);
}

// ADD THIS NEW BLOCK:
// Track in Google Analytics
try {
  trackImageTransformation({
    prompt_title: promptOfDayActive ? dailyPrompt.title : 'Custom Prompt',
    prompt_category: promptOfDayActive ? dailyPrompt.category : 'custom',
    locked_composition: lockComposition,
    is_nsfw: false,
    processing_time: Date.now() - processingStartTime,
    image_size: selectedFile?.size
  })
} catch (analyticsError) {
  console.error('GA tracking failed (non-critical):', analyticsError);
}
```

### Step 3: Track Processing Start Time

Add this variable at the top of `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const processingStartTime = Date.now() // ADD THIS LINE

  // ... rest of function
```

---

## File 2: Batch Processor

**File:** `C:\Users\derek\OneDrive\Desktop\nano\app\batch\page.tsx`

### Step 1: Add Import (Top of File)

```typescript
import { trackBatchProcess } from '@/lib/analytics'
```

### Step 2: Add Tracking Call (After Batch Completes)

Find the `processImages` function. Add tracking when all images are done processing.

Look for where `setIsProcessing(false)` is called (around line 280). Add this right before:

```typescript
// Track batch completion in Google Analytics
try {
  const completedImages = images.filter(img => img.status === 'completed').length
  trackBatchProcess(
    completedImages,
    prompt || 'effect applied',
    false // isNSFW (always false for regular batch)
  )
} catch (error) {
  console.error('GA tracking failed (non-critical):', error);
}

setIsProcessing(false) // Existing line
```

---

## File 3: Pricing Page - Upgrade Clicks

**File:** `C:\Users\derek\OneDrive\Desktop\nano\app\pricing\page.tsx`

### Step 1: Add Import (Top of File)

```typescript
import { trackUpgradeClick } from '@/lib/analytics'
```

### Step 2: Add Tracking to Button Clicks

Find the "Get Started" / "Choose Pro" / "Choose Yearly" buttons. Wrap their `onClick` or add a new one:

**For Pro Monthly Button:**
```typescript
<button
  onClick={() => {
    trackUpgradeClick({
      source: 'pricing_page',
      tier_clicked: 'pro'
    })
    window.open('https://your-stripe-link-for-pro', '_blank')
  }}
  className="..."
>
  Choose Pro
</button>
```

**For Yearly Plan Button:**
```typescript
<button
  onClick={() => {
    trackUpgradeClick({
      source: 'pricing_page',
      tier_clicked: 'yearly'
    })
    window.open('https://your-stripe-link-for-yearly', '_blank')
  }}
  className="..."
>
  Choose Yearly
</button>
```

**For "Upgrade Now" links from limit-reached modals:**
```typescript
<Link
  href="/pricing"
  onClick={() => {
    trackUpgradeClick({
      source: 'limit_reached',
      tier_clicked: 'pro'
    })
  }}
>
  Upgrade Now
</Link>
```

---

## File 4: Canvas (AI Generation)

**File:** `C:\Users\derek\OneDrive\Desktop\nano\app\canvas\page.tsx`

### Step 1: Add Import (Top of File)

```typescript
import { trackCanvasGeneration } from '@/lib/analytics'
```

### Step 2: Add Tracking After Generation

Find the function that generates images (probably `generateImage` or similar). After successful generation:

```typescript
// After successful image generation
try {
  trackCanvasGeneration(
    canvasPrompt,
    canvasSize,
    canvasQuality,
    true // success
  )
} catch (error) {
  console.error('GA tracking failed:', error);
}

// If generation fails, track that too:
catch (error) {
  trackCanvasGeneration(
    canvasPrompt,
    canvasSize,
    canvasQuality,
    false // failed
  )
  throw error
}
```

---

## File 5: Prompt Library

**File:** `C:\Users\derek\OneDrive\Desktop\nano\components\PromptCard.tsx`

### Step 1: Add Import (Top of File)

```typescript
import { trackPromptUsage, trackFavoritePrompt } from '@/lib/analytics'
```

### Step 2: Add Tracking to Copy Function

Find `handleCopy` function (around line 39). Add tracking at the end:

```typescript
const handleCopy = () => {
  const fullPrompt = `${prompt.title}\n\nSubject: ${prompt.subject}\nMood: ${prompt.mood}\nComposition: ${prompt.composition}${prompt.equipment ? `\nEquipment: ${prompt.equipment}` : ''}${prompt.platform ? `\nPlatform: ${prompt.platform}` : ''}\n\n${prompt.description}`;

  navigator.clipboard.writeText(fullPrompt);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);

  // ADD THIS:
  // Track prompt usage in Google Analytics
  try {
    trackPromptUsage({
      prompt_category: prompt.category,
      prompt_title: prompt.title,
      source: 'library'
    })
  } catch (error) {
    console.error('GA tracking failed:', error);
  }
};
```

### Step 3: Add Tracking to Favorite Toggle

Find `handleFavorite` function (around line 47). Add tracking when user favorites/unfavorites:

```typescript
const handleFavorite = async () => {
  if (user) {
    // User is logged in - use InstantDB
    if (isFavorited && favoriteId) {
      // Remove from favorites
      const result = await removeFavorite(favoriteId);
      if (result.success) {
        setIsFavorited(false);
        setFavoriteId(null);

        // ADD THIS:
        trackFavoritePrompt(prompt.title, prompt.category, 'remove')
      }
    } else {
      // Add to InstantDB favorites
      const result = await saveFavorite(prompt.description, prompt.category);
      if (result.success) {
        setIsFavorited(true);

        // ADD THIS:
        trackFavoritePrompt(prompt.title, prompt.category, 'add')
      }
    }
  } else {
    // Not logged in - use localStorage
    const localFavorites = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');

    if (isFavorited) {
      const updated = localFavorites.filter((fav: Prompt) => fav.id !== prompt.id);
      localStorage.setItem('favoritePrompts', JSON.stringify(updated));
      setIsFavorited(false);

      // ADD THIS:
      trackFavoritePrompt(prompt.title, prompt.category, 'remove')
    } else {
      localFavorites.push(prompt);
      localStorage.setItem('favoritePrompts', JSON.stringify(localFavorites));
      setIsFavorited(true);

      // ADD THIS:
      trackFavoritePrompt(prompt.title, prompt.category, 'add')
    }
  }
};
```

---

## File 6: Transform Roulette

**File:** `C:\Users\derek\OneDrive\Desktop\nano\app\roulette\page.tsx`

### Step 1: Add Import (Top of File)

```typescript
import { trackRouletteSpinned } from '@/lib/analytics'
```

### Step 2: Add Tracking After Spin

Find the function that handles the spin (probably `spinWheel` or `handleSpin`). After a prompt is selected:

```typescript
// After prompt is selected from spin
const selectedPrompt = prompts[randomIndex]

// ADD THIS:
try {
  trackRouletteSpinned(
    selectedCategory,
    selectedPrompt.title
  )
} catch (error) {
  console.error('GA tracking failed:', error);
}
```

---

## Optional: Additional Tracking Points

### Roast Mode
**File:** `app/roast/page.tsx`

```typescript
import { trackRoastGeneration } from '@/lib/analytics'

// When user generates a roast
trackRoastGeneration(intensity) // 'mild', 'spicy', or 'nuclear'
```

### Prompt Wizard
**File:** `app/prompt-wizard/page.tsx`

```typescript
import { trackPromptWizardComplete } from '@/lib/analytics'

// When user completes all wizard steps
trackPromptWizardComplete(
  stepsCompleted,
  finalPrompt.length
)
```

### Download Tracking
**Files:** Anywhere users can download images

```typescript
import { trackDownload } from '@/lib/analytics'

// On download button click
trackDownload('main_editor') // or 'batch', 'share_modal', 'gallery'
```

### Authentication Events
**File:** `components/AuthButton.tsx`

```typescript
import { trackSignUp, trackSignIn } from '@/lib/analytics'

// When user signs up (first time)
trackSignUp('magic_link')

// When user signs in (returning)
trackSignIn('magic_link')
```

### Promo Code Redemption
**File:** `hooks/usePromoCode.ts`

```typescript
import { trackPromoCodeRedemption } from '@/lib/analytics'

// After successful redemption
trackPromoCodeRedemption({
  code_tier: 'unlimited', // or 'pro'
  code_type: 'founder' // or 'promo', 'referral', etc.
})
```

### Daily Limit Reached
**Files:** Anywhere user hits their daily limit

```typescript
import { trackDailyLimitReached } from '@/lib/analytics'

// When user hits limit
if (hasReachedLimit()) {
  trackDailyLimitReached(currentCount, maxLimit)
}
```

---

## Testing Your Implementation

### 1. Development Mode

Add to `.env.local`:
```
NEXT_PUBLIC_GA_DEBUG=true
```

Check browser console. You should see:
```
GA Event (dev): image_transformation { prompt_category: 'Art Styles', ... }
```

### 2. Production Testing

1. Deploy to Vercel with `NEXT_PUBLIC_GA_MEASUREMENT_ID` set
2. Open site in incognito window
3. Open DevTools → Network tab
4. Filter by "collect"
5. Transform an image
6. You should see POST requests to `google-analytics.com/g/collect`

### 3. Real-Time Reports

1. Go to GA4 dashboard: https://analytics.google.com
2. Reports → Realtime
3. Perform actions on your site
4. See events appear within 10-30 seconds

---

## Common Patterns

### Pattern 1: Try/Catch Wrapper
Always wrap tracking in try/catch so analytics failures don't break functionality:

```typescript
try {
  trackImageTransformation({ ... })
} catch (error) {
  console.error('GA tracking failed (non-critical):', error);
}
```

### Pattern 2: Track Success AND Failure
Track both outcomes for complete visibility:

```typescript
try {
  const result = await processImage()
  trackEvent('image_transformation', { success: true })
} catch (error) {
  trackEvent('image_transformation', { success: false, error: error.message })
  throw error
}
```

### Pattern 3: Conditional Tracking
Only track when user takes a specific action:

```typescript
if (userClickedButton) {
  trackUpgradeClick({ source: 'pricing_page', tier_clicked: 'pro' })
}
```

---

## Troubleshooting

### "window.gtag is not defined"
- Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in Vercel
- Verify you redeployed after adding the env variable
- Check `app/layout.tsx` has `<GoogleAnalytics />` component

### Events not showing in GA4
- Wait 24-48 hours for non-realtime reports to populate
- Use Realtime reports for immediate feedback
- Check you're testing in production, not localhost
- Disable ad blockers and privacy extensions

### Tracking calls but no data
- Verify Measurement ID format: `G-XXXXXXXXXX`
- Check GA4 property isn't filtering your IP
- Make sure data retention is enabled in GA4 settings

---

## What Data You'll Get

Once tracking is live, you'll be able to answer questions like:

**User Behavior:**
- What prompts are most popular?
- Do users prefer Prompt of the Day or custom prompts?
- How many users hit their daily limit?
- What percentage of users favorite prompts?

**Conversion Funnel:**
- How many visitors upload an image?
- What percentage transform vs. just browse?
- Where do users drop off?
- Which CTAs drive the most upgrades?

**Feature Usage:**
- Is batch processing or single editor more popular?
- Are gamification features (roulette, roast) engaging?
- Do users use Lock Composition feature?
- Which social platforms get the most shares?

**Business Metrics:**
- What's the conversion rate from free to pro?
- Which upgrade CTA performs best?
- How many daily active users?
- What's the average session duration?

---

## Quick Start Checklist

- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel
- [ ] Redeploy app
- [ ] Add tracking to main editor (File 1)
- [ ] Add tracking to batch processor (File 2)
- [ ] Add tracking to pricing page (File 3)
- [ ] Test in production with Realtime reports
- [ ] Add canvas tracking (File 4)
- [ ] Add prompt library tracking (File 5)
- [ ] Add roulette tracking (File 6)
- [ ] Set up custom GA4 dashboards
- [ ] Create conversion goals

---

## Summary

All the hard work is done - the tracking infrastructure is built and ready. You just need to:

1. **Import** the tracking function at the top of each file
2. **Call** the function at the right moment (after action completes)
3. **Wrap** in try/catch to prevent analytics from breaking features

**Time investment:** 2-3 hours
**Value returned:** Complete visibility into user behavior and business metrics

Start with Files 1-3 (main editor, batch, pricing) for maximum impact.

---

**Need help?** Check `lib/analytics.ts` for all available functions and their parameters.
