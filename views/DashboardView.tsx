
import React, { useState } from 'react';
import { KPI_STATS, RECENT_ALERTS, MOCK_PROJECTS, SUSPECTS } from '../constants';
import { useGlobalState } from '../components/GlobalState';
import { Project } from '../types';

export const DashboardView: React.FC = () => {
   const { navigate, addProject, addNotification } = useGlobalState();
   const [showCreateOpModal, setShowCreateOpModal] = useState(false);
   const [newOpData, setNewOpData] = useState({ title: '', type: 'Microtráfico', zone: '' });
   const [isGeocoding, setIsGeocoding] = useState(false);

   const handleCreateOperation = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newOpData.title || !newOpData.zone) return;

      setIsGeocoding(true);

      try {
         const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newOpData.zone)}&limit=1`);
         const geoData = await response.json();

         let coords = { lat: -32.94682, lng: -60.63932 };
         let zoomLevel = 13;

         if (geoData && geoData.length > 0) {
            coords = {
               lat: parseFloat(geoData[0].lat),
               lng: parseFloat(geoData[0].lon)
            };
            zoomLevel = 16;
            addNotification('success', `Vector fijado: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
         } else {
            addNotification('warning', 'Triangulación fallida. Usando coordenadas estimadas.');
         }

         const newProject: Project = {
            id: `op-${Date.now()}`,
            title: newOpData.title,
            type: newOpData.type as any,
            location: newOpData.zone,
            status: 'Active',
            lastUpdate: 'Establecido hace 1s',
            members: ['u-001'],
            thumbnail: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2485/1376',
            progress: 0,
            entityCount: 0
         };

         addProject(newProject);
         setShowCreateOpModal(false);

         navigate('map', {
            center: [coords.lat, coords.lng],
            zoom: zoomLevel,
            deployMarker: true,
            label: `OP: ${newOpData.title}`
         });

      } catch (error) {
         addNotification('error', 'Enlace satelital comprometido.');
         setIsGeocoding(false);
      }
   };

   return (
      <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-nexus-950 relative">
         <div className="bg-grid absolute inset-0 pointer-events-none opacity-20"></div>

         {/* Header Section */}
         <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  CerebroAC
                  <span className="text-xs font-semibold text-nexus-accent bg-nexus-accent/10 border border-nexus-accent/20 px-2 py-0.5 rounded">
                     v5.0.1
                  </span>
               </h1>
               <p className="text-sm text-gray-400 mt-1">
                  Sistema de Análisis Criminal e Investigación Unificada
               </p>
            </div>
            <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs text-gray-400 font-medium">Estado del Sistema: Conectado</span>
            </div>
         </div>

         {/* KPI Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
            {KPI_STATS.map((stat, idx) => (
               <div key={idx} className="glass-panel border border-nexus-800 rounded-lg p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12">
                     <span className="material-symbols-outlined text-9xl">{stat.icon}</span>
                  </div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-center mb-4">
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                        <div className={`text-xs font-semibold px-2 py-0.5 rounded ${stat.positive ? 'text-emerald-400 bg-emerald-400/5' : 'text-rose-400 bg-rose-400/5'}`}>
                           {stat.positive ? '+' : '-'}{stat.change}
                        </div>
                     </div>
                     <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-12 gap-8 relative z-10">
             <div className="col-span-12 lg:col-span-8 h-[550px] rounded-lg border border-nexus-800 bg-nexus-900 p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
                   <span className="material-symbols-outlined text-[350px] text-nexus-accent">analytics</span>
                </div>
                
                <div className="relative z-10 max-w-xl">
                   <span className="text-xs font-bold text-nexus-accent bg-nexus-accent/10 border border-nexus-accent/20 px-3 py-1 rounded">
                      Panel de Control
                   </span>
                   <h2 className="text-3xl font-bold text-white mt-6 mb-3 tracking-tight">
                      Gestión Operativa de Causas
                   </h2>
                   <p className="text-sm text-gray-400 leading-relaxed">
                      Coordine el trabajo del personal, monitoree las zonas bajo vigilancia judicial y administre el ingreso de nuevas denuncias y pruebas. Sincronización continua de datos para investigación criminal.
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-nexus-950/40 p-4 border border-nexus-800 rounded">
                         <div className="text-xs text-gray-500 uppercase font-semibold">Causas en curso</div>
                         <div className="text-2xl font-bold text-white mt-1">15 Activas</div>
                      </div>
                      <div className="bg-nexus-950/40 p-4 border border-nexus-800 rounded">
                         <div className="text-xs text-gray-500 uppercase font-semibold">Agentes asignados</div>
                         <div className="text-2xl font-bold text-white mt-1">24 en Servicio</div>
                      </div>
                   </div>
                </div>

                <div className="relative z-10 flex gap-4 mt-8">
                   <button
                      onClick={() => setShowCreateOpModal(true)}
                      className="px-5 py-3 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 rounded flex items-center gap-2"
                   >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      Nuevo Legajo
                   </button>

                   <button
                      onClick={() => navigate('map')}
                      className="px-5 py-3 bg-nexus-800 hover:bg-nexus-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 rounded border border-nexus-700 flex items-center gap-2"
                   >
                      <span className="material-symbols-outlined text-sm">map</span>
                      Ver Mapa General
                   </button>
                </div>
             </div>

            {/* FEED COLUMN - 2026 TACTICAL */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
               <div className="glass-panel border border-white/5 rounded flex-1 flex flex-col relative">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                     <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-3">
                        <span className="material-symbols-outlined text-nexus-accent">history_edu</span>
                        Critical Intel
                     </h3>
                     <div className="flex gap-1">
                        <div className="w-1 h-1 bg-nexus-accent animate-ping"></div>
                        <span className="text-[8px] font-mono text-nexus-accent font-bold">LIVE</span>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                     {RECENT_ALERTS.map((alert, i) => (
                        <div key={i} className="p-5 border-b border-white/5 group cursor-pointer relative hover:bg-nexus-accent/5 transition-all">
                           <div className={`absolute left-0 top-0 bottom-0 w-0.5 group-hover:w-1 transition-all ${alert.severity === 'critical' ? 'bg-nexus-danger shadow-[0_0_10px_red]' :
                              alert.severity === 'high' ? 'bg-nexus-warning' : 'bg-nexus-success'
                              }`}></div>

                           <div className="flex justify-between items-start mb-2">
                              <span className="text-[8px] font-mono text-gray-500">[{alert.time}]</span>
                              <span className={`text-[9px] font-bold uppercase ${alert.severity === 'critical' ? 'text-nexus-danger' :
                                 alert.severity === 'high' ? 'text-nexus-warning' : 'text-nexus-success'
                                 }`}>{alert.severity}</span>
                           </div>
                           <h4 className="text-xs font-bold text-white mb-2 leading-tight uppercase group-hover:pl-1 transition-all">
                              {alert.title}
                           </h4>
                           <div className="flex items-center text-[10px] text-gray-500 gap-2 font-mono">
                              <span className="material-symbols-outlined text-[12px]">push_pin</span>
                              {alert.location}
                           </div>
                        </div>
                     ))}
                  </div>
                  <button
                     onClick={() => navigate('ops-active')}
                     className="p-5 text-center text-[10px] font-black text-gray-400 hover:text-white hover:bg-nexus-accent transition-all uppercase tracking-widest border-t border-white/5"
                  >
                     Full Ops Overview
                  </button>
               </div>
            </div>

         </div>

         {/* QUICK DOSSIERS - 3D CARDS */}
         <div className="mt-12">
            <div className="flex justify-between items-center mb-6 px-4">
               <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <span className="material-symbols-outlined text-nexus-accent">personal_injury</span>
                  Active Targets
               </h3>
               <button onClick={() => navigate('intel-db')} className="text-[10px] text-nexus-accent hover:underline font-mono font-bold tracking-widest">VIEW_ALL_NODES</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {SUSPECTS.slice(0, 3).map(sus => (
                  <div key={sus.id} onClick={() => navigate('intel-db')} className="glass-panel border border-white/5 rounded p-5 cursor-pointer group hover:border-nexus-accent/50 transition-all duration-200">
                     <div className="flex items-center gap-5">
                        <div className="relative">
                           <img src={sus.image} alt="" className="w-16 h-16 grayscale scale-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 rounded-none border border-white/10" />
                           <div className={`absolute -top-1 -right-1 w-3 h-3 border ${sus.riskLevel > 90 ? 'bg-nexus-danger border-red-500 shadow-[0_0_8px_red]' : 'bg-nexus-warning border-yellow-500'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-black text-white truncate uppercase italic">{sus.codeName}</h4>
                              <span className="text-[8px] font-mono text-nexus-accent px-1 border border-nexus-accent/30">{sus.socialNetworkCentrality}</span>
                           </div>
                           <p className="text-[10px] text-gray-500 font-mono truncate">{sus.realName}</p>
                           <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-nexus-accent group-hover:translate-x-1/2 transition-transform duration-1000" style={{ width: '40%' }}></div>
                           </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-700 group-hover:text-nexus-accent transition-colors">qr_code_2</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* FOOTER */}
         <div className="mt-12 py-4 border-t border-nexus-800 flex justify-between items-center text-xs text-gray-500">
            <div>
               CerebroAC — Plataforma de Gestión e Inteligencia Criminal
            </div>
            <div>
               Provincia de Santa Fe
            </div>
         </div>

         {/* CREATE OPERATION MODAL - REDESIGNED */}
         {showCreateOpModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
               <div className="bg-nexus-950 border border-nexus-border w-full max-w-md shadow-2xl rounded-lg overflow-hidden">

                   <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h2 className="text-xl font-bold text-white">Iniciar Nueva Causa</h2>
                            <p className="text-xs text-gray-400 mt-1">Defina los parámetros del legajo de investigación.</p>
                         </div>
                         <div className="w-10 h-10 border border-nexus-accent/30 flex items-center justify-center text-nexus-accent rounded bg-nexus-accent/5">
                            <span className="material-symbols-outlined text-2xl">add_box</span>
                         </div>
                      </div>

                      <form onSubmit={handleCreateOperation} className="space-y-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Carátula de la Causa / Legajo</label>
                            <input
                               autoFocus
                               type="text"
                               className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white text-sm focus:border-nexus-accent focus:outline-none transition-all"
                               placeholder="Ej: CAUSA N° 4812/26 - LOS MONOS"
                               value={newOpData.title}
                               onChange={e => setNewOpData({ ...newOpData, title: e.target.value.toUpperCase() })}
                            />
                         </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Categoría del Delito</label>
                            <select
                               className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white text-sm focus:border-nexus-accent focus:outline-none"
                               value={newOpData.type}
                               onChange={e => setNewOpData({ ...newOpData, type: e.target.value })}
                            >
                               <option>Microtráfico</option>
                               <option>Homicidios</option>
                               <option>Lavado de Activos</option>
                               <option>Crimen Organizado</option>
                               <option>Trata de Personas</option>
                            </select>
                         </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Zona / Ubicación de Referencia</label>
                            <input
                               type="text"
                               className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white text-sm focus:border-nexus-accent focus:outline-none transition-all"
                               placeholder="Ej: Rosario, Santa Fe"
                               value={newOpData.zone}
                               onChange={e => setNewOpData({ ...newOpData, zone: e.target.value })}
                            />
                         </div>

                         <div className="pt-4 flex gap-4">
                            <button
                               type="button"
                               onClick={() => setShowCreateOpModal(false)}
                               className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all rounded border border-white/5"
                            >
                               Cancelar
                            </button>
                            <button
                               type="submit"
                               disabled={!newOpData.title || !newOpData.zone || isGeocoding}
                               className="flex-1 py-2.5 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all rounded flex items-center justify-center gap-2"
                            >
                               {isGeocoding ? (
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                               ) : 'Iniciar Causa'}
                            </button>
                         </div>
                      </form>
                   </div>
                </div>
             </div>
          )}

      </div>
   );
};
