# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PicForge is an AI-powered image transformation platform built with Next.js 15. It provides multiple modes:
- **Single Image Editor** (/) - AI-powered image editing with 210+ templates and custom prompts
- **18+ Editor** (/editor-nsfw) - Unrestricted adult/graphic content editor with age verification
- **Batch Processor** (/batch) - Process 100+ images simultaneously with bulk operations and 21 effects
- **18+ Batch** (/batch-nsfw) - Unrestricted batch processing for adult content
- **AI Canvas** (/canvas) - Generate images from text descriptions
- **Transform Roulette** (/roulette) - Gamified random transformation with 8 categories (320 prompts)
- **Roast Mode** (/roast) - AI roasts your photos with 3 intensity levels
- **Prompt Wizard** (/prompt-wizard) - 5-step guided prompt builder
- **Templates Gallery** (/examples) - 100+ sample images to try before uploading
- **Prompts Library** (/prompts) - 211 categorized prompts
- **Tips & Tricks** (/tips) - Best practices and Nano Banana techniques
- **Showcase** (/showcase) - User-submitted transformations gallery

## Brand & Tone

**Headline:** (re)Imagine. Everything.
**Tagline:** Nothing is real anymore.

**Copy Voice:**
- Edgy, playful, direct (NOT corporate)
- Bold statements: "Make them weird. Make them epic. Make them yours."
- "Zero artistic talent required"
- Examples: "Dream It. Type It. Get It." / "Something Broke?" / "Show Off Your Work"

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
   - `process-image-nsfw/` - Unrestricted image processing using Replicate SDXL img2img (bypasses Gemini restrictions)
   - `roast/` - AI photo roasting with intensity levels (mild/spicy/nuclear)
   - `generate-canvas/` - AI image generation using DALL-E
   - `generate-canvas-free/`, `generate-canvas-hf/`, `generate-canvas-pollinations/` - Alternative free generation APIs
   - `track-visitor/`, `track-share/`, `track-template/` - Analytics endpoints using Vercel KV
   - `test-replicate/` - Test endpoint to verify Replicate API token configuration

3. **Rate Limiting**
   - `app/api/process-image/rate-limit.ts` - In-memory rate limiting per IP
   - 500 images per day per IP address
   - Resets every 24 hours

### AI Integrations

The app uses multiple AI providers:
- **Google Gemini** (`@google/generative-ai`) - Primary image processing and vision tasks (blocks NSFW)
- **Replicate** - SDXL img2img for unrestricted adult/graphic content transformations (~$0.023/image)
- **OpenAI** (`openai`) - DALL-E image generation
- **Together AI** (`together-ai`) - Alternative AI model provider
- **Pollinations/HuggingFace** - Free image generation alternatives

### Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=your_gemini_key
REPLICATE_API_TOKEN=your_replicate_token (required for NSFW editor - costs ~$0.023/image)
OPENAI_API_KEY=your_openai_key (optional for canvas generation)
TOGETHER_API_KEY=your_together_key (optional)
KV_URL=your_vercel_kv_url (for analytics)
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_read_token
```

**Note:** REPLICATE_API_TOKEN is for the NSFW editor (/editor-nsfw and /batch-nsfw). Get token at https://replicate.com/account/api-tokens. Requires paid credits (~$2 = 86 images).

### Key UI Components

- `components/Navigation.tsx` - Site-wide navigation with Editor/Batch/Games dropdowns
- `components/BeforeAfterSlider.tsx` - Interactive comparison slider
- `components/ShareModal.tsx` - Social sharing functionality
- `components/TemplateSelector.tsx` - Pre-built prompt templates
- `app/components/BatchUploader.tsx` - Drag-and-drop for multiple images
- `app/components/BatchProcessorNSFW.tsx` - NSFW batch processor (dark theme)
- `app/components/EditorNSFW.tsx` - NSFW single-image editor (dark theme)
- `app/components/EditPanel.tsx` - Batch editing controls
- `app/components/PricingCard.tsx` - Tiered pricing display
- `lib/imageEffects.ts` - 21 client-side image effects (sharpen, vignette, glitch, etc.)

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
   - Regular batch: 21 client-side effects (sharpen, vignette, saturation, warm, cool, grain, glitch/vhs, sketch, resize, enhance, etc.)
   - NSFW batch: Uses Replicate API for unrestricted transformations
   - Processes images sequentially with priority queue support
   - Export presets: Web Optimized, Social Media, High Quality, Thumbnail

6. **NSFW Content Handling**:
   - Age verification gate (18+) using sessionStorage
   - Separate routes: /editor-nsfw and /batch-nsfw
   - Uses Replicate SDXL img2img (bypasses Gemini restrictions)
   - Dark red/gray theme to distinguish from regular editor
   - Legal disclaimers and warnings
   - No content storage - ephemeral processing only

7. **Gamification Features**:
   - **Transform Roulette**: Spin-the-wheel with 8 categories (Art Styles, Movie Magic, Time Travel, Nature, Fantasy, Sci-Fi, Artistic, Abstract) - 320 total prompts
   - **Roast Mode**: AI photo roasting with 3 intensity levels (mild, spicy, nuclear)
   - **Prompt Wizard**: 5-step guided prompt builder

## Testing

No formal test suite currently implemented. Manual testing required for:
- Image upload and processing
- Rate limiting enforcement
- Batch processing operations
- Cross-browser compatibility