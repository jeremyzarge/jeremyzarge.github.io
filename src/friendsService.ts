/**
 * Friends system service — all CRUD operations for user relationships
 */
import { ref, get, update, onValue, type Unsubscribe } from "firebase/database";
import { rtdb } from "./firebaseClient";
import { logEvent } from "./notifications";
import type { UserRelationship } from "./types";

/**
 * Subscribe to all relationships for a user (real-time)
 */
export function subscribeToRelationships(
  userId: string,
  callback: (relationships: Record<string, UserRelationship>) => void
): Unsubscribe {
  const relRef = ref(rtdb, `user_relationships/${userId}`);
  return onValue(
    relRef,
    (snap) => {
      callback(snap.exists() ? snap.val() : {});
    },
    (error) => {
      console.warn("Failed to subscribe to relationships:", error.message);
      callback({});
    }
  );
}

/**
 * Send a friend request. Auto-accepts if a reverse request already exists.
 */
export async function sendFriendRequest(senderId: string, recipientId: string): Promise<void> {
  // Check if the recipient already sent us a request
  const reverseSnap = await get(ref(rtdb, `user_relationships/${senderId}/${recipientId}`));
  if (reverseSnap.exists()) {
    const existing = reverseSnap.val() as UserRelationship;
    if (existing.status === "request_received") {
      // Auto-accept: both become friends
      return acceptFriendRequest(senderId, recipientId);
    }
    if (existing.status === "friend") {
      return; // Already friends
    }
  }

  const now = Date.now();
  const updates: Record<string, UserRelationship> = {};
  updates[`user_relationships/${senderId}/${recipientId}`] = { status: "request_sent", timestamp: now };
  updates[`user_relationships/${recipientId}/${senderId}`] = { status: "request_received", timestamp: now };
  await update(ref(rtdb), updates);
  logEvent("friend_request_sent", { userId: senderId, recipientId });
}

/**
 * Accept a friend request (myId is the recipient)
 */
export async function acceptFriendRequest(myId: string, senderId: string): Promise<void> {
  const now = Date.now();
  const updates: Record<string, UserRelationship> = {};
  updates[`user_relationships/${myId}/${senderId}`] = { status: "friend", timestamp: now };
  updates[`user_relationships/${senderId}/${myId}`] = { status: "friend", timestamp: now };
  await update(ref(rtdb), updates);
  logEvent("friend_request_accepted", { userId: myId, friendId: senderId });
}

/**
 * Reject a friend request (myId is the recipient)
 */
export async function rejectFriendRequest(myId: string, senderId: string): Promise<void> {
  const updates: Record<string, null> = {};
  updates[`user_relationships/${myId}/${senderId}`] = null;
  updates[`user_relationships/${senderId}/${myId}`] = null;
  await update(ref(rtdb), updates);
}

/**
 * Cancel an outgoing friend request (myId is the sender)
 */
export async function cancelFriendRequest(myId: string, recipientId: string): Promise<void> {
  const updates: Record<string, null> = {};
  updates[`user_relationships/${myId}/${recipientId}`] = null;
  updates[`user_relationships/${recipientId}/${myId}`] = null;
  await update(ref(rtdb), updates);
}

/**
 * Remove an existing friendship
 */
export async function removeFriend(myId: string, friendId: string): Promise<void> {
  const updates: Record<string, null> = {};
  updates[`user_relationships/${myId}/${friendId}`] = null;
  updates[`user_relationships/${friendId}/${myId}`] = null;
  await update(ref(rtdb), updates);
}

/**
 * Get mutual friend IDs between two users
 */
export async function getMutualFriendIds(
  myRelationships: Record<string, UserRelationship>,
  otherUserId: string
): Promise<string[]> {
  const myFriendIds = Object.entries(myRelationships)
    .filter(([, r]) => r.status === "friend")
    .map(([id]) => id);

  const otherSnap = await get(ref(rtdb, `user_relationships/${otherUserId}`));
  if (!otherSnap.exists()) return [];

  const otherRels = otherSnap.val() as Record<string, UserRelationship>;
  const otherFriendIds = new Set(
    Object.entries(otherRels)
      .filter(([, r]) => r.status === "friend")
      .map(([id]) => id)
  );

  return myFriendIds.filter((id) => otherFriendIds.has(id));
}

/**
 * Helper: extract friend IDs from relationships
 */
export function getFriendIds(relationships: Record<string, UserRelationship>): string[] {
  return Object.entries(relationships)
    .filter(([, r]) => r.status === "friend")
    .map(([id]) => id);
}

/**
 * Helper: extract incoming request user IDs from relationships
 */
export function getIncomingRequestIds(relationships: Record<string, UserRelationship>): string[] {
  return Object.entries(relationships)
    .filter(([, r]) => r.status === "request_received")
    .map(([id]) => id);
}

/**
 * Helper: extract sent request user IDs from relationships
 */
export function getSentRequestIds(relationships: Record<string, UserRelationship>): string[] {
  return Object.entries(relationships)
    .filter(([, r]) => r.status === "request_sent")
    .map(([id]) => id);
}

/**
 * Suggests people to friend: non-friends the user has shared a meal with
 * (ranked first), then friends of those meal partners and friends of the
 * user's existing friends. Excludes the user themself and existing friends.
 */
export async function getFriendSuggestions(
  currentUserId: string,
  friendIds: string[],
  sharedMealPartnerIds: string[]
): Promise<string[]> {
  const suggestions: string[] = [];
  const seen = new Set<string>([currentUserId, ...friendIds]);
  const nonFriendPartners = sharedMealPartnerIds.filter((id) => !seen.has(id));

  for (const id of nonFriendPartners) {
    if (seen.has(id)) continue;
    seen.add(id);
    suggestions.push(id);
  }

  const seedIds = [...nonFriendPartners, ...friendIds];
  const seedRelSnaps = await Promise.all(
    seedIds.map((id) => get(ref(rtdb, `user_relationships/${id}`)))
  );
  for (const snap of seedRelSnaps) {
    if (!snap.exists()) continue;
    const rels = snap.val() as Record<string, UserRelationship>;
    for (const [id, r] of Object.entries(rels)) {
      if (r.status !== "friend" || seen.has(id)) continue;
      seen.add(id);
      suggestions.push(id);
    }
  }

  return suggestions;
}
