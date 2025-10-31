# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PicForge is an AI-powered image transformation platform built with Next.js 15. Users upload images and transform them using 320+ AI prompts across multiple editing modes.

**Core Features:**
- **The Forge** (/forge) - Single-image AI editor with 272+ prompts and Lock Composition
- **Batch Processor** (/batch) - Process 100+ images with 21 client-side effects
- **AI Canvas** (/canvas) - Text-to-image generation
- **Transform Roulette** (/roulette) - Gamified random transformations (8 categories)
- **Roast Mode** (/roast) - AI photo roasting (mild/spicy/nuclear)
- **AI Prompt Assistant** - Claude-powered chat for prompt enhancement (Pro feature)
- **18+ Editor/Batch** - NSFW content processing using Replicate SDXL (~$0.023/image)

## Development Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000, Turbopack enabled)
npm run build           # Production build (includes env validation)
npm run build:skip-validation  # Build without env checks
npm start               # Run production server

# Testing & QA
npm test                # Run Jest tests
npm run test:watch      # Jest watch mode
npm run test:coverage   # Coverage report
npm run test:rate-limit # Test rate limiting
npm run lint            # ESLint

# Monitoring & Utilities
npm run check-env       # Validate environment variables
npm run security-audit  # Security audit script
npm run monitor:rate-limits    # Rate limit monitoring
npm run monitor:costs   # AI API cost monitoring
```

## Brand Voice

**Headline:** (re)Imagine. Everything.
**Tagline:** Nothing is real anymore.

**Copy Style:** Edgy, playful, direct (NOT corporate). Examples: "Make them weird. Make them epic. Make them yours." / "Zero artistic talent required"

## Architecture Overview

### Core Data Flow

**Image Transformation Pipeline:**
1. User uploads image → Base64 conversion (client)
2. Basic effects (sharpen, crop, etc.) → Canvas API (client-side, FREE)
3. AI transformations → API route → Gemini/Replicate → Result
4. Track usage → InstantDB → Update user limits
5. Display result + download option

**Key Architectural Decisions:**
- **Hybrid Processing**: 80% client-side (Canvas API) for free operations, 20% server-side AI for advanced features
- **No Traditional Backend**: InstantDB handles ALL server state (auth, data, real-time sync)
- **Fail-Open Rate Limiting**: APIs work without Vercel KV but are vulnerable to abuse
- **Custom Events**: Window events bridge AI Prompt Assistant ↔ Editor communication

### Critical API Routes (`app/api/`)

**Image Processing:**
- `process-image/` - Main editor (Gemini Vision API, 500 req/day/IP)
- `process-image-nsfw/` - NSFW editor (Replicate SDXL, 200 req/day/IP, ~$0.023/image)
- `generate-canvas/` - Text-to-image (DALL-E, 100 req/day/IP)
- `roast/` - Photo roasting (300 req/day/IP)

**AI Prompt Assistant (Pro feature):**
- `analyze-image/` - Gemini Vision analyzes uploaded images (50 req/hour)
- `enhance-prompt/` - Claude Sonnet 3.5 generates 3 prompt variations (30 req/hour)

**Analytics:**
- `track-visitor/`, `track-share/`, `track-template/` - Vercel KV counters

### Database Architecture (InstantDB)

**Single Source of Truth** - `lib/instantdb.ts` defines entire schema:
- **No separate backend** - All CRUD operations via InstantDB client hooks
- **Real-time sync** - State updates propagate to all connected clients instantly
- **Magic link auth** - Passwordless authentication built-in
- **11 entities**: users, images, favorites, usage, promoCodes, showcaseSubmissions, showcaseLikes, referrals, emailPreferences, rouletteStreaks, rouletteAchievements, rouletteSpins, rouletteVotes

**Key Hooks:**
- `hooks/useImageTracking.ts` - Image generation, favorites, usage limits
- `hooks/usePromoCode.ts` - Promo code redemption
- `hooks/useReferral.ts` - Referral tracking
- `hooks/useShowcaseVotes.ts` - Showcase voting
- `hooks/useRouletteGame.ts` - Roulette game state

**User Tiers:**
- Free: 20 images/day, watermarked
- Pro: Unlimited images, no watermark (Stripe subscription)
- Unlimited: Unlimited via promo codes (DEREK-FOUNDER-2025, etc.)

### AI Provider Strategy

**Multi-Provider Architecture** - Different providers for different use cases:

| Provider | Use Case | Cost | Notes |
|----------|----------|------|-------|
| **Google Gemini** | Main editor, vision analysis | Free tier | Blocks NSFW content |
| **Anthropic Claude** | Prompt enhancement (Pro) | Pay-as-you-go | Sonnet 3.5, 30 req/hour limit |
| **Replicate SDXL** | NSFW transformations | ~$0.023/image | Bypasses Gemini restrictions |
| **OpenAI DALL-E** | Text-to-image generation | $0.040-$0.080/image | Canvas feature |
| **Pollinations/HF** | Free alternatives | Free | Fallback generation |

**Cost Control:**
- Rate limiting on all paid endpoints (Vercel KV)
- User tier enforcement (Free: 20/day, Pro: unlimited)
- IP-based limits to prevent abuse

## Environment Setup

**Required Variables** (`.env.local`):
```bash
# InstantDB (REQUIRED - single source of truth for all data)
NEXT_PUBLIC_INSTANT_APP_ID=xxx  # Get from instantdb.com/dash

# AI Providers (REQUIRED)
GEMINI_API_KEY=xxx              # Google Gemini for main editor
ANTHROPIC_API_KEY=xxx           # Claude for AI Prompt Assistant (Pro)

# Paid Features (OPTIONAL but limits functionality)
REPLICATE_API_TOKEN=xxx         # NSFW editor (~$0.023/image)
OPENAI_API_KEY=xxx              # Canvas text-to-image

# Rate Limiting (OPTIONAL but recommended)
KV_URL=xxx                      # Vercel KV for rate limiting
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
KV_REST_API_READ_ONLY_TOKEN=xxx
```

**Setup Commands:**
- `npm run check-env` - Validate all environment variables
- `npm run validate-env` - Run during build (fails if missing required vars)

**Critical Notes:**
- InstantDB replaced Prisma in October 2025 - no other database exists
- Without Vercel KV, rate limiting fails open (APIs work but vulnerable to abuse)
- REPLICATE_API_TOKEN costs ~$2 for 86 images (~$0.023 each)

## Critical Implementation Patterns

### Next.js 15 SSR + Client Hooks

**Problem:** Route config exports (`export const dynamic`) only work in Server Components, but hooks like `useSession()` require Client Components.

**Solution:** Split into Server/Client components:
```typescript
// app/dashboard/page.tsx (Server Component)
export const dynamic = 'force-dynamic';
import DashboardClient from './DashboardClient';
export default function DashboardPage() {
  return <DashboardClient />;
}

// app/dashboard/DashboardClient.tsx (Client Component)
'use client';
export default function DashboardClient() {
  const { user } = useAuth(); // hooks work here
  // ... component logic
}
```

### AI Prompt Assistant ↔ Editor Communication

**Cross-Component Communication** using custom window events:

```typescript
// Editor listens for prompt insertion
useEffect(() => {
  const handleInsert = (e: CustomEvent) => {
    setPrompt(e.detail.prompt);
  };
  window.addEventListener('insertPrompt', handleInsert);
  return () => window.removeEventListener('insertPrompt', handleInsert);
}, []);

// Editor notifies when image uploaded
window.dispatchEvent(new CustomEvent('imageUploaded', {
  detail: { imageUrl: uploadedImageUrl }
}));

// AI Assistant dispatches prompt
window.dispatchEvent(new CustomEvent('insertPrompt', {
  detail: { prompt: enhancedPrompt }
}));
```

### InstantDB Usage Patterns

**Track Image Generation:**
```typescript
import { useImageTracking } from '@/hooks/useImageTracking';

const { trackImageGeneration, hasReachedLimit } = useImageTracking();

if (hasReachedLimit()) {
  // Show upgrade modal
  return;
}

await trackImageGeneration({
  prompt: "turn into zombie",
  originalUrl: originalUrl,
  transformedUrl: resultUrl,
  locked: false
});
```

**Check User Tier:**
```typescript
const { user, usage } = useImageTracking();
const isProUser = usage?.tier === 'pro' || usage?.tier === 'unlimited';
```

### Common Gotchas

1. **Import Paths**: Use `@/` alias, not relative paths. Exception: `/app/batch/` must use `../components/`
2. **Navigation Duplication**: Navigation is in root layout - DO NOT import in individual pages
3. **ESLint**: Escape quotes in JSX: `&apos;` for apostrophes, `&quot;` for quotes
4. **Watermarks**: Free tier images get "PicForge.com" watermark via `lib/watermark.ts`
5. **Admin Access**: Only derek.bobola@gmail.com can access `/app/admin/page.tsx`
6. **Lock Composition**: Auto-appends "don't change anything else" to prompts when checkbox enabled

## Key File Locations

**Core Infrastructure:**
- `lib/instantdb.ts` - Complete database schema (11 entities)
- `lib/imageProcessor.ts` - Client-side Canvas API operations
- `lib/imageEffects.ts` - 21 effect definitions (sharpen, glitch, vignette, etc.)
- `lib/prompts.ts` - 325+ AI prompt definitions
- `middleware.ts` - HTTPS enforcement, www → apex redirect
- `next.config.ts` - Security headers, image optimization, CDN config

**Critical Hooks:**
- `hooks/useImageTracking.ts` - Usage limits, favorites, image history
- `hooks/usePromoCode.ts` - Promo code redemption
- `hooks/useRouletteGame.ts` - Roulette game state

**Main Pages:**
- `app/forge/page.tsx` - Single image editor
- `app/batch/page.tsx` - Batch processor
- `app/canvas/page.tsx` - Text-to-image generation
- `app/roulette/page.tsx` - Transform Roulette game
- `app/admin/page.tsx` - Promo code generation (admin only)

**API Routes:**
- `app/api/process-image/route.ts` - Main Gemini transformation
- `app/api/process-image-nsfw/route.ts` - Replicate NSFW processing
- `app/api/analyze-image/route.ts` - Gemini Vision analysis (Pro)
- `app/api/enhance-prompt/route.ts` - Claude prompt enhancement (Pro)

## Pre-Generated Promo Codes

For testing unlimited tier access:
- `DEREK-FOUNDER-2025` (Unlimited)
- `BOBOLA-FAM-01`, `BOBOLA-FAM-02`, `BOBOLA-FAM-03` (Unlimited)
- `BETA-VIP-001`, `BETA-VIP-002`, `BETA-VIP-003` (Unlimited)

## Testing Strategy

**Current State:** Manual testing only (no Jest test suite actively maintained)

**Test Commands Available:**
- `npm test` - Run Jest (basic setup exists)
- `npm run test:rate-limit` - Test rate limiting logic
- `npm run test:api` - Test API error handling
- `npm run security-audit` - Run security audit script

**Manual Testing Checklist:**
1. Image upload and transformation (Forge)
2. Batch processing (21 effects)
3. Rate limiting enforcement (20/day for Free tier)
4. Promo code redemption
5. AI Prompt Assistant (Pro feature)
6. Showcase voting
7. Roulette game mechanics