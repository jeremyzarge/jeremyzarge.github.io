export default function MealList({ meals, otherUsers }) {
  return (
    <div style={{ maxWidth: 720, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }}>
      <h3 style={{ marginTop: 0 }}>Your Meals Ledger</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef6' }}>
            <th style={{ padding: '8px 6px' }}>User</th>
            <th style={{ padding: '8px 6px' }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {otherUsers.length === 0 ? (
            <tr><td colSpan={2} style={{ padding: 8 }}>No other users yet.</td></tr>
          ) : otherUsers.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: 8 }}>{u.first_name} {u.last_name}</td>
              <td style={{ padding: 8 }}>{meals[u.id] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
