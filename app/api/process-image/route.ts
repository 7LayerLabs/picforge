import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!imageFile || !prompt) {
      return NextResponse.json(
        { error: 'Missing image or prompt' },
        { status: 400 }
      )
    }

    // Get image size in bytes
    const imageSize = imageFile.size

    // Convert bytes to KB/MB for readable output
    const sizeInKB = (imageSize / 1024).toFixed(2)
    const sizeInMB = (imageSize / (1024 * 1024)).toFixed(2)

    // Log to server console
    console.log('=====================================')
    console.log('Received form submission:')
    console.log('User Prompt:', prompt)
    console.log('Image Name:', imageFile.name)
    console.log('Image Type:', imageFile.type)
    console.log('Image Size:', `${imageSize} bytes (${sizeInKB} KB / ${sizeInMB} MB)`)
    console.log('=====================================')

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Image and prompt received successfully',
      imageSize: imageSize,
      prompt: prompt
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}