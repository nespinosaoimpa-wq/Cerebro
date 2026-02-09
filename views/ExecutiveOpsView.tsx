
import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';

export const ExecutiveOpsView: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const { addNotification } = useGlobalState();

  return (
    <div className="h-full flex flex-col p-6 bg-nexus-900/50 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
             <span className="material-symbols-outlined text-nexus-accent text-3xl">compare_arrows</span>
             Estrategia Ejecutiva: Operativos vs. Focos
           </h2>
           <p className="text-gray-400 text-sm mt-1 max-w-2xl">
             Análisis de impacto de intervenciones policiales. Deslice para comparar la situación <strong className="text-nexus-danger">PRE-OPERATIVO</strong> vs. <strong className="text-nexus-success">POST-OPERATIVO</strong>.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-nexus-800 p-2 rounded-lg border border-nexus-700 text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Índice Efectividad</div>
              <div className="text-xl font-bold text-nexus-success">+42%</div>
           </div>
           <div className="bg-nexus-800 p-2 rounded-lg border border-nexus-700 text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Dispersión del Delito</div>
              <div className="text-xl font-bold text-nexus-warning">15%</div>
           </div>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-nexus-700 shadow-2xl bg-black">
         
         {/* Layer 1: BEFORE (Red Zones) */}
         <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: 'url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2485/1376)' }}></div>
             {/* Simulated Heatmap Red */}
             <div className="absolute inset-0" style={{ 
               background: 'radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.6) 0%, transparent 30%), radial-gradient(circle at 60% 60%, rgba(239, 68, 68, 0.4) 0%, transparent 40%)' 
             }}></div>
             <div className="absolute top-4 left-4 bg-nexus-danger/90 text-white px-3 py-1 rounded font-bold border border-white/20 shadow-lg">
                PRE-OPERATIVO (Agosto)
             </div>
             {/* Markers */}
             <div className="absolute top-[40%] left-[40%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                <span className="material-symbols-outlined text-nexus-danger text-4xl drop-shadow-lg">location_on</span>
                <span className="bg-black/70 text-white text-xs px-1 rounded">Foco A</span>
             </div>
         </div>

         {/* Layer 2: AFTER (Green Zones/Blue Patrols) - Clipped by Slider */}
         <div className="absolute inset-0 z-10 overflow-hidden border-r-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-black" style={{ width: `${sliderValue}%` }}>
             <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: 'url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2485/1376)', width: '100vw' }}></div>
             {/* Simulated Patrol Coverage Blue */}
             <div className="absolute inset-0" style={{ 
                background: 'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.3) 0%, transparent 30%)',
                width: '100vw'
             }}></div>
             <div className="absolute top-4 left-4 bg-nexus-success/90 text-white px-3 py-1 rounded font-bold border border-white/20 shadow-lg whitespace-nowrap">
                POST-OPERATIVO (Septiembre)
             </div>
             {/* Patrol Markers */}
             <div className="absolute top-[40%] left-[40%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center" style={{ width: '100vw', transformOrigin: 'top left' }}>
                <span className="material-symbols-outlined text-nexus-success text-4xl drop-shadow-lg">local_police</span>
                <span className="bg-black/70 text-white text-xs px-1 rounded">Control A</span>
             </div>
         </div>

         {/* Slider Input Control */}
         <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-ew-resize"
         />

         {/* Dragger Visual */}
         <div className="absolute top-0 bottom-0 z-10 pointer-events-none flex flex-col justify-center items-center" style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}>
            <div className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
               <span className="material-symbols-outlined text-black text-sm">code</span>
            </div>
         </div>
      </div>

      {/* Bottom Analytics Panel */}
      <div className="mt-6 grid grid-cols-3 gap-6 h-48">
         <div className="glass-panel p-4 rounded-xl border border-nexus-700 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-300 mb-2">Migración del Delito</h3>
            <p className="text-xs text-gray-500 mb-4">Desplazamiento de bandas tras saturación.</p>
            {/* Mock Chart CSS */}
            <div className="flex items-end gap-2 h-20 w-full px-2">
               <div className="w-8 bg-nexus-danger/50 h-[80%] rounded-t relative group"><span className="absolute -top-4 text-[9px] w-full text-center hidden group-hover:block">Zona A</span></div>
               <div className="w-8 bg-nexus-danger/20 h-[20%] rounded-t relative group"><span className="absolute -top-4 text-[9px] w-full text-center hidden group-hover:block">Zona A (Post)</span></div>
               <div className="w-8 bg-nexus-warning/30 h-[30%] rounded-t relative group"><span className="absolute -top-4 text-[9px] w-full text-center hidden group-hover:block">Zona B</span></div>
               <div className="w-8 bg-nexus-warning/80 h-[60%] rounded-t relative group"><span className="absolute -top-4 text-[9px] w-full text-center hidden group-hover:block">Zona B (Migr)</span></div>
            </div>
         </div>

         <div className="glass-panel p-4 rounded-xl border border-nexus-700">
            <h3 className="text-sm font-bold text-gray-300 mb-2">Saturación Policial</h3>
            <div className="space-y-3 mt-4">
               <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                     <span>Horas Hombre</span>
                     <span>2,450 hrs</span>
                  </div>
                  <div className="w-full bg-nexus-900 h-1.5 rounded-full"><div className="bg-blue-500 h-full w-[80%] rounded-full"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                     <span>Identificaciones</span>
                     <span>12,300</span>
                  </div>
                  <div className="w-full bg-nexus-900 h-1.5 rounded-full"><div className="bg-purple-500 h-full w-[65%] rounded-full"></div></div>
               </div>
            </div>
         </div>

         <div className="glass-panel p-4 rounded-xl border border-nexus-700 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-nexus-accent/20 rounded-full flex items-center justify-center mb-2">
               <span className="material-symbols-outlined text-nexus-accent text-2xl">auto_awesome</span>
            </div>
            <h3 className="text-sm font-bold text-white">Análisis IA</h3>
            <p className="text-xs text-gray-400 mt-1">
               "La saturación en Zona A redujo los homicidios un 60%, pero se detectó un aumento del 15% en robos en la Zona B adyacente. Se sugiere mover el perímetro 2km al Norte."
            </p>
         </div>
      </div>

    </div>
  );
};
