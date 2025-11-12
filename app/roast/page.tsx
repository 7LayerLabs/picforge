'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Upload, Flame, Share2, X as XIcon } from 'lucide-react'
import { logger } from '@/lib/logger'
// Removed BeforeAfterSlider - just show single image

interface ImageContext {
  type: string
  subject: string
  setting: string
  mood: string
  colors: string[]
  lighting: string
  style: string
  quality: string
  roastableElements: string[]
}

interface RoastResult {
  roastText: string
  roastText2?: string // Second roast for double damage
  transformPrompt: string
  transformedImage: string
  imageContext?: ImageContext
}

// Fun loading messages that rotate while preparing the roast
const loadingMessages = [
  "Last chance to cancel before you get roasted...",
  "AI is analyzing your mistakes...",
  "Preparing to violate your feelings...",
  "Loading savage mode...",
  "Consulting the roast archives...",
  "Warming up the AI flame thrower...",
  "This is gonna hurt...",
  "Sharpening the digital knives...",
  "No mercy protocol activated...",
  "Your ego is about to take damage..."
]

export default function RoastMode() {
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
  const [roastIntensity, setRoastIntensity] = useState<'mild' | 'spicy' | 'nuclear'>('spicy')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])

  // Rotate loading messages while processing (RANDOM ORDER for more fun)
  useEffect(() => {
    if (isProcessing) {
      // Start with a random message
      const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      setLoadingMessage(randomMessage)

      const messageInterval = setInterval(() => {
        // Pick a random message each time
        const newMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
        setLoadingMessage(newMessage)
      }, 1500) // Change message every 1.5 seconds

      return () => clearInterval(messageInterval)
    }
  }, [isProcessing])

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
      logger.error('Error generating roast:', error)
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

    const shareText = `🔥 PIC-FORGE.com Roasted my photo:\n\n"${roastResult.roastText}"\n\nTry it yourself at pic-forge.com/roast`
    const url = encodeURIComponent('https://pic-forge.com/roast')
    const text = encodeURIComponent(shareText)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    setShowShareModal(false)
  }

  const shareToFacebook = () => {
    if (!roastResult) return

    const url = encodeURIComponent('https://pic-forge.com/roast')
    const quote = encodeURIComponent(`🔥 PIC-FORGE.com Roasted my photo: "${roastResult.roastText}"`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank')
    setShowShareModal(false)
  }

  const downloadResult = () => {
    if (!roastResult) return

    // Create canvas with roast text overlay
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black border-b-4 border-brutal-pink">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-black uppercase text-brutal-pink mb-2 flex items-center justify-center gap-3 tracking-tight">
              <Flame className="w-8 h-8 text-brutal-pink" />
              Get Roasted
            </h1>
            <p className="text-white text-lg max-w-2xl mx-auto font-bold">
              Upload a photo. Choose your pain level. Cry or share the burns.
            </p>
          </div>

          {/* Intensity Selector */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="font-black uppercase text-brutal-pink text-sm">Roast Level:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRoastIntensity('mild')}
                className={`px-4 py-2 font-black uppercase transition-all border-4 ${
                  roastIntensity === 'mild'
                    ? 'bg-brutal-cyan text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-cyan hover:bg-brutal-cyan hover:text-black'
                }`}
              >
                🌶️ Mild
              </button>
              <button
                onClick={() => setRoastIntensity('spicy')}
                className={`px-4 py-2 font-black uppercase transition-all border-4 ${
                  roastIntensity === 'spicy'
                    ? 'bg-brutal-pink text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-pink hover:bg-brutal-pink hover:text-black'
                }`}
              >
                🌶️🌶️ Spicy
              </button>
              <button
                onClick={() => setRoastIntensity('nuclear')}
                className={`px-4 py-2 font-black uppercase transition-all border-4 ${
                  roastIntensity === 'nuclear'
                    ? 'bg-brutal-yellow text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-yellow hover:bg-brutal-yellow hover:text-black'
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
          <div
            className={`max-w-2xl mx-auto bg-black shadow-brutal-lg p-12 ${
              dragActive ? 'border-4 border-brutal-pink' : 'border-4 border-brutal-cyan'
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
                <Upload className="w-16 h-16 mx-auto text-brutal-pink mb-4" />
                <h2 className="text-2xl font-black uppercase text-brutal-pink mb-2 tracking-tight">
                  Drop Your Photo Here
                </h2>
                <p className="text-white mb-4 font-bold">
                  (If you dare...)
                </p>
                <div className="inline-block px-6 py-3 bg-brutal-pink text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow hover:text-black transition-all shadow-brutal">
                  Choose Photo to Roast
                </div>
              </div>
            </label>

            {/* Examples */}
            <div className="mt-8 pt-8 border-t-4 border-brutal-pink">
              <p className="text-sm text-brutal-pink text-center mb-4 font-black uppercase">What gets roasted:</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs text-white font-bold">
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
            <div className="bg-black border-4 border-brutal-pink shadow-brutal-lg p-6 mb-6">
              <button
                onClick={generateRoast}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brutal-pink text-black border-4 border-black font-black text-lg uppercase hover:bg-brutal-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-brutal tracking-tight"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                    <span className="animate-pulse">{loadingMessage}</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-6 h-6" />
                    ROAST THIS PHOTO
                  </>
                )}
              </button>
            </div>

            {/* Single Roast Display - Pixxy Only */}
            {roastResult && (
              <div className="mb-6">
                {/* Pixxy Mascot - Centered */}
                <div className="flex flex-col items-center mb-4 animate-slide-in-left">
                  <Image
                    src="/mascots/pixxy.png"
                    alt="Pixxy"
                    width={128}
                    height={128}
                    className="mb-2"
                    priority
                  />
                  <p className="text-sm font-black text-brutal-yellow uppercase">Pixxy</p>
                </div>

                {/* Warning box - appears after mascot */}
                <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-black text-white shadow-brutal-lg p-6 relative overflow-hidden border-4 border-brutal-yellow">
                    {/* Yellow warning stripes on top */}
                    <div className="absolute top-0 left-0 right-0 h-3 opacity-70"
                         style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFC700, #FFC700 10px, #000 10px, #000 20px)' }} />
                    <div className="relative mt-2">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl mt-1 flex-shrink-0">⚠️</span>
                        <div className="flex-1">
                          <p className="text-base font-bold leading-relaxed">
                            {displayedText}
                            {isTyping && <span className="animate-pulse">|</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Display - Smaller */}
            <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-6">
              <div className="max-w-md mx-auto">
                <img
                  src={uploadedImage}
                  alt="Photo to roast"
                  className="w-full border-4 border-brutal-cyan shadow-brutal"
                />
              </div>

              {/* Action Buttons */}
              {roastResult && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 px-4 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink transition-all flex items-center justify-center gap-2 shadow-brutal"
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
                    className="flex-1 px-4 py-3 bg-brutal-pink text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal"
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
                  className="w-full mt-3 px-4 py-2 text-white hover:text-brutal-cyan transition-colors font-black uppercase"
                >
                  Upload Different Photo
                </button>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mt-12 p-4 bg-brutal-yellow border-4 border-black shadow-brutal">
          <p className="text-sm text-black text-center font-bold">
            <strong className="font-black uppercase">Disclaimer:</strong> AI Roast Mode is meant for fun and entertainment.
            Roasts are randomly generated and not meant to be taken seriously.
            If you&apos;re easily offended, maybe stick to the regular filters!
          </p>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && roastResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border-4 border-brutal-pink shadow-brutal-lg max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-brutal-pink hover:text-brutal-cyan border-4 border-brutal-pink p-2"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black uppercase text-brutal-pink mb-4 tracking-tight">Share Your Roast</h2>
            <p className="text-white mb-6 font-bold">
              Share this hilarious roast with your friends!
            </p>

            {/* Share Buttons */}
            <div className="space-y-3">
              <button
                onClick={shareToX}
                className="w-full bg-brutal-cyan text-black py-4 border-4 border-black font-black text-lg uppercase hover:bg-brutal-yellow transition-all flex items-center justify-center gap-3 shadow-brutal"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full bg-brutal-pink text-black py-4 border-4 border-black font-black text-lg uppercase hover:bg-brutal-yellow transition-all flex items-center justify-center gap-3 shadow-brutal"
              >
                <span className="text-2xl">📘</span>
                Share on Facebook
              </button>
            </div>

            <div className="mt-6 pt-6 border-t-4 border-brutal-pink">
              <p className="text-sm text-white text-center font-bold">
                Both options will open in a new window with the roast pre-filled
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}