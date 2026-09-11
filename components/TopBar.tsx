
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
      navigate('intel-db');
    } else if (result.type === 'project') {
      navigate('workbooks');
    }
  };

  const formatViewName = (view: string) => {
    switch(view) {
      case 'dashboard': return 'Panel Principal';
      case 'case-manager': return 'Gestión de Causas';
      case 'case-ingest': return 'Carga de Archivos';
      case 'timeline': return 'Línea de Tiempo';
      case 'intel-network': return 'Relaciones y Vínculos';
      case 'financial': return 'Análisis Financiero';
      case 'intel-identity': return 'Identificación de Personas';
      case 'workbooks': return 'Cuaderno del Caso';
      case 'map': return 'Mapa Georreferenciado';
      case 'ops-mobile': return 'Asistente de Campo';
      case 'ops-active': return 'Alertas en Territorio';
      case 'intel-db': return 'Personas Investigadas';
      case 'intel-osint': return 'Monitoreo de Redes';
      case 'strat-exec': return 'Indicadores de Gestión';
      case 'strat-perf': return 'Rendimiento de Unidades';
      case 'strat-reports': return 'Generador de Informes';
      case 'automation': return 'Reglas Automáticas';
      case 'sys-config': return 'Ajustes del Sistema';
      case 'sys-audit': return 'Historial del Sistema';
      case 'profile': return 'Perfil de Usuario';
      default: return view.charAt(0).toUpperCase() + view.slice(1);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
      
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center flex-1 gap-6">
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm">
           <span className="text-gray-400 font-medium">CerebroAC</span>
           <span className="material-symbols-outlined text-gray-300 text-sm mx-2">chevron_right</span>
           <span className="text-gray-800 font-medium">{formatViewName(currentView)}</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xl" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => { if(searchQuery.length > 1) setShowResults(true); }}
            className="block w-full pl-10 pr-12 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-100 text-sm transition-all"
            placeholder="Buscar personas, causas, ubicaciones..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-gray-200 rounded text-[10px] font-mono text-gray-400 bg-white">⌘K</kbd>
          </div>

          {/* Search Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Resultados</div>
                  {searchResults.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleResultClick(item)}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'suspect' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <span className="material-symbols-outlined text-sm">{item.type === 'suspect' ? 'person' : 'folder'}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.codeName || item.title}</div>
                        <div className="text-xs text-gray-400">{item.realName || item.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">No se encontraron resultados.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-1 pl-4">
        
        <button 
          onClick={toggleSecureMode}
          className={`p-2 rounded-lg transition-colors ${
            secureMode 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
          title="Modo Privacidad"
        >
          <span className="material-symbols-outlined text-[20px]">{secureMode ? 'visibility_off' : 'visibility'}</span>
        </button>

        <button 
          onClick={() => navigate('profile')}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors relative"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </button>
        
        <button 
          onClick={() => navigate('sys-config')}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <button 
          onClick={() => navigate('profile')}
          className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg py-1.5 px-2 transition-colors"
        >
          <img 
            src={currentUser.avatar} 
            alt="User" 
            className={`h-7 w-7 rounded-full bg-gray-100 object-cover border-2 border-gray-200 ${secureMode ? 'blur-sm' : ''}`}
          />
          <div className="text-left hidden lg:block">
             <div className="text-xs font-medium text-gray-700 leading-none">{currentUser.name}</div>
             <div className="text-[10px] text-gray-400 leading-none mt-1">{currentUser.rank}</div>
          </div>
          <span className="material-symbols-outlined text-gray-400 text-sm">arrow_drop_down</span>
        </button>
      </div>
    </header>
  );
};
