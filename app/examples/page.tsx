'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { logger } from '@/lib/logger'

interface SampleImages {
  [category: string]: string[]
}

export default function ExamplesPage() {
  const router = useRouter()
  const [sampleImages, setSampleImages] = useState<SampleImages>({})
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Fetch sample images from API
    fetch('/api/sample-images')
      .then(res => res.json())
      .then(data => {
        setSampleImages(data.sampleImages || {})
        setLoading(false)
      })
      .catch(err => {
        logger.error('Failed to load sample images:', err)
        setLoading(false)
      })
  }, [])

  const categoryIcons: Record<string, string> = {
    persons: '👤',
    animals: '🐕',
    food: '🍽️',
    items: '📦',
    locations: '🏔️',
    scenes: '🌅',
    art: '🎨',
    gradients: '🌈',
    portraits: '👔',
    products: '📱',
    landscapes: '🏞️',
    interiors: '🏠',
    pets: '🐾',
    architecture: '🏛️',
    vehicles: '🚗',
    fashion: '👗',
    misc: '✨'
  }

  const getCategoryName = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  const handleImageClick = (imagePath: string) => {
    // Store the selected sample image path in localStorage
    localStorage.setItem('selectedSampleImage', imagePath)
    // Navigate to The Forge
    router.push('/forge')
  }

  // Memoize display images to avoid recalculation on every render
  const displayImages = useMemo(() => {
    const allImages = Object.entries(sampleImages)
      .flatMap(([category, images]) =>
        images.map(img => ({ path: img, category }))
      )
      .sort((a, b) => {
        const aName = a.path.split('/').pop() || ''
        const bName = b.path.split('/').pop() || ''
        return aName.localeCompare(bName)
      })

    // Apply category filter
    if (selectedCategory === 'all') {
      return allImages
    }
    return allImages.filter(img => img.category === selectedCategory)
  }, [sampleImages, selectedCategory])

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...Object.keys(sampleImages).sort()]
  }, [sampleImages])

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/forge"
          className="inline-flex items-center gap-2 px-4 py-2 text-black hover:text-brutal-cyan font-black uppercase border-4 border-black hover:bg-black hover:text-brutal-cyan transition-all shadow-brutal"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to The Forge
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-8 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brutal-yellow text-black border-4 border-black mb-4 shadow-brutal">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-black uppercase">Try Before You Upload</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black uppercase text-brutal-cyan mb-6 tracking-tight">
            Templates to Try
          </h1>
          <p className="font-body text-xl text-white max-w-3xl mx-auto font-bold">
            Test drive before you commit. {Object.values(sampleImages).flat().length}+ ready-to-transform images. Click one, break reality.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-5 gap-2 bg-black p-2 shadow-brutal-lg border-4 border-brutal-pink max-w-5xl">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 font-black uppercase transition-all border-4 text-sm ${
                  selectedCategory === category
                    ? 'bg-brutal-cyan text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-cyan hover:bg-brutal-cyan hover:text-black'
                }`}
              >
                <span className="mr-1">{categoryIcons[category] || '📁'}</span>
                {getCategoryName(category)}
                {category !== 'all' && sampleImages[category] && (
                  <span className="ml-1 text-xs opacity-75">
                    ({sampleImages[category].length})
                  </span>
                )}
                {category === 'all' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({Object.values(sampleImages).flat().length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className="bg-black border-4 border-brutal-cyan overflow-hidden shadow-brutal animate-pulse"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-square bg-gray-900"></div>
                  <div className="p-2">
                    <div className="h-4 bg-gray-900 w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(img.path)}
                  className="bg-black border-4 border-brutal-cyan overflow-hidden shadow-brutal hover:shadow-brutal-lg transition-all duration-300 cursor-pointer hover:translate-x-1 hover:translate-y-1 group"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-900">
                    <Image
                      src={img.path}
                      alt={`Sample ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-brutal-pink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 border-4 border-black">
                      <div className="text-black text-xs font-black uppercase flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Click to edit
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1 text-xs text-brutal-cyan font-bold uppercase">
                      <span>{categoryIcons[img.category] || '📁'}</span>
                      <span>{getCategoryName(img.category)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black border-4 border-brutal-pink p-12 text-center shadow-brutal-lg">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-white font-bold mb-4">No sample images found</p>
              <Link
                href="/forge"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal"
              >
                <Upload className="w-4 h-4" />
                Upload Your Own Image
              </Link>
            </div>
          )}
        </div>

        {/* CTA Section */}
        {displayImages.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/forge"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink transition-all shadow-brutal hover:shadow-brutal-lg hover:translate-x-1 hover:translate-y-1"
            >
              <Upload className="w-5 h-5" />
              Upload Your Own Image
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
