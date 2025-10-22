'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import Navigation from '@/components/Navigation';
import { prompts } from '@/lib/prompts';
import { useImageTracking } from '@/hooks/useImageTracking';
import AuthButton from '@/components/AuthButton';

export default function FavoritesPage() {
  const { user, favorites: dbFavorites, isLoading, removeFavorite } = useImageTracking();

  // Convert InstantDB favorites back to Prompt format for display
  const favorites = useMemo(() => {
    if (!dbFavorites || dbFavorites.length === 0) return [];

    return dbFavorites
      .map((fav: any) => {
        // Try to find the matching prompt from the library
        const matchingPrompt = prompts.find(p => p.description === fav.prompt);
        if (matchingPrompt) {
          return { ...matchingPrompt, dbId: fav.id }; // Include DB ID for deletion
        }
        // If not found in library, create a basic prompt object
        return {
          id: fav.id,
          dbId: fav.id,
          title: fav.prompt.substring(0, 50),
          description: fav.prompt,
          category: fav.category || 'Custom',
          tags: [],
          subject: 'Custom',
          mood: 'Custom',
          composition: 'Custom',
        };
      })
      .reverse(); // Show newest first
  }, [dbFavorites]);

  const clearAllFavorites = async () => {
    if (!user) {
      alert('Please sign in to manage favorites');
      return;
    }

    if (confirm('Are you sure you want to clear all favorites?')) {
      // Delete all favorites
      for (const fav of favorites) {
        await removeFavorite((fav as any).dbId);
      }
    }
  };

  const exportFavorites = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportData = favorites.map((fav: any) => ({
      title: fav.title,
      description: fav.description,
      category: fav.category,
      tags: fav.tags,
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'favorite-prompts.json';
    link.click();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Header */}
      <Navigation />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-black" style={{ fontFamily: 'Courier New, monospace' }}>
            My Favorites
          </h1>
          {user ? (
            <p className="text-lg text-gray-700 font-medium">
              {isLoading
                ? 'Loading your favorites...'
                : `${favorites.length} saved prompt${favorites.length !== 1 ? 's' : ''}`}
              <span className="ml-2 text-teal-600" title="Synced across all devices">
                ☁️ Synced
              </span>
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg text-gray-600">Sign in to sync favorites across devices</p>
              <AuthButton />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4 block">🔒</span>
            <p className="text-gray-700 text-xl font-semibold mb-2">Sign In Required</p>
            <p className="text-gray-600 mb-6">
              Sign in to access your favorites from any device
            </p>
            <AuthButton />
          </div>
        ) : isLoading ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <span className="text-6xl mb-4 block animate-pulse">⏳</span>
            <p className="text-gray-700 text-lg">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <span className="text-6xl mb-4 block">💔</span>
            <p className="text-gray-700 text-lg mb-4">No favorite prompts yet!</p>
            <p className="text-gray-600 mb-6">
              Start adding prompts to your favorites by clicking the heart button on any prompt card.
            </p>
            <Link
              href="/prompts"
              className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
            >
              Browse Prompts
            </Link>
          </div>
        ) : (
          <div>
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <button
                onClick={exportFavorites}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
              >
                📥 Export JSON
              </button>
              <button
                onClick={clearAllFavorites}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
              >
                🗑️ Clear All
              </button>
            </div>

            {/* Favorites Grid */}
            <div className="grid gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {favorites.map((prompt: any) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-4">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Total Favorites</p>
                  <p className="text-3xl font-bold text-teal-600">{favorites.length}</p>
                </div>
                <div className="bg-white rounded p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {new Set(favorites.map((f: any) => f.category)).size}
                  </p>
                </div>
                <div className="bg-white rounded p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Unique Tags</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {new Set(favorites.flatMap((f: any) => f.tags)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
