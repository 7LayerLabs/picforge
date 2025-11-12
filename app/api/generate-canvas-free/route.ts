import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { logger } from '@/lib/logger'

// Increase timeout for Together AI (can take 10-15 seconds)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 50 requests per day per IP (Together AI costs money!)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 50, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Validate required environment variables
    const TOGETHER_API_KEY = requireEnvVar('TOGETHER_API_KEY', 'Together AI image generation')

    const { prompt, size = '1024x1024', model = 'black-forest-labs/FLUX.1-schnell' } = await request.json()

    logger.info('Generating free canvas with:', { prompt, size, model })

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // Parse size to get width and height
    const [width, height] = size.split('x').map(Number)

    // Make direct API call to Together AI
    const apiResponse = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        width: width || 1024,
        height: height || 1024,
        steps: 4,
        n: 1,
      }),
    })

    logger.info('Together AI API status:', apiResponse.status)

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      logger.error('Together AI error response:', errorText)
      throw Errors.externalServiceError('Together AI', `${apiResponse.status} - ${errorText}`)
    }

    const responseData = await apiResponse.json()
    logger.debug('Together AI response received:', responseData)

    if (responseData.data && responseData.data[0]) {
      const imageData = responseData.data[0]

      // The response should have a URL to the generated image
      if (imageData.url) {
        // Fetch and convert URL to base64
        const imageResponse = await fetch(imageData.url)
        const arrayBuffer = await imageResponse.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:image/png;base64,${base64}`

        return NextResponse.json({
          success: true,
          image: dataUrl,
          model: model,
          provider: 'Together AI (Free)',
        })
      } else if (imageData.b64_json) {
        return NextResponse.json({
          success: true,
          image: `data:image/png;base64,${imageData.b64_json}`,
          model: model,
          provider: 'Together AI (Free)',
        })
      } else {
        throw Errors.generationFailed('No image URL or base64 in response')
      }
    } else {
      throw Errors.generationFailed('No image data in response')
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/generate-canvas-free',
      method: 'POST',
    })
  }
}