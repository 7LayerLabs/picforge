# API Key Validation & Error Handling - Implementation Checklist

**Project:** PicForge
**Date:** October 22, 2025
**Issues:** #10 (API Key Validation), #11 (Error Handling Consistency)

---

## Pre-Deployment Checklist

### Phase 1: Local Development Setup

- [ ] **1.1** Copy `.env.example` to `.env.local` (if exists)
- [ ] **1.2** Add all required API keys to `.env.local`:
  - [ ] `GEMINI_API_KEY` (format: `AIza...`)
  - [ ] `REPLICATE_API_TOKEN` (format: `r8_...`)
  - [ ] `NEXT_PUBLIC_INSTANT_APP_ID`
  - [ ] `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`
- [ ] **1.3** Add optional API keys (if desired):
  - [ ] `OPENAI_API_KEY` (format: `sk-...`)
  - [ ] `TOGETHER_API_KEY`
  - [ ] `HF_API_TOKEN` (format: `hf_...`)
  - [ ] `RESEND_API_KEY` (format: `re_...`)
- [ ] **1.4** Run validation script: `npm run validate-env`
- [ ] **1.5** Verify all required keys show as "Configured"
- [ ] **1.6** Fix any format validation warnings

### Phase 2: Code Validation

- [ ] **2.1** Run linter: `npm run lint`
- [ ] **2.2** Fix any linting errors
- [ ] **2.3** Review modified files:
  - [ ] `lib/validateEnv.ts` - Enhanced with format validation
  - [ ] `lib/apiErrors.ts` - Already complete
  - [ ] `scripts/validate-env.ts` - Added format checking
  - [ ] `app/api/send-email/route.ts` - Standardized errors
  - [ ] `package.json` - Added validation to build script
- [ ] **2.4** Verify all API routes use `handleApiError(error)`
- [ ] **2.5** Verify all API routes use `requireEnvVar()` for required keys

### Phase 3: Local Testing

- [ ] **3.1** Start dev server: `npm run dev`
- [ ] **3.2** Run API error tests: `npm run test:api`
- [ ] **3.3** Test main editor with valid image
- [ ] **3.4** Test missing parameter error (empty request)
- [ ] **3.5** Test rate limiting (send 501 requests)
- [ ] **3.6** Test NSFW editor (if Replicate token configured)
- [ ] **3.7** Test canvas generation (if OpenAI key configured)
- [ ] **3.8** Check console for any warnings about missing keys
- [ ] **3.9** Verify graceful degradation for optional services

### Phase 4: Build Testing

- [ ] **4.1** Run production build: `npm run build`
- [ ] **4.2** Verify validation script runs before build
- [ ] **4.3** Fix any validation errors
- [ ] **4.4** Verify build completes successfully
- [ ] **4.5** Test production build locally: `npm start`
- [ ] **4.6** Spot-check key routes work in production mode

---

## Vercel Deployment Checklist

### Phase 5: Environment Variables Setup

- [ ] **5.1** Log into Vercel dashboard
- [ ] **5.2** Navigate to project settings
- [ ] **5.3** Go to Environment Variables section
- [ ] **5.4** Add required variables for all environments (Production, Preview, Development):

**Core AI Services:**
```bash
GEMINI_API_KEY=AIza[YOUR_KEY_HERE]
REPLICATE_API_TOKEN=r8_[YOUR_TOKEN_HERE]
```

**Database & Auth:**
```bash
NEXT_PUBLIC_INSTANT_APP_ID=[YOUR_APP_ID]
```

**Analytics & Rate Limiting:**
```bash
KV_URL=[VERCEL_KV_URL]
KV_REST_API_URL=[VERCEL_KV_REST_URL]
KV_REST_API_TOKEN=[VERCEL_KV_TOKEN]
KV_REST_API_READ_ONLY_TOKEN=[VERCEL_KV_READ_TOKEN]
```

**Optional Services:**
```bash
OPENAI_API_KEY=sk-[YOUR_KEY_HERE]
TOGETHER_API_KEY=[YOUR_KEY_HERE]
HF_API_TOKEN=hf_[YOUR_KEY_HERE]
RESEND_API_KEY=re_[YOUR_KEY_HERE]
STRIPE_SECRET_KEY=sk_test_[YOUR_KEY_HERE]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_SECRET_HERE]
```

- [ ] **5.5** Verify no placeholder values remain
- [ ] **5.6** Check API key formats match expected patterns

### Phase 6: Vercel KV Setup

- [ ] **6.1** Create Vercel KV database (if not exists)
- [ ] **6.2** Connect KV to project
- [ ] **6.3** Verify KV environment variables auto-populated
- [ ] **6.4** Test KV connection (deploy and check logs)

### Phase 7: Deployment

- [ ] **7.1** Push changes to main branch
- [ ] **7.2** Verify Vercel auto-deploys
- [ ] **7.3** Check build logs for validation script output
- [ ] **7.4** Verify build completes successfully
- [ ] **7.5** Check for any build warnings

### Phase 8: Production Testing

- [ ] **8.1** Visit production URL: https://pic-forge.com
- [ ] **8.2** Test main editor with image upload
- [ ] **8.3** Test 5-10 different prompts
- [ ] **8.4** Check Network tab for proper error responses
- [ ] **8.5** Verify rate limiting headers in responses
- [ ] **8.6** Test NSFW editor (if enabled)
- [ ] **8.7** Test canvas generation
- [ ] **8.8** Test roast mode
- [ ] **8.9** Check analytics tracking (visitor count)
- [ ] **8.10** Review Vercel function logs for errors

---

## Post-Deployment Validation

### Phase 9: Error Monitoring

- [ ] **9.1** Monitor Vercel function logs for 24 hours
- [ ] **9.2** Check for any API_KEY_MISSING errors
- [ ] **9.3** Check for any RATE_LIMIT_EXCEEDED patterns
- [ ] **9.4** Verify no 500 errors from missing env vars
- [ ] **9.5** Check external service errors (Gemini, Replicate, etc.)

### Phase 10: Performance Validation

- [ ] **10.1** Check average response times (should be <3s for AI operations)
- [ ] **10.2** Verify rate limiting doesn't affect legitimate users
- [ ] **10.3** Check KV storage usage
- [ ] **10.4** Monitor Replicate/OpenAI costs
- [ ] **10.5** Verify graceful degradation when optional services down

---

## Testing Scenarios

### Scenario 1: New User Flow
```
1. User visits site (no account)
2. Uploads image
3. Selects prompt
4. Generates 5 images (should succeed)
5. Reaches daily limit (should see upgrade prompt)
6. Checks remaining images (should show 15/20 left)
```

**Expected Results:**
- [ ] All 5 images generate successfully
- [ ] Rate limit tracked correctly
- [ ] Clear messaging about remaining images
- [ ] No console errors

### Scenario 2: Rate Limit Testing
```
1. Send 500 requests to /api/process-image
2. 501st request should return 429
3. Check rate limit headers
4. Wait 24 hours (or reset manually)
5. Verify limit resets
```

**Expected Results:**
- [ ] First 500 requests succeed
- [ ] 501st returns 429 with proper headers
- [ ] Headers show limit, remaining, resetTime
- [ ] Error message is user-friendly

### Scenario 3: Missing API Key
```
1. Remove GEMINI_API_KEY from Vercel env vars
2. Redeploy
3. Try to process image
```

**Expected Results:**
- [ ] Build validation catches missing key
- [ ] OR runtime returns 500 API_KEY_MISSING
- [ ] Error message clearly indicates missing key
- [ ] Logs show helpful debug information

### Scenario 4: Invalid API Key Format
```
1. Set GEMINI_API_KEY to invalid format
2. Run validation script
3. Try to build
```

**Expected Results:**
- [ ] Validation script warns about format
- [ ] Build may fail (depending on config)
- [ ] Clear error message about format issue
- [ ] Shows expected format pattern

### Scenario 5: Optional Service Degradation
```
1. Remove OPENAI_API_KEY
2. Try canvas generation
3. Should fall back to free alternative
```

**Expected Results:**
- [ ] Canvas generation still works
- [ ] Uses HuggingFace or Pollinations
- [ ] Console shows warning about fallback
- [ ] No errors thrown

---

## Rollback Plan

If issues arise in production:

### Quick Rollback
```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific commit
vercel --prod --git-commit=<previous-sha>
```

### Temporary Fix
```bash
# Disable validation temporarily
npm run build:skip-validation

# Or set emergency bypass env var
SKIP_ENV_VALIDATION=true
```

### Manual Fixes
1. Check Vercel function logs for specific errors
2. Verify environment variables in dashboard
3. Test API key formats
4. Reset rate limits if needed: `await kv.del('rate-limit:ip:...')`
5. Check external service status (Gemini, Replicate status pages)

---

## Success Criteria

### Must Have (Required for deployment)
- [x] All required API keys validated at startup
- [x] Consistent error responses across all routes
- [x] Rate limiting functional and persistent (Vercel KV)
- [x] Graceful degradation for optional services
- [x] Clear error messages for end users
- [x] API key format validation working

### Nice to Have (Can deploy without)
- [ ] Email notifications working (optional)
- [ ] Stripe webhooks configured (optional)
- [ ] All optional API keys configured

### Metrics to Track
- Average API response time: < 3 seconds
- Error rate: < 5% of requests
- Rate limit triggers: < 100/day
- API key validation failures: 0 in production
- Build failures due to validation: Only when truly missing keys

---

## Common Issues & Solutions

### Issue: "GEMINI_API_KEY format validation failed"
**Solution:**
- Check key starts with `AIza`
- Verify no extra spaces or quotes
- Regenerate key at https://aistudio.google.com/app/apikey

### Issue: "Rate limit exceeded" immediately
**Solution:**
- Reset KV counter: `await kv.del('rate-limit:ip:YOUR_IP')`
- Or wait 24 hours for automatic reset
- Check if multiple users behind same proxy/NAT

### Issue: "Replicate quota exceeded"
**Solution:**
- Check billing at https://replicate.com/account/billing
- Add credits ($10 = ~435 images)
- Or temporarily disable NSFW editor

### Issue: "Email sending failed" but no error
**Solution:**
- Check if RESEND_API_KEY is set
- Verify domain verified at Resend
- Or ignore (emails are optional feature)

### Issue: Build fails with validation error in CI/CD
**Solution:**
- Verify env vars set in GitHub Actions secrets
- Or use `npm run build:skip-validation` in CI
- Or set `SKIP_ENV_VALIDATION=true` temporarily

---

## Documentation Links

- **Full Implementation Details:** `API_VALIDATION_IMPLEMENTATION.md`
- **Developer Quick Reference:** `API_ERROR_HANDLING_GUIDE.md`
- **This Checklist:** `VALIDATION_CHECKLIST.md`

---

## Sign-Off

### Development
- [ ] Code reviewed and tested locally
- [ ] All validation scripts pass
- [ ] Documentation complete
- **Developer:** _________________ **Date:** _________

### Deployment
- [ ] Environment variables configured
- [ ] Production build successful
- [ ] Production testing complete
- **Deployer:** _________________ **Date:** _________

### Verification
- [ ] 24-hour monitoring complete
- [ ] No critical errors detected
- [ ] Performance metrics acceptable
- **Verifier:** _________________ **Date:** _________

---

**Status:** ✅ READY FOR DEPLOYMENT
**Last Updated:** October 22, 2025
