import { useState } from 'react';
import Navbar from './components/Navbar';
import MapSection from './components/MapSection';
import type { CulturalPoint } from './components/MapSection';
import Footer from './components/Footer';

function App() {
  const [activePoint, setActivePoint] = useState<CulturalPoint | null>(null);
  return (
    <div className="min-h-screen flex font-sans bg-white">
      <Navbar onPointSelect={setActivePoint} />
      
      <div className="flex-1 flex flex-col relative w-full overflow-y-auto">
        <main className="flex-grow flex flex-col relative">
        {/* Map Section */}
        <section className="flex-grow w-full z-10 flex flex-col">
          <MapSection activePoint={activePoint} setActivePoint={setActivePoint} />
        </section>
      </main>

      <Footer />
      </div>
    </div>
  );
}

export default App;
