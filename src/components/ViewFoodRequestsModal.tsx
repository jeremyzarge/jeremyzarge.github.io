import { formatFood } from "../utils";
import type { Meal } from "../types";

interface ViewFoodRequestsModalProps {
  meal: Meal;
  onClose: () => void;
}

/** How many participants currently have `food` selected (as their main pick or an extra item). */
function currentlyChosenCount(food: string, meal: Meal): number {
  let count = 0;
  for (const p of Object.values(meal.participants)) {
    const claims = [p.food, ...(p.additional_items ?? []).map((it) => it.food)];
    count += claims.filter((f) => f === food).length;
  }
  return count;
}

/** open (nothing taken yet) → partial (some taken) → full (all taken) */
type OpenStatus = "open" | "partial" | "full";

function openStatus(chosen: number, quantity: number): OpenStatus {
  if (chosen <= 0) return "open";
  if (chosen >= quantity) return "full";
  return "partial";
}

const statusRank: Record<OpenStatus, number> = { open: 0, partial: 1, full: 2 };
const statusColors: Record<OpenStatus, { background: string; border: string; text: string; subtext: string }> = {
  open: { background: "#f0fdf4", border: "#86efac", text: "#166534", subtext: "#15803d" },
  partial: { background: "#fefce8", border: "#fde047", text: "#854d0e", subtext: "#a16207" },
  full: { background: "#fef2f2", border: "#fca5a5", text: "#991b1b", subtext: "#b91c1c" },
};

export default function ViewFoodRequestsModal({ meal, onClose }: ViewFoodRequestsModalProps) {
  const items = (meal.food_requests ?? [])
    .filter((it) => it.quantity > 0)
    .map((item) => {
      const chosen = currentlyChosenCount(item.food, meal);
      const remaining = Math.max(0, item.quantity - chosen);
      return { item, chosen, remaining, status: openStatus(chosen, item.quantity) };
    })
    .sort((a, b) => statusRank[a.status] - statusRank[b.status] || b.remaining - a.remaining);
  const enforced = !!meal.food_requests_enforced;

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
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontWeight: 900,
            fontSize: "1.4rem",
            background: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          📋 Food Requests
        </h3>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "0.9rem" }}>
          {enforced
            ? "The host has enforced these amounts — you can only choose from what's still open below."
            : "The host's suggestions for this meal — you're still free to bring anything."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(({ item, remaining, status }) => {
            const colors = statusColors[status];
            return (
              <div
                key={item.food}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: colors.background,
                  border: `2px solid ${colors.border}`,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: colors.text }}>{formatFood(item.food)}</div>
                <div style={{ fontSize: "0.85rem", color: colors.subtext, fontWeight: 600 }}>
                  {remaining} out of {item.quantity} open
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", padding: 12 }}>
              {(meal.food_requests?.length ?? 0) > 0
                ? "The host hasn't requested anything from the catalog for this meal — bring whatever you'd like."
                : "No food requests yet."}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
