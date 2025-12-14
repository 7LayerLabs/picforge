'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import Link from 'next/link'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import ShareModal from '@/components/ShareModal'
const BeforeAfterSlider = dynamic(() => import('@/components/BeforeAfterSlider'), { ssr: false })
import TemplateSelector from '@/components/TemplateSelector'
import ImageGallery from '@/components/ImageGallery'
import BatchStyleGenerator from '@/components/BatchStyleGenerator'
import ExportModal from '@/components/ExportModal'
import WatermarkPreviewNotice from '@/components/WatermarkPreviewNotice'
import { logger } from '@/lib/logger'
import { useImageTracking } from '@/hooks/useImageTracking'
import { prompts } from '@/lib/prompts'
import { addWatermarkIfFree, blobToDataUrl, dataUrlToBlob } from '@/lib/watermark'

interface HistoryItem {
  prompt: string
  image: string
  timestamp: Date
  isOriginal?: boolean
}

// Get daily rotating prompt - changes every 24 hours, same for all users
const getPromptOfTheDay = () => {
  const daysSinceEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
  const promptIndex = daysSinceEpoch % prompts.length
  return prompts[promptIndex]
}

export default function EditorPage() {
  // Dynamic Prompt of the Day - rotates daily based on system time
  const dailyPrompt = getPromptOfTheDay()
  const PROMPT_OF_THE_DAY = dailyPrompt.description

  // Ref for scrolling to upload section
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Use actual auth/tracking functionality
  const { user, usage, tier, trackImageGeneration, hasReachedLimit, getRemainingImages, saveFavorite, favorites } = useImageTracking()

  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [instructions, setInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promptOfDayActive, setPromptOfDayActive] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [additionalImage, setAdditionalImage] = useState<File | null>(null)
  const [additionalImagePreview, setAdditionalImagePreview] = useState<string | null>(null)
  const [isDraggingAdditional, setIsDraggingAdditional] = useState(false)
  const [isDraggingMain, setIsDraggingMain] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [isPromptFavorited, setIsPromptFavorited] = useState(false)

  // AI Canvas states
  const [canvasPrompt, setCanvasPrompt] = useState('')
  const [isGeneratingCanvas, setIsGeneratingCanvas] = useState(false)
  const [canvasSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024')
  const [canvasQuality] = useState<'standard' | 'hd'>('standard')

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false)

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportImageData, setExportImageData] = useState<string>('')

  // Before/After slider state
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)

  // Lock composition checkbox state
  const [lockComposition, setLockComposition] = useState(false)

  // Mobile options dropdown state
  const [showMobileOptions, setShowMobileOptions] = useState(false)

  // Convert image to supported format (JPEG/PNG) if needed
  const convertImageToSupported = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // If already a supported format, just convert to base64
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error(`Failed to read ${file.type} file. Please try again.`))
        reader.readAsDataURL(file)
        return
      }

      // For unsupported formats (HEIC, AVIF, WEBP, etc.), convert to PNG
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Browser canvas not available. Try a different browser.'))
            return
          }
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => {
          if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
            reject(new Error('HEIC/HEIF format detected. Please convert to JPEG/PNG first or use a different image.'))
          } else {
            reject(new Error(`Unable to process ${file.name}. Try JPEG or PNG format.`))
          }
        }
        img.src = reader.result as string
      }
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
      reader.readAsDataURL(file)
    })
  }

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()

          if (file) {
            try {
              const imageData = await convertImageToSupported(file)

              // If we have a main image but no additional image, paste as additional
              if (currentImage && !additionalImage) {
                setAdditionalImage(file)
                setAdditionalImagePreview(imageData)
              }
              // Otherwise paste as main image if we don't have one
              else if (!currentImage) {
                setCurrentImage(imageData)
                setOriginalImage(imageData)
                setHistory([{
                  prompt: 'Original Image (Pasted)',
                  image: imageData,
                  timestamp: new Date(),
                  isOriginal: true
                }])
                setSelectedFile(file)
                // If prompt of day was active, set it in instructions
                if (promptOfDayActive) {
                  setInstructions(PROMPT_OF_THE_DAY)
                }
              }
            } catch (error) {
              logger.error('Error converting pasted image:', error)
              alert('Failed to process pasted image. Please try uploading instead.')
            }
          }
          break
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [currentImage, additionalImage])

  // Load sample image if selected from gallery
  useEffect(() => {
    const selectedSample = localStorage.getItem('selectedSampleImage')
    if (selectedSample) {
      // Clear the flag
      localStorage.removeItem('selectedSampleImage')

      // Load the sample image
      fetch(selectedSample)
        .then(res => res.blob())
        .then(async blob => {
          const file = new File([blob], 'sample.jpg', { type: blob.type || 'image/jpeg' })
          // Convert to supported format
          const imageData = await convertImageToSupported(file)
          setCurrentImage(imageData)
          setOriginalImage(imageData)
          setHistory([{
            prompt: 'Sample Image',
            image: imageData,
            timestamp: new Date(),
            isOriginal: true
          }])
          setSelectedFile(file)
        })
        .catch(err => {
          logger.error('Failed to load sample image:', err)
        })
    }
  }, [])

  // Reset zoom when opening a new image
  const openZoom = (imageSrc: string) => {
    setZoomedImage(imageSrc)
    setZoomLevel(1)
    setZoomPosition({ x: 0, y: 0 })
  }

  // Handle ESC key to close zoom
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedImage) {
        setZoomedImage(null)
        setZoomLevel(1)
        setZoomPosition({ x: 0, y: 0 })
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [zoomedImage])

  // Check if user wants to try a prompt from showcase
  useEffect(() => {
    const tryPrompt = sessionStorage.getItem('tryPrompt')
    if (tryPrompt) {
      setInstructions(tryPrompt)
      sessionStorage.removeItem('tryPrompt')
      // Scroll to upload section
      setTimeout(() => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  // Check if Prompt of the Day is already favorited
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isFavorited = favorites.some((fav: any) => fav.prompt === PROMPT_OF_THE_DAY)
      setIsPromptFavorited(isFavorited)
    }
  }, [favorites, PROMPT_OF_THE_DAY])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      try {
        const imageData = await convertImageToSupported(file)
        setCurrentImage(imageData)
        setOriginalImage(imageData)
        // Add original image as first history item
        setHistory([{
          prompt: 'Original Image',
          image: imageData,
          timestamp: new Date(),
          isOriginal: true
        }])
        // If prompt of day was active, set it in instructions
        if (promptOfDayActive) {
          setInstructions(PROMPT_OF_THE_DAY)
        }
      } catch (error) {
        logger.error('Error converting uploaded image:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to process image. Please try a different format.'
        alert(errorMessage)
      }
    }
  }

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAdditionalImage(file)
      try {
        const imageData = await convertImageToSupported(file)
        setAdditionalImagePreview(imageData)
      } catch (error) {
        logger.error('Error converting additional image:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to process additional image. Please try a different format.'
        alert(errorMessage)
      }
    }
  }

  const removeAdditionalImage = () => {
    setAdditionalImage(null)
    setAdditionalImagePreview(null)
  }

  // Drag and drop handlers for additional image
  const handleAdditionalDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingAdditional(true)
  }

  const handleAdditionalDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingAdditional(false)
  }

  const handleAdditionalDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingAdditional(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setAdditionalImage(file)
        try {
          const imageData = await convertImageToSupported(file)
          setAdditionalImagePreview(imageData)
        } catch (error) {
          logger.error('Error converting dropped image:', error)
          alert('Failed to process dropped image. Please try a different format.')
        }
      }
    }
  }

  const handleTemplateSelect = (templatePrompt: string, templateName: string) => {
    setInstructions(templatePrompt)
    setSubmitMessage(`✨ "${templateName}" loaded - Review the prompt below, edit if needed, then click "Apply Edit" to generate!`)

    // Clear message after a few seconds
    setTimeout(() => {
      setSubmitMessage('')
    }, 8000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Debug logging
    console.log('Submit clicked:', {
      hasSelectedFile: !!selectedFile,
      selectedFileName: selectedFile?.name,
      hasInstructions: !!instructions,
      instructionsLength: instructions.length,
      instructions: instructions,
      hasCurrentImage: !!currentImage,
      hasOriginalImage: !!originalImage
    })

    // Validate we have an image (from any source: upload, paste, history, etc.)
    if (!currentImage && !originalImage) {
      setSubmitMessage('Please upload or paste an image first')
      return
    }

    if (!instructions || !instructions.trim()) {
      setSubmitMessage('Please enter transformation instructions')
      return
    }

    // No auth or limits - just work

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const formData = new FormData()

      // Always use the converted image (currentImage or originalImage) which are PNG base64
      const imageToSend = currentImage !== originalImage ? currentImage : originalImage
      if (!imageToSend) {
        setSubmitMessage('Image not ready. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Convert data URL to Blob directly (avoid fetch() NetworkError on large images)
      try {
        const blob = await dataUrlToBlob(imageToSend)
        const file = new File([blob], 'image.png', { type: 'image/png' })
        formData.append('image', file)
      } catch (blobError) {
        console.error('Error converting image to blob:', blobError)
        setSubmitMessage('❌ Image too large or corrupted. Try a smaller image.')
        setIsSubmitting(false)
        return
      }

      // Add the additional image if one is selected (use converted preview)
      if (additionalImage && additionalImagePreview) {
        try {
          const addBlob = await dataUrlToBlob(additionalImagePreview)
          const addFile = new File([addBlob], 'additional.png', { type: 'image/png' })
          formData.append('additionalImage', addFile)
        } catch (addBlobError) {
          console.error('Error converting additional image to blob:', addBlobError)
          setSubmitMessage('❌ Additional image too large or corrupted.')
          setIsSubmitting(false)
          return
        }
      }

      // Append lock composition instruction if checked
      let finalPrompt = instructions
      if (lockComposition) {
        finalPrompt = `${instructions}. IMPORTANT: Do not alter anything else in the image - keep the composition, layout, other objects, and background exactly the same. Only apply the specific change requested above.`
      }

      formData.append('prompt', finalPrompt)
      formData.append('userTier', tier) // Pass user tier for model selection

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      })

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        logger.error('Non-JSON response from API:', textResponse)
        throw new Error(`Server error: Expected JSON response but got ${contentType}. This might be a timeout or server error. Please try again.`)
      }

      const data = await response.json()

      if (response.ok && data.generatedImage) {
        // Add generated image to history
        const historyItem: HistoryItem = {
          prompt: instructions,
          image: data.generatedImage,
          timestamp: new Date()
        }
        setHistory(prev => [...prev, historyItem])

        // Track image generation with InstantDB (if user is logged in)
        // Don't let tracking failures block image generation
        if (user) {
          try {
            await trackImageGeneration({
              prompt: instructions,
              originalUrl: originalImage || undefined,
              transformedUrl: data.generatedImage,
              locked: lockComposition
            });
          } catch (trackingError) {
            logger.error('Failed to track image generation (non-critical):', trackingError);
            // Continue anyway - tracking is non-critical
          }
        }

        // Replace the current image with generated one
        setCurrentImage(data.generatedImage)

        // Update the selected file for next iteration
        const genResponse = await fetch(data.generatedImage)
        const genBlob = await genResponse.blob()
        const genFile = new File([genBlob], 'generated.png', { type: 'image/png' })
        setSelectedFile(genFile)

        setSubmitMessage('Image generated successfully!')
        setInstructions('') // Clear the input for next prompt
        // Clear additional image after successful generation
        setAdditionalImage(null)
        setAdditionalImagePreview(null)
      } else if (response.ok && data.analysis) {
        setSubmitMessage(`Analysis complete. ${data.note || 'Image generation not available.'}`)
      } else if (response.status === 429) {
        // Rate limit exceeded
        setSubmitMessage(data.error || 'Daily limit reached. Please try again tomorrow!')
      } else {
        const errorMsg = data.error || data.message || JSON.stringify(data) || 'Unknown error occurred'
        setSubmitMessage(`Error: ${errorMsg}`)
        logger.error('API Error Response:', data)
      }
    } catch (error) {
      logger.error('Error submitting form:', error)
      // Show more specific error message
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          setSubmitMessage('❌ Connection timeout. Try smaller images or check your internet.')
        } else if (error.message.includes('quota') || error.message.includes('memory')) {
          setSubmitMessage('❌ Browser memory full. Try refreshing the page.')
        } else {
          setSubmitMessage(`❌ Error: ${error.message}`)
        }
      } else {
        setSubmitMessage('❌ Failed to submit. Large images may timeout. Try again or use smaller files.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCurrentImage(null)
    setOriginalImage(null)
    setSelectedFile(null)
    setInstructions('')
    setSubmitMessage('')
    setHistory([])
    setAdditionalImage(null)
    setAdditionalImagePreview(null)
    // Clear localStorage
    localStorage.removeItem('imageHistory')
    localStorage.removeItem('currentImage')
    localStorage.removeItem('originalImage')
  }

  const restoreFromHistory = async (item: HistoryItem) => {
    setCurrentImage(item.image)
    setInstructions('')

    // Convert the image to a file for editing
    const response = await fetch(item.image)
    const blob = await response.blob()
    const file = new File([blob], item.isOriginal ? 'original.png' : 'edited.png', { type: 'image/png' })
    setSelectedFile(file)
  }

  const downloadAllImages = async () => {
    if (history.length === 0) return

    const zip = new JSZip()

    // Add each image to the zip
    for (let i = 0; i < history.length; i++) {
      const item = history[i]
      try {
        const response = await fetch(item.image)
        const blob = await response.blob()

        // Create filename based on whether it's original or edited
        const filename = item.isOriginal
          ? '00_original.png'
          : `${String(i).padStart(2, '0')}_${item.prompt.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.png`

        // Use the blob directly - no need for unnecessary conversions
        zip.file(filename, blob)
      } catch (error) {
        logger.error(`Failed to add image ${i} to zip:`, error)
      }
    }

    // Generate and download the zip file
    const content = await zip.generateAsync({ type: 'blob' })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
    saveAs(content, `image-edits-${timestamp}.zip`)
  }

  const downloadSingleImage = async (item: HistoryItem, index: number) => {
    // Open export modal instead of direct download
    setExportImageData(item.image)
    setShowExportModal(true)
  }

  const handleFavoriteImage = async (item: HistoryItem) => {
    if (!user) {
      alert('Please sign in to save favorites!')
      return
    }

    const result = await saveFavorite(
      item.prompt,
      undefined, // category
      originalImage || undefined,
      item.image,
      lockComposition
    )

    if (result.success) {
      alert('Added to favorites! ⭐')
    } else {
      alert(result.error || 'Failed to save favorite. Please try again.')
    }
  }

  const openExportModal = () => {
    if (currentImage) {
      setExportImageData(currentImage)
      setShowExportModal(true)
    }
  }

  // Reserved for future Canvas generation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateCanvas = async () => {
    if (!canvasPrompt.trim()) {
      setSubmitMessage('Please enter a prompt for your canvas')
      setTimeout(() => setSubmitMessage(''), 3000)
      return
    }

    setIsGeneratingCanvas(true)
    setSubmitMessage('Generating your canvas...')

    try {
      const response = await fetch('/api/generate-canvas-pollinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: canvasPrompt,
        }),
      })

      const data = await response.json()

      if (response.ok && data.image) {
        // Set the generated image as the current image
        setCurrentImage(data.image)
        setOriginalImage(data.image)

        // Convert to file for editing
        const res = await fetch(data.image)
        const blob = await res.blob()
        const file = new File([blob], 'ai-canvas.png', { type: 'image/png' })
        setSelectedFile(file)

        // Add to history
        setHistory([{
          prompt: `AI Canvas: ${data.revisedPrompt || canvasPrompt}`,
          image: data.image,
          timestamp: new Date(),
          isOriginal: true
        }])

        setCanvasPrompt('')
        setSubmitMessage('Canvas generated successfully!')
      } else {
        // Display error with proper formatting
        if (data.billingIssue) {
          setSubmitMessage('⚠️ ' + data.error)
        } else {
          setSubmitMessage(data.error || 'Failed to generate canvas')
        }
      }
    } catch (error) {
      logger.error('Error generating canvas:', error)
      setSubmitMessage('Failed to generate canvas. Please check the console for details.')
    } finally {
      setIsGeneratingCanvas(false)
      // Clear error message after delay
      setTimeout(() => {
        if (!currentImage) {
          setSubmitMessage('')
        }
      }, 10000)
    }
  }

  const deleteHistoryItem = (indexToDelete: number) => {
    const itemToDelete = history[indexToDelete]

    // Don't allow deleting the original image
    if (itemToDelete.isOriginal) {
      return
    }

    // If deleting the current image, switch to the previous one or original
    if (currentImage === itemToDelete.image) {
      const prevItem = history[indexToDelete - 1]
      if (prevItem) {
        restoreFromHistory(prevItem)
      }
    }

    // Remove from history
    setHistory(prev => prev.filter((_, index) => index !== indexToDelete))
  }

  const handleBatchGenerated = (images: Array<{ image: string; prompt: string; style: string }>) => {
    // Add all generated images to history
    const newHistoryItems: HistoryItem[] = images.map(img => ({
      prompt: `Batch: ${img.prompt}`,
      image: img.image,
      timestamp: new Date()
    }))

    setHistory(prev => [...prev, ...newHistoryItems])

    // Set the first generated image as current
    if (images.length > 0) {
      setCurrentImage(images[0].image)
    }

    setSubmitMessage(`✨ Generated ${images.length} style variations!`)
    setTimeout(() => setSubmitMessage(''), 5000)
  }


  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="p-2 sm:p-4 flex flex-col items-center">
        {/* Zoom Modal */}
        {zoomedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center overflow-hidden transition-all duration-300"
            onClick={() => {
              setZoomedImage(null)
              setZoomLevel(1)
              setZoomPosition({ x: 0, y: 0 })
            }}
            onWheel={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const delta = e.deltaY > 0 ? 0.9 : 1.1
              setZoomLevel(prev => Math.min(Math.max(prev * delta, 0.5), 5))
            }}
          >
            <div
              className="relative"
              style={{
                transform: `scale(${zoomLevel}) translate(${zoomPosition.x}px, ${zoomPosition.y}px)`,
                transition: 'transform 0.1s ease-out',
                cursor: zoomLevel > 1 ? 'move' : 'zoom-in'
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                if (zoomLevel > 1) {
                  e.preventDefault()
                  const startX = e.clientX - zoomPosition.x
                  const startY = e.clientY - zoomPosition.y

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    setZoomPosition({
                      x: moveEvent.clientX - startX,
                      y: moveEvent.clientY - startY
                    })
                  }

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }

                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedImage}
                alt="Zoomed view"
                className="max-w-[90vw] max-h-[90vh] object-contain select-none"
                draggable={false}
              />
            </div>

            {/* Zoom controls overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-black/50 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl border border-white/20">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
                }}
                className="hover:text-teal-400 transition-all hover:scale-110 text-xl px-2 active:scale-95"
              >
                −
              </button>
              <span className="min-w-[60px] text-center font-medium">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomLevel(prev => Math.min(prev + 0.25, 5))
                }}
                className="hover:text-teal-400 transition-all hover:scale-110 text-xl px-2 active:scale-95"
              >
                +
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomLevel(1)
                  setZoomPosition({ x: 0, y: 0 })
                }}
                className="ml-2 text-sm hover:text-teal-400 transition-all hover:scale-105 border-l pl-3 border-gray-600 active:scale-95"
              >
                Reset
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-black/50 text-white text-sm px-5 py-2.5 rounded-full shadow-xl border border-white/20 animate-fade-in">
              Scroll to zoom • {zoomLevel > 1 ? 'Drag to pan' : 'Click to close'} • ESC to exit
            </div>
          </div>
        )}

        <div className="max-w-6xl w-full relative z-10 animate-fade-in-up">
          {!currentImage && (
            <>
              {/* Page Header */}
              <div className="text-center mb-6 px-4 pt-4">
                <h1 className="font-heading text-5xl md:text-6xl font-black text-black mb-3 leading-tight tracking-tight uppercase border-b-4 border-brutal-yellow inline-block pb-2">
                  The Forge
                </h1>
                <p className="text-lg md:text-xl text-black max-w-3xl mx-auto mb-4 leading-snug font-bold tracking-tight">
                  <span className="text-brutal-pink">(re)Imagine.</span> <span className="text-brutal-cyan">Break Reality.</span> <span className="bg-brutal-yellow px-2">Just Create.</span>
                </p>
              </div>
            </>
          )}

          {currentImage && (
            <div className="flex justify-end mb-8 px-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            </div>
          )}

          {!currentImage ? (
            <div ref={uploadSectionRef} className="px-4 pb-4">
              {/* Main Upload Section - Hero CTA */}
              <div className="max-w-3xl mx-auto mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload-input"
                />
                <div
                  onClick={() => document.getElementById('image-upload-input')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingMain(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    setIsDraggingMain(false)
                  }}
                  onDrop={async (e) => {
                    e.preventDefault()
                    setIsDraggingMain(false)
                    const files = e.dataTransfer.files
                    if (files && files[0] && files[0].type.startsWith('image/')) {
                      const file = files[0]
                      setSelectedFile(file)
                      try {
                        const imageData = await convertImageToSupported(file)
                        setCurrentImage(imageData)
                        setOriginalImage(imageData)
                        setHistory([{
                          prompt: 'Original Image',
                          image: imageData,
                          timestamp: new Date(),
                          isOriginal: true
                        }])
                        if (promptOfDayActive) {
                          setInstructions(PROMPT_OF_THE_DAY)
                        }
                      } catch (error) {
                        logger.error('Error converting dropped image:', error)
                        alert('Failed to process dropped image. Please try a different format.')
                      }
                    }
                  }}
                  className={`flex flex-col items-center justify-center px-6 py-12 rounded-xl cursor-pointer transition-all duration-200 border-2 hover:scale-[1.01] ${isDraggingMain
                    ? 'bg-teal-50 border-teal-500 shadow-lg'
                    : 'bg-white hover:bg-gray-50 border-gray-300 shadow-md'
                    }`}
                  style={{ boxShadow: isDraggingMain ? '0 4px 12px rgba(20,184,166,0.2)' : '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <svg className={`w-16 h-16 ${isDraggingMain ? 'text-teal-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className={`text-center ${isDraggingMain ? 'text-teal-600' : 'text-gray-900'}`}>
                      <div className="text-2xl font-extrabold mb-1 leading-tight tracking-tight">
                        {isDraggingMain ? 'Drop to Upload' : 'Upload Your Image'}
                      </div>
                      <div className="text-base font-medium opacity-70 leading-snug">
                        {isDraggingMain ? 'Release to start creating' : 'Drag & drop, click, or paste (Ctrl+V)'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt of the Day - Compact Banner */}
              <div className="max-w-3xl mx-auto mb-4">
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${promptOfDayActive
                  ? 'bg-purple-50 border-purple-400 shadow-md'
                  : 'bg-teal-50 border-teal-400 shadow-sm'
                  }`}
                  style={{ boxShadow: promptOfDayActive ? '0 3px 10px rgba(168,85,247,0.15)' : '0 2px 6px rgba(20,184,166,0.12)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">✨</span>
                      <div>
                        <h2 className="font-black text-lg text-gray-900 leading-tight tracking-tight">Prompt of the Day</h2>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-teal-300 rounded-full text-[10px] font-bold text-teal-700 mt-1">
                          {dailyPrompt.category}
                        </span>
                      </div>
                    </div>
                    {promptOfDayActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full animate-pulse shadow-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 italic mb-3 leading-snug font-medium">
                    &ldquo;{PROMPT_OF_THE_DAY}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(PROMPT_OF_THE_DAY);
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 2000);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-md transition-all hover:scale-105 active:scale-95 ${copiedPrompt ? 'bg-teal-600 shadow-sm' : 'bg-teal-500 hover:bg-teal-600 shadow-sm'
                        }`}
                      style={{ boxShadow: '0 2px 4px rgba(20,184,166,0.2)' }}
                    >
                      {copiedPrompt ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={async () => {
                        if (isPromptFavorited) {
                          alert('This prompt is already in your favorites!');
                        } else {
                          await saveFavorite(PROMPT_OF_THE_DAY, dailyPrompt.category);
                          setIsPromptFavorited(true);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-md transition-all hover:scale-105 active:scale-95 ${isPromptFavorited ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-500 hover:bg-teal-600'
                        }`}
                      style={{ boxShadow: isPromptFavorited ? '0 2px 4px rgba(168,85,247,0.2)' : '0 2px 4px rgba(20,184,166,0.2)' }}
                      title={isPromptFavorited ? 'Already in favorites' : 'Add to favorites'}
                    >
                      <svg className="w-3.5 h-3.5" fill={isPromptFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isPromptFavorited ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setPromptOfDayActive(!promptOfDayActive);
                        if (!promptOfDayActive) {
                          setInstructions(PROMPT_OF_THE_DAY);
                        } else {
                          setInstructions('');
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-md transition-all hover:scale-105 active:scale-95 ${promptOfDayActive ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      style={{ boxShadow: promptOfDayActive ? '0 2px 4px rgba(168,85,247,0.2)' : '0 2px 4px rgba(0,0,0,0.15)' }}
                    >
                      {promptOfDayActive ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Active
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Try It
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Need a Background? CTA */}
              <div className="max-w-3xl mx-auto mb-6">
                <Link href="/canvas" className="block p-3 bg-purple-600 rounded-lg border-2 border-purple-700 hover:border-purple-800 hover:scale-[1.01] transition-all duration-200 group shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">🎨</span>
                      <div>
                        <h3 className="text-base font-black text-white leading-tight tracking-tight">Need a Background?</h3>
                        <p className="text-xs text-purple-100 font-medium leading-tight mt-0.5">Generate custom AI backgrounds with Canvas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-bold group-hover:gap-2.5 transition-all text-sm">
                      <span>Try Canvas</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                {/* Left Sidebar - Templates & Batch Generator (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:w-[320px] flex-col space-y-3 animate-slide-in-left">
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4 bg-teal-600 bg-clip-text text-transparent">
                      🎨 Creative Studio
                    </h2>

                    {/* Template Selector */}
                    <TemplateSelector
                      onSelectTemplate={handleTemplateSelect}
                      currentImage={currentImage}
                    />

                    {/* Batch Style Generator */}
                    <div className="mt-4">
                      <BatchStyleGenerator
                        currentImage={currentImage}
                        onBatchGenerated={handleBatchGenerated}
                      />
                    </div>
                  </div>
                </div>

                {/* Center - Main Image and Form */}
                <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
                  {/* Main Image Display with Before/After Toggle */}
                  <div className="space-y-2">
                    {/* View Toggle Buttons */}
                    {currentImage && originalImage && currentImage !== originalImage && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowBeforeAfter(false)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${!showBeforeAfter
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          Current View
                        </button>
                        <button
                          onClick={() => setShowBeforeAfter(true)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 ${showBeforeAfter
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-4-3v3m0 0v3m0-3h3m-3 0H5" />
                          </svg>
                          Before/After
                        </button>
                      </div>
                    )}

                    {/* Image Display Area */}
                    {showBeforeAfter && originalImage && currentImage && currentImage !== originalImage ? (
                      <BeforeAfterSlider
                        beforeImage={originalImage}
                        afterImage={currentImage}
                        beforeLabel="Original"
                        afterLabel="Edited"
                        className="w-full"
                      />
                    ) : (
                      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner transition-all duration-300 card-smooth hover-lift">
                        {currentImage && (
                          <>
                            <NextImage
                              src={currentImage}
                              alt="Current image"
                              fill
                              className="object-contain cursor-zoom-in"
                              onClick={() => openZoom(currentImage)}
                            />
                            <button
                              onClick={() => openZoom(currentImage)}
                              className="absolute top-2 left-2 glass-dark text-white p-2.5 rounded-lg hover:scale-110 transition-all duration-200 shadow-lg border border-white/10 active:scale-95 hover-grow button-press"
                              title="Click to zoom"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </button>
                          </>
                        )}
                        {history.length > 0 && (
                          <div className="absolute top-2 right-2 glass-dark text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg border border-white/10">
                            Edit #{history.length}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Watermark Preview Notice (Free Tier Only) */}
                  {/* Watermark notice disabled */}

                  {/* Input Form */}
                  <form onSubmit={handleSubmit} className="w-full space-y-2 sm:space-y-3">
                    {/* Mobile Advanced Options Dropdown (Only visible on mobile) */}
                    <div className="lg:hidden">
                      <button
                        type="button"
                        onClick={() => setShowMobileOptions(!showMobileOptions)}
                        className="w-full flex items-center justify-between p-3 bg-teal-50 border-2 border-teal-200 rounded-xl hover:bg-teal-100 transition-all"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-teal-900">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                          Magic Templates & Advanced Options
                        </span>
                        <svg
                          className={`w-5 h-5 text-teal-600 transition-transform duration-200 ${showMobileOptions ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Collapsible Content */}
                      {showMobileOptions && (
                        <div className="mt-3 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-lg space-y-4 animate-slide-down">
                          <h3 className="text-base font-bold text-teal-600 mb-3">
                            🎨 Creative Studio
                          </h3>

                          {/* Template Selector */}
                          <TemplateSelector
                            onSelectTemplate={(prompt, name) => {
                              handleTemplateSelect(prompt, name)
                              setShowMobileOptions(false) // Auto-close after selection
                            }}
                            currentImage={currentImage}
                          />

                          {/* Batch Style Generator */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <BatchStyleGenerator
                              currentImage={currentImage}
                              onBatchGenerated={(images) => {
                                handleBatchGenerated(images)
                                setShowMobileOptions(false) // Auto-close after generation
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Editing Instructions {instructions && <span className="text-teal-500">✏️ (Edit & customize below)</span>}
                        </label>
                        {user && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-medium text-teal-700">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {getRemainingImages()} remaining today
                          </span>
                        )}
                      </div>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Enter editing instructions or select a template above..."
                        rows={3}
                        className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all duration-200 hover:shadow-lg placeholder-gray-400 font-medium focus-smooth resize-none"
                        disabled={isSubmitting}
                      />

                      {/* Lock Composition Checkbox */}
                      <div className="mt-2 flex items-center gap-2 px-2">
                        <input
                          type="checkbox"
                          id="lock-composition"
                          checked={lockComposition}
                          onChange={(e) => setLockComposition(e.target.checked)}
                          className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer"
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor="lock-composition"
                          className="text-sm text-gray-700 cursor-pointer select-none flex items-center gap-1.5"
                        >
                          <span className="font-medium">🔒 Lock Composition</span>
                          <span className="text-xs text-gray-500">- Keep everything else the same, only apply my edit</span>
                        </label>
                      </div>
                    </div>

                    {/* Fusion Dock - Additional Image Upload Section */}
                    <div className="relative">
                      <span className="absolute -top-2 left-4 bg-white px-2 text-xs font-bold text-teal-600 z-10">🔥 FUSION DOCK</span>
                      <div
                        className={`border-2 border-dashed rounded-xl p-2 sm:p-3 transition-all duration-300 ${isDraggingAdditional
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                        onDragOver={handleAdditionalDragOver}
                        onDragLeave={handleAdditionalDragLeave}
                        onDrop={handleAdditionalDrop}
                      >
                        {!additionalImagePreview ? (
                          <div className="text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAdditionalImageUpload}
                              style={{ display: 'none' }}
                              id="additional-image-upload"
                            />
                            <div className="py-1.5">
                              <svg className="w-5 h-5 mx-auto text-gray-400 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-[9px] font-medium text-gray-700 mb-0.5">
                                {isDraggingAdditional ? 'Drop image here' : 'Click, Drop or Paste'}
                              </p>
                              <button
                                type="button"
                                onClick={() => document.getElementById('additional-image-upload')?.click()}
                                className="px-2 py-0.5 text-[9px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                Browse Files
                              </button>
                              <p className="text-[8px] text-gray-500 mt-0.5">Blend, combine, or fuse images</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-50">
                                <NextImage
                                  src={additionalImagePreview}
                                  alt="Additional image"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Additional Image Added</p>
                                <p className="text-xs text-gray-500">Will be incorporated into the edit</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeAdditionalImage}
                              className="p-2 text-coral-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <button
                        type="submit"
                        disabled={isSubmitting || !instructions.trim()}
                        className="px-8 py-4 bg-brutal-pink hover:bg-brutal-cyan text-white border-4 border-black transition-all disabled:bg-gray-400 disabled:border-gray-500 text-sm font-black uppercase shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 min-w-[200px]"
                      >
                        {isSubmitting ? 'Processing...' : 'Generate'}
                      </button>
                      {instructions && !isSubmitting && (
                        <p className="text-xs text-black text-center font-bold">
                          Click to generate
                        </p>
                      )}
                    </div>

                    {submitMessage && (
                      <div className={`text-center p-3 rounded-lg text-sm font-medium shadow-md transition-all duration-300 animate-fadeIn ${submitMessage.includes('Error') || submitMessage.includes('Failed')
                        ? 'bg-purple-50 text-purple-700'
                        : submitMessage.includes('not available')
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-teal-50 text-teal-700'
                        }`}>
                        {submitMessage}
                      </div>
                    )}
                  </form>
                </div>

                {/* Right side - Enhanced Image Gallery */}
                {history.length > 0 && (
                  <div className="lg:w-[400px] animate-slide-in-right delay-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowShareModal(true)}
                          className="px-3 py-1.5 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                          title="Share Image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326M8.684 13.342C7.932 14.726 6.482 15.75 4.75 15.75c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5c1.732 0 3.182 1.024 3.934 2.408" />
                          </svg>
                          Share
                        </button>
                        <button
                          onClick={downloadAllImages}
                          className="px-3 py-1.5 text-xs bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                          title="Download All Images"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          All ({history.length})
                        </button>
                      </div>
                    </div>

                    <ImageGallery
                      items={history}
                      currentImage={currentImage}
                      onRestore={restoreFromHistory}
                      onDownload={downloadSingleImage}
                      onDelete={deleteHistoryItem}
                      onZoom={openZoom}
                      onFavorite={handleFavoriteImage}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        imageUrl={currentImage || ''}
        originalImageUrl={originalImage || undefined}
      />

      {/* Export Modal - Cricut/Etsy Features */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        imageData={exportImageData}
        fileName="picforge-design"
      />

    </div>
  )
}
