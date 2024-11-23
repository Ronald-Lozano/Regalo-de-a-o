const CACHE_NAME = 'love-quiz-cache-v1';
const BASE_PATH = '/Regalo-de-a-o/';

// Separa los recursos locales de los externos
const localResources = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'css/styles.css',
    BASE_PATH + 'js/index.js',
    BASE_PATH + 'manifest.json', // Removido './' innecesario
    BASE_PATH + 'icons/icon-72x72.png',
    BASE_PATH + 'icons/icon-96x96.png',
    BASE_PATH + 'icons/icon-128x128.png',
    BASE_PATH + 'icons/icon-144x144.png',
    BASE_PATH + 'icons/icon-152x152.png',
    BASE_PATH + 'icons/icon-192x192.png',
    BASE_PATH + 'icons/icon-384x384.png',
    BASE_PATH + 'icons/icon-512x512.png',
    BASE_PATH + 'Mi Corazon Encantado - Dragon Ball GT Letra.mp3',
    BASE_PATH + 'Fotos/Foto1.jpg',
    BASE_PATH + 'Fotos/Foto2.jpg',
    BASE_PATH + 'Fotos/Foto3.jpg',
    BASE_PATH + 'Fotos/Foto4.jpg',
    BASE_PATH + 'Fotos/Foto5.jpg',
    BASE_PATH + 'Fotos/Foto6.jpg',
    BASE_PATH + 'Fotos/Foto7.jpg',
    BASE_PATH + 'Fotos/Foto8.jpg',
    BASE_PATH + 'Fotos/Foto9.jpg',
    BASE_PATH + 'Fotos/Foto10.jpg',
    BASE_PATH + 'Fotos/Foto11.jpg',
    BASE_PATH + 'Fotos/Foto12.jpg'
];

const externalResources = [
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('Iniciando cache');
                
                // Primero cachea los recursos locales
                for (const url of localResources) {
                    try {
                        await cache.add(url);
                    } catch (error) {
                        console.error('Error cacheando recurso local:', url, error);
                    }
                }

                // Luego cachea los recursos externos
                for (const url of externalResources) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            await cache.put(url, response);
                        }
                    } catch (error) {
                        console.error('Error cacheando recurso externo:', url, error);
                    }
                }

                console.log('Cache completado');
            })
    );
});

// Activación del Service Worker
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

// Estrategia de cache mejorada
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Maneja los recursos externos de manera diferente
    if (externalResources.includes(event.request.url)) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        // Intenta actualizar el cache en segundo plano
                        fetch(event.request)
                            .then(networkResponse => {
                                if (networkResponse.ok) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => cache.put(event.request, networkResponse));
                                }
                            });
                        return cachedResponse;
                    }
                    return fetch(event.request);
                })
        );
        return;
    }

    // Para recursos locales
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(networkResponse => {
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Error en fetch:', error);
                    });
            })
    );
});