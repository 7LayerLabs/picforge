# Integration Guide - UI Polish Components

This guide shows you how to integrate the new polished components into PicForge.

---

## 1. Add BeforeAfterGallery to Homepage

**File**: `app/page.tsx`

**Where**: Between the hero section and upload form (when no image is uploaded)

**Code**:
```tsx
import BeforeAfterGallery from '@/components/BeforeAfterGallery'

// Inside the component, after the hero section (around line 875):
{!currentImage && (
  <>
    {/* Hero Section - existing code */}
    <div className="text-center mb-8 px-4 pt-8">
      {/* ... existing hero content ... */}
    </div>

    {/* NEW: Before/After Gallery */}
    <div className="px-4 pb-8 mb-8">
      <BeforeAfterGallery />
    </div>

    {/* Upload Section - existing code */}
    <div className="px-4 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ... existing upload form ... */}
      </div>
    </div>
  </>
)}
```

---

## 2. Add FeaturedShowcase to Homepage

**File**: `app/page.tsx`

**Where**: Below the BeforeAfterGallery, above the upload form

**Code**:
```tsx
import FeaturedShowcase from '@/components/FeaturedShowcase'

// Add after BeforeAfterGallery:
{!currentImage && (
  <>
    {/* BeforeAfterGallery - from step 1 */}
    <div className="px-4 pb-8 mb-8">
      <BeforeAfterGallery />
    </div>

    {/* NEW: Featured Showcase */}
    <div className="px-4 pb-8 mb-8">
      <FeaturedShowcase variant="compact" />
    </div>

    {/* Upload Section */}
    <div className="px-4 pb-8">
      {/* ... existing upload form ... */}
    </div>
  </>
)}
```

---

## 3. Add WatermarkPreviewNotice to Editor

**File**: `app/page.tsx`

**Where**: Inside the editing form, above the instructions textarea

**Code**:
```tsx
import WatermarkPreviewNotice from '@/components/WatermarkPreviewNotice'
import { useImageTracking } from '@/hooks/useImageTracking'

// Get user tier from existing hook:
const { user, usage } = useImageTracking()

// Inside the form section (around line 1252):
<form onSubmit={handleSubmit} className="w-full space-y-2 sm:space-y-3">
  {/* NEW: Watermark Preview Notice (for free tier users) */}
  {user && usage?.tier === 'free' && (
    <WatermarkPreviewNotice
      tier={usage.tier}
      currentImage={currentImage}
    />
  )}

  {/* Existing form fields */}
  <div className="relative">
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Editing Instructions
      </label>
      {/* ... existing code ... */}
    </div>
    <textarea
      value={instructions}
      onChange={(e) => setInstructions(e.target.value)}
      // ... rest of textarea props
    />
  </div>

  {/* ... rest of form ... */}
</form>
```

---

## 4. Example Images Setup

Ensure these example images exist in `/public/examples/`:

### Required for BeforeAfterGallery:
```
/public/examples/
  ├── elon.jpg (original portrait)
  ├── elon_sketch.png (ballpoint sketch version)
  ├── sidney.webp (original portrait)
  ├── sidney_sketch.png (ballpoint sketch version)
  ├── derek.jpg (original portrait)
  ├── derek_zombie.png (zombie transformation)
  ├── derek_cyberpunk.png (cyberpunk style)
  ├── product_before.jpg (product photo)
  ├── product_after.png (studio lighting version)
  ├── landscape_day.jpg (daytime landscape)
  ├── landscape_sunset.png (golden hour version)
  ├── portrait.jpg (original portrait)
  ├── portrait_oil.png (oil painting style)
  ├── dog.jpg (pet photo)
  └── dog_anime.png (anime style version)
```

### Fallback
If example images don't exist yet, the components will gracefully handle missing images:
- **BeforeAfterGallery**: Will show placeholder or skip items
- **PromptCard**: Will only show thumbnails for items with valid image paths

---

## 5. InstantDB Client-Side Queries

The featured showcase uses InstantDB client-side queries for real-time updates:

### How It Works
- `FeaturedShowcase.tsx` uses `db.useQuery()` hook
- Queries both `showcaseSubmissions` and `showcaseLikes`
- Client-side filtering for featured items
- Client-side trending algorithm (last 7 days)
- Real-time updates when data changes

### Mark as Featured (Admin)
Use InstantDB dashboard or create admin UI:
```typescript
// In admin panel
await db.transact([
  db.tx.showcaseSubmissions[showcaseId].update({
    featured: true
  })
]);
```

**Benefits:**
- Real-time updates (no API polling needed)
- Reduced server load (client-side filtering)
- Simpler codebase (no API route required)
- Instant sync across all connected clients

---

## 6. InstantDB Schema Check

Verify your InstantDB schema includes these entities:

```typescript
// lib/instantdb.ts
type Schema = {
  showcaseSubmissions: {
    id: string;
    featured: boolean;  // ✅ Required for featured system
    timestamp: number;
    // ... other fields
  };
  showcaseLikes: {
    id: string;
    showcaseId: string;
    userId: string;
    timestamp: number;  // ✅ Required for trending algorithm
  };
  // ... other entities
}
```

If missing, add them to your InstantDB app schema via dashboard.

---

## 7. Mobile Testing Checklist

After integration, test on mobile:

### BeforeAfterGallery
- [ ] Grid view shows 2 columns on mobile
- [ ] Slider view is swipeable
- [ ] Hover effects work as tap on touch devices
- [ ] Images load quickly with lazy loading
- [ ] CTA buttons are easily tappable (44px min)

### FeaturedShowcase
- [ ] Tabs switch smoothly
- [ ] Cards are tappable without accidental activation
- [ ] Images display correctly in grid
- [ ] Badges don't overlap content
- [ ] "View All" button is prominent

### WatermarkPreviewNotice
- [ ] Notice card is readable on small screens
- [ ] Preview toggle button is easily tappable
- [ ] Preview image fits screen width
- [ ] Upgrade CTA is visible without scrolling
- [ ] Gradient backgrounds render smoothly

---

## 8. Performance Optimization

### Image Optimization
All components use Next.js Image component with:
- Lazy loading enabled
- Responsive sizes specified
- Quality set to 75-80%
- WebP/AVIF automatic conversion

### Code Splitting
Components are client-side only ('use client'):
- Keeps initial page load fast
- Progressive enhancement for interactions
- No SSR performance impact

### Caching
- API responses cache for 5 minutes
- Featured/trending updates every 15 minutes
- Local state management for UI interactions

---

## 9. Styling Consistency

All components follow PicForge design system:

### Colors Used
```css
--teal-500: #14B8A6  /* Primary actions */
--purple-500: #A855F7 /* Premium features */
--blue-500: #3B82F6   /* Secondary accents */
--coral-500: #FF6B6B  /* Favorites/likes */
--gray-900: #111827   /* Dark text */
```

### Typography
- Headings: `font-heading` with bold weight
- Body: `font-body` with normal weight
- Technical: `font-mono` for prompts

### Spacing
- Cards: `p-6` (24px padding)
- Gaps: `gap-4` or `gap-6` (16px or 24px)
- Rounded: `rounded-xl` or `rounded-2xl`

---

## 10. Accessibility Checklist

Ensure these accessibility features work:

### Keyboard Navigation
- [ ] All buttons are keyboard accessible
- [ ] Tab order is logical
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/previews

### Screen Readers
- [ ] Images have descriptive alt text
- [ ] Buttons have aria-labels
- [ ] Loading states are announced
- [ ] Error messages are readable

### Color Contrast
- [ ] Text meets WCAG AA standard (4.5:1)
- [ ] Interactive elements are distinguishable
- [ ] Focus indicators are visible
- [ ] Color is not the only indicator

---

## 11. Environment Variables

No new environment variables needed! All features use existing:

```env
# Already configured
NEXT_PUBLIC_INSTANT_APP_ID=your_instantdb_app_id
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_token
```

---

## 12. Deployment Steps

1. **Test Locally**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000
   - Test all new components
   - Check console for errors

2. **Build Production**
   ```bash
   npm run build
   ```
   - Verify no build errors
   - Check bundle size impact

3. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Add UI polish components"
   git push origin main
   ```
   - Vercel auto-deploys from main branch
   - Monitor deployment logs

4. **Post-Deployment Checks**
   - [ ] Homepage loads with new components
   - [ ] Featured showcases display correctly
   - [ ] Watermark preview works for free users
   - [ ] Examples page filtering works
   - [ ] Mobile responsive on all devices

---

## 13. Monitoring & Analytics

Track these metrics after deployment:

### User Engagement
```javascript
// Already tracked via existing analytics
- Watermark preview click rate
- Before/after gallery interaction time
- Featured showcase click-through rate
- Examples page filter usage
```

### Performance
```javascript
// Monitor with Vercel Analytics
- Page load times (should be < 2s)
- Largest Contentful Paint (LCP < 2.5s)
- Cumulative Layout Shift (CLS < 0.1)
- First Input Delay (FID < 100ms)
```

### Conversion
```javascript
// Track with InstantDB events
- Free to Pro upgrades from watermark notice
- Upload rate after viewing examples
- Showcase submission rate after seeing featured
```

---

## 14. Troubleshooting

### BeforeAfterGallery Not Showing
- Check example images exist in `/public/examples/`
- Verify image paths are correct (no typos)
- Check browser console for 404 errors

### FeaturedShowcase Empty
- Verify InstantDB has showcase submissions
- Check showcases have `featured: true` flag
- Ensure likes exist for trending algorithm
- Test API endpoint directly: `/api/showcase/featured`

### WatermarkPreviewNotice Not Appearing
- Confirm user is on free tier (not Pro/Unlimited)
- Check `usage?.tier === 'free'` condition
- Verify useImageTracking hook returns tier
- Test with different user accounts

### API Route 500 Error
- Check InstantDB connection
- Verify schema includes required fields
- Check server logs in Vercel dashboard
- Test with Postman/curl to isolate issue

---

## 15. Quick Start

**Fastest way to integrate everything:**

1. Copy these imports to top of `app/page.tsx`:
```tsx
import BeforeAfterGallery from '@/components/BeforeAfterGallery'
import FeaturedShowcase from '@/components/FeaturedShowcase'
import WatermarkPreviewNotice from '@/components/WatermarkPreviewNotice'
```

2. Add components in this order (when no image uploaded):
```tsx
<BeforeAfterGallery />
<FeaturedShowcase variant="compact" />
{/* Upload form */}
```

3. Add watermark notice in editor form (when image uploaded):
```tsx
{user && usage?.tier === 'free' && (
  <WatermarkPreviewNotice tier={usage.tier} currentImage={currentImage} />
)}
```

4. Test locally, commit, push!

---

**Need Help?**
- Check `docs/UI_POLISH_SUMMARY.md` for detailed feature explanations
- Review `docs/TODOS.md` for future enhancement ideas
- Browse component source code for implementation details

---

**Last Updated**: 2025-10-21
**Ready for Production**: ✅ Yes
