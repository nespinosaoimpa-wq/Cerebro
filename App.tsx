
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './views/DashboardView';
import { IntelligenceView } from './views/IntelligenceView';
import { CalendarView } from './views/CalendarView';
import { LoginView } from './views/LoginView';
import { ProjectsView } from './views/ProjectsView';
import { TacticalMapView } from './views/TacticalMapView';
import { AutomationView } from './views/AutomationView';
import { ActiveMissionsView } from './views/ActiveMissionsView';
import { NetworkAnalysisView } from './views/NetworkAnalysisView';
import { SystemAuditView } from './views/SystemAuditView';
import { CaseWorkbookView } from './views/CaseWorkbookView';
import { ExecutiveOpsView } from './views/ExecutiveOpsView';
import { IdentityResolutionView } from './views/IdentityResolutionView';
import { OsintMonitorView } from './views/OsintMonitorView';
import { ReportGeneratorView } from './views/ReportGeneratorView';
import { TimelineAnalysisView } from './views/TimelineAnalysisView';
import { DataIngestionView } from './views/DataIngestionView';
import { MobileAgentView } from './views/MobileAgentView';
import { CaseManagerView } from './views/CaseManagerView';
import { UserProfileView } from './views/UserProfileView';
import { SettingsView } from './views/SettingsView';
import { PerformanceReportsView } from './views/PerformanceReportsView';
import { FinancialAnalysisView } from './views/FinancialAnalysisView';
import { AIAssistant } from './components/AIAssistant';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { GlobalProvider, useGlobalState } from './components/GlobalState';

const NotificationHUD: React.FC = () => {
  const { notifications, removeNotification } = useGlobalState();

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className={`pointer-events-auto min-w-[300px] p-4 rounded-lg shadow-lg border flex items-start gap-3 bg-white ${
            n.type === 'success' ? 'border-green-200 text-green-800' :
            n.type === 'error' ? 'border-red-200 text-red-800' :
            n.type === 'warning' ? 'border-orange-200 text-orange-800' :
            'border-blue-200 text-blue-800'
          }`}
        >
          <span className={`material-symbols-outlined text-sm mt-0.5 ${
            n.type === 'success' ? 'text-green-500' :
            n.type === 'error' ? 'text-red-500' :
            n.type === 'warning' ? 'text-orange-500' :
            'text-blue-500'
          }`}>
            {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : 'info'}
          </span>
          <div className="flex-1 text-sm font-medium">{n.message}</div>
          <button onClick={() => removeNotification(n.id)} className="hover:opacity-70 text-gray-400">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentView, navigate, currentUser, hasCompletedOnboarding } = useGlobalState();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'strat-exec': return <ExecutiveOpsView />;
      case 'strat-reports': return <ReportGeneratorView />;
      case 'strat-perf': return <PerformanceReportsView />;
      case 'projects': return <ProjectsView />;
      case 'workbooks': return <CaseWorkbookView />;
      case 'automation': return <AutomationView />;
      case 'intel-db': return <IntelligenceView />;
      case 'intel-identity': return <IdentityResolutionView />;
      case 'intel-osint': return <OsintMonitorView />;
      case 'intel-network': return <NetworkAnalysisView />;
      case 'financial': return <FinancialAnalysisView />;
      case 'map': return <TacticalMapView />;
      case 'calendar': return <CalendarView />;
      case 'ops-active': return <ActiveMissionsView />;
      case 'sys-audit': return <SystemAuditView />;
      case 'sys-config': return <SettingsView />;
      case 'timeline': return <TimelineAnalysisView />;
      case 'case-ingest': return <DataIngestionView />;
      case 'case-manager': return <CaseManagerView />;
      case 'ops-mobile': return <MobileAgentView />;
      case 'profile': return <UserProfileView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
            <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">construction</span>
            <h2 className="text-xl font-bold text-gray-600">Módulo en Desarrollo</h2>
            <p className="text-sm text-gray-400 mt-1">La vista "{currentView}" está siendo implementada.</p>
            <button 
              onClick={() => navigate('dashboard')}
              className="mt-4 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-700 shadow-sm transition-colors"
            >
              Volver al Panel Principal
            </button>
          </div>
        );
    }
  };

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen bg-nexus-950 text-gray-800 font-sans selection:bg-nexus-accent selection:text-white relative overflow-hidden">
      {!hasCompletedOnboarding && <OnboardingOverlay />}
      
      <Sidebar currentView={currentView} setCurrentView={navigate} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <TopBar />
        <main className="flex-1 relative overflow-hidden">
          {renderView()}
        </main>
      </div>
      
      <NotificationHUD />
      <AIAssistant />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
};

export default App;
