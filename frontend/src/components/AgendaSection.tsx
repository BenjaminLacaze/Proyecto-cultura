import React from 'react';

interface AgendaSectionProps {
  onClose: () => void;
}

const AgendaSection: React.FC<AgendaSectionProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-6 panel-slide-up">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">
        
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors text-white z-10"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="bg-orange-500 text-white p-8 md:p-12 flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Agenda Cultural</h1>
          <p className="text-orange-100 text-lg">Talleres, eventos y festivales en la ciudad</p>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-8 md:p-12 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
          
          {/* Festivales */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Festivales Destacados</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="text-xl font-bold text-amber-900 mb-2">Fiesta Nacional de la Guitarra</h3>
                <p className="text-amber-800 font-medium mb-3">Celebración anual que rinde homenaje a Abel Fleury. Shows musicales, ferias y jineteada.</p>
                <div className="flex items-center gap-2 text-amber-700 text-sm font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Marzo (Primera quincena)</span>
                </div>
              </div>

              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                <h3 className="text-xl font-bold text-sky-900 mb-2">Fiesta de la Torta Argentina</h3>
                <p className="text-sky-800 font-medium mb-3">Concurso, degustaciones y espectáculos para celebrar nuestro patrimonio gastronómico.</p>
                <div className="flex items-center gap-2 text-sky-700 text-sm font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>25 de Mayo (Fechas patrias)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Talleres */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Talleres Culturales</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-700">Taller de Guitarra y Folclore</h3>
                  <p className="text-slate-500 text-sm">Clases para principiantes y avanzados.</p>
                </div>
                <div className="mt-3 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-emerald-600 text-center">
                  Martes y Jueves, 17:00 hs
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-700">Taller de Artes Plásticas</h3>
                  <p className="text-slate-500 text-sm">Pintura, dibujo y expresión creativa para todas las edades.</p>
                </div>
                <div className="mt-3 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-emerald-600 text-center">
                  Miércoles, 15:30 hs
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-700">Tango y Milonga</h3>
                  <p className="text-slate-500 text-sm">Aprende a bailar nuestra música ciudadana.</p>
                </div>
                <div className="mt-3 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-emerald-600 text-center">
                  Viernes, 19:00 hs
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AgendaSection;
