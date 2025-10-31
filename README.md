# 🔥 PicForge

**AI-Powered Image Transformation Platform**

Transform your images with 320+ AI effects across 8 categories. From zombie apocalypses to Van Gogh paintings - nothing is real anymore.

🌐 **Live Site:** [pic-forge.com](https://pic-forge.com)

---

## ⚠️ CRITICAL: Rate Limiting Setup Required

**Status:** API is UNPROTECTED - configure Vercel KV immediately to prevent $10k+ monthly costs.

**Quick Start:** [docs/RATE_LIMIT_QUICKSTART.md](docs/RATE_LIMIT_QUICKSTART.md) (15 minutes)

**Full Details:** [RATE_LIMIT_SUMMARY.md](RATE_LIMIT_SUMMARY.md)

---

## 🎨 Features

### Main Editors
- **Single Image Editor** - AI-powered transformations with 272+ templates and Lock Composition feature
- **18+ Editor** 🔞 - COMING SOON (Q1 2026) - Dramatic ribbon design page
- **Batch Processor** - Process 100+ images with 21 effects (sharpen, vignette, glitch/vhs, sketch, etc.)
- **18+ Batch** 🔞 - Unrestricted batch processing for adult content (access restricted)
- **AI Canvas** - Generate images from text descriptions

### Fun & Games
- **Transform Roulette** 🎰 - Spin the wheel for random AI transformations (8 categories, 320+ prompts including Banksy)
- **Roast Mode** 🔥 - Get hilariously brutal AI feedback on your photos (mild/spicy/nuclear)
- **Prompt Wizard** 🪄 - Build perfect prompts step-by-step

### Resources
- **Templates Gallery** - 110+ sample transformations
- **Prompts Library** - 272 categorized prompts (includes Banksy street art)
- **Tips & Tricks** - Master the art of AI image editing
- **Showcase** - User-submitted transformations gallery

### UX Features
- **Lock Composition** - Preserve image composition during iterative edits
- **Creative Journey** - Masonry gallery of all edit versions
- **Download All** - Bulk export to ZIP
- **Before/After Slider** - Interactive comparison view

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router) with Turbopack
- **Styling:** Tailwind CSS
- **AI Providers:**
  - Google Gemini Vision API (primary image processing)
  - Replicate SDXL (NSFW/unrestricted content - ~$0.023/image)
  - Pollinations AI (free generation)
  - OpenAI DALL-E (canvas generation)
- **Deployment:** Vercel
- **Database:** InstantDB (user auth & data)
- **Rate Limiting:** Vercel KV (Redis) - IP-based protection
- **Analytics:** Vercel KV
- **Image Processing:** Canvas API (client-side) + 21 effects library

## 🛡️ Rate Limiting & Security

PicForge uses Vercel KV (Redis) for IP-based rate limiting to prevent API abuse:

| Endpoint | Rate Limit | Why? |
|----------|------------|------|
| `/api/process-image` | 500 requests/day/IP | Main editor - most common use |
| `/api/process-image-nsfw` | 200 requests/day/IP | Replicate API costs $0.023/image |
| `/api/generate-canvas` | 100 requests/day/IP | DALL-E costs $0.040-$0.080/image |
| `/api/roast` | 300 requests/day/IP | Fun feature, moderate limit |

**Setup Required:** Rate limiting requires Vercel KV configuration. See [docs/VERCEL_KV_SETUP.md](docs/VERCEL_KV_SETUP.md) for complete setup instructions.

**Test Rate Limiting:**
```bash
npm run test:rate-limit
```

**Without rate limiting configured:**
- APIs fail-open (no blocking)
- Your account is vulnerable to abuse
- Potential cost: $10,000+/month if attacked

**With rate limiting configured:**
- Protected against automated abuse
- Sustainable costs: $50-$200/month
- Vercel KV cost: ~$1/month

## 📜 License

Copyright © 2025 Derek Bobola / PicForge

Licensed under the MIT License - see [LICENSE](LICENSE) file for details.

**Commercial Use:** You may use this code commercially, but you must retain the copyright notice.

## 🔐 Security

This is a **private repository**. Unauthorized copying, distribution, or use is prohibited.

## 💡 About

Created by [Derek Bobola](https://github.com/7LayerLabs) - Serial entrepreneur, restaurant owner, and AI enthusiast.

---

**(re)Imagine. Everything. Nothing is real anymore.** 🔥
