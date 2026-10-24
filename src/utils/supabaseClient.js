import { createClient } from '@supabase/supabase-js'

const LOCAL_URL_KEY = 'nutriflow_supabase_url'
const LOCAL_ANON_KEY = 'nutriflow_supabase_key'

// Clean up any legacy credentials previously stored in localStorage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(LOCAL_URL_KEY)
    localStorage.removeItem(LOCAL_ANON_KEY)
  } catch (_) {}
}

let supabaseInstance = null

/**
 * Returns the active credentials from environment variables.
 */
export function getSupabaseCredentials() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''

  return {
    url: envUrl.trim(),
    anonKey: envKey.trim(),
    isFromEnv: Boolean(envUrl)
  }
}

/**
 * Check if valid Supabase configuration is present.
 */
export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseCredentials()
  return Boolean(
    url && 
    anonKey && 
    url.startsWith('https://') && 
    !url.includes('your-project-id') &&
    anonKey.length > 20
  )
}

/**
 * Get or create the Supabase client instance.
 */
export function getSupabase() {
  const { url, anonKey } = getSupabaseCredentials()

  if (!url || !anonKey || !isSupabaseConfigured()) {
    return null
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    } catch (err) {
      console.error('[NutriFlow] Failed to initialize Supabase client:', err)
      return null
    }
  }

  return supabaseInstance
}

