import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { logger } from '@/lib/logger'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 50 image analyses per hour per IP
    const identifier = getClientIdentifier(req)
    const rateLimit = await checkRateLimitKv(
      `analyze-image:${identifier}`,
      50, // 50 requests
      60 * 60 * 1000 // per hour
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetTime: rateLimit.resetTime,
          remaining: rateLimit.remaining,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      )
    }

    const { imageData } = await req.json()

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      logger.error('GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // Use Gemini Vision to analyze the image
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      },
      `Analyze this image and provide a brief, structured description for context.

Format your response as JSON with this structure:
{
  "type": "bedroom" | "portrait" | "landscape" | "food" | "pet" | "product" | "architecture" | "abstract" | "other",
  "subject": "main subject of the image (e.g., 'young woman', 'golden retriever', 'living room')",
  "setting": "where the photo was taken (e.g., 'outdoor park', 'modern bedroom', 'studio')",
  "mood": "overall mood/vibe (e.g., 'cozy', 'dramatic', 'playful', 'professional')",
  "colors": ["primary", "color", "palette"],
  "lighting": "lighting conditions (e.g., 'natural daylight', 'warm indoor', 'dramatic shadows')",
  "style": "current style (e.g., 'casual snapshot', 'professional portrait', 'minimalist')",
  "suggestions": "what transformations would work well (1-2 sentences)"
}

Be concise and accurate. This will help guide AI prompt generation.`,
    ])

    const response = await result.response
    const text = response.text()

    // 🔍 LOG ACTUAL GEMINI VISION API RESPONSE
    logger.debug('\n========================================')
    logger.debug('🧠 GEMINI VISION - IMAGE ANALYSIS API RESPONSE')
    logger.debug('========================================')
    logger.debug('📊 Raw Response Text:', text)
    logger.debug('========================================\n')

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response')
    }

    const analysis = JSON.parse(jsonMatch[0])

    // 🔍 LOG PARSED ANALYSIS
    logger.info('✅ Parsed Image Analysis:', JSON.stringify(analysis, null, 2))

    return NextResponse.json({
      analysis,
      raw: text,
    })
  } catch (error) {
    logger.error('Error analyzing image:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
