import { useState } from 'react';

function Filters({ onSortChange, onFilterChange, activeFilters }) {
  const [showPanel, setShowPanel] = useState(false);

  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

  const toggleCategory = (category) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter((c) => c !== category)
      : [...activeFilters.categories, category];

    onFilterChange({ ...activeFilters, categories: newCategories });
  };

  const resetFilters = () => {
    onFilterChange({ categories: [], priceRange: null });
    onSortChange('Newest');
  };

  const hasActiveFilters =
    activeFilters.categories.length > 0 || activeFilters.priceRange !== null;

  return (
    <div className="mb-6">
      {/* نوار بالای فیلتر */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-sm transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </button>

        <select
          value={activeFilters.sort || 'Newest'}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-neutral-900 hover:bg-neutral-800 rounded-lg text-sm px-3 py-2 outline-none cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* پنل کشویی فیلترها */}
      {showPanel && (
        <div className="bg-neutral-900 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Categories</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-neutral-400 hover:text-white transition flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['Coats', 'Jackets', 'Denim', 'Leather', 'Bomber'].map((cat) => {
              const active = activeFilters.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-full transition ${
                    active
                      ? 'bg-white text-black'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters;
