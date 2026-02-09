
import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';

export const MobileAgentView: React.FC = () => {
  const { addNotification } = useGlobalState();
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="h-full flex items-center justify-center bg-gray-900 p-8">
       {/* Phone Simulator Frame */}
       <div className="w-[380px] h-[750px] bg-black rounded-[40px] border-8 border-gray-800 shadow-2xl relative overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="h-8 bg-black flex justify-between items-center px-6 text-white text-[10px] font-bold z-20">
             <span>09:41</span>
             <div className="flex gap-1">
                <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
                <span className="material-symbols-outlined text-[12px]">wifi</span>
                <span className="material-symbols-outlined text-[12px]">battery_full</span>
             </div>
          </div>

          {/* App Header */}
          <div className="bg-nexus-900 p-4 border-b border-nexus-800 flex justify-between items-center z-20 shadow-lg">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-nexus-accent flex items-center justify-center text-white font-bold">A1</div>
                <div>
                   <h3 className="text-xs font-bold text-white">Agente Táctico</h3>
                   <p className="text-[10px] text-green-400">● En Línea</p>
                </div>
             </div>
             <button className="p-2 bg-red-600 rounded-full text-white shadow-lg animate-pulse" onClick={() => addNotification('warning', 'Pánico enviado a central')}>
                <span className="material-symbols-outlined text-[18px]">sos</span>
             </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative bg-gray-800">
             {activeTab === 'map' && (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2485/1376)' }}>
                   {/* Tactical Overlay */}
                   <div className="absolute top-4 right-4 bg-black/60 backdrop-blur p-2 rounded text-white text-[10px]">
                      <div className="font-bold text-nexus-accent">OBJETIVO CERCANO</div>
                      <div>150m Norte</div>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-xl"></div>
                      <div className="w-20 h-20 bg-blue-500/20 rounded-full -mt-12 -ml-8 animate-ping"></div>
                   </div>
                </div>
             )}
             
             {activeTab === 'alerts' && (
                <div className="p-4 space-y-3 bg-nexus-900 h-full">
                   <h3 className="text-white text-sm font-bold mb-2">Alertas de Zona</h3>
                   {[1,2,3].map(i => (
                      <div key={i} className="bg-nexus-800 p-3 rounded-lg border-l-4 border-red-500">
                         <div className="flex justify-between mb-1">
                            <span className="text-red-400 text-[10px] font-bold">ALTO RIESGO</span>
                            <span className="text-gray-500 text-[10px]">Hace 5m</span>
                         </div>
                         <p className="text-xs text-white">Vehículo sospechoso detectado por LPR en Av. Pellegrini.</p>
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* Bottom Sheet / Quick Actions */}
          <div className="bg-nexus-900 border-t border-nexus-800 p-4 rounded-t-2xl absolute bottom-[70px] left-0 right-0 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-10">
             <div className="flex justify-around">
                <button 
                  onClick={() => addNotification('info', 'Subiendo foto a evidencia...')}
                  className="flex flex-col items-center gap-1 text-gray-400 hover:text-white"
                >
                   <div className="w-10 h-10 rounded-full bg-nexus-800 flex items-center justify-center border border-nexus-700">
                      <span className="material-symbols-outlined text-lg">photo_camera</span>
                   </div>
                   <span className="text-[10px]">Evidencia</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
                   <div className="w-10 h-10 rounded-full bg-nexus-800 flex items-center justify-center border border-nexus-700">
                      <span className="material-symbols-outlined text-lg">mic</span>
                   </div>
                   <span className="text-[10px]">Audio</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
                   <div className="w-10 h-10 rounded-full bg-nexus-800 flex items-center justify-center border border-nexus-700">
                      <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                   </div>
                   <span className="text-[10px]">Escanear</span>
                </button>
             </div>
          </div>

          {/* Tab Bar */}
          <div className="h-16 bg-black flex justify-around items-center px-2 z-20">
             <button onClick={() => setActiveTab('map')} className={`flex-1 flex flex-col items-center ${activeTab === 'map' ? 'text-nexus-accent' : 'text-gray-500'}`}>
                <span className="material-symbols-outlined text-xl">map</span>
                <span className="text-[9px]">Mapa</span>
             </button>
             <button onClick={() => setActiveTab('alerts')} className={`flex-1 flex flex-col items-center ${activeTab === 'alerts' ? 'text-nexus-accent' : 'text-gray-500'}`}>
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="text-[9px]">Alertas</span>
             </button>
             <button className="flex-1 flex flex-col items-center text-gray-500">
                <span className="material-symbols-outlined text-xl">chat</span>
                <span className="text-[9px]">Chat</span>
             </button>
             <button className="flex-1 flex flex-col items-center text-gray-500">
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="text-[9px]">Perfil</span>
             </button>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full z-30"></div>
       </div>
    </div>
  );
};
