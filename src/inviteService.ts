import { ref, get, set } from "firebase/database";
import { rtdb } from "./firebaseClient";
import { sendFriendRequest } from "./friendsService";
import type { MealParticipant } from "./types";

/** Returns a shareable invite URL for a meal — no Firebase write needed. */
export function generateMealInviteUrl(mealId: string): string {
  return `${window.location.origin}${window.location.pathname}?invite=${mealId}`;
}

/** Returns a shareable friend invite URL tied to the sender's numeric user ID. */
export function generateFriendInviteUrl(myUserId: string): string {
  return `${window.location.origin}${window.location.pathname}?friend_invite=${myUserId}`;
}

/**
 * Claims a friend invite link. Sends a friend request from the inviter to the new user.
 * Returns true if successful, false if inviter doesn't exist or is the same user.
 */
export async function claimFriendInvite(inviterUserId: string, myUserId: string): Promise<boolean> {
  if (inviterUserId === myUserId) return false;
  const inviterSnap = await get(ref(rtdb, `users/${inviterUserId}`));
  if (!inviterSnap.exists()) return false;
  await sendFriendRequest(inviterUserId, myUserId);
  return true;
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
