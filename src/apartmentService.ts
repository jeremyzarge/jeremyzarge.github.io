import { ref, set, remove, get, onValue, off } from "firebase/database";
import { rtdb } from "./firebaseClient";
import type { ApartmentInvite } from "./types";

// ─── Join requests ────────────────────────────────────────────────────────────

/** Send a request to join an apartment. Also records the pending apt on the user. */
export async function requestToJoinApartment(userId: string, aptId: string, name?: string): Promise<void> {
  await Promise.all([
    set(ref(rtdb, `apartment_requests/${aptId}/${userId}`), { timestamp: Date.now(), name: name ?? "" }),
    set(ref(rtdb, `users/${userId}/pending_apartment_request`), aptId),
  ]);
}

/** Cancel a pending join request. */
export async function cancelJoinRequest(userId: string, aptId: string): Promise<void> {
  await Promise.all([
    remove(ref(rtdb, `apartment_requests/${aptId}/${userId}`)),
    remove(ref(rtdb, `users/${userId}/pending_apartment_request`)),
  ]);
}

/**
 * Approve a join request. Sets approved:true on the existing request record
 * (apartment_requests is writable by any auth user) rather than directly
 * writing to the requester's user node (which Firebase rules restrict to self).
 * The requester's app watches for this flag and self-updates its apartment field.
 */
export async function approveJoinRequest(userId: string, aptId: string): Promise<void> {
  await set(ref(rtdb, `apartment_requests/${aptId}/${userId}/approved`), true);
}

/** Reject a join request: remove the record. The requester's app watches for the
 *  disappearance and clears its own pending_apartment_request. */
export async function rejectJoinRequest(userId: string, aptId: string): Promise<void> {
  await remove(ref(rtdb, `apartment_requests/${aptId}/${userId}`));
}

export interface ApartmentRequest {
  userId: string;
  name: string;
}

/** Subscribe to pending join requests for an apartment. Returns unsubscribe fn. */
export function subscribeToApartmentRequests(
  aptId: string,
  callback: (requests: ApartmentRequest[]) => void
): () => void {
  const r = ref(rtdb, `apartment_requests/${aptId}`);
  const handler = (snap: any) => {
    if (!snap.exists()) { callback([]); return; }
    const val = snap.val() as Record<string, { timestamp: number; name?: string; approved?: boolean }>;
    callback(
      Object.entries(val)
        .filter(([, data]) => !data.approved)
        .map(([userId, data]) => ({ userId, name: data.name ?? "" }))
    );
  };
  onValue(r, handler);
  return () => off(r, "value", handler);
}

// ─── Invites ──────────────────────────────────────────────────────────────────

export interface SentInvite {
  userId: string;
  inviteeName: string;
  timestamp: number;
}

/** Invite a user to join an apartment. Mirrors to apartments/{aptId}/invites for apartment-side view. */
export async function inviteMember(
  inviterId: string,
  inviterName: string,
  inviteeId: string,
  inviteeName: string,
  aptId: string,
  aptName: string
): Promise<void> {
  const timestamp = Date.now();
  await Promise.all([
    set(ref(rtdb, `apartment_invites/${inviteeId}/${aptId}`), {
      aptId,
      aptName,
      invitedBy: inviterId,
      invitedByName: inviterName,
      timestamp,
    }),
    set(ref(rtdb, `apartments/${aptId}/invites/${inviteeId}`), {
      inviteeName,
      timestamp,
    }),
  ]);
}

/** Cancel an outgoing invite (member cancels invite they sent). */
export async function cancelInvite(inviteeId: string, aptId: string): Promise<void> {
  await Promise.all([
    remove(ref(rtdb, `apartment_invites/${inviteeId}/${aptId}`)),
    remove(ref(rtdb, `apartments/${aptId}/invites/${inviteeId}`)),
  ]);
}

/** Subscribe to invites sent by an apartment. Returns unsubscribe fn. */
export function subscribeToSentInvites(
  aptId: string,
  callback: (invites: SentInvite[]) => void
): () => void {
  const r = ref(rtdb, `apartments/${aptId}/invites`);
  const handler = (snap: any) => {
    if (!snap.exists()) { callback([]); return; }
    const val = snap.val() as Record<string, { inviteeName: string; timestamp: number }>;
    const invites = Object.entries(val).map(([userId, data]) => ({
      userId,
      inviteeName: data.inviteeName ?? "",
      timestamp: data.timestamp ?? 0,
    }));
    invites.sort((a, b) => b.timestamp - a.timestamp);
    callback(invites);
  };
  onValue(r, handler);
  return () => off(r, "value", handler);
}

/**
 * Cancel any pending join request and clear all outstanding invites for a user.
 * Call this whenever a user officially joins or creates an apartment.
 */
export async function clearUserApartmentPending(userId: string): Promise<void> {
  const pendingSnap = await get(ref(rtdb, `users/${userId}/pending_apartment_request`));
  const pendingAptId = pendingSnap.exists() ? (pendingSnap.val() as string) : null;
  await Promise.all([
    remove(ref(rtdb, `users/${userId}/pending_apartment_request`)),
    ...(pendingAptId ? [remove(ref(rtdb, `apartment_requests/${pendingAptId}/${userId}`))] : []),
  ]);
  await clearAllInvitesForUser(userId);
}

/** Accept an invite: set apartment, cancel any pending request, clear all outstanding invites. */
export async function acceptApartmentInvite(userId: string, aptId: string): Promise<void> {
  await set(ref(rtdb, `users/${userId}/apartment`), aptId);
  await clearUserApartmentPending(userId);
}

/** Decline an invite (user declines). */
export async function declineApartmentInvite(userId: string, aptId: string): Promise<void> {
  await Promise.all([
    remove(ref(rtdb, `apartment_invites/${userId}/${aptId}`)),
    remove(ref(rtdb, `apartments/${aptId}/invites/${userId}`)),
  ]);
}

/** Remove all pending invites sent to a user (call when they join any apartment). */
export async function clearAllInvitesForUser(userId: string): Promise<void> {
  const snap = await get(ref(rtdb, `apartment_invites/${userId}`));
  if (!snap.exists()) return;
  const entries = snap.val() as Record<string, { type?: string }>;
  await Promise.all([
    ...Object.keys(entries)
      .filter((aptId) => !entries[aptId].type || entries[aptId].type !== "removal")
      .map((aptId) => remove(ref(rtdb, `apartments/${aptId}/invites/${userId}`))),
    remove(ref(rtdb, `apartment_invites/${userId}`)),
  ]);
}

/** Subscribe to pending invites for a user (excludes removal signals). Returns unsubscribe fn. */
export function subscribeToUserInvites(
  userId: string,
  callback: (invites: ApartmentInvite[]) => void
): () => void {
  const r = ref(rtdb, `apartment_invites/${userId}`);
  const handler = (snap: any) => {
    if (!snap.exists()) { callback([]); return; }
    const all: ApartmentInvite[] = Object.values(snap.val());
    const invites = all.filter((i) => i.type !== "removal");
    invites.sort((a, b) => b.timestamp - a.timestamp);
    callback(invites);
  };
  onValue(r, handler);
  return () => off(r, "value", handler);
}

/**
 * Signal that a member should be removed from an apartment.
 * Writes to apartment_invites (auth != null) so any authenticated member can do it.
 * The target user's app watches for this signal and clears its own apartment field.
 */
export async function signalMemberRemoval(
  userId: string,
  aptId: string,
  aptName: string
): Promise<void> {
  await set(ref(rtdb, `apartment_invites/${userId}/${aptId}`), {
    aptId,
    aptName,
    invitedBy: "",
    invitedByName: "",
    type: "removal",
    timestamp: Date.now(),
  });
}

// ─── Membership ───────────────────────────────────────────────────────────────

/** Remove a member from an apartment. Deletes the apartment if they were the last member. */
export async function removeMember(
  userId: string,
  aptId: string,
  allUserIds: string[]
): Promise<void> {
  await set(ref(rtdb, `users/${userId}/apartment`), "");

  // Check if any other members remain
  const remaining = allUserIds.filter((id) => id !== userId);
  if (remaining.length > 0) {
    const checks = await Promise.all(
      remaining.map((id) => get(ref(rtdb, `users/${id}/apartment`)))
    );
    const hasOthers = checks.some((s) => s.val() === aptId);
    if (hasOthers) return;
  }

  // No members left — delete the apartment and any pending requests
  await Promise.all([
    remove(ref(rtdb, `apartments/${aptId}`)),
    remove(ref(rtdb, `apartment_requests/${aptId}`)),
  ]);
}

/** Leave an apartment voluntarily (same logic as remove). */
export async function leaveApartment(
  userId: string,
  aptId: string,
  allUserIds: string[]
): Promise<void> {
  return removeMember(userId, aptId, allUserIds);
}
