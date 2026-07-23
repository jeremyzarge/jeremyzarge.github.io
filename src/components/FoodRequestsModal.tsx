import { useState } from "react";
import { ref, update } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { formatFood, attemptCloseWithUnsavedChanges } from "../utils";
import type { FoodRequestItem, Meal } from "../types";

interface FoodRequestsModalProps {
  mealId: string;
  meal: Meal;
  foods: string[];
  onClose: () => void;
}

const MAX_QUANTITY = 5;

function range(min: number, max: number): number[] {
  return Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i);
}

/** Shared look for every dropdown/text input in this modal, matching the rest of MealEditor. */
const fieldStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "2px solid #d1d5db",
  fontWeight: 600,
  fontSize: "0.9rem",
  fontFamily: "Inter, sans-serif",
  color: "#374151",
};

/** How many participants currently have `food` selected (as their main pick or an extra item). */
function currentlyChosenCount(food: string, meal: Meal): number {
  let count = 0;
  for (const p of Object.values(meal.participants)) {
    const claims = [p.food, ...(p.additional_items ?? []).map((it) => it.food)];
    count += claims.filter((f) => f === food).length;
  }
  return count;
}

export default function FoodRequestsModal({ mealId, meal, foods, onClose }: FoodRequestsModalProps) {
  const [items, setItems] = useState<FoodRequestItem[]>(() => structuredClone(meal.food_requests ?? []));
  const [enforced, setEnforced] = useState(!!meal.food_requests_enforced);
  const [customFoodInput, setCustomFoodInput] = useState("");
  const [saving, setSaving] = useState(false);

  const allFoodKeys = Array.from(new Set([...foods, ...items.map((it) => it.food)]));
  const isBlank = items.length === 0; // nothing touched yet — the true default state

  const normalizeItems = (arr: FoodRequestItem[]) =>
    JSON.stringify([...arr].sort((a, b) => a.food.localeCompare(b.food)));
  const hasChanges =
    enforced !== !!meal.food_requests_enforced ||
    normalizeItems(items) !== normalizeItems(meal.food_requests ?? []);

  const handleClose = () => attemptCloseWithUnsavedChanges(hasChanges, handleSave, onClose);

  const setQuantity = (food: string, quantity: number) => {
    setItems((prev) => {
      const wasBlank = prev.length === 0;
      let next = prev.some((it) => it.food === food)
        ? prev.map((it) => (it.food === food ? { ...it, quantity } : it))
        : [...prev, { food, quantity }];
      // First-ever selection: every other untouched food defaults to whatever's already
      // been freely chosen for it (usually 0) — never below what people already picked.
      if (wasBlank) {
        for (const f of foods) {
          if (f !== food && !next.some((it) => it.food === f)) {
            next = [...next, { food: f, quantity: currentlyChosenCount(f, meal) }];
          }
        }
      }
      return next;
    });
  };

  const addCustomFood = () => {
    const food = customFoodInput.trim();
    if (!food) return;
    if (items.some((it) => it.food === food) || foods.includes(food)) {
      setCustomFoodInput("");
      return;
    }
    setItems((prev) => {
      const wasBlank = prev.length === 0;
      let next: FoodRequestItem[] = [...prev, { food, quantity: Math.max(1, currentlyChosenCount(food, meal)) }];
      if (wasBlank) {
        for (const f of foods) {
          if (!next.some((it) => it.food === f)) {
            next = [...next, { food: f, quantity: currentlyChosenCount(f, meal) }];
          }
        }
      }
      return next;
    });
    setCustomFoodInput("");
  };

  const removeCustomFood = (food: string) => {
    setItems((prev) => prev.filter((it) => it.food !== food));
  };

  const resetToDefault = () => {
    if (!window.confirm("Reset food requests back to default? This clears everything you've set and turns enforcement off.")) return;
    setItems([]);
    setEnforced(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      // Once anything's been touched, persist one entry per catalog food (even at 0) so a
      // deliberate "everything's 0" save is distinguishable from "never configured" —
      // otherwise leave it fully empty, matching the untouched default state.
      const cleanItems: FoodRequestItem[] = isBlank
        ? []
        : [
            ...foods.map((food) => items.find((it) => it.food === food) ?? { food, quantity: currentlyChosenCount(food, meal) }),
            ...items.filter((it) => !foods.includes(it.food)),
          ];
      updates[`meal_events/${mealId}/food_requests`] = cleanItems;
      updates[`meal_events/${mealId}/food_requests_enforced`] = enforced;

      // If enforcement is on AND something's actually been configured, a guest's existing
      // pick might no longer fit (e.g. turning enforcement on for the first time can
      // invalidate picks of foods that were never requested at all) — reset those so the
      // guest has to choose again from what's actually available. If nothing's been
      // configured yet (cleanItems is empty), there's nothing to enforce against — don't
      // wipe every guest's selection just because the checkbox is checked.
      if (enforced && cleanItems.length > 0) {
        const stillAvailableFor = (food: string, forUserId: string): boolean => {
          const item = cleanItems.find((it) => it.food === food);
          if (!item) return false;
          let others = 0;
          for (const [uid, p] of Object.entries(meal.participants)) {
            if (uid === forUserId) continue;
            const claims = [p.food, ...(p.additional_items ?? []).map((it) => it.food)];
            others += claims.filter((f) => f === food).length;
          }
          return item.quantity - others > 0;
        };
        for (const [uid, p] of Object.entries(meal.participants)) {
          if (p.food !== "none" && p.food !== "other" && !stillAvailableFor(p.food, uid)) {
            updates[`meal_events/${mealId}/participants/${uid}/food`] = "none";
          }
          const keptItems = (p.additional_items ?? []).filter(
            (it) => it.food === "none" || it.food === "other" || stillAvailableFor(it.food, uid)
          );
          if (keptItems.length !== (p.additional_items ?? []).length) {
            updates[`meal_events/${mealId}/participants/${uid}/additional_items`] = keptItems;
          }
        }
      }

      await update(ref(rtdb), updates);
      onClose();
    } catch (err) {
      console.error("Failed to save food requests:", err);
      alert("Failed to save food requests");
    } finally {
      setSaving(false);
    }
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
      onClick={handleClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          🍽️ Manage Food Requests
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Set how much of each food you'd like for this meal.
          </p>
          <button
            type="button"
            onClick={resetToDefault}
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontFamily: "Inter, sans-serif",
              textDecoration: "underline",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Reset to default
          </button>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 12,
            background: enforced ? "#f0fdf4" : "#f9fafb",
            border: `2px solid ${enforced ? "#bbf7d0" : "#e5e7eb"}`,
            cursor: isBlank ? "not-allowed" : "pointer",
            userSelect: "none",
            opacity: isBlank ? 0.6 : 1,
          }}
        >
          <input
            type="checkbox"
            checked={enforced}
            disabled={isBlank}
            onChange={(e) => setEnforced(e.target.checked)}
            style={{ width: 16, height: 16, cursor: isBlank ? "not-allowed" : "pointer" }}
          />
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#374151" }}>
            Enforce these amounts
            <span style={{ display: "block", fontWeight: 400, fontSize: "0.8rem", color: "#6b7280" }}>
              {isBlank
                ? "Set at least one food's amount below before enforcing."
                : enforced
                ? "Guests can only choose foods from this list, within these amounts."
                : "Off — guests will see these as suggestions but can still bring anything."}
            </span>
          </span>
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allFoodKeys.map((food) => {
            const item = items.find((it) => it.food === food);
            const minQty = currentlyChosenCount(food, meal);
            const maxQty = Math.max(MAX_QUANTITY, minQty);
            const quantity = item?.quantity ?? minQty;

            return (
              <div
                key={food}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: item ? "#f0fdf4" : "#f9fafb",
                  border: `2px solid ${item ? "#bbf7d0" : "#e5e7eb"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#374151" }}>{formatFood(food)}</div>
                    {!foods.includes(food) && (
                      <button
                        type="button"
                        onClick={() => removeCustomFood(food)}
                        title="Remove this custom food"
                        style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Inter, sans-serif", textDecoration: "underline" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <select
                    value={isBlank ? "" : quantity}
                    onChange={(e) => setQuantity(food, Number(e.target.value))}
                    style={{ ...fieldStyle, minWidth: 64 }}
                  >
                    {isBlank && <option value="">—</option>}
                    {range(minQty, maxQty).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <input
            type="text"
            placeholder="+ Add custom food item"
            value={customFoodInput}
            onChange={(e) => setCustomFoodInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCustomFood(); }}
            style={{ ...fieldStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={addCustomFood}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button
            onClick={handleClose}
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
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
