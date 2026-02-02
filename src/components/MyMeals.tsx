import { useEffect, useState, useMemo } from "react";
import { rtdb } from "../firebaseClient";
import { ref, get } from "firebase/database";
import { formatApartmentName } from "../utils";
import type { User } from "firebase/auth";
import type { Apartment, UserWithId, Meal, LegacyMeal } from "../types";
import MealEditor from "./MealEditor";

interface MyMealsProps {
  myId: string;
  users: UserWithId[];
  apartments: Apartment[];
  mode: "past" | "upcoming";
  authUser: User | null;
}

type MealWithId = (Meal | LegacyMeal) & { id: string };

/**
 * Displays user's meal history with filtering and sorting
 */
export default function MyMeals({ myId, users, apartments, mode, authUser }: MyMealsProps) {
  const [mealEvents, setMealEvents] = useState<MealWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");
  const [hostGuestFilter, setHostGuestFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    async function loadMeals() {
      setLoading(true);
      const snap = await get(ref(rtdb, "meal_events"));
      const data = snap.exists() ? snap.val() : {};
      const list = Object.entries(data).map(([id, m]) => ({ id, ...(m as any) }));
      setMealEvents(list);
      setLoading(false);
    }
    loadMeals();
  }, []);

  /**
   * Helper to check if user is a participant (handles both old and new format)
   */
  const isUserInMeal = (meal: MealWithId, userId: string): boolean => {
    // New format
    if ("participants" in meal && meal.participants) {
      return userId in meal.participants;
    }
    // Legacy format
    if ("hosts" in meal || "guests" in meal) {
      return !!(meal.hosts?.[userId] || meal.guests?.[userId]);
    }
    return false;
  };

  /**
   * Helper to get user's role in meal (handles both old and new format)
   */
  const getUserRole = (meal: MealWithId, userId: string): "host" | "guest" | null => {
    // New format
    if ("participants" in meal && meal.participants?.[userId]) {
      return meal.participants[userId].role;
    }
    // Legacy format
    if ("hosts" in meal && meal.hosts?.[userId]) return "host";
    if ("guests" in meal && meal.guests?.[userId]) return "guest";
    return null;
  };

  /**
   * Helper to get all participant IDs (handles both formats)
   */
  const getParticipantIds = (meal: MealWithId): string[] => {
    if ("participants" in meal && meal.participants) {
      return Object.keys(meal.participants);
    }
    if ("hosts" in meal || "guests" in meal) {
      return [...Object.keys(meal.hosts || {}), ...Object.keys(meal.guests || {})];
    }
    return [];
  };

  const filteredMeals = useMemo(() => {
    return mealEvents
      .filter((m) => isUserInMeal(m, myId))
      .filter((m) => {
        const mealDate = new Date(m.datetime);
        const now = new Date();
        if (mode === "past" && mealDate > now) return false;
        if (mode === "upcoming" && mealDate < now) return false;
        if (searchText && !m.title.toLowerCase().includes(searchText.toLowerCase()))
          return false;

        if (selectedUser) {
          const participantIds = getParticipantIds(m);
          if (!participantIds.includes(selectedUser)) return false;
        }

        if (selectedApartment && m.host_apartment_id !== selectedApartment) return false;

        if (hostGuestFilter) {
          const role = getUserRole(m, myId);
          if (hostGuestFilter === "host" && role !== "host") return false;
          if (hostGuestFilter === "guest" && role !== "guest") return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date_asc":
            return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
          case "date_desc":
            return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
          case "title_asc":
            return a.title.localeCompare(b.title);
          case "title_desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [mealEvents, searchText, selectedUser, selectedApartment, hostGuestFilter, sortBy, myId, mode]);

  if (loading) return <div style={{ padding: 20 }}>Loading meals...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ marginBottom: 16, color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.2)", fontWeight: 800 }}>
        {mode === "past" ? "Past" : "Upcoming"} Meals
      </h2>

      {/* Filters */}
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          marginBottom: 20,
          border: "3px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <h4
          style={{
            margin: "0 0 16px 0",
            fontWeight: 800,
            fontSize: "1.1rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Filter & Sort
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <input
            placeholder="🔍 Search title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #fde68a",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              color: "#78350f",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
          />

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #93c5fd",
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              color: "#1e3a8a",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="">👤 All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.first_name} {u.last_name}
              </option>
            ))}
          </select>

          <select
            value={selectedApartment}
            onChange={(e) => setSelectedApartment(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #7dd3fc",
              background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
              color: "#0c4a6e",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="">🏠 All Apartments</option>
            {apartments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={hostGuestFilter}
            onChange={(e) => setHostGuestFilter(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #6ee7b7",
              background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              color: "#065f46",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="">🎭 All Roles</option>
            <option value="host">Host</option>
            <option value="guest">Guest</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #c4b5fd",
              background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
              color: "#5b21b6",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="date_desc">📅 Date ↓</option>
            <option value="date_asc">📅 Date ↑</option>
            <option value="title_asc">🔤 Title A→Z</option>
            <option value="title_desc">🔤 Title Z→A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          background: "#fef9c3",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead style={{ background: "#fef3c7" }}>
            <tr>
              {["Title", "Date", "Apartment", "Role"].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    color: "#78350f",
                    fontWeight: 600,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredMeals.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ padding: 12, textAlign: "center", color: "#78350f" }}
                >
                  No meals match the filters.
                </td>
              </tr>
            ) : (
              filteredMeals.map((m) => {
                const apt = apartments.find((a) => a.id === m.host_apartment_id);
                const aptDisplay = apt ? formatApartmentName(apt) : "—";
                const role = getUserRole(m, myId);
                const roleDisplay = role === "host" ? "Host" : role === "guest" ? "Guest" : "—";

                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: "1px solid #fde68a",
                      transition: "background 0.2s",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedMealId(m.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fef3c7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: 12 }}>{m.title}</td>
                    <td style={{ padding: 12 }}>{new Date(m.datetime).toLocaleString()}</td>
                    <td style={{ padding: 12 }}>{aptDisplay}</td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 20,
                          background:
                            roleDisplay === "Host"
                              ? "#3b82f6"
                              : roleDisplay === "Guest"
                              ? "#10b981"
                              : "#9ca3af",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {roleDisplay}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedMealId && (
        <MealEditor
          mealId={selectedMealId}
          authUser={authUser}
          currentUserId={myId}
          onClose={() => setSelectedMealId(null)}
        />
      )}
    </div>
  );
}
