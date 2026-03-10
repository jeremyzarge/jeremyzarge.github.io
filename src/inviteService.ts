import { ref, get, set } from "firebase/database";
import { rtdb } from "./firebaseClient";
import type { MealParticipant } from "./types";

/** Returns a shareable invite URL for a meal — no Firebase write needed. */
export function generateMealInviteUrl(mealId: string): string {
  return `${window.location.origin}${window.location.pathname}?invite=${mealId}`;
}

/** Adds the claimer as an accepted guest to the meal. Returns mealId on success, null if meal not found. */
export async function claimMealInvite(
  mealId: string,
  claimerId: string
): Promise<string | null> {
  const mealSnap = await get(ref(rtdb, `meal_events/${mealId}`));
  if (!mealSnap.exists()) return null;

  const participantRef = ref(rtdb, `meal_events/${mealId}/participants/${claimerId}`);
  const existingSnap = await get(participantRef);
  if (existingSnap.exists()) return mealId;

  const participant: MealParticipant = {
    food: "none",
    specifics: "",
    role: "guest",
  };
  await set(participantRef, participant);

  return mealId;
}
