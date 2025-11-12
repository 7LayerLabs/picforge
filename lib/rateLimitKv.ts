/**
 * Vercel KV-based Rate Limiting
 *
 * Persistent rate limiting using Vercel KV store (Redis).
 * Replaces in-memory rate limiter which resets on serverless function restarts.
 *
 * Setup: Add KV environment variables to .env.local or Vercel dashboard:
 *   - KV_URL
 *   - KV_REST_API_URL
 *   - KV_REST_API_TOKEN
 *   - KV_REST_API_READ_ONLY_TOKEN
 */

import { kv } from '@vercel/kv'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}

/**
 * Check rate limit for an identifier using Vercel KV
 *
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 24 hours)
 * @returns Rate limit result with allowed status and remaining count
 */
export async function checkRateLimitKv(
  identifier: string,
  maxRequests: number = 500,
  windowMs: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<RateLimitResult> {
  // Check if KV is configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn(
      '⚠️  Vercel KV not configured. Rate limiting disabled. ' +
      'Add KV_* environment variables to enable persistent rate limiting.'
    )

    // Return "allowed" when KV is not configured (graceful degradation)
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: Date.now() + windowMs,
      limit: maxRequests
    }
  }

  try {
    const key = `rate-limit:${identifier}`
    const now = Date.now()
    const resetTime = now + windowMs
    const windowSeconds = Math.floor(windowMs / 1000)

    // Increment the counter
    const count = await kv.incr(key)

    // Set expiration on first request (count === 1)
    if (count === 1) {
      await kv.expire(key, windowSeconds)
    }

    // Get TTL to calculate accurate reset time
    const ttl = await kv.ttl(key)
    const accurateResetTime = ttl > 0 ? now + (ttl * 1000) : resetTime

    // Check if limit exceeded
    const allowed = count <= maxRequests
    const remaining = Math.max(0, maxRequests - count)

    return {
      allowed,
      remaining,
      resetTime: accurateResetTime,
      limit: maxRequests
    }
  } catch (error) {
    console.error('Vercel KV rate limit error:', error)

    // On error, allow the request (fail open) but log the issue
    // This prevents rate limiting from breaking the entire API
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: Date.now() + windowMs,
      limit: maxRequests
    }
  }
}

/**
 * Reset rate limit for an identifier
 * Useful for testing or admin overrides
 */
export async function resetRateLimitKv(identifier: string): Promise<void> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn('⚠️  Vercel KV not configured. Cannot reset rate limit.')
    return
  }

  try {
    const key = `rate-limit:${identifier}`
    await kv.del(key)
  } catch (error) {
    console.error('Error resetting rate limit:', error)
  }
}

/**
 * Get current rate limit status without incrementing
 * Useful for checking limits without consuming a request
 */
export async function getRateLimitStatusKv(
  identifier: string,
  maxRequests: number = 500,
  windowMs: number = 24 * 60 * 60 * 1000
): Promise<RateLimitResult> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: Date.now() + windowMs,
      limit: maxRequests
    }
  }

  try {
    const key = `rate-limit:${identifier}`
    const now = Date.now()

    const count = await kv.get<number>(key)

    if (count === null) {
      return {
        allowed: true,
        remaining: maxRequests,
        resetTime: now + windowMs,
        limit: maxRequests
      }
    }

    const ttl = await kv.ttl(key)
    const resetTime = ttl > 0 ? now + (ttl * 1000) : now + windowMs

    return {
      allowed: count < maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetTime,
      limit: maxRequests
    }
  } catch (error) {
    console.error('Error getting rate limit status:', error)
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: Date.now() + windowMs,
      limit: maxRequests
    }
  }
}

/**
 * Helper to get client identifier from request
 * Uses IP address or user ID if available
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

  return `ip:${ip}`
}
