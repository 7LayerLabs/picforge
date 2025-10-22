'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Zap, ArrowDown } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';

interface GalleryItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  prompt: string;
  category: string;
  title: string;
}

interface BeforeAfterGalleryProps {
  onStartEditing?: () => void;
}

// Curated showcase transformations
const SHOWCASE_TRANSFORMATIONS: GalleryItem[] = [
  {
    id: 'elon-sketch',
    beforeImage: '/examples/elon.jpg',
    afterImage: '/examples/elon_sketch.png',
    prompt: 'Blue ballpoint pen sketch on notebook paper',
    category: 'Art Styles',
    title: 'Ballpoint Pen Sketch'
  },
  {
    id: 'sidney-sketch',
    beforeImage: '/examples/sidney.webp',
    afterImage: '/examples/sidney_sketch.png',
    prompt: 'Blue ballpoint pen sketch on notebook paper',
    category: 'Art Styles',
    title: 'Realistic to Sketch'
  },
  {
    id: 'derek-zombie',
    beforeImage: '/examples/derek.jpg',
    afterImage: '/examples/derek_zombie.png',
    prompt: 'Turn into a zombie',
    category: 'Fantasy',
    title: 'Zombie Transformation'
  },
  {
    id: 'derek-cyberpunk',
    beforeImage: '/examples/derek.jpg',
    afterImage: '/examples/derek_cyberpunk.png',
    prompt: 'Cyberpunk character with neon lights',
    category: 'Sci-Fi',
    title: 'Cyberpunk Style'
  },
  {
    id: 'product-studio',
    beforeImage: '/examples/product_before.jpg',
    afterImage: '/examples/product_after.png',
    prompt: 'Professional studio lighting with white backdrop',
    category: 'Pro Photography',
    title: 'Studio Product Shot'
  },
  {
    id: 'landscape-sunset',
    beforeImage: '/examples/landscape_day.jpg',
    afterImage: '/examples/landscape_sunset.png',
    prompt: 'Golden hour sunset with warm tones',
    category: 'Nature',
    title: 'Golden Hour Effect'
  },
  {
    id: 'portrait-oil',
    beforeImage: '/examples/portrait.jpg',
    afterImage: '/examples/portrait_oil.png',
    prompt: 'Oil painting in the style of Rembrandt',
    category: 'Art Styles',
    title: 'Classical Oil Painting'
  },
  {
    id: 'pet-anime',
    beforeImage: '/examples/dog.jpg',
    afterImage: '/examples/dog_anime.png',
    prompt: 'Anime style character design',
    category: 'Anime & Cartoon',
    title: 'Pet to Anime'
  }
];

export default function BeforeAfterGallery({ onStartEditing }: BeforeAfterGalleryProps = {}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid');
  const selected = SHOWCASE_TRANSFORMATIONS[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? SHOWCASE_TRANSFORMATIONS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === SHOWCASE_TRANSFORMATIONS.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-teal-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2">
              See What&apos;s Possible
            </h2>
            <p className="text-white opacity-90">
              Real transformations. Real results. Zero Photoshop skills required.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'slider'
                  ? 'bg-white text-teal-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'slider' ? (
        // Interactive Before/After Slider View
        <div className="p-6">
          <div className="mb-6">
            <BeforeAfterSlider
              beforeImage={selected.beforeImage}
              afterImage={selected.afterImage}
              beforeLabel="Original"
              afterLabel="Transformed"
              className="rounded-xl overflow-hidden shadow-lg"
            />
          </div>

          {/* Transformation Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {selected.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Category: <span className="font-medium">{selected.category}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                <Zap className="w-3 h-3" />
                AI Generated
              </span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 font-medium">Prompt Used:</p>
              <p className="text-sm text-gray-900 italic">&quot;{selected.prompt}&quot;</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">
              {selectedIndex + 1} / {SHOWCASE_TRANSFORMATIONS.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* CTA Button to Start Editing */}
          {onStartEditing && (
            <div className="text-center">
              <button
                onClick={onStartEditing}
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white text-lg font-bold rounded-xl hover:bg-teal-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Start Editing Your Images
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Upload your own photo and try any transformation
              </p>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SHOWCASE_TRANSFORMATIONS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIndex(index);
                  setViewMode('slider');
                }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Before Image (shows on hover) */}
                <Image
                  src={item.beforeImage}
                  alt={`${item.title} - Before`}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* After Image */}
                <Image
                  src={item.afterImage}
                  alt={`${item.title} - After`}
                  fill
                  className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-xs opacity-90">{item.category}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 text-teal-600 px-2 py-1 rounded-full text-xs font-bold">
                    Click to Compare
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Hover: Before
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Click any image to see detailed before/after comparison
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {SHOWCASE_TRANSFORMATIONS.length} Example Transformations
            </div>

            {/* CTA Button to Start Editing */}
            {onStartEditing && (
              <div className="mt-6">
                <button
                  onClick={onStartEditing}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white text-lg font-bold rounded-xl hover:bg-teal-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Start Editing Your Images
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Upload your own photo and try any transformation
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
        <p className="text-gray-700 mb-4 font-medium">
          Ready to transform your own images?
        </p>
        <button
          onClick={() => {
            const uploadInput = document.getElementById('image-upload-input');
            uploadInput?.click();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all hover:scale-105 shadow-lg"
        >
          <Zap className="w-5 h-5" />
          Upload Your Image Now
        </button>
      </div>
    </div>
  );
}
