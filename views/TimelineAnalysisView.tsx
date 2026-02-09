
import React, { useState } from 'react';
import { MOCK_TIMELINE_EVENTS } from '../constants';
import { useGlobalState } from '../components/GlobalState';

export const TimelineAnalysisView: React.FC = () => {
  const { addNotification } = useGlobalState();
  const [selectedEvent, setSelectedEvent] = useState(MOCK_TIMELINE_EVENTS[0]);

  return (
    <div className="h-full flex flex-col p-6 bg-grid overflow-hidden">
       {/* Header */}
       <div className="flex justify-between items-end mb-6">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-nexus-accent">timeline</span>
                Evolución Criminal & Temporal
             </h2>
             <p className="text-sm text-gray-400">Análisis cronológico de incidentes, operaciones e inteligencia.</p>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 bg-nexus-800 rounded border border-nexus-700 text-xs text-gray-300 flex items-center gap-1 hover:text-white">
                <span className="material-symbols-outlined text-[14px]">filter_list</span>
                Filtrar Eventos
             </button>
             <button 
                onClick={() => addNotification('success', 'Patrones de violencia detectados y agrupados.')}
                className="px-3 py-1.5 bg-nexus-accent/20 border border-nexus-accent text-nexus-accent rounded text-xs font-bold flex items-center gap-1 hover:bg-nexus-accent/30"
             >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Detectar Clústeres IA
             </button>
          </div>
       </div>

       {/* Main Chart Visualization (Simulated) */}
       <div className="flex-1 glass-panel border border-nexus-700 rounded-xl relative mb-6 overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px)] bg-[size:100px_100%] opacity-20"></div>
          
          {/* Chart Content */}
          <div className="flex-1 relative flex items-end px-12 pb-16 pt-12 overflow-x-auto custom-scrollbar">
             {MOCK_TIMELINE_EVENTS.map((event, index) => (
                <div 
                   key={event.id}
                   className="flex flex-col items-center justify-end h-full group relative cursor-pointer mx-8 transition-all duration-300 hover:scale-105"
                   onClick={() => setSelectedEvent(event)}
                >
                   {/* Connection Line */}
                   <div className="absolute bottom-0 w-px bg-nexus-700 h-full group-hover:bg-nexus-500 transition-colors"></div>
                   
                   {/* Node */}
                   <div 
                      className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                         selectedEvent.id === event.id ? 'scale-150 ring-4 ring-white/10' : ''
                      } ${
                         event.type === 'incident' ? 'bg-red-500 border-red-300' :
                         event.type === 'operation' ? 'bg-blue-500 border-blue-300' : 'bg-yellow-500 border-yellow-300'
                      }`}
                      style={{ marginBottom: `${event.intensity * 8}%` }}
                   >
                      {event.cluster && (
                         <div className="absolute -inset-4 rounded-full border border-dashed border-red-500/50 animate-spin-slow opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                      )}
                   </div>

                   {/* Label */}
                   <div 
                      className="absolute w-40 text-center transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-4"
                      style={{ bottom: `${event.intensity * 8 + 10}%` }}
                   >
                      <div className="bg-nexus-900/90 text-white text-[10px] py-1 px-2 rounded border border-nexus-700 shadow-xl">
                         {event.title}
                      </div>
                   </div>

                   {/* Date Label on Axis */}
                   <div className="absolute -bottom-10 text-[10px] font-mono text-gray-500 -rotate-45 origin-top-left whitespace-nowrap">
                      {event.date}
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Detail Card */}
       <div className="h-48 glass-panel border border-nexus-700 rounded-xl p-6 flex gap-6 animate-slide-in">
          <div className={`w-1.5 rounded-full ${
             selectedEvent.type === 'incident' ? 'bg-red-500' :
             selectedEvent.type === 'operation' ? 'bg-blue-500' : 'bg-yellow-500'
          }`}></div>
          
          <div className="flex-1">
             <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                <span className="text-xs font-mono text-gray-400 bg-nexus-900 px-2 py-1 rounded border border-nexus-800">ID: {selectedEvent.id}</span>
             </div>
             
             <div className="flex gap-4 mb-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                   {selectedEvent.date}
                </span>
                <span className="flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">category</span>
                   {selectedEvent.type.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-nexus-warning">
                   <span className="material-symbols-outlined text-[14px]">bolt</span>
                   Intensidad: {selectedEvent.intensity}/10
                </span>
             </div>

             <p className="text-sm text-gray-300">
                El sistema ha correlacionado este evento con otros 3 incidentes cercanos en un radio de 2km. 
                {selectedEvent.cluster && <span className="text-red-400 font-bold ml-1">Parte de un Clúster de {selectedEvent.cluster}.</span>}
             </p>
          </div>

          <div className="w-64 border-l border-nexus-700 pl-6 flex flex-col justify-center gap-2">
             <button className="w-full py-2 bg-nexus-800 hover:bg-nexus-700 text-gray-200 text-xs rounded border border-nexus-600 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">map</span>
                Ver en Mapa Táctico
             </button>
             <button className="w-full py-2 bg-nexus-800 hover:bg-nexus-700 text-gray-200 text-xs rounded border border-nexus-600 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">folder_open</span>
                Abrir Expediente
             </button>
          </div>
       </div>
    </div>
  );
};
