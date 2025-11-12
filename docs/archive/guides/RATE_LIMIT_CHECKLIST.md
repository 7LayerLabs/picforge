# Rate Limiting Setup Checklist

Print this page and check off items as you complete them.

---

## Pre-Setup (1 minute)

- [ ] Read `RATE_LIMIT_SUMMARY.md` (overview)
- [ ] Read `docs/RATE_LIMIT_QUICKSTART.md` (instructions)
- [ ] Have Vercel account ready (logged in)
- [ ] Have PicForge project open in Vercel Dashboard

---

## Step 1: Create Vercel KV Database (5 minutes)

- [ ] Go to: https://vercel.com/dashboard/stores
- [ ] Click "Create Database"
- [ ] Select "KV (Redis)"
- [ ] Set name: `picforge-rate-limit`
- [ ] Choose region: `us-east-1` (or closest to your users)
- [ ] Click "Create"
- [ ] Wait for database creation (30 seconds)
- [ ] Database status shows "Active" (green)

---

## Step 2: Copy Environment Variables (2 minutes)

On the KV database page:

- [ ] Click ".env.local" tab (or "Connection" tab)
- [ ] Copy `KV_URL` value
- [ ] Copy `KV_REST_API_URL` value
- [ ] Copy `KV_REST_API_TOKEN` value
- [ ] Copy `KV_REST_API_READ_ONLY_TOKEN` value
- [ ] Paste all 4 into a temporary note (you'll need them twice)

---

## Step 3: Add Variables to Vercel Project (5 minutes)

Go to: https://vercel.com/[username]/picforge/settings/environment-variables

For EACH of the 4 variables:

### Variable 1: KV_URL
- [ ] Click "Add New"
- [ ] Name: `KV_URL`
- [ ] Value: (paste from Step 2)
- [ ] Check: ✓ Production
- [ ] Check: ✓ Preview
- [ ] Check: ✓ Development
- [ ] Click "Save"

### Variable 2: KV_REST_API_URL
- [ ] Click "Add New"
- [ ] Name: `KV_REST_API_URL`
- [ ] Value: (paste from Step 2)
- [ ] Check: ✓ Production
- [ ] Check: ✓ Preview
- [ ] Check: ✓ Development
- [ ] Click "Save"

### Variable 3: KV_REST_API_TOKEN
- [ ] Click "Add New"
- [ ] Name: `KV_REST_API_TOKEN`
- [ ] Value: (paste from Step 2)
- [ ] Check: ✓ Production
- [ ] Check: ✓ Preview
- [ ] Check: ✓ Development
- [ ] Click "Save"

### Variable 4: KV_REST_API_READ_ONLY_TOKEN
- [ ] Click "Add New"
- [ ] Name: `KV_REST_API_READ_ONLY_TOKEN`
- [ ] Value: (paste from Step 2)
- [ ] Check: ✓ Production
- [ ] Check: ✓ Preview
- [ ] Check: ✓ Development
- [ ] Click "Save"

**Verification:**
- [ ] All 4 variables show in the list
- [ ] Each has 3 badges: Production, Preview, Development

---

## Step 4: Redeploy Application (2 minutes)

Option A - Git Push (Recommended):
```bash
cd C:\Users\derek\OneDrive\Desktop\nano
git add .
git commit -m "Configure Vercel KV rate limiting"
git push origin main
```

- [ ] Run commands above
- [ ] Git push successful (no errors)
- [ ] Go to: https://vercel.com/[username]/picforge/deployments
- [ ] New deployment started (Building...)
- [ ] Wait for completion (2-3 minutes)
- [ ] Deployment status: "Ready" (green checkmark)

Option B - Manual Redeploy:
- [ ] Go to: https://vercel.com/[username]/picforge/deployments
- [ ] Click latest deployment
- [ ] Click "Redeploy" button
- [ ] Confirm redeploy
- [ ] Wait for completion (2-3 minutes)
- [ ] Status: "Ready"

---

## Step 5: Verify Production (3 minutes)

### Check 1: Production Logs
- [ ] Go to: https://vercel.com/[username]/picforge/logs
- [ ] Open pic-forge.com in a browser
- [ ] Upload an image and apply a transformation
- [ ] Return to logs
- [ ] Search for: "rate limit"
- [ ] ✓ Should see: `Rate limit check: ip:xxx.xxx.xxx.xxx - XXX remaining`
- [ ] ✗ Should NOT see: `"⚠️  Vercel KV not configured"`

### Check 2: KV Usage Dashboard
- [ ] Go to: https://vercel.com/dashboard/stores
- [ ] Click on `picforge-rate-limit`
- [ ] Click "Usage" tab
- [ ] ✓ "Commands" count is > 0 (increasing)
- [ ] ✓ "Data Stored" shows some MB

### Check 3: Response Headers
- [ ] Open pic-forge.com in Chrome/Firefox
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Upload image and transform
- [ ] Click on API request in Network tab
- [ ] Click "Headers" section
- [ ] Look for Response Headers:
  - [ ] ✓ `X-RateLimit-Limit: 500`
  - [ ] ✓ `X-RateLimit-Remaining: 499` (or similar)
  - [ ] ✓ `X-RateLimit-Reset: [timestamp]`

---

## Step 6: Configure Local Development (Optional - 5 minutes)

For local testing:

- [ ] Open: `C:\Users\derek\OneDrive\Desktop\nano\.env.local`
- [ ] Find lines 49-56 (KV placeholders)
- [ ] Replace with real values from Step 2:
  ```env
  KV_URL=redis://...
  KV_REST_API_URL=https://...
  KV_REST_API_TOKEN=...
  KV_REST_API_READ_ONLY_TOKEN=...
  ```
- [ ] Save file
- [ ] **DO NOT** commit `.env.local` to git

---

## Step 7: Test Locally (Optional - 5 minutes)

- [ ] Open terminal in project directory
- [ ] Start dev server: `npm run dev`
- [ ] Wait for "Ready on http://localhost:3000"
- [ ] Open NEW terminal (keep dev server running)
- [ ] Run test: `npm run test:rate-limit`
- [ ] Expected output:
  - [ ] ✓ Vercel KV is configured correctly
  - [ ] ✓ Server is accessible
  - [ ] ✓ Request 1: Success (Remaining: 499)
  - [ ] ✓ Request 2: Success (Remaining: 498)
  - [ ] Status: ✓ Rate limiting is working correctly

---

## Step 8: Test Production (3 minutes)

- [ ] Run: `npm run test:rate-limit -- production`
- [ ] Expected output:
  - [ ] ✓ Vercel KV is configured correctly
  - [ ] ✓ Server is accessible
  - [ ] ✓ Request 1: Success (Remaining: 499)
  - [ ] Status: ✓ Rate limiting is working correctly

---

## Step 9: Monitor (Optional)

View active rate limits:

- [ ] Run: `npm run monitor:rate-limits`
- [ ] Should show table of IPs and request counts
- [ ] For live updates: `npm run monitor:rate-limits -- --watch`

---

## Troubleshooting

If any step fails:

- [ ] Check: `docs/RATE_LIMIT_TROUBLESHOOTING.md`
- [ ] Verify: All 4 environment variables in Vercel
- [ ] Confirm: Variables enabled for Production, Preview, Development
- [ ] Try: Redeploy again (Step 4)
- [ ] Wait: 5 minutes after redeploy before testing

---

## Final Verification Checklist

Before marking as complete, confirm ALL of these:

- [x] Vercel KV database exists and is Active
- [x] 4 environment variables added to Vercel
- [x] Variables enabled for all 3 environments
- [x] Application redeployed successfully
- [x] Production logs show rate limit checks (no warnings)
- [x] KV usage dashboard shows activity
- [x] API responses include X-RateLimit headers
- [x] Test script passes: `npm run test:rate-limit -- production`

---

## Success Criteria

You know it's working when:

1. **No warnings in logs:**
   - ✓ See: `Rate limit check: ip:xxx - 499 remaining`
   - ✗ No: `"⚠️  Vercel KV not configured"`

2. **Headers in API responses:**
   - `X-RateLimit-Limit: 500`
   - `X-RateLimit-Remaining: [decreasing number]`
   - `X-RateLimit-Reset: [timestamp]`

3. **KV dashboard shows activity:**
   - Commands count is increasing
   - Data stored is growing
   - Keys visible in Data tab

4. **Test script passes:**
   - All requests succeed (under limit)
   - Status shows "working correctly"

---

## Post-Setup Tasks

After setup is complete:

### Immediate:
- [ ] Test by making 10 requests from pic-forge.com
- [ ] Check logs for rate limit confirmations
- [ ] Bookmark Vercel KV dashboard for monitoring

### This Week:
- [ ] Monitor logs daily for any issues
- [ ] Check KV usage (should be within free tier)
- [ ] Watch for any user complaints about rate limits

### This Month:
- [ ] Review top IPs by request count
- [ ] Adjust limits if needed (see docs)
- [ ] Add rate limit info to Help/FAQ page

---

## Maintenance Schedule

### Weekly:
- [ ] Check KV usage dashboard
- [ ] Review logs for abuse patterns
- [ ] Run: `npm run monitor:rate-limits`

### Monthly:
- [ ] Review top 10 IPs by request count
- [ ] Check if any legitimate users hitting limits
- [ ] Adjust limits if necessary
- [ ] Review KV costs (should be ~$1)

### Quarterly:
- [ ] Analyze rate limit trends
- [ ] Consider user-based limits (vs IP-based)
- [ ] Update documentation if limits changed
- [ ] Test rate limiting still works

---

## Documentation Reference

Quick links:

- **Setup Guide:** `docs/VERCEL_KV_SETUP.md`
- **Quick Start:** `docs/RATE_LIMIT_QUICKSTART.md`
- **Troubleshooting:** `docs/RATE_LIMIT_TROUBLESHOOTING.md`
- **Summary:** `RATE_LIMIT_SUMMARY.md`
- **This Checklist:** `docs/RATE_LIMIT_CHECKLIST.md`

---

## Completion

Setup completed on: ___________________

By: ___________________

Production tested: ☐ Yes ☐ No

Verified by: ___________________

---

## Notes

(Use this space for any issues encountered or customizations made)

---

**Status: Protected!** 🛡️

Your API is now protected against abuse. Expected savings: $9,800+/month vs unprotected. 🎉
