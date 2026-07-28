
export interface User {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  email?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  subItems?: MenuItem[];
  view?: string;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  location: string;
  time: string;
  status: 'new' | 'investigating' | 'resolved';
}

// --- INTELLIGENCE DOSSIER TYPES ---

export interface JudicialRecord {
  cuij: string;
  date: string;
  charge: string; // "Caratula" or "Valoración"
  victims: string[];
  coDefendants: string[]; // "Imputados"
  status?: string;
  severity: 1 | 2 | 3 | 4 | 5; // 1: Minor, 5: High Impact
  modusOperandi?: string;
}

export interface FamilyRelation {
  name: string;
  dni?: string;
  address?: string;
  relation: string; // Madre, Hermana, etc.
}

export interface Address {
  street: string;
  city: string;
  province: string;
  source: string; // RENAPER, SUDAMERICADATA, etc.
}

export interface Asset {
  type: 'vehicle' | 'real_estate' | 'crypto' | 'luxury_item';
  description: string; // "FORD FOCUS DOMINIO..." or Address
  identifier?: string; // Patente / Partida / Wallet
  ownershipStatus?: string; // Titular, Autorizado
  estimatedValue?: number;
}

export interface BehavioralProfile {
  impulsivity: number; // 0-100
  sociability: number; // 0-100
  narcissism?: number;
  violentTendency: number;
  predominantMO: string[];
}

export interface Suspect {
  id: string;
  codeName: string; // Alias
  realName: string;
  dni?: string;
  cuit?: string;
  dob?: string; // Date of Birth
  riskLevel: number; // 1-100
  recidivismRisk: 'low' | 'moderate' | 'high' | 'imminent';
  status: 'Wanted' | 'Surveillance' | 'Captured' | 'Deceased';
  lastSeen: string;
  image: string;
  affiliations: string[];
  
  // Expert Criminology Data
  behavioralProfile?: BehavioralProfile;
  socialNetworkCentrality: 'hub' | 'bridge' | 'leaf'; // hub: ringleader, bridge: connector
  
  // Extended Dossier Data
  addresses?: Address[];
  phones?: { number: string; source: string }[];
  socialMedia?: { platform: string; link: string; id: string }[];
  judicialRecords?: JudicialRecord[];
  family?: FamilyRelation[];
  assets?: Asset[];
  socialSecurity?: { entity: string; type: string; status: string }[]; // Obra social, planes
}

export type CalendarEventType = 'report' | 'sweep' | 'processing' | 'briefing';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: number;
  time: string;
  duration?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  type: 'Microtráfico' | 'Crimen Organizado' | 'Lavado de Activos' | 'Homicidios';
  location: string;
  status: 'Active' | 'Archived' | 'Pending';
  lastUpdate: string;
  members: string[];
  thumbnail: string;
  progress: number;
  linkedWorkbookId?: string; 
  entityCount?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: string[]; 
}

export interface Integration {
  id: string;
  name: string;
  provider: 'google' | 'meta' | 'nexus';
  service: 'sheets' | 'drive' | 'maps' | 'gmail' | 'whatsapp' | 'ai_parser';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  icon: string;
}

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'logic';
  service: Integration['service'];
  title: string;
  config: string; 
  icon: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  status: 'active' | 'paused';
  runCount: number;
  lastRun: string;
}

// --- NOTEBOOK LM TYPES ---

export interface Source {
  id: string;
  title: string;
  type: 'pdf' | 'audio' | 'text' | 'image';
  contentSummary: string;
  uploadDate: string;
  citations: number;
  rawText?: string; // For RAG / AI Context
  aiAnalysis?: any; // Stored JSON analysis from Gemini
}

export interface Note {
  id: string;
  content: string;
  tags: string[];
}

export interface Workbook {
  id: string;
  title: string;
  caseId?: string;
  sources: Source[];
  notes: Note[];
  chatHistory: ChatMessage[];
  audioBriefingUrl?: string; 
}

// --- NEW MODULES TYPES ---

export interface IdentityMatch {
  id: string;
  profileA: Partial<Suspect>;
  profileB: Partial<Suspect>;
  confidence: number;
  matchReasons: string[]; // e.g., ["Same Tattoo", "Face Match 98%", "Alias Match"]
  status: 'pending' | 'merged' | 'discarded';
}

export interface OsintPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok';
  userHandle: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  geolocation?: { lat: number; lng: number; address: string };
  threatLevel: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface ReportSlide {
  id: string;
  title: string;
  type: 'map' | 'stats' | 'profile' | 'text';
  content: string;
  aiGeneratedSummary?: string;
}

// --- TIMELINE & INGESTION ---

export interface TimelineEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'incident' | 'operation' | 'intel';
  intensity: number; // 1-10 height
  cluster?: string;
}

export interface IngestionFile {
  id: string;
  name: string;
  type: 'pdf' | 'audio' | 'excel' | 'image';
  size: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  extractedEntities: number;
}

// --- SETTINGS & PERFORMANCE ---

export interface AppSettings {
  theme: 'dark' | 'tactical' | 'light';
  language: 'es' | 'en' | 'pt';
  accentColor: string;
  mapIcons: 'standard' | 'satellite' | 'custom_photos';
}

export interface PerformanceUnit {
  id: string;
  name: string;
  complianceScore: number; // 0-100
  casesAssigned: number;
  avgResponseTime: string; // "24h"
  status: 'optimal' | 'warning' | 'critical';
  lastIncident?: string;
}
