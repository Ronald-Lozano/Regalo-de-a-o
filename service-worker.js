const CACHE_NAME = 'love-quiz-cache-v1';
const BASE_PATH = '/Regalo-de-a-o/';

// Separa los recursos locales de los externos
const localResources = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'css/styles.css',
    BASE_PATH + 'js/index.js',
    BASE_PATH + 'manifest.json',
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

// URL externa corregida
const CDN_RESOURCES = [
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('Iniciando cache');
                
                // Cachear recursos locales
                await Promise.all(
                    localResources.map(async url => {
                        try {
                            await cache.add(url);
                        } catch (error) {
                            console.error('Error cacheando recurso local:', url, error);
                        }
                    })
                );

                // Cachear recursos CDN
                await Promise.all(
                    CDN_RESOURCES.map(async url => {
                        try {
                            const response = await fetch(url, { mode: 'cors' });
                            if (response.ok) {
                                await cache.put(url, response);
                                console.log('Recurso CDN cacheado con éxito:', url);
                            }
                        } catch (error) {
                            console.error('Error cacheando recurso CDN:', url, error);
                        }
                    })
                );

                console.log('Cache completado');
            })
    );
});

// Activación
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

// Estrategia de fetch
self.addEventListener('fetch', event => {
    // Verifica si es un recurso CDN
    const isCDNResource = CDN_RESOURCES.includes(event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then(async response => {
                // Si está en cache, lo devolvemos
                if (response) {
                    return response;
                }

                try {
                    // Si no está en cache, lo buscamos en la red
                    const networkResponse = await fetch(event.request);
                    
                    // Solo cacheamos respuestas válidas
                    if (networkResponse && networkResponse.status === 200) {
                        const cache = await caches.open(CACHE_NAME);
                        // Para recursos CDN, usamos put
                        if (isCDNResource) {
                            await cache.put(event.request, networkResponse.clone());
                        }
                        // Para recursos locales, usamos add
                        else if (event.request.url.includes(BASE_PATH)) {
                            try {
                                await cache.add(event.request.url);
                            } catch (error) {
                                console.error('Error cacheando recurso local:', event.request.url);
                            }
                        }
                    }
                    
                    return networkResponse;
                } catch (error) {
                    console.error('Error en fetch:', error);
                    // Aquí podrías devolver una respuesta fallback si lo deseas
                    return new Response('Error de red', { status: 404 });
                }
            })
    );
});