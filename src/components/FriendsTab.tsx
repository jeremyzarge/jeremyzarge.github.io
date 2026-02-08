import { useState, useMemo, useEffect } from "react";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getFriendIds,
  getIncomingRequestIds,
  getSentRequestIds,
  getMutualFriendIds,
} from "../friendsService";
import ClickableUserName from "./ClickableUserName";
import type { UserWithId, UserRelationship } from "../types";

/** Deterministic color from user ID for avatar accent */
const avatarColors = [
  "#667eea", "#764ba2", "#f093fb", "#10b981", "#f59e0b",
  "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];
function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

interface FriendsTabProps {
  currentUserId: string;
  allUsers: UserWithId[];
  relationships: Record<string, UserRelationship>;
  onViewProfile: (userId: string) => void;
  myId?: string;
}

type SubTab = "friends" | "incoming" | "sent";

export default function FriendsTab({
  currentUserId,
  allUsers,
  relationships,
  onViewProfile,
}: FriendsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const friendIds = useMemo(() => getFriendIds(relationships), [relationships]);
  const incomingIds = useMemo(() => getIncomingRequestIds(relationships), [relationships]);
  const sentIds = useMemo(() => getSentRequestIds(relationships), [relationships]);

  const userMap = useMemo(() => {
    const map: Record<string, UserWithId> = {};
    for (const u of allUsers) map[u.id] = u;
    return map;
  }, [allUsers]);

  // Search: filter all non-self, non-placeholder users
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return allUsers
      .filter(
        (u) =>
          u.id !== currentUserId &&
          u.first_name &&
          !u.placeholder &&
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [searchQuery, allUsers, currentUserId]);

  const subTabs: Array<{ id: SubTab; label: string; count: number; color: string }> = [
    { id: "friends", label: "My Friends", count: friendIds.length, color: "#10b981" },
    { id: "incoming", label: "Incoming", count: incomingIds.length, color: "#f59e0b" },
    { id: "sent", label: "Sent", count: sentIds.length, color: "#8b5cf6" },
  ];

  return (
    <div>
      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search for people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "14px 20px",
            borderRadius: 50,
            border: "2px solid #e5e7eb",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            outline: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div
          style={{
            marginBottom: 24,
            background: "white",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#374151", fontSize: "1rem" }}>
            Search Results
          </h3>
          {searchResults.length === 0 ? (
            <p style={{ color: "#9ca3af", margin: 0 }}>No users found</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {searchResults.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  onViewProfile={onViewProfile}
                  badge={
                    relationships[u.id]?.status === "friend"
                      ? "Friend"
                      : relationships[u.id]?.status === "request_sent"
                      ? "Request Sent"
                      : relationships[u.id]?.status === "request_received"
                      ? "Incoming Request"
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tabs */}
      <div
        className="tab-bar"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: "white",
          padding: 6,
          borderRadius: 50,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "fit-content",
        }}
      >
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            style={{
              padding: "10px 20px",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              background: activeSubTab === t.id ? t.color : "transparent",
              color: activeSubTab === t.id ? "white" : "#6b7280",
              fontWeight: 700,
              fontSize: "0.9rem",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
              boxShadow: activeSubTab === t.id ? `0 4px 12px ${t.color}40` : "none",
            }}
          >
            {t.label} {t.count > 0 && `(${t.count})`}
          </button>
        ))}
      </div>

      {/* Sub-Tab Content */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          minHeight: 120,
        }}
      >
        {activeSubTab === "friends" && (
          <FriendsList friendIds={friendIds} userMap={userMap} onViewProfile={onViewProfile} relationships={relationships} />
        )}
        {activeSubTab === "incoming" && (
          <IncomingRequests
            incomingIds={incomingIds}
            userMap={userMap}
            currentUserId={currentUserId}
            onViewProfile={onViewProfile}
          />
        )}
        {activeSubTab === "sent" && (
          <SentRequests
            sentIds={sentIds}
            userMap={userMap}
            currentUserId={currentUserId}
            onViewProfile={onViewProfile}
          />
        )}
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function FriendsList({
  friendIds,
  userMap,
  onViewProfile,
  relationships,
}: {
  friendIds: string[];
  userMap: Record<string, UserWithId>;
  onViewProfile: (id: string) => void;
  relationships: Record<string, UserRelationship>;
}) {
  const [mutualCounts, setMutualCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    async function loadMutuals() {
      const counts: Record<string, number> = {};
      for (const id of friendIds) {
        const mutuals = await getMutualFriendIds(relationships, id);
        if (cancelled) return;
        counts[id] = mutuals.length;
      }
      setMutualCounts(counts);
    }
    if (friendIds.length > 0) loadMutuals();
    return () => { cancelled = true; };
  }, [friendIds, relationships]);

  if (friendIds.length === 0) {
    return <p style={{ color: "#9ca3af", margin: 0 }}>No friends yet. Search for people above!</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {friendIds.map((id) => {
        const u = userMap[id];
        if (!u) return null;
        return (
          <UserRow
            key={id}
            user={u}
            onViewProfile={onViewProfile}
            mutualCount={mutualCounts[id]}
          />
        );
      })}
    </div>
  );
}

function IncomingRequests({
  incomingIds,
  userMap,
  currentUserId,
  onViewProfile,
}: {
  incomingIds: string[];
  userMap: Record<string, UserWithId>;
  currentUserId: string;
  onViewProfile: (id: string) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  if (incomingIds.length === 0) {
    return <p style={{ color: "#9ca3af", margin: 0 }}>No incoming requests</p>;
  }

  async function handleAccept(senderId: string) {
    setLoading(senderId);
    await acceptFriendRequest(currentUserId, senderId);
    setLoading(null);
  }

  async function handleReject(senderId: string) {
    setLoading(senderId);
    await rejectFriendRequest(currentUserId, senderId);
    setLoading(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {incomingIds.map((id) => {
        const u = userMap[id];
        if (!u) return null;
        const color = getAvatarColor(id);
        const initials = `${(u.first_name || "?")[0]}${(u.last_name || "?")[0]}`.toUpperCase();
        return (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 14,
              background: "#fffbeb",
              border: "2px solid #fde68a",
              borderLeft: `4px solid #f59e0b`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                border: `2px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.9rem",
                color: color,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ClickableUserName
                userId={u.id}
                firstName={u.first_name}
                lastName={u.last_name}
                onClick={onViewProfile}
                style={{ fontWeight: 700, fontSize: "0.95rem" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <SmallButton
                label="Accept"
                bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                disabled={loading === id}
                onClick={() => handleAccept(id)}
              />
              <SmallButton
                label="Reject"
                bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                disabled={loading === id}
                onClick={() => handleReject(id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SentRequests({
  sentIds,
  userMap,
  currentUserId,
  onViewProfile,
}: {
  sentIds: string[];
  userMap: Record<string, UserWithId>;
  currentUserId: string;
  onViewProfile: (id: string) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  if (sentIds.length === 0) {
    return <p style={{ color: "#9ca3af", margin: 0 }}>No pending sent requests</p>;
  }

  async function handleCancel(recipientId: string) {
    setLoading(recipientId);
    await cancelFriendRequest(currentUserId, recipientId);
    setLoading(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sentIds.map((id) => {
        const u = userMap[id];
        if (!u) return null;
        const color = getAvatarColor(id);
        const initials = `${(u.first_name || "?")[0]}${(u.last_name || "?")[0]}`.toUpperCase();
        return (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 14,
              background: "#f5f3ff",
              border: "2px solid #ddd6fe",
              borderLeft: "4px solid #8b5cf6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                border: `2px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.9rem",
                color: color,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ClickableUserName
                userId={u.id}
                firstName={u.first_name}
                lastName={u.last_name}
                onClick={onViewProfile}
                style={{ fontWeight: 700, fontSize: "0.95rem" }}
              />
            </div>
            <SmallButton
              label="Cancel"
              bg="linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
              disabled={loading === id}
              onClick={() => handleCancel(id)}
            />
          </div>
        );
      })}
    </div>
  );
}

function UserRow({
  user,
  onViewProfile,
  badge,
  mutualCount,
}: {
  user: UserWithId;
  onViewProfile: (id: string) => void;
  badge?: string;
  mutualCount?: number;
}) {
  const color = getAvatarColor(user.id);
  const initials = `${(user.first_name || "?")[0]}${(user.last_name || "?")[0]}`.toUpperCase();

  return (
    <div
      className="friend-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        borderRadius: 14,
        background: "white",
        border: "2px solid #e5e7eb",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={() => onViewProfile(user.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "0.9rem",
          color: color,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Name and details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <ClickableUserName
          userId={user.id}
          firstName={user.first_name}
          lastName={user.last_name}
          onClick={onViewProfile}
          style={{ fontWeight: 700, fontSize: "0.95rem" }}
        />
        {mutualCount !== undefined && mutualCount > 0 && (
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>
            {mutualCount} mutual friend{mutualCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Badge (for search results) */}
      {badge && (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: 50,
            background: badge === "Friend" ? "#10b98120" : "#e5e7eb",
            color: badge === "Friend" ? "#10b981" : "#6b7280",
            fontWeight: 700,
            fontSize: "0.75rem",
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function SmallButton({
  label,
  bg,
  disabled,
  onClick,
}: {
  label: string;
  bg: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 16px",
        borderRadius: 8,
        border: "none",
        background: disabled ? "#d1d5db" : bg,
        color: "white",
        fontWeight: 700,
        fontSize: "0.85rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}
