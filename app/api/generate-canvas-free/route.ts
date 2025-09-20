import { NextRequest, NextResponse } from 'next/server'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', model = 'black-forest-labs/FLUX.1-schnell' } = await request.json()

    console.log('Generating free canvas with:', { prompt, size, model })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
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

    console.log('Together AI API status:', apiResponse.status)

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('Together AI error response:', errorText)
      throw new Error(`API error: ${apiResponse.status} - ${errorText}`)
    }

    const responseData = await apiResponse.json()
    console.log('Together AI response received:', responseData)

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
        throw new Error('No image URL or base64 in response')
      }
    } else {
      throw new Error('No image data in response')
    }
  } catch (error) {
    console.error('Error generating image:', error)

    // Handle rate limiting
    if (error?.status === 429 || error?.message?.includes('rate')) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    // Handle API errors
    if (error?.error?.message) {
      return NextResponse.json(
        { error: error.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
}