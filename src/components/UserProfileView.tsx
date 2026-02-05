import { useEffect, useState } from "react";
import { fetchAllApartments } from "../utils";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getMutualFriendIds,
} from "../friendsService";
import ClickableUserName from "./ClickableUserName";
import type { UserWithId, Apartment, UserRelationship, RelationshipStatus } from "../types";

interface UserProfileViewProps {
  userId: string;
  currentUserId: string;
  allUsers: UserWithId[];
  relationships: Record<string, UserRelationship>;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
}

const foodLabels: Record<string, string> = {
  drinks: "🥤 Drinks",
  dessert: "🍰 Dessert",
  salad: "🥗 Salad",
  main_dish: "🍝 Main Dish",
  snacks: "🍿 Snacks",
  sides: "🥔 Sides",
  utensils: "🍴 Utensils",
};

const allergyLabels: Record<string, string> = {
  gluten_free: "Gluten-free",
  dairy_free: "Dairy-free",
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  nut_allergy: "Nut Allergy",
};

export default function UserProfileView({
  userId,
  currentUserId,
  allUsers,
  relationships,
  onClose,
  onViewProfile,
}: UserProfileViewProps) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [mutualFriendIds, setMutualFriendIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const user = allUsers.find((u) => u.id === userId);
  const rel = relationships[userId];
  const status = (rel?.status ?? "none") as RelationshipStatus | "none";

  useEffect(() => {
    if (!user) return;
    fetchAllApartments().then((apts) => {
      setApartment(apts.find((a) => a.id === user.apartment) || null);
    });
    getMutualFriendIds(relationships, userId).then(setMutualFriendIds);
  }, [userId, user, relationships]);

  if (!user) {
    return null;
  }

  const activeAllergies = user.allergies
    ? Object.entries(user.allergies)
        .filter(([key, val]) => key !== "custom" && val === true)
        .map(([key]) => allergyLabels[key] || key)
    : [];
  const customAllergies = user.allergies?.custom || [];
  const allAllergies = [...activeAllergies, ...customAllergies];

  const activeCanBring = user.can_bring
    ? Object.entries(user.can_bring)
        .filter(([, val]) => val === true)
        .map(([key]) => foodLabels[key] || key)
    : [];

  const mutualFriends = allUsers.filter((u) => mutualFriendIds.includes(u.id));

  async function handleAction(action: () => Promise<void>) {
    setActionLoading(true);
    try {
      await action();
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div
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
        zIndex: 1000,
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
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
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2
            style={{
              margin: 0,
              fontWeight: 900,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "1.8rem",
              letterSpacing: "-0.5px",
            }}
          >
            {user.first_name} {user.last_name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#9ca3af",
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Apartment */}
        <div style={{ color: "#6b7280", fontSize: "1.05rem" }}>
          {apartment ? (
            <>
              <span style={{ fontWeight: 700 }}>{apartment.name}</span>
              <span> — {apartment.address}</span>
            </>
          ) : (
            <span>No apartment</span>
          )}
        </div>

        {/* Can Bring */}
        {activeCanBring.length > 0 && (
          <div>
            <SectionTitle text="Can Bring" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {activeCanBring.map((label) => (
                <Pill key={label} label={label} color="#10b981" />
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {allAllergies.length > 0 && (
          <div>
            <SectionTitle text="Allergies / Dietary" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {allAllergies.map((label) => (
                <Pill key={label} label={label} color="#f59e0b" />
              ))}
            </div>
          </div>
        )}

        {/* Mutual Friends */}
        {mutualFriends.length > 0 && (
          <div>
            <SectionTitle text={`Mutual Friends (${mutualFriends.length})`} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {mutualFriends.map((f) => (
                <ClickableUserName
                  key={f.id}
                  userId={f.id}
                  firstName={f.first_name}
                  lastName={f.last_name}
                  onClick={onViewProfile}
                  style={{ fontSize: "0.95rem" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Friend Action */}
        {userId !== currentUserId && (
          <div style={{ marginTop: 8 }}>
            {status === "none" && (
              <ActionButton
                label="Send Friend Request"
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                loading={actionLoading}
                onClick={() => handleAction(() => sendFriendRequest(currentUserId, userId))}
              />
            )}
            {status === "request_sent" && (
              <ActionButton
                label="Cancel Request"
                gradient="linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                loading={actionLoading}
                onClick={() => handleAction(() => cancelFriendRequest(currentUserId, userId))}
              />
            )}
            {status === "request_received" && (
              <div style={{ display: "flex", gap: 12 }}>
                <ActionButton
                  label="Accept"
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  loading={actionLoading}
                  onClick={() => handleAction(() => acceptFriendRequest(currentUserId, userId))}
                />
                <ActionButton
                  label="Reject"
                  gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  loading={actionLoading}
                  onClick={() => handleAction(() => rejectFriendRequest(currentUserId, userId))}
                />
              </div>
            )}
            {status === "friend" && (
              <ActionButton
                label="Remove Friend"
                gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                loading={actionLoading}
                onClick={() => {
                  if (confirm(`Remove ${user.first_name} ${user.last_name} as a friend?`)) {
                    handleAction(() => removeFriend(currentUserId, userId));
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <h4
      style={{
        margin: "0 0 8px 0",
        fontSize: "1rem",
        fontWeight: 800,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </h4>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 50,
        background: `${color}20`,
        color: color,
        fontWeight: 700,
        fontSize: "0.85rem",
      }}
    >
      {label}
    </span>
  );
}

function ActionButton({
  label,
  gradient,
  loading,
  onClick,
}: {
  label: string;
  gradient: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        flex: 1,
        padding: "12px 24px",
        borderRadius: 12,
        border: "none",
        background: loading ? "#d1d5db" : gradient,
        color: "white",
        fontWeight: 700,
        fontSize: "1rem",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
      }}
    >
      {loading ? "..." : label}
    </button>
  );
}
