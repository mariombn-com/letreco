/* eslint-disable no-restricted-globals */

// Nome do cache - atualizar a versão força atualização do cache
const CACHE_NAME = 'appalavra-v2';

// Arquivos para cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/css/main.chunk.css',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/icons/48x48.png',
  '/icons/72x72.png',
  '/icons/96x96.png',
  '/icons/144x144.png',
  '/icons/168x168.png',
  '/icons/192x192.png',
  '/icons/512x512.png',
  '/splash.png',
  '/piquinim.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        // Tenta cachear todos os arquivos, mas não falha se algum não existir
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Não foi possível cachear ${url}:`, err);
              return Promise.resolve();
            })
          )
        );
      })
  );
  // Força o service worker a se tornar ativo imediatamente
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Toma controle de todas as páginas imediatamente
  return self.clients.claim();
});

// Escuta mensagens para pular a espera
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estratégia: Network First com fallback para Cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignora requisições de outros domínios (como CDNs)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta foi bem-sucedida, clona e salva no cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar (offline), tenta buscar do cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se não houver no cache e for navegação, retorna a página principal
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
