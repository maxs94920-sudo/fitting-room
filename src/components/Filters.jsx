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
    <div className="sticky top-0 z-30 mb-6 py-2.5 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 transition-all">
      {/* Filters top bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
            showPanel || hasActiveFilters
              ? 'bg-neutral-800 text-white border-neutral-600 shadow-sm'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          )}
        </button>

        <div className="relative">
          <select
            value={activeFilters.sort || 'Newest'}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl px-3.5 py-2 pr-8 outline-none cursor-pointer transition appearance-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-neutral-900 text-neutral-200">{opt}</option>
            ))}
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Filter drawer with smooth height transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showPanel ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Categories</span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-stone-400 hover:text-stone-100 transition flex items-center gap-1 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Reset
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
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#f5f0eb] text-stone-900 border-[#f5f0eb] shadow-md font-semibold'
                        : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60 hover:bg-neutral-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
