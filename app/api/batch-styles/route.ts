import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError } from '@/lib/apiErrors'
import { logger } from '@/lib/logger'

// Style presets for batch generation
const STYLE_PRESETS = {
  multiStyle: [
    'professional studio photography with soft lighting',
    'dramatic cinematic lighting with moody atmosphere',
    'vibrant pop art style with bold colors',
    'minimalist clean aesthetic with negative space',
    'vintage retro film photography look',
    'high-end magazine editorial style',
    'modern flat design illustration',
    'watercolor painting artistic interpretation',
    'neon cyberpunk futuristic style',
    'warm golden hour natural lighting'
  ],
  threeD: [
    'photorealistic 3D render with ray tracing',
    'isometric 3D product visualization',
    '3D clay render with soft materials',
    'low poly 3D geometric style',
    'CGI product mockup on seamless background',
    'holographic 3D projection effect'
  ],
  era: [
    'vintage 1920s art deco style',
    '1950s retro Americana aesthetic',
    '1980s neon synthwave vaporwave',
    'Victorian era romantic painting',
    'futuristic cyberpunk 2077 style',
    'steampunk industrial Victorian fusion'
  ],
  characterConsistent: [
    'same subject, beach sunset background',
    'same subject, urban city night scene',
    'same subject, mountain landscape background',
    'same subject, professional studio setting',
    'same subject, magical fantasy environment'
  ],
  arOverlay: [
    'augmented reality product overlay with transparent background',
    'AR holographic interface elements overlay',
    'AR measurement guides and dimensions overlay',
    'AR interactive product features highlight',
    'AR social media filter effect overlay'
  ],
  comicManga: [
    'Japanese manga black and white ink style',
    'American comic book bold line art',
    'anime cel-shaded digital art style',
    'graphic novel noir dark shadows',
    'chibi cute kawaii anime style',
    'webtoon modern digital comic style'
  ]
}

export async function POST(request: NextRequest) {
  try {
    // Validate required environment variables
    const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini batch style generation')

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const batchType = formData.get('batchType') as string
    const customPrompt = formData.get('customPrompt') as string | null

    if (!imageFile) {
      throw Errors.missingParameter('image')
    }

    // Get the appropriate style prompts
    let stylePrompts: string[] = []

    if (customPrompt) {
      // Custom batch with user-provided prompt
      stylePrompts = [customPrompt]
    } else if (batchType && STYLE_PRESETS[batchType as keyof typeof STYLE_PRESETS]) {
      stylePrompts = STYLE_PRESETS[batchType as keyof typeof STYLE_PRESETS]
    } else {
      throw Errors.invalidInput('Invalid batch type or missing custom prompt')
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')

    logger.info('Starting batch generation:', {
      batchType,
      styleCount: stylePrompts.length,
      imageSize: imageFile.size
    })

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const imageGenModel = genAI.getGenerativeModel({
      model: "gemini-3-pro-image"
    })

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type
      }
    }

    // Generate images for each style
    const generatedImages: Array<{
      image: string
      prompt: string
      style: string
      index: number
    }> = []

    const errors: Array<{ index: number; error: string }> = []

    // Limit to 6 generations per batch to avoid timeout
    const limitedPrompts = stylePrompts.slice(0, 6)

    for (let i = 0; i < limitedPrompts.length; i++) {
      const stylePrompt = limitedPrompts[i]

      try {
        const fullPrompt = `Generate an image based on this input image with the following style transformation: ${stylePrompt}

Requirements:
- Transform the image to match the requested style
- Maintain the main subject/content
- Apply ${stylePrompt}
- High quality output
- Keep composition similar to original`

        const result = await imageGenModel.generateContent([fullPrompt, imagePart])
        const response = await result.response

        // Extract generated image
        if (response.candidates && response.candidates[0]) {
          const candidate = response.candidates[0]
          if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData && part.inlineData.data) {
                generatedImages.push({
                  image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                  prompt: stylePrompt,
                  style: batchType || 'custom',
                  index: i
                })
                logger.info(`✅ Generated image ${i + 1}/${limitedPrompts.length}`)
                break
              }
            }
          }
        }
      } catch (error) {
        logger.error(`Error generating image ${i + 1}:`, error)
        errors.push({
          index: i,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }

      // Small delay between requests to avoid rate limiting
      if (i < limitedPrompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    if (generatedImages.length === 0) {
      throw Errors.generationFailed('Failed to generate any images')
    }

    return NextResponse.json({
      success: true,
      images: generatedImages,
      batchType,
      totalGenerated: generatedImages.length,
      totalAttempted: limitedPrompts.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    return handleApiError(error)
  }
}
