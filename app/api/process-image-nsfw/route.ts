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

    // Use Together AI's image-to-image endpoint with SDXL
    // Together AI allows adult content processing
    const response = await together.images.create({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      prompt: `${prompt}, photorealistic, detailed, high quality, professional photography`,
      // Together AI uses different parameters than standard APIs
      width: 1024,
      height: 1024,
      steps: 40,
      n: 1,
    })

    // Together AI returns image URLs
    const imageUrl = response.data[0]?.url

    if (!imageUrl) {
      throw new Error('No image URL returned from Together AI')
    }

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64Image}`

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
