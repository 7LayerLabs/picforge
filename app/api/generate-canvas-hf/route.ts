import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

// Hugging Face API token (set in .env.local)
const HF_API_TOKEN = process.env.HF_API_TOKEN || ''

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 100 requests per day per IP (HuggingFace has quotas)
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'HuggingFace generation limit exceeded. Please try again later.',
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    const { prompt, size = '1024x1024' } = await request.json()

    console.log('Generating image with Hugging Face:', { prompt, size })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Use Stable Diffusion XL on Hugging Face (free)
    const apiResponse = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
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

    console.log('Hugging Face API status:', apiResponse.status)

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('Hugging Face error:', errorText)

      // Check if model is loading
      if (errorText.includes('loading')) {
        return NextResponse.json(
          { error: 'Model is loading, please try again in 20 seconds...' },
          { status: 503 }
        )
      }

      throw new Error(`API error: ${apiResponse.status}`)
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
    console.error('Error generating image:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'

    return NextResponse.json(
      { error: errorMessage || 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
}