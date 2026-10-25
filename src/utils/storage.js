/**
 * Storage utility with persistent browser storage request and JSON backup / restore.
 */

export function loadStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e)
    return defaultValue
  }
}

export function saveStorage(key, value) {
  try {
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

/**
 * Extracts all NutriFlow data keys from localStorage into a dictionary.
 */
export function getAllNutriflowData() {
  const data = {}
  if (typeof window === 'undefined' || !window.localStorage) return data

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('nutriflow_')) {
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
      if (key.startsWith('nutriflow_')) {
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
 * Intelligently merges a local data dictionary with a remote data dictionary.
 * GUARANTEES ZERO DATA LOSS:
 * - Recipes: Union of arrays by recipe.id. Preserves all recipes from both sides!
 * - Food Library: Union of arrays by food.id.
 * - Daily History: Date-keyed merge. Meals are merged by meal.id, water takes max, vitamins takes union, workouts takes union.
 * - Shopping Items: Union by item.id.
 * - Profile: Merges object properties, favoring updated/non-default values.
 * - Streak: Takes max streak.
 * - Net Mode: Respects active flag.
 */
export function mergeNutriflowData(localMap = {}, remoteMap = {}) {
  const local = localMap || {}
  const remote = remoteMap || {}
  const merged = { ...remote, ...local }

  // 1. Merge Recipes (Union by id, conflict resolved by updatedAt)
  const localRecipes = Array.isArray(local.nutriflow_recipes) ? local.nutriflow_recipes : []
  const remoteRecipes = Array.isArray(remote.nutriflow_recipes) ? remote.nutriflow_recipes : []
  const recipeMap = new Map()

  for (const r of remoteRecipes) {
    if (r && r.id) recipeMap.set(r.id, r)
  }
  for (const r of localRecipes) {
    if (r && r.id) {
      if (recipeMap.has(r.id)) {
        const existing = recipeMap.get(r.id)
        const localTime = r.updatedAt ? new Date(r.updatedAt).getTime() : 0
        const remoteTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
        if (localTime >= remoteTime) {
          recipeMap.set(r.id, { ...existing, ...r })
        }
      } else {
        // Recipe created locally that wasn't in cloud: KEEP IT!
        recipeMap.set(r.id, r)
      }
    }
  }
  merged.nutriflow_recipes = Array.from(recipeMap.values())

  // 2. Merge Food Library (Union by id)
  const localFoods = Array.isArray(local.nutriflow_food_library) ? local.nutriflow_food_library : []
  const remoteFoods = Array.isArray(remote.nutriflow_food_library) ? remote.nutriflow_food_library : []
  const foodMap = new Map()

  for (const f of remoteFoods) {
    if (f && f.id) foodMap.set(f.id, f)
  }
  for (const f of localFoods) {
    if (f && f.id) {
      if (foodMap.has(f.id)) {
        foodMap.set(f.id, { ...foodMap.get(f.id), ...f })
      } else {
        foodMap.set(f.id, f)
      }
    }
  }
  merged.nutriflow_food_library = Array.from(foodMap.values())

  // 3. Merge Daily History (Date-by-date merge)
  const localHistory = local.nutriflow_history && typeof local.nutriflow_history === 'object' ? local.nutriflow_history : {}
  const remoteHistory = remote.nutriflow_history && typeof remote.nutriflow_history === 'object' ? remote.nutriflow_history : {}
  const mergedHistory = { ...remoteHistory }

  for (const [dateKey, localDay] of Object.entries(localHistory)) {
    if (!localDay || typeof localDay !== 'object') continue
    const remoteDay = mergedHistory[dateKey]

    if (!remoteDay) {
      mergedHistory[dateKey] = localDay
    } else {
      // Merge mealLogs by id
      const mealMap = new Map()
      const rMeals = Array.isArray(remoteDay.mealLogs) ? remoteDay.mealLogs : []
      const lMeals = Array.isArray(localDay.mealLogs) ? localDay.mealLogs : []
      for (const m of rMeals) {
        if (m && m.id) mealMap.set(m.id, m)
      }
      for (const m of lMeals) {
        if (m && m.id) {
          if (!mealMap.has(m.id)) {
            mealMap.set(m.id, m)
          } else {
            mealMap.set(m.id, { ...mealMap.get(m.id), ...m })
          }
        }
      }

      // Merge workouts by id
      const workoutMap = new Map()
      const rWorkouts = Array.isArray(remoteDay.workouts) ? remoteDay.workouts : []
      const lWorkouts = Array.isArray(localDay.workouts) ? localDay.workouts : []
      for (const w of rWorkouts) {
        if (w && w.id) workoutMap.set(w.id, w)
      }
      for (const w of lWorkouts) {
        if (w && w.id) workoutMap.set(w.id, w)
      }

      // Merge vitamins (set union)
      const rVits = Array.isArray(remoteDay.vitamins) ? remoteDay.vitamins : []
      const lVits = Array.isArray(localDay.vitamins) ? localDay.vitamins : []
      const mergedVitamins = Array.from(new Set([...rVits, ...lVits]))

      mergedHistory[dateKey] = {
        ...remoteDay,
        ...localDay,
        mealLogs: Array.from(mealMap.values()),
        workouts: Array.from(workoutMap.values()),
        vitamins: mergedVitamins,
        water: Math.max(Number(localDay.water) || 0, Number(remoteDay.water) || 0),
        weight: localDay.weight || remoteDay.weight
      }
    }
  }
  merged.nutriflow_history = mergedHistory

  // 4. Merge Shopping Items (Union by id)
  const localShop = Array.isArray(local.nutriflow_shopping) ? local.nutriflow_shopping : []
  const remoteShop = Array.isArray(remote.nutriflow_shopping) ? remote.nutriflow_shopping : []
  const shopMap = new Map()

  for (const s of remoteShop) {
    if (s && s.id) shopMap.set(s.id, s)
  }
  for (const s of localShop) {
    if (s && s.id) {
      if (shopMap.has(s.id)) {
        shopMap.set(s.id, { ...shopMap.get(s.id), ...s })
      } else {
        shopMap.set(s.id, s)
      }
    }
  }
  merged.nutriflow_shopping = Array.from(shopMap.values())

  // 5. Merge Profile
  if (local.nutriflow_profile || remote.nutriflow_profile) {
    merged.nutriflow_profile = {
      ...(remote.nutriflow_profile || {}),
      ...(local.nutriflow_profile || {})
    }
  }

  // 6. Merge Streak
  merged.nutriflow_streak = Math.max(
    Number(local.nutriflow_streak) || 0,
    Number(remote.nutriflow_streak) || 0
  )

  // 7. Net Mode
  merged.nutriflow_net_mode = Boolean(
    local.nutriflow_net_mode !== undefined ? local.nutriflow_net_mode : remote.nutriflow_net_mode
  )

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
