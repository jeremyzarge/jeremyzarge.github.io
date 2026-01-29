import { useEffect, useState, useMemo } from "react";
import { ref, get, set, remove } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { fetchAllUsers, fetchAllApartments, getAllergenCounts } from "../utils";
import { createMeal } from "../index";
import type { User } from "firebase/auth";
import type { Meal, MealParticipant, UserWithId, Apartment } from "../types";

interface MealEditorProps {
  mealId?: string | null; // Optional - if not provided, create mode
  onClose?: () => void;
  onCreated?: () => void;
  authUser: User | null;
  currentUserId: string | null;
}

type MealWithId = Meal & { id: string };

/**
 * Modal editor for creating new meals or modifying existing ones
 */
export default function MealEditor({ mealId, onClose, onCreated, authUser, currentUserId }: MealEditorProps) {
  const isCreateMode = !mealId;
  const [meal, setMeal] = useState<Meal | null>(null);
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [foods, setFoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "participants" | "messages">("info");

  // For adding participants
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // In create mode, initialize with default values
      if (isCreateMode) {
        const defaultMeal: Meal = {
          title: "",
          host_apartment_id: "",
          participants: {},
          datetime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          created_at: new Date().toISOString(),
          instructions: "",
          allowGuestsFoodSelection: false,
          messages: {},
        };
        setMeal(defaultMeal);

        // Load users, apartments, and foods
        const [usersData, apartmentsData] = await Promise.all([
          fetchAllUsers(),
          fetchAllApartments(),
        ]);

        setUsers(usersData);
        setApartments(apartmentsData);

        // Load food types
        const foodsSnap = await get(ref(rtdb, "food"));
        const foodKeys = foodsSnap.exists() ? Object.keys(foodsSnap.val()) : [];
        setFoods(foodKeys);

        setLoading(false);
        return;
      }

      // Edit mode - load existing meal
      const mealSnap = await get(ref(rtdb, `meal_events/${mealId}`));
      if (!mealSnap.exists()) {
        alert("Meal not found");
        setLoading(false);
        return;
      }

      let mealData = mealSnap.val() as any;

      // Convert legacy format to new format if needed
      if (mealData.hosts || mealData.guests) {
        const participants: Record<string, MealParticipant> = {};

        if (mealData.hosts) {
          for (const [userId, data] of Object.entries(mealData.hosts as any)) {
            participants[userId] = {
              food: (data as any).food || "none",
              specifics: (data as any).specifics || "",
              role: "host",
            };
          }
        }

        if (mealData.guests) {
          for (const [userId, data] of Object.entries(mealData.guests as any)) {
            participants[userId] = {
              food: (data as any).food || "none",
              specifics: (data as any).specifics || "",
              role: "guest",
            };
          }
        }

        mealData = {
          ...mealData,
          participants,
          title: mealData.title || "",
          host_apartment_id: mealData.host_apartment_id || "",
          datetime: mealData.datetime || new Date().toISOString(),
          created_at: mealData.created_at || new Date().toISOString(),
          instructions: mealData.instructions || "",
          allowGuestsFoodSelection: mealData.allowGuestsFoodSelection || false,
          messages: mealData.messages || {},
        };
        delete mealData.hosts;
        delete mealData.guests;
      }

      // Ensure all required fields are present
      const normalizedMeal: Meal = {
        title: mealData.title || "",
        host_apartment_id: mealData.host_apartment_id || "",
        participants: mealData.participants || {},
        datetime: mealData.datetime || new Date().toISOString(),
        created_at: mealData.created_at || new Date().toISOString(),
        instructions: mealData.instructions || "",
        allowGuestsFoodSelection: mealData.allowGuestsFoodSelection || false,
        messages: mealData.messages || {},
      };

      setMeal(normalizedMeal);

      // Load users, apartments, and foods
      const [usersData, apartmentsData] = await Promise.all([
        fetchAllUsers(),
        fetchAllApartments(),
      ]);

      setUsers(usersData);
      setApartments(apartmentsData);

      // Load food types
      const foodsSnap = await get(ref(rtdb, "food"));
      const foodKeys = foodsSnap.exists() ? Object.keys(foodsSnap.val()) : [];
      setFoods(foodKeys);

      setLoading(false);
    }

    loadData();
  }, [mealId]);

  // Check if current user is a host (in create mode, user can always edit)
  const isHost = useMemo(() => {
    if (isCreateMode) return true; // Creator can always edit
    if (!meal || !authUser) return false;
    const participant = meal.participants[authUser.uid];
    return participant && participant.role === "host";
  }, [meal, authUser, isCreateMode]);

  // Check if meal is in the past
  const isPastMeal = useMemo(() => {
    if (!meal) return false;
    return new Date(meal.datetime) < new Date();
  }, [meal]);

  // Current user ID (numeric)
  const currentUserNumericId = useMemo(() => {
    if (!currentUserId) return null;
    return currentUserId;
  }, [currentUserId]);

  /**
   * Add a participant to the meal (host authorization required)
   */
  const addParticipant = () => {
    if (!isHost || !selectedUserId || !meal) return;
    if (selectedUserId in meal.participants) return;

    const user = users.find((u) => u.id === selectedUserId);
    if (!user) return;

    // Auto-determine role based on apartment
    const role = user.apartment === meal.host_apartment_id ? "host" : "guest";

    setMeal((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: {
          ...prev.participants,
          [selectedUserId]: { food: "none", specifics: "", role },
        },
      };
    });

    setSelectedUserId("");
  };

  /**
   * Remove a participant from the meal (host authorization required)
   */
  const removeParticipant = (userId: string) => {
    if (!isHost || !meal) return;

    setMeal((prev) => {
      if (!prev) return prev;
      const updated = { ...prev.participants };
      delete updated[userId];
      return { ...prev, participants: updated };
    });
  };

  /**
   * Toggle participant role between host and guest (host authorization required)
   */
  const toggleRole = (userId: string) => {
    if (!isHost || !meal) return;

    setMeal((prev) => {
      if (!prev) return prev;
      const participant = prev.participants[userId];
      if (!participant) return prev;

      return {
        ...prev,
        participants: {
          ...prev.participants,
          [userId]: {
            ...participant,
            role: participant.role === "host" ? "guest" : "host",
          },
        },
      };
    });
  };

  /**
   * Set food for a participant (hosts can edit all, guests can edit their own)
   */
  const setFoodForParticipant = (userId: string, food: string) => {
    if (isPastMeal || !meal) return; // Lock past meals
    // Allow if user is host OR if user is editing their own
    const canEdit = isHost || userId === currentUserNumericId;
    if (!canEdit) return;

    setMeal((prev) => {
      if (!prev) return prev;
      const participant = prev.participants[userId];
      if (!participant) return prev;

      return {
        ...prev,
        participants: {
          ...prev.participants,
          [userId]: { ...participant, food },
        },
      };
    });
  };

  /**
   * Set specifics for a participant (hosts can edit all, guests can edit their own)
   */
  const setSpecificsForParticipant = (userId: string, specifics: string) => {
    if (isPastMeal || !meal) return; // Lock past meals
    // Allow if user is host OR if user is editing their own
    const canEdit = isHost || userId === currentUserNumericId;
    if (!canEdit) return;

    setMeal((prev) => {
      if (!prev) return prev;
      const participant = prev.participants[userId];
      if (!participant) return prev;

      return {
        ...prev,
        participants: {
          ...prev.participants,
          [userId]: { ...participant, specifics },
        },
      };
    });
  };

  /**
   * Save meal changes to database (create or update)
   */
  const handleSave = async () => {
    if (!meal) return;

    // Validation
    if (!meal.title.trim()) {
      alert("Please enter a meal title");
      return;
    }
    if (!meal.host_apartment_id) {
      alert("Please select a host apartment");
      return;
    }

    const participantCount = Object.keys(meal.participants).length;
    if (participantCount === 0) {
      alert("Please add at least one participant");
      return;
    }

    // Check for at least one host
    const hasHost = Object.values(meal.participants).some(p => p.role === "host");
    if (!hasHost) {
      alert("At least one participant must be a host");
      return;
    }

    setSaving(true);
    try {
      if (isCreateMode) {
        // Create new meal
        await createMeal(meal);
        alert("Meal created!");
        if (onCreated) onCreated();
        if (onClose) onClose();
      } else {
        // Update existing meal
        await set(ref(rtdb, `meal_events/${mealId}`), meal);
        alert("Meal updated!");
        if (onClose) onClose();
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to ${isCreateMode ? 'create' : 'save'} meal: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Delete meal from database
   */
  const handleDelete = async () => {
    if (!window.confirm("Delete this meal?")) return;
    try {
      await remove(ref(rtdb, `meal_events/${mealId}`));
      alert("Meal deleted!");
      if (onClose) onClose();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete meal: " + err.message);
    }
  };

  // Calculate allergen counts for meal participants only
  const allergenCounts = useMemo(() => {
    if (!meal) return {};
    const participantIds = Object.keys(meal.participants);
    return getAllergenCounts(participantIds, users);
  }, [meal, users]);

  // Get users available to add (not already participants)
  const availableUsers = useMemo(() => {
    if (!meal) return [];
    const participantIds = new Set(Object.keys(meal.participants));
    return users.filter((u) => !participantIds.has(u.id));
  }, [users, meal]);

  // Get participants with user info
  const participantsWithInfo = useMemo(() => {
    if (!meal) return [];
    return Object.entries(meal.participants).map(([userId, participant]) => {
      const user = users.find((u) => u.id === userId);
      return { userId, participant, user };
    });
  }, [meal, users]);

  if (loading || !meal) {
    return <div style={{ padding: 20 }}>Loading meal editor…</div>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 32,
          borderRadius: 20,
          maxWidth: 950,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #059669 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <h3
          style={{
            marginBottom: 20,
            fontWeight: 900,
            fontSize: "1.8rem",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}
        >
          {isCreateMode ? "Create New Meal" : (meal.title || "Edit Meal")}
        </h3>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, background: "#f3f4f6", padding: 6, borderRadius: 50, width: "fit-content" }}>
          {(isCreateMode ? ["info", "participants"] : ["info", "participants", "messages"]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                borderRadius: 50,
                border: "none",
                background: activeTab === tab
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "transparent",
                color: activeTab === tab ? "white" : "#6b7280",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                  Meal Title
                </label>
                <input
                  value={meal.title}
                  onChange={(e) => isHost && !isPastMeal && setMeal((prev) => prev && { ...prev, title: e.target.value })}
                  placeholder="Enter meal title..."
                  disabled={!isHost || isPastMeal}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #d1d5db",
                    width: "100%",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                  Host Apartment
                </label>
                <select
                  value={meal.host_apartment_id}
                  onChange={(e) =>
                    isHost && !isPastMeal && setMeal((prev) => prev && { ...prev, host_apartment_id: e.target.value })
                  }
                  disabled={!isHost || isPastMeal}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #d1d5db",
                    width: "100%",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  <option value="">-- Select host apartment --</option>
                  {apartments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.address}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                borderRadius: 12,
                border: "2px solid #fbbf24",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#78350f",
                }}
              >
                🥜 Allergens (Meal Participants)
              </h4>
              {Object.keys(allergenCounts).length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(allergenCounts).map(([allergen, count]) => (
                    <span
                      key={allergen}
                      style={{
                        padding: "6px 14px",
                        background: "white",
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#92400e",
                        border: "2px solid #fbbf24",
                      }}
                    >
                      {allergen} ({count})
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#92400e", fontWeight: 600 }}>No allergens reported</div>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                Special Instructions
              </label>
              <textarea
                value={meal.instructions}
                onChange={(e) =>
                  isHost && !isPastMeal && setMeal((prev) => prev && { ...prev, instructions: e.target.value })
                }
                disabled={!isHost || isPastMeal}
                style={{
                  width: "100%",
                  minHeight: 100,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "2px solid #d1d5db",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  fontFamily: "Inter, sans-serif",
                  resize: "vertical",
                }}
                placeholder="Add any special instructions for the meal..."
              />
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <div style={{ marginTop: 12 }}>
            {isHost && !isPastMeal && (
              <div
                style={{
                  marginBottom: 20,
                  padding: 16,
                  background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  borderRadius: 12,
                  border: "2px solid #60a5fa",
                }}
              >
                <div style={{ marginBottom: 12, fontWeight: 800, color: "#1e40af", fontSize: "1rem" }}>
                  👥 Add Participant
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "2px solid #60a5fa",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      background: "white",
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
                      padding: "12px 24px",
                      borderRadius: 12,
                      border: "none",
                      background: selectedUserId
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "#d1d5db",
                      color: "white",
                      cursor: selectedUserId ? "pointer" : "not-allowed",
                      fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: selectedUserId ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <h4 style={{ marginBottom: 16, fontWeight: 800, fontSize: "1.05rem", color: "#374151" }}>
              Participants ({participantsWithInfo.length})
            </h4>

            {participantsWithInfo.length === 0 ? (
              <div
                style={{
                  color: "#9ca3af",
                  padding: 32,
                  textAlign: "center",
                  background: "#f9fafb",
                  borderRadius: 12,
                  fontWeight: 600,
                }}
              >
                No participants yet
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  background: "white",
                  borderRadius: 12,
                  border: "2px solid #e5e7eb",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "14px 12px",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: "#374151",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "14px 12px",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: "#374151",
                        }}
                      >
                        Food
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "14px 12px",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: "#374151",
                        }}
                      >
                        Specifics
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "14px 12px",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: "#374151",
                        }}
                      >
                        Role
                      </th>
                      {isHost && !isPastMeal && (
                        <th
                          style={{
                            textAlign: "left",
                            padding: "14px 12px",
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            color: "#374151",
                          }}
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {participantsWithInfo.map(({ userId, participant, user }) => {
                      if (!user) return null;

                      return (
                        <tr
                          key={userId}
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <td style={{ padding: "12px", fontWeight: 600, color: "#374151" }}>
                            {user.first_name} {user.last_name}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <select
                              value={participant.food}
                              onChange={(e) => setFoodForParticipant(userId, e.target.value)}
                              disabled={isPastMeal || (!isHost && userId !== currentUserNumericId)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "2px solid #d1d5db",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                minWidth: 120,
                              }}
                            >
                              <option value="none">None</option>
                              {foods.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <input
                              type="text"
                              value={participant.specifics}
                              onChange={(e) => setSpecificsForParticipant(userId, e.target.value)}
                              disabled={isPastMeal || (!isHost && userId !== currentUserNumericId)}
                              placeholder="e.g., vegan, GF"
                              style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "2px solid #d1d5db",
                                width: "100%",
                                fontWeight: 500,
                                fontSize: "0.9rem",
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px" }}>
                            <button
                              type="button"
                              onClick={() => toggleRole(userId)}
                              disabled={!isHost || isPastMeal}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 20,
                                border: "none",
                                background:
                                  participant.role === "host"
                                    ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                color: "white",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                cursor: isHost && !isPastMeal ? "pointer" : "not-allowed",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                opacity: isHost && !isPastMeal ? 1 : 0.6,
                              }}
                            >
                              {participant.role === "host" ? "Host" : "Guest"}
                            </button>
                          </td>
                          {isHost && !isPastMeal && (
                            <td style={{ padding: "12px" }}>
                              <button
                                type="button"
                                onClick={() => removeParticipant(userId)}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: 8,
                                  border: "none",
                                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                  color: "white",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div style={{ marginTop: 12 }}>
            <h4>Messages</h4>
            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
                background: "#f3f4f6",
                padding: 8,
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              {Object.entries(meal.messages).length === 0 ? (
                <div style={{ color: "#6b7280" }}>No messages yet</div>
              ) : (
                Object.entries(meal.messages).map(([id, msg]) => {
                  const user = users.find((u) => u.id === msg.user);
                  return (
                    <div key={id} style={{ marginBottom: 4 }}>
                      <strong>{user ? user.first_name : msg.user}:</strong> {msg.text}
                      <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 8 }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            {mealId && currentUserId && (
              <MessageInput mealId={mealId} currentUserId={currentUserId} onMessageSent={() => {
                // Reload meal to show new message
                get(ref(rtdb, `meal_events/${mealId}`)).then((snap) => {
                  if (snap.exists()) {
                    const updatedMeal = snap.val() as Meal;
                    setMeal(updatedMeal);
                  }
                });
              }} />
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28 }}>
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "2px solid #d1d5db",
              background: "white",
              color: "#6b7280",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </button>
          {isHost && (
            <>
              {!isCreateMode && (
                <button
                  onClick={handleDelete}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "12px 32px",
                  borderRadius: 12,
                  border: "none",
                  background: saving
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  boxShadow: saving ? "none" : "0 6px 16px rgba(16, 185, 129, 0.4)",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.3px",
                }}
              >
                {saving
                  ? isCreateMode ? "Creating…" : "Saving…"
                  : isCreateMode ? "Create Meal" : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Subcomponent for sending messages (persists to database)
 */
function MessageInput({
  mealId,
  currentUserId,
  onMessageSent,
}: {
  mealId: string;
  currentUserId: string;
  onMessageSent: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || !currentUserId) return;

    setSending(true);
    try {
      const timestamp = Date.now();
      const id = `${timestamp}_${currentUserId}`;

      // Save message directly to database
      await set(ref(rtdb, `meal_events/${mealId}/messages/${id}`), {
        user: currentUserId,
        text: text.trim(),
        timestamp,
      });

      setText("");
      onMessageSent();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
        placeholder="Type a message"
        disabled={sending}
        style={{
          flex: 1,
          padding: 6,
          borderRadius: 6,
          border: "1px solid #d1d5db",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: !text.trim() || sending ? "#9ca3af" : "#3b82f6",
          color: "white",
          cursor: !text.trim() || sending ? "not-allowed" : "pointer",
        }}
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </div>
  );
}
