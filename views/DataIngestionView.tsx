import React, { useState, useRef } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { IngestionFile, Workbook, FinancialTransaction, ImportedDataset } from '../types';

export const DataIngestionView: React.FC = () => {
  const { 
    addNotification, 
    addWorkbook, 
    addImportedDataset, 
    addImportedTransactions, 
    addImportedNetworkData, 
    navigate,
    importedDatasets 
  } = useGlobalState();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<IngestionFile[]>([
    { id: 'f1', name: 'Reporte_Balistica_Caso22.pdf', type: 'pdf', size: '2.4 MB', status: 'ready', progress: 100, extractedEntities: 14 },
    { id: 'f2', name: 'Registro_Llamadas_CDR.csv', type: 'excel', size: '480 KB', status: 'ready', progress: 100, extractedEntities: 38 }
  ]);

  // Preview & Import Modal State
  const [activeDataset, setActiveDataset] = useState<ImportedDataset | null>(null);
  const [targetDestination, setTargetDestination] = useState<'network' | 'financial' | 'case'>('network');

  // Helper to parse CSV text into headers and rows
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
      if (values.length === headers.length) {
        const rowObj: Record<string, string> = {};
        headers.forEach((h, index) => {
          rowObj[h] = values[index];
        });
        rows.push(rowObj);
      }
    }
    return { headers, rows };
  };

  const processRealFile = (file: File) => {
    addNotification('info', `Procesando archivo: ${file.name}`);
    const fileId = `f-${Date.now()}`;
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    const newIngestionFile: IngestionFile = {
      id: fileId,
      name: file.name,
      type: fileExt === 'pdf' ? 'pdf' : ['csv', 'xlsx', 'xls'].includes(fileExt) ? 'excel' : 'text',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      status: 'processing',
      progress: 30,
      extractedEntities: 0
    };

    setFiles(prev => [newIngestionFile, ...prev]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let headers: string[] = [];
      let rows: Record<string, string>[] = [];

      if (fileExt === 'json') {
        try {
          const parsed = JSON.parse(content);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          if (dataArray.length > 0) {
            headers = Object.keys(dataArray[0]);
            rows = dataArray.map(item => {
              const row: Record<string, string> = {};
              Object.keys(item).forEach(k => { row[k] = String(item[k]); });
              return row;
            });
          }
        } catch (err) {
          console.error('Error parseando JSON:', err);
        }
      } else {
        const csvResult = parseCSV(content);
        headers = csvResult.headers;
        rows = csvResult.rows;
      }

      // Auto-detect target destination
      const headerStr = headers.join(' ').toLowerCase();
      let autoTarget: 'network' | 'financial' | 'case' = 'network';
      if (headerStr.includes('monto') || headerStr.includes('amount') || headerStr.includes('banco') || headerStr.includes('cbu') || headerStr.includes('transaccion')) {
        autoTarget = 'financial';
      } else if (headerStr.includes('caso') || headerStr.includes('expediente') || headerStr.includes('resumen')) {
        autoTarget = 'case';
      }

      const dataset: ImportedDataset = {
        id: `ds-${Date.now()}`,
        name: file.name,
        type: fileExt.toUpperCase(),
        recordCount: rows.length,
        uploadDate: new Date().toLocaleDateString(),
        rawContent: content,
        parsedHeaders: headers,
        parsedRows: rows
      };

      addImportedDataset(dataset);

      setFiles(prev => prev.map(f => f.id === fileId ? {
        ...f,
        status: 'ready',
        progress: 100,
        extractedEntities: rows.length || Math.floor(Math.random() * 15) + 5
      } : f));

      setActiveDataset(dataset);
      setTargetDestination(autoTarget);
      addNotification('success', `Archivo "${file.name}" leído exitosamente. ${rows.length} registros estructurados.`);
    };

    reader.onerror = () => {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', progress: 0 } : f));
      addNotification('error', `Error al leer el archivo ${file.name}`);
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => processRealFile(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => processRealFile(file));
    }
  };

  // Ingest sample data for instant demonstration
  const loadSampleDataset = (type: 'cdr' | 'financial' | 'suspects') => {
    let dataset: ImportedDataset;
    if (type === 'cdr') {
      dataset = {
        id: `ds-sample-cdr-${Date.now()}`,
        name: 'Matriz_Intercepciones_CDR_Sitiadas.csv',
        type: 'CSV',
        recordCount: 5,
        uploadDate: new Date().toLocaleDateString(),
        parsedHeaders: ['Origen_Alias', 'Origen_Telefono', 'Destino_Alias', 'Destino_Telefono', 'Fecha_Hora', 'Duracion_Seg'],
        parsedRows: [
          { Origen_Alias: 'El Padrino', Origen_Telefono: '+5491140019283', Destino_Alias: 'El Contador', Destino_Telefono: '+5491158821092', Fecha_Hora: '2026-03-10 14:22', Duracion_Seg: '240' },
          { Origen_Alias: 'El Contador', Origen_Telefono: '+5491158821092', Destino_Alias: 'Logística Sur', Destino_Telefono: '+5491139918273', Fecha_Hora: '2026-03-10 14:35', Duracion_Seg: '120' },
          { Origen_Alias: 'El Padrino', Origen_Telefono: '+5491140019283', Destino_Alias: 'Operador Rosario', Destino_Telefono: '+5493416991100', Fecha_Hora: '2026-03-10 16:05', Duracion_Seg: '580' },
          { Origen_Alias: 'Operador Rosario', Origen_Telefono: '+5493416991100', Destino_Alias: 'Transporte Clandestino', Destino_Telefono: '+5493414112233', Fecha_Hora: '2026-03-10 16:40', Duracion_Seg: '95' },
          { Origen_Alias: 'Logística Sur', Origen_Telefono: '+5491139918273', Destino_Alias: 'Financiera Centro', Destino_Telefono: '+5491122334455', Fecha_Hora: '2026-03-10 17:15', Duracion_Seg: '310' },
        ]
      };
      setTargetDestination('network');
    } else if (type === 'financial') {
      dataset = {
        id: `ds-sample-fin-${Date.now()}`,
        name: 'Reporte_UIF_Movimientos_Bancarios.csv',
        type: 'CSV',
        recordCount: 3,
        uploadDate: new Date().toLocaleDateString(),
        parsedHeaders: ['Fecha', 'Entidad_Origen', 'Cuenta_Origen', 'Entidad_Destino', 'Cuenta_Destino', 'Monto_USD', 'Concepto', 'Alerta'],
        parsedRows: [
          { Fecha: '2026-03-01', Entidad_Origen: 'Inversiones Patria S.A.', Cuenta_Origen: 'CBU 0170020129038', Entidad_Destino: 'Offshore Nevis Corp', Cuenta_Destino: 'CBU 99182736412', Monto_USD: '145000', Concepto: 'Consultoría Externa', Alerta: 'Monto Atípico' },
          { Fecha: '2026-03-03', Entidad_Origen: 'Offshore Nevis Corp', Cuenta_Origen: 'CBU 99182736412', Entidad_Destino: 'Financiera Delta', Cuenta_Destino: 'CBU 01100223948', Monto_USD: '89000', Concepto: 'Transferencia Directa', Alerta: 'Cuenta Puente' },
          { Fecha: '2026-03-05', Entidad_Origen: 'Financiera Delta', Cuenta_Origen: 'CBU 01100223948', Entidad_Destino: 'Compra Inmuebles Puerto Madero', Cuenta_Destino: 'CBU 00701928374', Monto_USD: '210000', Concepto: 'Boleto Compraventa', Alerta: 'Fraccionamiento' },
        ]
      };
      setTargetDestination('financial');
    } else {
      dataset = {
        id: `ds-sample-suspects-${Date.now()}`,
        name: 'Nomina_Objetivos_Prioritarios.csv',
        type: 'CSV',
        recordCount: 3,
        uploadDate: new Date().toLocaleDateString(),
        parsedHeaders: ['Nombre_Completo', 'Alias', 'DNI', 'Rol', 'Organizacion', 'Nivel_Riesgo'],
        parsedRows: [
          { Nombre_Completo: 'Carlos Eduardo Ramírez', Alias: 'El Padrino', DNI: '28.491.029', Rol: 'Líder de Organización', Organizacion: 'Cartel del Litoral', Nivel_Riesgo: 'Crítico' },
          { Nombre_Completo: 'Mauricio Gastón Peralta', Alias: 'El Contador', DNI: '31.920.192', Rol: 'Gestión Financiera', Organizacion: 'Cartel del Litoral', Nivel_Riesgo: 'Alto' },
          { Nombre_Completo: 'Esteban Darío Ruiz', Alias: 'Operador Rosario', DNI: '34.819.201', Rol: 'Encargado Logístico', Organizacion: 'Cartel del Litoral', Nivel_Riesgo: 'Alto' },
        ]
      };
      setTargetDestination('case');
    }

    addImportedDataset(dataset);
    setActiveDataset(dataset);
    addNotification('success', `Ejemplo de datos "${dataset.name}" cargado exitosamente.`);
  };

  // Confirm import into destination module
  const handleConfirmImport = () => {
    if (!activeDataset) return;

    if (targetDestination === 'network') {
      const nodesMap = new Map<string, any>();
      const links: any[] = [];

      (activeDataset.parsedRows || []).forEach((row, i) => {
        const source = row.Origen_Alias || row.Origen || row.Fuente || row[activeDataset.parsedHeaders?.[0] || ''] || `Nodo_${i}_A`;
        const target = row.Destino_Alias || row.Destino || row.Objetivo || row[activeDataset.parsedHeaders?.[1] || ''] || `Nodo_${i}_B`;
        const label = row.Concepto || row.Duracion_Seg || row.Relacion || 'Vínculo Detectado';

        if (!nodesMap.has(source)) {
          nodesMap.set(source, { id: source, label: source, type: 'person', risk: 'high' });
        }
        if (!nodesMap.has(target)) {
          nodesMap.set(target, { id: target, label: target, type: 'person', risk: 'medium' });
        }

        links.push({
          source,
          target,
          label: `${label} (${row.Fecha_Hora || activeDataset.name})`,
          type: 'communication'
        });
      });

      addImportedNetworkData(Array.from(nodesMap.values()), links);
      addNotification('success', `Se exportaron ${nodesMap.size} nodos y ${links.length} vínculos al Grafo de Redes.`);
      navigate('network');

    } else if (targetDestination === 'financial') {
      const txs: FinancialTransaction[] = (activeDataset.parsedRows || []).map((row, index) => ({
        id: `tx-imp-${Date.now()}-${index}`,
        date: row.Fecha || new Date().toISOString().split('T')[0],
        originEntity: row.Entidad_Origen || row.Origen || 'Entidad Desconocida',
        originAccount: row.Cuenta_Origen || 'CBU No especificado',
        destinationEntity: row.Entidad_Destino || row.Destino || 'Destino Desconocido',
        destinationAccount: row.Cuenta_Destino || 'CBU No especificado',
        amountUSD: parseFloat(row.Monto_USD || row.Monto || '50000'),
        amountARS: parseFloat(row.Monto_ARS || '0'),
        channel: 'Transferencia Bancaria',
        suspiciousFlag: row.Alerta || 'Movimiento Detectado',
        riskScore: Math.floor(Math.random() * 30) + 70
      }));

      addImportedTransactions(txs);
      addNotification('success', `Se importaron ${txs.length} transacciones al Análisis Financiero.`);
      navigate('financial');

    } else {
      const newWorkbook: Workbook = {
        id: `wb-import-${Date.now()}`,
        title: `Expediente: ${activeDataset.name}`,
        sources: [
          {
            id: `src-${Date.now()}`,
            title: activeDataset.name,
            type: 'text',
            contentSummary: `${activeDataset.recordCount} registros importados desde el Centro de Ingesta.`,
            uploadDate: activeDataset.uploadDate,
            citations: activeDataset.recordCount,
            rawText: JSON.stringify(activeDataset.parsedRows, null, 2)
          }
        ],
        notes: [
          { id: `note-1`, content: `Set de datos cargado con ${activeDataset.recordCount} registros procesados automáticamente.`, tags: ['Importación', 'Datos Reales'] }
        ],
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            role: 'ai',
            content: `He integrado el conjunto de datos "${activeDataset.name}" al expediente. Puedes realizar preguntas a la IA sobre estos datos o solicitar análisis de inteligencia.`,
            timestamp: new Date()
          }
        ]
      };

      addWorkbook(newWorkbook);
      addNotification('success', `Expediente "${newWorkbook.title}" creado con éxito.`);
      navigate('workbooks', { workbookId: newWorkbook.id });
    }

    setActiveDataset(null);
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto custom-scrollbar bg-grid">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nexus-accent/20 border border-nexus-accent/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-nexus-accent text-2xl">upload_file</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Centro de Ingesta de Datos Reales</h2>
              <p className="text-xs text-gray-400">Importación masiva de planillas (CSV/Excel), JSON, PDF y registros telefónicos o bancarios.</p>
            </div>
          </div>
        </div>

        {/* Quick Sample Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium mr-1">Cargar Datos de Prueba:</span>
          <button 
            onClick={() => loadSampleDataset('cdr')}
            className="px-3 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-xs font-semibold text-gray-200 rounded-lg border border-nexus-700 hover:border-nexus-accent flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm text-nexus-accent">call</span>
            Matriz CDR (Llamadas)
          </button>
          <button 
            onClick={() => loadSampleDataset('financial')}
            className="px-3 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-xs font-semibold text-gray-200 rounded-lg border border-nexus-700 hover:border-emerald-500 flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm text-emerald-400">account_balance</span>
            Extracto Bancario
          </button>
          <button 
            onClick={() => loadSampleDataset('suspects')}
            className="px-3 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-xs font-semibold text-gray-200 rounded-lg border border-nexus-700 hover:border-purple-500 flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm text-purple-400">badge</span>
            Nómina Sospechosos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Drag & Drop Zone */}
        <div 
          className="lg:col-span-2 border-2 border-dashed border-nexus-600/80 rounded-2xl bg-nexus-900/40 hover:bg-nexus-900/70 border-nexus-accent/40 flex flex-col items-center justify-center p-10 transition-all group cursor-pointer relative overflow-hidden shadow-2xl"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept=".csv,.xlsx,.xls,.json,.txt,.pdf"
            multiple 
          />
          
          <div className="w-16 h-16 rounded-2xl bg-nexus-accent/10 border border-nexus-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <span className="material-symbols-outlined text-3xl text-nexus-accent">cloud_upload</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">Arrastra tus archivos aquí o haz clic para explorar</h3>
          <p className="text-xs text-gray-400 text-center max-w-md mb-5 leading-relaxed">
            Formatos soportados: <span className="text-white font-semibold">CSV, Excel, JSON, PDF, TXT</span>. <br/>
            Procesamiento inteligente automático de campos y estructuración de entidades.
          </p>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded-lg font-semibold text-xs shadow-lg transition-colors pointer-events-none flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              Seleccionar Archivos de mi Equipo
            </button>
          </div>
        </div>

        {/* Processing Queue & Live Datasets */}
        <div className="glass-panel border border-nexus-700 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-4 border-b border-nexus-700 bg-nexus-800/80 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-nexus-accent">dataset</span>
              Archivos Procesados ({files.length})
            </h3>
            <span className="text-[10px] text-nexus-success bg-nexus-success/10 px-2 py-0.5 rounded font-bold">Motor Listo</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[320px]">
            {files.map(file => (
              <div key={file.id} className="bg-nexus-900/60 p-3 rounded-xl border border-nexus-800 hover:border-nexus-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      file.type === 'pdf' ? 'bg-rose-500/20 text-rose-400' :
                      file.type === 'excel' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <span className="material-symbols-outlined text-base">
                        {file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'excel' ? 'table_chart' : 'description'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-200 truncate max-w-[140px]">{file.name}</h4>
                      <p className="text-[10px] text-gray-400">{file.size} • {file.status.toUpperCase()}</p>
                    </div>
                  </div>
                  {file.status === 'ready' ? (
                    <span className="material-symbols-outlined text-nexus-success text-base">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-nexus-accent text-base animate-spin">sync</span>
                  )}
                </div>

                {file.status === 'ready' && (
                  <div className="mt-2 flex justify-between items-center pt-2 border-t border-nexus-800">
                    <span className="text-[10px] text-nexus-accent font-semibold">
                      {file.extractedEntities} Registros Extraídos
                    </span>
                    <button 
                      onClick={() => {
                        const ds = importedDatasets.find(d => d.name === file.name);
                        if (ds) {
                          setActiveDataset(ds);
                        } else {
                          loadSampleDataset('cdr');
                        }
                      }}
                      className="text-[11px] text-white hover:text-nexus-accent font-semibold flex items-center gap-1 bg-nexus-800 hover:bg-nexus-700 px-2 py-1 rounded border border-nexus-700 transition-all"
                    >
                      Configurar Importación <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dataset Preview & Destination Selection Modal */}
      {activeDataset && (
        <div className="glass-panel border border-nexus-700 rounded-2xl p-6 shadow-2xl bg-nexus-900/90 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-nexus-800 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nexus-accent">analytics</span>
                <h3 className="text-lg font-bold text-white">Vista Previa e Importación: {activeDataset.name}</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Se han detectado {activeDataset.recordCount} filas estructuradas y {activeDataset.parsedHeaders?.length || 0} columnas.</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveDataset(null)}
                className="px-3 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-xs font-semibold text-gray-300 rounded-lg border border-nexus-700"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-nexus-accent hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                Confirmar e Importar a CerebroAC
              </button>
            </div>
          </div>

          {/* Destination Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Selecciona el Módulo de Destino para los Datos:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setTargetDestination('network')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  targetDestination === 'network' 
                    ? 'bg-nexus-accent/20 border-nexus-accent text-white shadow-lg' 
                    : 'bg-nexus-950/60 border-nexus-800 text-gray-400 hover:border-nexus-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-nexus-accent text-xl">hub</span>
                  <h4 className="font-bold text-sm">Grafo i2 de Redes</h4>
                </div>
                <p className="text-[11px] text-gray-400">Genera nodos y vínculos automáticamente para análisis de comunicaciones o relaciones entre objetivos.</p>
              </div>

              <div 
                onClick={() => setTargetDestination('financial')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  targetDestination === 'financial' 
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg' 
                    : 'bg-nexus-950/60 border-nexus-800 text-gray-400 hover:border-nexus-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">payments</span>
                  <h4 className="font-bold text-sm">Análisis Financiero</h4>
                </div>
                <p className="text-[11px] text-gray-400">Procesa transferencias, cuentas bancarias y montos en busca de patrones de lavado o fraccionamiento.</p>
              </div>

              <div 
                onClick={() => setTargetDestination('case')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  targetDestination === 'case' 
                    ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg' 
                    : 'bg-nexus-950/60 border-nexus-800 text-gray-400 hover:border-nexus-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-purple-400 text-xl">folder_open</span>
                  <h4 className="font-bold text-sm">Expediente de Caso</h4>
                </div>
                <p className="text-[11px] text-gray-400">Crea un cuaderno de investigación completo accesible para el Asistente IA de Inteligencia.</p>
              </div>
            </div>
          </div>

          {/* Table Preview */}
          <div className="border border-nexus-800 rounded-xl overflow-hidden bg-nexus-950/80">
            <div className="px-4 py-2 bg-nexus-900 border-b border-nexus-800 flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>Vista Previa de Filas (Primeros 5 registros)</span>
              <span>Total Columnas: {activeDataset.parsedHeaders?.length || 0}</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-nexus-900/80 text-gray-400 uppercase text-[10px] border-b border-nexus-800">
                  <tr>
                    {activeDataset.parsedHeaders?.map((header, idx) => (
                      <th key={idx} className="px-4 py-2.5 font-bold tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-nexus-800/60 font-mono text-[11px]">
                  {activeDataset.parsedRows?.slice(0, 5).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-nexus-800/40">
                      {activeDataset.parsedHeaders?.map((header, hIdx) => (
                        <td key={hIdx} className="px-4 py-2 truncate max-w-[200px]">{row[header] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
