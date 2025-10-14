'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useImageTracking } from '@/hooks/useImageTracking';
import { Clock, Download, Eye, Lock, Star } from 'lucide-react';

export default function MyImages() {
  const { user, imageHistory, isLoading, saveFavorite, favorites } = useImageTracking();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `picforge-${prompt.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleFavorite = async (item: any) => {
    try {
      await saveFavorite(item.prompt, 'My Creations', item.originalUrl, item.transformedUrl, item.locked);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Failed to save favorite:', error);
      alert('Failed to save favorite. Please try again.');
    }
  };

  const isFavorited = (prompt: string) => {
    if (!favorites) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return favorites.some((fav: any) => fav.prompt === prompt);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to view your image history and saved creations.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all hover:scale-105"
          >
            Go to Editor
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your images...</p>
        </div>
      </div>
    );
  }

  if (!imageHistory || imageHistory.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            No Images Yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start creating amazing images with PicForge! Your creations will appear here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all hover:scale-105"
          >
            Start Creating
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Images
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {imageHistory.length} {imageHistory.length === 1 ? 'image' : 'images'} created
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {imageHistory.map((item: any) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
                {item.transformedUrl && (
                  <NextImage
                    src={item.transformedUrl}
                    alt={item.prompt}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => setSelectedImage(item.transformedUrl!)}
                  />
                )}
                {/* Lock badge if composition was locked */}
                {item.locked && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white p-1.5 rounded-lg shadow-lg">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedImage(item.transformedUrl!)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="View full size"
                  >
                    <Eye className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={() => handleFavorite(item)}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorited(item.prompt)
                        ? 'bg-yellow-400 hover:bg-yellow-500'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    title={isFavorited(item.prompt) ? 'Already favorited' : 'Add to favorites'}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isFavorited(item.prompt) ? 'text-white fill-white' : 'text-gray-900'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => downloadImage(item.transformedUrl!, item.prompt)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm text-gray-900 dark:text-white font-medium mb-2 line-clamp-2">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-teal-400 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <NextImage
              src={selectedImage}
              alt="Full size"
              width={1200}
              height={1200}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
