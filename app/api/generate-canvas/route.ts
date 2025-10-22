import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 100 requests per day per IP (strict for expensive DALL-E API)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Validate required environment variables
    const apiKey = requireEnvVar('OPENAI_API_KEY', 'OpenAI DALL-E')

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey })

    const { prompt, size = '1024x1024', quality = 'standard' } = await request.json()

    console.log('Generating canvas with:', { prompt, size, quality })

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    console.log('Using OpenAI API key:', apiKey.substring(0, 10) + '...')

    // Generate image using DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: quality as "standard" | "hd",
    })

    console.log('OpenAI response received:', response.data?.[0]?.url ? 'Image URL present' : 'No image URL')

    if (response.data && response.data[0] && response.data[0].url) {
      // Fetch the image and convert to base64
      const imageResponse = await fetch(response.data[0].url)
      const arrayBuffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`

      return NextResponse.json({
        success: true,
        image: dataUrl,
        revisedPrompt: response.data[0].revised_prompt,
      })
    } else {
      throw Errors.generationFailed('No image URL in OpenAI response')
    }
  } catch (error) {
    console.error('Error generating image:', error)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any

    // Handle specific OpenAI errors
    if (err?.error?.type === 'insufficient_quota' || err?.error?.code === 'billing_hard_limit_reached') {
      throw Errors.quotaExceeded('OpenAI')
    }

    if (err?.message?.includes('billing') || err?.message?.includes('limit')) {
      throw Errors.quotaExceeded('OpenAI')
    }

    if (err?.error?.message) {
      throw Errors.externalServiceError('OpenAI', err.error.message)
    }

    return handleApiError(error, {
      route: '/api/generate-canvas',
      method: 'POST',
    })
  }
}