
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
         <div className="flex justify-between items-end mb-10 relative z-10">
            <div className="animate-fade-in">
               <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                  CEREBRO<span className="text-nexus-accent drop-shadow-[0_0_15px_var(--color-accent)]">AC</span>
                  <div className="h-6 w-[2px] bg-nexus-800 rotate-12"></div>
                  <span className="text-[10px] font-mono font-normal text-nexus-accent bg-nexus-accent/5 border border-nexus-accent/20 px-3 py-1 rounded-sm tracking-[0.3em] uppercase">
                     UNIF. INTEL OS v5.0.1
                  </span>
               </h1>
               <p className="text-xs text-gray-400 mt-3 max-w-xl font-mono tracking-wide">
                  {'>'} SYSTEM STATE: NOMINAL // NEURAL LINK ACTIVE // JURISDICTION: SANTA FE REDISTRICT 07
               </p>
            </div>
            <div className="flex flex-col items-end gap-1 font-mono">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Entropy</span>
               <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                     <div key={i} className={`h-1.5 w-6 rounded-full ${i > 6 ? 'bg-nexus-danger animate-pulse shadow-[0_0_10px_red]' : 'bg-nexus-accent opacity-50'}`}></div>
                  ))}
               </div>
               <span className="text-[10px] text-nexus-danger font-bold mt-1">DEFCON 2: ELEVATED RISK</span>
            </div>
         </div>

         {/* KPI Stats Row - 2026 Cyber Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
            {KPI_STATS.map((stat, idx) => (
               <div key={idx} className="glass-panel card-3d border border-white/5 rounded-none p-6 relative overflow-hidden group">
                  <div className="scanning-line"></div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12">
                     <span className="material-symbols-outlined text-9xl">{stat.icon}</span>
                  </div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-center mb-6">
                        <div className="text-[10px] text-gray-500 font-bold font-mono tracking-tighter">SEC_METRIC_{idx + 100}</div>
                        <div className={`text-[10px] font-mono px-2 py-0.5 border ${stat.positive ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' : 'text-rose-400 border-rose-400/30 bg-rose-400/5'}`}>
                           {stat.positive ? '+' : '-'}{stat.change}
                        </div>
                     </div>
                     <div className="text-4xl font-black text-white mb-2 tracking-tighter group-hover:text-nexus-accent transition-colors duration-500">{stat.value}</div>
                     <div className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-nexus-accent"></div>
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-nexus-accent"></div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-12 gap-8 relative z-10">

            {/* SITUATION ROOM - HOLOGRAPHIC STYLE */}
            <div className="col-span-12 lg:col-span-8 h-[650px] rounded-sm overflow-hidden relative shadow-2xl border border-white/5 group bg-black">
               <div className="absolute inset-0 bg-nexus-900/40 z-10 mix-blend-overlay"></div>
               <div className="absolute inset-0 opacity-40 transition-transform duration-[40s] ease-linear group-hover:scale-110"
                  style={{ backgroundImage: 'url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2485/1376)', backgroundSize: 'cover' }}></div>

               {/* Holographic Overlays */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)]"></div>
               <div className="bg-grid absolute inset-0 opacity-10"></div>
               <div className="scanning-line" style={{ animationDuration: '6s' }}></div>

               {/* Central UI */}
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20 text-center">
                  <div className="relative mb-8 group">
                     <div className="absolute inset-0 bg-nexus-accent/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                     <div className="w-32 h-32 rounded-full border border-nexus-accent/40 flex items-center justify-center bg-black/80 backdrop-blur-xl relative">
                        <div className="absolute inset-2 border border-nexus-accent/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <span className="material-symbols-outlined text-6xl text-nexus-accent animate-pulse">radar</span>
                     </div>
                  </div>

                  <h2 className="text-6xl font-black text-white tracking-tightest mb-4 italic uppercase">Situation Room</h2>
                  <div className="flex gap-1 mb-10">
                     <div className="h-0.5 w-12 bg-nexus-accent"></div>
                     <div className="h-0.5 w-1 bg-nexus-800"></div>
                     <div className="h-0.5 w-1 bg-nexus-800"></div>
                     <div className="h-0.5 w-12 bg-nexus-accent"></div>
                  </div>

                  <div className="flex gap-6">
                     <button
                        onClick={() => setShowCreateOpModal(true)}
                        className="cyber-button px-10 py-5 bg-nexus-accent text-white font-black text-sm tracking-widest uppercase hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] group relative"
                        data-text="START MISSION"
                     >
                        <span className="relative z-10 flex items-center gap-3">
                           <span className="material-symbols-outlined text-xl">satellite_alt</span>
                           New Mission
                        </span>
                     </button>

                     <button
                        onClick={() => navigate('map')}
                        className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm tracking-widest uppercase backdrop-blur-md transition-all flex items-center gap-3 hover:border-nexus-accent"
                     >
                        <span className="material-symbols-outlined">map</span>
                        Live Feed
                     </button>
                  </div>
               </div>

               {/* Tactical Corners */}
               <div className="absolute top-8 left-8 p-4 font-mono text-[10px] text-nexus-accent border-l border-nexus-accent/50 bg-black/40 backdrop-blur-sm">
                  VECTOR: SANTA_FE_001<br />
                  STATUS: SCANNING_ACTIVE<br />
                  UPLINK: STABLE (98.4%)
               </div>

               <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 font-mono text-[10px] text-nexus-danger">
                  <div className="flex gap-1">
                     <div className="w-1 h-1 bg-nexus-danger"></div>
                     <div className="w-1 h-1 bg-nexus-danger"></div>
                     <div className="w-1 h-1 bg-nexus-danger"></div>
                  </div>
                  THREAT_MATCH_DETECTED
               </div>
            </div>

            {/* FEED COLUMN - 2026 TACTICAL */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
               <div className="glass-panel border-white/5 rounded-none flex-1 flex flex-col relative">
                  <div className="scanning-line" style={{ animationDelay: '1s' }}></div>
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
                  <div key={sus.id} onClick={() => navigate('intel-db')} className="glass-panel border-white/5 rounded-none p-5 card-3d cursor-pointer group hover:border-nexus-accent/50">
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

         {/* FOOTER STATS */}
         <div className="mt-12 py-4 border-t border-white/5 flex justify-between items-center font-mono text-[8px] text-gray-600 tracking-[0.4em] uppercase">
            <div className="flex gap-10">
               <span>Latency: 12ms</span>
               <span>Uptime: 99.998%</span>
               <span>Cores: 128 / Neural</span>
            </div>
            <div className="text-nexus-accent animate-pulse">
               System Synchronized // 2026-02-09
            </div>
         </div>

         {/* CREATE OPERATION MODAL - REDESIGNED */}
         {showCreateOpModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
               <div className="bg-nexus-950 border border-nexus-accent/30 w-full max-w-lg shadow-[0_0_100px_rgba(59,130,246,0.2)] relative overflow-hidden">
                  <div className="scanning-line"></div>

                  {/* Modal Header Decoration */}
                  <div className="flex h-1">
                     <div className="flex-1 bg-nexus-accent"></div>
                     <div className="w-20 bg-nexus-danger"></div>
                     <div className="w-5 bg-white"></div>
                  </div>

                  <div className="p-10">
                     <div className="flex justify-between items-start mb-10">
                        <div>
                           <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Vector Initialize</h2>
                           <p className="text-[10px] text-nexus-accent font-mono tracking-widest mt-1">{'>'} PARAMETER_SETUP_v2</p>
                        </div>
                        <div className="w-12 h-12 border border-nexus-accent/30 flex items-center justify-center text-nexus-accent">
                           <span className="material-symbols-outlined text-3xl">add_box</span>
                        </div>
                     </div>

                     <form onSubmit={handleCreateOperation} className="space-y-8">
                        <div className="relative">
                           <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest absolute -top-3 left-0 px-1 bg-nexus-950 ml-2">Operation_Codename</label>
                           <input
                              autoFocus
                              type="text"
                              className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-nexus-accent focus:outline-none transition-all"
                              placeholder="EX: PHANTOM_STRIKE"
                              value={newOpData.title}
                              onChange={e => setNewOpData({ ...newOpData, title: e.target.value.toUpperCase() })}
                           />
                        </div>

                        <div className="relative">
                           <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest absolute -top-3 left-0 px-1 bg-nexus-950 ml-2">Threat_Category</label>
                           <select
                              className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-nexus-accent focus:outline-none appearance-none"
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

                        <div className="relative">
                           <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest absolute -top-3 left-0 px-1 bg-nexus-950 ml-2">Vector_Coords_Ref</label>
                           <input
                              type="text"
                              className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm focus:border-nexus-accent focus:outline-none transition-all"
                              placeholder="EX: Rosario, Santa Fe"
                              value={newOpData.zone}
                              onChange={e => setNewOpData({ ...newOpData, zone: e.target.value })}
                           />
                        </div>

                        <div className="pt-4 flex gap-4">
                           <button
                              type="button"
                              onClick={() => setShowCreateOpModal(false)}
                              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
                           >
                              Abort
                           </button>
                           <button
                              type="submit"
                              disabled={!newOpData.title || !newOpData.zone || isGeocoding}
                              className="flex-1 py-4 bg-nexus-accent hover:bg-nexus-accent-hover text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                           >
                              {isGeocoding ? (
                                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              ) : 'EXEC_INITIALIZE'}
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
