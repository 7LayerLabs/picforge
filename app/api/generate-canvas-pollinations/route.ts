import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { logger } from '@/lib/logger'

// Increase timeout for image generation (can take 5-10 seconds)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 150 requests per day per IP (free but prevent abuse)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 150, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    const { prompt } = await request.json()

    logger.info('Generating image with Pollinations.ai:', { prompt })

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // Pollinations.ai - 100% free, no API key required!
    // Just construct the URL with the prompt
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`

    // Fetch the image directly
    const imageResponse = await fetch(imageUrl)

    if (!imageResponse.ok) {
      throw Errors.externalServiceError('Pollinations.ai', `Failed to generate image: ${imageResponse.status}`)
    }

    // Convert to base64
    const arrayBuffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    logger.info('Image generated successfully')

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: 'Flux Pro',
      provider: 'Pollinations.ai (100% Free, No API Key)',
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/generate-canvas-pollinations',
      method: 'POST',
    })
  }
}