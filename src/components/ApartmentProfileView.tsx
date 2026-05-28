import React, { useEffect, useRef, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb, updateApartment } from "../firebaseClient";
import { fetchAllApartments, fetchAddressSuggestions } from "../utils";
import ClickableUserName from "./ClickableUserName";
import {
  subscribeToApartmentRequests,
  subscribeToSentInvites,
  approveJoinRequest,
  rejectJoinRequest,
  removeMember,
  signalMemberRemoval,
  inviteMember,
  cancelInvite,
  requestToJoinApartment,
  cancelJoinRequest,
} from "../apartmentService";
import type { ApartmentRequest, SentInvite } from "../apartmentService";
import { notifyUsers } from "../notifications";
import type { UserProfile, UserWithId, Meal } from "../types";

interface ApartmentProfileViewProps {
  apartmentId: string;
  currentUserId: string;
  currentUser: UserProfile | null;
  allUsers: UserWithId[];
  onClose: () => void;
  onViewProfile: (userId: string) => void;
  onViewMeal?: (mealId: string) => void;
  onApartmentUpdated?: () => void;
}

export default function ApartmentProfileView({
  apartmentId,
  currentUserId,
  currentUser,
  allUsers,
  onClose,
  onViewProfile,
  onViewMeal,
  onApartmentUpdated,
}: ApartmentProfileViewProps) {
  const [loading, setLoading] = useState(true);
  const [aptName, setAptName] = useState("");
  const [aptAddress, setAptAddress] = useState("");
  const [meals, setMeals] = useState<Array<{ id: string; title: string; datetime: string }>>([]);
  const [pastMealsShown, setPastMealsShown] = useState(5);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAddressUnit, setEditAddressUnit] = useState("");
  const [saving, setSaving] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const addressComboRef = useRef<HTMLDivElement>(null);

  // Join requests (real-time)
  const [pendingRequests, setPendingRequests] = useState<ApartmentRequest[]>([]);

  // Sent invites (real-time, members only)
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);
  const [cancelingInvite, setCancelingInvite] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  // Invite member
  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteDropdownOpen, setInviteDropdownOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const inviteRef = useRef<HTMLDivElement>(null);

  // Request to join (local optimistic state)
  const [localPendingRequest, setLocalPendingRequest] = useState(
    currentUser?.pending_apartment_request === apartmentId
  );
  const [joiningOrLeaving, setJoiningOrLeaving] = useState(false);

  const members = allUsers.filter((u) => u.apartment === apartmentId && u.first_name && !u.placeholder);
  const memberIds = members.map((u) => u.id);
  const isMember = allUsers.find((u) => u.id === currentUserId)?.apartment === apartmentId;
  const currentUserProfile = allUsers.find((u) => u.id === currentUserId);
  const currentUserName = currentUserProfile?.first_name
    ? `${currentUserProfile.first_name} ${currentUserProfile.last_name ?? ""}`.trim()
    : "A member";

  // Load apartment details and meals
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAllApartments(),
      get(ref(rtdb, "meal_events")),
    ]).then(([apts, mealsSnap]) => {
      const apt = apts.find((a) => a.id === apartmentId);
      setAptName(apt?.name ?? "");
      setAptAddress(apt?.address ?? "");

      if (mealsSnap.exists()) {
        const allMeals = mealsSnap.val() as Record<string, Meal>;
        const aptMeals: Array<{ id: string; title: string; datetime: string }> = [];
        for (const [mealId, meal] of Object.entries(allMeals)) {
          if (meal.host_apartment_id === apartmentId) {
            aptMeals.push({ id: mealId, title: meal.title || "Untitled", datetime: meal.datetime ?? "" });
          }
        }
        aptMeals.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        setMeals(aptMeals);
      }
      setLoading(false);
    });
  }, [apartmentId]);

  // Real-time join requests and sent invites (members only)
  useEffect(() => {
    if (!isMember) return;
    const unsub1 = subscribeToApartmentRequests(apartmentId, setPendingRequests);
    const unsub2 = subscribeToSentInvites(apartmentId, setSentInvites);
    return () => { unsub1(); unsub2(); };
  }, [apartmentId, isMember]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inviteRef.current && !inviteRef.current.contains(e.target as Node)) {
        setInviteDropdownOpen(false);
      }
      if (addressComboRef.current && !addressComboRef.current.contains(e.target as Node)) {
        setAddressDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced address autocomplete while editing
  useEffect(() => {
    if (!editing) return;
    const q = editAddress.trim();
    if (!q || q.length < 3) { setAddressSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const labels = await fetchAddressSuggestions(q);
        setAddressSuggestions(labels);
        if (labels.length > 0) setAddressDropdownOpen(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timeout);
  }, [editAddress, editing]);

  // Sync localPendingRequest when currentUser prop changes
  useEffect(() => {
    setLocalPendingRequest(currentUser?.pending_apartment_request === apartmentId);
  }, [currentUser, apartmentId]);

  const startEditing = () => {
    setEditName(aptName);
    setEditAddress(aptAddress);
    setEditAddressUnit("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    const fullAddress = editAddressUnit.trim()
      ? `${editAddress.trim()}, ${editAddressUnit.trim()}`
      : editAddress.trim();
    try {
      await updateApartment(apartmentId, editName.trim(), fullAddress);
      setAptName(editName.trim());
      setAptAddress(fullAddress);
      setEditing(false);
    } catch {
      alert("Failed to save apartment.");
    } finally {
      setSaving(false);
    }
  };

  const handleApproveRequest = async (requesterId: string) => {
    setProcessingRequest(requesterId);
    try {
      await approveJoinRequest(requesterId, apartmentId);
      const requester = allUsers.find((u) => u.id === requesterId);
      const requesterName = requester ? `${requester.first_name} ${requester.last_name}`.trim() : "Someone";
      notifyUsers([requesterId], {
        title: "Request approved!",
        body: `You've been added to ${aptName}.`,
        tag: `apt-approved-${apartmentId}-${requesterId}`,
        data: { tab: "profile", aptId: apartmentId },
      }, "apartment_invites");
      notifyUsers(memberIds.filter((id) => id !== currentUserId), {
        title: "New member joined",
        body: `${requesterName} joined ${aptName}.`,
        tag: `apt-joined-${apartmentId}-${requesterId}`,
        data: { tab: "profile", aptId: apartmentId },
      }, "apartment_requests");
      onApartmentUpdated?.();
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requesterId: string) => {
    setProcessingRequest(requesterId);
    try {
      await rejectJoinRequest(requesterId, apartmentId);
      notifyUsers([requesterId], {
        title: "Request declined",
        body: `Your request to join ${aptName} was not approved.`,
        tag: `apt-rejected-${apartmentId}-${requesterId}`,
        data: { tab: "profile" },
      }, "apartment_invites");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const targetUser = allUsers.find((u) => u.id === userId);
    const targetName = targetUser ? `${targetUser.first_name} ${targetUser.last_name}`.trim() : "this member";
    const isSelf = userId === currentUserId;
    const confirmMsg = isSelf
      ? `Leave ${aptName}? If you're the last member, the apartment will be deleted.`
      : `Remove ${targetName} from ${aptName}?`;
    if (!window.confirm(confirmMsg)) return;

    setJoiningOrLeaving(true);
    try {
      if (isSelf) {
        await removeMember(userId, apartmentId, memberIds);
        onApartmentUpdated?.();
        onClose();
      } else {
        // Signal removal via apartment_invites (writable by any auth user).
        // The target user's app watches for this and clears its own apartment field.
        await signalMemberRemoval(userId, apartmentId, aptName);
        notifyUsers([userId], {
          title: "Removed from apartment",
          body: `You've been removed from ${aptName}.`,
          tag: `apt-removed-${apartmentId}-${userId}`,
          data: { tab: "profile" },
        }, "apartment_invites");
        onApartmentUpdated?.();
      }
    } finally {
      setJoiningOrLeaving(false);
    }
  };

  const handleRequestToJoin = async () => {
    if (currentUser?.apartment) {
      alert("You're already in an apartment. Leave it first before joining another.");
      return;
    }
    setJoiningOrLeaving(true);
    try {
      await requestToJoinApartment(currentUserId, apartmentId, currentUserName);
      setLocalPendingRequest(true);
      notifyUsers(memberIds, {
        title: "New join request",
        body: `${currentUserName} wants to join ${aptName}.`,
        tag: `apt-request-${apartmentId}-${currentUserId}`,
        data: { tab: "profile", aptId: apartmentId },
      }, "apartment_requests");
      onApartmentUpdated?.();
    } finally {
      setJoiningOrLeaving(false);
    }
  };

  const handleCancelRequest = async () => {
    setJoiningOrLeaving(true);
    try {
      await cancelJoinRequest(currentUserId, apartmentId);
      setLocalPendingRequest(false);
      onApartmentUpdated?.();
    } finally {
      setJoiningOrLeaving(false);
    }
  };

  const handleInvite = async (inviteeId: string) => {
    const invitee = allUsers.find((u) => u.id === inviteeId);
    if (!invitee) return;
    const inviteeName = `${invitee.first_name} ${invitee.last_name ?? ""}`.trim();
    setInviting(true);
    setInviteSearch("");
    setInviteDropdownOpen(false);
    try {
      await inviteMember(currentUserId, currentUserName, inviteeId, inviteeName, apartmentId, aptName);
      notifyUsers([inviteeId], {
        title: "Apartment invitation",
        body: `${currentUserName} invited you to join ${aptName}.`,
        tag: `apt-invite-${apartmentId}-${inviteeId}`,
        data: { tab: "profile" },
      }, "apartment_invites");
    } finally {
      setInviting(false);
    }
  };

  const handleCancelInvite = async (inviteeId: string) => {
    setCancelingInvite(inviteeId);
    try {
      await cancelInvite(inviteeId, apartmentId);
    } finally {
      setCancelingInvite(null);
    }
  };

  const inviteCandidates = allUsers.filter((u) => {
    if (!u.first_name || u.placeholder) return false;
    if (u.apartment) return false;
    if (u.id === currentUserId) return false;
    if (!inviteSearch.trim()) return false;
    const full = `${u.first_name} ${u.last_name}`.toLowerCase();
    return full.includes(inviteSearch.toLowerCase());
  });

  const now = new Date();
  const upcomingMeals = meals.filter((m) => new Date(m.datetime) >= now);
  const pastMeals = meals.filter((m) => new Date(m.datetime) < now);

  const mealRow = (m: { id: string; title: string; datetime: string }) => (
    <div
      key={m.id}
      onClick={() => onViewMeal?.(m.id)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 10,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        fontSize: "0.85rem",
        cursor: onViewMeal ? "pointer" : "default",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { if (onViewMeal) e.currentTarget.style.background = "#dcfce7"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
    >
      <span style={{ fontWeight: 700, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>
        {m.title}
      </span>
      <span style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
        {m.datetime ? new Date(m.datetime).toLocaleDateString() : "—"}
      </span>
    </div>
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
        zIndex: 1100,
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 520,
          gap: 16,
          padding: 36,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "Inter, sans-serif",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {!loading && (
              editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ margin: "0 0 4px 0", fontWeight: 800, color: "#047857", fontSize: "1.1rem" }}>Edit Apartment</h3>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Apartment name *"
                    autoFocus
                    style={editInputStyle}
                  />
                  <div ref={addressComboRef} style={{ position: "relative" }}>
                    <input
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      onFocus={() => { if (addressSuggestions.length > 0) setAddressDropdownOpen(true); }}
                      placeholder="Address"
                      style={editInputStyle}
                    />
                    {addressDropdownOpen && addressSuggestions.length > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "2px solid #d1fae5",
                        borderRadius: 12,
                        zIndex: 300,
                        maxHeight: 220,
                        overflowY: "auto",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      }}>
                        {addressSuggestions.map((label) => (
                          <div
                            key={label}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setEditAddress(label);
                              setAddressDropdownOpen(false);
                              setAddressSuggestions([]);
                            }}
                            style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: "0.9rem", color: "#047857" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    value={editAddressUnit}
                    onChange={(e) => setEditAddressUnit(e.target.value)}
                    placeholder="Apt / Unit (optional)"
                    style={editInputStyle}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button
                      onClick={handleSave}
                      disabled={!editName.trim() || saving}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: !editName.trim() || saving ? "#d1d5db" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        cursor: !editName.trim() || saving ? "not-allowed" : "pointer",
                      }}
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setEditAddressUnit(""); setAddressSuggestions([]); setAddressDropdownOpen(false); }}
                      disabled={saving}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        border: "1px solid #d1d5db",
                        background: "white",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        color: "#374151",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontSize: "1.8rem",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {aptName}
                    </h2>
                    {isMember && (
                      <button
                        onClick={startEditing}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          background: "white",
                          color: "#6b7280",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                  {aptAddress && (
                    <div style={{ color: "#6b7280", fontSize: "1rem", marginTop: 4 }}>{aptAddress}</div>
                  )}
                </>
              )
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#9ca3af",
              padding: 4,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", color: "#9ca3af" }}>
            Loading…
          </div>
        ) : (
          <>
            {/* Members */}
            <div>
              <SectionTitle text={`Members (${members.length})`} />
              {members.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {members.map((u) => (
                    <div
                      key={u.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                    >
                      <ClickableUserName
                        userId={u.id}
                        firstName={u.first_name}
                        lastName={u.last_name}
                        onClick={onViewProfile}
                        style={{ fontSize: "0.95rem", lineHeight: 1 }}
                      />
                      {isMember && (
                        <button
                          onClick={() => handleRemoveMember(u.id)}
                          disabled={joiningOrLeaving}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 8,
                            border: u.id === currentUserId ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                            background: "white",
                            color: u.id === currentUserId ? "#ef4444" : "#6b7280",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            cursor: joiningOrLeaving ? "not-allowed" : "pointer",
                            flexShrink: 0,
                          }}
                        >
                          {u.id === currentUserId ? "Leave" : "Remove"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>No members</p>
              )}
            </div>

            {/* Join Requests (members only) */}
            {isMember && pendingRequests.length > 0 && (
              <div>
                <SectionTitle text={`Join Requests (${pendingRequests.length})`} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pendingRequests.map((req) => {
                    const requester = allUsers.find((u) => u.id === req.userId);
                    const resolvedFirst = requester?.first_name || req.name || req.userId;
                    const resolvedLast = requester?.first_name ? (requester.last_name ?? "") : "";
                    const busy = processingRequest === req.userId;
                    return (
                      <div
                        key={req.userId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid #d1fae5",
                          background: "#f0fdf4",
                          gap: 8,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <ClickableUserName
                            userId={req.userId}
                            firstName={resolvedFirst}
                            lastName={resolvedLast}
                            onClick={onViewProfile}
                            style={{ fontSize: "0.9rem" }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => handleApproveRequest(req.userId)}
                            disabled={busy}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              border: "none",
                              background: busy ? "#d1d5db" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "white",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                              cursor: busy ? "not-allowed" : "pointer",
                            }}
                          >
                            {busy ? "…" : "Approve"}
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.userId)}
                            disabled={busy}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 8,
                              border: "1px solid #fca5a5",
                              background: "white",
                              color: "#ef4444",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                              cursor: busy ? "not-allowed" : "pointer",
                            }}
                          >
                            {busy ? "…" : "Decline"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Invite Member (members only) */}
            {isMember && (
              <div>
                <SectionTitle text="Invite Someone" />
                <div ref={inviteRef} style={{ position: "relative" }}>
                  <input
                    value={inviteSearch}
                    onChange={(e) => { setInviteSearch(e.target.value); setInviteDropdownOpen(true); }}
                    onFocus={() => setInviteDropdownOpen(true)}
                    placeholder="Search by name…"
                    disabled={inviting}
                    style={{
                      ...editInputStyle,
                      opacity: inviting ? 0.6 : 1,
                    }}
                  />
                  {inviting && (
                    <div style={{ fontSize: "0.8rem", color: "#059669", marginTop: 4, fontWeight: 600 }}>
                      Invite sent!
                    </div>
                  )}
                  {inviteDropdownOpen && inviteSearch.trim() && inviteCandidates.length > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      background: "white",
                      border: "2px solid #e5e7eb",
                      borderRadius: 12,
                      zIndex: 200,
                      maxHeight: 200,
                      overflowY: "auto",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}>
                      {inviteCandidates.map((u) => (
                        <div
                          key={u.id}
                          onMouseDown={(e) => { e.preventDefault(); handleInvite(u.id); }}
                          style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                        >
                          <span style={{ fontWeight: 700, color: "#111827" }}>
                            {u.first_name} {u.last_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {inviteDropdownOpen && inviteSearch.trim() && inviteCandidates.length === 0 && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      background: "white",
                      border: "2px solid #e5e7eb",
                      borderRadius: 12,
                      zIndex: 200,
                      padding: "10px 16px",
                      color: "#9ca3af",
                      fontSize: "0.85rem",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}>
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pending outgoing invites (members only) */}
            {isMember && sentInvites.length > 0 && (
              <div>
                <SectionTitle text={`Pending Invitations (${sentInvites.length})`} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sentInvites.map((invite) => {
                    const busy = cancelingInvite === invite.userId;
                    return (
                      <div
                        key={invite.userId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid #e5e7eb",
                          background: "#f9fafb",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", flex: 1, minWidth: 0 }}>
                          {invite.inviteeName}
                        </span>
                        <button
                          onClick={() => handleCancelInvite(invite.userId)}
                          disabled={busy}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            border: "1px solid #d1d5db",
                            background: "white",
                            color: "#6b7280",
                            fontWeight: 600,
                            fontSize: "0.78rem",
                            cursor: busy ? "not-allowed" : "pointer",
                            flexShrink: 0,
                          }}
                        >
                          {busy ? "…" : "Cancel"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Non-member: request / cancel */}
            {!isMember && !currentUser?.apartment && (
              <div style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #d1fae5",
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}>
                {localPendingRequest ? (
                  <>
                    <div>
                      <div style={{ fontWeight: 700, color: "#047857", fontSize: "0.9rem" }}>Request pending</div>
                      <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Waiting for a member to approve</div>
                    </div>
                    <button
                      onClick={handleCancelRequest}
                      disabled={joiningOrLeaving}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        border: "1px solid #d1d5db",
                        background: "white",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: joiningOrLeaving ? "not-allowed" : "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {joiningOrLeaving ? "…" : "Cancel Request"}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      You're not a member of this apartment.
                    </div>
                    <button
                      onClick={handleRequestToJoin}
                      disabled={joiningOrLeaving}
                      style={{
                        padding: "8px 18px",
                        borderRadius: 10,
                        border: "none",
                        background: joiningOrLeaving ? "#d1d5db" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: joiningOrLeaving ? "not-allowed" : "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {joiningOrLeaving ? "…" : "Request to Join"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Meals */}
            <div>
              <SectionTitle text={`Meals (${meals.length})`} />
              {meals.length === 0 ? (
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>No meals hosted here</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {upcomingMeals.length > 0 && (
                    <div>
                      <SubLabel text={`Upcoming (${upcomingMeals.length})`} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {upcomingMeals.map(mealRow)}
                      </div>
                    </div>
                  )}
                  {pastMeals.length > 0 && (
                    <div>
                      <SubLabel text={`Past (${pastMeals.length})`} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {pastMeals.slice(0, pastMealsShown).map(mealRow)}
                      </div>
                      {pastMeals.length > pastMealsShown && (
                        <button
                          onClick={() => setPastMealsShown((n) => n + 5)}
                          style={{
                            marginTop: 6,
                            background: "none",
                            border: "none",
                            color: "#059669",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                          }}
                        >
                          Load more ({pastMeals.length - pastMealsShown} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const editInputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "2px solid #d1d5db",
  fontSize: "0.95rem",
  fontWeight: 600,
  fontFamily: "Inter, sans-serif",
  width: "100%",
  boxSizing: "border-box",
};

function SectionTitle({ text }: { text: string }) {
  return (
    <h4
      style={{
        margin: "0 0 8px 0",
        fontSize: "1rem",
        fontWeight: 800,
        background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </h4>
  );
}

function SubLabel({ text }: { text: string }) {
  return (
    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {text}
    </div>
  );
}
