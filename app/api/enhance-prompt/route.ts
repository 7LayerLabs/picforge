import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 30 prompt enhancements per hour per IP
    const identifier = getClientIdentifier(req)
    const rateLimit = await checkRateLimitKv(
      `enhance-prompt:${identifier}`,
      30, // 30 requests
      60 * 60 * 1000 // per hour
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
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

    const { userInput, imageContext } = await req.json()

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // Build context-aware prompt
    let contextInfo = ''
    if (imageContext) {
      contextInfo = `

Image Context (from uploaded image):
- Type: ${imageContext.type}
- Subject: ${imageContext.subject}
- Setting: ${imageContext.setting}
- Current mood: ${imageContext.mood}
- Colors: ${imageContext.colors.join(', ')}
- Lighting: ${imageContext.lighting}
- Current style: ${imageContext.style}

Use this context to make your prompts more relevant and specific to the actual image.`
    }

    // Use Claude to enhance the user's casual description into optimized image transformation prompts
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful AI prompt assistant for an image transformation tool called PicForge. Users describe the vibe or style they want for their image, and you help them create optimized prompts.${contextInfo}

User's request: "${userInput}"

Generate 3 different prompt variations that capture their intent. Each prompt should be:
- Detailed and descriptive
- Optimized for AI image transformation (img2img)
- Include specific visual elements, colors, lighting, mood
- Stay true to the user's original intent
${imageContext ? '- Build on the existing image context provided above' : ''}

Format your response as JSON with this structure:
{
  "explanation": "A brief 1-2 sentence explanation of how you interpreted their request",
  "prompts": [
    "First prompt variation here...",
    "Second prompt variation here...",
    "Third prompt variation here..."
  ]
}

Be conversational and helpful in the explanation. The prompts should be ready to use directly in an AI image transformation tool.`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse Claude's JSON response
    const responseText = content.text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      explanation: parsed.explanation,
      prompts: parsed.prompts,
    })
  } catch (error) {
    console.error('Error enhancing prompt:', error)
    return NextResponse.json(
      {
        error: 'Failed to enhance prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
