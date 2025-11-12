# Rate Limiting Quick Start

**Time Required:** 15 minutes

**Goal:** Protect PicForge APIs from abuse and prevent $10,000+ monthly costs.

---

## Why This Matters

**Current State (UNPROTECTED):**
- Zero rate limiting on AI APIs
- Anyone can make unlimited requests
- Risk: $10,000+ monthly if attacked by bots

**Protected State:**
- 500 requests/day per IP
- Automated abuse prevention
- Cost: $50-$200/month (safe)

---

## 3-Step Setup

### Step 1: Create Vercel KV Database (5 minutes)

1. Go to: https://vercel.com/dashboard/stores
2. Click "Create Database" → "KV (Redis)"
3. Name: `picforge-rate-limit`
4. Region: `us-east-1` (or closest to your users)
5. Click "Create"
6. **Copy all 4 environment variables** (you'll need them next)

---

### Step 2: Add Variables to Vercel (5 minutes)

1. Go to: https://vercel.com/[username]/picforge/settings/environment-variables
2. Add these 4 variables (paste values from Step 1):

| Variable Name | Environment |
|--------------|-------------|
| `KV_URL` | ✓ Production ✓ Preview ✓ Development |
| `KV_REST_API_URL` | ✓ Production ✓ Preview ✓ Development |
| `KV_REST_API_TOKEN` | ✓ Production ✓ Preview ✓ Development |
| `KV_REST_API_READ_ONLY_TOKEN` | ✓ Production ✓ Preview ✓ Development |

3. Click "Save" for each

**Important:** Check ALL THREE checkboxes for each variable!

---

### Step 3: Redeploy (2 minutes)

```bash
git add .
git commit -m "Configure Vercel KV rate limiting"
git push origin main
```

Wait 2-3 minutes for deployment to complete.

---

## Verify It's Working (3 minutes)

### Test 1: Check Logs

1. Go to: https://vercel.com/[username]/picforge/logs
2. Upload an image on pic-forge.com
3. Look for log: `Rate limit check: ip:xxx.xxx.xxx.xxx - 499 remaining`

**Good:** Logs show rate limit checks with decreasing "remaining" counts
**Bad:** Logs show `"⚠️  Vercel KV not configured"` → Go back to Step 2

### Test 2: Run Test Script (Local)

```bash
# Add KV variables to .env.local first (same values as Step 2)
npm run dev

# In another terminal:
npm run test:rate-limit
```

Expected output:
```
✓ Vercel KV is configured correctly
✓ Request 1: Success (Remaining: 499)
✓ Request 2: Success (Remaining: 498)
Status: ✓ Rate limiting is working correctly
```

### Test 3: Monitor KV Usage

1. Go to: https://vercel.com/dashboard/stores
2. Click on `picforge-rate-limit`
3. Go to "Usage" tab
4. Should see "Commands" count increasing

---

## You're Protected!

Your API now has:
- ✓ IP-based rate limiting (500/day for main editor)
- ✓ Automatic 24-hour resets
- ✓ Graceful error messages for users
- ✓ Protection against bot attacks
- ✓ Cost-effective (~$1/month for KV)

---

## Rate Limits Per Endpoint

| Endpoint | Limit/Day | Why? |
|----------|-----------|------|
| Main Editor | 500 | Most common, reasonable for real users |
| NSFW Editor | 200 | Expensive ($0.023/image) |
| Canvas Generator | 100 | Very expensive ($0.04-$0.08/image) |
| Roast Mode | 300 | Fun feature, moderate limit |

These limits protect against abuse while allowing legitimate users to use the platform freely.

---

## What Users See When Rate Limited

**Error Message:**
```
Rate limit exceeded. Please try again later.
You've made 500 requests today. Reset in 6 hours.
```

**HTTP Status:** 429 (Too Many Requests)

**Headers:**
```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1738291200000
```

---

## Adjusting Limits (Optional)

If you need to change limits later:

**Edit:** `app/api/process-image/route.ts` (line 11)
```typescript
const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)
//                                                     ^^^
// Change to 1000 for higher limit
```

Then redeploy:
```bash
git add .
git commit -m "Increase rate limit to 1000"
git push
```

---

## Troubleshooting

**Problem:** "KV not configured" in logs
**Solution:** Verify Step 2 variables are set in Vercel Dashboard

**Problem:** Rate limiting not working
**Solution:** Redeploy (Step 3) and wait 2-3 minutes

**Problem:** Test script fails
**Solution:** Add KV variables to `.env.local` and restart dev server

**Full guide:** [RATE_LIMIT_TROUBLESHOOTING.md](RATE_LIMIT_TROUBLESHOOTING.md)

---

## Cost Estimate

**Vercel KV:**
- Free tier: 30,000 commands/month
- Beyond free: $0.25 per 100k commands
- **Your cost: ~$1/month** (well within free tier)

**Protected API Usage:**
- With rate limiting: $50-$200/month
- Without rate limiting: $10,000+ risk

**ROI:** Paying $1/month to protect against $10k+ risk = **1,000,000% ROI** 🚀

---

## Next Steps

After setup:

1. ✓ Test locally: `npm run test:rate-limit`
2. ✓ Test production: `npm run test:rate-limit -- production`
3. ✓ Monitor for 1 week (Vercel logs + KV usage)
4. ✓ Add rate limit info to your FAQ/Help page
5. ✓ Set up Vercel alerts for 429 responses (optional)

---

## Need Help?

- **Full setup guide:** [VERCEL_KV_SETUP.md](VERCEL_KV_SETUP.md)
- **Troubleshooting:** [RATE_LIMIT_TROUBLESHOOTING.md](RATE_LIMIT_TROUBLESHOOTING.md)
- **Vercel docs:** https://vercel.com/docs/storage/vercel-kv

---

**Congratulations!** You just saved potentially $10,000+/month. 🎉

Time to celebrate with a Nano Banana! 🍌
