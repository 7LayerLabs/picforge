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
import ExportModal from '@/components/ExportModal'
import { downloadExportPack } from '@/lib/exportFormats'
import EffectTooltip from '@/components/EffectTooltip'
import PopularCombinations from '@/components/PopularCombinations'
import ReferralCTA from '@/components/ReferralCTA'
import BatchQuickStart from '@/components/BatchQuickStart'
import BatchProgressBar from '@/components/BatchProgressBar'
import EffectLibrary from '@/components/EffectLibrary'

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
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportMode, setExportMode] = useState<'single' | 'batch'>('batch')
  const [singleExportImage, setSingleExportImage] = useState<BatchImage | null>(null)
  const [currentProcessingFile, setCurrentProcessingFile] = useState<string>('')

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
  }

  const handleEffectClick = (effect: string) => {
    // Add effect to prompt, separated by space
    setPrompt(prev => {
      const trimmed = prev.trim()
      return trimmed ? `${trimmed} ${effect}` : effect
    })
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

      // Update status to processing and set current file
      setCurrentProcessingFile(image.file.name)
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

        // Apply the effect using our bulletproof processor
        let processedImage = base64

        try {
          // Apply the effect
          processedImage = await applyImageEffect(base64, prompt)
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
      } catch (error) {
        setImages(prev => prev.map(img =>
          img.id === image.id
            ? { ...img, status: 'error', progress: 0, error: error instanceof Error ? error.message : 'Unknown error' }
            : img
        ))
      }
    }

    setIsProcessing(false)
    setCurrentProcessingFile('')
  }

  const downloadAll = async () => {
    try {
      const zip = new JSZip()
      const completedImages = images.filter(img => img.status === 'completed' && img.result)

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
        }
      }

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `batch_export_${new Date().toISOString().split('T')[0]}.zip`)
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

  const openExportModal = (mode: 'single' | 'batch', image?: BatchImage) => {
    setExportMode(mode)
    if (mode === 'single' && image) {
      setSingleExportImage(image)
    }
    setShowExportModal(true)
  }

  interface ExportFormats {
    pngTransparent: boolean
    pngWhiteBg: boolean
    svg: boolean
    pdf: boolean
  }

  const handleBatchExport = async (imageData: string, format: string) => {
    try {
      const completedImages = images.filter(img => img.status === 'completed' && img.result)

      if (completedImages.length === 0) {
        alert('No completed images to export')
        return
      }

      // Create a master ZIP with all images in selected format
      const zip = new JSZip()

      for (let i = 0; i < completedImages.length; i++) {
        const img = completedImages[i]
        if (!img.result) continue

        const originalName = img.file.name.split('.')[0]

        // Export in selected format
        await addImageToZip(zip, img.result, format, `${originalName}.${format === 'jpg' ? 'jpg' : 'png'}`, format === 'jpg' ? 'jpeg' : 'png')
      }

      // Add README
      const readme = `PicForge Batch Export
========================

Total Images: ${completedImages.length}
Export Date: ${new Date().toLocaleDateString()}
Format: ${format.toUpperCase()}

Commercial Use:
- Free tier: Personal use only
- Creator/Pro tier: Full commercial license included

Need help? Visit pic-forge.com

Generated by PicForge.com
`
      zip.file('README.txt', readme)

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `picforge-batch-export-${new Date().toISOString().split('T')[0]}.zip`)

      setShowExportModal(false)
    } catch (error) {
      console.error('Batch export failed:', error)
      alert('Failed to export batch. Please try again.')
    }
  }

  const removeWhiteBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Remove white/light backgrounds (works best with solid backgrounds)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Detect white/very light backgrounds (threshold: RGB > 240)
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0 // Set alpha to 0 (fully transparent)
      }
      // Edge softening for semi-light pixels (threshold: RGB > 200)
      else if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = Math.floor(data[i + 3] * 0.5) // 50% transparent
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const addImageToZip = async (
    folder: JSZip,
    imageData: string,
    preset: string,
    filename: string,
    format: 'png' | 'jpeg',
    whiteBackground = false
  ) => {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (!ctx) return

    if (whiteBackground) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    } else {
      // For transparent PNG, draw image first then remove background
      ctx.drawImage(img, 0, 0)
      // Apply background removal to make white areas transparent
      removeWhiteBackground(ctx, canvas.width, canvas.height)
    }

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), `image/${format}`)
    })

    folder.file(filename, blob)
  }

  const addSVGToZip = async (
    folder: JSZip,
    imageData: string,
    preset: string,
    filename: string
  ) => {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${img.width}px"
  height="${img.height}px"
  viewBox="0 0 ${img.width} ${img.height}">
  <title>PicForge Design</title>
  <desc>Created with PicForge - Ready for Cricut</desc>
  <image
    x="0"
    y="0"
    width="${img.width}"
    height="${img.height}"
    xlink:href="${imageData}"
  />
</svg>`

    folder.file(filename, svgContent)
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
    <div className="min-h-screen bg-gray-50 relative">
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
                {stats.total === 0 ? (
                  <span className="font-medium">No images loaded - Drop files to get started!</span>
                ) : (
                  <span className="font-medium">{stats.total} images loaded • {stats.completed} completed</span>
                )}
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
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className="bg-teal-600 bg-clip-text text-transparent">
                Process 100+ Images at Once
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-bold">
              Same prompt. Multiple images. Lightning fast. Export with custom presets.
            </p>
          </div>

          {/* STEP 1: Upload Images - Now at the TOP! */}
          {images.length === 0 ? (
            <div
              {...getRootProps()}
              className={`border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all mb-8 ${
                isDragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="max-w-2xl mx-auto">
                <Upload className="w-20 h-20 mx-auto text-purple-500 mb-6" />
                <p className="text-3xl font-bold text-gray-900 mb-3">
                  Start by Uploading Images
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Drop your images here or click to browse
                </p>
                <div className="inline-flex items-center gap-6 text-sm text-gray-500">
                  <span>✓ JPEG, PNG, WebP, AVIF</span>
                  <span>✓ Up to 100 images</span>
                  <span>✓ Drag & drop anywhere</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Bar - Only show when processing */}
              {isProcessing && (
                <BatchProgressBar
                  total={stats.total}
                  completed={stats.completed}
                  processing={stats.processing}
                  errors={stats.errors}
                  queued={stats.queued}
                  currentFileName={currentProcessingFile}
                  isProcessing={isProcessing}
                  totalTime={totalTime}
                />
              )}

              {/* STEP 2: Choose Effects & Process */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Choose Your Effects
                  </h2>
                  <div className="text-sm font-medium text-gray-600">
                    {stats.total} images ready • {stats.completed} completed
                  </div>
                </div>

                {/* Effect Input */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Effect Combination {prompt && <span className="text-teal-600 font-bold">({prompt.split(' ').length} effects)</span>}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPrompt('')}
                        disabled={isProcessing || !prompt}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={surpriseMe}
                        disabled={isProcessing}
                        className="px-4 py-1 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Surprise Me!
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type effects here: sharpen vignette saturation, warm cool grain, etc."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none h-24 font-mono text-lg"
                    disabled={isProcessing}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isProcessing ? (
                    <>
                      <button
                        onClick={processImages}
                        disabled={!prompt.trim() || images.length === 0}
                        className="flex-1 px-8 py-4 bg-teal-600 text-white text-lg font-bold rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        <Play className="w-6 h-6" />
                        Start Processing {stats.total} Images
                      </button>
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center gap-2"
                      >
                        <Settings className="w-5 h-5" />
                        Export Settings
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="flex-1 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                      {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                      {isPaused ? 'Resume Processing' : 'Pause Processing'}
                    </button>
                  )}
                </div>

                {/* Export Presets - Collapsible */}
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

              {/* Effect Library - Now Collapsible & Below Main Action */}
              <details className="mb-8">
                <summary className="bg-purple-50 rounded-xl p-4 cursor-pointer hover:bg-purple-100 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-gray-900">Browse Effect Library</span>
                      <span className="text-sm text-gray-600">(21 effects available)</span>
                    </div>
                    <span className="text-gray-500 text-sm">Click to expand</span>
                  </div>
                </summary>
                <div className="mt-4">
                  <PopularCombinations onSelectCombination={setPrompt} />
                  <EffectLibrary onEffectClick={handleEffectClick} />
                </div>
              </details>
            </>
          )}

          {/* Image Queue - Only show when images are loaded */}
          {images.length > 0 && (
            <div className="space-y-6">
              {/* Download Actions - Show when completed */}
              {stats.completed > 0 && (
                <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {stats.completed} Images Ready to Download
                      </h3>
                      <p className="text-sm text-gray-600">
                        Download all at once or export for Cricut/Etsy
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={downloadAll}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                      >
                        <FolderDown className="w-5 h-5" />
                        Quick Download All
                      </button>
                      <button
                        onClick={() => openExportModal('batch')}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        Export for Cricut/Etsy
                      </button>
                    </div>
                  </div>
                  {/* Referral CTA - Shows after batch processing */}
                  <div className="mt-4">
                    <ReferralCTA variant="compact" showStats={false} />
                  </div>
                </div>
              )}

              {/* Image Queue */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-xl">Your Images</h3>
                  <div {...getRootProps()} className="inline-block">
                    <input {...getInputProps()} />
                    <button className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-all flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Add More Images
                    </button>
                  </div>
                </div>
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
                                className="bg-teal-600 h-2 rounded-full transition-all"
                                style={{ width: `${image.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {image.error && (
                          <p className="text-sm text-purple-600 mt-1">{image.error}</p>
                        )}
                      </div>

                      {/* Priority Toggle */}
                      <button
                        onClick={() => togglePriority(image.id)}
                        className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${
                          image.priority === 'high'
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
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
                          <Clock className="w-5 h-5 text-teal-500" />
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
                              title="Quick Download"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => openExportModal('single', image)}
                              className="p-2 hover:bg-teal-100 rounded-lg transition-all"
                              title="Export for Cricut/Etsy"
                            >
                              <Sparkles className="w-4 h-4 text-teal-600" />
                            </button>
                          </>
                        )}
                        {image.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-purple-500" />
                        )}

                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4 text-gray-600 hover:text-purple-600" />
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

      {/* Export Modal */}
      {showExportModal && (
        exportMode === 'batch' ? (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            imageData={images.find(img => img.status === 'completed')?.result || ''}
            fileName="picforge-batch"
            onBatchExport={handleBatchExport}
            batchMode={true}
          />
        ) : (
          singleExportImage?.result && (
            <ExportModal
              isOpen={showExportModal}
              onClose={() => setShowExportModal(false)}
              imageData={singleExportImage.result}
              fileName={singleExportImage.file.name.split('.')[0]}
            />
          )
        )
      )}
    </div>
  )
}