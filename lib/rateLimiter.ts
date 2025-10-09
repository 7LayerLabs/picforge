import { kv } from '@vercel/kv'

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: Date
}

const DAILY_LIMIT = 20
const WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  try {
    const key = `rate_limit:${identifier}`
    const now = Date.now()

    // Get current usage
    const data = await kv.get<{ count: number; reset: number }>(key)

    if (!data || now > data.reset) {
      // Create new window
      const reset = now + WINDOW_MS
      await kv.set(key, { count: 1, reset }, { px: WINDOW_MS })

      return {
        success: true,
        remaining: DAILY_LIMIT - 1,
        reset: new Date(reset)
      }
    }

    // Check if limit exceeded
    if (data.count >= DAILY_LIMIT) {
      return {
        success: false,
        remaining: 0,
        reset: new Date(data.reset)
      }
    }

    // Increment counter
    await kv.set(key, { count: data.count + 1, reset: data.reset }, { px: data.reset - now })

    return {
      success: true,
      remaining: DAILY_LIMIT - (data.count + 1),
      reset: new Date(data.reset)
    }
  } catch (error) {
    // Fallback to allowing request if KV is unavailable
    console.error('Rate limit check failed:', error)
    return {
      success: true,
      remaining: DAILY_LIMIT,
      reset: new Date(Date.now() + WINDOW_MS)
    }
  }
}

export async function getRateLimitStatus(identifier: string): Promise<{
  used: number
  limit: number
  reset: Date
}> {
  try {
    const key = `rate_limit:${identifier}`
    const data = await kv.get<{ count: number; reset: number }>(key)

    if (!data || Date.now() > data.reset) {
      return {
        used: 0,
        limit: DAILY_LIMIT,
        reset: new Date(Date.now() + WINDOW_MS)
      }
    }

    return {
      used: data.count,
      limit: DAILY_LIMIT,
      reset: new Date(data.reset)
    }
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    return {
      used: 0,
      limit: DAILY_LIMIT,
      reset: new Date(Date.now() + WINDOW_MS)
    }
  }
}

export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    const key = `rate_limit:${identifier}`
    await kv.del(key)
  } catch (error) {
    console.error('Failed to reset rate limit:', error)
  }
}