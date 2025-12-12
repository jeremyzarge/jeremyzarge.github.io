// src/firebaseClient.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, get, set, update } from "firebase/database";

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
export const rtdb = getDatabase(app);

// --- Login ---
export async function loginWithGoogle() {
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

// --- Utility: next numeric id for a path (safe) ---
export async function getNextNumericId(path) {
  const snap = await get(ref(rtdb, path));
  const data = snap.exists() ? snap.val() : {};
  const ids = Object.keys(data)
    .map((k) => Number(k))
    .filter((n) => !Number.isNaN(n));
  const max = ids.length ? Math.max(...ids) : 0;
  return String(max + 1);
}

// --- Mapping helpers ---
// returns numeric id string or null
export async function getNumericIdFromUid(uid) {
  const snap = await get(ref(rtdb, `uid_to_id/${uid}`));
  return snap.exists() ? String(snap.val()) : null;
}
export async function getUidFromNumericId(id) {
  const snap = await get(ref(rtdb, `id_to_uid/${id}`));
  return snap.exists() ? snap.val() : null;
}

// Ensure mapping exists: return numeric id string. If none, create id_to_uid and uid_to_id entries and create a placeholder users/{id} (with uid)
export async function ensureUserNumericMapping(uid) {
  // try uid_to_id first
  const existing = await getNumericIdFromUid(uid);
  if (existing) return existing;

  // create new numeric id under id_to_uid/ and uid_to_id/
  const nextId = await getNextNumericId("id_to_uid");
  await set(ref(rtdb, `id_to_uid/${nextId}`), uid);
  await set(ref(rtdb, `uid_to_id/${uid}`), nextId);

  // create placeholder user record if users/{id} doesn't exist
  const userSnap = await get(ref(rtdb, `users/${nextId}`));
  if (!userSnap.exists()) {
    await set(ref(rtdb, `users/${nextId}`), { uid, placeholder: true });
  }

  return nextId;
}

// Create numeric apartment and return id string (if apt with same name+address exists, still creates new - you can change if dedupe desired)
export async function createNumericApartmentId(name, address) {
  const nextId = await getNextNumericId("apartments");
  await set(ref(rtdb, `apartments/${nextId}`), { name, address });
  return String(nextId);
}

// Safe ensure path exists (create empty object)
export async function ensurePathExists(path) {
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
