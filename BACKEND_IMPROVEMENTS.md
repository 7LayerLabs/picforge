# Backend Improvements - Migration Guide

## Summary of Changes

This document outlines the backend improvements made to PicForge to standardize error handling, environment variable validation, and rate limiting using Vercel KV.

## New Library Files

### 1. `lib/validateEnv.ts` - Environment Variable Validation

Utility functions to validate required environment variables at runtime with clear error messages.

**Key Functions:**
- `requireEnvVar(key, context?)` - Require an env var, throw if missing or placeholder
- `getEnvVar(key, defaultValue)` - Get optional env var with default
- `isEnvVarConfigured(key)` - Check if env var is properly configured
- `validateEnvVars(vars[])` - Validate multiple env vars at once

**Usage Example:**
```typescript
import { requireEnvVar } from '@/lib/validateEnv'

// In your API route
const apiKey = requireEnvVar('OPENAI_API_KEY', 'OpenAI DALL-E')
// Throws clear error if missing: "Missing required environment variable: OPENAI_API_KEY (needed for OpenAI DALL-E)"
```

### 2. `lib/apiErrors.ts` - Standardized Error Handling

Provides consistent error responses across all API routes with proper status codes, error codes, and user-friendly messages.

**Key Components:**
- `ApiError` class - Custom error with statusCode, code, message, and optional details
- `ErrorCodes` - Constants for consistent error codes
- `Errors` - Pre-configured error factories for common scenarios
- `handleApiError()` - Catch-all error handler that converts any error to proper NextResponse
- `withErrorHandler()` - HOC wrapper for automatic error handling

**Usage Example:**
```typescript
import { Errors, handleApiError } from '@/lib/apiErrors'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      throw Errors.missingParameter('image')
    }

    // ... your logic ...

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
```

**Available Error Factories:**
- `Errors.missingParameter(paramName)`
- `Errors.invalidInput(message)`
- `Errors.rateLimitExceeded(resetTime?)`
- `Errors.unauthorized(message?)`
- `Errors.forbidden(message?)`
- `Errors.apiKeyMissing(service)`
- `Errors.apiKeyInvalid(service)`
- `Errors.externalServiceError(service, message?)`
- `Errors.quotaExceeded(service)`
- `Errors.imageProcessingFailed(reason?)`
- `Errors.generationFailed(reason?)`
- `Errors.internal(message?)`

### 3. `lib/rateLimitKv.ts` - Vercel KV Rate Limiting

Persistent rate limiting using Vercel KV (Redis) that survives serverless function restarts.

**Key Functions:**
- `checkRateLimitKv(identifier, maxRequests, windowMs)` - Check and increment rate limit
- `resetRateLimitKv(identifier)` - Reset rate limit (admin use)
- `getRateLimitStatusKv(identifier, ...)` - Check status without incrementing
- `getClientIdentifier(request)` - Extract client IP from request headers

**Setup Required:**
```bash
# Create Vercel KV database at: https://vercel.com/dashboard/stores
# Add these environment variables:
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

**Usage Example:**
```typescript
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request)
  const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)

  if (!rateLimit.allowed) {
    throw Errors.rateLimitExceeded(rateLimit.resetTime)
  }

  // ... process request ...
}
```

**Graceful Degradation:**
If Vercel KV is not configured, the rate limiter will:
- Log a warning to console
- Allow all requests (fail open)
- Return mock success responses

This means the API won't break if KV isn't set up yet.

## Updated API Routes

### 1. `/api/process-image-nsfw/route.ts`

**Changes:**
- Added `requireEnvVar()` for REPLICATE_API_TOKEN validation
- Replaced manual error responses with `Errors.*` factories
- Added `handleApiError()` catch-all handler
- Removed repetitive error handling code

**Before:**
```typescript
if (!process.env.REPLICATE_API_TOKEN) {
  return NextResponse.json({ error: 'Missing API token' }, { status: 500 })
}
```

**After:**
```typescript
const replicateToken = requireEnvVar('REPLICATE_API_TOKEN', 'Replicate NSFW processing')
// Automatically throws clear error if missing or placeholder
```

### 2. `/api/generate-canvas/route.ts`

**Changes:**
- Added `requireEnvVar()` for OPENAI_API_KEY validation
- Consolidated OpenAI-specific error handling into `Errors.quotaExceeded()` and `Errors.externalServiceError()`
- Simplified catch block from 30+ lines to 15 lines
- Better error categorization (quota vs. general errors)

### 3. `/api/roast/route.ts`

**Changes:**
- Added `requireEnvVar()` for GEMINI_API_KEY validation
- Moved Gemini API initialization inside the handler (better for serverless)
- Replaced manual error response with `handleApiError()`

## Deprecated Files

### `app/api/process-image/rate-limit.ts`

**Status:** Deprecated but not removed (for backward compatibility)

This in-memory rate limiter resets on serverless function restarts, making it ineffective on Vercel.

**Migration Path:**
1. Set up Vercel KV (see below)
2. Import from `lib/rateLimitKv.ts` instead
3. Replace `checkRateLimit()` with `checkRateLimitKv()`

## Setup Instructions

### 1. Vercel KV Setup (Required for Rate Limiting)

**Step 1:** Create KV Database
1. Go to: https://vercel.com/dashboard/stores
2. Click "Create Database"
3. Select "KV" (Redis)
4. Choose a region (closest to your users)
5. Click "Create"

**Step 2:** Connect to Your Project
1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Environment Variables"
3. Add KV environment variables (Vercel provides these):
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

**Step 3:** Add to Local Development
1. Copy the KV variables from Vercel dashboard
2. Add to `.env.local`:
   ```bash
   KV_URL="redis://..."
   KV_REST_API_URL="https://..."
   KV_REST_API_TOKEN="..."
   KV_REST_API_READ_ONLY_TOKEN="..."
   ```

### 2. Update API Routes (Gradual Migration)

You can migrate API routes one at a time. Here's the pattern:

**Before:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { param } = await request.json()

    if (!param) {
      return NextResponse.json({ error: 'Missing param' }, { status: 400 })
    }

    if (!process.env.API_KEY) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 })
    }

    // ... logic ...

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

**After:**
```typescript
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError } from '@/lib/apiErrors'

export async function POST(request: NextRequest) {
  try {
    const apiKey = requireEnvVar('API_KEY', 'Service Name')
    const { param } = await request.json()

    if (!param) {
      throw Errors.missingParameter('param')
    }

    // ... logic ...

  } catch (error) {
    return handleApiError(error)
  }
}
```

## Benefits

### 1. Consistency
- All API routes return errors in the same format
- Predictable status codes and error codes
- Easy to document for frontend developers

### 2. Better Error Messages
- Clear distinction between client errors (4xx) and server errors (5xx)
- Specific error codes for different scenarios
- Helpful messages for common issues (missing env vars, rate limits, etc.)

### 3. Easier Debugging
- Centralized error handling logic
- Less repetitive code in API routes
- Clear error categorization

### 4. Production-Ready Rate Limiting
- Persistent across serverless restarts
- Accurate rate limit tracking
- Works correctly on Vercel's distributed infrastructure

### 5. Maintainability
- Single source of truth for error types
- Easy to add new error types
- Simple migration path for existing routes

## Migration Checklist

- [x] Create `lib/validateEnv.ts`
- [x] Create `lib/apiErrors.ts`
- [x] Create `lib/rateLimitKv.ts`
- [x] Deprecate `app/api/process-image/rate-limit.ts`
- [x] Update `/api/process-image-nsfw/route.ts`
- [x] Update `/api/generate-canvas/route.ts`
- [x] Update `/api/roast/route.ts`
- [ ] Set up Vercel KV (requires Vercel dashboard access)
- [ ] Update remaining API routes (gradual migration)
- [ ] Add rate limiting to high-traffic endpoints
- [ ] Update frontend error handling to use new error codes

## Testing

### Local Testing
```bash
# Build to check for TypeScript errors
npm run build

# Test API routes with missing env vars
# Temporarily rename .env.local and restart dev server
npm run dev

# Test error responses
curl -X POST http://localhost:3000/api/generate-canvas \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}'
```

### Production Testing
1. Deploy to Vercel
2. Check build logs for any issues
3. Test API endpoints with missing parameters
4. Verify error responses match expected format
5. Monitor Vercel KV usage in dashboard

## Future Improvements

1. **Add Rate Limiting to More Routes**
   - `/api/process-image`
   - `/api/generate-canvas`
   - `/api/roast`

2. **Create Error Response Type**
   - Define TypeScript interface for error responses
   - Use in frontend for type-safe error handling

3. **Add Request ID Tracking**
   - Generate unique ID for each request
   - Include in error responses for debugging
   - Log to centralized logging service

4. **Add Retry Logic**
   - Automatic retry for transient errors
   - Exponential backoff for rate limits
   - Circuit breaker for failing external services

## Questions or Issues?

- Check the code comments in the new library files
- Test locally before deploying
- Vercel KV setup issues: https://vercel.com/docs/storage/vercel-kv
- Rate limiting patterns: https://vercel.com/docs/storage/vercel-kv/kv-reference

---

**Last Updated:** 2025-10-21
**Status:** Ready for Production (pending Vercel KV setup)
