/**
 * NutriFlow Service Worker
 * Provides offline capabilities, shell caching, and instant startup
 */

const CACHE_NAME = 'nutriflow-cache-v1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
]

// Install event: Precache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache asset fetch notice:', err)
      })
    }).then(() => self.skipWaiting())
  )
})

// Activate event: Clean up previous cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event: Network-first for dynamic navigation, Cache-first for static scripts/styles/fonts
self.addEventListener('fetch', (event) => {
  const req = event.request

  // Only handle GET requests
  if (req.method !== 'GET') return

  // Skip chrome-extension or non-http URLs
  if (!req.url.startsWith('http')) return

  // For OpenFoodFacts API, try network only to always get latest barcode data, with network error catch
  if (req.url.includes('openfoodfacts.org')) {
    return
  }

  // HTML navigation: Network-first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          }
          return response
        })
        .catch(() => caches.match('/index.html') || caches.match('/'))
    )
    return
  }

  // Static assets (CSS, JS, Fonts, Images): Cache-first with background network revalidation
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse))
          }
        }).catch(() => {/* Ignore background fetch failures */})
        return cachedResponse
      }

      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse
        }
        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(req, responseToCache))
        return networkResponse
      }).catch((err) => {
        console.warn('[SW] Offline fetch fallback:', err)
      })
    })
  )
})
