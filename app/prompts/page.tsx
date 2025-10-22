'use client';

import { useState, useMemo, useEffect } from 'react';
import { prompts, categories, allTags, getPromptOfTheDay } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';
import PromptSubmitModal from '@/components/PromptSubmitModal';
import { useImageTracking } from '@/hooks/useImageTracking';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const promptOfTheDay = getPromptOfTheDay();
  const { user, migrateFavoritesFromLocalStorage } = useImageTracking();

  // Migrate localStorage favorites to InstantDB when user logs in
  useEffect(() => {
    if (user) {
      migrateFavoritesFromLocalStorage();
    }
  }, [user, migrateFavoritesFromLocalStorage]);

  // Filter prompts based on selections
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      // Category filter
      if (selectedCategory && prompt.category !== selectedCategory) {
        return false;
      }

      // Tags filter
      if (selectedTags.size > 0) {
        const hasMatchingTag = prompt.tags.some(tag => selectedTags.has(tag));
        if (!hasMatchingTag) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prompt.title.toLowerCase().includes(query);
        const matchesDescription = prompt.description.toLowerCase().includes(query);
        const matchesTags = prompt.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedTags, searchQuery]);

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags(new Set());
    setSearchQuery('');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-black" style={{ fontFamily: 'Courier New, monospace' }}>
            Prompt Library
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Break reality. One prompt at a time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prompt of the Day Banner */}
        <div className="mb-8 bg-cyan-50 rounded-lg p-6 border-l-4 border-teal-600">
          <p className="text-teal-700 text-sm font-semibold mb-2">✨ Prompt of the Day</p>
          <h3 className="text-black text-xl font-bold mb-1">{promptOfTheDay.title}</h3>
          <p className="text-gray-700 mb-3">{promptOfTheDay.description}</p>
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition">
            Try This Prompt
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={searchQuery ? filteredPrompts.length : undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            onClearFilters={clearFilters}
          />

          {/* Prompts Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-black">
                  Prompts ({filteredPrompts.length})
                </h2>
                <div className="flex gap-2">
                  {(selectedCategory || selectedTags.size > 0 || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg text-sm font-medium transition"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    + Submit Your Prompt
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory || selectedTags.size > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategory && (
                    <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                      <span>Category: {selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {Array.from(selectedTags).map(tag => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No prompts found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPrompts.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Submit Modal */}
      {showSubmitModal && (
        <PromptSubmitModal
          categories={categories}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
    </main>
  );
}
