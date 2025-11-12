# Vercel KV Rate Limiting Setup Guide

## CRITICAL SECURITY ISSUE

**Your API routes are currently UNPROTECTED!**

Without Vercel KV configured, rate limiting is disabled. This means:
- Attackers can make UNLIMITED requests to your expensive AI APIs
- Potential cost: $10,000+ per month if abused
- APIs at risk: Gemini, Replicate, OpenAI DALL-E

**Time to fix: 15 minutes**

---

## Cost Analysis

### Without Rate Limiting (Current State)
- No protection against abuse
- Unlimited Gemini API calls ($0.0025-$0.0125 per image)
- Unlimited Replicate calls ($0.023 per NSFW image)
- Unlimited OpenAI DALL-E calls ($0.040-$0.080 per image)
- **Risk: $10,000+ monthly if discovered by bots/attackers**

### With Rate Limiting (Protected State)
- 500 requests/day/IP for main editor (Gemini)
- 200 requests/day/IP for NSFW editor (Replicate - expensive)
- 100 requests/day/IP for canvas generator (DALL-E - most expensive)
- 300 requests/day/IP for roast mode (Gemini)
- Vercel KV cost: $0.25/100k commands (first 30k free)
- **Estimated monthly cost: $50-$200 (protected)**

---

## Step 1: Create Vercel KV Database

1. **Login to Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Select your project: `picforge` or `nano`

2. **Navigate to Storage**
   - Click on the **"Storage"** tab in the top navigation
   - Or direct link: https://vercel.com/dashboard/stores

3. **Create KV Database**
   - Click **"Create Database"**
   - Select **"KV (Redis)"**
   - Database Name: `picforge-rate-limit` (or any name you prefer)
   - Region: Choose closest to your users (e.g., `us-east-1`)
   - Click **"Create"**

4. **Get Your Environment Variables**
   - After creation, you'll see a page with connection details
   - Click **".env.local"** tab to see all 4 variables:
     ```
     KV_URL=redis://...
     KV_REST_API_URL=https://...
     KV_REST_API_TOKEN=...
     KV_REST_API_READ_ONLY_TOKEN=...
     ```
   - Copy these values - you'll need them in Step 2

---

## Step 2: Add Environment Variables to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Project Settings**
   - Dashboard > Your Project > Settings > Environment Variables
   - Or: https://vercel.com/[your-username]/picforge/settings/environment-variables

2. **Add Each Variable**
   - Click **"Add New"** for each variable:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `KV_URL` | (paste from Step 1) | Production, Preview, Development |
   | `KV_REST_API_URL` | (paste from Step 1) | Production, Preview, Development |
   | `KV_REST_API_TOKEN` | (paste from Step 1) | Production, Preview, Development |
   | `KV_REST_API_READ_ONLY_TOKEN` | (paste from Step 1) | Production, Preview, Development |

3. **Save Each Variable**
   - Click **"Save"** after adding each one
   - **Important:** Check ALL THREE environment checkboxes (Production, Preview, Development)

### Option B: Via Vercel CLI (Advanced)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link your project
vercel link

# Add each variable
vercel env add KV_URL production preview development
vercel env add KV_REST_API_URL production preview development
vercel env add KV_REST_API_TOKEN production preview development
vercel env add KV_REST_API_READ_ONLY_TOKEN production preview development
```

---

## Step 3: Add to Local .env.local

For local development testing:

1. Open `C:\Users\derek\OneDrive\Desktop\nano\.env.local`

2. Replace the placeholder values (lines 49-56):
   ```env
   # Vercel KV (Redis) - REQUIRED FOR RATE LIMITING
   KV_URL=redis://your-actual-kv-url-here
   KV_REST_API_URL=https://your-actual-rest-api-url-here
   KV_REST_API_TOKEN=your-actual-token-here
   KV_REST_API_READ_ONLY_TOKEN=your-actual-read-only-token-here
   ```

3. **DO NOT COMMIT THIS FILE** - `.env.local` is already in `.gitignore`

---

## Step 4: Redeploy Your Application

### Option A: Via Git Push (Recommended)

```bash
# Commit any pending changes
git add .
git commit -m "Configure Vercel KV rate limiting"
git push origin main
```

Vercel will automatically detect the environment variable changes and redeploy.

### Option B: Manual Redeploy

1. Go to Vercel Dashboard > Your Project > Deployments
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. Select **"Use existing Build Cache"** (optional)
5. Click **"Redeploy"**

### Option C: Via Vercel CLI

```bash
vercel --prod
```

---

## Step 5: Verify Rate Limiting is Active

### Check 1: Test Locally

```bash
# In your project directory
npm run dev

# In another terminal, run the test script
npm run test:rate-limit
```

Expected output:
```
✓ Rate limiting configured
✓ Request 1: Success (Remaining: 499)
✓ Request 2: Success (Remaining: 498)
...
✓ Request 500: Success (Remaining: 0)
✗ Request 501: Rate limited (429 status)
```

### Check 2: Check Production Logs

1. Go to Vercel Dashboard > Your Project > Logs
2. Make a request to your API (upload an image on pic-forge.com)
3. Look for logs like:
   ```
   Rate limit check: ip:xxx.xxx.xxx.xxx - 499 remaining
   ```
4. **If you see:** `"⚠️  Vercel KV not configured"` - go back to Step 2

### Check 3: Monitor Vercel KV Usage

1. Go to Vercel Dashboard > Storage > picforge-rate-limit
2. Click **"Usage"** tab
3. You should see:
   - Commands executed: Increasing count
   - Data stored: Growing (rate limit keys)

---

## Step 6: Understanding Rate Limits

Your API routes now have the following limits per IP address:

| Endpoint | Limit | Reset Period | Why? |
|----------|-------|--------------|------|
| `/api/process-image` | 500/day | 24 hours | Main editor - most common use |
| `/api/process-image-nsfw` | 200/day | 24 hours | Replicate API costs $0.023/image |
| `/api/generate-canvas` | 100/day | 24 hours | DALL-E costs $0.040-$0.080/image |
| `/api/roast` | 300/day | 24 hours | Fun feature, moderate limit |

**How it works:**
1. Each request increments a counter in Redis with the user's IP address
2. Counter resets automatically after 24 hours
3. If limit exceeded, user gets HTTP 429 response with reset time
4. Users see friendly error message: "Rate limit exceeded. Please try again later."

---

## Troubleshooting

### Problem: "⚠️  Vercel KV not configured" in logs

**Solution:**
- Verify all 4 environment variables are set in Vercel Dashboard
- Check that variables are enabled for Production, Preview, AND Development
- Redeploy the application (Step 4)

### Problem: Rate limiting not working on production

**Solution:**
1. Check Vercel project environment variables (Step 2)
2. Verify variable names match exactly (case-sensitive)
3. Redeploy with `git push` or manual redeploy
4. Wait 2-3 minutes for deployment to complete
5. Clear your browser cache and test again

### Problem: Local development rate limiting not working

**Solution:**
1. Verify `.env.local` has all 4 KV variables (Step 3)
2. Restart your dev server: `npm run dev`
3. Check terminal for warnings about missing environment variables

### Problem: "Redis connection error"

**Solution:**
- Verify `KV_URL` starts with `redis://`
- Verify `KV_REST_API_URL` starts with `https://`
- Check that your Vercel KV database is active (not deleted)
- Recreate the database if necessary (Step 1)

### Problem: Users complaining about rate limits

**Solution:**
- Current limits are intentionally conservative
- To increase limits, edit `lib/rateLimitKv.ts` (see below)
- Monitor costs in Vercel dashboard before increasing

---

## Adjusting Rate Limits (Optional)

If you need to change limits, edit the API route files:

**Main Editor** (`app/api/process-image/route.ts`, line 11):
```typescript
const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)
//                                                     ^^^
// Change 500 to your desired limit (e.g., 1000)
```

**NSFW Editor** (`app/api/process-image-nsfw/route.ts`, line 10):
```typescript
const rateLimit = await checkRateLimitKv(identifier, 200, 24 * 60 * 60 * 1000)
//                                                     ^^^
// Change 200 to your desired limit (WARNING: This costs money!)
```

**Canvas Generator** (`app/api/generate-canvas/route.ts`, line 11):
```typescript
const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)
//                                                     ^^^
// Change 100 to your desired limit (WARNING: DALL-E is expensive!)
```

**After changing limits:**
```bash
git add .
git commit -m "Adjust rate limits"
git push origin main
```

---

## IP Address Bypass (For Testing)

If you need to bypass rate limiting for your own IP (e.g., during testing):

1. Find your IP address: https://whatismyipaddress.com/
2. Edit `lib/rateLimitKv.ts`:
   ```typescript
   export async function checkRateLimitKv(
     identifier: string,
     maxRequests: number = 500,
     windowMs: number = 24 * 60 * 60 * 1000
   ): Promise<RateLimitResult> {
     // Bypass rate limiting for Derek's IP
     if (identifier === 'ip:123.456.789.000') { // Replace with your IP
       return {
         allowed: true,
         remaining: 999999,
         resetTime: Date.now() + windowMs,
         limit: 999999
       }
     }

     // ... rest of the function
   ```

**WARNING:** Do NOT commit this bypass to production!

---

## Monitoring & Analytics

### View Rate Limit Statistics

1. **Vercel KV Dashboard**
   - Storage > picforge-rate-limit > Usage
   - Shows total commands executed
   - Shows data stored (MB)

2. **Vercel Logs**
   - Deployments > Latest > Functions
   - Filter logs by "rate-limit" to see all rate limiting events

3. **Custom Admin Dashboard** (Future Enhancement)
   - You could build an admin page to view top IPs hitting rate limits
   - Query KV database for all keys matching `rate-limit:*`
   - Display leaderboard of highest usage IPs

### Example Admin Query

```typescript
// Future enhancement for /app/admin/rate-limits/page.tsx
import { kv } from '@vercel/kv'

export async function getRateLimitStats() {
  const keys = await kv.keys('rate-limit:*')
  const stats = await Promise.all(
    keys.map(async (key) => {
      const count = await kv.get<number>(key)
      const ttl = await kv.ttl(key)
      return { ip: key.replace('rate-limit:ip:', ''), count, ttl }
    })
  )
  return stats.sort((a, b) => (b.count || 0) - (a.count || 0))
}
```

---

## Security Best Practices

1. **Never commit KV credentials to git**
   - `.env.local` is already in `.gitignore`
   - Use Vercel environment variables for production

2. **Rotate tokens periodically**
   - Vercel Dashboard > Storage > Database > Settings > Rotate Token
   - Update environment variables after rotation

3. **Monitor for abuse**
   - Set up Vercel log alerts for 429 responses
   - Check KV usage monthly to detect unusual patterns

4. **Consider IP allowlisting**
   - For high-value users, store their IPs in KV with higher limits
   - Example: `rate-limit:vip:123.456.789.000` with 10,000 limit

5. **Use read-only token for monitoring**
   - `KV_REST_API_READ_ONLY_TOKEN` can only read, not write
   - Use for analytics dashboards and monitoring tools

---

## Estimated Costs

### Vercel KV Pricing (as of 2025)
- **Free Tier:** 30,000 commands/month, 256 MB storage
- **Pro:** $0.25 per 100,000 commands after free tier
- **Storage:** Included in command pricing

### PicForge Rate Limiting Usage
- 500 users/day × 10 requests/user = 5,000 requests/day
- Each request = 2 KV commands (incr + ttl check)
- Monthly: 5,000 × 30 × 2 = 300,000 commands
- Cost: (300,000 - 30,000) / 100,000 × $0.25 = **$0.68/month**

### Total Protected System Cost
- Vercel KV: ~$1/month
- Rate-limited API usage: $50-$200/month (safe limits)
- **Total: $51-$201/month (vs $10,000+ unprotected)**

---

## Next Steps

After completing setup:

1. **Test thoroughly** using the test script (Step 5)
2. **Monitor for 1 week** to ensure no issues
3. **Adjust limits** based on actual usage patterns
4. **Set up alerts** in Vercel for 429 responses
5. **Document rate limits** for users in your FAQ/Help page

---

## Need Help?

- **Vercel KV Docs:** https://vercel.com/docs/storage/vercel-kv
- **Redis Docs:** https://redis.io/docs/
- **Rate Limiting Best Practices:** https://cloud.google.com/architecture/rate-limiting-strategies-techniques

---

**Congratulations!** Your API is now protected against abuse. 🎉
