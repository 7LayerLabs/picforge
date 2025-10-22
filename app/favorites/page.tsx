'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useImageTracking } from '@/hooks/useImageTracking';
import { Star, Copy, Sparkles, Trash2, Check, Eye, Download, Lock } from 'lucide-react';
import { db } from '@/lib/instantdb';

export default function FavoritesPage() {
  const { user, favorites, isLoading } = useImageTracking();
  const router = useRouter();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const tryPrompt = (prompt: string) => {
    // Store prompt in sessionStorage for the editor to pick up
    sessionStorage.setItem('tryPrompt', prompt);
    router.push('/');
  };

  const deleteFavorite = async (favoriteId: string) => {
    if (!user) return;

    setDeletingId(favoriteId);
    try {
      await db.transact([
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.favorites[favoriteId].delete()
      ]);
    } catch (error) {
      console.error('Failed to delete favorite:', error);
      alert('Failed to delete favorite. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

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

  // Separate favorites into images and prompts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageFavorites = favorites?.filter((fav: any) => fav.transformedUrl) || [];

  // ALL favorites shown in prompts section (including those with images)
  // Group ALL favorites by category for the prompts section
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedPrompts = favorites?.reduce((acc: Record<string, typeof favorites>, fav: any) => {
    const category = fav.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(fav);
    return acc;
  }, {} as Record<string, typeof favorites>) || {};

  const categories = Object.keys(groupedPrompts).sort();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Star className="w-16 h-16 mx-auto mb-4 text-teal-500" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in to view and manage your favorites.
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
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            No Favorites Yet
          </h1>
          <p className="text-gray-600 mb-6">
            Star images from My Images or prompts from the Prompts library!
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              Upload Image
            </Link>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-teal-500 fill-teal-500" />
              Favorites
            </h1>
            <p className="text-gray-600 text-lg">
              {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'} saved
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8">

        {/* Favorite Images Gallery */}
        {imageFavorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Favorite Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {imageFavorites.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
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
                    {/* Star badge */}
                    <div className="absolute top-2 left-2 bg-teal-500 text-white p-1.5 rounded-lg shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedImage(item.transformedUrl!)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="View full size"
                      >
                        <Eye className="w-4 h-4 text-gray-900" />
                      </button>
                      <button
                        onClick={() => downloadImage(item.transformedUrl!, item.prompt)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-900" />
                      </button>
                      <button
                        onClick={() => tryPrompt(item.prompt)}
                        className="p-2 bg-teal-500 hover:bg-teal-600 rounded-full transition-colors"
                        title="Try this prompt"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => deleteFavorite(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors disabled:opacity-50"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">
                      {item.prompt}
                    </p>
                    <p className="text-xs text-gray-500">
                      Saved {new Date(item.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Prompts */}
        {favorites.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Favorite Prompts
            </h2>
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                      {category}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {groupedPrompts[category].length} {groupedPrompts[category].length === 1 ? 'prompt' : 'prompts'}
                    </span>
                  </div>

                  {/* Prompts Grid */}
                  <div className="grid gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {groupedPrompts[category].map((favorite: any) => (
                      <div
                        key={favorite.id}
                        className="group relative p-4 bg-teal-50 rounded-lg border-2 border-teal-200 hover:border-teal-400 transition-all duration-200"
                      >
                        {/* Star Badge */}
                        <div className="absolute top-3 left-3">
                          <Star className="w-5 h-5 text-teal-500 fill-teal-500" />
                        </div>

                        {/* Prompt Text */}
                        <div className="flex items-start gap-3 pl-8 pr-32">
                          {favorite.transformedUrl && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-teal-300">
                              <NextImage
                                src={favorite.transformedUrl}
                                alt="thumbnail"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">
                            {favorite.prompt}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2">
                          <button
                            onClick={() => copyPrompt(favorite.prompt)}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                            title="Copy to clipboard"
                          >
                            {copiedPrompt === favorite.prompt ? (
                              <Check className="w-4 h-4 text-teal-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>

                          <button
                            onClick={() => tryPrompt(favorite.prompt)}
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors shadow-lg flex items-center gap-2 text-sm font-medium"
                            title="Try in editor"
                          >
                            <Sparkles className="w-4 h-4" />
                            Try Now
                          </button>

                          <button
                            onClick={() => deleteFavorite(favorite.id)}
                            disabled={deletingId === favorite.id}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors shadow-lg disabled:opacity-50"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Saved timestamp */}
                        <p className={`text-xs text-gray-500 mt-3 ${favorite.transformedUrl ? 'pl-20' : 'pl-8'}`}>
                          Saved {new Date(favorite.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
