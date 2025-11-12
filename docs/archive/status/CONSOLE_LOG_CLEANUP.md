# Console.log Cleanup Guide

**Date:** October 21, 2025
**Status:** 233 console statements across 57 files
**Solution:** Development-aware logger utility created

---

## Problem

Found 233 `console.log/warn/error` statements across 57 files. These cause:
- Security risk (may log sensitive data in production)
- Performance impact (console operations are slow)
- Cluttered browser console in production

---

## Solution: Logger Utility

Created `lib/logger.ts` - Development-aware logging that automatically disables in production:

```typescript
import { logger } from '@/lib/logger';

// Instead of:
console.log('Processing image:', imageData);

// Use:
logger.log('Processing image:', imageData);
// Only runs in development, silent in production
```

---

## Files with Most Console.logs

**Top 10 files to migrate first:**

1. `app/page.tsx` - 24 console statements
2. `app/batch/page.tsx` - 13 console statements
3. `app/api/process-image/route.ts` - 22 console statements
4. `app/api/process-image-nsfw/route.ts` - 13 console statements
5. `app/canvas/page.tsx` - 1 console statement
6. `app/roast/page.tsx` - 2 console statements
7. `components/ShareModal.tsx` - 3 console statements
8. `lib/geminiProcessor.ts` - 1 console statement
9. `lib/imageEffects.ts` - 24 console statements
10. `lib/rateLimiter.ts` - 3 console statements

---

## Migration Strategy

### Phase 1: Critical API Routes (Priority)
Migrate these first as they run in production most:
- `app/api/process-image/route.ts`
- `app/api/process-image-nsfw/route.ts`
- `app/api/roast/route.ts`
- `app/api/generate-canvas/route.ts`

### Phase 2: Client Components
- `app/page.tsx`
- `app/batch/page.tsx`
- `components/*`

### Phase 3: Libraries
- `lib/geminiProcessor.ts`
- `lib/imageEffects.ts`
- `lib/*`

---

## Quick Migration Script

Run this find-and-replace in VS Code:

**Find (Regex):**
```
console\.(log|warn|info|debug)
```

**Replace with:**
```
logger.$1
```

**Then add import at top of file:**
```typescript
import { logger } from '@/lib/logger';
```

**Keep `console.error` as-is** - Errors should always log

---

## Manual Review Needed

Some console.logs are intentional for production:
- `app/api/process-image/route.ts` - Request logging for debugging
- Error boundaries - Should keep console.error

Review each case individually.

---

## Alternative: ESLint Rule

Add to `eslint.config.mjs`:

```javascript
rules: {
  'no-console': ['warn', {
    allow: ['error', 'warn']
  }]
}
```

This warns on console.log but allows console.error/warn.

---

## Files Affected (All 57)

1. hooks/useImageTracking.ts - 1
2. hooks/useKeyboardShortcuts.tsx - 7
3. lib/auth-options.ts - 1
4. lib/auth.ts - 6
5. components/ExportModal.tsx - 1
6. components/AuthButton.tsx - 1
7. components/BeforeAfterSlider.tsx - 1
8. components/BatchStyleGenerator.tsx - 1
9. components/PromptSubmitModal.tsx - 1
10. hooks/usePromoCode.ts - 1
11. components/TemplateSelector.tsx - 1
12. lib/exportFormats.ts - 6
13. components/ShareModal.tsx - 3
14. lib/watermark.ts - 2
15. lib/imageEffects.ts - 24
16. lib/geminiProcessor.ts - 1
17. lib/promoCodes.ts - 1
18. lib/rateLimiter.ts - 3
19. app/favorites/page.tsx - 2
20. app/examples/page.tsx - 1
21. app/dashboard/DashboardClient.tsx - 1
22. app/showcase/submit/ShowcaseSubmitClient.tsx - 1
23. app/showcase/page.tsx - 2
24. app/roulette/page.tsx - 5
25. app/components/EditorNSFW.tsx - 2
26. app/roast/page.tsx - 2
27. app/components/BatchProcessorNSFW.tsx - 9
28. app/canvas/page.tsx - 1
29. app/batch/page.tsx - 13
30. app/admin/page.tsx - 2
31. app/auth/signin/page.tsx - 1
32. app/pricing/page.tsx - 2
33. app/page.tsx - 24
34. app/my-images/page.tsx - 3
35. app/api/batch-styles/route.ts - 4
36. app/api/generate-canvas/route.ts - 5
37. app/api/generate-canvas-free/route.ts - 5
38. app/api/create-checkout-session/route.ts - 1
39. app/api/generate-caption/route.ts - 1
40. app/api/generate-canvas-hf/route.ts - 4
41. app/api/process-image-v2/route.ts - 11
42. app/api/generate-canvas-pollinations/route.ts - 3
43. app/api/process-image/route.ts - 22
44. app/api/inpaint/route.ts - 4
45. app/api/process-image-nsfw/route.ts - 13
46. app/api/test-batch/route.ts - 3
47. app/api/track-visitor/route.ts - 3
48. app/api/sample-images/route.ts - 1
49. app/api/showcase/[id]/like/route.ts - 1
50. app/api/track-share/route.ts - 2
51. app/api/webhooks/stripe/route.ts - 8
52. app/api/showcase/route.ts - 2
53. app/api/track-template/route.ts - 2
54. app/api/roast/route.ts - 2
55. app/api/vip/route.ts - 1
56. app/api/visitor-stats/route.ts - 1

---

## Recommendation

**Don't migrate all at once** - Risk of breaking functionality

**Do migrate gradually:**
1. Week 1: API routes (10 files)
2. Week 2: Main pages (5 files)
3. Week 3: Components (10 files)
4. Week 4: Libraries (5 files)

Test thoroughly after each phase.

---

## Logger Utility Documentation

**Location:** `lib/logger.ts`

**Usage:**
```typescript
import { logger } from '@/lib/logger';

// Development only
logger.log('Debug info')     // Only in dev
logger.warn('Warning')        // Only in dev
logger.info('Info message')   // Only in dev
logger.debug('Debug details') // Only in dev

// Always logs (production too)
logger.error('Critical error') // Always logs
```

**Environment Detection:**
- Uses `process.env.NODE_ENV === 'development'`
- Automatically disabled in production builds
- No configuration needed

---

*Generated during comprehensive code review - October 21, 2025*
