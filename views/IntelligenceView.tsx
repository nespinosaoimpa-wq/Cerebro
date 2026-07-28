import React, { useState, useMemo } from 'react';
import { SUSPECTS } from '../constants';
import { Suspect } from '../types';
import { useGlobalState } from '../components/GlobalState';

export const IntelligenceView: React.FC = () => {
  const { addNotification } = useGlobalState();
  const [localSuspects, setLocalSuspects] = useState<Suspect[]>(SUSPECTS);
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(localSuspects[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'suspects' | 'gangs' | 'assets'>('suspects');
  const [activeTab, setActiveTab] = useState<'bio' | 'judicial' | 'family' | 'assets'>('bio');

  // Filters
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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
    affiliations: []
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
      image: `https://i.pravatar.cc/150?u=${Date.now()}`,
      affiliations: typeof newSuspectData.affiliations === 'string' ? (newSuspectData.affiliations as string).split(',').map((s: string) => s.trim()) : [],
      addresses: [],
      judicialRecords: [],
      family: [],
      phones: [],
      assets: [],
      recidivismRisk: 'moderate',
      socialNetworkCentrality: 'leaf'
    };

    setLocalSuspects(prev => [newSuspect, ...prev]);
    setSelectedSuspect(newSuspect);
    setShowCreateModal(false);
    addNotification('success', `Ficha creada correctamente para ${newSuspect.codeName}.`);
  };

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
      else if (riskFilter === 'medium') matchesRisk = suspect.riskLevel < 50;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [searchTerm, statusFilter, riskFilter, localSuspects]);

  return (
    <div className="h-full flex flex-col bg-nexus-950 text-gray-100 overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-nexus-800 bg-nexus-900/60 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-nexus-accent/20 border border-nexus-accent/40 flex items-center justify-center text-nexus-accent">
            <span className="material-symbols-outlined text-[20px]">folder_shared</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Base de Datos Unificada</h1>
            <p className="text-xs text-gray-400">Consulta centralizada de legajos, organizaciones y registros dominiales</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-nexus-950 p-1 rounded-lg border border-nexus-800 text-xs font-medium">
            <button
              onClick={() => setActiveCategory('suspects')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeCategory === 'suspects' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_search</span>
              Objetivos ({filteredSuspects.length})
            </button>
            <button
              onClick={() => setActiveCategory('gangs')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeCategory === 'gangs' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">groups</span>
              Organizaciones (4)
            </button>
            <button
              onClick={() => setActiveCategory('assets')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeCategory === 'assets' ? 'bg-nexus-accent text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">directions_car</span>
              Bienes & Vehículos (12)
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 bg-nexus-accent hover:bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Search & Navigation Column */}
        <div className="w-80 border-r border-nexus-800 bg-nexus-900/40 flex flex-col">
          {/* Search Controls */}
          <div className="p-3 border-b border-nexus-800 space-y-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Buscar por alias, nombre o DNI..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-md pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-nexus-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-nexus-950 border border-nexus-800 rounded px-2 py-1 text-gray-300 text-[11px] focus:outline-none"
              >
                <option value="all">Estado: Todos</option>
                <option value="Wanted">Buscado (Wanted)</option>
                <option value="Surveillance">Bajo Vigilancia</option>
                <option value="Captured">Detenido</option>
              </select>

              <select
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                className="bg-nexus-950 border border-nexus-800 rounded px-2 py-1 text-gray-300 text-[11px] focus:outline-none"
              >
                <option value="all">Riesgo: Todos</option>
                <option value="critical">Crítico (&gt;80%)</option>
                <option value="high">Alto (&gt;50%)</option>
              </select>
            </div>
          </div>

          {/* List of Suspects */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
            {filteredSuspects.map(suspect => (
              <div
                key={suspect.id}
                onClick={() => setSelectedSuspect(suspect)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSuspect?.id === suspect.id
                    ? 'bg-nexus-accent/15 border-nexus-accent text-white shadow-sm'
                    : 'bg-nexus-900/50 border-nexus-800 text-gray-300 hover:bg-nexus-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={suspect.image}
                    alt={suspect.codeName}
                    className="w-10 h-10 rounded-lg object-cover border border-nexus-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate text-white">{suspect.codeName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        suspect.riskLevel > 80 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {suspect.riskLevel}%
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">{suspect.realName}</p>
                    {suspect.dni && <p className="text-[10px] text-gray-500 font-mono">DNI: {suspect.dni}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Dossier Detail View */}
        {selectedSuspect ? (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-nexus-950">
            {/* Target Header Banner */}
            <div className="p-6 bg-nexus-900/60 border-b border-nexus-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={selectedSuspect.image}
                  alt={selectedSuspect.codeName}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-nexus-700 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedSuspect.status === 'Wanted' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {selectedSuspect.status}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">ID: {selectedSuspect.id}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1">{selectedSuspect.realName}</h2>
                  <p className="text-sm font-semibold text-nexus-accent font-mono">ALIAS: "{selectedSuspect.codeName}"</p>
                  <p className="text-xs text-gray-400 mt-1">Última ubicación vista: <span className="text-gray-200 font-medium">{selectedSuspect.lastSeen}</span></p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 bg-nexus-950/80 p-4 rounded-lg border border-nexus-800 text-right">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Índice de Riesgo Criminal</span>
                <span className={`text-3xl font-black font-mono ${
                  selectedSuspect.riskLevel > 80 ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {selectedSuspect.riskLevel}%
                </span>
                <span className="text-[10px] text-gray-500">Recidiva: {selectedSuspect.recidivismRisk}</span>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex border-b border-nexus-800 bg-nexus-900/30 px-6 font-medium text-xs">
              <button
                onClick={() => setActiveTab('bio')}
                className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'bio' ? 'border-nexus-accent text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">badge</span>
                Ficha Personal
              </button>
              <button
                onClick={() => setActiveTab('judicial')}
                className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'judicial' ? 'border-nexus-accent text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                Antecedentes Judiciales ({selectedSuspect.judicialRecords?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('family')}
                className={`px-4 py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'family' ? 'border-nexus-accent text-white font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">diversity_3</span>
                Red Familiar & Vínculos ({selectedSuspect.family?.length || 0})
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 flex-1 space-y-6">
              {activeTab === 'bio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Data Box */}
                  <div className="bg-nexus-900/40 p-5 rounded-lg border border-nexus-800 space-y-3">
                    <h3 className="text-xs font-bold text-nexus-accent uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      Datos Biográficos & Identificación
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[10px]">DNI</span>
                        <span className="font-mono text-white font-bold">{selectedSuspect.dni || 'Sin datos'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">CUIT/CUIL</span>
                        <span className="font-mono text-white font-bold">{selectedSuspect.cuit || 'Sin datos'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Fecha de Nacimiento</span>
                        <span className="text-gray-200">{selectedSuspect.dob || 'Sin datos'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Rol en Red</span>
                        <span className="text-gray-200 uppercase font-semibold">{selectedSuspect.socialNetworkCentrality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Affiliations Box */}
                  <div className="bg-nexus-900/40 p-5 rounded-lg border border-nexus-800 space-y-3">
                    <h3 className="text-xs font-bold text-nexus-accent uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">hub</span>
                      Afiliaciones & Bandas Criminales
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSuspect.affiliations?.map(aff => (
                        <span key={aff} className="px-2.5 py-1 rounded bg-nexus-800 border border-nexus-700 text-xs font-medium text-gray-200">
                          {aff}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'judicial' && (
                <div className="space-y-4">
                  {selectedSuspect.judicialRecords?.map((rec, idx) => (
                    <div key={idx} className="bg-nexus-900/40 p-4 rounded-lg border border-nexus-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{rec.charge}</span>
                        <span className="text-xs font-mono bg-nexus-950 px-2 py-0.5 rounded border border-nexus-800 text-gray-400">
                          CUIJ: {rec.cuij}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Fecha de carátula: {rec.date}</p>
                      {rec.modusOperandi && <p className="text-xs text-nexus-accent font-medium">Modus Operandi: {rec.modusOperandi}</p>}
                    </div>
                  ))}
                  {(!selectedSuspect.judicialRecords || selectedSuspect.judicialRecords.length === 0) && (
                    <p className="text-xs text-gray-500 italic text-center py-6">Sin causas judiciales asentadas.</p>
                  )}
                </div>
              )}

              {activeTab === 'family' && (
                <div className="space-y-4">
                  {selectedSuspect.family?.map((fam, idx) => (
                    <div key={idx} className="bg-nexus-900/40 p-4 rounded-lg border border-nexus-800 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-white">{fam.name}</h4>
                        <p className="text-gray-400">DNI: {fam.dni || 'Sin datos'} • {fam.address}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-nexus-800 border border-nexus-700 font-semibold text-nexus-accent">
                        {fam.relation}
                      </span>
                    </div>
                  ))}
                  {(!selectedSuspect.family || selectedSuspect.family.length === 0) && (
                    <p className="text-xs text-gray-500 italic text-center py-6">Sin vínculos familiares registrados.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
            Selecciona un expediente para ver los detalles.
          </div>
        )}
      </div>

      {/* Create Suspect Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexus-900 border border-nexus-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white">Nuevo Dossier de Objetivo</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Alias / Código</label>
                <input
                  type="text"
                  required
                  placeholder="ej: EL CHAVO"
                  value={newSuspectData.codeName}
                  onChange={e => setNewSuspectData({ ...newSuspectData, codeName: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Nombre Real</label>
                <input
                  type="text"
                  placeholder="ej: Juan Pérez"
                  value={newSuspectData.realName}
                  onChange={e => setNewSuspectData({ ...newSuspectData, realName: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">DNI</label>
                  <input
                    type="text"
                    placeholder="38123456"
                    value={newSuspectData.dni}
                    onChange={e => setNewSuspectData({ ...newSuspectData, dni: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-nexus-accent"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Nivel de Riesgo (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newSuspectData.riskLevel}
                    onChange={e => setNewSuspectData({ ...newSuspectData, riskLevel: Number(e.target.value) })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-nexus-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-nexus-800 text-gray-300 rounded hover:bg-nexus-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-nexus-accent text-white rounded font-bold hover:bg-blue-600 shadow"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
