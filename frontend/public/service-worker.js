const CACHE_NAME = "v1"
const CACHEABLE_API_URLS = [
    "/history/get"
]
const TTL = 5 * 60 * 1000;

const isRequestCacheable = (url) => {
    return CACHEABLE_API_URLS.some(element => url.startsWith(element))
}

function isCacheValid(response) {
    if (!response) return false;

    const dateHeader = response.headers.get("sw-cache-time");
    if (!dateHeader) return false;

    const cacheTime = parseInt(dateHeader, 10);
    return Date.now() - cacheTime < TTL;
}

// intercept fetch
self.addEventListener("fetch", (event) => {
    const urlObj = new URL(event.request.url)

    if (!isRequestCacheable(urlObj.pathname)) return

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);

            // Return valid cache
            if (isCacheValid(cachedResponse)) {
                return cachedResponse;
            }

            try {
                // Fetch from network
                const networkResponse = await fetch(event.request);

                // Clone response
                const responseClone = networkResponse.clone();

                // Add timestamp header
                const headers = new Headers(responseClone.headers);
                headers.append("sw-cache-time", Date.now().toString());

                const body = await responseClone.blob();

                const newResponse = new Response(body, {
                    status: responseClone.status,
                    statusText: responseClone.statusText,
                    headers
                });

                // Save to cache
                cache.put(event.request, newResponse);

                return networkResponse;

            } catch (error) {
                // Fallback to cache if offline
                if (cachedResponse) return cachedResponse;
                throw error;
            }
        })()
    );
})

// activate new sw instantly without waiting for all the tabs to be closed, and then getting activated
self.addEventListener("install", () => {
    self.skipWaiting();
})

// upon activation remove all the old cache keys
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key)
                }
            }))
        })
    )
})