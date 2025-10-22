# Error Handling Implementation Guide

## Overview

PicForge now has a comprehensive, standardized error handling system across all API routes. This guide explains the implementation and how to use it.

## Architecture

### Core Files

1. **`lib/apiErrors.ts`** - Error classes, factories, and handlers
2. **`lib/apiTypes.ts`** - TypeScript types for API responses
3. **`lib/errorLogger.ts`** - Centralized error logging with security
4. **`lib/clientApiError.ts`** - Client-side error handling utilities

## Error Handling System

### 1. Error Classes (`lib/apiErrors.ts`)

#### ApiError Class
Custom error class with status code and error code:

```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

#### Error Codes
Standardized error codes for consistency:

**Client Errors (4xx):**
- `MISSING_PARAMETER` - Required parameter not provided
- `INVALID_INPUT` - Invalid input data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found

**Server Errors (5xx):**
- `INTERNAL_ERROR` - Unexpected server error
- `API_KEY_MISSING` - Required API key not configured
- `API_KEY_INVALID` - Invalid or expired API key
- `EXTERNAL_SERVICE_ERROR` - Third-party service error
- `QUOTA_EXCEEDED` - Service quota exceeded
- `TIMEOUT` - Operation timed out

**PicForge Specific:**
- `IMAGE_PROCESSING_FAILED` - Image processing error
- `IMAGE_TOO_LARGE` - Image exceeds size limit
- `UNSUPPORTED_FORMAT` - Unsupported image format
- `GENERATION_FAILED` - Image generation error

#### Error Factories

Pre-configured error factories for common scenarios:

```typescript
// Missing parameter
throw Errors.missingParameter('prompt')

// Invalid input
throw Errors.invalidInput('Image must be JPEG or PNG')

// Rate limit
throw Errors.rateLimitExceeded(resetTime)

// Authentication
throw Errors.unauthorized('Please sign in')

// Not found
throw Errors.notFound('User')

// API key issues
throw Errors.apiKeyMissing('Gemini')
throw Errors.apiKeyInvalid('OpenAI')

// External service
throw Errors.externalServiceError('Replicate', 'Model not found')

// Quota
throw Errors.quotaExceeded('OpenAI')

// Timeout
throw Errors.timeout('Image processing')

// Image errors
throw Errors.imageProcessingFailed('Invalid format')
throw Errors.imageTooLarge('10MB')
throw Errors.unsupportedFormat('TIFF')
throw Errors.generationFailed('Prompt blocked')

// Generic
throw Errors.internal('Unexpected error')
```

### 2. API Response Types (`lib/apiTypes.ts`)

#### Error Response
```typescript
interface ApiErrorResponse {
  error: string          // Human-readable error message
  code: string           // Error code (e.g., "RATE_LIMIT_EXCEEDED")
  details?: Record<string, unknown>  // Additional error details
  requestId?: string     // Unique request ID for debugging
  timestamp?: string     // ISO timestamp
}
```

#### Success Response
```typescript
interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
  metadata?: {
    timestamp: string
    requestId?: string
    [key: string]: unknown
  }
}
```

#### Specialized Response Types
- `ImageProcessResponse` - Image transformation results
- `CanvasGenerateResponse` - AI canvas generation results
- `RoastResponse` - Roast mode results
- `TrackingResponse` - Analytics tracking results
- `VisitorStatsResponse` - Visitor statistics

### 3. Error Logging (`lib/errorLogger.ts`)

Centralized logging with security and context:

```typescript
// Log error with context
logError(error, {
  requestId: 'uuid-here',
  route: '/api/process-image',
  method: 'POST',
  userId: 'user123',
  ip: '1.2.3.4',
})

// Log warning
logWarning('API quota approaching limit', { usage: 95 })

// Log info
logInfo('Large image uploaded', { size: '8MB' })
```

**Features:**
- Automatic sensitive data sanitization (passwords, API keys, tokens)
- Pretty printing in development
- Structured JSON in production
- Ready for external logging services (Sentry, LogRocket, Datadog)

### 4. Client-Side Error Handling (`lib/clientApiError.ts`)

Utilities for handling errors in the frontend:

```typescript
import { getErrorMessage, handleClientError } from '@/lib/clientApiError'

// Get user-friendly message
const message = getErrorMessage(apiError)

// Handle error with suggested action
const { message, action, isRetryable } = handleClientError(error)

// Format for toast notification
const { title, description, variant } = formatErrorForToast(error)

// Check error type
if (isRateLimitError(error)) {
  // Show upgrade prompt
}

if (isAuthError(error)) {
  // Redirect to sign in
}
```

## API Route Implementation

### Standard Pattern

All API routes follow this pattern:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // 2. Input validation
    const { image, prompt } = await request.json()

    if (!image) {
      throw Errors.missingParameter('image')
    }

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // 3. Business logic
    const result = await processImage(image, prompt)

    // 4. Return success
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
      }
    })

  } catch (error) {
    // 5. Centralized error handling
    return handleApiError(error, {
      route: '/api/process-image',
      method: 'POST',
    })
  }
}
```

### Helper Functions

#### createRateLimitResponse
Standardized rate limit error with headers:

```typescript
if (!rateLimit.allowed) {
  return createRateLimitResponse(rateLimit)
}
```

Returns:
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 500,
    "remaining": 0,
    "resetTime": 1640995200000
  },
  "requestId": "uuid-here",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

Headers:
- `X-RateLimit-Limit: 500`
- `X-RateLimit-Remaining: 0`
- `X-RateLimit-Reset: 1640995200000`
- `X-Request-ID: uuid-here`

#### createSuccessResponse
Standardized success response:

```typescript
return createSuccessResponse(
  { imageUrl: 'data:image/png;base64,...' },
  'Image processed successfully',
  { processingTime: 2.5 }
)
```

Returns:
```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,..."
  },
  "message": "Image processed successfully",
  "metadata": {
    "timestamp": "2025-01-15T10:30:00.000Z",
    "requestId": "uuid-here",
    "processingTime": 2.5
  }
}
```

#### handleApiError
Centralized error handling with logging:

```typescript
catch (error) {
  return handleApiError(error, {
    route: '/api/process-image',
    method: 'POST',
    userId: user?.id,
  })
}
```

### withErrorHandler Wrapper

Alternative approach using HOF (Higher-Order Function):

```typescript
export const POST = withErrorHandler(
  async (request) => {
    const { image, prompt } = await request.json()

    if (!image) {
      throw Errors.missingParameter('image')
    }

    const result = await processImage(image, prompt)

    return NextResponse.json({ success: true, data: result })
  },
  '/api/process-image'
)
```

## Updated API Routes

All routes have been standardized:

### Image Processing Routes
- ✅ `/api/process-image` - Main image processing (Gemini)
- ✅ `/api/process-image-nsfw` - NSFW processing (Replicate)
- ✅ `/api/roast` - AI photo roasting
- ✅ `/api/inpaint` - Image inpainting

### Canvas Generation Routes
- ✅ `/api/generate-canvas` - DALL-E generation
- ✅ `/api/generate-canvas-free` - Together AI (free)
- ✅ `/api/generate-canvas-hf` - HuggingFace (free)
- ✅ `/api/generate-canvas-pollinations` - Pollinations (free)

### Analytics Routes
- ✅ `/api/track-visitor` - Visitor tracking
- ✅ `/api/track-share` - Share tracking
- ✅ `/api/track-template` - Template usage
- ✅ `/api/visitor-stats` - Visitor statistics

### Communication Routes
- ✅ `/api/send-email` - Email sending

### Webhook Routes
- ✅ `/api/webhooks/stripe` - Stripe webhooks

## Frontend Integration

### React Hook Example

```typescript
'use client'

import { useState } from 'react'
import { getErrorMessage, isRateLimitError } from '@/lib/clientApiError'
import { ApiErrorResponse } from '@/lib/apiTypes'

export function useImageProcessing() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processImage = async (image: string, prompt: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorResponse = data as ApiErrorResponse

        // Check for rate limit
        if (isRateLimitError(errorResponse)) {
          setError('Daily limit reached! Upgrade for unlimited access.')
          return null
        }

        // Get user-friendly message
        setError(getErrorMessage(errorResponse))
        return null
      }

      return data
    } catch (err) {
      setError('Network error. Please check your connection.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { processImage, loading, error }
}
```

### Toast Notification Example

```typescript
import { formatErrorForToast } from '@/lib/clientApiError'
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

try {
  const response = await fetch('/api/process-image', {
    method: 'POST',
    body: JSON.stringify({ image, prompt }),
  })

  if (!response.ok) {
    const error = await response.json()
    const { title, description, variant } = formatErrorForToast(error)

    toast({ title, description, variant })
    return
  }

  // Success
  toast({
    title: 'Success',
    description: 'Image processed successfully!',
  })
} catch (error) {
  const { title, description, variant } = formatErrorForToast(error)
  toast({ title, description, variant })
}
```

## Error Response Examples

### Rate Limit Error (429)
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 500,
    "remaining": 0,
    "resetTime": 1640995200000
  },
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Missing Parameter Error (400)
```json
{
  "error": "Missing required parameter: prompt",
  "code": "MISSING_PARAMETER",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### External Service Error (502)
```json
{
  "error": "Replicate service error: Model not found",
  "code": "EXTERNAL_SERVICE_ERROR",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Image Processing Error (500)
```json
{
  "error": "Image processing failed: Invalid image format",
  "code": "IMAGE_PROCESSING_FAILED",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Authentication Error (401)
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Debugging

### Request IDs
Every error response includes a unique `requestId` for tracking:

```json
{
  "error": "...",
  "code": "...",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

Use this ID to search logs and trace the error.

### Error Logs (Development)
```
═══════════════════════════════════════════
🔴 API ERROR
═══════════════════════════════════════════
Time: 2025-01-15T10:30:00.000Z
Route: /api/process-image
Method: POST
Request ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
───────────────────────────────────────────
Error: Missing required parameter: prompt
Code: MISSING_PARAMETER
Status: 400
───────────────────────────────────────────
Stack Trace:
  at POST (/api/process-image/route.ts:45:11)
  ...
───────────────────────────────────────────
Context: {
  "route": "/api/process-image",
  "method": "POST",
  "ip": "1.2.3.4"
}
═══════════════════════════════════════════
```

### Error Logs (Production)
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "error": {
    "name": "ApiError",
    "message": "Missing required parameter: prompt",
    "code": "MISSING_PARAMETER",
    "statusCode": 400
  },
  "context": {
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "route": "/api/process-image",
    "method": "POST",
    "ip": "1.2.3.4"
  },
  "environment": "production"
}
```

## Best Practices

### DO ✅

1. **Use error factories for common errors:**
   ```typescript
   if (!prompt) {
     throw Errors.missingParameter('prompt')
   }
   ```

2. **Include context in error handlers:**
   ```typescript
   catch (error) {
     return handleApiError(error, {
       route: '/api/process-image',
       method: 'POST',
       userId: user?.id,
     })
   }
   ```

3. **Use createRateLimitResponse for rate limits:**
   ```typescript
   if (!rateLimit.allowed) {
     return createRateLimitResponse(rateLimit)
   }
   ```

4. **Log important events:**
   ```typescript
   logInfo('Image processed successfully', {
     userId: user.id,
     processingTime: 2.5,
   })
   ```

### DON'T ❌

1. **Don't create custom error responses:**
   ```typescript
   // ❌ BAD
   return NextResponse.json({ error: 'Something failed' }, { status: 500 })

   // ✅ GOOD
   throw Errors.internal('Something failed')
   ```

2. **Don't expose sensitive data in errors:**
   ```typescript
   // ❌ BAD
   throw new Error(`API key ${apiKey} is invalid`)

   // ✅ GOOD
   throw Errors.apiKeyInvalid('OpenAI')
   ```

3. **Don't swallow errors silently:**
   ```typescript
   // ❌ BAD
   try {
     await processImage()
   } catch {
     // Ignored
   }

   // ✅ GOOD
   catch (error) {
     return handleApiError(error)
   }
   ```

4. **Don't forget to add route context:**
   ```typescript
   // ❌ BAD
   catch (error) {
     return handleApiError(error)
   }

   // ✅ GOOD
   catch (error) {
     return handleApiError(error, {
       route: '/api/process-image',
       method: 'POST',
     })
   }
   ```

## Migration Checklist

For adding error handling to new routes:

- [ ] Import error utilities: `Errors, handleApiError, createRateLimitResponse`
- [ ] Use `createRateLimitResponse` for rate limit errors
- [ ] Use `Errors.*` factories for validation errors
- [ ] Add route context to `handleApiError`
- [ ] Return standardized responses (avoid custom JSON)
- [ ] Add TypeScript types from `lib/apiTypes.ts`
- [ ] Test error scenarios (missing params, rate limits, etc.)
- [ ] Update frontend to use `lib/clientApiError.ts`

## Future Enhancements

### External Logging Integration

Ready to integrate with:

**Sentry:**
```typescript
// In lib/errorLogger.ts
import * as Sentry from '@sentry/nextjs'

export function logError(error: unknown, context: ErrorLogContext = {}): void {
  // ... existing code ...

  Sentry.captureException(error, {
    contexts: { custom: context },
    tags: {
      route: context.route,
      requestId: context.requestId,
    },
  })
}
```

**LogRocket:**
```typescript
import LogRocket from 'logrocket'

export function logError(error: unknown, context: ErrorLogContext = {}): void {
  // ... existing code ...

  LogRocket.captureException(error, {
    extra: context,
  })
}
```

**Datadog:**
```typescript
import { logger } from '@datadog/browser-logs'

export function logError(error: unknown, context: ErrorLogContext = {}): void {
  // ... existing code ...

  logger.error(error.message, {
    error,
    ...context,
  })
}
```

## Summary

PicForge now has professional-grade error handling:

✅ **Standardized error responses** across all 20+ API routes
✅ **Typed error codes** for easy debugging
✅ **Request IDs** for tracing errors in production
✅ **Centralized logging** with security (sanitizes sensitive data)
✅ **Client-side utilities** for user-friendly error messages
✅ **Rate limit handling** with proper headers
✅ **Context tracking** (route, method, IP, user ID)
✅ **Ready for external logging** (Sentry, LogRocket, Datadog)

All routes follow consistent patterns, making the codebase maintainable and debuggable.
