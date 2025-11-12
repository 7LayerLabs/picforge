# PicForge Features Documentation

This comprehensive guide covers all features, functionality, and user experience elements of PicForge.

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [User Tier System](#user-tier-system)
3. [Core Features](#core-features)
4. [Supporting Features](#supporting-features)
5. [UI Components](#ui-components)
6. [Gamification System](#gamification-system)
7. [Viral Growth Features](#viral-growth-features)
8. [Rate Limits & Costs](#rate-limits--costs)
9. [Future Roadmap](#future-roadmap)

---

## Feature Overview

**Brand Voice:**
- **Headline**: (re)Imagine. Everything.
- **Tagline**: Nothing is real anymore.
- **Style**: Edgy, playful, direct. Not corporate. "Make them weird. Make them epic. Make them yours."

**Core Value Proposition:**
Transform images using 320+ AI prompts with zero artistic talent required. Process individually or in batches, with both client-side effects (free) and AI transformations (paid tiers).

---

## User Tier System

### Free Tier
**Limits:**
- 20 images/day with watermark
- Access to all features
- Watermark: "Pic-Forge.com" (dual placement: top-right and bottom-left)
- Rate limited: 20 transformations per 24 hours

**What's Included:**
- The Forge editor
- Batch Processor (21 client-side effects)
- AI Canvas
- Transform Roulette
- Roast Mode
- Showcase viewing
- Favorites (limited to 50)

### Pro Tier ($9.99/month via Stripe)
**Benefits:**
- Unlimited images
- No watermark
- Priority processing
- Access to AI Prompt Assistant
- Unlimited favorites
- Early access to new features

**Payment Flow:**
- Stripe Checkout integration
- Webhook-based subscription management
- Automatic tier updates via InstantDB

### Unlimited Tier (Promo Codes)
**Access Methods:**
- Founder codes: `DEREK-FOUNDER-2025`
- Family codes: `BOBOLA-FAM-01`, `BOBOLA-FAM-02`, `BOBOLA-FAM-03`
- Beta VIP codes: `BETA-VIP-001`, `BETA-VIP-002`, `BETA-VIP-003`

**Features:**
- Same as Pro tier
- Lifetime access
- No expiration

---

## Core Features

### 1. The Forge (/forge)

**Description:**
Single-image AI editor with 272+ curated prompts across 8 categories.

**Key Features:**
- **Lock Composition**: Appends "don't change anything else" to prompts to preserve image structure
- **Drag & Drop Upload**: Supports JPG, PNG, WEBP, AVIF, GIF
- **Sample Images**: Quick-start with pre-loaded examples
- **Prompt Library**: 272+ prompts organized by category
- **Before/After Comparison**: Slider to compare original and transformed
- **Favorites System**: Save transformations (localStorage + InstantDB sync)
- **Image History**: View past transformations

**Categories:**
1. **Art Styles** (52 prompts) - Ballpoint sketch, oil painting, watercolor, etc.
2. **Fantasy & Sci-Fi** (38 prompts) - Zombie, cyberpunk, steampunk, alien, etc.
3. **Professional** (28 prompts) - Studio lighting, product photography, headshots
4. **Nature & Weather** (24 prompts) - Sunset, storm, fog, northern lights
5. **Color & Mood** (42 prompts) - Sepia, noir, pastel, neon, warm/cool tones
6. **Time & Era** (18 prompts) - Victorian, retro 80s, ancient ruins
7. **Creative Effects** (35 prompts) - Glitch art, mosaic, kaleidoscope, paper cutout
8. **Fun & Quirky** (35 prompts) - Cartoon, emoji style, food art, LEGO

**Technical Implementation:**
- **AI Provider**: Google Gemini Vision API (free tier)
- **Rate Limit**: 500 requests/day/IP
- **Processing Time**: 3-8 seconds average
- **Image Output**: PNG format, original resolution
- **Watermark**: Applied client-side via `lib/watermark.ts`

**User Flow:**
1. Upload image or select sample
2. (Optional) Enable Lock Composition
3. Browse prompt library or type custom prompt
4. Click "Transform"
5. View result with before/after slider
6. Download, favorite, or share

---

### 2. Batch Processor (/batch)

**Description:**
Process 100+ images simultaneously with 21 client-side effects using Canvas API.

**Features:**
- **Multi-Upload**: Drag & drop multiple images at once
- **Effect Library**: 21 organized effects with click-to-add
- **Effect Combinations**: Mix multiple effects (e.g., "warm, vignette, sharpen")
- **Progress Tracking**: Real-time visual progress bar
- **Bulk Download**: Export all processed images as ZIP
- **Time Estimates**: Shows elapsed, average, and remaining time
- **Error Handling**: Individual file error tracking

**Effect Categories:**

**🎨 Color Adjustments (9 effects):**
- grayscale, invert, sepia, red, blue, green, warm, cool, saturation

**✨ Enhancement (5 effects):**
- sharpen, enhance, contrast, bright, dark

**🖼️ Artistic Effects (6 effects):**
- vignette, grain, blur, sketch, glitch, pixelate

**🔧 Utilities (1 effect):**
- resize (specify dimensions)

**Popular Combinations:**
- **Instagram Ready**: `warm, vignette, sharpen`
- **Vintage Film**: `sepia, grain, vignette`
- **Bold & Dramatic**: `contrast, saturation, sharpen`
- **Soft & Dreamy**: `blur, bright, warm`

**Technical Implementation:**
- **Processing**: 100% client-side (Canvas API)
- **Cost**: FREE (no API calls)
- **Performance**: ~200-500ms per image
- **File Format**: PNG output
- **Import Path Note**: Uses `../components/` (not `@/` alias)

**Components:**
- `BatchProgressBar.tsx` - Visual progress tracking with stats
- `BatchQuickStart.tsx` - Collapsible guide with keyboard shortcuts
- `EffectLibrary.tsx` - Organized effect categories with tooltips

**Keyboard Shortcuts:**
- `Ctrl+V` - Paste images from clipboard
- `Ctrl+S` - Start processing
- `ESC` - Cancel processing
- `Del` - Remove selected images

---

### 3. AI Canvas (/canvas)

**Description:**
Text-to-image generation using DALL-E or free alternatives.

**Features:**
- **Text-to-Image**: Generate images from descriptions
- **Multiple Providers**:
  - OpenAI DALL-E (paid, high quality)
  - Pollinations AI (free alternative)
  - Hugging Face (free alternative)
- **Style Presets**: Photorealistic, artistic, abstract, etc.
- **Resolution Options**: Square, landscape, portrait
- **Generation History**: View and regenerate past creations

**Technical Implementation:**
- **Primary**: OpenAI DALL-E API ($0.040-$0.080/image)
- **Fallback**: Pollinations/HF (free but lower quality)
- **Rate Limit**: 100 requests/day/IP
- **Generation Time**: 10-30 seconds
- **Output**: 1024x1024px default

---

### 4. Transform Roulette (/roulette)

**Description:**
Gamified random transformation experience with streaks, achievements, and leaderboards.

**Core Mechanics:**
- **Spin the Wheel**: Random category selection from 8 categories
- **Random Prompt**: 5% chance of rare transformation
- **Daily Streaks**: Track consecutive days of spinning
- **Achievements**: 16 unlockable achievements with image rewards
- **Leaderboards**: Compete for top streaks and spins
- **Voting**: Community votes on transformations

**8 Categories:**
1. Art Styles
2. Fantasy & Sci-Fi
3. Professional
4. Nature & Weather
5. Color & Mood
6. Time & Era
7. Creative Effects
8. Fun & Quirky

**Streak System:**

**5 Streak Levels:**
- 🟦 **STARTING** (1-2 days) - Teal badge
- 🟨 **HEATING UP** (3-6 days) - Yellow badge
- 🟧 **ON FIRE** (7-13 days) - Orange + animated flames
- 🟥 **UNSTOPPABLE** (14-29 days) - Red + pulsing flames
- 🟪 **LEGENDARY** (30+ days) - Purple + intense animation

**Streak Tracking:**
- Shows current streak vs longest streak
- Progress to next milestone
- Last spin date
- Visual flame animations

**Achievement System (16 Achievements):**

**🎯 Spin-Based:**
- First Spin (1) → +2 images
- Getting Started (5) → +3 images
- Addicted (10) → +5 images
- Roulette Master (25) → +10 images
- Chaos Legend (50) → +20 images
- Transformation God (100) → +50 images

**🔥 Streak-Based:**
- Hot Streak (3 days) → +5 images
- On Fire (5 days) → +10 images
- Lucky 7 (7 days) → +15 images
- Two Weeks Strong (14 days) → +30 images
- Monthly Master (30 days) → +100 images

**🎨 Exploration:**
- Category Explorer (all 8 categories) → +10 images

**🎰 Rare Finds:**
- First Jackpot (1 rare) → +5 images
- Lucky Spinner (5 rare) → +15 images

**📱 Social:**
- First Share (1 share) → +3 images
- Social Butterfly (10 shares) → +10 images
- Community Champion (25 votes) → +8 images

**Components:**
- `StreakBadge.tsx` - Visual streak display with animations
- `AchievementModal.tsx` - Achievement tracking with progress
- `Leaderboard.tsx` - 3 leaderboard types (Popular, Streaks, Active)
- `ProgressiveReveal.tsx` - 3-stage transformation animation
- `RouletteShareModal.tsx` - Multi-platform sharing

**Viral Mechanics:**
- Daily habit formation via streaks
- FOMO (don't break streak)
- Achievement collection mentality
- Social sharing with branded exports
- Leaderboard competition

---

### 5. Roast Mode (/roast)

**Description:**
AI photo roasting with 3 intensity levels.

**Intensity Levels:**
1. **Mild** - Gentle, playful roasting
2. **Spicy** - Sharp but funny
3. **Nuclear** - Absolutely savage (18+ recommended)

**Technical Implementation:**
- **AI Provider**: Google Gemini Vision API
- **Rate Limit**: 300 requests/day/IP
- **Response Time**: 2-5 seconds
- **Output**: Text-based roast (250-400 characters)

**Use Cases:**
- Social media engagement
- Entertainment
- Icebreaker content

---

### 6. AI Prompt Assistant (Pro Feature)

**Description:**
Persistent floating chat widget powered by Claude 3.5 Sonnet that helps craft optimized prompts.

**Key Features:**
- **Always Available**: Floating ✨ button on all pages
- **Conversational**: Natural language input
- **3 Variations**: Generates 3 optimized prompt options
- **Copy to Clipboard**: One-click prompt copying
- **Context Aware**: Understands casual descriptions
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for newline

**Example Interaction:**

**User:** "I want my bedroom to have a cozy K-Pop vibe but not too intense"

**AI Response:**
```
Option 1:
Modern minimalist bedroom inspired by K-Pop culture — soft pastel color palette
(pink, lavender, white, beige), LED strip lighting with gentle glow, a few framed
K-Pop posters or vinyls as wall accents, cozy bedding with layered textures...

Option 2:
Korean teen bedroom with subtle edgy elements — monochrome color scheme with
pops of neon pink/purple, sleek modern furniture, subtle anime-inspired wall art...

Option 3:
[Alternative variation]
```

**Technical Implementation:**
- **AI Provider**: Anthropic Claude 3.5 Sonnet
- **Cost**: ~$0.014 per message
- **Rate Limit**: 30 requests/hour for Pro users
- **Token Usage**: ~500 input + ~800 output tokens
- **Integration**: Global component in root layout

**Components:**
- `PromptAssistantChat.tsx` - Floating chat widget

**API Endpoint:**
- `app/api/enhance-prompt/route.ts`
- Input: `{ userInput: string }`
- Output: `{ explanation: string, prompts: string[] }`

---

### 7. 18+ Editor/Batch (/forge-nsfw, /batch-nsfw)

**Description:**
NSFW content processing using Replicate SDXL to bypass Gemini restrictions.

**Features:**
- Same interface as main editor/batch
- Uses Replicate SDXL model
- No content filtering
- Separate rate limits

**Technical Implementation:**
- **AI Provider**: Replicate SDXL
- **Cost**: ~$0.023 per image
- **Rate Limit**: 200 requests/day/IP
- **Processing Time**: 5-15 seconds
- **API Route**: `app/api/process-image-nsfw/route.ts`

**Cost Control:**
- IP-based rate limiting
- User tier enforcement
- Separate tracking from main quota

---

## Supporting Features

### Watermark System

**Purpose:**
Monetization tool for Free tier, encouraging Pro upgrades.

**Implementation:**
- **Placement**: Dual watermarks (top-right, bottom-left)
- **Text**: "Pic-Forge.com"
- **Style**: Semi-transparent, prevents easy cropping
- **Application**: Client-side via `lib/watermark.ts`
- **Removal**: Pro/Unlimited tiers only

**User Communication:**
- `WatermarkPreviewNotice` component shows preview before processing
- Clear explanation of Free tier limitations
- "Upgrade to Pro" CTA

### Favorites System

**Purpose:**
Allow users to save and organize transformations.

**Features:**
- **Dual Storage**: localStorage (instant) + InstantDB (cloud sync)
- **Limits**: 50 for Free, unlimited for Pro/Unlimited
- **Display**: Grid view with thumbnails
- **Actions**: View, re-download, remove from favorites
- **Sync**: Cross-device sync for authenticated users

**Implementation:**
- `hooks/useImageTracking.ts` - Main favorites hook
- InstantDB `images` entity with `isFavorite` flag

### Showcase Gallery System

**Purpose:**
Community gallery of user-submitted transformations.

**Features:**
- **Public Gallery**: Anyone can view
- **Submission**: Authenticated users only
- **Voting**: Like transformations (heart icon)
- **View Tracking**: Count views for trending algorithm
- **Before/After**: Show original + transformed images
- **Prompt Display**: Copy prompt functionality
- **User Attribution**: Show creator name and date

**Tabs:**
1. **Trending** 🔥 - Trending algorithm ranking
2. **Most Liked** ❤️ - All-time favorites
3. **Recent** 🕐 - Last 7 days
4. **Featured** ⭐ - Admin-curated picks

**Components:**
- `ShowcaseCard.tsx` - Individual submission card
- `TrendingShowcase.tsx` - Showcase gallery page

**InstantDB Entities:**
- `showcaseSubmissions` - User submissions
- `showcaseLikes` - Like tracking
- `showcaseVotes` - Roulette voting (separate from likes)

---

## UI Components

### Before/After Gallery

**Purpose:**
Homepage social proof showing real transformation examples.

**Features:**
- **8 Curated Examples**: Hand-picked transformations
- **2 View Modes**:
  - **Grid View**: 2x4 grid with hover to reveal original
  - **Slider View**: Interactive before/after slider with carousel
- **Category Labels**: Art Styles, Fantasy, Professional, etc.
- **Prompt Display**: Show exact prompt used
- **CTA**: "Upload Your Image Now" button

**Example Images:**
- `derek.jpg` → `derek_zombie.png` (Zombie transformation)
- `derek.jpg` → `derek_cyberpunk.png` (Cyberpunk style)
- `elon.jpg` → `elon_sketch.png` (Ballpoint sketch)
- `sidney.webp` → `sidney_sketch.png` (Ballpoint sketch)
- `product_before.jpg` → `product_after.png` (Studio lighting)
- `landscape_day.jpg` → `landscape_sunset.png` (Golden hour)
- `portrait.jpg` → `portrait_oil.png` (Oil painting)
- `dog.jpg` → `dog_anime.png` (Anime style)

**Component:**
- `components/BeforeAfterGallery.tsx`

### Featured Showcase

**Purpose:**
Homepage spotlight for trending community transformations.

**Features:**
- **3 Filter Tabs**: Trending / Featured / Recent
- **Real-time Stats Bar**: Transformations count, users count, total views
- **Grid Layout**: 6 items default (configurable)
- **Badge System**: #1, #2, #3 trending badges
- **"View Full Showcase" CTA**

**Components:**
- `components/FeaturedShowcase.tsx` (deprecated, replaced by FeaturedTransformations)
- `components/FeaturedTransformations.tsx` (current)
- `components/FeaturedCard.tsx` - Individual featured card

### Watermark Preview Notice

**Purpose:**
Transparent communication about Free tier watermarks.

**Features:**
- **Prominent Placement**: Above editor form for Free users
- **Preview Toggle**: Show exact watermark placement
- **Clear Messaging**: "Your downloaded images will include a 'Pic-Forge.com' watermark"
- **Upgrade CTA**: Direct link to pricing page
- **Visual Example**: Before/after with watermark badges

**Component:**
- `components/WatermarkPreviewNotice.tsx`

**Design:**
- Teal/blue gradient background
- Info icon with clear hierarchy
- Interactive preview button
- Professional card design

### Social Proof Counters

**Purpose:**
Build credibility and FOMO with real-time statistics.

**3 Variants:**

**Compact:**
```
🖼 2,847  👥 10k+  ⭐ 234
```

**Inline:**
```
2,847 transformations created • Join 10k+ users
```

**Full (Grid Cards):**
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│  2,847  │ │  10k+   │ │   234   │
│ Images  │ │  Users  │ │Showcases│
└─────────┘ └─────────┘ └─────────┘
```

**Placement:**
- Homepage hero (inline)
- Featured section (stats bar)
- Showcase page (compact)

**Component:**
- `components/SocialProofCounter.tsx`

**Data Source:**
- Real-time from InstantDB
- Auto-formatting (10,000 → "10k+")
- Updates every 5 seconds

### Trending Badge

**Purpose:**
Highlight trending and featured content with visual badges.

**4 Variants:**
- 🔥 **Fire** - Red/orange gradient (for #1 trending)
- 📈 **Trending** - Teal/purple gradient
- ⚡ **Hot** - Pink/rose gradient
- ⭐ **Star** - Yellow/amber gradient (for featured)

**Rank Support:**
- #1 → "🥇 #1 TRENDING"
- #2 → "🥈 #2"
- #3 → "🥉 #3"

**Sizes:** sm, md, lg

**Component:**
- `components/TrendingBadge.tsx`

---

## Gamification System

### Trending Algorithm

**Purpose:**
Surface viral content using multi-factor scoring.

**Formula:**
```typescript
score = (recentLikes × 3) + (totalLikes × 1) + (recencyBoost × 2) + (viewBoost × 0.5)
```

**Factor Breakdown:**

**1. Recent Likes (3x weight):**
- Likes from last 7 days
- Captures current momentum
- Most important factor

**2. Total Likes (1x weight):**
- All-time popularity
- Rewards evergreen content

**3. Recency Boost (2x weight):**
- Exponential decay: `Math.exp(-ageInDays / 10) * 100`
- New (0-7 days): 100-70% boost
- Recent (7-14 days): 70-40% boost
- Old (14-30 days): 40-10% boost
- Very old (30+ days): <5% boost

**4. View Boost (0.5x weight):**
- Normalized: `min(100, (views/1000) * 100)`
- Caps at 1000 views = 100% boost
- Engagement indicator

**Example Scores:**

**New Viral Post:**
- Age: 2 days, Recent likes: 15, Total: 18, Views: 200
- **Score: 253** 🔥 (trending!)

**Popular Evergreen:**
- Age: 20 days, Recent likes: 2, Total: 50, Views: 800
- **Score: 146** (still good)

**Old Post:**
- Age: 45 days, Recent likes: 0, Total: 100, Views: 1500
- **Score: 152** (declining)

**Implementation:**
- `lib/trendingAlgorithm.ts`
- Helper functions: `getTrendingShowcases()`, `getMostLikedShowcases()`, `getRecentShowcases()`, `getFeaturedShowcases()`

### Leaderboards

**3 Leaderboard Types:**

**1. 🔥 Most Popular (by votes):**
- Shows transformations with most community votes
- Thumbnail preview + vote count
- Top 10 ranked

**2. 👑 Top Streaks (by days):**
- Users with longest daily streaks
- Streak count + username
- Crown icon for #1, medal for #2-3

**3. 🎮 Most Active (by spins):**
- Users with most total spins
- Spin count + username
- Trophy icons for top performers

**Features:**
- Real-time updates via InstantDB
- "Your Rank" highlighting if in top 10
- Social proof counter ("1,247 players competing")

**Component:**
- `components/roulette/Leaderboard.tsx`

---

## Viral Growth Features

### The Viral Loop

**Flow:**
```
1. User creates transformation
         ↓
2. Submits to showcase
         ↓
3. Gets likes/views from community
         ↓
4. Trending algorithm calculates score
         ↓
5. High score → Featured on homepage ⭐
         ↓
6. New users see Featured section
         ↓
7. Click "Try This Prompt" → Loaded in editor
         ↓
8. Create their own transformation
         ↓
9. Submit to showcase
         ↓
[LOOP REPEATS = VIRAL GROWTH]
```

**Viral Coefficient (K-Factor):**
```
K = (Users who submit) × (Avg showcases per user) × (Viewer conversion rate)

Target Progression:
Month 1: K = 0.25 (not viral yet)
Month 2: K = 0.5 (promising)
Month 3: K = 0.75 (almost viral)
Month 4+: K > 1.0 (VIRAL GROWTH! 🚀)
```

### Growth Mechanics

**1. Content Virality:**
- Shareable transformations
- Before/after visual proof
- Trending badges create FOMO

**2. Social Proof:**
- Likes/views show popularity
- Real-time counters build credibility
- "10k+ users" creates bandwagon effect

**3. Ease of Recreation:**
- "Try This Prompt" button
- One-click copy functionality
- Removes barrier to entry

**4. Gamification:**
- Trending rankings (#1, #2, #3)
- Badges and achievements
- Leaderboard competition

**5. Discovery:**
- Featured on homepage
- Multiple filter tabs (Trending, Featured, Recent)
- Algorithm surfaces best content

**6. Network Effects:**
- More submissions = better content
- Better content = more users
- More users = more submissions

### Progressive Reveal Animation

**Purpose:**
Make each Roulette spin feel like an event, building anticipation.

**3-Stage Animation:**

**Stage 1: Teasing (2 seconds)**
- Animated bouncing sparkle icon ✨
- "Transformation Incoming..." text
- Blur backdrop overlay

**Stage 2: Revealing (2 seconds)**
- Shows category (e.g., "Art Styles")
- Shows prompt (e.g., "Turn into a Van Gogh painting")
- **⭐ RARE TRANSFORMATION badge if rare (5% chance)**
- Animated background shimmer

**Stage 3: Complete (0.5 seconds)**
- "Transformation Complete!" message
- Transitions to result image

**Viral Mechanic:**
- Builds anticipation (lottery-like excitement)
- Rare finds create dopamine rush
- Encourages "just one more spin" behavior
- Creates shareable moments ("I got a RARE!")

**Component:**
- `components/roulette/ProgressiveReveal.tsx`

### Social Sharing

**Purpose:**
Turn users into brand ambassadors with easy sharing.

**Features:**
- 📱 Native mobile share API
- 📋 Copy to clipboard
- 🐦 Twitter direct share
- 📘 Facebook direct share
- 💾 Download branded 1080x1080 image

**Auto-Generated Share Text:**
```
I just got a 🔥 Art Styles transformation on @PicForge!

Prompt: "Turn into a Van Gogh painting"

My 7-day streak 🔥
Total spins: 23

Try it: pic-forge.com/roulette
```

**Branded Image Export:**
- Instagram-ready 1080x1080 format
- PicForge header branding
- Transformation details overlay
- Website URL at bottom
- Professional canvas composition

**Component:**
- `components/roulette/RouletteShareModal.tsx`

**Viral Mechanic:**
- One-click sharing (removes friction)
- Branded exports = free advertising
- Streak bragging creates FOMO
- Referral tracking in URLs

---

## Rate Limits & Costs

### Rate Limiting Strategy

**IP-Based Limits (via Vercel KV):**

| Endpoint | Free Tier | Pro Tier | Window |
|----------|-----------|----------|--------|
| `process-image` (Gemini) | 500/day | Unlimited | 24 hours |
| `process-image-nsfw` (Replicate) | 200/day | Unlimited | 24 hours |
| `generate-canvas` (DALL-E) | 100/day | Unlimited | 24 hours |
| `roast` (Gemini) | 300/day | Unlimited | 24 hours |
| `analyze-image` (Pro only) | 0 | 50/hour | 1 hour |
| `enhance-prompt` (Pro only) | 0 | 30/hour | 1 hour |

**User-Based Limits (via InstantDB):**

| Feature | Free Tier | Pro Tier | Unlimited Tier |
|---------|-----------|----------|----------------|
| Daily Images | 20 | Unlimited | Unlimited |
| Favorites | 50 | Unlimited | Unlimited |
| Showcase Submissions | 10/day | Unlimited | Unlimited |

**Fail-Open Architecture:**
- If Vercel KV is unavailable, APIs still work (vulnerable to abuse)
- Critical security warning documented in `VERCEL_KV_SETUP.md`
- InstantDB limits always enforced

### Cost Breakdown

**AI Provider Costs:**

| Provider | Use Case | Cost Per Image | Monthly (1000 images) |
|----------|----------|----------------|-----------------------|
| **Google Gemini** | Main editor | Free tier | $0 |
| **Anthropic Claude** | Prompt Assistant | ~$0.014/message | ~$14 |
| **Replicate SDXL** | NSFW editor | ~$0.023 | ~$23 |
| **OpenAI DALL-E** | Canvas | $0.040-$0.080 | $40-$80 |
| **Pollinations/HF** | Canvas fallback | Free | $0 |

**Infrastructure Costs:**
- Vercel hosting: Free tier (then $20/month Pro)
- InstantDB: Free tier (then $25/month)
- Stripe: 2.9% + $0.30 per transaction

**Cost Control Measures:**
- Rate limiting on all paid endpoints
- User tier enforcement (Free: 20/day)
- Gemini free tier for 80% of operations
- Client-side Canvas API for batch (free)

---

## Future Roadmap

### Phase 2 Features (Completed in Archive)

**Export Formats:**
- ✅ SVG export with vectorization
- ✅ PDF generation with print presets
- ✅ WebP export
- ✅ ICO (favicon) generation
- ✅ File size estimation

**UI Polish:**
- ✅ Watermark preview system
- ✅ Before/After galleries
- ✅ Featured showcase
- ✅ Social proof counters
- ✅ Trending badges

**Gamification:**
- ✅ Streak tracking
- ✅ Achievement system (16 achievements)
- ✅ Leaderboards (3 types)
- ✅ Progressive reveal animations
- ✅ Social sharing

### Phase 3 (Planned)

**Short Term:**
- [ ] User profiles with showcase galleries
- [ ] Advanced showcase filtering (by category, style tags)
- [ ] Email notifications (trending, likes, comments)
- [ ] Achievement system expansion (25+ achievements)
- [ ] Weekly trending digest

**Medium Term:**
- [ ] True vector export for Cricut (potrace.js)
- [ ] Social sharing Open Graph optimization
- [ ] Referral program with tracking
- [ ] A/B testing framework
- [ ] Analytics dashboard for users

**Long Term:**
- [ ] Cricut-specific export presets
- [ ] Print fulfillment partnerships (Printful, Printify)
- [ ] API access for developers
- [ ] White-label solutions for businesses
- [ ] Mobile app (iOS/Android)

### Experimental Features (Innovation Lab)

**Voice Input:**
- Speak descriptions instead of typing
- Integration with AI Prompt Assistant

**Multi-language Support:**
- Non-English prompt descriptions
- Localized UI

**Collaborative Features:**
- Share favorite prompts with community
- Prompt remix/improvement system
- Team workspaces

**Advanced AI:**
- Multi-image transformations
- Video processing (frame-by-frame)
- 3D model generation

---

## Feature Status Legend

**Symbols Used:**
- ✅ **Complete** - Fully implemented and tested
- 🚀 **Live** - Available in production
- 🔄 **In Progress** - Currently being developed
- 📋 **Planned** - In roadmap, not started
- 🧪 **Experimental** - Beta testing phase
- ❌ **Deprecated** - No longer supported

**Current Status (October 2025):**
- Core Features: ✅ Complete
- Gamification: ✅ Complete
- Viral Growth Features: ✅ Complete
- AI Prompt Assistant: ✅ Complete (Pro only)
- Export Formats: ✅ Complete
- Mobile App: 📋 Planned

---

## Feature Integration Points

**Key Files:**
- `lib/instantdb.ts` - Database schema (11 entities)
- `lib/prompts.ts` - 325+ AI prompt definitions
- `lib/imageProcessor.ts` - Client-side Canvas operations
- `lib/imageEffects.ts` - 21 effect definitions
- `lib/watermark.ts` - Watermark application
- `lib/trendingAlgorithm.ts` - Trending scoring
- `hooks/useImageTracking.ts` - Usage limits, favorites
- `hooks/usePromoCode.ts` - Promo code redemption
- `hooks/useRouletteGame.ts` - Roulette game state
- `hooks/useShowcaseVotes.ts` - Showcase voting

**Critical API Routes:**
- `app/api/process-image/route.ts` - Main Gemini transformation
- `app/api/process-image-nsfw/route.ts` - Replicate NSFW processing
- `app/api/analyze-image/route.ts` - Gemini Vision analysis (Pro)
- `app/api/enhance-prompt/route.ts` - Claude prompt enhancement (Pro)
- `app/api/generate-canvas/route.ts` - DALL-E generation
- `app/api/roast/route.ts` - AI photo roasting
- `app/api/track-visitor/route.ts` - Analytics
- `app/api/track-share/route.ts` - Share tracking
- `app/api/track-template/route.ts` - Template usage

**InstantDB Entities:**
- `users` - User accounts
- `images` - Image transformations
- `favorites` - Favorited images
- `usage` - Daily usage tracking
- `promoCodes` - Promo code redemption
- `showcaseSubmissions` - Community gallery
- `showcaseLikes` - Showcase likes
- `rouletteStreaks` - Daily streak tracking
- `rouletteAchievements` - Achievement unlocks
- `rouletteSpins` - Spin history
- `rouletteVotes` - Community voting
- `referrals` - Referral tracking
- `emailPreferences` - Email settings

---

**For detailed setup instructions, see:** [`docs/SETUP.md`](./SETUP.md)
**For architecture details, see:** [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) (if exists)
**For development guide, see:** [`CLAUDE.md`](../CLAUDE.md)

---

*Last updated: 2025-10-31*
*Documentation version: 1.0*
