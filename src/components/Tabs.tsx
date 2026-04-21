interface TabsProps {
  active: string;
  onChange: (tabId: string) => void;
}

const mainTabs = [
  { id: "ledger",   label: "Ledger",   color: "#667eea" },
  { id: "upcoming", label: "Upcoming", color: "#10b981" },
  { id: "past",     label: "Past",     color: "#f093fb" },
  { id: "friends",  label: "Friends",  color: "#f59e0b" },
];

const mobileTabs = [
  { id: "ledger",   label: "Ledger",   icon: "📊",  color: "#667eea" },
  { id: "upcoming", label: "Upcoming", icon: "🍽️", color: "#10b981" },
  { id: "past",     label: "Past",     icon: "🕐",  color: "#f093fb" },
  { id: "friends",  label: "Friends",  icon: "👥",  color: "#f59e0b" },
  { id: "profile",  label: "Profile",  icon: "👤",  color: "#8b5cf6" },
];

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <>
      {/* Desktop: pill bar at top */}
      <div
        className="tab-bar desktop-tabs"
        style={{
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
          background: "white",
          padding: 8,
          borderRadius: 50,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "fit-content",
          margin: "0 auto 24px",
        }}
      >
        {mainTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: "12px 24px",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              background: active === t.id ? t.color : "transparent",
              color: active === t.id ? "white" : "#374151",
              fontWeight: 700,
              fontSize: "1rem",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
              boxShadow: active === t.id ? `0 4px 12px ${t.color}40` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Mobile: fixed bottom nav — display controlled by CSS, not inline style */}
      <div
        className="mobile-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          zIndex: 500,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {mobileTabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 4px",
                border: "none",
                background: "none",
                cursor: "pointer",
                gap: 3,
                color: isActive ? t.color : "#9ca3af",
                transition: "color 0.2s",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{t.icon}</span>
              <span style={{
                fontSize: "0.62rem",
                fontWeight: isActive ? 700 : 500,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.01em",
              }}>
                {t.label}
              </span>
              {isActive && (
                <span style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 32,
                  height: 3,
                  borderRadius: "0 0 3px 3px",
                  background: t.color,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
