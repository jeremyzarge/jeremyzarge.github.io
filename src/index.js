// src/index.js
import { ref, set, get, update, remove } from "firebase/database";
import { rtdb } from "./firebaseClient.js";

/**
 * Create or update a numeric user record (users/{numericId}) and initialize meals rows.
 * profile should be { first_name, last_name, apartment, uid? }.
 * numericId is string.
 */
export async function createOrUpdateUserNumeric(numericId, profile) {
  // write profile (merge or set fully)
  await set(ref(rtdb, `users/${numericId}`), profile);

  // ensure meals row exists for this user
  const mealsSnap = await get(ref(rtdb, `meals/${numericId}`));
  if (!mealsSnap.exists()) {
    await set(ref(rtdb, `meals/${numericId}`), {});
  }

  // ensure bidirectional zeros with all existing numeric users
  const usersSnap = await get(ref(rtdb, "users"));
  const users = usersSnap.exists() ? usersSnap.val() : {};
  const updates = {};
  for (const otherId of Object.keys(users)) {
    if (otherId === numericId) continue;
    // ensure eater->host and host->eater entries exist (default 0)
    const eaterValSnap = await get(ref(rtdb, `meals/${numericId}/${otherId}`));
    if (!eaterValSnap.exists()) updates[`meals/${numericId}/${otherId}`] = 0;
    const hostValSnap = await get(ref(rtdb, `meals/${otherId}/${numericId}`));
    if (!hostValSnap.exists()) updates[`meals/${otherId}/${numericId}`] = 0;
  }
  if (Object.keys(updates).length) {
    await update(ref(rtdb), updates);
  }
  return true;
}

/**
 * Delete a numeric user fully (users, meals rows, mappings id_to_uid & uid_to_id)
 */
export async function deleteUserNumeric(numericId) {
  // remove users/{numericId}
  await remove(ref(rtdb, `users/${numericId}`));
  // remove meals/{numericId}
  await remove(ref(rtdb, `meals/${numericId}`));

  // remove references from other meals rows
  const mealsSnap = await get(ref(rtdb, "meals"));
  const allMeals = mealsSnap.exists() ? mealsSnap.val() : {};
  const updates = {};
  for (const otherId of Object.keys(allMeals)) {
    if (allMeals[otherId] && allMeals[otherId][numericId] !== undefined) {
      updates[`meals/${otherId}/${numericId}`] = null;
    }
  }
  if (Object.keys(updates).length) await update(ref(rtdb), updates);

  // remove mappings id_to_uid and uid_to_id for this numericId
  const idToUidSnap = await get(ref(rtdb, `id_to_uid`));
  if (idToUidSnap.exists()) {
    const idToUid = idToUidSnap.val();
    if (idToUid && idToUid[numericId]) {
      const uid = idToUid[numericId];
      await set(ref(rtdb, `id_to_uid/${numericId}`), null);
      await set(ref(rtdb, `uid_to_id/${uid}`), null);
    }
  }
  return true;
}

/**
 * Record one meal event (adds +count to eater->host and -count to host->eater).
 * eaterId and hostId are numeric id strings.
 */
export async function recordMealNumeric(eaterId, hostId, count) {
  if (eaterId === hostId) throw new Error("Cannot eat by yourself.");

  // Read current values (create if missing)
  const eaterSnap = await get(ref(rtdb, `meals/${eaterId}/${hostId}`));
  const hostSnap = await get(ref(rtdb, `meals/${hostId}/${eaterId}`));
  const eaterVal = eaterSnap.exists() ? Number(eaterSnap.val()) : 0;
  const hostVal = hostSnap.exists() ? Number(hostSnap.val()) : 0;

  await set(ref(rtdb, `meals/${eaterId}/${hostId}`), eaterVal + count);
  await set(ref(rtdb, `meals/${hostId}/${eaterId}`), hostVal - count);
}

/**
 * Get meals row for a numeric user (object)
 */
export async function getMealsForNumericUser(numericId) {
  const snap = await get(ref(rtdb, `meals/${numericId}`));
  return snap.exists() ? snap.val() : {};
}

/**
 * Get all users (object keyed by numeric id)
 */
export async function getAllUsersNumeric() {
  const snap = await get(ref(rtdb, "users"));
  return snap.exists() ? snap.val() : {};
}
