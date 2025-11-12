/**
 * @deprecated Use lib/rateLimitKv.ts instead
 *
 * This in-memory rate limiter resets on serverless function restarts,
 * making it ineffective on Vercel. Use Vercel KV-based rate limiting
 * from lib/rateLimitKv.ts for persistent rate limiting.
 */

// Simple in-memory rate limiter
// DEPRECATED: Use lib/rateLimitKv.ts for persistent rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 60 * 60 * 1000)

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 24 * 60 * 60 * 1000 // 24 hours
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    }
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}