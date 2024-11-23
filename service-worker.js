const CACHE_NAME = 'love-quiz-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './index.js',
    './manifest.json',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './Mi Corazon Encantado - Dragon Ball GT Letra.mp3',
    './Fotos/Foto1.jpg',
    './Fotos/Foto2.jpg',
    './Fotos/Foto3.jpg',
    './Fotos/Foto4.jpg',
    './Fotos/Foto5.jpg',
    './Fotos/Foto6.jpg',
    './Fotos/Foto7.jpg',
    './Fotos/Foto8.jpg',
    './Fotos/Foto9.jpg',
    './Fotos/Foto10.jpg',
    './Fotos/Foto11.jpg',
    './Fotos/Foto12.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

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

// Estrategia de cache: Network First con fallback a cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si la respuesta es válida, clónala y guárdala en el cache
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, intenta recuperar del cache
                return caches.match(event.request);
            })
    );
});