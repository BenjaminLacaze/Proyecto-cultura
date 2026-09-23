import React, { useState, useEffect, useRef } from 'react';

const FONT_SIZES = [
  { label: 'Pequeño',    value: 13 },
  { label: 'Normal',     value: 16 },
  { label: 'Grande',     value: 19 },
  { label: 'Muy grande', value: 22 },
];
const DEFAULT_FONT_SIZE = 16;
const STORAGE_KEY = 'polo-settings-fontsize';

const SettingsPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : DEFAULT_FONT_SIZE;
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Aplicar tamaño al root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem(STORAGE_KEY, String(fontSize));
  }, [fontSize]);

  // Cerrar con click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">

      {/* ── Panel ── */}
      <div
        className={`
          bg-white rounded-2xl shadow-2xl border border-slate-100 w-72 overflow-hidden
          transition-all duration-300 ease-in-out origin-bottom-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="bg-orange-500 px-5 py-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-semibold text-base tracking-tight">Configuración</span>
        </div>

        <div className="p-5 flex flex-col gap-5">

          {/* ── Tamaño de fuente ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-700 font-medium text-sm">Tamaño de fuente</span>
              <span className="text-orange-500 font-bold text-sm bg-orange-50 px-2 py-0.5 rounded-full">
                {fontSize}px
              </span>
            </div>

            {/* Botones preset */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`
                    py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    ${fontSize === size.value
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600'
                    }
                  `}
                >
                  {size.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min={12}
              max={24}
              step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>A</span>
              <span className="text-lg font-bold">A</span>
            </div>
          </div>

          {/* ── Restablecer ── */}
          <button
            onClick={() => setFontSize(DEFAULT_FONT_SIZE)}
            className="w-full py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:border-orange-300 hover:text-orange-500 transition-colors"
          >
            Restablecer
          </button>
        </div>
      </div>

      {/* ── FAB engranaje ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir configuración"
        className={`
          w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg
          flex items-center justify-center
          hover:bg-orange-600 active:scale-95
          transition-all duration-300 pointer-events-auto
          ${open ? 'shadow-orange-300 ring-4 ring-orange-200' : ''}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-7 w-7 transition-transform duration-500 ${open ? 'rotate-90' : 'rotate-0'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default SettingsPanel;
