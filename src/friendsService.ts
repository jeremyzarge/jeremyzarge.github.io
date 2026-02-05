/**
 * Friends system service — all CRUD operations for user relationships
 */
import { ref, get, update, onValue, type Unsubscribe } from "firebase/database";
import { rtdb } from "./firebaseClient";
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
