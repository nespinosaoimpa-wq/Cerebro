import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";

interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'location' | 'organization' | 'vehicle' | 'phone';
  role?: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
}

interface GraphLink {
  source: string; // node ID
  target: string; // node ID
  label?: string;
}

export const NetworkAnalysisView: React.FC = () => {
  const { settings, addNotification } = useGlobalState();
  const [layout, setLayout] = useState<'organic' | 'hierarchy'>('organic');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mergeWithExisting, setMergeWithExisting] = useState(false);
  const [savedCases, setSavedCases] = useState<string[]>([]);

  // Default Initial Graph (Los Monos case sample)
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'v_cantero', label: 'V. Cantero', type: 'person', role: 'Líder Operativa', x: 50, y: 45 },
    { id: 'g_cantero', label: 'Guille Cantero', type: 'person', role: 'Jefe del Clan', x: 30, y: 25 },
    { id: 'a_cantero', label: 'Ariel Cantero', type: 'person', role: 'Fundador Histórico', x: 70, y: 25 },
    { id: 'bunker_sur', label: 'Búnker Zona Sur', type: 'location', role: 'Punto de Venta', x: 25, y: 65 },
    { id: 'safehouse_orono', label: 'Casa de Seguridad Oroño', type: 'location', role: 'Acopio y Refugio', x: 75, y: 65 },
    { id: 'hilux_blanca', label: 'Hilux Blanca (KFX-381)', type: 'vehicle', role: 'Distribución', x: 50, y: 75 }
  ]);

  const [links, setLinks] = useState<GraphLink[]>([
    { source: 'g_cantero', target: 'v_cantero', label: 'Imparte Órdenes' },
    { source: 'a_cantero', target: 'v_cantero', label: 'Mentor / Referente' },
    { source: 'v_cantero', target: 'bunker_sur', label: 'Controla Caja' },
    { source: 'v_cantero', target: 'safehouse_orono', label: 'Se oculta en' },
    { source: 'v_cantero', target: 'hilux_blanca', label: 'Conduce' },
    { source: 'hilux_blanca', target: 'bunker_sur', label: 'Abastece' }
  ]);

  // Sidebar form states for manual entry
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'person' | 'location' | 'organization' | 'vehicle' | 'phone'>('person');
  const [newNodeRole, setNewNodeRole] = useState('');

  const [newLinkSource, setNewLinkSource] = useState('');
  const [newLinkTarget, setNewLinkTarget] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  // Load saved cases names on mount
  useEffect(() => {
    const saved = localStorage.getItem('cerebro_saved_graphs');
    if (saved) {
      try {
        const graphs = JSON.parse(saved);
        setSavedCases(Object.keys(graphs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveCase = () => {
    const caseName = prompt("Ingresá un nombre para guardar este caso/grafo:");
    if (!caseName) return;
    const saved = localStorage.getItem('cerebro_saved_graphs');
    const graphs = saved ? JSON.parse(saved) : {};
    graphs[caseName] = { nodes, links };
    localStorage.setItem('cerebro_saved_graphs', JSON.stringify(graphs));
    setSavedCases(Object.keys(graphs));
    addNotification('success', `Caso "${caseName}" guardado correctamente.`);
  };

  const handleLoadCase = (name: string) => {
    if (!name) return;
    const saved = localStorage.getItem('cerebro_saved_graphs');
    if (!saved) return;
    try {
      const graphs = JSON.parse(saved);
      const graph = graphs[name];
      if (graph) {
        setNodes(graph.nodes || []);
        setLinks(graph.links || []);
        addNotification('success', `Caso "${name}" cargado con éxito.`);
      }
    } catch (e) {
      console.error(e);
      addNotification('error', 'No se pudo cargar el caso seleccionado.');
    }
  };

  // Node Drag and Drop handler
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const initialX = node.x;
    const initialY = node.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = document.getElementById('graph-canvas');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      setNodes(prev => prev.map(n => n.id === nodeId ? {
        ...n,
        x: Math.max(2, Math.min(98, Math.round(initialX + deltaX))),
        y: Math.max(2, Math.min(98, Math.round(initialY + deltaY)))
      } : n));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Re-calculate positions when layout changes
  const applyLayout = (type: 'organic' | 'hierarchy', currentNodes: GraphNode[]) => {
    const N = currentNodes.length;
    if (N === 0) return [];

    if (type === 'organic') {
      // Circle layout with central node (usually index 0 or leader)
      return currentNodes.map((node, idx) => {
        if (idx === 0) {
          return { ...node, x: 50, y: 50 };
        }
        const angle = ((idx - 1) * 2 * Math.PI) / (N - 1);
        const radius = 32; // percentage
        return {
          ...node,
          x: Math.round(50 + radius * Math.cos(angle)),
          y: Math.round(50 + radius * Math.sin(angle))
        };
      });
    } else {
      // Hierarchical layout based on entity types
      // Level 1: organization & leaders (person with role including "Jefe" or "Líder")
      // Level 2: other persons & vehicles
      // Level 3: locations & phones
      const getLevel = (node: GraphNode) => {
        if (node.type === 'organization') return 0;
        if (node.type === 'person' && (node.role?.toLowerCase().includes('jefe') || node.role?.toLowerCase().includes('líder') || node.role?.toLowerCase().includes('cabecilla'))) {
          return 0;
        }
        if (node.type === 'person' || node.type === 'vehicle') return 1;
        return 2;
      };

      const levels: GraphNode[][] = [[], [], []];
      currentNodes.forEach(node => {
        levels[getLevel(node)].push(node);
      });

      const result: GraphNode[] = [];
      levels.forEach((levelNodes, levelIdx) => {
        const count = levelNodes.length;
        const yCoord = 20 + levelIdx * 30; // 20%, 50%, 80%
        levelNodes.forEach((node, idx) => {
          const xCoord = count === 1 ? 50 : 15 + (idx * 70) / (count - 1);
          result.push({ ...node, x: Math.round(xCoord), y: Math.round(yCoord) });
        });
      });
      return result;
    }
  };

  useEffect(() => {
    setNodes(prev => applyLayout(layout, prev));
  }, [layout]);

  // AI Parser Call
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    addNotification('info', 'Analizando texto y extrayendo vínculos con Inteligencia Artificial...');

    const apiKey = settings.geminiApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      // Fallback if no API key is provided
      setTimeout(() => {
        addNotification('warning', 'Sin clave API activa. Cargando demostración simulada.');
        // Simulated fallback extraction
        const fallbackNodes: GraphNode[] = [
          { id: 'juan_perez', label: 'Juan Pérez', type: 'person', role: 'Organizador', x: 50, y: 50 },
          { id: 'pedro_gomez', label: 'Pedro Gómez', type: 'person', role: 'Distribuidor', x: 30, y: 30 },
          { id: 'carlos_rojo', label: 'Carlos Rojo', type: 'person', role: 'Apoyo Logístico', x: 70, y: 30 },
          { id: 'casa_segura', label: 'Casa de Seguridad', type: 'location', role: 'Depósito de Droga', x: 50, y: 80 }
        ];
        const fallbackLinks: GraphLink[] = [
          { source: 'juan_perez', target: 'pedro_gomez', label: 'Socio de' },
          { source: 'juan_perez', target: 'carlos_rojo', label: 'Reclutó a' },
          { source: 'pedro_gomez', target: 'casa_segura', label: 'Frecuenta' },
          { source: 'carlos_rojo', target: 'casa_segura', label: 'Alquila' }
        ];
        setNodes(applyLayout(layout, fallbackNodes));
        setLinks(fallbackLinks);
        setIsLoading(false);
      }, 2000);
      return;
    }

    const prompt = `
      Sos un Analista de Inteligencia de la Policía de Investigaciones de Santa Fe.
      Tu tarea es leer una declaración, descripción o reporte de vínculos criminales y mapearlo en un esquema de red (estilo i2 Analyst's Notebook).
      Extraé todas las entidades (nodos) y relaciones (enlaces).
      
      Texto a procesar: "${inputText}"
      
      Las entidades/nodos solo pueden tener uno de los siguientes tipos: "person", "location", "organization", "vehicle", "phone".
      El rol debe ser una descripción muy breve de su actividad.
      Devolver ÚNICAMENTE un objeto JSON puro válido sin markdown extra, respetando este esquema:
      {
        "nodes": [
          { "id": "id_en_minusculas_con_guiones_bajos", "label": "Nombre Visible Corto", "type": "person" | "location" | "organization" | "vehicle" | "phone", "role": "Descripción del Rol" }
        ],
        "links": [
          { "source": "id_origen", "target": "id_destino", "label": "Tipo de relación" }
        ]
      }
    `;

    const ai = new GoogleGenAI(apiKey);
    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash"];
    let textResponse = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Intentando vincular con el modelo: ${modelName}`);
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        textResponse = result.response.text();
        if (textResponse) {
          lastError = null;
          break;
        }
      } catch (err: any) {
        console.warn(`Falló el modelo ${modelName}:`, err);
        lastError = err;
      }
    }

    if (lastError) {
      console.error("Todos los modelos fallaron:", lastError);
      const errMsg = lastError?.message || 'Error de conexión general con los servidores de Google';
      addNotification('error', `Error IA: ${errMsg}`);
      setIsLoading(false);
      return;
    }

    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.nodes && parsed.links) {
          const freshNodes = parsed.nodes.map((n: any) => ({
            id: n.id,
            label: n.label,
            type: n.type || 'person',
            role: n.role || '',
            x: Math.round(15 + Math.random() * 70),
            y: Math.round(15 + Math.random() * 70)
          }));
          
          if (mergeWithExisting) {
            setNodes(prev => {
              const combined = [...prev, ...freshNodes];
              return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            });
            setLinks(prev => {
              const combined = [...prev, ...parsed.links];
              return combined.filter((v, i, a) => a.findIndex(l => l.source === v.source && l.target === v.target) === i);
            });
            addNotification('success', `Se agregaron ${freshNodes.length} entidades al grafo existente.`);
          } else {
            setNodes(applyLayout(layout, freshNodes));
            setLinks(parsed.links);
            addNotification('success', `Vínculos generados con éxito: ${freshNodes.length} entidades mapeadas.`);
          }
        } else {
          addNotification('error', 'Formato de respuesta IA incompatible.');
        }
      } else {
        addNotification('error', 'No se pudo estructurar el reporte de IA.');
      }
    } catch (err: any) {
      console.error(err);
      addNotification('error', 'Error al procesar el JSON devuelto por el servicio.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Node Manually
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const id = newNodeName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (nodes.some(n => n.id === id)) {
      addNotification('warning', 'Esta entidad ya existe en el grafo.');
      return;
    }

    const newNode: GraphNode = {
      id,
      label: newNodeName,
      type: newNodeType,
      role: newNodeRole,
      x: 50,
      y: 50
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(applyLayout(layout, updatedNodes));
    setNewNodeName('');
    setNewNodeRole('');
    addNotification('success', `Entidad "${newNodeName}" agregada.`);
  };

  // Add Link Manually
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkSource || !newLinkTarget) return;

    if (newLinkSource === newLinkTarget) {
      addNotification('warning', 'No se puede crear un vínculo sobre la misma entidad.');
      return;
    }

    // Check if link exists
    const exists = links.some(l => 
      (l.source === newLinkSource && l.target === newLinkTarget) ||
      (l.source === newLinkTarget && l.target === newLinkSource)
    );

    if (exists) {
      addNotification('warning', 'Este vínculo ya existe en el grafo.');
      return;
    }

    const newLink: GraphLink = {
      source: newLinkSource,
      target: newLinkTarget,
      label: newLinkLabel || 'Vínculo'
    };

    setLinks([...links, newLink]);
    setNewLinkLabel('');
    addNotification('success', 'Relación de vínculo establecida.');
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setLinks(prev => prev.filter(l => l.source !== id && l.target !== id));
    addNotification('info', 'Entidad eliminada del grafo.');
  };

  const removeLink = (idx: number) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
    addNotification('info', 'Vínculo eliminado.');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'location': return 'location_on';
      case 'organization': return 'groups';
      case 'vehicle': return 'directions_car';
      case 'phone': return 'call';
      default: return 'person';
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'location': return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'organization': return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
      case 'vehicle': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'phone': return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
      default: return 'border-red-500/30 bg-red-500/10 text-red-400';
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row p-6 overflow-hidden relative gap-6">
      
      {/* LEFT: AI Generator Panel & Manual Input */}
      <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-shrink-0 z-10 relative">
        
        {/* IA prompt block */}
        <div className="glass-panel border border-nexus-800 rounded-xl p-5 bg-nexus-900/60">
          <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-nexus-accent text-lg">auto_awesome</span>
            Generar i2 con IA
          </h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Escribí libremente los nombres de las personas, autos, domicilios y sus relaciones. La IA mapeará la red automáticamente.
          </p>
          <form onSubmit={handleAIGenerate} className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ej: Ariel Cantero es el fundador. Vanesa Cantero es la líder actual y tiene relación con Guille Cantero. Vanesa controla un búnker en Zona Sur y usa una Hilux Blanca para el traslado de bienes..."
              rows={5}
              className="w-full bg-nexus-950 border border-nexus-800 rounded p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent resize-none leading-relaxed"
            />
            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="merge-with-existing"
                checked={mergeWithExisting}
                onChange={(e) => setMergeWithExisting(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-nexus-950 border-nexus-800 text-nexus-accent focus:ring-0 accent-nexus-accent cursor-pointer"
              />
              <label htmlFor="merge-with-existing" className="text-xs text-gray-400 select-none cursor-pointer hover:text-white transition-colors">
                Combinar con el grafo existente (no borrar lo anterior)
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full py-2.5 bg-nexus-accent hover:bg-blue-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Procesando Texto...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">hub</span>
                  Generar Grafo de Vínculos
                </>
              )}
            </button>
          </form>
        </div>

        {/* Manual nodes management */}
        <div className="glass-panel border border-nexus-800 rounded-xl p-5 bg-nexus-900/60 space-y-6">
          
          {/* Add node */}
          <div>
            <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Agregar Entidad</h4>
            <form onSubmit={handleAddNode} className="space-y-3">
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="Nombre de la entidad..."
                className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as any)}
                  className="bg-nexus-950 border border-nexus-800 rounded px-2 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="person">Persona</option>
                  <option value="location">Lugar</option>
                  <option value="organization">Organización</option>
                  <option value="vehicle">Vehículo</option>
                  <option value="phone">Teléfono</option>
                </select>
                <input
                  type="text"
                  value={newNodeRole}
                  onChange={(e) => setNewNodeRole(e.target.value)}
                  placeholder="Rol (ej: Campana)"
                  className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded text-xs font-bold transition-all border border-nexus-700"
              >
                Agregar Nodo
              </button>
            </form>
          </div>

          {/* Add relationship */}
          <div className="pt-4 border-t border-nexus-800">
            <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Vincular Entidades</h4>
            <form onSubmit={handleAddLink} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newLinkSource}
                  onChange={(e) => setNewLinkSource(e.target.value)}
                  className="bg-nexus-950 border border-nexus-800 rounded px-2 py-2 text-xs text-white focus:outline-none w-full"
                >
                  <option value="">Origen...</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
                <select
                  value={newLinkTarget}
                  onChange={(e) => setNewLinkTarget(e.target.value)}
                  className="bg-nexus-950 border border-nexus-800 rounded px-2 py-2 text-xs text-white focus:outline-none w-full"
                >
                  <option value="">Destino...</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Relación (ej: Compra insumos a)"
                className="w-full bg-nexus-950 border border-nexus-800 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent"
              />
              <button
                type="submit"
                className="w-full py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded text-xs font-bold transition-all border border-nexus-700"
              >
                Vincular
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* RIGHT: Main Visualization Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-nexus-accent">hub</span>
              Visualizador de Vínculos Tácticos (i2)
            </h2>
            <p className="text-xs text-gray-500">Representación gráfica de relaciones investigativas y criminales</p>
          </div>
          <div className="flex gap-2 self-start items-center">
            {savedCases.length > 0 && (
              <select
                onChange={(e) => handleLoadCase(e.target.value)}
                className="bg-nexus-800 border border-nexus-700 rounded px-2.5 py-1.5 text-xs font-bold text-gray-300 focus:outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>📁 Cargar Caso...</option>
                {savedCases.map(name => <option key={name} value={name} className="bg-nexus-900 text-white text-xs">{name}</option>)}
              </select>
            )}
            <button
              onClick={handleSaveCase}
              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Guardar caso actual"
            >
              <span className="material-symbols-outlined text-sm">save</span> Guardar
            </button>
            <button
              onClick={() => {
                if (confirm("¿Estás seguro de que querés borrar todo el lienzo para empezar un nuevo análisis?")) {
                  setNodes([]);
                  setLinks([]);
                  addNotification('info', 'Lienzo de vínculos limpio.');
                }
              }}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Nuevo lienzo / Limpiar todo"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span> Limpiar
            </button>
            <div className="w-px h-5 bg-nexus-800 mx-1" />
            <button
              onClick={() => setLayout('organic')}
              className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1.5 transition-all ${layout === 'organic' ? 'bg-nexus-accent border-nexus-accent text-white' : 'bg-nexus-800 border-nexus-700 text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-sm">bubble_chart</span> Orgánico
            </button>
            <button
              onClick={() => setLayout('hierarchy')}
              className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1.5 transition-all ${layout === 'hierarchy' ? 'bg-nexus-accent border-nexus-accent text-white' : 'bg-nexus-800 border-nexus-700 text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-sm">account_tree</span> Jerárquico
            </button>
          </div>
        </div>

        {/* Graph Workspace Canvas */}
        <div id="graph-canvas" className="flex-1 glass-panel border border-nexus-800 rounded-xl relative overflow-hidden bg-nexus-950/60 shadow-2xl flex">
          
          {/* Active Nodes Count & Toolbar Overlay */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <span className="text-[10px] font-mono text-nexus-accent bg-nexus-accent/10 border border-nexus-accent/20 px-2 py-1 rounded">
              {nodes.length} ENTIDADES / {links.length} VÍNCULOS
            </span>
          </div>

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {links.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              return (
                <g key={idx}>
                  {/* Line connecting source and target */}
                  <line
                    x1={`${srcNode.x}%`}
                    y1={`${srcNode.y}%`}
                    x2={`${tgtNode.x}%`}
                    y2={`${tgtNode.y}%`}
                    stroke="#4B5563"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Relationship Labels at midpoints */}
          {links.map((link, idx) => {
            const srcNode = nodes.find(n => n.id === link.source);
            const tgtNode = nodes.find(n => n.id === link.target);
            if (!srcNode || !tgtNode) return null;

            // Calculate midpoint
            const midX = (srcNode.x + tgtNode.x) / 2;
            const midY = (srcNode.y + tgtNode.y) / 2;

            return (
              <div
                key={`label-${idx}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${midX}%`, top: `${midY}%` }}
              >
                <div className="bg-nexus-900 border border-nexus-800 px-2 py-0.5 rounded text-[8px] font-bold text-gray-400 whitespace-nowrap shadow-lg flex items-center gap-1">
                  {link.label || 'Vínculo'}
                  <button
                    onClick={() => removeLink(idx)}
                    className="opacity-0 group-hover:opacity-100 ml-1 text-[10px] text-rose-400 hover:text-red-500"
                    title="Eliminar vínculo"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}

          {/* Render Nodes as absolute divs */}
          {nodes.map(node => {
            const isCenter = layout === 'organic' && node.id === nodes[0]?.id;

            return (
              <div
                key={node.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer select-none"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                <div className={`
                  w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-lg relative transition-transform duration-300 group-hover:scale-110
                  ${getColorClass(node.type)}
                  ${isCenter ? 'ring-4 ring-red-500/20 w-16 h-16 border-red-500' : ''}
                `}>
                  <span className="material-symbols-outlined text-2xl">
                    {getIcon(node.type)}
                  </span>
                  
                  {/* Delete button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-nexus-danger text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow"
                    title="Eliminar entidad"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-2 bg-nexus-900/95 border border-nexus-800 px-2 py-1 rounded text-center shadow-md min-w-[70px]">
                  <p className="text-[10px] font-bold text-white leading-none whitespace-nowrap">{node.label}</p>
                  {node.role && <p className="text-[8px] text-gray-500 leading-none mt-1 whitespace-nowrap">{node.role}</p>}
                </div>
              </div>
            );
          })}

          {/* Workspace Footer Info */}
          <div className="absolute bottom-4 left-4 text-[9px] font-mono text-gray-600">
            MOTOR GRÁFICO i2 :: PROCESADO POR RED NEURAL DOCK
          </div>

        </div>

      </div>

    </div>
  );
};
