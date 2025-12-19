import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu asistente experto en Instagram. Pregúntame sobre medidas, estrategias de contenido o cómo optimizar tus imágenes.',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || '';
      // In a real app we might prompt for key if missing, but here we assume env or silent fail for demo
      if (!apiKey) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `
        Eres un experto en redes sociales, diseño gráfico y marketing digital, especializado en Instagram.
        Tu objetivo es ayudar a los usuarios con dudas sobre tamaños de imágenes, formatos de video, 
        y mejores prácticas para Instagram (Stories, Reels, Feed, Profile).
        
        Responde de manera concisa, útil y amigable en Español.
        Si te preguntan medidas, usa las medidas estándar de 2024 (ej: 1080x1080, 1080x1350, 1080x1920).
        Usa emojis ocasionalmente para ser amigable.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: userMsg.text }] } 
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "Lo siento, no pude procesar eso ahora mismo.";

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: text,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Hubo un error al conectar con el asistente. Por favor verifica tu conexión o intenta más tarde.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-0' 
            : 'insta-gradient-bg text-white hover:scale-105'
        }`}
      >
        {isOpen ? (
          <span className="font-bold text-lg px-2">X</span>
        ) : (
          <>
            <Sparkles size={24} />
            <span className="font-medium hidden sm:inline">Asistente IA</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-[90vw] sm:w-96 max-w-[400px] h-[500px] bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl z-40 flex flex-col transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 rounded-t-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full insta-gradient-bg flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">InstaGuide AI</h3>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-pink-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700">
                <Loader2 size={16} className="animate-spin text-pink-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pregunta sobre medidas..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeminiAssistant;