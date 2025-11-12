'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useImageTracking } from '@/hooks/useImageTracking';
import { Star, Copy, Sparkles, Trash2, Check, Eye, Download, Lock } from 'lucide-react';
import { db } from '@/lib/instantdb';
import { addWatermarkIfFree, blobToDataUrl } from '@/lib/watermark';
import { logger } from '@/lib/logger';

export default function FavoritesPage() {
  const { user, favorites, isLoading, usage } = useImageTracking();
  const router = useRouter();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const copyPrompt = (prompt: string | any) => {
    const promptText = typeof prompt === 'string' ? prompt : String(prompt || '');
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(promptText);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const tryPrompt = (prompt: string | any) => {
    // Store prompt in sessionStorage for the editor to pick up
    const promptText = typeof prompt === 'string' ? prompt : String(prompt);
    sessionStorage.setItem('tryPrompt', promptText);
    router.push('/forge');
  };

  const deleteFavorite = async (favoriteId: string) => {
    if (!user) return;

    // Confirm deletion
    if (!confirm('Are you sure you want to remove this from your favorites?')) {
      return;
    }

    setDeletingId(favoriteId);
    try {
      await db.transact([
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.favorites[favoriteId].delete()
      ]);
    } catch (error) {
      logger.error('Failed to delete favorite:', error);
      alert('Failed to delete favorite. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string | any) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Convert blob to data URL
      const dataUrl = await blobToDataUrl(blob);

      // Apply watermark if user is on free tier
      const finalImageData = await addWatermarkIfFree(dataUrl, usage?.tier);

      // Download the watermarked image
      const promptText = typeof prompt === 'string' ? prompt : String(prompt || 'image');
      const a = document.createElement('a');
      a.href = finalImageData;
      a.download = `picforge-${promptText.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      logger.error('Failed to download image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  // Separate favorites into images and prompts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageFavorites = favorites?.filter((fav: any) => fav.transformedUrl) || [];

  // Show ONLY prompts without images in the prompts section (to avoid duplication)
  // Group prompt-only favorites by category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promptOnlyFavorites = favorites?.filter((fav: any) => !fav.transformedUrl) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedPrompts = promptOnlyFavorites.reduce((acc: Record<string, typeof favorites>, fav: any) => {
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center max-w-md bg-black border-4 border-brutal-cyan shadow-brutal-lg p-12">
          <Star className="w-16 h-16 mx-auto mb-4 text-brutal-cyan" />
          <h1 className="font-heading text-3xl font-black uppercase text-brutal-cyan mb-3 tracking-tight">
            Sign In Required
          </h1>
          <p className="font-body text-white mb-6 font-bold">
            Sign in to view and manage your favorites.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1"
          >
            Go to Editor
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brutal-cyan border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="font-body text-black font-bold">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center max-w-md bg-black border-4 border-brutal-pink shadow-brutal-lg p-12">
          <Star className="w-16 h-16 mx-auto mb-4 text-brutal-yellow" />
          <h1 className="font-heading text-3xl font-black uppercase text-brutal-pink mb-3 tracking-tight">
            No Favorites Yet
          </h1>
          <p className="font-body text-white mb-6 font-bold">
            Star images from My Images or prompts from the Prompts library!
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow hover:text-black transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1"
            >
              Upload Image
            </Link>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-pink text-white border-4 border-black font-black uppercase hover:bg-brutal-yellow hover:text-black transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black border-b-4 border-brutal-cyan">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-black uppercase text-brutal-cyan mb-2 flex items-center justify-center gap-3 tracking-tight">
              <Star className="w-8 h-8 text-brutal-yellow fill-brutal-yellow" />
              Favorites
            </h1>
            <p className="font-body text-white text-lg font-bold">
              {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'} saved
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8">

        {/* Favorite Images Gallery */}
        {imageFavorites.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-black uppercase text-black mb-4 tracking-tight">
              Favorite Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {imageFavorites.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-black border-4 border-brutal-cyan overflow-hidden shadow-brutal hover:shadow-brutal-lg transition-all duration-300 hover:translate-x-1 hover:translate-y-1 group"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {item.transformedUrl && (
                      <NextImage
                        src={item.transformedUrl}
                        alt={typeof item.prompt === 'string' ? item.prompt : 'Favorite image'}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => setSelectedImage(item.transformedUrl!)}
                      />
                    )}
                    {/* Lock badge if composition was locked */}
                    {item.locked && (
                      <div className="absolute top-2 right-2 bg-brutal-pink text-white p-1.5 border-4 border-black shadow-brutal">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    {/* Star badge */}
                    <div className="absolute top-2 left-2 bg-brutal-yellow text-black p-1.5 border-4 border-black shadow-brutal">
                      <Star className="w-4 h-4 fill-black" />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedImage(item.transformedUrl!)}
                        className="p-2 bg-brutal-cyan text-black border-4 border-black hover:bg-brutal-yellow transition-colors shadow-brutal"
                        title="View full size"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadImage(item.transformedUrl!, item.prompt)}
                        className="p-2 bg-brutal-cyan text-black border-4 border-black hover:bg-brutal-yellow transition-colors shadow-brutal"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => tryPrompt(item.prompt)}
                        className="p-2 bg-brutal-pink text-white border-4 border-black hover:bg-brutal-yellow hover:text-black transition-colors shadow-brutal"
                        title="Try this prompt"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFavorite(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 bg-black text-brutal-pink border-4 border-brutal-pink hover:bg-brutal-pink hover:text-white transition-colors disabled:opacity-50 shadow-brutal"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-gray-900 border-t-4 border-brutal-cyan">
                    <p className="text-sm text-white font-bold mb-2 line-clamp-2">
                      {typeof item.prompt === 'string' ? item.prompt : String(item.prompt || '')}
                    </p>
                    <p className="text-xs text-brutal-cyan font-bold">
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

        {/* Favorite Prompts (prompts without images only) */}
        {categories.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-black uppercase text-black mb-4 tracking-tight">
              Favorite Prompts
            </h2>
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category} className="bg-black border-4 border-brutal-pink shadow-brutal-lg p-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-4 border-brutal-pink">
                    <h3 className="font-heading text-xl font-black uppercase text-brutal-pink tracking-tight">
                      {category}
                    </h3>
                    <span className="text-sm font-black uppercase text-white bg-brutal-pink px-3 py-1 border-4 border-black">
                      {groupedPrompts[category].length} {groupedPrompts[category].length === 1 ? 'prompt' : 'prompts'}
                    </span>
                  </div>

                  {/* Prompts Grid */}
                  <div className="grid gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {groupedPrompts[category].map((favorite: any) => (
                      <div
                        key={favorite.id}
                        className="group relative p-4 bg-gray-900 border-4 border-brutal-cyan hover:border-brutal-yellow transition-all duration-200 shadow-brutal"
                      >
                        {/* Star Badge */}
                        <div className="absolute top-3 left-3">
                          <Star className="w-5 h-5 text-brutal-yellow fill-brutal-yellow" />
                        </div>

                        {/* Prompt Text (no image thumbnail since these are prompt-only) */}
                        <div className="pl-8 pr-32">
                          <p className="text-sm text-white leading-relaxed font-bold">
                            {typeof favorite.prompt === 'string' ? favorite.prompt : String(favorite.prompt || '')}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2">
                          <button
                            onClick={() => copyPrompt(favorite.prompt)}
                            className="p-2 bg-brutal-cyan text-black border-4 border-black hover:bg-brutal-yellow transition-colors shadow-brutal"
                            title="Copy to clipboard"
                          >
                            {copiedPrompt === favorite.prompt ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => tryPrompt(favorite.prompt)}
                            className="px-4 py-2 bg-brutal-pink text-white border-4 border-black hover:bg-brutal-yellow hover:text-black transition-colors shadow-brutal flex items-center gap-2 text-sm font-black uppercase"
                            title="Try in editor"
                          >
                            <Sparkles className="w-4 h-4" />
                            Try Now
                          </button>

                          <button
                            onClick={() => deleteFavorite(favorite.id)}
                            disabled={deletingId === favorite.id}
                            className="p-2 bg-black text-brutal-pink border-4 border-brutal-pink hover:bg-brutal-pink hover:text-white transition-colors shadow-brutal disabled:opacity-50"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Saved timestamp */}
                        <p className="text-xs text-brutal-cyan mt-3 pl-8 font-bold">
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-brutal-pink text-white border-4 border-black hover:bg-brutal-yellow hover:text-black transition-colors shadow-brutal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full border-4 border-brutal-cyan shadow-brutal-lg" onClick={(e) => e.stopPropagation()}>
            <NextImage
              src={selectedImage}
              alt="Full size"
              width={1200}
              height={1200}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
