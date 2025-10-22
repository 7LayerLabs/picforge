# Rate Limiting Activation Checklist

## Current Status
PicForge has **production-ready rate limiting infrastructure** built using Vercel KV (Redis). The code is fully implemented and ready to activate - it just needs environment variables to be configured.

## Why This Matters
Without rate limiting, your API routes are vulnerable to:
- **API Abuse**: Malicious users could spam requests and exhaust your API credits
- **Cost Overruns**: Gemini, OpenAI, Replicate, and Together AI charge per request
- **Service Degradation**: Excessive traffic could slow down or crash your serverless functions

## Environment Variables Needed

Add these 4 environment variables to activate rate limiting:

```bash
# Vercel KV (Redis) - Required for persistent rate limiting
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token_here
```

## Where to Get These Values

### Step 1: Create Vercel KV Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database**
3. Select **KV (Redis)** as the database type
4. Choose a name (e.g., "picforge-rate-limit")
5. Select your preferred region (closest to your users)
6. Click **Create**

### Step 2: Get Environment Variables
1. After creating the database, click on it
2. Go to the **Settings** or **.env.local** tab
3. Vercel will display all 4 required environment variables with values
4. Copy each variable exactly as shown

### Step 3: Add to Your Project

#### For Local Development (.env.local):
```bash
# Add these to your .env.local file:
KV_URL="redis://default:..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

#### For Production (Vercel Dashboard):
1. Go to your project settings: **Settings** → **Environment Variables**
2. Add each variable one by one
3. Select environments: **Production**, **Preview**, and **Development**
4. Click **Save**

#### For Production (Vercel CLI):
```bash
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
vercel env add KV_REST_API_READ_ONLY_TOKEN
```

## API Routes Protected (10 routes)

Once activated, these routes will enforce rate limits:

| Route | Daily Limit (per IP) | Cost Impact | Purpose |
|-------|---------------------|-------------|---------|
| `/api/process-image` | 500 requests | Gemini API | Main image transformation |
| `/api/roast` | 300 requests | Gemini API | Photo roasting |
| `/api/process-image-nsfw` | 200 requests | Replicate API | Adult content processing |
| `/api/process-image-v2` | 200 requests | Gemini API | Alternative processor |
| `/api/generate-canvas` | 100 requests | OpenAI DALL-E | Premium image generation |
| `/api/generate-canvas-hf` | 100 requests | HuggingFace | Free AI generation |
| `/api/generate-canvas-pollinations` | 150 requests | Free (Pollinations.ai) | Free AI generation |
| `/api/generate-canvas-free` | 50 requests | Together AI | Free-tier generation |
| `/api/inpaint` | 25 requests | Replicate API (~$0.023/img) | Inpainting feature |

**Total: 10 rate-limited endpoints protecting your AI API costs**

## How Rate Limiting Works

### Current Behavior (KV NOT Configured):
```
⚠️ Vercel KV not configured. Rate limiting disabled.
```
- The code gracefully degrades
- All requests are allowed through
- No protection against abuse
- Console warnings logged

### After Activation (KV Configured):
```
✅ Rate limiting active via Vercel KV
```
- Requests tracked per IP address
- Limits enforced per 24-hour window
- Redis stores counts persistently
- Automatic reset after window expires

### Response Headers
Rate-limited routes return helpful headers:
```
X-RateLimit-Limit: 500          # Max requests allowed
X-RateLimit-Remaining: 487      # Requests remaining
X-RateLimit-Reset: 1740241200000 # Unix timestamp when limit resets
```

### When Limit Exceeded (429 Response):
```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the maximum number of requests. Please try again later.",
  "limit": 500,
  "remaining": 0,
  "resetTime": 1740241200000
}
```

## Rate Limit Configuration

### Per-Route Limits (Defined in Code)
Each route has custom limits based on cost and usage:

```typescript
// High-volume, free routes
/api/process-image: 500 requests/day
/api/roast: 300 requests/day
/api/process-image-v2: 200 requests/day

// Paid API routes (expensive)
/api/generate-canvas: 100 requests/day (DALL-E costs)
/api/inpaint: 25 requests/day ($0.023 per image!)

// Free alternatives (prevent abuse)
/api/generate-canvas-pollinations: 150 requests/day
/api/generate-canvas-hf: 100 requests/day
```

### How Limits Are Tracked
- **Identifier**: IP address extracted from request headers
- **Storage**: Vercel KV (Redis) with automatic expiration
- **Window**: Rolling 24-hour period per IP
- **Reset**: Automatic cleanup via Redis TTL

## Code Implementation Details

### Rate Limiting Library
**File**: `C:\Users\derek\OneDrive\Desktop\nano\lib\rateLimitKv.ts`

**Key Functions**:
1. `checkRateLimitKv(identifier, maxRequests, windowMs)` - Check and increment rate limit
2. `getClientIdentifier(request)` - Extract IP from various headers (Vercel, Cloudflare, etc.)
3. `resetRateLimitKv(identifier)` - Admin override to reset limits
4. `getRateLimitStatusKv(identifier)` - Check status without incrementing

**Graceful Degradation**:
```typescript
// If KV not configured, allows all requests
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.warn('⚠️ Vercel KV not configured. Rate limiting disabled.');
  return { allowed: true, remaining: maxRequests, resetTime: Date.now() + windowMs };
}
```

**Error Handling**:
```typescript
try {
  // Rate limiting logic
} catch (error) {
  console.error('Vercel KV rate limit error:', error);
  // Fail open - allow request on error to prevent breaking the API
  return { allowed: true, remaining: maxRequests, resetTime: Date.now() + windowMs };
}
```

### IP Address Detection
Supports multiple hosting platforms:
```typescript
const forwardedFor = request.headers.get('x-forwarded-for')
const realIp = request.headers.get('x-real-ip')
const cfConnectingIp = request.headers.get('cf-connecting-ip')

const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
```

## Verification Steps

### Step 1: Check Environment Variables
```bash
# In your terminal:
vercel env ls

# You should see:
# KV_URL
# KV_REST_API_URL
# KV_REST_API_TOKEN
# KV_REST_API_READ_ONLY_TOKEN
```

### Step 2: Test Local Development
```bash
# Add KV vars to .env.local
npm run dev

# Check logs for:
# ✅ "Rate limiting active" (no warnings)
```

### Step 3: Test Rate Limiting
```bash
# Make 501 requests to /api/process-image
# The 501st request should return 429 status
curl -X POST http://localhost:3000/api/process-image \
  -H "Content-Type: application/json" \
  -d '{"image":"base64...", "prompt":"test"}'

# Expected 429 response:
# { "error": "Rate limit exceeded", "limit": 500, "remaining": 0 }
```

### Step 4: Check Vercel KV Dashboard
1. Go to your KV database in Vercel
2. Click **Data** tab
3. Look for keys like: `rate-limit:ip:123.456.789.0`
4. Values should show request counts

### Step 5: Deploy and Monitor
```bash
# Deploy to production
vercel --prod

# Monitor logs for rate limit activity:
vercel logs --follow
```

## Cost Savings Estimate

### Without Rate Limiting:
- **Scenario**: Malicious user makes 10,000 requests in one day
- **Gemini API**: 10,000 × $0.00 (currently free) = $0
- **DALL-E**: 10,000 × $0.04 = **$400**
- **Replicate**: 10,000 × $0.023 = **$230**
- **Total potential loss**: **$630 per day**

### With Rate Limiting (500/day limit):
- **Maximum exposure**: 500 requests
- **DALL-E**: 100 × $0.04 = **$4**
- **Replicate**: 25 × $0.023 = **$0.58**
- **Total maximum daily cost**: **$4.58**
- **Savings**: **$625.42 per day** (99.3% cost reduction)

## Additional Features

### Admin Override
Reset rate limit for specific user:
```typescript
import { resetRateLimitKv } from '@/lib/rateLimitKv';

// Reset limit for IP
await resetRateLimitKv('ip:123.456.789.0');
```

### Check Status Without Incrementing
```typescript
import { getRateLimitStatusKv } from '@/lib/rateLimitKv';

const status = await getRateLimitStatusKv('ip:123.456.789.0', 500, 24 * 60 * 60 * 1000);
console.log(`Remaining: ${status.remaining}/${status.limit}`);
```

## Future Enhancements

### Consider Adding:
1. **User-based rate limiting** (in addition to IP)
   - Track by InstantDB user ID
   - Different limits for Free/Pro/Unlimited tiers

2. **Redis key prefixing** for multi-tenant support
   - `rate-limit:prod:ip:...`
   - `rate-limit:staging:ip:...`

3. **Rate limit dashboard** for admins
   - View top users by request count
   - Real-time rate limit monitoring

4. **Custom error pages** for 429 responses
   - Show countdown timer until reset
   - Suggest upgrading to Pro tier

5. **Webhook alerts** when limits exceeded
   - Send email to admin
   - Post to Slack/Discord

## Troubleshooting

### Issue: "Rate limiting disabled" warning in logs
**Solution**: Add KV environment variables to `.env.local` or Vercel project

### Issue: Rate limiting not working in production
**Solution**: Ensure KV env vars are added for **Production** environment in Vercel

### Issue: All requests getting 429 errors
**Solution**: Check Redis for stuck keys. May need to flush database or increase limits.

### Issue: Different limits per user not working
**Solution**: Current implementation is IP-based only. Need to add user-based tracking using InstantDB.

## Next Steps After Activation

1. **Monitor usage patterns** in Vercel KV dashboard
2. **Adjust limits** based on actual traffic and costs
3. **Set up alerts** for when users hit limits frequently
4. **Consider user-based limits** for authenticated users
5. **Add rate limit info** to pricing page and documentation

## Checklist Summary

- [ ] Create Vercel KV database
- [ ] Copy 4 environment variables from Vercel dashboard
- [ ] Add to `.env.local` for local development
- [ ] Add to Vercel project settings for Production/Preview/Development
- [ ] Test locally: `npm run dev` (no warnings)
- [ ] Deploy to production: `vercel --prod`
- [ ] Verify in logs: No "Rate limiting disabled" warnings
- [ ] Test rate limiting: Make 501 requests, expect 429 on last
- [ ] Monitor Vercel KV dashboard for `rate-limit:*` keys
- [ ] Update documentation with rate limits

## Status: Ready to Activate ✅

The rate limiting infrastructure is **production-ready**. Simply add the 4 Vercel KV environment variables to activate protection for all 10 API routes.

**Estimated setup time**: 10 minutes
**Priority**: HIGH - Prevents API abuse and protects against cost overruns

---

**Last Updated**: 2025-10-22
**Code Location**: `C:\Users\derek\OneDrive\Desktop\nano\lib\rateLimitKv.ts`
**Protected Routes**: 10 API endpoints (see table above)
