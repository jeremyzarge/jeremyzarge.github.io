import { useEffect, useState, useMemo, useRef } from "react";
import { rtdb } from "../firebaseClient";
import { ref, get, set, remove, onValue } from "firebase/database";
import type { User } from "firebase/auth";
import type { Apartment, UserWithId, Meal, LegacyMeal } from "../types";
import MealEditor from "./MealEditor";

interface MyMealsProps {
  myId: string;
  users: UserWithId[];
  apartments: Apartment[];
  mode: "past" | "upcoming";
  authUser: User | null;
  friendIds?: string[];
  onViewProfile?: (userId: string) => void;
  onViewApartment?: (apartmentId: string) => void;
}

type MealWithId = (Meal | LegacyMeal) & { id: string };

/**
 * Displays user's meal history with filtering and sorting
 */
export default function MyMeals({ myId, users, apartments, mode, authUser, friendIds, onViewProfile, onViewApartment }: MyMealsProps) {
  const [mealEvents, setMealEvents] = useState<MealWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [viewingInvitedMealId, setViewingInvitedMealId] = useState<string | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");
  const [hostGuestFilter, setHostGuestFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [showAdvanced, setShowAdvanced] = useState(() => window.innerWidth > 768);

  // Searchable combobox states
  const [userSearch, setUserSearch] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aptSearch, setAptSearch] = useState("");
  const [aptDropdownOpen, setAptDropdownOpen] = useState(false);
  const userComboRef = useRef<HTMLDivElement>(null);
  const aptComboRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userComboRef.current && !userComboRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (aptComboRef.current && !aptComboRef.current.contains(e.target as Node)) {
        setAptDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Real-time listener for meal events
  useEffect(() => {
    setLoading(true);
    const mealsRef = ref(rtdb, "meal_events");

    const unsubscribe = onValue(mealsRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      const list = Object.entries(data).map(([id, m]) => ({ id, ...(m as any) }));
      setMealEvents(list);
      setLoading(false);
    });

    return () => unsubscribe();
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

  /**
   * Helper to check if user has accepted their invitation
   * Returns true for legacy meals (backward compatibility)
   */
  const isUserAccepted = (meal: MealWithId, userId: string): boolean => {
    if ("participants" in meal && meal.participants?.[userId]) {
      // Must be explicitly true — false or missing both mean "invited, not yet accepted"
      return meal.participants[userId].accepted === true;
    }
    // Legacy format - all participants are considered accepted
    return true;
  };

  /**
   * Accept an invitation - set accepted to true
   */
  const handleAcceptInvite = async (mealId: string) => {
    try {
      await set(ref(rtdb, `meal_events/${mealId}/participants/${myId}/accepted`), true);
      // Reload meals to reflect change
      const snap = await get(ref(rtdb, "meal_events"));
      const data = snap.exists() ? snap.val() : {};
      const list = Object.entries(data).map(([id, m]) => ({ id, ...(m as any) }));
      setMealEvents(list);
    } catch (err) {
      console.error("Failed to accept invitation:", err);
      alert("Failed to accept invitation");
    }
  };

  /**
   * Reject an invitation - remove participant from meal
   */
  const handleRejectInvite = async (mealId: string) => {
    if (!window.confirm("Are you sure you want to reject this invitation?")) return;

    try {
      await remove(ref(rtdb, `meal_events/${mealId}/participants/${myId}`));
      // Reload meals to reflect change
      const snap = await get(ref(rtdb, "meal_events"));
      const data = snap.exists() ? snap.val() : {};
      const list = Object.entries(data).map(([id, m]) => ({ id, ...(m as any) }));
      setMealEvents(list);
    } catch (err) {
      console.error("Failed to reject invitation:", err);
      alert("Failed to reject invitation");
    }
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

  // Separate accepted vs invited meals (for upcoming view)
  const { acceptedMeals, invitedMeals } = useMemo(() => {
    if (mode !== "upcoming") {
      return { acceptedMeals: filteredMeals, invitedMeals: [] };
    }

    const accepted: MealWithId[] = [];
    const invited: MealWithId[] = [];

    filteredMeals.forEach((m) => {
      if (isUserAccepted(m, myId)) {
        accepted.push(m);
      } else {
        invited.push(m);
      }
    });

    return { acceptedMeals: accepted, invitedMeals: invited };
  }, [filteredMeals, myId, mode]);

  if (loading) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", fontFamily: "'Inter', sans-serif" }}>
      <h2 className="page-title" style={{ marginBottom: 16, color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.2)", fontWeight: 800, textAlign: "center" }}>
        {mode === "past" ? "Past" : "Upcoming"} Meals
      </h2>

      {/* Filters */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          marginBottom: 20,
          border: "3px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* Desktop heading */}
        <h4
          className="mobile-hidden"
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

        {/* Search bar + mobile advanced toggle */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            placeholder="🔍 Search meals..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 12,
              border: "2px solid #fde68a",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              color: "#78350f",
              fontWeight: 700,
              fontSize: "0.95rem",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <button
            className="filters-toggle-btn"
            onClick={() => setShowAdvanced((v) => !v)}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "2px solid #c4b5fd",
              background: showAdvanced
                ? "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
                : "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
              color: showAdvanced ? "white" : "#5b21b6",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {showAdvanced ? "▲ Filters" : "▼ Filters"}
          </button>
        </div>

        {/* Advanced filters — always shown on desktop, toggled on mobile */}
        <div
          className="filters-advanced"
          style={{
            display: showAdvanced ? "grid" : "none",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
            {/* User searchable combobox */}
            <div ref={userComboRef} style={{ position: "relative" }}>
              <input
                placeholder="👤 All Users"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserDropdownOpen(true);
                  if (!e.target.value) setSelectedUser("");
                }}
                onFocus={() => setUserDropdownOpen(true)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "2px solid #93c5fd",
                  background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  color: "#1e3a8a",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              {userDropdownOpen && userSearch.trim() && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "2px solid #93c5fd",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  <div
                    onMouseDown={() => { setSelectedUser(""); setUserSearch(""); setUserDropdownOpen(false); }}
                    style={{ padding: "10px 16px", cursor: "pointer", fontWeight: 700, color: "#6b7280", fontSize: "0.9rem" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    👤 All Users
                  </div>
                  {users
                    .filter((u) => `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((u) => (
                      <div
                        key={u.id}
                        onMouseDown={() => {
                          setSelectedUser(u.id);
                          setUserSearch(`${u.first_name} ${u.last_name}`);
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontWeight: selectedUser === u.id ? 700 : 500,
                          color: "#1e3a8a",
                          fontSize: "0.9rem",
                          background: selectedUser === u.id ? "#dbeafe" : "transparent",
                        }}
                        onMouseEnter={(e) => { if (selectedUser !== u.id) e.currentTarget.style.background = "#eff6ff"; }}
                        onMouseLeave={(e) => { if (selectedUser !== u.id) e.currentTarget.style.background = "transparent"; }}
                      >
                        {u.first_name} {u.last_name}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Apartment searchable combobox */}
            <div ref={aptComboRef} style={{ position: "relative" }}>
              <input
                placeholder="🏠 All Apartments"
                value={aptSearch}
                onChange={(e) => {
                  setAptSearch(e.target.value);
                  setAptDropdownOpen(true);
                  if (!e.target.value) setSelectedApartment("");
                }}
                onFocus={() => setAptDropdownOpen(true)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "2px solid #7dd3fc",
                  background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                  color: "#0c4a6e",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              {aptDropdownOpen && aptSearch.trim() && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "2px solid #7dd3fc",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  <div
                    onMouseDown={() => { setSelectedApartment(""); setAptSearch(""); setAptDropdownOpen(false); }}
                    style={{ padding: "10px 16px", cursor: "pointer", fontWeight: 700, color: "#6b7280", fontSize: "0.9rem" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f9ff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    🏠 All Apartments
                  </div>
                  {apartments
                    .filter((a) => a.name.toLowerCase().includes(aptSearch.toLowerCase()))
                    .map((a) => (
                      <div
                        key={a.id}
                        onMouseDown={() => {
                          setSelectedApartment(a.id);
                          setAptSearch(a.name);
                          setAptDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontWeight: selectedApartment === a.id ? 700 : 500,
                          color: "#0c4a6e",
                          fontSize: "0.9rem",
                          background: selectedApartment === a.id ? "#e0f2fe" : "transparent",
                        }}
                        onMouseEnter={(e) => { if (selectedApartment !== a.id) e.currentTarget.style.background = "#f0f9ff"; }}
                        onMouseLeave={(e) => { if (selectedApartment !== a.id) e.currentTarget.style.background = "transparent"; }}
                      >
                        {a.name}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <select
              value={hostGuestFilter}
              onChange={(e) => setHostGuestFilter(e.target.value)}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "2px solid #6ee7b7",
                background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                color: "#065f46",
                fontWeight: 700,
                fontSize: "0.95rem",
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
                padding: "10px 16px",
                borderRadius: 12,
                border: "2px solid #c4b5fd",
                background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                color: "#5b21b6",
                fontWeight: 700,
                fontSize: "0.95rem",
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

      {/* Invitations Section - only in upcoming mode */}
      {mode === "upcoming" && invitedMeals.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: 20,
            borderRadius: 16,
            marginBottom: 20,
            border: "3px solid #fbbf24",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              fontWeight: 800,
              color: "#78350f",
            }}
          >
            Pending Invitations ({invitedMeals.length})
          </h3>
          {invitedMeals.map((m) => {
            const apt = apartments.find((a) => a.id === m.host_apartment_id);
            const aptDisplay = apt ? apt.name : "—";

            return (
              <div
                className="invitation-row"
                key={m.id}
                onClick={() => setViewingInvitedMealId(m.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  background: "white",
                  borderRadius: 12,
                  marginBottom: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fef9c3")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#374151", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                    {new Date(m.datetime).toLocaleString()} at {aptDisplay}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptInvite(m.id);
                    }}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectInvite(m.id);
                    }}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div
        className="meals-list-table"
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
                    textAlign: "center",
                    color: "#78350f",
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {acceptedMeals.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ padding: 12, textAlign: "center", color: "#78350f", fontWeight: 700, fontFamily: "Inter, sans-serif" }}
                >
                  No meals match the filters.
                </td>
              </tr>
            ) : (
              acceptedMeals.map((m) => {
                const apt = apartments.find((a) => a.id === m.host_apartment_id);
                const aptName = apt?.name ?? "—";
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
                    <td style={{ padding: 12, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                      {m.title}
                    </td>
                    <td style={{ padding: 12, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{new Date(m.datetime).toLocaleString()}</td>
                    <td style={{ padding: 12, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                      {apt && onViewApartment ? (
                        <span
                          onClick={(e) => { e.stopPropagation(); onViewApartment(apt.id); }}
                          style={{ cursor: "pointer", color: "#4f46e5", textDecoration: "underline", textDecorationStyle: "dotted" }}
                        >
                          {aptName}
                        </span>
                      ) : aptName}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        className="role-pill"
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
          friendIds={friendIds}
          onClose={() => setSelectedMealId(null)}
          onViewProfile={onViewProfile}
        />
      )}

      {viewingInvitedMealId && (
        <MealEditor
          mealId={viewingInvitedMealId}
          authUser={authUser}
          currentUserId={myId}
          invitedMode
          onClose={() => setViewingInvitedMealId(null)}
          onAccept={() => {
            handleAcceptInvite(viewingInvitedMealId);
            setViewingInvitedMealId(null);
          }}
          onReject={() => {
            handleRejectInvite(viewingInvitedMealId);
            setViewingInvitedMealId(null);
          }}
          onViewProfile={onViewProfile}
        />
      )}
    </div>
  );
}
