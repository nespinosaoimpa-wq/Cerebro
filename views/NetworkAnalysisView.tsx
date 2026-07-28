import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';

interface NodeData {
  id: string;
  name: string;
  type: 'suspect' | 'phone' | 'account' | 'gang' | 'location';
  role?: string;
  risk?: number;
  image?: string;
  details?: string;
  x: number;
  y: number;
}

export const NetworkAnalysisView: React.FC = () => {
  const { navigate, addNotification } = useGlobalState();
  const [layout, setLayout] = useState<'organic' | 'hierarchy'>('organic');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const nodes: NodeData[] = [
    { id: 'n1', name: 'GONZALEZ IGNACIO (CHAVO)', type: 'suspect', role: 'Líder Operativo', risk: 98, image: 'https://i.pravatar.cc/150?u=chavo123', details: 'Vinculado a 14 causas judiciales y narcotráfico.', x: 50, y: 35 },
    { id: 'n2', name: 'Viktor K. (VIPER)', type: 'suspect', role: 'Logística Narco', risk: 95, image: 'https://i.pravatar.cc/150?u=viper', details: 'Coordinador de transferencias cripto y triangulación.', x: 30, y: 65 },
    { id: 'n3', name: 'Sarah L. (GHOST)', type: 'suspect', role: 'Ciber-Infiltración', risk: 82, image: 'https://i.pravatar.cc/150?u=ghost', details: 'Encargada de cifrado y comunicaciones seguras.', x: 70, y: 65 },
    { id: 'n4', name: 'Línea GSM 3425199227', type: 'phone', role: 'Interceptor #224', details: '142 llamadas registradas con celda San Jerónimo.', x: 45, y: 75 },
    { id: 'n5', name: 'AGROLOGISTICA DEL LITORAL', type: 'account', role: 'Empresa Pantalla', details: 'Empresa investigada por lavado de activos.', x: 20, y: 35 }
  ];

  return (
    <div className="h-full flex flex-col bg-nexus-950 text-gray-100 overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-nexus-800 bg-nexus-900/60 backdrop-blur flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nexus-accent">hub</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Análisis de Vínculos & Grafos</h1>
            <span className="px-2 py-0.5 text-xs bg-nexus-accent/20 border border-nexus-accent/40 text-nexus-accent rounded-full font-medium">
              Analyst i2 Engine
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Matriz de interconexión entre sospechosos, líneas GSM, empresas pantalla y nodos de comando.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout('organic')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              layout === 'organic' ? 'bg-nexus-accent text-white shadow' : 'bg-nexus-900 border border-nexus-800 text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bubble_chart</span>
            Disposición Orgánica
          </button>

          <button
            onClick={() => setLayout('hierarchy')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              layout === 'hierarchy' ? 'bg-nexus-accent text-white shadow' : 'bg-nexus-900 border border-nexus-800 text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            Jerarquía Criminal
          </button>
        </div>
      </div>

      {/* Main Canvas & Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Interactive SVG Canvas Area */}
        <div className="flex-1 relative bg-nexus-950 overflow-hidden">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="50%" y1="35%" x2="30%" y2="65%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" opacity="0.7" />
            <line x1="50%" y1="35%" x2="70%" y2="65%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" opacity="0.7" />
            <line x1="50%" y1="35%" x2="45%" y2="75%" stroke="#ef4444" strokeWidth="2.5" opacity="0.9" />
            <line x1="30%" y1="65%" x2="20%" y2="35%" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-500"
              style={{
                left: `${node.x}%`,
                top: layout === 'hierarchy' ? (node.type === 'suspect' ? '25%' : '65%') : `${node.y}%`
              }}
            >
              <div className={`p-1.5 rounded-full border-2 transition-transform duration-300 group-hover:scale-110 shadow-lg ${
                node.type === 'suspect' ? 'border-red-500 bg-nexus-900' :
                node.type === 'phone' ? 'border-blue-500 bg-nexus-900' :
                'border-amber-500 bg-nexus-900'
              }`}>
                {node.image ? (
                  <img src={node.image} alt={node.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-300 bg-nexus-800">
                    <span className="material-symbols-outlined text-[20px]">
                      {node.type === 'phone' ? 'call' : 'account_balance'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 text-center">
                <span className="px-2 py-0.5 rounded bg-nexus-900/90 border border-nexus-800 text-[11px] font-bold text-white shadow block">
                  {node.name}
                </span>
                {node.role && <span className="text-[10px] text-nexus-accent font-medium">{node.role}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Node Detail Side Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-nexus-800 bg-nexus-900/80 backdrop-blur p-5 space-y-4 shadow-xl z-20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-nexus-accent">Detalle de Nodo</span>
                <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {selectedNode.image ? (
                  <img src={selectedNode.image} alt={selectedNode.name} className="w-14 h-14 rounded-lg object-cover border border-nexus-700" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-nexus-800 border border-nexus-700 flex items-center justify-center text-nexus-accent">
                    <span className="material-symbols-outlined text-[24px]">hub</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedNode.name}</h3>
                  <p className="text-xs text-nexus-accent font-medium">{selectedNode.role}</p>
                </div>
              </div>

              <div className="bg-nexus-950 p-3 rounded border border-nexus-800 space-y-2 text-xs">
                <div className="text-gray-400">Descripción & Vínculos:</div>
                <p className="text-gray-200 leading-relaxed">{selectedNode.details}</p>
              </div>
            </div>

            <button
              onClick={() => {
                addNotification('info', `Abriendo expediente para ${selectedNode.name}`);
                navigate('intel-db');
              }}
              className="w-full py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded text-xs font-bold transition-colors shadow"
            >
              Ver Dossier Completo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
