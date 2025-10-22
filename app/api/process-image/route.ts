import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'
import { requireEnvVar } from '@/lib/validateEnv'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 500 requests per day per IP
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || ''
    console.log('Received request with content-type:', contentType)

    let imageFile: File | null = null
    let additionalImageFile: File | null = null
    let prompt: string = ''
    let base64ImageData: string | null = null

    if (contentType.includes('application/json')) {
      // Handle JSON request (from batch processor)
      const jsonData = await request.json()
      prompt = jsonData.prompt

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
    const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini image processing')

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
    console.log('=====================================')
    console.log('Received submission:')
    console.log('User Prompt:', prompt)
    console.log('Main Image Name:', imageName)
    console.log('Main Image Type:', imageType)
    console.log('Main Image Size:', `${imageSize} bytes (${sizeInKB} KB / ${sizeInMB} MB)`)
    console.log('Request Type:', contentType.includes('json') ? 'JSON (Batch)' : 'FormData')

    if (additionalImageFile) {
      const addImageSize = additionalImageFile.size
      const addSizeInKB = (addImageSize / 1024).toFixed(2)
      const addSizeInMB = (addImageSize / (1024 * 1024)).toFixed(2)
      console.log('Additional Image Name:', additionalImageFile.name)
      console.log('Additional Image Type:', additionalImageFile.type)
      console.log('Additional Image Size:', `${addImageSize} bytes (${addSizeInKB} KB / ${addSizeInMB} MB)`)
    }

    console.log('=====================================')

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

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)

    try {
      // Use the image generation preview model - THIS is the key!
      console.log('Using Gemini 2.5 Flash Image Preview model for generation...')

      const imageGenModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview" // The correct model for image generation!
      })

      // Prepare the image parts
      // Force PNG/JPEG mime types for Gemini compatibility (convert AVIF/WEBP to supported format)
      let mimeType = imageType
      if (mimeType === 'image/avif' || mimeType === 'image/webp' || !mimeType.startsWith('image/')) {
        mimeType = 'image/png'
      }

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }

      const contentParts: Array<string | { inlineData: { data: string; mimeType: string } }> = []

      // Create a clear prompt that tells Gemini to generate an image
      if (base64AdditionalImage && additionalImageType) {
        // Force PNG/JPEG for additional image as well
        let additionalMimeType = additionalImageType
        if (additionalMimeType === 'image/avif' || additionalMimeType === 'image/webp' || !additionalMimeType.startsWith('image/')) {
          additionalMimeType = 'image/png'
        }

        const additionalImagePart = {
          inlineData: {
            data: base64AdditionalImage,
            mimeType: additionalMimeType
          }
        }

        const imageGenPrompt = `Generate an image that combines these two input images based on the following instructions: ${prompt}

Requirements:
- Incorporate elements from both images
- Apply the requested changes: ${prompt}
- Blend or combine the images creatively
- High quality output`

        contentParts.push(imageGenPrompt, imagePart, additionalImagePart)
        console.log('Requesting image generation with TWO images and prompt:', prompt)
      } else {
        const imageGenPrompt = `IMPORTANT: Transform the EXACT person/subject shown in this image according to these instructions: ${prompt}

Critical Requirements:
- Keep the SAME person/subject from the original image - DO NOT create a different person or generic placeholder
- The transformation must be applied TO the actual subject in the photo
- Transform their appearance, clothing, surroundings, or style as requested
- The result should be clearly recognizable as a transformation of THIS specific person/subject
- Incorporate the subject fully into the new style/theme
- Apply the transformation: ${prompt}
- High quality, detailed output

Example: If the subject is a person and prompt says "turn into a zombie", transform THAT person into a zombie - same face, same person, but zombified. NOT a generic zombie drawing.`

        contentParts.push(imageGenPrompt, imagePart)
        console.log('Requesting image generation with enhanced subject-preservation prompt:', prompt)
      }

      // Make the API call with the correct format
      const result = await imageGenModel.generateContent(contentParts)
      const response = await result.response

      // Get the response text
      const responseText = response.text()
      console.log('Response received from Gemini')

      // Check if we got an image in the response
      let generatedImageData = null
      let analysisText = responseText

      // Check for image in the response candidates
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0]
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            // Check for inline image data
            if (part.inlineData && part.inlineData.data) {
              generatedImageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
              console.log('✅ Image generated successfully!')
              break
            }
            // Also check for text parts
            if (part.text) {
              analysisText = part.text
            }
          }
        }
      }

      // If we got an image, return success
      if (generatedImageData) {
        return NextResponse.json({
          success: true,
          message: '🎉 Image generated successfully using Gemini 2.5 Flash Image!',
          imageSize: imageSize,
          prompt: prompt,
          analysis: analysisText,
          generatedImage: generatedImageData,
          generationStatus: 'success',
          modelUsed: 'gemini-2.5-flash-image-preview'
        })
      }

      // If no image but got response, it means the model processed but didn't generate
      console.log('Model responded but no image generated. Response:', responseText.substring(0, 200))

      return NextResponse.json({
        success: true,
        message: 'Processed but image generation not available',
        imageSize: imageSize,
        prompt: prompt,
        analysis: analysisText,
        generationStatus: 'text_only',
        modelUsed: 'gemini-2.5-flash-image-preview',
        note: 'The model processed your request but did not generate an image. This may require special API access or the feature may be rolling out gradually.',
        debugInfo: {
          responseReceived: true,
          textContent: analysisText.substring(0, 500),
          imageFound: false
        }
      })

    } catch (modelError: unknown) {
      console.error('Model error:', modelError)

      const error = modelError as Error
      // Check if it's a model not found error
      if (error.message && error.message.includes('not found')) {
        console.log('Image generation model not available, trying alternate approach...')

        // Fallback to regular Gemini for analysis
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-1.5-flash"
        })

        const imagePart = {
          inlineData: {
            data: base64Image,
            mimeType: imageType
          }
        }

        const analysisPrompt = `Analyze this image and describe how to: ${prompt}

Provide:
1. Detailed description of changes needed
2. A concise image generation prompt (under 100 words) for AI image generators
3. Style and technical specifications`

        const result = await fallbackModel.generateContent([analysisPrompt, imagePart])
        const response = await result.response
        const text = response.text()

        return NextResponse.json({
          success: true,
          message: 'Analysis complete. Image generation model not available.',
          imageSize: imageSize,
          prompt: prompt,
          analysis: text,
          generationStatus: 'model_not_available',
          modelUsed: 'gemini-1.5-flash (fallback)',
          note: 'The gemini-2.5-flash-image-preview model is not available. This might require API waitlist access or may not be available in your region yet.',
          alternativeModels: [
            'Try using Google AI Studio web interface',
            'Wait for API access approval',
            'Use alternative services like DALL-E or Stable Diffusion'
          ]
        })
      }

      // For other errors, throw as image processing failure
      throw Errors.imageProcessingFailed(error.message || 'Gemini model error')
    }

  } catch (error) {
    return handleApiError(error, {
      route: '/api/process-image',
      method: 'POST',
    })
  }
}