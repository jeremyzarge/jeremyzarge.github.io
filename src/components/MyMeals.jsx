// src/components/MyMeals.jsx
import { useEffect, useState, useMemo } from "react";
import { rtdb } from "../firebaseClient.js";
import { ref, get } from "firebase/database";

export default function MyMeals({ myId, users, apartments }) {
  const [mealEvents, setMealEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");
  const [hostGuestFilter, setHostGuestFilter] = useState(""); // "host" | "guest" | ""
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, title_asc, title_desc

  useEffect(() => {
    async function loadMeals() {
      setLoading(true);
      const snap = await get(ref(rtdb, "meal_events"));
      const data = snap.exists() ? snap.val() : {};
      const list = Object.entries(data).map(([id, m]) => ({
        id,
        ...m,
      }));
      setMealEvents(list);
      setLoading(false);
    }
    loadMeals();
  }, []);

  // Derived and filtered list
  const filteredMeals = useMemo(() => {
    return mealEvents
      .filter((m) => {
        // text search
        if (searchText && !m.title.toLowerCase().includes(searchText.toLowerCase())) return false;

        // attendee filter
        if (selectedUser) {
          const participantIds = [...Object.keys(m.hosts || {}), ...Object.keys(m.guests || {})];
          if (!participantIds.includes(selectedUser)) return false;
        }

        // apartment filter
        if (selectedApartment && m.host_apartment_id !== selectedApartment) return false;

        // host/guest filter
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
          case "date_asc":
            return new Date(a.datetime) - new Date(b.datetime);
          case "date_desc":
            return new Date(b.datetime) - new Date(a.datetime);
          case "title_asc":
            return a.title.localeCompare(b.title);
          case "title_desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [mealEvents, searchText, selectedUser, selectedApartment, hostGuestFilter, sortBy, myId]);

  if (loading) return <div style={{ padding: 20 }}>Loading meals...</div>;

  return (
    <div style={{ maxWidth: 900, marginTop: 20, background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 18px rgba(2,6,23,0.06)" }}>
      <h3 style={{ marginTop: 0 }}>My Meals</h3>

      {/* Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 12 }}>
        <input
          placeholder="Search title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
        />

        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}>
          <option value="">-- Filter by user --</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>)}
        </select>

        <select value={selectedApartment} onChange={(e) => setSelectedApartment(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}>
          <option value="">-- Filter by apartment --</option>
          {apartments.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <select value={hostGuestFilter} onChange={(e) => setHostGuestFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}>
          <option value="">-- Host / Guest --</option>
          <option value="host">Host</option>
          <option value="guest">Guest</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}>
          <option value="date_desc">Date ↓</option>
          <option value="date_asc">Date ↑</option>
          <option value="title_asc">Title A→Z</option>
          <option value="title_desc">Title Z→A</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e6eef6" }}>
            <th style={{ padding: "8px 6px" }}>Title</th>
            <th style={{ padding: "8px 6px" }}>Date</th>
            <th style={{ padding: "8px 6px" }}>Hosts</th>
            <th style={{ padding: "8px 6px" }}>Guests</th>
            <th style={{ padding: "8px 6px" }}>Apartment</th>
            <th style={{ padding: "8px 6px" }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeals.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 8 }}>No meals match the filters.</td></tr>
          ) : filteredMeals.map((m) => {
            const hostNames = Object.keys(m.hosts || {}).map(id => {
              const u = users.find(x => x.id === id);
              return u ? `${u.first_name} ${u.last_name}` : id;
            }).join(", ");

            const guestNames = Object.keys(m.guests || {}).map(id => {
              const u = users.find(x => x.id === id);
              return u ? `${u.first_name} ${u.last_name}` : id;
            }).join(", ");

            const apt = apartments.find(a => a.id === m.host_apartment_id)?.name ?? "—";

            const role = m.hosts && m.hosts[myId] ? "Host" : m.guests && m.guests[myId] ? "Guest" : "—";

            return (
              <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: 8 }}>{m.title}</td>
                <td style={{ padding: 8 }}>{new Date(m.datetime).toLocaleString()}</td>
                <td style={{ padding: 8 }}>{hostNames}</td>
                <td style={{ padding: 8 }}>{guestNames}</td>
                <td style={{ padding: 8 }}>{apt}</td>
                <td style={{ padding: 8 }}>{role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
