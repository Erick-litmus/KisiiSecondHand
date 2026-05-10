self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event) => {
  // Simple fetch handler to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});
