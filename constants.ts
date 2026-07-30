
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

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Generación Reporte Diario', type: 'report', date: 2, time: '06:00', duration: '1h' },
  { id: 'e2', title: 'Barrido Redes Sociales (Latam)', type: 'sweep', date: 2, time: '14:00', duration: '4h' },
  { id: 'e3', title: 'Briefing Semanal: WhatsApp', type: 'briefing', date: 3, time: '09:00', duration: '1h' },
  { id: 'e4', title: 'Procesamiento Masivo de Datos', type: 'processing', date: 5, time: '02:00', duration: '6h' },
  { id: 'e12', title: 'Backup General del Sistema', type: 'processing', date: 28, time: '00:00', duration: '8h' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Operación "Hidrovía"',
    type: 'Microtráfico',
    location: 'Rosario, Santa Fe',
    status: 'Active',
    lastUpdate: 'Hace 2 horas',
    members: ['u-001', 'u-003', 'u-005'],
    thumbnail: 'https://images.unsplash.com/photo-1626015099718-d70395354519?q=80&w=2000&auto=format&fit=crop',
    progress: 65,
    linkedWorkbookId: 'wb-1',
    entityCount: 142
  },
  {
    id: 'p2',
    title: 'Red de Lavado "Delta"',
    type: 'Lavado de Activos',
    location: 'Santa Fe Capital',
    status: 'Active',
    lastUpdate: 'Hace 1 día',
    members: ['u-001', 'u-002'],
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop',
    progress: 30,
    entityCount: 45
  },
  {
    id: 'p3',
    title: 'Caso: Homicidio Triple',
    type: 'Homicidios',
    location: 'Villa Gobernador Gálvez',
    status: 'Pending',
    lastUpdate: 'Hace 3 días',
    members: ['u-004'],
    thumbnail: 'https://images.unsplash.com/photo-1596525737526-7248386f784d?q=80&w=2000&auto=format&fit=crop',
    progress: 10,
    entityCount: 12
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Google Sheets', provider: 'google', service: 'sheets', status: 'connected', lastSync: '1 min', icon: 'table_chart' },
  { id: 'i2', name: 'Google Drive', provider: 'google', service: 'drive', status: 'connected', lastSync: '5 min', icon: 'cloud_upload' },
  { id: 'i3', name: 'Google Maps', provider: 'google', service: 'maps', status: 'connected', lastSync: '10 min', icon: 'map' },
  { id: 'i4', name: 'WhatsApp Business', provider: 'meta', service: 'whatsapp', status: 'connected', lastSync: '1 min', icon: 'chat' },
  { id: 'i5', name: 'NEXUS Brain (IA)', provider: 'nexus', service: 'ai_parser', status: 'connected', lastSync: 'Ahora', icon: 'psychology' },
];

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'w1',
    name: 'Análisis Automático de PDF (Drive)',
    description: 'Escanea carpeta Drive, extrae datos con IA, georreferencia y notifica.',
    status: 'active',
    runCount: 42,
    lastRun: '12:45 PM',
    steps: [
      { id: 's1', type: 'trigger', service: 'drive', title: 'Nuevo Archivo Detectado', config: 'Carpeta: /Inteligencia/Entrantes', icon: 'cloud_upload' },
      { id: 's2', type: 'action', service: 'ai_parser', title: 'Extracción de Entidades (IA)', config: 'Extraer: Nombres, Ubicaciones, Fechas', icon: 'psychology' },
      { id: 's3', type: 'action', service: 'maps', title: 'Georreferenciación Automática', config: 'Capa: Puntos de Interés', icon: 'pin_drop' },
      { id: 's4', type: 'action', service: 'sheets', title: 'Registro en Base de Datos', config: 'Spreadsheet: Master_Intel_2024', icon: 'table_chart' },
      { id: 's5', type: 'action', service: 'whatsapp', title: 'Alerta a Analista', config: 'Enviar Resumen PDF a +54...', icon: 'send' },
    ]
  },
  {
    id: 'w2',
    name: 'Sincronización de Patrullas',
    description: 'Actualiza posiciones en mapa y guarda historial.',
    status: 'paused',
    runCount: 156,
    lastRun: 'Ayer',
    steps: [
      { id: 's1', type: 'trigger', service: 'maps', title: 'Cambio de Ubicación', config: 'Unidades: Alpha, Bravo', icon: 'my_location' },
      { id: 's2', type: 'action', service: 'sheets', title: 'Log de Movimientos', config: 'Añadir fila con Timestamp', icon: 'history' },
    ]
  }
];

export const MOCK_WORKBOOKS: Workbook[] = [
  {
    id: 'wb-1',
    title: 'Evidencia: Operación Hidrovía',
    caseId: 'p1',
    sources: [
      { id: 'src-1', title: 'Intercepción Telefónica #224.mp3', type: 'audio', contentSummary: 'Conversación entre alias "Pez" y "Lancha" sobre ruta logística.', uploadDate: '2 Oct, 14:00', citations: 4 },
      { id: 'src-2', title: 'Informe Policial Preliminar.pdf', type: 'pdf', contentSummary: 'Detalle de incautación en puerto norte. 4 detenidos.', uploadDate: '1 Oct, 09:30', citations: 12 },
      { id: 'src-3', title: 'Foto Vigilancia Depósito.jpg', type: 'image', contentSummary: 'Visualización de patentes de camiones de carga.', uploadDate: '3 Oct, 11:15', citations: 2 }
    ],
    notes: [
      { id: 'n-1', content: 'Verificar la coartada del conductor del camión Scania rojo.', tags: ['urgente', 'verificación'] }
    ],
    chatHistory: [
      { id: 'm1', role: 'user', content: 'Resume las conexiones entre la llamada #224 y el informe policial.', timestamp: new Date() },
      { id: 'm2', role: 'ai', content: 'Basado en la Intercepción #224 y el Informe Policial: \n\n1. Alias "Lancha" menciona una entrega el día 1 de Octubre a las 09:00.\n2. El informe policial confirma la incautación a las 09:30 en el lugar mencionado en el audio.\n\nEsto confirma que la inteligencia previa era correcta.', sources: ['Intercepción Telefónica #224.mp3', 'Informe Policial Preliminar.pdf'], timestamp: new Date() }
    ]
  }
];

export const MOCK_IDENTITY_MATCHES: IdentityMatch[] = [
  {
    id: 'm1',
    confidence: 94,
    matchReasons: ['Reconocimiento Facial (98%)', 'Tatuaje "Serpiente" en cuello', 'Alias "El Ruso"'],
    status: 'pending',
    profileA: { codeName: 'VIPER', realName: 'Viktor K.', image: 'https://i.pravatar.cc/150?u=viper', affiliations: ['Cartel del Norte'] },
    profileB: { codeName: 'DESCONOCIDO-22', realName: 'Victor Korz', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', affiliations: ['Hinchada Club X'] }
  }
];

export const MOCK_OSINT_POSTS: OsintPost[] = [
  {
    id: 'os1',
    platform: 'instagram',
    userHandle: '@calle_fuego_12',
    content: 'Todo listo para esta noche. 🔫💊 #LaBanda #Rosario',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop',
    timestamp: 'Hace 2 horas',
    threatLevel: 'high',
    geolocation: { lat: -32.95, lng: -60.65, address: 'Barrio Vía Honda' },
    tags: ['Armas', 'Drogas', 'Amenaza']
  },
  {
    id: 'os2',
    platform: 'facebook',
    userHandle: 'Juan Carlos M.',
    content: 'Venden cosas raras en la esquina de San Martín y Uriburu. Mucho movimiento.',
    timestamp: 'Hace 45 min',
    threatLevel: 'medium',
    geolocation: { lat: -32.98, lng: -60.64, address: 'Zona Sur' },
    tags: ['Denuncia', 'Narcomenudeo']
  }
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 't1', date: '2023-11-01', title: 'Inicio Operación Delta', type: 'operation', intensity: 8 },
  { id: 't2', date: '2023-11-03', title: 'Homicidio Zona Sur', type: 'incident', intensity: 9, cluster: 'Violencia' },
  { id: 't3', date: '2023-11-05', title: 'Interceptación Audio #44', type: 'intel', intensity: 4 },
  { id: 't4', date: '2023-11-08', title: 'Incautación Armas', type: 'operation', intensity: 7 },
  { id: 't5', date: '2023-11-12', title: 'Enfrentamiento Armado', type: 'incident', intensity: 10, cluster: 'Violencia' },
];

export const MOCK_PERFORMANCE_UNITS: PerformanceUnit[] = [
  { id: 'u1', name: 'Brigada de Investigaciones Norte', complianceScore: 92, casesAssigned: 45, avgResponseTime: '12h', status: 'optimal' },
  { id: 'u2', name: 'Unidad Táctica Sur', complianceScore: 65, casesAssigned: 30, avgResponseTime: '48h', status: 'critical', lastIncident: 'Demora en Carga de Evidencia (3 días)' },
  { id: 'u3', name: 'División Ciber-Patrullaje', complianceScore: 78, casesAssigned: 120, avgResponseTime: '4h', status: 'warning' },
];

export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TX-1001',
    date: '2023-11-20 10:14',
    originEntity: 'Transportes Rápido S.R.L.',
    originAccount: '30712345678-01',
    destinationEntity: 'Inversiones del Litoral S.A.',
    destinationAccount: '30898765432-02',
    amountUSD: 54000,
    amountARS: 48600000,
    channel: 'Transferencia Bancaria',
    suspiciousFlag: 'Triangulación Offshore',
    riskScore: 89
  },
  {
    id: 'TX-1002',
    date: '2023-11-21 14:32',
    originEntity: 'González Ignacio Leonel',
    originAccount: '20356789123-01',
    destinationEntity: 'Shell Co. Delta',
    destinationAccount: '30999988887-01',
    amountUSD: 12000,
    amountARS: 10800000,
    channel: 'Efectivo depósito',
    suspiciousFlag: 'Estructuración (Smurfing)',
    riskScore: 92
  }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ACC-01',
    bankName: 'Banco Nación',
    holderName: 'González Ignacio Leonel',
    holderCuit: '20356789123',
    cbuCvu: '0110001430000123456789',
    balanceUSD: 145000,
    status: 'Bajo Vigilancia'
  },
  {
    id: 'ACC-02',
    bankName: 'Banco Macro',
    holderName: 'Viktor K.',
    holderCuit: '20934567890',
    cbuCvu: '2850001430000987654321',
    balanceUSD: 850000,
    status: 'Embargada'
  }
];

export const MOCK_SHELL_COMPANIES: ShellCompany[] = [
  {
    id: 'SH-01',
    companyName: 'Inversiones del Litoral S.A.',
    cuit: '30898765432',
    registrationDate: '2020-05-12',
    activity: 'Servicios Financieros N.C.P.',
    legalAddress: 'Córdoba 1200, Rosario',
    suspectedFrontman: 'González Ignacio Leonel',
    totalMovementUSD: 1540000,
    riskRating: 'Alto'
  }
];
