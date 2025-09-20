import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    console.log('Generating image with Pollinations.ai:', { prompt })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Pollinations.ai - 100% free, no API key required!
    // Just construct the URL with the prompt
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`

    // Fetch the image directly
    const imageResponse = await fetch(imageUrl)

    if (!imageResponse.ok) {
      throw new Error(`Failed to generate image: ${imageResponse.status}`)
    }

    // Convert to base64
    const arrayBuffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    console.log('Image generated successfully')

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: 'Flux Pro',
      provider: 'Pollinations.ai (100% Free, No API Key)',
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