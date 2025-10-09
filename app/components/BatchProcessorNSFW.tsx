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
  Layers,
  Shield
} from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
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

export default function BatchProcessorNSFW() {
  const [images, setImages] = useState<BatchImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isDraggingPage, setIsDraggingPage] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>(() => {
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
  const [showSettings, setShowSettings] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem('selectedPreset', JSON.stringify(selectedPreset))
  }, [selectedPreset])

  const surpriseEffects = [
    'enhance lighting and details',
    'dramatic cinematic lighting',
    'soft focus glamour',
    'high contrast black and white',
    'warm golden hour',
    'cool blue tones',
    'vintage film look',
    'professional studio lighting',
    'artistic blur background',
    'sharpen and enhance'
  ]

  const surpriseMe = () => {
    const randomEffect = surpriseEffects[Math.floor(Math.random() * surpriseEffects.length)]
    setPrompt(randomEffect)
    console.log('Surprise effect:', randomEffect)
  }

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

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isProcessing && !isPaused && startTime) {
      interval = setInterval(() => {
        setTotalTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isProcessing, isPaused, startTime])

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

  useKeyboardShortcuts({
    onSave: () => {
      if (images.filter(img => img.status === 'completed').length > 0) {
        downloadAll()
      }
    },
    onDelete: () => {
      if (images.length > 0) {
        setImages(prev => prev.slice(0, -1))
      }
    },
    onPaste: () => {
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

      setImages(prev => prev.map(img =>
        img.id === image.id
          ? { ...img, status: 'processing', progress: 10 }
          : img
      ))

      try {
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(image.file)
        })

        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, progress: 30 } : img
        ))

        console.log('Processing NSFW image with prompt:', prompt)

        // Call NSFW-specific API endpoint
        const response = await fetch('/api/process-image-nsfw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            prompt: prompt
          })
        })

        if (!response.ok) {
          throw new Error('Processing failed')
        }

        const data = await response.json()
        const processedImage = data.result || base64

        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, progress: 80 } : img
        ))

        await new Promise(resolve => setTimeout(resolve, 100))

        setImages(prev => prev.map(img =>
          img.id === image.id
            ? { ...img, status: 'completed', progress: 100, result: processedImage }
            : img
        ))
        setProcessedCount(prev => prev + 1)

        console.log('Image processed successfully!')
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
          let base64Data = img.result
          if (base64Data.includes('base64,')) {
            base64Data = base64Data.split('base64,')[1]
          }

          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let j = 0; j < byteCharacters.length; j++) {
            byteNumbers[j] = byteCharacters.charCodeAt(j)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: `image/${selectedPreset.format}` })

          const originalName = img.file.name.split('.')[0]
          const fileName = `${selectedPreset.prefix || ''}${originalName}_${i + 1}${selectedPreset.suffix || ''}.${selectedPreset.format}`

          zip.file(fileName, blob)
          console.log(`Added ${fileName} to ZIP`)
        }
      }

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `batch_nsfw_export_${new Date().toISOString().split('T')[0]}.zip`)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 relative">
      {isDraggingPage && (
        <div className="fixed inset-0 z-50 bg-coral-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-gray-800 rounded-2xl p-12 shadow-2xl border-2 border-coral-500">
            <Upload className="w-24 h-24 text-coral-500 mx-auto mb-4 animate-bounce" />
            <p className="text-2xl font-bold text-white">Drop images anywhere!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-red-900 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/batch"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 font-medium hover:bg-red-900/20 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Regular Batch
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-coral-500/20 border border-coral-500/30 rounded-lg">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">18+ Mode</span>
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{processedCount}/{stats.total}</span> processed
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500/20 border border-coral-500/30 text-red-400 rounded-full mb-4">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Adult Batch Processing</span>
            </div>
            <h1 className="font-heading text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-red-400 to-teal-400 bg-clip-text text-transparent">
                NSFW Image Processing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-bold">
              Photorealistic AI transformations. Same nano quality. No restrictions.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Queued</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.queued}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.processing}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Completed</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Errors</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.errors}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Describe your transformation
                  </label>
                  <button
                    onClick={surpriseMe}
                    disabled={isProcessing}
                    className="px-4 py-1 bg-gradient-to-r from-coral-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-coral-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Surprise Me!
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: enhance lighting and details, dramatic cinematic look, soft focus glamour, professional studio lighting..."
                  className="w-full p-3 border-2 border-gray-700 bg-gray-900 text-white rounded-xl focus:border-coral-500 focus:outline-none resize-none h-24"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-xl transition-all flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Export Settings
                </button>
                {!isProcessing ? (
                  <button
                    onClick={processImages}
                    disabled={!prompt.trim() || images.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-coral-600 to-teal-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center gap-2"
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
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="font-semibold text-white mb-3">Export Presets</h3>
                <div className="grid grid-cols-4 gap-3">
                  {defaultPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedPreset(preset)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPreset.name === preset.name
                          ? 'border-coral-500 bg-coral-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <p className="font-medium text-sm text-white">{preset.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
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
                  ? 'border-coral-500 bg-coral-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-coral-500 hover:bg-coral-500/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-xl font-semibold text-gray-300 mb-2">
                Drop your images here
              </p>
              <p className="text-gray-500">or click to browse</p>
              <p className="text-sm text-gray-600 mt-4">
                Supports JPEG, PNG, WebP, AVIF • Process up to 100 images at once
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div {...getRootProps()} className="inline-block">
                  <input {...getInputProps()} />
                  <button className="px-4 py-2 bg-gray-800 border-2 border-gray-700 hover:border-coral-500 text-gray-300 rounded-xl font-medium transition-all flex items-center gap-2">
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
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-white mb-4">Processing Queue</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {images.map((image) => (
                    <div key={image.id} className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl">
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

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{image.file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(image.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        {image.status === 'processing' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-coral-600 to-teal-600 h-2 rounded-full transition-all"
                                style={{ width: `${image.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {image.error && (
                          <p className="text-sm text-red-400 mt-1">{image.error}</p>
                        )}
                      </div>

                      <button
                        onClick={() => togglePriority(image.id)}
                        className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${
                          image.priority === 'high'
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                        disabled={image.status !== 'queued'}
                      >
                        <Zap className="w-4 h-4 inline mr-1" />
                        {image.priority === 'high' ? 'High' : 'Normal'}
                      </button>

                      <div className="flex items-center gap-2">
                        {image.status === 'queued' && (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        )}
                        {image.status === 'processing' && (
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        )}
                        {image.status === 'completed' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <button
                              onClick={() => downloadSingle(image)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                            >
                              <Download className="w-4 h-4 text-gray-400" />
                            </button>
                          </>
                        )}
                        {image.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}

                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
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
