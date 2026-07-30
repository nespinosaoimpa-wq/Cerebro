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
  image?: string;
  description?: string;
  associatedCauses?: string[];
  cuit?: string;
}

interface GraphLink {
  source: string; // node ID
  target: string; // node ID
  label?: string;
}

export const NetworkAnalysisView: React.FC = () => {
  const { settings, addNotification, workbooks, updateWorkbook } = useGlobalState();
  const [layout, setLayout] = useState<'organic' | 'hierarchy'>('organic');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mergeWithExisting, setMergeWithExisting] = useState(false);
  const [savedCases, setSavedCases] = useState<string[]>([]);

  // Interactive filtering, search & detail editing states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minDegree, setMinDegree] = useState(1);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReportContent, setAiReportContent] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  const handleGenerateAIReport = async () => {
    if (nodes.length === 0) return;
    setIsGeneratingReport(true);
    addNotification('info', 'La IA está interpretando la red de vínculos para generar el informe...');

    const apiKey = settings.geminiApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      setTimeout(() => {
        addNotification('warning', 'Clave API no disponible. Cargando informe de simulación.');
        setAiReportContent(`
# INFORME DE INTELIGENCIA DE PRUEBA (SIMULADO)
**Causa Judicial:** Investigación de Red de Narcotráfico - Zona Sur
**Analista:** nespinosa.oimpa@gmail.com
**Fecha:** ${new Date().toLocaleDateString('es-AR')}

## 1. Resumen Ejecutivo
Se identificó una red de vínculos compuesta por ${nodes.length} entidades y ${links.length} relaciones activas. El principal nexo operativo de la red es el nodo central coordinando actividades logísticas.

## 2. Nodos Críticos y Cabecillas
* **Juan Pérez (Organizador)**: Centraliza la toma de decisiones y mantiene vínculos directos con múltiples distribuidores.
* **V. Cantero (Líder Operativa)**: Coordina el acopio y flujos financieros.

## 3. Puntos de Vulnerabilidad e Incursión
Se sugiere la intervención telefónica inmediata de las líneas vinculadas al círculo logístico y el allanamiento simultáneo del búnker ubicado en Zona Sur.
        `);
        setIsReportModalOpen(true);
        setIsGeneratingReport(false);
      }, 2000);
      return;
    }

    try {
      const prompt = `
        Sos un Analista de Inteligencia Criminal de la Policía de Investigaciones.
        Analizá la siguiente estructura de red de vínculos (formato i2) y redactá un Informe de Inteligencia Policial y Judicial profesional en español de Argentina.
        El informe debe ser formal, técnico, riguroso y estar estructurado con títulos claros.
        
        LISTA DE ENTIDADES (Nodos):
        ${JSON.stringify(nodes.map(n => ({ id: n.id, nombre: n.label, tipo: n.type, rol: n.role || 'No especificado', descripcion: n.description || '' })))}
        
        LISTA DE VÍNCULOS (Relaciones):
        ${JSON.stringify(links.map(l => ({ de: l.source, a: l.target, relacion: l.label || 'Vínculo' })))}
        
        El informe debe contener:
        1. **RESUMEN EJECUTIVO**: Explicación clara y sintética de la red criminal mapeada.
        2. **ANÁLISIS DE LIDERAZGO Y CENTRALIDAD**: Quiénes son las figuras clave (los hubs de mayor conectividad) y qué roles cumplen.
        3. **INFRAESTRUCTURA Y LOGÍSTICA**: Lugares de acopio (búnkers, casas de seguridad) y vehículos utilizados en la maniobra.
        4. **PUNTOS CRÍTICOS Y PLAN DE ACCIÓN SUGERIDO**: Recomendaciones de investigación judicial (intervenciones telefónicas, allanamientos dirigidos, peritajes económicos) basadas en la topología de la red.
        
        Devolver únicamente el texto en formato Markdown profesional sin explicaciones previas.
      `;

      const ai = new GoogleGenAI(apiKey);
      const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash"];
      let textResponse = '';
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`Generando informe con: ${modelName}`);
          const model = ai.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          textResponse = result.response.text();
          if (textResponse) {
            lastError = null;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed for report:`, err);
          lastError = err;
        }
      }

      if (lastError) {
        throw lastError;
      }

      setAiReportContent(textResponse);
      setIsReportModalOpen(true);
      addNotification('success', 'Informe de Inteligencia generado con éxito.');
    } catch (err: any) {
      console.error(err);
      addNotification('error', `Error al generar el informe: ${err?.message || 'Error de conexión'}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportReportToWorkbook = () => {
    if (!aiReportContent) return;
    if (workbooks.length === 0) {
      addNotification('warning', 'No hay ningún Cuaderno de Causa activo para exportar.');
      return;
    }
    
    const targetWb = workbooks[0];
    const newSource = {
      id: `src-report-${Date.now()}`,
      title: `Informe de Vínculos IA - ${new Date().toLocaleDateString('es-AR')}`,
      type: 'text' as const,
      contentSummary: 'Informe estructurado generado por IA sobre red de vínculos.',
      uploadDate: new Date().toLocaleDateString('es-AR'),
      citations: 0,
      rawText: aiReportContent
    };
    
    const updatedSources = [...(targetWb.sources || []), newSource];
    updateWorkbook(targetWb.id, { sources: updatedSources });
    addNotification('success', `Informe exportado con éxito al Cuaderno: "${targetWb.title}".`);
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

  // Helper to calculate the degree (number of connections) for each node
  const getNodeDegree = (nodeId: string, currentLinks = links) => {
    return currentLinks.filter(l => l.source === nodeId || l.target === nodeId).length;
  };

  // Check if a node is focused/highlighted
  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedNodeId) return true; // everything is highlighted if none is selected
    if (selectedNodeId === nodeId) return true;
    // Check if there is a link connecting nodeId and selectedNodeId
    return links.some(l => 
      (l.source === selectedNodeId && l.target === nodeId) ||
      (l.source === nodeId && l.target === selectedNodeId)
    );
  };

  // Check if a link is highlighted
  const isLinkHighlighted = (link: GraphLink) => {
    if (!selectedNodeId) return true;
    return link.source === selectedNodeId || link.target === selectedNodeId;
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

  // Nodes filtered by search and minimum connections degree
  const visibleNodes = nodes.filter(node => {
    // 1. Search Query filter (matches label or role or CUIT/description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = node.label.toLowerCase().includes(q) || 
                    (node.role && node.role.toLowerCase().includes(q)) ||
                    (node.cuit && node.cuit.includes(q)) ||
                    (node.description && node.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    
    // 2. Minimum Degree filter
    const degree = getNodeDegree(node.id);
    if (minDegree > 1 && degree < minDegree) {
      return false;
    }
    return true;
  });

  // Links where both source and target are visible
  const visibleLinks = links.filter(link => {
    return visibleNodes.some(n => n.id === link.source) && visibleNodes.some(n => n.id === link.target);
  });

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

        {/* SUB-TOOLBAR: Search, Connection Degree and AI Report */}
        <div className="flex flex-col md:flex-row gap-3 mb-4 items-center bg-nexus-900/30 p-3 rounded-lg border border-nexus-800/40">
          {/* Search input */}
          <div className="relative w-full md:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar entidad (ej. Cantero)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-nexus-950 border border-nexus-800 rounded pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-base px-1.5"
              >
                ×
              </button>
            )}
          </div>

          {/* Connectivity/Degree Filter slider */}
          <div className="flex items-center gap-2 text-xs text-gray-400 w-full md:w-auto">
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            <span className="whitespace-nowrap">Conexiones mínimas:</span>
            <input
              type="range"
              min="1"
              max="5"
              value={minDegree}
              onChange={(e) => setMinDegree(Number(e.target.value))}
              className="accent-nexus-accent h-1 bg-nexus-950 rounded-lg cursor-pointer w-24 md:w-32"
            />
            <span className="font-mono text-nexus-accent font-bold">{minDegree}</span>
          </div>

          {/* Selected Node Clear/Status */}
          {selectedNodeId && (
            <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded">
              <span>Enfoque activo: <strong>{nodes.find(n => n.id === selectedNodeId)?.label}</strong></span>
              <button onClick={() => setSelectedNodeId(null)} className="text-sm hover:text-white ml-1 font-bold">×</button>
            </div>
          )}

          {/* AI Report Button */}
          <div className="ml-auto w-full md:w-auto">
            <button
              onClick={handleGenerateAIReport}
              disabled={isGeneratingReport || nodes.length === 0}
              className="w-full md:w-auto px-4 py-1.5 bg-nexus-accent hover:bg-blue-600 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isGeneratingReport ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Analizando Red...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  Analizar con IA (Informe)
                </>
              )}
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
            {visibleLinks.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted = isLinkHighlighted(link);

              return (
                <g key={idx}>
                  {/* Line connecting source and target */}
                  <line
                    x1={`${srcNode.x}%`}
                    y1={`${srcNode.y}%`}
                    x2={`${tgtNode.x}%`}
                    y2={`${tgtNode.y}%`}
                    stroke={isHighlighted ? "#3b82f6" : "#4B5563"}
                    strokeWidth={isHighlighted ? "2.5" : "1.5"}
                    strokeOpacity={isHighlighted ? "0.8" : "0.15"}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Relationship Labels at midpoints */}
          {visibleLinks.map((link, idx) => {
            const srcNode = nodes.find(n => n.id === link.source);
            const tgtNode = nodes.find(n => n.id === link.target);
            if (!srcNode || !tgtNode) return null;

            // Calculate midpoint
            const midX = (srcNode.x + tgtNode.x) / 2;
            const midY = (srcNode.y + tgtNode.y) / 2;
            const isHighlighted = isLinkHighlighted(link);

            return (
              <div
                key={`label-${idx}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group transition-opacity duration-300"
                style={{ left: `${midX}%`, top: `${midY}%`, opacity: isHighlighted ? 1 : 0.15 }}
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
          {visibleNodes.map(node => {
            const isCenter = layout === 'organic' && node.id === nodes[0]?.id;
            const isHighlighted = isNodeHighlighted(node.id);
            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer select-none transition-all duration-300"
                style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: isHighlighted ? 1 : 0.15 }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
              >
                <div className={`
                  w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-lg relative transition-all duration-300 group-hover:scale-110
                  ${getColorClass(node.type)}
                  ${isCenter ? 'ring-4 ring-red-500/20 w-16 h-16 border-red-500' : ''}
                  ${isSelected ? 'ring-4 ring-blue-500/40 scale-105 border-blue-500' : ''}
                `}>
                  {node.image ? (
                    <img src={node.image} alt={node.label} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-2xl">
                      {getIcon(node.type)}
                    </span>
                  )}
                  
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

                <div className={`mt-2 bg-nexus-900/95 border px-2 py-1 rounded text-center shadow-md min-w-[70px] transition-colors ${isSelected ? 'border-blue-500 bg-blue-950/20' : 'border-nexus-800'}`}>
                  <p className="text-[10px] font-bold text-white leading-none whitespace-nowrap">{node.label}</p>
                  {node.role && <p className="text-[8px] text-gray-500 leading-none mt-1 whitespace-nowrap">{node.role}</p>}
                </div>
              </div>
            );
          })}

          {/* Workspace Footer Info */}
          <div className="absolute bottom-4 left-4 text-[9px] font-mono text-gray-600">
            MOTOR GRÁFICO i2 :: PROCESADO POR SISTEMA DE INTELIGENCIA CEREBRO
          </div>

        </div>

      </div>

      {/* RIGHT DRAWER: Entity Detail Panel */}
      {selectedNodeId && (() => {
        const node = nodes.find(n => n.id === selectedNodeId);
        if (!node) return null;

        const updateNodeField = (field: keyof GraphNode, value: any) => {
          setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, [field]: value } : n));
        };

        const defaultAvatars: Record<string, string[]> = {
          person: [
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
          ],
          location: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
          ],
          vehicle: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=150&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80',
          ],
          organization: [
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=150&q=80',
          ],
          phone: []
        };

        const avatars = defaultAvatars[node.type] || [];

        return (
          <div className="w-80 border-l border-nexus-800 bg-nexus-950/90 p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-shrink-0 z-30">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-nexus-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nexus-accent text-lg">
                  {getIcon(node.type)}
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Detalles de Entidad</span>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Avatar & Photo */}
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-full border-2 overflow-hidden shadow-lg ${getColorClass(node.type)} flex items-center justify-center bg-nexus-900`}>
                {node.image ? (
                  <img src={node.image} alt={node.label} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl">{getIcon(node.type)}</span>
                )}
              </div>
              
              {/* Preset Avatars Selection */}
              {avatars.length > 0 && (
                <div className="flex gap-1.5 justify-center mt-1">
                  {avatars.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => updateNodeField('image', url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${node.image === url ? 'border-nexus-accent' : 'border-transparent'}`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {node.image && (
                    <button
                      onClick={() => updateNodeField('image', undefined)}
                      className="w-7 h-7 bg-nexus-800 rounded-full flex items-center justify-center text-[10px] text-gray-400 hover:text-white"
                      title="Quitar foto"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Editing Fields Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Nombre / Identificador</label>
                <input
                  type="text"
                  value={node.label}
                  onChange={(e) => updateNodeField('label', e.target.value)}
                  className="w-full bg-nexus-900 border border-nexus-800 rounded px-3 py-2 text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Rol / Función</label>
                <input
                  type="text"
                  value={node.role || ''}
                  onChange={(e) => updateNodeField('role', e.target.value)}
                  placeholder="Ej: Distribuidor principal"
                  className="w-full bg-nexus-900 border border-nexus-800 rounded px-3 py-2 text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              {(node.type === 'person' || node.type === 'organization') && (
                <div>
                  <label className="text-gray-400 font-bold block mb-1">CUIT / CUIL</label>
                  <input
                    type="text"
                    value={node.cuit || ''}
                    onChange={(e) => updateNodeField('cuit', e.target.value)}
                    placeholder="20-12345678-9"
                    className="w-full bg-nexus-900 border border-nexus-800 rounded px-3 py-2 text-white focus:outline-none focus:border-nexus-accent"
                  />
                </div>
              )}

              <div>
                <label className="text-gray-400 font-bold block mb-1">Imagen URL Personalizada</label>
                <input
                  type="text"
                  value={node.image || ''}
                  onChange={(e) => updateNodeField('image', e.target.value || undefined)}
                  placeholder="https://..."
                  className="w-full bg-nexus-900 border border-nexus-800 rounded px-3 py-2 text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Causas Judiciales Asociadas</label>
                <input
                  type="text"
                  value={node.associatedCauses?.join(', ') || ''}
                  onChange={(e) => updateNodeField('associatedCauses', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ej: Causa Pastorcito, Causa 154-B"
                  className="w-full bg-nexus-900 border border-nexus-800 rounded px-3 py-2 text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Observaciones / Descripción</label>
                <textarea
                  value={node.description || ''}
                  onChange={(e) => updateNodeField('description', e.target.value)}
                  placeholder="Observaciones de inteligencia criminal, legajos físicos relacionados, etc..."
                  rows={4}
                  className="w-full bg-nexus-900 border border-nexus-800 rounded px-3 py-2 text-white focus:outline-none focus:border-nexus-accent resize-none"
                />
              </div>

              <div className="pt-4 border-t border-nexus-800 flex gap-2">
                <button
                  onClick={() => {
                    removeNode(node.id);
                    setSelectedNodeId(null);
                  }}
                  className="flex-1 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 rounded font-bold transition-all text-[11px]"
                >
                  Eliminar del Grafo
                </button>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="flex-1 py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded font-bold transition-all text-[11px]"
                >
                  Cerrar Detalles
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* AI REPORT MODAL */}
      {isReportModalOpen && aiReportContent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="glass-panel border border-nexus-800 rounded-xl bg-nexus-950 p-6 max-w-3xl w-full max-h-[85vh] flex flex-col gap-4 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-nexus-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nexus-accent text-lg">psychology</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Informe de Inteligencia Policial y Judicial (IA)</h3>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body (Scrollable Report Content) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-nexus-900/40 border border-nexus-800/40 p-4 rounded text-xs leading-relaxed text-gray-300 select-text">
              <pre className="whitespace-pre-wrap font-sans text-xs text-gray-300 max-w-none">
                {aiReportContent}
              </pre>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="flex justify-between items-center border-t border-nexus-800 pt-3">
              <p className="text-[10px] text-gray-500 font-mono">
                Mapeado por {settings.geminiApiKey ? 'Gemini 3.5' : 'Simulación local'} :: nespinosa.oimpa@gmail.com
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiReportContent);
                    addNotification('success', 'Informe copiado al portapapeles.');
                  }}
                  className="px-4 py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded text-xs font-bold transition-all border border-nexus-700 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copiar Informe
                </button>
                <button
                  onClick={handleExportReportToWorkbook}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">auto_stories</span>
                  Exportar a Cuaderno de Causa
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 bg-nexus-900 hover:bg-nexus-800 text-gray-300 rounded text-xs font-bold transition-all border border-nexus-800"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
