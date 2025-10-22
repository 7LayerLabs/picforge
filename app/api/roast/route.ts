import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getRandomRoast, detectImageType } from '@/lib/roastLibrary'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const { image, intensity, prompt } = await request.json()

    if (!image) {
      throw Errors.missingParameter('image')
    }

    // Remove data:image prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    // Generate roast using Gemini Vision
    const roastPrompt = `${prompt || "Give a witty, sarcastic 2-sentence roast of this photo. Be funny but not mean."}

After the roast, categorize the image as one of: selfie, group, food, pet, or default.

Format your response as:
ROAST: [your roast here]
CATEGORY: [category]`

    try {
      const result = await model.generateContent([
        roastPrompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ])

      const response = result.response.text()

      // Parse the response
      const roastMatch = response.match(/ROAST:\s*([\s\S]+?)(?:CATEGORY:|$)/)
      const categoryMatch = response.match(/CATEGORY:\s*(\w+)/i)

      const roastText = roastMatch
        ? roastMatch[1].trim()
        : "This image is so unique, even AI is speechless. That's... something."

      const category = categoryMatch
        ? categoryMatch[1].toLowerCase()
        : 'default'

      // Select random transformation based on category
      const templates = roastTemplates[category as keyof typeof roastTemplates] || roastTemplates.default
      const transformPrompt = templates[Math.floor(Math.random() * templates.length)]

      // Generate transformed image using the same process-image endpoint
      const transformResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/process-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          prompt: transformPrompt,
          style: 'enhance'
        })
      })

      let transformedImage = image // Default to original if transformation fails

      if (transformResponse.ok) {
        const transformData = await transformResponse.json()
        if (transformData.processedImage) {
          transformedImage = transformData.processedImage
        }
      }

      return NextResponse.json({
        roastText,
        transformPrompt,
        transformedImage,
        category
      })

    } catch (error) {
      console.error('Gemini API error:', error)

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