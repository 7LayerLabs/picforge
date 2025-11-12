# Rate Limiting Troubleshooting Guide

Quick reference for debugging rate limiting issues on PicForge.

---

## Quick Diagnosis

Run this command to check your configuration:

```bash
npm run test:rate-limit
```

Expected output if working:
```
✓ Vercel KV is configured correctly
✓ Server is accessible
✓ Request 1: Success (Remaining: 499/500)
✓ Request 2: Success (Remaining: 498/500)
...
Status: ✓ Rate limiting is working correctly
```

---

## Common Issues

### Issue 1: "⚠️  Vercel KV not configured" Warning

**Symptoms:**
- Console logs show: `"⚠️  Vercel KV not configured. Rate limiting disabled."`
- Test script shows all KV variables as "Not configured"
- Rate limiting is bypassed (all requests succeed)

**Causes:**
1. Environment variables not set
2. Environment variables are placeholder values
3. `.env.local` not loaded properly

**Solutions:**

**For Local Development:**
1. Check `.env.local` file exists in project root
2. Verify all 4 KV variables are set with REAL values (not placeholders):
   ```env
   KV_URL=redis://default:...@...kv.vercel-storage.com
   KV_REST_API_URL=https://...kv.vercel-storage.com
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   ```
3. Restart dev server: `npm run dev`
4. Test again: `npm run test:rate-limit`

**For Production (Vercel):**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all 4 KV variables are set
3. Check they're enabled for "Production" environment
4. Redeploy: `git push origin main`
5. Wait 2-3 minutes for deployment
6. Test production: `npm run test:rate-limit -- production`

---

### Issue 2: "Cannot connect to server" Error

**Symptoms:**
```
❌ Cannot connect to http://localhost:3000
💡 Make sure dev server is running: npm run dev
```

**Solutions:**

**For Local Testing:**
1. Start dev server in separate terminal:
   ```bash
   npm run dev
   ```
2. Wait for "Ready on http://localhost:3000"
3. Run test in another terminal:
   ```bash
   npm run test:rate-limit
   ```

**For Production Testing:**
1. Use production flag:
   ```bash
   npm run test:rate-limit -- production
   ```
2. Or specify custom URL:
   ```bash
   npm run test:rate-limit -- --url https://pic-forge.com
   ```

---

### Issue 3: Rate Limiting Not Blocking Requests

**Symptoms:**
- All 501+ requests succeed (no 429 errors)
- Headers show `X-RateLimit-Remaining: 500` never decreases
- KV dashboard shows no activity

**Diagnosis:**
```bash
# Test with enough requests to exceed limit
npm run test:rate-limit -- --test 505
```

**Causes:**
1. KV not configured (see Issue 1)
2. Rate limit counter not incrementing in Redis
3. Wrong KV database credentials
4. KV database deleted or inactive

**Solutions:**

1. **Verify KV database exists:**
   - Go to: https://vercel.com/dashboard/stores
   - Check `picforge-rate-limit` database is listed
   - Status should be "Active" (green)

2. **Check KV connection:**
   - Vercel Dashboard → Storage → picforge-rate-limit → Usage
   - Should show "Commands" increasing when you make requests
   - If flat/zero, KV is not connected

3. **Verify credentials match:**
   - Compare `.env.local` values with Vercel Dashboard values
   - Go to Storage → picforge-rate-limit → Settings → Connection
   - Copy-paste exact values (don't type manually)

4. **Test KV directly:**
   ```typescript
   // Add to scripts/test-kv.ts
   import { kv } from '@vercel/kv'

   const testKey = 'test-connection'
   await kv.set(testKey, 'hello')
   const value = await kv.get(testKey)
   console.log('KV Test:', value === 'hello' ? 'SUCCESS' : 'FAILED')
   ```

5. **Recreate KV database if corrupt:**
   - Backup: Export keys if needed
   - Delete: Vercel Dashboard → Storage → Delete Database
   - Recreate: Follow [VERCEL_KV_SETUP.md](VERCEL_KV_SETUP.md) Step 1
   - Update environment variables (Step 2)
   - Redeploy (Step 4)

---

### Issue 4: "Redis connection error" or ECONNREFUSED

**Symptoms:**
```
Error: connect ECONNREFUSED
Error: Redis connection failed
```

**Causes:**
1. `KV_URL` is incorrect or malformed
2. KV database is paused/inactive
3. Network/firewall blocking Redis connection

**Solutions:**

1. **Check `KV_URL` format:**
   - Should start with `redis://`
   - Format: `redis://default:TOKEN@host.kv.vercel-storage.com`
   - No trailing slash
   - No extra spaces or quotes

2. **Use REST API instead of direct connection:**
   - PicForge already uses REST API by default
   - If you see direct Redis errors, code may be using `kv.connect()` incorrectly
   - Verify imports use `@vercel/kv` REST client:
     ```typescript
     import { kv } from '@vercel/kv'  // ✓ REST API (works everywhere)
     // NOT: import Redis from 'ioredis' // ✗ Direct connection (fails in serverless)
     ```

3. **Check KV database status:**
   - Vercel Dashboard → Storage → picforge-rate-limit
   - Status should be "Active"
   - If "Paused" or "Inactive", click "Resume"

4. **Firewall/Network issues:**
   - Try from different network
   - Check corporate firewall settings
   - Verify Vercel IPs not blocked: https://vercel.com/docs/security/outbound-ips

---

### Issue 5: Rate Limit Resets Too Quickly

**Symptoms:**
- Rate limit counter resets before 24 hours
- User can make 500 more requests immediately after hitting limit

**Causes:**
1. TTL (Time To Live) not set correctly
2. Key expiration bug in code
3. Clock skew between server and Redis

**Solutions:**

1. **Check TTL in Redis:**
   - Vercel Dashboard → Storage → picforge-rate-limit → Data
   - Find key: `rate-limit:ip:xxx.xxx.xxx.xxx`
   - Check TTL field (should be ~86400 seconds = 24 hours)

2. **Verify code sets expiration:**
   ```typescript
   // In lib/rateLimitKv.ts line 59-64
   const count = await kv.incr(key)

   if (count === 1) {
     await kv.expire(key, windowSeconds)  // ← This MUST run on first request
   }
   ```

3. **Test with shorter window for debugging:**
   ```bash
   # Edit API route temporarily to use 5 minute window:
   # checkRateLimitKv(identifier, 10, 5 * 60 * 1000)

   # Make 11 requests
   # Wait 5 minutes
   # Should be able to make 10 more requests
   ```

4. **Check server time:**
   ```typescript
   // Add to API route temporarily
   console.log('Server time:', new Date().toISOString())
   console.log('Redis TTL:', await kv.ttl(`rate-limit:${identifier}`))
   ```

---

### Issue 6: Different Users Share Rate Limit

**Symptoms:**
- User A hits rate limit
- User B (different IP) also gets rate limited
- All users show same remaining count

**Causes:**
1. IP detection not working correctly
2. All users identified as same IP (e.g., "unknown")
3. Load balancer/proxy not forwarding IP headers

**Solutions:**

1. **Check IP detection:**
   ```typescript
   // In lib/rateLimitKv.ts line 169-178
   export function getClientIdentifier(request: Request): string {
     const forwardedFor = request.headers.get('x-forwarded-for')
     const realIp = request.headers.get('x-real-ip')
     const cfConnectingIp = request.headers.get('cf-connecting-ip')

     const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

     console.log('Detected IP:', ip)  // ← Add this temporarily
     return `ip:${ip}`
   }
   ```

2. **Test from different IPs:**
   - Test from your phone (cellular data - different IP)
   - Test from VPN (different IP)
   - Each should have independent rate limits

3. **Check Vercel forwarding:**
   - Vercel automatically sets `x-forwarded-for`
   - Log the header to verify:
     ```typescript
     console.log('Headers:', {
       'x-forwarded-for': request.headers.get('x-forwarded-for'),
       'x-real-ip': request.headers.get('x-real-ip'),
     })
     ```

4. **Fallback to user ID if available:**
   ```typescript
   // Future enhancement:
   export function getClientIdentifier(request: Request, userId?: string): string {
     if (userId) return `user:${userId}`  // Prefer user ID if authenticated

     // Fall back to IP
     const ip = /* ... */
     return `ip:${ip}`
   }
   ```

---

### Issue 7: "All requests failed - check configuration"

**Symptoms:**
- Test shows 100% error rate
- API returns 500 errors
- No successful requests

**Causes:**
1. API endpoint doesn't exist or moved
2. Environment variables missing (GEMINI_API_KEY, etc.)
3. API route has syntax error
4. Test payload format incorrect

**Solutions:**

1. **Verify API endpoint exists:**
   ```bash
   # Check API routes
   ls /c/Users/derek/OneDrive/Desktop/nano/app/api/

   # Should see: process-image, roast, generate-canvas, etc.
   ```

2. **Check API logs:**
   - Local: Look at terminal running `npm run dev`
   - Production: Vercel Dashboard → Project → Logs
   - Look for specific error messages

3. **Test API manually:**
   ```bash
   curl http://localhost:3000/api/process-image \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"image":"data:image/jpeg;base64,/9j/4AAQ...", "prompt":"test"}'
   ```

4. **Check other environment variables:**
   ```bash
   npm run check-env
   ```

5. **Test different endpoint:**
   ```bash
   # Try simpler endpoint first
   npm run test:rate-limit -- --endpoint /api/roast --limit 300
   ```

---

## Advanced Debugging

### View Rate Limit Keys in Redis

**Option 1: Vercel Dashboard**
1. Storage → picforge-rate-limit → Data
2. Search for: `rate-limit:*`
3. View keys, values, and TTLs

**Option 2: Redis CLI (if KV_URL is set)**
```bash
redis-cli -u "$KV_URL"
> KEYS rate-limit:*
> GET rate-limit:ip:123.456.789.000
> TTL rate-limit:ip:123.456.789.000
```

**Option 3: Custom Script**
```typescript
// scripts/debug-rate-limits.ts
import { kv } from '@vercel/kv'

const keys = await kv.keys('rate-limit:*')
console.log('Active rate limits:', keys.length)

for (const key of keys) {
  const count = await kv.get<number>(key)
  const ttl = await kv.ttl(key)
  console.log(`${key}: ${count} requests, resets in ${ttl}s`)
}
```

### Enable Debug Logging

Add to `.env.local`:
```env
DEBUG=rate-limit:*
NODE_ENV=development
```

Add logging to `lib/rateLimitKv.ts`:
```typescript
export async function checkRateLimitKv(/* ... */) {
  console.log('[Rate Limit] Checking:', identifier)
  console.log('[Rate Limit] Limit:', maxRequests, 'Window:', windowMs)

  const count = await kv.incr(key)
  console.log('[Rate Limit] Current count:', count)

  const allowed = count <= maxRequests
  console.log('[Rate Limit] Allowed:', allowed)

  return { allowed, remaining, resetTime, limit }
}
```

### Monitor in Real-Time

```bash
# Watch Vercel logs in real-time
vercel logs --follow

# Filter for rate limit events
vercel logs --follow | grep -i "rate limit"
```

---

## Performance Issues

### Issue: Rate Limit Checks Are Slow

**Symptoms:**
- API responses take 2-3+ seconds
- Logs show "Rate limit check took Xms" where X > 500

**Solutions:**

1. **Check KV region:**
   - Vercel Dashboard → Storage → Settings
   - Region should match your app deployment region
   - US app → US KV database

2. **Use connection pooling:**
   - `@vercel/kv` already pools connections
   - Verify you're not creating multiple KV clients

3. **Cache rate limit status:**
   ```typescript
   // Future optimization: Check locally first, sync with KV periodically
   const localCache = new Map<string, RateLimitResult>()

   // Check cache first (fast)
   const cached = localCache.get(identifier)
   if (cached && Date.now() < cached.resetTime) {
     return cached
   }

   // Check KV (slower)
   const result = await checkRateLimitKv(identifier)
   localCache.set(identifier, result)
   return result
   ```

---

## Getting Help

If you're still stuck:

1. **Check Vercel Status:** https://vercel-status.com
2. **Vercel Support:** support@vercel.com
3. **Vercel Community:** https://github.com/vercel/vercel/discussions
4. **Stack Overflow:** Tag `vercel` + `redis` + `rate-limiting`

**When asking for help, include:**
- Output of `npm run test:rate-limit`
- Relevant logs from Vercel Dashboard
- Environment variable names (NOT values!)
- Node version: `node --version`
- Next.js version: `npx next --version`
- KV region and app region

---

## Preventive Maintenance

**Weekly:**
- Check KV usage: Dashboard → Storage → Usage
- Review top IPs hitting rate limits
- Adjust limits if seeing too many 429s

**Monthly:**
- Review KV costs (should be ~$1/month)
- Check for abuse patterns (same IP hitting limit daily)
- Update rate limits based on usage trends

**After Major Deploys:**
- Run `npm run test:rate-limit -- production`
- Monitor logs for first hour
- Check error rates in Vercel Analytics
