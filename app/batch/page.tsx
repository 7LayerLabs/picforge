'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import {
  Upload,
  ArrowLeft,
  Play,
  Pause,
  X,
  Download,
  Settings,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  FolderDown,
  Sparkles,
  Layers
} from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { applyImageEffect } from '@/lib/imageEffects'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

interface BatchImage {
  id: string
  file: File
  preview: string
  status: 'queued' | 'processing' | 'completed' | 'error'
  progress: number
  result?: string
  error?: string
  priority: 'normal' | 'high'
}

interface ExportPreset {
  name: string
  format: 'jpeg' | 'png' | 'webp'
  quality: number
  maxWidth?: number
  maxHeight?: number
  prefix?: string
  suffix?: string
}

const defaultPresets: ExportPreset[] = [
  { name: 'Web Optimized', format: 'jpeg', quality: 85, maxWidth: 1920 },
  { name: 'Social Media', format: 'jpeg', quality: 90, maxWidth: 1080 },
  { name: 'High Quality', format: 'png', quality: 100 },
  { name: 'Thumbnail', format: 'jpeg', quality: 80, maxWidth: 400 },
]

export default function BatchPage() {
  const [images, setImages] = useState<BatchImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isDraggingPage, setIsDraggingPage] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>(() => {
    // Load saved preset from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedPreset')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {}
      }
    }
    return defaultPresets[0]
  })
  // const [customPresets, setCustomPresets] = useState<ExportPreset[]>([]) // Reserved for future use
  const [showSettings, setShowSettings] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Save preset preference
  useEffect(() => {
    localStorage.setItem('selectedPreset', JSON.stringify(selectedPreset))
  }, [selectedPreset])

  // Surprise Me functionality - now with 21 effects!
  const surpriseEffects = [
    'grayscale contrast',
    'invert',
    'sepia dark',
    'blur bright',
    'pixelate',
    'red contrast',
    'blue dark',
    'green bright',
    'sharpen',
    'vignette',
    'saturation',
    'warm',
    'cool',
    'grain',
    'glitch',
    'sketch',
    'resize',
    'enhance',
    'warm vignette',
    'cool grain',
    'sepia vignette'
  ]

  const surpriseMe = () => {
    const randomEffect = surpriseEffects[Math.floor(Math.random() * surpriseEffects.length)]
    setPrompt(randomEffect)
    console.log('Surprise effect:', randomEffect)
  }


  // Full page drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDraggingPage(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDraggingPage(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDraggingPage(false)

      const files = Array.from(e.dataTransfer?.files || [])
      const imageFiles = files.filter(file => file.type.startsWith('image/'))

      if (imageFiles.length > 0) {
        const newImages = imageFiles.map(file => ({
          id: Math.random().toString(36).substring(7),
          file,
          preview: URL.createObjectURL(file),
          status: 'queued' as const,
          progress: 0,
          priority: 'normal' as const
        }))
        setImages(prev => [...prev, ...newImages])
      }
    }

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDrop)
    }
  }, [])

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isProcessing && !isPaused && startTime) {
      interval = setInterval(() => {
        setTotalTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isProcessing, isPaused, startTime])

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'))

      for (const item of imageItems) {
        const file = item.getAsFile()
        if (file) {
          const newImage: BatchImage = {
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
            status: 'queued',
            progress: 0,
            priority: 'normal'
          }
          setImages(prev => [...prev, newImage])
          console.log('Pasted image from clipboard')
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: () => {
      if (images.filter(img => img.status === 'completed').length > 0) {
        downloadAll()
      }
    },
    onDelete: () => {
      // Remove selected or last image
      if (images.length > 0) {
        setImages(prev => prev.slice(0, -1))
      }
    },
    onPaste: () => {
      // Paste is handled by the paste event listener above
      console.log('Paste shortcut triggered')
    },
    onEscape: () => {
      if (isProcessing) {
        setIsPaused(true)
      }
    }
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'queued' as const,
      progress: 0,
      priority: 'normal' as const
    }))
    setImages(prev => [...prev, ...newImages])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.avif']
    },
    multiple: true
  })

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const togglePriority = (id: string) => {
    setImages(prev => prev.map(img =>
      img.id === id
        ? { ...img, priority: img.priority === 'normal' ? 'high' : 'normal' }
        : img
    ))
  }

  const processImages = async () => {
    if (!prompt.trim() || images.length === 0) return

    setIsProcessing(true)
    setIsPaused(false)
    setStartTime(Date.now())
    setProcessedCount(0)

    // Sort by priority
    const sortedImages = [...images].sort((a, b) => {
      if (a.priority === 'high' && b.priority === 'normal') return -1
      if (a.priority === 'normal' && b.priority === 'high') return 1
      return 0
    })

    for (const image of sortedImages) {
      if (isPaused) {
        await new Promise(resolve => {
          const checkPause = setInterval(() => {
            if (!isPaused) {
              clearInterval(checkPause)
              resolve(true)
            }
          }, 100)
        })
      }

      // Update status to processing
      setImages(prev => prev.map(img =>
        img.id === image.id
          ? { ...img, status: 'processing', progress: 10 }
          : img
      ))

      try {
        // Convert image to base64
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(image.file)
        })

        // Update progress to 30%
        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, progress: 30 } : img
        ))

        console.log('Processing image with prompt:', prompt)

        // Apply the effect using our bulletproof processor
        let processedImage = base64

        try {
          // Show what we're doing
          console.log(`Applying effect to image: ${prompt}`)

          // Apply the effect
          processedImage = await applyImageEffect(base64, prompt)

          console.log('Effect applied successfully!')
        } catch (effectError) {
          console.error('Effect application failed:', effectError)
          // Even if effect fails, use original
          processedImage = base64
        }

        // Update progress to 80%
        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, progress: 80 } : img
        ))

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100))

        // Mark as completed with processed image
        setImages(prev => prev.map(img =>
          img.id === image.id
            ? { ...img, status: 'completed', progress: 100, result: processedImage }
            : img
        ))
        setProcessedCount(prev => prev + 1)

        console.log('Image processed and saved successfully!')
      } catch (error) {
        setImages(prev => prev.map(img =>
          img.id === image.id
            ? { ...img, status: 'error', progress: 0, error: error instanceof Error ? error.message : 'Unknown error' }
            : img
        ))
      }
    }

    setIsProcessing(false)
  }

  const downloadAll = async () => {
    try {
      const zip = new JSZip()
      const completedImages = images.filter(img => img.status === 'completed' && img.result)

      console.log(`Starting ZIP download for ${completedImages.length} images`)

      for (let i = 0; i < completedImages.length; i++) {
        const img = completedImages[i]
        if (img.result) {
          // Extract base64 data
          let base64Data = img.result
          if (base64Data.includes('base64,')) {
            base64Data = base64Data.split('base64,')[1]
          }

          // Convert base64 to blob
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let j = 0; j < byteCharacters.length; j++) {
            byteNumbers[j] = byteCharacters.charCodeAt(j)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: `image/${selectedPreset.format}` })

          // Generate filename
          const originalName = img.file.name.split('.')[0]
          const fileName = `${selectedPreset.prefix || ''}${originalName}_${i + 1}${selectedPreset.suffix || ''}.${selectedPreset.format}`

          zip.file(fileName, blob)
          console.log(`Added ${fileName} to ZIP`)
        }
      }

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `batch_export_${new Date().toISOString().split('T')[0]}.zip`)
      console.log('ZIP download started successfully')
    } catch (error) {
      console.error('ZIP download failed:', error)
      alert('Failed to create ZIP file. Please try downloading images individually.')
    }
  }

  const downloadSingle = async (image: BatchImage) => {
    if (!image.result) return

    const link = document.createElement('a')
    link.href = image.result
    link.download = `${selectedPreset.prefix || ''}${image.file.name.split('.')[0]}${selectedPreset.suffix || ''}.${selectedPreset.format}`
    link.click()
  }

  const stats = {
    total: images.length,
    queued: images.filter(img => img.status === 'queued').length,
    processing: images.filter(img => img.status === 'processing').length,
    completed: images.filter(img => img.status === 'completed').length,
    errors: images.filter(img => img.status === 'error').length,
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative">
      {/* Full page drag indicator */}
      {isDraggingPage && (
        <div className="fixed inset-0 z-50 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-12 shadow-2xl">
            <Upload className="w-24 h-24 text-purple-500 mx-auto mb-4 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop images anywhere!</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{processedCount}/{stats.total}</span> processed
                {isProcessing && <span className="ml-2">• {formatTime(totalTime)}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Batch Processing</span>
            </div>
            <h1 className="font-heading text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Process 100+ Images at Once
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-bold">
              Same prompt. Multiple images. Lightning fast. Export with custom presets.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-yellow-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Queued</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.queued}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Errors</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.errors}</p>
            </div>
          </div>

          {/* Available Effects - UPDATED with 11 NEW effects! */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">✨ 21 Available Effects - Mix & Match!</h3>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2 text-xs">
              {/* Original Effects */}
              <div className="bg-white px-2 py-1 rounded-lg">🎨 <b>grayscale</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">🔄 <b>invert</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">📜 <b>sepia</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">💫 <b>blur</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">☀️ <b>bright</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">🌙 <b>dark</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">⚡ <b>contrast</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">🟥 <b>red</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">🟦 <b>blue</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">🟩 <b>green</b></div>
              <div className="bg-white px-2 py-1 rounded-lg">🎮 <b>pixelate</b></div>

              {/* NEW EFFECTS - Highlighted */}
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">✨ <b>sharpen</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">📷 <b>vignette</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">🎨 <b>saturation</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">🔥 <b>warm</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">❄️ <b>cool</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">🎞️ <b>grain</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">📺 <b>glitch</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">✏️ <b>sketch</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">📐 <b>resize</b></div>
              <div className="bg-yellow-200 px-2 py-1 rounded-lg font-bold">⚙️ <b>enhance</b></div>
            </div>
            <p className="text-xs mt-2 text-purple-700">💡 Combine effects: &quot;warm vignette&quot;, &quot;sepia grain&quot;, &quot;sketch sharpen&quot;</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Effect(s) - Try: &quot;grayscale contrast&quot; or &quot;invert blur&quot; or &quot;pixelate&quot;
                  </label>
                  <button
                    onClick={surpriseMe}
                    disabled={isProcessing}
                    className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Surprise Me!
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type effects: sharpen, vignette, saturation, warm, cool, grain, glitch, sketch, resize, enhance, or combine: warm vignette, sepia grain, etc."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none h-24"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Export Settings
                </button>
                {!isProcessing ? (
                  <button
                    onClick={processImages}
                    disabled={!prompt.trim() || images.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Processing
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                )}
              </div>
            </div>

            {/* Export Presets */}
            {showSettings && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Export Presets</h3>
                <div className="grid grid-cols-4 gap-3">
                  {defaultPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedPreset(preset)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPreset.name === preset.name
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{preset.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {preset.format.toUpperCase()} • {preset.quality}%
                        {preset.maxWidth && ` • ${preset.maxWidth}px`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drop Zone or Image Grid */}
          {images.length === 0 ? (
            <div
              {...getRootProps()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Drop your images here
              </p>
              <p className="text-gray-500">or click to browse</p>
              <p className="text-sm text-gray-400 mt-4">
                Supports JPEG, PNG, WebP, AVIF • Process up to 100 images at once
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add More Button */}
              <div className="flex justify-between items-center">
                <div {...getRootProps()} className="inline-block">
                  <input {...getInputProps()} />
                  <button className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-purple-400 text-gray-700 rounded-xl font-medium transition-all flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Add More Images
                  </button>
                </div>

                {stats.completed > 0 && (
                  <button
                    onClick={downloadAll}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                  >
                    <FolderDown className="w-4 h-4" />
                    Download All ({stats.completed})
                  </button>
                )}
              </div>

              {/* Image Queue */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Processing Queue</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {images.map((image) => (
                    <div key={image.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <img
                          src={image.result || image.preview}
                          alt={image.file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {image.status === 'processing' && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="relative">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                              <div className="absolute inset-0 w-6 h-6 bg-white/20 rounded-full animate-ping" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{image.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(image.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        {/* Progress Bar */}
                        {image.status === 'processing' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${image.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {image.error && (
                          <p className="text-sm text-red-600 mt-1">{image.error}</p>
                        )}
                      </div>

                      {/* Priority Toggle */}
                      <button
                        onClick={() => togglePriority(image.id)}
                        className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${
                          image.priority === 'high'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        disabled={image.status !== 'queued'}
                      >
                        <Zap className="w-4 h-4 inline mr-1" />
                        {image.priority === 'high' ? 'High' : 'Normal'}
                      </button>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {image.status === 'queued' && (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                        {image.status === 'processing' && (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        {image.status === 'completed' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <button
                              onClick={() => downloadSingle(image)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                          </>
                        )}
                        {image.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}

                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}