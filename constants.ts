import { MenuItem, StatCard, Alert, Suspect, User, CalendarEvent, Project, Workflow, Integration, Workbook, IdentityMatch, OsintPost, ReportSlide, TimelineEvent, IngestionFile, PerformanceUnit, FinancialTransaction, BankAccount, ShellCompany } from './types';

export const CURRENT_USER: User = {
  id: 'u-001',
  name: 'nespinosa.oimpa@gmail.com',
  rank: 'Analista de Investigaciones',
  avatar: 'https://i.pravatar.cc/150?u=nespinosa.oimpa@gmail.com',
  status: 'online',
  email: 'nespinosa.oimpa@gmail.com'
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: 'dashboard',
    view: 'dashboard'
  },
  {
    id: 'cases',
    label: 'Casos y Legajos',
    icon: 'folder',
    subItems: [
      { id: 'case-manager', label: 'Causas Judiciales', icon: 'folder_open', view: 'case-manager' },
      { id: 'case-ingest', label: 'Cargar Archivos y Datos', icon: 'upload_file', view: 'case-ingest' },
      { id: 'workbooks', label: 'Cuaderno del Caso', icon: 'menu_book', view: 'workbooks' },
    ]
  },
  {
    id: 'analysis',
    label: 'Análisis e Investigación',
    icon: 'analytics',
    subItems: [
      { id: 'intel-network', label: 'Grafo de Relaciones', icon: 'hub', view: 'intel-network' },
      { id: 'financial', label: 'Análisis Financiero', icon: 'payments', view: 'financial' },
      { id: 'timeline', label: 'Línea de Tiempo', icon: 'timeline', view: 'timeline' },
      { id: 'intel-identity', label: 'Identificación de Personas', icon: 'person_search', view: 'intel-identity' },
    ]
  },
  {
    id: 'ops',
    label: 'Mapas y Territorio',
    icon: 'map',
    subItems: [
      { id: 'ops-map', label: 'Mapa Georreferenciado', icon: 'pin_drop', view: 'map' },
      { id: 'ops-active', label: 'Alertas en Territorio', icon: 'notifications', view: 'ops-active' },
      { id: 'ops-mobile', label: 'Asistente de Campo', icon: 'smartphone', view: 'ops-mobile' },
    ]
  },
  {
    id: 'intelligence',
    label: 'Personas e Inteligencia',
    icon: 'badge',
    subItems: [
      { id: 'intel-db', label: 'Prontuarios de Sospechosos', icon: 'person', view: 'intel-db' },
      { id: 'intel-osint', label: 'Monitoreo de Redes', icon: 'public', view: 'intel-osint' },
    ]
  },
  {
    id: 'strategy',
    label: 'Informes y Reportes',
    icon: 'description',
    subItems: [
      { id: 'strat-reports', label: 'Generar Informe Ejecutivo', icon: 'summarize', view: 'strat-reports' },
      { id: 'strat-exec', label: 'Resumen de Indicadores', icon: 'equalizer', view: 'strat-exec' },
      { id: 'automation', label: 'Reglas Automáticas', icon: 'settings_suggest', view: 'automation' },
    ]
  },
  {
    id: 'system',
    label: 'Configuración',
    icon: 'settings',
    subItems: [
      { id: 'sys-config', label: 'Ajustes', icon: 'tune', view: 'sys-config' },
      { id: 'sys-audit', label: 'Historial del Sistema', icon: 'history', view: 'sys-audit' },
    ]
  }
];

export const KPI_STATS: StatCard[] = [
  { label: 'Causas Activas', value: '12', change: '+2', positive: true, icon: 'folder' },
  { label: 'Puntos Georreferenciados', value: '8.9k', change: '+350', positive: true, icon: 'pin_drop' },
  { label: 'Personas Investigadas', value: '48', change: '+5', positive: true, icon: 'badge' },
  { label: 'Registros Procesados', value: '1.2TB', change: '+200GB', positive: true, icon: 'description' }
];

export const RECENT_ALERTS: Alert[] = [
  { id: 'a1', severity: 'critical', title: 'Actividad Sospechosa', location: 'Barrio Yapeyú, Santa Fe', time: '14:20', status: 'new' },
  { id: 'a2', severity: 'high', title: 'Movimiento de Fondos CUIJ 21-09744817-2', location: 'San Lorenzo', time: '15:10', status: 'investigating' },
  { id: 'a3', severity: 'medium', title: 'Ingreso de Información CUIJ 21-09745475-9', location: 'Cañada Rosquín', time: '16:05', status: 'new' }
];

export const SUSPECTS: Suspect[] = [
  {
    id: 's-zabala',
    codeName: 'EL PADRINO',
    realName: 'ZABALA JON NELSON',
    dni: '36.819.201',
    cuit: '20-36819201-4',
    dob: '14/05/1992',
    riskLevel: 98,
    recidivismRisk: 'imminent',
    status: 'Wanted',
    lastSeen: 'Barrio Yapeyú / San Lorenzo',
    image: 'https://i.pravatar.cc/150?u=zabala99',
    affiliations: ['Banda La Negrada', 'Clan Zabala'],
    socialNetworkCentrality: 'hub',
    behavioralProfile: {
      impulsivity: 90,
      sociability: 60,
      narcissism: 85,
      violentTendency: 95,
      predominantMO: ['Microtráfico', 'Coacción Armada', 'Distribución Interurbana']
    },
    addresses: [
      { street: 'Reinares y Neuquén s/n', city: 'SANTA FE', province: 'SANTA FE', source: 'MPA SANTA FE' },
      { street: 'Casona 2 - San Lorenzo', city: 'SAN LORENZO', province: 'SANTA FE', source: 'PDI' }
    ],
    phones: [{ number: '+5493425199227', source: 'Intercepción Judicial' }],
    judicialRecords: [
      { cuij: '21-09744817-2', date: '10/01/2026', charge: 'ORGANIZACION DE RED DE MICROTRAFICO Y PORTACION DE ARMAS', victims: ['Sociedad'], coDefendants: ['GIOVANNIELLO EMILCE', 'CARNAGHI LAUTARO'], severity: 5 }
    ]
  },
  {
    id: 's-leiva',
    codeName: 'VIEJO LEIVA',
    realName: 'LEIVA OSCAR ORLANDO',
    dni: '22.109.842',
    cuit: '20-22109842-3',
    dob: '03/09/1971',
    riskLevel: 92,
    recidivismRisk: 'high',
    status: 'Surveillance',
    lastSeen: 'Barrio Centenario / Varadero Sarsotti',
    image: 'https://i.pravatar.cc/150?u=leiva77',
    affiliations: ['Banda Los de Siempre', 'Barrio Centenario'],
    socialNetworkCentrality: 'hub',
    behavioralProfile: {
      impulsivity: 65,
      sociability: 85,
      narcissism: 70,
      violentTendency: 80,
      predominantMO: ['Liderazgo de Fila', 'Coordinación de Búnkeres', 'Usurpación']
    },
    addresses: [
      { street: 'Manzana 4 Fonavi Centenario', city: 'SANTA FE', province: 'SANTA FE', source: 'SUDAMERICADATA' }
    ],
    phones: [{ number: '+5493424192837', source: 'PDI' }],
    judicialRecords: [
      { cuij: '21-09696384-7', date: '15/08/2025', charge: 'ASOCIACION ILICITA Y AMENAZAS REITERADAS', victims: ['Vecinos B° Centenario'], coDefendants: ['CELER MATIAS', 'SIMON ELIDE'], severity: 4 }
    ]
  },
  {
    id: 's-maidana',
    codeName: 'POLACO',
    realName: 'MAIDANA SEBASTIAN',
    dni: '34.920.192',
    cuit: '20-34920192-8',
    dob: '19/11/1989',
    riskLevel: 88,
    recidivismRisk: 'high',
    status: 'Wanted',
    lastSeen: 'Barrio Candioti / Mayoraz',
    image: 'https://i.pravatar.cc/150?u=maidana',
    affiliations: ['Banda Polaco Maidana'],
    socialNetworkCentrality: 'bridge',
    behavioralProfile: {
      impulsivity: 70,
      sociability: 75,
      violentTendency: 75,
      predominantMO: ['Transporte en Vehículos', 'Ventas Punto a Punto', 'Lavado']
    },
    addresses: [
      { street: 'Castañaduy 6807', city: 'SANTA FE', province: 'SANTA FE', source: 'MPA' }
    ],
    assets: [
      { type: 'vehicle', description: 'Peugeot 206 Gris Dominio DYH-883', identifier: 'DYH-883' },
      { type: 'vehicle', description: 'Chevrolet Prisma Dominio AD-165-RV', identifier: 'AD-165-RV' }
    ],
    judicialRecords: [
      { cuij: '21-08338285-3', date: '04/05/2025', charge: 'ESTUPEFACIENTES CON FINES DE COMERCIALIZACION', victims: ['Estado Provincial'], coDefendants: ['MENDOZA SALVADOR ARIEL'], severity: 4 }
    ]
  },
  {
    id: 's-benitez',
    codeName: 'PUCHINGA',
    realName: 'BENITEZ ISAIAS',
    dni: '38.109.281',
    cuit: '20-38109281-2',
    dob: '28/02/1994',
    riskLevel: 94,
    recidivismRisk: 'imminent',
    status: 'Wanted',
    lastSeen: 'Barrio Yapeyú / Loyola Sur',
    image: 'https://i.pravatar.cc/150?u=puchinga',
    affiliations: ['Clan Puchingas'],
    socialNetworkCentrality: 'hub',
    behavioralProfile: {
      impulsivity: 95,
      sociability: 30,
      violentTendency: 98,
      predominantMO: ['Ataques a Balazos', 'Territorialidad Extrema', 'Extorsión']
    },
    addresses: [
      { street: 'Zazpe y Zavalla 1700', city: 'SANTA FE', province: 'SANTA FE', source: 'MPA' }
    ],
    judicialRecords: [
      { cuij: '21-09693542-8', date: '12/12/2025', charge: 'HOMICIDIO EN GRADO DE TENTATIVA Y RESISTENCIA', victims: ['Gomez Maria Belen'], coDefendants: [], severity: 5 }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p-san-lorenzo',
    title: 'CUIJ 21-09744817-2 | San Lorenzo - Clan Zabala',
    type: 'Crimen Organizado',
    location: 'San Lorenzo / Yapeyú, SF',
    status: 'Active',
    lastUpdate: 'Hace 5m',
    members: ['u-001'],
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
    progress: 85,
    linkedWorkbookId: 'wb-san-lorenzo',
    entityCount: 18
  },
  {
    id: 'p-rosquin',
    title: 'CUIJ 21-09745475-9 | Cañada Rosquín - Distribución',
    type: 'Microtráfico',
    location: 'Cañada Rosquín, SF',
    status: 'Active',
    lastUpdate: 'Hace 1h',
    members: ['u-001'],
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000&auto=format&fit=crop',
    progress: 70,
    linkedWorkbookId: 'wb-rosquin',
    entityCount: 12
  },
  {
    id: 'p-zazpe',
    title: 'CUIJ 21-09726972-3 | Zazpe y Zavalla - Clan Puchingas',
    type: 'Homicidios',
    location: 'Yapeyú / Loyola, SF',
    status: 'Active',
    lastUpdate: 'Hace 30m',
    members: ['u-001'],
    thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=1000&auto=format&fit=crop',
    progress: 90,
    linkedWorkbookId: 'wb-zazpe',
    entityCount: 15
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Google Sheets', provider: 'google', service: 'sheets', status: 'connected', lastSync: 'Ahora', icon: 'table_chart' },
  { id: 'i2', name: 'Google Drive', provider: 'google', service: 'drive', status: 'connected', lastSync: 'Ahora', icon: 'cloud_upload' },
  { id: 'i3', name: 'Google Maps', provider: 'google', service: 'maps', status: 'connected', lastSync: 'Ahora', icon: 'map' },
];

export const MOCK_WORKFLOWS: Workflow[] = [];

export const MOCK_WORKBOOKS: Workbook[] = [
  {
    id: 'wb-san-lorenzo',
    title: 'Cuaderno: CUIJ 21-09744817-2',
    caseId: 'p-san-lorenzo',
    sources: [
      { id: 'src-san-lorenzo', title: 'Ref info 060_26 San Lorenzo.docx', type: 'text', contentSummary: 'Investigación sobre clan Zabala y búnkeres Casona 2.', uploadDate: '11/09/2026', citations: 18, rawText: 'Documentación de inteligencia respecto a Zabala Jon Nelson (El Padrino)...' }
    ],
    notes: [],
    chatHistory: []
  }
];

export const MOCK_IDENTITY_MATCHES: IdentityMatch[] = [];
export const MOCK_OSINT_POSTS: OsintPost[] = [];
export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [];
export const MOCK_PERFORMANCE_UNITS: PerformanceUnit[] = [];
export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [];
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [];
export const MOCK_SHELL_COMPANIES: ShellCompany[] = [];
