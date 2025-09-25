# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PicForge is an AI-powered image transformation platform built with Next.js 15. It provides two main modes:
- **Single Image Editor** (/) - AI-powered image editing with templates and custom prompts
- **Batch Processor** (/batch) - Process 100+ images simultaneously with bulk operations

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (uses Turbopack)
npm run dev
# Opens on http://localhost:3000 (or next available port)

# Build for production
npm run build --turbopack

# Run production server
npm start

# Run linting
npm run lint
```

## Architecture & Key Components

### Core Features

1. **Image Processing Pipeline**
   - `lib/imageProcessor.ts` - Client-side Canvas API operations (resize, crop, filters, watermark)
   - `lib/geminiProcessor.ts` - AI features using Gemini API (background removal, enhancement)
   - Hybrid approach: 80% operations run client-side (FREE), AI operations use Gemini API

2. **API Routes** (`app/api/`)
   - `process-image/` - Main image processing with Gemini Vision API, includes rate limiting (500/day/IP)
   - `generate-canvas/` - AI image generation using DALL-E
   - `generate-canvas-free/`, `generate-canvas-hf/`, `generate-canvas-pollinations/` - Alternative free generation APIs
   - `track-visitor/`, `track-share/`, `track-template/` - Analytics endpoints using Vercel KV

3. **Rate Limiting**
   - `app/api/process-image/rate-limit.ts` - In-memory rate limiting per IP
   - 500 images per day per IP address
   - Resets every 24 hours

### AI Integrations

The app uses multiple AI providers:
- **Google Gemini** (`@google/generative-ai`) - Primary image processing and vision tasks
- **OpenAI** (`openai`) - DALL-E image generation
- **Together AI** (`together-ai`) - Alternative AI model provider
- **Pollinations/HuggingFace** - Free image generation alternatives

### Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key (optional for canvas generation)
TOGETHER_API_KEY=your_together_key (optional)
KV_URL=your_vercel_kv_url (for analytics)
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_read_token
```

### Key UI Components

- `components/Navigation.tsx` - Site-wide navigation with single/batch mode toggle
- `components/BeforeAfterSlider.tsx` - Interactive comparison slider
- `components/ShareModal.tsx` - Social sharing functionality
- `components/TemplateSelector.tsx` - Pre-built prompt templates
- `app/components/BatchUploader.tsx` - Drag-and-drop for multiple images
- `app/components/EditPanel.tsx` - Batch editing controls
- `app/components/PricingCard.tsx` - Tiered pricing display

### State Management

- React hooks (useState, useEffect) for component state
- No global state management library currently
- Zustand installed but not actively used

### Deployment

- Deployed on Vercel (auto-deploys from main branch)
- Production URL: https://pic-forge.com
- Uses Vercel KV for visitor tracking and analytics

## Important Implementation Notes

1. **Import Paths**: Components in `/app/batch/` must use `../components/` for imports, not `./components/`

2. **Client Components**: Most components use `'use client'` directive for interactivity

3. **Rate Limiting**: The app enforces 500 free images per day per IP to control costs

4. **Image Processing Flow**:
   - Client uploads image → Base64 conversion
   - Basic edits use Canvas API (client-side)
   - AI features send to Gemini API
   - Results displayed with download option

5. **Batch Processing**:
   - Processes multiple images with single Gemini API call when possible
   - Optimizes for cost efficiency (99% profit margins)
   - Smart caching for similar images

## Testing

No formal test suite currently implemented. Manual testing required for:
- Image upload and processing
- Rate limiting enforcement
- Batch processing operations
- Cross-browser compatibility