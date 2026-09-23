import { useState } from 'react';
import Navbar from './components/Navbar';
import MapSection from './components/MapSection';
import type { CulturalPoint } from './components/MapSection';
import Footer from './components/Footer';
import SettingsPanel from './components/SettingsPanel';
import ContactSection from './components/ContactSection';
import AgendaSection from './components/AgendaSection';

function App() {
  const [activePoint, setActivePoint] = useState<CulturalPoint | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'contact' | 'agenda'>('map');

  const handlePointSelect = (point: CulturalPoint) => {
    setActivePoint(point);
    setCurrentView('map');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-white">
      <Navbar 
        onPointSelect={handlePointSelect} 
        onShowContact={() => setCurrentView('contact')} 
        onShowAgenda={() => setCurrentView('agenda')}
      />

      <div className="flex-1 flex flex-col relative w-full overflow-y-auto">
        <main className="flex-grow flex flex-col relative">
          <section className="flex-grow w-full z-10 flex flex-col relative">
            <MapSection activePoint={activePoint} setActivePoint={setActivePoint} />
            {currentView === 'contact' && (
              <ContactSection onClose={() => setCurrentView('map')} />
            )}
            {currentView === 'agenda' && (
              <AgendaSection onClose={() => setCurrentView('map')} />
            )}
          </section>
        </main>

        <Footer />
      </div>

      <SettingsPanel />
    </div>
  );
}

export default App;
