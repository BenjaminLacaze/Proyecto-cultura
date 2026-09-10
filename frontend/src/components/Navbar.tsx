import React, { useState } from 'react';
import { points } from './MapSection';
import type { CulturalPoint } from './MapSection';
import culturaLogo from '../assets/cultura-logo.png';

interface NavbarProps {
  onPointSelect: (point: CulturalPoint) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPointSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePointSelect = (point: CulturalPoint) => {
    onPointSelect(point);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50 w-full md:w-64 md:flex-shrink-0 md:min-h-screen md:static">

      {/* ── MOBILE: top bar with hamburger ── */}
      <div className="flex md:hidden items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-3">
          <img
            src={culturaLogo}
            alt="Dolores Ciudad Cultural"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <span className="font-bold text-lg leading-tight tracking-tight text-white">
            Polo Digital<br />
            <span className="font-normal text-orange-100 text-sm">Dolores</span>
          </span>
        </div>

        <button
          className="flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-orange-600 transition-colors focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* ── MOBILE: dropdown menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 border-t border-orange-400 pt-3 flex flex-col space-y-1">
          <a href="#" className="text-white hover:bg-orange-600 transition-colors px-3 py-2 rounded-md text-base font-medium" onClick={() => setMenuOpen(false)}>
            Agenda
          </a>
          <a href="#" className="text-white hover:bg-orange-600 transition-colors px-3 py-2 rounded-md text-base font-medium" onClick={() => setMenuOpen(false)}>
            Contacto
          </a>
          <div className="pt-2 border-t border-orange-400 mt-2">
            <h3 className="text-sm font-semibold text-orange-200 uppercase tracking-wider px-3 mb-2">Puntos Destacados</h3>
            <ul className="flex flex-col space-y-1">
              {points.map((point) => (
                <li key={point.id}>
                  <button
                    onClick={() => handlePointSelect(point)}
                    className="w-full flex items-center text-left text-orange-100 hover:text-white hover:bg-orange-600 transition-colors px-3 py-2 rounded-md text-sm"
                  >
                    <span className="truncate">{point.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: original left sidebar ── */}
      <div className="hidden md:block p-4 sm:p-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col items-center justify-center border-b border-orange-400 pb-6">
            <img src={culturaLogo} alt="Dolores Ciudad Cultural" className="w-24 h-auto mb-4 object-contain rounded-lg" />
            <span className="font-bold text-2xl tracking-tight text-white text-center">
              Polo Digital
              <br />
              <span className="text-white">Dolores</span>
            </span>
          </div>
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-white hover:bg-orange-600 transition-colors px-3 py-2 rounded-md text-base font-medium">Agenda</a>
            <a href="#" className="text-white hover:bg-orange-600 transition-colors px-3 py-2 rounded-md text-base font-medium">Contacto</a>
          </div>

          <div className="pt-6 border-t border-orange-400">
            <h3 className="text-lg font-semibold text-white mb-4 px-3">Puntos Destacados</h3>
            <ul className="flex flex-col space-y-2">
              {points.map((point) => (
                <li key={point.id}>
                  <button
                    onClick={(e) => { e.preventDefault(); onPointSelect(point); }}
                    className="w-full flex items-center text-left text-orange-100 hover:text-white hover:bg-orange-600 transition-colors px-3 py-2 rounded-md text-sm"
                  >
                    <span className="truncate">{point.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
