import { getSupabase } from './supabaseClient'
import { getAllNutriflowData, restoreAllNutriflowData, saveStorage, loadStorage } from './storage'

const LAST_SYNC_KEY = 'nutriflow_last_synced'
const AUTO_SYNC_KEY = 'nutriflow_auto_sync_enabled'

export function getLastSyncTime() {
  return loadStorage(LAST_SYNC_KEY, null)
}

export function isAutoSyncEnabled() {
  return loadStorage(AUTO_SYNC_KEY, true)
}

export function setAutoSyncEnabled(enabled) {
  saveStorage(AUTO_SYNC_KEY, enabled)
}

/**
 * Sign up a new user with email & password.
 */
export async function signUpWithEmail(email, password) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  if (error) throw error
  return data
}

/**
 * Sign in an existing user with email & password.
 */
export async function signInWithEmail(email, password) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

/**
 * Sign out current user.
 */
export async function signOutUser() {
  const supabase = getSupabase()
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Gets the current active user, if any.
 */
export async function getCurrentUser() {
  const supabase = getSupabase()
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

/**
 * Subscribe to Supabase auth state changes.
 */
export function onAuthStateChange(callback) {
  const supabase = getSupabase()
  if (!supabase) return () => {}

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user || null)
  })

  return () => {
    subscription.unsubscribe()
  }
}

/**
 * Uploads all current local NutriFlow data to Supabase.
 */
export async function uploadLocalDataToCloud() {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to sync data.')

  const localPayload = getAllNutriflowData()
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('nutriflow_user_data')
    .upsert({
      user_id: user.id,
      payload: localPayload,
      client_updated_at: now
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('[NutriFlow] Cloud upload error:', error)
    throw error
  }

  saveStorage(LAST_SYNC_KEY, now)
  return { success: true, timestamp: now }
}

/**
 * Fetches user data from Supabase.
 */
export async function fetchCloudData() {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to fetch cloud data.')

  const { data, error } = await supabase
    .from('nutriflow_user_data')
    .select('payload, client_updated_at, updated_at')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is row not found (first time user)
    console.error('[NutriFlow] Cloud fetch error:', error)
    throw error
  }

  return data || null
}

/**
 * Performs a smart two-way sync:
 * - If cloud has no record yet -> uploads local data to cloud.
 * - If cloud has record -> restores to localStorage and returns restored data.
 */
export async function syncCloudAndLocal() {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to sync.')

  const cloudRecord = await fetchCloudData()

  // First time sync: upload current local data to cloud
  if (!cloudRecord || !cloudRecord.payload || Object.keys(cloudRecord.payload).length === 0) {
    const uploadRes = await uploadLocalDataToCloud()
    return {
      action: 'uploaded',
      timestamp: uploadRes.timestamp,
      message: 'Initial local data successfully uploaded to cloud.'
    }
  }

  // Restore cloud data to local storage
  restoreAllNutriflowData(cloudRecord.payload)
  const syncTime = new Date().toISOString()
  saveStorage(LAST_SYNC_KEY, syncTime)

  return {
    action: 'downloaded',
    timestamp: syncTime,
    data: cloudRecord.payload,
    message: 'Data successfully synchronized from cloud.'
  }
}
