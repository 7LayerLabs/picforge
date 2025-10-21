import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
// import { GoogleGenerativeAI } from '@google/generative-ai' // Reserved for future AI processing

// Simplified version that handles JSON properly
export async function POST(request: NextRequest) {
  console.log('=== Process Image V2 API Called ===')

  try {
    // Rate limiting: 200 requests per day per IP
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 200, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Image processing limit exceeded. Please try again later.',
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

    const contentType = request.headers.get('content-type') || ''
    console.log('Content-Type received:', contentType)

    let prompt = ''
    let imageBase64 = ''

    // ONLY parse based on content type - no ambiguity
    if (contentType.startsWith('application/json')) {
      console.log('Parsing as JSON...')
      const body = await request.json()
      prompt = body.prompt || ''
      imageBase64 = body.image || ''

      // Clean up base64 if it's a data URL
      if (imageBase64.includes('base64,')) {
        imageBase64 = imageBase64.split('base64,')[1]
      }

      console.log('JSON parsed successfully')
    }
    else if (contentType.includes('multipart/form-data')) {
      console.log('Parsing as FormData...')
      try {
        const formData = await request.formData()
        const imageFile = formData.get('image') as File
        prompt = formData.get('prompt') as string || ''

        if (imageFile) {
          const buffer = await imageFile.arrayBuffer()
          imageBase64 = Buffer.from(buffer).toString('base64')
        }
        console.log('FormData parsed successfully')
      } catch (formError) {
        console.error('FormData parsing error:', formError)
        return NextResponse.json({
          error: 'Failed to parse form data',
          details: formError instanceof Error ? formError.message : 'Unknown error'
        }, { status: 400 })
      }
    }
    else {
      // Don't try to parse, just return error
      console.log('Unsupported content type')
      return NextResponse.json({
        error: 'Unsupported content type',
        received: contentType,
        expected: 'application/json or multipart/form-data'
      }, { status: 400 })
    }

    // Validate we have what we need
    if (!prompt || !imageBase64) {
      return NextResponse.json({
        error: 'Missing required data',
        hasPrompt: !!prompt,
        hasImage: !!imageBase64
      }, { status: 400 })
    }

    console.log('Processing with prompt:', prompt)
    console.log('Image size (base64):', imageBase64.length)

    // For now, just return success with the original image
    // This proves the API is working
    const responseImage = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`

    return NextResponse.json({
      success: true,
      message: 'Image processed successfully (test mode)',
      processedImage: responseImage,
      prompt: prompt,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}