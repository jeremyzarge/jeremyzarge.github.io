// src/components/MyMeals.jsx
import { useEffect, useState, useMemo } from "react";
import { rtdb } from "../firebaseClient.js";
import { ref, get } from "firebase/database";
import MealEditor from "./MealEditor.jsx";

export default function MyMeals({ myId, users, apartments, mode }) {
  const [mealEvents, setMealEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);

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
      const list = Object.entries(data).map(([id, m]) => ({ id, ...m }));
      setMealEvents(list);
      setLoading(false);
    }
    loadMeals();
  }, []);

  const filteredMeals = useMemo(() => {
    return mealEvents
      // ⭐️ NEW: Only show meals the current user is part of
      .filter(m => {
        const isHost = m.hosts && m.hosts[myId];
        const isGuest = m.guests && m.guests[myId];
        return isHost || isGuest;  // user must be host or guest
      })

      // existing filters
      .filter((m) => {
        const mealDate = new Date(m.datetime);
        const now = new Date();
        if (mode === "past" && mealDate > now) return false;
        if (mode === "upcoming" && mealDate < now) return false;
        if (searchText && !m.title.toLowerCase().includes(searchText.toLowerCase())) return false;

        if (selectedUser) {
          const participantIds = [
            ...Object.keys(m.hosts || {}),
            ...Object.keys(m.guests || {})
          ];
          if (!participantIds.includes(selectedUser)) return false;
        }

        if (selectedApartment && m.host_apartment_id !== selectedApartment) return false;

        if (hostGuestFilter) {
          const isHost = m.hosts && m.hosts[myId];
          const isGuest = m.guests && m.guests[myId];
          if (hostGuestFilter === "host" && !isHost) return false;
          if (hostGuestFilter === "guest" && !isGuest) return false;
        }

        return true;
      })

      .sort((a, b) => {
        switch (sortBy) {
          case "date_asc": return new Date(a.datetime) - new Date(b.datetime);
          case "date_desc": return new Date(b.datetime) - new Date(a.datetime);
          case "title_asc": return a.title.localeCompare(b.title);
          case "title_desc": return b.title.localeCompare(a.title);
          default: return 0;
        }
      });
  }, [
    mealEvents,
    searchText,
    selectedUser,
    selectedApartment,
    hostGuestFilter,
    sortBy,
    myId,
    mode
  ]);

  if (loading) return <div style={{ padding: 20 }}>Loading meals...</div>;

  return (
    <div style={{ maxWidth: 960, margin: "20px auto", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ marginBottom: 16, color: "#1f2937" }}>My Meals</h2>

      {/* Filters */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        marginBottom: 16
      }}>

        <input
          placeholder="Search title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fef3c7",
            color: "#78350f",
            fontWeight: 500
          }}
        />

        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", background: "#dbeafe", color: "#1e3a8a" }}>
          <option value="">-- Filter by user --</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
          ))}
        </select>

        <select value={selectedApartment} onChange={(e) => setSelectedApartment(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", background: "#e0f2fe", color: "#0c4a6e" }}>
          <option value="">-- Filter by apartment --</option>
          {apartments.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* ⭐️ RENAMED: "Filter by Role" */}
        <select value={hostGuestFilter} onChange={(e) => setHostGuestFilter(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", background: "#d1fae5", color: "#065f46" }}>
          <option value="">-- Filter by Role --</option>
          <option value="host">Host</option>
          <option value="guest">Guest</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", background: "#ede9fe", color: "#5b21b6" }}>
          <option value="date_desc">Date ↓</option>
          <option value="date_asc">Date ↑</option>
          <option value="title_asc">Title A→Z</option>
          <option value="title_desc">Title Z→A</option>
        </select>
      </div>

      {/* Table */}
      <div style={{
        overflowX: "auto",
        background: "#fef9c3",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead style={{ background: "#fef3c7" }}>
            <tr>
              {["Title", "Date", "Hosts", "Guests", "Apartment", "Role", "Edit"].map(header => (
                <th key={header} style={{ padding: "12px 8px", textAlign: "left", color: "#78350f", fontWeight: 600 }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredMeals.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 12, textAlign: "center", color: "#78350f" }}>
                  No meals match the filters.
                </td>
              </tr>
            ) : filteredMeals.map(m => {
              const hostNames = Object.keys(m.hosts || {}).map(id => {
                const u = users.find(x => x.id === id);
                return u ? `${u.first_name} ${u.last_name}` : id;
              }).join(", ");

              const guestNames = Object.keys(m.guests || {}).map(id => {
                const u = users.find(x => x.id === id);
                return u ? `${u.first_name} ${u.last_name}` : id;
              }).join(", ");

              const apt = apartments.find(a => a.id === m.host_apartment_id)?.name ?? "—";
              const role =
                m.hosts && m.hosts[myId]
                  ? "Host"
                  : m.guests && m.guests[myId]
                    ? "Guest"
                    : "—";

              return (
                <tr key={m.id}
                    style={{ borderBottom: "1px solid #fde68a", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fef3c7"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: 12 }}>{m.title}</td>
                  <td style={{ padding: 12 }}>{new Date(m.datetime).toLocaleString()}</td>
                  <td style={{ padding: 12 }}>{hostNames}</td>
                  <td style={{ padding: 12 }}>{guestNames}</td>
                  <td style={{ padding: 12 }}>{apt}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: 20,
                      background: role === "Host" ? "#3b82f6" : role === "Guest" ? "#10b981" : "#9ca3af",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600
                    }}>{role}</span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button onClick={() => setSelectedMealId(m.id)}
                            style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#9333ea", color: "white", cursor: "pointer" }}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedMealId && (
        <MealEditor mealId={selectedMealId} onClose={() => setSelectedMealId(null)} />
      )}
    </div>
  );
}
