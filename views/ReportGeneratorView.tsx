
import React, { useState, useRef } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { GoogleGenAI } from "@google/genai";
import { extractTextFromPDF } from '../utils/pdfHelper';

interface UploadedFile {
  name: string;
  content: string;
  size: string;
}

export const ReportGeneratorView: React.FC = () => {
  const { addNotification, currentUser } = useGlobalState();
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // State for visual feedback
  const [reportTitle, setReportTitle] = useState('INFORME DE ANÁLISIS CRIMINAL');
  const [customPrompt, setCustomPrompt] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FILE HANDLING LOGIC ---
  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    addNotification('info', `Procesando ${files.length} archivo(s)...`);

    for (const file of files) {
      try {
        let text = '';
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
           text = await extractTextFromPDF(file);
        } else {
           text = await file.text();
        }

        const newFile: UploadedFile = {
          name: file.name,
          content: text,
          size: (file.size / 1024).toFixed(1) + 'KB'
        };

        setUploadedFiles(prev => [...prev, newFile]);
      } catch (err) {
        console.error(err);
        addNotification('error', `Error leyendo ${file.name}`);
      }
    }
    
    addNotification('success', 'Archivos cargados al contexto de la IA.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- AI GENERATION ---
  const handleGenerate = async () => {
     if (uploadedFiles.length === 0 && !customPrompt.trim()) {
        addNotification('warning', 'Por favor sube archivos o escribe una instrucción.');
        return;
     }

     setIsGenerating(true);
     setReportContent(''); // Clear previous

     try {
        // Construct Context
        let context = "";
        uploadedFiles.forEach((f, i) => {
           context += `\n--- FUENTE DE EVIDENCIA ${i+1} (${f.name}) ---\n${f.content.substring(0, 25000)}\n`; 
        });

        // UFEMI STYLE PROMPT ENGINEERING
        const prompt = `
          ACTÚA COMO: Integrante del Área de Análisis Criminal Estratégico de la UFEMI (Unidad Fiscal Especial de Microtráfico).
          
          OBJETIVO: Redactar un informe técnico-forense de alta calidad para ser presentado ante la Fiscalía General.
          
          CONTEXTO Y EVIDENCIA DISPONIBLE:
          ${context}

          INSTRUCCIONES DEL COMANDO OPERATIVO (Usuario): 
          "${customPrompt || 'Realizar análisis de tareas de campo y sugerir medidas.'}"
          
          NOMBRE DEL FIRMANTE: ${currentUser?.name || 'El Analista'}
          
          ESTILO Y VOCABULARIO OBLIGATORIO (PATRÓN DE ORO):
          1.  **Encabezado Formal:** "Quien suscribe, [Nombre], integrante del Área de Análisis Criminal Estratégico de la UFEMI, se dirige a fin de dar respuesta a lo solicitado..."
          2.  **Precisión Ubicación:** Usar "sito en...", "intersección de...", coordenadas precisas (ej: -31.647516, -60.730104).
          3.  **Descripción de Personas:** Usar "masculino/femenina", describir vestimenta ("remera color celeste", "bermuda de jean").
          4.  **Descripción de Hechos:** Usar términos como "maniobra de pasamanos", "conducta compatible con comercialización minorista", "motovehículo", "egresó/ingresó".
          5.  **Roles:** Identificar "soldaditos" como "estructuras de apoyo periféricas" o "funciones de vigilancia".
          6.  **Marco Legal:** Citar explícitamente "Resoluciones 467/2023 y 35/2024 de la Fiscalía General" para la priorización de casos.
          7.  **Cierre:** Sugerir "continuar con el seguimiento", "verificar información", mencionar CUIJ si está disponible o dejar placeholder "CUIJ de trabajo...".

          FORMATO DE SALIDA:
          - Texto plano pero con espaciado formal.
          - Tono objetivo, frío y pericial.
          - NO uses formato Markdown de listas (bullets) salvo que sea estrictamente necesario para enumerar evidencia. Prefiere párrafos narrativos densos y descriptivos como en los informes judiciales reales.
        `;

        const apiKey = (process.env.API_KEY || process.env.GEMINI_API_KEY || '') as string;
        if (!apiKey) {
           addNotification('warning', 'Modo offline: Mostrando informe forense de plantilla.');
           setReportContent("INFORME DE ANÁLISIS CRIMINAL ESTRATÉGICO\nMINISTERIO PÚBLICO DE LA ACUSACIÓN // UFEMI\n\nQuien suscribe, integrante del Área de Análisis Criminal Estratégico de la UFEMI, se dirige a la Fiscalía General a fin de elevar el presente informe pericial respecto de los elementos de prueba recolectados.\n\nI. RESUMEN DE HECHOS Y EVIDENCIA\nDe la compulsa de los partes informativos y tareas de campo agregadas, se registran maniobras reiteradas de pasamanos y vigilancia periférica (soldaditos) en el perímetro delimitado por el vector de investigación.\n\nII. CONCLUSIÓN Y MEDIDAS SUGERIDAS\nSe sugiere mantener las tareas de inteligencia táctica sobre los objetivos identificados y solicitar las órdenes de allanamiento correspondientes.");
           return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
           model: 'gemini-3-pro-preview',
           contents: prompt
        });

        if (response.text) {
           setReportContent(response.text);
           addNotification('success', 'Informe forense generado con estilo UFEMI.');
        }
     } catch (error) {
        console.error(error);
        addNotification('error', 'Error al conectar con el núcleo IA.');
     } finally {
        setIsGenerating(false);
     }
  };

  const handleExport = () => {
     if (!reportContent) return;
     const blob = new Blob([reportContent], { type: 'text/markdown' });
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `${reportTitle.replace(/\s/g, '_')}.md`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     addNotification('success', 'Informe exportado.');
  };

  return (
    <div className="h-full flex bg-nexus-950 overflow-hidden">
       {/* Settings Sidebar */}
       <div className="w-80 bg-nexus-900 border-r border-nexus-700 flex flex-col z-10">
          <div className="p-6 border-b border-nexus-800">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-nexus-accent">article</span>
                Generador UFEMI
             </h2>
             <p className="text-xs text-gray-400 mt-1">Redacción forense automatizada.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
             
             {/* 1. File Upload with Drag & Drop */}
             <div>
                <label className="text-xs font-bold text-nexus-accent uppercase mb-2 block flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">folder_zip</span>
                   Fuente de Datos (Actas/Partes)
                </label>
                
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                   className={`
                     border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[100px]
                     ${isDragging 
                        ? 'border-nexus-accent bg-nexus-accent/20 scale-105 shadow-lg shadow-nexus-accent/20' 
                        : 'border-nexus-700 bg-nexus-800/30 hover:border-nexus-accent hover:bg-nexus-800'
                     }
                   `}
                >
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".pdf,.txt,.md" />
                   <span className={`material-symbols-outlined text-3xl mb-2 transition-colors ${isDragging ? 'text-white animate-bounce' : 'text-gray-500 group-hover:text-white'}`}>
                      {isDragging ? 'download' : 'cloud_upload'}
                   </span>
                   <p className="text-xs text-gray-400 group-hover:text-gray-300 font-medium">
                      {isDragging ? 'Suelta actas o partes aquí' : 'Click o Arrastrar PDF/TXT'}
                   </p>
                </div>

                {/* File List */}
                {uploadedFiles.length > 0 && (
                   <div className="mt-3 space-y-2">
                      {uploadedFiles.map((f, i) => (
                         <div key={i} className="flex justify-between items-center bg-nexus-950 p-2 rounded border border-nexus-800 animate-slide-in">
                            <div className="flex items-center gap-2 overflow-hidden">
                               <span className="material-symbols-outlined text-xs text-gray-500">description</span>
                               <span className="text-xs text-gray-300 truncate w-32" title={f.name}>{f.name}</span>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-red-400">
                               <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                         </div>
                      ))}
                   </div>
                )}
             </div>

             {/* 2. Custom Prompt */}
             <div>
                <label className="text-xs font-bold text-nexus-accent uppercase mb-2 block flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">terminal</span>
                   Instrucciones al Analista
                </label>
                <textarea 
                   value={customPrompt}
                   onChange={(e) => setCustomPrompt(e.target.value)}
                   placeholder="Ej: Enfocarse en la vestimenta del 'pasamanos' y la vinculación con el domicilio rosado. Mencionar CUIJ 21-09700937-3."
                   className="w-full bg-nexus-950 border border-nexus-700 rounded-lg p-3 text-sm text-gray-200 focus:border-nexus-accent focus:outline-none h-40 resize-none"
                />
             </div>

             {/* Action Button */}
             <button 
               onClick={handleGenerate}
               disabled={isGenerating}
               className="w-full py-3 bg-gradient-to-r from-nexus-accent to-blue-600 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-nexus-accent/20 transition-all"
             >
               {isGenerating ? (
                  <>
                     <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                     Redactando...
                  </>
               ) : (
                  <>
                     <span className="material-symbols-outlined">auto_awesome</span>
                     Generar Informe UFEMI
                  </>
               )}
             </button>
          </div>

          <div className="p-4 border-t border-nexus-800 bg-nexus-900/50">
             <div className="text-[10px] text-gray-500 text-center">
                MOTOR: GEMINI 3 PRO • MODELO: FORENSE V2
             </div>
          </div>
       </div>

       {/* Preview Area */}
       <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-grid flex flex-col items-center">
          <div className="w-full max-w-4xl bg-white min-h-[800px] shadow-2xl rounded-sm p-12 text-gray-900 relative flex flex-col">
             
             {/* Document Header */}
             <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
                <div className="flex-1">
                   <input 
                     value={reportTitle}
                     onChange={(e) => setReportTitle(e.target.value)}
                     className="text-3xl font-black uppercase tracking-tight text-gray-900 border-none focus:outline-none focus:ring-0 w-full placeholder-gray-400" 
                     placeholder="TITULO DEL INFORME..."
                   />
                   <p className="text-gray-500 font-mono mt-1 text-xs uppercase">Ministerio Público de la Acusación // UFEMI</p>
                </div>
                <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center rounded">
                   <span className="material-symbols-outlined text-4xl">local_police</span>
                </div>
             </div>

             {/* Content Editor */}
             <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="El informe generado aparecerá aquí con el formato oficial..."
                className="flex-1 w-full resize-none border-none focus:ring-0 text-sm font-serif leading-relaxed text-gray-900 whitespace-pre-wrap outline-none text-justify"
                spellCheck="false"
             />

             {/* Footer */}
             <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between text-[10px] font-sans text-gray-500 uppercase">
                <span>Área de Análisis Criminal Estratégico</span>
                <span>Documento Oficial</span>
                <span>{new Date().toLocaleDateString()}</span>
             </div>

             {/* Floating Actions */}
             <div className="absolute top-8 right-[-70px] flex flex-col gap-2 print:hidden">
                <button 
                   onClick={() => window.print()}
                   className="p-3 bg-gray-800 text-white rounded-full shadow-xl hover:bg-gray-700 transition-colors"
                   title="Imprimir"
                >
                   <span className="material-symbols-outlined">print</span>
                </button>
                <button 
                   onClick={handleExport}
                   className="p-3 bg-nexus-accent text-white rounded-full shadow-xl hover:bg-blue-600 transition-colors"
                   title="Descargar MD"
                >
                   <span className="material-symbols-outlined">download</span>
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
