import { getSupabase } from './supabaseClient'
import { 
  getAllNutriflowData, 
  restoreAllNutriflowData, 
  saveStorage, 
  loadStorage, 
  createSafetySnapshot, 
  mergeNutriflowData,
  deduplicateNutriflowData,
  cleanAndDeduplicateStorage
} from './storage'

const LAST_SYNC_KEY = 'nutriflow_last_synced'
const AUTO_SYNC_KEY = 'nutriflow_auto_sync_enabled'
const DEVICE_ID_KEY = 'nutriflow_device_client_id'

/**
 * Returns a unique, persistent identifier for this browser / client installation.
 */
export function getClientDeviceId() {
  let deviceId = loadStorage(DEVICE_ID_KEY, null)
  if (!deviceId) {
    deviceId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9)
    saveStorage(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

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
 * Uploads data to Supabase with device client identification and pre-upload safety snapshot.
 */
export async function uploadLocalDataToCloud(dataToUpload = null) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to sync data.')

  // Take safety snapshot of local data before pushing
  createSafetySnapshot('pre_cloud_upload')

  const localPayload = dataToUpload || getAllNutriflowData()
  const now = new Date().toISOString()
  const payloadWithMeta = {
    ...localPayload,
    _client_id: getClientDeviceId(),
    _synced_at: now
  }

  const { error } = await supabase
    .from('nutriflow_user_data')
    .upsert({
      user_id: user.id,
      payload: payloadWithMeta,
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
 * Performs a smart, non-destructive bidirectional sync:
 * - Uses deletion tombstones so deleted items are removed everywhere and never resurrect.
 * - Deeply deduplicates recipes, foods, meals, and shopping items.
 * - Resolves conflicts using timestamps and preserves user progress.
 * - Updates local storage and pushes the unified clean state to the cloud.
 */
export async function syncAndMergeCloudData(optionalLocalData = null) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to sync.')

  const cloudRecord = await fetchCloudData()
  const localData = optionalLocalData 
    ? { ...getAllNutriflowData(), ...optionalLocalData }
    : getAllNutriflowData()

  // First time sync: cloud has no record yet, upload local data safely
  if (!cloudRecord || !cloudRecord.payload || Object.keys(cloudRecord.payload).length === 0) {
    const { cleanedData } = deduplicateNutriflowData(localData)
    restoreAllNutriflowData(cleanedData)
    const uploadRes = await uploadLocalDataToCloud(cleanedData)
    return {
      action: 'uploaded',
      timestamp: uploadRes.timestamp,
      data: cleanedData,
      message: 'Initial local data successfully uploaded to cloud.'
    }
  }

  // Create safety snapshot of local data prior to merge
  createSafetySnapshot('pre_sync_merge')

  // Smart non-destructive merge: union of recipes, foods, meals with tombstones
  const mergedRaw = mergeNutriflowData(localData, cloudRecord.payload)

  // Guarantee deep deduplication
  const { cleanedData, stats } = deduplicateNutriflowData(mergedRaw)

  // Save merged result to local storage
  restoreAllNutriflowData(cleanedData)

  const syncTime = new Date().toISOString()
  saveStorage(LAST_SYNC_KEY, syncTime)

  // Push the unified clean data back to cloud so both devices have identical complete data
  try {
    await uploadLocalDataToCloud(cleanedData)
  } catch (pushErr) {
    console.warn('[NutriFlow] Cloud push after merge warning:', pushErr)
  }

  return {
    action: 'merged',
    timestamp: syncTime,
    data: cleanedData,
    stats,
    message: 'Data safely synced across devices without duplicates or missing items.'
  }
}

/**
 * Performs a complete deduplication scan of local storage and pushes the cleaned state to cloud.
 */
export async function cleanDeduplicateAndSync() {
  const { cleanedData, stats } = cleanAndDeduplicateStorage()
  const user = await getCurrentUser()
  if (user) {
    try {
      await uploadLocalDataToCloud(cleanedData)
    } catch (err) {
      console.warn('[NutriFlow] Cloud upload after deduplication warning:', err)
    }
  }
  return { cleanedData, stats }
}

/**
 * Backward compatibility alias for syncAndMergeCloudData
 */
export async function syncCloudAndLocal(optionalData = null) {
  return syncAndMergeCloudData(optionalData)
}

/**
 * Realtime channel instance tracker
 */
let activeRealtimeChannel = null

/**
 * Subscribes to live database changes from Supabase via WebSocket.
 * When changes are made on another device, this client automatically receives
 * the remote payload, merges it non-destructively, and triggers the callback.
 */
export function subscribeToRealtimeSync(userId, onRemoteUpdate) {
  const supabase = getSupabase()
  if (!supabase || !userId) return () => {}

  if (activeRealtimeChannel) {
    try {
      supabase.removeChannel(activeRealtimeChannel)
    } catch (_) {}
    activeRealtimeChannel = null
  }

  const currentDeviceId = getClientDeviceId()

  try {
    activeRealtimeChannel = supabase
      .channel(`nutriflow_realtime_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nutriflow_user_data',
          filter: `user_id=eq.${userId}`
        },
        (change) => {
          const newRecord = change.new
          if (!newRecord || !newRecord.payload) return

          // Ignore echoes sent by this same device
          if (newRecord.payload._client_id === currentDeviceId) {
            return
          }

          console.info('[NutriFlow] Live update detected from another device!')
          createSafetySnapshot('pre_live_remote_merge')

          const currentLocal = getAllNutriflowData()
          const merged = mergeNutriflowData(currentLocal, newRecord.payload)
          const { cleanedData } = deduplicateNutriflowData(merged)
          restoreAllNutriflowData(cleanedData)
          saveStorage(LAST_SYNC_KEY, new Date().toISOString())

          if (onRemoteUpdate) {
            onRemoteUpdate(cleanedData)
          }
        }
      )
      .subscribe((status) => {
        console.info(`[NutriFlow Realtime] Channel status: ${status}`)
      })
  } catch (err) {
    console.warn('[NutriFlow Realtime] Subscription error:', err)
  }

  return () => {
    if (activeRealtimeChannel) {
      try {
        supabase.removeChannel(activeRealtimeChannel)
      } catch (_) {}
      activeRealtimeChannel = null
    }
  }
}
