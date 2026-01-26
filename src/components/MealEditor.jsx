// src/components/MealEditor.jsx
import { useEffect, useState, useMemo } from "react";
import { rtdb } from "../firebaseClient.js";
import { ref, get, set, remove } from "firebase/database";

export default function MealEditor({ mealId, onClose, authUser }) {
  const [meal, setMeal] = useState(null);
  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const mealSnap = await get(ref(rtdb, `meal_events/${mealId}`));
      if (!mealSnap.exists()) {
        alert("Meal not found");
        setLoading(false);
        return;
      }
      const m = mealSnap.val();

      // Load users
      const usersSnap = await get(ref(rtdb, "users"));
      const usersData = usersSnap.exists()
        ? Object.entries(usersSnap.val()).map(([id, u]) => ({ id, ...u }))
        : [];
      setUsers(usersData);

      // Load apartments
      const apartmentsSnap = await get(ref(rtdb, "apartments"));
      const apartmentsData = apartmentsSnap.exists()
        ? Object.entries(apartmentsSnap.val()).map(([id, a]) => ({ id, ...a }))
        : [];
      setApartments(apartmentsData);

      // Load food types
      const foodsSnap = await get(ref(rtdb, "food"));
      const foodKeys = foodsSnap.exists() ? Object.keys(foodsSnap.val()) : [];
      setFoods(foodKeys);

      // Initialize participants
      const initParticipants = (participants) => {
        const updated = {};
        Object.keys(participants || {}).forEach((uid) => {
          updated[uid] = { food: participants[uid]?.food || "none" };
        });
        return updated;
      };

      m.hosts = initParticipants(m.hosts);
      m.guests = initParticipants(m.guests);

      setMeal(m);
      setLoading(false);
    }

    loadData();
  }, [mealId]);

  // Only hosts can edit general meal info or assign food
  const isHost = useMemo(() => meal && meal.hosts && authUser && meal.hosts[authUser.uid], [meal, authUser]);

  const toggleParticipant = (uid, type) => {
    if (!meal) return;
    setMeal((prev) => {
      const updated = { ...prev };
      const group = type === "host" ? updated.hosts : updated.guests;
      if (group[uid]) delete group[uid];
      else group[uid] = { food: "none" };
      return updated;
    });
  };

  const setFoodForParticipant = (uid, type, food) => {
    if (!meal) return;
    setMeal((prev) => {
      const updated = { ...prev };
      const group = type === "host" ? updated.hosts : updated.guests;
      if (group[uid]) group[uid].food = food;
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await set(ref(rtdb, `meal_events/${mealId}`), meal);
      alert("Meal updated!");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save meal: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this meal?")) return;
    try {
      await remove(ref(rtdb, `meal_events/${mealId}`));
      alert("Meal deleted!");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete meal: " + err.message);
    }
  };

  // Allergens counting
  const allergenCounts = useMemo(() => {
    if (!meal) return {};
    const counts = {};
    users.forEach(u => {
      const userAllergies = Array.isArray(u.allergies) ? u.allergies : [];
        userAllergies.forEach(a => {
          counts[a] = (counts[a] || 0) + 1;
        });
    });
    return counts;
  }, [meal, users]);

  if (loading || !meal) return <div style={{ padding: 20 }}>Loading meal editor...</div>;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 10, maxWidth: 900, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ marginBottom: 12 }}>{meal.title || "Meal Editor"}</h3>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["info", "participants", "messages"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "none",
                background: activeTab === tab ? "#3b82f6" : "#e5e7eb",
                color: activeTab === tab ? "white" : "#374151",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input
                value={meal.title}
                onChange={(e) => isHost && setMeal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
              />
              <select
                value={meal.host_apartment_id}
                onChange={(e) => isHost && setMeal(prev => ({ ...prev, host_apartment_id: e.target.value }))}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
              >
                <option value="">-- Host apartment --</option>
                {apartments.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong>Allergens:</strong>
              <ul>
                {Object.entries(allergenCounts).map(([allergen, count]) => (
                  <li key={allergen}>{allergen} ({count})</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong>Special instructions:</strong>
              <textarea
                value={meal.instructions || ""}
                onChange={(e) => isHost && setMeal(prev => ({ ...prev, instructions: e.target.value }))}
                style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
                placeholder="Add special instructions here"
              />
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <div style={{ marginTop: 12 }}>
            <h4>Hosts</h4>
            {users.filter(u => u.apartment === meal.host_apartment_id).map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={!!meal.hosts[u.id]}
                  disabled={!isHost}
                  onChange={() => toggleParticipant(u.id, "host")}
                />
                <span>{u.first_name} {u.last_name}</span>
                {meal.hosts[u.id] && (
                  <select
                    value={meal.hosts[u.id].food || "none"}
                    disabled={!isHost}
                    onChange={(e) => setFoodForParticipant(u.id, "host", e.target.value)}
                  >
                    <option value="none">None</option>
                    {foods.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                )}
              </div>
            ))}

            <h4>Guests</h4>
            {users.filter(u => u.apartment !== meal.host_apartment_id).map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={!!meal.guests[u.id]}
                  disabled={!isHost && !meal.allowGuestsFoodSelection}
                  onChange={() => toggleParticipant(u.id, "guest")}
                />
                <span>{u.first_name} {u.last_name}</span>
                {meal.guests[u.id] && (
                  <select
                    value={meal.guests[u.id].food || "none"}
                    disabled={!isHost && !meal.allowGuestsFoodSelection}
                    onChange={(e) => setFoodForParticipant(u.id, "guest", e.target.value)}
                  >
                    <option value="none">None</option>
                    {foods.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div style={{ marginTop: 12 }}>
            <h4>Messages</h4>
            <div style={{ maxHeight: 200, overflowY: "auto", background: "#f3f4f6", padding: 8, borderRadius: 6 }}>
              {(meal.messages ? Object.entries(meal.messages) : []).map(([id, msg]) => (
                <div key={id} style={{ marginBottom: 4 }}>
                  <strong>{users.find(u => u.id === msg.user)?.first_name || msg.user}:</strong> {msg.text}
                  <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 8 }}>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <MessageInput meal={meal} setMeal={setMeal} authUser={authUser} />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#9ca3af", color: "white" }}>Cancel</button>
          {isHost && <button onClick={handleDelete} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#ef4444", color: "white" }}>Delete</button>}
          {isHost && <button onClick={handleSave} disabled={saving} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#10b981", color: "white" }}>
            {saving ? "Saving…" : "Save"}
          </button>}
        </div>
      </div>
    </div>
  );
}

// Subcomponent for sending messages
function MessageInput({ meal, setMeal, authUser }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    const timestamp = Date.now();
    const id = `${timestamp}_${authUser.uid}`;
    setMeal(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [id]: { user: authUser.uid, text: text.trim(), timestamp }
      }
    }));
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #d1d5db" }} />
      <button onClick={handleSend} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white" }}>Send</button>
    </div>
  );
}
