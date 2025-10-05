'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SampleImages {
  [category: string]: string[]
}

export default function ExamplesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sampleImages, setSampleImages] = useState<SampleImages>({})
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch sample images from API
    fetch('/api/sample-images')
      .then(res => res.json())
      .then(data => {
        setSampleImages(data.sampleImages || {})
        setCategories(data.categories || [])
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

  // Get all images or filtered by category
  const getDisplayImages = () => {
    if (selectedCategory === 'all') {
      return Object.entries(sampleImages).flatMap(([category, images]) =>
        images.map(img => ({ path: img, category }))
      )
    } else {
      return (sampleImages[selectedCategory] || []).map(img => ({
        path: img,
        category: selectedCategory
      }))
    }
  }

  const displayImages = getDisplayImages()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 font-medium hover:bg-orange-50 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Try Before You Upload</span>
          </div>
          <h1 className="font-heading text-5xl font-bold text-gray-900 mb-6">
            Example Gallery
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            Test PicForge with {Object.values(sampleImages).flat().length}+ sample images. Click any image to start editing instantly.
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="text-xl">🎨</span>
              <span>All ({Object.values(sampleImages).flat().length})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-xl">{categoryIcons[cat] || '📁'}</span>
                <span>{getCategoryName(cat)} ({sampleImages[cat]?.length || 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sample images...</p>
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
                    <img
                      src={img.path}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all"
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-xl"
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
