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
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* پنل Fitting Room - چپ */}
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

        {/* گرید محصولات - راست */}
        <main className="flex-1 order-1 lg:order-2">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">New Arrivals</h1>
            <p className="text-neutral-400 text-sm mt-1">
              {visibleProducts.length} products
            </p>
          </header>

          <div className="mb-4">
            {!showFittingRoom && (
              <button
                onClick={() => setShowFittingRoom(true)}
                className="text-xs text-neutral-400 hover:text-white transition mb-3 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Open Fitting room
              </button>
            )}
          </div>

          <Filters
            activeFilters={{ ...filters, sort }}
            onSortChange={setSort}
            onFilterChange={setFilters}
          />

          {visibleProducts.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              محصولی با این فیلتر پیدا نشد
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
