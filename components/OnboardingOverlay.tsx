
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
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
               <span className="material-symbols-outlined text-white text-3xl">neurology</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido a CerebroAC</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
               Sistema profesional de análisis criminal e investigación. A continuación configuraremos su entorno de trabajo.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
             <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Fuentes de Datos</h3>
             <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center cursor-pointer hover:border-blue-300 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">cloud_queue</span></div>
                      <div className="text-left">
                         <div className="text-sm font-medium text-gray-800">Google Drive / Workspace</div>
                         <div className="text-xs text-gray-400">Importación de documentos y reportes</div>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-green-500">check_circle</span>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center cursor-pointer hover:border-blue-300 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">map</span></div>
                      <div className="text-left">
                         <div className="text-sm font-medium text-gray-800">Capas Geográficas</div>
                         <div className="text-xs text-gray-400">KML, GeoJSON, Shapefiles</div>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-gray-300">radio_button_unchecked</span>
                </div>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Preferencias de Visualización</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border-2 border-blue-500 bg-gray-50 p-4 rounded-lg cursor-pointer">
                   <div className="h-14 bg-white rounded border border-gray-200 mb-2"></div>
                   <div className="text-xs font-medium text-gray-700">Modo Claro</div>
                </div>
                <div className="border border-gray-200 bg-gray-800 p-4 rounded-lg opacity-60 cursor-pointer">
                   <div className="h-14 bg-gray-900 rounded border border-gray-700 mb-2"></div>
                   <div className="text-xs font-medium text-gray-300">Modo Oscuro</div>
                </div>
             </div>
             <p className="text-xs text-gray-400">
                Puede cambiar el tema en cualquier momento desde <span className="text-blue-600">Ajustes</span>.
             </p>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
             <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check</span>
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Todo Listo</h3>
             <p className="text-gray-500 mb-4 text-sm">
                Su entorno de trabajo está configurado. Puede comenzar a cargar datos, analizar causas y generar informes.
             </p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center">
       <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
             <div className="h-full bg-blue-600 transition-all duration-300 rounded-r" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>

          <div className="py-4">
             {renderContent()}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
             <button 
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`text-sm text-gray-400 hover:text-gray-600 ${step === 1 ? 'invisible' : ''}`}
             >
                ← Atrás
             </button>
             <button 
                onClick={() => {
                   if (step === totalSteps) completeOnboarding();
                   else setStep(s => Math.min(totalSteps, s + 1));
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors text-sm"
             >
                {step === totalSteps ? 'Comenzar' : 'Siguiente →'}
             </button>
          </div>
       </div>
    </div>
  );
};
