'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  allTags: string[];
  selectedTags: Set<string>;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  allTags,
  selectedTags,
  onTagToggle,
  onClearFilters,
}: FilterSidebarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const FilterContent = () => (
    <>
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black mb-3">Categories</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                onCategoryChange(selectedCategory === category ? null : category);
                setMobileFiltersOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded transition text-sm touch-manipulation ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-black mb-3">Tags</h3>

        {/* Mobile: Horizontal scrollable tags */}
        <div className="flex lg:flex-wrap gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0 scrollbar-thin">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                onTagToggle(tag);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition whitespace-nowrap touch-manipulation min-w-fit ${
                selectedTags.has(tag)
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      {(selectedCategory || selectedTags.size > 0) && (
        <button
          onClick={() => {
            onClearFilters();
            setMobileFiltersOpen(false);
          }}
          className="w-full px-4 py-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-black rounded-lg font-medium transition text-sm touch-manipulation"
        >
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Filter Button (Bottom Sheet Trigger) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="bg-teal-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-teal-700 active:bg-teal-800 transition-all flex items-center gap-2 touch-manipulation"
        >
          <Filter className="w-5 h-5" />
          <span className="font-semibold">Filters</span>
          {(selectedCategory || selectedTags.size > 0) && (
            <span className="bg-white text-teal-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {selectedTags.size + (selectedCategory ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
          <h2 className="text-xl font-bold text-black mb-6">Filters</h2>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Active Filters Display */}
      {(selectedCategory || selectedTags.size > 0) && (
        <div className="lg:hidden mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Active:</span>
          {selectedCategory && (
            <button
              onClick={() => onCategoryChange(null)}
              className="flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap touch-manipulation"
            >
              {selectedCategory}
              <X className="w-3 h-3" />
            </button>
          )}
          {Array.from(selectedTags).map(tag => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap touch-manipulation"
            >
              {tag}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
