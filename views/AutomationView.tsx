import React, { useState } from 'react';
import { MOCK_INTEGRATIONS, MOCK_WORKFLOWS } from '../constants';
import { Workflow, Integration, WorkflowStep } from '../types';

export const AutomationView: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(MOCK_WORKFLOWS[0]);
  const [isAddingStep, setIsAddingStep] = useState(false);

  const nodePalette = [
    { type: 'trigger', service: 'ai_parser', icon: 'neurology', title: 'Análisis IA', desc: 'Dispara cuando la IA detecta un patrón.' },
    { type: 'action', service: 'whatsapp', icon: 'chat', title: 'WhatsApp Alert', desc: 'Envía un mensaje táctico.' },
    { type: 'action', service: 'maps', icon: 'explore', title: 'Geofence Check', desc: 'Verifica perímetros de exclusión.' },
    { type: 'action', service: 'sheets', icon: 'table_rows', title: 'Log Evidence', desc: 'Registra en planilla judicial.' },
    { type: 'action', service: 'drive', icon: 'cloud_upload', title: 'Archivar Docs', desc: 'Respalda evidencia en nube.' },
  ];

  // Toggle Workflow Status
  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w =>
      w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
    ));
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(prev => prev ? { ...prev, status: prev.status === 'active' ? 'paused' : 'active' } : null);
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'sheets': return 'text-green-500 border-green-500/50 bg-green-500/10';
      case 'drive': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      case 'maps': return 'text-red-500 border-red-500/50 bg-red-500/10';
      case 'whatsapp': return 'text-teal-400 border-teal-400/50 bg-teal-400/10';
      case 'ai_parser': return 'text-purple-400 border-purple-400/50 bg-purple-400/10';
      default: return 'text-gray-400 border-gray-700 bg-gray-800';
    }
  };

  const handleSelectPaletteItem = (item: any) => {
    if (!selectedWorkflow) return;
    const newStep: WorkflowStep = {
      id: `s-${Date.now()}`,
      type: item.type as any,
      service: item.service,
      title: item.title,
      config: 'Auto-configurado',
      icon: item.icon
    };
    const updatedWorkflow = { ...selectedWorkflow, steps: [...selectedWorkflow.steps, newStep] };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    setIsAddingStep(false);
  };

  return (
    <div className="h-full flex overflow-hidden bg-[#050505] font-sans">

      {/* LEFT SIDEBAR: Workflow List */}
      <div className="w-80 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-30 transition-all duration-500 shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-nexus-accent text-2xl">rocket_launch</span>
            Automation
          </h2>
          <button className="w-full py-4 bg-blue-500 text-white rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined">add</span>
            Nuevo Workflow
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          {workflows.map(wf => (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflow(wf)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer group ${selectedWorkflow?.id === wf.id
                  ? 'bg-blue-500/10 border-blue-500/50 shadow-2xl'
                  : 'bg-[#111] border-white/5 hover:bg-white/5 hover:border-white/10 shadow-lg'
                }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-bold text-xs uppercase tracking-widest ${selectedWorkflow?.id === wf.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-white'}`}>
                  {wf.name}
                </h3>
                <div className={`w-1.5 h-1.5 rounded-full ${wf.status === 'active' ? 'bg-nexus-success animate-pulse' : 'bg-gray-700'}`}></div>
              </div>
              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-medium">{wf.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN AREA: Visual Flow Builder */}
      <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
        {selectedWorkflow ? (
          <>
            {/* Minimal Header */}
            <div className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0a0a0a]/50 backdrop-blur-xl z-20">
              <div>
                <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-4">
                  {selectedWorkflow.name}
                  <span className={`px-2 py-0.5 rounded text-[9px] border ${selectedWorkflow.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                    {selectedWorkflow.status}
                  </span>
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleWorkflowStatus(selectedWorkflow.id)}
                  className={`h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${selectedWorkflow.status === 'active'
                      ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                      : 'bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)]'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">{selectedWorkflow.status === 'active' ? 'pause' : 'play_arrow'}</span>
                  {selectedWorkflow.status === 'active' ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>

            {/* Infinite Canvas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-20 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]">
              <div className="max-w-xl mx-auto space-y-0 relative">

                {/* Dynamic SVG Connectors Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>

                {selectedWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="relative mb-16 flex flex-col items-center">
                    {/* Step Card */}
                    <div className="w-full glass-panel p-6 rounded-[2.5rem] border border-white/5 bg-[#111]/80 hover:bg-[#111] hover:border-blue-500/40 transition-all duration-500 group shadow-2xl flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-2 shadow-inner transition-transform group-hover:rotate-12 ${getServiceColor(step.service)}`}>
                        <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/60 mb-1 block">
                          {index === 0 ? 'Protocol Start' : 'Operation Phase'}
                        </span>
                        <h3 className="text-white font-bold text-lg">{step.title}</h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">{step.config}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">settings</span>
                        </button>
                      </div>
                    </div>

                    {/* Visual Connector Line */}
                    {index < selectedWorkflow.steps.length - 1 && (
                      <div className="h-16 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                    )}
                  </div>
                ))}

                {/* Node Palette Launcher */}
                <div className="relative flex flex-col items-center">
                  <button
                    onClick={() => setIsAddingStep(!isAddingStep)}
                    className="w-16 h-16 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 text-gray-500 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center group"
                  >
                    <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
                  </button>

                  {isAddingStep && (
                    <div className="absolute top-20 w-80 bg-[#111] border border-white/10 rounded-[2.5rem] p-6 shadow-3xl z-50 animate-slide-up">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Módulos Disponibles</h4>
                      <div className="space-y-3">
                        {nodePalette.map(item => (
                          <button
                            key={item.title}
                            onClick={() => handleSelectPaletteItem(item)}
                            className="w-full p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 text-left group"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getServiceColor(item.service)}`}>
                              <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{item.title}</p>
                              <p className="text-[9px] text-gray-500 font-medium">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-gray-600">
              <span className="material-symbols-outlined text-5xl">schema</span>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Seleccionar Operación Automática</p>
          </div>
        )}
      </div>

    </div>
  );
};