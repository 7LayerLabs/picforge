# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PicForge is an AI-powered image transformation platform built with Next.js 15. It provides multiple modes:
- **Single Image Editor** (/) - AI-powered image editing with 325+ prompts, custom prompts, and Lock Composition feature
- **18+ Editor** (/editor-nsfw) - COMING SOON page with ribbon design (Q1 2026 launch)
- **Batch Processor** (/batch) - Process 100+ images simultaneously with bulk operations and 21 effects
- **18+ Batch** (/batch-nsfw) - Unrestricted batch processing for adult content (access restricted)
- **AI Canvas** (/canvas) - Generate images from text descriptions
- **Transform Roulette** (/roulette) - Gamified random transformation with 8 categories (320 prompts including Banksy art)
- **Roast Mode** (/roast) - AI roasts your photos with 3 intensity levels
- **Prompt Wizard** (/prompt-wizard) - 5-step guided prompt builder
- **Templates Gallery** (/examples) - 110+ sample images to try before uploading
- **Prompts Library** (/prompts) - 325+ categorized prompts across 13 categories with filtering, search, and favorites
- **Favorites Page** (/prompts/favorites) - User's saved favorite prompts with export functionality
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
   - `lib/watermark.ts` - Adds "PicForge.com" watermark to free tier images
   - Hybrid approach: 80% operations run client-side (FREE), AI operations use Gemini API

2. **API Routes** (`app/api/`)
   - `process-image/` - Main image processing with Gemini Vision API, includes rate limiting (500/day/IP)
   - `process-image-nsfw/` - Unrestricted image processing using Replicate SDXL img2img (bypasses Gemini restrictions)
   - `roast/` - AI photo roasting with intensity levels (mild/spicy/nuclear)
   - `generate-canvas/` - AI image generation using DALL-E
   - `generate-canvas-free/`, `generate-canvas-hf/`, `generate-canvas-pollinations/` - Alternative free generation APIs
   - `track-visitor/`, `track-share/`, `track-template/` - Analytics endpoints using Vercel KV
   - `test-replicate/` - Test endpoint to verify Replicate API token configuration

3. **Rate Limiting & User Management**
   - `hooks/useImageTracking.ts` - Tracks user image generation, favorites, and usage limits
   - `hooks/usePromoCode.ts` - Handles promo code redemption for unlimited access
   - `lib/promoCodes.ts` - Promo code generation and validation logic
   - Free tier: 20 images per day (down from 500)
   - Pro/Unlimited tiers: No daily limits
   - Resets every 24 hours

### AI Integrations

The app uses multiple AI providers:
- **Google Gemini** (`@google/generative-ai`) - Primary image processing and vision tasks (blocks NSFW)
- **Replicate** - SDXL img2img for unrestricted adult/graphic content transformations (~$0.023/image)
- **OpenAI** (`openai`) - DALL-E image generation
- **Together AI** (`together-ai`) - Alternative AI model provider
- **Pollinations/HuggingFace** - Free image generation alternatives

### Database & Authentication

**InstantDB Integration** (`@instantdb/react`)
- Real-time database with built-in auth
- Handles user accounts, image history, favorites, usage tracking, and promo codes
- No backend server required - all client-side
- Magic link authentication (passwordless)
- Offline support with automatic sync

**Key Files:**
- `lib/instantdb.ts` - Database initialization and schema (includes promoCodes entity)
- `components/AuthButton.tsx` - Magic link authentication UI
- `hooks/useImageTracking.ts` - Custom hook for tracking images, favorites, and usage limits
- `hooks/usePromoCode.ts` - Custom hook for promo code redemption
- `app/profile/page.tsx` - User profile with promo code redemption
- `app/admin/page.tsx` - Admin panel for generating promo codes (derek.bobola@gmail.com only)

### Environment Variables

Required in `.env.local`:
```
# AI Providers
GEMINI_API_KEY=your_gemini_key
REPLICATE_API_TOKEN=your_replicate_token (required for NSFW editor - costs ~$0.023/image)
OPENAI_API_KEY=your_openai_key (optional for canvas generation)
TOGETHER_API_KEY=your_together_key (optional)

# Analytics (Vercel KV)
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_read_token

# InstantDB (User Auth & Database)
NEXT_PUBLIC_INSTANT_APP_ID=your_instantdb_app_id
```

**Setup Notes:**
- **REPLICATE_API_TOKEN**: For NSFW editor (/editor-nsfw and /batch-nsfw). Get token at https://replicate.com/account/api-tokens. Requires paid credits (~$2 = 86 images).
- **NEXT_PUBLIC_INSTANT_APP_ID**: Create app at https://www.instantdb.com/dash and copy the App ID. Required for user authentication and data persistence.

### Key UI Components

- `components/Navigation.tsx` - Site-wide navigation with Editor/Batch/Games/Resources/Profile dropdowns
- `components/BeforeAfterSlider.tsx` - Interactive comparison slider
- `components/ShareModal.tsx` - Social sharing functionality
- `components/TemplateSelector.tsx` - Pre-built prompt templates
- `components/AuthButton.tsx` - Magic link authentication button
- `app/components/BatchUploader.tsx` - Drag-and-drop for multiple images
- `app/components/BatchProcessorNSFW.tsx` - NSFW batch processor (dark theme)
- `app/components/EditorNSFW.tsx` - NSFW single-image editor (dark theme)
- `app/components/EditPanel.tsx` - Batch editing controls
- `app/components/PricingCard.tsx` - Tiered pricing display with promo code info
- `lib/imageEffects.ts` - 21 client-side image effects (sharpen, vignette, glitch, etc.)

### Prompt Library Components

- `components/PromptCard.tsx` - Individual prompt display with copy button and favorite toggle
- `components/FilterSidebar.tsx` - Category and tag filtering interface
- `components/SearchBar.tsx` - Search input with clear button
- `components/PromptSubmitModal.tsx` - User prompt submission form
- `lib/prompts.ts` - 325+ prompt definitions across 13 categories
- `app/prompts/page.tsx` - Main prompt library page with filtering and search
- `app/prompts/favorites/page.tsx` - Favorites page with export and statistics

**Prompt Library Features:**
- **325+ Prompts** across 13 categories (Art Styles, Nature, People, Sports, Politics, Wellness, Events, Pro Photography, Fantasy, Abstract, Film, and more)
- **Category Filtering** - Single-select filter for browsing by category
- **Tag Filtering** - Multi-select tag system for refined searches
- **Search** - Full-text search across titles, descriptions, and tags
- **Favorites System** - LocalStorage-based favorites with persistence (no backend yet)
- **Prompt of the Day** - Featured daily prompt (currently static, not rotating)
- **Copy Functionality** - One-click copy to clipboard for each prompt
- **Submit Modal** - User submission form (logs to console, no backend)
- **Design System** - Black/white/teal matching PicForge brand, Courier New monospace headings

**Important Notes:**
- Favorites stored in localStorage (no cross-device sync yet)
- Navigation component is in root layout - DO NOT include in individual pages to avoid duplication
- Prompt submissions currently log to console only (backend integration needed)

### State Management

- React hooks (useState, useEffect) for component state
- InstantDB for user data, auth state, and real-time database queries
- Zustand installed but not actively used

### Deployment

- Deployed on Vercel (auto-deploys from main branch)
- Production URL: https://pic-forge.com
- Uses Vercel KV for visitor tracking and analytics

## Important Implementation Notes

1. **Next.js 15 SSR Patterns**:
   - Route segment config exports (`export const dynamic`, `export const revalidate`) ONLY work in Server Components, NOT Client Components
   - For authenticated pages using `useSession()`: Create separate Client/Server components
   - **Pattern**:
     - `page.tsx` = Server Component with route config exports
     - `PageClient.tsx` = Client Component with all hooks and logic
     - Example: `app/dashboard/page.tsx` imports `DashboardClient.tsx`
   - This prevents SSR prerendering errors with hooks like `useSession()`

2. **Import Paths**: Components in `/app/batch/` must use `../components/` for imports, not `./components/`

3. **Client Components**: Most components use `'use client'` directive for interactivity

4. **ESLint Requirements**:
   - Escape special characters in JSX: use `&apos;` for apostrophes, `&quot;` for quotes
   - Example: `"Prompt of the Day"` → `&quot;Prompt of the Day&quot;`

5. **User Tiers & Limits**:
   - **Free Tier**: 20 images per day, includes watermark
   - **Pro Tier**: Unlimited images, no watermark
   - **Unlimited Tier**: Unlimited images (via promo codes), no watermark
   - Admin access: derek.bobola@gmail.com only

6. **Image Processing Flow**:
   - Client uploads image → Base64 conversion
   - Basic edits use Canvas API (client-side)
   - AI features send to Gemini API
   - Results displayed with download option

7. **Batch Processing**:
   - Regular batch: 21 client-side effects (sharpen, vignette, saturation, warm, cool, grain, glitch/vhs, sketch, resize, enhance, etc.)
   - NSFW batch: Uses Replicate API for unrestricted transformations
   - Processes images sequentially with priority queue support
   - Export presets: Web Optimized, Social Media, High Quality, Thumbnail

8. **NSFW Content Handling**:
   - **18+ Editor**: Currently showing "Coming Soon" page with ribbon design (Q1 2026 expected launch)
   - **18+ Batch**: Active but access restricted from editor-nsfw page
   - Separate routes: /editor-nsfw (coming soon page) and /batch-nsfw (active)
   - Uses Replicate SDXL img2img (bypasses Gemini restrictions) - ~$0.023/image
   - Dark red/gray/orange gradient theme to distinguish from regular editor
   - Legal disclaimers and age verification warnings
   - No content storage - ephemeral processing only
   - User responsibility clearly stated in Terms of Service

9. **Gamification Features**:
   - **Transform Roulette**: Spin-the-wheel with 8 categories (Art Styles, Movie Magic, Time Travel, Nature, Fantasy, Sci-Fi, Artistic, Abstract) - 320 total prompts including Banksy art
   - **Roast Mode**: AI photo roasting with 3 intensity levels (mild, spicy, nuclear)
   - **Prompt Wizard**: 5-step guided prompt builder

10. **User Experience Features**:
   - **Lock Composition**: Checkbox on main editor to preserve composition during iterative edits (auto-appends "don't change anything else" to prompts)
   - **Creative Journey**: Image gallery with masonry layout showing edit history
   - **Download All**: Bulk download all versions as ZIP file
   - **Before/After Slider**: Interactive comparison view
   - **Share Modal**: Social sharing functionality
   - **Promo Codes**: One-time redemption codes for unlimited access
   - **User Profile**: View usage, redeem codes, manage account
   - **Admin Panel**: Generate promo codes (derek.bobola@gmail.com only)

## InstantDB Usage Examples

**Track Image Generation:**
```typescript
import { useImageTracking } from '@/hooks/useImageTracking';

const { trackImageGeneration, hasReachedLimit, getRemainingImages } = useImageTracking();

// When user generates an image
await trackImageGeneration({
  prompt: "turn into a zombie",
  originalUrl: originalImageUrl,
  transformedUrl: resultImageUrl,
  locked: false
});
```

**Check Usage Limits:**
```typescript
const { hasReachedLimit, getRemainingImages, user, usage } = useImageTracking();

if (hasReachedLimit()) {
  alert('Daily limit reached! Upgrade to Pro or redeem a promo code for unlimited images.');
  return;
}

// Show remaining: "18 images remaining today" (Free tier: 20/day)
// Or "Unlimited" for Pro/Unlimited tiers
```

**Save Favorite Prompts:**
```typescript
const { saveFavorite } = useImageTracking();

await saveFavorite("turn into Van Gogh painting", "Art Styles");
```

**Get User's Image History:**
```typescript
const { imageHistory } = useImageTracking();

// imageHistory is an array of all user's generated images
// Auto-updates in real-time!
```

**Add Auth Button to Navigation:**
```typescript
import AuthButton from '@/components/AuthButton';

// In your Navigation component:
<AuthButton />
```

**Redeem Promo Code:**
```typescript
import { usePromoCode } from '@/hooks/usePromoCode';

const { redeemCode, isRedeeming, error, success } = usePromoCode();

// Redeem a code
await redeemCode('DEREK-FOUNDER-2025');
```

**Pre-Generated Promo Codes:**
- DEREK-FOUNDER-2025 (Unlimited tier)
- BOBOLA-FAM-01, BOBOLA-FAM-02, BOBOLA-FAM-03 (Unlimited tier)
- BETA-VIP-001, BETA-VIP-002, BETA-VIP-003 (Unlimited tier)

## Testing

No formal test suite currently implemented. Manual testing required for:
- Image upload and processing
- Rate limiting enforcement
- Batch processing operations
- Cross-browser compatibility