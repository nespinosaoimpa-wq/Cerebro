
import React, { useState, useRef } from 'react';
import { useGlobalState } from '../components/GlobalState';

export const UserProfileView: React.FC = () => {
  const { currentUser, updateUserProfile, notificationHistory, markAllRead, logout } = useGlobalState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    rank: currentUser?.rank || '',
  });

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security'>('general');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUserProfile(formData);
    setIsEditing(false);
  };

  if (!currentUser) return null;

  return (
    <div className="h-full bg-grid p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-nexus-accent text-4xl">account_circle</span>
          Mi Perfil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: ID Card */}
          <div className="lg:col-span-1">
             <div className="glass-panel rounded-xl p-6 border border-nexus-700 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-nexus-accent/20 to-transparent"></div>
                
                <div className="relative group mb-4">
                   <div className="w-32 h-32 rounded-full border-4 border-nexus-900 bg-nexus-800 overflow-hidden shadow-2xl relative">
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                         <span className="material-symbols-outlined text-white">photo_camera</span>
                      </div>
                   </div>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleAvatarChange} 
                     className="hidden" 
                     accept="image/*"
                   />
                </div>

                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <p className="text-sm text-nexus-accent font-medium mb-1">{currentUser.rank}</p>
                <p className="text-xs text-gray-500 mb-6">{currentUser.email}</p>

                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-nexus-900 p-3 rounded border border-nexus-800">
                      <div className="text-xs text-gray-500 uppercase font-bold">Estado</div>
                      <div className="text-nexus-success font-mono text-sm flex items-center justify-center gap-1">
                        <span className="w-2 h-2 bg-nexus-success rounded-full animate-pulse"></span>
                        ACTIVO
                      </div>
                   </div>
                   <div className="bg-nexus-900 p-3 rounded border border-nexus-800">
                      <div className="text-xs text-gray-500 uppercase font-bold">Nivel</div>
                      <div className="text-white font-mono text-sm">L5 ADMIN</div>
                   </div>
                </div>

                <button 
                  onClick={logout}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                   <span className="material-symbols-outlined text-sm">logout</span>
                   Cerrar Sesión
                </button>
             </div>
          </div>

          {/* Right Column: Tabs & Content */}
          <div className="lg:col-span-2">
             <div className="glass-panel rounded-xl border border-nexus-700 min-h-[500px] flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-nexus-700">
                   <button 
                     onClick={() => setActiveTab('general')}
                     className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-nexus-accent text-white bg-nexus-800/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                   >
                      General
                   </button>
                   <button 
                     onClick={() => setActiveTab('notifications')}
                     className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-nexus-accent text-white bg-nexus-800/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                   >
                      Notificaciones ({notificationHistory.filter(n => !n.read).length})
                   </button>
                   <button 
                     onClick={() => setActiveTab('security')}
                     className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'security' ? 'border-nexus-accent text-white bg-nexus-800/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                   >
                      Seguridad
                   </button>
                </div>

                {/* Content */}
                <div className="p-8 flex-1">
                   {activeTab === 'general' && (
                      <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Información Personal</h3>
                            {!isEditing ? (
                              <button onClick={() => setIsEditing(true)} className="text-nexus-accent text-sm font-bold hover:text-white">Editar</button>
                            ) : (
                              <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 text-sm hover:text-white">Cancelar</button>
                                <button onClick={handleSave} className="text-nexus-success text-sm font-bold hover:text-white">Guardar</button>
                              </div>
                            )}
                         </div>

                         <div className="space-y-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                               <input 
                                 type="text" 
                                 disabled={!isEditing}
                                 value={formData.name}
                                 onChange={e => setFormData({...formData, name: e.target.value})}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rango / Cargo</label>
                               <input 
                                 type="text" 
                                 disabled={!isEditing}
                                 value={formData.rank}
                                 onChange={e => setFormData({...formData, rank: e.target.value})}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
                               <input 
                                 type="email" 
                                 disabled={!isEditing}
                                 value={formData.email}
                                 onChange={e => setFormData({...formData, email: e.target.value})}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                               />
                            </div>
                         </div>
                      </div>
                   )}

                   {activeTab === 'notifications' && (
                      <div className="h-full flex flex-col">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Historial de Alertas</h3>
                            <button onClick={markAllRead} className="text-xs text-nexus-accent hover:text-white">Marcar todo como leído</button>
                         </div>
                         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-[400px]">
                            {notificationHistory.length > 0 ? (
                               notificationHistory.map(notif => (
                                  <div key={notif.id} className={`p-3 rounded border flex gap-3 ${notif.read ? 'bg-nexus-900/30 border-nexus-800 opacity-70' : 'bg-nexus-900 border-nexus-700'}`}>
                                     <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                        notif.type === 'success' ? 'bg-nexus-success' : 
                                        notif.type === 'error' ? 'bg-nexus-danger' : 
                                        'bg-nexus-accent'
                                     }`}></div>
                                     <div>
                                        <p className="text-sm text-gray-200">{notif.message}</p>
                                        <p className="text-[10px] text-gray-500 mt-1">{notif.timestamp.toLocaleString()}</p>
                                     </div>
                                  </div>
                               ))
                            ) : (
                               <div className="text-center py-10 text-gray-500">
                                  No hay notificaciones recientes.
                               </div>
                            )}
                         </div>
                      </div>
                   )}

                   {activeTab === 'security' && (
                      <div className="space-y-6">
                         <h3 className="text-lg font-bold text-white">Seguridad de la Cuenta</h3>
                         
                         <div className="bg-nexus-900 p-4 rounded-lg border border-nexus-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-8 h-8" />
                               <div>
                                  <p className="text-sm font-bold text-white">Cuenta de Google</p>
                                  <p className="text-xs text-gray-400">Usada para inicio de sesión rápido</p>
                               </div>
                            </div>
                            <button className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-xs font-bold hover:bg-red-500/20">
                               Desvincular
                            </button>
                         </div>

                         <div className="space-y-4">
                            <button className="w-full flex justify-between items-center p-3 bg-nexus-900 border border-nexus-700 rounded hover:border-nexus-500 transition-colors">
                               <span className="text-sm text-gray-300">Cambiar Contraseña Maestra</span>
                               <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                            </button>
                            <button className="w-full flex justify-between items-center p-3 bg-nexus-900 border border-nexus-700 rounded hover:border-nexus-500 transition-colors">
                               <span className="text-sm text-gray-300">Configurar Autenticación en 2 Pasos (2FA)</span>
                               <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                            </button>
                            <button className="w-full flex justify-between items-center p-3 bg-nexus-900 border border-nexus-700 rounded hover:border-nexus-500 transition-colors">
                               <span className="text-sm text-gray-300">Sesiones Activas</span>
                               <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                            </button>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
