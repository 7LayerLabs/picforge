# PicForge Analytics Event Tracking Map

Visual guide showing what events are tracked on each page and component.

---

## Main Editor (/)

```
┌─────────────────────────────────────────────────────────┐
│                    MAIN EDITOR PAGE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Upload Image]  ← No tracking (just UI)               │
│       ↓                                                 │
│  [Select Prompt] ← 📊 prompt_usage                     │
│       ↓            - prompt_title                       │
│       ↓            - prompt_category                    │
│       ↓            - source: 'custom'                   │
│       ↓                                                 │
│  [Lock Composition Toggle] ← State only                │
│       ↓                                                 │
│  [Transform Button] ← 📊 image_transformation          │
│       ↓               - prompt_category                 │
│       ↓               - prompt_title                    │
│       ↓               - locked_composition: true/false  │
│       ↓               - is_nsfw: false                  │
│       ↓               - processing_time_ms (optional)   │
│       ↓                                                 │
│  [Result Displayed]                                     │
│       ↓                                                 │
│  [Share Button] ← Opens ShareModal                     │
│       ↓                                                 │
│  [Download Button] ← 📊 download_image                 │
│                      - source: 'main_editor'            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Prompts Library (/prompts)

```
┌─────────────────────────────────────────────────────────┐
│                   PROMPTS LIBRARY                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Search Bar] ← No tracking (filter only)              │
│       ↓                                                 │
│  [Category Filter] ← No tracking (filter only)         │
│       ↓                                                 │
│  ┌──────────────────────────────────────────┐          │
│  │  PROMPT CARD                             │          │
│  │                                          │          │
│  │  [Title]                                 │          │
│  │  [Description]                           │          │
│  │  [Tags]                                  │          │
│  │                                          │          │
│  │  [Copy Button] ← 📊 prompt_usage        │          │
│  │                  - prompt_title          │          │
│  │                  - prompt_category       │          │
│  │                  - source: 'library'     │          │
│  │                                          │          │
│  │  [Heart Icon] ← 📊 favorite_prompt      │          │
│  │                 - prompt_title           │          │
│  │                 - category               │          │
│  │                 - action: 'add'/'remove' │          │
│  └──────────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Batch Processor (/batch)

```
┌─────────────────────────────────────────────────────────┐
│                   BATCH PROCESSOR                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Upload Multiple Images] ← No tracking                │
│       ↓                                                 │
│  [Select Effect] ← State only                          │
│       ↓                                                 │
│  [Apply to All] ← 📊 batch_process                     │
│       ↓           - image_count: 25                     │
│       ↓           - effect_type: 'sharpen'              │
│       ↓           - is_nsfw: false                      │
│       ↓                                                 │
│  [Processing...] (each image)                          │
│       ↓                                                 │
│  [Results Grid]                                         │
│       ↓                                                 │
│  [Download All] ← 📊 download_image                    │
│                   - source: 'batch'                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Transform Roulette (/roulette)

```
┌─────────────────────────────────────────────────────────┐
│                  TRANSFORM ROULETTE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Upload Image] ← No tracking                          │
│       ↓                                                 │
│  [Spin the Wheel] ← Animation only                     │
│       ↓                                                 │
│  [Wheel Lands] ← 📊 roulette_spin                      │
│       ↓          - category: 'Movie Magic'              │
│       ↓          - event_label: 'Star Wars style'       │
│       ↓                                                 │
│  [Transform] ← 📊 image_transformation                 │
│       ↓        - prompt_category: 'Movie Magic'         │
│       ↓        - prompt_title: 'Star Wars style'        │
│       ↓        - locked_composition: false              │
│       ↓        - is_nsfw: false                         │
│       ↓                                                 │
│  [Result]                                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Roast Mode (/roast)

```
┌─────────────────────────────────────────────────────────┐
│                      ROAST MODE                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Upload Image] ← No tracking                          │
│       ↓                                                 │
│  [Select Intensity]                                     │
│       ├─ Mild                                           │
│       ├─ Spicy                                          │
│       └─ Nuclear                                        │
│       ↓                                                 │
│  [Roast Me!] ← 📊 roast_generation                     │
│       ↓        - intensity: 'nuclear'                   │
│       ↓                                                 │
│  [AI Roast Displayed]                                   │
│       ↓                                                 │
│  [Share Roast] ← ShareModal opens                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## AI Canvas (/canvas)

```
┌─────────────────────────────────────────────────────────┐
│                       AI CANVAS                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Text Prompt Input]                                    │
│       ↓                                                 │
│  [Size Selection] ← 1024x1024, 1792x1024, etc          │
│       ↓                                                 │
│  [Quality Selection] ← standard, hd                    │
│       ↓                                                 │
│  [Generate] ← 📊 canvas_generation                     │
│       ↓       - prompt: user's text                     │
│       ↓       - size: '1024x1024'                       │
│       ↓       - quality: 'standard'                     │
│       ↓       - success: true/false                     │
│       ↓       - prompt_length: 45                       │
│       ↓                                                 │
│  [Generated Image]                                      │
│       ↓                                                 │
│  [Download] ← 📊 download_image                        │
│               - source: 'canvas'                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Prompt Wizard (/prompt-wizard)

```
┌─────────────────────────────────────────────────────────┐
│                    PROMPT WIZARD                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 1: [Subject Selection] ← No tracking             │
│       ↓                                                 │
│  Step 2: [Style Selection] ← No tracking               │
│       ↓                                                 │
│  Step 3: [Setting Selection] ← No tracking             │
│       ↓                                                 │
│  Step 4: [Details Selection] ← No tracking             │
│       ↓                                                 │
│  Step 5: [Review & Generate]                           │
│       ↓                                                 │
│  [Complete] ← 📊 prompt_wizard_complete                │
│       ↓       - steps_completed: 5                      │
│       ↓       - final_prompt_length: 127                │
│       ↓                                                 │
│  [Use Prompt] ← Takes to main editor                   │
│                 Then triggers image_transformation      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Profile Page (/profile)

```
┌─────────────────────────────────────────────────────────┐
│                     PROFILE PAGE                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Sign In Button] ← 📊 sign_in                         │
│       ↓             - method: 'magic_link'              │
│       ↓                                                 │
│  (If New User)                                          │
│  [First Sign In] ← 📊 sign_up                          │
│       ↓            - method: 'magic_link'               │
│       ↓            🔧 setUserProperties:                │
│       ↓               - user_tier: 'free'               │
│       ↓               - has_generated_images: false     │
│       ↓               - total_transformations: 0        │
│       ↓                                                 │
│  [Usage Stats Display] ← No tracking (read only)       │
│       ↓                                                 │
│  [Promo Code Input]                                     │
│       ↓                                                 │
│  [Redeem Button] ← 📊 promo_code_redemption            │
│       ↓            - code_tier: 'unlimited'             │
│       ↓            - code_type: 'founder'               │
│       ↓            - value: 1 (for conversion)          │
│       ↓            🔧 setUserProperties:                │
│       ↓               - user_tier: 'unlimited'          │
│       ↓                                                 │
│  [Upgrade Button] ← 📊 upgrade_click                   │
│                     - source: 'profile'                 │
│                     - tier_clicked: 'pro'               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Pricing Page (/pricing)

```
┌─────────────────────────────────────────────────────────┐
│                     PRICING PAGE                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐  ┌────────────────┐               │
│  │   FREE TIER    │  │    PRO TIER    │               │
│  │                │  │                │               │
│  │  20 imgs/day   │  │  Unlimited     │               │
│  │  Watermark     │  │  No watermark  │               │
│  │                │  │                │               │
│  │ [Get Started]  │  │ [Get Started] ← 📊 upgrade_click
│  │  (no tracking) │  │    - source: 'pricing_page'    │
│  └────────────────┘  │    - tier_clicked: 'pro'       │
│                      └────────────────┘               │
│                                                         │
│  [Promo Code Notice] ← No tracking (info only)         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ShareModal (Component)

```
┌─────────────────────────────────────────────────────────┐
│                      SHARE MODAL                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Platform Tabs]                                        │
│    • Twitter                                            │
│    • Instagram                                          │
│    • Instagram Story                                    │
│    • TikTok                                             │
│       ↓                                                 │
│  [Generated Caption] ← No tracking (just AI)           │
│       ↓                                                 │
│  [Share to Twitter] ← 📊 social_share                  │
│       ↓               - platform: 'twitter'             │
│       ↓               - content_type: 'single'          │
│       ↓                                                 │
│  [Copy for Instagram] ← 📊 social_share                │
│       ↓                 - platform: 'instagram'         │
│       ↓                 - content_type: 'before_after'  │
│       ↓                                                 │
│  [Copy for TikTok] ← 📊 social_share                   │
│       ↓              - platform: 'tiktok'               │
│       ↓              - content_type: 'single'           │
│       ↓                                                 │
│  [Just Download] ← 📊 social_share                     │
│                    - platform: 'download'               │
│                    - content_type: 'single'             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Limit Reached Modal (Component)

```
┌─────────────────────────────────────────────────────────┐
│                  LIMIT REACHED MODAL                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Modal Appears] ← 📊 daily_limit_reached              │
│       ↓            - current_count: 20                  │
│       ↓            - limit: 20                          │
│       ↓                                                 │
│  [Upgrade Button] ← 📊 upgrade_click                   │
│       ↓             - source: 'limit_reached'           │
│       ↓             - tier_clicked: 'pro'               │
│       ↓                                                 │
│  [Enter Promo Code] ← Links to profile                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Error Tracking (Global)

```
┌─────────────────────────────────────────────────────────┐
│                    ERROR TRACKING                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ANY ERROR OCCURS                                       │
│       ↓                                                 │
│  try {                                                  │
│    // Your code                                         │
│  } catch (error) {                                      │
│    📊 error_occurred                                    │
│       - error_type: 'image_processing'                  │
│       - error_message: 'Failed to upload'               │
│       - page_path: '/batch'                             │
│  }                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Properties (Global Tracking)

```
┌─────────────────────────────────────────────────────────┐
│                   USER PROPERTIES                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Updated after key events:                              │
│                                                         │
│  🔧 setUserProperties({                                │
│       user_tier: 'free' | 'pro' | 'unlimited',         │
│       has_generated_images: true | false,               │
│       total_transformations: 25,                        │
│       favorite_category: 'Art Styles'                   │
│     })                                                  │
│                                                         │
│  Updated on:                                            │
│    • Sign up/in                                         │
│    • Image transformation                               │
│    • Promo code redemption                              │
│    • Reaching milestones (10, 50, 100 images)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Event Summary by Type

### High-Frequency Events (1000s per day)
- `image_transformation` - Every image generated
- `prompt_usage` - Every prompt selected/copied
- `page_view` - Every page navigation

### Medium-Frequency Events (100s per day)
- `social_share` - Shares to platforms
- `download_image` - Image downloads
- `favorite_prompt` - Heart icon clicks
- `batch_process` - Batch operations

### Low-Frequency Events (10s per day)
- `sign_up` - New user registrations
- `sign_in` - User logins
- `upgrade_click` - Pricing button clicks
- `daily_limit_reached` - Free tier limits

### Rare Events (<10 per day)
- `promo_code_redemption` - Code uses
- `roast_generation` - Roast mode uses
- `canvas_generation` - AI Canvas uses
- `roulette_spin` - Roulette uses
- `prompt_wizard_complete` - Wizard completions
- `error_occurred` - Application errors

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  USER ACTION (button click, form submit)                │
│       ↓                                                 │
│  REACT COMPONENT (detects action)                       │
│       ↓                                                 │
│  TRACKING FUNCTION (lib/analytics.ts)                   │
│       ↓                                                 │
│  window.gtag() (sends to GA4)                           │
│       ↓                                                 │
│  GOOGLE ANALYTICS 4 (receives event)                    │
│       ↓                                                 │
│  GA4 PROCESSING (enriches with device, location, etc)   │
│       ↓                                                 │
│  GA4 REPORTS (Realtime, Explore, etc)                   │
│       ↓                                                 │
│  BUSINESS INSIGHTS (you make decisions)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Complete Event List

1. **`image_transformation`** - Image generated with AI
2. **`prompt_usage`** - Prompt selected/copied
3. **`sign_up`** - New user registration
4. **`sign_in`** - Existing user login
5. **`promo_code_redemption`** - Promo code redeemed
6. **`daily_limit_reached`** - Free tier limit hit
7. **`upgrade_click`** - Upgrade button clicked
8. **`social_share`** - Content shared to platform
9. **`download_image`** - Image downloaded
10. **`favorite_prompt`** - Prompt favorited/unfavorited
11. **`batch_process`** - Batch processing completed
12. **`roast_generation`** - Roast generated
13. **`canvas_generation`** - AI image generated from text
14. **`roulette_spin`** - Roulette wheel spun
15. **`prompt_wizard_complete`** - Wizard flow completed
16. **`template_used`** - Template selected
17. **`error_occurred`** - Application error
18. **`page_view`** - Page navigation (automatic)

---

## What This Enables

With this tracking, you can answer:
- What prompts do users love?
- Where do users get stuck?
- Which features drive engagement?
- How many free users convert?
- What causes users to share?
- Which traffic sources convert best?
- What errors are users hitting?
- When should we build next?

---

**Last Updated:** October 22, 2025
**Status:** Production Ready
