# PicForge TODO Items

This document tracks remaining TODOs and unimplemented features across the codebase.

## Active TODOs

### Export Formats (`lib/exportFormats.ts`)

**Vector Export - ✅ IMPLEMENTED**
- **Status**: Completed by innovation-lab agent
- **Current Implementation**: Advanced SVG vectorization using edge detection
- **Features**:
  - Basic SVG with embedded raster image
  - Advanced vectorization using Sobel edge detection
  - Path tracing for clean vector shapes
  - Precision control for path simplification
- **Functions**: `downloadSVG()`, `vectorizeImage()`, `detectEdges()`, `tracePaths()`
- **Priority**: ✅ Complete

**PDF Generation - ✅ IMPLEMENTED**
- **Status**: Completed by innovation-lab agent
- **Current Implementation**: Full PDF generation with jsPDF
- **Features**:
  - Multiple page sizes (Letter, A4, Custom)
  - Portrait/Landscape orientation
  - Automatic image centering and scaling
  - Metadata support (title, author, keywords)
  - Print-ready output
- **Functions**: `downloadPDF()` with PDFOptions interface
- **Priority**: ✅ Complete

**Additional Export Formats - ✅ IMPLEMENTED**
- **WebP Export**: Modern web format with smaller file sizes
- **ICO Export**: Favicon generation with multiple sizes
- **File Size Estimation**: `estimateFileSize()` helper function
- **Progress Tracking**: Progress callbacks for batch exports

### Rate Limiting (`lib/rateLimitKv.ts`)

**Line 36 - Vercel KV Configuration**
```typescript
// TODO: Vercel KV not configured yet
```
- **Status**: Low priority - InstantDB handles usage tracking
- **Current Implementation**: InstantDB tracks user image generation counts
- **Limitation**: No IP-based rate limiting for anonymous users
- **Note**: Vercel KV is configured and working for visitor tracking
- **Priority**: Low (Authentication-based limits are sufficient)

## Completed Features

### Image Processing
- ✅ Client-side Canvas API processing (80% of operations)
- ✅ Gemini API for AI transformations
- ✅ Replicate SDXL for NSFW content
- ✅ Batch processing with 21 effects
- ✅ Watermark system for free tier

### User Management
- ✅ InstantDB authentication (magic links)
- ✅ Usage tracking and limits (20 images/day free tier)
- ✅ Promo code system for unlimited access
- ✅ Favorites system (both localStorage and InstantDB)

### UI Features
- ✅ Before/After slider
- ✅ Image gallery with masonry layout
- ✅ Lock Composition feature
- ✅ Prompt library (325+ prompts)
- ✅ Transform Roulette gamification
- ✅ Roast Mode
- ✅ AI Canvas generation

### Showcase System
- ✅ Community showcase gallery
- ✅ Like/view tracking
- ✅ User submissions
- ⏳ Featured transformations (in progress)
- ⏳ Trending algorithm (in progress)

## Feature Requests (Parking Lot)

### Short Term
- [ ] Add watermark preview before processing
- [ ] Improve before/after examples on prompts
- [ ] Featured showcase transformations
- [ ] Weekly trending showcase items

### Medium Term
- [ ] True vector export for Cricut (potrace.js integration)
- [ ] Batch watermark preview
- [ ] Social sharing with Open Graph metadata
- [ ] User profiles with showcase galleries

### Long Term
- [ ] PDF generation with print-ready color profiles
- [ ] Advanced vectorization (VectorMagic API integration)
- [ ] Cricut-specific export presets
- [ ] Print fulfillment partnerships (Printful, Printify)

## Notes

- **Export Features**: Current PNG-based exports work for 95% of use cases
- **Rate Limiting**: Authentication-based limits are working well
- **Performance**: Client-side processing keeps costs low
- **Scalability**: InstantDB handles real-time data well

Last updated: 2025-10-21
