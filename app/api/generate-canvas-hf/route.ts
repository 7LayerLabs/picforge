import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { isEnvVarConfigured } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { logger } from '@/lib/logger'

// Increase timeout for Hugging Face API (can be slow on free tier)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 100 requests per day per IP (HuggingFace has quotas)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    const { prompt, size = '1024x1024' } = await request.json()

    logger.info('Generating image with Hugging Face:', { prompt, size })

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // HuggingFace API token is optional - will use public inference API if not provided
    const HF_API_TOKEN = process.env.HF_API_TOKEN || ''

    if (!HF_API_TOKEN) {
      logger.warn('HF_API_TOKEN not configured - using public inference API (slower, may have limits)')
    }

    // Use Stable Diffusion XL on Hugging Face (free)
    const apiResponse = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          ...(HF_API_TOKEN && { 'Authorization': `Bearer ${HF_API_TOKEN}` }),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: 'blurry, bad quality, distorted',
            num_inference_steps: 25,
          },
        }),
      }
    )

    logger.info('Hugging Face API status:', apiResponse.status)

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      logger.error('Hugging Face error:', errorText)

      // Check if model is loading
      if (errorText.includes('loading')) {
        throw Errors.timeout('Model is loading, please try again in 20 seconds')
      }

      throw Errors.externalServiceError('Hugging Face', `${apiResponse.status}`)
    }

    // Get the image as blob
    const imageBlob = await apiResponse.blob()

    // Convert blob to base64
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: 'Stable Diffusion XL',
      provider: 'Hugging Face (Free)',
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/generate-canvas-hf',
      method: 'POST',
    })
  }
}