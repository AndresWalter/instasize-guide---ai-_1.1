import React, { useState, useRef, useEffect } from 'react';
import { SizeSpec } from '../types';
import { 
  UserCircle, Square, Smartphone, Image as ImageIcon, Clock, Film, 
  Upload, Download, RefreshCw, Maximize2, Crop, CloudUpload, 
  Wand2, Sliders, Undo2, Play, Pause, Video
} from 'lucide-react';

interface SizeCardProps {
  spec: SizeSpec;
}

const getIcon = (name: string) => {
  switch (name) {
    case 'UserCircle': return <UserCircle size={32} className="text-pink-500" />;
    case 'Square': return <Square size={32} className="text-purple-500" />;
    case 'Smartphone': return <Smartphone size={32} className="text-orange-500" />;
    case 'Image': return <ImageIcon size={32} className="text-blue-500" />;
    case 'Clock': return <Clock size={32} className="text-red-500" />;
    case 'Film': return <Film size={32} className="text-pink-600" />;
    default: return <Square size={32} />;
  }
};

type Tab = 'format' | 'filters' | 'adjust';
type FilterType = 'normal' | 'bw' | 'sepia' | 'vintage' | 'warm' | 'cool';

const FILTERS: { id: FilterType; label: string; style: string }[] = [
  { id: 'normal', label: 'Normal', style: '' },
  { id: 'bw', label: 'B&W', style: 'grayscale(100%)' },
  { id: 'sepia', label: 'Sepia', style: 'sepia(100%)' },
  { id: 'vintage', label: 'Vintage', style: 'sepia(50%) contrast(120%)' },
  { id: 'warm', label: 'Cálido', style: 'sepia(30%) saturate(140%)' },
  { id: 'cool', label: 'Frío', style: 'hue-rotate(180deg) sepia(20%)' },
];

const SizeCard: React.FC<SizeCardProps> = ({ spec }) => {
  // Media State
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Editor State
  const [activeTab, setActiveTab] = useState<Tab>('format');
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('contain');
  const [activeFilter, setActiveFilter] = useState<FilterType>('normal');
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
      if (mediaSrc) URL.revokeObjectURL(mediaSrc);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // --- FILE HANDLING ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous
      if (mediaSrc) URL.revokeObjectURL(mediaSrc);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setMediaSrc(url);
      
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setMediaType(type);
      
      // Reset edits
      setActiveFilter('normal');
      setAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
      
      if (type === 'image') {
        setTimeout(() => processImageFrame(), 100);
      } else {
        // Video specific setup
        setIsPlaying(true);
      }
    }
  };

  const resetEdits = () => {
    setActiveFilter('normal');
    setAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
  };

  // --- DRAWING LOGIC (SHARED) ---
  const getFilterString = () => {
    const baseFilter = FILTERS.find(f => f.id === activeFilter)?.style || '';
    const adjustmentFilter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
    return `${baseFilter} ${adjustmentFilter}`.trim();
  };

  const drawToCanvas = (source: HTMLImageElement | HTMLVideoElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match spec (once)
    if (canvas.width !== spec.width || canvas.height !== spec.height) {
      canvas.width = spec.width;
      canvas.height = spec.height;
    }

    const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
    const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.height;

    if (!sw || !sh) return; // Not ready

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear
    ctx.clearRect(0, 0, spec.width, spec.height);

    const filterStr = getFilterString();

    if (fitMode === 'cover') {
      // --- FILL / CROP ---
      const scale = Math.max(spec.width / sw, spec.height / sh);
      const scaledWidth = sw * scale;
      const scaledHeight = sh * scale;
      const x = (spec.width - scaledWidth) / 2;
      const y = (spec.height - scaledHeight) / 2;
      
      if (filterStr) ctx.filter = filterStr;
      ctx.drawImage(source, x, y, scaledWidth, scaledHeight);
      ctx.filter = 'none';
    } else {
      // --- CONTAIN / FIT ---
      
      // 1. Blur Background
      const scaleCover = Math.max(spec.width / sw, spec.height / sh);
      const wCover = sw * scaleCover;
      const hCover = sh * scaleCover;
      const xCover = (spec.width - wCover) / 2;
      const yCover = (spec.height - hCover) / 2;

      ctx.filter = `blur(20px) ${filterStr}`; 
      ctx.drawImage(source, xCover - 20, yCover - 20, wCover + 40, hCover + 40);
      
      // 2. Dark Overlay
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, spec.width, spec.height);

      // 3. Foreground
      const scaleContain = Math.min(spec.width / sw, spec.height / sh);
      const wContain = sw * scaleContain;
      const hContain = sh * scaleContain;
      const xContain = (spec.width - wContain) / 2;
      const yContain = (spec.height - hContain) / 2;

      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;

      if (filterStr) ctx.filter = filterStr;
      ctx.drawImage(source, xContain, yContain, wContain, hContain);
      ctx.filter = 'none';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
  };

  // --- IMAGE PROCESSING ---
  const processImageFrame = () => {
    if (mediaType !== 'image' || !mediaSrc) return;
    const img = new Image();
    img.src = mediaSrc;
    img.onload = () => drawToCanvas(img);
  };

  // Trigger re-render on edit change for Image
  useEffect(() => {
    if (mediaType === 'image') {
      processImageFrame();
    }
  }, [fitMode, activeFilter, adjustments, mediaType, mediaSrc]);


  // --- VIDEO PROCESSING ---
  const videoLoop = () => {
    if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
      drawToCanvas(videoRef.current);
      animationFrameRef.current = requestAnimationFrame(videoLoop);
    }
  };

  useEffect(() => {
    if (mediaType === 'video' && isPlaying) {
      if (videoRef.current) {
         videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
         videoLoop();
      }
    } else if (mediaType === 'video' && !isPlaying) {
       videoRef.current?.pause();
       if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
       // Draw one frame so it doesn't vanish
       if(videoRef.current) drawToCanvas(videoRef.current);
    }
  }, [isPlaying, mediaType, fitMode, activeFilter, adjustments]);


  // --- DOWNLOAD / EXPORT ---
  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mediaType === 'image') {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `instacanvas-${spec.id}.jpg`;
        link.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 'image/jpeg', 0.95);
    } 
    else if (mediaType === 'video') {
      await exportVideo();
    }
  };

  const exportVideo = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsExporting(true);
    setIsPlaying(true); // Start playback logic

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Reset video to start
    video.currentTime = 0;
    
    // Setup MediaRecorder
    const stream = canvas.captureStream(30); // 30 FPS
    
    // Try to get audio from video element (Experimental/WebAudio might be needed for full robustness, 
    // but this captures visual edits perfectly)
    // NOTE: Audio capture from DOM elements is limited in standard APIs without complex WebAudio routing.
    // For this prototype, we focus on the Visual Export (Filters/Resizing).

    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instacanvas-${spec.id}.webm`;
      a.click();
      setIsExporting(false);
      setIsPlaying(false);
      video.currentTime = 0;
    };

    // Play and Record
    try {
      await video.play();
      mediaRecorder.start();
      
      // Stop when video ends
      video.onended = () => {
        mediaRecorder.stop();
        video.onended = null; // cleanup
      };
      
      // Also start the draw loop if not running
      videoLoop();
    } catch (err) {
      console.error("Export failed", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 transform group border-t border-white/5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-900/50 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-white/5">
          {getIcon(spec.iconName)}
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-white/5 uppercase tracking-wider">
          {spec.aspectRatio}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-1 text-white group-hover:text-pink-400 transition-colors">
        {spec.title}
      </h3>
      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-4 font-mono">
        {spec.dimensions}
      </p>
      
      <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
        {spec.description}
      </p>

      {/* Editor Area */}
      <div className="bg-slate-900/80 rounded-xl p-4 mb-6 border border-slate-700/50 overflow-hidden relative">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <RefreshCw size={14} className="text-pink-500" />
            {mediaType === 'video' ? 'Editor de Video' : 'Editor de Imagen'}
          </h4>
          
          {mediaSrc && (
             <button 
               onClick={resetEdits}
               className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
               title="Resetear filtros y ajustes"
             >
               <Undo2 size={10} /> Reset
             </button>
          )}
        </div>
        
        {/* Hidden Video Source */}
        {mediaType === 'video' && mediaSrc && (
          <video 
            ref={videoRef}
            src={mediaSrc} 
            className="hidden" 
            muted={isExporting} // Mute during export to avoid feedback
            loop={!isExporting} // Loop in preview, not in export
            playsInline
            onEnded={() => !isExporting && setIsPlaying(false)}
          />
        )}

        {!mediaSrc ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-pink-500 hover:bg-slate-800 transition-colors group/upload"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*,video/*" 
              className="hidden" 
            />
            <div className="flex justify-center gap-2 mb-2 text-slate-500 group-hover/upload:text-pink-400">
               <Upload size={24} />
               <Video size={24} />
            </div>
            <p className="text-xs text-slate-400 group-hover/upload:text-slate-200">
              Sube foto o video
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview Canvas */}
            <div className="relative rounded-lg overflow-hidden border border-slate-600 bg-black/50 aspect-video flex items-center justify-center group/preview">
              <canvas 
                ref={canvasRef}
                className="max-h-full max-w-full object-contain"
              />
              
              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                 {mediaType === 'video' && !isExporting && (
                   <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white transition-all transform hover:scale-110"
                   >
                     {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                   </button>
                 )}
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors absolute bottom-2 right-2"
                  title="Cambiar archivo"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Exporting Overlay */}
              {isExporting && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
                   <span className="text-xs text-white font-bold animate-pulse">Procesando Video...</span>
                   <span className="text-[10px] text-slate-400">Espera a que termine el video</span>
                </div>
              )}
            </div>
            
            {/* Editor Controls */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1 mb-3 bg-slate-950 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('format')}
                  disabled={isExporting}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                    activeTab === 'format' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Crop size={12} /> Formato
                </button>
                <button
                  onClick={() => setActiveTab('filters')}
                  disabled={isExporting}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                    activeTab === 'filters' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Wand2 size={12} /> Filtros
                </button>
                <button
                  onClick={() => setActiveTab('adjust')}
                  disabled={isExporting}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                    activeTab === 'adjust' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Sliders size={12} /> Ajustes
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[80px]">
                {activeTab === 'format' && (
                  <div className="flex gap-2 justify-center pt-2">
                    <button 
                      onClick={() => setFitMode('contain')}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all w-20 ${
                        fitMode === 'contain' 
                          ? 'bg-pink-600/20 border-pink-500 text-white' 
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Maximize2 size={16} />
                      <span className="text-[10px]">Ajustar</span>
                    </button>
                    <button 
                      onClick={() => setFitMode('cover')}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all w-20 ${
                        fitMode === 'cover' 
                          ? 'bg-pink-600/20 border-pink-500 text-white' 
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Crop size={16} />
                      <span className="text-[10px]">Llenar</span>
                    </button>
                  </div>
                )}

                {activeTab === 'filters' && (
                  <div className="grid grid-cols-3 gap-2">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`text-[10px] py-1.5 px-1 rounded border transition-all ${
                          activeFilter === f.id
                            ? 'bg-pink-600 border-pink-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'adjust' && (
                  <div className="space-y-3 px-1 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Brillo</span>
                        <span>{adjustments.brightness}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="200" 
                        value={adjustments.brightness}
                        onChange={(e) => setAdjustments({...adjustments, brightness: Number(e.target.value)})}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Contraste</span>
                        <span>{adjustments.contrast}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="200" 
                        value={adjustments.contrast}
                        onChange={(e) => setAdjustments({...adjustments, contrast: Number(e.target.value)})}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Saturación</span>
                        <span>{adjustments.saturation}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="200" 
                        value={adjustments.saturation}
                        onChange={(e) => setAdjustments({...adjustments, saturation: Number(e.target.value)})}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-white/5">
              <button 
                onClick={handleDownload}
                disabled={isExporting}
                className={`flex-1 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-lg ${
                  isExporting 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/20'
                }`}
                title={mediaType === 'video' ? "Procesar y Descargar Video" : "Descargar Imagen"}
              >
                {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                <span className="truncate">{isExporting ? 'Procesando...' : mediaType === 'video' ? 'Exportar Video' : 'Descargar'}</span>
              </button>
              
              {mediaType === 'image' && (
                <button 
                  onClick={() => {/* Cloud logic same as before, simplified for this file */}}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-green-600/20"
                >
                  <CloudUpload size={14} />
                  <span className="truncate">Drive</span>
                </button>
              )}

               <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2 bg-slate-900/30 p-4 rounded-xl">
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tips Pro:</p>
        <ul className="space-y-2">
          {spec.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-pink-500 shrink-0"></span>
              <span className="leading-tight">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SizeCard;