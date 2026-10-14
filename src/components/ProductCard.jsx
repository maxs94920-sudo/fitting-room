import { useState } from 'react';

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative bg-neutral-900 rounded-2xl overflow-hidden transition-all hover:bg-neutral-800">
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-neutral-800/90 backdrop-blur text-xs text-white px-2 py-1 rounded-full">
          {product.badge}
        </span>
      )}

      {/* دکمه علاقه‌مندی */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800/80 backdrop-blur hover:bg-neutral-700 transition"
        aria-label="Add to favorites"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={liked ? '#ef4444' : 'none'}
          stroke={liked ? '#ef4444' : 'currentColor'}
          strokeWidth="2"
          className="w-4 h-4 text-neutral-300"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* تصویر */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* اطلاعات */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm text-neutral-200 line-clamp-2 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" className="w-3.5 h-3.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs text-neutral-300">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">${product.price}</span>
          {product.oldPrice && (
            <>
              <span className="text-neutral-500 text-xs line-through">${product.oldPrice}</span>
              <span className="text-xs text-green-400">
                {Math.round((1 - product.price / product.oldPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
