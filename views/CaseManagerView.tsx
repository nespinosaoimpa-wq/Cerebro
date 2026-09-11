import React, { useState } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { Project } from '../types';

export const CaseManagerView: React.FC = () => {
  const { navigate, addNotification, projects, addProject } = useGlobalState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newFolderName.trim()) return;

    const newProject: Project = {
        id: `p-${Date.now()}`,
        title: newFolderName,
        type: 'Microtráfico',
        location: 'Santa Fe Capital',
        status: 'Active',
        lastUpdate: 'Ahora',
        members: ['u-001'],
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
        progress: 0,
        entityCount: 0
    };

    addProject(newProject);
    setShowCreateModal(false);
    setNewFolderName('');
    addNotification('success', `Causa "${newFolderName}" creada correctamente.`);
    
    navigate('workbooks', { projectId: newProject.id, projectTitle: newProject.title });
  };

  const filteredProjects = projects.filter(p => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Microtráfico') return p.type === 'Microtráfico';
    if (selectedFilter === 'Crimen Organizado') return p.type === 'Crimen Organizado';
    if (selectedFilter === 'Homicidios') return p.type === 'Homicidios';
    if (selectedFilter === 'Lavado de Activos') return p.type === 'Lavado de Activos';
    return true;
  });

  return (
    <div className="px-8 py-6 h-full w-full overflow-y-auto custom-scrollbar bg-gray-50 text-gray-800">
       <div className="mb-8 flex justify-between items-end">
          <div>
             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600 text-3xl">folder_open</span>
                Causas Judiciales y Legajos Penales
             </h2>
             <p className="text-sm text-gray-500 mt-1">Gestión integral de expedientes del Ministerio Público de la Acusación (MPA) y causas de microtráfico.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors text-sm"
          >
             <span className="material-symbols-outlined text-base">create_new_folder</span>
             Nueva Causa Judicial
          </button>
       </div>

       {/* Filters */}
       <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['Todos', 'Microtráfico', 'Crimen Organizado', 'Homicidios', 'Lavado de Activos'].map((f) => (
             <button 
               key={f} 
               onClick={() => setSelectedFilter(f)}
               className={`px-4 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
                 selectedFilter === f 
                   ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                   : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
               }`}
             >
                {f}
             </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
             <div 
                key={project.id} 
                onClick={() => navigate('workbooks', { projectId: project.id, projectTitle: project.title })}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
             >
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <span className="material-symbols-outlined text-xl">folder_shared</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            {project.type}
                         </span>
                         <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            project.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                         }`}>
                            {project.status === 'Active' ? 'En Curso' : 'Archivado'}
                         </span>
                      </div>
                   </div>

                   <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {project.title}
                   </h3>
                   <p className="text-xs text-gray-500 mb-5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                      {project.location}
                   </p>

                   {/* Stats */}
                   <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Personas Vinculadas</div>
                         <div className="text-lg font-bold text-gray-900 mt-0.5">{project.entityCount || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Avance Investigación</div>
                         <div className="text-lg font-bold text-blue-600 mt-0.5">{project.progress || 0}%</div>
                      </div>
                   </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                   <span>Actualizado: {project.lastUpdate}</span>
                   <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                      Ver Cuaderno
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                   </span>
                </div>
             </div>
          ))}
       </div>

       {/* Modal for creating a new case */}
       {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Crear Nuevo Legajo / Causa</h3>
                <p className="text-xs text-gray-500 mb-4">Ingresá el número de CUIJ o la denominación de la causa judicial.</p>
                <form onSubmit={handleCreateFolder}>
                   <input 
                     type="text" 
                     value={newFolderName} 
                     onChange={(e) => setNewFolderName(e.target.value)}
                     placeholder="Ej: CUIJ 21-09744817-2 | San Lorenzo"
                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 mb-4"
                     autoFocus
                   />
                   <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                         Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
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
