import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { fetchAllApartments } from "../utils";
import ClickableUserName from "./ClickableUserName";
import type { UserWithId, Meal } from "../types";

interface ApartmentProfileViewProps {
  apartmentId: string;
  currentUserId: string;
  allUsers: UserWithId[];
  onClose: () => void;
  onViewProfile: (userId: string) => void;
  onViewMeal?: (mealId: string) => void;
}

export default function ApartmentProfileView({
  apartmentId,
  currentUserId,
  allUsers,
  onClose,
  onViewProfile,
  onViewMeal,
}: ApartmentProfileViewProps) {
  const [loading, setLoading] = useState(true);
  const [aptName, setAptName] = useState("");
  const [aptAddress, setAptAddress] = useState("");
  const [meals, setMeals] = useState<Array<{ id: string; title: string; datetime: string }>>([]);
  const [pastMealsShown, setPastMealsShown] = useState(5);

  const members = allUsers.filter((u) => u.apartment === apartmentId && u.first_name && !u.placeholder);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetchAllApartments(),
      get(ref(rtdb, "meal_events")),
    ]).then(([apts, mealsSnap]) => {
      const apt = apts.find((a) => a.id === apartmentId);
      setAptName(apt?.name ?? "");
      setAptAddress(apt?.address ?? "");

      if (mealsSnap.exists()) {
        const allMeals = mealsSnap.val() as Record<string, Meal>;
        const aptMeals: Array<{ id: string; title: string; datetime: string }> = [];
        for (const [mealId, meal] of Object.entries(allMeals)) {
          if (meal.host_apartment_id === apartmentId) {
            aptMeals.push({ id: mealId, title: meal.title || "Untitled", datetime: meal.datetime });
          }
        }
        aptMeals.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        setMeals(aptMeals);
      }

      setLoading(false);
    });
  }, [apartmentId]);

  const now = new Date();
  const upcomingMeals = meals.filter((m) => new Date(m.datetime) >= now);
  const pastMeals = meals.filter((m) => new Date(m.datetime) < now);

  const mealRow = (m: { id: string; title: string; datetime: string }) => (
    <div
      key={m.id}
      onClick={() => onViewMeal?.(m.id)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 10,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        fontSize: "0.85rem",
        cursor: onViewMeal ? "pointer" : "default",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { if (onViewMeal) e.currentTarget.style.background = "#dcfce7"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
    >
      <span style={{ fontWeight: 700, color: "#374151" }}>{m.title}</span>
      <span style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: 600 }}>
        {new Date(m.datetime).toLocaleDateString()}
      </span>
    </div>
  );

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
        zIndex: 1000,
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 520,
          gap: 16,
          padding: 36,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "Inter, sans-serif",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* Close button always visible */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {!loading && (
              <>
                <h2
                  style={{
                    margin: 0,
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "1.8rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {aptName}
                </h2>
                {aptAddress && (
                  <div style={{ color: "#6b7280", fontSize: "1rem", marginTop: 4 }}>{aptAddress}</div>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#9ca3af",
              padding: 4,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0", color: "#9ca3af", fontSize: "1rem" }}>
            Loading…
          </div>
        ) : (
          <>
            {/* Members */}
            <div>
              <SectionTitle text={`Members (${members.length})`} />
              {members.length > 0 ? (
                <div className="member-list" style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                  {members.map((u) => (
                    <ClickableUserName
                      key={u.id}
                      userId={u.id}
                      firstName={u.first_name}
                      lastName={u.last_name}
                      onClick={onViewProfile}
                      style={{ fontSize: "0.95rem", lineHeight: 1 }}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>No members</p>
              )}
            </div>

            {/* Meals */}
            <div>
              <SectionTitle text={`Meals (${meals.length})`} />
              {meals.length === 0 ? (
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem" }}>No meals hosted here</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {upcomingMeals.length > 0 && (
                    <div>
                      <SubLabel text={`Upcoming Meals (${upcomingMeals.length})`} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {upcomingMeals.map(mealRow)}
                      </div>
                    </div>
                  )}
                  {pastMeals.length > 0 && (
                    <div>
                      <SubLabel text={`Past Meals (${pastMeals.length})`} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {pastMeals.slice(0, pastMealsShown).map(mealRow)}
                      </div>
                      {pastMeals.length > pastMealsShown && (
                        <button
                          onClick={() => setPastMealsShown((n) => n + 5)}
                          style={{
                            marginTop: 6,
                            background: "none",
                            border: "none",
                            color: "#059669",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                          }}
                        >
                          Load more ({pastMeals.length - pastMealsShown} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <h4
      style={{
        margin: "0 0 8px 0",
        fontSize: "1rem",
        fontWeight: 800,
        background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </h4>
  );
}

function SubLabel({ text }: { text: string }) {
  return (
    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {text}
    </div>
  );
}
