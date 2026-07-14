const CACHE = 'dream-aquarium-v7';
const BASE_URL = new URL('./', self.registration.scope).pathname;
const ASSETS = ['', 'index.html', 'manifest.webmanifest', 'icon.svg'].map(asset => `${BASE_URL}${asset}`);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    const clone = response.clone();
    if (new URL(event.request.url).origin === location.origin) caches.open(CACHE).then(cache => cache.put(event.request, clone));
    return response;
  }).catch(() => caches.match(BASE_URL))));
});
