import { useEffect, useState, useMemo, type FormEvent } from "react";
import { fetchAllUsers, fetchAllApartments } from "../utils";
import { createMeal } from "../index";
import type { Apartment, UserWithId, Meal, MealParticipant } from "../types";

interface CreateMealProps {
  onCreated?: (mealId: string) => void;
  onCancel?: () => void;
}

type ParticipantWithRole = {
  userId: string;
  role: "host" | "guest";
};

/**
 * Form for creating a new meal with dropdown participant selection
 */
export default function CreateMeal({ onCreated, onCancel }: CreateMealProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hostApartment, setHostApartment] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [participants, setParticipants] = useState<ParticipantWithRole[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetchAllApartments(), fetchAllUsers()]).then(([apts, usrs]) => {
      setApartments(apts);
      setUsers(usrs);
    });
  }, []);

  /**
   * Auto-determines role based on apartment (hybrid approach)
   */
  const determineRole = (userId: string): "host" | "guest" => {
    const user = users.find((u) => u.id === userId);
    if (!user || !hostApartment) return "guest";
    return user.apartment === hostApartment ? "host" : "guest";
  };

  const addParticipant = () => {
    if (!selectedUserId) return;
    if (participants.some((p) => p.userId === selectedUserId)) return;

    const role = determineRole(selectedUserId);
    setParticipants([...participants, { userId: selectedUserId, role }]);
    setSelectedUserId("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants(participants.filter((p) => p.userId !== userId));
  };

  const toggleRole = (userId: string) => {
    setParticipants(
      participants.map((p) =>
        p.userId === userId ? { ...p, role: p.role === "host" ? "guest" : "host" } : p
      )
    );
  };

  const availableUsers = useMemo(() => {
    const participantIds = new Set(participants.map((p) => p.userId));
    return users.filter((u) => !participantIds.has(u.id));
  }, [users, participants]);

  const hasAtLeastOneHost = useMemo(() => {
    return participants.some((p) => p.role === "host");
  }, [participants]);

  const formIsValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      date &&
      time &&
      hostApartment &&
      participants.length > 0 &&
      hasAtLeastOneHost
    );
  }, [title, date, time, hostApartment, participants.length, hasAtLeastOneHost]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formIsValid) return;

    setSubmitting(true);

    const iso = new Date(`${date}T${time}`).toISOString();

    const participantsMap: Record<string, MealParticipant> = {};
    participants.forEach((p) => {
      participantsMap[p.userId] = {
        food: "none",
        specifics: "",
        role: p.role,
      };
    });

    const mealObj: Meal = {
      title: title.trim(),
      host_apartment_id: hostApartment,
      participants: participantsMap,
      datetime: iso,
      created_at: new Date().toISOString(),
      instructions: "",
      allowGuestsFoodSelection: false,
      messages: {},
    };

    try {
      const mealId = await createMeal(mealObj);

      // Reset form
      setTitle("");
      setDate("");
      setTime("");
      setHostApartment("");
      setParticipants([]);

      if (onCreated) onCreated(mealId);
      alert("Meal created (id: " + mealId + ")");
    } catch (err: any) {
      console.error("createMeal error", err);
      alert("Failed to create meal: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 820,
        background: "#fff",
        padding: 18,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
        marginTop: 20,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Create Meal</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        />

        <select
          value={hostApartment}
          onChange={(e) => setHostApartment(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        >
          <option value="">-- Host apartment --</option>
          {apartments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — {a.address}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Add Participants</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          >
            <option value="">-- Select user --</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.first_name} {u.last_name} (Apt: {u.apartment || "—"})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addParticipant}
            disabled={!selectedUserId}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: selectedUserId ? "#3b82f6" : "#9ca3af",
              color: "white",
              cursor: selectedUserId ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            Add
          </button>
        </div>
      </div>

      {participants.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>
            Participants ({participants.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {participants.map((p) => {
              const user = users.find((u) => u.id === p.userId);
              if (!user) return null;

              return (
                <div
                  key={p.userId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRole(p.userId)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      border: "none",
                      background: p.role === "host" ? "#3b82f6" : "#10b981",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {p.role === "host" ? "Host" : "Guest"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeParticipant(p.userId)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          {!hasAtLeastOneHost && (
            <div style={{ marginTop: 8, color: "#ef4444", fontSize: 14 }}>
              ⚠️ At least one participant must be a host
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 16,
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#9ca3af",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!formIsValid || submitting}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: !formIsValid || submitting ? "#9ca3af" : "#10b981",
            color: "white",
            cursor: !formIsValid || submitting ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {submitting ? "Creating…" : "Create Meal"}
        </button>
      </div>
    </form>
  );
}
