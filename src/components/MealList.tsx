import { useState } from "react";
import { formatNumber } from "../utils";
import ClickableUserName from "./ClickableUserName";

interface MealListProps {
  meals: Record<string, number>;
  otherUsers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    apartment?: { id: string; name: string; address: string } | null;
  }>;
  showApartment?: boolean;
  apartmentMode?: boolean;
  onViewProfile?: (userId: string) => void;
  onViewApartment?: (apartmentId: string) => void;
  /** This week's Shabbat status per user id — when provided, renders a "This Week" dots column. */
  weekStatus?: Record<string, { dinnerBusy: boolean; lunchBusy: boolean }>;
  /** Omit the Balance column — used for viewers who've opted out of meal tracking. */
  hideBalance?: boolean;
}

/**
 * Displays a list/table of users or apartments with meal balances
 */
export default function MealList({
  meals,
  otherUsers,
  showApartment,
  apartmentMode,
  onViewProfile,
  onViewApartment,
  weekStatus,
  hideBalance,
}: MealListProps) {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
        background: "#e0f7fa",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <table className="meal-ledger-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "center", borderBottom: "2px solid #80deea" }}>
            <th style={{ padding: "12px 8px" }}>
              {apartmentMode ? "Apartment" : "User"}
            </th>
            {showApartment && !apartmentMode && (
              <th style={{ padding: "12px 8px" }}>Apartment</th>
            )}
            {!hideBalance && <th style={{ padding: "12px 8px" }}>Balance</th>}
            {weekStatus && <ThisWeekHeader />}
          </tr>
        </thead>
        <tbody>
          {otherUsers.map((u) => (
            <tr
              key={u.id}
              style={{
                borderBottom: "1px solid #b2ebf2",
                transition: "background 0.2s",
              }}
            >
              <td style={{ padding: 12, textAlign: "center"}}>
                {onViewProfile && !apartmentMode ? (
                  <ClickableUserName
                    userId={u.id}
                    firstName={u.first_name}
                    lastName={u.last_name}
                    onClick={onViewProfile}
                    style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset", textAlign: "center", width: "100%" }}
                  />
                ) : onViewApartment && apartmentMode ? (
                  <ApartmentLink name={u.first_name} onClick={() => onViewApartment(u.id)} />
                ) : (
                  <>{u.first_name} {u.last_name}</>
                )}
              </td>
              {showApartment && !apartmentMode && (
                <td style={{ padding: 12, textAlign: "center"}}>
                  {onViewApartment && u.apartment
                    ? <ApartmentLink name={u.apartment.name} onClick={() => onViewApartment(u.apartment!.id)} />
                    : u.apartment?.name ?? "-"}
                </td>
              )}
              {!hideBalance && (
                <td style={{ padding: 12, textAlign: "center"}}>{formatNumber(meals[u.id] ?? 0)}</td>
              )}
              {weekStatus && (
                <td style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <WeekStatusDot busy={weekStatus[u.id]?.dinnerBusy ?? false} label="Dinner" />
                    <WeekStatusDot busy={weekStatus[u.id]?.lunchBusy ?? false} label="Lunch" />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ThisWeekHeader() {
  const [show, setShow] = useState(false);
  return (
    <th style={{ padding: "12px 8px", position: "relative" }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "default" }}
      >
        This Week
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#9ca3af",
            color: "white",
            fontSize: "0.65rem",
            fontWeight: 700,
          }}
        >
          i
        </span>
      </span>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: 6,
            width: 180,
            padding: "10px 14px",
            borderRadius: 10,
            border: "2px solid #e5e7eb",
            background: "white",
            color: "#374151",
            fontSize: "0.78rem",
            fontWeight: 600,
            textAlign: "left",
            whiteSpace: "normal",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 20,
          }}
        >
          Dinner (Fri) · Lunch (Sat)<br />🟢 Free · 🔴 Busy
        </div>
      )}
    </th>
  );
}

function WeekStatusDot({ busy, label }: { busy: boolean; label: string }) {
  return (
    <span
      title={`${label}: ${busy ? "Busy" : "Free"}`}
      style={{
        display: "inline-block",
        width: 11,
        height: 11,
        borderRadius: "50%",
        background: busy ? "#dc2626" : "#16a34a",
      }}
    />
  );
}

function ApartmentLink({ name, onClick }: { name: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        font: "inherit",
        color: "#059669",
        fontWeight: 700,
        cursor: "pointer",
        textDecoration: hovered ? "underline" : "none",
        textAlign: "center",
      }}
    >
      {name}
    </button>
  );
}
