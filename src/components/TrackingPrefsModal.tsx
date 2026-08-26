import { useState } from "react";
import { ref, set } from "firebase/database";
import { rtdb } from "../firebaseClient";
import type { UserProfile } from "../types";

interface TrackingPrefsModalProps {
  userId: string;
  currentPreference: UserProfile["tracking_preference"];
  onClose: () => void;
  onSaved: (preference: NonNullable<UserProfile["tracking_preference"]>) => void;
}

const OPTIONS: { key: NonNullable<UserProfile["tracking_preference"]>; label: string; description: string }[] = [
  {
    key: "all",
    label: "Full Tracking",
    description: "The default — you see meal counts for everyone, and your meal count is visible to others.",
  },
  {
    key: "untracked_self",
    label: "External Tracking",
    description: "Your meal count still shows up for others, but your own ledger only shows names, apartments, and status.",
  },
  {
    key: "opted_out",
    label: "No Tracking",
    description: "Your meal count is hidden from everyone (including apartment totals), and your own ledger only shows names, apartments, and status.",
  },
];

export default function TrackingPrefsModal({ userId, currentPreference, onClose, onSaved }: TrackingPrefsModalProps) {
  const [selected, setSelected] = useState<NonNullable<UserProfile["tracking_preference"]>>(currentPreference ?? "all");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await set(ref(rtdb, `users/${userId}/tracking_preference`), selected);
      onSaved(selected);
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
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          width: "100%",
          maxWidth: 460,
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable body */}
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>

        <h3
          style={{
            margin: "0 0 6px",
            fontWeight: 900,
            fontSize: "1.4rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Meal Tracking
        </h3>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "0.9rem" }}>
          Choose how meal counts work for you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {OPTIONS.map(({ key, label, description }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              style={{
                textAlign: "left",
                display: "flex",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 12,
                background: selected === key ? "#f0f9ff" : "#f9fafb",
                border: `2px solid ${selected === key ? "#667eea" : "#e5e7eb"}`,
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${selected === key ? "#667eea" : "#d1d5db"}`,
                  flexShrink: 0,
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selected === key && (
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#667eea" }} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#374151" }}>{label}</div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 2 }}>{description}</div>
              </div>
            </button>
          ))}
        </div>

        </div>

        {/* Footer — a real block below the scrollable body, not an overlay, so nothing shows through it */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0, padding: 24, background: "white", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <button
            onClick={onClose}
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
