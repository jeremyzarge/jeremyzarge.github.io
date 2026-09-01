const CACHE = "vitemeals-v1";
const PRECACHE = ["/", "/index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try the network, fall back to cache for navigation requests
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("/index.html"))
    );
  }
});

// ─── Push Notifications ───────────────────────────────────────────────────────

// Sets the home-screen app icon badge to the number of notifications
// currently sitting in the OS tray for this app (best-effort, Chrome/Edge/iOS 16.4+).
async function updateAppBadge() {
  if (!("setAppBadge" in self.navigator)) return;
  const notifications = await self.registration.getNotifications();
  if (notifications.length > 0) {
    await self.navigator.setAppBadge(notifications.length);
  } else {
    await self.navigator.clearAppBadge();
  }
}

self.addEventListener("push", (e) => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration
      .showNotification(data.title || "ViteMeals", {
        body: data.body || "",
        icon: "/icon.svg",
        badge: "/icon.svg",
        tag: data.tag || "vitemeals",
        data: data.data || {},
        vibrate: [100, 50, 100],
      })
      .then(updateAppBadge)
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const data = e.notification.data || {};
  e.waitUntil(
    Promise.all([
      updateAppBadge(),
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
        const existing = wins.find((w) => w.url.includes(self.location.origin));
        if (existing) {
          // App is already open — focus it and post nav instructions
          existing.focus();
          existing.postMessage({ type: "notification-click", data });
          return;
        }
        // Cold-start — encode nav data in URL so app reads it on mount
        const param = btoa(JSON.stringify(data));
        return clients.openWindow("/?notif=" + param);
      }),
    ])
  );
});
