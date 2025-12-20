import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 border-t border-slate-800 mt-20 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-slate-500 mb-4">
          Hecho con ❤️ para creadores de contenido.        </p>
        <div className="flex justify-center gap-6 text-sm text-slate-600">
          <span>Actualizado 2025</span>
          <span>•</span>
          <span>Guía Oficial</span>
          <span>•</span>
          <span>Powered by AI</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;