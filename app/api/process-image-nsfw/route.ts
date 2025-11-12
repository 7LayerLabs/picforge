import { NextRequest, NextResponse } from 'next/server'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { logger } from '@/lib/logger'

// Increase timeout for Replicate API (can take 15-30 seconds)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 200 requests per day per IP (stricter for paid API)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 200, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Validate required environment variables
    const replicateToken = requireEnvVar('REPLICATE_API_TOKEN', 'Replicate NSFW processing')

    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      throw Errors.missingParameter('image and prompt')
    }

    logger.info('Processing NSFW image with Replicate SDXL...', { prompt, imageSize: image.length })

    // Replicate expects data URIs, which we already have
    // Use Replicate's SDXL img2img for unrestricted transformations
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc', // SDXL img2img
        input: {
          image: image,
          prompt: `Transform the person/subject in the image to: ${prompt}, keep the same person's face and features, photorealistic, detailed, high quality, professional photography`,
          strength: 0.7, // Reduced from 0.75 to better preserve original subject (0.0 = original, 1.0 = completely new)
          num_inference_steps: 40,
          guidance_scale: 7.5,
        }
      })
    })

    logger.info('Replicate response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      logger.error('Replicate API error:', error)
      throw Errors.externalServiceError('Replicate', `${response.status} - ${error}`)
    }

    const prediction = await response.json()
    logger.info('Prediction started:', { id: prediction.id, status: prediction.status })

    // Poll for completion
    let result = prediction
    let attempts = 0
    const maxAttempts = 60 // 60 seconds max

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Token ${replicateToken}`,
          }
        }
      )

      result = await pollResponse.json()
      attempts++

      if (attempts % 5 === 0) {
        logger.debug(`Polling attempt ${attempts}, status: ${result.status}`)
      }
    }

    logger.info('Final status:', { status: result.status, result: JSON.stringify(result) })

    if (result.status === 'failed') {
      logger.error('Transformation failed. Error:', result.error)
      throw Errors.imageProcessingFailed(result.error || 'Replicate processing failed')
    }

    if (!result.output || !result.output[0]) {
      logger.error('No output. Full result:', result)
      throw Errors.imageProcessingFailed('No output image from transformation')
    }

    // Fetch the result image and convert to base64
    const imageUrl = result.output[0]
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64Image}`

    return NextResponse.json({
      result: dataUrl,
      success: true,
    })
  } catch (error) {
    return handleApiError(error, {
      route: '/api/process-image-nsfw',
      method: 'POST',
    })
  }
}
