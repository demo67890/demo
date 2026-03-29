// service-worker.js
const CACHE_NAME = 'banashree-mobile-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/products.html',
  '/product.html',
  '/about.html',
  '/offline.html',
  '/css/style.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/data-loader.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // HTML pages - network first, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the new page
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Static assets - cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(response => {
            // Cache the fetched response
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          });
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});