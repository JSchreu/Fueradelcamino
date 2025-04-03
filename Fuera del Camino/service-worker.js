const CACHE_NAME = 'wijn-proefmethode-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/fonts/fa-solid/fa-solid-900.woff2',
    '/fonts/fa-solid/fa-solid-900.woff',
    '/fonts/fa-solid/fa-solid-900.ttf',
    '/fonts/fa-solid/fa-solid-900.eot',
    '/fonts/fa-solid/fa-solid-900.svg',
    '/images/background.jpg',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
];

// Installeer service worker en cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activeren van de service worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event handler voor offline functionaliteit
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone de request omdat het een stream is en maar één keer gebruikt kan worden
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check of we een geldige response hebben ontvangen
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone de response omdat het een stream is en maar één keer gebruikt kan worden
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Als de fetch mislukt, probeer een offline fallback te tonen
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
}); 