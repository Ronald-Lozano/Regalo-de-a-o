const CACHE_NAME = 'love-quiz-cache-v1';
const BASE_PATH = '/Regalo-de-a-o/';
const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'css/styles.css',
    BASE_PATH + 'js/index.js',
    BASE_PATH + './manifest.json',
    BASE_PATH + './icons/icon-72x72.png',
    BASE_PATH + './icons/icon-96x96.png',
    BASE_PATH + './icons/icon-128x128.png',
    BASE_PATH + './icons/icon-144x144.png',
    BASE_PATH + './icons/icon-152x152.png',
    BASE_PATH + './icons/icon-192x192.png',
    BASE_PATH + './icons/icon-384x384.png',
    BASE_PATH + './icons/icon-512x512.png',
    BASE_PATH + './Mi Corazon Encantado - Dragon Ball GT Letra.mp3',
    BASE_PATH + './Fotos/Foto1.jpg',
    BASE_PATH + './Fotos/Foto2.jpg',
    BASE_PATH + './Fotos/Foto3.jpg',
    BASE_PATH + './Fotos/Foto4.jpg',
    BASE_PATH + './Fotos/Foto5.jpg',
    BASE_PATH + './Fotos/Foto6.jpg',
    BASE_PATH + './Fotos/Foto7.jpg',
    BASE_PATH + './Fotos/Foto8.jpg',
    BASE_PATH + './Fotos/Foto9.jpg',
    BASE_PATH + './Fotos/Foto10.jpg',
    BASE_PATH + './Fotos/Foto11.jpg',
    BASE_PATH + './Fotos/Foto12.jpg',
    BASE_PATH + 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Iniciando cache');
                // Cachea los recursos uno por uno y maneja los errores individualmente
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(error => {
                            console.error('Error cacheando ' + url + ': ' + error);
                        });
                    })
                );
            })
            .then(() => {
                console.log('Cache completado');
            })
            .catch(error => {
                console.error('Error en la instalación del cache:', error);
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

// Estrategia de cache: Cache First con network fallback
self.addEventListener('fetch', event => {
    // Ignora las solicitudes que no comienzan con tu BASE_PATH
    if (!event.request.url.includes(BASE_PATH)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si encontramos una coincidencia en el cache, la devolvemos
                if (response) {
                    return response;
                }

                // Si no está en cache, hacemos la solicitud a la red
                return fetch(event.request)
                    .then(networkResponse => {
                        // Verifica que obtuvimos una respuesta válida
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Clona la respuesta antes de cachearla
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Error en fetch:', error);
                        // Aquí podrías devolver una respuesta fallback
                    });
            })
    );
});