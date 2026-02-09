
import React, { useState, useRef } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { IngestionFile, Workbook } from '../types';

export const DataIngestionView: React.FC = () => {
  const { addNotification, addWorkbook, navigate } = useGlobalState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<IngestionFile[]>([
    { id: 'f1', name: 'Reporte_Balistica_Caso22.pdf', type: 'pdf', size: '2.4 MB', status: 'ready', progress: 100, extractedEntities: 14 },
    { id: 'f2', name: 'Escucha_Telefonica_44.mp3', type: 'audio', size: '14 MB', status: 'processing', progress: 65, extractedEntities: 5 }
  ]);

  const processFile = (file: File) => {
    addNotification('info', `Iniciando análisis de: ${file.name}`);
    
    // Create new entry
    const newFile: IngestionFile = {
       id: `f-${Date.now()}`,
       name: file.name,
       type: file.name.endsWith('pdf') ? 'pdf' : file.name.endsWith('xlsx') ? 'excel' : 'audio',
       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
       status: 'uploading',
       progress: 0,
       extractedEntities: 0
    };
    setFiles(prev => [newFile, ...prev]);
    
    // Simulate Upload & Process
    let progress = 0;
    const interval = setInterval(() => {
       progress += 10;
       if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'ready', progress: 100, extractedEntities: Math.floor(Math.random() * 20) + 1 } : f));
          addNotification('success', `${file.name} procesado exitosamente.`);
       } else {
          setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'processing', progress: progress } : f));
       }
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       processFile(e.dataTransfer.files[0]);
    }
  };

  const handleReview = (file: IngestionFile) => {
    addNotification('info', `Generando expediente de análisis para ${file.name}...`);
    
    const newWorkbook: Workbook = {
      id: `wb-ingest-${file.id}`,
      title: `Análisis: ${file.name}`,
      sources: [
        {
          id: `src-${file.id}`,
          title: file.name,
          type: file.type === 'excel' ? 'text' : file.type as any,
          contentSummary: 'Archivo importado automáticamente desde Centro de Ingesta.',
          uploadDate: new Date().toLocaleDateString(),
          citations: 0,
          rawText: `Contenido extraído y estructurado del archivo ${file.name}. \n\n[ANÁLISIS IA]: Se han detectado múltiples entidades y correlaciones en este documento...`
        }
      ],
      notes: [],
      chatHistory: [
        {
           id: `msg-${Date.now()}`,
           role: 'ai',
           content: `He procesado el archivo "${file.name}" desde el Centro de Ingesta. \n\nSe detectaron ${file.extractedEntities} entidades clave. Puede visualizar el grafo de relaciones o solicitar un resumen ejecutivo.`,
           timestamp: new Date()
        }
      ]
    };
    
    addWorkbook(newWorkbook);
    navigate('workbooks', { workbookId: newWorkbook.id });
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden bg-grid">
       <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <span className="material-symbols-outlined text-nexus-accent text-3xl">upload_file</span>
             Centro de Ingesta AI
          </h2>
          <p className="text-sm text-gray-400 mt-1">Sube documentos, audios o tablas. La IA extraerá entidades, ubicaciones y vínculos automáticamente.</p>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Drop Zone */}
          <div 
             className="lg:col-span-2 border-2 border-dashed border-nexus-600 rounded-2xl bg-nexus-900/30 flex flex-col items-center justify-center p-12 transition-all hover:border-nexus-accent hover:bg-nexus-900/50 group cursor-pointer"
             onDragOver={(e) => e.preventDefault()}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
          >
             <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
             <div className="w-20 h-20 rounded-full bg-nexus-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-nexus-accent">cloud_upload</span>
             </div>
             <h3 className="text-xl font-bold text-gray-200 mb-2">Arrastra archivos aquí</h3>
             <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                Soporta PDF, Word, Excel, MP3, WAV, JPG. <br/>
                <span className="text-nexus-accent">Procesamiento OCR y Transcripción de Audio activados.</span>
             </p>
             <button className="px-6 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg transition-colors pointer-events-none">
                Explorar Archivos
             </button>
          </div>

          {/* Processing Queue */}
          <div className="glass-panel border border-nexus-700 rounded-2xl flex flex-col overflow-hidden">
             <div className="p-4 border-b border-nexus-700 bg-nexus-800/80">
                <h3 className="font-bold text-white text-sm">Cola de Procesamiento</h3>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {files.map(file => (
                   <div key={file.id} className="bg-nexus-900/50 p-3 rounded-lg border border-nexus-800 relative overflow-hidden group hover:border-nexus-600 transition-colors">
                      <div className="flex justify-between items-start mb-2 relative z-10">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                               file.type === 'pdf' ? 'bg-red-500/20 text-red-400' :
                               file.type === 'audio' ? 'bg-purple-500/20 text-purple-400' :
                               'bg-green-500/20 text-green-400'
                            }`}>
                               <span className="material-symbols-outlined text-lg">
                                  {file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'audio' ? 'headphones' : 'table_chart'}
                               </span>
                            </div>
                            <div>
                               <h4 className="text-sm font-medium text-gray-200 truncate max-w-[150px]">{file.name}</h4>
                               <p className="text-[10px] text-gray-500">{file.size} • {file.status.toUpperCase()}</p>
                            </div>
                         </div>
                         {file.status === 'ready' ? (
                            <span className="material-symbols-outlined text-nexus-success text-lg">check_circle</span>
                         ) : (
                            <span className="material-symbols-outlined text-nexus-accent text-lg animate-spin">sync</span>
                         )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-nexus-950 h-1.5 rounded-full overflow-hidden relative z-10">
                         <div 
                            className={`h-full rounded-full transition-all duration-500 ${file.status === 'ready' ? 'bg-nexus-success' : 'bg-nexus-accent'}`} 
                            style={{ width: `${file.progress}%` }}
                         ></div>
                      </div>

                      {file.status === 'ready' && (
                         <div className="mt-2 flex justify-between items-center relative z-10">
                            <span className="text-[10px] text-nexus-accent bg-nexus-accent/10 px-2 py-0.5 rounded border border-nexus-accent/20">
                               {file.extractedEntities} Entidades Extraídas
                            </span>
                            <button 
                              onClick={() => handleReview(file)}
                              className="text-xs text-gray-300 hover:text-nexus-accent hover:font-bold flex items-center gap-1 transition-all bg-nexus-800 px-2 py-1 rounded border border-nexus-700 hover:border-nexus-accent"
                            >
                               Revisar <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </button>
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  );
};
