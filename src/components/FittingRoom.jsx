import { useState, useEffect, useRef } from 'react';

function FittingRoom({ products, onClose }) {
  // 1. Persist selected picks in localStorage
  const [picks, setPicks] = useState(() => {
    try {
      const saved = localStorage.getItem('fitting_room_picks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading fitting_room_picks from localStorage:', e);
    }
    return [];
  });

  const [apiKey, setApiKey] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Pointer events drag state for mobile/touch
  const [draggingProduct, setDraggingProduct] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dropZoneRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('fitting_room_picks', JSON.stringify(picks));
    } catch (e) {
      console.error('Error saving fitting_room_picks to localStorage:', e);
    }
  }, [picks]);

  const togglePick = (product) => {
    setPicks((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 5) return prev;
      return [...prev, product];
    });
  };

  const startOver = () => setPicks([]);

  // --- Desktop HTML5 Drag & Drop ---
  const handleDragStart = (e, product) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!dragOver) setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) togglePick(JSON.parse(data));
    } catch {
      // Ignored
    }
  };

  // --- Mobile & Touch Pointer Events Drag & Drop ---
  const handlePointerDown = (e, product) => {
    // Only handle primary pointer (left click or touch)
    if (e.button && e.button !== 0) return;

    setDraggingProduct(product);
    setDragPos({ x: e.clientX, y: e.clientY });

    const handlePointerMove = (moveEvent) => {
      setDragPos({ x: moveEvent.clientX, y: moveEvent.clientY });

      if (dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        const isInside =
          moveEvent.clientX >= rect.left &&
          moveEvent.clientX <= rect.right &&
          moveEvent.clientY >= rect.top &&
          moveEvent.clientY <= rect.bottom;
        setDragOver(isInside);
      }
    };

    const handlePointerUp = (upEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      setDragOver(false);
      setDraggingProduct(null);

      if (dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        const isInside =
          upEvent.clientX >= rect.left &&
          upEvent.clientX <= rect.right &&
          upEvent.clientY >= rect.top &&
          upEvent.clientY <= rect.bottom;

        if (isInside) {
          togglePick(product);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return (
    <div className="bg-[#f5f0eb] text-stone-900 rounded-3xl p-5 w-full shadow-2xl border border-[#e8e2d8]/80 select-none backdrop-blur-sm">
      {/* Floating Drag Ghost for Pointer Dragging (Mobile / Pointer) */}
      {draggingProduct && (
        <div
          className="fixed pointer-events-none z-50 w-20 h-20 rounded-xl overflow-hidden border-2 border-stone-800 shadow-2xl bg-white/95 backdrop-blur"
          style={{
            left: `${dragPos.x - 40}px`,
            top: `${dragPos.y - 40}px`,
            transform: 'scale(1.1)',
          }}
        >
          <img
            src={draggingProduct.image}
            alt={draggingProduct.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-stone-800 animate-pulse" />
          <h2 className="text-lg font-bold tracking-tight text-stone-900 font-serif">Fitting Room</h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eae4d9] hover:bg-[#dfd8ca] transition text-stone-600 hover:text-stone-900 cursor-pointer"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <p className="text-stone-600 text-xs mb-4">
        Tap an item below or drag garments onto the mannequin to try them on.
      </p>

      {/* Boutique Display Window: Model + Garment Layers Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative bg-gradient-to-b from-white via-[#faf8f5] to-[#f2ede6] rounded-2xl overflow-hidden mb-4 aspect-[3/4] transition-all duration-300 border border-[#e2dbcf] shadow-inner ${
          dragOver ? 'ring-2 ring-stone-900 bg-[#ebe4da] shadow-md scale-[1.01]' : ''
        }`}
      >
        {/* Soft Shadow Under Mannequin Feet */}
        <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 w-2/3 h-4 bg-stone-900/15 rounded-[100%] blur-md pointer-events-none" />

        {/* Base Mannequin */}
        <img
          src="/models/mannequin.svg"
          alt="Mannequin"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none p-2"
        />

        {/* Garment Layers */}
        {picks.map((p, index) => {
          const isTopMost = index === picks.length - 1;
          return (
            <img
              key={p.id}
              src={p.garment}
              alt={p.name}
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none p-2 transition-all duration-300 ${
                isTopMost ? 'scale-[1.01]' : 'opacity-95'
              }`}
              style={{
                zIndex: 10 + index,
                filter: isTopMost
                  ? 'drop-shadow(0 8px 14px rgba(28, 25, 23, 0.35)) drop-shadow(0 2px 4px rgba(28, 25, 23, 0.2))'
                  : 'drop-shadow(0 4px 8px rgba(28, 25, 23, 0.2))',
                animation: `garmentDrop 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              }}
            />
          );
        })}

        {/* Drop Message Overlay */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/30 backdrop-blur-xs z-50">
            <span className="text-stone-900 text-xs font-semibold bg-white/95 px-4 py-2 rounded-full shadow-lg border border-stone-200 animate-bounce">
              Release to wear
            </span>
          </div>
        )}

        {/* Empty State Tag */}
        {picks.length === 0 && !dragOver && (
          <div className="absolute bottom-3 left-0 right-0 text-center z-20 pointer-events-none">
            <span className="text-[11px] font-medium text-stone-600 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full inline-block border border-stone-200/80 shadow-xs">
              No garments applied
            </span>
          </div>
        )}
      </div>

      {/* Your picks section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-800 font-semibold uppercase tracking-wider">Your picks</span>
          <span className="text-xs text-stone-500 font-medium">{picks.length} / 5</span>
        </div>

        {picks.length === 0 ? (
          <p className="text-xs text-stone-500 italic">Select items below to style the mannequin</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {picks.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => togglePick(p)}
                className={`text-xs px-2.5 py-1 rounded-full transition flex items-center gap-1.5 border font-medium cursor-pointer shadow-xs ${
                  idx === picks.length - 1
                    ? 'bg-stone-900 text-stone-50 border-stone-900'
                    : 'bg-[#eae4d9] hover:bg-[#dfd8ca] text-stone-800 border-[#ddd6c8]'
                }`}
                title="Click to remove"
              >
                <span>{p.name.split(' ')[0]}</span>
                <span className={`${idx === picks.length - 1 ? 'text-stone-300 hover:text-white' : 'text-stone-500 hover:text-stone-900'}`}>×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {picks.length > 0 && picks.length < 5 && (
        <p className="text-[11px] text-stone-500 mb-3">
          Latest pick layered on top with active focus.
        </p>
      )}

      {/* API Key */}
      <div className="mb-3">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Virtual Stylist API Key"
          className="w-full bg-white/90 border border-[#dbd4c5] rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition placeholder:text-stone-400 shadow-xs"
        />
      </div>

      <button
        onClick={startOver}
        disabled={picks.length === 0}
        className="w-full text-xs bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2.5 rounded-xl transition-all duration-200 mb-4 shadow-sm hover:shadow cursor-pointer"
      >
        Reset Stylist Stage
      </button>

      {/* Choose a piece Selection Grid */}
      <div className="pt-3.5 border-t border-[#e2dcce]">
        <p className="text-xs text-stone-700 font-semibold mb-2.5 uppercase tracking-wider">Choose a piece:</p>
        <div className="grid grid-cols-5 gap-2">
          {products.map((p) => {
            const active = picks.find((x) => x.id === p.id);
            return (
              <button
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p)}
                onPointerDown={(e) => handlePointerDown(e, p)}
                onClick={() => togglePick(p)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing bg-white shadow-xs touch-none relative ${
                  active
                    ? 'border-stone-900 ring-2 ring-stone-900/20 scale-105'
                    : 'border-stone-200 hover:border-stone-400 hover:scale-105'
                }`}
                title={p.name}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
                {active && (
                  <div className="absolute inset-0 bg-stone-900/15 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-stone-900 ring-2 ring-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes garmentDrop {
          0% {
            opacity: 0;
            transform: translateY(-12px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default FittingRoom;
