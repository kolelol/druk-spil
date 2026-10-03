/* Service worker: gør appen installerbar og brugbar uden net.
   Bump CACHE (og ?v= i index.html), når filer ændres. */
const CACHE = 'drukspil-v9';
const V = '?v=9';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './style.css' + V, './app.js' + V, './spotify.js' + V,
  './data/imposter-words.js' + V, './data/bombe-categories.js' + V, './data/hitster-songs.js' + V, './data/hitster-streams.js' + V,
  './games/imposter.js' + V, './games/bombe.js' + V, './games/hitster.js' + V,
  './fonts/LilitaOne-Regular.woff2', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Net først med kort timeout, ellers cache. Nye filer hentes, så snart der er net. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  /* Svaret fra Spotify-login (?code=...) skal aldrig gemmes */
  const q = new URL(e.request.url).searchParams;
  if (q.has('code') || q.has('error')) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const network = fetch(e.request).then(res => {
      if (res && res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => null);
    const timeout = new Promise(r => setTimeout(() => r(null), 3000));
    const fast = await Promise.race([network, timeout]);
    if (fast) return fast;
    if (cached) return cached;
    const late = await network;
    if (late) return late;
    if (e.request.mode === 'navigate') {
      const idx = await cache.match('./index.html');
      if (idx) return idx;
    }
    return new Response('Du er offline, og siden er ikke gemt endnu.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});
