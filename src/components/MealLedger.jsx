import { useEffect, useState } from "react";
import { ref, onValue, off, get } from "firebase/database";
import { rtdb } from "../firebaseClient";
import MealList from "./MealList";

export default function MealLedger({ currentUserId }) {
  const [meals, setMeals] = useState(null);
  const [users, setUsers] = useState(null);
  const [apartments, setApartments] = useState(null);
  const [view, setView] = useState("users"); // "users" or "apartments"

  // Subscribe to meals
  useEffect(() => {
    if (!currentUserId) return;
    const mealRowRef = ref(rtdb, `meal_matrix/${currentUserId}`);
    const unsub = onValue(mealRowRef, (snap) => {
      setMeals(snap.exists() ? snap.val() : {});
    });
    return () => off(mealRowRef, "value", unsub);
  }, [currentUserId]);

  // Fetch users and apartments
  useEffect(() => {
    if (!currentUserId) return;

    async function fetchData() {
      const [usersSnap, apartmentsSnap] = await Promise.all([
        get(ref(rtdb, "users")),
        get(ref(rtdb, "apartments")),
      ]);

      const usersData = usersSnap.exists() ? usersSnap.val() : {};
      const aptsData = apartmentsSnap.exists() ? apartmentsSnap.val() : {};

      setApartments(
        Object.entries(aptsData).map(([id, a]) => ({ id, ...a }))
      );

      const userList = Object.entries(usersData)
        .filter(([id]) => id !== currentUserId)
        .map(([id, u]) => ({
          id,
          ...u,
          apartment: u.apartment ? { id: u.apartment, ...aptsData[u.apartment] } : null,
        }));

      setUsers(userList);
    }

    fetchData();
  }, [currentUserId]);

  if (!meals || !users || !apartments) {
    return <div style={{ padding: 20 }}>Loading Meal Ledger…</div>;
  }

  // Build apartment view data
  const apartmentData = apartments.map((apt) => {
    const members = users.filter((u) => u.apartment?.id === apt.id);
    const avgBalance =
      members.length > 0
        ? members.reduce((sum, u) => sum + (meals[u.id] ?? 0), 0) / members.length
        : 0;
    return { ...apt, avgBalance };
  });

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => setView("users")}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: view === "users" ? "#4f46e5" : "#ddd",
            color: view === "users" ? "white" : "#333",
            cursor: "pointer",
          }}
        >
          Users
        </button>
        <button
          onClick={() => setView("apartments")}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: view === "apartments" ? "#4f46e5" : "#ddd",
            color: view === "apartments" ? "white" : "#333",
            cursor: "pointer",
          }}
        >
          Apartments
        </button>
      </div>

      {view === "users" && (
        <MealList
          meals={meals}
          otherUsers={users}
          showApartment // Pass flag to display apartment
        />
      )}

      {view === "apartments" && (
        <MealList
          meals={apartmentData.reduce((acc, apt) => {
            acc[apt.id] = apt.avgBalance;
            return acc;
          }, {})}
          otherUsers={apartmentData.map((apt) => ({
            id: apt.id,
            first_name: apt.name,
          }))}
          apartmentMode // flag for apartment view
        />
      )}
    </div>
  );
}
