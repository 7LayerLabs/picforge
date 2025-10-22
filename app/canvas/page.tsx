'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Wand2, Palette, ArrowLeft } from 'lucide-react'
import ReferralCTA from '@/components/ReferralCTA'

function CanvasContent() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt) {
      setPrompt(urlPrompt)
    }
  }, [searchParams])

  // Show referral modal 2 seconds after successful generation
  useEffect(() => {
    if (generatedImage) {
      const timer = setTimeout(() => {
        setShowReferralModal(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [generatedImage])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      // Using Pollinations AI - 100% free, no API key needed
      const response = await fetch('/api/generate-canvas-pollinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()
      const success = !!data.image;

      // Track canvas generation in GA
      import('@/lib/analytics').then(({ trackCanvasGeneration }) => {
        trackCanvasGeneration(
          prompt,
          '1024x1024',
          'standard',
          success
        );
      });

      if (data.image) {
        setGeneratedImage(data.image)
      } else if (data.error) {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Generation failed:', error)

      // Track failed generation
      import('@/lib/analytics').then(({ trackCanvasGeneration }) => {
        trackCanvasGeneration(
          prompt,
          '1024x1024',
          'standard',
          false
        );
      });
    } finally {
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    "Serene mountain landscape at golden hour with misty valleys",
    "Modern minimalist studio with white backdrop and soft lighting",
    "Cyberpunk neon city street at night with rain reflections",
    "Cozy coffee shop interior with warm ambient lighting",
    "Abstract gradient background in purple and orange tones",
    "Professional product photography white background with shadows"
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 font-medium hover:bg-blue-50 rounded-xl transition-all duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">AI Image Generation</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-purple-600 bg-clip-text text-transparent">Dream It. Type It. Get It.</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-bold">
            No photo? No problem. Describe literally anything and watch AI conjure it into existence. Backgrounds, scenes, whatever weird stuff you&apos;re thinking.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Any Background. Any Scene.</h3>
            <p className="text-sm text-gray-600">Cyberpunk alleys. Mountain sunsets. Whatever you need.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Zero Limits</h3>
            <p className="text-sm text-gray-600">If you can type it, AI can create it. Get weird with it.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">No waiting. No BS. Just pure creation speed.</p>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="mb-6">
            <label className="block font-heading text-lg font-semibold text-gray-900 mb-3">
              Describe Your Image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene mountain landscape at golden hour with misty valleys and dramatic clouds..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all min-h-[120px] resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>

          {/* Example Prompts */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-teal-300 rounded-lg transition-all text-sm text-gray-700 hover:text-purple-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Image Display */}
        {generatedImage && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Your Generated Image</h3>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  // Track download
                  import('@/lib/analytics').then(({ trackDownload }) => {
                    trackDownload('canvas');
                  });

                  const link = document.createElement('a')
                  link.href = generatedImage
                  link.download = `ai-generated-${Date.now()}.png`
                  link.click()
                }}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all">
                Download
              </button>
              <Link
                href="/"
                className="flex-1 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all text-center"
              >
                Use in Editor
              </Link>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16 bg-teal-600 rounded-3xl p-8 text-white">
          <h2 className="font-heading text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-heading text-xl font-semibold mb-2">Describe</h3>
              <p className="text-purple-100">Write a detailed description of the image you want to create</p>
            </div>
            <div>
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-heading text-xl font-semibold mb-2">Generate</h3>
              <p className="text-purple-100">Our AI brings your vision to life in seconds</p>
            </div>
            <div>
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-heading text-xl font-semibold mb-2">Use</h3>
              <p className="text-purple-100">Download or add your photos to the generated background</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Modal - Shows 2 seconds after generation */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <ReferralCTA variant="modal" showStats={true} />
            <button
              onClick={() => setShowReferralModal(false)}
              className="mt-4 w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CanvasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Canvas...</p>
        </div>
      </div>
    }>
      <CanvasContent />
    </Suspense>
  )
}
