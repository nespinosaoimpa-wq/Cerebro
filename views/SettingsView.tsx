
import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, addNotification } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'general' | 'map' | 'reports'>('general');

  const handleIconUpload = () => {
    addNotification('info', 'Subiendo set de iconos tácticos personalizados...');
    setTimeout(() => {
      updateSettings({ mapIcons: 'custom_photos' });
      addNotification('success', 'Iconos actualizados: Fotos reales activadas en Mapa.');
    }, 1500);
  };

  return (
    <div className="h-full p-8 bg-grid overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="material-symbols-outlined text-nexus-accent text-4xl">tune</span>
          Ajustes & Personalización
        </h1>
        <p className="text-gray-400 mb-8">Configure la apariencia, el motor de mapas y los parámetros del sistema.</p>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-nexus-800 text-white border-l-4 border-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-nexus-900'}`}
            >
              General & Tema
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'map' ? 'bg-nexus-800 text-white border-l-4 border-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-nexus-900'}`}
            >
              Mapa Táctico
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-nexus-800 text-white border-l-4 border-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-nexus-900'}`}
            >
              Formatos de Reporte
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 glass-panel border border-nexus-700 rounded-xl p-8">
            
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Apariencia Visual</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['dark', 'tactical', 'light'].map(theme => (
                      <div 
                        key={theme}
                        onClick={() => updateSettings({ theme: theme as any })}
                        className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 transition-all ${settings.theme === theme ? 'border-nexus-accent bg-nexus-800' : 'border-nexus-700 bg-nexus-900 opacity-60 hover:opacity-100'}`}
                      >
                        <div className={`w-full h-20 rounded mb-2 ${
                          theme === 'light' ? 'bg-gray-200' : 
                          theme === 'tactical' ? 'bg-green-900' : 'bg-gray-900'
                        }`}></div>
                        <span className="capitalize text-sm font-bold text-gray-200">{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Color de Acento</h3>
                  <div className="flex gap-4">
                    {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ accentColor: color })}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${settings.accentColor === color ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      >
                        {settings.accentColor === color && <span className="material-symbols-outlined text-white text-sm">check</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Idioma del Sistema</h3>
                  <select 
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value as any })}
                    className="w-full bg-nexus-900 border border-nexus-700 rounded-lg p-3 text-white focus:border-nexus-accent focus:outline-none mb-6"
                  >
                    <option value="es">Español (Latam)</option>
                    <option value="en">English (US)</option>
                    <option value="pt">Português (BR)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-nexus-800">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-nexus-accent">key</span>
                    Clave de API de Google Gemini (IA)
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                    Para habilitar el procesamiento automático de extractos y el generador de gráficos i2 con lenguaje natural, ingresá tu Gemini API Key. Se almacena localmente de forma segura en tu navegador.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      defaultValue={settings.geminiApiKey || ''}
                      onChange={(e) => updateSettings({ geminiApiKey: e.target.value })}
                      className="flex-1 bg-nexus-900 border border-nexus-700 rounded-lg p-3 text-white focus:border-nexus-accent focus:outline-none font-mono text-sm"
                    />
                    <button
                      onClick={() => addNotification('success', 'Clave API de Gemini guardada correctamente.')}
                      className="px-4 bg-nexus-accent hover:bg-blue-600 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Iconografía del Mapa</h3>
                  <p className="text-sm text-gray-400 mb-6">Seleccione qué tipo de marcadores utilizar en la vista táctica.</p>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 rounded-lg border border-nexus-700 bg-nexus-900 cursor-pointer hover:border-nexus-500">
                      <input 
                        type="radio" 
                        name="mapIcons" 
                        checked={settings.mapIcons === 'standard'} 
                        onChange={() => updateSettings({ mapIcons: 'standard' })}
                        className="w-5 h-5 accent-nexus-accent"
                      />
                      <div>
                        <div className="font-bold text-white">Estándar OTAN</div>
                        <div className="text-xs text-gray-500">Símbolos tácticos vectoriales (APP-6D).</div>
                      </div>
                      <div className="ml-auto flex gap-2">
                         <div className="w-6 h-6 bg-blue-500 rounded border border-white"></div>
                         <div className="w-6 h-6 bg-red-500 rounded border border-white transform rotate-45"></div>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 rounded-lg border border-nexus-700 bg-nexus-900 cursor-pointer hover:border-nexus-500">
                      <input 
                        type="radio" 
                        name="mapIcons" 
                        checked={settings.mapIcons === 'custom_photos'} 
                        onChange={() => updateSettings({ mapIcons: 'custom_photos' })}
                        className="w-5 h-5 accent-nexus-accent"
                      />
                      <div>
                        <div className="font-bold text-white">Fotos Reales / Identikit</div>
                        <div className="text-xs text-gray-500">Muestra fotos de sospechosos y vehículos directamente en el mapa.</div>
                      </div>
                      <div className="ml-auto flex -space-x-2">
                         <img src="https://i.pravatar.cc/150?u=viper" className="w-8 h-8 rounded-full border-2 border-red-500" />
                         <img src="https://i.pravatar.cc/150?u=ghost" className="w-8 h-8 rounded-full border-2 border-yellow-500" />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-nexus-700">
                   <h4 className="text-sm font-bold text-white mb-2">Cargar Iconos Personalizados</h4>
                   <div className="border-2 border-dashed border-nexus-600 rounded-lg p-6 flex flex-col items-center justify-center bg-nexus-800/30 hover:bg-nexus-800/50 transition-colors cursor-pointer" onClick={handleIconUpload}>
                      <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">upload_file</span>
                      <span className="text-sm text-nexus-accent font-bold">Subir Pack de Iconos (SVG/PNG)</span>
                      <span className="text-xs text-gray-500 mt-1">Arrastre archivos aquí</span>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
               <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white">Configuración de Reportes de Campo</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-nexus-900 rounded border border-nexus-700">
                        <label className="text-xs font-bold text-gray-500 block mb-2">ENCABEZADO DEL REPORTE</label>
                        <input type="text" className="w-full bg-nexus-950 border border-nexus-800 rounded p-2 text-white text-sm" defaultValue="MINISTERIO DE SEGURIDAD - INTELIGENCIA" />
                     </div>
                     <div className="p-4 bg-nexus-900 rounded border border-nexus-700">
                        <label className="text-xs font-bold text-gray-500 block mb-2">CLASIFICACIÓN POR DEFECTO</label>
                        <select className="w-full bg-nexus-950 border border-nexus-800 rounded p-2 text-white text-sm">
                           <option>CONFIDENCIAL</option>
                           <option>SECRETO</option>
                           <option>USO INTERNO</option>
                        </select>
                     </div>
                  </div>

                  <div className="p-4 bg-nexus-900 rounded border border-nexus-700">
                     <label className="flex items-center gap-3">
                        <input type="checkbox" className="accent-nexus-accent w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-300">Incluir automáticamente metadatos EXIF de fotos en reportes PDF.</span>
                     </label>
                  </div>
                  
                  <button className="px-4 py-2 bg-nexus-accent text-white rounded font-bold hover:bg-blue-600 transition-colors">
                     Guardar Plantilla
                  </button>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
