# PicForge - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** 2025-10-10
**Status:** Live Product with Active Development
**Product Owner:** Derek Bobola
**Live URL:** https://www.pic-forge.com

---

## Executive Summary

PicForge is an AI-powered image transformation platform that democratizes creative image editing through prompt-based transformations. The platform eliminates the need for artistic skills by allowing users to describe desired changes in natural language, with AI handling the heavy lifting.

**Headline:** (re)Imagine. Everything.
**Tagline:** Nothing is real anymore.
**Mission:** Make professional-grade AI image transformation accessible to everyone, regardless of artistic ability.

---

## Product Vision & Goals

### Vision
Become the go-to platform for AI-powered image transformation, combining ease of use with powerful creative capabilities.

### Business Goals
- **Growth:** Achieve viral organic growth through free tier and shareable results
- **Revenue:** Implement freemium model covering API costs + profit (Target: $2,500/mo by Q2 2026)
- **Engagement:** Drive daily active usage through gamification features
- **Market Position:** Establish as the "fun, edgy alternative" to corporate image editors

### User Goals
- Transform images without learning complex software
- Explore creative possibilities quickly
- Share impressive transformations on social media
- Access professional-quality effects for free (with limits)

---

## Target Audience

### Primary Users
- **Social Media Creators** - Need quick, eye-catching transformations for content
- **Casual Creatives** - Want to experiment without learning Photoshop
- **Meme Makers** - Looking for fast, funny, and weird transformations
- **Small Business Owners** - Need professional-looking images on a budget

### Secondary Users
- **Content Marketers** - Require batch processing for campaigns
- **Artists/Designers** - Using for inspiration and rapid prototyping
- **Hobbyists** - Exploring AI capabilities for personal projects

### User Personas
**"Sarah the Social Media Manager"**
- Age: 28, manages Instagram for local businesses
- Needs: Quick transformations, batch processing, consistent quality
- Pain Point: Limited time and budget for content creation

**"Mike the Meme Lord"**
- Age: 24, creates viral content for fun
- Needs: Weird effects, fast results, easy sharing
- Pain Point: Most tools are too serious or complicated

**"Jessica the Small Business Owner"**
- Age: 35, runs online jewelry store
- Needs: Professional product photos, seasonal themes
- Pain Point: Can't afford professional photography

---

## Current Feature Status

### ✅ LIVE & OPERATIONAL

#### Core Editing Features
| Feature | Status | Route | Notes |
|---------|--------|-------|-------|
| Single Image Editor | ✅ Live | `/` | 210+ templates, Lock Composition feature |
| Batch Processor | ✅ Live | `/batch` | 21 effects, 100+ images simultaneously |
| AI Canvas Generator | ✅ Live | `/canvas` | Text-to-image generation |
| Prompt Wizard | ✅ Live | `/prompt-wizard` | 5-step guided prompt builder |

#### Gamification Features
| Feature | Status | Route | Notes |
|---------|--------|-------|-------|
| Transform Roulette | ✅ Live | `/roulette` | 8 categories, 320+ prompts including Banksy |
| Roast Mode | ✅ Live | `/roast` | 3 intensity levels (mild/spicy/nuclear) |

#### Resource Pages
| Feature | Status | Route | Notes |
|---------|--------|-------|-------|
| Templates Gallery | ✅ Live | `/examples` | 110+ sample transformations |
| Prompts Library | ✅ Live | `/prompts` | 211 categorized prompts |
| Tips & Tricks | ✅ Live | `/tips` | Best practices guide |
| Showcase Gallery | ✅ Live | `/showcase` | User-submitted transformations |

#### UX Enhancements
| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Lock Composition | ✅ Live | Main editor | Preserves composition during iterative edits |
| Creative Journey | ✅ Live | Main editor | Masonry gallery of edit history |
| Download All | ✅ Live | Main editor | Bulk export to ZIP |
| Before/After Slider | ✅ Live | Main editor | Interactive comparison view |
| Prompt of the Day | ✅ Live | Homepage | Daily featured prompt with examples |
| Drag & Drop Upload | ✅ Live | All editors | Including Ctrl+V paste support |

#### Technical Infrastructure
| Feature | Status | Notes |
|---------|--------|-------|
| Rate Limiting | ✅ Live | 500 images/day per IP |
| Analytics Tracking | ✅ Live | Vercel KV for visitor/template tracking |
| Multi-AI Provider | ✅ Live | Gemini, Replicate, OpenAI, Pollinations |
| Client-Side Processing | ✅ Live | 80% operations free (Canvas API) |

---

### 🚧 IN DEVELOPMENT

#### NSFW Content Features
| Feature | Status | Route | Target Launch |
|---------|--------|-------|---------------|
| 18+ Editor | 🚧 Coming Soon Page | `/editor-nsfw` | Q1 2026 |
| 18+ Batch | 🚧 Built but Restricted | `/batch-nsfw` | Q1 2026 (with 18+ Editor) |

**Technical Status:**
- `/editor-nsfw` displays ribbon-style "Coming Soon" page ✅
- `/batch-nsfw` is functionally complete but access restricted ✅
- Replicate SDXL integration tested and working ✅
- Legal disclaimers and age verification language drafted ✅

**Blocking Issues:**
- Age verification system not yet implemented
- Cost structure needs refinement (~$0.023/image via Replicate)
- Terms of Service needs legal review for adult content

---

### 📋 PLANNED FEATURES (Documented)

#### Priority: HIGH (Quick Wins)
**Prompt Quality Feedback** - [future-adds/prompt-quality-feedback.md]
- Real-time suggestions as users type prompts
- Estimated implementation: ~15 minutes
- Value: Improved output quality, reduced failed generations

#### Priority: MEDIUM
**Side-by-Side Variant Comparison** - [future-adds/variant-comparison.md]
- Generate 2-3 variations simultaneously
- Estimated implementation: ~20 minutes
- Value: Better results, A/B testing built-in

**Region-Aware Editing** - [future-adds/region-aware-editing.md]
- Select specific areas for targeted AI edits
- Estimated implementation: ~30 minutes
- Value: More precise control, professional workflows

#### Priority: FUTURE
**Monetization (Freemium Model)** - [future-adds/monetization-strategy.md]
- Free tier: 10 images/day with watermark
- Pro tier: $4.99/month for 500 images
- Requires: User accounts, Stripe integration, usage tracking
- Target launch: Q2 2026

---

### ❓ GAPS & MISSING FEATURES

Based on comparing documentation vs. live site:

#### Documentation Gaps
- ❌ No user stories or acceptance criteria
- ❌ No formal testing requirements
- ❌ No competitive analysis documented
- ❌ No success metrics/KPIs defined
- ❌ No error handling specifications
- ❌ No accessibility requirements (WCAG compliance)

#### Feature Gaps (Not in Docs or Live)
- ❌ User accounts/authentication (required for monetization)
- ❌ Payment processing (Stripe integration)
- ❌ Image history/favorites (requires auth)
- ❌ API access for developers
- ❌ Mobile app (PWA or native)
- ❌ Advanced editing tools (layers, masks, blend modes)
- ❌ Video transformation capabilities
- ❌ Collaboration features (share projects, comments)

#### Technical Debt
- ⚠️ No formal test suite (manual testing only)
- ⚠️ Rate limiting is in-memory (won't scale horizontally)
- ⚠️ No error monitoring/logging service (e.g., Sentry)
- ⚠️ No A/B testing framework
- ⚠️ No performance monitoring

---

## User Stories & Acceptance Criteria

### Epic 1: Core Image Transformation

**US-001: Single Image Upload**
- **As a** user
- **I want to** upload an image via drag-drop, file picker, or paste
- **So that** I can quickly start editing

**Acceptance Criteria:**
- ✅ User can drag and drop image onto upload zone
- ✅ User can click to open file picker
- ✅ User can paste image with Ctrl+V
- ✅ Supported formats: JPG, PNG, WebP, GIF
- ✅ Max file size: 10MB
- ✅ Shows upload progress indicator
- ✅ Displays error message for unsupported formats

**US-002: Apply AI Transformation**
- **As a** user
- **I want to** enter a text prompt describing desired changes
- **So that** AI can transform my image

**Acceptance Criteria:**
- ✅ Prompt input field supports multi-line text
- ✅ User can select from 210+ template prompts
- ✅ "Lock Composition" checkbox prevents structural changes
- ✅ Processing shows progress indicator
- ✅ Rate limit enforced (500/day per IP)
- ✅ Error messages displayed for failed generations
- ✅ Result displayed with before/after comparison

---

### Epic 2: Batch Processing

**US-010: Bulk Upload**
- **As a** user managing multiple images
- **I want to** upload 100+ images at once
- **So that** I can process them simultaneously

**Acceptance Criteria:**
- ✅ Supports drag-drop of multiple files
- ✅ Shows upload progress for each file
- ✅ Displays thumbnail preview of uploaded images
- ✅ Allows removal of individual images before processing
- ✅ No hard limit on image count

**US-011: Apply Effect to All**
- **As a** user
- **I want to** select one effect and apply it to all images
- **So that** I maintain consistency across a batch

**Acceptance Criteria:**
- ✅ 21 client-side effects available (sharpen, vignette, glitch, etc.)
- ✅ Effect previews on one image before applying to all
- ✅ Sequential processing with queue system
- ✅ Priority queue support (process selected images first)
- ✅ Export presets: Web Optimized, Social Media, High Quality, Thumbnail

---

### Epic 3: Gamification

**US-020: Random Transformation (Roulette)**
- **As a** user wanting inspiration
- **I want to** spin a wheel for random transformation
- **So that** I discover unexpected creative results

**Acceptance Criteria:**
- ✅ Wheel displays 8 categories visually
- ✅ Animation plays during spin
- ✅ 320+ unique prompts across all categories
- ✅ Result applied automatically after spin
- ✅ User can re-spin or manually edit prompt

**US-021: Photo Roasting**
- **As a** user wanting entertainment
- **I want** AI to humorously critique my photo
- **So that** I can share funny roasts with friends

**Acceptance Criteria:**
- ✅ 3 intensity levels: Mild, Spicy, Nuclear
- ✅ Roast generated via AI (not templates)
- ✅ Results are humorous but not genuinely mean
- ✅ Easy social sharing of roast text + image
- ✅ Content moderation prevents genuinely harmful roasts

---

## Technical Requirements

### Architecture

**Frontend:**
- Framework: Next.js 15 (App Router) with Turbopack
- Styling: Tailwind CSS
- State Management: React hooks (useState, useEffect)
- Image Processing: Canvas API (client-side)

**Backend:**
- API Routes: Next.js API Routes
- AI Providers:
  - Google Gemini Vision API (primary, blocks NSFW)
  - Replicate SDXL (NSFW content, ~$0.023/image)
  - OpenAI DALL-E (canvas generation)
  - Pollinations AI (free alternative)
- Rate Limiting: In-memory (500/day per IP)
- Analytics: Vercel KV

**Deployment:**
- Platform: Vercel
- Auto-deploy: Main branch
- Environment: Production + Preview
- CDN: Vercel Edge Network

### Performance Requirements

| Metric | Target | Current Status |
|--------|--------|----------------|
| Page Load (First Paint) | < 2s | ✅ Achieved |
| Image Upload (10MB) | < 5s | ✅ Achieved |
| AI Transformation (Standard) | < 15s | ✅ Achieved |
| Batch Processing (100 images) | < 5min | ✅ Achieved |
| Lighthouse Score | > 90 | ⚠️ Unknown (needs audit) |

### Security Requirements

- ✅ HTTPS enforced on all pages
- ✅ API keys stored in environment variables (not in code)
- ✅ Rate limiting prevents abuse
- ✅ No image storage (ephemeral processing only)
- ✅ CORS configured for API routes
- ⚠️ No authentication system yet (planned)
- ⚠️ No age verification for NSFW content (planned)
- ⚠️ No CSP headers configured

### Browser Compatibility

**Supported:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Chrome/Safari (iOS 14+, Android 10+)

**Required Features:**
- Canvas API (for client-side processing)
- FileReader API (for image uploads)
- Fetch API (for server communication)
- ES6+ JavaScript

---

## Success Metrics & KPIs

### Current Tracking (Vercel KV)
- ✅ Daily active visitors
- ✅ Template usage counts
- ✅ Share button clicks
- ✅ Page views per session

### Missing Metrics (Need Implementation)
- ❌ User conversion rate (free → pro)
- ❌ Average images per user
- ❌ Prompt success rate (good results vs. regenerations)
- ❌ Feature adoption rate (which features are used)
- ❌ User retention (7-day, 30-day)
- ❌ Viral coefficient (shares → new users)
- ❌ API cost per user
- ❌ Revenue per user (when monetized)

### Target KPIs (6 Months Post-Monetization)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Free → Pro Conversion | 3% | Industry standard for freemium tools |
| Monthly Churn Rate | < 10% | Keep most paying users |
| Daily Active Users | 5,000+ | Sustainable user base |
| Images Generated/Day | 50,000+ | High engagement |
| Avg Revenue Per User | $5/month | Pro tier pricing |
| Monthly Profit | $2,500+ | Covers costs + growth capital |

---

## Competitive Analysis

### Direct Competitors

**Canva (AI Features)**
- Strengths: Brand recognition, integrated design tools, enterprise plans
- Weaknesses: Complex UI, expensive for casual users, limited AI freedom
- Positioning: PicForge is faster, edgier, and more focused on AI transformations

**Photoleap (Lightricks)**
- Strengths: Mobile-first, influencer marketing, strong brand
- Weaknesses: Mobile-only, subscription required, less prompt flexibility
- Positioning: PicForge is web-based, more affordable, and more experimental

**Remove.bg / Cleanup.pictures**
- Strengths: Single-purpose excellence, viral growth
- Weaknesses: Limited to one function, no creative transformations
- Positioning: PicForge offers broader creative capabilities

### Indirect Competitors

**Midjourney / DALL-E**
- Strengths: Best-in-class generation quality
- Weaknesses: No img2img focus, expensive, requires Discord/account
- Positioning: PicForge specializes in transforming existing images

**Photoshop (Generative Fill)**
- Strengths: Industry standard, professional tools
- Weaknesses: Expensive, complex, steep learning curve
- Positioning: PicForge is instant, no learning required

### Competitive Advantages

1. **Prompt-Based Simplicity** - No complex tools to learn
2. **Gamification** - Roulette/Roast mode drive engagement
3. **Free Tier** - 500 images/day removes barrier to entry
4. **Speed** - 80% operations client-side (instant results)
5. **Brand Voice** - Edgy, fun, anti-corporate
6. **Batch Processing** - 100+ images simultaneously
7. **Multiple AI Providers** - Fallback options if one fails

---

## Roadmap

### Q4 2025 (Current)
- ✅ All core features live
- ✅ Gamification features launched
- ✅ Templates library expanded to 210+
- 🚧 18+ Editor coming soon page live
- 🚧 Documentation and PRD completed

### Q1 2026
- 🎯 Launch 18+ Editor with age verification
- 🎯 Implement Prompt Quality Feedback (quick win)
- 🎯 Add Variant Comparison feature
- 🎯 Begin user authentication development
- 🎯 Conduct security audit

### Q2 2026
- 🎯 Launch freemium monetization
- 🎯 Integrate Stripe payment processing
- 🎯 Add user dashboard with usage stats
- 🎯 Implement Region-Aware Editing
- 🎯 Add high-resolution download upsell

### Q3 2026
- 🎯 Launch API access for developers
- 🎯 Add enterprise/white-label tier
- 🎯 Implement custom template marketplace
- 🎯 Add video transformation (beta)
- 🎯 Mobile app (PWA) optimization

### Q4 2026
- 🎯 Collaboration features (shared projects)
- 🎯 Advanced editing tools (layers, masks)
- 🎯 International expansion (multi-language)
- 🎯 AI model fine-tuning (custom styles)

---

## Open Questions & Decisions Needed

### Technical
- [ ] **Should we migrate rate limiting to Redis/DB for horizontal scaling?**
  - Current: In-memory (doesn't scale across multiple servers)
  - Impact: High if traffic spikes
  - Decision deadline: Before significant growth

- [ ] **Which authentication provider should we use?**
  - Options: NextAuth.js, Clerk, Supabase Auth, Auth0
  - Considerations: Cost, ease of integration, social login support
  - Decision deadline: Q1 2026 (before monetization)

- [ ] **Should we build a native mobile app or optimize PWA?**
  - PWA pros: Single codebase, instant updates
  - Native pros: Better performance, App Store discovery
  - Decision deadline: Q3 2026

### Business
- [ ] **What age verification system for 18+ content?**
  - Options: Third-party (Yoti, Jumio), credit card verification, government ID upload
  - Considerations: Cost, user friction, legal compliance
  - Decision deadline: Before Q1 2026 launch

- [ ] **Should we allow user-uploaded templates for revenue share?**
  - Pros: More content, community engagement, passive income
  - Cons: Moderation required, quality control, copyright issues
  - Decision deadline: Q2 2026

- [ ] **Enterprise pricing strategy?**
  - API access at $99/month sufficient?
  - White-label pricing model?
  - Decision deadline: Q3 2026

### Product
- [ ] **Should free tier have watermarks?**
  - Pros: Viral marketing, premium differentiation
  - Cons: User friction, may reduce sharing
  - Decision deadline: Before monetization launch

- [ ] **What happens to existing users when we add auth?**
  - Grandfather in unlimited free access?
  - Require migration to free tier limits?
  - Decision deadline: Q2 2026

---

## Risk Assessment

### High Risk

**🔴 API Cost Overruns**
- Risk: Viral growth without monetization could bankrupt project
- Likelihood: Medium (if featured on Product Hunt, Reddit, etc.)
- Impact: High (project shutdown)
- Mitigation:
  - Current rate limiting (500/day)
  - Monitor daily costs closely
  - Emergency killswitch for free tier
  - Accelerate monetization if traffic spikes

**🔴 Legal Issues with NSFW Content**
- Risk: Hosting/generating illegal content, DMCA takedowns
- Likelihood: Medium (any platform with NSFW features faces this)
- Impact: High (liability, platform bans)
- Mitigation:
  - Age verification required
  - Clear Terms of Service and disclaimers
  - No content storage (ephemeral only)
  - Legal review before 18+ launch
  - Content moderation tools

### Medium Risk

**🟡 AI Provider Changes**
- Risk: Gemini API price increases or policy changes
- Likelihood: Medium (Google has changed pricing before)
- Impact: Medium (need to migrate or raise prices)
- Mitigation:
  - Multi-provider architecture already in place
  - Can switch to Replicate, OpenAI, or others
  - Monitor provider announcements

**🟡 Competition from Big Tech**
- Risk: Adobe/Canva copy core features
- Likelihood: High (already happening with Generative Fill)
- Impact: Medium (harder to differentiate, pricing pressure)
- Mitigation:
  - Move fast, innovate constantly
  - Build community and brand loyalty
  - Focus on niche use cases (gamification, batch)

### Low Risk

**🟢 Technical Scalability**
- Risk: Site crashes under high load
- Likelihood: Low (Vercel scales automatically)
- Impact: Medium (lost users, bad reputation)
- Mitigation:
  - Already on Vercel (handles spikes well)
  - Client-side processing reduces server load
  - Can add caching/CDN as needed

---

## Appendix

### Related Documentation
- [CLAUDE.md](./CLAUDE.md) - Technical architecture and development guide
- [README.md](./README.md) - Project overview and feature list
- [future-adds/README.md](./future-adds/README.md) - Planned feature details
- [future-adds/monetization-strategy.md](./future-adds/monetization-strategy.md) - Pricing model
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Authentication setup notes
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database configuration

### Glossary
- **Lock Composition**: Feature that preserves image structure during AI edits
- **Creative Journey**: Visual gallery showing all edit versions
- **Prompt of the Day**: Featured prompt displayed on homepage
- **Transform Roulette**: Gamified random transformation feature
- **Roast Mode**: AI generates humorous critiques of photos
- **18+ Editor**: Unrestricted editor for adult/graphic content
- **Batch Processor**: Tool for processing 100+ images simultaneously

### Change Log
- **2025-10-10**: Initial PRD created, documented all live features and gaps
- **Future**: Update after each major release

---

**Document Status:** ✅ COMPLETE
**Next Review Date:** After Q1 2026 feature launches

