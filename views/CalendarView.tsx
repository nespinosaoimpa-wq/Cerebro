
import React, { useState } from 'react';
import { INITIAL_CALENDAR_EVENTS } from '../constants';
import { CalendarEvent, CalendarEventType } from '../types';
import { useGlobalState } from '../components/GlobalState';

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Helper to determine event styles
const getEventStyle = (type: CalendarEventType) => {
  switch (type) {
    case 'report':
      return 'bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30';
    case 'sweep':
      return 'bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30';
    case 'processing':
      return 'bg-amber-500/20 border-amber-500/50 text-amber-200 hover:bg-amber-500/30';
    case 'briefing':
      return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30';
    default:
      return 'bg-gray-500/20 border-gray-500/50 text-gray-200';
  }
};

const getEventIcon = (type: CalendarEventType) => {
  switch (type) {
    case 'report': return 'description';
    case 'sweep': return 'radar';
    case 'processing': return 'memory';
    case 'briefing': return 'campaign';
    default: return 'event';
  }
};

export const CalendarView: React.FC = () => {
  const { addNotification } = useGlobalState();
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);

  // Simple calendar logic for demo (Assuming Month starts on Wednesday and has 30 days)
  const daysInMonth = 30;
  const startDayOffset = 2; // 0=Mon, 1=Tue, 2=Wed
  const totalSlots = 35; // 5 rows of 7

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEvent(eventId);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image or default
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    if (draggedEvent && day > 0) {
      setEvents(prev => prev.map(ev => 
        ev.id === draggedEvent ? { ...ev, date: day } : ev
      ));
    }
    setDraggedEvent(null);
  };

  const handleExportICS = () => {
    addNotification('info', 'Generando archivo de calendario (.ics)...');

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CerebroAC//NONSGML v1.0//EN\n";

    // Helper to format date to iCal string (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    events.forEach(event => {
      // Construct realistic dates based on the mock "NOVIEMBRE 2023" context
      // Assuming event.date is the day of the month
      const [hour, minute] = event.time.split(':').map(Number);
      
      // Create Start Date
      const startDate = new Date(2023, 10, event.date, hour, minute); // Month is 0-indexed (10 = Nov)
      
      // Create End Date (Default to 1 hour duration if not specified)
      const durationHours = event.duration ? parseInt(event.duration) : 1;
      const endDate = new Date(startDate.getTime() + (durationHours * 60 * 60 * 1000));

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${event.id}@cerebroac.internal\n`;
      icsContent += `DTSTAMP:${formatICSDate(new Date())}\n`;
      icsContent += `DTSTART:${formatICSDate(startDate)}\n`;
      icsContent += `DTEND:${formatICSDate(endDate)}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DESCRIPTION:Tipo: ${event.type} - Generado por CerebroAC\n`;
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    // Trigger Download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cronograma_operativo_cerebroac.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification('success', 'Calendario exportado exitosamente.');
  };

  const renderLegend = () => (
    <div className="flex gap-4 mb-6 p-3 bg-nexus-800/40 rounded-lg border border-nexus-700/50">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
        <span className="text-xs text-gray-300">Reportes</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
        <span className="text-xs text-gray-300">Barrido Redes</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
        <span className="text-xs text-gray-300">Procesamiento</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        <span className="text-xs text-gray-300">Briefings</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <span className="material-symbols-outlined text-nexus-accent text-3xl">calendar_month</span>
            Cronograma Operativo
          </h2>
          <p className="text-gray-400 text-sm">Gestión de tareas automáticas y briefings de inteligencia</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right mr-4">
              <p className="text-xs text-gray-500 font-mono">PERIODO ACTUAL</p>
              <p className="text-lg font-bold text-nexus-accent">NOVIEMBRE 2023</p>
           </div>
           
           <button 
             onClick={handleExportICS}
             className="px-4 py-2 bg-nexus-800 hover:bg-nexus-700 text-gray-300 border border-nexus-600 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
             title="Sincronizar con Google/Outlook"
           >
             <span className="material-symbols-outlined text-sm">ios_share</span>
             Exportar iCal
           </button>

           <div className="h-8 w-px bg-nexus-700 mx-2"></div>

           <button className="px-3 py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded-lg border border-nexus-600 transition-colors flex items-center">
             <span className="material-symbols-outlined text-sm">chevron_left</span>
           </button>
           <button className="px-3 py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded-lg border border-nexus-600 transition-colors flex items-center">
             <span className="material-symbols-outlined text-sm">chevron_right</span>
           </button>
           <button className="px-4 py-2 bg-nexus-accent hover:bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-900/20 font-medium flex items-center gap-2 ml-2">
             <span className="material-symbols-outlined">add</span>
             Agendar Tarea
           </button>
        </div>
      </div>

      {renderLegend()}

      {/* Calendar Grid Container */}
      <div className="flex-1 glass-panel rounded-xl border border-nexus-700 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-nexus-700 bg-nexus-800/50">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-nexus-900/30">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const dayNumber = index - startDayOffset + 1;
            const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
            const dayEvents = isValidDay ? events.filter(e => e.date === dayNumber) : [];
            const isToday = dayNumber === 15; // Simulated "Today"

            return (
              <div 
                key={index}
                className={`
                  border-r border-b border-nexus-700/30 relative p-2 transition-colors min-h-[100px]
                  ${isValidDay ? 'hover:bg-nexus-800/20' : 'bg-nexus-900/50 pattern-grid'}
                  ${!isValidDay ? 'pointer-events-none' : ''}
                `}
                onDragOver={isValidDay ? handleDragOver : undefined}
                onDrop={isValidDay ? (e) => handleDrop(e, dayNumber) : undefined}
              >
                {isValidDay && (
                  <>
                    <span className={`
                      text-xs font-mono mb-2 block w-6 h-6 flex items-center justify-center rounded-full
                      ${isToday ? 'bg-nexus-accent text-white shadow-lg shadow-nexus-accent/50' : 'text-gray-500'}
                    `}>
                      {dayNumber}
                    </span>
                    
                    <div className="space-y-1.5 overflow-y-auto max-h-[110px] custom-scrollbar">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, event.id)}
                          className={`
                            group cursor-grab active:cursor-grabbing px-2 py-1.5 rounded border text-[10px] font-medium flex flex-col gap-0.5 shadow-sm hover:shadow-md transition-all
                            ${getEventStyle(event.type)}
                            ${draggedEvent === event.id ? 'opacity-50' : 'opacity-100'}
                          `}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[12px]">{getEventIcon(event.type)}</span>
                            <span className="truncate">{event.time}</span>
                          </div>
                          <span className="truncate font-bold">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        .pattern-grid {
          background-image: radial-gradient(#1f2937 1px, transparent 1px);
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
};
