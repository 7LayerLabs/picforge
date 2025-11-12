import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    logger.info('Test endpoint - Content-Type:', contentType)

    // Try to read as JSON
    if (contentType.includes('application/json')) {
      const data = await request.json()
      logger.debug('Received JSON data:', Object.keys(data))

      return NextResponse.json({
        success: true,
        message: 'Test successful - JSON received',
        receivedKeys: Object.keys(data),
        prompt: data.prompt || 'no prompt',
        hasImage: !!data.image
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Test endpoint - not JSON',
      contentType
    })
  } catch (error) {
    logger.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      contentType: request.headers.get('content-type')
    }, { status: 500 })
  }
}