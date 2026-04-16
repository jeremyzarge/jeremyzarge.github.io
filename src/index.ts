/**
 * Core database operations for meals and users
 */

import { ref, set, get, remove } from "firebase/database";
import { rtdb } from "./firebaseClient";
import type { UserProfile, Meal, MealParticipant } from "./types";

/**
 * Creates or updates a user profile
 * @param numericId - User's numeric ID
 * @param profile - User profile data
 */
export async function createOrUpdateUserNumeric(
  numericId: string,
  profile: UserProfile
): Promise<void> {
  await set(ref(rtdb, `users/${numericId}`), profile);
}

/**
 * Deletes all user data including profile, meal_events participation, and mappings
 * @param numericId - User's numeric ID
 */
export async function deleteUserNumeric(numericId: string): Promise<void> {
  await remove(ref(rtdb, `users/${numericId}`));

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
 * Creates a new meal event
 * @param mealObj - Meal object with participants
 * @returns Promise resolving to the new meal's ID
 */
export async function createMeal(mealObj: Meal): Promise<string> {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const id = Array.from(crypto.getRandomValues(new Uint8Array(7)))
    .map((b) => chars[b % chars.length])
    .join("");
  await set(ref(rtdb, `meal_events/${id}`), mealObj);
  return id;
}

/**
 * Converts a legacy meal (with hosts/guests) to new format (with participants)
 * Helper function for migration
 * @param legacyMeal - Meal in old hosts/guests format
 * @returns Meal in new participants format
 */
export function convertLegacyMealToParticipants(legacyMeal: any): Meal {
  const participants: Record<string, MealParticipant> = {};

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
