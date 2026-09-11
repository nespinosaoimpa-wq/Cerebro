
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
    'cases': true,
    'analysis': true,
    'ops': true,
    'intelligence': true,
    'strategy': true,
    'system': true
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
            if (collapsed) {
              setCollapsed(false);
              setExpandedGroups(prev => ({ ...prev, [item.id]: true }));
              if (item.subItems && item.subItems.length > 0 && item.subItems[0].view) {
                setCurrentView(item.subItems[0].view);
              }
            } else if (hasSub) {
              toggleGroup(item.id);
              if (!isExpanded && item.subItems && item.subItems.length > 0 && item.subItems[0].view) {
                setCurrentView(item.subItems[0].view);
              }
            } else if (item.view) {
              setCurrentView(item.view);
            }
          }}
          className={`
            flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-150 rounded-md mx-2 group
            ${isActive 
              ? 'bg-blue-50 text-blue-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
            ${depth > 0 ? 'ml-6 text-sm py-1.5' : 'text-sm'}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className={`
              material-symbols-outlined transition-colors duration-150
              ${isActive ? 'filled-icon text-blue-600' : 'text-gray-400'} 
              ${depth > 0 ? 'text-[18px]' : 'text-[20px]'}
            `}>
              {item.icon}
            </span>
            {!collapsed && (
              <span className="truncate">
                {item.label}
              </span>
            )}
          </div>
          {!collapsed && hasSub && (
            <span className={`material-symbols-outlined text-[14px] text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          )}
        </div>
        
        {!collapsed && hasSub && isExpanded && (
          <ul className="mt-0.5 space-y-0.5">
            {item.subItems!.map(sub => (
              <MenuItemComponent key={sub.id} item={sub} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-200 z-30 shrink-0`}>
      
      {/* Sidebar Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2.5 font-semibold text-gray-800 tracking-tight cursor-default">
             <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[16px]">neurology</span>
             </div>
             <span>CerebroAC</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px]">{collapsed ? 'dock_to_right' : 'dock_to_left'}</span>
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3">
        {!collapsed && <div className="px-5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Menú Principal</div>}
        <ul>
          {MENU_ITEMS.map(item => <MenuItemComponent key={item.id} item={item} />)}
        </ul>
      </div>

      {/* Footer / Server Status */}
      <div className="p-3 border-t border-gray-200">
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''} text-gray-400`}>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {!collapsed && (
            <div className="min-w-0">
               <div className="text-xs font-medium text-gray-600">Sistema Operativo</div>
               <div className="text-[10px] text-gray-400">CerebroAC v5.0</div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
