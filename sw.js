// Service Worker for MCL-N5-app
const CACHE_NAME = "mcl-n5-v1";
const ASSETS = [
  "/MCL-N5-app/",
  "/MCL-N5-app/index.html",
  // Add other assets as needed
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching assets...");
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("Cleaning old cache:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(event.request).then((response) => {
          // Cache the fetched response for future
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
      .catch(() => {
        // Optional: Return offline fallback page
        return caches.match("/MCL-N5-app/offline.html");
      }),
  );
});
const ASSETS = [
  "/MCL-N5-app/",
  "/MCL-N5-app/index.html",
  "/MCL-N5-app/manifest.json", // ← Add this line
  // Add other assets as needed
];
