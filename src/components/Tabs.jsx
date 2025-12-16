export default function Tabs({ active, onChange }) {
  const tabs = [
    { id: "ledger", label: "Meal Ledger" },
    { id: "upcoming", label: "Upcoming Meals" },
    { id: "past", label: "Past Meals" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: active === t.id ? "#3b82f6" : "#e5e7eb",
            color: active === t.id ? "white" : "#111827",
            fontWeight: 600,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
