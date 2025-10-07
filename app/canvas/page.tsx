'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Wand2, Palette, ArrowLeft } from 'lucide-react'

export default function CanvasPage() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt) {
      setPrompt(urlPrompt)
    }
  }, [searchParams])

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
      if (data.image) {
        setGeneratedImage(data.image)
      } else if (data.error) {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Generation failed:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-all duration-200 mb-8"
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
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Dream It. Type It. Get It.</span>
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
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="text-left p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all text-sm text-gray-700 hover:text-purple-700"
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
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all text-center"
              >
                Use in Editor
              </Link>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
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
    </div>
  )
}
