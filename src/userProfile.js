// src/userProfile.js
import { get, ref } from "firebase/database";
import { rtdb } from "./firebaseClient.js";

export async function getNumericIdForAuth(authUid) {
  const snap = await get(ref(rtdb, `uid_to_id/${authUid}`));
  return snap.exists() ? String(snap.val()) : null;
}
