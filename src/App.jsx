import { useState, useMemo } from 'react';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import FittingRoom from './components/FittingRoom';
import { products } from './data/products';

const categoryKeywords = {
  Coats: ['Coat'],
  Jackets: ['Jacket', 'Jackets'],
  Denim: ['Denim'],
  Leather: ['Leather'],
  Bomber: ['Bomber'],
};

function App() {
  const [sort, setSort] = useState('Newest');
  const [filters, setFilters] = useState({ categories: [], priceRange: null });
  const [showFittingRoom, setShowFittingRoom] = useState(true);

  const visibleProducts = useMemo(() => {
    let result = [...products];

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.some((cat) =>
          categoryKeywords[cat]?.some((kw) => p.name.includes(kw))
        )
      );
    }

    switch (sort) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Top Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [sort, filters]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-[#f5f0eb] selection:text-stone-900 relative overflow-x-hidden">
      {/* Background Radial Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Fitting Room Panel - Left on Desktop */}
          {showFittingRoom && (
            <aside className="lg:w-80 lg:shrink-0 order-2 lg:order-1">
              <div className="lg:sticky lg:top-6">
                <FittingRoom
                  products={products}
                  onClose={() => setShowFittingRoom(false)}
                />
              </div>
            </aside>
          )}

          {/* Product Grid - Right on Desktop */}
          <main className="flex-1 order-1 lg:order-2 min-w-0">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Curated Collection</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif mt-0.5 text-stone-100">
                  New Arrivals
                </h1>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm font-medium">
                Showing <span className="text-white font-bold">{visibleProducts.length}</span> luxury pieces
              </p>
            </header>

            <div className="mb-4">
              {!showFittingRoom && (
                <button
                  onClick={() => setShowFittingRoom(true)}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 transition cursor-pointer shadow-sm mb-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Open Fitting Room Studio
                </button>
              )}
            </div>

            <Filters
              activeFilters={{ ...filters, sort }}
              onSortChange={setSort}
              onFilterChange={setFilters}
            />

            {visibleProducts.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800/80 text-neutral-400">
                <p className="text-base font-medium">No products match your selected filters.</p>
                <p className="text-xs text-neutral-500 mt-1">Try resetting category filters to view all items.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
