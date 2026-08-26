import { useEffect, useState } from "react";
import { ref, get, set, remove } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { getUpcomingShabbatWindows } from "../utils";

interface WeeklyStatusPromptProps {
  userId: string;
  currentDinnerStatus: "free" | "busy" | null | undefined;
  currentLunchStatus: "free" | "busy" | null | undefined;
  weekStart: string;
  onDone: () => void;
}

/**
 * Once-a-week nudge (first login on/after Sunday) asking the user to confirm
 * their Shabbat dinner/lunch availability so friends can see it on the ledger.
 */
export default function WeeklyStatusPrompt({
  userId,
  currentDinnerStatus,
  currentLunchStatus,
  weekStart,
  onDone,
}: WeeklyStatusPromptProps) {
  const [dinnerStatus, setDinnerStatus] = useState<"free" | "busy" | null>(currentDinnerStatus ?? null);
  const [lunchStatus, setLunchStatus] = useState<"free" | "busy" | null>(currentLunchStatus ?? null);
  const [autoDinnerBusy, setAutoDinnerBusy] = useState(false);
  const [autoLunchBusy, setAutoLunchBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get(ref(rtdb, "meal_events")).then((snap) => {
      if (!snap.exists()) return;
      const { dinnerStart, dinnerEnd, lunchStart, lunchEnd } = getUpcomingShabbatWindows();
      let attendsDinner = false;
      let attendsLunch = false;
      for (const meal of Object.values(snap.val()) as any[]) {
        const mine = (meal.participants || {})[userId];
        if (mine?.accepted === true && meal.datetime) {
          const dt = new Date(meal.datetime);
          if (dt >= dinnerStart && dt < dinnerEnd) attendsDinner = true;
          if (dt >= lunchStart && dt < lunchEnd) attendsLunch = true;
        }
      }
      setAutoDinnerBusy(attendsDinner);
      setAutoLunchBusy(attendsLunch);
    });
  }, [userId]);

  const markWeekDone = () => set(ref(rtdb, `users/${userId}/last_status_prompt_week`), weekStart);

  const handleSave = async () => {
    setSaving(true);
    try {
      const writeStatus = (field: "dinner_status" | "lunch_status", value: "free" | "busy" | null) =>
        value ? set(ref(rtdb, `users/${userId}/${field}`), value) : remove(ref(rtdb, `users/${userId}/${field}`));
      await Promise.all([
        writeStatus("dinner_status", dinnerStatus),
        writeStatus("lunch_status", lunchStatus),
        markWeekDone(),
      ]);
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = async () => {
    await markWeekDone();
    onDone();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontWeight: 900,
            fontSize: "1.3rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          What's your status this week?
        </h3>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "0.88rem" }}>
          Let your friends know if you're free for Shabbat dinner or lunch.
        </p>

        <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {(["dinner", "lunch"] as const).map((mealKey) => {
            const value = mealKey === "dinner" ? dinnerStatus : lunchStatus;
            const setter = mealKey === "dinner" ? setDinnerStatus : setLunchStatus;
            const icon = mealKey === "dinner" ? "🍽️" : "🥗";
            const autoBusy = mealKey === "dinner" ? autoDinnerBusy : autoLunchBusy;
            const effectiveBusy = value === "busy" ? true : value === "free" ? false : autoBusy;
            const circleBg = effectiveBusy ? "#fee2e2" : "#dcfce7";
            const circleBorder = effectiveBusy ? "#dc2626" : "#16a34a";
            const labelColor = effectiveBusy ? "#dc2626" : "#16a34a";
            return (
              <div key={mealKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: circleBg,
                    border: `2.5px solid ${circleBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {icon}
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: labelColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {mealKey.toUpperCase()}
                </span>
                <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1.5px solid #e5e7eb" }}>
                  {([null, "free", "busy"] as const).map((opt, i) => {
                    const active = value === opt;
                    const optLabel = opt === null ? "Auto" : opt === "free" ? "Free" : "Busy";
                    return (
                      <button
                        key={optLabel}
                        type="button"
                        onClick={() => setter(opt)}
                        style={{
                          padding: "3px 8px",
                          border: "none",
                          borderRight: i < 2 ? "1px solid #e5e7eb" : "none",
                          background: active ? (opt === "busy" ? "#fee2e2" : opt === "free" ? "#dcfce7" : "#f3f4f6") : "white",
                          color: active ? (opt === "busy" ? "#dc2626" : opt === "free" ? "#16a34a" : "#374151") : "#9ca3af",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {optLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "center" }}>
          <button
            onClick={handleDismiss}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "2px solid #d1d5db",
              background: "white",
              color: "#6b7280",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
