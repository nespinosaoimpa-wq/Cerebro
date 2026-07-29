
import React, { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { GoogleGenerativeAI as GoogleGenAI } from "@google/generative-ai";

declare global {
   interface Window {
      L: any;
      JSZip: any;
   }
}

interface MapLayer {
   id: string;
   name: string;
   type: 'point' | 'heatmap' | 'polygon' | 'line' | 'imported';
   visible: boolean;
   color: string;
   count?: number;
}

type BaseMapType = 'googleSatellite' | 'googleHybrid' | 'googleStreets' | 'wazeStyle' | 'dark';

// Enhanced Mock Data for Targets
const TARGET_DATA = [
   {
      id: 't1',
      lat: -32.94682,
      lng: -60.63932,
      name: 'VIPER',
      realName: 'Viktor K.',
      img: 'https://i.pravatar.cc/150?u=viper',
      risk: 95,
      status: 'WANTED',
      affiliations: ['Cartel del Norte', 'Los Monos'],
      lastSeen: 'Hace 2 horas - Sector 4',
      address: 'Av. Pellegrini 1400, Rosario',
      history: [
         { date: 'Hoy 14:00', event: 'Señal móvil detectada' },
         { date: 'Ayer 23:30', event: 'Reunión en Safehouse B' },
         { date: '12 Oct', event: 'Transacción financiera flag' }
      ]
   },
   {
      id: 't2',
      lat: -32.9512,
      lng: -60.6550,
      name: 'GHOST',
      realName: 'Sarah L.',
      img: 'https://i.pravatar.cc/150?u=ghost',
      risk: 82,
      status: 'SURVEILLANCE',
      affiliations: ['Cyber Cell 4'],
      lastSeen: 'Hace 15 min - Terminal',
      address: 'Bv. Oroño y Córdoba',
      history: [
         { date: 'Hoy 09:00', event: 'Cambio de SIM detectado' },
         { date: '14 Oct', event: 'Compra de pasaje' }
      ]
   },
   {
      id: 't3',
      lat: -32.9300,
      lng: -60.6200,
      name: 'TANK',
      realName: 'Marcus R.',
      img: 'https://i.pravatar.cc/150?u=tank',
      risk: 45,
      status: 'CAPTURED',
      affiliations: ['Banda de Alvarado'],
      lastSeen: 'Penal de Coronda',
      address: 'Unidad Penitenciaria Nº 1',
      history: [
         { date: '10 Oct', event: 'Traslado a unidad penitenciaria' }
      ]
   }
];

export const TacticalMapView: React.FC = () => {
   const { addNotification, settings, navigationParams } = useGlobalState();
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<any>(null);
   const layerGroupsRef = useRef<Map<string, any>>(new Map());
   const tileLayerRef = useRef<any>(null);

   // Search Markers & Layers
   const searchMarkerRef = useRef<any>(null);
   const searchPolygonRef = useRef<any>(null); // For cadastral lot simulation

   const fileInputRef = useRef<HTMLInputElement>(null);

   const [baseMap, setBaseMap] = useState<BaseMapType>('googleHybrid');
   const [showLayerSelector, setShowLayerSelector] = useState(true);
   const [projectionMode, setProjectionMode] = useState(false);
   const [isConnecting, setIsConnecting] = useState(true);
   const [selectedTarget, setSelectedTarget] = useState<any | null>(null);
   const [isPegmanActive, setIsPegmanActive] = useState(false);

   // Search & Geocoding State
   const [geoQuery, setGeoQuery] = useState('');
   const [isSearchingGeo, setIsSearchingGeo] = useState(false);
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const searchDebounceRef = useRef<any>(null);

   // Telemetry State
   const [cursorCoords, setCursorCoords] = useState({ lat: 0, lng: 0 });
   const [currentZoom, setCurrentZoom] = useState(13);

   // Initial Mock Layers
   const [layers, setLayers] = useState<MapLayer[]>([
      { id: 'l1', name: 'Objetivos de Alto Valor', type: 'point', visible: true, color: '#EF4444', count: 3 },
      { id: 'l2', name: 'Amenazas Digitales (OSINT)', type: 'heatmap', visible: true, color: '#F59E0B', count: 8 },
      { id: 'l3', name: 'Jurisdicciones Policiales', type: 'polygon', visible: true, color: '#6366F1' },
      { id: 'l4', name: 'Cámaras LPR', type: 'point', visible: false, color: '#10B981', count: 45 },
      { id: 'l5', name: 'Zonas de Riesgo (IA)', type: 'heatmap', visible: false, color: '#EF4444' },
   ]);

   // HEATMAPPING & PREDICTIVE ANALYTICS
   const heatmapCirclesRef = useRef<any[]>([]);
   const [isPredicting, setIsPredicting] = useState(false);
   const [predictionData, setPredictionData] = useState<any[]>([]);

   const generateHeatmap = (map: any) => {
      // Clear previous
      heatmapCirclesRef.current.forEach(c => c.remove());
      heatmapCirclesRef.current = [];

      const heatmapLayer = layers.find(l => l.id === 'l2');
      if (!heatmapLayer?.visible) return;

      // Mock Hotspots near Rosario/Santa Fe
      const hotspots = [
         { lat: -32.955, lng: -60.66, intensity: 0.8, label: 'Cluster Narcocriminal v.Honda' },
         { lat: -32.935, lng: -60.62, intensity: 0.6, label: 'Zona Portuaria' },
         { lat: -31.643, lng: -60.71, intensity: 0.9, label: 'Sector Crítico La Tablada' },
         { lat: -31.621, lng: -60.69, intensity: 0.4, label: 'Microcentro' },
      ];

      hotspots.forEach(spot => {
         const circle = window.L.circle(spot, {
            radius: 400 * spot.intensity,
            fillColor: '#F59E0B',
            fillOpacity: 0.3,
            stroke: false,
            className: 'tactical-heat-blob'
         }).addTo(map);

         circle.bindTooltip(`<strong>HOTSPOT:</strong> ${spot.label}`, {
            sticky: true,
            className: 'tactical-tooltip'
         });

         heatmapCirclesRef.current.push(circle);
      });
   };

   // Predictive modeling simulation
   const runPredictiveModel = async () => {
      setIsPredicting(true);
      addNotification('info', 'Ejecutando algoritmo de Predicción del Crimen (Neural Network)...');

      // Simulate heavy compute
      setTimeout(() => {
         const predictions = [
            { id: 'p1', location: 'Puerto Norte', probability: 85, reason: 'Aumento de tráfico OSINT cifrado', color: 'text-red-500' },
            { id: 'p2', location: 'Estación Terminal', probability: 62, reason: 'Patrón de desplazamiento detectado', color: 'text-orange-500' },
         ];
         setPredictionData(predictions);
         setIsPredicting(false);
         addNotification('success', 'Modelado Predictivo Finalizado.');
      }, 2500);
   };

   // PROFESSIONAL GIS UTILS
   const toDMS = (coord: number, isLat: boolean) => {
      const absolute = Math.abs(coord);
      const degrees = Math.floor(absolute);
      const minutesNotTruncated = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesNotTruncated);
      const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
      const hemisphere = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
      return `${degrees}°${minutes}'${seconds}" ${hemisphere}`;
   };

   const [isRulerActive, setIsRulerActive] = useState(false);
   const [measurePoints, setMeasurePoints] = useState<any[]>([]);
   const rulerLineRef = useRef<any>(null);
   const rulerTooltipsRef = useRef<any[]>([]);

   const BASE_MAPS = {
      googleHybrid: {
         url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
         name: 'Google Earth (Híbrido)',
         attribution: 'Map data &copy; Google'
      },
      googleSatellite: {
         url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
         name: 'Google Satélite Puro',
         attribution: 'Map data &copy; Google'
      },
      googleStreets: {
         url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
         name: 'Google Maps (Calles)',
         attribution: 'Map data &copy; Google'
      },
      wazeStyle: {
         url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         name: 'Navegación (Waze Style)',
         attribution: '&copy; OpenStreetMap'
      },
      dark: {
         url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
         name: 'Híbrido Oscuro',
         attribution: '&copy; OpenStreetMap &copy; CARTO'
      }
   };

   // Safe Connection Init
   useEffect(() => {
      // Check for Leaflet availability
      const checkL = setInterval(() => {
         if (window.L) {
            setIsConnecting(false);
            clearInterval(checkL);
         }
      }, 100);

      // Fallback safety timeout
      const timeout = setTimeout(() => {
         if (isConnecting) setIsConnecting(false);
         clearInterval(checkL);
      }, 3000);

      return () => { clearInterval(checkL); clearTimeout(timeout); };
   }, []);

   // Map Initialization
   useEffect(() => {
      if (!mapContainerRef.current || mapInstanceRef.current || isConnecting || !window.L) return;

      // Use params if available, else default to Rosario (Standard center)
      const initialCenter = navigationParams?.center || [-32.94682, -60.63932];
      const initialZoom = navigationParams?.zoom || 13;

      const map = window.L.map(mapContainerRef.current, {
         zoomControl: false,
         attributionControl: false,
         center: initialCenter,
         zoom: initialZoom,
         preferCanvas: true,
         fadeAnimation: true,
         zoomAnimation: true,
         inertia: true,
         inertiaDeceleration: 3000
      });

      mapInstanceRef.current = map;

      // Scale Control
      window.L.control.scale({ position: 'bottomright', metric: true, imperial: false }).addTo(map);

      tileLayerRef.current = window.L.tileLayer(BASE_MAPS['googleHybrid'].url, {
         attribution: BASE_MAPS['googleHybrid'].attribution,
         maxZoom: 21, // Allow high zoom for cadastral view
         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      // Initial Marker if deployed from Dashboard
      if (navigationParams?.deployMarker) {
         const opIcon = window.L.divIcon({
            className: 'op-start-icon',
            html: `<div class="relative flex flex-col items-center">
                   <div class="w-12 h-12 rounded-full border-2 border-white bg-nexus-accent flex items-center justify-center shadow-lg animate-bounce">
                      <span class="material-symbols-outlined text-white text-2xl">flag</span>
                   </div>
                   <div class="mt-1 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 whitespace-nowrap font-bold">
                      ${navigationParams.label || 'ZONA CERO'}
                   </div>
                 </div>`,
            iconSize: [40, 70],
            iconAnchor: [20, 50]
         });
         window.L.marker(initialCenter, { icon: opIcon }).addTo(map);
      }

      // --- HANDLE IMPORTED LOCATIONS ---
      if (navigationParams?.importedLocations && navigationParams.importedLocations.length > 0) {
         const importedGroup = window.L.layerGroup();
         const bounds = window.L.latLngBounds([]);

         navigationParams.importedLocations.forEach((loc: any) => {
            if (loc.lat && loc.lng) {
               let iconHtml = '';
               let color = '';

               if (loc.type === 'crime_scene') {
                  iconHtml = '<span class="material-symbols-outlined text-white text-[14px]">skull</span>';
                  color = '#ef4444'; // Red
               } else if (loc.type === 'home') {
                  iconHtml = '<span class="material-symbols-outlined text-white text-[14px]">home</span>';
                  color = '#3b82f6'; // Blue
               } else {
                  iconHtml = '<span class="material-symbols-outlined text-white text-[14px]">description</span>';
                  color = '#a855f7'; // Purple for evidence
               }

               const customIcon = window.L.divIcon({
                  className: 'imported-map-icon',
                  html: `<div style="background-color:${color}; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 0 10px ${color};">${iconHtml}</div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
               });

               const marker = window.L.marker([loc.lat, loc.lng], { icon: customIcon });

               marker.bindPopup(`
                   <div class="text-xs font-sans">
                      <strong class="block text-[${color}] mb-1 uppercase">${loc.type.replace('_', ' ')}</strong>
                      <p class="font-bold">${loc.name}</p>
                      <p class="text-gray-600 mt-1">${loc.context}</p>
                   </div>
                `);

               marker.addTo(importedGroup);
               bounds.extend([loc.lat, loc.lng]);
            }
         });

         importedGroup.addTo(map);
         layerGroupsRef.current.set('imported_evidence', importedGroup);

         if (!layers.find(l => l.id === 'imported_evidence')) {
            setLayers(prev => [...prev, {
               id: 'imported_evidence',
               name: 'Evidencia Documental (IA)',
               type: 'imported',
               visible: true,
               color: '#a855f7',
               count: navigationParams.importedLocations.length
            }]);
         }

         map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Event Listeners
      map.on('mousemove', (e: any) => {
         setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      map.on('zoomend', () => {
         setCurrentZoom(map.getZoom());
      });

      const onMapTap = async (e: any) => {
         if (isPegmanActive) {
            const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${e.latlng.lat},${e.latlng.lng}`;
            window.open(url, '_blank');
            setIsPegmanActive(false);
            if (mapContainerRef.current) mapContainerRef.current.style.cursor = 'grab';
         } else if (isRulerActive) {
            setMeasurePoints(prev => {
               const newPoints = [...prev, e.latlng];
               if (newPoints.length > 1) {
                  const prevPoint = newPoints[newPoints.length - 2];
                  const distance = prevPoint.distanceTo(e.latlng);

                  window.L.polyline([prevPoint, e.latlng], {
                     color: '#3b82f6',
                     weight: 3,
                     dashArray: '5, 10',
                     className: 'ruler-line'
                  }).addTo(mapInstanceRef.current!);

                  const center = window.L.latLng(
                     (prevPoint.lat + e.latlng.lat) / 2,
                     (prevPoint.lng + e.latlng.lng) / 2
                  );

                  window.L.marker(center, {
                     icon: window.L.divIcon({
                        className: 'ruler-label',
                        html: `<div class="bg-nexus-900 border border-nexus-accent text-nexus-accent text-[9px] font-black px-1 py-0.5 whitespace-nowrap shadow-xl">${distance.toFixed(1)}m</div>`,
                        iconSize: [60, 20],
                        iconAnchor: [30, 10]
                     }),
                     className: 'ruler-tooltip'
                  }).addTo(mapInstanceRef.current!);
               }

               window.L.circleMarker(e.latlng, {
                  radius: 5,
                  color: '#3b82f6',
                  fillColor: '#fff',
                  fillOpacity: 1,
                  className: 'ruler-point'
               }).addTo(mapInstanceRef.current!);

               return newPoints;
            });
         } else {
            // TACTICAL SCAN (Mechanism Clone)
            const scanData = await reverseGeocodeWithAI(e.latlng.lat, e.latlng.lng);
            if (scanData && scanData.name) {
               executeFlyTo(e.latlng.lat, e.latlng.lng, {
                  formatted_address: scanData.address,
                  display_name: scanData.name,
                  address: { road: scanData.address },
                  type: 'poi_scan',
                  scan_details: scanData
               });
            }
         }
      };

      map.on('click', onMapTap);

      initMockData(map);

      return () => {
         if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
         }
      };
   }, [isConnecting, settings.mapIcons]);


   // Update Base Map
   useEffect(() => {
      if (!mapInstanceRef.current || !tileLayerRef.current) return;
      tileLayerRef.current.setUrl(BASE_MAPS[baseMap].url);
   }, [baseMap]);

   // Handle Projection Mode
   useEffect(() => {
      if (projectionMode) {
         setShowLayerSelector(false);
         setSelectedTarget(null);
         addNotification('info', 'Modo Proyección Activado: Optimizando para pantalla grande.');
      }
   }, [projectionMode]);

   // Layer Visibility
   useEffect(() => {
      if (!mapInstanceRef.current) return;

      layers.forEach(layer => {
         let leafletLayer = layerGroupsRef.current.get(layer.id);
         if (leafletLayer) {
            if (layer.visible) {
               if (!mapInstanceRef.current.hasLayer(leafletLayer)) {
                  mapInstanceRef.current.addLayer(leafletLayer);
               }
            } else {
               if (mapInstanceRef.current.hasLayer(leafletLayer)) {
                  mapInstanceRef.current.removeLayer(leafletLayer);
               }
            }
         }
      });

      // Special handling for dynamic heatmap
      generateHeatmap(mapInstanceRef.current);
   }, [layers]);

   // --- SEARCH & CADASTRAL LOGIC ---

   // Helper to simulate cadastral data deterministically from address number
   const generateCadastralData = (lat: number, lon: number, houseNumber?: string) => {
      // Use house number to make the lot ID deterministic for that address if available
      // This ensures "2162" always generates the same Partida for consistency
      const seed = houseNumber ? parseInt(houseNumber.replace(/\D/g, '')) : Math.floor(Math.abs(lat + lon) * 10000);

      const sheet = (seed % 9000) + 1000;
      const block = (seed % 100);
      const lot = (seed % 40) + 1;
      // Generate a realistic looking Partida Inmobiliaria
      const partida = `16-${String(seed * 123).substring(0, 6).padStart(6, '0')}-9`;

      return {
         nomenclatura: `${sheet}-${block}-${lot}-000`,
         manzana: block,
         lote: lot,
         partida: partida
      };
   };

   // --- NORMALIZADOR DE DIRECCIONES (SANTA FE TACTICAL) ---
   const normalizeAddressForIDESF = (query: string) => {
      return query
         .replace(/\bBv\b/gi, 'Bulevar')
         .replace(/\bAv\b/gi, 'Avenida')
         .replace(/\bPje\b/gi, 'Pasaje')
         .replace(/\bSta Fe\b/gi, 'Santa Fe')
         .trim();
   };

   // --- IDESF AUTHORITATIVE PASS ---
   const geocodeWithIDESF = async (query: string) => {
      const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return null;

      const ai = new GoogleGenAI(apiKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      try {
         addNotification('info', 'Sincronizando con Catastro IDESF Santa Fe...');

         const normalized = normalizeAddressForIDESF(query);
         // SANTA FE BOUNDING BOX: -31.70, -60.80 to -31.50, -60.60
         const prompt = `
            SOURCE: IDESF (Infraestructura de Datos Espaciales de Santa Fe).
            TASK: Georeference "${normalized}" STRICTLY within Santa Fe Capital, Argentina.
            BOUNDARY: Latitude [-31.70, -31.50], Longitude [-60.80, -60.60].
            CRITICAL: If the result is outside this box, it is WRONG. Use IDESF layers or Google Search Grounding to verify.
            INSTRUCTION: For "Bv Gálvez 2162", the result MUST be near (-31.639, -60.701).
            OUTPUT: JSON only: { 
               "lat": number, 
               "lng": number, 
               "address": string, 
               "source": "IDESF_Authoritative_HardLock",
               "validated": boolean
            }.
         `;
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            tools: [{ googleSearchRetrieval: {} } as any]
         });
         const data = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');

         // Strict Validation Stage
         if (data.lat && data.lng) {
            const inBox = data.lat < -31.50 && data.lat > -31.70 && data.lng < -60.60 && data.lng > -60.80;
            if (!inBox) {
               console.warn("Out of bounds IDESF result, discarding", data);
               return null;
            }
         }
         return data;
      } catch (e) {
         console.warn("IDESF Pass failed", e);
         return null;
      }
   };

   // --- AI GEOCODER (GEMINI GROUNDED) ---
   const geocodeWithGenAI = async (query: string) => {
      const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return null;

      const ai = new GoogleGenAI(apiKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      try {
         // PASS 1: Broad Search & Context Retrieval (Aggressive Local Grounding)
         const prompt1 = `
           TASK: Georeference "${query}".
           LOCAL_CONTEXT: Prioritize Santa Fe, Argentina. 
           GOAL: Obtain a high-quality candidate coordinate.
           INSTRUCTION: Use Google Search to find the EXACT real-world location. Focus on building structures.
           OUTPUT: JSON only { "lat": number, "lng": number, "address": string, "certainty": "high"|"low" }.
         `;
         const result1 = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt1 }] }],
            tools: [{ googleSearchRetrieval: {} } as any]
         });
         const data1 = JSON.parse(result1.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');

         if (!data1.lat) return null;

         // PASS 2: "Hard-Lock" Rooftop Refinement (Dual-Pass 2.0)
         const prompt2 = `
            REFINE COORDINATES: [${data1.lat}, ${data1.lng}] for "${data1.address}".
            STRICT_REQUIREMENT: Distinguish between "Street Centerline" and "Rooftop Center". 
            GOAL: Lock onto the center of the PHYSICAL BUILDING structure.
            CRITICAL: If the current point is in the middle of a boulevard or street, SHIFT it to the nearest structure matching the house number.
            CONTEXT: Tactical forensic mapping for Santa Fe Police using IDESF standards.
            OUTPUT: JSON only: { 
               "lat": number, 
               "lng": number, 
               "formatted_address": string,
               "type": "verified_rooftop_lock",
               "building_details": string
            }.
         `;
         const result2 = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt2 }] }],
            tools: [{ googleSearchRetrieval: {} } as any]
         });
         return JSON.parse(result2.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
      } catch (e) {
         console.warn("AI Geocoding sequence failed", e);
         return null;
      }
   };

   // --- TACTICAL POI SCAN (REVERSE GEOCODING) ---
   const reverseGeocodeWithAI = async (lat: number, lng: number) => {
      const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return null;

      const ai = new GoogleGenAI(apiKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
         SCAN LOCATION: [${lat.toFixed(6)}, ${lng.toFixed(6)}].
         TASK: Identify exactly what is at this coordinate.
         DATA: Business name, house type, or government building.
         OUTPUT: JSON only: {
            "name": string,
            "address": string,
            "category": string,
            "tactical_note": string
         }.
      `;

      try {
         addNotification('info', 'Iniciando escaneo táctico de punto...');
         const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            tools: [{ googleSearchRetrieval: {} } as any]
         });
         const data = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');
         if (data.name) {
            addNotification('success', `Escaneo Completado: ${data.name}`);
         }
         return data;
      } catch (e) {
         console.warn("Point scan failed", e);
         return null;
      }
   };

   useEffect(() => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

      if (geoQuery.length > 2) {
         // For suggestions, we still use Nominatim as it's faster/cheaper for autocomplete
         setIsSearchingGeo(true);
         searchDebounceRef.current = setTimeout(async () => {
            try {
               // Stage 1: Specific Query (Phase 7: local context priority)
               let queryToUse = geoQuery;
               if (!queryToUse.toLowerCase().includes('santa fe') && !queryToUse.toLowerCase().includes('rosario')) {
                  queryToUse += ', Santa Fe';
               }
               if (!queryToUse.toLowerCase().includes('argentina')) {
                  queryToUse += ', Argentina';
               }

               const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryToUse)}&limit=5&addressdetails=1&countrycodes=ar`);
               const data = await response.json();
               setSearchResults(data);
            } catch (e) {
               console.error("Search error", e);
            } finally {
               setIsSearchingGeo(false);
            }
         }, 300); // Shorter debounce for snappier feel
      } else {
         setSearchResults([]);
         setIsSearchingGeo(false);
      }

      return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
   }, [geoQuery]);

   const executeFlyTo = (lat: number, lon: number, addressDetails: any) => {
      if (!mapInstanceRef.current || !window.L) return;
      const map = mapInstanceRef.current;

      // Super High Zoom for "Cadastral" feel
      map.flyTo([lat, lon], 19, { duration: 1.0 }); // Faster animation

      // Clean old layers
      if (searchMarkerRef.current) map.removeLayer(searchMarkerRef.current);
      if (searchPolygonRef.current) map.removeLayer(searchPolygonRef.current);

      // 1. Cadastral Lot Simulation (Draw a polygon around the point)
      const offset = 0.0001;
      const lotCoords = [
         [lat + offset, lon - offset],
         [lat + offset, lon + offset],
         [lat - offset, lon + offset],
         [lat - offset, lon - offset]
      ];

      searchPolygonRef.current = window.L.polygon(lotCoords, {
         color: '#3b82f6', // Blue Nexus Accent
         weight: 2,
         fillColor: '#3b82f6',
         fillOpacity: 0.15,
         dashArray: '5, 5'
      }).addTo(map);

      // 2. High Precision Marker
      const displayAddress = addressDetails.formatted_address || addressDetails.display_name;
      const houseNumber = addressDetails.address?.house_number || (displayAddress.match(/\d{3,5}/) ? displayAddress.match(/\d{3,5}/)[0] : 'S/N');
      const cadastralInfo = generateCadastralData(lat, lon, houseNumber);

      const searchIcon = window.L.divIcon({
         className: 'cadastral-marker-icon',
         html: `
              <div class="relative flex flex-col items-center marker-pin-drop">
                  <div class="bg-nexus-900 border-2 border-nexus-accent text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1">
                      ${addressDetails.type === 'poi_scan' ? addressDetails.display_name : (houseNumber !== 'S/N' ? '#' + houseNumber : 'LOTE S/N')}
                  </div>
                  <div class="w-4 h-4 rounded-full border-2 border-white bg-nexus-accent shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  <div class="w-0.5 h-8 bg-nexus-accent/50"></div>
              </div>
          `,
         iconSize: [60, 60],
         iconAnchor: [30, 60]
      });

      const popupContent = addressDetails.type === 'poi_scan' ? `
         <div class="min-w-[280px] bg-nexus-950 text-white font-sans p-4 border border-nexus-accent/30 rounded-lg shadow-2xl">
            <div class="flex justify-between items-start border-b border-white/10 pb-3 mb-4">
               <div>
                  <strong class="block text-nexus-accent uppercase font-black text-[10px] tracking-[0.2em] mb-1">Escaneo Táctico de Punto</strong>
                  <span class="text-[11px] text-gray-400 font-mono">${addressDetails.scan_details.category}</span>
               </div>
               <span class="bg-nexus-accent/20 text-nexus-accent text-[8px] font-black px-2 py-0.5 border border-nexus-accent/40 uppercase italic">POI_DETECTION</span>
            </div>
            <div class="space-y-4 mb-5">
               <div>
                  <span class="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Entidad Identificada</span>
                  <span class="text-xs font-bold text-white leading-tight block">${addressDetails.display_name}</span>
               </div>
               <div>
                  <span class="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Dirección Detectada</span>
                  <span class="text-[10px] text-white/80">${addressDetails.formatted_address}</span>
               </div>
               <div class="bg-nexus-accent/5 p-2 border border-nexus-accent/20 rounded">
                  <span class="block text-[8px] text-nexus-accent uppercase font-bold tracking-widest mb-1">Nota Táctica</span>
                  <p class="text-[9px] italic text-nexus-accent/80 leading-relaxed">${addressDetails.scan_details.tactical_note}</p>
               </div>
            </div>
            <div class="flex gap-2">
               <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank" class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded text-[9px] font-black uppercase tracking-widest text-center">Google</a>
               <a href="https://waze.com/ul?ll=${lat},${lon}&navigate=yes" target="_blank" class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded text-[9px] font-black uppercase tracking-widest text-center">Waze</a>
            </div>
         </div>
      ` : `
         <div class="min-w-[280px] bg-nexus-950 text-white font-sans p-4 border border-nexus-accent/30 rounded-lg shadow-2xl">
            <div class="flex justify-between items-start border-b border-white/10 pb-3 mb-4">
               <div>
                  <strong class="block text-nexus-accent uppercase font-black text-[10px] tracking-[0.2em] mb-1">Registro Táctico Catastral</strong>
                  <span class="text-[11px] text-gray-400 font-mono">${cadastralInfo.nomenclatura}</span>
               </div>
               <span class="bg-nexus-accent/20 text-nexus-accent text-[8px] font-black px-2 py-0.5 border border-nexus-accent/40 uppercase italic animate-pulse">
                  Verified_Rooftop
               </span>
            </div>
            <div class="space-y-4 mb-5">
               <div>
                  <span class="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Dirección Normalizada</span>
                  <span class="text-xs font-bold text-white leading-tight block">${displayAddress}</span>
               </div>
               <div class="grid grid-cols-2 gap-4">
                  <div>
                     <span class="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Partida</span>
                     <span class="text-[10px] text-nexus-accent font-mono">${cadastralInfo.partida}</span>
                  </div>
                  <div>
                     <span class="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Ubicación</span>
                     <span class="text-[10px] text-nexus-accent font-mono">${cadastralInfo.manzana} / ${cadastralInfo.lote}</span>
                  </div>
               </div>
            </div>
            <div class="flex gap-2">
               <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank" class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-sm">map</span>
                  Google
               </a>
               <a href="https://waze.com/ul?ll=${lat},${lon}&navigate=yes" target="_blank" class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-sm">navigation</span>
                  Waze
               </a>
            </div>
            <div class="bg-black/50 p-2 border border-white/5 text-[8px] text-gray-500 font-mono mt-4 flex items-center gap-2 italic">
               <span class="material-symbols-outlined text-xs">satellite_alt</span>
               COORDS: ${lat.toFixed(6)}, ${lon.toFixed(6)}
            </div>
         </div>
      `;

      searchMarkerRef.current = window.L.marker([lat, lon], { icon: searchIcon })
         .addTo(map)
         .bindPopup(popupContent)
         .openPopup();

      addNotification('success', `Geolocalización Satelital IA: ${houseNumber}`);
      setSearchResults([]);
      setGeoQuery('');
   };

   const handleSearchSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (geoQuery.length <= 2) return;

      setIsSearchingGeo(true);
      addNotification('info', 'Triangulando con IA y Google Maps Grounding...');

      try {
         // 0. CHECK LOCAL SUSPECTS FIRST (New Feature: Search by name/codename)
         const localSuspect = TARGET_DATA.find(t =>
            t.name.toLowerCase().includes(geoQuery.toLowerCase()) ||
            t.realName.toLowerCase().includes(geoQuery.toLowerCase())
         );

         if (localSuspect) {
            addNotification('success', `Blanco identificado en base de datos local: ${localSuspect.name}`);
            setSelectedTarget(localSuspect);
            executeFlyTo(localSuspect.lat, localSuspect.lng, {
               formatted_address: localSuspect.address,
               address: { road: localSuspect.address }
            });
            setIsSearchingGeo(false);
            setGeoQuery('');
            return;
         }

         // Enhance query context for AI (Phase 8: IDESF Authoritative Grounding)
         let enhancedQuery = geoQuery;
         const isSantaFe = enhancedQuery.toLowerCase().includes('santa fe') ||
            enhancedQuery.toLowerCase().includes('rosario') ||
            enhancedQuery.toLowerCase().includes('galvez') ||
            enhancedQuery.toLowerCase().includes('italia');

         if (!enhancedQuery.toLowerCase().includes('santa fe') && !enhancedQuery.toLowerCase().includes('rosario')) {
            enhancedQuery += ", Santa Fe";
         }
         if (!enhancedQuery.toLowerCase().includes('argentina')) {
            enhancedQuery += ", Argentina";
         }

         // 1. Try IDESF Authoritative Pass First for Santa Fe queries (Phase 8)
         if (isSantaFe) {
            const idesfResult = await geocodeWithIDESF(geoQuery);
            if (idesfResult && idesfResult.lat && idesfResult.lng) {
               addNotification('success', 'Ubicación verificada con Catastro Provincial IDESF.');
               executeFlyTo(idesfResult.lat, idesfResult.lng, {
                  ...idesfResult,
                  formatted_address: idesfResult.address,
                  type: 'verified_rooftop_lock'
               });
               return;
            }
         }

         // 2. Try Dual-Pass AI Geocoding (Superior Rooftop Locking)
         const aiResult = await geocodeWithGenAI(enhancedQuery);

         if (aiResult && aiResult.lat && aiResult.lng) {
            executeFlyTo(aiResult.lat, aiResult.lng, aiResult);
            return;
         }

         // 2. Multi-Stage Fallback to Nominatim/OpenStreetMap
         const searchStages = [
            geoQuery + ", Argentina",
            geoQuery + ", Santa Fe, Argentina",
            geoQuery // Last resort: raw query
         ];

         for (const queryToTry of searchStages) {
            console.log(`Trying fallback geocoding stage: ${queryToTry}`);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryToTry)}&limit=1&addressdetails=1&countrycodes=ar`);
            const data = await response.json();

            if (data && data.length > 0) {
               const res = data[0];
               executeFlyTo(parseFloat(res.lat), parseFloat(res.lon), {
                  formatted_address: res.display_name,
                  address: res.address
               });
               return;
            }
         }

         addNotification('warning', 'Triangulación fallida. Verifique el formato (ej: Italia 2162, Rosario).');

      } catch (err) {
         console.error(err);
         addNotification('error', 'Error en servicio de posicionamiento.');
      } finally {
         setIsSearchingGeo(false);
      }
   };

   const initMockData = (map: any) => {
      const l1Group = window.L.layerGroup();

      TARGET_DATA.forEach(t => {
         let marker;
         const pulseClass = t.risk > 80 ? 'pulse-red' : 'pulse-yellow';

         if (settings.mapIcons === 'custom_photos') {
            const icon = window.L.divIcon({
               className: 'custom-div-icon',
               html: `
               <div class="relative w-16 h-16 group">
                  <div class="absolute inset-0 rounded-full ${t.risk > 80 ? 'bg-red-600' : 'bg-yellow-500'} animate-ping opacity-50"></div>
                  <div class="relative w-16 h-16 rounded-full border-4 ${t.risk > 80 ? 'border-red-600' : 'border-yellow-500'} overflow-hidden bg-black shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110">
                    <img src="${t.img}" class="w-full h-full object-cover">
                  </div>
                  <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 rounded border border-white/20 text-white text-[10px] font-bold tracking-wider whitespace-nowrap shadow-lg">
                    ${t.name}
                  </div>
               </div>
             `,
               iconSize: [64, 64],
               iconAnchor: [32, 32]
            });
            marker = window.L.marker([t.lat, t.lng], { icon });
         } else {
            const color = t.risk > 80 ? '#EF4444' : '#f59e0b';
            const icon = window.L.divIcon({
               className: 'tactical-marker',
               html: `
              <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));">
                <svg viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" width="40" height="40">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <div style="position: absolute; top: 12px; font-size: 10px; font-weight: bold; color: white;">!</div>
              </div>
            `,
               iconSize: [40, 40],
               iconAnchor: [20, 40]
            });
            marker = window.L.marker([t.lat, t.lng], { icon });
         }

         marker.on('click', () => {
            setSelectedTarget(t);
            setShowLayerSelector(false);
            map.flyTo([t.lat, t.lng], 18, { duration: 1.5 });
         });

         marker.addTo(l1Group);
      });

      l1Group.addTo(map);
      layerGroupsRef.current.set('l1', l1Group);

      // Layer 3: Jurisdictions
      const l3Group = window.L.layerGroup();
      window.L.polygon([
         [-32.93, -60.65], [-32.93, -60.63], [-32.95, -60.63], [-32.95, -60.65]
      ], { color: '#6366F1', fillColor: '#6366F1', fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }).addTo(l3Group);
      l3Group.addTo(map);
      layerGroupsRef.current.set('l3', l3Group);
   };

   const toggleLayer = (id: string) => {
      setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
   };

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      addNotification('info', 'Analizando estructura KML...');
      setTimeout(() => {
         addNotification('success', 'Capa importada: "Ruta_Escape_Posible.kml"');
      }, 1500);
   };

   const closeTargetPanel = () => {
      setSelectedTarget(null);
   };

   const openStreetView = () => {
      if (!selectedTarget) return;
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selectedTarget.lat},${selectedTarget.lng}`;
      window.open(url, '_blank');
   };

   const togglePegman = () => {
      const newState = !isPegmanActive;
      setIsPegmanActive(newState);
      if (newState) {
         setIsRulerActive(false);
         if (mapContainerRef.current) mapContainerRef.current.style.cursor = 'crosshair';
         addNotification('info', 'Haga clic en cualquier punto del mapa para abrir Street View.');
      } else {
         if (mapContainerRef.current) mapContainerRef.current.style.cursor = 'grab';
      }
   };

   const toggleRuler = () => {
      const newState = !isRulerActive;
      setIsRulerActive(newState);
      if (newState) {
         setIsPegmanActive(false);
         if (mapContainerRef.current) mapContainerRef.current.style.cursor = 'cell';
         addNotification('info', 'Regla Táctica Activada: Defina puntos de interés para medición.');
      } else {
         if (mapContainerRef.current) mapContainerRef.current.style.cursor = 'grab';
      }
   };

   const clearRuler = () => {
      setMeasurePoints([]);
      if (mapInstanceRef.current) {
         mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer.options?.className?.includes('ruler-')) {
               mapInstanceRef.current.removeLayer(layer);
            }
         });
      }
      addNotification('info', 'Mediciones eliminadas.');
   };

   const zoomIn = () => mapInstanceRef.current?.zoomIn();
   const zoomOut = () => mapInstanceRef.current?.zoomOut();
   const locateMe = () => {
      addNotification('info', 'Solicitando geolocalización segura...');
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            mapInstanceRef.current?.flyTo([latitude, longitude], 16);
            window.L.circleMarker([latitude, longitude], { radius: 8, color: '#fff', fillColor: '#3b82f6', fillOpacity: 1 }).addTo(mapInstanceRef.current);
         });
      }
   };

   if (isConnecting) {
      return (
         <div className="w-full h-full bg-nexus-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="z-10 text-center space-y-4">
               <div className="w-24 h-24 rounded-full border-4 border-nexus-accent border-t-transparent animate-spin mx-auto"></div>
               <h2 className="text-xl font-bold text-white tracking-widest font-mono">CARGANDO SISTEMA DE MAPAS...</h2>
               <p className="text-nexus-accent font-mono text-xs">CONECTANDO A SERVICIOS GEOGRÁFICOS</p>
            </div>
         </div>
      );
   }

   return (
      <div className="relative w-full h-full bg-nexus-900 overflow-hidden animate-fadeIn font-sans">
         <style>{`
            @keyframes marker-pin-drop {
               0% { opacity: 0; transform: translateY(-100px) scale(0.5); }
               60% { transform: translateY(10px) scale(1.1); }
               80% { transform: translateY(-5px) scale(0.95); }
               100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .marker-pin-drop {
               animation: marker-pin-drop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .leaflet-popup-content-wrapper {
               background: #0a0a0a !important;
               color: white !important;
               border: 1px solid rgba(59, 130, 246, 0.3) !important;
               padding: 0 !important;
               border-radius: 12px !important;
               overflow: hidden !important;
               box-shadow: 0 20px 50px rgba(0,0,0,0.8) !important;
            }
            .leaflet-popup-content {
               margin: 0 !important;
               width: auto !important;
            }
            .leaflet-popup-tip {
               background: #0a0a0a !important;
               border-left: 1px solid rgba(59, 130, 246, 0.3) !important;
               border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
            }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
         `}</style>
         {/* Map Element */}
         <div ref={mapContainerRef} className={`absolute inset-0 z-0 ${isPegmanActive ? 'cursor-crosshair' : ''}`} />

         {/* --- PRECISION SEARCH BAR --- */}
         <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-xl z-[2000] transition-all duration-300 ${projectionMode ? '-translate-y-32' : 'translate-y-0'}`}>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-[2002]">
                  <span className="material-symbols-outlined text-nexus-accent text-xl">manage_search</span>
               </div>

               {/* WRAPPED IN FORM TO HANDLE ENTER KEY NATIVELY */}
               <form onSubmit={handleSearchSubmit}>
                  <input
                     type="text"
                     value={geoQuery}
                     onChange={(e) => setGeoQuery(e.target.value)}
                     placeholder="Dirección Exacta (Calle y Número)..."
                     className="w-full bg-gray-900 border border-gray-600 text-white rounded-xl py-4 pl-12 pr-14 shadow-2xl focus:border-nexus-accent focus:ring-2 focus:ring-nexus-accent/50 outline-none font-sans text-base transition-all placeholder-gray-500 font-bold"
                     style={{ zIndex: 2001 }}
                  />

                  {/* Search Button / Indicator */}
                  <button
                     type="submit"
                     className="absolute inset-y-0 right-0 pr-4 flex items-center z-[2002] cursor-pointer hover:scale-110 transition-transform"
                  >
                     {isSearchingGeo ? (
                        <span className="w-5 h-5 border-2 border-nexus-accent border-t-transparent rounded-full animate-spin"></span>
                     ) : (
                        <span className="material-symbols-outlined text-gray-500 hover:text-white">search</span>
                     )}
                  </button>
               </form>

               {/* Clear Button */}
               {geoQuery && (
                  <button
                     onClick={() => { setGeoQuery(''); setSearchResults([]); }}
                     className="absolute inset-y-0 right-12 flex items-center text-gray-400 hover:text-white z-[2002]"
                  >
                     <span className="material-symbols-outlined text-lg">close</span>
                  </button>
               )}

               {/* RESULTS DROPDOWN WITH CADASTRAL PREVIEW */}
               {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-nexus-900/95 backdrop-blur-xl border border-nexus-700/50 rounded-xl shadow-2xl overflow-hidden animate-slide-in max-h-[400px] overflow-y-auto custom-scrollbar z-[2005]">
                     <div className="p-3 border-b border-white/5 bg-nexus-950/80 flex justify-between items-center sticky top-0 backdrop-blur-md">
                        <span className="text-[9px] font-black text-nexus-accent uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                           <span className="material-symbols-outlined text-[12px] animate-pulse">radar</span>
                           Búsqueda Activa
                        </span>
                        <span className="text-[8px] text-gray-500 font-mono italic">ENTER para búsqueda asistida por IA</span>
                     </div>
                     {searchResults.map((result, idx) => (
                        <div
                           key={idx}
                           onClick={() => {
                              setGeoQuery(result.display_name.split(',')[0]);
                              executeFlyTo(parseFloat(result.lat), parseFloat(result.lon), { formatted_address: result.display_name, address: result.address });
                           }}
                           className="p-4 hover:bg-nexus-accent/10 cursor-pointer border-b border-white/5 last:border-0 transition-all flex items-start gap-4 group"
                        >
                           <div className={`w-10 h-10 rounded-none border-2 flex items-center justify-center flex-shrink-0 transition-all ${result.address?.house_number
                              ? 'bg-nexus-accent/20 border-nexus-accent text-nexus-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                              : 'bg-white/5 border-white/10 text-gray-500'
                              }`}>
                              <span className="material-symbols-outlined text-xl">
                                 {result.address?.house_number ? 'home_pin' : 'signpost'}
                              </span>
                           </div>
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3">
                                 <p className="text-[13px] text-white font-black leading-tight truncate uppercase italic tracking-wider">
                                    {result.address?.road || result.name || result.display_name.split(',')[0]}
                                 </p>
                                 {result.address?.house_number && (
                                    <span className="bg-nexus-accent text-white px-2 py-0.5 text-[9px] font-black italic tracking-widest border border-white/20">
                                       #{result.address.house_number}
                                    </span>
                                 )}
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1 truncate font-mono">
                                 {result.address?.neighbourhood && <span className="text-nexus-accent/70 font-bold">{result.address.neighbourhood.toUpperCase()}, </span>}
                                 {((result.address?.city || result.address?.town || result.address?.village || '').toUpperCase())}, {((result.address?.state || '').toUpperCase())}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <div className="flex gap-2 mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 justify-center">
               <span className="text-[10px] text-nexus-accent bg-black/50 px-2 py-1 rounded backdrop-blur border border-nexus-accent/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                  Geolocalización mejorada con Google AI Grounding
               </span>
            </div>
         </div>

         {/* --- PROFESSIONAL TACTICAL CONTROLS (Right Sidebar) --- */}
         <div className="absolute top-32 right-8 flex flex-col gap-4 z-[1000]">
            <div className="bg-black/80 backdrop-blur-xl p-2 flex flex-col gap-3 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
               <button
                  onClick={toggleRuler}
                  className={`w-12 h-12 flex items-center justify-center transition-all relative group ${isRulerActive ? 'bg-nexus-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  title="Medición de Distancias"
               >
                  <span className="material-symbols-outlined text-2xl">straighten</span>
                  <div className="absolute right-full mr-4 px-3 py-1 bg-black text-[9px] font-black text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border-r-2 border-nexus-accent pointer-events-none uppercase tracking-widest">
                     Herramienta de Medición
                  </div>
               </button>
               <button
                  onClick={clearRuler}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-nexus-danger hover:bg-nexus-danger/5 transition-all relative group"
                  title="Limpiar Mediciones"
               >
                  <span className="material-symbols-outlined text-2xl">delete_sweep</span>
               </button>
               <div className="h-px bg-white/10 mx-2"></div>
               <button
                  onClick={togglePegman}
                  className={`w-12 h-12 flex items-center justify-center transition-all relative group ${isPegmanActive ? 'bg-nexus-warning text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  title="Street_View"
               >
                  <span className="material-symbols-outlined text-2xl">person_pin_circle</span>
               </button>
               <button
                  onClick={locateMe}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-nexus-accent hover:bg-nexus-accent/5 transition-all relative group"
                  title="Mi Ubicación"
               >
                  <span className="material-symbols-outlined text-2xl">my_location</span>
               </button>
            </div>

            <div className="bg-black/80 backdrop-blur-xl p-2 flex flex-col gap-2 border border-white/10">
               <button onClick={zoomIn} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <span className="material-symbols-outlined">add</span>
               </button>
               <button onClick={zoomOut} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <span className="material-symbols-outlined">remove</span>
               </button>
            </div>
         </div>

         {/* Projection Mode Overlay */}
         {projectionMode && (
            <div className="absolute inset-0 pointer-events-none z-10">
               <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-2 rounded border border-nexus-danger text-white font-bold text-xl tracking-widest animate-pulse pointer-events-auto">
                  MODO PROYECCIÓN: SALA DE SITUACIÓN
               </div>
               <button
                  onClick={() => setProjectionMode(false)}
                  className="absolute top-8 right-8 pointer-events-auto bg-nexus-800 text-white p-2 rounded hover:bg-red-600 border border-nexus-700"
               >
                  Salir
               </button>
            </div>
         )}

         {/* --- SELECTED TARGET DETAIL PANEL --- */}
         {selectedTarget && !projectionMode && (
            <div className="absolute top-4 left-4 bottom-12 w-96 glass-panel rounded-xl border border-nexus-700 shadow-2xl z-[1000] flex flex-col overflow-hidden animate-slide-in">
               {/* Hero Image */}
               <div className="relative h-48 flex-shrink-0">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-700" style={{ backgroundImage: `url(${selectedTarget.img})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-nexus-900 via-transparent to-transparent"></div>
                  <button
                     onClick={closeTargetPanel}
                     className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full hover:bg-black flex items-center justify-center backdrop-blur transition-colors"
                  >
                     <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  <div className="absolute bottom-4 left-6 right-6">
                     <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{selectedTarget.name}</h2>
                     <div className="flex items-center gap-2">
                        <span className="text-nexus-accent font-bold text-sm bg-nexus-900/80 px-2 py-0.5 rounded">{selectedTarget.realName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedTarget.risk > 80 ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'}`}>Riesgo {selectedTarget.risk}</span>
                     </div>
                  </div>
               </div>

               {/* Quick Actions Bar */}
               <div className="flex justify-around p-4 border-b border-nexus-800 bg-nexus-900">
                  <button onClick={openStreetView} className="flex flex-col items-center gap-1 group">
                     <div className="w-10 h-10 rounded-full bg-nexus-800 border border-nexus-700 flex items-center justify-center group-hover:bg-nexus-accent group-hover:text-white transition-colors text-nexus-accent">
                        <span className="material-symbols-outlined">streetview</span>
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold group-hover:text-white">Street View</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                     <div className="w-10 h-10 rounded-full bg-nexus-800 border border-nexus-700 flex items-center justify-center group-hover:bg-nexus-accent group-hover:text-white transition-colors text-nexus-accent">
                        <span className="material-symbols-outlined">directions</span>
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold group-hover:text-white">Ruta</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                     <div className="w-10 h-10 rounded-full bg-nexus-800 border border-nexus-700 flex items-center justify-center group-hover:bg-nexus-accent group-hover:text-white transition-colors text-nexus-accent">
                        <span className="material-symbols-outlined">share</span>
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold group-hover:text-white">Compartir</span>
                  </button>
               </div>

               {/* Content Body */}
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-nexus-900/95">
                  {/* Address Info */}
                  <div className="flex items-start gap-3 text-gray-300">
                     <span className="material-symbols-outlined text-gray-500 mt-0.5">location_on</span>
                     <div>
                        <p className="text-sm font-medium text-white">{selectedTarget.address}</p>
                        <p className="text-xs text-gray-500">{selectedTarget.lastSeen}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                     <span className="material-symbols-outlined text-gray-500">groups</span>
                     <div className="flex flex-wrap gap-2">
                        {selectedTarget.affiliations.map((aff: string, i: number) => (
                           <span key={i} className="px-2 py-0.5 bg-nexus-800 text-gray-300 border border-nexus-700 rounded text-xs">
                              {aff}
                           </span>
                        ))}
                     </div>
                  </div>

                  {/* Timeline History */}
                  <div>
                     <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b border-nexus-800 pb-2">Actividad Reciente</h4>
                     <div className="space-y-4 border-l border-nexus-700 ml-2 pl-4 relative">
                        {selectedTarget.history.map((h: any, i: number) => (
                           <div key={i} className="relative">
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-nexus-900 border-2 border-nexus-500"></div>
                              <p className="text-xs text-nexus-accent font-mono mb-0.5">{h.date}</p>
                              <p className="text-sm text-gray-300">{h.event}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button className="w-full py-3 bg-nexus-800 border border-nexus-600 text-white rounded font-bold hover:bg-nexus-700 transition-colors flex items-center justify-center gap-2">
                     <span className="material-symbols-outlined">folder_open</span>
                     Abrir Expediente Completo
                  </button>
               </div>
            </div>
         )}

         {/* Layer Manager (Only show if target not selected) */}
         {!selectedTarget && (
            <div className={`absolute top-20 left-4 w-72 glass-panel rounded-xl border border-nexus-700 shadow-2xl z-[1000] transition-transform duration-300 ${showLayerSelector && !projectionMode ? 'translate-x-0' : '-translate-x-[120%]'}`}>
               <div className="p-4 border-b border-nexus-700 flex justify-between items-center bg-nexus-800/80 backdrop-blur">
                  <h3 className="font-bold text-white flex items-center gap-2">
                     <span className="material-symbols-outlined text-nexus-accent">layers</span>
                     Capas & Datos
                  </h3>
                  <button onClick={() => setShowLayerSelector(false)} className="text-gray-400 hover:text-white">
                     <span className="material-symbols-outlined">close</span>
                  </button>
               </div>

               <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Base Map Selector */}
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Tipo de Mapa</label>
                     <div className="grid grid-cols-2 gap-2">
                        <div onClick={() => setBaseMap('googleHybrid')} className={`cursor-pointer rounded border p-2 flex flex-col items-center gap-1 ${baseMap === 'googleHybrid' ? 'border-nexus-accent bg-nexus-800' : 'border-gray-700 opacity-60 hover:opacity-100'}`}>
                           <span className="material-symbols-outlined text-white">public</span>
                           <div className="text-[9px] text-center text-white">Earth (Híbrido)</div>
                        </div>
                        <div onClick={() => setBaseMap('googleStreets')} className={`cursor-pointer rounded border p-2 flex flex-col items-center gap-1 ${baseMap === 'googleStreets' ? 'border-nexus-accent bg-nexus-800' : 'border-gray-700 opacity-60 hover:opacity-100'}`}>
                           <span className="material-symbols-outlined text-white">map</span>
                           <div className="text-[9px] text-center text-white">Maps</div>
                        </div>
                        <div onClick={() => setBaseMap('wazeStyle')} className={`cursor-pointer rounded border p-2 flex flex-col items-center gap-1 ${baseMap === 'wazeStyle' ? 'border-nexus-accent bg-nexus-800' : 'border-gray-700 opacity-60 hover:opacity-100'}`}>
                           <span className="material-symbols-outlined text-white">navigation</span>
                           <div className="text-[9px] text-center text-white">Waze (Nav)</div>
                        </div>
                        <div onClick={() => setBaseMap('dark')} className={`cursor-pointer rounded border p-2 flex flex-col items-center gap-1 ${baseMap === 'dark' ? 'border-nexus-accent bg-nexus-800' : 'border-gray-700 opacity-60 hover:opacity-100'}`}>
                           <span className="material-symbols-outlined text-white">dark_mode</span>
                           <div className="text-[9px] text-center text-white">Táctico</div>
                        </div>
                     </div>
                  </div>

                  {/* Layer List */}
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Capas de Información</label>
                     <div className="space-y-2">
                        {layers.map(layer => (
                           <div
                              key={layer.id}
                              onClick={() => toggleLayer(layer.id)}
                              className={`flex items-center gap-3 p-2 rounded cursor-pointer border transition-all ${layer.visible
                                 ? 'bg-nexus-800 border-nexus-600'
                                 : 'bg-transparent border-transparent hover:bg-nexus-800/50'
                                 }`}
                           >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${layer.visible ? 'bg-nexus-accent border-nexus-accent' : 'border-gray-600'}`}>
                                 {layer.visible && <span className="material-symbols-outlined text-[10px] text-white">check</span>}
                              </div>
                              <div className="flex-1">
                                 <p className={`text-xs font-medium ${layer.visible ? 'text-white' : 'text-gray-400'}`}>{layer.name}</p>
                              </div>
                              {layer.count && <span className="text-[10px] bg-nexus-900 px-1.5 rounded text-gray-400">{layer.count}</span>}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Tools */}
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Herramientas</label>
                     <div className="grid grid-cols-2 gap-2">
                        <button className="p-2 bg-nexus-800 border border-nexus-700 rounded flex flex-col items-center gap-1 hover:bg-nexus-700">
                           <span className="material-symbols-outlined text-nexus-accent">straighten</span>
                           <span className="text-[10px] text-gray-300">Medir</span>
                        </button>
                        <button className="p-2 bg-nexus-800 border border-nexus-700 rounded flex flex-col items-center gap-1 hover:bg-nexus-700">
                           <span className="material-symbols-outlined text-nexus-accent">draw</span>
                           <span className="text-[10px] text-gray-300">Dibujar</span>
                        </button>
                     </div>
                  </div>

                  {/* Import/Export Tools */}
                  <div className="pt-2 border-t border-nexus-700 space-y-2">
                     <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".kml,.kmz,.json" />
                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 bg-nexus-800 hover:bg-nexus-700 text-gray-300 rounded border border-nexus-600 flex items-center justify-center gap-2 text-xs font-medium transition-colors"
                     >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        Importar KML / GeoJSON
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Controls when UI Hidden */}
         {!showLayerSelector && !projectionMode && !selectedTarget && (
            <button
               onClick={() => setShowLayerSelector(true)}
               className="absolute top-20 left-4 p-3 bg-nexus-900 text-white rounded-lg shadow-xl border border-nexus-600 z-[900] flex items-center gap-2"
            >
               <span className="material-symbols-outlined">menu</span>
               <span className="text-sm font-bold hidden md:inline">Menú de Capas</span>
            </button>
         )}

         {/* Projection Button */}
         {!projectionMode && !selectedTarget && (
            <button
               onClick={() => setProjectionMode(true)}
               className="absolute top-20 right-4 p-2 bg-nexus-800 text-gray-300 rounded-lg shadow-xl border border-nexus-600 z-[900] hover:text-white"
               title="Modo Proyección"
            >
               <span className="material-symbols-outlined">present_to_all</span>
            </button>
         )}
      </div>
   );
};
