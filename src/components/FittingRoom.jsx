import { useState } from 'react';

function FittingRoom({ products, onClose }) {
  const [picks, setPicks] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const togglePick = (product) => {
    setPicks((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 5) return prev;
      return [...prev, product];
    });
  };

  const startOver = () => setPicks([]);

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
    } catch (err) {}
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 w-full">
      {/* هدر */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Fitting room</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition text-neutral-400 hover:text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <p className="text-neutral-400 text-xs mb-4">
        Tap the hanger or drag onto the mannequin to wear it.
      </p>

      {/* مدل + لایه‌های لباس */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative bg-neutral-800 rounded-xl overflow-hidden mb-4 aspect-[3/4] transition-all ${
          dragOver ? 'ring-2 ring-white/70 bg-neutral-700' : ''
        }`}
      >
        {/* مدل پایه */}
        <img
          src="/models/mannequin.svg"
          alt="Mannequin"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* لایه‌های لباس — ترتیب: لایه‌های قدیمی‌تر زیر، جدید روی */}
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

        {/* پیام Drop */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <span className="text-white text-sm font-medium">Drop to wear</span>
          </div>
        )}

        {/* اگر خالی */}
        {picks.length === 0 && !dragOver && (
          <div className="absolute bottom-3 left-0 right-0 text-center z-20">
            <span className="text-[11px] text-neutral-500 bg-neutral-900/70 px-3 py-1 rounded-full inline-block">
              انتخاب نکردی
            </span>
          </div>
        )}
      </div>

      {/* Your picks */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-400">Your picks</span>
          <span className="text-xs text-neutral-500">{picks.length} pieces</span>
        </div>

        {picks.length === 0 ? (
          <p className="text-xs text-neutral-600 italic">هنوز چیزی انتخاب نکردی</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {picks.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePick(p)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded-full transition flex items-center gap-1"
                title="برای حذف کلیک کن"
              >
                {p.name.split(' ')[0]}
                <span className="text-neutral-500">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {picks.length > 0 && picks.length < 5 && (
        <p className="text-[11px] text-neutral-500 mb-3">
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
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-neutral-500 transition"
        />
      </div>

      <button
        onClick={startOver}
        disabled={picks.length === 0}
        className="w-full text-xs bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 rounded-lg transition mb-4"
      >
        Start over
      </button>

      {/* گرید انتخاب */}
      <div className="pt-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-400 mb-2">Choose a piece:</p>
        <div className="grid grid-cols-5 gap-2">
          {products.map((p) => {
            const active = picks.find((x) => x.id === p.id);
            return (
              <button
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p)}
                onClick={() => togglePick(p)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition cursor-grab active:cursor-grabbing ${
                  active ? 'border-white' : 'border-transparent hover:border-neutral-600'
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
