# API Routes Needing Manual Review

**Date:** October 22, 2025
**Status:** 6 routes need standardization

---

## Routes to Update

### 1. `/api/batch-styles` ⚠️ **High Priority**

**Issues:**
- ❌ Uses old API key validation: `if (!apiKey || apiKey === 'your_api_key_here')`
- ❌ Returns non-standard errors: `{ error: 'Missing image file' }`
- ❌ No rate limiting
- ❌ No error code constants

**Recommended Changes:**
```typescript
// Replace lines 72-78 with:
const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini batch processing')

// Replace lines 65-70 with:
if (!imageFile) throw Errors.missingParameter('image')

// Add rate limiting at top:
const identifier = getClientIdentifier(request)
const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)

// Wrap entire function with:
try {
  // ... existing code
} catch (error) {
  return handleApiError(error)
}
```

---

### 2. `/api/create-checkout-session` ⚠️ **Medium Priority**

**Current Status:** Unknown (need to read file)

**Expected Issues:**
- Likely needs Stripe key validation
- May need standardized error responses
- Should validate session parameters

**Recommended Pattern:**
```typescript
const stripeKey = requireEnvVar('STRIPE_SECRET_KEY', 'Stripe checkout')
if (!customerId) throw Errors.missingParameter('customerId')
// ... etc
```

---

### 3. `/api/generate-caption` ⚠️ **Medium Priority**

**Current Status:** Unknown (need to read file)

**Expected Issues:**
- Likely uses Gemini API
- May need key validation
- Should standardize error responses

---

### 4. `/api/process-image-v2` ⚠️ **Low Priority**

**Notes:**
- This is an alternative/experimental processor
- May be deprecated or unused
- Check if actively used before updating

**Recommendation:**
- Verify if still used in production
- If yes: standardize like `process-image`
- If no: consider removing

---

### 5. `/api/sample-images` ⚠️ **Low Priority**

**Expected Behavior:**
- Returns list of sample images
- Probably doesn't need API keys
- May be simple GET endpoint

**Likely Minimal Changes Needed:**
```typescript
try {
  // ... existing code
} catch (error) {
  return handleApiError(error)
}
```

---

### 6. `/api/test-batch` ⚠️ **Low Priority**

**Notes:**
- Test endpoint (not production)
- May not need full standardization
- Could be removed before production

**Recommendation:**
- If used for development: add basic error handling
- If unused: remove from codebase

---

## Quick Fix Template

For any route needing updates, follow this pattern:

### Step 1: Add Imports
```typescript
import { requireEnvVar, isEnvVarConfigured } from '@/lib/validateEnv'
import { Errors, handleApiError } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
```

### Step 2: Add Rate Limiting (if needed)
```typescript
export async function POST(request: NextRequest) {
  try {
    // Add rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    // ... rest of code
```

### Step 3: Replace API Key Checks
```typescript
// OLD:
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey || apiKey === 'your_api_key_here') {
  return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
}

// NEW:
const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini API')
```

### Step 4: Replace Error Responses
```typescript
// OLD:
if (!param) {
  return NextResponse.json({ error: 'Missing param' }, { status: 400 })
}

// NEW:
if (!param) throw Errors.missingParameter('param')
```

### Step 5: Add Error Handler
```typescript
  } catch (error) {
    return handleApiError(error)
  }
}
```

---

## Priority Order

1. **High Priority** (Update before next deployment):
   - `/api/batch-styles` - Used in production, needs immediate attention

2. **Medium Priority** (Update within 1 week):
   - `/api/create-checkout-session` - Payment critical
   - `/api/generate-caption` - If actively used

3. **Low Priority** (Update when convenient):
   - `/api/process-image-v2` - Verify if still used
   - `/api/sample-images` - Simple endpoint
   - `/api/test-batch` - Test endpoint only

---

## Verification Checklist

After updating each route:

- [ ] Imports added (`validateEnv`, `apiErrors`, `rateLimitKv`)
- [ ] Rate limiting implemented (if AI operation)
- [ ] API key validation uses `requireEnvVar()`
- [ ] Parameter validation uses `Errors.missingParameter()`
- [ ] All errors use `throw Errors.*` pattern
- [ ] Wrapped in `try/catch` with `handleApiError()`
- [ ] Tested locally with missing parameters
- [ ] Tested with missing API key
- [ ] Verified error responses have `error` and `code` fields

---

## Testing Each Route

```bash
# Test missing parameter
curl -X POST http://localhost:3000/api/batch-styles \
  -F "batchType=multiStyle"
# Expected: 400 MISSING_PARAMETER

# Test missing API key (remove from .env temporarily)
unset GEMINI_API_KEY
npm run dev
curl -X POST http://localhost:3000/api/batch-styles \
  -F "image=@test.jpg" \
  -F "batchType=multiStyle"
# Expected: 500 API_KEY_MISSING

# Test rate limiting (send 101+ requests)
for i in {1..102}; do
  curl -X POST http://localhost:3000/api/batch-styles \
    -F "image=@test.jpg" \
    -F "batchType=multiStyle"
done
# Expected: 429 after 100 requests
```

---

## Estimated Time

- **batch-styles:** 15 minutes
- **create-checkout-session:** 10 minutes
- **generate-caption:** 10 minutes
- **process-image-v2:** 5 minutes (or remove)
- **sample-images:** 5 minutes
- **test-batch:** 2 minutes (or remove)

**Total:** ~45-60 minutes to standardize all 6 routes

---

## Status Tracker

| Route | Status | Priority | Assigned | Completed |
|-------|--------|----------|----------|-----------|
| `/api/batch-styles` | ❌ Needs Update | High | - | - |
| `/api/create-checkout-session` | ❌ Needs Review | Medium | - | - |
| `/api/generate-caption` | ❌ Needs Review | Medium | - | - |
| `/api/process-image-v2` | ❌ Needs Review | Low | - | - |
| `/api/sample-images` | ❌ Needs Review | Low | - | - |
| `/api/test-batch` | ❌ Needs Review | Low | - | - |

**14 routes already complete:**
- ✅ `/api/process-image`
- ✅ `/api/process-image-nsfw`
- ✅ `/api/generate-canvas`
- ✅ `/api/generate-canvas-free`
- ✅ `/api/generate-canvas-hf`
- ✅ `/api/generate-canvas-pollinations`
- ✅ `/api/roast`
- ✅ `/api/inpaint`
- ✅ `/api/webhooks/stripe`
- ✅ `/api/send-email`
- ✅ `/api/track-visitor`
- ✅ `/api/track-share`
- ✅ `/api/track-template`
- ✅ `/api/visitor-stats`

---

## Next Steps

1. Read each route file to understand current implementation
2. Update highest priority routes first (`batch-styles`)
3. Test each route after updating
4. Update this tracker as routes are completed
5. Run full test suite: `npm run test:api`
6. Deploy to production once all high-priority routes are done

---

**Last Updated:** October 22, 2025
