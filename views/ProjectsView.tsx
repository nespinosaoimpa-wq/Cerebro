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
    <div className="p-8 h-full overflow-y-auto custom-scrollbar relative bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-3xl">workspaces</span>
            Causas e Investigaciones Penales
          </h2>
          <p className="text-gray-500 text-sm">Gestión estratégica de expedientes del Ministerio Público de la Acusación</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Nueva Causa
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:border-blue-500 hover:shadow-md transition-all duration-300 shadow-sm flex flex-col justify-between">
            {/* Image Cover */}
            <div className="h-44 relative bg-gray-100 overflow-hidden">
               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${project.thumbnail})` }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
               <div className="absolute bottom-4 left-4">
                 <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide bg-white/90 text-gray-800 shadow-sm">
                   {project.type}
                 </span>
               </div>
               <div className="absolute top-4 right-4">
                 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-white shadow-sm">
                   {project.status === 'Active' ? 'Activo' : 'Archivado'}
                 </span>
               </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-gray-400">pin_drop</span>
                  {project.location}
                </p>
              </div>

              <div>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Avance</span>
                    <span className="font-semibold text-gray-700">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>Actualizado: {project.lastUpdate}</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:underline">
                    Detalles
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nueva Causa Judicial</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Número CUIJ / Título</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: CUIJ 21-09744817-2 | San Lorenzo"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Tipo</label>
                  <select 
                    value={newProject.type}
                    onChange={e => setNewProject({...newProject, type: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Microtráfico">Microtráfico</option>
                    <option value="Crimen Organizado">Crimen Organizado</option>
                    <option value="Homicidios">Homicidios</option>
                    <option value="Lavado de Activos">Lavado de Activos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Jurisdicción</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej: Santa Fe / San Lorenzo"
                    value={newProject.location}
                    onChange={e => setNewProject({...newProject, location: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
                  Crear Causa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};