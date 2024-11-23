const CACHE_NAME = 'love-quiz-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/index.js',
    '/manifest.json',
    '/Mi Corazon Encantado - Dragon Ball GT Letra.mp3',
    '/Fotos/Foto1.jpg',
    '/Fotos/Foto2.jpg',
    '/Fotos/Foto3.jpg',
    '/Fotos/Foto4.jpg',
    '/Fotos/Foto5.jpg',
    '/Fotos/Foto6.jpg',
    '/Fotos/Foto7.jpg',
    '/Fotos/Foto8.jpg',
    '/Fotos/Foto9.jpg',
    '/Fotos/Foto10.jpg',
    '/Fotos/Foto11.jpg',
    '/Fotos/Foto12.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});