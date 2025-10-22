# Error Handling Quick Reference

## Cheat Sheet for API Routes

### Basic API Route Template

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Validate
    const { param1, param2 } = await request.json()

    if (!param1) throw Errors.missingParameter('param1')
    if (!param2) throw Errors.missingParameter('param2')

    // Process
    const result = await doWork(param1, param2)

    // Return
    return NextResponse.json({
      success: true,
      data: result,
      metadata: { timestamp: new Date().toISOString() }
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/your-route',
      method: 'POST',
    })
  }
}
```

## Common Errors

```typescript
// Missing parameter
if (!image) throw Errors.missingParameter('image')

// Invalid input
if (size > 10 * 1024 * 1024) throw Errors.imageTooLarge('10MB')

// Not found
if (!user) throw Errors.notFound('User')

// Unauthorized
if (!session) throw Errors.unauthorized()

// Forbidden
if (user.role !== 'admin') throw Errors.forbidden()

// External service error
throw Errors.externalServiceError('OpenAI', error.message)

// Image processing error
throw Errors.imageProcessingFailed('Invalid format')

// Generic error
throw Errors.internal('Something went wrong')
```

## Client-Side Usage

```typescript
import { getErrorMessage, isRateLimitError } from '@/lib/clientApiError'

try {
  const res = await fetch('/api/endpoint', { method: 'POST', body: ... })
  const data = await res.json()

  if (!res.ok) {
    if (isRateLimitError(data)) {
      // Show upgrade modal
    }

    const message = getErrorMessage(data)
    alert(message)
    return
  }

  // Success
} catch (error) {
  alert('Network error')
}
```

## Error Codes Reference

| Code | Status | Meaning | Action |
|------|--------|---------|--------|
| `MISSING_PARAMETER` | 400 | Required param missing | Fix request |
| `INVALID_INPUT` | 400 | Invalid data | Fix input |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait or upgrade |
| `UNAUTHORIZED` | 401 | Not logged in | Sign in |
| `FORBIDDEN` | 403 | No permission | Contact admin |
| `NOT_FOUND` | 404 | Resource not found | Check URL |
| `IMAGE_TOO_LARGE` | 413 | Image too big | Resize |
| `UNSUPPORTED_FORMAT` | 415 | Wrong format | Convert |
| `INTERNAL_ERROR` | 500 | Server error | Retry |
| `API_KEY_MISSING` | 500 | Config error | Add env var |
| `EXTERNAL_SERVICE_ERROR` | 502 | 3rd party down | Retry later |
| `TIMEOUT` | 504 | Took too long | Retry |

## Response Headers

All error responses include:
- `X-Request-ID` - Unique request identifier for debugging

Rate limit errors also include:
- `X-RateLimit-Limit` - Max requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Timestamp when limit resets

## Example Error Response

```json
{
  "error": "Missing required parameter: prompt",
  "code": "MISSING_PARAMETER",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Example Success Response

```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,..."
  },
  "metadata": {
    "timestamp": "2025-01-15T10:30:00.000Z",
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

## Files Reference

- **`lib/apiErrors.ts`** - Error classes and handlers (server)
- **`lib/apiTypes.ts`** - TypeScript response types
- **`lib/errorLogger.ts`** - Error logging system
- **`lib/clientApiError.ts`** - Client-side error handling
