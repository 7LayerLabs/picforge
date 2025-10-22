'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, ArrowLeft, Wand2, Download, RefreshCw, Shield, Sparkles } from 'lucide-react'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'

export default function EditorNSFW() {
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [transformedImage, setTransformedImage] = useState<string>('')
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
      setTransformedImage('') // Clear previous result
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const transformImage = async () => {
    if (!uploadedImage || !prompt.trim()) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/process-image-nsfw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: prompt
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.error || 'Transformation failed')
      }

      if (!data.result) {
        throw new Error('No result returned from API')
      }

      setTransformedImage(data.result)
    } catch (error) {
      console.error('Error transforming image:', error)
      alert(`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!transformedImage) return

    const link = document.createElement('a')
    link.href = transformedImage
    link.download = `nsfw-edit-${Date.now()}.png`
    link.click()
  }

  const reset = () => {
    setUploadedImage('')
    setTransformedImage('')
    setPrompt('')
  }

  const examplePrompts = [
    'enhance lighting and details',
    'dramatic cinematic look',
    'add blood and gore effects',
    'horror movie aesthetic',
    'professional studio lighting',
    'dark and moody atmosphere',
    'high contrast black and white',
    'soft focus glamour shot',
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-red-900 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 font-medium hover:bg-red-900/20 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Regular Editor
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 bg-coral-500/20 border border-coral-500/30 rounded-lg">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">18+ Unrestricted Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-5xl font-bold text-white mb-4">
              <span className="text-red-400">
                Unrestricted Editor
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Adult, graphic, and gory content allowed. Photorealistic AI transformations with no restrictions.
            </p>
          </div>

          {!uploadedImage ? (
            /* Upload Area */
            <div
              className={`max-w-2xl mx-auto bg-gray-800 border-2 ${
                dragActive ? 'border-coral-500 bg-coral-500/10' : 'border-gray-700'
              } border-dashed rounded-2xl shadow-xl p-12`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Upload Your Image
                  </h2>
                  <p className="text-gray-400 mb-4">
                    Drop image here or click to browse
                  </p>
                  <div className="inline-block px-6 py-3 bg-coral-600 text-white rounded-xl font-semibold hover:bg-coral-700 transition-all">
                    Choose Image
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Prompt Input */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe your transformation
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: add dramatic lighting, horror movie aesthetic, enhance details, add gore effects..."
                  className="w-full p-4 border-2 border-gray-700 bg-gray-900 text-white rounded-xl focus:border-coral-500 focus:outline-none resize-none h-32"
                  disabled={isProcessing}
                />

                {/* Example Prompts */}
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Quick prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example) => (
                      <button
                        key={example}
                        onClick={() => setPrompt(example)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-all"
                        disabled={isProcessing}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={transformImage}
                    disabled={isProcessing || !prompt.trim()}
                    className="flex-1 px-6 py-3 bg-coral-600 text-white rounded-xl font-semibold hover:bg-coral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Transform Image
                      </>
                    )}
                  </button>

                  {transformedImage && (
                    <>
                      <button
                        onClick={downloadImage}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                      <button
                        onClick={reset}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        New Image
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Image Display */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6">
                {!transformedImage ? (
                  /* Show uploaded image only */
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">Original Image</h3>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  /* Show before/after slider */
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Before & After</h3>
                    <BeforeAfterSlider
                      beforeImage={uploadedImage}
                      afterImage={transformedImage}
                      beforeLabel="Original"
                      afterLabel="Transformed"
                    />
                  </div>
                )}

                {!transformedImage && (
                  <button
                    onClick={reset}
                    className="w-full mt-4 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Upload Different Image
                  </button>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
                <p className="text-sm text-yellow-200 text-center">
                  <strong>Note:</strong> This editor uses AI to transform images based on your prompt.
                  Results are photorealistic and may include adult, graphic, or gory content as requested.
                  All transformations are ephemeral and not stored.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
