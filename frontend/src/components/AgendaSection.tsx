import React from 'react';
import defaultAgendaData from '../data/agenda.json';

interface Festival {
  id?: number;
  title: string;
  description: string;
  date: string;
  color?: string;
  icon?: string;
  logo?: string;
}

interface Workshop {
  id?: number;
  title: string;
  description: string;
  schedule: string;
  icon?: string;
  logo?: string;
}

interface AgendaData {
  title?: string;
  subtitle?: string;
  festivals?: Festival[];
  workshops?: Workshop[];
}

interface AgendaSectionProps {
  onClose: () => void;
}

const AgendaSection: React.FC<AgendaSectionProps> = ({ onClose }) => {
  const data: AgendaData = defaultAgendaData;

  const festivals = data.festivals || [];
  const workshops = data.workshops || [];

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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            {data.title || 'Agenda Cultural'}
          </h1>
          <p className="text-orange-100 text-lg">
            {data.subtitle || 'Talleres, eventos y festivales en la ciudad'}
          </p>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-8 md:p-12 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
          
          {/* Festivales */}
          {festivals.length > 0 && (
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
                {festivals.map((fest, idx) => {
                  const isSky = fest.color === 'sky' || idx % 2 === 1;
                  const bgClass = isSky ? 'bg-sky-50 border-sky-100' : 'bg-amber-50 border-amber-100';
                  const titleClass = isSky ? 'text-sky-900' : 'text-amber-900';
                  const descClass = isSky ? 'text-sky-800' : 'text-amber-800';
                  const dateClass = isSky ? 'text-sky-700' : 'text-amber-700';

                  return (
                    <div key={fest.id || idx} className={`p-6 rounded-2xl border ${bgClass}`}>
                      <div className="flex items-center gap-3 mb-2 min-w-0">
                        {fest.logo ? (
                          <img src={fest.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm shrink-0 bg-white" />
                        ) : fest.icon ? (
                          <span className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-xl shadow-sm shrink-0">{fest.icon}</span>
                        ) : null}
                        <h3 className={`text-xl font-bold leading-tight break-words min-w-0 ${titleClass}`}>{fest.title}</h3>
                      </div>
                      <p className={`font-medium mb-3 ${descClass}`}>{fest.description}</p>
                      {fest.date && (
                        <div className={`flex items-center gap-2 text-sm font-bold ${dateClass}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{fest.date}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Talleres */}
          {workshops.length > 0 && (
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
                {workshops.map((taller, idx) => (
                  <div key={taller.id || idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {taller.logo ? (
                        <img src={taller.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-white" />
                      ) : taller.icon ? (
                        <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm shrink-0">{taller.icon}</span>
                      ) : null}
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-slate-700">{taller.title}</h3>
                        <p className="text-slate-500 text-sm">{taller.description}</p>
                      </div>
                    </div>
                    {taller.schedule && (
                      <div className="mt-2 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-emerald-600 text-center md:whitespace-nowrap">
                        {taller.schedule}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default AgendaSection;
