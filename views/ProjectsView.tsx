import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newProject, setNewProject] = useState({ title: '', type: 'Microtráfico', location: 'Santa Fe' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: `p-${Date.now()}`,
      title: newProject.title,
      type: newProject.type as any,
      location: newProject.location,
      status: 'Active',
      lastUpdate: 'Ahora',
      members: ['u-001'],
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      progress: 0
    };
    setProjects([project, ...projects]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar relative">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Proyectos & Casos</h2>
          <p className="text-gray-400 text-sm">Gestión estratégica de investigaciones penales</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Nuevo Proyecto
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="glass-panel rounded-xl overflow-hidden group hover:border-nexus-accent/50 transition-all duration-300">
            {/* Image Cover */}
            <div className="h-40 relative bg-nexus-900 overflow-hidden">
               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${project.thumbnail})` }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-nexus-900 via-nexus-900/40 to-transparent"></div>
               <div className="absolute bottom-4 left-4">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                   project.type === 'Microtráfico' ? 'bg-purple-900/50 border-purple-500 text-purple-200' :
                   project.type === 'Homicidios' ? 'bg-red-900/50 border-red-500 text-red-200' :
                   'bg-blue-900/50 border-blue-500 text-blue-200'
                 }`}>
                   {project.type}
                 </span>
               </div>
               <div className="absolute top-4 right-4">
                 <button className="p-1.5 rounded-full bg-black/50 hover:bg-nexus-accent text-white backdrop-blur transition-colors">
                   <span className="material-symbols-outlined text-sm">more_vert</span>
                 </button>
               </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-1 truncate">{project.title}</h3>
              <div className="flex items-center text-gray-400 text-xs mb-4 gap-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {project.location}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progreso de Investigación</span>
                  <span className="text-nexus-accent font-bold">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-nexus-700 rounded-full overflow-hidden">
                  <div className="h-full bg-nexus-accent rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-nexus-700/50">
                <div className="flex -space-x-2">
                  {project.members.map((m, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-nexus-800 bg-nexus-700 flex items-center justify-center text-[8px] text-white">
                      {m.slice(0,1).toUpperCase()}
                    </div>
                  ))}
                  <button className="w-6 h-6 rounded-full border border-nexus-800 bg-nexus-800 flex items-center justify-center text-[10px] text-gray-400 hover:text-white hover:bg-nexus-700 transition-colors">
                    +
                  </button>
                </div>
                <span className="text-[10px] text-gray-500">{project.lastUpdate}</span>
              </div>
            </div>
            
            {/* Quick Actions overlay on hover */}
            <div className="px-5 pb-5 mt-[-10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
               <button className="flex-1 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-gray-200 text-xs rounded border border-nexus-600">Abrir Mapa</button>
               <button className="flex-1 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-gray-200 text-xs rounded border border-nexus-600">Agenda</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-xl p-6 border border-nexus-600 shadow-2xl animate-[pulse_0.2s_ease-out]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-nexus-accent">folder_open</span>
              Crear Nuevo Proyecto
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">TÍTULO DEL CASO / OPERACIÓN</label>
                <input 
                  type="text" 
                  className="w-full bg-nexus-800 border border-nexus-700 rounded-lg p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                  placeholder="Ej: Operación Pez Gordo"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">TIPO DE DELITO</label>
                  <select 
                    className="w-full bg-nexus-800 border border-nexus-700 rounded-lg p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                    value={newProject.type}
                    onChange={e => setNewProject({...newProject, type: e.target.value})}
                  >
                    <option value="Microtráfico">Microtráfico</option>
                    <option value="Homicidios">Homicidios</option>
                    <option value="Lavado de Activos">Lavado de Activos</option>
                    <option value="Crimen Organizado">Crimen Organizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">JURISDICCIÓN / ZONA</label>
                  <input 
                    type="text" 
                    className="w-full bg-nexus-800 border border-nexus-700 rounded-lg p-2.5 text-white focus:border-nexus-accent focus:outline-none"
                    placeholder="Ej: Santa Fe"
                    value={newProject.location}
                    onChange={e => setNewProject({...newProject, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-nexus-accent hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg"
                >
                  Inicializar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};