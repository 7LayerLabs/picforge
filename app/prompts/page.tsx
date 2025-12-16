'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { prompts, categories, allTags, getPromptOfTheDay } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';
import PromptSubmitModal from '@/components/PromptSubmitModal';
import { useImageTracking } from '@/hooks/useImageTracking';
import { logger } from '@/lib/logger';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [potdCopied, setPotdCopied] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    show: boolean;
    migrating: boolean;
    migrated: number;
    error?: string;
  }>({ show: false, migrating: false, migrated: 0 });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const promptOfTheDay = getPromptOfTheDay();
  const { user, migrateFavoritesFromLocalStorage } = useImageTracking();

  // Debounce search query for performance (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Migrate localStorage favorites to InstantDB when user logs in
  useEffect(() => {
    if (user) {
      const doMigration = async () => {
        // Check if there are localStorage favorites to migrate
        const localFavorites = localStorage.getItem('favoritePrompts');
        if (localFavorites) {
          try {
            const parsed = JSON.parse(localFavorites);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMigrationStatus({ show: true, migrating: true, migrated: 0 });

              const result = await migrateFavoritesFromLocalStorage();

              if (result.success && result.migrated > 0) {
                setMigrationStatus({
                  show: true,
                  migrating: false,
                  migrated: result.migrated,
                });
                // Auto-dismiss after 5 seconds
                setTimeout(() => {
                  setMigrationStatus({ show: false, migrating: false, migrated: 0 });
                }, 5000);
              } else {
                setMigrationStatus({ show: false, migrating: false, migrated: 0 });
              }
            }
          } catch (e) {
            logger.error('Migration check error:', e);
          }
        }
      };

      doMigration();
    }
  }, [user, migrateFavoritesFromLocalStorage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Ctrl/Cmd + K or "/" - Focus search bar
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Escape - Clear filters or close modal
      if (e.key === 'Escape') {
        if (showSubmitModal) {
          setShowSubmitModal(false);
        } else if (selectedCategory || selectedTags.size > 0 || searchQuery) {
          setSelectedCategory(null);
          setSelectedTags(new Set());
          setSearchQuery('');
          searchInputRef.current?.blur();
        }
      }

      // Ctrl/Cmd + Shift + C - Clear all filters
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C' && !isTyping) {
        e.preventDefault();
        setSelectedCategory(null);
        setSelectedTags(new Set());
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSubmitModal, selectedCategory, selectedTags, searchQuery]);

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

      // Search filter (using debounced query)
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesTitle = prompt.title.toLowerCase().includes(query);
        const matchesDescription = prompt.description.toLowerCase().includes(query);
        const matchesTags = prompt.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedTags, debouncedSearchQuery]);

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
    searchInputRef.current?.blur(); // Remove focus from search
  };

  const handleCopyPromptOfDay = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(promptOfTheDay.description);
      }
      setPotdCopied(true);
      setTimeout(() => setPotdCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy prompt:', err);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-black border-b-4 border-brutal-cyan py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black uppercase mb-3 text-brutal-cyan tracking-tight" style={{ fontFamily: 'Courier New, monospace' }}>
            Prompt Library
          </h1>
          <p className="text-lg text-white font-bold">
            Break reality. One prompt at a time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Migration Status Banner */}
        {migrationStatus.show && (
          <div
            className={`mb-6 p-4 border-4 shadow-brutal ${
              migrationStatus.migrating
                ? 'bg-brutal-cyan border-black'
                : 'bg-brutal-yellow border-black'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {migrationStatus.migrating ? '⏳' : '✅'}
              </span>
              <div className="flex-1">
                <p className="font-black uppercase text-black">
                  {migrationStatus.migrating
                    ? 'Migrating your favorites...'
                    : `Successfully migrated ${migrationStatus.migrated} favorite${
                        migrationStatus.migrated !== 1 ? 's' : ''
                      }!`}
                </p>
                <p className="text-sm text-black font-bold">
                  {migrationStatus.migrating
                    ? 'Syncing your favorites to the cloud for cross-device access'
                    : 'Your favorites are now synced across all your devices'}
                </p>
              </div>
              {!migrationStatus.migrating && (
                <button
                  onClick={() =>
                    setMigrationStatus({ show: false, migrating: false, migrated: 0 })
                  }
                  className="text-black hover:text-brutal-pink text-xl font-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Prompt of the Day Banner */}
        <div className="mb-8 bg-brutal-pink p-6 border-4 border-black shadow-brutal-lg">
          <p className="text-black text-sm font-black uppercase mb-2">✨ Prompt of the Day</p>
          <h3 className="text-black text-xl font-black uppercase mb-1 tracking-tight">{promptOfTheDay.title}</h3>
          <p className="text-black mb-3 font-bold">{promptOfTheDay.description}</p>
          <button
            onClick={handleCopyPromptOfDay}
            className="px-4 py-2 bg-black hover:bg-brutal-cyan text-brutal-pink hover:text-black border-4 border-brutal-cyan font-black uppercase transition shadow-brutal"
          >
            {potdCopied ? '✓ Copied!' : 'Try This Prompt'}
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar
          ref={searchInputRef}
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={debouncedSearchQuery ? filteredPrompts.length : undefined}
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
                <h2 className="text-2xl font-black uppercase text-black tracking-tight">
                  Prompts ({filteredPrompts.length})
                </h2>
                <div className="flex gap-2">
                  {(selectedCategory || selectedTags.size > 0 || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-900 hover:bg-brutal-pink text-white hover:text-black border-4 border-brutal-pink text-sm font-black uppercase transition shadow-brutal"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-4 py-2 bg-brutal-cyan hover:bg-brutal-yellow text-black border-4 border-black text-sm font-black uppercase transition shadow-brutal"
                  >
                    + Submit Your Prompt
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory || selectedTags.size > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategory && (
                    <div className="inline-flex items-center gap-2 bg-brutal-yellow text-black px-3 py-1 border-4 border-black text-sm font-bold shadow-brutal">
                      <span>Category: {selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="hover:text-brutal-pink font-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {Array.from(selectedTags).map(tag => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-2 bg-brutal-cyan text-black px-3 py-1 border-4 border-black text-sm font-bold shadow-brutal"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:text-brutal-pink font-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="bg-black border-4 border-brutal-pink p-12 text-center shadow-brutal-lg">
                <p className="text-white text-lg font-bold mb-4">No prompts found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-brutal-cyan hover:bg-brutal-yellow text-black border-4 border-black font-black uppercase transition shadow-brutal"
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
