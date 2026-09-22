import React, { useState } from 'react';
import { points } from './MapSection';
import type { CulturalPoint } from './MapSection';
import culturaLogo from '../assets/cultura-logo.png';

interface NavbarProps {
  onPointSelect: (point: CulturalPoint) => void;
}

// Configuración de cada sección
const SECTIONS = [
  {
    key: 'encuentro' as const,
    label: 'Puntos de Encuentro',
    header:    'text-orange-500',
    headerBg:  'bg-orange-50',
    border:    'border-orange-300',
    itemText:  'text-orange-600',
    itemHover: 'hover:bg-orange-50 hover:border-orange-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a7 7 0 0 1 7 7c0 4.5-7 13-7 13S5 13.5 5 9a7 7 0 0 1 7-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
      </svg>
    ),
  },
  {
    key: 'interes' as const,
    label: 'Sitios de Interés',
    header:    'text-sky-500',
    headerBg:  'bg-sky-50',
    border:    'border-sky-300',
    itemText:  'text-sky-600',
    itemHover: 'hover:bg-sky-50 hover:border-sky-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3Zm-.75 4.5h1.5v1.5h-1.5V7.5Zm0 3h1.5V16.5h-1.5V10.5Z"/>
      </svg>
    ),
  },
  {
    key: 'plazas' as const,
    label: 'Plazas',
    header:    'text-emerald-500',
    headerBg:  'bg-emerald-50',
    border:    'border-emerald-300',
    itemText:  'text-emerald-600',
    itemHover: 'hover:bg-emerald-50 hover:border-emerald-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1c.57.55 1.23 1 2.03 1 2.37 0 2.95-2.5 5.26-2.5 1.26 0 2.15.84 3.5.84 2.5 0 4.5-2.5 4.5-5.34C22 9.5 19.88 7.22 17 8Zm-1.45 9.5c-1.29 0-2.01-.84-3.5-.84-2.37 0-2.85 2.5-5.26 2.5-.26 0-.49-.06-.71-.14C7.22 16.74 9.39 12.06 17 10.04c1.44-.38 2.97.5 2.97 2.46 0 2.12-2.12 5-4.42 5Z"/>
      </svg>
    ),
  },
];

// Agrupa los puntos por sección
const groupedPoints = (sectionKey: typeof SECTIONS[number]['key']) =>
  points.filter((p) => p.section === sectionKey);

// Sub-componente: lista de puntos de una sección (reutilizable)
const SectionList: React.FC<{
  section: typeof SECTIONS[number];
  onSelect: (p: CulturalPoint) => void;
}> = ({ section, onSelect }) => {
  const items = groupedPoints(section.key);
  if (items.length === 0) return null;
  return (
    <div>
      {/* Cabecera de sección */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-1 ${section.headerBg}`}>
        <span className={section.header}>{section.icon}</span>
        <span className={`text-xs font-bold uppercase tracking-widest ${section.header}`}>
          {section.label}
        </span>
      </div>
      {/* Items */}
      <ul className="flex flex-col gap-0.5 mb-2">
        {items.map((point) => (
          <li key={point.id}>
            <button
              onClick={() => onSelect(point)}
              className={`
                group w-full flex items-center gap-2 text-left
                ${section.itemText} ${section.itemHover}
                transition-all px-3 py-2 rounded-xl text-sm font-medium
                border border-transparent
              `}
            >
              <span className="text-base font-bold leading-none flex-shrink-0 group-hover:translate-x-0.5 transition-transform">›</span>
              <span className="truncate">{point.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onPointSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePointSelect = (point: CulturalPoint) => {
    onPointSelect(point);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white text-slate-800 shadow-md border-b border-orange-100 sticky top-0 z-50 w-full md:w-64 md:flex-shrink-0 md:min-h-screen md:static md:border-b-0 md:border-r md:border-slate-200 md:shadow-lg">

      {/* ── MOBILE: top bar ── */}
      <div className="flex md:hidden items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-3">
          <img
            src={culturaLogo}
            alt="Dolores Ciudad Cultural"
            className="w-10 h-10 object-contain rounded-lg ring-2 ring-orange-300"
            draggable={false}
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight text-orange-500">
              Polo Digital
            </span>
            <span className="text-xs text-slate-400 font-medium">Dolores</span>
          </div>
        </div>

        <button
          className="flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-orange-50 transition-colors focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-orange-500 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-orange-400 my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-orange-500 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* ── MOBILE: dropdown ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pb-4 border-t border-orange-100 pt-3 flex flex-col gap-1 bg-white">
          {/* Nav links */}
          <a href="#" className="flex items-center gap-2 text-orange-500 font-semibold hover:bg-orange-50 px-3 py-2 rounded-md text-sm" onClick={() => setMenuOpen(false)}>
            <span className="font-bold text-base leading-none">›</span> Agenda
          </a>
          <a href="#" className="flex items-center gap-2 text-amber-500 font-semibold hover:bg-amber-50 px-3 py-2 rounded-md text-sm" onClick={() => setMenuOpen(false)}>
            <span className="font-bold text-base leading-none">›</span> Contacto
          </a>

          {/* Divisor */}
          <div className="my-2 h-px bg-slate-100" />

          {/* Tres secciones */}
          {SECTIONS.map((section) => (
            <SectionList key={section.key} section={section} onSelect={handlePointSelect} />
          ))}
        </div>
      </div>

      {/* ── DESKTOP: sidebar ── */}
      <div className="hidden md:flex flex-col h-full p-4 sm:p-5 overflow-y-auto">

        {/* Logo */}
        <div className="flex flex-col items-center justify-center pb-5 mb-1">
          <div className="p-1.5 rounded-2xl ring-2 ring-orange-300 mb-3 bg-orange-50">
            <img src={culturaLogo} alt="Dolores Ciudad Cultural" className="w-20 h-auto object-contain rounded-xl" draggable={false} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-orange-500 text-center leading-tight">
            Polo Digital
          </span>
          <span className="text-slate-400 text-sm font-medium mt-0.5">Dolores</span>
          {/* Divisor decorativo */}
          <div className="mt-4 w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-orange-200" />
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <div className="flex-1 h-px bg-orange-200" />
          </div>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1 mb-4">
          <a href="#" className="group flex items-center gap-2 text-orange-500 font-semibold hover:bg-orange-50 transition-colors px-3 py-2.5 rounded-xl text-base border border-transparent hover:border-orange-200">
            <span className="font-bold text-lg leading-none group-hover:translate-x-0.5 transition-transform">›</span>
            Agenda
          </a>
          <a href="#" className="group flex items-center gap-2 text-amber-500 font-semibold hover:bg-amber-50 transition-colors px-3 py-2.5 rounded-xl text-base border border-transparent hover:border-amber-200">
            <span className="font-bold text-lg leading-none group-hover:translate-x-0.5 transition-transform">›</span>
            Contacto
          </a>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Tres secciones */}
        <div className="flex flex-col gap-3">
          {SECTIONS.map((section) => (
            <SectionList key={section.key} section={section} onSelect={onPointSelect} />
          ))}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
