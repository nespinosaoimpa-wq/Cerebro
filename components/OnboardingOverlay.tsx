
import React, { useState } from 'react';
import { useGlobalState } from './GlobalState';

export const OnboardingOverlay: React.FC = () => {
  const { completeOnboarding } = useGlobalState();
  const [step, setStep] = useState(1);

  const totalSteps = 4;

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-nexus-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
               <span className="material-symbols-outlined text-white text-4xl">neurology</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Bienvenido a CerebroAC</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
               La plataforma de inteligencia unificada de última generación. En los próximos pasos, configuraremos tu entorno operativo.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
             <h3 className="text-xl font-bold text-white mb-6 text-center">Conectar Fuentes de Datos</h3>
             <div className="space-y-4">
                <div className="p-4 border border-nexus-700 rounded-lg bg-nexus-800 flex justify-between items-center cursor-pointer hover:border-nexus-accent">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded flex items-center justify-center"><span className="material-symbols-outlined">cloud_queue</span></div>
                      <div className="text-left">
                         <div className="text-sm font-bold text-white">Google Drive / Workspace</div>
                         <div className="text-xs text-gray-400">Importación de PDFs y Reportes</div>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-nexus-success">check_circle</span>
                </div>
                <div className="p-4 border border-nexus-700 rounded-lg bg-nexus-800 flex justify-between items-center cursor-pointer hover:border-nexus-accent">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600/20 text-green-500 rounded flex items-center justify-center"><span className="material-symbols-outlined">map</span></div>
                      <div className="text-left">
                         <div className="text-sm font-bold text-white">Capas GIS</div>
                         <div className="text-xs text-gray-400">KML, GeoJSON, Shapefiles</div>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-gray-600">radio_button_unchecked</span>
                </div>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
             <h3 className="text-xl font-bold text-white mb-6">Personalización Táctica</h3>
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-nexus-accent bg-nexus-800 p-4 rounded-lg">
                   <div className="h-16 bg-nexus-900 rounded mb-2 border border-nexus-700"></div>
                   <div className="text-xs font-bold text-white">Modo Oscuro</div>
                </div>
                <div className="border border-nexus-700 bg-gray-200 p-4 rounded-lg opacity-50">
                   <div className="h-16 bg-white rounded mb-2 border border-gray-300"></div>
                   <div className="text-xs font-bold text-black">Modo Claro</div>
                </div>
             </div>
             <p className="text-xs text-gray-400">
                Puedes cambiar el tema y los iconos del mapa (estándar o fotos) en <span className="text-nexus-accent">Ajustes</span> en cualquier momento.
             </p>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
             <div className="w-16 h-16 bg-nexus-success/20 text-nexus-success rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check</span>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Todo Listo</h3>
             <p className="text-gray-400 mb-6 text-sm">
                Recuerda que puedes usar <strong className="text-white">NotebookLM</strong> para analizar tus casos con IA y configurar <strong className="text-white">Alertas de Rendimiento</strong> para tu equipo.
             </p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-nexus-950/90 backdrop-blur-md flex items-center justify-center">
       <div className="w-full max-w-lg bg-nexus-900 border border-nexus-700 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-nexus-800">
             <div className="h-full bg-nexus-accent transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>

          <div className="py-4">
             {renderContent()}
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-nexus-800">
             <button 
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`text-sm text-gray-400 hover:text-white ${step === 1 ? 'invisible' : ''}`}
             >
                Atrás
             </button>
             <button 
                onClick={() => {
                   if (step === totalSteps) completeOnboarding();
                   else setStep(s => Math.min(totalSteps, s + 1));
                }}
                className="px-6 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
             >
                {step === totalSteps ? 'Comenzar' : 'Siguiente'}
             </button>
          </div>
       </div>
    </div>
  );
};
