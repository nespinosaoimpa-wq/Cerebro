import React from 'react';
import { useGlobalState } from '../components/GlobalState';

const UNITS = [
  { id: 'u1', name: 'Alpha Squad', status: 'Engaging', location: 'Zona Sur, Sector 4', battery: 85, signal: 100, members: 4, cam: 'https://images.unsplash.com/photo-1595759714828-56457c742d45?q=80&w=600&auto=format&fit=crop' },
  { id: 'u2', name: 'Bravo Team', status: 'Patrol', location: 'Centro, Av. Pellegrini', battery: 62, signal: 95, members: 3, cam: 'https://images.unsplash.com/photo-1625603736183-5a022421d0a5?q=80&w=600&auto=format&fit=crop' },
  { id: 'u3', name: 'Charlie Recon', status: 'Idle', location: 'Base de Operaciones', battery: 100, signal: 100, members: 2, cam: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop' },
  { id: 'u4', name: 'Drone Unit 1', status: 'Surveillance', location: 'Vuelo Aéreo - Alt 150m', battery: 45, signal: 80, members: 0, cam: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600&auto=format&fit=crop' },
];

export const ActiveMissionsView: React.FC = () => {
  const { navigate, addNotification } = useGlobalState();

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-nexus-danger animate-pulse">radar</span>
            Operaciones Activas
          </h2>
          <p className="text-sm text-gray-400">Monitoreo en tiempo real de unidades desplegadas</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-nexus-800 rounded border border-nexus-700 text-xs text-gray-300 font-mono flex items-center">
             FREQ: 145.800 MHz (ENCRIPTADO)
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {UNITS.map(unit => (
          <div key={unit.id} className="glass-panel rounded-xl overflow-hidden border border-nexus-700 flex flex-col group">
            {/* Live Feed Header */}
            <div className="relative h-64 bg-black">
              <img src={unit.cam} alt="Live Feed" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-nexus-900 via-transparent to-transparent"></div>
              
              {/* Overlay UI */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2 py-0.5 bg-red-600/80 text-white text-[10px] font-bold animate-pulse rounded">LIVE</span>
                <span className="px-2 py-0.5 bg-black/50 text-white text-[10px] font-mono border border-white/20 rounded">CAM-{unit.id.toUpperCase()}</span>
              </div>
              
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded text-green-400">
                  <span className="material-symbols-outlined text-[12px]">wifi</span> {unit.signal}%
                </div>
                <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded text-yellow-400">
                   <span className="material-symbols-outlined text-[12px]">battery_charging_full</span> {unit.battery}%
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{unit.name}</h3>
                  <p className="text-xs text-nexus-accent flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {unit.location}
                  </p>
                </div>
                <button 
                  onClick={() => addNotification('warning', 'Conectando audio bidireccional...')}
                  className="p-2 rounded-full bg-nexus-accent/20 hover:bg-nexus-accent text-white border border-nexus-accent/50 transition-colors"
                >
                  <span className="material-symbols-outlined">mic</span>
                </button>
              </div>
            </div>

            {/* Tactical Stats */}
            <div className="p-4 bg-nexus-800/30 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Estado</p>
                    <span className={`text-sm font-bold ${
                      unit.status === 'Engaging' ? 'text-nexus-danger' : 
                      unit.status === 'Patrol' ? 'text-nexus-accent' : 'text-gray-400'
                    }`}>
                      {unit.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Efectivos</p>
                    <span className="text-sm font-bold text-gray-200">{unit.members} Operativos</span>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button 
                   onClick={() => navigate('map')}
                   className="px-3 py-1.5 bg-nexus-700 hover:bg-nexus-600 text-xs text-white rounded border border-nexus-600"
                 >
                   Ver Mapa
                 </button>
                 <button 
                   onClick={() => addNotification('info', `Descargando log táctico de ${unit.name}...`)}
                   className="px-3 py-1.5 bg-nexus-700 hover:bg-nexus-600 text-xs text-white rounded border border-nexus-600"
                 >
                   Log
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};