import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
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
  image: string;
  screens: {
    image?: string;
    text?: string;
  }[];
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

// ── Ruta "Cómo llegar" ────────────────────────────────────────────
type TravelMode = 'foot' | 'car';

interface RouteState {
  target: CulturalPoint;
  mode: TravelMode;
  origin?: [number, number];
  accuracy?: number; // metros
  coords?: [number, number][];
  distance?: number; // metros
  duration?: number; // segundos
  loading: boolean;
  error?: string;
}

function FitRoute({ coords }: { coords?: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 1) {
      map.fitBounds(L.latLngBounds(coords), { padding: [60, 60] });
    }
  }, [coords, map]);
  return null;
}

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:20px;height:20px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,.25),0 2px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Toma varias lecturas del GPS y se queda con la más precisa
const getUserPosition = () =>
  new Promise<{ pos: [number, number]; accuracy: number }>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Tu navegador no permite obtener la ubicación.'));
    let best: GeolocationPosition | null = null;
    const finish = () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      if (best) resolve({ pos: [best.coords.latitude, best.coords.longitude], accuracy: best.coords.accuracy });
      else reject(new Error('No pudimos obtener tu ubicación. Activá el GPS y dale permiso al navegador.'));
    };
    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        if (!best || p.coords.accuracy < best.coords.accuracy) best = p;
        if (p.coords.accuracy <= 20) finish(); // suficientemente preciso
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED || !best) {
          if (err.code === err.PERMISSION_DENIED) best = null;
          finish();
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 }
    );
    const timer = setTimeout(finish, 12000);
  });

async function fetchRoute(from: [number, number], to: [number, number], mode: TravelMode) {
  const profile = mode === 'foot' ? 'routed-foot' : 'routed-car';
  const url = `https://routing.openstreetmap.de/${profile}/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No se encontró una ruta hasta este punto.');
  const r = data.routes[0];
  return {
    coords: r.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]) as [number, number][],
    distance: r.distance as number,
    duration: r.duration as number,
  };
}

const formatDistance = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);
const formatDuration = (s: number) => {
  const min = Math.max(1, Math.round(s / 60));
  return min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`;
};

const RouteBar: React.FC<{
  route: RouteState;
  onModeChange: (m: TravelMode) => void;
  onClose: () => void;
}> = ({ route, onModeChange, onClose }) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[15] w-[92%] max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-4 panel-slide-up">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">Cómo llegar a</span>
        <h3 className="text-slate-800 font-bold leading-tight truncate">{route.target.title}</h3>
      </div>
      <button onClick={onClose} aria-label="Cerrar ruta" className="w-8 h-8 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">✕</button>
    </div>

    <div className="flex gap-2 mt-3">
      {(['foot', 'car'] as TravelMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            route.mode === m ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {m === 'foot' ? '🚶 A pie' : '🚗 En auto'}
        </button>
      ))}
    </div>

    <div className="mt-3 text-sm">
      {route.loading && <p className="text-slate-500 animate-pulse">{route.origin ? 'Calculando la ruta más corta…' : 'Buscando tu ubicación exacta…'}</p>}
      {route.error && <p className="text-red-600">{route.error}</p>}
      {!route.loading && !route.error && route.distance != null && route.duration != null && (
        <>
          <p className="text-slate-700">
            <span className="text-2xl font-bold text-slate-900">{formatDuration(route.duration)}</span>
            <span className="ml-2 text-slate-500">· {formatDistance(route.distance)}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {route.accuracy != null && `Precisión ±${Math.round(route.accuracy)} m. `}
            ¿No es tu ubicación? Arrastrá el punto azul.
          </p>
        </>
      )}
    </div>
  </div>
);

// ── Carousel de información ────────────────────────────────
const PointInfoPanel: React.FC<{
  point: CulturalPoint;
  onClose: () => void;
  onRoute: () => void;
}> = ({ point, onClose, onRoute }) => {
  const [activeCard, setActiveCard] = useState(0);
  const screens = point.screens || [];
  const CARD_COUNT = Math.max(1, screens.length);

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

  const cards = Array.from({ length: CARD_COUNT }).map((_, idx) => {
    const screen = screens[idx] || {};
    return (
      <div key={`card${idx}`} className={cardClass + " flex flex-col overflow-hidden"} style={cardStyle}>
        {screen.image && (
          <div className="w-full h-[40%] md:h-[45%] flex-shrink-0 relative bg-slate-100">
            <img src={screen.image} alt="" className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className={`p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar ${!screen.image ? 'pt-8 md:pt-12' : ''}`}>
          {screen.text ? (
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
              {screen.text}
            </p>
          ) : (
            !screen.image && <div className="h-full flex items-center justify-center text-slate-300 italic">Pantalla vacía</div>
          )}
        </div>
      </div>
    );
  });

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
          src={point.image || screens[0]?.image || ''}
          alt=""
          draggable={false}
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'blur(12px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/80" />
      </div>

      {/* Header compacto */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <div className="min-w-0">
          <span className="text-orange-300 text-xs font-bold uppercase tracking-widest block mb-0.5">
            {point.category}
          </span>
          <h2 className="text-white text-lg sm:text-xl font-bold leading-tight line-clamp-2 break-words">{point.title}</h2>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        <button
          onClick={onRoute}
          className="h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-900/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
        >
          🧭 <span className="hidden sm:inline">Cómo llegar</span><span className="sm:hidden">Ir</span>
        </button>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
        </div>
      </div>

      {/* Carrusel centrado */}
      <div
        className="relative z-10 flex-1 flex items-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Flecha izquierda — solo desktop */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          disabled={activeCard === 0}
          aria-label="Anterior"
          className={`
            hidden md:flex
            absolute left-6
            w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm
            items-center justify-center text-white
            transition-all duration-200
            ${activeCard === 0 ? 'opacity-25 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
          `}
          style={{ zIndex: 9999, pointerEvents: activeCard === 0 ? 'none' : 'auto' }}
        >
          <div className="pointer-events-none">
            <ChevronLeft />
          </div>
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
          onClick={(e) => { e.stopPropagation(); next(); }}
          disabled={activeCard === CARD_COUNT - 1}
          aria-label="Siguiente"
          className={`
            hidden md:flex
            absolute right-6
            w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm
            items-center justify-center text-white
            transition-all duration-200
            ${activeCard === CARD_COUNT - 1 ? 'opacity-25 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
          `}
          style={{ zIndex: 9999, pointerEvents: activeCard === CARD_COUNT - 1 ? 'none' : 'auto' }}
        >
          <div className="pointer-events-none">
            <ChevronRight />
          </div>
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
  const [route, setRoute] = useState<RouteState | null>(null);

  const startRoute = async (target: CulturalPoint, mode: TravelMode, knownOrigin?: [number, number], manual = false) => {
    setActivePoint(null);
    setRoute((prev) => ({
      target, mode, origin: knownOrigin, loading: true,
      accuracy: manual ? undefined : knownOrigin ? prev?.accuracy : undefined,
    }));
    try {
      let origin = knownOrigin;
      if (!origin) {
        const loc = await getUserPosition();
        origin = loc.pos;
        setRoute((r) => (r ? { ...r, origin, accuracy: loc.accuracy } : r));
      }
      const result = await fetchRoute(origin, target.position, mode);
      setRoute((r) => (r && r.target.id === target.id && r.mode === mode ? { ...r, origin, ...result, loading: false } : r));
    } catch (e) {
      setRoute((r) => (r ? { ...r, loading: false, error: (e as Error).message } : r));
    }
  };

  return (
    <div className="relative w-full h-[calc(100svh-56px)] md:h-screen bg-slate-200">
      <MapContainer
        center={[-36.3132, -57.6792]}
        zoom={15}
        minZoom={13}
        maxBounds={doloresBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        zoomControl={true}
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

        {route?.coords && (
          <>
            <Polyline positions={route.coords} pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.9 }} />
            <Polyline
              positions={route.coords}
              pathOptions={{ color: '#f97316', weight: 5, dashArray: route.mode === 'foot' ? '2 10' : undefined, lineCap: 'round' }}
            />
          </>
        )}
        {route?.origin && (
          <>
            {route.accuracy != null && route.accuracy > 15 && (
              <Circle
                center={route.origin}
                radius={route.accuracy}
                pathOptions={{ color: '#2563eb', weight: 1, fillColor: '#3b82f6', fillOpacity: 0.12 }}
              />
            )}
            <Marker
              position={route.origin}
              icon={userIcon}
              draggable
              zIndexOffset={1000}
              eventHandlers={{
                dragend: (e) => {
                  const ll = (e.target as L.Marker).getLatLng();
                  startRoute(route.target, route.mode, [ll.lat, ll.lng], true);
                },
              }}
            />
          </>
        )}
        <FitRoute coords={route?.coords} />
      </MapContainer>

      {route && (
        <RouteBar
          route={route}
          onModeChange={(m) => m !== route.mode && startRoute(route.target, m, route.origin)}
          onClose={() => setRoute(null)}
        />
      )}

      {activePoint && (
        <PointInfoPanel
          key={activePoint.id}
          point={activePoint}
          onClose={() => setActivePoint(null)}
          onRoute={() => startRoute(activePoint, route?.mode ?? 'foot')}
        />
      )}
    </div>
  );
};

export default MapSection;
