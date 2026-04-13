const CACHE_NAME = 'freshkart-cache-v2';
const DATA_CACHE_NAME = 'freshkart-data-cache-v2';

const FILES_TO_CACHE = [
    './',
    'index.html',
    'cart.html',
    'delivery.html',
    'login.html',
    'signup.html',
    'orders.html',
    'admin.html',
    'offline.html',
    'css/style.css',
    'js/app.js',
    'manifest.json',
    'assets/images/hero.png',
    'assets/images/bananas.png',
    'assets/images/tomatoes.png',
    'assets/images/bread.png',
    'assets/images/milk.png',
    'assets/images/apples.png',
    'assets/images/spinach.png',
    'assets/images/eggs.png',
    'assets/images/icon-192.png',
    'assets/images/icon-512.png'
];

// Install Event - Precache core files
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// Fetch Event - Advanced Strategy
self.addEventListener('fetch', (evt) => {
    // We only want to intercept HTTP/HTTPS requests
    if (evt.request.url.startsWith('chrome-extension') || evt.request.url.includes('extension')) return;

    if (evt.request.mode !== 'navigate') {
        // Stale-While-Revalidate for images, scripts, css
        evt.respondWith(
            caches.match(evt.request).then((cachedResponse) => {
                const fetchPromise = fetch(evt.request).then((networkResponse) => {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(evt.request, networkResponse.clone());
                    });
                    return networkResponse;
                }).catch(() => {});
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Network-First for Navigation Requests (HTML pages)
    evt.respondWith(
        fetch(evt.request)
            .then((response) => {
                return caches.open(DATA_CACHE_NAME).then((cache) => {
                    cache.put(evt.request.url, response.clone());
                    return response;
                });
            })
            .catch(() => {
                return caches.match(evt.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    return caches.match('offline.html');
                });
            })
    );
});
