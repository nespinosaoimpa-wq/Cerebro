
import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';

export const NetworkAnalysisView: React.FC = () => {
  const { navigate, addNotification } = useGlobalState();
  const [layout, setLayout] = useState<'organic' | 'hierarchy'>('organic');

  const handleNodeClick = (entity: string) => {
    addNotification('info', `Cargando perfil de inteligencia: ${entity}`);
    navigate('intel-db');
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-nexus-900">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
        }}></div>
      </div>

      <div className="relative z-10 flex justify-between items-center mb-4">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-nexus-accent">hub</span>
             Análisis de Vínculos (i2 Style)
           </h2>
           <p className="text-sm text-gray-400">Visualización de relaciones entre entidades criminales</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setLayout('organic')}
             className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-2 transition-all ${layout === 'organic' ? 'bg-nexus-accent border-nexus-accent text-white' : 'bg-nexus-800 border-nexus-700 text-gray-400'}`}
           >
              <span className="material-symbols-outlined text-sm">bubble_chart</span> Orgánico
           </button>
           <button 
             onClick={() => setLayout('hierarchy')}
             className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-2 transition-all ${layout === 'hierarchy' ? 'bg-nexus-accent border-nexus-accent text-white' : 'bg-nexus-800 border-nexus-700 text-gray-400'}`}
           >
              <span className="material-symbols-outlined text-sm">account_tree</span> Jerárquico
           </button>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 glass-panel border border-nexus-700 rounded-xl relative overflow-hidden shadow-2xl">
        
        {/* SVG Graph Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-1000">
          {/* Connecting Lines (Positions change based on layout) */}
          <line x1="50%" y1={layout === 'organic' ? '50%' : '30%'} x2={layout === 'organic' ? '30%' : '30%'} y2={layout === 'organic' ? '30%' : '60%'} stroke="#4B5563" strokeWidth="2" strokeOpacity="0.5" className="animate-pulse" />
          <line x1="50%" y1={layout === 'organic' ? '50%' : '30%'} x2={layout === 'organic' ? '70%' : '70%'} y2={layout === 'organic' ? '20%' : '60%'} stroke="#4B5563" strokeWidth="2" strokeOpacity="0.5" className="animate-pulse" />
          <line x1="50%" y1={layout === 'organic' ? '50%' : '30%'} x2={layout === 'organic' ? '70%' : '50%'} y2={layout === 'organic' ? '70%' : '60%'} stroke="#4B5563" strokeWidth="2" strokeOpacity="0.5" className="animate-pulse" />
        </svg>

        {/* Central Node */}
        <div 
          onClick={() => handleNodeClick('VIPER')}
          className="absolute flex flex-col items-center cursor-pointer group z-20 transition-all duration-1000"
          style={{ 
             top: layout === 'organic' ? '50%' : '30%', 
             left: '50%', 
             transform: 'translate(-50%, -50%)' 
          }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-nexus-danger bg-nexus-900 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)] relative group-hover:scale-110 transition-transform duration-300">
             <img src="https://i.pravatar.cc/150?u=viper" alt="Target" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-red-500/10 group-hover:bg-transparent transition-colors"></div>
             {/* Pulse Ring - AI Suggestion */}
             <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20"></div>
          </div>
          <div className="mt-3 px-4 py-1.5 bg-nexus-900/90 rounded border border-nexus-danger text-white font-bold text-sm tracking-wider shadow-lg">
            VIPER
          </div>
        </div>

        {/* Satellite Nodes */}
        <div 
          onClick={() => handleNodeClick('GHOST')}
          className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-1000 group"
          style={{ 
             top: layout === 'organic' ? '30%' : '60%', 
             left: '30%', 
             transform: 'translate(-50%, -50%)' 
          }}
        >
           <div className="w-14 h-14 rounded-full border-2 border-nexus-accent bg-nexus-900 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-white transition-colors">
             <img src="https://i.pravatar.cc/150?u=ghost" alt="Assoc" className="w-full h-full object-cover" />
           </div>
           <span className="mt-2 text-xs text-nexus-accent bg-nexus-900/80 px-2 py-0.5 rounded border border-nexus-accent/30 font-bold">Ghost</span>
        </div>

        <div 
          onClick={() => handleNodeClick('TANK')}
          className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-1000 group"
          style={{ 
             top: layout === 'organic' ? '20%' : '60%', 
             left: '70%', 
             transform: 'translate(-50%, -50%)' 
          }}
        >
           <div className="w-14 h-14 rounded-full border-2 border-nexus-accent bg-nexus-900 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-white transition-colors">
             <img src="https://i.pravatar.cc/150?u=tank" alt="Assoc" className="w-full h-full object-cover" />
           </div>
           <span className="mt-2 text-xs text-nexus-accent bg-nexus-900/80 px-2 py-0.5 rounded border border-nexus-accent/30 font-bold">Tank</span>
        </div>

        <div 
          className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-1000 opacity-70 hover:opacity-100"
          style={{ 
             top: layout === 'organic' ? '70%' : '60%', 
             left: layout === 'organic' ? '70%' : '50%', 
             transform: 'translate(-50%, -50%)' 
          }}
        >
           <div className="w-10 h-10 rounded-full border-2 border-gray-500 bg-nexus-800 flex items-center justify-center">
             <span className="material-symbols-outlined text-gray-400 text-sm">home</span>
           </div>
           <span className="mt-1 text-xs text-gray-500 bg-black/50 px-1 rounded">Safehouse A</span>
        </div>

        {/* Floating Toolbar */}
        <div className="absolute top-4 left-4 bg-nexus-800/90 backdrop-blur border border-nexus-700 rounded-lg p-2 flex flex-col gap-2 shadow-xl">
           <button className="p-2 hover:bg-nexus-700 rounded text-gray-300" title="Agregar Nodo"><span className="material-symbols-outlined">add_circle</span></button>
           <button className="p-2 hover:bg-nexus-700 rounded text-gray-300" title="Filtrar"><span className="material-symbols-outlined">filter_alt</span></button>
           <button 
             onClick={() => addNotification('info', 'Fusionando nodos duplicados...')}
             className="p-2 hover:bg-nexus-700 rounded text-gray-300" title="Fusionar (Merge)"
           >
             <span className="material-symbols-outlined">merge</span>
           </button>
           <button className="p-2 hover:bg-nexus-700 rounded text-gray-300" title="Exportar"><span className="material-symbols-outlined">download</span></button>
        </div>

        <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-600">
           GRAPH_ENGINE_V3.1 :: RENDER_OK
        </div>
      </div>
    </div>
  );
};
