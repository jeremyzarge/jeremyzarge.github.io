/**
 * Utility functions for VitePotLock
 */

import { ref, get } from "firebase/database";
import { rtdb } from "./firebaseClient";
import type { UserProfile, Apartment, UserWithId, Allergies, CanBring } from "./types";

/**
 * Fetches all users from the database
 * @returns Promise resolving to array of users with IDs
 */
export async function fetchAllUsers(): Promise<UserWithId[]> {
  const snap = await get(ref(rtdb, "users"));
  const data = snap.exists() ? snap.val() : {};
  return Object.entries(data).map(([id, user]) => ({
    id,
    ...(user as UserProfile),
  }));
}

/**
 * Fetches all apartments from the database
 * @returns Promise resolving to array of apartments
 */
export async function fetchAllApartments(): Promise<Apartment[]> {
  const snap = await get(ref(rtdb, "apartments"));
  const data = snap.exists() ? snap.val() : {};
  return Object.entries(data).map(([id, apt]) => ({
    id,
    ...(apt as Omit<Apartment, "id">),
  }));
}

/**
 * Fetches a single user by their numeric ID
 * @param numericId - The numeric user ID
 * @returns Promise resolving to user profile or null if not found
 */
export async function fetchUserById(numericId: string): Promise<UserProfile | null> {
  const snap = await get(ref(rtdb, `users/${numericId}`));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

/**
 * Fetches users excluding the specified user ID
 * @param excludeId - User ID to exclude from results
 * @returns Promise resolving to array of other users
 */
export async function fetchOtherUsers(excludeId: string): Promise<UserWithId[]> {
  const allUsers = await fetchAllUsers();
  return allUsers.filter((user) => user.id !== excludeId);
}

/**
 * Creates default empty allergies object
 * @returns Empty allergies object with all fields set to false/empty
 */
export function createDefaultAllergies(): Allergies {
  return {
    gluten_free: false,
    dairy_free: false,
    vegan: false,
    vegetarian: false,
    nut_allergy: false,
    custom: [],
  };
}

/**
 * Creates default empty can_bring object
 * @returns Empty can_bring object with all fields set to false
 */
export function createDefaultCanBring(): CanBring {
  return {
    drinks: false,
    dessert: false,
    salad: false,
    main_dish: false,
    snacks: false,
    sides: false,
    utensils: false,
  };
}

/**
 * Formats a number as an integer if it's a whole number, otherwise shows decimal
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}

/**
 * Formats apartment display name with address
 * @param apt - Apartment object
 * @returns Formatted string "Name - Address"
 */
export function formatApartmentName(apt: Apartment): string {
  return `${apt.name} - ${apt.address}`;
}

/**
 * Gets all allergens from a list of user IDs
 * @param userIds - Array of user numeric IDs
 * @param allUsers - Array of all users
 * @returns Object mapping allergen names to count of users with that allergen
 */
export function getAllergenCounts(userIds: string[], allUsers: UserWithId[]): Record<string, number> {
  const counts: Record<string, number> = {};

  userIds.forEach((uid) => {
    const user = allUsers.find((u) => u.id === uid);
    if (!user || !user.allergies) return;

    const allergies = user.allergies;

    // Count preset allergies
    if (allergies.gluten_free) counts["Gluten-free"] = (counts["Gluten-free"] || 0) + 1;
    if (allergies.dairy_free) counts["Dairy-free"] = (counts["Dairy-free"] || 0) + 1;
    if (allergies.vegan) counts["Vegan"] = (counts["Vegan"] || 0) + 1;
    if (allergies.vegetarian) counts["Vegetarian"] = (counts["Vegetarian"] || 0) + 1;
    if (allergies.nut_allergy) counts["Nut Allergy"] = (counts["Nut Allergy"] || 0) + 1;

    // Count custom allergies
    if (allergies.custom && Array.isArray(allergies.custom)) {
      allergies.custom.forEach((customAllergy) => {
        counts[customAllergy] = (counts[customAllergy] || 0) + 1;
      });
    }
  });

  return counts;
}
