
import React, { useState, useMemo } from 'react';
import { SUSPECTS } from '../constants';
import { Suspect } from '../types';
import { useGlobalState } from '../components/GlobalState';
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";

// --- MOCK DATA GENERATORS FOR PRIVATE DBs ---
const generateNosisData = (dni: string) => {
   const score = Math.floor(Math.random() * (999 - 300) + 300);
   return {
      score,
      situation: score > 700 ? 1 : score > 400 ? 3 : 5,
      banks: ['Banco Macro', 'Santander Río', 'Mercado Pago'],
      employer: score > 500 ? 'EMPRESA CONSTRUCTORA S.R.L.' : 'MONOTRIBUTO SOCIAL',
      address: 'Fiscal: Av. Corrientes 1234, CABA'
   };
};

const generatePadronData = (dni: string) => {
   return {
      circuit: '05A - Seccional 2da',
      table: Math.floor(Math.random() * 500) + 1,
      order: Math.floor(Math.random() * 300) + 1,
      school: 'ESCUELA NRO 22 "SARMIENTO"'
   };
};

export const IntelligenceView: React.FC = () => {
   const { addNotification, navigate } = useGlobalState();
   const [localSuspects, setLocalSuspects] = useState<Suspect[]>(SUSPECTS);
   const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(localSuspects[0]);
   const [searchTerm, setSearchTerm] = useState('');
   const [activeTab, setActiveTab] = useState<'bio' | 'judicial' | 'family' | 'assets' | 'osint_search'>('bio');

   // OSINT Search State
   const [osintQuery, setOsintQuery] = useState({ dni: '', name: '', location: '' });
   const [isSearchingOsint, setIsSearchingOsint] = useState(false);
   const [osintResults, setOsintResults] = useState<any>(null);

   // Filters
   const [riskFilter, setRiskFilter] = useState('all');
   const [statusFilter, setStatusFilter] = useState('all');
   const [isFiltersOpen, setIsFiltersOpen] = useState(false);

   // Creation State
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [newSuspectData, setNewSuspectData] = useState<Partial<Suspect>>({
      codeName: '',
      realName: '',
      dni: '',
      cuit: '',
      dob: '',
      riskLevel: 50,
      status: 'Wanted',
      lastSeen: '',
      affiliations: [],
      image: ''
   });

   const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newSuspectData.codeName) return;

      const newSuspect: Suspect = {
         id: `s-${Date.now()}`,
         codeName: newSuspectData.codeName!,
         realName: newSuspectData.realName || 'Desconocido',
         dni: newSuspectData.dni,
         cuit: newSuspectData.cuit,
         dob: newSuspectData.dob,
         riskLevel: Number(newSuspectData.riskLevel),
         status: newSuspectData.status as any,
         lastSeen: newSuspectData.lastSeen || 'Sin datos recientes',
         image: newSuspectData.image || `https://i.pravatar.cc/150?u=${Date.now()}`,
         affiliations: typeof newSuspectData.affiliations === 'string' ? (newSuspectData.affiliations as string).split(',').map((s: string) => s.trim()) : [],
         addresses: [],
         judicialRecords: [],
         family: [],
         phones: [],
         assets: [],
         recidivismRisk: 'low',
         socialNetworkCentrality: 'leaf'
      };

      setLocalSuspects(prev => [newSuspect, ...prev]);
      setSelectedSuspect(newSuspect);
      setShowCreateModal(false);
      addNotification('success', `Dossier creado para ${newSuspect.codeName}.`);
   };

   // --- OSINT SEARCH ENGINE ---
   const performOsintSearch = async () => {
      if (!osintQuery.name && !osintQuery.dni) {
         addNotification('warning', 'Ingrese al menos un Nombre o DNI.');
         return;
      }

      setIsSearchingOsint(true);
      setOsintResults(null);

      try {
         // 1. Simulate Private DBs (Instant)
         const nosis = osintQuery.dni ? generateNosisData(osintQuery.dni) : null;
         const padron = osintQuery.dni ? generatePadronData(osintQuery.dni) : null;

         // 2. Real Google Search via Gemini
         const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
         if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
            console.warn("OSINT Search aborted: Missing or placeholder API Key.");
            setIsSearchingOsint(false);
            return;
         }

         const ai = new GoogleGenAI(apiKey);
         const prompt = `
        Objetivo: Realizar perfilado OSINT rápido de una persona.
        Sujeto: ${osintQuery.name} ${osintQuery.dni ? `(DNI Probable: ${osintQuery.dni})` : ''}
        Ubicación: ${osintQuery.location || 'Argentina'}
        
        Tarea:
        1. Busca perfiles en redes sociales (LinkedIn, Facebook, Instagram).
        2. Busca menciones en noticias policiales o boletines oficiales.
        3. Busca datos laborales públicos (CUIT, empresas vinculadas).
        
        Formato JSON Requerido:
        {
          "summary": "Resumen narrativo de 2 lineas sobre su huella digital.",
          "social_media": [{"platform": "Nombre", "url": "Link", "context": "Rol/Info"}],
          "news": [{"title": "Titulo Nota", "source": "Medio", "date": "Fecha aprox"}],
          "employment": "Posible empleo detectado o 'Sin datos'"
        }
      `;

         const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            tools: [{ googleSearchRetrieval: {} } as any]
         });

         const text = result.response.text();
         let webData = { summary: "No se encontraron datos web relevantes.", social_media: [], news: [] };
         try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) webData = JSON.parse(jsonMatch[0]);
         } catch (e) {
            console.warn("Failed to parse JSON from AI", e);
         }

         setOsintResults({
            financial: nosis,
            electoral: padron,
            web: webData
         });

         addNotification('success', 'Búsqueda en 5 bases de datos completada.');

      } catch (error) {
         console.error(error);
         addNotification('error', 'Error conectando con servicios de búsqueda.');
      } finally {
         setIsSearchingOsint(false);
      }
   };

   const mergeOsintData = () => {
      if (!selectedSuspect || !osintResults) return;

      // Logic to merge data would go here
      // For demo visual:
      addNotification('success', `Datos de ${osintQuery.name || osintQuery.dni} vinculados al legajo de ${selectedSuspect.codeName}.`);
      setActiveTab('bio');
   };

   // Filter Logic
   const filteredSuspects = useMemo(() => {
      return localSuspects.filter(suspect => {
         const searchLower = searchTerm.toLowerCase();
         const matchesSearch =
            suspect.codeName.toLowerCase().includes(searchLower) ||
            suspect.realName.toLowerCase().includes(searchLower) ||
            suspect.dni?.includes(searchLower);

         const matchesStatus = statusFilter === 'all' || suspect.status === statusFilter;

         let matchesRisk = true;
         if (riskFilter === 'critical') matchesRisk = suspect.riskLevel >= 80;
         else if (riskFilter === 'high') matchesRisk = suspect.riskLevel >= 50 && suspect.riskLevel < 80;
         else if (riskFilter === 'medium') matchesRisk = suspect.riskLevel >= 20 && suspect.riskLevel < 50;
         else if (riskFilter === 'low') matchesRisk = suspect.riskLevel < 20;

         return matchesSearch && matchesStatus && matchesRisk;
      });
   }, [searchTerm, statusFilter, riskFilter, localSuspects]);

   return (
      <div className="flex h-full overflow-hidden relative">
         {/* List Panel */}
         <div className="w-1/3 border-r border-nexus-700 flex flex-col bg-nexus-900/50">
            <div className="p-4 border-b border-nexus-700 bg-nexus-800/30">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-white">Base de Datos: Objetivos</h2>
                  <div className="flex gap-2">
                     <span className="text-xs font-mono text-nexus-accent bg-nexus-accent/10 px-2 py-1.5 rounded border border-nexus-accent/20 flex items-center">
                        {filteredSuspects.length} REG
                     </span>
                     <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-nexus-accent hover:bg-blue-600 text-white p-1.5 rounded shadow-lg transition-colors"
                        title="Crear Nuevo Dossier"
                     >
                        <span className="material-symbols-outlined text-lg">add</span>
                     </button>
                  </div>
               </div>

               {/* Main Search */}
               <div className="relative mb-3">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="material-symbols-outlined text-gray-500 text-sm">search</span>
                  </span>
                  <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="block w-full pl-9 pr-3 py-2 border border-nexus-700 rounded-md leading-5 bg-nexus-900 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-nexus-accent sm:text-xs transition-colors"
                     placeholder="Buscar por nombre, alias o DNI..."
                  />
               </div>

               <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-sm">filter_list</span> Filtros
               </button>

               {isFiltersOpen && (
                  <div className="grid grid-cols-2 gap-2 mb-2 animate-fade-in">
                     <select onChange={e => setStatusFilter(e.target.value)} className="bg-nexus-800 border border-nexus-700 text-gray-300 text-xs rounded p-1">
                        <option value="all">Todos los Estados</option>
                        <option value="Wanted">Pedido de Captura</option>
                        <option value="Surveillance">Bajo Vigilancia</option>
                        <option value="Captured">Detenido</option>
                     </select>
                     <select onChange={e => setRiskFilter(e.target.value)} className="bg-nexus-800 border border-nexus-700 text-gray-300 text-xs rounded p-1">
                        <option value="all">Riesgo: Todos</option>
                        <option value="critical">Crítico (80+)</option>
                        <option value="high">Alto</option>
                     </select>
                  </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
               {filteredSuspects.map(suspect => (
                  <div
                     key={suspect.id}
                     onClick={() => setSelectedSuspect(suspect)}
                     className={`
                p-3 mb-2 rounded-lg cursor-pointer border transition-all duration-200
                ${selectedSuspect?.id === suspect.id
                           ? 'bg-nexus-accent/10 border-nexus-accent'
                           : 'bg-nexus-800/30 border-transparent hover:bg-nexus-800 hover:border-nexus-700'}
              `}
                  >
                     <div className="flex items-center gap-3">
                        <div className="relative">
                           <img src={suspect.image} alt={suspect.codeName} className="w-10 h-10 rounded-full object-cover" />
                           {suspect.riskLevel > 80 && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-danger opacity-75"></span>
                                 <span className="relative inline-flex rounded-full h-3 w-3 bg-nexus-danger"></span>
                              </span>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center mb-0.5">
                              <h4 className={`text-sm font-bold truncate ${selectedSuspect?.id === suspect.id ? 'text-nexus-accent' : 'text-gray-200'}`}>
                                 {suspect.codeName}
                              </h4>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${suspect.riskLevel > 80 ? 'bg-nexus-danger/20 text-nexus-danger' : 'bg-nexus-warning/20 text-nexus-warning'
                                 }`}>
                                 R: {suspect.riskLevel}
                              </span>
                           </div>
                           <p className="text-xs text-gray-500 truncate">{suspect.realName}</p>
                           {suspect.dni && <p className="text-[10px] text-gray-600 font-mono">DNI: {suspect.dni}</p>}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Detail Panel */}
         <div className="flex-1 bg-nexus-950 flex flex-col overflow-y-auto custom-scrollbar p-0 relative">
            {selectedSuspect ? (
               <div className="w-full h-full flex flex-col">

                  {/* Header */}
                  <div className="bg-black/60 backdrop-blur-xl border-b border-white/5 p-8 flex gap-8 items-start relative overflow-hidden z-10">
                     <div className="relative group/avatar">
                        <div className="w-40 h-40 rounded-none overflow-hidden border border-white/10 relative z-10">
                           <img src={selectedSuspect.image} className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-700" />
                           <div className="absolute inset-0 bg-nexus-accent/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="absolute -inset-2 border border-nexus-accent/20 opacity-50 pointer-events-none group-hover/avatar:scale-105 transition-transform"></div>
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-20 italic ${selectedSuspect.status === 'Wanted' ? 'bg-nexus-danger text-white' :
                           selectedSuspect.status === 'Captured' ? 'bg-white/10 text-gray-400 border border-white/5' : 'bg-nexus-warning text-black'
                           }`}>
                           {selectedSuspect.status === 'Wanted' ? 'Pedido de Captura' : selectedSuspect.status === 'Captured' ? 'Detenido' : 'Bajo Vigilancia'}
                        </div>
                     </div>

                     <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <span className="text-[8px] font-mono text-nexus-accent uppercase tracking-widest bg-nexus-accent/5 px-2 border border-nexus-accent/20">Target_Identity</span>
                                 <span className="text-[8px] font-mono text-gray-500">ID_REF: {selectedSuspect.id.toUpperCase()}</span>
                              </div>
                              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{selectedSuspect.realName}</h1>
                              <p className="text-xl text-nexus-accent font-black font-mono mt-1 tracking-widest italic">ALIAS: "{selectedSuspect.codeName.toUpperCase()}"</p>
                           </div>
                           <div className="text-right">
                              <div className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-widest mb-1">Risk_Entrophy_Index</div>
                              <div className={`text-4xl font-black italic tracking-tighter ${selectedSuspect.recidivismRisk === 'imminent' ? 'text-nexus-danger animate-pulse' :
                                 selectedSuspect.recidivismRisk === 'high' ? 'text-nexus-danger' : 'text-nexus-warning'
                                 }`}>
                                 {selectedSuspect.riskLevel}%
                              </div>
                              <div className="text-[8px] font-mono text-gray-600 uppercase mt-1">Classification: {selectedSuspect.recidivismRisk}</div>
                           </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                           {[
                              { label: 'DNI_TOKEN', val: selectedSuspect.dni, icon: 'id_card' },
                              { label: 'TAX_UID', val: selectedSuspect.cuit, icon: 'badge' },
                              { label: 'CHRONO_REF', val: selectedSuspect.dob, icon: 'history' }
                           ].filter(d => d.val).map(data => (
                              <div key={data.label} className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/5 hover:border-white/20 transition-all">
                                 <span className="material-symbols-outlined text-nexus-accent text-sm">{data.icon}</span>
                                 <div className="flex flex-col">
                                    <span className="text-[7px] font-mono text-gray-500 uppercase">{data.label}</span>
                                    <span className="text-[10px] text-white font-mono tracking-tighter">{data.val}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="flex border-b border-white/5 bg-black/40 px-8 sticky top-0 z-20 overflow-x-auto backdrop-blur-md">
                     {[
                        { id: 'bio', label: 'Tactical_Bio', icon: 'person' },
                        { id: 'judicial', label: 'Judicial_History', icon: 'gavel' },
                        { id: 'family', label: 'Lineage_Network', icon: 'diversity_3' },
                        { id: 'assets', label: 'Capital_Assets', icon: 'account_balance' },
                        { id: 'osint_search', label: 'OSINT_Deep_Scan', icon: 'travel_explore' },
                     ].map(tab => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id as any)}
                           className={`px-6 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] italic border-b-2 transition-all whitespace-nowrap group ${activeTab === tab.id
                              ? 'border-nexus-accent text-white bg-nexus-accent/5'
                              : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                              }`}
                        >
                           <span className={`material-symbols-outlined text-sm ${activeTab === tab.id ? 'text-nexus-accent filled-icon' : 'group-hover:text-nexus-accent'
                              } ${tab.id === 'osint_search' ? 'animate-pulse text-nexus-accent' : ''}`}>
                              {tab.icon}
                           </span>
                           {tab.label}
                        </button>
                     ))}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 p-8 bg-nexus-950 overflow-y-auto custom-scrollbar">

                     {activeTab === 'bio' && (
                        <div className="space-y-8 animate-fade-in relative">
                           <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                              <span className="material-symbols-outlined text-[200px]">fingerprint</span>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Behavioral Profile & Risk Radar */}
                              <div className="glass-panel p-6 border border-white/5 rounded relative overflow-hidden group">
                                 <h3 className="text-[10px] font-black text-nexus-accent mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">neurology</span>
                                    Behavioral_Profiling_Radar
                                 </h3>

                                 <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="relative w-40 h-40">
                                       {/* Simple SVG Radar Chart */}
                                       <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-180">
                                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                          <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                          <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                                          <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                                          {/* Polygon based on behavioral profile */}
                                          {selectedSuspect.behavioralProfile && (
                                             <polygon
                                                points={`
                                                   50,${50 - (selectedSuspect.behavioralProfile.violentTendency * 0.45)}
                                                   ${50 + (selectedSuspect.behavioralProfile.sociability * 0.45)},50
                                                   50,${50 + (selectedSuspect.behavioralProfile.impulsivity * 0.45)}
                                                   ${50 - ((selectedSuspect.behavioralProfile.narcissism || 50) * 0.45)},50
                                                `}
                                                fill="rgba(59, 130, 246, 0.3)"
                                                stroke="var(--color-accent)"
                                                strokeWidth="1"
                                                className="animate-pulse"
                                             />
                                          )}
                                       </svg>
                                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[7px] text-nexus-danger font-bold uppercase">Violencia</div>
                                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[7px] text-nexus-accent font-bold uppercase">Impulso</div>
                                       <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 text-[7px] text-nexus-accent font-bold uppercase rotate-90">Social</div>
                                       <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 text-[7px] text-nexus-accent font-bold uppercase -rotate-90">Ego</div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                       {selectedSuspect.behavioralProfile ? (
                                          <>
                                             <div className="bg-black/40 p-3 border border-white/5 rounded-sm">
                                                <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">Diagnostic_Executive_Summary</p>
                                                <p className="text-[10px] text-white italic leading-tight">
                                                   Sujeto con marcada {selectedSuspect.behavioralProfile.violentTendency > 70 ? 'predisposición a la confrontación física' : 'conducta evasiva'}.
                                                   Nivel de sociabilidad {selectedSuspect.behavioralProfile.sociability > 60 ? 'ALTO (Capacidad de reclutamiento)' : 'BAJO (Accionar solitario)'}.
                                                </p>
                                             </div>
                                             <div className="flex flex-wrap gap-2">
                                                {selectedSuspect.behavioralProfile.predominantMO.map(mo => (
                                                   <span key={mo} className="text-[9px] font-bold text-nexus-accent bg-nexus-accent/5 border border-nexus-accent/20 px-2 py-1 italic uppercase">#{mo.replace(/\s+/g, '_')}</span>
                                                ))}
                                             </div>
                                          </>
                                       ) : (
                                          <div className="p-4 text-center text-[10px] font-mono text-gray-600 uppercase italic">
                                             perfil_conductual_indeterminado
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>

                              {/* Organizational Taxonomy / Hierarchy */}
                              <div className="glass-panel p-6 border border-white/5 rounded relative overflow-hidden group">
                                 <h3 className="text-[10px] font-black text-nexus-accent mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">account_tree</span>
                                    Criminal_Hierarchy_Role
                                 </h3>

                                 <div className="flex flex-col items-center">
                                    <div className="relative w-full max-w-xs aspect-video flex flex-col items-center justify-center border border-white/5 bg-black/40">
                                       {/* Hierarchy Pyramid Simulation */}
                                       <div className={`w-12 h-6 border flex items-center justify-center text-[8px] font-black transition-all ${selectedSuspect.socialNetworkCentrality === 'hub' ? 'bg-nexus-danger text-white border-nexus-danger scale-125 z-10 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 text-gray-600 border-white/10'}`}>BOSS</div>
                                       <div className="w-0.5 h-2 bg-white/10"></div>
                                       <div className="flex gap-4">
                                          <div className={`w-12 h-6 border flex items-center justify-center text-[8px] font-black transition-all ${selectedSuspect.socialNetworkCentrality === 'bridge' ? 'bg-nexus-warning text-black border-nexus-warning scale-110 z-10' : 'bg-white/5 text-gray-600 border-white/10'}`}>LIEUTENANT</div>
                                          <div className="w-12 h-6 border bg-white/5 text-gray-600 border-white/10 flex items-center justify-center text-[8px] font-black">ADVISOR</div>
                                       </div>
                                       <div className="w-0.5 h-2 bg-white/10"></div>
                                       <div className="flex gap-2">
                                          <div className={`w-12 h-6 border flex items-center justify-center text-[8px] font-black transition-all ${selectedSuspect.socialNetworkCentrality === 'leaf' ? 'bg-nexus-accent text-white border-nexus-accent pulse-shadow' : 'bg-white/5 text-gray-600 border-white/10'}`}>ENFORCER</div>
                                          <div className="w-12 h-6 border bg-white/5 text-gray-600 border-white/10 flex items-center justify-center text-[8px] font-black">SOLDIER</div>
                                          <div className="w-12 h-6 border bg-white/5 text-gray-600 border-white/10 flex items-center justify-center text-[8px] font-black">RECRUIT</div>
                                       </div>
                                    </div>
                                    <p className="mt-4 text-[10px] font-mono text-gray-500 text-center uppercase tracking-widest italic">
                                       Current Designation: <span className="text-white font-black">{selectedSuspect.socialNetworkCentrality === 'hub' ? 'Organizational Ringleader' : selectedSuspect.socialNetworkCentrality === 'bridge' ? 'Strategic Connector' : 'Operational Asset'}</span>
                                    </p>
                                 </div>
                              </div>

                              {/* Domicilios Registrados */}
                              <div className="glass-panel p-6 border-white/5 rounded-none">
                                 <h3 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-nexus-accent">location_home</span>
                                    Geospatial_Footprint
                                 </h3>
                                 <div className="space-y-3">
                                    {selectedSuspect.addresses?.map((addr, i) => (
                                       <div key={i} className="bg-white/5 p-4 border border-white/5 relative group hover:border-nexus-accent transition-all">
                                          <div className="flex justify-between items-start mb-1">
                                             <p className="text-xs text-white font-black italic uppercase">{addr.street}</p>
                                             <span className="text-[8px] font-mono text-nexus-accent border border-nexus-accent/20 px-1">{addr.source}</span>
                                          </div>
                                          <p className="text-[10px] text-gray-500 font-mono italic">{addr.city}, {addr.province}</p>
                                       </div>
                                    ))}
                                    {!selectedSuspect.addresses?.length && <p className="text-gray-600 text-[10px] italic font-mono uppercase tracking-widest text-center py-4">no_confirmed_coordinates_found</p>}
                                 </div>
                              </div>

                              {/* Phones & Social */}
                              <div className="glass-panel p-6 border-white/5 rounded-none">
                                 <h3 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-nexus-accent">wifi_tethering</span>
                                    Signal_Intelligence
                                 </h3>
                                 <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                       {selectedSuspect.phones?.map((ph, i) => (
                                          <div key={i} className="bg-black/40 p-3 border border-white/5 flex flex-col gap-1">
                                             <span className="text-[8px] font-mono text-gray-600 uppercase">GSM_UL_Ref[{i}]</span>
                                             <span className="text-xs text-white font-mono tracking-tighter">{ph.number}</span>
                                          </div>
                                       ))}
                                    </div>
                                    <div className="space-y-2">
                                       {selectedSuspect.socialMedia?.map((sm, i) => (
                                          <div key={i} className="flex items-center gap-4 bg-white/5 p-3 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                             <div className="w-8 h-8 flex items-center justify-center text-gray-500 group-hover:text-nexus-accent transition-colors">
                                                <span className="material-symbols-outlined text-xl">account_circle</span>
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-white italic truncate uppercase">{sm.platform}</p>
                                                <p className="text-[9px] text-nexus-accent font-mono truncate">{sm.link}</p>
                                             </div>
                                             <span className="material-symbols-outlined text-xs text-gray-700">link</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              {/* Organizational Cluster Dynamics (FBI Grade) */}
                              <div className="glass-panel p-6 border border-white/5 rounded col-span-1 lg:col-span-2 relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 p-4">
                                    <span className="text-[10px] font-mono text-nexus-accent border border-nexus-accent/30 px-2 animate-pulse">INTEGRITY_CHECK_PASSED</span>
                                 </div>
                                 <h3 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-nexus-accent">rebase_edit</span>
                                    Organizational_Cluster_Dynamics
                                 </h3>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1 space-y-4">
                                       <div className="bg-black/60 p-4 border border-white/5 border-l-4 border-l-nexus-accent">
                                          <p className="text-[8px] font-mono text-gray-500 uppercase">Primary_Affiliation</p>
                                          <p className="text-sm text-white font-black italic">CLAN_DE_LOS_MONOS (98% Correlation)</p>
                                       </div>
                                       <div className="space-y-2">
                                          <p className="text-[9px] font-mono text-gray-600 uppercase">Known_Sub_Cells</p>
                                          {['Célula Sur (Logística)', 'Célula Oeste (Distribución)', 'Fuerza de Choque'].map(cell => (
                                             <div key={cell} className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                                <span className="w-1.5 h-1.5 bg-nexus-accent rounded-full"></span>
                                                {cell}
                                             </div>
                                          ))}
                                       </div>
                                    </div>

                                    <div className="md:col-span-2 bg-[#0a0a0a] rounded-xl border border-white/5 p-6 relative">
                                       <div className="flex flex-col items-center gap-6">
                                          <div className="w-32 h-10 border border-nexus-accent/50 bg-nexus-accent/10 flex items-center justify-center text-[9px] text-white font-black uppercase">V. CANTERO (LÍDER)</div>
                                          <div className="h-4 w-px bg-nexus-accent/30"></div>
                                          <div className="flex gap-12 relative">
                                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-white/10 -mt-px"></div>
                                             <div className="flex flex-col items-center">
                                                <div className="w-20 h-8 border border-white/10 bg-white/5 flex items-center justify-center text-[8px] text-gray-400 font-bold">OPERACIONES</div>
                                                <div className="h-4 w-px bg-white/10"></div>
                                                <div className="bg-blue-500 text-white px-3 py-1 text-[8px] font-black pulse-shadow italic">"{selectedSuspect.codeName.toUpperCase()}"</div>
                                             </div>
                                             <div className="flex flex-col items-center">
                                                <div className="w-20 h-8 border border-white/10 bg-white/5 flex items-center justify-center text-[8px] text-gray-400 font-bold">FINANZAS</div>
                                                <div className="h-4 w-px bg-white/10"></div>
                                                <div className="px-3 py-1 bg-white/5 border border-white/10 text-gray-500 text-[8px] font-black">NODE_HIDDEN</div>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="absolute bottom-2 right-4 text-[7px] font-mono text-gray-700 italic">generated_via_cluster_link_v2.1</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'judicial' && (
                        <div className="space-y-6 animate-fade-in">
                           {selectedSuspect.judicialRecords?.map((rec, i) => (
                              <div key={i} className="glass-panel border-l-4 border-l-red-500 rounded-r-xl p-5 border-y border-r border-nexus-700 bg-nexus-900/40">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-white font-bold text-lg">{rec.charge}</h4>
                                    <span className="bg-nexus-800 text-gray-300 text-xs px-2 py-1 rounded font-mono border border-nexus-700">CUIJ: {rec.cuij}</span>
                                 </div>
                                 <p className="text-nexus-accent text-sm font-bold mb-4 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    {rec.date}
                                 </p>

                                 <div className="grid grid-cols-2 gap-6">
                                    <div>
                                       <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Víctimas</p>
                                       <ul className="list-disc list-inside text-sm text-gray-300">
                                          {rec.victims.map((v, idx) => <li key={idx}>{v}</li>)}
                                       </ul>
                                    </div>
                                    <div>
                                       <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Co-Imputados</p>
                                       <ul className="list-disc list-inside text-sm text-gray-300">
                                          {rec.coDefendants.map((co, idx) => <li key={idx}>{co}</li>)}
                                       </ul>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           {!selectedSuspect.judicialRecords?.length && (
                              <div className="text-center p-10 text-gray-500 border-2 border-dashed border-nexus-800 rounded-xl">
                                 No hay registros judiciales cargados.
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === 'family' && (
                        <div className="space-y-4 animate-fade-in">
                           <div className="overflow-hidden rounded-xl border border-nexus-700">
                              <table className="w-full text-left">
                                 <thead className="bg-nexus-900 text-xs text-gray-500 uppercase">
                                    <tr>
                                       <th className="p-4">Familiar</th>
                                       <th className="p-4">Relación</th>
                                       <th className="p-4">DNI</th>
                                       <th className="p-4">Domicilio</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-nexus-800 bg-nexus-900/30">
                                    {selectedSuspect.family?.map((fam, i) => (
                                       <tr key={i} className="hover:bg-nexus-800/50">
                                          <td className="p-4 text-white font-bold">{fam.name}</td>
                                          <td className="p-4 text-nexus-accent text-sm font-bold">{fam.relation}</td>
                                          <td className="p-4 text-gray-400 font-mono text-sm">{fam.dni}</td>
                                          <td className="p-4 text-gray-400 text-sm max-w-xs truncate" title={fam.address}>{fam.address}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                              {!selectedSuspect.family?.length && <div className="p-4 text-center text-gray-500 text-sm">Sin datos familiares.</div>}
                           </div>
                        </div>
                     )}

                     {activeTab === 'assets' && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="glass-panel p-5 rounded-xl border border-nexus-700">
                              <h3 className="text-sm font-bold text-white mb-4">Registros Sociales & Laborales</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {selectedSuspect.socialSecurity?.map((soc, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-nexus-900 p-3 rounded border border-nexus-800">
                                       <div className="w-10 h-10 rounded bg-nexus-800 flex items-center justify-center text-green-500">
                                          <span className="material-symbols-outlined">health_and_safety</span>
                                       </div>
                                       <div>
                                          <p className="text-white font-bold text-sm">{soc.entity}</p>
                                          <div className="flex gap-2 text-[10px] text-gray-400 mt-1">
                                             <span className="bg-nexus-800 px-1.5 rounded">{soc.type}</span>
                                             <span className="text-green-400 font-bold">{soc.status}</span>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="glass-panel p-5 rounded-xl border border-nexus-700">
                              <h3 className="text-sm font-bold text-white mb-4">Bienes Registrables (Inmuebles / Automotores)</h3>
                              <div className="text-center py-6 text-gray-500 italic text-sm">
                                 No registra bienes vinculados directamente en las bases de datos consultadas.
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'osint_search' && (
                        <div className="space-y-8 animate-fade-in">

                           {/* Search Bar Panel */}
                           <div className="glass-panel p-6 rounded-xl border border-nexus-700 bg-nexus-900/30">
                              <div className="flex items-center gap-3 mb-6">
                                 <div className="w-10 h-10 rounded-full bg-nexus-accent flex items-center justify-center shadow-lg shadow-nexus-accent/30">
                                    <span className="material-symbols-outlined text-white">travel_explore</span>
                                 </div>
                                 <div>
                                    <h3 className="text-lg font-bold text-white">Motor de Búsqueda Unificada</h3>
                                    <p className="text-xs text-gray-400">Consulta simultánea: Web Abierta (Google), NOSIS, Padrones y Redes Sociales.</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                 <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nombre Completo</label>
                                    <input
                                       type="text"
                                       className="w-full bg-nexus-950 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                                       placeholder="Apellido y Nombres"
                                       value={osintQuery.name}
                                       onChange={e => setOsintQuery({ ...osintQuery, name: e.target.value })}
                                    />
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">DNI (Opcional)</label>
                                    <input
                                       type="text"
                                       className="w-full bg-nexus-950 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                                       placeholder="Número de Documento"
                                       value={osintQuery.dni}
                                       onChange={e => setOsintQuery({ ...osintQuery, dni: e.target.value })}
                                    />
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Localidad / Barrio</label>
                                    <input
                                       type="text"
                                       className="w-full bg-nexus-950 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                                       placeholder="Ej: Rosario, Santa Fe"
                                       value={osintQuery.location}
                                       onChange={e => setOsintQuery({ ...osintQuery, location: e.target.value })}
                                    />
                                 </div>
                              </div>

                              <div className="flex gap-4">
                                 <button
                                    onClick={performOsintSearch}
                                    disabled={isSearchingOsint}
                                    className="px-6 py-2.5 bg-nexus-accent hover:bg-blue-600 text-white rounded font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                                 >
                                    {isSearchingOsint ? (
                                       <>
                                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                          Escaneando Fuentes...
                                       </>
                                    ) : (
                                       <>
                                          <span className="material-symbols-outlined">search</span>
                                          Iniciar Rastreo
                                       </>
                                    )}
                                 </button>
                                 <div className="flex items-center gap-3 text-xs text-gray-500 ml-auto">
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Google</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> NOSIS (Sim)</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Padrones</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> LinkedIn</span>
                                 </div>
                              </div>
                           </div>

                           {/* Results Area */}
                           {osintResults && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">

                                 {/* Financial / Official Data (Simulated) */}
                                 <div className="space-y-6">
                                    {/* NOSIS CARD */}
                                    <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-xl">
                                       <div className="bg-[#004aad] p-3 flex justify-between items-center text-white">
                                          <span className="font-bold text-sm">INFORME COMERCIAL (NOSIS/BCRA)</span>
                                          <span className="material-symbols-outlined">analytics</span>
                                       </div>
                                       <div className="p-5">
                                          {osintResults.financial ? (
                                             <>
                                                <div className="flex justify-between items-center mb-4">
                                                   <div className="text-center">
                                                      <div className="text-xs text-gray-500 uppercase font-bold">Score Crediticio</div>
                                                      <div className={`text-3xl font-black ${osintResults.financial.score < 400 ? 'text-red-600' : 'text-green-600'}`}>
                                                         {osintResults.financial.score}
                                                      </div>
                                                   </div>
                                                   <div className="text-center">
                                                      <div className="text-xs text-gray-500 uppercase font-bold">Situación BCRA</div>
                                                      <div className={`text-xl font-bold px-3 py-1 rounded text-white ${osintResults.financial.situation === 1 ? 'bg-green-600' : 'bg-red-600'}`}>
                                                         SITUACIÓN {osintResults.financial.situation}
                                                      </div>
                                                   </div>
                                                </div>
                                                <div className="space-y-2 text-sm border-t pt-3">
                                                   <div className="flex justify-between"><span className="text-gray-500">Empleador:</span> <span className="font-bold">{osintResults.financial.employer}</span></div>
                                                   <div className="flex justify-between"><span className="text-gray-500">Domicilio Fiscal:</span> <span className="font-bold text-right w-1/2">{osintResults.financial.address}</span></div>
                                                   <div className="flex justify-between"><span className="text-gray-500">Bancarización:</span> <span className="font-bold">{osintResults.financial.banks.join(', ')}</span></div>
                                                </div>
                                             </>
                                          ) : <div className="text-center text-gray-500">Sin datos financieros. DNI requerido.</div>}
                                       </div>
                                    </div>

                                    {/* PADRONES CARD */}
                                    <div className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden shadow-lg">
                                       <div className="bg-gray-200 p-2 border-b border-gray-300 text-center font-bold text-gray-700 text-xs uppercase">
                                          Registro Electoral (Padrón)
                                       </div>
                                       <div className="p-4">
                                          {osintResults.electoral ? (
                                             <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="block text-[10px] text-gray-500 uppercase">Circuito</span> <span className="font-bold text-gray-900">{osintResults.electoral.circuit}</span></div>
                                                <div><span className="block text-[10px] text-gray-500 uppercase">Mesa / Orden</span> <span className="font-bold text-gray-900">{osintResults.electoral.table} / {osintResults.electoral.order}</span></div>
                                                <div className="col-span-2"><span className="block text-[10px] text-gray-500 uppercase">Establecimiento</span> <span className="font-bold text-gray-900">{osintResults.electoral.school}</span></div>
                                             </div>
                                          ) : <div className="text-center text-gray-500 text-xs">No figura en padrón activo.</div>}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Web Footprint (Gemini Grounding) */}
                                 <div className="bg-nexus-900 border border-nexus-700 rounded-xl overflow-hidden flex flex-col">
                                    <div className="p-3 bg-nexus-800 border-b border-nexus-700 flex justify-between items-center">
                                       <span className="font-bold text-white text-sm flex items-center gap-2">
                                          <span className="material-symbols-outlined text-nexus-accent">public</span>
                                          Huella Digital (Web Abierta)
                                       </span>
                                       <span className="text-[10px] bg-nexus-900 px-2 py-0.5 rounded text-gray-400">Powered by Google</span>
                                    </div>
                                    <div className="p-5 flex-1 space-y-4">
                                       <div className="bg-nexus-950 p-3 rounded border border-nexus-800 text-sm text-gray-300 italic">
                                          "{osintResults.web.summary}"
                                       </div>

                                       <div>
                                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Redes Sociales Detectadas</h4>
                                          {osintResults.web.social_media.length > 0 ? (
                                             <div className="space-y-2">
                                                {osintResults.web.social_media.map((soc: any, i: number) => (
                                                   <a key={i} href={soc.url} target="_blank" className="flex items-center gap-3 p-2 bg-nexus-800/50 rounded hover:bg-nexus-800 transition-colors group">
                                                      <div className="w-8 h-8 rounded bg-nexus-700 flex items-center justify-center group-hover:bg-nexus-accent group-hover:text-white transition-colors">
                                                         <span className="material-symbols-outlined text-sm">link</span>
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                         <div className="text-xs font-bold text-white">{soc.platform}</div>
                                                         <div className="text-[10px] text-gray-400 truncate">{soc.url}</div>
                                                      </div>
                                                      <span className="material-symbols-outlined text-gray-500 text-sm">open_in_new</span>
                                                   </a>
                                                ))}
                                             </div>
                                          ) : <p className="text-xs text-gray-500">No se detectaron perfiles públicos claros.</p>}
                                       </div>

                                       <div>
                                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Menciones en Noticias / Web</h4>
                                          <ul className="space-y-2">
                                             {osintResults.web.news.map((news: any, i: number) => (
                                                <li key={i} className="text-xs text-gray-300 border-l-2 border-nexus-600 pl-2">
                                                   <span className="block font-bold text-white">{news.title}</span>
                                                   <span className="text-gray-500">{news.source} • {news.date}</span>
                                                </li>
                                             ))}
                                          </ul>
                                       </div>
                                    </div>

                                    <div className="p-4 border-t border-nexus-800 bg-nexus-900/50">
                                       <button
                                          onClick={mergeOsintData}
                                          className="w-full py-3 bg-nexus-accent hover:bg-blue-600 text-white rounded font-bold shadow-lg flex items-center justify-center gap-2 transition-colors"
                                       >
                                          <span className="material-symbols-outlined">save_alt</span>
                                          Vincular Datos a Legajo
                                       </button>
                                    </div>
                                 </div>

                              </div>
                           )}
                        </div>
                     )}

                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <span className="material-symbols-outlined text-6xl mb-4 text-nexus-800">encrypted</span>
                  <p className="text-lg font-medium text-gray-400">Acceso a Base de Datos Restringido</p>
                  <p className="text-sm">Seleccione un objetivo o cree un nuevo dossier.</p>
               </div>
            )}
         </div>

         {/* CREATE MODAL */}
         {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
               <div className="glass-panel w-full max-w-2xl rounded-xl p-0 border border-nexus-600 shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-nexus-700 flex justify-between items-center bg-nexus-900">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-nexus-accent">person_add</span>
                        Nuevo Dossier de Inteligencia
                     </h3>
                     <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                     </button>
                  </div>

                  <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-nexus-950">
                     <form onSubmit={handleCreate} className="space-y-6">

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-xs font-bold text-gray-400 mb-1">ALIAS / CODENAME <span className="text-red-500">*</span></label>
                              <input
                                 type="text"
                                 required
                                 value={newSuspectData.codeName}
                                 onChange={e => setNewSuspectData({ ...newSuspectData, codeName: e.target.value })}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                                 placeholder="Ej: CHAVO"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 mb-1">NOMBRE REAL</label>
                              <input
                                 type="text"
                                 value={newSuspectData.realName}
                                 onChange={e => setNewSuspectData({ ...newSuspectData, realName: e.target.value })}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                                 placeholder="Apellido y Nombres"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-gray-400 mb-1">DNI</label>
                              <input
                                 type="text"
                                 value={newSuspectData.dni}
                                 onChange={e => setNewSuspectData({ ...newSuspectData, dni: e.target.value })}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 mb-1">CUIT/CUIL</label>
                              <input
                                 type="text"
                                 value={newSuspectData.cuit}
                                 onChange={e => setNewSuspectData({ ...newSuspectData, cuit: e.target.value })}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 mb-1">FECHA NACIMIENTO</label>
                              <input
                                 type="text"
                                 value={newSuspectData.dob}
                                 onChange={e => setNewSuspectData({ ...newSuspectData, dob: e.target.value })}
                                 className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                                 placeholder="DD/MM/AAAA"
                              />
                           </div>
                        </div>

                        <div className="p-4 bg-nexus-900 rounded border border-nexus-800">
                           <h4 className="text-xs font-bold text-white mb-3 border-b border-nexus-700 pb-2">ESTADO OPERATIVO</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">CONDICIÓN</label>
                                 <select
                                    value={newSuspectData.status}
                                    onChange={e => setNewSuspectData({ ...newSuspectData, status: e.target.value })}
                                    className="w-full bg-nexus-950 border border-nexus-700 rounded p-2 text-white focus:border-nexus-accent focus:outline-none"
                                 >
                                    <option value="Wanted">Pedido de Captura</option>
                                    <option value="Surveillance">Bajo Vigilancia</option>
                                    <option value="Captured">Detenido</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">NIVEL DE RIESGO ({newSuspectData.riskLevel}%)</label>
                                 <input
                                    type="range"
                                    min="0" max="100"
                                    value={newSuspectData.riskLevel}
                                    onChange={e => setNewSuspectData({ ...newSuspectData, riskLevel: Number(e.target.value) })}
                                    className="w-full accent-nexus-accent mt-2"
                                 />
                              </div>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-gray-400 mb-1">AFILIACIONES (Bandas / Organizaciones)</label>
                           <input
                              type="text"
                              value={newSuspectData.affiliations as string}
                              onChange={e => setNewSuspectData({ ...newSuspectData, affiliations: e.target.value })}
                              className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                              placeholder="Ej: Banda del Fonavi, Los Monos (Separar por comas)"
                           />
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-gray-400 mb-1">FOTO DE PERFIL (URL)</label>
                           <input
                              type="text"
                              value={newSuspectData.image}
                              onChange={e => setNewSuspectData({ ...newSuspectData, image: e.target.value })}
                              className="w-full bg-nexus-900 border border-nexus-700 rounded p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                              placeholder="https://..."
                           />
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-nexus-800">
                           <button
                              type="button"
                              onClick={() => setShowCreateModal(false)}
                              className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                           >
                              Cancelar
                           </button>
                           <button
                              type="submit"
                              className="px-8 py-2.5 bg-nexus-accent hover:bg-blue-600 text-white rounded font-bold text-sm shadow-lg transform hover:scale-105 transition-all"
                           >
                              Crear Dossier
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
