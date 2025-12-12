// src/index.js
import { ref, set, get, update, remove } from "firebase/database";
import { rtdb } from "./firebaseClient.js";

/**
 * Create or update a numeric user record (users/{numericId}) and
 * ensure meal_matrix rows exist.
 */
export async function createOrUpdateUserNumeric(numericId, profile) {
  // write profile
  await set(ref(rtdb, `users/${numericId}`), profile);

  // ensure matrix row exists
  const matrixSnap = await get(ref(rtdb, `meal_matrix/${numericId}`));
  if (!matrixSnap.exists()) {
    await set(ref(rtdb, `meal_matrix/${numericId}`), {});
  }

  // ensure bidirectional zeros with all existing numeric users
  const usersSnap = await get(ref(rtdb, "users"));
  const users = usersSnap.exists() ? usersSnap.val() : {};
  const updates = {};

  for (const otherId of Object.keys(users)) {
    if (otherId === numericId) continue;

    const aSnap = await get(ref(rtdb, `meal_matrix/${numericId}/${otherId}`));
    if (!aSnap.exists()) updates[`meal_matrix/${numericId}/${otherId}`] = 0;

    const bSnap = await get(ref(rtdb, `meal_matrix/${otherId}/${numericId}`));
    if (!bSnap.exists()) updates[`meal_matrix/${otherId}/${numericId}`] = 0;
  }

  if (Object.keys(updates).length) {
    await update(ref(rtdb), updates);
  }

  return true;
}

/**
 * Delete all user data from users/, meal_matrix/, meal_events, and mappings.
 */
export async function deleteUserNumeric(numericId) {
  await remove(ref(rtdb, `users/${numericId}`));
  await remove(ref(rtdb, `meal_matrix/${numericId}`));

  // remove references from other matrix rows
  const matrixSnap = await get(ref(rtdb, "meal_matrix"));
  const all = matrixSnap.exists() ? matrixSnap.val() : {};
  const updates = {};

  for (const otherId of Object.keys(all)) {
    if (all[otherId] && all[otherId][numericId] !== undefined) {
      updates[`meal_matrix/${otherId}/${numericId}`] = null;
    }
  }
  if (Object.keys(updates).length) await update(ref(rtdb), updates);

  // remove mappings
  const idToUidSnap = await get(ref(rtdb, `id_to_uid`));
  if (idToUidSnap.exists()) {
    const map = idToUidSnap.val();
    if (map[numericId]) {
      const uid = map[numericId];
      await set(ref(rtdb, `id_to_uid/${numericId}`), null);
      await set(ref(rtdb, `uid_to_id/${uid}`), null);
    }
  }

  return true;
}

/**
 * Record one meal event directly in meal_matrix (legacy compatibility).
 */
export async function recordMealNumeric(eaterId, hostId, count) {
  if (eaterId === hostId) throw new Error("Cannot eat by yourself.");

  const eaterSnap = await get(ref(rtdb, `meal_matrix/${eaterId}/${hostId}`));
  const hostSnap = await get(ref(rtdb, `meal_matrix/${hostId}/${eaterId}`));

  const eaterVal = eaterSnap.exists() ? Number(eaterSnap.val()) : 0;
  const hostVal = hostSnap.exists() ? Number(hostSnap.val()) : 0;

  await set(ref(rtdb, `meal_matrix/${eaterId}/${hostId}`), eaterVal + count);
  await set(ref(rtdb, `meal_matrix/${hostId}/${eaterId}`), hostVal - count);
}

export async function getMealsForNumericUser(numericId) {
  const snap = await get(ref(rtdb, `meal_matrix/${numericId}`));
  return snap.exists() ? snap.val() : {};
}

export async function getAllUsersNumeric() {
  const snap = await get(ref(rtdb, "users"));
  return snap.exists() ? snap.val() : {};
}

export async function getNextNumericKeyForPath(path) {
  const snap = await get(ref(rtdb, path));
  if (!snap.exists()) return "1";
  const data = snap.val() || {};
  const ids = Object.keys(data)
    .map(Number)
    .filter(n => !Number.isNaN(n));
  return String((ids.length ? Math.max(...ids) : 0) + 1);
}

/**
 * Create a hosted meal event in meal_events/{id}
 */
export async function createMeal(mealObj) {
  const nextId = await getNextNumericKeyForPath("meal_events");

  const mealPath = `meal_events/${nextId}`;
  await set(ref(rtdb, mealPath), mealObj);

  // update meal_matrix using host/guest scoring logic
  await updateMealMatrixForMeal(mealObj);

  return nextId;
}

/**
 * Update meal_matrix based on hosts and guests in the meal object
 */
export async function updateMealMatrixForMeal(mealObj) {
  const hosts = mealObj.hosts ? Object.keys(mealObj.hosts) : [];
  const guests = mealObj.guests ? Object.keys(mealObj.guests) : [];

  if (!hosts.length || !guests.length) return;

  const updates = {};

  for (const h of hosts) {
    for (const g of guests) {
      const hostPath = `meal_matrix/${h}/${g}`;
      const guestPath = `meal_matrix/${g}/${h}`;

      const hostSnap = await get(ref(rtdb, hostPath));
      const guestSnap = await get(ref(rtdb, guestPath));

      const hostVal = hostSnap.exists() ? Number(hostSnap.val()) : 0;
      const guestVal = guestSnap.exists() ? Number(guestSnap.val()) : 0;

      updates[hostPath] = hostVal + 1; // host gets +1 per guest
      updates[guestPath] = guestVal - 1; // guest loses -1 per host
    }
  }

  if (Object.keys(updates).length) {
    await update(ref(rtdb), updates);
  }
}
