'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BeforeAfterSlider from './BeforeAfterSlider'
import { useImageTracking } from '@/hooks/useImageTracking'
import { trackSocialShare } from '@/lib/analytics'
import { logger } from '@/lib/logger'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  originalImageUrl?: string
}

type Platform = 'twitter' | 'instagram' | 'instagram-story' | 'tiktok'
type ExportSize = { width: number; height: number; name: string }

const PLATFORM_SIZES: Record<Platform, ExportSize> = {
  twitter: { width: 1200, height: 675, name: 'Twitter Post' },
  instagram: { width: 1080, height: 1080, name: 'Instagram Square' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  tiktok: { width: 1080, height: 1920, name: 'TikTok Video' },
}

export default function ShareModal({ isOpen, onClose, imageUrl, originalImageUrl }: ShareModalProps) {
  const [caption, setCaption] = useState('')
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)
  const [watermarkedImage, setWatermarkedImage] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('twitter')
  const [showCopiedToast, setShowCopiedToast] = useState(false)
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)
  const [isGeneratingGif, setIsGeneratingGif] = useState(false)
  const [shareBonus, setShareBonus] = useState(false)
  const [showShareLink, setShowShareLink] = useState(false)
  const [shareableLink, setShareableLink] = useState('')

  const { user, getRemainingImages } = useImageTracking()

  useEffect(() => {
    if (isOpen && imageUrl) {
      addWatermark()
      generateCaption(selectedPlatform)
      generateShareableLink()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, imageUrl, selectedPlatform])

  const generateShareableLink = () => {
    const baseUrl = 'https://pic-forge.com'
    const userId = user?.id || 'guest'
    const timestamp = Date.now()
    const trackingCode = `${userId.slice(0, 8)}-${timestamp}`
    const link = `${baseUrl}?ref=share-${trackingCode}`
    setShareableLink(link)
  }

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareableLink)
    setShowShareLink(true)
    setTimeout(() => setShowShareLink(false), 3000)
    trackShare('link', false)
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my PicForge creation!',
          text: 'I just transformed my photo with AI on PicForge. Nothing is real anymore.',
          url: shareableLink,
        })
        trackShare('native', !shareBonus)
      } catch (error) {
        logger.error('Error sharing:', error)
      }
    }
  }

  const addWatermark = async () => {
    try {
      const img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      img.src = imageUrl

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Get platform-specific dimensions
        const platformSize = PLATFORM_SIZES[selectedPlatform]
        const aspectRatio = platformSize.width / platformSize.height

        // Calculate target dimensions while maintaining aspect ratio
        let targetWidth = img.width
        let targetHeight = img.height
        const imgAspectRatio = img.width / img.height

        if (imgAspectRatio > aspectRatio) {
          // Image is wider than target
          targetHeight = platformSize.height
          targetWidth = targetHeight * imgAspectRatio
        } else {
          // Image is taller than target
          targetWidth = platformSize.width
          targetHeight = targetWidth / imgAspectRatio
        }

        canvas.width = platformSize.width
        canvas.height = platformSize.height

        // Center the image
        const offsetX = (platformSize.width - targetWidth) / 2
        const offsetY = (platformSize.height - targetHeight) / 2

        // Fill background with subtle gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        bgGradient.addColorStop(0, '#0F172A')
        bgGradient.addColorStop(1, '#1E293B')
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw the image centered
        ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight)

        // Add branded watermark overlay at bottom
        const overlayHeight = 80
        const gradient = ctx.createLinearGradient(0, canvas.height - overlayHeight, 0, canvas.height)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight)

        // Add "Created with @PicForge" watermark
        ctx.fillStyle = '#14B8A6' // Teal brand color
        ctx.font = 'bold 32px Inter, system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
        ctx.shadowBlur = 8
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        ctx.fillText('Created with @PicForge', canvas.width - 30, canvas.height - 20)

        // Add subtle URL below
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '18px Inter, system-ui, sans-serif'
        ctx.fillText('pic-forge.com', canvas.width - 30, canvas.height - 45)

        setWatermarkedImage(canvas.toDataURL('image/jpeg', 0.95))
      }
    } catch (error) {
      logger.error('Error adding watermark:', error)
      setWatermarkedImage(imageUrl)
    }
  }

  const generateCaption = async (platform: string) => {
    setIsGeneratingCaption(true)

    // Viral pre-filled templates with high engagement potential
    const viralTemplates: Record<string, string[]> = {
      twitter: [
        'Just transformed my photo with AI 🤯\n\nNothing is real anymore.\n\n#PicForge #AIArt',
        'POV: You discovered AI that makes your photos look insane 🔥\n\nTry it: pic-forge.com\n\n#AITransformation #PicForge',
        'Before AI vs After AI 🎨\n\nWhich version is better? 👇\n\n#PicForge #AIArt',
        'This took 30 seconds. Zero artistic talent required. 🚀\n\nCreated with @PicForge\n\n#AIImageEditor',
      ],
      instagram: [
        '✨ AI did THIS to my photo 🤯\n\nSwipe to see the before! Nothing is real anymore.\n\n#PicForge #AIArt #AITransformation #ImageEditing #AIPhotography #DigitalArt #CreativeAI #PhotoEditing',
        '🎨 From ordinary to extraordinary in seconds\n\nZero artistic talent required. Just AI magic. ✨\n\n#PicForge #AIArt #PhotoTransformation #DigitalCreativity #AIEditing #ModernArt #TechArt #PhotoMagic',
      ],
      'instagram-story': [
        '🤯 AI transformed my photo!\n\nSwipe up to try PicForge\n\n#AIArt #PicForge',
        '✨ Before vs After AI magic\n\nLink in bio to create yours!\n\n#AITransformation',
      ],
      tiktok: [
        'POV: You just discovered the most insane AI photo editor 🤯 #PicForge #AIArt #PhotoEditing #ViralAI',
        'This took 30 seconds no cap 💀 #PicForge #AITransformation #TechTok #PhotoMagic',
      ],
    }

    try {
      // Use template first, then try AI generation
      const templates = viralTemplates[platform] || viralTemplates.twitter
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
      setCaption(randomTemplate)

      // Try to get AI-generated caption in background
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
      logger.error('Error generating caption:', error)
      // Template already set, no need to fallback
    } finally {
      setIsGeneratingCaption(false)
    }
  }

  const generateBeforeAfterGif = async () => {
    if (!originalImageUrl || originalImageUrl === imageUrl) {
      alert('No before/after comparison available')
      return
    }

    setIsGeneratingGif(true)
    try {
      // Create canvas for animation frames
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
        beforeImg.src = originalImageUrl
        afterImg.src = imageUrl
      })

      // Platform-specific size
      const platformSize = PLATFORM_SIZES[selectedPlatform]
      canvas.width = platformSize.width
      canvas.height = platformSize.height

      // Generate frames for sliding comparison
      const frames: string[] = []
      const totalFrames = 60 // 2 seconds at 30fps

      for (let i = 0; i <= totalFrames; i++) {
        const progress = i / totalFrames
        const splitX = canvas.width * progress

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw after image (right side)
        ctx.drawImage(afterImg, 0, 0, canvas.width, canvas.height)

        // Draw before image (left side) with clipping
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, splitX, canvas.height)
        ctx.clip()
        ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height)
        ctx.restore()

        // Draw slider line
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 4
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.moveTo(splitX, 0)
        ctx.lineTo(splitX, canvas.height)
        ctx.stroke()

        // Add labels on first and last frames
        if (i === 0 || i === totalFrames) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
          ctx.shadowBlur = 12
          ctx.fillStyle = 'white'
          ctx.font = 'bold 48px Inter, system-ui, sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(i === 0 ? 'BEFORE' : 'AFTER', 40, 80)
        }

        // Add watermark
        ctx.fillStyle = '#14B8A6'
        ctx.font = 'bold 32px Inter, system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText('Created with @PicForge', canvas.width - 30, canvas.height - 30)

        frames.push(canvas.toDataURL('image/jpeg', 0.9))
      }

      // Note: Actual GIF encoding would require a library like gif.js
      // For now, download the last frame with instruction
      const link = document.createElement('a')
      link.href = frames[frames.length - 1]
      link.download = `picforge-before-after-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('📹 Before/After image downloaded!\n\nTip: Use an app like GIPHY or Canva to create an animated GIF from multiple frames for maximum viral potential.')
    } catch (error) {
      logger.error('Error generating GIF:', error)
      alert('Failed to generate before/after comparison')
    } finally {
      setIsGeneratingGif(false)
    }
  }

  const trackShare = async (platform: string, earnedBonus = false) => {
    try {
      const response = await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          userId: user?.id,
          earnedBonus,
          timestamp: new Date().toISOString()
        })
      })

      // Track in Google Analytics
      if (platform === 'twitter' || platform === 'instagram' || platform === 'tiktok' || platform === 'download') {
        trackSocialShare({
          platform: platform as 'twitter' | 'instagram' | 'tiktok' | 'download',
          content_type: showBeforeAfter ? 'before_after' : 'single',
        });
      }

      if (earnedBonus && response.ok) {
        setShareBonus(true)
        // Bonus will be added on next page load
        setTimeout(() => {
          alert('🎉 Bonus unlocked! +5 free images added to your account!\n\nThanks for sharing PicForge!')
        }, 1000)
      }
    } catch (error) {
      logger.error('Error tracking share:', error)
    }
  }

  const shareToTwitter = () => {
    // Download the watermarked image with a recognizable name
    const link = document.createElement('a')
    link.href = watermarkedImage || imageUrl
    const timestamp = new Date().getTime()
    const platformSize = PLATFORM_SIZES[selectedPlatform]
    link.download = `picforge-${platformSize.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Add tracking param to caption for attribution
    const trackingUrl = 'pic-forge.com?ref=twitter-share'
    const captionWithTracking = caption.replace('pic-forge.com', trackingUrl)

    // Open Twitter with the caption pre-filled
    const text = encodeURIComponent(captionWithTracking)
    const url = encodeURIComponent(trackingUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')

    // Track share and offer bonus
    trackShare('twitter', !shareBonus)

    // Show instructions
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 5000)
  }

  const shareToFacebook = () => {
    // Download image first
    const link = document.createElement('a')
    link.href = watermarkedImage || imageUrl
    const timestamp = new Date().getTime()
    link.download = `picforge-facebook-${timestamp}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Open Facebook share dialog
    const url = encodeURIComponent('https://pic-forge.com?ref=facebook-share')
    const quote = encodeURIComponent(caption)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank')

    trackShare('facebook', !shareBonus)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 3000)
  }

  const copyForInstagram = () => {
    navigator.clipboard.writeText(caption)

    // Download watermarked image
    downloadImage()

    trackShare(selectedPlatform, !shareBonus)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 3000)
  }

  const copyForTikTok = () => {
    navigator.clipboard.writeText(caption)

    // Download watermarked image
    downloadImage()

    trackShare('tiktok', !shareBonus)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 3000)
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = watermarkedImage || imageUrl
    const platformSize = PLATFORM_SIZES[selectedPlatform]
    link.download = `picforge-${platformSize.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  const remaining = getRemainingImages()
  const canEarnBonus = user && !shareBonus && typeof remaining === 'number' && remaining < 15

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
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
          <h2 className="text-3xl font-bold mb-2">Go Viral. Get Rewarded.</h2>
          <p className="text-gray-600 mb-4">Platform-optimized images ready to dominate social media</p>

          {/* Enhanced Viral Incentive Banner */}
          {canEarnBonus && (
            <div className="mb-6 bg-gradient-to-r from-teal-500 via-purple-600 to-pink-500 text-white rounded-2xl p-6 shadow-2xl border-2 border-white/20 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🚀</div>
                <div className="flex-1">
                  <h3 className="font-black text-2xl mb-1">SHARE = GET 5 FREE IMAGES</h3>
                  <p className="text-base font-medium">Pick any platform below. Instant bonus. Zero catch.</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-3">
                  <div className="text-4xl font-black">+5</div>
                  <div className="text-xs font-bold">BONUS</div>
                </div>
              </div>
            </div>
          )}

          {shareBonus && (
            <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="text-5xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-black text-xl">BOOM! Bonus Unlocked!</h3>
                  <p className="text-base font-medium">+5 images added. You&apos;re crushing it.</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Share Link - Always Visible */}
          <div className="mb-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-teal-400 uppercase tracking-wide mb-1 block">
                  Quick Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-mono border border-white/20"
                  />
                  <button
                    onClick={copyShareLink}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
                  >
                    {showShareLink ? '✓ Copied!' : 'Copy'}
                  </button>
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                    <button
                      onClick={nativeShare}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    >
                      Share
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Share this link anywhere to spread the word</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              {/* Platform Size Info */}
              <div className="mb-3 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Export Size:</span>
                  <span className="text-sm font-bold text-teal-600">
                    {PLATFORM_SIZES[selectedPlatform].width} x {PLATFORM_SIZES[selectedPlatform].height}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Optimized for {PLATFORM_SIZES[selectedPlatform].name}
                </div>
              </div>

              {/* Toggle for Before/After if original exists */}
              {originalImageUrl && originalImageUrl !== imageUrl && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setShowBeforeAfter(false)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      !showBeforeAfter
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Current
                  </button>
                  <button
                    onClick={() => setShowBeforeAfter(true)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      showBeforeAfter
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Before/After
                  </button>
                  <button
                    onClick={generateBeforeAfterGif}
                    disabled={isGeneratingGif}
                    className="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    title="Generate animated before/after comparison"
                  >
                    {isGeneratingGif ? '...' : '📹 GIF'}
                  </button>
                </div>
              )}

              {showBeforeAfter && originalImageUrl && originalImageUrl !== imageUrl ? (
                <BeforeAfterSlider
                  beforeImage={originalImageUrl}
                  afterImage={imageUrl}
                  beforeLabel="Original"
                  afterLabel="Edited"
                  className="w-full"
                />
              ) : (
                <div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                    {watermarkedImage && (
                      <Image
                        src={watermarkedImage}
                        alt="Share preview"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Preview with &quot;Created with @PicForge&quot; watermark
                  </p>
                </div>
              )}
            </div>

            {/* Sharing Options */}
            <div className="space-y-4">
              {/* Platform Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {([
                  { key: 'twitter', label: 'X/Twitter', icon: '🐦' },
                  { key: 'instagram', label: 'Instagram', icon: '📸' },
                  { key: 'instagram-story', label: 'IG Story', icon: '📱' },
                  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                ] as const).map((platform) => (
                  <button
                    key={platform.key}
                    onClick={() => {
                      setSelectedPlatform(platform.key)
                      generateCaption(platform.key)
                    }}
                    className={`px-4 py-3 font-medium rounded-lg transition-all ${
                      selectedPlatform === platform.key
                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{platform.icon}</span>
                      <span>{platform.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Viral-Ready Caption
                  {isGeneratingCaption && (
                    <span className="ml-2 text-teal-600">✨ Optimizing...</span>
                  )}
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full h-36 p-3 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  placeholder="Your viral-ready caption will appear here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro tip: Edit to match your voice, hashtags included!
                </p>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                {selectedPlatform === 'twitter' && (
                  <div className="space-y-3">
                    <button
                      onClick={shareToTwitter}
                      className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-5 rounded-xl font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg border-2 border-gray-700"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      POST TO X
                      {canEarnBonus && (
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-black">
                          +5 FREE
                        </span>
                      )}
                    </button>
                    <button
                      onClick={shareToFacebook}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-base hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-blue-500"
                    >
                      <span className="text-xl">📘</span>
                      SHARE ON FACEBOOK
                      {canEarnBonus && <span className="ml-2 text-yellow-300">+5</span>}
                    </button>
                    <p className="text-sm text-gray-600 text-center font-medium bg-gray-50 rounded-lg p-2">
                      ⚡ Auto-downloads image • Opens with caption ready
                    </p>
                  </div>
                )}

                {(selectedPlatform === 'instagram' || selectedPlatform === 'instagram-story') && (
                  <div className="space-y-3">
                    <button
                      onClick={copyForInstagram}
                      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-5 rounded-xl font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 shadow-lg border-2 border-pink-400"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">📸</span>
                        <span>COPY & DOWNLOAD</span>
                        {canEarnBonus && (
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-black">
                            +5 FREE
                          </span>
                        )}
                      </div>
                    </button>
                    <p className="text-sm text-gray-600 text-center font-medium bg-gray-50 rounded-lg p-2">
                      {selectedPlatform === 'instagram-story'
                        ? '📱 1080x1920 Story Size • Caption auto-copied'
                        : '✨ 1080x1080 Square • Caption ready to paste'}
                    </p>
                  </div>
                )}

                {selectedPlatform === 'tiktok' && (
                  <div className="space-y-3">
                    <button
                      onClick={copyForTikTok}
                      className="w-full bg-gradient-to-r from-black via-gray-900 to-purple-900 text-white py-5 rounded-xl font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 shadow-lg border-2 border-purple-500"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">🎵</span>
                        <span>COPY & DOWNLOAD</span>
                        {canEarnBonus && (
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-black">
                            +5 FREE
                          </span>
                        )}
                      </div>
                    </button>
                    <p className="text-sm text-gray-600 text-center font-medium bg-gray-50 rounded-lg p-2">
                      📱 1080x1920 Vertical • Perfect for TikTok feed
                    </p>
                  </div>
                )}

                {/* Download without sharing */}
                <div className="pt-3 border-t">
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Just Download (with watermark)
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    No bonus for download-only
                  </p>
                </div>
              </div>

              {/* Enhanced Engagement Tips */}
              <div className="mt-4 bg-gradient-to-br from-teal-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h4 className="font-black text-base mb-2 uppercase tracking-wide">Maximize Your Reach</h4>
                    <ul className="text-sm space-y-1.5 font-medium">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300">•</span>
                        <span>Post 12-3pm or 7-9pm for peak engagement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300">•</span>
                        <span>Tag @PicForge - we repost the best ones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300">•</span>
                        <span>Before/After = 3x more comments & shares</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300">•</span>
                        <span>Ask &quot;Which is better?&quot; for interaction</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
                <p className="text-xs font-bold text-gray-700 mb-1">🔥 VIRAL ALERT</p>
                <p className="text-sm font-medium text-gray-800">
                  2,847 images shared today • Avg. 324 likes per post
                </p>
                <p className="text-xs text-gray-500 mt-1">Your turn to go viral</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Toast Notification */}
      {showCopiedToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white px-8 py-5 rounded-2xl shadow-2xl max-w-md text-center z-50 animate-bounce border-2 border-white/30">
          <div className="text-3xl mb-2">🚀</div>
          <div className="font-black text-xl mb-2">LOCKED AND LOADED!</div>
          <div className="text-sm font-medium mb-2">
            {selectedPlatform === 'twitter'
              ? 'Image saved • X opening with caption'
              : 'Image saved • Caption copied to clipboard'}
          </div>
          {canEarnBonus && (
            <div className="mt-3 bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-base">
              Post now → Unlock +5 FREE images! 🎁
            </div>
          )}
          {!canEarnBonus && (
            <div className="text-xs opacity-80 mt-2">
              Get ready for the likes to roll in...
            </div>
          )}
        </div>
      )}

      {/* Quick Link Copied Toast */}
      {showShareLink && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 border-2 border-white/20">
          <div className="font-bold text-base flex items-center gap-2">
            <span>✓</span>
            <span>Link copied! Share anywhere.</span>
          </div>
        </div>
      )}
    </div>
  )
}