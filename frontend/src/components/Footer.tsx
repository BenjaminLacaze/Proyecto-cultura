import React from 'react';
import developerLogo from '../assets/developer-logo.png';
const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Polo Digital Dolores</h3>
            <p className="text-slate-600 text-sm">
              Una plataforma cultural interactiva para descubrir los espacios, eventos y patrimonio de la ciudad de Dolores.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Secretaría de Cultura</li>
              <li>Municipalidad de Dolores</li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>info@polodigitaldolores.gob.ar</li>
              <li>+54 2245 123456</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className="text-slate-400 hover:text-slate-600">Instagram</a>
                <a href="#" className="text-slate-400 hover:text-slate-600">Facebook</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-300 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Municipalidad de Dolores. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-2">
            <span>Desarrollado por</span>
            <img src={developerLogo} alt="Logo del Desarrollador" className="h-8 w-auto object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
