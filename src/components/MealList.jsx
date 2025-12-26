export default function MealList({ meals, otherUsers, showApartment, apartmentMode }) {
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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #80deea" }}>
            <th style={{ padding: "12px 8px" }}>{apartmentMode ? "Apartment" : "User"}</th>
            {showApartment && !apartmentMode && <th style={{ padding: "12px 8px" }}>Apartment</th>}
            <th style={{ padding: "12px 8px" }}>Balance</th>
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
              <td style={{ padding: 12 }}>{u.first_name} {u.last_name}</td>
              {showApartment && !apartmentMode && (
                <td style={{ padding: 12 }}>{u.apartment?.name ?? "-"}</td>
              )}
              <td style={{ padding: 12 }}>{meals[u.id] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
