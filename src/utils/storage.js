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
