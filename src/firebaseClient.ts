/**
 * Firebase client configuration and utilities
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { getDatabase, ref, get, set, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-mvnZp40kJHJ0qIQZZ6zaFmNMSN5V1C8",
  authDomain: "vitepotlock.firebaseapp.com",
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
export const rtdb: Database = getDatabase(app);

/**
 * Initiates Google OAuth login flow
 * @returns Promise resolving to authenticated Firebase user
 */
export async function loginWithGoogle(): Promise<User> {
  const res = await signInWithPopup(auth, provider);
  return res.user;
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
  const snap = await get(ref(rtdb, `uid_to_id/${uid}`));
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
  ensurePathExists
};
