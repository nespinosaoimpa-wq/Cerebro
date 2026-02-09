
import React, { useState } from 'react';
import { MOCK_IDENTITY_MATCHES } from '../constants';
import { useGlobalState } from '../components/GlobalState';

export const IdentityResolutionView: React.FC = () => {
  const { addNotification } = useGlobalState();
  const [match, setMatch] = useState(MOCK_IDENTITY_MATCHES[0]);

  if (!match) return <div className="p-10 text-center text-gray-500">No hay conflictos de identidad pendientes.</div>;

  const handleMerge = () => {
    addNotification('success', 'Identidades fusionadas correctamente. Base de datos actualizada.');
    setMatch(null as any); 
  };

  const handleDiscard = () => {
     addNotification('info', 'Coincidencia descartada. Marcada como falso positivo.');
     setMatch(null as any);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-grid overflow-hidden">
       <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nexus-warning/10 border border-nexus-warning/30 text-nexus-warning text-sm font-bold mb-2">
             <span className="material-symbols-outlined text-sm animate-pulse">warning</span>
             Conflicto de Identidad Detectado
          </div>
          <h2 className="text-2xl font-bold text-white">Resolución de Entidades (IA)</h2>
          <p className="text-gray-400 text-sm">El sistema ha detectado 2 perfiles que podrían pertenecer a la misma persona.</p>
       </div>

       <div className="flex-1 flex items-center justify-center gap-8 max-w-5xl mx-auto w-full">
          
          {/* Profile A (Left) */}
          <div className="flex-1 glass-panel border border-nexus-700 rounded-xl p-6 relative">
             <div className="absolute -top-3 left-4 px-2 py-0.5 bg-nexus-800 border border-nexus-700 text-xs font-bold text-gray-400 uppercase rounded">Registro Oficial</div>
             <div className="flex flex-col items-center">
                <img src={match.profileA.image} className="w-32 h-32 rounded-full border-4 border-nexus-700 mb-4 object-cover" />
                <h3 className="text-xl font-bold text-white">{match.profileA.codeName}</h3>
                <p className="text-sm text-gray-500">{match.profileA.realName}</p>
                
                <div className="mt-6 w-full space-y-3">
                   <div className="flex justify-between border-b border-nexus-800 pb-2">
                      <span className="text-xs text-gray-500">Afiliación</span>
                      <span className="text-xs text-gray-200 font-bold">{match.profileA.affiliations?.[0]}</span>
                   </div>
                   <div className="flex justify-between border-b border-nexus-800 pb-2">
                      <span className="text-xs text-gray-500">Estado</span>
                      <span className="text-xs text-nexus-danger font-bold">WANTED</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Center Connector */}
          <div className="flex flex-col items-center gap-4 w-48">
             <div className="w-24 h-24 rounded-full border-4 border-nexus-accent flex items-center justify-center bg-nexus-900 shadow-[0_0_30px_rgba(59,130,246,0.4)] relative">
                <span className="text-2xl font-black text-white">{match.confidence}%</span>
                <span className="absolute -bottom-6 text-[10px] font-bold text-nexus-accent uppercase tracking-widest">Coincidencia</span>
             </div>
             
             <div className="w-full bg-nexus-800/50 rounded-lg p-3 border border-nexus-700">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 text-center">Motivos de Unión</p>
                <div className="space-y-1">
                   {match.matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-green-400">
                         <span className="material-symbols-outlined text-[10px]">check_circle</span>
                         {reason}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Profile B (Right) */}
          <div className="flex-1 glass-panel border border-nexus-700 rounded-xl p-6 relative">
             <div className="absolute -top-3 right-4 px-2 py-0.5 bg-nexus-800 border border-nexus-700 text-xs font-bold text-gray-400 uppercase rounded">OSINT / Redes</div>
             <div className="flex flex-col items-center">
                <img src={match.profileB.image} className="w-32 h-32 rounded-full border-4 border-nexus-700 mb-4 object-cover" />
                <h3 className="text-xl font-bold text-white">{match.profileB.codeName}</h3>
                <p className="text-sm text-gray-500">{match.profileB.realName}</p>
                
                <div className="mt-6 w-full space-y-3">
                   <div className="flex justify-between border-b border-nexus-800 pb-2 bg-nexus-success/10 px-2 rounded">
                      <span className="text-xs text-gray-500">Afiliación</span>
                      <span className="text-xs text-green-400 font-bold">{match.profileB.affiliations?.[0]}</span>
                   </div>
                   <div className="flex justify-between border-b border-nexus-800 pb-2">
                      <span className="text-xs text-gray-500">Fuente</span>
                      <span className="text-xs text-blue-400 font-bold">Facebook Scraping</span>
                   </div>
                </div>
             </div>
          </div>

       </div>

       {/* Actions */}
       <div className="mt-10 flex justify-center gap-6">
          <button 
             onClick={handleDiscard}
             className="px-8 py-3 rounded-lg border border-nexus-700 text-gray-400 hover:bg-nexus-800 hover:text-white transition-colors flex items-center gap-2 font-bold"
          >
             <span className="material-symbols-outlined">close</span>
             Descartar (Falso Positivo)
          </button>
          <button 
             onClick={handleMerge}
             className="px-8 py-3 rounded-lg bg-nexus-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-900/30 transition-colors flex items-center gap-2 font-bold"
          >
             <span className="material-symbols-outlined">merge</span>
             Fusionar Identidades
          </button>
       </div>
    </div>
  );
};
