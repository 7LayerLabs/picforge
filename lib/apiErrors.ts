/**
 * Standardized API Error Handling
 *
 * Provides consistent error responses across all API routes with proper status codes,
 * error codes, and user-friendly messages.
 */

import { NextResponse } from 'next/server'
import { logError } from './errorLogger'
import { ApiErrorResponse } from './apiTypes'
import { randomUUID } from 'crypto'

/**
 * Custom API Error class with status code and error code
 */
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

/**
 * Common error codes for consistency
 */
export const ErrorCodes = {
  // Client errors (4xx)
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  INVALID_INPUT: 'INVALID_INPUT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',

  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_KEY_INVALID: 'API_KEY_INVALID',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  TIMEOUT: 'TIMEOUT',

  // Specific to PicForge
  IMAGE_PROCESSING_FAILED: 'IMAGE_PROCESSING_FAILED',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  GENERATION_FAILED: 'GENERATION_FAILED',
} as const

/**
 * Pre-configured error factories for common scenarios
 */
export const Errors = {
  missingParameter: (paramName: string) =>
    new ApiError(400, ErrorCodes.MISSING_PARAMETER, `Missing required parameter: ${paramName}`),

  invalidInput: (message: string) =>
    new ApiError(400, ErrorCodes.INVALID_INPUT, message),

  rateLimitExceeded: (resetTime?: number) =>
    new ApiError(
      429,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded. Please try again later.',
      resetTime ? { resetTime } : undefined
    ),

  unauthorized: (message = 'Authentication required') =>
    new ApiError(401, ErrorCodes.UNAUTHORIZED, message),

  forbidden: (message = 'Access denied') =>
    new ApiError(403, ErrorCodes.FORBIDDEN, message),

  notFound: (resource = 'Resource') =>
    new ApiError(404, ErrorCodes.NOT_FOUND, `${resource} not found`),

  apiKeyMissing: (service: string) =>
    new ApiError(
      500,
      ErrorCodes.API_KEY_MISSING,
      `${service} API key not configured. Please add it to .env.local`
    ),

  apiKeyInvalid: (service: string) =>
    new ApiError(
      500,
      ErrorCodes.API_KEY_INVALID,
      `${service} API key is invalid or expired`
    ),

  externalServiceError: (service: string, message?: string) =>
    new ApiError(
      502,
      ErrorCodes.EXTERNAL_SERVICE_ERROR,
      `${service} service error${message ? `: ${message}` : ''}`
    ),

  quotaExceeded: (service: string) =>
    new ApiError(
      429,
      ErrorCodes.QUOTA_EXCEEDED,
      `${service} quota exceeded. Please upgrade your plan or wait for reset.`
    ),

  timeout: (operation: string) =>
    new ApiError(
      504,
      ErrorCodes.TIMEOUT,
      `${operation} timed out. Please try again.`
    ),

  imageProcessingFailed: (reason?: string) =>
    new ApiError(
      500,
      ErrorCodes.IMAGE_PROCESSING_FAILED,
      `Image processing failed${reason ? `: ${reason}` : ''}`
    ),

  imageTooLarge: (maxSize: string) =>
    new ApiError(
      413,
      ErrorCodes.IMAGE_TOO_LARGE,
      `Image too large. Maximum size: ${maxSize}`
    ),

  unsupportedFormat: (format: string) =>
    new ApiError(
      415,
      ErrorCodes.UNSUPPORTED_FORMAT,
      `Unsupported format: ${format}. Supported: JPEG, PNG, WebP`
    ),

  generationFailed: (reason?: string) =>
    new ApiError(
      500,
      ErrorCodes.GENERATION_FAILED,
      `Image generation failed${reason ? `: ${reason}` : ''}`
    ),

  internal: (message = 'An unexpected error occurred') =>
    new ApiError(500, ErrorCodes.INTERNAL_ERROR, message),
}

/**
 * Convert an ApiError to a NextResponse with standardized format
 */
export function errorToResponse(error: ApiError, requestId?: string): NextResponse {
  const response: ApiErrorResponse = {
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details }),
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status: error.statusCode })
}

/**
 * Handle any error and convert to appropriate NextResponse
 * Use this as a catch-all in try-catch blocks
 *
 * @param error - The error to handle
 * @param context - Additional context for logging (route, method, userId, etc.)
 */
export function handleApiError(
  error: unknown,
  context?: {
    route?: string
    method?: string
    userId?: string
    ip?: string
    userAgent?: string
    [key: string]: unknown
  }
): NextResponse {
  const requestId = randomUUID()

  // Log the error with context
  logError(error, {
    requestId,
    ...context,
  })

  // If it's already an ApiError, use it directly
  if (error instanceof ApiError) {
    return errorToResponse(error, requestId)
  }

  // If it's a standard Error
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return errorToResponse(Errors.rateLimitExceeded(), requestId)
    }

    if (error.message.includes('API key') || error.message.includes('authentication')) {
      return errorToResponse(Errors.apiKeyInvalid('Service'), requestId)
    }

    if (error.message.includes('quota') || error.message.includes('billing')) {
      return errorToResponse(Errors.quotaExceeded('Service'), requestId)
    }

    if (error.message.includes('timeout')) {
      return errorToResponse(Errors.timeout('Operation'), requestId)
    }

    // Generic error
    return errorToResponse(Errors.internal(error.message), requestId)
  }

  // Unknown error type
  return errorToResponse(Errors.internal('An unexpected error occurred'), requestId)
}

/**
 * Wrapper for async API handlers with automatic error handling
 * Usage:
 *   export const POST = withErrorHandler(async (request) => {
 *     // Your handler code
 *     return NextResponse.json({ success: true })
 *   })
 */
export function withErrorHandler(
  handler: (request: Request) => Promise<NextResponse>,
  routeName?: string
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      // Extract context from request
      const url = new URL(request.url)
      const context = {
        route: routeName || url.pathname,
        method: request.method,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }

      return handleApiError(error, context)
    }
  }
}

/**
 * Create a standardized rate limit error response
 * Use this for consistent rate limit errors with proper headers
 */
export function createRateLimitResponse(rateLimit: {
  limit: number
  remaining: number
  resetTime: number
}): NextResponse {
  const requestId = randomUUID()

  const response: ApiErrorResponse = {
    error: 'Rate limit exceeded. Please try again later.',
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
    details: {
      limit: rateLimit.limit,
      remaining: rateLimit.remaining,
      resetTime: rateLimit.resetTime,
    },
    requestId,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, {
    status: 429,
    headers: {
      'X-RateLimit-Limit': rateLimit.limit.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': rateLimit.resetTime.toString(),
      'X-Request-ID': requestId,
    },
  })
}

/**
 * Create a standardized success response
 * Use this for consistent success responses across all routes
 */
export function createSuccessResponse<T = unknown>(
  data: T,
  message?: string,
  metadata?: Record<string, unknown>
): NextResponse {
  const requestId = randomUUID()

  return NextResponse.json(
    {
      success: true,
      ...(data && { data }),
      ...(message && { message }),
      metadata: {
        timestamp: new Date().toISOString(),
        requestId,
        ...metadata,
      },
    },
    {
      headers: {
        'X-Request-ID': requestId,
      },
    }
  )
}
