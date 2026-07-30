
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
    label: 'Tablero de Control',
    icon: 'dashboard',
    view: 'dashboard'
  },
  {
    id: 'cases',
    label: 'Gestión de Causas',
    icon: 'folder_open',
    subItems: [
      { id: 'case-manager', label: 'Legajos de Investigación', icon: 'topic', view: 'case-manager' },
      { id: 'case-ingest', label: 'Ingreso de Evidencia (IA)', icon: 'upload_file', view: 'case-ingest' },
    ]
  },
  {
    id: 'analysis',
    label: 'Análisis Avanzado',
    icon: 'manage_search',
    subItems: [
      { id: 'timeline', label: 'Cronología del Suceso', icon: 'timeline', view: 'timeline' },
      { id: 'intel-network', label: 'Análisis de Vínculos', icon: 'hub', view: 'intel-network' },
      { id: 'financial', label: 'Análisis Económico y Forense', icon: 'account_balance', view: 'financial' },
      { id: 'intel-identity', label: 'Resolución de Identidad', icon: 'face_retouching_natural', view: 'intel-identity' },
      { id: 'workbooks', label: 'Cuaderno de la Causa', icon: 'auto_stories', view: 'workbooks' },
    ]
  },
  {
    id: 'ops',
    label: 'Operativos de Campo',
    icon: 'military_tech',
    subItems: [
      { id: 'ops-map', label: 'Mapa Táctico (GIS)', icon: 'map', view: 'map' },
      { id: 'ops-mobile', label: 'App Agente de Campo', icon: 'smartphone', view: 'ops-mobile' },
      { id: 'ops-active', label: 'Despliegues en Curso', icon: 'radar', view: 'ops-active' },
    ]
  },
  {
    id: 'intelligence',
    label: 'Inteligencia & OSINT',
    icon: 'psychology',
    subItems: [
      { id: 'intel-db', label: 'Prontuarios y Blancos', icon: 'folder_shared', view: 'intel-db' },
      { id: 'intel-osint', label: 'Monitoreo de Redes (OSINT)', icon: 'public', view: 'intel-osint' },
    ]
  },
  {
    id: 'strategy',
    label: 'Estrategia & Reportes',
    icon: 'local_police',
    subItems: [
      { id: 'strat-exec', label: 'Focos y Operativos', icon: 'compare_arrows', view: 'strat-exec' },
      { id: 'strat-perf', label: 'Desempeño Crítico', icon: 'gavel', view: 'strat-perf' },
      { id: 'strat-reports', label: 'Generador de Informes (IA)', icon: 'present_to_all', view: 'strat-reports' },
      { id: 'automation', label: 'Automatización y Alertas', icon: 'auto_mode', view: 'automation' },
    ]
  },
  {
    id: 'system',
    label: 'Sistema',
    icon: 'settings',
    subItems: [
      { id: 'sys-config', label: 'Configuración General', icon: 'tune', view: 'sys-config' },
      { id: 'sys-audit', label: 'Registros de Auditoría', icon: 'receipt_long', view: 'sys-audit' },
    ]
  }
];

export const KPI_STATS: StatCard[] = [
  { label: 'Amenazas Activas', value: '12', change: '+2', positive: false, icon: 'warning' },
  { label: 'Unidades Desplegadas', value: '48', change: '0', positive: true, icon: 'near_me' },
  { label: 'Casos Resueltos', value: '894', change: '+15%', positive: true, icon: 'task_alt' },
  { label: 'Interceptaciones', value: '1.2TB', change: '+200GB', positive: true, icon: 'cloud_download' }
];

export const RECENT_ALERTS: Alert[] = [
  { id: 'a1', severity: 'critical', title: 'Movimiento en Sector 7', location: 'Rosario, Zona Sur', time: '00:02:15', status: 'new' },
  { id: 'a2', severity: 'high', title: 'Coincidencia Facial', location: 'Terminal de Ómnibus SF', time: '00:15:30', status: 'investigating' },
  { id: 'a3', severity: 'medium', title: 'Transacción Sospechosa', location: 'Banco Macro Centro', time: '01:20:00', status: 'new' },
  { id: 'a4', severity: 'low', title: 'Fallo de Sensor', location: 'Perímetro Oeste', time: '04:10:00', status: 'resolved' },
];

export const SUSPECTS: Suspect[] = [
  {
    id: 's1',
    codeName: 'CHAVO',
    realName: 'GONZALEZ IGNACIO LEONEL',
    dni: '42332598',
    cuit: '20-42332598-5',
    dob: '22/10/1994',
    riskLevel: 98,
    recidivismRisk: 'imminent',
    status: 'Wanted',
    lastSeen: 'Barrio Fonavi San Jeronimo',
    image: 'https://i.pravatar.cc/150?u=chavo123',
    affiliations: ['Banda de los Fonavi', 'Colón La Negrada'],
    socialNetworkCentrality: 'hub',
    behavioralProfile: {
      impulsivity: 85,
      sociability: 40,
      narcissism: 90,
      violentTendency: 95,
      predominantMO: ['Violencia Extrema', 'Uso de Armas de Fuego', 'Venganza']
    },
    addresses: [
      { street: 'MANZANA 11 ESCALERA 11 SN 3 65', city: 'LA CAPITAL', province: 'SANTA FE', source: 'SUDAMERICADATA' },
      { street: 'Mzn 11 - Esc 11 - Dpto S/N', city: 'SANTA FE', province: 'SANTA FE', source: 'DaJuDeCo' }
    ],
    phones: [
      { number: '3425199227', source: 'SUDAMERICADATA' }
    ],
    family: [
      { name: 'GONZALEZ ADRIANA ELISABET', dni: '22901876', relation: 'MADRE', address: 'MANZANA 11 ESCALERA 11 SN 3 65 BARRIO FONAVI SAN JERONIMO' },
      { name: 'GONZALEZ RUTH', dni: '40625965', relation: 'HERMANA', address: 'MANZANA 11 ESCALERA 11 SN 3 65 BARRIO FONAVI SAN JERONIMO' }
    ],
    socialMedia: [
      { platform: 'Facebook', id: '115753691811867', link: 'https://www.facebook.com/colon.sabalero.9' }
    ],
    judicialRecords: [
      { cuij: '21-06931130-7', date: '06/07/2018', charge: 'AMENAZAS COACCION CALIFICADA POR USO DE ARMAS', victims: ['GOMEZ ALBERTO OMAR'], coDefendants: ['CARRERA OSCAR EDUARDO'], severity: 4, modusOperandi: 'Coacción Armada' },
      { cuij: '21-06306159-7', date: '26/08/2015', charge: 'DAÑOS', victims: ['MARTINEZ MARIANO ALBERTO', 'VELAZQUEZ CLAUDIO ANDRES'], coDefendants: ['CARRERA OSCAR EDUARDO', 'CASCO DIOSNEL DAVID', 'CASCO MATIAS EMANUEL'], severity: 2 }
    ],
    socialSecurity: [
      { entity: 'JERARQUICOS SALUD', type: 'TITULAR', status: 'ACTIVO' },
      { entity: 'MINISTERIO DE DESARROLLO SOCIAL', type: 'BENEFICIARIO', status: 'ACTIVO' }
    ],
    assets: []
  },
  {
    id: 's2',
    codeName: 'VIPER',
    realName: 'Viktor K.',
    riskLevel: 95,
    recidivismRisk: 'high',
    status: 'Wanted',
    lastSeen: 'Rosario, SF',
    image: 'https://i.pravatar.cc/150?u=viper',
    affiliations: ['Los Monos', 'Cartel del Norte'],
    socialNetworkCentrality: 'bridge',
    behavioralProfile: {
      impulsivity: 45,
      sociability: 80,
      narcissism: 70,
      violentTendency: 60,
      predominantMO: ['Logística Narco', 'Lavado de Activos']
    },
    addresses: [], judicialRecords: [], family: []
  },
  {
    id: 's3',
    codeName: 'GHOST',
    realName: 'Sarah L.',
    riskLevel: 82,
    recidivismRisk: 'moderate',
    status: 'Surveillance',
    lastSeen: 'Santa Fe Capital',
    image: 'https://i.pravatar.cc/150?u=ghost',
    affiliations: ['Cyber Cell 4'],
    socialNetworkCentrality: 'leaf',
    behavioralProfile: {
      impulsivity: 20,
      sociability: 10,
      violentTendency: 5,
      predominantMO: ['Cybercrimen', 'Infiltración']
    },
    addresses: [], judicialRecords: [], family: []
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p-pastorcito',
    title: 'PASTORCITO',
    type: 'Crimen Organizado',
    location: 'Santa Fe, Argentina',
    status: 'Active',
    lastUpdate: 'Ahora',
    members: ['u-001'],
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
    progress: 100,
    linkedWorkbookId: 'wb-pastorcito',
    entityCount: 5
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
    id: 'wb-pastorcito',
    title: 'PASTORCITO',
    caseId: 'p-pastorcito',
    sources: [
      { id: 'src-diaz', title: 'DIAZ ticket_468988.pdf', type: 'pdf', contentSummary: 'Comprobantes de transferencia judicial - Díaz', uploadDate: '30/7/2026', citations: 0, rawText: '' },
      { id: 'src-ortiz', title: 'ORTIZ ticket_468997.pdf', type: 'pdf', contentSummary: 'Comprobantes de transferencia judicial - Ortiz', uploadDate: '30/7/2026', citations: 0, rawText: '' },
      { id: 'src-tira', title: 'TIRA JUAN MANUEL.pdf', type: 'pdf', contentSummary: 'Llamados y mensajes de interés - Tira Juan Manuel', uploadDate: '30/7/2026', citations: 0, rawText: '' },
      { id: 'src-trejo1', title: 'TREJO ticket_46899.pdf', type: 'pdf', contentSummary: 'Comprobantes de transferencia judicial - Trejo', uploadDate: '30/7/2026', citations: 0, rawText: '' },
      { id: 'src-trejo2', title: 'TREJO ticket_46899_2.pdf', type: 'pdf', contentSummary: 'Comprobantes de transferencia judicial - Trejo 2', uploadDate: '30/7/2026', citations: 0, rawText: '' }
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
