import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  section: 'encuentro' | 'interes' | 'plazas';
  position: [number, number];
  description: string;
  image: string;
}

import pointsData from '../data/points.json';

export const points: CulturalPoint[] = pointsData as CulturalPoint[];

const doloresBounds: L.LatLngBoundsExpression = [
  [-36.3600, -57.7300],
  [-36.2700, -57.6200]
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

// ── Carousel de información ────────────────────────────────
const PointInfoPanel: React.FC<{
  point: CulturalPoint;
  onClose: () => void;
}> = ({ point, onClose }) => {
  const [activeCard, setActiveCard] = useState(0);
  const CARD_COUNT = 3;

  const prev = () => setActiveCard(c => Math.max(0, c - 1));
  const next = () => setActiveCard(c => Math.min(CARD_COUNT - 1, c + 1));

  // Resetear al cambiar de punto
  useEffect(() => { setActiveCard(0); }, [point.id]);

  // Navegación con teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Swipe táctil para móvil
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50)       next();
    else if (delta < -50) prev();
  };

  // Posición y escala de cada card según distancia al centro
  const getCardStyle = (idx: number): React.CSSProperties => {
    const distance = idx - activeCard;
    if (Math.abs(distance) > 1) {
      return {
        position: 'absolute', opacity: 0, pointerEvents: 'none',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', zIndex: 0,
      };
    }
    const isCenter = distance === 0;
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) translateX(calc(${distance} * var(--carousel-offset))) scale(${isCenter ? 1 : 0.22})`,
      transformOrigin: 'center center',
      zIndex: isCenter ? 10 : 5,
      opacity: isCenter ? 1 : 0.55,
      transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      cursor: !isCenter ? 'pointer' : 'default',
      pointerEvents: 'auto',
    };
  };

  const cardClass = 'w-[93vw] md:w-[660px] bg-white rounded-2xl shadow-2xl';
  const cardStyle: React.CSSProperties = { height: 'clamp(360px, 85vh, 900px)' };

  const cards = [
    <div key="card1" className={cardClass} style={cardStyle} />,
    <div key="card2" className={cardClass} style={cardStyle} />,
    <div key="card3" className={cardClass} style={cardStyle} />,
  ];

  // Icono de flecha SVG
  const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
    </svg>
  );
  const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
    </svg>
  );

  return (
    <div className="panel-slide-up absolute inset-0 z-[20] flex flex-col overflow-hidden">

      {/* Fondo difuminado */}
      <div className="absolute inset-0">
        <img
          src={point.image}
          alt=""
          draggable={false}
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'blur(32px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/80" />
      </div>

      {/* Header compacto */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <div>
          <span className="text-orange-300 text-xs font-bold uppercase tracking-widest block mb-0.5">
            {point.category}
          </span>
          <h2 className="text-white text-xl font-bold leading-tight">{point.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>

      {/* Carrusel centrado */}
      <div
        className="relative z-10 flex-1 flex items-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Flecha izquierda — solo desktop */}
        <button
          onClick={prev}
          disabled={activeCard === 0}
          aria-label="Anterior"
          className={`
            hidden md:flex
            absolute left-6 z-20
            w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm
            items-center justify-center text-white
            transition-all duration-200
            ${activeCard === 0 ? 'opacity-25 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
          `}
        >
          <ChevronLeft />
        </button>

        {/* Cards */}
        <div className="relative w-full h-full">
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={getCardStyle(idx)}
              onClick={() => idx !== activeCard && setActiveCard(idx)}
            >
              {card}
            </div>
          ))}
        </div>

        {/* Flecha derecha — solo desktop */}
        <button
          onClick={next}
          disabled={activeCard === CARD_COUNT - 1}
          aria-label="Siguiente"
          className={`
            hidden md:flex
            absolute right-6 z-20
            w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm
            items-center justify-center text-white
            transition-all duration-200
            ${activeCard === CARD_COUNT - 1 ? 'opacity-25 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
          `}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Dots + hint */}
      <div className="relative z-10 flex items-center justify-center gap-2 py-4 flex-shrink-0">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCard(i)}
            className={`rounded-full transition-all duration-300 ${
              activeCard === i
                ? 'w-6 h-2 bg-orange-400'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Card ${i + 1}`}
          />
        ))}
        <span className="ml-2 text-white/40 text-xs hidden md:inline">← → para navegar</span>
      </div>
    </div>
  );
};

// ── Mapa principal ─────────────────────────────────────────
const MapSection: React.FC<MapSectionProps> = ({ activePoint, setActivePoint }) => {
  return (
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController activePoint={activePoint} />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={point.position}
            eventHandlers={{ click: () => setActivePoint(point) }}
          />
        ))}
      </MapContainer>

      {activePoint && (
        <PointInfoPanel
          key={activePoint.id}
          point={activePoint}
          onClose={() => setActivePoint(null)}
        />
      )}
    </div>
  );
};

export default MapSection;
