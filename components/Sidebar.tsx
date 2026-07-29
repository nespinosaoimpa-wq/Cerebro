
import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'ops': true, 'intel': true, 'system': false
  });

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const MenuItemComponent: React.FC<{ item: MenuItem, depth?: number }> = ({ item, depth = 0 }) => {
    const isActive = item.view === currentView;
    const hasSub = !!item.subItems;
    const isExpanded = expandedGroups[item.id];
    
    return (
      <li className="mb-0.5">
        <div 
          onClick={() => {
            if (hasSub) toggleGroup(item.id);
            else if (item.view) setCurrentView(item.view);
          }}
          className={`
            flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-200 rounded-md mx-2 group
            ${isActive 
              ? 'bg-nexus-800 text-white font-medium shadow-sm' 
              : 'text-gray-400 hover:bg-nexus-800/50 hover:text-gray-200'}
            ${depth > 0 ? 'ml-6 text-sm py-1.5' : 'text-sm'}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className={`
              material-symbols-outlined transition-transform duration-300 ease-out group-hover:scale-110
              ${isActive ? 'filled-icon text-nexus-accent scale-105' : ''} 
              ${depth > 0 ? 'text-[18px]' : 'text-[20px]'}
            `}>
              {item.icon}
            </span>
            {!collapsed && (
              <span className={`truncate transition-transform duration-300 origin-left ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                {item.label}
              </span>
            )}
          </div>
          {!collapsed && hasSub && (
            <span className={`material-symbols-outlined text-[14px] text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>
              expand_more
            </span>
          )}
        </div>
        
        {!collapsed && hasSub && isExpanded && (
          <ul className="mt-1 space-y-0.5 animate-slide-in">
            {item.subItems!.map(sub => (
              <MenuItemComponent key={sub.id} item={sub} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-nexus-950 border-r border-nexus-800 flex flex-col transition-all duration-300 z-30 shrink-0`}>
      
      {/* Sidebar Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-nexus-800">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-gray-200 tracking-tight group cursor-default">
             <div className="w-6 h-6 bg-nexus-accent rounded flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                <span className="material-symbols-outlined text-white text-[16px]">neurology</span>
             </div>
             <span className="transition-colors duration-300 group-hover:text-white">CerebroAC</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-md hover:bg-nexus-800 text-gray-500 transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px] transition-transform duration-300 hover:scale-110">{collapsed ? 'dock_to_right' : 'dock_to_left'}</span>
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        {!collapsed && <div className="px-5 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Espacio de Trabajo</div>}
        <ul>
          {MENU_ITEMS.map(item => <MenuItemComponent key={item.id} item={item} />)}
        </ul>
      </div>

      {/* Footer / Server Status */}
      <div className="p-4 border-t border-nexus-800 bg-nexus-900/30">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''} text-gray-500`}>
          <span className="material-symbols-outlined text-[16px]">cloud_done</span>
          {!collapsed && (
            <div className="min-w-0">
               <div className="text-xs font-medium text-white truncate">Servidor Conectado</div>
               <div className="text-[10px]">CerebroAC v5.0</div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
