# URGENT: Create og-image.png

## Issue
The metadata in `app/layout.tsx` now references `/og-image.png` but only `/og-image.svg` exists.

**Social media platforms (Twitter, Facebook, LinkedIn) do NOT support SVG images for Open Graph previews.**

## Required Action
Convert `og-image.svg` to `og-image.png` (1200x630px) using one of these methods:

### Option 1: Online Tool
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/og-image.svg`
3. Set output to 1200x630px
4. Download as `og-image.png`
5. Save to `public/og-image.png`

### Option 2: Inkscape (if installed)
```bash
inkscape og-image.svg --export-filename=og-image.png --export-width=1200 --export-height=630
```

### Option 3: ImageMagick (if installed)
```bash
convert -background none -size 1200x630 og-image.svg og-image.png
```

### Option 4: Browser Screenshot
1. Open `og-image.svg` in Chrome/Firefox
2. Open DevTools and set viewport to 1200x630
3. Take full-page screenshot
4. Save as `og-image.png` in `public/` folder

## Why This Matters (SEO Impact)
- Twitter cards won't display properly without PNG
- Facebook/LinkedIn won't show image previews
- Hurts click-through rates from social shares
- Poor user experience when sharing links
- Google may penalize if social signals are weak

## Verify After Creating
Test with these tools:
- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator
- https://developers.facebook.com/tools/debug/

---
Created by SEO Master Agent - 2025-10-21
