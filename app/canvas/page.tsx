'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Wand2, Palette, ArrowLeft } from 'lucide-react'
import { useImageTracking } from '@/hooks/useImageTracking'
import { addWatermarkIfFree } from '@/lib/watermark'
import { logger } from '@/lib/logger'

function CanvasContent() {
  const searchParams = useSearchParams()
  const { usage } = useImageTracking()
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
      logger.error('Generation failed:', error)

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
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/forge"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-teal-600 font-medium hover:bg-blue-50 rounded-lg transition-all duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to The Forge
        </Link>

        {/* Hero Section - Compressed */}
        <div className="text-center mb-6">
          <h1 className="font-heading text-5xl md:text-6xl font-black text-black mb-3 tracking-tight uppercase border-b-4 border-brutal-cyan inline-block pb-2">
            AI Canvas
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto font-bold">
            <span className="text-brutal-pink">Dream it.</span> <span className="text-brutal-cyan">Type it.</span> <span className="bg-brutal-yellow px-2">Get it.</span>
          </p>
        </div>

        {/* Main Canvas Area - Priority positioning */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <div className="mb-4">
            <label className="block font-heading text-xl font-black text-gray-900 mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              Describe Your Image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene mountain landscape at golden hour with misty valleys and dramatic clouds..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all min-h-[100px] resize-none font-medium"
              style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full px-8 py-4 bg-brutal-cyan text-black font-black uppercase border-4 border-black hover:bg-brutal-pink hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-wide shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate
              </>
            )}
          </button>

          {/* Example Prompts */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Need inspiration? Steal these:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-2.5 bg-gray-50 hover:bg-purple-50 border border-gray-300 hover:border-purple-400 rounded-lg transition-all text-xs text-gray-700 hover:text-purple-700 font-medium"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works - Below generation area */}
        <div className="bg-black rounded-lg p-4 mb-6 text-white border-t-4 border-orange-500" style={{ boxShadow: '0 3px 8px rgba(0, 0, 0, 0.3)' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">1</div>
              <h3 className="font-heading text-sm font-bold mb-0.5 tracking-tight">Describe</h3>
            </div>
            <div>
              <div className="text-2xl mb-1">2</div>
              <h3 className="font-heading text-sm font-bold mb-0.5 tracking-tight">Generate</h3>
            </div>
            <div>
              <div className="text-2xl mb-1">3</div>
              <h3 className="font-heading text-sm font-bold mb-0.5 tracking-tight">Download</h3>
            </div>
          </div>
        </div>

        {/* Generated Image Display */}
        {generatedImage && (
          <div className="bg-white rounded-2xl shadow-lg p-6" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 className="font-heading text-xl font-black text-gray-900 mb-3 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Your Generated Image</h3>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={async () => {
                  if (!generatedImage) return;

                  // Track download
                  import('@/lib/analytics').then(({ trackDownload }) => {
                    trackDownload('canvas');
                  });

                  // Apply watermark if user is on free tier
                  const finalImageData = await addWatermarkIfFree(generatedImage, usage?.tier);

                  const link = document.createElement('a')
                  link.href = finalImageData
                  link.download = `ai-generated-${Date.now()}.png`
                  link.click()
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-all tracking-wide"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                Download
              </button>
              <Link
                href="/"
                className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all text-center tracking-wide"
                style={{ boxShadow: '0 3px 8px rgba(124, 58, 237, 0.3)' }}
              >
                Use in Editor
              </Link>
            </div>
          </div>
        )}

      </div>
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
