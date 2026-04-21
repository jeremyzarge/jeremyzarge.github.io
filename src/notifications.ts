import { ref, get, set } from "firebase/database";
import { rtdb } from "./firebaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// PASTE YOUR KEYS HERE
// ─────────────────────────────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY = "BB8_4h8I3GIIXoNjUZFH6dHay0CyG2Zxd1wi7oYhESunWNooQfZtaQ6-Ixz-cXFeaG09ISfn-e-8N9gQ24zPLFU";

// After deploying the Cloudflare Worker, paste its URL here:
const WORKER_URL = "http://localhost:8787";

// Pick any random string — paste the same value into the Worker's
// NOTIFICATION_SECRET environment variable via:  npx wrangler secret put NOTIFICATION_SECRET
const NOTIFICATION_SECRET = "b3c9cfae63e6dc6a1922c342dd90964d";
// ─────────────────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(b64: string): Uint8Array {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function subKey(endpoint: string): string {
  return btoa(endpoint).replace(/[^a-zA-Z0-9]/g, "").slice(-24);
}

/** Call once after the user logs in to register their device for push. */
export async function initPushNotifications(userId: string): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  try {
    const permission = await Notification.requestPermission();
    console.log("[push] permission:", permission);
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    console.log("[push] SW ready:", registration.active?.scriptURL);
    let sub = await registration.pushManager.getSubscription();
    if (!sub) {
      sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }
    console.log("[push] subscription:", sub.endpoint);

    const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
    await set(ref(rtdb, `users/${userId}/push_subscriptions/${subKey(json.endpoint)}`), {
      endpoint: json.endpoint,
      keys: json.keys,
      updatedAt: Date.now(),
    });
    console.log("[push] subscription saved to RTDB for user", userId);
  } catch (err) {
    console.warn("[push] setup failed:", err);
  }
}

/** Call on sign-out to clean up this device's subscription. */
export async function removePushSubscription(userId: string): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (!sub) return;
    await sub.unsubscribe();
    await set(ref(rtdb, `users/${userId}/push_subscriptions/${subKey(sub.endpoint)}`), null);
  } catch (err) {
    console.warn("Push cleanup failed:", err);
  }
}

/** Send a push notification to one or more users. Fire-and-forget — never throws. */
export async function notifyUsers(
  recipientIds: string[],
  notification: { title: string; body: string; tag?: string; data?: Record<string, string> }
): Promise<void> {
  console.log("[push] notifyUsers called, recipients:", recipientIds, "notification:", notification);
  if (recipientIds.length === 0) return;
  try {
    const subscriptions: unknown[] = [];
    await Promise.all(
      recipientIds.map(async (uid) => {
        const snap = await get(ref(rtdb, `users/${uid}/push_subscriptions`));
        console.log("[push] subscriptions for", uid, ":", snap.exists() ? snap.val() : "none");
        if (snap.exists()) Object.values(snap.val()).forEach((s) => subscriptions.push(s));
      })
    );
    console.log("[push] total subscriptions found:", subscriptions.length);
    if (subscriptions.length === 0) return;

    await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Notification-Secret": NOTIFICATION_SECRET,
      },
      body: JSON.stringify({ subscriptions, notification }),
    });
  } catch (err) {
    console.warn("notifyUsers failed:", err);
  }
}
