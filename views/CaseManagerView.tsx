
import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { Project } from '../types';

export const CaseManagerView: React.FC = () => {
  const { navigate, addNotification, projects, addProject } = useGlobalState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newFolderName.trim()) return;

    const newProject: Project = {
        id: `p-${Date.now()}`,
        title: newFolderName,
        type: 'Crimen Organizado', // Default generic type
        location: 'Sin Asignar',
        status: 'Active',
        lastUpdate: 'Ahora',
        members: ['u-001'],
        thumbnail: 'https://images.unsplash.com/photo-1625603736183-5a022421d0a5?q=80&w=2000&auto=format&fit=crop', // Generic tactical background
        progress: 0,
        entityCount: 0
    };

    addProject(newProject);
    setShowCreateModal(false);
    setNewFolderName('');
    addNotification('success', `Carpeta "${newFolderName}" creada correctamente.`);
    
    // Immediately navigate to the workbook for this new folder
    navigate('workbooks', { projectId: newProject.id, projectTitle: newProject.title });
  };

  return (
    <div className="px-8 py-6 h-full w-full overflow-y-auto custom-scrollbar bg-grid relative">
       <div className="mb-8 flex justify-between items-end">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-nexus-accent text-3xl">topic</span>
                Legajos de Investigación
             </h2>
             <p className="text-sm text-gray-400 mt-1">Gestión unificada de legajos judiciales y causas penales en curso.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded font-bold shadow-lg flex items-center gap-2 transition-colors"
          >
             <span className="material-symbols-outlined">create_new_folder</span>
             Nuevo Legajo
          </button>
       </div>

       {/* Filters */}
       <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['Todos', 'Prioridad Alta', 'Homicidios', 'Narcomenudeo', 'Archivados'].map((f, i) => (
             <button key={i} className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-nexus-800 border-nexus-600 text-white' : 'bg-transparent border-nexus-800 text-gray-500 hover:border-nexus-600 hover:text-gray-300'}`}>
                {f}
             </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {projects.map(project => (
             <div 
                key={project.id} 
                onClick={() => navigate('workbooks', { projectId: project.id, projectTitle: project.title })}
                className="bg-nexus-900 border border-nexus-700 rounded-xl overflow-hidden hover:border-nexus-accent transition-all cursor-pointer group shadow-lg"
             >
                {/* Folder Top Tab Visual */}
                <div className="h-2 bg-nexus-800 border-b border-nexus-700 mx-4 rounded-t-lg mt-1 w-1/3 group-hover:bg-nexus-700 transition-colors"></div>
                
                <div className="p-5 pt-4 relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded bg-nexus-800 flex items-center justify-center text-gray-400 group-hover:text-nexus-accent transition-colors`}>
                         <span className="material-symbols-outlined text-xl">folder_shared</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                         project.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                         {project.status === 'Active' ? 'En Curso' : 'Archivado'}
                      </span>
                   </div>

                   <h3 className="text-lg font-bold text-white mb-1 group-hover:text-nexus-accent transition-colors truncate">{project.title}</h3>
                   <p className="text-xs text-gray-500 mb-4">{project.location}</p>

                   {/* Stats */}
                   <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-nexus-950/50 p-2 rounded border border-nexus-800">
                         <div className="text-[10px] text-gray-500 uppercase">Blancos</div>
                         <div className="text-sm font-bold text-white">{project.entityCount || 0}</div>
                      </div>
                      <div className="bg-nexus-950/50 p-2 rounded border border-nexus-800">
                         <div className="text-[10px] text-gray-500 uppercase">Pruebas</div>
                         <div className="text-sm font-bold text-white">0</div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-nexus-800">
                      <span>Actualizado: {project.lastUpdate}</span>
                      <div className="flex -space-x-1">
                         {project.members.map((m, i) => (
                            <div key={i} className="w-5 h-5 rounded-full bg-nexus-700 border border-nexus-800 flex items-center justify-center text-[8px] text-white">
                               {m.charAt(0)}
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>

       {/* Create Modal */}
       {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
             <div className="bg-nexus-900 border border-nexus-700 rounded-xl p-6 w-[400px] shadow-2xl animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-4">Nuevo Legajo de Causa</h3>
                <form onSubmit={handleCreateFolder}>
                   <div className="mb-4">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Carátula de la Causa / Operación</label>
                      <input 
                         type="text" 
                         autoFocus
                         value={newFolderName}
                         onChange={(e) => setNewFolderName(e.target.value)}
                         className="w-full bg-nexus-800 border border-nexus-700 rounded p-2 text-white focus:border-nexus-accent focus:outline-none"
                         placeholder="Ej: Causa N° 4582/26 - Los Monos..."
                      />
                   </div>
                   <div className="flex justify-end gap-3">
                      <button 
                         type="button" 
                         onClick={() => setShowCreateModal(false)}
                         className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                      >
                         Cancelar
                      </button>
                      <button 
                         type="submit"
                         disabled={!newFolderName.trim()}
                         className="px-4 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded font-bold text-sm shadow-lg disabled:opacity-50"
                      >
                         Crear y Abrir
                      </button>
                   </div>
                </form>
             </div>
          </div>
       )}
    </div>
  );
};
