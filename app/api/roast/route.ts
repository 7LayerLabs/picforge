import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getRandomRoast, detectImageType } from '@/lib/roastLibrary'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { logger } from '@/lib/logger'

// Roast templates for different photo types
const roastTemplates = {
  selfie: [
    "transform into a dramatic movie poster with explosions",
    "turn into a renaissance painting",
    "make it look like a superhero movie poster",
    "transform into a vintage 80s album cover"
  ],
  group: [
    "turn everyone into cartoon characters",
    "make it look like a boy band album cover",
    "transform into an awkward family portrait painting",
    "turn into a superhero team poster"
  ],
  food: [
    "make it look burned and inedible",
    "transform into fine dining presentation",
    "turn into a horror movie scene",
    "make it look like prison food"
  ],
  pet: [
    "transform pet into a majestic lion",
    "turn into a fantasy creature",
    "make it look like a royal portrait",
    "transform into a superhero pet"
  ],
  default: [
    "make it dramatically epic with explosions",
    "transform into abstract art",
    "turn into a movie poster",
    "make it surreal and weird"
  ]
}

// Increase timeout for Gemini Vision API (can take 10-20 seconds)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 300 requests per day per IP
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 300, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Validate required environment variables
    const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini Vision API')

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const { image, intensity, prompt } = await request.json()

    if (!image) {
      throw Errors.missingParameter('image')
    }

    // Remove data:image prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    // First, analyze the image for detailed context (same as chat assistant)
    let imageContext = null
    try {
      const contextAnalysis = await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        `Analyze this image and provide a brief, structured description for context.

Format your response as JSON with this structure:
{
  "type": "bedroom" | "portrait" | "landscape" | "food" | "pet" | "product" | "architecture" | "abstract" | "selfie" | "group" | "other",
  "subject": "main subject of the image (e.g., 'young woman', 'golden retriever', 'living room')",
  "setting": "where the photo was taken (e.g., 'outdoor park', 'modern bedroom', 'studio')",
  "mood": "overall mood/vibe (e.g., 'cozy', 'dramatic', 'playful', 'professional')",
  "colors": ["primary", "color", "palette"],
  "lighting": "lighting conditions (e.g., 'natural daylight', 'warm indoor', 'dramatic shadows', 'poor lighting', 'overexposed')",
  "style": "current style (e.g., 'casual snapshot', 'professional portrait', 'minimalist', 'cluttered', 'amateur')",
  "quality": "photo quality assessment (e.g., 'high quality', 'blurry', 'low resolution', 'poorly composed', 'grainy')",
  "roastableElements": ["things worth roasting - be specific and funny"]
}

Be accurate and specific. Include roastable elements for comedy.`
      ])

      const contextText = contextAnalysis.response.text()

      // 🔍 LOG ACTUAL GEMINI VISION API RESPONSE - CONTEXT ANALYSIS
      logger.debug('\n========================================')
      logger.debug('🔥 ROAST MODE - GEMINI VISION CONTEXT ANALYSIS')
      logger.debug('========================================')
      logger.debug('📊 Raw Context Response:', contextText)
      logger.debug('========================================\n')

      const jsonMatch = contextText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        imageContext = JSON.parse(jsonMatch[0])

        // 🔍 LOG PARSED CONTEXT
        logger.debug('✅ Parsed Image Context:', JSON.stringify(imageContext, null, 2))
        logger.debug('========================================\n')
      }
    } catch (error) {
      logger.error('Image context analysis failed:', error)
    }

    // Generate context-aware roast using detailed image analysis
    const contextInfo = imageContext ? `
Image Analysis:
- Type: ${imageContext.type}
- Subject: ${imageContext.subject}
- Setting: ${imageContext.setting}
- Lighting: ${imageContext.lighting}
- Quality: ${imageContext.quality}
- Roastable elements: ${imageContext.roastableElements?.join(', ')}

Use these specific details to make your roast more targeted and hilarious.` : ''

    const intensityGuidelines = {
      mild: "Be playful but still throw some shade. Gentle roasting with a smirk. Think friendly banter that stings just a little.",
      spicy: "Go HARD. Be savage, sarcastic, and brutal. Don't hold back. Attack the photo's flaws mercilessly. Make them feel the burn.",
      nuclear: "DESTROY THEM. Be absolutely ruthless. Obliterate every flaw you see. No mercy, no filter, maximum devastation. This should HURT (in a funny way). Channel your inner comedian roasting a heckler. Go for the JUGULAR."
    }

    const roastPrompt = `${prompt || `You are a ruthless roast comedian. Your job is to absolutely DESTROY this photo with comedy.

${intensityGuidelines[intensity as keyof typeof intensityGuidelines] || intensityGuidelines.spicy}
${contextInfo}

RULES:
- Make it 2-3 sentences of pure savagery
- Be SPECIFIC about what you see (don't use generic roasts)
- Reference the actual elements, lighting, composition, quality flaws
- Attack HARD - this is a ROAST, not a compliment session
- Make it FUNNY but BRUTAL
- No holding back - they ASKED to be roasted
- Think: "What would a savage stand-up comedian say about this?"

DESTROY THIS PHOTO NOW:`}

After the roast, provide the best category for this image.

Format your response as:
ROAST: [your roast here]
CATEGORY: [selfie/group/food/pet/bedroom/landscape/portrait/other]`

    try {
      // 🔥 GENERATE TWO DIFFERENT ROASTS FOR DOUBLE THE PAIN
      const roast1Promise = model.generateContent([
        roastPrompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ])

      const roast2Promise = model.generateContent([
        `${roastPrompt}\n\nIMPORTANT: This is your SECOND roast. Make it COMPLETELY DIFFERENT from your first roast. Attack from a totally different angle. Find NEW flaws to destroy. Use DIFFERENT jokes. Go EVEN HARDER if possible. No repetition - fresh savagery only.`,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ])

      // Run both roasts in parallel for speed
      const [result1, result2] = await Promise.all([roast1Promise, roast2Promise])

      const response1 = result1.response.text()
      const response2 = result2.response.text()

      // 🔍 LOG ACTUAL GEMINI VISION API RESPONSE - ROAST GENERATION
      logger.debug('\n========================================')
      logger.debug('💥 ROAST MODE - DOUBLE ROAST GENERATION')
      logger.debug('========================================')
      logger.debug('📊 Roast #1:', response1)
      logger.debug('📊 Roast #2:', response2)
      logger.debug('========================================\n')

      // Parse both responses
      const roast1Match = response1.match(/ROAST:\s*([\s\S]+?)(?:CATEGORY:|$)/)
      const roast2Match = response2.match(/ROAST:\s*([\s\S]+?)(?:CATEGORY:|$)/)
      const categoryMatch = response1.match(/CATEGORY:\s*(\w+)/i)

      const roastText = roast1Match
        ? roast1Match[1].trim()
        : "This image is so unique, even AI is speechless. That's... something."

      const roastText2 = roast2Match
        ? roast2Match[1].trim()
        : "Seriously, I'm running out of insults. This photo broke the roast generator."

      const category = categoryMatch
        ? categoryMatch[1].toLowerCase()
        : 'default'

      // 🔍 LOG FINAL PARSED ROASTS
      logger.info('✅ Final Roast Outputs:', { roastText, roastText2, category })

      // Select random transformation based on category
      const templates = roastTemplates[category as keyof typeof roastTemplates] || roastTemplates.default
      const transformPrompt = templates[Math.floor(Math.random() * templates.length)]

      // ⚡ SPEED OPTIMIZATION: Return roast immediately, skip slow transformation
      // Users care about the roast, not the transformation
      return NextResponse.json({
        roastText,
        roastText2, // Second roast for double damage
        transformPrompt,
        transformedImage: image, // Just return original for speed
        category,
        imageContext // Include context for display
      })

    } catch (error) {
      logger.error('Gemini API error:', error)

      // Use roast library as fallback
      const imageType = detectImageType('general photo')
      const roastText = getRandomRoast(intensity as 'mild' | 'spicy' | 'nuclear', imageType)

      // Select appropriate transformation based on intensity
      const transformPrompts = {
        mild: "add a funny cartoon filter",
        spicy: "make it look dramatically terrible",
        nuclear: "destroy this image with maximum chaos"
      }

      return NextResponse.json({
        roastText,
        transformPrompt: transformPrompts[intensity as keyof typeof transformPrompts] || "make it interesting",
        transformedImage: image,
        category: imageType,
        intensity
      })
    }

  } catch (error) {
    return handleApiError(error, {
      route: '/api/roast',
      method: 'POST',
    })
  }
}