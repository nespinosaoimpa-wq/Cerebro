
import React, { useState } from 'react';
import { MOCK_PERFORMANCE_UNITS } from '../constants';
import { useGlobalState } from '../components/GlobalState';

export const PerformanceReportsView: React.FC = () => {
  const { addNotification } = useGlobalState();
  const [thresholds, setThresholds] = useState({
    compliance: 70, // Percentage
    delay: 3, // Days
  });

  const handleEscalate = (unitName: string) => {
    addNotification('warning', `Reporte disciplinario generado para ${unitName}. Escalado a Mando Superior.`);
  };

  const handleSendWarning = (unitName: string) => {
    addNotification('info', `Alerta de rendimiento enviada a jefe de unidad: ${unitName}.`);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-grid overflow-y-auto custom-scrollbar">
      <div className="mb-8 flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
               <span className="material-symbols-outlined text-nexus-danger text-4xl">gavel</span>
               Control de Desempeño Crítico
            </h1>
            <p className="text-gray-400 mt-1">Supervisión de cumplimiento de unidades y escalada automática de incidencias.</p>
         </div>
         <button className="px-4 py-2 bg-nexus-800 border border-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700">
            <span className="material-symbols-outlined">download</span>
            Exportar Auditoría General
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Configuration Panel */}
         <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel border border-nexus-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-nexus-accent">tune</span>
                  Umbrales de Alerta (IA)
               </h3>
               <p className="text-xs text-gray-400 mb-6">
                  El sistema monitorea en tiempo real. Si una unidad cruza estos límites, se activará el protocolo de escalada.
               </p>

               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Cumplimiento Mínimo</span>
                        <span className="text-nexus-danger font-bold">{thresholds.compliance}%</span>
                     </div>
                     <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        value={thresholds.compliance} 
                        onChange={(e) => setThresholds({...thresholds, compliance: parseInt(e.target.value)})}
                        className="w-full accent-nexus-danger"
                     />
                  </div>

                  <div>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Días Máx. de Retraso</span>
                        <span className="text-nexus-warning font-bold">{thresholds.delay} Días</span>
                     </div>
                     <input 
                        type="range" 
                        min="1" 
                        max="14" 
                        value={thresholds.delay} 
                        onChange={(e) => setThresholds({...thresholds, delay: parseInt(e.target.value)})}
                        className="w-full accent-nexus-warning"
                     />
                  </div>
               </div>

               <div className="mt-6 p-4 bg-nexus-900 rounded border border-nexus-800">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="material-symbols-outlined text-nexus-accent">auto_awesome</span>
                     <span className="text-xs font-bold text-white uppercase">IA Monitor</span>
                  </div>
                  <p className="text-xs text-gray-400">
                     "Basado en los umbrales actuales, la Unidad Táctica Sur está en riesgo crítico. Se recomienda intervención inmediata."
                  </p>
               </div>
            </div>
         </div>

         {/* Units List */}
         <div className="lg:col-span-2">
            <div className="glass-panel border border-nexus-700 rounded-xl overflow-hidden">
               <div className="p-4 border-b border-nexus-700 bg-nexus-800/50 flex justify-between items-center">
                  <h3 className="font-bold text-white">Estado de Unidades Operativas</h3>
                  <span className="text-xs text-gray-400">Actualizado: En Vivo</span>
               </div>
               
               <div className="divide-y divide-nexus-800">
                  {MOCK_PERFORMANCE_UNITS.map(unit => (
                     <div key={unit.id} className="p-6 flex items-start gap-6 hover:bg-nexus-800/30 transition-colors">
                        {/* Status Indicator */}
                        <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                           unit.status === 'optimal' ? 'bg-nexus-success shadow-[0_0_10px_#10b981]' : 
                           unit.status === 'warning' ? 'bg-nexus-warning shadow-[0_0_10px_#f59e0b]' : 
                           'bg-nexus-danger shadow-[0_0_10px_#ef4444] animate-pulse'
                        }`}></div>

                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-bold text-white">{unit.name}</h4>
                              <div className="text-right">
                                 <span className={`text-xl font-bold ${
                                    unit.complianceScore < thresholds.compliance ? 'text-nexus-danger' : 'text-nexus-success'
                                 }`}>
                                    {unit.complianceScore}%
                                 </span>
                                 <p className="text-[10px] text-gray-500 uppercase">Cumplimiento</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-nexus-900/50 p-2 rounded border border-nexus-800">
                                 <span className="text-xs text-gray-500 block">Casos Asignados</span>
                                 <span className="text-sm font-mono text-gray-200">{unit.casesAssigned}</span>
                              </div>
                              <div className="bg-nexus-900/50 p-2 rounded border border-nexus-800">
                                 <span className="text-xs text-gray-500 block">Tiempo Respuesta Prom.</span>
                                 <span className="text-sm font-mono text-gray-200">{unit.avgResponseTime}</span>
                              </div>
                           </div>

                           {unit.lastIncident && (
                              <div className="mb-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                                 <span className="material-symbols-outlined text-sm">warning</span>
                                 {unit.lastIncident}
                              </div>
                           )}

                           <div className="flex gap-3">
                              {unit.status !== 'optimal' && (
                                 <button 
                                    onClick={() => handleEscalate(unit.name)}
                                    className="px-4 py-2 bg-nexus-danger hover:bg-red-600 text-white text-xs font-bold rounded shadow-lg flex items-center gap-2"
                                 >
                                    <span className="material-symbols-outlined text-sm">report</span>
                                    Escalar Reporte (Disciplinario)
                                 </button>
                              )}
                              <button 
                                 onClick={() => handleSendWarning(unit.name)}
                                 className="px-4 py-2 border border-nexus-600 hover:bg-nexus-700 text-gray-300 text-xs font-bold rounded flex items-center gap-2"
                              >
                                 <span className="material-symbols-outlined text-sm">notifications</span>
                                 Enviar Advertencia
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};
