'use client'

import { useState, useRef, useEffect, TouchEvent, MouseEvent } from 'react'
import Image from 'next/image'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
  onExport?: () => void
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
  onExport
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleStart = () => {
    setIsDragging(true)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchend', handleEnd)
      return () => {
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging])

  // Auto-play animation
  useEffect(() => {
    if (isAutoPlaying) {
      let position = sliderPosition
      let direction = 1

      autoPlayRef.current = setInterval(() => {
        position += direction * 2
        if (position >= 100) {
          position = 100
          direction = -1
        } else if (position <= 0) {
          position = 0
          direction = 1
        }
        setSliderPosition(position)
      }, 30)

      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, sliderPosition])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return

      if (e.key === 'ArrowLeft') {
        setSliderPosition(prev => Math.max(0, prev - 5))
      } else if (e.key === 'ArrowRight') {
        setSliderPosition(prev => Math.min(100, prev + 5))
      }
    }

    if (isHovering) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isHovering])

  const quickJump = (position: number) => {
    setSliderPosition(position)
    setIsAutoPlaying(false)
  }

  const exportAsImage = async () => {
    setIsExporting(true)
    try {
      // Create a canvas to combine the images
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Load both images
      const beforeImg = new window.Image()
      const afterImg = new window.Image()

      beforeImg.crossOrigin = 'anonymous'
      afterImg.crossOrigin = 'anonymous'

      await new Promise((resolve) => {
        let loadedCount = 0
        const checkLoaded = () => {
          loadedCount++
          if (loadedCount === 2) resolve(true)
        }

        beforeImg.onload = checkLoaded
        afterImg.onload = checkLoaded

        beforeImg.src = beforeImage
        afterImg.src = afterImage
      })

      // Set canvas size
      canvas.width = beforeImg.width
      canvas.height = beforeImg.height

      // Draw split image
      const splitX = (canvas.width * sliderPosition) / 100

      // Draw after image (right side)
      ctx.drawImage(afterImg, 0, 0)

      // Draw before image (left side)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, splitX, canvas.height)
      ctx.clip()
      ctx.drawImage(beforeImg, 0, 0)
      ctx.restore()

      // Draw slider line
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(splitX, 0)
      ctx.lineTo(splitX, canvas.height)
      ctx.stroke()

      // Draw labels
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px Inter, system-ui, sans-serif'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Before label
      ctx.textAlign = 'left'
      ctx.fillText(beforeLabel, 20, 40)

      // After label
      ctx.textAlign = 'right'
      ctx.fillText(afterLabel, canvas.width - 20, 40)

      // Add watermark
      ctx.textAlign = 'right'
      ctx.font = 'bold 20px Inter, system-ui, sans-serif'
      ctx.fillText('pic-forge.com ✨', canvas.width - 20, canvas.height - 20)

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `before-after-${Date.now()}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
      })

      if (onExport) onExport()
    } catch (error) {
      console.error('Error exporting slider:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Quick Jump Buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => quickJump(0)}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          Original
        </button>
        <button
          onClick={() => quickJump(25)}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          25%
        </button>
        <button
          onClick={() => quickJump(50)}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          50%
        </button>
        <button
          onClick={() => quickJump(75)}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          75%
        </button>
        <button
          onClick={() => quickJump(100)}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          Edited
        </button>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium ${
            isAutoPlaying
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {isAutoPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-square overflow-hidden rounded-xl cursor-ew-resize select-none shadow-2xl"
        onMouseDown={handleStart}
        onMouseMove={handleMouseMove}
        onTouchStart={handleStart}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-contain"
            draggable={false}
          />
        </div>

        {/* Before Image (Foreground with clip) */}
        <div
          className="absolute inset-0 transition-all duration-100"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-contain"
            draggable={false}
          />
        </div>

        {/* Slider Line with Gradient */}
        <div
          className="absolute top-0 bottom-0 w-1 pointer-events-none transition-all duration-100"
          style={{
            left: `${sliderPosition}%`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8))',
            boxShadow: '0 0 20px rgba(255,255,255,0.8), -2px 0 10px rgba(0,0,0,0.3), 2px 0 10px rgba(0,0,0,0.3)'
          }}
        >
          {/* Slider Handle - Improved Design */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 w-14 h-14 bg-white/30 rounded-full blur-xl animate-pulse" />
              {/* Main handle */}
              <div className="relative w-14 h-14 bg-white rounded-full shadow-2xl border-2 border-gray-100 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Percentage Indicator */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
            {Math.round(sliderPosition)}%
          </div>
        </div>

        {/* Enhanced Labels */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white text-sm font-bold rounded-lg backdrop-blur-sm shadow-lg">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-orange-600/80 to-orange-700/80 text-white text-sm font-bold rounded-lg backdrop-blur-sm shadow-lg">
          {afterLabel}
        </div>

        {/* Instructions (show when hovering) */}
        {isHovering && !isDragging && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-sm transition-opacity duration-300">
            Drag or use ← → arrow keys
          </div>
        )}
      </div>

      {/* Export Button */}
      <button
        onClick={exportAsImage}
        disabled={isExporting}
        className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Export Before/After
          </>
        )}
      </button>

      {/* Instructions */}
      <p className="text-xs text-gray-500 text-center mt-2">
        🎯 Click positions or drag slider • ⌨️ Use arrow keys • 🎬 Hit Play for auto-animation
      </p>
    </div>
  )
}