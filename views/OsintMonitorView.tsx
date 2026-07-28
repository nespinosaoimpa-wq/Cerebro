import React, { useState } from 'react';
import { OSINT_TOOL_CATEGORIES, MOCK_OSINT_POSTS } from '../constants';
import { useGlobalState } from '../components/GlobalState';
import { OsintPost } from '../types';

export const OsintMonitorView: React.FC = () => {
  const { navigate, addNotification } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'tools' | 'feed'>('tools');
  const [queryInput, setQueryInput] = useState('');
  const [queryType, setQueryType] = useState<'identity' | 'social' | 'domain'>('identity');
  const [selectedPost, setSelectedPost] = useState<OsintPost | null>(null);

  // Generate direct clickable link from tool pattern and query
  const getGeneratedLink = (urlPattern: string, query: string) => {
    if (!query) return '#';
    return urlPattern.replace('{QUERY}', encodeURIComponent(query));
  };

  const handleLaunchSearch = (urlPattern: string, toolName: string) => {
    if (!queryInput.trim()) {
      addNotification('warning', 'Ingrese un término de búsqueda (DNI, Alias, Dominio o Nombre).');
      return;
    }
    const finalUrl = getGeneratedLink(urlPattern, queryInput.trim());
    window.open(finalUrl, '_blank');
    addNotification('info', `Consulta enviada a ${toolName}`);
  };

  return (
    <div className="h-full flex flex-col bg-nexus-950 text-gray-100 overflow-hidden">
      {/* Top Bar Header */}
      <div className="px-6 py-4 border-b border-nexus-800 bg-nexus-900/60 backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nexus-accent">public</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Hub de Investigación OSINT</h1>
            <span className="px-2 py-0.5 text-xs bg-nexus-accent/20 border border-nexus-accent/40 text-nexus-accent rounded-full font-medium">
              Fuentes Abiertas & Dorks
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Herramientas clasificadas de inteligencia en fuentes abiertas, dorks de búsqueda y monitoreo en vivo.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center bg-nexus-950 p-1 rounded-lg border border-nexus-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'tools' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">travel_explore</span>
            Generador de Consultas OSINT
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'feed' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">rss_feed</span>
            Feed en Vivo ({MOCK_OSINT_POSTS.length})
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {activeTab === 'tools' ? (
          <div className="space-y-6">
            {/* Live Query Generator Input Bar */}
            <div className="bg-nexus-900/60 p-5 rounded-xl border border-nexus-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-nexus-accent uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Live OSINT Query Generator
                </span>
                <span className="text-[11px] text-gray-400">Ingresa un objetivo para generar búsquedas directas</span>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={queryType}
                  onChange={e => setQueryType(e.target.value as any)}
                  className="bg-nexus-950 border border-nexus-800 rounded-md px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-nexus-accent"
                >
                  <option value="identity">Identidad / DNI / CUIT</option>
                  <option value="social">Nombre de Usuario / Alias</option>
                  <option value="domain">Dominio Web / IP</option>
                </select>

                <input
                  type="text"
                  placeholder={
                    queryType === 'identity' ? 'ej: 42332598 o GONZALEZ IGNACIO' :
                    queryType === 'social' ? 'ej: chavo_sabala o viper_rosario' : 'ej: cerebro-tech.org'
                  }
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  className="flex-1 bg-nexus-950 border border-nexus-800 rounded-md px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-nexus-accent font-mono"
                />
              </div>
            </div>

            {/* Classified Tool Directory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {OSINT_TOOL_CATEGORIES.map(category => (
                <div key={category.id} className="bg-nexus-900/40 rounded-xl border border-nexus-800 overflow-hidden">
                  <div className="p-4 border-b border-nexus-800 bg-nexus-900/80 flex items-center gap-3">
                    <span className="material-symbols-outlined text-nexus-accent text-[22px]">{category.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{category.name}</h3>
                      <p className="text-[11px] text-gray-400">{category.description}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-nexus-800/60 p-2">
                    {category.tools.map(tool => (
                      <div key={tool.id} className="p-3 hover:bg-nexus-800/40 rounded transition-colors flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{tool.name}</span>
                            {tool.isDork && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-400">
                                Google Dork
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{tool.description}</p>
                        </div>

                        <button
                          onClick={() => handleLaunchSearch(tool.urlPattern, tool.name)}
                          className="px-3 py-1.5 bg-nexus-accent hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow transition-colors flex-shrink-0"
                        >
                          <span>Ejecutar</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Live Social Media Feed */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_OSINT_POSTS.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-nexus-900/40 p-4 rounded-xl border border-nexus-800 hover:border-nexus-700 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{post.userHandle}</span>
                    <span className="px-2 py-0.5 rounded bg-nexus-950 text-[10px] text-gray-400 capitalize border border-nexus-800">
                      {post.platform}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">{post.timestamp}</span>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed">{post.content}</p>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-nexus-800/60">
                  <span className="text-gray-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {post.geolocation?.address}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    post.threatLevel === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    Amenaza {post.threatLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexus-900 border border-nexus-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-sm font-bold text-white">Detalle de Publicación OSINT</h3>
              <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between bg-nexus-950 p-3 rounded border border-nexus-800">
                <span className="font-bold text-white">{selectedPost.userHandle} ({selectedPost.platform})</span>
                <span className="text-gray-400">{selectedPost.timestamp}</span>
              </div>
              <p className="bg-nexus-950 p-3 rounded border border-nexus-800 text-gray-200 leading-relaxed">
                {selectedPost.content}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-nexus-800">
              <button
                onClick={() => {
                  addNotification('info', 'Ubicación enviada al mapa táctico.');
                  setSelectedPost(null);
                  navigate('map');
                }}
                className="px-4 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded text-xs font-bold transition-colors"
              >
                Ver en Mapa GIS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
