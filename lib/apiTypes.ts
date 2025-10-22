/**
 * Standardized API Response Types
 *
 * Provides consistent response structures for all API endpoints
 */

/**
 * Standard error response structure
 */
export interface ApiErrorResponse {
  error: string
  code: string
  details?: Record<string, unknown>
  requestId?: string
  timestamp?: string
}

/**
 * Standard success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
  metadata?: {
    timestamp: string
    requestId?: string
    [key: string]: unknown
  }
}

/**
 * Rate limit information included in headers
 */
export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: number
}

/**
 * Image processing response
 */
export interface ImageProcessResponse {
  success: true
  generatedImage?: string
  processedImage?: string
  analysis?: string
  prompt?: string
  imageSize?: number
  modelUsed?: string
  metadata?: {
    timestamp: string
    requestId?: string
    processingTime?: number
  }
}

/**
 * Canvas generation response
 */
export interface CanvasGenerateResponse {
  success: true
  image: string
  revisedPrompt?: string
  metadata?: {
    timestamp: string
    requestId?: string
    model?: string
    size?: string
  }
}

/**
 * Roast mode response
 */
export interface RoastResponse {
  success: true
  roastText: string
  transformPrompt: string
  transformedImage: string
  category: string
  intensity?: string
  metadata?: {
    timestamp: string
    requestId?: string
  }
}

/**
 * Analytics tracking response
 */
export interface TrackingResponse {
  success: true
  totalVisits?: number
  uniqueVisitors?: number
  totalShares?: number
  platform?: string
  bonusGranted?: boolean
  metadata?: {
    timestamp: string
  }
}

/**
 * Visitor stats response
 */
export interface VisitorStatsResponse {
  total: number
  twitter?: number
  instagram?: number
  'instagram-story'?: number
  tiktok?: number
  facebook?: number
  download?: number
  bonuses_granted?: number
}
