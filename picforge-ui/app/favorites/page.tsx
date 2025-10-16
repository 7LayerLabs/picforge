'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import Navigation from '@/components/Navigation';
import { Prompt } from '@/lib/prompts';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');
    setFavorites(saved);
    setIsLoading(false);
  }, []);

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      localStorage.setItem('favoritePrompts', '[]');
      setFavorites([]);
    }
  };

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'favorite-prompts.json';
    link.click();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">My Favorite Prompts</h1>
            <p className="text-lg text-red-100">Loading your saved prompts...</p>
          </div>
        </div>
      </main>
    );
  }

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
          <p className="text-lg text-gray-700 font-medium">
            {favorites.length} saved prompt{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-700 text-lg mb-4">No favorite prompts yet!</p>
            <p className="text-gray-600 mb-6">Start adding prompts to your favorites by clicking the heart button on any prompt card.</p>
            <Link
              href="/"
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
              {favorites.map(prompt => (
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
                    {new Set(favorites.map(f => f.category)).size}
                  </p>
                </div>
                <div className="bg-white rounded p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Unique Tags</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {new Set(favorites.flatMap(f => f.tags)).size}
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
