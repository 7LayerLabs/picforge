'use client';

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
  return (
    <aside className="lg:col-span-1">
      <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
        <h2 className="text-xl font-bold text-black mb-6">Filters</h2>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-3">Categories</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() =>
                  onCategoryChange(selectedCategory === category ? null : category)
                }
                className={`block w-full text-left px-3 py-2 rounded transition text-sm ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
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
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  selectedTags.has(tag)
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            onClick={onClearFilters}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg font-medium transition text-sm"
          >
            Clear All
          </button>
        )}
      </div>
    </aside>
  );
}
