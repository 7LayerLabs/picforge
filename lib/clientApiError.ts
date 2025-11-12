/**
 * Client-Side Error Handler
 *
 * Converts API error responses into user-friendly messages
 */

import { ApiErrorResponse } from './apiTypes'

/**
 * Error code to user-friendly message mapping
 */
const errorMessages: Record<string, string> = {
  // Client errors (4xx)
  MISSING_PARAMETER: 'Required information is missing. Please check your input.',
  INVALID_INPUT: 'Invalid input provided. Please check and try again.',
  RATE_LIMIT_EXCEEDED: "You've hit your daily limit! Upgrade for unlimited access.",
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'Access denied. You don\'t have permission to do that.',
  NOT_FOUND: 'The requested resource was not found.',

  // Server errors (5xx)
  INTERNAL_ERROR: 'Something went wrong on our end. Please try again.',
  API_KEY_MISSING: 'Service configuration error. Please contact support.',
  API_KEY_INVALID: 'Service authentication failed. Please contact support.',
  EXTERNAL_SERVICE_ERROR: 'External service temporarily unavailable. Please try again.',
  QUOTA_EXCEEDED: 'Service quota exceeded. Please upgrade your plan or try later.',
  TIMEOUT: 'Request timed out. Please try again.',

  // PicForge specific
  IMAGE_PROCESSING_FAILED: 'Image processing failed. Please try a different image or prompt.',
  IMAGE_TOO_LARGE: 'Image is too large. Please use a smaller image (max 10MB).',
  UNSUPPORTED_FORMAT: 'Unsupported image format. Please use JPG, PNG, or WebP.',
  GENERATION_FAILED: 'Image generation failed. Please try a different prompt.',
}

/**
 * Get user-friendly error message from API error response
 */
export function getErrorMessage(error: ApiErrorResponse | string): string {
  // If it's a string, return it directly
  if (typeof error === 'string') {
    return error
  }

  // If we have a specific message mapping, use it
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code]
  }

  // Otherwise, use the error message from the API
  return error.error || 'An unexpected error occurred. Please try again.'
}

/**
 * Get error message with additional context
 */
export function getDetailedErrorMessage(error: ApiErrorResponse): string {
  const baseMessage = getErrorMessage(error)

  // Add details if available
  if (error.details && typeof error.details === 'object') {
    const detailsArray = Object.entries(error.details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')

    if (detailsArray) {
      return `${baseMessage} (${detailsArray})`
    }
  }

  return baseMessage
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: ApiErrorResponse | string): boolean {
  if (typeof error === 'string') return false
  return error.code === 'RATE_LIMIT_EXCEEDED'
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ApiErrorResponse | string): boolean {
  if (typeof error === 'string') return false
  return error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN'
}

/**
 * Check if error is a client error (4xx)
 */
export function isClientError(error: ApiErrorResponse | string): boolean {
  if (typeof error === 'string') return false
  const clientErrorCodes = [
    'MISSING_PARAMETER',
    'INVALID_INPUT',
    'RATE_LIMIT_EXCEEDED',
    'UNAUTHORIZED',
    'FORBIDDEN',
    'NOT_FOUND',
  ]
  return clientErrorCodes.includes(error.code)
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: ApiErrorResponse | string): boolean {
  if (typeof error === 'string') return false
  return !isClientError(error)
}

/**
 * Get error action suggestion
 */
export function getErrorAction(error: ApiErrorResponse | string): string | null {
  if (typeof error === 'string') return null

  switch (error.code) {
    case 'RATE_LIMIT_EXCEEDED':
      return 'upgrade'
    case 'UNAUTHORIZED':
      return 'signin'
    case 'IMAGE_TOO_LARGE':
      return 'resize'
    case 'UNSUPPORTED_FORMAT':
      return 'convert'
    case 'EXTERNAL_SERVICE_ERROR':
    case 'TIMEOUT':
      return 'retry'
    default:
      return null
  }
}

/**
 * Handle API error response and show appropriate UI
 * Returns an object with message and suggested action
 */
export function handleClientError(error: unknown): {
  message: string
  action: string | null
  isRetryable: boolean
} {
  // If it's not an API error response, handle generically
  if (!error || typeof error !== 'object') {
    return {
      message: 'An unexpected error occurred. Please try again.',
      action: 'retry',
      isRetryable: true,
    }
  }

  const apiError = error as ApiErrorResponse
  const message = getErrorMessage(apiError)
  const action = getErrorAction(apiError)

  // Determine if error is retryable
  const isRetryable =
    apiError.code === 'TIMEOUT' ||
    apiError.code === 'EXTERNAL_SERVICE_ERROR' ||
    apiError.code === 'INTERNAL_ERROR'

  return { message, action, isRetryable }
}

/**
 * Format error for display in toast/alert
 */
export function formatErrorForToast(error: unknown): {
  title: string
  description: string
  variant: 'default' | 'destructive'
} {
  const { message, action } = handleClientError(error)

  let description = message
  if (action === 'retry') {
    description += ' Click to retry.'
  } else if (action === 'upgrade') {
    description += ' Upgrade to Pro for unlimited access.'
  } else if (action === 'signin') {
    description += ' Please sign in to continue.'
  }

  return {
    title: 'Error',
    description,
    variant: 'destructive',
  }
}
