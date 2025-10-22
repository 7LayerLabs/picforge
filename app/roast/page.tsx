'use client'

import { useState, useEffect } from 'react'
import { Upload, Flame, Share2, X as XIcon } from 'lucide-react'
// Removed BeforeAfterSlider - just show single image

interface RoastResult {
  roastText: string
  transformPrompt: string
  transformedImage: string
}

export default function RoastMode() {
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
  const [roastIntensity, setRoastIntensity] = useState<'mild' | 'spicy' | 'nuclear'>('spicy')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Typewriter effect for roast text
  useEffect(() => {
    if (roastResult && roastResult.roastText) {
      setIsTyping(true)
      setDisplayedText('')
      const text = roastResult.roastText
      let currentIndex = 0

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
        }
      }, 30)

      return () => clearInterval(typeInterval)
    }
  }, [roastResult])

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
      setRoastResult(null)
      setDisplayedText('')
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

  const generateRoast = async () => {
    if (!uploadedImage) return

    setIsProcessing(true)
    setRoastResult(null)
    setDisplayedText('')

    try {
      // Prepare the roast prompt based on intensity with better context instructions
      const intensityPrompts = {
        mild: "First, carefully analyze what's in this photo (is it a person, pet, food, object, etc.). Then give a gentle, playful 2-sentence roast that's SPECIFIC to what you see in the image. Be funny but very light-hearted. Make sure your roast directly references what's actually visible in the photo.",
        spicy: "First, carefully analyze what's in this photo (is it a person, pet, food, object, etc.). Then give a witty, sarcastic 2-sentence roast that's SPECIFIC to what you see in the image. Be clever and funny but not mean. Reference the actual content of the photo in your roast.",
        nuclear: "First, carefully analyze what's in this photo (is it a person, pet, food, object, etc.). Then give a savage (but still playful) 2-sentence roast that's SPECIFIC to what you see in the image. Go hard but keep it funny, not hurtful. Your roast must directly relate to the actual visible content."
      }

      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          intensity: roastIntensity,
          prompt: intensityPrompts[roastIntensity]
        })
      })

      if (!response.ok) throw new Error('Roast generation failed')

      const data = await response.json()
      setRoastResult(data)
    } catch (error) {
      console.error('Error generating roast:', error)
      setRoastResult({
        roastText: "Even AI couldn't find anything interesting to say about this photo. That's the real roast.",
        transformPrompt: "make it interesting",
        transformedImage: uploadedImage
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const shareToX = () => {
    if (!roastResult) return

    const shareText = `🔥 AI Roasted my photo:\n\n"${roastResult.roastText}"\n\nTry it yourself at pic-forge.com/roast`
    const url = encodeURIComponent('https://pic-forge.com/roast')
    const text = encodeURIComponent(shareText)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    setShowShareModal(false)
  }

  const shareToFacebook = () => {
    if (!roastResult) return

    const url = encodeURIComponent('https://pic-forge.com/roast')
    const quote = encodeURIComponent(`🔥 AI Roasted my photo: "${roastResult.roastText}"`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank')
    setShowShareModal(false)
  }

  const downloadResult = () => {
    if (!roastResult) return

    // Create canvas with roast text overlay
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height + 150 // Extra space for roast text

      if (ctx) {
        // Draw transformed image
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        // Add roast text overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, img.height, canvas.width, 150)

        ctx.fillStyle = '#fff'
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Wrap text
        const words = roastResult.roastText.split(' ')
        let line = ''
        let y = img.height + 50
        const lineHeight = 35

        words.forEach(word => {
          const testLine = line + word + ' '
          const metrics = ctx.measureText(testLine)
          if (metrics.width > canvas.width - 40 && line) {
            ctx.fillText(line, canvas.width / 2, y)
            line = word + ' '
            y += lineHeight
          } else {
            line = testLine
          }
        })
        ctx.fillText(line, canvas.width / 2, y)

        // Add watermark
        ctx.fillStyle = '#ff6b00'
        ctx.font = 'bold 16px sans-serif'
        ctx.fillText('🔥 pic-forge.com/roast', canvas.width / 2, img.height + 120)

        // Download
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'roasted-photo.png'
            a.click()
          }
        })
      }
    }

    img.src = roastResult.transformedImage
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Flame className="w-8 h-8 text-teal-500" />
              AI Roast Mode
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload a photo. Get roasted. Laugh (or cry). Share the burns.
            </p>
          </div>

          {/* Intensity Selector */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="font-medium text-gray-700 text-sm">Roast Level:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRoastIntensity('mild')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roastIntensity === 'mild'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                🌶️ Mild
              </button>
              <button
                onClick={() => setRoastIntensity('spicy')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roastIntensity === 'spicy'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                🌶️🌶️ Spicy
              </button>
              <button
                onClick={() => setRoastIntensity('nuclear')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roastIntensity === 'nuclear'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                🌶️🌶️🌶️ Nuclear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!uploadedImage ? (
          /* Upload Area */
          <div
            className={`max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 ${
              dragActive ? 'border-4 border-teal-500' : 'border-2 border-dashed border-gray-300'
            }`}
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
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Drop Your Photo Here
                </h2>
                <p className="text-gray-600 mb-4">
                  (If you dare...)
                </p>
                <div className="inline-block px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all">
                  Choose Photo to Roast
                </div>
              </div>
            </label>

            {/* Examples */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-4">What gets roasted:</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-600">
                <div>📸 Selfies</div>
                <div>👥 Group Photos</div>
                <div>🍔 Food Pics</div>
                <div>🐕 Pet Photos</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Roast Button at Top */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <button
                onClick={generateRoast}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-teal-500 text-white rounded-xl font-bold text-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing the Roast...
                  </>
                ) : (
                  <>
                    <Flame className="w-6 h-6" />
                    ROAST THIS PHOTO
                  </>
                )}
              </button>
            </div>

            {/* Roast Display */}
            {roastResult && (
              <div className="bg-black text-white rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/20 animate-pulse" />
                <div className="relative">
                  <div className="flex items-start gap-3">
                    <Flame className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-lg font-medium leading-relaxed">
                        {displayedText}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Display - Smaller */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="max-w-md mx-auto">
                <img
                  src={uploadedImage}
                  alt="Photo to roast"
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              {/* Action Buttons */}
              {roastResult && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      setUploadedImage('')
                      setRoastResult(null)
                      setDisplayedText('')
                    }}
                    className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all"
                  >
                    New Photo
                  </button>
                </div>
              )}

              {!roastResult && (
                <button
                  onClick={() => {
                    setUploadedImage('')
                    setRoastResult(null)
                    setDisplayedText('')
                  }}
                  className="w-full mt-3 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Upload Different Photo
                </button>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mt-12 p-4 bg-teal-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Disclaimer:</strong> AI Roast Mode is meant for fun and entertainment.
            Roasts are randomly generated and not meant to be taken seriously.
            If you&apos;re easily offended, maybe stick to the regular filters!
          </p>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && roastResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">Share Your Roast</h2>
            <p className="text-gray-600 mb-6">
              Share this hilarious roast with your friends!
            </p>

            {/* Share Buttons */}
            <div className="space-y-3">
              <button
                onClick={shareToX}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
              >
                <span className="text-2xl">📘</span>
                Share on Facebook
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Both options will open in a new window with the roast pre-filled
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}