
const CACHE_NAME = 'hmizik-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('SW installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  
  if (event.request.url.includes('supabase.co')) {
    
    
    return;
  }

  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});