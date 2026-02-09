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
      content: `Hola, ${CURRENT_USER.rank} ${CURRENT_USER.name.split(' ')[1]}. Soy NEXUS AI. He analizado ${SUSPECTS.length} objetivos, ${RECENT_ALERTS.length} alertas activas y ${MOCK_PROJECTS.length} proyectos en curso. ¿En qué puedo asistirte hoy?`,
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

  // The "Brain" - Contextual Analysis Logic
  const processQuery = (query: string): { text: string; sources: string[] } => {
    const lowerQuery = query.toLowerCase();
    const sources: string[] = [];
    let responseText = '';

    // 1. Situation Report / Summary
    if (lowerQuery.includes('informe') || lowerQuery.includes('resumen') || lowerQuery.includes('situación')) {
      const criticalAlerts = RECENT_ALERTS.filter(a => a.severity === 'critical');
      const highRiskSuspects = SUSPECTS.filter(s => s.riskLevel > 80);
      
      responseText = `Informe de Situación Actual:\n\nDetecto ${criticalAlerts.length} alertas críticas que requieren atención inmediata, principalmente en ${criticalAlerts.map(a => a.location).join(' y ')}. \n\nEn cuanto a objetivos, hay ${highRiskSuspects.length} sujetos de alto riesgo bajo vigilancia activa. El rendimiento del sistema muestra un aumento en ${KPI_STATS.find(k => k.label === 'Interceptaciones')?.change || 'datos'} de intercepción de datos.`;
      
      sources.push('Módulo Alertas', 'Base de Datos Objetivos', 'KPIs');
    }
    // 2. Specific Entity Search (Suspects)
    else if (SUSPECTS.some(s => lowerQuery.includes(s.codeName.toLowerCase()) || lowerQuery.includes(s.realName.toLowerCase()))) {
      const target = SUSPECTS.find(s => lowerQuery.includes(s.codeName.toLowerCase()) || lowerQuery.includes(s.realName.toLowerCase()));
      if (target) {
        responseText = `Perfil Generado para ${target.codeName} (${target.realName}):\n\nEstado actual: ${target.status}. Nivel de Riesgo: ${target.riskLevel}%. \nÚltima ubicación conocida: ${target.lastSeen}.\nVinculado a: ${target.affiliations.join(', ')}. \n\nSugiero revisar las intercepciones recientes en la zona de ${target.lastSeen}.`;
        sources.push(`Perfil: ${target.codeName}`, 'Base de Datos Criminal');
      }
    }
    // 3. Location/Zone Analysis
    else if (lowerQuery.includes('rosario') || lowerQuery.includes('santa fe')) {
       const locProjects = MOCK_PROJECTS.filter(p => p.location.toLowerCase().includes('rosario') || p.location.toLowerCase().includes('santa fe'));
       const locAlerts = RECENT_ALERTS.filter(a => a.location.toLowerCase().includes('rosario') || a.location.toLowerCase().includes('santa fe'));
       
       responseText = `Análisis Geoespacial (Zona Santa Fe/Rosario):\n\nActualmente hay ${locProjects.length} operaciones activas en esta jurisdicción. Se han reportado ${locAlerts.length} incidentes recientes.\n\nLa actividad se concentra en delitos de ${locProjects.map(p => p.type).join(' y ')}.`;
       sources.push('GIS Táctico', 'Registro de Operaciones');
    }
    // 4. Alerts
    else if (lowerQuery.includes('alerta') || lowerQuery.includes('emergencia')) {
        const latest = RECENT_ALERTS[0];
        responseText = `La alerta más reciente es de prioridad ${latest.severity.toUpperCase()}: "${latest.title}" en ${latest.location} (Hace: ${latest.time}). Se recomienda desplegar unidades de patrulla.`;
        sources.push(`Log de Alertas ID: ${latest.id}`);
    }
    // 5. Help / Navigation
    else if (lowerQuery.includes('ayuda') || lowerQuery.includes('hacer')) {
        responseText = "Puedo ayudarte a:\n- Generar informes de situación.\n- Buscar perfiles de sospechosos (ej: 'Quién es Viper').\n- Analizar zonas calientes (ej: 'Rosario').\n- Gestionar alertas recientes.\n- Crear nuevos proyectos de investigación.";
        sources.push('Manual de Usuario NEXUS v4.0');
    }
    // Default
    else {
      responseText = "Entendido. Estoy cruzando esa información con la base de datos de inteligencia, pero necesito que seas más específico. ¿Te refieres a un objetivo, una ubicación o una alerta reciente?";
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

    // Simulate Processing Delay
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
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border border-white/10 ${
          isOpen ? 'bg-nexus-700 rotate-90 text-gray-400' : 'bg-nexus-accent text-white hover:scale-110 animate-pulse-slow'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Main Panel */}
      <div
        className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-150px)] glass-panel rounded-2xl border border-nexus-600 shadow-2xl z-40 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-nexus-800/80 backdrop-blur p-4 border-b border-nexus-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-accent to-purple-600 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
             </div>
             <div>
                <h3 className="text-white font-bold text-sm">NEXUS AI</h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Online - Contexto Cargado
                </p>
             </div>
          </div>
          <button onClick={() => setMessages([])} className="text-gray-500 hover:text-white" title="Limpiar Chat">
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-nexus-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-nexus-accent text-white rounded-br-none'
                    : 'bg-nexus-800 text-gray-200 border border-nexus-700 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              
              {/* NotebookLM Style Sources */}
              {msg.sources && msg.sources.length > 0 && (
                 <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                    {msg.sources.map((src, idx) => (
                       <span key={idx} className="px-2 py-0.5 rounded-md bg-nexus-900/80 border border-nexus-700 text-[9px] text-gray-400 flex items-center gap-1 hover:border-nexus-accent hover:text-nexus-accent transition-colors cursor-default">
                          <span className="material-symbols-outlined text-[10px]">article</span>
                          {src}
                       </span>
                    ))}
                 </div>
              )}
              
              <span className="text-[10px] text-gray-600 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start">
               <div className="bg-nexus-800 p-3 rounded-2xl rounded-bl-none border border-nexus-700 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-nexus-800 border-t border-nexus-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre datos, alertas o sospechosos..."
            className="flex-1 bg-nexus-900 border border-nexus-700 text-gray-200 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 bg-nexus-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </>
  );
};