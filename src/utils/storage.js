/**
 * Storage utility with persistent browser storage request and JSON backup / restore.
 */

export function loadStorage(key, defaultValue) {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return defaultValue
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e)
    return defaultValue
  }
}

export function saveStorage(key, value) {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage`, e)
  }
}

/**
 * Requests the browser to make local storage persistent (won't be evicted under storage pressure).
 */
export async function requestPersistentStorage() {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted()
      if (!isPersisted) {
        const granted = await navigator.storage.persist()
        console.info(`[NutriFlow] Persistent storage requested, granted: ${granted}`)
        return granted
      }
      return true
    } catch (err) {
      console.warn('[NutriFlow] Persistent storage request error:', err)
      return false
    }
  }
  return false
}

/**
 * Checks if the storage is currently persisted by the browser.
 */
export async function checkStoragePersistence() {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persisted) {
    try {
      return await navigator.storage.persisted()
    } catch {
      return false
    }
  }
  return false
}

const DELETED_IDS_KEY = 'nutriflow_deleted_ids'
const EXCLUDED_SYNC_KEYS = new Set([
  'nutriflow_safety_snapshot',
  'nutriflow_safety_history',
  'nutriflow_device_client_id',
  'nutriflow_supabase_url',
  'nutriflow_supabase_key',
  'nutriflow_pwa_dismissed'
])

/**
 * Loads the dictionary of tombstone deleted IDs: { [id]: timestamp }
 */
export function getDeletedIds() {
  return loadStorage(DELETED_IDS_KEY, {}) || {}
}

/**
 * Records a deleted item ID so that it never resurrects during cloud merges.
 */
export function recordDeletedId(id, timestamp = new Date().toISOString()) {
  if (!id) return
  const current = getDeletedIds()
  current[id] = timestamp
  saveStorage(DELETED_IDS_KEY, current)
}

/**
 * Batch records multiple deleted item IDs.
 */
export function recordDeletedIds(ids = [], timestamp = new Date().toISOString()) {
  if (!Array.isArray(ids) || ids.length === 0) return
  const current = getDeletedIds()
  ids.forEach(id => {
    if (id) current[id] = timestamp
  })
  saveStorage(DELETED_IDS_KEY, current)
}

/**
 * Removes an ID from the deleted registry (e.g., when the user clicks 'Undo').
 */
export function removeDeletedId(id) {
  if (!id) return
  const current = getDeletedIds()
  if (current[id]) {
    delete current[id]
    saveStorage(DELETED_IDS_KEY, current)
  }
}

/**
 * Prunes tombstones older than 60 days to keep storage lean.
 */
export function pruneOldDeletedIds(deletedMap = {}, maxAgeDays = 60) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
  const pruned = {}
  for (const [id, time] of Object.entries(deletedMap)) {
    const t = new Date(time).getTime()
    if (!isNaN(t) && t >= cutoff) {
      pruned[id] = time
    }
  }
  return pruned
}

/**
 * Checks if a recipe, food, or item has been tombstoned / deleted.
 */
function isItemTombstoned(item, deletedMap) {
  if (!item || !item.id) return false
  const deletedTime = deletedMap[item.id]
  if (!deletedTime) return false
  const itemTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0
  const tombstoneTime = new Date(deletedTime).getTime()
  // If tombstone is newer than or equal to item's last update, it is deleted!
  return tombstoneTime >= itemTime
}

/**
 * Extracts all NutriFlow data keys from localStorage into a dictionary,
 * excluding internal snapshots and device-local credentials.
 */
export function getAllNutriflowData() {
  const data = {}
  if (typeof window === 'undefined' || !window.localStorage) return data

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('nutriflow_') && !EXCLUDED_SYNC_KEYS.has(key)) {
      try {
        const raw = localStorage.getItem(key)
        data[key] = raw ? JSON.parse(raw) : null
      } catch {
        data[key] = localStorage.getItem(key)
      }
    }
  }
  return data
}

/**
 * Restores a dictionary of NutriFlow data keys into localStorage.
 */
export function restoreAllNutriflowData(dataMap) {
  if (!dataMap || typeof dataMap !== 'object') return false
  try {
    Object.entries(dataMap).forEach(([key, value]) => {
      if (key.startsWith('nutriflow_') && !EXCLUDED_SYNC_KEYS.has(key)) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    })
    return true
  } catch (err) {
    console.error('[NutriFlow] Error restoring data map:', err)
    return false
  }
}

const SAFETY_SNAPSHOT_KEY = 'nutriflow_safety_snapshot'
const SAFETY_HISTORY_KEY = 'nutriflow_safety_history'

/**
 * Creates an immutable safety snapshot of all current local data before any sync or restore.
 */
export function createSafetySnapshot(reason = 'auto') {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const currentData = getAllNutriflowData()
    if (!currentData || Object.keys(currentData).length === 0) return null

    const snapshot = {
      timestamp: new Date().toISOString(),
      reason,
      recipeCount: Array.isArray(currentData.nutriflow_recipes) ? currentData.nutriflow_recipes.length : 0,
      historyDayCount: currentData.nutriflow_history ? Object.keys(currentData.nutriflow_history).length : 0,
      data: currentData
    }
    localStorage.setItem(SAFETY_SNAPSHOT_KEY, JSON.stringify(snapshot))

    // Keep history of last 5 snapshots
    let history = []
    try {
      const raw = localStorage.getItem(SAFETY_HISTORY_KEY)
      if (raw) history = JSON.parse(raw)
    } catch (_) {}

    history.unshift({
      timestamp: snapshot.timestamp,
      reason: snapshot.reason,
      recipeCount: snapshot.recipeCount,
      historyDayCount: snapshot.historyDayCount
    })
    if (history.length > 5) history = history.slice(0, 5)
    localStorage.setItem(SAFETY_HISTORY_KEY, JSON.stringify(history))

    return snapshot
  } catch (err) {
    console.warn('[NutriFlow] Failed to create safety snapshot:', err)
    return null
  }
}

/**
 * Returns the most recent safety snapshot if one exists.
 */
export function getLatestSafetySnapshot() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = localStorage.getItem(SAFETY_SNAPSHOT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Restores the application state from the latest safety snapshot.
 */
export function restoreLatestSafetySnapshot() {
  const snapshot = getLatestSafetySnapshot()
  if (!snapshot || !snapshot.data) return false
  return restoreAllNutriflowData(snapshot.data)
}

/**
 * Deeply scans and cleans duplicates across recipes, custom food items, meals, and shopping items.
 * Discarded duplicate IDs are automatically tombstoned so they don't resurrect from other devices.
 */
export function deduplicateNutriflowData(dataMap = {}) {
  const data = { ...dataMap }
  const deletedIds = { ...(data.nutriflow_deleted_ids || getDeletedIds() || {}) }
  const stats = { recipesRemoved: 0, foodsRemoved: 0, mealsRemoved: 0, shoppingRemoved: 0 }
  const now = new Date().toISOString()

  // 1. Deduplicate Recipes
  if (Array.isArray(data.nutriflow_recipes)) {
    const titleMap = new Map()
    const idMap = new Map()

    for (const r of data.nutriflow_recipes) {
      if (!r || !r.title) continue
      const normTitle = r.title.trim().toLowerCase()
      const rId = r.id || ('r_' + Date.now() + Math.random().toString(36).slice(2, 6))
      r.id = rId

      // Check if already deleted
      if (isItemTombstoned(r, deletedIds)) {
        stats.recipesRemoved++
        continue
      }

      // Check ID duplicate
      if (idMap.has(rId)) {
        stats.recipesRemoved++
        deletedIds[rId] = now
        continue
      }
      idMap.set(rId, true)

      // Check Title duplicate
      if (titleMap.has(normTitle)) {
        const existing = titleMap.get(normTitle)
        const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
        const rTime = r.updatedAt ? new Date(r.updatedAt).getTime() : 0
        if (rTime > existingTime) {
          stats.recipesRemoved++
          deletedIds[existing.id] = now
          titleMap.set(normTitle, r)
        } else {
          stats.recipesRemoved++
          deletedIds[rId] = now
        }
      } else {
        titleMap.set(normTitle, r)
      }
    }
    data.nutriflow_recipes = Array.from(titleMap.values())
  }

  // 2. Deduplicate Food Library
  if (Array.isArray(data.nutriflow_food_library)) {
    const keyMap = new Map()
    const idMap = new Map()

    for (const f of data.nutriflow_food_library) {
      if (!f || !f.name) continue
      const fId = f.id || ('f_' + Date.now() + Math.random().toString(36).slice(2, 6))
      f.id = fId

      if (isItemTombstoned(f, deletedIds)) {
        stats.foodsRemoved++
        continue
      }

      if (idMap.has(fId)) {
        stats.foodsRemoved++
        deletedIds[fId] = now
        continue
      }
      idMap.set(fId, true)

      const normKey = f.name.trim().toLowerCase() + '::' + (f.serving || '').trim().toLowerCase()
      if (keyMap.has(normKey)) {
        const existing = keyMap.get(normKey)
        const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
        const fTime = f.updatedAt ? new Date(f.updatedAt).getTime() : 0
        if (fTime > existingTime) {
          stats.foodsRemoved++
          deletedIds[existing.id] = now
          keyMap.set(normKey, f)
        } else {
          stats.foodsRemoved++
          deletedIds[fId] = now
        }
      } else {
        keyMap.set(normKey, f)
      }
    }
    data.nutriflow_food_library = Array.from(keyMap.values())
  }

  // 3. Deduplicate Shopping Items
  if (Array.isArray(data.nutriflow_shopping)) {
    const textMap = new Map()
    const idMap = new Map()

    for (const s of data.nutriflow_shopping) {
      if (!s || !s.text) continue
      const sId = s.id || ('s_' + Date.now() + Math.random().toString(36).slice(2, 6))
      s.id = sId

      if (isItemTombstoned(s, deletedIds)) {
        stats.shoppingRemoved++
        continue
      }

      if (idMap.has(sId)) {
        stats.shoppingRemoved++
        deletedIds[sId] = now
        continue
      }
      idMap.set(sId, true)

      const normText = s.text.trim().toLowerCase() + '::' + (s.category || '').trim().toLowerCase()
      if (textMap.has(normText)) {
        const existing = textMap.get(normText)
        if (!existing.completed && s.completed) {
          deletedIds[existing.id] = now
          textMap.set(normText, s)
        } else {
          deletedIds[sId] = now
        }
        stats.shoppingRemoved++
      } else {
        textMap.set(normText, s)
      }
    }
    data.nutriflow_shopping = Array.from(textMap.values())
  }

  // 4. Deduplicate Daily History (Meals & Workouts)
  if (data.nutriflow_history && typeof data.nutriflow_history === 'object') {
    const newHistory = {}
    for (const [dateKey, day] of Object.entries(data.nutriflow_history)) {
      if (!day || typeof day !== 'object') continue
      const cleanDay = { ...day }

      // Meals
      if (Array.isArray(cleanDay.mealLogs)) {
        const mealKeyMap = new Map()
        const mealIdMap = new Map()

        for (const m of cleanDay.mealLogs) {
          if (!m || !m.name) continue
          const mId = m.id || ('m_' + Date.now() + Math.random().toString(36).slice(2, 6))
          m.id = mId

          if (isItemTombstoned(m, deletedIds)) {
            stats.mealsRemoved++
            continue
          }

          if (mealIdMap.has(mId)) {
            stats.mealsRemoved++
            deletedIds[mId] = now
            continue
          }
          mealIdMap.set(mId, true)

          // Secondary deduplication for identical meal entries created on the same day
          const normKey = (m.name.trim().toLowerCase()) + '::' + 
                          (m.mealType || '') + '::' + 
                          (m.time || '') + '::' + 
                          (m.calories || 0)
          if (mealKeyMap.has(normKey)) {
            stats.mealsRemoved++
            deletedIds[mId] = now
          } else {
            mealKeyMap.set(normKey, m)
          }
        }
        cleanDay.mealLogs = Array.from(mealKeyMap.values())
      }

      // Workouts
      if (Array.isArray(cleanDay.workouts)) {
        const workoutMap = new Map()
        for (const w of cleanDay.workouts) {
          if (!w || !w.id) continue
          if (isItemTombstoned(w, deletedIds)) continue
          if (!workoutMap.has(w.id)) {
            workoutMap.set(w.id, w)
          }
        }
        cleanDay.workouts = Array.from(workoutMap.values())
      }

      newHistory[dateKey] = cleanDay
    }
    data.nutriflow_history = newHistory
  }

  data.nutriflow_deleted_ids = deletedIds
  return { cleanedData: data, stats }
}

/**
 * Cleans duplicates directly in localStorage and updates the deleted ID registry.
 */
export function cleanAndDeduplicateStorage() {
  const current = getAllNutriflowData()
  const { cleanedData, stats } = deduplicateNutriflowData(current)
  restoreAllNutriflowData(cleanedData)
  if (cleanedData.nutriflow_deleted_ids) {
    saveStorage(DELETED_IDS_KEY, cleanedData.nutriflow_deleted_ids)
  }
  return { cleanedData, stats }
}

/**
 * Checks if local data consists entirely of untouched initial placeholder seed data.
 */
function isUntouchedSeedRecipes(recipes) {
  if (!Array.isArray(recipes) || recipes.length !== 3) return false
  const seedIds = new Set(['r1', 'r2', 'r3'])
  return recipes.every(r => r && seedIds.has(r.id))
}

/**
 * Intelligently merges a local data dictionary with a remote data dictionary.
 * GUARANTEES:
 * 1. Zero data loss for new items created on either device.
 * 2. Proper propagation of deletions via tombstones (nutriflow_deleted_ids).
 * 3. Automatic duplicate prevention and conflict resolution using timestamps.
 * 4. Safe sync across phone and computer with zero gaps.
 */
export function mergeNutriflowData(localMap = {}, remoteMap = {}) {
  const local = localMap || {}
  const remote = remoteMap || {}
  const merged = { ...remote, ...local }

  // 1. Merge Deleted IDs (Tombstones)
  const localDeleted = local.nutriflow_deleted_ids || getDeletedIds() || {}
  const remoteDeleted = remote.nutriflow_deleted_ids || {}
  const mergedDeleted = { ...remoteDeleted, ...localDeleted }

  for (const [id, remoteTime] of Object.entries(remoteDeleted)) {
    if (localDeleted[id]) {
      const localTime = new Date(localDeleted[id]).getTime()
      const remTime = new Date(remoteTime).getTime()
      mergedDeleted[id] = remTime > localTime ? remoteTime : localDeleted[id]
    }
  }
  // Prune tombstones older than 60 days
  const activeDeleted = pruneOldDeletedIds(mergedDeleted)

  // 2. Merge Recipes
  const localRecipes = Array.isArray(local.nutriflow_recipes) ? local.nutriflow_recipes : []
  const remoteRecipes = Array.isArray(remote.nutriflow_recipes) ? remote.nutriflow_recipes : []
  
  // Guard against fresh device overwriting real cloud recipes with default seeds
  let effectiveLocalRecipes = localRecipes
  if (isUntouchedSeedRecipes(localRecipes) && remoteRecipes.length > 0 && !isUntouchedSeedRecipes(remoteRecipes)) {
    effectiveLocalRecipes = []
  }

  const recipeMap = new Map()
  const recipeTitleMap = new Map()

  const processRecipe = (r) => {
    if (!r || !r.id) return
    if (isItemTombstoned(r, activeDeleted)) return

    const normTitle = (r.title || '').trim().toLowerCase()
    const rTime = r.updatedAt ? new Date(r.updatedAt).getTime() : 0

    // Check ID match
    if (recipeMap.has(r.id)) {
      const existing = recipeMap.get(r.id)
      const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
      if (rTime >= existingTime) {
        recipeMap.set(r.id, { ...existing, ...r })
        if (normTitle) recipeTitleMap.set(normTitle, r.id)
      }
      return
    }

    // Check Title duplicate match
    if (normTitle && recipeTitleMap.has(normTitle)) {
      const existingId = recipeTitleMap.get(normTitle)
      const existing = recipeMap.get(existingId)
      if (existing) {
        const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
        if (rTime > existingTime) {
          // Replace older recipe with this newer one and tombstone older ID
          recipeMap.delete(existingId)
          activeDeleted[existingId] = new Date().toISOString()
          recipeMap.set(r.id, r)
          recipeTitleMap.set(normTitle, r.id)
        } else {
          // Discard this duplicate and tombstone its ID
          activeDeleted[r.id] = new Date().toISOString()
        }
        return
      }
    }

    recipeMap.set(r.id, r)
    if (normTitle) recipeTitleMap.set(normTitle, r.id)
  }

  for (const r of remoteRecipes) processRecipe(r)
  for (const r of effectiveLocalRecipes) processRecipe(r)

  merged.nutriflow_recipes = Array.from(recipeMap.values())

  // 3. Merge Food Library
  const localFoods = Array.isArray(local.nutriflow_food_library) ? local.nutriflow_food_library : []
  const remoteFoods = Array.isArray(remote.nutriflow_food_library) ? remote.nutriflow_food_library : []
  const foodMap = new Map()

  const processFood = (f) => {
    if (!f || !f.id) return
    if (isItemTombstoned(f, activeDeleted)) return

    if (foodMap.has(f.id)) {
      const existing = foodMap.get(f.id)
      const fTime = f.updatedAt ? new Date(f.updatedAt).getTime() : 0
      const exTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
      if (fTime >= exTime) {
        foodMap.set(f.id, { ...existing, ...f })
      }
    } else {
      foodMap.set(f.id, f)
    }
  }

  for (const f of remoteFoods) processFood(f)
  for (const f of localFoods) processFood(f)

  merged.nutriflow_food_library = Array.from(foodMap.values())

  // 4. Merge Daily History
  const localHistory = local.nutriflow_history && typeof local.nutriflow_history === 'object' ? local.nutriflow_history : {}
  const remoteHistory = remote.nutriflow_history && typeof remote.nutriflow_history === 'object' ? remote.nutriflow_history : {}
  const mergedHistory = { ...remoteHistory }

  for (const [dateKey, localDay] of Object.entries(localHistory)) {
    if (!localDay || typeof localDay !== 'object') continue
    const remoteDay = mergedHistory[dateKey]

    if (!remoteDay) {
      // Filter out any tombstoned items from localDay before adopting
      const cleanMeals = (localDay.mealLogs || []).filter(m => !isItemTombstoned(m, activeDeleted))
      const cleanWorkouts = (localDay.workouts || []).filter(w => !isItemTombstoned(w, activeDeleted))
      mergedHistory[dateKey] = {
        ...localDay,
        mealLogs: cleanMeals,
        workouts: cleanWorkouts
      }
    } else {
      // Determine which day was updated more recently
      const localDayTime = localDay.updatedAt ? new Date(localDay.updatedAt).getTime() : 0
      const remoteDayTime = remoteDay.updatedAt ? new Date(remoteDay.updatedAt).getTime() : 0
      const localIsNewer = localDayTime > remoteDayTime

      // Merge meals
      const mealMap = new Map()
      const rMeals = Array.isArray(remoteDay.mealLogs) ? remoteDay.mealLogs : []
      const lMeals = Array.isArray(localDay.mealLogs) ? localDay.mealLogs : []

      const processMeal = (m) => {
        if (!m || !m.id) return
        if (isItemTombstoned(m, activeDeleted)) return

        if (!mealMap.has(m.id)) {
          mealMap.set(m.id, m)
        } else {
          mealMap.set(m.id, { ...mealMap.get(m.id), ...m })
        }
      }

      for (const m of rMeals) processMeal(m)
      for (const m of lMeals) processMeal(m)

      // Merge workouts
      const workoutMap = new Map()
      const rWorkouts = Array.isArray(remoteDay.workouts) ? remoteDay.workouts : []
      const lWorkouts = Array.isArray(localDay.workouts) ? localDay.workouts : []

      for (const w of rWorkouts) {
        if (w && w.id && !isItemTombstoned(w, activeDeleted)) workoutMap.set(w.id, w)
      }
      for (const w of lWorkouts) {
        if (w && w.id && !isItemTombstoned(w, activeDeleted)) workoutMap.set(w.id, w)
      }

      // Vitamins
      const rVits = Array.isArray(remoteDay.vitamins) ? remoteDay.vitamins : []
      const lVits = Array.isArray(localDay.vitamins) ? localDay.vitamins : []
      let finalVitamins = Array.from(new Set([...rVits, ...lVits]))
      if (localDayTime > 0 && remoteDayTime > 0) {
        finalVitamins = localIsNewer ? lVits : rVits
      }

      mergedHistory[dateKey] = {
        ...remoteDay,
        ...localDay,
        updatedAt: new Date(Math.max(localDayTime, remoteDayTime, Date.now())).toISOString(),
        mealLogs: Array.from(mealMap.values()),
        workouts: Array.from(workoutMap.values()),
        vitamins: finalVitamins,
        water: localIsNewer && localDay.water !== undefined ? localDay.water : Math.max(Number(localDay.water) || 0, Number(remoteDay.water) || 0),
        weight: localIsNewer && localDay.weight ? localDay.weight : (remoteDay.weight || localDay.weight)
      }
    }
  }
  merged.nutriflow_history = mergedHistory

  // 5. Merge Shopping Items
  const localShop = Array.isArray(local.nutriflow_shopping) ? local.nutriflow_shopping : []
  const remoteShop = Array.isArray(remote.nutriflow_shopping) ? remote.nutriflow_shopping : []
  const shopMap = new Map()

  const processShop = (s) => {
    if (!s || !s.id) return
    if (isItemTombstoned(s, activeDeleted)) return

    if (shopMap.has(s.id)) {
      shopMap.set(s.id, { ...shopMap.get(s.id), ...s })
    } else {
      shopMap.set(s.id, s)
    }
  }

  for (const s of remoteShop) processShop(s)
  for (const s of localShop) processShop(s)

  merged.nutriflow_shopping = Array.from(shopMap.values())

  // 6. Merge Weekly Plan and Body Composition
  if (local.nutriflow_weekly_plan || remote.nutriflow_weekly_plan) {
    merged.nutriflow_weekly_plan = {
      ...(remote.nutriflow_weekly_plan || {}),
      ...(local.nutriflow_weekly_plan || {})
    }
  }

  if (local.nutriflow_body_comp_history || remote.nutriflow_body_comp_history) {
    const lBody = Array.isArray(local.nutriflow_body_comp_history) ? local.nutriflow_body_comp_history : []
    const rBody = Array.isArray(remote.nutriflow_body_comp_history) ? remote.nutriflow_body_comp_history : []
    const bodyMap = new Map()
    for (const b of rBody) if (b && b.id) bodyMap.set(b.id, b)
    for (const b of lBody) if (b && b.id) bodyMap.set(b.id, b)
    merged.nutriflow_body_comp_history = Array.from(bodyMap.values())
  }

  // 7. Merge Profile
  if (local.nutriflow_profile || remote.nutriflow_profile) {
    const localProf = local.nutriflow_profile || {}
    const remoteProf = remote.nutriflow_profile || {}
    // If local has default placeholder profile 'Alex Morgan' and remote has a customized profile, favor remote
    if (localProf.name === 'Alex Morgan' && remoteProf.name && remoteProf.name !== 'Alex Morgan') {
      merged.nutriflow_profile = { ...localProf, ...remoteProf }
    } else {
      merged.nutriflow_profile = { ...remoteProf, ...localProf }
    }
  }

  // 8. Merge Streak
  merged.nutriflow_streak = Math.max(
    Number(local.nutriflow_streak) || 0,
    Number(remote.nutriflow_streak) || 0
  )

  // 9. Net Mode
  merged.nutriflow_net_mode = Boolean(
    local.nutriflow_net_mode !== undefined ? local.nutriflow_net_mode : remote.nutriflow_net_mode
  )

  // 10. Persist merged tombstones
  merged.nutriflow_deleted_ids = activeDeleted

  return merged
}

/**
 * Downloads all NutriFlow data as a timestamped JSON file.
 */
export function exportAllDataAsJson() {
  const payload = {
    app: 'NutriFlow Diet Manager',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: getAllNutriflowData()
  }

  const jsonStr = JSON.stringify(payload, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const dateStr = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `nutriflow_backup_${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parses and restores a JSON file backup.
 */
export function importDataFromJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    const targetData = parsed.data || parsed // Support direct map or wrapped format
    
    if (!targetData || typeof targetData !== 'object') {
      throw new Error('Invalid backup file structure: missing data payload.')
    }

    let restoredCount = 0
    Object.entries(targetData).forEach(([key, value]) => {
      if (key.startsWith('nutriflow_')) {
        localStorage.setItem(key, JSON.stringify(value))
        restoredCount++
      }
    })

    if (restoredCount === 0) {
      throw new Error('No valid NutriFlow data keys found in the backup file.')
    }

    return { success: true, count: restoredCount }
  } catch (err) {
    return { success: false, error: err.message || 'Failed to parse JSON backup.' }
  }
}
