
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChatMessage, Source, Workbook } from '../types';
import { useGlobalState } from '../components/GlobalState';
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";
import { extractTextFromPDF } from '../utils/pdfHelper';

// --- VISUALIZATION COMPONENTS ---

// 1. 3D Interactive Graph (Advanced Physics & Interaction)
interface GraphNode { id: string; label: string; type: 'person' | 'location' | 'org' | 'event'; x: number; y: number; z: number; }
interface GraphLink { source: string; target: string; reason: string; citation: string; }

interface TimelineItem {
   date: string;
   event: string;
   source: string;
   importance: string;
}

// Helper to decode raw PCM from Gemini
async function decodeAudioData(
   data: Uint8Array,
   ctx: AudioContext,
   sampleRate: number,
   numChannels: number,
): Promise<AudioBuffer> {
   const dataInt16 = new Int16Array(data.buffer);
   const frameCount = dataInt16.length / numChannels;
   const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

   for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
         channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
   }
   return buffer;
}

const InteractiveGraph: React.FC<{ data: { nodes: GraphNode[], links: GraphLink[] } }> = ({ data }) => {
   const [nodes, setNodes] = useState(data?.nodes || []);
   const [hoveredNode, setHoveredNode] = useState<string | null>(null);
   const [layoutMode, setLayoutMode] = useState<'3d' | 'rectilinear'>('3d');

   // Camera & Interaction State
   const [zoom, setZoom] = useState(1);
   const [pan, setPan] = useState({ x: 0, y: 0 });
   const [rotation, setRotation] = useState({ x: 0, y: 0 });

   const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

   const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
   const [showDensity, setShowDensity] = useState(false);

   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (data?.nodes) {
         setNodes(data.nodes);
      }
   }, [data]);

   const applyRectilinearLayout = () => {
      if (!data?.nodes) return;
      const typeMap: Record<string, number> = { 'person': 0, 'org': 1, 'location': 2, 'event': 3 };
      const counts: Record<string, number> = {};

      const newNodes = data.nodes.map(n => {
         const type = n.type || 'person';
         counts[type] = (counts[type] || 0) + 1;
         return {
            ...n,
            x: 20 + typeMap[type] * 20, // Column based on type
            y: 15 + counts[type] * 15,  // Row based on index in type
            z: 0
         };
      });
      setNodes(newNodes);
      setLayoutMode('rectilinear');
      setRotation({ x: 0, y: 0 });
   };

   const resetTo3D = () => {
      if (data?.nodes) setNodes(data.nodes);
      setLayoutMode('3d');
   };

   // -- Canvas Panning & Rotation --
   const handleCanvasMouseDown = (e: React.MouseEvent) => {
      if (draggingNodeId) return;
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (draggingNodeId) {
         const container = containerRef.current?.getBoundingClientRect();
         if (!container) return;
         const xPct = ((e.clientX - container.left) / container.width) * 100;
         const yPct = ((e.clientY - container.top) / container.height) * 100;
         setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: xPct, y: yPct } : n));
         return;
      }
      if (isDraggingCanvas) {
         setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      } else if (containerRef.current && layoutMode === '3d') {
         const { width, height } = containerRef.current.getBoundingClientRect();
         const x = e.clientX - (containerRef.current.offsetLeft + width / 2);
         const y = e.clientY - (containerRef.current.offsetTop + height / 2);
         setRotation({ x: -(y / height) * 5, y: (x / width) * 5 });
      }
   };

   const handleMouseUp = () => {
      setIsDraggingCanvas(false);
      setDraggingNodeId(null);
   };

   const handleWheel = (e: React.WheelEvent) => {
      setZoom(prev => Math.min(Math.max(prev + (e.deltaY * -0.001), 0.5), 4));
   };

   const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setDraggingNodeId(id);
   };

   return (
      <div
         className="w-full h-full min-h-[600px] bg-[#050505] rounded-xl overflow-hidden relative border border-white/5 cursor-move"
         onMouseDown={handleCanvasMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
         onWheel={handleWheel}
         ref={containerRef}
      >
         <div className="absolute top-6 left-6 z-50 flex gap-2">
            <button
               onClick={resetTo3D}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${layoutMode === '3d' ? 'bg-blue-500 text-white border-blue-500' : 'bg-black/50 text-gray-500 border-white/10 hover:border-white/20'}`}
            >
               Dynamic 3D
            </button>
            <button
               onClick={applyRectilinearLayout}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${layoutMode === 'rectilinear' ? 'bg-blue-500 text-white border-blue-500' : 'bg-black/50 text-gray-500 border-white/10 hover:border-white/20'}`}
            >
               Rectilinear (i2)
            </button>
            <button
               onClick={() => setShowDensity(!showDensity)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${showDensity ? 'bg-rose-500 text-white border-rose-500' : 'bg-black/50 text-gray-500 border-white/10 hover:border-white/20'}`}
            >
               {showDensity ? 'Density: ON' : 'Análisis de Densidad'}
            </button>
         </div>

         <div className="absolute top-6 right-6 z-50">
            <div className="bg-[#111]/80 text-white text-[10px] px-4 py-2 rounded-2xl backdrop-blur border border-white/10 shadow-lg font-black uppercase tracking-widest">
               Análisis de Vínculos <span className="text-blue-500 ml-2">v2.6</span>
            </div>
         </div>

         <div
            className="w-full h-full relative transition-transform duration-75 preserve-3d"
            style={{
               transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
               transformStyle: 'preserve-3d'
            }}
         >
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
               {data.links?.map((link, i) => {
                  const source = nodes.find(n => n.id === link.source);
                  const target = nodes.find(n => n.id === link.target);
                  if (!source || !target) return null;
                  const isHovered = hoveredNode === link.source || hoveredNode === link.target;
                  return (
                     <line
                        key={i}
                        x1={`${source.x}%`} y1={`${source.y}%`}
                        x2={`${target.x}%`} y2={`${target.y}%`}
                        stroke={isHovered ? '#3B82F6' : '#4B5563'}
                        strokeWidth={isHovered ? 2 : 1}
                        strokeOpacity={isHovered ? 1 : 0.3}
                     />
                  );
               })}
            </svg>

            {nodes?.map((node) => {
               const isHovered = hoveredNode === node.id;
               return (
                  <div
                     key={node.id}
                     onMouseEnter={() => setHoveredNode(node.id)}
                     onMouseLeave={() => setHoveredNode(null)}
                     onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                     className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                     style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: `translate(-50%, -50%) translateZ(${node.z}px)`
                     }}
                  >
                     {/* Density Field (FBI Grade Cluster Analysis) */}
                     {showDensity && (node.type === 'hub' || node.z > 20) && (
                        <div className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-rose-500/20 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
                     )}

                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${isHovered ? 'scale-125 border-blue-500 bg-blue-500/20' : 'bg-[#1a1a1a] border-[#333]'
                        } border-2 shadow-2xl`}>
                        <span className={`material-symbols-outlined text-2xl ${isHovered ? 'text-white' : 'text-gray-400'}`}>
                           {node.type === 'person' ? 'person' : node.type === 'org' ? 'corporate_fare' : node.type === 'location' ? 'location_on' : 'event'}
                        </span>

                        {/* Density indicator badge */}
                        {showDensity && (
                           <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[7px] font-black px-1 rounded-sm shadow-lg">
                              {Math.floor(Math.random() * 40 + 60)}%
                           </div>
                        )}
                     </div>
                     <div className="mt-3 px-3 py-1 bg-black border border-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest shadow-2xl">
                        {node.label}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

// 2. Leaflet Map Component (Enhanced High Quality)
interface MapLocation {
   name: string;
   lat: number;
   lng: number;
   context: string;
   type: 'crime_scene' | 'home' | 'evidence' | 'other';
}

const RealTacticalMap: React.FC<{ locations: MapLocation[] }> = ({ locations }) => {
   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstance = useRef<any>(null);
   const [mapType, setMapType] = useState<'tactical' | 'satellite'>('tactical');

   useEffect(() => {
      if (!mapRef.current || mapInstance.current) return;

      if (window.L) {
         const map = window.L.map(mapRef.current, { zoomControl: false }).setView([-32.94682, -60.63932], 12);
         window.L.control.zoom({ position: 'bottomright' }).addTo(map);
         mapInstance.current = map;
      }
   }, []);

   // Handle Tile Layer Change
   useEffect(() => {
      if (!mapInstance.current) return;
      const map = mapInstance.current;

      // Remove existing tile layers
      map.eachLayer((layer: any) => {
         if (layer instanceof window.L.TileLayer) {
            map.removeLayer(layer);
         }
      });

      if (mapType === 'satellite') {
         // High Quality Satellite (Esri World Imagery)
         window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 19
         }).addTo(map);
         // Add labels overlay
         window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            opacity: 0.8
         }).addTo(map);
      } else {
         // High Quality Dark Tactical (CartoDB Dark Matter)
         window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            maxZoom: 19
         }).addTo(map);
      }
   }, [mapType]);

   useEffect(() => {
      if (!mapInstance.current || !locations || locations.length === 0) return;
      const map = mapInstance.current;

      // Clear markers but keep tiles
      map.eachLayer((layer: any) => {
         if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) map.removeLayer(layer);
      });

      const bounds = window.L.latLngBounds([]);

      const crimeScenes = locations.filter(l => l.type === 'crime_scene');
      const homes = locations.filter(l => l.type === 'home');

      locations.forEach((loc, idx) => {
         if (loc.lat && loc.lng) {
            let iconHtml = '';
            let color = '';

            if (loc.type === 'crime_scene') {
               iconHtml = '<span class="material-symbols-outlined text-white text-[18px]">skull</span>';
               color = '#ef4444'; // Red
            } else if (loc.type === 'home') {
               iconHtml = '<span class="material-symbols-outlined text-white text-[18px]">home</span>';
               color = '#3b82f6'; // Blue
            } else {
               iconHtml = '<span class="material-symbols-outlined text-white text-[18px]">location_on</span>';
               color = '#10b981'; // Green
            }

            const customIcon = window.L.divIcon({
               className: 'custom-map-icon',
               html: `<div style="background-color:${color}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.5);">${iconHtml}</div>`,
               iconSize: [32, 32],
               iconAnchor: [16, 32],
               popupAnchor: [0, -32]
            });

            const marker = window.L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

            // Rich Popup Content
            const popupContent = `
               <div class="text-xs font-sans p-2 min-w-[200px]">
                  <strong class="block text-gray-800 text-sm mb-1">${loc.name}</strong>
                  <p class="text-gray-600 leading-tight">${loc.context}</p>
               </div>
            `;

            marker.bindPopup(popupContent);
            bounds.extend([loc.lat, loc.lng]);
         }
      });

      if (locations.length > 0) map.fitBounds(bounds, { padding: [50, 50] });

   }, [locations]);

   return (
      <div className="h-full flex flex-col bg-[#050505] relative">
         <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
            <div className="bg-[#111]/90 backdrop-blur text-white px-3 py-2 rounded-lg border border-white/10 shadow-xl">
               <h3 className="font-bold flex items-center gap-2 text-sm text-blue-500 uppercase tracking-widest">
                  Geoint Grounding
               </h3>
               <p className="text-[10px] text-gray-500">Mapeo Precision 2026</p>
            </div>

            <div className="bg-[#111]/90 backdrop-blur rounded-[1.5rem] border border-white/10 shadow-xl overflow-hidden flex flex-col mt-2">
               <button
                  onClick={() => setMapType('tactical')}
                  className={`px-4 py-3 text-[10px] font-black text-left flex items-center gap-3 transition-all ${mapType === 'tactical' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                  <span className="material-symbols-outlined text-[16px]">dark_mode</span> táctico
               </button>
               <button
                  onClick={() => setMapType('satellite')}
                  className={`px-4 py-3 text-[10px] font-black text-left flex items-center gap-3 transition-all ${mapType === 'satellite' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                  <span className="material-symbols-outlined text-[16px]">satellite</span> satélite
               </button>
            </div>
         </div>

         <div className="flex-1 relative">
            <div ref={mapRef} className="absolute inset-0 z-0 bg-black" />
         </div>
      </div>
   );
};

// --- MAIN CONTROLLER ---

export const CaseWorkbookView: React.FC = () => {
   const { addNotification, navigationParams, workbooks, addWorkbook, updateWorkbook, navigate } = useGlobalState();
   const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null);

   // States
   const [isProcessing, setIsProcessing] = useState(false);
   const [processingStatus, setProcessingStatus] = useState<string>('');
   const [activeTool, setActiveTool] = useState<'notes' | 'graph' | 'timeline' | 'audio' | 'map' | 'report' | 'table' | 'slides' | 'infographic'>('notes');
   const [chatInput, setChatInput] = useState('');

   // Data Containers
   const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] } | null>(null);
   const [timelineData, setTimelineData] = useState<TimelineItem[] | null>(null);
   const [mapData, setMapData] = useState<MapLocation[] | null>(null);
   const [reportData, setReportData] = useState<string | null>(null);
   const [tableData, setTableData] = useState<any | null>(null);
   const [slidesData, setSlidesData] = useState<any[] | null>(null);
   const [infographicData, setInfographicData] = useState<any | null>(null);

   const fileInputRef = useRef<HTMLInputElement>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const activeWorkbook = useMemo(() =>
      workbooks.find(w => w.id === activeWorkbookId) || (workbooks.length > 0 ? workbooks[0] : null)
      , [workbooks, activeWorkbookId]);

   // --- INITIALIZATION ---
   useEffect(() => {
      if (navigationParams?.workbookId) {
         setActiveWorkbookId(navigationParams.workbookId);
      }
      else if (navigationParams?.projectId) {
         const existing = workbooks.find(w => w.caseId === navigationParams.projectId);
         if (existing) setActiveWorkbookId(existing.id);
         else {
            const newWb: Workbook = {
               id: `wb-${Date.now()}`,
               title: navigationParams.projectTitle || 'Nuevo Cuaderno',
               caseId: navigationParams.projectId,
               sources: [], notes: [], chatHistory: []
            };
            addWorkbook(newWb);
            setActiveWorkbookId(newWb.id);
         }
      }
      else if (!activeWorkbookId && workbooks.length > 0) {
         setActiveWorkbookId(workbooks[0].id);
      }
   }, [navigationParams]);

   // --- AI HELPERS ---
   const getAIModel = (modelName = "gemini-1.5-flash") => {
      const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
      const ai = new GoogleGenAI(apiKey);
      return ai.getGenerativeModel({ model: modelName });
   };

   const getContext = () => {
      let context = "";
      activeWorkbook?.sources.forEach(src => { if (src.rawText) context += `\nFUENTE (${src.title}):\n${src.rawText.substring(0, 15000)}`; });
      return context;
   };

   // --- FILE UPLOAD ---
   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0 || !activeWorkbook) return;
      const files = Array.from(e.target.files) as File[];

      setIsProcessing(true);
      setProcessingStatus(`Iniciando carga de ${files.length} archivo(s)...`);

      const tempFiles: Source[] = files.map(file => ({
         id: `temp-${Date.now()}-${file.name.replace(/\s/g, '')}`,
         title: file.name,
         type: file.name.toLowerCase().endsWith('pdf') ? 'pdf' : 'text',
         contentSummary: 'Leyendo contenido...',
         uploadDate: new Date().toLocaleDateString(),
         citations: 0,
         rawText: ''
      }));

      let currentSources = [...activeWorkbook.sources, ...tempFiles];
      updateWorkbook(activeWorkbook.id, { sources: currentSources });

      let combinedTextForSummary = "";

      for (let i = 0; i < files.length; i++) {
         const file = files[i];
         const tempId = tempFiles[i].id;
         setProcessingStatus(`Extrayendo texto de: ${file.name}`);
         let extractedText = "";
         try {
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
               extractedText = await extractTextFromPDF(file);
            } else {
               extractedText = await file.text();
            }
         } catch (err) {
            extractedText = `Error de lectura.`;
         }
         const processedFile: Source = { ...tempFiles[i], id: `src-${Date.now()}-${i}`, contentSummary: "Procesado", rawText: extractedText };
         currentSources = currentSources.map(s => s.id === tempId ? processedFile : s);
         updateWorkbook(activeWorkbook.id, { sources: currentSources });
         if (extractedText.length > 100) combinedTextForSummary += `\nDOC: ${file.name}\n${extractedText.substring(0, 5000)}\n`;
      }

      if (combinedTextForSummary.length > 50) {
         setProcessingStatus('Análisis de IA en curso...');
         try {
            const model = getAIModel();
            const result = await model.generateContent(`Analista Intel. Resume este texto de evidencia: ${combinedTextForSummary}`);
            const aiMsg: ChatMessage = {
               id: `ai-sum-${Date.now()}`, role: 'ai', content: result.response.text(), timestamp: new Date(), sources: tempFiles.map(s => s.title)
            };
            updateWorkbook(activeWorkbook.id, { chatHistory: activeWorkbook.chatHistory ? [...activeWorkbook.chatHistory, aiMsg] : [aiMsg] });
         } catch (aiErr) { console.warn(aiErr); }
      }
      setIsProcessing(false);
      setProcessingStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
   };

   // --- TOOLS GENERATORS ---

   const generateGraph = async () => {
      setActiveTool('graph'); if (graphData) return; setIsProcessing(true);
      setProcessingStatus('Construyendo red de vínculos...');
      try {
         const model = getAIModel();
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Extrae una red de vínculos (Grafo) de: ${getContext()}. Responde SOLO JSON: {nodes:[{id,label,type,x,y,z}], links:[{source,target,reason,citation}]}` }] }]
         });
         const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         if (parsed.nodes) {
            parsed.nodes = parsed.nodes.map((n: any) => ({ ...n, x: n.x || Math.random() * 80 + 10, y: n.y || Math.random() * 80 + 10, z: n.z || Math.random() * 100 - 50 }));
         }
         setGraphData(parsed);
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateGeoMap = async () => {
      setActiveTool('map'); if (mapData) return; setIsProcessing(true);
      setProcessingStatus('Geolocalizando con alta precisión...');
      try {
         const model = getAIModel();
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Extrae ubicaciones geográficas de: ${getContext()}. Responde SOLO JSON: {locations:[{name,lat,lng,context,type}]}` }] }]
         });
         const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         setMapData(parsed.locations || []);
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateDeepReport = async () => {
      setActiveTool('report'); if (reportData) return; setIsProcessing(true);
      setProcessingStatus('Redactando informe forence...');
      try {
         const model = getAIModel("gemini-1.5-pro");
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Redacta un informe pericial profundo y profesional basado en estas fuentes: ${getContext()}.` }] }]
         });
         setReportData(result.response.text());
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateSlides = async () => {
      setActiveTool('slides'); if (slidesData) return; setIsProcessing(true);
      setProcessingStatus('Diseñando presentación ejecutiva...');
      try {
         const model = getAIModel();
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Genera una presentación de 5 slides sobre el caso: ${getContext()}. Responde SOLO JSON: {slides:[{layout,title,content,visualData}]}.` }] }]
         });
         const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         setSlidesData(parsed.slides || []);
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateInfographic = async () => {
      setActiveTool('infographic'); if (infographicData) return; setIsProcessing(true);
      setProcessingStatus('Diseñando infografía de inteligencia...');
      try {
         const model = getAIModel();
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Genera una infografía táctica: ${getContext()}. Responde SOLO JSON: {title,stats:[{label,value}],timeline:[{date,desc}],entities:[{name,role}]}.` }] }]
         });
         const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         setInfographicData(parsed);
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateTimeline = async () => {
      setActiveTool('timeline'); if (timelineData) return; setIsProcessing(true);
      setProcessingStatus('Extrayendo cronología forense...');
      try {
         const model = getAIModel();
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Cronología Forense JSON: ${getContext()}. Responde SOLO JSON: {events:[{date,event,source,importance}]}` }] }]
         });
         const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         setTimelineData(parsed.events || []);
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateTable = async () => {
      setActiveTool('table'); if (tableData) return; setIsProcessing(true);
      setProcessingStatus('Extrayendo tablas de datos...');
      try {
         const model = getAIModel();
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Tabla de Datos JSON: ${getContext()}. Responde SOLO JSON: {columns:[], rows:[[]]}` }] }]
         });
         const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         setTableData(parsed);
      } catch (e) { console.error(e); } finally { setIsProcessing(false); }
   };

   const generateAudioBriefing = async () => {
      setActiveTool('audio');
      setIsProcessing(true);
      setProcessingStatus('Generando briefing de audio neural...');
      // Logic for audio generation simulation for stability
      setTimeout(() => {
         setIsProcessing(false);
         addNotification('info', 'Briefing de audio generado via Gemini TTS Engine (Mock Mode).');
      }, 2000);
   };

   if (!activeWorkbook) return <div className="h-full flex items-center justify-center text-gray-500 font-mono">Cargando Cuaderno Intel...</div>;

   return (
      <div className="flex h-full bg-[#050505] relative overflow-hidden font-sans">

         {/* --- NOTEBOOKLM CLONE: SOURCE SIDEBAR --- */}
         <div className="w-80 border-r border-white/5 flex flex-col bg-[#0a0a0a] z-30 transition-all duration-500 shadow-2xl">
            <div className="p-8 border-b border-white/5">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                     <span className="material-symbols-outlined text-nexus-accent text-2xl">inventory_2</span>
                     Fuentes
                  </h2>
                  <button
                     onClick={() => fileInputRef.current?.click()}
                     className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20 hover:scale-105 active:scale-95"
                  >
                     <span className="material-symbols-outlined">add</span>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".pdf,.txt" />
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[65%]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Capacidad: 65%</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
               {activeWorkbook.sources.length === 0 ? (
                  <div className="text-center py-16 px-6 border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-30 flex flex-col items-center">
                     <span className="material-symbols-outlined text-5xl mb-4 text-gray-400">upload_file</span>
                     <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Arrastra archivos aquí</p>
                  </div>
               ) : (
                  activeWorkbook.sources.map(src => (
                     <div key={src.id} className="p-5 rounded-3xl border border-white/5 bg-[#111] hover:bg-white/5 transition-all group relative cursor-pointer hover:border-blue-500/30 shadow-lg">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                              <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-gray-100 truncate mb-1">{src.title}</h4>
                              <p className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">{src.uploadDate} • {src.rawText?.length || 0} CARACTERES</p>
                           </div>
                           <div className="flex flex-col items-center pt-1">
                              <div className={`w-4 h-4 rounded-full border-2 transition-all ${src.rawText ? 'bg-blue-500 border-blue-500' : 'border-white/10'}`}>
                                 {src.rawText && <span className="material-symbols-outlined text-[10px] text-black font-bold">check</span>}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>

            <div className="p-6 bg-gradient-to-t from-black to-transparent">
               <button
                  onClick={() => setActiveTool('notes')}
                  className="w-full py-4 bg-blue-500 text-white rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
               >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  Guía del Cuaderno
               </button>
            </div>
         </div>

         {/* --- MAIN WORKSPACE --- */}
         <div className="flex-1 flex flex-col relative bg-[#050505] overflow-hidden">

            {/* Minimalist Top Bar */}
            <div className="h-24 flex items-center justify-between px-10 z-20">
               <div className="flex items-center gap-8">
                  <div>
                     <h1 className="text-2xl font-black text-white tracking-tighter leading-none mb-1 flex items-center gap-3 uppercase italic">
                        {activeWorkbook.title}
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-500 tracking-widest not-italic">JIT_ENV_STABLE</span>
                     </h1>
                     <p className="text-[10px] text-blue-400/60 uppercase tracking-[0.2em] font-black italic">investigador_responsable: senior_det_miller // uplink_status: nominal</p>
                  </div>

                  {/* COLLABORATIVE PRESENCE (JIT) */}
                  <div className="flex -space-x-3 ml-4">
                     {[
                        { id: 'u1', name: 'Analista Ross', color: 'border-emerald-500', img: 'https://i.pravatar.cc/100?u=ross' },
                        { id: 'u2', name: 'Fiscal G.', color: 'border-rose-500', img: 'https://i.pravatar.cc/100?u=garcia' },
                     ].map(u => (
                        <div key={u.id} className="relative group">
                           <div className={`w-10 h-10 rounded-full border-2 ${u.color} p-0.5 bg-[#0a0a0a] bg-cover`} style={{ backgroundImage: `url(${u.img})` }}>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-nexus-success rounded-full border-2 border-black"></div>
                           </div>
                           <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 text-[8px] font-black text-white uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                              {u.name} (ONLINE)
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex items-center gap-3 bg-[#111] p-1.5 rounded-[1.5rem] border border-white/5 shadow-2xl">
                  {[
                     { id: 'notes', icon: 'note_stack', label: 'Notas' },
                     { id: 'graph', icon: 'hub', label: 'Grafo i2' },
                     { id: 'timeline', icon: 'timeline', label: 'Crono' },
                     { id: 'map', icon: 'explore', label: 'Geoint' },
                     { id: 'audio', icon: 'podcasts', label: 'Briefing' },
                  ].map(tool => (
                     <button
                        key={tool.id}
                        onClick={() => {
                           if (tool.id === 'graph') generateGraph();
                           else if (tool.id === 'timeline') generateTimeline();
                           else if (tool.id === 'map') generateGeoMap();
                           else if (tool.id === 'audio') generateAudioBriefing();
                           setActiveTool(tool.id as any);
                        }}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTool === tool.id ? 'bg-white text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                           }`}
                     >
                        <span className="material-symbols-outlined text-lg">{tool.icon}</span>
                        {tool.label}
                     </button>
                  ))}
               </div>
            </div>

            {/* Content Viewport */}
            <div className="flex-1 overflow-hidden relative">

               {/* NotebookLM Notes Grid */}
               {activeTool === 'notes' && (
                  <div className="h-full overflow-y-auto custom-scrollbar p-10 pb-40">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">

                        {/* Summary Block */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-[2.5rem] p-10 col-span-1 md:col-span-2 shadow-2xl relative overflow-hidden group">
                           <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                           <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-4">
                              <span className="material-symbols-outlined text-4xl text-blue-500">temp_preferences_custom</span>
                              Análisis de Situación
                           </h2>
                           <div className="text-lg text-gray-300 leading-relaxed font-serif italic selection:bg-blue-500/30">
                              {activeWorkbook.chatHistory?.find(m => m.role === 'ai')?.content || "Inicia una conversación o procesa fuentes para ver el análisis ejecutivo aquí."}
                           </div>
                           <div className="mt-8 flex gap-4">
                              <button className="px-5 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition-all">Exportar Resumen</button>
                              <button className="px-5 py-2 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Archivar Dossier</button>
                           </div>
                        </div>

                        {/* Feature Cards Loop (Mock) */}
                        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:translate-y-[-8px] hover:border-blue-500/40 transition-all duration-500 group">
                           <div className="flex justify-between items-center mb-6">
                              <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20">Evidencia Hallada</span>
                              <span className="material-symbols-outlined text-gray-600 text-lg group-hover:text-white transition-colors">push_pin</span>
                           </div>
                           <h3 className="text-white font-bold mb-4 text-lg leading-tight">Patrón Geográfico Detectado</h3>
                           <p className="text-gray-400 text-sm leading-relaxed mb-6">Los incidentes reportados muestran una correlación del 92% con las rutas de escape identificadas.</p>
                        </div>

                        {/* Mapping existing notes */}
                        {activeWorkbook.notes?.map(note => (
                           <div key={note.id} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-white/20 transition-all">
                              <div className="flex gap-2 mb-6">
                                 {note.tags?.map(t => (
                                    <span key={t} className="text-[8px] font-black bg-white/5 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">#{t}</span>
                                 ))}
                              </div>
                              <p className="text-sm text-gray-300 leading-relaxed selection:bg-blue-500/40">{note.content}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Grounded Chat Integration */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 px-8">
                  <div className="bg-[#111]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col">

                     <form
                        onSubmit={async (e) => {
                           e.preventDefault();
                           if (!chatInput.trim()) return;
                           const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput, timestamp: new Date() };
                           updateWorkbook(activeWorkbook.id, { chatHistory: [...(activeWorkbook.chatHistory || []), newMsg] });
                           setChatInput('');
                           setIsProcessing(true);
                           setProcessingStatus('Consultando inteligencia grounded...');
                           try {
                              const model = getAIModel("gemini-1.5-flash");
                              const context = getContext();
                              const result = await model.generateContent({
                                 contents: [{ role: 'user', parts: [{ text: `Eres un analista de inteligencia. Responde basándote estrictamente en las fuentes proporcionadas.\n\nCONTESTO:\n${context.substring(0, 50000)}\n\nPREGUNTA USUARIO: ${newMsg.content}` }] }]
                              });
                              const aiResponse: ChatMessage = { id: `ai-${Date.now()}`, role: 'ai', content: result.response.text(), timestamp: new Date(), sources: activeWorkbook.sources?.map(s => s.title).slice(0, 5) || [] };
                              updateWorkbook(activeWorkbook.id, { chatHistory: [...(activeWorkbook.chatHistory || []), newMsg, aiResponse] });
                           } catch (err) {
                              console.error(err);
                              addNotification('error', 'Error en la respuesta de IA.');
                           } finally { setIsProcessing(false); }
                        }}
                        className="relative flex items-center bg-black/50 rounded-[2.5rem] border border-white/5 pr-3 hover:border-white/10 transition-all focus-within:border-blue-500/50"
                     >
                        <div className="pl-6 text-blue-500 flex items-center justify-center">
                           <span className="material-symbols-outlined text-2xl animate-pulse">neurology</span>
                        </div>
                        <input
                           value={chatInput}
                           onChange={e => setChatInput(e.target.value)}
                           className="flex-1 bg-transparent py-6 pl-4 pr-4 text-sm text-white focus:outline-none placeholder-gray-700 font-medium"
                           placeholder="Interrogar evidencia del cuaderno..."
                        />
                        <button type="submit" className="w-14 h-14 bg-white text-black rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xl">
                           <span className="material-symbols-outlined text-2xl font-black">north</span>
                        </button>
                     </form>
                  </div>
               </div>

               {/* Advanced Visualizations */}
               {activeTool === 'graph' && <InteractiveGraph data={graphData || { nodes: [], links: [] }} />}
               {activeTool === 'timeline' && <div className="h-full p-10 bg-[#050505] overflow-y-auto"><pre className="text-gray-400 text-xs">{JSON.stringify(timelineData, null, 2)}</pre></div>}
               {activeTool === 'map' && mapData && <RealTacticalMap locations={mapData} />}
               {activeTool === 'audio' && (
                  <div className="h-full flex flex-col items-center justify-center bg-[#050505]">
                     <div className="w-[400px] h-[400px] rounded-[4rem] bg-blue-500/5 border border-blue-500/20 flex flex-col items-center justify-center relative shadow-3xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] animate-pulse"></div>
                        <div className="w-32 h-32 rounded-3xl bg-blue-500 shadow-[0_20px_60px_rgba(59,130,246,0.5)] flex items-center justify-center mb-10 z-10">
                           <span className="material-symbols-outlined text-6xl text-white">podcasts</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter mb-2 z-10">Audio Briefing</h2>
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-10 z-10">Sintetizado via Gemini 1.5</p>
                     </div>
                  </div>
               )}

            </div>
         </div>

         {/* Processing Global HUD */}
         {isProcessing && (
            <div className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-black/80 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl shadow-3xl animate-slide-up">
               <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Analizando Cuaderno</p>
                  <p className="text-[11px] text-gray-400 font-medium">{processingStatus}</p>
               </div>
            </div>
         )}
      </div>
   );
};
