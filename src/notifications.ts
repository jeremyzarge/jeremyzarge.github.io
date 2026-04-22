import { ref, get, set } from "firebase/database";
import { rtdb } from "./firebaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// PASTE YOUR KEYS HERE
// ─────────────────────────────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY = "BB8_4h8I3GIIXoNjUZFH6dHay0CyG2Zxd1wi7oYhESunWNooQfZtaQ6-Ixz-cXFeaG09ISfn-e-8N9gQ24zPLFU";

// After deploying the Cloudflare Worker, paste its URL here:
const WORKER_URL = "https://vitemeals-notifications.vitemeals.workers.dev";

// Pick any random string — paste the same value into the Worker's
// NOTIFICATION_SECRET environment variable via:  npx wrangler secret put NOTIFICATION_SECRET
const NOTIFICATION_SECRET = "b3c9cfae63e6dc6a1922c342dd90964d";
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Notification preference keys stored at users/{uid}/notification_prefs/{key}.
 * Default is true (enabled) when the key is absent.
 */
export type NotifPrefKey =
  | "friend_requests"   // friend request received / accepted
  | "meal_messages"     // new message in a meal
  | "meal_updates"      // time, location, or instructions changed
  | "meal_food"         // food assigned/removed, role changed
  | "meal_deleted"      // meal was deleted
  | "host_invites"      // (hosts) invite accepted / declined
  | "host_guest_food";  // (hosts) guest updated their own food

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
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    let sub = await registration.pushManager.getSubscription();
    if (!sub) {
      sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }

    const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
    await set(ref(rtdb, `users/${userId}/push_subscriptions/${subKey(json.endpoint)}`), {
      endpoint: json.endpoint,
      keys: json.keys,
      updatedAt: Date.now(),
    });
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
  notification: { title: string; body: string; tag?: string; data?: Record<string, string> },
  prefKey?: NotifPrefKey
): Promise<void> {
  if (recipientIds.length === 0) return;
  try {
    // Filter by notification preference (default enabled when key is absent)
    let filteredIds = recipientIds;
    if (prefKey) {
      const results = await Promise.all(
        recipientIds.map(async (uid) => {
          const snap = await get(ref(rtdb, `users/${uid}/notification_prefs/${prefKey}`));
          const enabled = !snap.exists() || snap.val() !== false;
          return { uid, enabled };
        })
      );
      filteredIds = results.filter((r) => r.enabled).map((r) => r.uid);
    }

    if (filteredIds.length === 0) return;

    const subscriptions: unknown[] = [];
    await Promise.all(
      filteredIds.map(async (uid) => {
        const snap = await get(ref(rtdb, `users/${uid}/push_subscriptions`));
        if (snap.exists()) Object.values(snap.val()).forEach((s) => subscriptions.push(s));
      })
    );
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
    console.warn("[push] notifyUsers failed:", err);
  }
}
