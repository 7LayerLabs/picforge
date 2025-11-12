# Rate Limiting Quick Start

## 5-Minute Setup

### 1. Create KV Database (2 min)
```
1. Go to: https://vercel.com/dashboard
2. Click: Storage → Create Database → KV (Redis)
3. Name it: "picforge-rate-limit"
4. Click: Create
```

### 2. Copy Environment Variables (1 min)
```
Click on your new database → .env.local tab
Copy these 4 variables:
  - KV_URL
  - KV_REST_API_URL
  - KV_REST_API_TOKEN
  - KV_REST_API_READ_ONLY_TOKEN
```

### 3. Add to Local Development (1 min)
```bash
# Add to .env.local file:
KV_URL="redis://default:..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

### 4. Add to Production (1 min)
```
Vercel Dashboard → Your Project → Settings → Environment Variables
Add all 4 variables for: Production + Preview + Development
```

### 5. Verify (30 sec)
```bash
npm run dev

# Check logs - you should NOT see:
# ⚠️ "Vercel KV not configured"

# You're done! Rate limiting is active.
```

## What Gets Protected?

| Route | Limit | Cost If Abused |
|-------|-------|----------------|
| `/api/process-image` | 500/day | Free (Gemini) |
| `/api/generate-canvas` | 100/day | $400/day (DALL-E) |
| `/api/inpaint` | 25/day | $230/day (Replicate) |
| **+ 7 more routes** | Various | See full doc |

**Without rate limiting**: Potential $630+/day loss from API abuse
**With rate limiting**: Maximum $4.58/day exposure

## Test It Works

```bash
# Make a request
curl -X POST http://localhost:3000/api/process-image \
  -H "Content-Type: application/json" \
  -d '{"image":"base64...", "prompt":"test"}'

# Check response headers:
# X-RateLimit-Limit: 500
# X-RateLimit-Remaining: 499
# X-RateLimit-Reset: [timestamp]
```

## Need Help?

See full documentation: `RATE_LIMIT_ACTIVATION.md`

## Priority: HIGH 🔴

Your API routes are currently **unprotected**. A single malicious user could cost you hundreds of dollars in API fees. Setup takes 5 minutes.
