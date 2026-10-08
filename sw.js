const CACHE_NAME = 'ccp-cache-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Jangan cache request ke Apps Script agar sinkronisasi selalu real-time
    if (event.request.url.includes('script.google.com')) return;
    
    event.respondWith(
        fetch(event.request, { cache: 'no-store' })
        .then(networkResponse => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
            });
            return networkResponse;
        })
        .catch(() => {
            return caches.match(event.request);
        })
    );
});
