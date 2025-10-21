# Product Requirements Document: Business Logo Platform
## Sister Site to Pic-Forge.com

**Product Name:** [TBD - BrandForge / LogoSmith / SignForge]
**Target Launch:** Q2 2026
**Document Version:** 1.0
**Last Updated:** October 9, 2025

---

## Executive Summary

A sister platform to Pic-Forge.com focused on business branding needs. While Pic-Forge targets creative consumers with "break reality" transformations, this platform serves businesses needing professional logo creation, mockups, and branding assets.

**Core Value Proposition:**
"From idea to branded storefront in 24 hours. AI-powered logo creation + instant mockups across 100+ touchpoints."

---

## Market Opportunity

### Target Market Size
- **Small businesses in USA:** 33.2 million
- **New business formations:** 5.5 million/year
- **Average spend on branding:** $2,500 - $15,000 per business
- **DIY market (Canva, Looka, etc.):** $500M+ annually

### Customer Segments

#### 1. New Business Owners (Primary)
- **Size:** 5.5M new businesses/year
- **Pain:** Need logo + branding before launch
- **Budget:** $200-2,000
- **Timeline:** Need it yesterday
- **Current solution:** Fiverr ($50-500), Canva ($12.99/mo), or local designer ($2K-15K)

#### 2. Franchise Owners (Secondary)
- **Size:** 800K+ franchise units in USA
- **Pain:** Corporate logo but need local signage/marketing
- **Budget:** $500-5,000/year for local marketing
- **Timeline:** Ongoing need
- **Current solution:** Corporate marketing dept + local print shops

#### 3. Rebranding Businesses (Tertiary)
- **Size:** 2M businesses rebrand yearly
- **Pain:** Need to see logo across all materials before committing
- **Budget:** $5,000-50,000
- **Timeline:** 3-6 months decision cycle
- **Current solution:** Branding agency

---

## Product Vision

### What It Is
A platform where businesses can:
1. Generate professional logos via AI (or upload existing)
2. Instantly see logo placed on 100+ mockups (signage, products, locations, vehicles, uniforms, etc.)
3. Download print-ready files for all branding touchpoints
4. Get "brand kits" with color palettes, fonts, usage guidelines

### What It's NOT
- ❌ Not a design agency (no 1-on-1 consulting)
- ❌ Not a printing service (we don't manufacture)
- ❌ Not a website builder (focused on visual brand assets only)
- ❌ Not another Canva clone (specialized for logo deployment)

### Differentiation from Pic-Forge
| Pic-Forge | Sister Site |
|-----------|-------------|
| Consumer fun | Business professional |
| "Break reality" | "Build credibility" |
| Photo transformations | Logo creation + mockups |
| Personal use | Commercial use |
| $12-29/mo | $99-299/mo |
| Weird & epic | Clean & trustworthy |

---

## Core Features (MVP)

### Feature 1: AI Logo Generator
**Description:** Create professional logos from text prompts

**User Flow:**
1. User enters business name + industry
2. AI suggests 5 logo concepts (text-based, icon-based, combination)
3. User selects favorite, customizes colors/fonts
4. AI generates 10 variations
5. User finalizes and gets vector files

**Technical Requirements:**
- Integration with Flux, DALL-E 3, or Midjourney API
- Vector conversion (PNG → SVG automatic)
- Font licensing system
- Color palette generator
- Brand guideline auto-generation

**Success Metrics:**
- 80%+ users find acceptable logo in first 10 generations
- <5 minutes from prompt to selected logo
- 90%+ satisfaction with vector quality

---

### Feature 2: Smart Logo Upload
**Description:** Upload existing logo, AI cleans and vectorizes

**User Flow:**
1. Upload low-res logo (JPEG, PNG)
2. AI removes background, upscales, vectorizes
3. Suggests color palette extraction
4. Outputs print-ready files (SVG, PNG, EPS, PDF)

**Technical Requirements:**
- Background removal (remove.bg or similar)
- Image upscaling (Real-ESRGAN or Topaz)
- Auto-vectorization (Adobe Vectorizer API or Vectorizer.AI)
- Color extraction algorithm
- File format conversion pipeline

**Success Metrics:**
- 95%+ clean background removal
- Vector output usable for print (300+ DPI)
- <2 minutes processing time

---

### Feature 3: Mockup Generator (Core Differentiator)
**Description:** Instantly place logo on 100+ mockups

**Mockup Categories:**
1. **Signage** (20 mockups)
   - Storefront signs
   - Window decals
   - Yard signs
   - Monument signs
   - Channel letters
   - Neon signs
   - A-frames
   - Banners

2. **Vehicles** (15 mockups)
   - Van wraps
   - Truck doors
   - Car magnets
   - Fleet graphics
   - Delivery vehicles

3. **Apparel** (15 mockups)
   - T-shirts
   - Polos
   - Hats
   - Aprons
   - Uniforms
   - Jackets

4. **Print Materials** (20 mockups)
   - Business cards
   - Letterhead
   - Envelopes
   - Brochures
   - Flyers
   - Posters
   - Banners

5. **Products** (15 mockups)
   - Packaging boxes
   - Labels
   - Stickers
   - Bags
   - Coffee cups
   - Water bottles

6. **Digital** (10 mockups)
   - Website headers
   - Social media profiles
   - Email signatures
   - Zoom backgrounds
   - App icons

7. **Location** (5 mockups)
   - Office wall
   - Reception desk
   - Trade show booth
   - Storefront window
   - Billboard

**User Flow:**
1. User uploads/generates logo
2. Selects mockup category
3. AI automatically places logo with proper perspective
4. User adjusts size/position if needed
5. Download high-res mockup (4K)

**Technical Requirements:**
- Perspective transformation algorithm
- Smart placement AI (knows where logos go)
- Shadow/lighting simulation
- Batch mockup generation (all 100+ at once)
- Export in presentation format (PDF or PPTX)

**Success Metrics:**
- Logo placement looks "realistic" 90%+ of time
- <30 seconds to generate all 100 mockups
- 95%+ users download at least 10 mockups

---

### Feature 4: Brand Kit Generator
**Description:** Auto-create professional brand guidelines

**Includes:**
- Logo variations (horizontal, vertical, icon-only, white version)
- Color palette (hex, RGB, CMYK values)
- Typography (font names, sizes, weights)
- Usage rules (minimum sizes, spacing, don'ts)
- File formats (SVG, PNG, EPS, PDF, AI)

**Output Format:**
- PDF brand guidelines (10-20 pages)
- Editable Canva template
- Google Slides template
- Figma file

**Technical Requirements:**
- Auto-layout system for brand books
- Template engine for guidelines
- Font licensing integration
- Multi-format export pipeline

**Success Metrics:**
- Brand kit generated in <60 seconds
- Looks "professional" enough to send to vendors
- 80%+ users download brand kit

---

### Feature 5: Print Specs Generator
**Description:** Output files ready for print vendors

**Specifications:**
- **Resolution:** 300 DPI minimum
- **Color modes:** RGB (screen), CMYK (print)
- **Formats:** EPS, PDF, SVG, PNG, AI, PSD
- **Bleed settings:** Auto-add 0.125" bleed
- **Safe zones:** Mark trim and safe areas

**Pre-configured Templates:**
- Business cards (3.5" x 2")
- Letterhead (8.5" x 11")
- Banners (various sizes)
- T-shirt prints (12" x 16")
- Vehicle wraps (custom dimensions)
- Signage (24" x 36", 48" x 96", etc.)

**Success Metrics:**
- 98%+ files accepted by print vendors without revision
- Zero complaints about resolution/quality
- <1% support tickets about file formats

---

## User Experience

### Onboarding Flow
1. **Welcome Screen**
   - "What do you need today?"
   - Options: Create logo | Upload existing logo | Browse mockups

2. **Business Info Collection**
   - Business name
   - Industry (dropdown)
   - Brand personality (professional, playful, luxury, etc.)
   - Color preferences (optional)

3. **Logo Creation/Upload**
   - Generate logos OR upload existing
   - Customize if generated
   - Approve final version

4. **Mockup Magic**
   - "Let's see your logo everywhere"
   - Auto-generate 100+ mockups
   - Browse categories
   - Favorite mockups

5. **Download Center**
   - Select files to download
   - Choose formats
   - Get brand kit

### Key Pages

#### Dashboard
- Recent projects
- Quick actions (new logo, new mockup batch)
- Usage stats (downloads remaining)
- Gallery of saved mockups

#### Logo Editor
- Canvas for logo design
- Color picker
- Font selector
- Icon library
- Variation generator

#### Mockup Gallery
- Filter by category
- Search mockups
- Preview before applying logo
- Batch select for download

#### Brand Kit
- Preview all assets
- Download individual files
- Download complete kit
- Share link with team/vendors

---

## Technical Architecture

### Tech Stack Recommendations

**Frontend:**
- Next.js 14+ (TypeScript)
- Tailwind CSS
- Radix UI components
- Framer Motion (animations)

**Backend:**
- Next.js API routes
- PostgreSQL (database)
- Prisma (ORM)
- Redis (caching)

**AI/Image Processing:**
- fal.ai (logo generation)
- Replicate (image processing)
- Sharp (server-side image manipulation)
- OpenCV (perspective transforms)

**File Storage:**
- Cloudflare R2 or AWS S3
- CDN for mockup templates

**Payments:**
- Stripe (subscriptions + one-time)

**Email:**
- Resend or Postmark

**Analytics:**
- Plausible or PostHog

### Data Models

#### User
```typescript
{
  id: string
  email: string
  name: string
  plan: 'starter' | 'professional' | 'enterprise'
  credits: number
  createdAt: datetime
  subscription: Subscription
}
```

#### Project
```typescript
{
  id: string
  userId: string
  name: string
  businessName: string
  industry: string
  logoUrl: string
  colorPalette: string[]
  fonts: string[]
  brandKit: BrandKit
  mockups: Mockup[]
  createdAt: datetime
}
```

#### Mockup
```typescript
{
  id: string
  projectId: string
  category: string
  templateId: string
  imageUrl: string
  settings: json
  favorites: boolean
  downloads: number
}
```

---

## Pricing Strategy

### Tier 1: Starter ($99 one-time)
**Target:** Brand new businesses, side hustlers
- 1 logo creation OR upload
- 50 mockup downloads
- Basic brand kit
- PNG/JPG files only
- 30-day access to project

### Tier 2: Professional ($49/month or $399/year)
**Target:** Established small businesses, solopreneurs
- 3 logo projects/month
- Unlimited mockup generation
- All file formats (SVG, EPS, PDF, etc.)
- Full brand kit with guidelines
- Commercial license
- Priority support

### Tier 3: Enterprise ($299/month)
**Target:** Agencies, franchises, multi-location businesses
- Unlimited logo projects
- Unlimited mockups
- API access
- White-label option
- Team accounts (5 users)
- Custom mockup requests (5/month)
- Dedicated account manager

### Add-ons
- Extra mockup categories: $29/category
- Rush processing (1 hour): $49
- Custom mockup creation: $99 each
- Designer review service: $199 (human designer feedback)

---

## Go-to-Market Strategy

### Phase 1: Soft Launch (Month 1-2)
**Goal:** Get 100 beta users, validate product-market fit

**Tactics:**
- Reddit (r/smallbusiness, r/entrepreneur)
- Facebook groups (new business owners)
- Offer 50% lifetime discount to first 100 users
- Collect testimonials and case studies

**Success Criteria:**
- 100 paid users
- 4.5+ star average rating
- <5% refund rate
- 3+ video testimonials

### Phase 2: Content Marketing (Month 3-6)
**Goal:** SEO + organic traffic

**Content Strategy:**
- Blog posts: "How to design a logo for [industry]"
- Video tutorials: "Logo to storefront in 10 minutes"
- Comparison guides: "BrandForge vs Fiverr vs Design Agency"
- Industry spotlights: "Best logos for restaurants"

**Distribution:**
- YouTube tutorials
- TikTok before/afters
- LinkedIn thought leadership
- Pinterest mockup gallery

### Phase 3: Paid Acquisition (Month 6-12)
**Goal:** Scale to 1,000 paying customers

**Channels:**
- Google Ads (keywords: "logo creator", "business branding")
- Facebook Ads (target: new business owners)
- Instagram Ads (visual mockup gallery)
- LinkedIn Ads (B2B, franchise owners)

**Budget Allocation:**
- $5K/month initial
- Target CAC: <$50
- Target LTV: $500+

### Phase 4: Partnerships (Month 12+)
**Goal:** Embed into business formation flows

**Partners:**
- LegalZoom (LLC formation + branding package)
- ZenBusiness (business formation)
- Shopify (e-commerce branding)
- Local Chambers of Commerce
- SCORE (small business mentoring)

---

## Competitive Analysis

### Direct Competitors

#### 1. Looka (formerly Logojoy)
- **Strengths:** AI logo generation, good UI
- **Weaknesses:** Limited mockups (20), expensive ($20/mo + $65 for files)
- **Our Advantage:** 5x more mockups, better mockup realism

#### 2. Tailor Brands
- **Strengths:** Full branding suite, website builder
- **Weaknesses:** Overwhelming, expensive ($50+/mo), cluttered
- **Our Advantage:** Focused, faster, cheaper

#### 3. Fiverr
- **Strengths:** Human designers, unlimited revisions
- **Weaknesses:** Slow (3-7 days), inconsistent quality, $50-500
- **Our Advantage:** Instant, consistent, predictable

#### 4. 99designs
- **Strengths:** Design contests, high quality
- **Weaknesses:** Expensive ($299-1299), slow (1-2 weeks)
- **Our Advantage:** 10x faster, 10x cheaper

### Positioning
**We are:** The fastest way to go from logo idea to branded business
**We are NOT:** A design agency, website builder, or printing service
**Best for:** Businesses that need professional branding NOW, not in 2 weeks

---

## Success Metrics (12 Month Goals)

### User Metrics
- **1,000 paid customers** by month 12
- **$49 average monthly revenue per user** (ARPU)
- **70% annual retention rate**
- **<10% monthly churn**

### Product Metrics
- **4.5+ star rating** on reviews
- **80%+ logo approval rate** (users happy with generated logo)
- **50+ average mockup downloads** per project
- **<3% refund rate**

### Business Metrics
- **$49K MRR** by month 12
- **$588K ARR** by year-end
- **<$50 CAC** (customer acquisition cost)
- **10:1 LTV:CAC ratio**

### Engagement Metrics
- **2.5 projects per user** average
- **100+ mockups generated** per project
- **30% users download brand kit**
- **15% users upgrade within 3 months**

---

## Risks & Mitigation

### Risk 1: AI Logo Quality
**Risk:** Generated logos look "obviously AI" or unprofessional
**Mitigation:**
- Human designer review for Pro/Enterprise tiers
- Curated prompt engineering
- Logo variation system to increase options
- "Designer polish" add-on service

### Risk 2: Legal/Licensing Issues
**Risk:** Font licensing, trademark conflicts
**Mitigation:**
- Only use commercially licensed fonts
- Trademark search integration (USPTO API)
- Clear T&C on commercial use rights
- Partner with LegalZoom for trademark filing

### Risk 3: Mockup Realism
**Risk:** Mockups look fake, users lose trust
**Mitigation:**
- Use high-quality mockup templates
- Smart perspective AI (not just paste)
- Shadow/lighting simulation
- Manual adjustment tools

### Risk 4: Market Saturation
**Risk:** Too many logo platforms already exist
**Mitigation:**
- Differentiate with mockup volume (100+ vs 20)
- Focus on specific industries (restaurants, retail, services)
- Partnership distribution channel
- Speed as competitive moat (instant vs 3-7 days)

---

## Future Roadmap (Post-MVP)

### Phase 2 Features (Month 6-12)
- **Custom mockup requests** (user submits photo, we create template)
- **Industry-specific templates** (restaurant package, retail package, etc.)
- **Social media calendar** (auto-generate branded posts for 30 days)
- **Print vendor integration** (send files directly to VistaPrint, Sticker Mule)
- **Website template export** (branded Webflow/Framer templates)

### Phase 3 Features (Year 2)
- **Team collaboration** (multiple users per account)
- **Version control** (logo evolution tracking)
- **Brand guidelines AI** (auto-detect logo usage violations)
- **Franchise management** (corporate controls + local customization)
- **White-label platform** (agencies can rebrand as their own tool)

### Moonshot Features (Year 3+)
- **3D logo renders** (logos on 3D products)
- **AR preview** ("See your sign on your building" via phone camera)
- **Video branding** (animated logos, video intros)
- **AI brand consultant** (ChatGPT-style advice on brand strategy)

---

## Development Timeline

### MVP Build (3-4 Months)

**Month 1: Foundation**
- Week 1-2: Tech stack setup, database design
- Week 3-4: User auth, payment integration

**Month 2: Core Features**
- Week 1: AI logo generator integration
- Week 2: Logo upload + vectorization
- Week 3-4: Mockup engine (first 20 mockups)

**Month 3: Polish**
- Week 1-2: Brand kit generator
- Week 3: File export system
- Week 4: UI/UX refinement

**Month 4: Launch Prep**
- Week 1-2: Beta testing with 20 users
- Week 3: Bug fixes, performance optimization
- Week 4: Marketing site, onboarding flows

### Post-MVP (Month 5-12)
- Month 5-6: Additional mockup categories (to 100+)
- Month 7-8: Enterprise features (teams, API)
- Month 9-10: Partnerships, integrations
- Month 11-12: Scale, optimize, grow

---

## Budget Requirements

### Initial Development (Month 1-4)
- **Developer (contract):** $15,000 - $25,000
- **Designer (UI/UX):** $5,000 - $8,000
- **AI API credits (testing):** $1,000
- **Infrastructure (hosting, domains):** $500
- **Total:** $21,500 - $34,500

### Monthly Operating (Post-Launch)
- **Hosting/infrastructure:** $300/month
- **AI API costs:** $0.50 per logo generation (volume pricing)
- **Payment processing (Stripe):** 2.9% + $0.30 per transaction
- **Support/tools:** $200/month
- **Total:** ~$500/month + variable API costs

### Marketing Budget (Month 6-12)
- **Content creation:** $2,000/month
- **Paid ads:** $5,000/month
- **SEO/tools:** $500/month
- **Total:** $7,500/month during growth phase

---

## Open Questions

1. **Name:** What should we call this? BrandForge? LogoSmith? SignForge?
2. **Mockup licensing:** Should we create our own mockup templates or license from existing libraries?
3. **Designer review:** Should we hire freelance designers for "human review" tier, or keep 100% automated?
4. **Industry focus:** Should MVP focus on one industry (e.g., restaurants) or be generalist?
5. **Integration priority:** Which partnership should we pursue first? (LegalZoom, Shopify, etc.)

---

## Appendix

### Mockup Template Sources
- Placeit.net (licensing available)
- Yellow Images (commercial license)
- Smartmockups (API available?)
- Custom creation via Blender/Cinema 4D

### Font Licensing
- Google Fonts (100% free for commercial use)
- Adobe Fonts (requires subscription)
- Font Squirrel (curated commercial-use fonts)

### Trademark Search APIs
- USPTO Trademark API
- Namechk API
- Trademarkia

---

**Next Steps:**
1. Validate customer demand (survey 50 business owners)
2. Build clickable prototype (Figma)
3. Test mockup generation engine (technical feasibility)
4. Finalize name + branding
5. Start MVP development

---

*Document prepared for Derek's sister site to Pic-Forge.com*
