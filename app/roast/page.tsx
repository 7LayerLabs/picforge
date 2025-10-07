'use client'

import { useState, useEffect } from 'react'
import { Upload, Flame, Share2, Download, RefreshCw, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'

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
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [dragActive, setDragActive] = useState(false)

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

          // Play typing sound
          if (soundEnabled && currentIndex % 3 === 0) {
            const audio = new Audio('/sounds/type.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {})
          }
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)

          // Play completion sound
          if (soundEnabled) {
            const audio = new Audio('/sounds/ding.mp3')
            audio.volume = 0.5
            audio.play().catch(() => {})
          }
        }
      }, 30)

      return () => clearInterval(typeInterval)
    }
  }, [roastResult, soundEnabled])

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
      // Prepare the roast prompt based on intensity
      const intensityPrompts = {
        mild: "Give a gentle, playful 2-sentence roast of this photo. Be funny but very light-hearted.",
        spicy: "Give a witty, sarcastic 2-sentence roast of this photo. Be clever and funny but not mean.",
        nuclear: "Give a savage (but still playful) 2-sentence roast of this photo. Go hard but keep it funny, not hurtful."
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

      // Play roast sound effect
      if (soundEnabled) {
        const audio = new Audio('/sounds/fire.mp3')
        audio.volume = 0.6
        audio.play().catch(() => {})
      }
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

  const shareRoast = async () => {
    if (!roastResult) return

    const shareText = `🔥 AI Roasted my photo:\n\n"${roastResult.roastText}"\n\nTry it yourself at pic-forge.com/roast`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Roasted My Photo!',
          text: shareText
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Roast copied to clipboard!')
    }
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                AI Roast Mode
              </h1>
              <p className="text-gray-600 mt-2">
                Upload a photo. Get roasted. Laugh (or cry). Share the burns.
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Intensity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-medium text-gray-700">Roast Level:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRoastIntensity('mild')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roastIntensity === 'mild'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                🌶️ Mild
              </button>
              <button
                onClick={() => setRoastIntensity('spicy')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roastIntensity === 'spicy'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                🌶️🌶️ Spicy
              </button>
              <button
                onClick={() => setRoastIntensity('nuclear')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roastIntensity === 'nuclear'
                    ? 'bg-red-500 text-white'
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
              dragActive ? 'border-4 border-orange-500' : 'border-2 border-dashed border-gray-300'
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
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                  Choose Photo to Roast
                </button>
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
          <div className="max-w-4xl mx-auto">
            {/* Roast Display */}
            {roastResult && (
              <div className="bg-black text-white rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse" />
                <div className="relative">
                  <div className="flex items-start gap-3">
                    <Flame className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
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

            {/* Image Display */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {roastResult ? (
                <div>
                  <BeforeAfterSlider
                    beforeImage={uploadedImage}
                    afterImage={roastResult.transformedImage}
                    className="rounded-lg overflow-hidden"
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={generateRoast}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Roast Again
                    </button>
                    <button
                      onClick={shareRoast}
                      className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={downloadResult}
                      className="px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full rounded-lg mb-6"
                  />
                  <button
                    onClick={generateRoast}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              )}

              {/* Change Photo Button */}
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
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mt-12 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Disclaimer:</strong> AI Roast Mode is meant for fun and entertainment.
            Roasts are randomly generated and not meant to be taken seriously.
            If you're easily offended, maybe stick to the regular filters!
          </p>
        </div>
      </div>
    </div>
  )
}