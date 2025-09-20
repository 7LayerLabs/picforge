import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = await request.json()

    console.log('Generating canvas with:', { prompt, size, quality })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add your API key to .env.local' },
        { status: 500 }
      )
    }

    console.log('Using OpenAI API key:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...')

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
      throw new Error('No image URL in response')
    }
  } catch (error) {
    console.error('Error generating image:', error)

    const err = error as { error?: { type?: string; code?: string; message?: string }; message?: string }

    // Handle specific OpenAI errors
    if (err?.error?.type === 'insufficient_quota' || err?.error?.code === 'billing_hard_limit_reached') {
      return NextResponse.json(
        {
          error: 'OpenAI billing limit reached. To fix this:\n1. Add credits at platform.openai.com\n2. Or increase your spending limit\n3. Or wait for your monthly limit to reset',
          billingIssue: true
        },
        { status: 429 }
      )
    }

    if (err?.message?.includes('billing') || err?.message?.includes('limit')) {
      return NextResponse.json(
        {
          error: 'OpenAI billing limit reached. Please add credits to your OpenAI account at platform.openai.com',
          billingIssue: true
        },
        { status: 429 }
      )
    }

    if (err?.error?.message) {
      return NextResponse.json(
        { error: err.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
}