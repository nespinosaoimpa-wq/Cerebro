import React, { useState, useEffect, useRef } from 'react';

const INITIAL_LOGS = [
  { id: 1, time: '14:20:05', type: 'INFO', module: 'AUTH_SERVICE', message: 'Usuario u-001 (nespinosa.oimpa@gmail.com) inició sesión en el sistema.' },
  { id: 2, time: '14:21:12', type: 'WARN', module: 'MAP_RENDERER', message: 'Tile fetch latency > 200ms on server node-4.' },
  { id: 3, time: '14:25:00', type: 'SUCCESS', module: 'DATA_SYNC', message: 'Synchronization with Google Drive completed. 15 files processed.' },
  { id: 4, time: '14:28:45', type: 'INFO', module: 'AI_CORE', message: 'Context window updated with new suspect data.' },
  { id: 5, time: '14:30:10', type: 'ERROR', module: 'EXT_API', message: 'Connection timeout: Public Registry Database.' },
  { id: 6, time: '14:32:00', type: 'INFO', module: 'SOCKET_IO', message: 'Client connection established: Unit-Alpha.' },
];

export const SystemAuditView: React.FC = () => {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Log Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['INFO', 'INFO', 'INFO', 'WARN', 'SUCCESS'];
      const modules = ['NET_TRAFFIC', 'DB_SHARD_2', 'ENCRYPTION_LAYER', 'USER_ACTIVITY', 'AI_ANALYSIS'];
      const msgs = [
         'Packet verified: 128kb received.', 
         'Heartbeat signal acknowledged.', 
         'Refreshing auth token...', 
         'Optimizing index for query cache.',
         'Scanning external threat vectors.'
      ];
      
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('es-AR'),
        type: types[Math.floor(Math.random() * types.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: msgs[Math.floor(Math.random() * msgs.length)]
      };

      setLogs(prev => [...prev, newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
           <h2 className="text-2xl font-bold text-white mb-1">Auditoría del Sistema</h2>
           <p className="text-sm text-gray-400">Registros de actividad, seguridad y rendimiento del núcleo</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
             <p className="text-[10px] text-gray-500 font-bold uppercase">Uptime</p>
             <p className="text-xl font-mono text-nexus-success">99.98%</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] text-gray-500 font-bold uppercase">Memoria</p>
             <p className="text-xl font-mono text-nexus-accent">32GB / 64GB</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Status Cards */}
         <div className="glass-panel p-4 rounded-xl border border-nexus-700 bg-nexus-800/30">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Integridad de Base de Datos</h3>
            <div className="w-full bg-nexus-900 rounded-full h-2 mb-2">
               <div className="bg-nexus-success h-full rounded-full" style={{ width: '98%' }}></div>
            </div>
            <p className="text-xs text-right text-gray-400">Todo Sincronizado</p>
         </div>
         <div className="glass-panel p-4 rounded-xl border border-nexus-700 bg-nexus-800/30">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Carga de CPU (Núcleo AI)</h3>
            <div className="w-full bg-nexus-900 rounded-full h-2 mb-2">
               <div className="bg-nexus-warning h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-right text-gray-400">Carga Elevada</p>
         </div>
         <div className="glass-panel p-4 rounded-xl border border-nexus-700 bg-nexus-800/30">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Encriptación</h3>
            <div className="flex items-center gap-2 text-nexus-success">
               <span className="material-symbols-outlined text-lg">lock</span>
               <span className="text-sm font-mono">AES-256 BIT ACTIVO</span>
            </div>
         </div>
      </div>

      {/* Terminal / Logs */}
      <div className="flex-1 glass-panel rounded-xl border border-nexus-700 flex flex-col overflow-hidden bg-[#0a0a0a] shadow-2xl">
         <div className="px-4 py-2 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <span className="font-mono text-xs text-gray-400">root@cerebro-core:/var/log/syslog</span>
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
         </div>
         <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-xs space-y-1">
            {logs.map(log => (
               <div key={log.id} className="flex gap-4 hover:bg-white/5 p-0.5 rounded group">
                  <span className="text-gray-600 shrink-0 select-none">{log.time}</span>
                  <span className={`shrink-0 w-16 font-bold ${
                     log.type === 'INFO' ? 'text-blue-400' :
                     log.type === 'WARN' ? 'text-yellow-400' :
                     log.type === 'ERROR' ? 'text-red-500' : 'text-green-400'
                  }`}>[{log.type}]</span>
                  <span className="text-purple-400 shrink-0 w-32 group-hover:text-purple-300">{log.module}</span>
                  <span className="text-gray-400 group-hover:text-gray-200">{log.message}</span>
               </div>
            ))}
            <div className="animate-pulse text-nexus-accent mt-2">_</div>
         </div>
      </div>
    </div>
  );
};