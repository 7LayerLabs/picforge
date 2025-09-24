'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  originalImageUrl?: string
}

export default function ShareModal({ isOpen, onClose, imageUrl, originalImageUrl }: ShareModalProps) {
  const [caption, setCaption] = useState('')
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)
  const [watermarkedImage, setWatermarkedImage] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<'twitter' | 'instagram' | 'tiktok'>('twitter')
  const [showCopiedToast, setShowCopiedToast] = useState(false)

  useEffect(() => {
    if (isOpen && imageUrl) {
      addWatermark()
      generateCaption(selectedPlatform)
    }
  }, [isOpen, imageUrl, selectedPlatform])

  const addWatermark = async () => {
    try {
      const img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      img.src = imageUrl

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height

        // Draw the image
        ctx.drawImage(img, 0, 0)

        // Add semi-transparent overlay at bottom
        const overlayHeight = 60
        const gradient = ctx.createLinearGradient(0, canvas.height - overlayHeight, 0, canvas.height)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight)

        // Add watermark text
        ctx.fillStyle = 'white'
        ctx.font = 'bold 24px Inter, system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Add logo/text
        ctx.fillText('pic-forge.com ✨', canvas.width - 20, canvas.height - 15)

        setWatermarkedImage(canvas.toDataURL('image/png'))
      }
    } catch (error) {
      console.error('Error adding watermark:', error)
      setWatermarkedImage(imageUrl)
    }
  }

  const generateCaption = async (platform: string) => {
    setIsGeneratingCaption(true)
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageUrl,
          platform
        })
      })

      if (response.ok) {
        const { caption } = await response.json()
        setCaption(caption)
      }
    } catch (error) {
      console.error('Error generating caption:', error)
      setCaption('Check out my creation! ✨ Made with pic-forge.com')
    } finally {
      setIsGeneratingCaption(false)
    }
  }

  const trackShare = async (platform: string) => {
    try {
      await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      })
    } catch (error) {
      console.error('Error tracking share:', error)
    }
  }

  const shareToTwitter = () => {
    trackShare('twitter')

    // Download the watermarked image with a recognizable name
    const link = document.createElement('a')
    link.href = watermarkedImage || imageUrl
    const timestamp = new Date().getTime()
    link.download = `pic-forge-share-${timestamp}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show instructions
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 5000)

    // Open Twitter with the caption pre-filled
    setTimeout(() => {
      const text = encodeURIComponent(caption)
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    }, 800)
  }

  const copyForInstagram = () => {
    trackShare('instagram')
    navigator.clipboard.writeText(caption)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 3000)

    // Download watermarked image
    downloadImage()
  }

  const copyForTikTok = () => {
    trackShare('tiktok')
    navigator.clipboard.writeText(caption)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 3000)

    // Download watermarked image
    downloadImage()
  }

  const downloadImage = () => {
    trackShare('download')
    const link = document.createElement('a')
    link.href = watermarkedImage || imageUrl
    link.download = `picforge-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Share Your Creation 🚀</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                {watermarkedImage && (
                  <Image
                    src={watermarkedImage}
                    alt="Share preview"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Preview with watermark</p>
            </div>

            {/* Sharing Options */}
            <div className="space-y-4">
              {/* Platform Tabs */}
              <div className="flex gap-2 border-b">
                {(['twitter', 'instagram', 'tiktok'] as const).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      setSelectedPlatform(platform)
                      generateCaption(platform)
                    }}
                    className={`px-4 py-2 font-medium capitalize transition-colors ${
                      selectedPlatform === platform
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {platform === 'twitter' ? 'X/Twitter' : platform}
                  </button>
                ))}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  AI-Generated Caption
                  {isGeneratingCaption && (
                    <span className="ml-2 text-orange-600">✨ Generating...</span>
                  )}
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your caption will appear here..."
                />
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                {selectedPlatform === 'twitter' && (
                  <div className="space-y-3">
                    <button
                      onClick={shareToTwitter}
                      className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Share on X/Twitter
                    </button>
                    <p className="text-sm text-gray-500 text-center">
                      Image downloads • X opens with caption • Click 📷 to add image
                    </p>
                  </div>
                )}

                {selectedPlatform === 'instagram' && (
                  <div className="space-y-3">
                    <button
                      onClick={copyForInstagram}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Copy Caption & Download Image
                    </button>
                    <p className="text-sm text-gray-500 text-center">
                      Caption copied! Now open Instagram and paste when posting
                    </p>
                  </div>
                )}

                {selectedPlatform === 'tiktok' && (
                  <div className="space-y-3">
                    <button
                      onClick={copyForTikTok}
                      className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Copy Caption & Download Video/Image
                    </button>
                    <p className="text-sm text-gray-500 text-center">
                      Caption copied! Open TikTok and paste when posting
                    </p>
                  </div>
                )}

                {/* Download without sharing */}
                <button
                  onClick={downloadImage}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Just Download (with watermark)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showCopiedToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg max-w-md text-center">
          <div className="font-semibold mb-1">✅ Image downloaded!</div>
          <div className="text-sm">
            Click the 📷 button on X to attach your pic-forge-share image
          </div>
        </div>
      )}
    </div>
  )
}