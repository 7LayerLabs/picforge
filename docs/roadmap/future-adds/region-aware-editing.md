# Region-Aware Editing Feature

## Overview
Allow users to select specific regions of an image and apply AI edits only to that area.

## Implementation Plan

### User Flow
1. User uploads image
2. Clicks "Select Region" button
3. Draws/clicks to select area on image
4. Enters prompt for that specific region
5. AI edits only the selected region

### Technical Approach
- Simple rectangle selection overlay (no heavy canvas library)
- Capture coordinates (x, y, width, height)
- Send mask data to Gemini API with region context
- Blend edited region back into original image

### UI Components Needed
- `RegionSelector.tsx` - Selection tool overlay
- Add "Select Region" toggle button to main editor
- Visual highlight showing selected area

### API Changes
- Update `/api/process-image` to accept region coordinates
- Pass mask/region data to Gemini API
- Handle region-specific prompts

### Estimated Time
~30 minutes

### Dependencies
- None (vanilla React/TypeScript)
- Uses existing Gemini API integration

---

**Status:** Planned for future implementation
**Priority:** Medium
**Source:** Inspired by NanoBananaEditor region editing
