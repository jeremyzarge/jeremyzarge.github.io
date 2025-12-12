// src/MealLedger.jsx
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "../firebaseClient";
import MealList from "./MealList";

export default function MealLedger({ currentUserId }) {
  const [meals, setMeals] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    const mealRowRef = ref(rtdb, `meal_matrix/${currentUserId}`);
    const usersRef = ref(rtdb, "users");

    // Subscribe to meal matrix for this user
    const unsubMeals = onValue(mealRowRef, (snap) => {
      setMeals(snap.exists() ? snap.val() : {});
    });

    // Subscribe to all users
    const unsubUsers = onValue(usersRef, (snap) => {
      if (!snap.exists()) {
        setUsers([]);
        return;
      }
      const obj = snap.val();
      const list = Object.entries(obj).map(([id, u]) => ({ id, ...u }));
      const otherUsers = list.filter((u) => u.id !== currentUserId);
      setUsers(otherUsers);
    });

    return () => {
      off(mealRowRef);
      off(usersRef);
      unsubMeals();
      unsubUsers();
    };
  }, [currentUserId]);

  return (
    <MealList
      meals={meals}
      otherUsers={users}
    />
  );
}
