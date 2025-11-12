import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError } from '@/lib/apiErrors'

export async function POST(request: NextRequest) {
  try {
    // Validate required environment variables
    const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini caption generation')
    const genAI = new GoogleGenerativeAI(apiKey)

    const { imageBase64, platform } = await request.json()

    if (!imageBase64) {
      throw Errors.missingParameter('imageBase64')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Platform-specific prompts for better engagement
    const platformPrompts = {
      twitter: `Generate a viral Twitter/X post caption for this image. Make it engaging, use 1-2 relevant hashtags, and keep it under 280 characters. Be witty and shareable. End with a call-to-action.`,
      instagram: `Generate an Instagram caption for this image. Make it engaging, use 5-8 relevant hashtags, include emojis, and make it personal and relatable. Add a call-to-action.`,
      tiktok: `Generate a TikTok caption for this image. Make it trendy, use current slang if appropriate, include 3-5 viral hashtags, and make it super engaging for Gen Z audience.`,
      general: `Generate a social media caption for this image that's engaging and shareable. Include relevant hashtags.`
    }

    const prompt = platformPrompts[platform as keyof typeof platformPrompts] || platformPrompts.general

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }
    ])

    const caption = result.response.text()

    // Add our branding at the end
    const brandedCaption = caption + '\n\n✨ Created with pic-forge.com'

    return NextResponse.json({ caption: brandedCaption })

  } catch (error) {
    return handleApiError(error)
  }
}