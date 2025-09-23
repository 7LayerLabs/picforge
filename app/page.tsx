'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface HistoryItem {
  prompt: string
  image: string
  timestamp: Date
  isOriginal?: boolean
}

// Removed Session interface - simplified without session management

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [instructions, setInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [additionalImage, setAdditionalImage] = useState<File | null>(null)
  const [additionalImagePreview, setAdditionalImagePreview] = useState<string | null>(null)
  const [isDraggingAdditional, setIsDraggingAdditional] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  // AI Canvas states
  const [showAICanvas, setShowAICanvas] = useState(false)
  const [canvasPrompt, setCanvasPrompt] = useState('')
  const [isGeneratingCanvas, setIsGeneratingCanvas] = useState(false)
  const [canvasSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024')
  const [canvasQuality] = useState<'standard' | 'hd'>('standard')

  // Removed session management - simplified interface

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

  // Removed localStorage session management

  // Removed session management functions

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        if (imageData) {
          setCurrentImage(imageData)
          setOriginalImage(imageData)
          // Add original image as first history item
          setHistory([{
            prompt: 'Original Image',
            image: imageData,
            timestamp: new Date(),
            isOriginal: true
          }])
          // Simplified - no session management
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAdditionalImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        if (imageData) {
          setAdditionalImagePreview(imageData)
        }
      }
      reader.readAsDataURL(file)
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

  const handleAdditionalDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingAdditional(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setAdditionalImage(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setAdditionalImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !instructions) {
      setSubmitMessage('Please select an image and enter instructions')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const formData = new FormData()

      // If we have a generated image, convert it back to a file
      if (currentImage !== originalImage && currentImage) {
        const response = await fetch(currentImage)
        const blob = await response.blob()
        const file = new File([blob], 'current.png', { type: 'image/png' })
        formData.append('image', file)
      } else {
        formData.append('image', selectedFile)
      }

      // Add the additional image if one is selected
      if (additionalImage) {
        formData.append('additionalImage', additionalImage)
      }

      formData.append('prompt', instructions)

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.generatedImage) {
        // Add generated image to history
        const historyItem: HistoryItem = {
          prompt: instructions,
          image: data.generatedImage,
          timestamp: new Date()
        }
        setHistory(prev => [...prev, historyItem])

        // Removed auto-save functionality

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
        setSubmitMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Failed to submit. Please try again.')
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
    // Simplified - no session management
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

        zip.file(filename, blob)
      } catch (error) {
        console.error(`Failed to add image ${i} to zip:`, error)
      }
    }

    // Generate and download the zip file
    const content = await zip.generateAsync({ type: 'blob' })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
    saveAs(content, `image-edits-${timestamp}.zip`)
  }

  const downloadSingleImage = async (item: HistoryItem, index: number) => {
    try {
      const response = await fetch(item.image)
      const blob = await response.blob()
      const filename = item.isOriginal
        ? 'original.png'
        : `edit_${index}_${item.prompt.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.png`
      saveAs(blob, filename)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const generateCanvas = async () => {
    if (!canvasPrompt.trim()) {
      setSubmitMessage('Please enter a prompt for your canvas')
      setTimeout(() => setSubmitMessage(''), 3000)
      return
    }

    setIsGeneratingCanvas(true)
    setSubmitMessage('Generating your canvas...')

    try {
      console.log('Sending request to generate canvas:', { canvasPrompt, canvasSize, canvasQuality })

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
      console.log('API Response:', data)

      if (response.ok && data.image) {
        // Set the generated image as the current image
        setCurrentImage(data.image)
        setOriginalImage(data.image)

        // Simplified - no session management

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

        setShowAICanvas(false)
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
      console.error('Error generating canvas:', error)
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

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="p-2 sm:p-4 flex flex-col items-center">
      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center overflow-hidden"
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
            <img
              src={zoomedImage}
              alt="Zoomed view"
              className="max-w-[90vw] max-h-[90vh] object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Zoom controls overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
              }}
              className="hover:text-orange-400 transition-colors text-xl px-2"
            >
              −
            </button>
            <span className="min-w-[60px] text-center font-medium">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel(prev => Math.min(prev + 0.25, 5))
              }}
              className="hover:text-orange-400 transition-colors text-xl px-2"
            >
              +
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel(1)
                setZoomPosition({ x: 0, y: 0 })
              }}
              className="ml-2 text-sm hover:text-orange-400 transition-colors border-l pl-3 border-gray-600"
            >
              Reset
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-sm px-4 py-2 rounded-full">
            Scroll to zoom • {zoomLevel > 1 ? 'Drag to pan' : 'Click to close'} • ESC to exit
          </div>
        </div>
      )}

      <div className="max-w-7xl w-full space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <a
            href="https://pic-forge.com"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            aria-label="PicForge Home"
          >
            <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] relative">
              <Image
                src="/logo.svg"
                alt="PicForge Logo"
                width={60}
                height={60}
                className="animate-pulse pointer-events-none"
                draggable={false}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                PicForge
              </h1>
              <p className="text-gray-600 text-[10px] sm:text-xs">Forge your images into art</p>
            </div>
          </a>
          {currentImage && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </button>
          )}
        </div>

        {!currentImage ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload-input"
              />
              <button
                type="button"
                onClick={() => document.getElementById('image-upload-input')?.click()}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg cursor-pointer hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C10 6 8 8 8 12c0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-2-6-4-10zm0 14c-1.1 0-2-.9-2-2 0-2 1-3 2-5 1 2 2 3 2 5 0 1.1-.9 2-2 2zm7.5-2c0 3.59-2.91 6.5-6.5 6.5S6.5 17.59 6.5 14c0-1.5.5-2.89 1.34-4 .29-.39.85-.47 1.24-.18.39.29.47.85.18 1.24C8.67 11.89 8.5 12.93 8.5 14c0 2.49 2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5c0-1.5-.5-2.89-1.34-4-.29-.39-.26-.95.13-1.24.39-.29.95-.26 1.24.13.84 1.11 1.34 2.5 1.34 4.11z"/>
                  </svg>
                  <span className="text-sm sm:text-base">Start Forging Your Images</span>
                </div>
              </button>
              <p className="text-gray-500 text-xs sm:text-sm">Upload an image to forge something new</p>
            </div>

            {/* AI Canvas Design Section */}
            <div className="w-full max-w-md border-t border-gray-200 pt-4">
              <div className="text-center mb-3">
                <h2 className="text-base font-semibold text-gray-800">AI Canvas Generator</h2>
                <p className="text-xs text-gray-600">Free AI image generation</p>
              </div>

              {!showAICanvas ? (
                <button
                  onClick={() => setShowAICanvas(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-sm font-medium">Create AI Canvas</span>
                </button>
              ) : (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <textarea
                    value={canvasPrompt}
                    onChange={(e) => setCanvasPrompt(e.target.value)}
                    placeholder="Describe your image (e.g., 'sunset beach')"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                    rows={2}
                    disabled={isGeneratingCanvas}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={generateCanvas}
                      disabled={isGeneratingCanvas || !canvasPrompt.trim()}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 text-sm font-medium"
                    >
                      {isGeneratingCanvas ? 'Generating...' : 'Generate Canvas'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAICanvas(false)
                        setCanvasPrompt('')
                      }}
                      disabled={isGeneratingCanvas}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>

                  {submitMessage && (
                    <div className={`p-3 rounded-lg text-xs sm:text-sm mt-2 ${
                      submitMessage.includes('Error') || submitMessage.includes('Failed') || submitMessage.includes('error') || submitMessage.includes('⚠️')
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : submitMessage.includes('Generating')
                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {submitMessage.split('\n').map((line, idx) => (
                        <div key={idx} className={idx === 0 ? 'font-semibold' : 'mt-1'}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Left side - Main Image and Form */}
              <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
                {/* Main Image Display */}
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                {currentImage && (
                  <>
                    <Image
                      src={currentImage}
                      alt="Current image"
                      fill
                      className="object-contain cursor-zoom-in"
                      onClick={() => openZoom(currentImage)}
                    />
                    <button
                      onClick={() => openZoom(currentImage)}
                      className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
                      title="Click to zoom"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  </>
                )}
                {history.length > 0 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Edit #{history.length}
                  </div>
                )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-2 sm:space-y-3">
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter editing instructions..."
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  disabled={isSubmitting}
                />

                {/* Additional Image Upload Section */}
                <div
                  className={`border-2 border-dashed rounded-lg p-2 sm:p-3 transition-all ${
                    isDraggingAdditional
                      ? 'border-orange-500 bg-orange-50'
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
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                        onChange={handleAdditionalImageUpload}
                        style={{ display: 'none' }}
                        id="additional-image-upload"
                      />
                      <div className="py-4">
                        <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          {isDraggingAdditional ? 'Drop image here' : 'Add another image'}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">or</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById('additional-image-upload')?.click()}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Browse Files
                        </button>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3 px-2">Blend or combine images</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-50">
                          <Image
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
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 text-sm"
                  >
                    {isSubmitting ? 'Processing...' : 'Apply Edit'}
                  </button>
                </div>

                {submitMessage && (
                  <div className={`text-center p-2 rounded-lg text-sm ${
                    submitMessage.includes('Error') || submitMessage.includes('Failed')
                      ? 'bg-red-100 text-red-700'
                      : submitMessage.includes('not available')
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
              </div>

              {/* Right side - Edit History */}
              {history.length > 0 && (
                <div className="w-80 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h2 className="text-lg font-semibold">Creative Journey</h2>
                      <p className="text-xs text-gray-600">Click to restore</p>
                    </div>
                    <button
                      onClick={downloadAllImages}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      title="Download All Images"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      All ({history.length})
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[620px]">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-1 sm:p-2 hover:shadow-xl transition-all ${
                          currentImage === item.image ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                        } ${item.isOriginal ? 'bg-green-50' : 'bg-white'} relative group`}
                      >
                        <div className="relative h-20 sm:h-32 w-full rounded overflow-hidden bg-gray-50 mb-0.5 sm:mb-1">
                          {item.image && (
                            <>
                              <Image
                                src={item.image}
                                alt={`Version ${index}`}
                                fill
                                className="object-contain cursor-pointer"
                                onClick={() => restoreFromHistory(item)}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openZoom(item.image)
                                }}
                                className="absolute top-1 left-1 bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
                                title="Zoom"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </button>
                            </>
                          )}
                          {item.isOriginal && (
                            <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Original
                            </div>
                          )}
                          {currentImage === item.image && (
                            <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Current
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs truncate" title={item.prompt}>
                            {item.isOriginal ? 'Original' : item.prompt}
                          </p>
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 flex gap-1 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadSingleImage(item, index)
                              }}
                              className="p-1 bg-white bg-opacity-90 hover:bg-gray-200 rounded"
                              title="Download"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            {!item.isOriginal && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteHistoryItem(index)
                                }}
                                className="p-1 bg-white bg-opacity-90 hover:bg-red-100 rounded"
                                title="Delete"
                              >
                                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  )
}