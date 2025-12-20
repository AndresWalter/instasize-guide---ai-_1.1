import React, { useState } from 'react';
import { X, HelpCircle, MousePointer2, Move, ZoomIn, Grid, Shield, Maximize } from 'lucide-react';

interface EditorTutorialProps {
    onClose: () => void;
}

const GLOSSARY_TERMS = [
    {
        term: "Aspect Ratio",
        definition: "La relación entre el ancho y alto de una imagen (ej: 9:16 para Stories).",
        icon: Maximize
    },
    {
        term: "Safe Zone",
        definition: "Áreas de la pantalla donde NO debes poner texto importante porque Instagram superpone botones (likes, comentarios, perfil).",
        icon: Shield
    },
    {
        term: "Grid 1:1",
        definition: "Guía visual que muestra qué parte de tu imagen vertical se verá recortada en el feed principal (cuadrado).",
        icon: Grid
    }
];

const EditorTutorial: React.FC<EditorTutorialProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'tutorial' | 'glossary'>('tutorial');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <HelpCircle size={20} className="text-pink-500" />
                        Centro de Ayuda
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                    <button
                        onClick={() => setActiveTab('tutorial')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'tutorial'
                                ? 'border-pink-500 text-pink-500 bg-slate-800/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                    >
                        Cómo Funciona
                    </button>
                    <button
                        onClick={() => setActiveTab('glossary')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'glossary'
                                ? 'border-pink-500 text-pink-500 bg-slate-800/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                    >
                        Glosario de Términos
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'tutorial' ? (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                    <MousePointer2 className="text-pink-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">1. Sube tu Contenido</h4>
                                    <p className="text-slate-400 text-sm">Arrastra y suelta tu imagen o video, o haz clic en el área de carga.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                    <Move className="text-purple-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">2. Ajusta y Encuadra</h4>
                                    <p className="text-slate-400 text-sm">
                                        Usa <strong className="text-white">Zoom</strong> (rueda del mouse) y <strong className="text-white">Arrastra</strong> para colocar tu imagen perfecta dentro del marco.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                    <ZoomIn className="text-blue-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">3. Verifica Guías</h4>
                                    <p className="text-slate-400 text-sm">
                                        Activa "Safe Zone" para ver qué partes tapa la interfaz de Instagram, y "Grid 1:1" para ver el recorte del feed.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-xl border border-pink-500/20 mt-4">
                                <p className="text-xs text-center text-slate-300 italic">
                                    "El secreto es centrar lo importante en el Grid 1:1, pero usar todo el alto para impactar en Stories/Reels."
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {GLOSSARY_TERMS.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-pink-500/30 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon size={18} className="text-pink-400" />
                                            <h4 className="text-white font-bold">{item.term}</h4>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.definition}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-pink-600/20"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorTutorial;
