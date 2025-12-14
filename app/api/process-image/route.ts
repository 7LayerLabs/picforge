import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { logger } from '@/lib/logger'
import { getAIModel, TierType } from '@/lib/tierConfig'

// Increase timeout for image processing (can take 10-20 seconds)
export const maxDuration = 60

// Increase body size limit to 50MB for fusion images (two images + metadata)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Updated: Enhanced quality prompts for sharper, more detailed results

export async function POST(request: NextRequest) {
  try {
    logger.info('=== API /process-image called ===')

    // Rate limiting: 500 requests per day per IP
    const identifier = getClientIdentifier(request)
    logger.info('Client identifier:', identifier)

    const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)
    logger.info('Rate limit check:', rateLimit)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || ''
    logger.info('Received request with content-type:', contentType)

    let imageFile: File | null = null
    let additionalImageFile: File | null = null
    let prompt: string = ''
    let base64ImageData: string | null = null
    let userTier: TierType = 'free' // Default to free tier

    if (contentType.includes('application/json')) {
      // Handle JSON request (from batch processor)
      const jsonData = await request.json()
      prompt = jsonData.prompt
      userTier = (jsonData.userTier as TierType) || 'free'

      // Extract base64 image data
      if (jsonData.image) {
        base64ImageData = jsonData.image
        // If it's a data URL, extract just the base64 part
        if (base64ImageData && base64ImageData.includes(',')) {
          base64ImageData = base64ImageData.split(',')[1]
        }
      }

      if (!base64ImageData) {
        throw Errors.missingParameter('image')
      }
      if (!prompt) {
        throw Errors.missingParameter('prompt')
      }
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      // Handle FormData request (from regular upload)
      const formData = await request.formData()
      imageFile = formData.get('image') as File
      additionalImageFile = formData.get('additionalImage') as File | null
      prompt = formData.get('prompt') as string
      userTier = (formData.get('userTier') as TierType) || 'free'
    } else {
      // Unsupported content type
      throw Errors.invalidInput(`Unsupported content type: ${contentType}. Use application/json or multipart/form-data.`)
    }

    if (!imageFile && !base64ImageData) {
      throw Errors.missingParameter('image')
    }

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // Note: Rate limiting is now handled in the frontend via InstantDB user tiers
    // No server-side IP-based rate limiting - users manage their own limits through sign-in

    // Validate required environment variables
    const geminiApiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini 3 Pro Image processing')

    // Get image size in bytes
    let imageSize = 0
    let imageName = 'unknown'
    let imageType = 'image/png'

    if (imageFile) {
      imageSize = imageFile.size
      imageName = imageFile.name
      imageType = imageFile.type
    } else if (base64ImageData) {
      // Estimate size from base64 (rough estimate)
      imageSize = Math.round(base64ImageData.length * 0.75)
      imageName = 'batch-image'
      // Try to detect type from data URL if present
      if (base64ImageData.startsWith('data:')) {
        const matches = base64ImageData.match(/data:([^;]+);/)
        if (matches) imageType = matches[1]
      }
    }

    const sizeInKB = (imageSize / 1024).toFixed(2)
    const sizeInMB = (imageSize / (1024 * 1024)).toFixed(2)

    // Log to server console
    logger.info('Received submission:', {
      prompt,
      imageName,
      imageType,
      imageSize: `${imageSize} bytes (${sizeInKB} KB / ${sizeInMB} MB)`,
      requestType: contentType.includes('json') ? 'JSON (Batch)' : 'FormData'
    })

    if (additionalImageFile) {
      const addImageSize = additionalImageFile.size
      const addSizeInKB = (addImageSize / 1024).toFixed(2)
      const addSizeInMB = (addImageSize / (1024 * 1024)).toFixed(2)
      logger.info('Additional image:', {
        name: additionalImageFile.name,
        type: additionalImageFile.type,
        size: `${addImageSize} bytes (${addSizeInKB} KB / ${addSizeInMB} MB)`
      })
    }

    // Convert the main image to base64
    let base64Image: string
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      base64Image = Buffer.from(arrayBuffer).toString('base64')
    } else {
      // Already have base64 data
      base64Image = base64ImageData!
    }

    // Convert additional image to base64 if provided
    let base64AdditionalImage: string | null = null
    let additionalImageType: string | null = null
    if (additionalImageFile) {
      const additionalArrayBuffer = await additionalImageFile.arrayBuffer()
      base64AdditionalImage = Buffer.from(additionalArrayBuffer).toString('base64')
      additionalImageType = additionalImageFile.type
    }

    // Get the appropriate AI model based on user tier
    const aiModelName = getAIModel(userTier)
    logger.info(`Using AI model: ${aiModelName} for tier: ${userTier}`)

    try {
      // Initialize Gemini with quality-focused configuration
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({
        model: aiModelName,
        generationConfig: {
          temperature: 0.4,  // Lower temperature for more consistent, detailed results
          topP: 0.95,
          topK: 40,
        }
      })

      // Prepare image part
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: imageType
        }
      }

      // Prepare content array with prompt and main image
      const contentParts: Array<string | { inlineData: { data: string; mimeType: string } }> = []

      // Create enhanced prompt for image transformation with quality emphasis
      let transformPrompt = `Transform this image: ${prompt}.

CRITICAL QUALITY REQUIREMENTS:
- Maintain SHARP, CRISP details - NO blur or soft focus
- Preserve high resolution and clarity from original image
- Keep facial features, textures, and fine details SHARP and well-defined
- Apply transformation while maintaining photographic quality
- Output should be crystal clear with excellent detail preservation
- Keep the same person/subject identity and features from the original image

Generate a high-fidelity, professional quality result with maximum sharpness and detail.`

      // If additional image is provided, update prompt to include it with quality emphasis
      if (base64AdditionalImage && additionalImageType) {
        transformPrompt = `You are given TWO images. The first image is the main image to transform. The second image is an additional element to incorporate into the transformation.

TASK: ${prompt}

CRITICAL QUALITY REQUIREMENTS:
- Maintain SHARP, CRISP details - NO blur or soft focus
- Preserve high resolution and clarity from both images
- Keep facial features, textures, and fine details SHARP and well-defined
- Blend naturally while maintaining photographic quality
- Output should be crystal clear with excellent detail preservation
- Seamlessly fuse/incorporate elements from the second image into the first

Generate a high-fidelity, professional quality result with maximum sharpness and natural composition.`

        logger.info('Including additional image in transformation...')

        // Add prompt first
        contentParts.push(transformPrompt)
        // Add main image
        contentParts.push(imagePart)
        // Add additional image
        contentParts.push({
          inlineData: {
            data: base64AdditionalImage,
            mimeType: additionalImageType
          }
        })
      } else {
        // Single image transformation
        contentParts.push(transformPrompt)
        contentParts.push(imagePart)
      }

      logger.info('Sending request to Gemini 3 Pro Image...', { prompt: transformPrompt, hasAdditionalImage: !!base64AdditionalImage })

      // Generate image
      const result = await model.generateContent(contentParts)
      const response = await result.response

      logger.info('Received response from Gemini')

      // Extract image from response
      let generatedImageData = null
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0]
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              generatedImageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
              logger.info('✅ Image generated successfully with Gemini 3 Pro Image!')
              break
            }
          }
        }
      }

      if (!generatedImageData) {
        logger.error('No image data in response')
        throw Errors.imageProcessingFailed('Gemini did not return an image')
      }

      return NextResponse.json({
        success: true,
        message: `🎉 Image transformed successfully with ${aiModelName}!`,
        imageSize: imageSize,
        prompt: prompt,
        generatedImage: generatedImageData,
        generationStatus: 'success',
        modelUsed: aiModelName,
        userTier: userTier
      })

    } catch (modelError: unknown) {
      logger.error(`${aiModelName} transformation error:`, modelError)
      const error = modelError as Error

      // Log the full error details for debugging
      logger.error('Full error object:', JSON.stringify(modelError, null, 2))

      throw Errors.imageProcessingFailed(error.message || `${aiModelName} transformation failed`)
    }

  } catch (error) {
    return handleApiError(error, {
      route: '/api/process-image',
      method: 'POST',
    })
  }
}