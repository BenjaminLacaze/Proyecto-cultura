import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import developerLogo from '../assets/developer-logo.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet with React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface CulturalPoint {
  id: number;
  title: string;
  category: string;
  position: [number, number];
  description: string;
  image: string;
}

export const points: CulturalPoint[] = [
  {
    id: 1,
    title: 'Teatro Municipal Unione',
    category: 'Teatro',
    position: [-36.3132, -57.6792],
    description: 'Uno de los teatros líricos más antiguos y bellos de la provincia, centro de la vida cultural dolorense.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: 'Museo Libres del Sur',
    category: 'Museo',
    position: [-36.3150, -57.6750],
    description: 'Museo histórico y de ciencias naturales, resguarda el patrimonio cultural y la historia de Dolores.',
    image: 'https://images.unsplash.com/photo-1518998053401-878c73fd5f17?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: 'Plaza Castelli',
    category: 'Punto Histórico',
    position: [-36.3110, -57.6780],
    description: 'Plaza principal de la ciudad, epicentro histórico y social rodeado por los edificios más importantes.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&q=80&w=400'
  }
];

const doloresBounds: L.LatLngBoundsExpression = [
  [-36.3600, -57.7300], // SouthWest
  [-36.2700, -57.6200]  // NorthEast
];

interface MapSectionProps {
  activePoint: CulturalPoint | null;
  setActivePoint: (point: CulturalPoint | null) => void;
}

function MapController({ activePoint }: { activePoint: CulturalPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (activePoint) {
      map.flyTo(activePoint.position, 17, { duration: 1.5 });
    }
  }, [activePoint, map]);
  return null;
}

const MapSection: React.FC<MapSectionProps> = ({ activePoint, setActivePoint }) => {

  return (
    // Mobile: altura = pantalla menos la navbar (~56px)
    // Desktop: altura = pantalla completa (la navbar es sidebar lateral)
    <div className="relative w-full h-[calc(100svh-56px)] md:h-screen bg-slate-200">
      <MapContainer
        center={[-36.3132, -57.6792]}
        zoom={15}
        minZoom={13}
        maxBounds={doloresBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController activePoint={activePoint} />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={point.position}
            eventHandlers={{
              click: () => setActivePoint(point),
            }}
          />
        ))}
      </MapContainer>

      {/* ── MOBILE: bottom sheet ── */}
      {activePoint && (
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-[20] bg-white rounded-t-2xl shadow-2xl overflow-hidden transition-all duration-300 max-h-[65vh] flex flex-col">
          {/* Drag handle visual */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>
          <div className="relative h-40 w-full flex-shrink-0">
            <img
              src={activePoint.image}
              alt={activePoint.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setActivePoint(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-grow">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1 block">
              {activePoint.category}
            </span>
            <h4 className="text-xl font-extrabold text-slate-800 mb-2">{activePoint.title}</h4>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {activePoint.description}
            </p>
            <div className="mb-2">
              <h5 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">Galería</h5>
              <div className="grid grid-cols-2 gap-2">
                <img src={activePoint.image} alt="Vista 1" className="w-full h-20 object-cover rounded-lg shadow-sm" />
                <img src="https://images.unsplash.com/photo-1518998053401-878c73fd5f17?auto=format&fit=crop&q=80&w=400" alt="Vista 2" className="w-full h-20 object-cover rounded-lg shadow-sm" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Desarrollado por</span>
              <img src={developerLogo} alt="Logo del Desarrollador" className="h-5 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP: floating card left (original) ── */}
      {activePoint && (
        <div className="hidden md:block absolute top-8 left-8 z-[20] w-80 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform translate-y-0">
          <div className="relative h-48 w-full">
            <img
              src={activePoint.image}
              alt={activePoint.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1 block">
              {activePoint.category}
            </span>
            <h4 className="text-xl font-bold text-slate-800 mb-2">{activePoint.title}</h4>
            <p className="text-sm text-slate-600 mb-4 line-clamp-3">
              {activePoint.description}
            </p>
            <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-sm">
              Ver más detalles
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP: detailed info card right (original) ── */}
      {activePoint && (
        <div className="hidden md:flex absolute top-8 right-8 z-[20] w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform translate-y-0 flex-col max-h-[85vh]">
          <div className="relative h-56 w-full flex-shrink-0">
            <img
              src={activePoint.image}
              alt={activePoint.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setActivePoint(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 block">
              {activePoint.category}
            </span>
            <h4 className="text-2xl font-extrabold text-slate-800 mb-3">{activePoint.title}</h4>

            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              {activePoint.description}
            </p>

            <div className="mb-2">
              <h5 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Galería</h5>
              <div className="grid grid-cols-2 gap-2">
                <img src={activePoint.image} alt="Vista 1" className="w-full h-24 object-cover rounded-lg shadow-sm" />
                <img src="https://images.unsplash.com/photo-1518998053401-878c73fd5f17?auto=format&fit=crop&q=80&w=400" alt="Vista 2" className="w-full h-24 object-cover rounded-lg shadow-sm" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Desarrollado por</span>
              <img src={developerLogo} alt="Logo del Desarrollador" className="h-6 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSection;
