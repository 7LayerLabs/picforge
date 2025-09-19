'use client'

import { useState } from 'react'
import Image from 'next/image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface HistoryItem {
  prompt: string
  image: string
  timestamp: Date
  isOriginal?: boolean
}

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

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="max-w-7xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="PicForge Logo"
              width={60}
              height={60}
              className="animate-pulse"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                PicForge
              </h1>
              <p className="text-gray-600 text-xs">Forge your images into art</p>
            </div>
          </div>
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
          <div className="flex flex-col items-center space-y-4">
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
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg cursor-pointer hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C10 6 8 8 8 12c0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-2-6-4-10zm0 14c-1.1 0-2-.9-2-2 0-2 1-3 2-5 1 2 2 3 2 5 0 1.1-.9 2-2 2zm7.5-2c0 3.59-2.91 6.5-6.5 6.5S6.5 17.59 6.5 14c0-1.5.5-2.89 1.34-4 .29-.39.85-.47 1.24-.18.39.29.47.85.18 1.24C8.67 11.89 8.5 12.93 8.5 14c0 2.49 2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5c0-1.5-.5-2.89-1.34-4-.29-.39-.26-.95.13-1.24.39-.29.95-.26 1.24.13.84 1.11 1.34 2.5 1.34 4.11z"/>
                </svg>
                Start Forging Your Images
              </div>
            </button>
            <p className="text-gray-500 text-sm mt-4">Upload an image to forge something new</p>
          </div>
        ) : (
          <>
            <div className="flex gap-4">
              {/* Left side - Main Image and Form */}
              <div className="flex-1 flex flex-col space-y-3">
                {/* Main Image Display */}
                <div className="relative w-full h-[500px] border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt="Current image"
                    fill
                    className="object-contain"
                  />
                )}
                {history.length > 0 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Edit #{history.length}
                  </div>
                )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter editing instructions (e.g., 'change background to beach')..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isSubmitting}
                />

                {/* Additional Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  {!additionalImagePreview ? (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                        onChange={handleAdditionalImageUpload}
                        style={{ display: 'none' }}
                        id="additional-image-upload"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('additional-image-upload')?.click()}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Image to Incorporate (Optional)
                        </div>
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Add another image to blend or combine with your main image</p>
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
                        className={`border-2 rounded-lg p-2 hover:shadow-xl transition-all ${
                          currentImage === item.image ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                        } ${item.isOriginal ? 'bg-green-50' : 'bg-white'} relative group`}
                      >
                        <div
                          className="relative h-32 w-full rounded overflow-hidden bg-gray-50 mb-1 cursor-pointer"
                          onClick={() => restoreFromHistory(item)}
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={`Version ${index}`}
                              fill
                              className="object-contain"
                            />
                          )}
                          {item.isOriginal && (
                            <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadSingleImage(item, index)
                            }}
                            className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 p-1 bg-white bg-opacity-90 hover:bg-gray-200 rounded transition-opacity"
                            title="Download"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
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
  )
}