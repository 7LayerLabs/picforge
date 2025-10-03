'use client'

import { useState } from 'react'

interface BatchStyleGeneratorProps {
  currentImage: string | null
  onBatchGenerated: (images: Array<{ image: string; prompt: string; style: string }>) => void
}

const BATCH_TYPES = {
  multiStyle: {
    name: 'Multi-Style Pack',
    description: '10 professional style variations',
    icon: '🎨',
    count: 10
  },
  threeD: {
    name: '3D Product Mockup',
    description: '6 different 3D render styles',
    icon: '🔮',
    count: 6
  },
  era: {
    name: 'Era Transformation',
    description: '6 time period variations',
    icon: '⏰',
    count: 6
  },
  characterConsistent: {
    name: 'Character Consistency',
    description: '5 background variations',
    icon: '👤',
    count: 5
  },
  arOverlay: {
    name: 'AR Overlay',
    description: '5 augmented reality styles',
    icon: '✨',
    count: 5
  },
  comicManga: {
    name: 'Comic/Manga',
    description: '6 illustrated art styles',
    icon: '📚',
    count: 6
  }
}

export default function BatchStyleGenerator({ currentImage, onBatchGenerated }: BatchStyleGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const handleBatchGenerate = async (batchType: string) => {
    if (!currentImage) {
      setErrorMessage('Please upload an image first')
      return
    }

    setIsGenerating(true)
    setSelectedBatch(batchType)
    setProgress(0)
    setErrorMessage('')

    try {
      // Convert current image to blob
      const response = await fetch(currentImage)
      const blob = await response.blob()
      const file = new File([blob], 'image.png', { type: 'image/png' })

      const formData = new FormData()
      formData.append('image', file)
      formData.append('batchType', batchType)

      const apiResponse = await fetch('/api/batch-styles', {
        method: 'POST',
        body: formData,
      })

      const data = await apiResponse.json()

      if (apiResponse.ok && data.success) {
        setProgress(100)
        onBatchGenerated(data.images)

        // Clear selection after a delay
        setTimeout(() => {
          setSelectedBatch(null)
          setProgress(0)
        }, 2000)
      } else {
        setErrorMessage(data.error || 'Failed to generate batch')
      }
    } catch (error) {
      console.error('Batch generation error:', error)
      setErrorMessage('Failed to generate batch. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          Batch Generator
        </h3>
        <div className="text-[10px] text-gray-500 dark:text-gray-400">
          Instant
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        {Object.entries(BATCH_TYPES).map(([key, batch]) => (
          <button
            key={key}
            onClick={() => handleBatchGenerate(key)}
            disabled={isGenerating || !currentImage}
            className={`w-full p-2 rounded-lg border transition-all duration-200 text-left ${
              selectedBatch === key
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-gray-600 bg-white dark:bg-gray-700'
            } ${
              !currentImage
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            } ${isGenerating && selectedBatch !== key ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2">
              <div className="text-xl flex-shrink-0">{batch.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                  {batch.name}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">
                  {batch.count} variations
                </div>
              </div>
            </div>

            {selectedBatch === key && isGenerating && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-center text-gray-600 dark:text-gray-400 mt-1">
                  Generating...
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {!currentImage && (
        <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          Upload image first
        </div>
      )}
    </div>
  )
}
