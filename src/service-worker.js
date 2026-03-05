/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  ({ request, url }) => {
    if (request.mode !== "navigate") {
      return false;
    }
    if (url.pathname.startsWith("/_")) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// Cache images
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith(".png"),
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: "api-responses",
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Cache static assets
registerRoute(
  ({ request }) => request.destination === "style" || request.destination === "script" || request.destination === "font",
  new CacheFirst({
    cacheName: "static-assets",
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Background sync para operaciones offline
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-movements") {
    event.waitUntil(syncMovements());
  }
});

async function syncMovements() {
  try {
    const cache = await caches.open("offline-movements");
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await fetch(request);
      if (response.ok) {
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error("Error syncing movements:", error);
  }
}