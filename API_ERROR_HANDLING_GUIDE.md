# API Error Handling Quick Reference

**For PicForge Developers** - How to handle errors consistently in API routes

---

## Quick Start Template

Copy-paste this template for new API routes:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting (adjust limit and window as needed)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)

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

    // 2. Validate required API keys
    const apiKey = requireEnvVar('YOUR_API_KEY', 'Your Service Name')

    // 3. Parse and validate input
    const { param1, param2 } = await request.json()

    if (!param1) throw Errors.missingParameter('param1')
    if (!param2) throw Errors.missingParameter('param2')

    // 4. Your API logic here
    const result = await yourApiCall(param1, param2)

    // 5. Return success response
    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    // 6. Centralized error handling
    return handleApiError(error)
  }
}
```

---

## Common Error Patterns

### Missing Required Parameter
```typescript
if (!image) throw Errors.missingParameter('image')
if (!prompt) throw Errors.missingParameter('prompt')
```

### Invalid Input Format
```typescript
if (!emailRegex.test(email)) {
  throw Errors.invalidInput('Invalid email format')
}

if (imageSize > MAX_SIZE) {
  throw Errors.imageTooLarge('10MB')
}

if (!['jpg', 'png'].includes(format)) {
  throw Errors.unsupportedFormat(format)
}
```

### API Key Validation
```typescript
// Required key (throws if missing)
const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini Vision API')

// Optional key (graceful degradation)
if (!isEnvVarConfigured('OPENAI_API_KEY')) {
  console.warn('OpenAI not configured, using fallback')
  // Use alternative service
}
```

### External Service Errors
```typescript
try {
  const response = await fetch(externalApi)
  if (!response.ok) {
    throw Errors.externalServiceError('ServiceName', `${response.status}`)
  }
} catch (error) {
  if (error.message.includes('timeout')) {
    throw Errors.timeout('API call')
  }
  if (error.message.includes('quota')) {
    throw Errors.quotaExceeded('ServiceName')
  }
  throw Errors.externalServiceError('ServiceName', error.message)
}
```

---

## Error Type Reference

### Client Errors (4xx) - User's fault

| Error | Status | When to Use | Example |
|-------|--------|-------------|---------|
| `missingParameter()` | 400 | Required field missing | `throw Errors.missingParameter('image')` |
| `invalidInput()` | 400 | Invalid format/value | `throw Errors.invalidInput('Email must be valid')` |
| `unauthorized()` | 401 | Auth required/failed | `throw Errors.unauthorized('Login required')` |
| `forbidden()` | 403 | Lacks permission | `throw Errors.forbidden('Admin only')` |
| `notFound()` | 404 | Resource doesn't exist | `throw Errors.notFound('Template')` |
| `imageTooLarge()` | 413 | File size exceeded | `throw Errors.imageTooLarge('10MB')` |
| `unsupportedFormat()` | 415 | Wrong file type | `throw Errors.unsupportedFormat('TIFF')` |
| `rateLimitExceeded()` | 429 | Too many requests | `throw Errors.rateLimitExceeded()` |

### Server Errors (5xx) - Our fault

| Error | Status | When to Use | Example |
|-------|--------|-------------|---------|
| `apiKeyMissing()` | 500 | Env var not set | `throw Errors.apiKeyMissing('Gemini')` |
| `apiKeyInvalid()` | 500 | Key format wrong | `throw Errors.apiKeyInvalid('OpenAI')` |
| `imageProcessingFailed()` | 500 | Processing error | `throw Errors.imageProcessingFailed('Timeout')` |
| `generationFailed()` | 500 | AI generation failed | `throw Errors.generationFailed('Model error')` |
| `internal()` | 500 | Unexpected error | `throw Errors.internal('Database error')` |
| `externalServiceError()` | 502 | 3rd party API failed | `throw Errors.externalServiceError('Replicate', '503')` |
| `quotaExceeded()` | 429 | API quota hit | `throw Errors.quotaExceeded('OpenAI')` |
| `timeout()` | 504 | Operation too slow | `throw Errors.timeout('Image generation')` |

---

## Rate Limiting Guidelines

### Recommended Limits by API Type:

```typescript
// Expensive AI operations (costs money per request)
const rateLimit = await checkRateLimitKv(identifier, 25, 24 * 60 * 60 * 1000)
// Examples: Replicate inpainting (~$0.023/image), DALL-E ($0.04/image)

// Standard AI operations
const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)
// Examples: OpenAI canvas, Hugging Face generation

// Light AI operations
const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)
// Examples: Gemini vision, text generation

// Analytics/tracking (non-AI)
// No rate limiting needed - handled by client-side throttling
```

### Custom Time Windows:

```typescript
// Per hour
checkRateLimitKv(identifier, 100, 60 * 60 * 1000)

// Per 15 minutes
checkRateLimitKv(identifier, 20, 15 * 60 * 1000)

// Per week
checkRateLimitKv(identifier, 1000, 7 * 24 * 60 * 60 * 1000)
```

---

## Environment Variable Validation

### Required Keys
```typescript
// Throws if missing - stops execution
const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini Vision API')
const token = requireEnvVar('REPLICATE_API_TOKEN', 'Replicate SDXL')
```

### Optional Keys
```typescript
// Check without throwing
if (isEnvVarConfigured('OPENAI_API_KEY')) {
  // Use OpenAI
} else {
  // Use free alternative
}
```

### Disable Format Validation (if needed)
```typescript
// Skip format check for custom keys
const customKey = requireEnvVar('CUSTOM_API_KEY', 'Custom Service', false)
```

---

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://...",
    "processedAt": "2025-10-22T12:00:00Z"
  }
}
```

### Error Response
```json
{
  "error": "Missing required parameter: image",
  "code": "MISSING_PARAMETER"
}
```

### Error with Details
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 500,
    "remaining": 0,
    "resetTime": 1729670400000
  }
}
```

---

## Testing Your API Route

### Test Missing Parameter
```bash
curl -X POST http://localhost:3000/api/your-route \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 MISSING_PARAMETER
```

### Test Invalid Input
```bash
curl -X POST http://localhost:3000/api/your-route \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email"}'

# Expected: 400 INVALID_INPUT
```

### Test Rate Limit
```bash
# Send requests until limit hit (use a script)
for i in {1..501}; do
  curl -X POST http://localhost:3000/api/your-route \
    -H "Content-Type: application/json" \
    -d '{"param":"test"}'
done

# Expected: 429 after 500 requests
```

### Test Missing API Key
```bash
# Temporarily unset key
unset GEMINI_API_KEY
npm run dev

curl -X POST http://localhost:3000/api/process-image \
  -H "Content-Type: application/json" \
  -d '{"image":"data:...","prompt":"test"}'

# Expected: 500 API_KEY_MISSING
```

---

## Debugging Tips

### Enable Verbose Logging
```typescript
export async function POST(request: NextRequest) {
  try {
    console.log('Request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers)
    })

    const body = await request.json()
    console.log('Request body:', body)

    // Your logic...

    console.log('Response:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error details:', error)
    return handleApiError(error)
  }
}
```

### Check Rate Limit Status
```typescript
// Before incrementing
const status = await getRateLimitStatusKv(identifier, 500, 24 * 60 * 60 * 1000)
console.log('Current usage:', status)
```

### Validate Environment at Runtime
```typescript
const validation = validateEnvVars([
  { key: 'GEMINI_API_KEY', context: 'Gemini Vision API' },
  { key: 'REPLICATE_API_TOKEN', context: 'Replicate SDXL' }
])

if (!validation.isValid) {
  console.error('Missing vars:', validation.missing)
  console.error('Errors:', validation.errors)
}
```

---

## Common Mistakes to Avoid

### ❌ DON'T: Return raw errors
```typescript
// Bad
catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 })
}
```

### ✅ DO: Use standardized error handler
```typescript
// Good
catch (error) {
  return handleApiError(error)
}
```

---

### ❌ DON'T: Validate in multiple places
```typescript
// Bad
if (!apiKey) {
  return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
}
```

### ✅ DO: Use utility functions
```typescript
// Good
const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini Vision API')
```

---

### ❌ DON'T: Implement custom rate limiting
```typescript
// Bad - memory resets on serverless restart
const requestCounts: Record<string, number> = {}
```

### ✅ DO: Use Vercel KV rate limiter
```typescript
// Good - persistent across restarts
const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)
```

---

### ❌ DON'T: Hardcode error messages
```typescript
// Bad
throw new Error('Image is too big')
```

### ✅ DO: Use error factories
```typescript
// Good
throw Errors.imageTooLarge('10MB')
```

---

## Advanced Patterns

### Optional Service Degradation
```typescript
export async function POST(request: NextRequest) {
  try {
    // Try primary service
    if (isEnvVarConfigured('OPENAI_API_KEY')) {
      const apiKey = requireEnvVar('OPENAI_API_KEY', 'OpenAI')
      return await generateWithOpenAI(prompt, apiKey)
    }

    // Fallback to free service
    console.warn('OpenAI not configured, using Hugging Face')
    return await generateWithHuggingFace(prompt)

  } catch (error) {
    return handleApiError(error)
  }
}
```

### Multiple Error Checks
```typescript
// Validate multiple parameters
if (!image) throw Errors.missingParameter('image')
if (!prompt) throw Errors.missingParameter('prompt')

// Validate format
if (!image.startsWith('data:image/')) {
  throw Errors.invalidInput('Image must be base64 data URL')
}

// Validate size
const imageSize = Buffer.byteLength(image, 'base64')
if (imageSize > 10 * 1024 * 1024) {
  throw Errors.imageTooLarge('10MB')
}
```

### External API Error Mapping
```typescript
try {
  const response = await fetch(replicateApi, options)
  const data = await response.json()

  if (response.status === 429) {
    throw Errors.quotaExceeded('Replicate')
  }
  if (response.status === 401) {
    throw Errors.apiKeyInvalid('Replicate')
  }
  if (!response.ok) {
    throw Errors.externalServiceError('Replicate', data.error)
  }

  return data

} catch (error) {
  if (error instanceof ApiError) throw error // Already handled
  throw Errors.externalServiceError('Replicate', String(error))
}
```

---

## Checklist for New API Routes

Before deploying a new route, verify:

- [ ] Rate limiting configured with appropriate limits
- [ ] All required API keys validated with `requireEnvVar()`
- [ ] All required parameters checked (throw `missingParameter()`)
- [ ] Input formats validated (throw `invalidInput()`)
- [ ] External API errors mapped to appropriate error types
- [ ] Success response follows `{ success: true, data: ... }` format
- [ ] Errors handled with `handleApiError(error)`
- [ ] Console logging for debugging (request received, processing, completed)
- [ ] Rate limit headers included in 429 responses
- [ ] Tested with missing parameters, invalid input, missing API keys

---

## Resources

- **Full Documentation:** `API_VALIDATION_IMPLEMENTATION.md`
- **Validation Script:** `scripts/validate-env.ts`
- **Error Utilities:** `lib/apiErrors.ts`
- **Env Utilities:** `lib/validateEnv.ts`
- **Rate Limiting:** `lib/rateLimitKv.ts`

---

**Updated:** October 22, 2025
**Version:** 1.0
