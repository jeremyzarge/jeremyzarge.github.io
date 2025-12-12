// src/components/MealEditor.jsx
import { useEffect, useState } from "react";
import { rtdb } from "../firebaseClient.js";
import { ref, get, set } from "firebase/database";

export default function MealEditor({ mealId, onClose }) {
  const [meal, setMeal] = useState(null);
  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [foods, setFoods] = useState([]); // list of food types: side, main, dessert, etc.
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Load meal
      const mealSnap = await get(ref(rtdb, `meal_events/${mealId}`));
      if (!mealSnap.exists()) {
        alert("Meal not found");
        setLoading(false);
        return;
      }
      const m = mealSnap.val();

      // Load users
      const usersSnap = await get(ref(rtdb, "users"));
      const usersData = usersSnap.exists() ? Object.entries(usersSnap.val()).map(([id, u]) => ({ id, ...u })) : [];
      setUsers(usersData);

      // Load apartments
      const apartmentsSnap = await get(ref(rtdb, "apartments"));
      const apartmentsData = apartmentsSnap.exists() ? Object.entries(apartmentsSnap.val()).map(([id, a]) => ({ id, ...a })) : [];
      setApartments(apartmentsData);

      // Load food types
      const foodsSnap = await get(ref(rtdb, "food"));
      const foodKeys = foodsSnap.exists() ? Object.keys(foodsSnap.val()) : [];
      setFoods(foodKeys);

      // Initialize participant food if missing
      const initParticipants = (participants) => {
        const updated = {};
        Object.keys(participants || {}).forEach((uid) => {
          if (typeof participants[uid] === "object" && participants[uid].food) {
            updated[uid] = { ...participants[uid] }; // keep existing
          } else {
            updated[uid] = { food: "none" }; // default
          }
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

  if (loading || !meal) return <div style={{ padding: 20 }}>Loading meal editor...</div>;

  // Update participant selection
  const toggleParticipant = (uid, type) => {
    setMeal((prev) => {
      const updated = { ...prev };
      const currentGroup = type === "host" ? updated.hosts : updated.guests;
      if (currentGroup[uid]) {
        delete currentGroup[uid];
      } else {
        currentGroup[uid] = { food: "none" };
      }
      return updated;
    });
  };

  // Update food for participant
  const setFoodForParticipant = (uid, type, food) => {
    setMeal((prev) => {
      const updated = { ...prev };
      const group = type === "host" ? updated.hosts : updated.guests;
      if (group[uid]) {
        group[uid].food = food;
      }
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

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 10, maxWidth: 800, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <h3>Edit Meal</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input
            value={meal.title}
            onChange={(e) => setMeal((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Title"
            style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
          />
          <select
            value={meal.host_apartment_id}
            onChange={(e) => setMeal((prev) => ({ ...prev, host_apartment_id: e.target.value }))}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
          >
            <option value="">-- Host apartment --</option>
            {apartments.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <input
            type="date"
            value={meal.datetime.slice(0, 10)}
            onChange={(e) => setMeal((prev) => {
              const t = new Date(prev.datetime);
              t.setFullYear(Number(e.target.value.slice(0, 4)));
              t.setMonth(Number(e.target.value.slice(5, 7)) - 1);
              t.setDate(Number(e.target.value.slice(8, 10)));
              return { ...prev, datetime: t.toISOString() };
            })}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
          />

          <input
            type="time"
            value={meal.datetime.slice(11, 16)}
            onChange={(e) => setMeal((prev) => {
              const t = new Date(prev.datetime);
              const [hours, minutes] = e.target.value.split(":").map(Number);
              t.setHours(hours);
              t.setMinutes(minutes);
              return { ...prev, datetime: t.toISOString() };
            })}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e9ef" }}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <h4>Hosts</h4>
          {users.filter(u => u.apartment === meal.host_apartment_id).map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={!!meal.hosts[u.id]}
                onChange={() => toggleParticipant(u.id, "host")}
              />
              <span>{u.first_name} {u.last_name}</span>
              {meal.hosts[u.id] && (
                <select
                  value={meal.hosts[u.id].food || "none"}
                  onChange={(e) => setFoodForParticipant(u.id, "host", e.target.value)}
                >
                  <option value="none">None</option>
                  {foods.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <h4>Guests</h4>
          {users.filter(u => u.apartment !== meal.host_apartment_id).map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={!!meal.guests[u.id]}
                onChange={() => toggleParticipant(u.id, "guest")}
              />
              <span>{u.first_name} {u.last_name}</span>
              {meal.guests[u.id] && (
                <select
                  value={meal.guests[u.id].food || "none"}
                  onChange={(e) => setFoodForParticipant(u.id, "guest", e.target.value)}
                >
                  <option value="none">None</option>
                  {foods.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#9ca3af", color: "white" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#10b981", color: "white" }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
