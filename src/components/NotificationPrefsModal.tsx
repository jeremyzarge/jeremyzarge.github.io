import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "../firebaseClient";
import type { NotifPrefKey } from "../notifications";

interface NotificationPrefsModalProps {
  userId: string;
  onClose: () => void;
}

const PREFS: { key: NotifPrefKey; label: string; description: string }[] = [
  {
    key: "friend_requests",
    label: "Friend requests",
    description: "When someone sends or accepts a friend request",
  },
  {
    key: "meal_messages",
    label: "Meal messages",
    description: "New messages in meals you're attending",
  },
  {
    key: "meal_updates",
    label: "Meal updates",
    description: "Changes to time, location, or instructions",
  },
  {
    key: "meal_food",
    label: "Food & role changes",
    description: "Food assigned/removed or role changed for you",
  },
  {
    key: "meal_deleted",
    label: "Meal cancelled",
    description: "When a meal you're attending is deleted",
  },
  {
    key: "host_invites",
    label: "Invite responses (hosts only)",
    description: "When guests accept or decline your invite",
  },
  {
    key: "host_guest_food",
    label: "Guest food updates (hosts only)",
    description: "When guests update their own food assignments",
  },
];

export default function NotificationPrefsModal({ userId, onClose }: NotificationPrefsModalProps) {
  const [prefs, setPrefs] = useState<Record<NotifPrefKey, boolean>>({
    friend_requests: true,
    meal_messages: true,
    meal_updates: true,
    meal_food: true,
    meal_deleted: true,
    host_invites: true,
    host_guest_food: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get(ref(rtdb, `users/${userId}/notification_prefs`)).then((snap) => {
      if (snap.exists()) {
        const stored = snap.val() as Partial<Record<NotifPrefKey, boolean>>;
        setPrefs((prev) => ({ ...prev, ...stored }));
      }
      setLoading(false);
    });
  }, [userId]);

  const toggle = (key: NotifPrefKey) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await set(ref(rtdb, `users/${userId}/notification_prefs`), prefs);
      onClose();
    } catch (err) {
      console.warn("Failed to save notification prefs:", err);
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
          borderRadius: 20,
          padding: 24,
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Notification Settings
        </h3>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "0.9rem" }}>
          Choose which notifications you'd like to receive.
        </p>

        {loading ? (
          <div style={{ padding: "20px 0", color: "#9ca3af", textAlign: "center" }}>Loading…</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PREFS.map(({ key, label, description }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: prefs[key] ? "#f0f9ff" : "#f9fafb",
                  border: `2px solid ${prefs[key] ? "#bae6fd" : "#e5e7eb"}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#374151" }}>{label}</div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 2 }}>{description}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  style={{
                    width: 48,
                    height: 26,
                    borderRadius: 13,
                    border: "none",
                    background: prefs[key]
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#d1d5db",
                    cursor: "pointer",
                    position: "relative",
                    flexShrink: 0,
                    transition: "background 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: prefs[key] ? 24 : 4,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "white",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      transition: "left 0.2s ease",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
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
            disabled={saving || loading}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 700,
              cursor: saving || loading ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              opacity: saving || loading ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
