import { useEffect, useMemo, useRef, useState } from "react";
import type { Apartment, Meal, MealParticipant, UserWithId } from "../types";
import { attemptCloseWithUnsavedChanges } from "../utils";
import ClickableUserName from "./ClickableUserName";

interface ManageParticipantsModalProps {
  meal: Meal;
  users: UserWithId[];
  apartments: Apartment[];
  friendIds?: string[];
  currentUserId: string | null;
  onViewProfile?: (userId: string) => void;
  isResidentOfHostApartment: (userId: string) => boolean;
  onSave: (participants: Record<string, MealParticipant>) => void | Promise<void>;
  onClose: () => void;
}

/**
 * Host-only modal for managing meal participants: inviting new users,
 * reviewing pending invites, and toggling people between host/guest.
 * Edits are staged locally in this modal — Save applies them immediately
 * (invites, kicks, role changes take effect right away, independent of the
 * overall meal Save).
 */
export default function ManageParticipantsModal({
  meal,
  users,
  apartments,
  friendIds,
  currentUserId,
  onViewProfile,
  isResidentOfHostApartment,
  onSave,
  onClose,
}: ManageParticipantsModalProps) {
  const [participants, setParticipants] = useState<Record<string, MealParticipant>>(() =>
    structuredClone(meal.participants)
  );
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasChanges = useMemo(
    () => JSON.stringify(participants) !== JSON.stringify(meal.participants),
    [participants, meal.participants]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(participants);
      onClose();
    } catch {
      // onSave already surfaced the error — keep the modal open so the host can retry.
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => attemptCloseWithUnsavedChanges(hasChanges, handleSave, onClose);

  const addParticipant = (userId: string) => {
    if (userId in participants) return;
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const role = user.apartment === meal.host_apartment_id ? "host" : "guest";
    setParticipants((prev) => ({ ...prev, [userId]: { food: "none", specifics: "", role } }));
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const toggleRole = (userId: string) => {
    const participant = participants[userId];
    if (!participant) return;
    if (isResidentOfHostApartment(userId) && participant.role === "host") return; // residents must remain hosts
    setParticipants((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], role: prev[userId].role === "host" ? "guest" : "host" },
    }));
  };

  const friendSet = useMemo(() => new Set(friendIds || []), [friendIds]);

  const availableUsers = useMemo(() => {
    const participantIds = new Set(Object.keys(participants));
    const available = users.filter((u) => !participantIds.has(u.id));
    return available.sort((a, b) => {
      const aIsFriend = friendSet.has(a.id) ? 0 : 1;
      const bIsFriend = friendSet.has(b.id) ? 0 : 1;
      if (aIsFriend !== bIsFriend) return aIsFriend - bIsFriend;
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    });
  }, [users, participants, friendSet]);

  const filteredComboUsers = useMemo(() => {
    if (!userSearch.trim()) return [];
    const q = userSearch.toLowerCase();
    return availableUsers.filter((u) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      (apartments.find((a) => a.id === u.apartment)?.name || "").toLowerCase().includes(q)
    );
  }, [availableUsers, userSearch, apartments]);

  const handleAdd = () => {
    if (!selectedUserId) return;
    addParticipant(selectedUserId);
    setSelectedUserId("");
    setUserSearch("");
  };

  const participantsWithInfo = useMemo(() => {
    return Object.entries(participants).map(([userId, participant]) => {
      const user = users.find((u) => u.id === userId);
      return { userId, participant, user };
    });
  }, [participants, users]);

  const acceptedParticipants = participantsWithInfo.filter(({ participant }) => participant.accepted === true);
  const invitedParticipants = participantsWithInfo.filter(({ participant }) => participant.accepted !== true);

  const renderName = (userId: string, user: UserWithId | undefined) => {
    if (!user) return null;
    return onViewProfile ? (
      <ClickableUserName
        userId={userId}
        firstName={user.first_name}
        lastName={user.last_name}
        onClick={onViewProfile}
        style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }}
      />
    ) : (
      <span style={{ fontWeight: 700, color: "#374151" }}>{user.first_name} {user.last_name}</span>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable body */}
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          <h3
            style={{
              margin: "0 0 6px",
              fontWeight: 900,
              fontSize: "1.4rem",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            👥 Manage Participants
          </h3>
          <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "0.9rem" }}>
            Invite people, review pending invites, and set who's hosting.
          </p>

          {/* Invite section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 10, fontWeight: 800, color: "#1e40af", fontSize: "0.95rem" }}>
              Invite someone
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div ref={comboRef} style={{ flex: 1, minWidth: 0, position: "relative" }}>
                <input
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setSelectedUserId("");
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Search for a user..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "2px solid #60a5fa",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    background: "white",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
                {dropdownOpen && filteredComboUsers.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      background: "white",
                      border: "2px solid #60a5fa",
                      borderRadius: 10,
                      zIndex: 200,
                      maxHeight: 200,
                      overflowY: "auto",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                  >
                    {filteredComboUsers.map((u) => (
                      <div
                        key={u.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSelectedUserId(u.id);
                          setUserSearch(`${u.first_name} ${u.last_name}`);
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 14px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          borderBottom: "1px solid #f3f4f6",
                          display: "grid",
                          gridTemplateColumns: "1fr 46px 92px",
                          columnGap: 8,
                          alignItems: "start",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                      >
                        <span style={{ minWidth: 0, wordBreak: "break-word" }}>
                          {u.first_name} {u.last_name}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {friendSet.has(u.id) ? "friend" : ""}
                        </span>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#9ca3af",
                            textAlign: "right",
                            minWidth: 0,
                            wordBreak: "break-word",
                          }}
                        >
                          {apartments.find((a) => a.id === u.apartment)?.name || "No apt"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!selectedUserId}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: selectedUserId
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "#d1d5db",
                  color: "white",
                  cursor: selectedUserId ? "pointer" : "not-allowed",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  boxShadow: selectedUserId ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
                }}
              >
                Invite
              </button>
            </div>
          </div>

          {/* Pending invites */}
          {invitedParticipants.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 10, fontWeight: 800, color: "#9ca3af", fontSize: "0.95rem" }}>
                Pending ({invitedParticipants.length})
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 12, border: "2px solid #e5e7eb", padding: "0 14px" }}>
                {invitedParticipants.map(({ userId, user }) => (
                  <div
                    key={userId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#6b7280" }}>{renderName(userId, user)}</span>
                    {userId !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(userId)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 8,
                          border: "none",
                          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants — host/guest management */}
          <div>
            <div style={{ marginBottom: 10, fontWeight: 800, color: "#374151", fontSize: "0.95rem" }}>
              Participants ({acceptedParticipants.length})
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 12, border: "2px solid #e5e7eb", padding: "0 14px" }}>
              {acceptedParticipants.map(({ userId, participant, user }) => {
                const isResident = isResidentOfHostApartment(userId);
                const canToggle = !(isResident && participant.role === "host");
                return (
                  <div
                    key={userId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#374151", minWidth: 0 }}>{renderName(userId, user)}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => toggleRole(userId)}
                        disabled={!canToggle}
                        title={isResident && participant.role === "host" ? "Residents of host apartment must be hosts" : ""}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: "none",
                          background:
                            participant.role === "host"
                              ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: canToggle ? "pointer" : "not-allowed",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          opacity: canToggle ? 1 : 0.6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {participant.role === "host" ? "🏠 Host" : "Guest"}
                      </button>
                      {userId !== currentUserId && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(userId)}
                          title="Remove from meal"
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            border: "none",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "1rem",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {acceptedParticipants.length === 0 && (
                <div style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", padding: "16px 0" }}>
                  No participants yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer — sticky, matching other meal-editor modals */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0, padding: 24, background: "white", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <button
            onClick={handleClose}
            disabled={saving}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "2px solid #d1d5db",
              background: "white",
              color: "#6b7280",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              opacity: saving ? 0.7 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
