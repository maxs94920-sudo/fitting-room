import { useState, useEffect, useRef } from 'react';

function ProductCard({ product, index = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likedPopped, setLikedPopped] = useState(false);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined');
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const element = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (element) observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleToggleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikedPopped(true);
    setTimeout(() => setLikedPopped(false), 300);
  };

  const isSale = Boolean(product.oldPrice);

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: isVisible ? `${(index % 6) * 75}ms` : '0ms',
      }}
      className={`group relative bg-neutral-900/90 border border-neutral-800/80 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:border-neutral-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className={`absolute top-3 left-3 z-10 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm uppercase tracking-wider ${
            isSale || product.badge.toLowerCase().includes('sale')
              ? 'bg-rose-500/90 text-white animate-[pulseSubtle_2.5s_infinite_ease-in-out]'
              : 'bg-neutral-900/80 text-neutral-200 border border-neutral-700/60'
          }`}
        >
          {product.badge}
        </span>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleToggleLike}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900/70 backdrop-blur-md border border-neutral-700/50 hover:bg-neutral-800/90 transition-all duration-200 cursor-pointer group/heart"
        aria-label="Add to favorites"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={liked ? '#ef4444' : 'none'}
          stroke={liked ? '#ef4444' : 'currentColor'}
          strokeWidth="2"
          className={`w-4 h-4 text-neutral-300 transition-transform duration-300 ${
            likedPopped ? 'scale-125' : 'group-hover/heart:scale-110'
          }`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image Container */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-900 relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Details */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-medium text-neutral-200 line-clamp-2 flex-1 group-hover:text-white transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 bg-neutral-800/60 px-1.5 py-0.5 rounded-md border border-neutral-700/40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" className="w-3 h-3">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-semibold text-neutral-200">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base text-white font-semibold">${product.price}</span>
          {product.oldPrice && (
            <>
              <span className="text-neutral-500 text-xs line-through">${product.oldPrice}</span>
              <span className="text-xs text-emerald-400 font-medium">
                {Math.round((1 - product.price / product.oldPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulseSubtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
