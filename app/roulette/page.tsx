'use client'

import { useState, useEffect } from 'react'
import { Upload, Shuffle, Share2, Download, RefreshCw, Sparkles } from 'lucide-react'
import { applyClientTransform } from '@/lib/clientTransforms'
import styles from './roulette.module.css'

// Wild transformation prompts organized by category
const ROULETTE_PROMPTS = [
  // Apocalyptic
  "Turn this into a zombie apocalypse movie poster",
  "Make it look like a meteor is about to strike",
  "Transform into a post-nuclear wasteland",
  "Add alien invasion chaos",
  "Make it look like the world is ending",

  // Surreal
  "Make it look like it's melting",
  "Turn everything into candy",
  "Make it look underwater but in the sky",
  "Transform into a Salvador Dali painting",
  "Make everything float in zero gravity",

  // Movie Styles
  "Turn this into a Marvel superhero poster",
  "Make it look like a horror movie scene",
  "Transform into a romantic comedy poster",
  "Make it look like Star Wars",
  "Turn into a western movie scene",

  // Art Styles
  "Transform into Van Gogh's Starry Night style",
  "Make it look like a Renaissance painting",
  "Turn into 80s retro synthwave art",
  "Transform into Japanese anime style",
  "Make it look like Banksy street art",

  // Weird & Wacky
  "Replace everyone with rubber ducks",
  "Make everything neon and glowing",
  "Turn into a pizza universe",
  "Transform everyone into robots",
  "Make it rain tacos",

  // Nature Gone Wild
  "Add a tornado in the background",
  "Make it look like it's on fire (but safe)",
  "Transform into an ice age scene",
  "Add dinosaurs roaming around",
  "Turn into an enchanted forest",

  // Time Travel
  "Make it look like ancient Egypt",
  "Transform to the year 3000",
  "Turn into a medieval scene",
  "Make it look like the 1920s",
  "Transform into prehistoric times",

  // Fantasy
  "Add dragons flying overhead",
  "Make everyone look like wizards",
  "Transform into a fairy tale",
  "Add unicorns and rainbows",
  "Turn into a magical kingdom"
]

// Wheel segments (8 colorful sections)
const WHEEL_SEGMENTS = [
  { color: '#8b5cf6', icon: '🎨' },
  { color: '#ec4899', icon: '🔥' },
  { color: '#f59e0b', icon: '✨' },
  { color: '#10b981', icon: '🌟' },
  { color: '#3b82f6', icon: '🎭' },
  { color: '#ef4444', icon: '🎪' },
  { color: '#a855f7', icon: '🚀' },
  { color: '#f97316', icon: '🎯' }
]

interface RouletteResult {
  prompt: string
  transformedImage: string
}

export default function TransformRoulette() {
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [wheelRotation, setWheelRotation] = useState(0)
  const [result, setResult] = useState<RouletteResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
      setResult(null)
      setSelectedPrompt('')
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

  const spinWheel = () => {
    if (!uploadedImage || isSpinning || isProcessing) return

    setIsSpinning(true)
    setResult(null)

    // Play spinning sound effect
    const audio = new Audio('/sounds/spin.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})

    // Random spin amount (3-5 full rotations plus random position)
    const spins = Math.floor(Math.random() * 3) + 3
    const randomAngle = Math.random() * 360
    const totalRotation = wheelRotation + (spins * 360) + randomAngle

    setWheelRotation(totalRotation)

    // Select random prompt after spin completes
    setTimeout(() => {
      const randomPrompt = ROULETTE_PROMPTS[Math.floor(Math.random() * ROULETTE_PROMPTS.length)]
      setSelectedPrompt(randomPrompt)
      setIsSpinning(false)

      // Play selection sound
      const dingAudio = new Audio('/sounds/ding.mp3')
      dingAudio.volume = 0.5
      dingAudio.play().catch(() => {})

      // Auto-transform after selection
      transformImage(randomPrompt)
    }, 3000)
  }

  const transformImage = async (prompt: string) => {
    setIsProcessing(true)

    try {
      // First try server-side transformation
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: prompt,
          style: 'enhance'
        })
      })

      const data = await response.json()
      console.log('Transform response:', data) // Debug log

      // Check if we got a transformed image
      const transformedImage = data.generatedImage || data.processedImage

      if (transformedImage) {
        // Server-side transformation successful
        setResult({
          prompt: prompt,
          transformedImage: transformedImage
        })
      } else {
        // Fallback to client-side transformation
        console.log('Using client-side transformation as fallback')
        const clientTransformed = await applyClientTransform(uploadedImage, prompt)

        setResult({
          prompt: prompt,
          transformedImage: clientTransformed
        })
      }

      // Play success sound
      const successAudio = new Audio('/sounds/success.mp3')
      successAudio.volume = 0.4
      successAudio.play().catch(() => {})

    } catch (error) {
      console.error('Error transforming image:', error)

      // Use client-side transformation as fallback
      try {
        const clientTransformed = await applyClientTransform(uploadedImage, prompt)
        setResult({
          prompt: prompt,
          transformedImage: clientTransformed
        })
      } catch (clientError) {
        console.error('Client transform also failed:', clientError)
        setResult({
          prompt: prompt,
          transformedImage: uploadedImage
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const shareResult = async () => {
    if (!result) return

    const shareText = `🎲 Transform Roulette gave me:\n\n"${result.prompt}"\n\nTry your luck at pic-forge.com/roulette`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transform Roulette Result',
          text: shareText
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Result copied to clipboard!')
    }
  }

  const downloadResult = () => {
    if (!result) return

    const link = document.createElement('a')
    link.href = result.transformedImage
    link.download = 'transform-roulette.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shuffle className="w-8 h-8 text-purple-500" />
                Transform Roulette
              </h1>
              <p className="text-gray-600 mt-2">
                Spin the wheel of transformation chaos. Let fate decide your image&apos;s destiny!
              </p>
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
              dragActive ? 'border-4 border-purple-500' : 'border-2 border-dashed border-gray-300'
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
                  Upload Your Image
                </h2>
                <p className="text-gray-600 mb-4">
                  Then spin the wheel of transformation!
                </p>
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                  Choose Image
                </div>
              </div>
            </label>

            {/* Preview of possible transformations */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-4">Possible transformations include:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {ROULETTE_PROMPTS.slice(0, 6).map((prompt, i) => (
                  <div key={i} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs">
                    {prompt.substring(0, 30)}...
                  </div>
                ))}
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  + {ROULETTE_PROMPTS.length - 6} more!
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Spinning Wheel */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-center mb-6">
                  {isSpinning ? 'Spinning...' : selectedPrompt ? 'Your Fate:' : 'Spin the Wheel!'}
                </h2>

                {/* Wheel Container */}
                <div className={styles.wheelContainer}>
                  {/* Pointer */}
                  <div className={styles.pointer}>
                    <div className={styles.pointerTriangle}></div>
                  </div>

                  {/* Spinning Wheel */}
                  <div
                    className={styles.wheel}
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                    }}
                  >
                    {/* Add segment lines and icons */}
                    {WHEEL_SEGMENTS.map((segment, i) => (
                      <div
                        key={i}
                        className={styles.wheelSegment}
                        style={{
                          transform: `rotate(${i * 45}deg)`,
                        }}
                      >
                        <span className={styles.segmentText}>{segment.icon}</span>
                      </div>
                    ))}
                  </div>

                  {/* Center button */}
                  <button
                    onClick={spinWheel}
                    disabled={isSpinning || isProcessing}
                    className={styles.spinButton}
                  >
                    {isSpinning ? '...' : 'SPIN!'}
                  </button>
                </div>

                {/* Selected Prompt Display */}
                {selectedPrompt && !isSpinning && (
                  <div className={styles.promptDisplay}>
                    <p>&quot;{selectedPrompt}&quot;</p>
                  </div>
                )}

                {/* Status */}
                {isProcessing && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-purple-600">
                      <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      <span>Applying transformation magic...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Result Display */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-center mb-6">
                  {result ? 'Transformation Result' : 'Your Image'}
                </h2>

                {result ? (
                  <div>
                    {/* Before/After Display */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1 text-center">Before</p>
                        <img
                          src={uploadedImage}
                          alt="Original"
                          className="w-full rounded-lg shadow-md"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1 text-center">After</p>
                        <img
                          src={result.transformedImage}
                          alt="Transformed"
                          className="w-full rounded-lg shadow-md"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={spinWheel}
                        disabled={isSpinning || isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Spin Again
                      </button>
                      <button
                        onClick={shareResult}
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
                      className="w-full rounded-lg mb-6 shadow-md"
                    />
                    <button
                      onClick={spinWheel}
                      disabled={isSpinning || isProcessing}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isSpinning ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          Wheel is Spinning...
                        </>
                      ) : (
                        <>
                          <Shuffle className="w-6 h-6" />
                          SPIN THE WHEEL!
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Change Image Button */}
                <button
                  onClick={() => {
                    setUploadedImage('')
                    setResult(null)
                    setSelectedPrompt('')
                    setWheelRotation(0)
                  }}
                  className="w-full mt-3 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Upload Different Image
                </button>
              </div>
            </div>

            {/* Fun Stats */}
            {result && (
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">🎲</div>
                  <div className="text-sm text-gray-600">Randomness</div>
                  <div className="font-bold text-purple-600">100%</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm text-gray-600">Chaos Level</div>
                  <div className="font-bold text-orange-600">Maximum</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-sm text-gray-600">Fun Factor</div>
                  <div className="font-bold text-pink-600">Off the Charts</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}