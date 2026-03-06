import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { fetchAllUsers, fetchAllApartments } from "../utils";
import type { Apartment, UserWithId, ApartmentWithData } from "../types";
import MealList from "./MealList";

interface MealLedgerProps {
  currentUserId: string;
  friendIds: string[];
  onViewProfile: (userId: string) => void;
}

type UserWithApartment = Omit<UserWithId, "apartment"> & {
  apartment: Apartment | null;
};

/**
 * Displays meal balance ledger with user and apartment views
 */
export default function MealLedger({ currentUserId, friendIds, onViewProfile }: MealLedgerProps) {
  const [meals, setMeals] = useState<Record<string, number> | null>(null);
  const [users, setUsers] = useState<UserWithApartment[] | null>(null);
  const [apartments, setApartments] = useState<Apartment[] | null>(null);
  const [currentUserApartmentId, setCurrentUserApartmentId] = useState<string | null>(null);
  const [view, setView] = useState<"users" | "apartments">("users");

  // Fetch users, apartments, and compute balances from meal_events
  useEffect(() => {
    if (!currentUserId) return;

    async function fetchData() {
      const [allUsers, allApartments, mealsSnap] = await Promise.all([
        fetchAllUsers(),
        fetchAllApartments(),
        get(ref(rtdb, "meal_events")),
      ]);

      setApartments(allApartments);

      // Find current user's apartment
      const currentUser = allUsers.find((u) => u.id === currentUserId);
      if (currentUser?.apartment) {
        setCurrentUserApartmentId(currentUser.apartment);
      }

      // Compute balances and shared-meal partners directly from meal_events
      const balances: Record<string, number> = {};
      const sharedMealPartnerIds = new Set<string>();

      if (mealsSnap.exists()) {
        for (const meal of Object.values(mealsSnap.val()) as any[]) {
          const participants = meal.participants || {};
          const mine = participants[currentUserId];
          if (!mine || !(mine.accepted ?? true)) continue;

          const myRole = mine.role;

          for (const [userId, p] of Object.entries(participants) as any[]) {
            if (userId === currentUserId || !(p.accepted ?? true)) continue;

            sharedMealPartnerIds.add(userId);

            if (myRole === "host" && p.role === "guest") {
              balances[userId] = (balances[userId] ?? 0) + 1;
            } else if (myRole === "guest" && p.role === "host") {
              balances[userId] = (balances[userId] ?? 0) - 1;
            }
          }
        }
      }

      setMeals(balances);

      // Filter to friends OR people we've actually shared a meal with
      const friendSet = new Set(friendIds);
      const otherUsers = allUsers
        .filter((user) =>
          user.id !== currentUserId &&
          user.first_name &&
          !user.placeholder &&
          (friendSet.has(user.id) || sharedMealPartnerIds.has(user.id))
        )
        .map((user) => ({
          ...user,
          apartment: allApartments.find((apt) => apt.id === user.apartment) || null,
        }));

      setUsers(otherUsers);
    }

    fetchData();
  }, [currentUserId, friendIds]);

  if (!meals || !users || !apartments) {
    return <div style={{ padding: 20 }}>Loading Meal Ledger…</div>;
  }

  // Calculate apartment average balances (only apartments with relevant users, excluding own)
  const relevantApartmentIds = new Set(
    users.map((u) => u.apartment?.id).filter(Boolean)
  );
  const apartmentData: ApartmentWithData[] = apartments
    .filter((apt) => apt.id !== currentUserApartmentId && relevantApartmentIds.has(apt.id))
    .map((apt) => {
      const members = users.filter((u) => u.apartment?.id === apt.id);
      const avgBalance =
        members.length > 0
          ? members.reduce((sum, u) => sum + (meals[u.id] ?? 0), 0) / members.length
          : 0;
      return { ...apt, avgBalance };
    });

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        className="tab-bar"
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 24,
          background: "white",
          padding: 8,
          borderRadius: 50,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "fit-content",
        }}
      >
        <button
          onClick={() => setView("users")}
          style={{
            padding: "12px 28px",
            borderRadius: 50,
            border: "none",
            background: view === "users"
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "transparent",
            color: view === "users" ? "white" : "#6b7280",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1rem",
            transition: "all 0.2s ease",
            boxShadow: view === "users" ? "0 4px 12px rgba(102, 126, 234, 0.3)" : "none",
          }}
        >
          👤 Users
        </button>
        <button
          onClick={() => setView("apartments")}
          style={{
            padding: "12px 28px",
            borderRadius: 50,
            border: "none",
            background: view === "apartments"
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "transparent",
            color: view === "apartments" ? "white" : "#6b7280",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1rem",
            transition: "all 0.2s ease",
            boxShadow: view === "apartments" ? "0 4px 12px rgba(102, 126, 234, 0.3)" : "none",
          }}
        >
          🏠 Apartments
        </button>
      </div>

      {view === "users" && (
        <MealList meals={meals} otherUsers={users} showApartment={true} onViewProfile={onViewProfile} />
      )}

      {view === "apartments" && (
        <MealList
          meals={apartmentData.reduce<Record<string, number>>((acc, apt) => {
            acc[apt.id] = apt.avgBalance;
            return acc;
          }, {})}
          otherUsers={apartmentData.map((apt) => ({
            id: apt.id,
            first_name: apt.name,
            last_name: "",
          }))}
          apartmentMode={true}
        />
      )}
    </div>
  );
}
