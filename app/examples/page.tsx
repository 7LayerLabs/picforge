'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
        console.error('Failed to load sample images:', err)
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
    // Navigate to the main editor
    router.push('/')
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
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-orange-700 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Try Before You Upload</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Templates to Try
          </h1>
          <p className="font-body text-xl text-gray-700 max-w-3xl mx-auto font-bold">
            Test drive before you commit. {Object.values(sampleImages).flat().length}+ ready-to-transform images. Click one, break reality.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{categoryIcons[category] || '📁'}</span>
                {getCategoryName(category)}
                {category !== 'all' && sampleImages[category] && (
                  <span className="ml-2 text-xs opacity-75">
                    ({sampleImages[category].length})
                  </span>
                )}
                {category === 'all' && (
                  <span className="ml-2 text-xs opacity-75">
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
                  className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <Image
                      src={img.path}
                      alt={`Sample ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div className="text-white text-xs font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Click to edit
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>{categoryIcons[img.category] || '📁'}</span>
                      <span>{getCategoryName(img.category)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-gray-600 mb-4">No sample images found</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all"
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
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 hover:scale-105 shadow-xl"
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
