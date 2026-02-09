
import React, { useState } from 'react';
import { MOCK_OSINT_POSTS } from '../constants';
import { useGlobalState } from '../components/GlobalState';
import { OsintPost } from '../types';

export const OsintMonitorView: React.FC = () => {
  const { navigate, addNotification } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'feed' | 'map'>('feed');
  const [selectedPost, setSelectedPost] = useState<OsintPost | null>(null);

  return (
    <div className="h-full flex overflow-hidden relative">
       {/* Sidebar Filters */}
       <div className="w-64 bg-nexus-900 border-r border-nexus-700 p-4 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
             <span className="material-symbols-outlined text-nexus-accent">public</span>
             Monitor OSINT
          </h2>
          
          <div className="space-y-6">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Plataformas</label>
                <div className="space-y-2">
                   {['Facebook', 'Instagram', 'TikTok', 'Twitter/X'].map(p => (
                      <label key={p} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                         <input type="checkbox" defaultChecked className="accent-nexus-accent" />
                         {p}
                      </label>
                   ))}
                </div>
             </div>

             <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Palabras Clave</label>
                <div className="flex flex-wrap gap-2">
                   {['armas', 'venta', 'zona sur', 'droga'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-nexus-800 rounded text-xs text-gray-300 border border-nexus-700 flex items-center gap-1">
                         {tag} <span className="material-symbols-outlined text-[10px] cursor-pointer hover:text-white">close</span>
                      </span>
                   ))}
                   <button className="px-2 py-1 border border-dashed border-gray-600 rounded text-xs text-gray-500 hover:text-white hover:border-gray-400">+ Añadir</button>
                </div>
             </div>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 bg-nexus-950 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
             <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('feed')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'feed' ? 'bg-nexus-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                   Feed en Vivo
                </button>
                <button 
                   onClick={() => setActiveTab('map')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'map' ? 'bg-nexus-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                   Mapa de Calor Digital
                </button>
             </div>
             <span className="flex items-center gap-2 text-xs text-nexus-success animate-pulse">
                <span className="w-2 h-2 bg-nexus-success rounded-full"></span>
                Escuchando Redes (Latam Node)
             </span>
          </div>

          {activeTab === 'feed' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               {MOCK_OSINT_POSTS.map(post => (
                  <div key={post.id} onClick={() => setSelectedPost(post)} className="glass-panel border border-nexus-700 rounded-xl p-4 flex gap-4 hover:border-nexus-500 transition-colors group cursor-pointer">
                     {/* Image / Media */}
                     <div className="w-32 h-32 flex-shrink-0 bg-black rounded-lg overflow-hidden relative">
                        {post.imageUrl ? (
                           <img src={post.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-600">No Media</div>
                        )}
                        <div className={`absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${
                           post.threatLevel === 'high' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'
                        }`}>
                           {post.threatLevel}
                        </div>
                     </div>

                     {/* Content */}
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{post.userHandle}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-nexus-800 rounded text-gray-400 capitalize">{post.platform}</span>
                           </div>
                           <span className="text-xs text-gray-500">{post.timestamp}</span>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{post.content}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                           {post.tags.map(tag => (
                              <span key={tag} className="text-[10px] text-nexus-accent bg-nexus-accent/10 px-1.5 py-0.5 rounded">#{tag}</span>
                           ))}
                        </div>

                        {/* AI Insights */}
                        <div className="bg-nexus-900/50 p-2 rounded border border-nexus-800/50 flex justify-between items-center">
                           <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              {post.geolocation?.address}
                           </div>
                           <div className="flex gap-2">
                              <button onClick={(e) => {
                                 e.stopPropagation();
                                 addNotification('info', 'Geolocalización añadida al Mapa Táctico.');
                                 navigate('map');
                              }} className="p-1 hover:bg-nexus-700 rounded text-gray-400" title="Ver en Mapa">
                                 <span className="material-symbols-outlined text-[16px]">map</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          ) : (
            <div className="h-[600px] w-full rounded-xl overflow-hidden border border-nexus-700 relative bg-nexus-900">
               <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale" style={{ backgroundImage: 'url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/2485/1376)' }}></div>
               {/* Simulated Heatmap */}
               <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4) 0%, transparent 40%)' }}></div>
               
               {/* Post Markers */}
               {MOCK_OSINT_POSTS.map(post => (
                  <div 
                     key={post.id} 
                     onClick={() => setSelectedPost(post)}
                     className="absolute cursor-pointer hover:scale-125 transition-transform"
                     style={{ top: '50%', left: '50%', transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)` }} // Mock positions
                  >
                     <div className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-lg ${post.threatLevel === 'high' ? 'ring-2 ring-red-500' : 'ring-2 ring-yellow-500'}`}>
                        <img src={post.imageUrl} className="w-full h-full object-cover" />
                     </div>
                  </div>
               ))}
               
               <div className="absolute bottom-4 left-4 bg-nexus-900/90 p-3 rounded border border-nexus-700 text-xs">
                  <div className="font-bold text-white mb-1">Concentración Digital</div>
                  <p className="text-gray-400">Visualizando geo-etiquetas de 24h.</p>
               </div>
            </div>
          )}
       </div>

       {/* Post Detail Modal */}
       {selectedPost && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedPost(null)}>
             <div className="bg-nexus-900 border border-nexus-700 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-2">
                   <div className="bg-black relative h-full min-h-[300px]">
                      {selectedPost.imageUrl && <img src={selectedPost.imageUrl} className="w-full h-full object-cover" />}
                   </div>
                   <div className="p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">account_circle</span>
                            <div>
                               <h3 className="font-bold text-white text-sm">{selectedPost.userHandle}</h3>
                               <p className="text-xs text-gray-500">{selectedPost.platform}</p>
                            </div>
                         </div>
                         <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                         </button>
                      </div>
                      
                      <div className="flex-1">
                         <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPost.content}</p>
                         <div className="space-y-2">
                            <div className="bg-nexus-800/50 p-2 rounded text-xs flex justify-between">
                               <span className="text-gray-500">Amenaza</span>
                               <span className={selectedPost.threatLevel === 'high' ? 'text-red-400 font-bold' : 'text-yellow-400 font-bold'}>{selectedPost.threatLevel.toUpperCase()}</span>
                            </div>
                            <div className="bg-nexus-800/50 p-2 rounded text-xs flex justify-between">
                               <span className="text-gray-500">Ubicación</span>
                               <span className="text-white">{selectedPost.geolocation?.address}</span>
                            </div>
                         </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                         <button className="flex-1 py-2 bg-nexus-accent text-white rounded text-xs font-bold hover:bg-blue-600">Crear Caso</button>
                         <button className="flex-1 py-2 border border-nexus-600 text-gray-300 rounded text-xs font-bold hover:text-white">Investigar Perfil</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
