import { useState } from "react";

export default function AddMealForm({ onAddMeal, otherUsers }) {
  const [hostId, setHostId] = useState("");
  const [count, setCount] = useState(1);

  function submit(e) {
    e.preventDefault();
    if (!hostId) return;
    onAddMeal(String(hostId), Number(count));
    setHostId("");
    setCount(1);
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420, background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.06)', marginTop: 20 }}>
      <h3 style={{ marginTop: 0 }}>Add Meal</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select value={hostId} onChange={(e) => setHostId(e.target.value)} style={{ padding: 8, borderRadius: 8, flex: 1 }}>
          <option value="">--Select User--</option>
          {otherUsers.map((u) => <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>)}
        </select>

        <input type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} style={{ width: 80, padding: 8, borderRadius: 8 }} />

        <button type="submit" style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Add
        </button>
      </div>
    </form>
  );
}
