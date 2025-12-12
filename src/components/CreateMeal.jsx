// src/components/CreateMeal.jsx
import { useEffect, useState, useMemo } from "react";
import { rtdb } from "../firebaseClient.js";
import { ref, get } from "firebase/database";
import { createMeal } from "../index.js";

export default function CreateMeal({ onCreated }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hostApartment, setHostApartment] = useState("");
  const [apartments, setApartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load apartments + users
  useEffect(() => {
    async function loadData() {
      const aptSnap = await get(ref(rtdb, "apartments"));
      const aptData = aptSnap.exists() ? aptSnap.val() : {};
      const aptList = Object.entries(aptData).map(([id, a]) => ({ id, ...a }));
      setApartments(aptList);

      const usersSnap = await get(ref(rtdb, "users"));
      const usersData = usersSnap.exists() ? usersSnap.val() : {};
      const usersList = Object.entries(usersData).map(([id, u]) => ({ id, ...u }));
      setUsers(usersList);
    }
    loadData();
  }, []);

  function toggleParticipant(id) {
    setSelectedParticipants((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  // Compute hosts and guests
  const { hosts, guests } = useMemo(() => {
    const participants = Object.keys(selectedParticipants);
    const h = [];
    const g = [];

    for (const pid of participants) {
      const user = users.find((u) => String(u.id) === String(pid));
      if (!user) continue;

      if (String(user.apartment) === String(hostApartment)) h.push(pid);
      else g.push(pid);
    }

    return { hosts: h, guests: g };
  }, [selectedParticipants, users, hostApartment]);

  // VALIDATION: Only enable button when everything is valid
  const formIsValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      date &&
      time &&
      hostApartment &&
      Object.keys(selectedParticipants).length > 0 &&
      hosts.length > 0 // at least one host
    );
  }, [title, date, time, hostApartment, selectedParticipants, hosts.length]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formIsValid) return;

    setSubmitting(true);

    const iso = new Date(`${date}T${time}`).toISOString();

    const hostsMap = {};
    hosts.forEach((h) => (hostsMap[h] = true));

    const guestsMap = {};
    guests.forEach((g) => (guestsMap[g] = true));

    const mealObj = {
      title: title.trim(),
      host_apartment_id: String(hostApartment),
      hosts: hostsMap,
      guests: guestsMap,
      datetime: iso,
      created_at: new Date().toISOString(),
    };

    try {
      const mealId = await createMeal(mealObj);

      // Reset form
      setTitle("");
      setDate("");
      setTime("");
      setHostApartment("");
      setSelectedParticipants({});

      if (onCreated) onCreated(mealId);
      alert("Meal created (id: " + mealId + ")");
    } catch (err) {
      console.error("createMeal error", err);
      alert("Failed to create meal: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 820,
        background: "#fff",
        padding: 18,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
        marginTop: 20,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Create Meal</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        />

        <select
          value={hostApartment}
          onChange={(e) => setHostApartment(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        >
          <option value="">-- Host apartment --</option>
          {apartments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — {a.address}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Participants</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 8,
          }}
        >
          {users.map((u) => (
            <label
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #f1f5f9",
              }}
            >
              <input
                type="checkbox"
                checked={!!selectedParticipants[u.id]}
                onChange={() => toggleParticipant(u.id)}
              />
              <div>
                <div style={{ fontWeight: 600 }}>
                  {u.first_name} {u.last_name}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Apt: {u.apartment ?? "—"}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button
          type="submit"
          disabled={!formIsValid || submitting}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background:
              !formIsValid || submitting ? "#9ca3af" : "#10b981",
            color: "white",
            cursor: !formIsValid || submitting ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {submitting ? "Creating…" : "Create Meal"}
        </button>
      </div>
    </form>
  );
}
