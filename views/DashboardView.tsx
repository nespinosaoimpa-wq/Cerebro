import React, { useState } from 'react';
import { KPI_STATS, RECENT_ALERTS, SUSPECTS } from '../constants';
import { useGlobalState } from '../components/GlobalState';
import { Project } from '../types';

export const DashboardView: React.FC = () => {
   const { navigate, addProject, addNotification, projects } = useGlobalState();
   const [showCreateOpModal, setShowCreateOpModal] = useState(false);
   const [newOpData, setNewOpData] = useState({ title: '', type: 'Crimen Organizado', zone: '' });
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
            addNotification('success', `Ubicación encontrada: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
         } else {
            addNotification('warning', 'No se encontró la ubicación. Usando coordenadas estimadas.');
         }

         const newProject: Project = {
            id: `op-${Date.now()}`,
            title: newOpData.title,
            type: newOpData.type as any,
            location: newOpData.zone,
            status: 'Active',
            lastUpdate: 'Ahora',
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
            label: `Causa: ${newOpData.title}`
         });

      } catch (error) {
         addNotification('error', 'Error de conexión al servicio de geolocalización.');
         setIsGeocoding(false);
      }
   };

   return (
      <div className="p-6 lg:p-8 h-full overflow-y-auto custom-scrollbar bg-gray-50">

         {/* Header Section */}
         <div className="flex justify-between items-center mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Panel Principal
               </h1>
               <p className="text-sm text-gray-500 mt-0.5">
                  Sistema de Análisis Criminal e Investigación — Provincia de Santa Fe
               </p>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-green-500"></div>
               <span className="text-xs text-gray-500 font-medium">En línea</span>
            </div>
         </div>

         {/* KPI Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {KPI_STATS.map((stat, idx) => (
               <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 text-xl">{stat.icon}</span>
                     </div>
                     <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.positive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {stat.positive ? '↑' : '↓'} {stat.change}
                     </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
               </div>
            ))}
         </div>

         {/* Quick Actions Bar */}
         <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-lg">apps</span>
               </div>
               <div>
                  <h3 className="text-sm font-semibold text-gray-800">Accesos Directos</h3>
                  <p className="text-xs text-gray-400">Herramientas de uso frecuente</p>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               <button 
                  onClick={() => navigate('case-ingest')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
               >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  Cargar Datos
               </button>

               <button 
                  onClick={() => navigate('intel-network')}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg border border-gray-200 flex items-center gap-2 transition-colors"
               >
                  <span className="material-symbols-outlined text-base text-blue-500">hub</span>
                  Grafo de Relaciones
               </button>

               <button 
                  onClick={() => navigate('financial')}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg border border-gray-200 flex items-center gap-2 transition-colors"
               >
                  <span className="material-symbols-outlined text-base text-green-600">payments</span>
                  Análisis Financiero
               </button>

               <button 
                  onClick={() => navigate('strat-reports')}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg border border-gray-200 flex items-center gap-2 transition-colors"
               >
                  <span className="material-symbols-outlined text-base text-purple-500">summarize</span>
                  Generar Informe
               </button>
            </div>
         </div>

         <div className="grid grid-cols-12 gap-6">
            {/* Left Box: Active Cases */}
            <div className="col-span-12 lg:col-span-8 rounded-xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
               <div className="mb-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                     Resumen
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                     Gestión de Causas Activas
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                     Administre las causas judiciales en curso, coordine la asignación de agentes y supervise el estado de avance de cada investigación.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg">
                     <div className="text-xs text-gray-500 font-medium">Causas en curso</div>
                     <div className="text-2xl font-bold text-gray-900 mt-1">{projects.length} Activa(s)</div>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg">
                     <div className="text-xs text-gray-500 font-medium">Analistas asignados</div>
                     <div className="text-2xl font-bold text-gray-900 mt-1">1 en Servicio</div>
                  </div>
               </div>

               <div className="flex gap-3">
                  <button
                     onClick={() => setShowCreateOpModal(true)}
                     className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors rounded-lg flex items-center gap-2 shadow-sm"
                  >
                     <span className="material-symbols-outlined text-sm">add</span>
                     Nueva Causa
                  </button>

                  <button
                     onClick={() => navigate('map')}
                     className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors rounded-lg border border-gray-200 flex items-center gap-2"
                  >
                     <span className="material-symbols-outlined text-sm">map</span>
                     Ver Mapa
                  </button>
               </div>
            </div>

            {/* Right Box: Recent alerts */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
               <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500 text-lg">notifications_active</span>
                        Alertas Recientes
                     </h3>
                     <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Actualizado</span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                     {RECENT_ALERTS.length > 0 ? RECENT_ALERTS.map((alert, i) => (
                        <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                           <div className="flex justify-between items-start mb-1.5">
                              <span className="text-[11px] text-gray-400">{alert.time}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                 alert.severity === 'critical' ? 'text-red-700 bg-red-50' :
                                 alert.severity === 'high' ? 'text-orange-700 bg-orange-50' : 'text-blue-700 bg-blue-50'
                              }`}>{
                                 alert.severity === 'critical' ? 'Urgente' :
                                 alert.severity === 'high' ? 'Alta' : 'Media'
                              }</span>
                           </div>
                           <h4 className="text-xs font-medium text-gray-800 mb-1.5 leading-snug">
                              {alert.title}
                           </h4>
                           <div className="flex items-center text-[11px] text-gray-400 gap-1">
                              <span className="material-symbols-outlined text-[12px]">location_on</span>
                              {alert.location}
                           </div>
                        </div>
                     )) : (
                        <div className="p-10 text-center text-sm text-gray-400 flex flex-col items-center gap-2 h-full justify-center">
                           <span className="material-symbols-outlined text-gray-300 text-3xl">notifications_off</span>
                           No hay alertas activas.
                        </div>
                     )}
                  </div>
                  <button
                     onClick={() => navigate('ops-active')}
                     className="p-3 text-center text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors border-t border-gray-100 rounded-b-xl"
                  >
                     Ver todas las alertas →
                  </button>
               </div>
            </div>
         </div>

         {/* SUSPECTS SECTION */}
         <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">badge</span>
                  Personas Investigadas — Prioridad Alta
               </h3>
               <button onClick={() => navigate('intel-db')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Ver todas →</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {SUSPECTS.length > 0 ? SUSPECTS.slice(0, 4).map(sus => (
                  <div key={sus.id} onClick={() => navigate('intel-db')} className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all shadow-sm">
                     <div className="flex items-center gap-3 mb-3">
                        <img src={sus.image} alt="" className={`w-10 h-10 rounded-full object-cover border-2 ${sus.riskLevel > 90 ? 'border-red-300' : 'border-orange-300'}`} />
                        <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-semibold text-gray-800 truncate">{sus.realName}</h4>
                           <p className="text-[11px] text-gray-400 truncate">Alias: {sus.codeName}</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                           sus.riskLevel > 90 ? 'text-red-700 bg-red-50' : 'text-orange-700 bg-orange-50'
                        }`}>
                           Riesgo: {sus.riskLevel}%
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                           sus.status === 'Wanted' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'
                        }`}>
                           {sus.status === 'Wanted' ? 'Buscado' : 'En vigilancia'}
                        </span>
                     </div>
                     <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                           <span className="material-symbols-outlined text-[12px]">location_on</span>
                           {sus.lastSeen}
                        </div>
                     </div>
                  </div>
               )) : (
                  <div className="col-span-4 bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2 justify-center">
                     <span className="material-symbols-outlined text-gray-300 text-3xl">person_search</span>
                     No hay personas investigadas registradas.
                  </div>
               )}
            </div>
         </div>

         {/* FOOTER */}
         <div className="mt-8 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
            <div>CerebroAC — Plataforma de Análisis Criminal e Investigación</div>
            <div>Provincia de Santa Fe</div>
         </div>

         {/* CREATE CAUSE MODAL */}
         {showCreateOpModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
               <div className="bg-white border border-gray-200 w-full max-w-md shadow-xl rounded-xl overflow-hidden">
                  <div className="p-6 lg:p-8">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h2 className="text-lg font-bold text-gray-900">Nueva Causa</h2>
                           <p className="text-xs text-gray-500 mt-1">Defina los datos principales del legajo de investigación.</p>
                        </div>
                        <button onClick={() => setShowCreateOpModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                           <span className="material-symbols-outlined text-gray-400">close</span>
                        </button>
                     </div>

                     <form onSubmit={handleCreateOperation} className="space-y-4">
                        <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1.5">Carátula de la Causa</label>
                           <input
                              autoFocus
                              type="text"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all"
                              placeholder="Ej: CAUSA N° 4812/26 - ZABALA"
                              value={newOpData.title}
                              onChange={e => setNewOpData({ ...newOpData, title: e.target.value.toUpperCase() })}
                           />
                        </div>

                        <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1.5">Tipo de Delito</label>
                           <select
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
                              value={newOpData.type}
                              onChange={e => setNewOpData({ ...newOpData, type: e.target.value })}
                           >
                              <option value="Microtráfico">Microtráfico</option>
                              <option value="Homicidios">Homicidios</option>
                              <option value="Lavado de Activos">Lavado de Activos</option>
                              <option value="Crimen Organizado">Crimen Organizado</option>
                           </select>
                        </div>

                        <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1.5">Zona / Ubicación</label>
                           <input
                              type="text"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all"
                              placeholder="Ej: Rosario, Santa Fe"
                              value={newOpData.zone}
                              onChange={e => setNewOpData({ ...newOpData, zone: e.target.value })}
                           />
                        </div>

                        <div className="pt-2 flex gap-3">
                           <button
                              type="button"
                              onClick={() => setShowCreateOpModal(false)}
                              className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors rounded-lg border border-gray-200"
                           >
                              Cancelar
                           </button>
                           <button
                              type="submit"
                              disabled={!newOpData.title || !newOpData.zone || isGeocoding}
                              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm disabled:opacity-50 transition-colors rounded-lg flex items-center justify-center gap-2 shadow-sm"
                           >
                              {isGeocoding ? (
                                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              ) : 'Crear Causa'}
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
