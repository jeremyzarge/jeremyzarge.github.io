/**
 * Firebase client configuration and utilities
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getDatabase, ref, get, set, update, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-mvnZp40kJHJ0qIQZZ6zaFmNMSN5V1C8",
  authDomain: "auth.vitemeals.com",
  databaseURL: "https://vitepotlock-default-rtdb.firebaseio.com",
  projectId: "vitepotlock",
  storageBucket: "vitepotlock.firebasestorage.app",
  messagingSenderId: "1065091003781",
  appId: "1:1065091003781:web:0303f127f9c00de89d00ec",
  measurementId: "G-TKYVVKYMEM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const rtdb: Database = getDatabase(app);

// In-app browsers (opened from a share sheet inside Instagram, Facebook,
// Messages link previews, TikTok, etc.) are the main real-world trigger for
// "missing initial state": Google itself blocks OAuth in most of them
// (disallowed_useragent), and the ones that aren't blocked outright still
// tend to partition storage across the redirect. Detecting them lets us
// steer users to their real browser before they ever hit that failure.
const IN_APP_BROWSER_PATTERN = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Line\/|MicroMessenger|TikTok|musical_ly|LinkedInApp|Snapchat/i;

export function isLikelyInAppBrowser(): boolean {
  return IN_APP_BROWSER_PATTERN.test(navigator.userAgent);
}

/**
 * Initiates Google OAuth login, preferring a popup with a redirect fallback.
 *
 * Popup talks back to this page directly via postMessage between windows, so
 * it works even when third-party storage/cookies are blocked (e.g. Incognito)
 * — redirect can't, because our authDomain (vitepotlock.firebaseapp.com)
 * differs from this app's own domain, so completing a redirect sign-in
 * requires a cross-origin iframe that depends on exactly the storage access
 * Incognito blocks by default (Firebase surfaces this as
 * auth/web-storage-unsupported).
 *
 * Popup has the opposite weak spot: Safari/iOS and in-app browsers
 * (Instagram, Facebook, etc.) often block the sessionStorage sharing popup
 * needs between it and its opener. So we fall back to redirect there instead.
 */
export async function loginWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return; // user backed out of the popup — nothing to do
    }
    await signInWithRedirect(auth, provider);
  }
}

const REDIRECT_ERROR_MESSAGES: Record<string, string> = {
  // Firebase's own pending-redirect bookkeeping (its sessionStorage nonce) was
  // lost between leaving for Google and coming back — typically an in-app
  // browser (Instagram/Facebook/SMS previews) or IDP-initiated SSO.
  "auth/missing-or-invalid-nonce": "Sign-in didn't finish because your browser blocked data it needed across the redirect. This is common in in-app browsers (e.g. opening the link from Messages, Instagram, or Facebook). Please open this link in Safari or Chrome directly and try again.",
  "auth/web-storage-unsupported": "Sign-in didn't finish because your browser is blocking storage this needs (common in Private/Incognito mode). Please try again in a regular browser window.",
};

/**
 * Resolves after a completed redirect sign-in, with a user-friendly message
 * if it failed. Successful sign-in itself is handled by onAuthStateChanged;
 * this only surfaces failures so the caller can show them instead of leaving
 * the user stuck on the login screen with no explanation.
 */
export const redirectSignInError: Promise<string | null> = getRedirectResult(auth)
  .then(() => null)
  .catch((err) => {
    console.error("Google sign-in redirect failed:", err);
    const code = (err as { code?: string })?.code ?? "";
    return REDIRECT_ERROR_MESSAGES[code] ?? "Something went wrong signing you in. Please try again.";
  });

/**
 * Retries a database call a few times if it fails with PERMISSION_DENIED.
 * Right after a fresh sign-in (no prior session on this device/browser), the
 * Realtime Database connection can take a moment to finish attaching the new
 * auth token — a call issued in that window fails rules checks that require
 * auth != null even though the user really is authenticated. Once the first
 * call succeeds, the connection is proven authenticated and later calls don't
 * need this.
 */
async function withAuthRetry<T>(fn: () => Promise<T>, attempts = 5, delayMs = 400): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const isPermissionDenied = (err as { code?: string })?.code === "PERMISSION_DENIED";
      if (!isPermissionDenied || i === attempts - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("withAuthRetry: unreachable");
}

/**
 * Gets the next available numeric ID for a given database path
 * @param path - Database path to check for existing numeric IDs
 * @returns Promise resolving to the next numeric ID as a string
 */
export async function getNextNumericId(path: string): Promise<string> {
  const snap = await get(ref(rtdb, path));
  const data = snap.exists() ? snap.val() : {};
  const ids = Object.keys(data)
    .map((k) => Number(k))
    .filter((n) => !Number.isNaN(n));
  const max = ids.length ? Math.max(...ids) : 0;
  return String(max + 1);
}

/**
 * Converts Firebase UID to internal numeric ID
 * @param uid - Firebase UID
 * @returns Promise resolving to numeric ID string or null if not found
 */
export async function getNumericIdFromUid(uid: string): Promise<string | null> {
  const snap = await withAuthRetry(() => get(ref(rtdb, `uid_to_id/${uid}`)));
  return snap.exists() ? String(snap.val()) : null;
}

/**
 * Converts internal numeric ID to Firebase UID
 * @param id - Internal numeric ID
 * @returns Promise resolving to Firebase UID or null if not found
 */
export async function getUidFromNumericId(id: string): Promise<string | null> {
  const snap = await get(ref(rtdb, `id_to_uid/${id}`));
  return snap.exists() ? snap.val() : null;
}

/**
 * Ensures a numeric ID mapping exists for the given UID.
 * Creates mapping and placeholder user if needed.
 * @param uid - Firebase UID
 * @returns Promise resolving to numeric ID string
 */
export async function ensureUserNumericMapping(uid: string): Promise<string> {
  // Check if mapping already exists
  const existing = await getNumericIdFromUid(uid);
  if (existing) return existing;

  // Create new numeric id and bidirectional mappings
  const nextId = await getNextNumericId("id_to_uid");
  await set(ref(rtdb, `id_to_uid/${nextId}`), uid);
  await set(ref(rtdb, `uid_to_id/${uid}`), nextId);

  // Create placeholder user record if it doesn't exist
  const userSnap = await get(ref(rtdb, `users/${nextId}`));
  if (!userSnap.exists()) {
    await set(ref(rtdb, `users/${nextId}`), { uid, placeholder: true });
  }

  return nextId;
}

/**
 * Creates a new apartment with numeric ID
 * @param name - Apartment name
 * @param address - Apartment address
 * @returns Promise resolving to the new apartment's numeric ID
 */
export async function createNumericApartmentId(name: string, address: string): Promise<string> {
  const nextId = await getNextNumericId("apartments");
  await set(ref(rtdb, `apartments/${nextId}`), { name, address });
  return String(nextId);
}

/**
 * Updates an existing apartment's name and address
 * @param id - Apartment ID
 * @param name - New apartment name
 * @param address - New apartment address
 */
export async function updateApartment(id: string, name: string, address: string): Promise<void> {
  await update(ref(rtdb, `apartments/${id}`), { name, address });
}

/**
 * Ensures a database path exists by creating an empty object if needed
 * @param path - Database path to ensure exists
 */
export async function ensurePathExists(path: string): Promise<void> {
  const s = await get(ref(rtdb, path));
  if (!s.exists()) {
    await set(ref(rtdb, path), {});
  }
}

export default {
  auth,
  rtdb,
  loginWithGoogle,
  getNextNumericId,
  ensureUserNumericMapping,
  getNumericIdFromUid,
  getUidFromNumericId,
  createNumericApartmentId,
  updateApartment,
  ensurePathExists
};
