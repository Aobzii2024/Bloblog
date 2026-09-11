/* Service Worker: offline support for a static blog.

Caching policy is deliberately conservative — the site ships hashed-free
filenames, so an aggressive cache would serve stale CSS/JS after an update.

  - page navigations: network-first, fall back to cache (offline reading)
  - font files:       cache-first (immutable, versioned by filename)
  - css/js/images:    stale-while-revalidate

Everything is runtime-cached; nothing is pre-cached at install, so a deploy
never leaves users on a mix of old shell and new assets.
*/

const CACHE = 'bloblog-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

const isFont = (url) => /\.(woff2?|ttf|otf|eot)$/.test(url.pathname);
const isNav = (req) => req.mode === 'navigate';

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'no-cors') return;

  if (isNav(req)) {
    // Network first so fresh content wins; cache only rescues an offline read.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  if (isFont(url)) {
    // Fonts are content-addressed and immutable — serve from cache.
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // Assets: serve instantly from cache if present, refresh in the background.
  event.respondWith(
    caches.match(req).then((hit) => {
      const refresh = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => hit);
      return hit || refresh;
    })
  );
});
