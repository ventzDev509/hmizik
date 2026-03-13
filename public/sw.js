// public/sw.js
const CACHE_NAME = 'hmizik-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('SW installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Si se yon imaj oswa yon mizik ki soti nan Supabase
  if (event.request.url.includes('supabase.co')) {
    // Nou kite navigatè a fè fetch la nòmalman san entèvansyon SW la
    // Sa evite erè "opaque response" la
    return;
  }

  // Pou rès requet yo (PWA a)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});