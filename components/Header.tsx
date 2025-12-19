import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-slate-800/50 rounded-2xl mb-6 backdrop-blur-sm border border-white/5 animate-fade-in-up">
          <Camera size={24} className="text-pink-500 mr-2" />
          <span className="text-sm font-semibold tracking-wide text-slate-300 uppercase">Guía Actualizada 2024</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
          Medidas Perfectas para <br/>
          <span className="insta-gradient-text">Instagram</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Optimiza tu perfil, posts y reels con nuestra guía definitiva de tamaños y formatos. 
          No dejes que el recorte arruine tu contenido.
        </p>
      </div>
    </header>
  );
};

export default Header;