import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from env or localStorage if configured dynamically
const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  const localUrl = localStorage.getItem('cerebro_supabase_url');
  const localKey = localStorage.getItem('cerebro_supabase_key');

  const supabaseUrl = localUrl || envUrl;
  const supabaseKey = localKey || envKey;

  const isConfigured = Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseKey !== 'YOUR_SUPABASE_ANON_KEY'
  );

  return { supabaseUrl, supabaseKey, isConfigured };
};

let supabaseClientInstance: SupabaseClient | null = null;
let isConnected = false;

if (credentials.isConfigured) {
  try {
    supabaseClientInstance = createClient(credentials.supabaseUrl, credentials.supabaseKey);
    isConnected = true;
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
    isConnected = false;
    supabaseClientInstance = null;
  }
}

export const isSupabaseConnected = isConnected;
export const supabase = supabaseClientInstance;

export const saveSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('cerebro_supabase_url', url.trim());
    localStorage.setItem('cerebro_supabase_key', key.trim());
    window.location.reload();
  }
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('cerebro_supabase_url');
  localStorage.removeItem('cerebro_supabase_key');
  window.location.reload();
};
