const CACHE_NAME = 'searope-war-v0.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './download.html',
  './searope war.html',
  './manifest.json',
  './icon-512.png'
];

// Install: Cache essential game files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Searope War 0.3.0: Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});

// Activate: Purge old versions of the cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Searope War: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Serve from cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file if it exists, otherwise fetch from internet
      return cachedResponse || fetch(event.request).catch(() => {
        // Optional: If both fail (offline & not in cache), return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
