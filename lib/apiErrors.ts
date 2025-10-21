/**
 * Standardized API Error Handling
 *
 * Provides consistent error responses across all API routes with proper status codes,
 * error codes, and user-friendly messages.
 */

import { NextResponse } from 'next/server'

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
 * Convert an ApiError to a NextResponse
 */
export function errorToResponse(error: ApiError): NextResponse {
  return NextResponse.json(
    {
      error: error.message,
      code: error.code,
      ...(error.details && { details: error.details }),
    },
    { status: error.statusCode }
  )
}

/**
 * Handle any error and convert to appropriate NextResponse
 * Use this as a catch-all in try-catch blocks
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // If it's already an ApiError, use it directly
  if (error instanceof ApiError) {
    return errorToResponse(error)
  }

  // If it's a standard Error
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return errorToResponse(Errors.rateLimitExceeded())
    }

    if (error.message.includes('API key') || error.message.includes('authentication')) {
      return errorToResponse(Errors.apiKeyInvalid('Service'))
    }

    if (error.message.includes('quota') || error.message.includes('billing')) {
      return errorToResponse(Errors.quotaExceeded('Service'))
    }

    if (error.message.includes('timeout')) {
      return errorToResponse(Errors.timeout('Operation'))
    }

    // Generic error
    return errorToResponse(Errors.internal(error.message))
  }

  // Unknown error type
  return errorToResponse(Errors.internal('An unexpected error occurred'))
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
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
