import React, { useState, useEffect, useRef } from 'react';
import { SUSPECTS, RECENT_ALERTS, MOCK_PROJECTS, KPI_STATS, CURRENT_USER } from '../constants';
import { ChatMessage } from '../types';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'ai',
      content: `Hola. Tengo cargados ${SUSPECTS.length} personas investigadas, ${RECENT_ALERTS.length} alertas activas y ${MOCK_PROJECTS.length} causas en curso. ¿En qué puedo ayudarte?`,
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

  const processQuery = (query: string): { text: string; sources: string[] } => {
    const lowerQuery = query.toLowerCase();
    const sources: string[] = [];
    let responseText = '';

    if (lowerQuery.includes('informe') || lowerQuery.includes('resumen') || lowerQuery.includes('situación')) {
      const criticalAlerts = RECENT_ALERTS.filter(a => a.severity === 'critical');
      const highRiskSuspects = SUSPECTS.filter(s => s.riskLevel > 80);
      
      responseText = `Resumen de Situación:\n\nHay ${criticalAlerts.length} alerta(s) de prioridad alta, localizadas en ${criticalAlerts.map(a => a.location).join(' y ')}.\n\nSe encuentran ${highRiskSuspects.length} personas de alto riesgo bajo investigación activa.`;
      
      sources.push('Alertas', 'Personas Investigadas', 'Indicadores');
    }
    else if (SUSPECTS.some(s => lowerQuery.includes(s.codeName.toLowerCase()) || lowerQuery.includes(s.realName.toLowerCase()))) {
      const target = SUSPECTS.find(s => lowerQuery.includes(s.codeName.toLowerCase()) || lowerQuery.includes(s.realName.toLowerCase()));
      if (target) {
        responseText = `Ficha de ${target.realName} (alias "${target.codeName}"):\n\nEstado: ${target.status === 'Wanted' ? 'Buscado' : 'En vigilancia'}. Nivel de riesgo: ${target.riskLevel}%.\nÚltima ubicación conocida: ${target.lastSeen}.\nVínculo(s): ${target.affiliations.join(', ')}.`;
        sources.push(`Ficha: ${target.realName}`, 'Registro Criminal');
      }
    }
    else if (lowerQuery.includes('rosario') || lowerQuery.includes('santa fe')) {
       const locProjects = MOCK_PROJECTS.filter(p => p.location.toLowerCase().includes('rosario') || p.location.toLowerCase().includes('santa fe'));
       const locAlerts = RECENT_ALERTS.filter(a => a.location.toLowerCase().includes('rosario') || a.location.toLowerCase().includes('santa fe'));
       
       responseText = `Análisis Territorial (Santa Fe / Rosario):\n\nHay ${locProjects.length} causa(s) activa(s) en esta jurisdicción con ${locAlerts.length} alerta(s) reciente(s).\n\nTipos de delito: ${locProjects.map(p => p.type).join(', ')}.`;
       sources.push('Mapa', 'Causas Activas');
    }
    else if (lowerQuery.includes('alerta') || lowerQuery.includes('emergencia')) {
        const latest = RECENT_ALERTS[0];
        responseText = `Alerta más reciente (prioridad ${latest.severity === 'critical' ? 'urgente' : latest.severity === 'high' ? 'alta' : 'media'}): "${latest.title}" en ${latest.location} (${latest.time}).`;
        sources.push('Registro de Alertas');
    }
    else if (lowerQuery.includes('ayuda') || lowerQuery.includes('hacer')) {
        responseText = "Puedo ayudarte a:\n\n• Generar resúmenes de situación\n• Buscar personas investigadas por nombre o alias\n• Analizar zonas geográficas\n• Revisar alertas recientes\n• Consultar datos de causas activas";
        sources.push('Ayuda');
    }
    else {
      responseText = "Entendido. Necesito un poco más de contexto. ¿Te referís a una persona investigada, una zona geográfica o una alerta específica?";
    }

    return { text: responseText, sources };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const analysis = processQuery(userMsg.content);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: analysis.text,
        timestamp: new Date(),
        sources: analysis.sources
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isOpen ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-6 w-96 max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-150px)] bg-white rounded-xl border border-gray-200 shadow-xl z-40 flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">chat</span>
             </div>
             <div>
                <h3 className="text-gray-800 font-semibold text-sm">Asistente IA</h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Disponible
                </p>
             </div>
          </div>
          <button onClick={() => setMessages([])} className="text-gray-400 hover:text-gray-600 transition-colors" title="Limpiar Chat">
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                 <div className="mt-1.5 flex flex-wrap gap-1 max-w-[85%]">
                    {msg.sources.map((src, idx) => (
                       <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[9px] text-gray-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">article</span>
                          {src}
                       </span>
                    ))}
                 </div>
              )}
              
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start">
               <div className="bg-white p-3 rounded-xl rounded-bl-sm border border-gray-200 flex gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escriba su consulta..."
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-sm transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </>
  );
};