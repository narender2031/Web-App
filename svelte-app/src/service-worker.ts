declare var self: ServiceWorkerGlobalScope;
import { build, files, timestamp } from '$service-worker';
/*
	`build` is an array of URL strings representing the files generated by Vite, suitable for caching with cache.addAll(build)
	`files` is an array of URL strings representing the files in your static directory, or whatever 
	directory is specified by config.kit.files.assets 
*/
const cached = new Set(files);
const ASSETS = `cache${timestamp}`;
const OFFLINE_VERSION = 1;
const CHACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(ASSETS)
			.then((cache) => cache.addAll(build))
			.then(() => {
				self.skipWaiting();
			})
	);

	event.waitUntil(
		(async () => {
			const chache = await caches.open(CHACHE_NAME);
			await chache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
		})()
	);

	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// delete old caches
			for (const key of keys) {
				if (key !== ASSETS) await caches.delete(key);
			}

			self.clients.claim();
		})
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

	const url = new URL(event.request.url);

	// don't try to handle e.g. data: URIs
	if (!url.protocol.startsWith('http')) return;

	// ignore dev server requests
	if (url.hostname === self.location.hostname && url.port !== self.location.port) return;

	// always serve static files and bundler-generated assets from cache
	if (url.host === self.location.host && cached.has(url.pathname)) {
		event.respondWith(caches.match(event.request));
		return;
	}

	// event.respondWith(
	// 	caches.match(event.request).then((response) => {
	// 		if (!response) {
	// 			//fall back to the network fetch
	// 			return fetch(event.request);
	// 		}
	// 		return response;
	// 	})
	// );

	// for pages, you might want to serve a shell `service-worker-index.html` file,
	// which Sapper has generated for you. It's not right for every
	// app, but if it's right for yours then uncomment this section
	/*
	if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
		event.respondWith(caches.match('/service-worker-index.html'));
		return;
	}
	*/

	if (event.request.cache === 'only-if-cached') return;

	// for everything else, try the network first, falling back to
	// cache if the user is offline. (If the pages never change, you
	// might prefer a cache-first approach to a network-first one.)
	event.respondWith(
		caches.open(`offline${timestamp}`).then(async (cache) => {
			try {
				const response = await fetch(event.request);
				cache.put(event.request, response.clone());
				return response;
			} catch (err) {
				const response = await cache.match(event.request);
				if (response) return response;

				throw err;
			}
		})
	);

	// Offline Page
	if (event.request.mode !== 'navigate') {
		return;
	}

	event.respondWith(
		(async () => {
			try {
				const networkRespone = await fetch(event.request);
				return networkRespone;
			} catch (err) {
				const cache = await caches.open(CHACHE_NAME);
				const chachedResponse = await cache.match(OFFLINE_URL);
				return chachedResponse;
			}
		})()
	);
});
