import { NextRequest, NextResponse } from 'next/server'
import Together from 'together-ai'

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      )
    }

    console.log('Processing NSFW image with Together AI...')

    // Use Together AI's image generation endpoint with SDXL
    // Together AI allows adult content processing
    const response = await together.images.create({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      prompt: `${prompt}, photorealistic, detailed, high quality, professional photography`,
      width: 1024,
      height: 1024,
      steps: 40,
      n: 1,
    })

    // Together AI returns base64 data
    const imageData = response.data[0]

    if (!imageData) {
      throw new Error('No image data returned from Together AI')
    }

    // Check if it's base64 or URL
    let dataUrl: string
    if ('b64_json' in imageData && imageData.b64_json) {
      dataUrl = `data:image/png;base64,${imageData.b64_json}`
    } else if ('url' in imageData && imageData.url) {
      // If URL, fetch and convert to base64
      const imageResponse = await fetch(imageData.url)
      const imageBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString('base64')
      dataUrl = `data:image/png;base64,${base64Image}`
    } else {
      throw new Error('Invalid image data format from Together AI')
    }

    return NextResponse.json({
      result: dataUrl,
      success: true,
    })
  } catch (error) {
    console.error('NSFW processing error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Processing failed',
        success: false,
      },
      { status: 500 }
    )
  }
}
