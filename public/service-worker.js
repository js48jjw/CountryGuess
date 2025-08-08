const CACHE_NAME = 'country-guess-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/sound/Clap%20BGM.mp3',
  '/sound/x%20BGM.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // POST 등은 제외
  const url = new URL(request.url);

  // 이미지(국기 포함) 또는 사운드는 Cache First
  const isImage = request.destination === 'image' || url.pathname.startsWith('/nation') || url.pathname.startsWith('/Nation');
  const isSound = url.pathname.startsWith('/sound/');

  if (isImage || isSound) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const resp = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, resp.clone());
          return resp;
        } catch (e) {
          // 이미지/사운드 실패 시 캐시 fallback (없으면 실패)
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // 그 외는 Network First
  event.respondWith(
    (async () => {
      try {
        const resp = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, resp.clone());
        return resp;
      } catch (e) {
        const cached = await caches.match(request);
        if (cached) return cached;
        // 네비게이션 요청이면 홈으로 fallback
        if (request.mode === 'navigate') {
          const home = await caches.match('/');
          if (home) return home;
        }
        return Response.error();
      }
    })()
  );
});