/**
 * SERVICE WORKER - De porZone PWA
 * Diseño Web II - SIS-0141 | Ing. Miguel Angel Cruz Ramos
 * Estrategia: Cache First con Network Fallback para Offline-First
 */

const CACHE_NAME = 'deporzone-v1.0.1';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './pwa/tarjeta.css',
    './pwa/tarjeta.js',
    './pwa/data/canchas.json',
    './pwa/data/horarios.json',
    './pwa/icons/icon-192.png',
    './pwa/icons/icon-512.png',
    // Semana 1
    './semana1/01-modo-oscuro/index.html',
    './semana1/01-modo-oscuro/styles.css',
    './semana1/01-modo-oscuro/script.js',
    './semana1/02-filtro-catalogo/index.html',
    './semana1/02-filtro-catalogo/styles.css',
    './semana1/02-filtro-catalogo/script.js',
    './semana1/03-menu-hamburguesa/index.html',
    './semana1/03-menu-hamburguesa/styles.css',
    './semana1/03-menu-hamburguesa/script.js',
    './semana1/04-validacion-formulario/index.html',
    './semana1/04-validacion-formulario/styles.css',
    './semana1/04-validacion-formulario/script.js',
    './semana1/05-bitacora-dia1/index.html',
    './semana1/05-bitacora-dia1/styles.css',
    './semana1/05-bitacora-dia1/script.js',
    './semana1/06-bitacora-dia2/index.html',
    './semana1/06-bitacora-dia2/styles.css',
    './semana1/06-bitacora-dia2/script.js',
    // Semana 2
    './semana2/01-jquery-acordeon-temas/index.html',
    './semana2/01-jquery-acordeon-temas/styles.css',
    './semana2/01-jquery-acordeon-temas/script.js',
    './semana2/02-calculador-modal-timer/index.html',
    './semana2/02-calculador-modal-timer/styles.css',
    './semana2/02-calculador-modal-timer/script.js',
    './semana2/03-fetch-lazyloading/index.html',
    './semana2/03-fetch-lazyloading/styles.css',
    './semana2/03-fetch-lazyloading/script.js',
    './semana2/04-arquitectura-pwa-offline/index.html',
    './semana2/04-arquitectura-pwa-offline/styles.css',
    './semana2/04-arquitectura-pwa-offline/script.js',
    './semana2/05-seguridad-xss-responsividad-login/index.html',
    './semana2/05-seguridad-xss-responsividad-login/styles.css',
    './semana2/05-seguridad-xss-responsividad-login/script.js',
    // Semana 3
    './semana3/01-componentes-encapsulamiento/index.html',
    './semana3/01-componentes-encapsulamiento/styles.css',
    './semana3/01-componentes-encapsulamiento/script.js',
    './semana3/02-mobile-first-grid-flexbox/index.html',
    './semana3/02-mobile-first-grid-flexbox/styles.css',
    './semana3/02-mobile-first-grid-flexbox/script.js',
    './semana3/03-cwv-bem-dompurify-sw/index.html',
    './semana3/03-cwv-bem-dompurify-sw/styles.css',
    './semana3/03-cwv-bem-dompurify-sw/script.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Solo solicitudes GET
    if (event.request.method !== 'GET') return;

    // Responder desde la caché primero, con fallback de red
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                // Si la respuesta es válida, clonarla y guardarla dinámicamente si es del mismo origen
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Fallback offline para navegación HTML
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
