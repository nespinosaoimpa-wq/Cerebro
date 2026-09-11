import { MenuItem, StatCard, Alert, Suspect, User, CalendarEvent, Project, Workflow, Integration, Workbook, IdentityMatch, OsintPost, ReportSlide, TimelineEvent, IngestionFile, PerformanceUnit, FinancialTransaction, BankAccount, ShellCompany } from './types';

export const CURRENT_USER: User = {
  id: 'u-001',
  name: 'nespinosa.oimpa@gmail.com',
  rank: 'Analista de Investigaciones Criminales',
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
  { label: 'Causas Judiciales', value: '11', change: '+3 activas', positive: true, icon: 'folder' },
  { label: 'Puntos Georreferenciados', value: '1.003', change: '536 allanamientos / 467 partes', positive: true, icon: 'pin_drop' },
  { label: 'Personas Investigadas', value: '62', change: '7 clanes identificados', positive: true, icon: 'badge' },
  { label: 'Registros Procesados', value: '602', change: 'Expedientes MPA', positive: true, icon: 'description' }
];

export const RECENT_ALERTS: Alert[] = [
  { id: 'a1', severity: 'critical', title: 'Medida Cautelar Mercado Pago CUIJ 21-09702835-1', location: 'Fiscalía Santa Fe (Fiscal Eric Valerio Fernández)', time: '14:20', status: 'new' },
  { id: 'a2', severity: 'high', title: 'Operativo Casona 2 - CUIJ 21-09744817-2', location: 'San Lorenzo / Yapeyú (Clan Zabala)', time: '15:10', status: 'investigating' },
  { id: 'a3', severity: 'critical', title: 'Incidente Balístico en Circunvalación CUIJ 21-09694845-7', location: 'Zona Yapeyú (Clan Puchingas)', time: '16:05', status: 'new' },
  { id: 'a4', severity: 'medium', title: 'Inspección Búnker B° Mocoví Recreo R-248615-24', location: 'Rosario y Venezuela, Recreo', time: '17:30', status: 'investigating' }
];

export const SUSPECTS: Suspect[] = [
  {
    "id": "s-bergallothomasi",
    "codeName": "BERGALLO,",
    "realName": "BERGALLO, THOMAS IGNASIO",
    "dni": "45414906",
    "cuit": "20-45414906-9",
    "dob": "16/10/2003",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08788528-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06307262-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08760746-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-roscamilasoleda",
    "codeName": "RÍOS,",
    "realName": "RÍOS, CAMILA SOLEDAD",
    "dni": "40876080",
    "cuit": "27-40876080-7",
    "dob": "18/02/1997",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08045469-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08138386-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "27-40876080-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-aguilardiegofra",
    "codeName": "AGUILAR",
    "realName": "AGUILAR DIEGO FRANCISCO",
    "dni": "20778322",
    "cuit": "20-20778322-7",
    "dob": "17/07/1969",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-20778322-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-alostizajonatan",
    "codeName": "YEPE",
    "realName": "ALOSTIZA JONATAN LEONEL",
    "dni": "38982301",
    "cuit": "20-38982301-6",
    "dob": "09/04/1995",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06829522-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-38982301-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08321034-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      },
      {
        "type": "vehicle",
        "description": "GOL 1",
        "identifier": "GOL 1"
      }
    ]
  },
  {
    "id": "s-carnaghilautaro",
    "codeName": "LAUTI",
    "realName": "CARNAGHI LAUTARO FABIAN",
    "dni": "39455119",
    "cuit": "20-39455119-9",
    "dob": "29-03-1996",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06715152-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06714202-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08488064-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-cisneroslautaro",
    "codeName": "CISNEROS",
    "realName": "CISNEROS LAUTARO JESUS",
    "dni": "36263011",
    "cuit": "20-36263011-9",
    "dob": "19/05/1991",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-36263011-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06400614-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-fazziojosemaria",
    "codeName": "FAZZIO",
    "realName": "FAZZIO JOSE MARIA",
    "dni": "41319592",
    "cuit": "20-41319592-7",
    "dob": "18/07/1998",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06889031-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08351601-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-41319592-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-giovannielloemi",
    "codeName": "LA MADRE",
    "realName": "GIOVANNIELLO EMILCE EDIT",
    "dni": "23676748",
    "cuit": "27-23676748-0",
    "dob": "23/11/1973",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-23676748-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06442619-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      },
      {
        "type": "vehicle",
        "description": "208 FELINE 1",
        "identifier": "208 FELINE"
      }
    ]
  },
  {
    "id": "s-giovanniellomar",
    "codeName": "GIOVANNIELLO",
    "realName": "GIOVANNIELLO MARCELO NICOLAS",
    "dni": "40617573",
    "cuit": "20-40617573-2",
    "dob": "30/08/1997",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-40617573-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-gonzalezdariofa",
    "codeName": "GONZALEZ",
    "realName": "GONZALEZ DARIO FABIAN",
    "dni": "21048424",
    "cuit": "20-21048424-9",
    "dob": "30/08/1969",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08173702-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-21048424-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06017343-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-gonzalezignacio",
    "codeName": "CHAVO",
    "realName": "GONZALEZ IGNACIO LEONEL",
    "dni": "42332598",
    "cuit": "20-42332598-5",
    "dob": "22/10/1994",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-42332598-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06306159-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06931130-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-ifranmaximilian",
    "codeName": "IFRAN",
    "realName": "IFRAN MAXIMILIANO IVAN",
    "dni": "44427944",
    "cuit": "20-44427944-4",
    "dob": "16/10/2002",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-44427944-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      },
      {
        "type": "vehicle",
        "description": "CLASSIC 4 PTAS LT 1",
        "identifier": "CLASSIC 4 "
      }
    ]
  },
  {
    "id": "s-marquezdanielex",
    "codeName": "MARQUEZ",
    "realName": "MARQUEZ  DANIEL EXEQUIEL",
    "dni": "40647199",
    "cuit": "20-40647199-4",
    "dob": "11/09/1997",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08445264-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-40647199-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08417673-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-perezpabloariel",
    "codeName": "PEREZ",
    "realName": "PEREZ PABLO ARIEL",
    "dni": "36545905",
    "cuit": "20-36545905-4",
    "dob": "15/11/1991",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08137627-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-36545905-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-rosbrianemanuel",
    "codeName": "CHUKI",
    "realName": "RÍOS BRIAN EMANUEL",
    "dni": "37146417",
    "cuit": "20-37146417-5",
    "dob": "08/11/1992",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06846363-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-37146417-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-saccojorgeluis",
    "codeName": "SACCO",
    "realName": "SACCO JORGE LUIS",
    "dni": "37765576",
    "cuit": "20-37655576-2",
    "dob": "20/09/1993",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06415198-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06062660-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06915955-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-salvaalanmarcos",
    "codeName": "SALVA",
    "realName": "SALVA ALAN MARCOS",
    "dni": "41941739",
    "cuit": "20-41941739-5",
    "dob": "17/08/1999",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-41941739-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-zabalajonnelson",
    "codeName": "EL PADRINO / JON ZABALA",
    "realName": "ZABALA JON NELSON",
    "dni": "40314524",
    "cuit": "20-40314524-7",
    "dob": "16-02-1997",
    "riskLevel": 96,
    "recidivismRisk": "imminent",
    "status": "Wanted",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "hub",
    "behavioralProfile": {
      "impulsivity": 85,
      "sociability": 70,
      "violentTendency": 90,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-23676748-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-40314524-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      },
      {
        "type": "vehicle",
        "description": "FOX 1",
        "identifier": "FOX 1"
      }
    ]
  },
  {
    "id": "s-zabaladiegoisma",
    "codeName": "ZABALA",
    "realName": "ZABALA DIEGO ISMAEL",
    "dni": "24050331",
    "cuit": "20-24050331-0",
    "dob": "22/09/1974",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06442619-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08165898-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-08106210-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-ibarrajonatanex",
    "codeName": "IBARRA,",
    "realName": "IBARRA, JONATAN EXEQUIEL",
    "dni": "38815316",
    "cuit": "20-38815316-5",
    "dob": "08/05/1995",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-38815316-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-rosjuanpablo",
    "codeName": "RÍOS,",
    "realName": "RÍOS, JUAN PABLO",
    "dni": "42924290",
    "cuit": "20-42924290-9",
    "dob": "S/D",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08866030-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08749968-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-42924290-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-basualdomartina",
    "codeName": "BASUALDO,",
    "realName": "BASUALDO, MARTIN ALEJANDRO",
    "dni": "32.701.854",
    "cuit": "20-32701854-0",
    "dob": "01/01/1987",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08473607-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08085284-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08806966-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-ayalanicolasmat",
    "codeName": "AYALA,",
    "realName": "AYALA, NICOLAS MATIAS",
    "dni": "36012312",
    "cuit": "20-36012312-0",
    "dob": "07/03/1991",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-36012312-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      },
      {
        "type": "vehicle",
        "description": "405SRI 1994",
        "identifier": "405SRI 199"
      }
    ]
  },
  {
    "id": "s-tavecchiolucasm",
    "codeName": "TAVECCHIO,",
    "realName": "TAVECCHIO, LUCAS MATIAS",
    "dni": "37577517",
    "cuit": "20-37577517-5",
    "dob": "10/08/93",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08510652-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06002909-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06247283-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-tavecchiomauroe",
    "codeName": "TAVECCHIO,",
    "realName": "TAVECCHIO, MAURO ELIAS",
    "dni": "37577516",
    "cuit": "20-37577516-7",
    "dob": "10/08/93",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06141558-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "20-37577516-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-filippawalterni",
    "codeName": "FILIPPA",
    "realName": "FILIPPA WALTER NICOLAS",
    "dni": "38898083",
    "cuit": "20-38898083-5",
    "dob": "14/06/1991",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Yapeyú / San Lorenzo, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda La Negrada",
      "Clan Zabala"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08822473-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08529917-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06114854-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda La Negrada",
          "Clan Zabala"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-analiaguadalupe",
    "codeName": "ANALIA",
    "realName": "ANALIA GUADALUPE LEIVA",
    "dni": "25480577",
    "cuit": "27-25480577-2",
    "dob": "03/03/1977",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-25480577-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-brunopasculli",
    "codeName": "BRUNO",
    "realName": "BRUNO PASCULLI",
    "dni": "42924024",
    "cuit": "20-42924024-8",
    "dob": "09/10/2000",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-42924024-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08239293-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-celerwalterdami",
    "codeName": "CELER",
    "realName": "CELER WALTER DAMIAN",
    "dni": "30786545",
    "cuit": "23-30786545-9",
    "dob": "22/01/1984",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "23-30786545-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08131486-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06036040-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-simnlidealejand",
    "codeName": "SIMÓN,",
    "realName": "SIMÓN, ÉLIDE ALEJANDRA",
    "dni": "27320126",
    "cuit": "27-27320126-8",
    "dob": "07/06/1979",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-27320126-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-celermatiasdami",
    "codeName": "CELER",
    "realName": "CELER MATIAS DAMIAN",
    "dni": "44761545",
    "cuit": "20-44761545-9",
    "dob": "25/02/2003",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-28925554-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-44761545-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08880953-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-celersebastiani",
    "codeName": "CELER",
    "realName": "CELER SEBASTIAN IGNACIO",
    "dni": "34827035",
    "cuit": "20-34827035-9",
    "dob": "16/11/1989",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-34827035-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08170143-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08887953-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-celeroscaradria",
    "codeName": "CELER",
    "realName": "CELER OSCAR ADRIAN",
    "dni": "25015425",
    "cuit": "24-25015425-5",
    "dob": "18/05/19976",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06910823-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "24-25015425-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06700372-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      },
      {
        "type": "vehicle",
        "description": "GOL TREND 1",
        "identifier": "GOL TREND "
      }
    ]
  },
  {
    "id": "s-celeroscaralber",
    "codeName": "CELER",
    "realName": "CELER OSCAR ALBERTO",
    "dni": "11790480",
    "cuit": "20-11790480-7",
    "dob": "24/09/1955",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "23-30786545-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "27-10065750-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-11790480-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-ayelnmaragimnez",
    "codeName": "AYELÉN",
    "realName": "AYELÉN MARÍA GIMÉNEZ",
    "dni": "39947474",
    "cuit": "20-39947474-9",
    "dob": "24/11/1996",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "23-39947474-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-leivabrianivan",
    "codeName": "CUCHIN",
    "realName": "LEIVA BRIAN IVAN",
    "dni": "39503707",
    "cuit": "20-39503707-3",
    "dob": "28/05/1996",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06317091-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06088835-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-39503707-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-joshctormartnez",
    "codeName": "Pinino",
    "realName": "JOSÉ HÉCTOR MARTÍNEZ",
    "dni": "16863600",
    "cuit": "20-16863600-9",
    "dob": "26/06/1964",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08220423-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08015655-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-16863600-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-jesicahaydeepas",
    "codeName": "JESICA",
    "realName": "JESICA HAYDEE PASSARELLO",
    "dni": "37146019",
    "cuit": "20-37146019-9",
    "dob": "25/12/1991",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08119070-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "23-39947474-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08243326-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-nicolsjavierrop",
    "codeName": "NICOLÁS",
    "realName": "NICOLÁS JAVIER ROPPULO",
    "dni": "31103060",
    "cuit": "20-31103060-9",
    "dob": "11/08/1984",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08656538-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-31103060-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-echeverriajuane",
    "codeName": "ECHEVERRIA",
    "realName": "ECHEVERRIA JUAN EDUARDO",
    "dni": "28074149",
    "cuit": "20-28074149-4",
    "dob": "24/05/1980",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-28074149-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06908011-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08505112-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-gmezpedronicols",
    "codeName": "GÓMEZ",
    "realName": "GÓMEZ PEDRO NICOLÁS",
    "dni": "41011062",
    "cuit": "20-41011062-9",
    "dob": "31/03/1998",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08878804-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06567485-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-41011062-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-joaquinpasculli",
    "codeName": "JOAQUIN",
    "realName": "JOAQUIN PASCULLI",
    "dni": "42924023",
    "cuit": "23-42924023-9",
    "dob": "09/10/2000",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "23-42924023-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-leivajuanabel",
    "codeName": "LEIVA,",
    "realName": "LEIVA, JUAN ABEL",
    "dni": "28241471",
    "cuit": "20-28241471-7",
    "dob": "30/10/1980",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06532014-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-28241471-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06867110-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-leivamarcosdavi",
    "codeName": "LEIVA",
    "realName": "LEIVA MARCOS DAVID",
    "dni": "32179400",
    "cuit": "23-32179400-9",
    "dob": "19/03/1986",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06238282-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06427168-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "23-32179400-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-martinezsebasti",
    "codeName": "MARTINEZ,",
    "realName": "MARTINEZ, SEBASTIAN JOSE",
    "dni": "33949740",
    "cuit": "20-33949740-1",
    "dob": "09/06/1988",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08168450-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-33949740-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06043539-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-francomercedesg",
    "codeName": "FRANCO,",
    "realName": "FRANCO, MERCEDES GUADALUPE",
    "dni": "11933821",
    "cuit": "27-11933821-8",
    "dob": "23/06/1956",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-11933821-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-leivamiguelorla",
    "codeName": "LEIVA,",
    "realName": "LEIVA, MIGUEL ORLANDO",
    "dni": "23559994",
    "cuit": "20-23559994-6",
    "dob": "16/05/1974",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-23559994-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08128766-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06213773-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-celergabrielnic",
    "codeName": "CELER,",
    "realName": "CELER, GABRIEL NICOLAS",
    "dni": "37337271",
    "cuit": "20-37337271-5",
    "dob": "21/06/1993",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06893396-7",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06519181-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "20-37337271-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-oscarorlandolei",
    "codeName": "OSCAR",
    "realName": "OSCAR ORLANDO LEIVA",
    "dni": "11061723",
    "cuit": "20-11061723-3",
    "dob": "25/01/1954",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "Nacional de Registros Seccionales de la Propiedad Automotor",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "Localidad",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-11061723-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-rodriguezalejan",
    "codeName": "RODRIGUEZ",
    "realName": "RODRIGUEZ ALEJANDRO FABIAN",
    "dni": "22066895",
    "cuit": "23-22066895-9",
    "dob": "05/04/1971",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08137627-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "23-22066895-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "30-59979263-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-sabrinabelenpas",
    "codeName": "SABRINA",
    "realName": "SABRINA BELEN PASSARELLO",
    "dni": "36002427",
    "cuit": "27-36002427-5",
    "dob": "11/09/1990",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08064655-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08687586-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "27-36002427-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-villafaenadiabe",
    "codeName": "VILLAFAÑE",
    "realName": "VILLAFAÑE NADIA BEATRIZ",
    "dni": "28241031",
    "cuit": "27-28241031-7",
    "dob": "05/07/1980",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Fonavi Centenario / Varadero Sarsotti, SF",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Los de Siempre",
      "B° Centenario"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06717466-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06942111-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06726487-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Los de Siempre",
          "B° Centenario"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "MARCA - MODELO",
        "identifier": "MARCA - MO"
      }
    ]
  },
  {
    "id": "s-mendozasalvador",
    "codeName": "MENDOZA,",
    "realName": "MENDOZA, SALVADOR ARIEL",
    "dni": "33212604",
    "cuit": "20-33212604-1",
    "dob": "13/10/1986",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Mayoraz / Castañaduy, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Polaco Maidana"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08453432-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Polaco Maidana"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06741569-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Polaco Maidana"
        ],
        "severity": 4
      },
      {
        "cuij": "21-09314380-6",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Polaco Maidana"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "206 dominio DYH883 titular Mariano Edgardo Martin",
        "identifier": "206 domini"
      }
    ]
  },
  {
    "id": "s-darojaviermaida",
    "codeName": "POLACO",
    "realName": "DARÍO JAVIER MAIDANA",
    "dni": "27522470",
    "cuit": "20-27522470-8",
    "dob": "21/04/1980",
    "riskLevel": 96,
    "recidivismRisk": "imminent",
    "status": "Wanted",
    "lastSeen": "Barrio Mayoraz / Castañaduy, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda Polaco Maidana"
    ],
    "socialNetworkCentrality": "hub",
    "behavioralProfile": {
      "impulsivity": 85,
      "sociability": 70,
      "violentTendency": 90,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-06291192-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Polaco Maidana"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08338285-3",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Polaco Maidana"
        ],
        "severity": 4
      },
      {
        "cuij": "20-27522470-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda Polaco Maidana"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-dardogabrielleg",
    "codeName": "DARDO",
    "realName": "DARDO GABRIEL LEGUIZAMON",
    "dni": "32.730.444",
    "cuit": "20-32730444-6",
    "dob": "1987-01-11",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Acería / Cabal, SF",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Clan Los Aceiteros"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-09464347-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08980658-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08472859-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      }
    ],
    "assets": [
      {
        "type": "vehicle",
        "description": "Renault Koleos Dynamique 4x4 MT Todo Terreno paten",
        "identifier": "Renault Ko"
      },
      {
        "type": "vehicle",
        "description": "Ford Mondeo Ghia 2",
        "identifier": "Ford Monde"
      }
    ]
  },
  {
    "id": "s-felipedardolegu",
    "codeName": "FELIPE",
    "realName": "FELIPE DARDO LEGUIZAMON",
    "dni": "18.341.032",
    "cuit": "20-18341032-7",
    "dob": "1967-01-12",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Acería / Cabal, SF",
    "image": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Clan Los Aceiteros"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-08322517-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08237856-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      },
      {
        "cuij": "21-08511312-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-leguizamonperla",
    "codeName": "LEGUIZAMON",
    "realName": "LEGUIZAMON PERLA MARIA DEL CARMEN",
    "dni": "43.495.004",
    "cuit": "27-43495004-5",
    "dob": "2001-07-28",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio Acería / Cabal, SF",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Clan Los Aceiteros"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "27-43495004-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Clan Los Aceiteros"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-prisciladaianaa",
    "codeName": "PRISCILA",
    "realName": "PRISCILA DAIANA ALVISO",
    "dni": "41.847.778",
    "cuit": "23-41847778-4",
    "dob": "1999-05-22",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio San Lorenzo / Santa Rosa de Lima, SF",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda El Correntino"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "23-41847778-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-claudiajosefina",
    "codeName": "CLAUDIA",
    "realName": "CLAUDIA JOSEFINA PEDRIEL",
    "dni": "39.370.316",
    "cuit": "23-39",
    "dob": "S/D",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Santa Fe Capital",
    "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Microtráfico Santa Fe"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-09390020-8",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Microtráfico Santa Fe"
        ],
        "severity": 4
      },
      {
        "cuij": "21-09489328-0",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Microtráfico Santa Fe"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-cristianismaelb",
    "codeName": "CRISTIAN",
    "realName": "CRISTIAN ISMAEL BEBAN",
    "dni": "36.627.096",
    "cuit": "20-36",
    "dob": "1992-02-05",
    "riskLevel": 88,
    "recidivismRisk": "high",
    "status": "Surveillance",
    "lastSeen": "Barrio San Lorenzo / Santa Rosa de Lima, SF",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda El Correntino"
    ],
    "socialNetworkCentrality": "bridge",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-09384585-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      },
      {
        "cuij": "21-09567597-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      },
      {
        "cuij": "21-06857464-9",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-walterangelurie",
    "codeName": "WALTER",
    "realName": "WALTER ANGEL URIEL ALVISO",
    "dni": "45.488.582",
    "cuit": "20-45488582-2",
    "dob": "S/D",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Barrio San Lorenzo / Santa Rosa de Lima, SF",
    "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Banda El Correntino"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "20-45488582-2",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      },
      {
        "cuij": "21-09227168-1",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      },
      {
        "cuij": "21-09495675-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Banda El Correntino"
        ],
        "severity": 4
      }
    ],
    "assets": []
  },
  {
    "id": "s-fischettijonata",
    "codeName": "FISCHETTI,",
    "realName": "FISCHETTI, JONATAN",
    "dni": "36002327",
    "cuit": "20-36002327-4",
    "dob": "13/09/1991",
    "riskLevel": 75,
    "recidivismRisk": "moderate",
    "status": "Surveillance",
    "lastSeen": "Santa Fe Capital",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    "affiliations": [
      "Microtráfico Santa Fe"
    ],
    "socialNetworkCentrality": "leaf",
    "behavioralProfile": {
      "impulsivity": 65,
      "sociability": 70,
      "violentTendency": 60,
      "predominantMO": [
        "Microtráfico",
        "Disputa Territorial",
        "Distribución Urbana"
      ]
    },
    "addresses": [
      {
        "street": "RELACIÓN",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      },
      {
        "street": "LOCALIDAD",
        "city": "SANTA FE",
        "province": "SANTA FE",
        "source": "MPA / PDI SANTA FE"
      }
    ],
    "phones": [
      {
        "number": "+549342******",
        "source": "Investigación Preliminar"
      }
    ],
    "judicialRecords": [
      {
        "cuij": "21-09334802-5",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Microtráfico Santa Fe"
        ],
        "severity": 4
      },
      {
        "cuij": "20-36002327-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Microtráfico Santa Fe"
        ],
        "severity": 4
      },
      {
        "cuij": "21-09134155-4",
        "date": "2025/2026",
        "charge": "INF. LEY 23.737 (MICROTRAFICO) Y ASOCIACION ILICITA",
        "victims": [
          "Salud y Seguridad Pública"
        ],
        "coDefendants": [
          "Microtráfico Santa Fe"
        ],
        "severity": 4
      }
    ],
    "assets": []
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    "id": "p-san-lorenzo",
    "title": "CUIJ 21-09744817-2 | Operativo Casona 2 - Clan Zabala",
    "type": "Crimen Organizado",
    "location": "San Lorenzo / Barrio Yapeyú, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 10m",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop",
    "progress": 90,
    "linkedWorkbookId": "wb-san-lorenzo",
    "entityCount": 26
  },
  {
    "id": "p-pastor",
    "title": "CUIJ 21-09702835-1 | Cautelar Mercado Pago - Red Díaz",
    "type": "Lavado de Activos",
    "location": "Santa Fe Capital / Entidades Virtuales",
    "status": "Active",
    "lastUpdate": "Hace 25m",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    "progress": 85,
    "linkedWorkbookId": "wb-pastor",
    "entityCount": 14
  },
  {
    "id": "p-centenario",
    "title": "CUIJ 21-09696384-7 | Fonavi Centenario - Clan Los de Siempre",
    "type": "Microtráfico",
    "location": "Fonavi Centenario / Manzana 4, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 45m",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=1000&auto=format&fit=crop",
    "progress": 80,
    "linkedWorkbookId": "wb-centenario",
    "entityCount": 26
  },
  {
    "id": "p-puchingas",
    "title": "CUIJ 21-09693542-8 | Conflicto Yapeyú - Clan Puchingas",
    "type": "Homicidios",
    "location": "Barrio Yapeyú / Loyola Sur, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 1h",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000&auto=format&fit=crop",
    "progress": 75,
    "linkedWorkbookId": "wb-puchingas",
    "entityCount": 12
  },
  {
    "id": "p-maidana",
    "title": "CUIJ 21-08338285-3 | Distribución Castañaduy - Polaco Maidana",
    "type": "Microtráfico",
    "location": "Barrio Mayoraz / Castañaduy 6807, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 2h",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop",
    "progress": 70,
    "linkedWorkbookId": "wb-maidana",
    "entityCount": 8
  },
  {
    "id": "p-rosquin",
    "title": "CUIJ 21-09745475-9 | Ref. 062_26 Cañada Rosquín - Acopio",
    "type": "Microtráfico",
    "location": "Cañada Rosquín, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 3h",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    "progress": 65,
    "linkedWorkbookId": "wb-rosquin",
    "entityCount": 6
  },
  {
    "id": "p-zazpe",
    "title": "CUIJ 21-09726972-3 | Inmueble Ochava Zazpe y Zavalla (1700)",
    "type": "Crimen Organizado",
    "location": "Zazpe y Zavalla, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 4h",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1000&auto=format&fit=crop",
    "progress": 85,
    "linkedWorkbookId": "wb-zazpe",
    "entityCount": 10
  },
  {
    "id": "p-recreo",
    "title": "CUIJ R-248615-24 | Búnker Barrio Mocoví - Recreo",
    "type": "Microtráfico",
    "location": "Calle Rosario y Venezuela, Recreo, Santa Fe",
    "status": "Active",
    "lastUpdate": "Hace 5h",
    "members": [
      "u-001"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
    "progress": 60,
    "linkedWorkbookId": "wb-recreo",
    "entityCount": 5
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    "id": "ce-1",
    "title": "Audiencia Prisión Preventiva Zabala Jon Nelson",
    "type": "briefing",
    "date": 1773316800000,
    "time": "09:00",
    "duration": "2h",
    "description": "CUIJ 21-09744817-2. Revisión de medida cautelar respecto a Casona 2 San Lorenzo."
  },
  {
    "id": "ce-2",
    "title": "Vencimiento Informe Bloqueo Mercado Pago CUIJ 21-09702835-1",
    "type": "report",
    "date": 1773403200000,
    "time": "12:00",
    "duration": "1h",
    "description": "Respuesta requerida por oficio judicial a Mercado Libre / Mercado Pago sobre cuentas Díaz y Avalo."
  },
  {
    "id": "ce-3",
    "title": "Operativo de Allanamiento Ochava Zazpe y Zavalla (1700)",
    "type": "sweep",
    "date": 1773489600000,
    "time": "06:00",
    "duration": "4h",
    "description": "Ejecución de orden judicial CUIJ 21-09726972-3 con apoyo de PDI."
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Google Sheets / Excel MPA', provider: 'google', service: 'sheets', status: 'connected', lastSync: 'Ahora', icon: 'table_chart' },
  { id: 'i2', name: 'Google Drive / Repositorio', provider: 'google', service: 'drive', status: 'connected', lastSync: 'Ahora', icon: 'cloud_upload' },
  { id: 'i3', name: 'Google Maps / Cartografía', provider: 'google', service: 'maps', status: 'connected', lastSync: 'Ahora', icon: 'map' },
];

export const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'wf-1', name: 'Alerta Automática de Allanamiento Positivo', description: 'Notifica inmediatamente al fiscal asignado ante secuestro de estupefacientes o armas.', steps: [], status: 'active', runCount: 38, lastRun: 'Hace 15m' },
  { id: 'wf-2', name: 'Detección de Smurfing (Pitufeo) en Cuentas Virtuales', description: 'Cruza transferencias menores en Mercado Pago de compradores habituales hacia cuentas recaudadoras.', steps: [], status: 'active', runCount: 142, lastRun: 'Hace 5m' }
];

export const MOCK_WORKBOOKS: Workbook[] = [
  {
    "id": "wb-san-lorenzo",
    "title": "Cuaderno: CUIJ 21-09744817-2 (Clan Zabala / San Lorenzo)",
    "caseId": "p-san-lorenzo",
    "sources": [
      {
        "id": "src-san-lorenzo-1",
        "title": "21-09744817-2 Ref info. 060_26 San Lorenzo 03.docx",
        "type": "text",
        "contentSummary": "Investigación preliminar sobre el Clan Zabala y distribución en San Lorenzo.",
        "uploadDate": "11/09/2026",
        "citations": 24,
        "rawText": "Informe detallado respecto a Zabala Jon Nelson (\"El Padrino\"), Emilce Edit Giovanniello y Lautaro Carnaghi..."
      },
      {
        "id": "src-san-lorenzo-2",
        "title": "CASONA 2 (1).docx",
        "type": "text",
        "contentSummary": "Inspección ocular y tareas de inteligencia sobre inmueble Casona 2.",
        "uploadDate": "11/09/2026",
        "citations": 18,
        "rawText": "Inmueble utilizado como base logística para el fraccionamiento de microdosis y guardia armada."
      }
    ],
    "notes": [
      {
        "id": "n1",
        "content": "Inmueble Casona 2 presenta movimientos nocturnos constantes compatibles con fraccionamiento.",
        "tags": [
          "Búnker",
          "San Lorenzo",
          "Zabala"
        ]
      },
      {
        "id": "n2",
        "content": "Se constató vínculo filial directo entre Jon Nelson Zabala y Emilce Edit Giovanniello.",
        "tags": [
          "Filiación",
          "La Negrada"
        ]
      }
    ],
    "chatHistory": []
  },
  {
    "id": "wb-pastor",
    "title": "Cuaderno: CUIJ 21-09702835-1 (Medida Cautelar Mercado Pago)",
    "caseId": "p-pastor",
    "sources": [
      {
        "id": "src-pastor-1",
        "title": "Oficio_Judicial_Mercado Pago_Santa_Fe.docx",
        "type": "text",
        "contentSummary": "Orden del Fiscal Eric Valerio Fernández para inmovilización total y bloqueo de cuentas.",
        "uploadDate": "11/09/2026",
        "citations": 32,
        "rawText": "SANTA FE, 19 de marzo del 2026. Se dispone la inmovilización preventiva y bloqueo total de cuentas asociadas a Yoana Soledad Avalo y titulares identificados."
      },
      {
        "id": "src-pastor-2",
        "title": "Transferencias de ingresos_id usuario_1094318785.xlsx",
        "type": "excel",
        "contentSummary": "Detalle de transferencias entrantes recibidas por Jonatan David Díaz (Mercado Pago).",
        "uploadDate": "11/09/2026",
        "citations": 40,
        "rawText": "Registros de acreditaciones por $847.000, $570.000 y $226.000 provenientes de diversos pagadores investigados."
      }
    ],
    "notes": [
      {
        "id": "np1",
        "content": "Cuentas Mercado Pago utilizadas como canal de cobro unificado por intermediarios barriales.",
        "tags": [
          "Mercado Pago",
          "Bloqueo Judicial",
          "Pastor"
        ]
      }
    ],
    "chatHistory": []
  },
  {
    "id": "wb-puchingas",
    "title": "Cuaderno: CUIJ 21-09693542-8 (Mundo Puchinga / Homicidios)",
    "caseId": "p-puchingas",
    "sources": [
      {
        "id": "src-puch-1",
        "title": "EXPLICACIÓN MUNDO PUCHINGA.docx",
        "type": "text",
        "contentSummary": "Matriz explicativa sobre las ramas y enfrentamientos del clan Benítez en Yapeyú.",
        "uploadDate": "11/09/2026",
        "citations": 28,
        "rawText": "Relato testimonial de Maraz sobre balaceras ordenadas por Puchinga y Pipi Rosales en Circunvalación."
      }
    ],
    "notes": [
      {
        "id": "npu1",
        "content": "Línea de conflicto armada abierta entre facción Benítez e intermediarios de Yapeyú.",
        "tags": [
          "Homicidio",
          "Yapeyú",
          "Puchingas"
        ]
      }
    ],
    "chatHistory": []
  },
  {
    "id": "wb-centenario",
    "title": "Cuaderno: CUIJ 21-09696384-7 (Fonavi Centenario / Leiva)",
    "caseId": "p-centenario",
    "sources": [
      {
        "id": "src-cent-1",
        "title": "Dossier Oscar Orlando Leiva.docx",
        "type": "text",
        "contentSummary": "Historial delictivo, condenas previas y control territorial en B° Centenario.",
        "uploadDate": "11/09/2026",
        "citations": 19,
        "rawText": "Operaciones de la banda Los de Siempre en Manzanas 4 y 7 de Fonavi Centenario..."
      }
    ],
    "notes": [
      {
        "id": "nc1",
        "content": "Presencia de búnkeres disimulados en departamentos usurpados de Fonavi Centenario.",
        "tags": [
          "Búnker",
          "Centenario",
          "Leiva"
        ]
      }
    ],
    "chatHistory": []
  }
];

export const MOCK_IDENTITY_MATCHES: IdentityMatch[] = [
  {
    "id": "idm-1",
    "profileA": {
      "codeName": "EL PADRINO",
      "realName": "ZABALA JON NELSON",
      "dni": "40.314.524"
    },
    "profileB": {
      "codeName": "JON ZABALA",
      "realName": "ZABALA JON NELSON",
      "dni": "40.314.524"
    },
    "confidence": 99,
    "matchReasons": [
      "DNI Idéntico (40.314.524)",
      "Vínculo Materno Emilce Giovanniello",
      "Causa CUIJ 21-09744817-2"
    ],
    "status": "pending"
  },
  {
    "id": "idm-2",
    "profileA": {
      "codeName": "POLACO",
      "realName": "MAIDANA SEBASTIAN",
      "dni": "27.522.470"
    },
    "profileB": {
      "codeName": "DARIO MAIDANA",
      "realName": "MAIDANA DARIO JAVIER",
      "dni": "27.522.470"
    },
    "confidence": 97,
    "matchReasons": [
      "Mismo DNI",
      "Dominio Vehicular Peugeot 206 DYH-883",
      "Domicilio Castañaduy 6807"
    ],
    "status": "pending"
  },
  {
    "id": "idm-3",
    "profileA": {
      "codeName": "PUCHINGA",
      "realName": "BENITEZ ISAIAS JOSE EMANUEL",
      "dni": "38.109.281"
    },
    "profileB": {
      "codeName": "ISAIAS BENITEZ",
      "realName": "BENITEZ ISAIAS",
      "dni": "38.109.281"
    },
    "confidence": 98,
    "matchReasons": [
      "Identificación en Causas de Homicidio CUIJ 21-09693542-8",
      "Domicilio Alfonsina Storni 6883"
    ],
    "status": "pending"
  },
  {
    "id": "idm-4",
    "profileA": {
      "codeName": "PASTOR",
      "realName": "DIAZ JONATAN DAVID",
      "dni": "46.539.740"
    },
    "profileB": {
      "codeName": "DIAZJONATAN20220407140001",
      "realName": "DIAZ JONATAN DAVID",
      "dni": "46.539.740"
    },
    "confidence": 100,
    "matchReasons": [
      "Usuario Mercado Pago 1094318785",
      "CUIT 20-46539740-4",
      "Oficio Judicial CUIJ 21-09702835-1"
    ],
    "status": "pending"
  }
];

export const MOCK_OSINT_POSTS: OsintPost[] = [
  {
    "id": "post-1",
    "platform": "facebook",
    "userHandle": "Vecinos Alerta Barrio Yapeyú",
    "content": "Denuncian movimientos extraños de motos sin patente por calle Neuquén y Reinares después de las 22hs.",
    "imageUrl": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    "timestamp": "Hace 2 horas",
    "geolocation": {
      "lat": -31.5712,
      "lng": -60.7387,
      "address": "Barrio Yapeyú, Santa Fe"
    },
    "threatLevel": "high",
    "tags": [
      "Yapeyú",
      "Microtráfico",
      "Reinares"
    ]
  },
  {
    "id": "post-2",
    "platform": "facebook",
    "userHandle": "Comunidad Fonavi Centenario",
    "content": "Reclamo por ruidos de disparos en inmediaciones de Manzana 4 y Varadero Sarsotti.",
    "timestamp": "Hace 4 horas",
    "geolocation": {
      "lat": -31.658,
      "lng": -60.715,
      "address": "Fonavi Centenario, Santa Fe"
    },
    "threatLevel": "high",
    "tags": [
      "Centenario",
      "Manzana 4",
      "Los de Siempre"
    ]
  },
  {
    "id": "post-3",
    "platform": "instagram",
    "userHandle": "@info_recreo_sf",
    "content": "Operativos policiales en la zona de calle Rosario y Venezuela B° Mocoví.",
    "timestamp": "Hace 6 horas",
    "geolocation": {
      "lat": -31.49,
      "lng": -60.73,
      "address": "Barrio Mocoví, Recreo"
    },
    "threatLevel": "medium",
    "tags": [
      "Recreo",
      "Búnker",
      "Operativo"
    ]
  }
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    "id": "ev-1",
    "date": "2026-03-19",
    "title": "Oficio Judicial CUIJ 21-09702835-1: Medida Cautelar y Bloqueo Total Cuentas Mercado Pago",
    "type": "operation",
    "intensity": 10,
    "cluster": "Red Financiera Díaz / Pastor"
  },
  {
    "id": "ev-2",
    "date": "2026-01-25",
    "title": "Homicidio y Enfrentamiento Balístico en Yapeyú (Intervención Marchi / Puchingas)",
    "type": "incident",
    "intensity": 9,
    "cluster": "Clan Puchingas"
  },
  {
    "id": "ev-3",
    "date": "2026-01-10",
    "title": "Operativo de Allanamiento en Inmueble Casona 2 - CUIJ 21-09744817-2",
    "type": "operation",
    "intensity": 9,
    "cluster": "Clan Zabala"
  },
  {
    "id": "ev-4",
    "date": "2026-01-03",
    "title": "Ataque Balístico en Av. Circunvalación contra Testigo Maraz - CUIJ 21-09694845-7",
    "type": "incident",
    "intensity": 8,
    "cluster": "Clan Puchingas"
  },
  {
    "id": "ev-5",
    "date": "2025-12-10",
    "title": "Constatación y Allanamiento de Búnker en Rosario y Venezuela (Recreo) - R-248615-24",
    "type": "operation",
    "intensity": 7,
    "cluster": "Microtráfico Recreo"
  },
  {
    "id": "ev-6",
    "date": "2025-11-04",
    "title": "Concentración Atípica de Transferencias Recaudatorias ($847.000 ARS) en Cuenta Díaz Jonatan",
    "type": "intel",
    "intensity": 8,
    "cluster": "Red Financiera Díaz / Pastor"
  },
  {
    "id": "ev-7",
    "date": "2025-08-15",
    "title": "Allanamientos Múltiples en Manzanas 4 y 7 Fonavi Centenario - CUIJ 21-09696384-7",
    "type": "operation",
    "intensity": 8,
    "cluster": "Clan Los de Siempre"
  },
  {
    "id": "ev-8",
    "date": "2025-05-04",
    "title": "Secuestro Vehicular de Peugeot 206 Gris Dominio DYH-883 en B° Mayoraz - CUIJ 21-08338285-3",
    "type": "operation",
    "intensity": 7,
    "cluster": "Banda Polaco Maidana"
  }
];

export const MOCK_PERFORMANCE_UNITS: PerformanceUnit[] = [
  {
    "id": "u-1",
    "name": "MPA Santa Fe - Unidad Fiscal Especial Microtráfico",
    "complianceScore": 96,
    "casesAssigned": 28,
    "avgResponseTime": "6h",
    "status": "optimal"
  },
  {
    "id": "u-2",
    "name": "PDI Santa Fe - Dirección General de Investigaciones",
    "complianceScore": 92,
    "casesAssigned": 19,
    "avgResponseTime": "12h",
    "status": "optimal"
  },
  {
    "id": "u-3",
    "name": "PDI San Lorenzo - Brigada Operativa Antinarcóticos",
    "complianceScore": 89,
    "casesAssigned": 8,
    "avgResponseTime": "16h",
    "status": "optimal"
  },
  {
    "id": "u-4",
    "name": "PDI Cañada Rosquín - Destacamento Investigativo",
    "complianceScore": 90,
    "casesAssigned": 5,
    "avgResponseTime": "14h",
    "status": "optimal"
  }
];

export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    "id": "tx-mp-01",
    "date": "2025-11-04 21:28:54",
    "originEntity": "TREJO URIEL NICOLAS (CUIT 20-46448998-4)",
    "originAccount": "CBU 0720156788000003885604",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 847,
    "amountARS": 847000,
    "channel": "Mercado Pago (Transferencia Bancaria)",
    "suspiciousFlag": "Monto Atípico / Recaudación CUIJ 21-09702835-1",
    "riskScore": 94
  },
  {
    "id": "tx-mp-02",
    "date": "2025-10-31 00:22:15",
    "originEntity": "TREJO URIEL NICOLAS (CUIT 20-46448998-4)",
    "originAccount": "CBU 0720156788000003885604",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 570,
    "amountARS": 570000,
    "channel": "Mercado Pago",
    "suspiciousFlag": "Transferencia Nocturna Recurrente",
    "riskScore": 90
  },
  {
    "id": "tx-mp-03",
    "date": "2025-11-01 23:12:38",
    "originEntity": "ROMERO NAHUEL NICOLAS (CUIT 20-43124235-5)",
    "originAccount": "CVU 4530000800016793064673",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 226,
    "amountARS": 226000,
    "channel": "Mercado Pago (CVU)",
    "suspiciousFlag": "Pitufeo / Concentración de Fondos",
    "riskScore": 88
  },
  {
    "id": "tx-mp-04",
    "date": "2025-10-30 00:13:12",
    "originEntity": "ROMERO NAHUEL NICOLAS (CUIT 20-43124235-5)",
    "originAccount": "CVU 4530000800016793064673",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 100.5,
    "amountARS": 100500,
    "channel": "Mercado Pago",
    "suspiciousFlag": "Pitufeo Repetitivo",
    "riskScore": 85
  },
  {
    "id": "tx-mp-05",
    "date": "2025-11-04 00:43:24",
    "originEntity": "ROMERO NAHUEL NICOLAS (CUIT 20-43124235-5)",
    "originAccount": "CVU 4530000800016793064673",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 74,
    "amountARS": 74000,
    "channel": "Mercado Pago",
    "suspiciousFlag": "Pitufeo Repetitivo Mismo Origen",
    "riskScore": 86
  },
  {
    "id": "tx-mp-06",
    "date": "2025-10-26 20:07:44",
    "originEntity": "RODRIGUEZ, LUDMILA DENIS (CUIT 27-47208995-7)",
    "originAccount": "CBU 3860134105000047282251",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 81,
    "amountARS": 81000,
    "channel": "Mercado Pago",
    "suspiciousFlag": "Cobro de Microdosis Identificado",
    "riskScore": 80
  },
  {
    "id": "tx-mp-07",
    "date": "2025-10-21 22:17:01",
    "originEntity": "MERELES JESICA MICAELA (CUIT 27-41490199-4)",
    "originAccount": "CVU 4530000800019584740062",
    "destinationEntity": "JONATAN DAVID DIAZ (Mercado Pago ID 1094318785)",
    "destinationAccount": "CVU 3100029677582437",
    "amountUSD": 30,
    "amountARS": 30000,
    "channel": "Mercado Pago",
    "suspiciousFlag": "Acreditación Directa Búnker",
    "riskScore": 78
  },
  {
    "id": "tx-mp-08",
    "date": "2025-10-07 21:54:06",
    "originEntity": "JONATAN DAVID DIAZ (Mercado Pago)",
    "originAccount": "CVU 3100029677582437",
    "destinationEntity": "YPF GIORGI SARTOR PLAYA (CUIT 30-53067757-1)",
    "destinationAccount": "CBU 0000028400000026207531",
    "amountUSD": 64.5,
    "amountARS": 64500,
    "channel": "First Data Cono Sur (Transferencia)",
    "suspiciousFlag": "Desvío de Fondos en Efectivo / Nafta",
    "riskScore": 75
  },
  {
    "id": "tx-mp-09",
    "date": "2025-10-02 20:00:54",
    "originEntity": "JONATAN DAVID DIAZ (Mercado Pago)",
    "originAccount": "CVU 3100029677582437",
    "destinationEntity": "BC COMBUSTIBLES S A (CUIT 30-70783721-3)",
    "destinationAccount": "CBU 0170418520000001022797",
    "amountUSD": 30,
    "amountARS": 30000,
    "channel": "BBVA Argentina",
    "suspiciousFlag": "Pagos a Proveedores de Transporte",
    "riskScore": 76
  },
  {
    "id": "tx-mp-10",
    "date": "2025-10-07 17:10:43",
    "originEntity": "JONATAN DAVID DIAZ (Mercado Pago)",
    "originAccount": "CVU 3100029677582437",
    "destinationEntity": "FALCON MIRTA EDIT (CUIT 27-20254474-1)",
    "destinationAccount": "CBU 0110651630065105398215",
    "amountUSD": 20,
    "amountARS": 20000,
    "channel": "Banco de la Nación Argentina",
    "suspiciousFlag": "Transferencia a Familiar / Soldado",
    "riskScore": 72
  }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    "id": "acc-1",
    "bankName": "Mercado Pago / Mercado Libre",
    "holderName": "Jonatan David Díaz (Red Pastor)",
    "holderCuit": "20-46539740-4",
    "cbuCvu": "CVU 3100029677582437 (Alias DIAZJONATAN...)",
    "balanceUSD": 4850,
    "status": "Embargada"
  },
  {
    "id": "acc-2",
    "bankName": "Mercado Pago / Mercado Libre",
    "holderName": "Yoana Soledad Avalo",
    "holderCuit": "27-38192847-2",
    "cbuCvu": "CVU 000000310001928374",
    "balanceUSD": 1920,
    "status": "Embargada"
  },
  {
    "id": "acc-3",
    "bankName": "Nuevo Banco de Santa Fe",
    "holderName": "Juan Marcelo Díaz",
    "holderCuit": "20-34918273-1",
    "cbuCvu": "CBU 3300001810029384758192",
    "balanceUSD": 3200,
    "status": "Bajo Vigilancia"
  },
  {
    "id": "acc-4",
    "bankName": "Banco de la Nación Argentina",
    "holderName": "Falcón Mirta Edit",
    "holderCuit": "27-20254474-1",
    "cbuCvu": "CBU 0110651630065105398215",
    "balanceUSD": 850,
    "status": "Bajo Vigilancia"
  },
  {
    "id": "acc-5",
    "bankName": "BBVA Argentina",
    "holderName": "Bc Combustibles S.A.",
    "holderCuit": "30-70783721-3",
    "cbuCvu": "CBU 0170418520000001022797",
    "balanceUSD": 12400,
    "status": "Activa"
  }
];

export const MOCK_SHELL_COMPANIES: ShellCompany[] = [
  {
    "id": "comp-1",
    "companyName": "Red de Recaudación Virtual Díaz / Pastor",
    "cuit": "20-46539740-4",
    "registrationDate": "07/04/2022",
    "activity": "Cobro y fraccionamiento electrónico microtráfico",
    "legalAddress": "Santa Fe Capital, Provincia de Santa Fe",
    "suspectedFrontman": "Jonatan David Díaz",
    "totalMovementUSD": 40200,
    "riskRating": "Alto"
  },
  {
    "id": "comp-2",
    "companyName": "YPF GIORGI SARTOR PLAYA (Punto de Extracción y Desvío)",
    "cuit": "30-53067757-1",
    "registrationDate": "15/03/2018",
    "activity": "Venta de Combustibles y Estación de Servicio",
    "legalAddress": "Santa Fe Capital, Provincia de Santa Fe",
    "suspectedFrontman": "Titular Giorgi Sartor (Comercio Canal)",
    "totalMovementUSD": 2450,
    "riskRating": "Medio"
  },
  {
    "id": "comp-3",
    "companyName": "Bc Combustibles S.A.",
    "cuit": "30-70783721-3",
    "registrationDate": "20/11/2020",
    "activity": "Distribución Mayorista Combustible",
    "legalAddress": "Av. Facundo Zuviría, Santa Fe",
    "suspectedFrontman": "Directorio S.A.",
    "totalMovementUSD": 5800,
    "riskRating": "Medio"
  }
];
