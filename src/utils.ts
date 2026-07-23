/**
 * Utility functions for VitePotLock
 */

import { ref, get } from "firebase/database";
import { rtdb } from "./firebaseClient";
import type { UserProfile, Apartment, UserWithId, Allergies, CanBring } from "./types";

/**
 * Call from a modal's backdrop-click / Cancel handler instead of `onClose` directly.
 * If there are no unsaved changes, closes immediately. Otherwise prompts the user to
 * either save (calling `onSave`, which is expected to close on success) or discard —
 * asked as two separate confirms since `window.confirm` only offers one yes/no choice
 * at a time. Choosing to keep the dialog open (canceling both prompts) leaves the modal
 * open with the unsaved changes intact.
 */
export function attemptCloseWithUnsavedChanges(
  hasChanges: boolean,
  onSave: () => void,
  onDiscard: () => void
): void {
  if (!hasChanges) {
    onDiscard();
    return;
  }
  const wantsToSave = window.confirm(
    "You have unsaved changes. Press OK to save them, or Cancel to choose whether to discard them."
  );
  if (wantsToSave) {
    onSave();
    return;
  }
  if (window.confirm("Discard your unsaved changes and close without saving?")) {
    onDiscard();
  }
}

/** Food emoji and label mapping */
export const foodDisplayMap: Record<string, { emoji: string; label: string }> = {
  // Database food options
  none: { emoji: "➖", label: "None" },
  challah: { emoji: "🍞", label: "Challah" },
  dessert: { emoji: "🍰", label: "Dessert" },
  dips: { emoji: "🫕", label: "Dips" },
  dip: { emoji: "🫕", label: "Dips" },
  "grape juice": { emoji: "🍇", label: "Grape Juice" },
  grapejuice: { emoji: "🍇", label: "Grape Juice" },
  grape_juice: { emoji: "🍇", label: "Grape Juice" },
  main: { emoji: "🍝", label: "Main" },
  sides: { emoji: "🥔", label: "Sides" },
  side: { emoji: "🥔", label: "Sides" },
  vegetable: { emoji: "🥦", label: "Vegetable" },
  vegetables: { emoji: "🥦", label: "Vegetables" },
  // Profile food options (for compatibility)
  drinks: { emoji: "🥤", label: "Drinks" },
  drink: { emoji: "🥤", label: "Drinks" },
  salad: { emoji: "🥗", label: "Salad" },
  main_dish: { emoji: "🍝", label: "Main Dish" },
  "main dish": { emoji: "🍝", label: "Main Dish" },
  maindish: { emoji: "🍝", label: "Main Dish" },
  snacks: { emoji: "🍿", label: "Snacks" },
  snack: { emoji: "🍿", label: "Snacks" },
  utensils: { emoji: "🍴", label: "Utensils" },
  utensil: { emoji: "🍴", label: "Utensils" },
};

/** Format a food key into a display string with emoji */
export const formatFood = (food: string): string => {
  // Normalize: lowercase, trim, remove extra spaces
  const normalizedKey = food.toLowerCase().trim();

  // Try exact match first
  if (foodDisplayMap[normalizedKey]) {
    const mapped = foodDisplayMap[normalizedKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // Try with underscores replaced by spaces
  const spacedKey = normalizedKey.replace(/_/g, " ");
  if (foodDisplayMap[spacedKey]) {
    const mapped = foodDisplayMap[spacedKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // Try with spaces replaced by underscores
  const underscoredKey = normalizedKey.replace(/\s+/g, "_");
  if (foodDisplayMap[underscoredKey]) {
    const mapped = foodDisplayMap[underscoredKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // Try with all spaces/underscores removed (e.g., "maindish")
  const compactKey = normalizedKey.replace(/[\s_-]+/g, "");
  if (foodDisplayMap[compactKey]) {
    const mapped = foodDisplayMap[compactKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // For unknown foods, capitalize nicely with generic emoji
  const label = food
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return `🍽️ ${label}`;
};

/** Fetch address suggestions from Nominatim (OpenStreetMap), anywhere in the US. */
export async function fetchAddressSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 3) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=us&limit=6`,
    { headers: { Accept: "application/json" } }
  );
  const data = await res.json();
  return (data || [])
    .map((r: any) => {
      let label: string = r.display_name ?? "";
      // Strip trailing ", United States" — country is implied
      const usIdx = label.indexOf(", United States");
      if (usIdx > 0) label = label.substring(0, usIdx);
      return label;
    })
    .filter(Boolean) as string[];
}

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
    side: false,
    utensils: false,
    custom: [],
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
