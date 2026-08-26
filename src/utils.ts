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

const US_STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI",
  Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

/** Builds a short "123 Main St, City, ST 12345" label from a Nominatim address object. */
function formatNominatimAddress(r: any): string {
  const addr = r.address ?? {};
  const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
  const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || "";
  const state = addr.state ? (US_STATE_ABBREVIATIONS[addr.state] ?? addr.state) : "";
  const cityStateZip = [city, [state, addr.postcode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const parts = [street, cityStateZip].filter(Boolean);

  if (parts.length >= 2) return parts.join(", ");

  // Fall back to the full display name (minus the trailing country) if we
  // couldn't assemble a clean short form, e.g. for POIs without a street address.
  let label: string = r.display_name ?? "";
  const usIdx = label.indexOf(", United States");
  if (usIdx > 0) label = label.substring(0, usIdx);
  return label;
}

/** Fetch address suggestions from Nominatim (OpenStreetMap), anywhere in the US. */
export async function fetchAddressSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 3) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=us&limit=6`,
    { headers: { Accept: "application/json" } }
  );
  const data = await res.json();
  return (data || [])
    .map(formatNominatimAddress)
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
 * Computes the datetime windows for this (or next, if already past) Shabbat's
 * two meals: Friday dinner (5pm-midnight) and Saturday lunch (noon-3pm).
 */
export function getUpcomingShabbatWindows() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // How many days since last Friday (0 if today is Friday)
  const daysFromFriday = (dayOfWeek - 5 + 7) % 7;

  const thisFriday = new Date(now);
  thisFriday.setDate(now.getDate() - daysFromFriday);
  thisFriday.setHours(0, 0, 0, 0);

  // Dinner: Friday 5 pm → Saturday midnight
  const dinnerStart = new Date(thisFriday);
  dinnerStart.setHours(17, 0, 0, 0);
  const dinnerEnd = new Date(thisFriday);
  dinnerEnd.setDate(thisFriday.getDate() + 1);
  dinnerEnd.setHours(0, 0, 0, 0);

  // Lunch: Saturday noon → 3 pm
  const lunchStart = new Date(thisFriday);
  lunchStart.setDate(thisFriday.getDate() + 1);
  lunchStart.setHours(12, 0, 0, 0);
  const lunchEnd = new Date(thisFriday);
  lunchEnd.setDate(thisFriday.getDate() + 1);
  lunchEnd.setHours(15, 0, 0, 0);

  // If this week's Shabbat is fully over, advance to next week
  if (now > lunchEnd) {
    dinnerStart.setDate(dinnerStart.getDate() + 7);
    dinnerEnd.setDate(dinnerEnd.getDate() + 7);
    lunchStart.setDate(lunchStart.getDate() + 7);
    lunchEnd.setDate(lunchEnd.getDate() + 7);
  }

  return { dinnerStart, dinnerEnd, lunchStart, lunchEnd };
}

/**
 * Returns the most recent Sunday at local midnight, as a YYYY-MM-DD date string.
 * Used to key "have we already shown this the first time this week" prompts.
 */
export function getCurrentWeekStart(): string {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  sunday.setHours(0, 0, 0, 0);
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, "0");
  const day = String(sunday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats apartment display name with address
 * @param apt - Apartment object
 * @returns Formatted string "Name - Address"
 */
export function formatApartmentName(apt: Apartment): string {
  return `${apt.name} - ${apt.address}`;
}

/** Default meal length used for calendar events (matches OneTable's 2-hour default). */
const CALENDAR_EVENT_DURATION_MS = 2 * 60 * 60 * 1000;

/** Formats a Date as UTC "YYYYMMDDTHHMMSSZ" for Google Calendar / ICS. */
function toCalendarUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Builds an "Add to Calendar" URL/data-URI pair for a meal.
 * @param meal - title, ISO datetime, optional location/instructions
 * @returns Google Calendar URL and an .ics data URI (for Apple/Outlook/etc.)
 */
export function buildCalendarLinks(meal: {
  title: string;
  datetime: string;
  location?: string;
  instructions?: string;
}): { googleUrl: string; icsDataUrl: string } {
  const start = new Date(meal.datetime);
  const end = new Date(start.getTime() + CALENDAR_EVENT_DURATION_MS);
  const startUtc = toCalendarUtc(start);
  const endUtc = toCalendarUtc(end);
  const details = meal.instructions || "";
  const location = meal.location || "";

  const googleUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: meal.title,
    dates: `${startUtc}/${endUtc}`,
    details,
    location,
  })}`;

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ViteMeals//EN",
    "BEGIN:VEVENT",
    `UID:${startUtc}-${Math.random().toString(36).slice(2)}@vitemeals`,
    `DTSTAMP:${toCalendarUtc(new Date())}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${meal.title.replace(/\r?\n/g, " ")}`,
    ...(details ? [`DESCRIPTION:${details.replace(/\r?\n/g, "\\n")}`] : []),
    ...(location ? [`LOCATION:${location.replace(/\r?\n/g, " ")}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const icsDataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsLines)}`;

  return { googleUrl, icsDataUrl };
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
