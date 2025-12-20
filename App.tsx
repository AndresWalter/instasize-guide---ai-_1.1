import React, { useState } from 'react';
import Footer from './components/Footer';
import SizeCard from './components/SizeCard';
import { SIZE_DATA } from './constants';
import { LayoutGrid, Smartphone, MonitorPlay, Sparkles } from 'lucide-react';

// Categories for filtering
const CATEGORIES = [
  { id: 'all', label: 'Ver Todo', icon: LayoutGrid },
  { id: 'feed', label: 'Feed & Posts', icon: LayoutGrid },
  { id: 'story', label: 'Stories', icon: Smartphone },
  { id: 'reels', label: 'Reels & Video', icon: MonitorPlay },
  { id: 'profile', label: 'Perfil', icon: Smartphone },
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredData = activeCategory === 'all'
    ? SIZE_DATA
    : SIZE_DATA.filter(item => {
      if (activeCategory === 'reels') return item.category === 'reels' || item.category === 'video';
      return item.category === activeCategory;
    });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-pink-500 selection:text-white">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Modern Minimal Header */}
        <div className="text-center mb-12 pt-4 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-xs font-medium text-pink-400 uppercase tracking-widest">
            <Sparkles size={12} />
            <span>Guía Oficial 2024</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Insta
            </span>
            <span className="text-white">Canvas</span>
            <span className="text-2xl align-top text-slate-500 font-bold ml-1">AI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            El standard visual definitivo. <span className="text-slate-300 font-medium">Dimensiona, Edita y Optimiza</span> tu contenido para Instagram en segundos.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${isActive
                  ? 'bg-slate-800 border-pink-500 text-pink-400 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredData.map((spec) => (
            <SizeCard key={spec.id} spec={spec} />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No se encontraron medidas para esta categoría.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;