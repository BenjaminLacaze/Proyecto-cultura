import React from 'react';
import { points } from './MapSection';
import type { CulturalPoint } from './MapSection';
import culturaLogo from '../assets/cultura-logo.png';

interface NavbarProps {
  onPointSelect: (point: CulturalPoint) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPointSelect }) => {
  return (
    <nav className="bg-orange-500 text-white shadow-md w-64 flex-shrink-0 min-h-screen sticky top-0 left-0">
      <div className="p-4 sm:p-6">
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
