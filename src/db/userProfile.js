// src/db/userProfile.js
import { ref, get, set } from "firebase/database";
import { rtdb } from "../firebaseClient.js";
import { getNextNumericId } from "../firebaseClient.js";
import { createOrUpdateUserNumeric } from "../index.js";

/**
 * Resolve numeric id for auth uid or null.
 */
export async function resolveNumericIdFromAuthUid(authUid) {
  const snap = await get(ref(rtdb, `uid_to_id/${authUid}`));
  return snap.exists() ? String(snap.val()) : null;
}

/**
 * Create a numeric user and initialize profile + meals.
 * profileData: { first_name, last_name, apartmentId?, newApartment? }
 * Returns numeric id (string).
 */
export async function createNumericUserForAuth(authUid, profileData) {
  // next numeric id
  const next = await getNextNumericId("users"); // util returns "1", "2", ...
  // create mapping entries
  await set(ref(rtdb, `id_to_uid/${next}`), authUid);
  await set(ref(rtdb, `uid_to_id/${authUid}`), next);

  // If profileData requests a new apartment, create it here (simple)
  let aptId = profileData.apartmentId ?? null;
  if (profileData.newApartment) {
    const nextApt = await getNextNumericId('apartments');
    await set(ref(rtdb, `apartments/${nextApt}`), { name: profileData.newApartment.name, address: profileData.newApartment.address });
    aptId = nextApt;
  }

  const profile = {
    uid: authUid,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    apartment: aptId
  };

  // write user and init meals
  await createOrUpdateUserNumeric(next, profile);

  return next;
}
