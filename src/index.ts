/**
 * Core database operations for meals and users
 */

import { ref, set, get, update, remove } from "firebase/database";
import { rtdb } from "./firebaseClient";
import type { UserProfile, Meal, MealParticipant } from "./types";

/**
 * Creates or updates a user profile and ensures meal_matrix entries exist
 * @param numericId - User's numeric ID
 * @param profile - User profile data
 */
export async function createOrUpdateUserNumeric(
  numericId: string,
  profile: UserProfile
): Promise<void> {
  // Write user profile
  await set(ref(rtdb, `users/${numericId}`), profile);

  // Ensure user has a meal_matrix row
  const matrixSnap = await get(ref(rtdb, `meal_matrix/${numericId}`));
  if (!matrixSnap.exists()) {
    await set(ref(rtdb, `meal_matrix/${numericId}`), {});
  }

  // Ensure bidirectional zero balances with all existing users
  const usersSnap = await get(ref(rtdb, "users"));
  const users = usersSnap.exists() ? usersSnap.val() : {};
  const updates: Record<string, number> = {};

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
}

/**
 * Deletes all user data including profile, meal_matrix, meal_events, and mappings
 * @param numericId - User's numeric ID
 */
export async function deleteUserNumeric(numericId: string): Promise<void> {
  await remove(ref(rtdb, `users/${numericId}`));
  await remove(ref(rtdb, `meal_matrix/${numericId}`));

  // Remove references from other users' matrix rows
  const matrixSnap = await get(ref(rtdb, "meal_matrix"));
  const all = matrixSnap.exists() ? matrixSnap.val() : {};
  const updates: Record<string, null> = {};

  for (const otherId of Object.keys(all)) {
    if (all[otherId] && all[otherId][numericId] !== undefined) {
      updates[`meal_matrix/${otherId}/${numericId}`] = null;
    }
  }
  if (Object.keys(updates).length) await update(ref(rtdb), updates);

  // Remove UID mappings
  const idToUidSnap = await get(ref(rtdb, `id_to_uid`));
  if (idToUidSnap.exists()) {
    const map = idToUidSnap.val();
    if (map[numericId]) {
      const uid = map[numericId];
      await set(ref(rtdb, `id_to_uid/${numericId}`), null);
      await set(ref(rtdb, `uid_to_id/${uid}`), null);
    }
  }
}

/**
 * Gets meal balance row for a specific user
 * @param numericId - User's numeric ID
 * @returns Object mapping other user IDs to meal balances
 */
export async function getMealsForNumericUser(
  numericId: string
): Promise<Record<string, number>> {
  const snap = await get(ref(rtdb, `meal_matrix/${numericId}`));
  return snap.exists() ? snap.val() : {};
}

/**
 * Gets all users from the database
 * @returns Object mapping user IDs to user profiles
 */
export async function getAllUsersNumeric(): Promise<Record<string, UserProfile>> {
  const snap = await get(ref(rtdb, "users"));
  return snap.exists() ? snap.val() : {};
}

/**
 * Gets the next available numeric ID for a given path
 * @param path - Database path
 * @returns Next numeric ID as string
 */
export async function getNextNumericKeyForPath(path: string): Promise<string> {
  const snap = await get(ref(rtdb, path));
  if (!snap.exists()) return "1";
  const data = snap.val() || {};
  const ids = Object.keys(data)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  return String((ids.length ? Math.max(...ids) : 0) + 1);
}

/**
 * Creates a new meal event with participant-based structure
 * @param mealObj - Meal object with participants
 * @returns Promise resolving to the new meal's ID
 */
export async function createMeal(mealObj: Meal): Promise<string> {
  const nextId = await getNextNumericKeyForPath("meal_events");

  const mealPath = `meal_events/${nextId}`;
  await set(ref(rtdb, mealPath), mealObj);

  // Update meal_matrix based on participant roles
  await updateMealMatrixForMeal(mealObj);

  return nextId;
}

/**
 * Updates the meal_matrix based on participant roles in a meal
 * Hosts get +1 for each guest, guests get -1 for each host
 * Only counts accepted participants (invitations pending are excluded)
 * @param mealObj - Meal object with participants
 */
export async function updateMealMatrixForMeal(mealObj: Meal): Promise<void> {
  const participants = mealObj.participants || {};

  // Separate participants by role - ONLY count accepted participants
  const hosts: string[] = [];
  const guests: string[] = [];

  for (const [userId, participant] of Object.entries(participants)) {
    // Skip non-accepted participants (invitations pending)
    // Use ?? true for backward compatibility with old data
    if (!(participant.accepted ?? true)) continue;

    if (participant.role === "host") {
      hosts.push(userId);
    } else if (participant.role === "guest") {
      guests.push(userId);
    }
  }

  if (!hosts.length || !guests.length) return;

  const updates: Record<string, number> = {};

  // Each host gets +1 per guest, each guest gets -1 per host
  for (const hostId of hosts) {
    for (const guestId of guests) {
      const hostPath = `meal_matrix/${hostId}/${guestId}`;
      const guestPath = `meal_matrix/${guestId}/${hostId}`;

      const hostSnap = await get(ref(rtdb, hostPath));
      const guestSnap = await get(ref(rtdb, guestPath));

      const hostVal = hostSnap.exists() ? Number(hostSnap.val()) : 0;
      const guestVal = guestSnap.exists() ? Number(guestSnap.val()) : 0;

      updates[hostPath] = hostVal + 1;
      updates[guestPath] = guestVal - 1;
    }
  }

  if (Object.keys(updates).length) {
    await update(ref(rtdb), updates);
  }
}

/**
 * Converts a legacy meal (with hosts/guests) to new format (with participants)
 * Helper function for migration
 * @param legacyMeal - Meal in old hosts/guests format
 * @returns Meal in new participants format
 */
export function convertLegacyMealToParticipants(legacyMeal: any): Meal {
  const participants: Record<string, MealParticipant> = {};

  // Convert hosts - legacy participants are accepted by default
  if (legacyMeal.hosts) {
    for (const [userId, data] of Object.entries(legacyMeal.hosts)) {
      participants[userId] = {
        food: (data as any)?.food || "none",
        specifics: "",
        role: "host",
        accepted: true,
      };
    }
  }

  // Convert guests - legacy participants are accepted by default
  if (legacyMeal.guests) {
    for (const [userId, data] of Object.entries(legacyMeal.guests)) {
      participants[userId] = {
        food: (data as any)?.food || "none",
        specifics: "",
        role: "guest",
        accepted: true,
      };
    }
  }

  return {
    title: legacyMeal.title || "",
    host_apartment_id: legacyMeal.host_apartment_id || "",
    participants,
    datetime: legacyMeal.datetime || new Date().toISOString(),
    created_at: legacyMeal.created_at || new Date().toISOString(),
    instructions: legacyMeal.instructions || "",
    allowGuestsFoodSelection: legacyMeal.allowGuestsFoodSelection || false,
    messages: legacyMeal.messages || {},
  };
}
