
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, AppSettings, Project, Workbook, Suspect } from '../types';
import { CURRENT_USER as MOCK_USER, MOCK_PROJECTS, MOCK_WORKBOOKS, SUSPECTS } from '../constants';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface GlobalStateContextType {
  secureMode: boolean;
  toggleSecureMode: () => void;
  currentView: string;
  navigate: (view: string, params?: any) => void;
  navigationParams: any;
  
  // User Management
  currentUser: User | null;
  login: (method: 'credentials' | 'google', data?: any) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  
  // Projects Management
  projects: Project[];
  addProject: (project: Project) => void;

  // Suspects Management
  suspects: Suspect[];
  addSuspect: (suspect: Suspect) => void;

  // Workbooks Management (Persistent)
  workbooks: Workbook[];
  addWorkbook: (workbook: Workbook) => void;
  updateWorkbook: (id: string, updates: Partial<Workbook>) => void;
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Notifications
  notifications: Notification[]; 
  notificationHistory: Notification[]; 
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  markAllRead: () => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [secureMode, setSecureMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USER);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  
  // Projects State (Persistent in local storage)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('cerebro_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default MOCK_PROJECTS
      }
    }
    return MOCK_PROJECTS;
  });

  // Workbooks State (Persistent in local storage)
  const [workbooks, setWorkbooks] = useState<Workbook[]>(() => {
    const saved = localStorage.getItem('cerebro_workbooks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default MOCK_WORKBOOKS
      }
    }
    return MOCK_WORKBOOKS;
  });

  useEffect(() => {
    localStorage.setItem('cerebro_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('cerebro_workbooks', JSON.stringify(workbooks));
  }, [workbooks]);

  // Suspects State (Persistent in local storage)
  const [suspects, setSuspects] = useState<Suspect[]>(() => {
    const saved = localStorage.getItem('cerebro_suspects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default SUSPECTS
      }
    }
    return SUSPECTS;
  });

  useEffect(() => {
    localStorage.setItem('cerebro_suspects', JSON.stringify(suspects));
  }, [suspects]);

  const getInitialSettings = (): AppSettings => {
    const saved = localStorage.getItem('cerebro_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      theme: 'dark',
      language: 'es',
      accentColor: '#2563eb', 
      mapIcons: 'standard',
      geminiApiKey: ''
    };
  };

  const [settings, setSettings] = useState<AppSettings>(getInitialSettings());

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);

  const toggleSecureMode = () => setSecureMode(prev => !prev);

  const navigate = useCallback((view: string, params?: any) => {
    setNavigationParams(params || null);
    setCurrentView(view);
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [project, ...prev]);
  }, []);

  const addSuspect = useCallback((suspect: Suspect) => {
    setSuspects(prev => [suspect, ...prev]);
  }, []);

  const addWorkbook = useCallback((workbook: Workbook) => {
    setWorkbooks(prev => [workbook, ...prev]);
  }, []);

  const updateWorkbook = useCallback((id: string, updates: Partial<Workbook>) => {
    setWorkbooks(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  // User Logic
  const login = useCallback((method: 'credentials' | 'google', data?: any) => {
    if (method === 'google') {
      const googleUser: User = {
        id: 'u-google-123',
        name: 'Usuario Google',
        email: 'usuario@gmail.com',
        rank: 'Enlace Externo',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        status: 'online'
      };
      setCurrentUser(googleUser);
    } else {
      setCurrentUser(MOCK_USER);
    }
    setCurrentView('dashboard');
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('login');
  }, []);

  const updateUserProfile = useCallback((data: Partial<User>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    addNotification('success', 'Perfil actualizado correctamente.');
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
    addNotification('success', 'Configuración inicial completada. Bienvenido a CerebroAC.');
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('cerebro_settings', JSON.stringify(updated));
      
      // Apply Theme Immediately
      if (newSettings.theme) {
        document.documentElement.classList.remove('dark', 'light', 'tactical');
        document.documentElement.classList.add(newSettings.theme);
      }
      
      if (newSettings.accentColor) {
        document.documentElement.style.setProperty('--color-accent', newSettings.accentColor);
      }

      return updated;
    });
  }, []);

  // Apply default theme on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light', 'tactical');
    document.documentElement.classList.add(settings.theme);
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--color-accent', settings.accentColor);
    }
  }, [settings.theme, settings.accentColor]);

  // Notification Logic
  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    const newNotif: Notification = { 
      id, 
      type, 
      message, 
      timestamp: new Date(), 
      read: false 
    };

    setNotifications(prev => [...prev, newNotif]);
    setNotificationHistory(prev => [newNotif, ...prev]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotificationHistory(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <GlobalStateContext.Provider value={{ 
      secureMode, 
      toggleSecureMode, 
      currentView, 
      navigate,
      navigationParams,
      currentUser,
      login,
      logout,
      updateUserProfile,
      projects,
      addProject,
      suspects,
      addSuspect,
      workbooks,
      addWorkbook,
      updateWorkbook,
      hasCompletedOnboarding,
      completeOnboarding,
      settings,
      updateSettings,
      notifications,
      notificationHistory,
      addNotification,
      removeNotification,
      markAllRead
    }}>
      <div className={secureMode ? 'secure-mode-active' : ''}>
        {children}
      </div>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useGlobalState must be used within a GlobalProvider');
  return context;
};
