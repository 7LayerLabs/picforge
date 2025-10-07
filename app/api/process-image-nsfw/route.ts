import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      )
    }

    console.log('Processing NSFW image with Replicate SDXL...')
    console.log('Prompt:', prompt)
    console.log('Image size:', image.length)

    // Replicate expects data URIs, which we already have
    // Use Replicate's SDXL img2img for unrestricted transformations
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc', // SDXL img2img
        input: {
          image: image,
          prompt: `${prompt}, photorealistic, detailed, high quality, professional photography`,
          strength: 0.75, // How much to transform (0.0 = original, 1.0 = completely new)
          num_inference_steps: 40,
          guidance_scale: 7.5,
        }
      })
    })

    console.log('Replicate response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('Replicate API error:', error)
      console.error('Full response:', response)
      return NextResponse.json(
        { error: `Replicate API failed: ${response.status} - ${error}` },
        { status: 500 }
      )
    }

    const prediction = await response.json()
    console.log('Prediction started:', prediction.id, 'Status:', prediction.status)

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
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          }
        }
      )

      result = await pollResponse.json()
      attempts++

      if (attempts % 5 === 0) {
        console.log(`Polling attempt ${attempts}, status: ${result.status}`)
      }
    }

    console.log('Final status:', result.status)
    console.log('Result:', JSON.stringify(result))

    if (result.status === 'failed') {
      console.error('Transformation failed. Error:', result.error)
      return NextResponse.json(
        { error: `Transformation failed: ${result.error || 'Unknown error'}` },
        { status: 500 }
      )
    }

    if (!result.output || !result.output[0]) {
      console.error('No output. Full result:', result)
      return NextResponse.json(
        { error: 'No output image from transformation' },
        { status: 500 }
      )
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
