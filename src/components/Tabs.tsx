interface TabsProps {
  active: string;
  onChange: (tabId: string) => void;
}

/**
 * Tab navigation component with colorful styling
 */
export default function Tabs({ active, onChange }: TabsProps) {
  const tabs = [
    { id: "ledger", label: "Meal Ledger", color: "#667eea" },
    { id: "upcoming", label: "Upcoming Meals", color: "#10b981" },
    { id: "past", label: "Past Meals", color: "#f093fb" },
    { id: "friends", label: "Friends", color: "#f59e0b" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
        background: "white",
        padding: 8,
        borderRadius: 50,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "fit-content",
      }}
    >
      {tabs.map((t) => (
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
  );
}
