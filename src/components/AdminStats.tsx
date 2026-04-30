import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "../firebaseClient";

interface Stats {
  totalUsers: number;
  totalMeals: number;
  pastMeals: number;
  upcomingMeals: number;
  totalApartments: number;
  totalFriendships: number;
  totalMealParticipations: number;
}

export default function AdminStats({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      get(ref(rtdb, "users")),
      get(ref(rtdb, "meal_events")),
      get(ref(rtdb, "apartments")),
      get(ref(rtdb, "user_relationships")),
    ]).then(([usersSnap, mealsSnap, aptsSnap, relsSnap]) => {
      const now = new Date();

      const users = usersSnap.exists() ? Object.values(usersSnap.val() as Record<string, any>) : [];
      const totalUsers = users.filter((u: any) => u.first_name && !u.placeholder).length;

      const meals = mealsSnap.exists() ? Object.entries(mealsSnap.val() as Record<string, any>) : [];
      const totalMeals = meals.length;
      const pastMeals = meals.filter(([, m]: [string, any]) => m.datetime && new Date(m.datetime) < now).length;
      const upcomingMeals = totalMeals - pastMeals;

      let totalMealParticipations = 0;
      for (const [, meal] of meals) {
        const participants = meal.participants || {};
        totalMealParticipations += Object.values(participants).filter((p: any) => p.accepted === true).length;
      }

      const totalApartments = aptsSnap.exists() ? Object.keys(aptsSnap.val()).length : 0;

      let friendshipCount = 0;
      if (relsSnap.exists()) {
        const rels = relsSnap.val() as Record<string, Record<string, { status: string }>>;
        for (const userRels of Object.values(rels)) {
          for (const rel of Object.values(userRels)) {
            if (rel.status === "friend") friendshipCount++;
          }
        }
        friendshipCount = Math.floor(friendshipCount / 2);
      }

      setStats({
        totalUsers,
        totalMeals,
        pastMeals,
        upcomingMeals,
        totalApartments,
        totalFriendships: friendshipCount,
        totalMealParticipations,
      });
      setLoading(false);
    });
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
        zIndex: 1200,
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 540,
          padding: 36,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "Inter, sans-serif",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* Header */}
        <div style={{ position: "relative", textAlign: "center", marginBottom: 28, paddingRight: 32 }}>
          <h2
            style={{
              margin: 0,
              fontWeight: 900,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "1.8rem",
              letterSpacing: "-0.5px",
            }}
          >
            📊 Admin Stats
          </h2>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#9ca3af",
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {loading ? null : stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StatCard label="Users" value={stats.totalUsers} icon="👥" color="#667eea" />
            <StatCard label="Friendships" value={stats.totalFriendships} icon="🤝" color="#764ba2" />
            <StatCard label="Total Meals" value={stats.totalMeals} icon="🍽️" color="#10b981" />
            <StatCard label="Upcoming Meals" value={stats.upcomingMeals} icon="🗓️" color="#f59e0b" />
            <StatCard label="Past Meals" value={stats.pastMeals} icon="📅" color="#6b7280" />
            <StatCard label="Meal Seats Filled" value={stats.totalMealParticipations} icon="🪑" color="#ef4444" />
            <StatCard label="Apartments" value={stats.totalApartments} icon="🏠" color="#0ea5e9" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div
      style={{
        padding: "20px 16px",
        borderRadius: 16,
        background: `${color}08`,
        border: `2px solid ${color}25`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: 900, color: "#111827", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    </div>
  );
}
