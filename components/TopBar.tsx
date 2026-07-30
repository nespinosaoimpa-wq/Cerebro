
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalState } from './GlobalState';
import { SUSPECTS, MOCK_PROJECTS } from '../constants';

export const TopBar: React.FC = () => {
  const { secureMode, toggleSecureMode, currentView, navigate, currentUser, notificationHistory } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  if (!currentUser) return null;

  const unreadCount = notificationHistory.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 1) {
      const lowerQ = query.toLowerCase();
      
      const suspectMatches = SUSPECTS.filter(s => 
        s.codeName.toLowerCase().includes(lowerQ) || 
        s.realName.toLowerCase().includes(lowerQ)
      ).map(s => ({ ...s, type: 'suspect' }));

      const projectMatches = MOCK_PROJECTS.filter(p => 
        p.title.toLowerCase().includes(lowerQ) ||
        p.location.toLowerCase().includes(lowerQ)
      ).map(p => ({ ...p, type: 'project' }));

      setSearchResults([...suspectMatches, ...projectMatches]);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (result: any) => {
    setShowResults(false);
    setSearchQuery('');
    if (result.type === 'suspect') {
      navigate('intel-db'); // In a real app, pass ID param
    } else if (result.type === 'project') {
      navigate('workbooks'); // Or project detail view
    }
  };

  const formatViewName = (view: string) => {
    switch(view) {
      case 'dashboard': return 'Tablero de Control';
      case 'case-manager': return 'Gestión de Causas';
      case 'case-ingest': return 'Ingreso de Evidencia (IA)';
      case 'timeline': return 'Línea de Tiempo';
      case 'intel-network': return 'Vínculos y Grafos';
      case 'financial': return 'Análisis Económico y Forense';
      case 'intel-identity': return 'Resolución de Identidad';
      case 'workbooks': return 'Cuaderno de Causa';
      case 'map': return 'GIS Táctico';
      case 'ops-mobile': return 'App Agente de Campo';
      case 'ops-active': return 'Despliegues en Curso';
      case 'intel-db': return 'Prontuarios y Objetivos';
      case 'intel-osint': return 'Monitoreo de Redes';
      case 'strat-exec': return 'Focos y Operativos';
      case 'strat-perf': return 'Desempeño Crítico';
      case 'strat-reports': return 'Generador de Informes (IA)';
      case 'automation': return 'Automatización y Alertas';
      case 'sys-config': return 'Ajustes del Sistema';
      case 'sys-audit': return 'Auditoría';
      case 'profile': return 'Perfil de Analista';
      default: return view.charAt(0).toUpperCase() + view.slice(1);
    }
  };

  return (
    <header className="h-14 bg-nexus-950/80 backdrop-blur-md border-b border-nexus-800 flex items-center justify-between px-4 z-20 shrink-0">
      
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center flex-1 gap-6">
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm">
           <span className="text-gray-500 font-medium">CerebroAC</span>
           <span className="material-symbols-outlined text-gray-600 text-sm mx-2">chevron_right</span>
           <span className="text-white font-medium">{formatViewName(currentView)}</span>
        </div>

        {/* Global Search Bar (Spotlight Style) */}
        <div className="relative w-full max-w-xl group" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-500 text-[18px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => { if(searchQuery.length > 1) setShowResults(true); }}
            className="block w-full pl-10 pr-12 py-1.5 border border-nexus-700 rounded-md bg-nexus-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-nexus-accent focus:bg-nexus-800 text-sm transition-all"
            placeholder="Buscar entidades, expedientes, ubicaciones..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-nexus-700 rounded text-[10px] font-mono text-gray-500 bg-nexus-800">⌘K</kbd>
          </div>

          {/* Search Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-nexus-900 border border-nexus-700 rounded-lg shadow-2xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase">Resultados</div>
                  {searchResults.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleResultClick(item)}
                      className="px-4 py-2 hover:bg-nexus-800 cursor-pointer flex items-center gap-3"
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${item.type === 'suspect' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        <span className="material-symbols-outlined text-sm">{item.type === 'suspect' ? 'person' : 'folder'}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.codeName || item.title}</div>
                        <div className="text-xs text-gray-500">{item.realName || item.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No se encontraron resultados.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-2 pl-4">
        
        <button 
          onClick={toggleSecureMode}
          className={`p-2 rounded-md transition-colors border border-transparent ${
            secureMode 
              ? 'bg-nexus-accent/10 text-nexus-accent border-nexus-accent/20' 
              : 'text-gray-400 hover:bg-nexus-800 hover:text-white'
          }`}
          title="Modo Privacidad"
        >
          <span className="material-symbols-outlined text-[20px]">{secureMode ? 'visibility_off' : 'visibility'}</span>
        </button>

        <button 
          onClick={() => navigate('profile')}
          className="p-2 rounded-md text-gray-400 hover:bg-nexus-800 hover:text-white transition-colors relative"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-nexus-danger ring-2 ring-nexus-950 animate-pulse"></span>
          )}
        </button>
        
        <button 
          onClick={() => navigate('sys-config')}
          className="p-2 rounded-md text-gray-400 hover:bg-nexus-800 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        <div className="h-6 w-px bg-nexus-800 mx-2"></div>

        <button 
          onClick={() => navigate('profile')}
          className="flex items-center gap-3 pl-1 hover:bg-nexus-800 rounded-md py-1 px-2 transition-colors group"
        >
          <img 
            src={currentUser.avatar} 
            alt="User" 
            className={`h-7 w-7 rounded-md bg-nexus-700 object-cover border border-transparent group-hover:border-nexus-accent transition-all ${secureMode ? 'blur-sm' : ''}`}
          />
          <div className="text-left hidden lg:block">
             <div className="text-xs font-medium text-white leading-none">{currentUser.name}</div>
             <div className="text-[10px] text-gray-500 leading-none mt-1">{currentUser.rank}</div>
          </div>
          <span className="material-symbols-outlined text-gray-500 text-sm">arrow_drop_down</span>
        </button>
      </div>
    </header>
  );
};
