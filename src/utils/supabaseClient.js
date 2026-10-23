import { createClient } from '@supabase/supabase-js'

const LOCAL_URL_KEY = 'nutriflow_supabase_url'
const LOCAL_ANON_KEY = 'nutriflow_supabase_key'

let supabaseInstance = null
let currentConfiguredUrl = null
let currentConfiguredKey = null

/**
 * Returns the currently active credentials from environment variables or localStorage.
 */
export function getSupabaseCredentials() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''

  const localUrl = typeof window !== 'undefined' ? (localStorage.getItem(LOCAL_URL_KEY) || '') : ''
  const localKey = typeof window !== 'undefined' ? (localStorage.getItem(LOCAL_ANON_KEY) || '') : ''

  const url = (localUrl || envUrl).trim()
  const anonKey = (localKey || envKey).trim()

  return {
    url,
    anonKey,
    isFromEnv: Boolean(!localUrl && envUrl),
    isFromLocalStorage: Boolean(localUrl)
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

  // Re-instantiate if credentials changed
  if (!supabaseInstance || currentConfiguredUrl !== url || currentConfiguredKey !== anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
      currentConfiguredUrl = url
      currentConfiguredKey = anonKey
    } catch (err) {
      console.error('[NutriFlow] Failed to initialize Supabase client:', err)
      return null
    }
  }

  return supabaseInstance
}

/**
 * Allows user to store Supabase credentials directly via UI modal.
 */
export function saveCustomSupabaseCredentials(url, anonKey) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(LOCAL_URL_KEY, url.trim())
    else localStorage.removeItem(LOCAL_URL_KEY)

    if (anonKey) localStorage.setItem(LOCAL_ANON_KEY, anonKey.trim())
    else localStorage.removeItem(LOCAL_ANON_KEY)

    // Reset instance so it recreates on next call
    supabaseInstance = null
    currentConfiguredUrl = null
    currentConfiguredKey = null
  }
}

/**
 * Clears credentials stored in localStorage.
 */
export function clearCustomSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_URL_KEY)
    localStorage.removeItem(LOCAL_ANON_KEY)
    supabaseInstance = null
    currentConfiguredUrl = null
    currentConfiguredKey = null
  }
}
