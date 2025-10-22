/**
 * Error Logging System
 *
 * Centralized error logging with proper context and security
 */

import { ApiError } from './apiErrors'

interface ErrorLogContext {
  requestId?: string
  userId?: string
  route?: string
  method?: string
  ip?: string
  userAgent?: string
  [key: string]: unknown
}

interface ErrorLog {
  timestamp: string
  error: {
    name: string
    message: string
    code?: string
    statusCode?: number
    stack?: string
  }
  context: ErrorLogContext
  environment: string
}

/**
 * Sanitize sensitive data from error messages and context
 */
function sanitizeData(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const sensitiveKeys = [
    'password',
    'apiKey',
    'api_key',
    'token',
    'secret',
    'authorization',
    'cookie',
    'session',
  ]

  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()
    const isSensitive = sensitiveKeys.some(k => lowerKey.includes(k))

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Log an error with context
 */
export function logError(error: unknown, context: ErrorLogContext = {}): void {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
      code: error instanceof ApiError ? error.code : undefined,
      statusCode: error instanceof ApiError ? error.statusCode : undefined,
      stack: error instanceof Error && !isProduction ? error.stack : undefined,
    },
    context: sanitizeData(context) as ErrorLogContext,
    environment: process.env.NODE_ENV || 'unknown',
  }

  // In development, log full error details
  if (isDevelopment) {
    console.error('═══════════════════════════════════════════')
    console.error('🔴 API ERROR')
    console.error('═══════════════════════════════════════════')
    console.error('Time:', errorLog.timestamp)
    console.error('Route:', context.route || 'unknown')
    console.error('Method:', context.method || 'unknown')
    console.error('Request ID:', context.requestId || 'none')
    console.error('───────────────────────────────────────────')
    console.error('Error:', errorLog.error.message)
    console.error('Code:', errorLog.error.code || 'N/A')
    console.error('Status:', errorLog.error.statusCode || 'N/A')
    if (errorLog.error.stack) {
      console.error('───────────────────────────────────────────')
      console.error('Stack Trace:')
      console.error(errorLog.error.stack)
    }
    console.error('───────────────────────────────────────────')
    console.error('Context:', JSON.stringify(errorLog.context, null, 2))
    console.error('═══════════════════════════════════════════')
  } else {
    // In production, log compact JSON
    console.error(JSON.stringify(errorLog))
  }

  // TODO: Send to external logging service (e.g., Sentry, LogRocket, Datadog)
  // This is where you would integrate with your logging service:
  // - Sentry: Sentry.captureException(error, { contexts: { custom: context } })
  // - LogRocket: LogRocket.captureException(error, { extra: context })
  // - Datadog: logger.error(error.message, { error, ...context })
}

/**
 * Log a warning (non-error issue)
 */
export function logWarning(message: string, context: ErrorLogContext = {}): void {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const warningLog = {
    timestamp: new Date().toISOString(),
    level: 'warning',
    message,
    context: sanitizeData(context),
    environment: process.env.NODE_ENV || 'unknown',
  }

  if (isDevelopment) {
    console.warn('⚠️ API WARNING:', message)
    console.warn('Context:', context)
  } else {
    console.warn(JSON.stringify(warningLog))
  }
}

/**
 * Log successful but notable events
 */
export function logInfo(message: string, context: ErrorLogContext = {}): void {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const infoLog = {
    timestamp: new Date().toISOString(),
    level: 'info',
    message,
    context: sanitizeData(context),
    environment: process.env.NODE_ENV || 'unknown',
  }

  if (isDevelopment) {
    console.log('ℹ️ API INFO:', message)
    if (Object.keys(context).length > 0) {
      console.log('Context:', context)
    }
  } else {
    console.log(JSON.stringify(infoLog))
  }
}
