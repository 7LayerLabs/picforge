# Side-by-Side Variant Comparison Feature

## Overview
Generate 2-3 variations of the same image/prompt simultaneously and let users compare them side-by-side to pick the best one.

## Implementation Plan

### User Flow
1. User enters prompt
2. Clicks "Generate Variants" button (instead of regular "Apply Edit")
3. System generates 2-3 variations of the same edit
4. Display in grid view for easy comparison
5. User clicks to select their favorite
6. Selected variant becomes the current image

### Technical Approach
- Make 2-3 parallel API calls with same prompt
- Display results in responsive grid layout
- Add "Pick This One" button on each variant
- Use existing history system to track all variants

### UI Components Needed
- `VariantGrid.tsx` - Grid display for multiple variants
- "Generate Variants" button option
- Quick-pick interface with hover effects

### API Changes
- Batch processing in `/api/process-image`
- Return array of generated images instead of single image
- Handle parallel Gemini API calls

### Estimated Time
~20 minutes

### UX Benefits
- Gives users options instead of single output
- A/B testing built into the workflow
- Increases chances of getting desired result

---

**Status:** Planned for future implementation
**Priority:** Medium
**Source:** Inspired by NanoBananaEditor variant system
