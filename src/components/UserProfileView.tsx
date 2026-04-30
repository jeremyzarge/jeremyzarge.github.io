import { useEffect, useState } from "react";
import { notifyUsers } from "../notifications";
import { ref, get } from "firebase/database";
import { rtdb } from "../firebaseClient";
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
import type { UserWithId, Apartment, UserRelationship, RelationshipStatus, Meal } from "../types";

interface UserProfileViewProps {
  userId: string;
  currentUserId: string;
  allUsers: UserWithId[];
  relationships: Record<string, UserRelationship>;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
  onViewMeal?: (mealId: string) => void;
  onViewApartment?: (apartmentId: string) => void;
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

function getUpcomingShabbatWindows() {
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

export default function UserProfileView({
  userId,
  currentUserId,
  allUsers,
  relationships,
  onClose,
  onViewProfile,
  onViewMeal,
  onViewApartment,
}: UserProfileViewProps) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [mutualFriendIds, setMutualFriendIds] = useState<string[]>([]);
  const [commonMeals, setCommonMeals] = useState<Array<{ id: string; title: string; datetime: string }>>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pastMealsShown, setPastMealsShown] = useState(5);
  const [friendAttendsDinner, setFriendAttendsDinner] = useState(false);
  const [friendAttendsLunch, setFriendAttendsLunch] = useState(false);

  const user = allUsers.find((u) => u.id === userId);
  const rel = relationships[userId];
  const status = (rel?.status ?? "none") as RelationshipStatus | "none";

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([
      fetchAllApartments(),
      getMutualFriendIds(relationships, userId),
      get(ref(rtdb, "meal_events")),
    ]).then(([apts, mutualIds, mealsSnap]) => {
      setApartment(apts.find((a) => a.id === user.apartment) || null);
      setMutualFriendIds(mutualIds);

      if (mealsSnap.exists()) {
        const allMeals = mealsSnap.val() as Record<string, Meal>;
        const shared: Array<{ id: string; title: string; datetime: string }> = [];
        for (const [mealId, meal] of Object.entries(allMeals)) {
          const participants = meal.participants || {};
          const mine = participants[currentUserId];
          const theirs = participants[userId];
          if (mine?.accepted === true && theirs?.accepted === true) {
            shared.push({ id: mealId, title: meal.title || "Untitled", datetime: meal.datetime });
          }
        }
        shared.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        setCommonMeals(shared);

        // Compute friend's upcoming Shabbat meal attendance
        const { dinnerStart, dinnerEnd, lunchStart, lunchEnd } = getUpcomingShabbatWindows();
        let attendsDinner = false;
        let attendsLunch = false;
        for (const [, meal] of Object.entries(allMeals)) {
          const theirs = (meal.participants || {})[userId];
          if (theirs?.accepted === true && meal.datetime) {
            const dt = new Date(meal.datetime);
            if (dt >= dinnerStart && dt < dinnerEnd) attendsDinner = true;
            if (dt >= lunchStart && dt < lunchEnd) attendsLunch = true;
          }
        }
        setFriendAttendsDinner(attendsDinner);
        setFriendAttendsLunch(attendsLunch);
      }

      setLoading(false);
    });
  }, [userId, user, relationships, currentUserId]);

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
    ? [
        ...Object.entries(user.can_bring)
          .filter(([key, val]) => key !== "custom" && val === true)
          .map(([key]) => foodLabels[key] || key),
        ...(user.can_bring.custom || []),
      ]
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
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0", color: "#9ca3af", fontSize: "1rem" }}>
            Loading…
          </div>
        ) : <>

        {/* Header */}
        <div style={{ position: "relative", textAlign: "center", paddingRight: 32 }}>
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
              wordBreak: "break-word",
            }}
          >
            {user.first_name} {user.last_name}
          </h2>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#9ca3af",
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Shabbat meal status — only for friends */}
        {status === "friend" && userId !== currentUserId && (
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 4 }}>
            <MealStatusIcon icon="🍽️" label="Dinner" attending={friendAttendsDinner} />
            <MealStatusIcon icon="🥗" label="Lunch" attending={friendAttendsLunch} />
          </div>
        )}

        {/* Apartment — only visible to friends and self */}
        {(status === "friend" || userId === currentUserId) && (
          <div style={{ color: "#6b7280", fontSize: "1.05rem" }}>
            {apartment ? (
              <>
                {onViewApartment ? (
                  <ApartmentLink name={apartment.name} onClick={() => onViewApartment(apartment.id)} />
                ) : (
                  <span style={{ fontWeight: 700, color: "#374151" }}>{apartment.name}</span>
                )}
                <span> — {apartment.address}</span>
              </>
            ) : (
              <span>No apartment</span>
            )}
          </div>
        )}

        {/* Can Bring — friends and self only */}
        {(status === "friend" || userId === currentUserId) && (
          <div>
            <SectionTitle text={`Can Bring (${activeCanBring.length})`} />
            {activeCanBring.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeCanBring.map((label) => (
                  <Pill key={label} label={label} color="#10b981" />
                ))}
              </div>
            ) : (
              <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>None listed</p>
            )}
          </div>
        )}

        {/* Allergies — friends and self only */}
        {(status === "friend" || userId === currentUserId) && (
          <div>
            <SectionTitle text={`Allergies / Dietary (${allAllergies.length})`} />
            {allAllergies.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {allAllergies.map((label) => (
                  <Pill key={label} label={label} color="#f59e0b" />
                ))}
              </div>
            ) : (
              <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>None listed</p>
            )}
          </div>
        )}

        {/* Mutual Friends */}
        {userId !== currentUserId && (
          <div>
            <SectionTitle text={`Mutual Friends (${mutualFriends.length})`} />
            {mutualFriends.length > 0 ? (
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
            ) : (
              <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>No mutual friends</p>
            )}
          </div>
        )}

        {/* Common Meals */}
        {userId !== currentUserId && (() => {
          const now = new Date();
          const upcoming = commonMeals.filter((m) => new Date(m.datetime) >= now);
          const past = commonMeals.filter((m) => new Date(m.datetime) < now);
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
              <span style={{ fontWeight: 700, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>{m.title}</span>
              <span style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
                {new Date(m.datetime).toLocaleDateString()}
              </span>
            </div>
          );
          return (
            <div>
              <SectionTitle text={`Common Meals (${commonMeals.length})`} />
              {commonMeals.length === 0 ? (
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>No common meals</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {upcoming.length > 0 && (
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Upcoming ({upcoming.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {upcoming.map(mealRow)}
                      </div>
                    </div>
                  )}
                  {past.length > 0 && (
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Past ({past.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {past.slice(0, pastMealsShown).map(mealRow)}
                      </div>
                      {past.length > pastMealsShown && (
                        <button
                          onClick={() => setPastMealsShown((n) => n + 5)}
                          style={{
                            marginTop: 6,
                            background: "none",
                            border: "none",
                            color: "#764ba2",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                          }}
                        >
                          Load more ({past.length - pastMealsShown} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Friend Action */}
        {userId !== currentUserId && (
          <div style={{ marginTop: 8 }}>
            {status === "none" && (
              <ActionButton
                label="Send Friend Request"
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                loading={actionLoading}
                onClick={() => handleAction(async () => {
                  await sendFriendRequest(currentUserId, userId);
                  const me = allUsers.find((u) => u.id === currentUserId);
                  const myName = me ? `${me.first_name} ${me.last_name}`.trim() : "Someone";
                  notifyUsers([userId], {
                    title: "New friend request",
                    body: `${myName} sent you a friend request`,
                    tag: `friend-request-${currentUserId}`,
                    data: { tab: "friends" },
                  }, "friend_requests");
                })}
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
        </>}
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

function MealStatusIcon({ icon, label, attending }: { icon: string; label: string; attending: boolean }) {
  const free = !attending;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: free ? "#dcfce7" : "#fee2e2",
          border: `2.5px solid ${free ? "#16a34a" : "#dc2626"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: free ? "#16a34a" : "#dc2626", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
    </div>
  );
}

function ApartmentLink({ name, onClick }: { name: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        font: "inherit",
        color: "#059669",
        fontWeight: 700,
        cursor: "pointer",
        textDecoration: hovered ? "underline" : "none",
        textAlign: "left",
      }}
    >
      {name}
    </button>
  );
}
