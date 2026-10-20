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
