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
    <div className="bg-[#f5f0eb] text-stone-900 rounded-2xl p-4 w-full shadow-lg border border-[#e8e2d8] select-none">
      {/* Floating Drag Ghost for Pointer Dragging (Mobile / Pointer) */}
      {draggingProduct && (
        <div
          className="fixed pointer-events-none z-50 w-20 h-20 rounded-xl overflow-hidden border-2 border-stone-800 shadow-2xl bg-white/90 backdrop-blur"
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
        <h2 className="text-lg font-semibold text-stone-900">Fitting room</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eae4d9] hover:bg-[#dfd8ca] transition text-stone-600 hover:text-stone-900"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <p className="text-stone-600 text-xs mb-4">
        Tap the hanger or drag onto the mannequin to wear it.
      </p>

      {/* Model + Garment Layers Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative bg-[#eae5dc] rounded-xl overflow-hidden mb-4 aspect-[3/4] transition-all border border-[#dcd5c9] ${
          dragOver ? 'ring-2 ring-stone-800 bg-[#dfd8cb] shadow-inner' : ''
        }`}
      >
        {/* Base Mannequin */}
        <img
          src="/models/mannequin.svg"
          alt="Mannequin"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Garment Layers */}
        {picks.map((p, index) => (
          <img
            key={p.id}
            src={p.garment}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-500"
            style={{
              zIndex: 10 + index,
              animation: `fadeIn 0.5s ease-out`,
            }}
          />
        ))}

        {/* Drop Message Overlay */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs z-50">
            <span className="text-white text-xs font-semibold bg-stone-900/80 px-3 py-1.5 rounded-full shadow">
              Drop to wear
            </span>
          </div>
        )}

        {/* Empty State Tag */}
        {picks.length === 0 && !dragOver && (
          <div className="absolute bottom-3 left-0 right-0 text-center z-20">
            <span className="text-[11px] text-stone-600 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full inline-block border border-stone-200/60 shadow-xs">
              انتخاب نکردی
            </span>
          </div>
        )}
      </div>

      {/* Your picks section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-700 font-medium">Your picks</span>
          <span className="text-xs text-stone-500">{picks.length} pieces</span>
        </div>

        {picks.length === 0 ? (
          <p className="text-xs text-stone-500 italic">هنوز چیزی انتخاب نکردی</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {picks.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePick(p)}
                className="text-xs bg-[#eae4d9] hover:bg-[#dfd8ca] text-stone-800 px-2.5 py-1 rounded-full transition flex items-center gap-1 border border-[#ddd6c8] font-medium"
                title="برای حذف کلیک کن"
              >
                {p.name.split(' ')[0]}
                <span className="text-stone-500 hover:text-stone-900 ml-0.5">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {picks.length > 0 && picks.length < 5 && (
        <p className="text-[11px] text-stone-500 mb-3">
          Add another piece and it goes on top.
        </p>
      )}

      {/* API Key */}
      <div className="mb-3">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Your API key"
          className="w-full bg-white border border-[#dbd4c5] rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-400 transition placeholder:text-stone-400"
        />
      </div>

      <button
        onClick={startOver}
        disabled={picks.length === 0}
        className="w-full text-xs bg-[#2a2723] hover:bg-[#3d3934] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition mb-4 shadow-xs"
      >
        Start over
      </button>

      {/* Choose a piece Selection Grid */}
      <div className="pt-4 border-t border-[#e2dcce]">
        <p className="text-xs text-stone-600 font-medium mb-2">Choose a piece:</p>
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
                className={`aspect-square rounded-lg overflow-hidden border-2 transition cursor-grab active:cursor-grabbing bg-white shadow-xs touch-none ${
                  active
                    ? 'border-stone-900 ring-2 ring-stone-900/20'
                    : 'border-transparent hover:border-stone-400'
                }`}
                title={p.name}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default FittingRoom;
