'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface GalleryItem {
  prompt: string
  image: string
  timestamp: Date
  isOriginal?: boolean
}

interface ImageGalleryProps {
  items: GalleryItem[]
  currentImage: string | null
  onRestore: (item: GalleryItem) => void
  onDownload: (item: GalleryItem, index: number) => void
  onDelete: (index: number) => void
  onZoom: (image: string) => void
}

export default function ImageGallery({
  items,
  currentImage,
  onRestore,
  onDownload,
  onDelete,
  onZoom
}: ImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const galleryRef = useRef<HTMLDivElement>(null)

  // Staggered load animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setTimeout(() => {
              setLoadedImages(prev => new Set(prev).add(index))
            }, index * 50)
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = galleryRef.current?.querySelectorAll('.gallery-item')
    elements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [items])

  // Calculate dynamic heights for masonry
  const getItemHeight = (index: number) => {
    const heights = [200, 250, 300, 280, 220, 260]
    return heights[index % heights.length]
  }

  return (
    <div className="w-full">
      {/* Gallery Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold gradient-text">Creative Journey</h2>
          <p className="text-xs text-gray-500 mt-1">
            {items.length} {items.length === 1 ? 'version' : 'versions'} • Click to restore
          </p>
        </div>
      </div>

      {/* Masonry Gallery */}
      <div
        ref={galleryRef}
        className="masonry-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '12px',
          gridAutoFlow: 'dense'
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            data-index={index}
            className={`
              gallery-item relative group overflow-hidden rounded-xl
              transition-all duration-500 cursor-pointer
              ${loadedImages.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              ${currentImage === item.image ? 'ring-2 ring-blue-500 shadow-xl' : ''}
              ${hoveredIndex === index ? 'z-10' : 'z-0'}
            `}
            style={{
              gridRow: `span ${Math.ceil(getItemHeight(index) / 100)}`,
              transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredIndex === index
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onRestore(item)}
          >
            {/* Image Container */}
            <div
              className="relative w-full bg-gray-100 dark:from-gray-800 dark:to-gray-900"
              style={{ height: `${getItemHeight(index)}px` }}
            >
              <Image
                src={item.image}
                alt={`Version ${index}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 150px, 200px"
              />

              {/* Gradient Overlay on Hover */}
              <div className={`
                absolute inset-0 bg-black/60
                transition-opacity duration-300
                ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
              `} />

              {/* Badges */}
              {item.isOriginal && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold shadow-lg">
                  Original
                </div>
              )}

              {currentImage === item.image && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold shadow-lg animate-pulse">
                  Current
                </div>
              )}

              {/* Hover Actions */}
              <div className={`
                absolute bottom-0 left-0 right-0 p-3 transform transition-all duration-300
                ${hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
              `}>
                <p className="text-white text-xs font-medium mb-2 truncate">
                  {item.isOriginal ? 'Original Image' : item.prompt}
                </p>

                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onZoom(item.image)
                    }}
                    className="flex-1 px-2 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all text-xs font-medium"
                  >
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    View
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownload(item, index)
                    }}
                    className="flex-1 px-2 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all text-xs font-medium"
                  >
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Save
                  </button>

                  {!item.isOriginal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(index)
                      }}
                      className="px-2 py-1.5 bg-coral-500/20 backdrop-blur-md text-white rounded-lg hover:bg-coral-500/30 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .masonry-layout {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}