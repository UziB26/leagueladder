// Service Worker for League Ladder PWA
const CACHE_NAME = 'league-ladder-v3'
const RUNTIME_CACHE = 'league-ladder-runtime-v3'

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/leaderboard',
  '/challenges',
  '/matches',
  '/manifest.json',
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets')
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE
            )
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
    .then(() => {
      // Clear all runtime caches to ensure fresh CSS/HTML
      return caches.delete(RUNTIME_CACHE).catch(() => {})
    })
    .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip API requests (always fetch fresh)
  if (event.request.url.includes('/api/')) {
    return
  }

  // Skip auth requests
  if (event.request.url.includes('/auth/')) {
    return
  }

  // Don't cache CSS files - always fetch fresh to get latest styles
  if (event.request.url.includes('.css') || 
      event.request.url.includes('_next/static/css') ||
      event.request.url.includes('globals.css')) {
    event.respondWith(fetch(event.request))
    return
  }

  // Don't cache HTML/document pages - always fetch fresh to get latest UI
  // Also skip caching for any page routes (no file extension)
  if (event.request.destination === 'document' || 
      event.request.url.endsWith('.html') || 
      event.request.url.endsWith('/') || 
      !event.request.url.includes('.') ||
      event.request.url.includes('/dashboard') ||
      event.request.url.includes('/leaderboard') ||
      event.request.url.includes('/challenges') ||
      event.request.url.includes('/matches') ||
      event.request.url.includes('/leagues') ||
      event.request.url.includes('/players') ||
      event.request.url.includes('/auth')) {
    // Always fetch from network for pages, never use cache
    event.respondWith(
      fetch(event.request).catch(() => {
        // Only fallback to cache if network completely fails
        return caches.match(event.request)
      })
    )
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available (only for static assets like images, fonts)
        if (cachedResponse) {
          return cachedResponse
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Only cache static assets (images, fonts, etc.) - not CSS or HTML
            const url = event.request.url
            const shouldCache = url.includes('.png') || 
                               url.includes('.jpg') || 
                               url.includes('.jpeg') || 
                               url.includes('.svg') || 
                               url.includes('.woff') || 
                               url.includes('.woff2') ||
                               url.includes('_next/static/media')

            if (shouldCache) {
              // Clone the response
              const responseToCache = response.clone()

              // Cache the fetched response
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                })
            }

            return response
          })
          .catch(() => {
            // If fetch fails, return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for offline actions (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks here
      console.log('[Service Worker] Background sync triggered')
    )
  }
})

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification('League Ladder', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
