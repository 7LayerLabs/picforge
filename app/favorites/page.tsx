'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useImageTracking } from '@/hooks/useImageTracking';
import { Star, Copy, Sparkles, Trash2, Check } from 'lucide-react';
import { db } from '@/lib/instantdb';
import { id } from '@instantdb/react';

export default function FavoritesPage() {
  const { user, favorites, isLoading } = useImageTracking();
  const router = useRouter();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // Group favorites by category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedFavorites = favorites?.reduce((acc: Record<string, typeof favorites>, fav: any) => {
    const category = fav.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(fav);
    return acc;
  }, {} as Record<string, typeof favorites>) || {};

  const categories = Object.keys(groupedFavorites).sort();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Star className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to view and manage your favorite prompts.
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
          <p className="text-gray-600 dark:text-gray-400">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            No Favorites Yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start starring prompts you love! Visit the Prompts page and click the star icon on any prompt.
          </p>
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all hover:scale-105"
          >
            Browse Prompts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Favorite Prompts
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'prompt' : 'prompts'} saved across {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {groupedFavorites[category].length} {groupedFavorites[category].length === 1 ? 'prompt' : 'prompts'}
                </span>
              </div>

              {/* Prompts Grid */}
              <div className="grid gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {groupedFavorites[category].map((favorite: any) => (
                  <div
                    key={favorite.id}
                    className="group relative p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 transition-all duration-200"
                  >
                    {/* Star Badge */}
                    <div className="absolute top-3 left-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>

                    {/* Prompt Text */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 pl-8 pr-32 leading-relaxed">
                      {favorite.prompt}
                    </p>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2">
                      <button
                        onClick={() => copyPrompt(favorite.prompt)}
                        className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-lg"
                        title="Copy to clipboard"
                      >
                        {copiedPrompt === favorite.prompt ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
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
                        className="p-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors shadow-lg disabled:opacity-50"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Saved timestamp */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pl-8">
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

        {/* Footer CTA */}
        <div className="mt-8 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                Discover More Prompts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse 200+ prompts and star your favorites
              </p>
            </div>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all hover:scale-105 whitespace-nowrap"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
