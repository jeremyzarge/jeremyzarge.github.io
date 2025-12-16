// src/components/MealList.jsx
import { useState, useMemo } from "react";

export default function MealList({ meals, otherUsers }) {
  const [searchText, setSearchText] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchText) return otherUsers;
    return otherUsers.filter(u =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [otherUsers, searchText]);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "20px auto",
        fontFamily: "'Inter', sans-serif",
        background: "#e0f7fa",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, fontWeight: 600, color: "#006064" }}>Your Meals Ledger</h3>

      {/* Search / Filter */}
      <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #b2ebf2",
            background: "#b2ebf2",
            color: "#004d40",
            fontWeight: 500,
            fontSize: 16,
            fontFamily: "'Inter', sans-serif",
            outline: "none",
          }}
        />
        {/* You could add additional dropdown filters here with same style */}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #80deea" }}>
            <th style={{ padding: "12px 8px", color: "#006064" }}>User</th>
            <th style={{ padding: "12px 8px", color: "#006064" }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ padding: 12, color: "#004d40" }}>
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: "1px solid #b2ebf2",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
              >
                <td
                  style={{
                    padding: 12,
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                    color: "#004d40",
                  }}
                >
                  {u.first_name} {u.last_name}
                </td>
                <td
                  style={{
                    padding: 12,
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                    color: "#004d40",
                  }}
                >
                  {meals[u.id] ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
