// Minimal hand-written service worker (no Workbox — keeps the dependency
// list short, per project convention). Responsibilities:
//   1. Cache the app shell so the last-viewed screen still opens offline.
//   2. Receive Web Push events and show a Notification even if the app is
//      closed (this is what makes "full level" reminders possible, spec §17).
//   3. Focus/open the app when a notification is clicked.

const CACHE_NAME = "ev-planner-shell-v1";
const APP_SHELL = ["/", "/dashboard", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Network-first for navigations (always prefer live data), falling back to
// the cached shell when offline. Everything else passes through untouched.
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || caches.match("/dashboard")),
    ),
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Edward & Vale", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "Edward & Vale", {
      body: payload.body,
      tag: payload.tag,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("/dashboard") && "focus" in client) return client.focus();
      }
      return self.clients.openWindow("/dashboard");
    }),
  );
});
