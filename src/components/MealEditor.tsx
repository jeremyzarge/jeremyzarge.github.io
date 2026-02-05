import { useEffect, useState, useMemo } from "react";
import { ref, get, set, remove, onValue } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { fetchAllUsers, fetchAllApartments, getAllergenCounts } from "../utils";
import { createMeal } from "../index";
import type { User } from "firebase/auth";
import type { Meal, MealParticipant, UserWithId, Apartment } from "../types";
import ClickableUserName from "./ClickableUserName";

/** Food emoji and label mapping */
const foodDisplayMap: Record<string, { emoji: string; label: string }> = {
  // Database food options
  none: { emoji: "➖", label: "None" },
  challah: { emoji: "🍞", label: "Challah" },
  dessert: { emoji: "🍰", label: "Dessert" },
  dips: { emoji: "🫕", label: "Dips" },
  dip: { emoji: "🫕", label: "Dips" },
  "grape juice": { emoji: "🍇", label: "Grape Juice" },
  grapejuice: { emoji: "🍇", label: "Grape Juice" },
  grape_juice: { emoji: "🍇", label: "Grape Juice" },
  main: { emoji: "🍝", label: "Main" },
  sides: { emoji: "🥔", label: "Sides" },
  side: { emoji: "🥔", label: "Sides" },
  vegetable: { emoji: "🥦", label: "Vegetable" },
  vegetables: { emoji: "🥦", label: "Vegetables" },
  // Profile food options (for compatibility)
  drinks: { emoji: "🥤", label: "Drinks" },
  drink: { emoji: "🥤", label: "Drinks" },
  salad: { emoji: "🥗", label: "Salad" },
  main_dish: { emoji: "🍝", label: "Main Dish" },
  "main dish": { emoji: "🍝", label: "Main Dish" },
  maindish: { emoji: "🍝", label: "Main Dish" },
  snacks: { emoji: "🍿", label: "Snacks" },
  snack: { emoji: "🍿", label: "Snacks" },
  utensils: { emoji: "🍴", label: "Utensils" },
  utensil: { emoji: "🍴", label: "Utensils" },
};

/** Format a food key into a display string with emoji */
const formatFood = (food: string): string => {
  // Normalize: lowercase, trim, remove extra spaces
  const normalizedKey = food.toLowerCase().trim();

  // Try exact match first
  if (foodDisplayMap[normalizedKey]) {
    const mapped = foodDisplayMap[normalizedKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // Try with underscores replaced by spaces
  const spacedKey = normalizedKey.replace(/_/g, " ");
  if (foodDisplayMap[spacedKey]) {
    const mapped = foodDisplayMap[spacedKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // Try with spaces replaced by underscores
  const underscoredKey = normalizedKey.replace(/\s+/g, "_");
  if (foodDisplayMap[underscoredKey]) {
    const mapped = foodDisplayMap[underscoredKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // Try with all spaces/underscores removed (e.g., "maindish")
  const compactKey = normalizedKey.replace(/[\s_-]+/g, "");
  if (foodDisplayMap[compactKey]) {
    const mapped = foodDisplayMap[compactKey];
    return `${mapped.emoji} ${mapped.label}`;
  }

  // For unknown foods, capitalize nicely with generic emoji
  const label = food
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return `🍽️ ${label}`;
};

interface MealEditorProps {
  mealId?: string | null; // Optional - if not provided, create mode
  onClose?: () => void;
  onCreated?: () => void;
  authUser: User | null;
  currentUserId: string | null;
  friendIds?: string[];
  onViewProfile?: (userId: string) => void;
}

type MealWithId = Meal & { id: string };

/**
 * Modal editor for creating new meals or modifying existing ones
 */
export default function MealEditor({ mealId, onClose, onCreated, authUser: _authUser, currentUserId, friendIds, onViewProfile }: MealEditorProps) {
  const isCreateMode = !mealId;
  const [meal, setMeal] = useState<Meal | null>(null);
  const [originalMeal, setOriginalMeal] = useState<Meal | null>(null); // Track original for change detection
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
      try {
      setLoading(true);

      // In create mode, initialize with default values
      if (isCreateMode) {
        // Load users, apartments, and foods first
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

        // Find creator's apartment to set as default host apartment
        const creator = usersData.find((u) => u.id === currentUserId);
        const creatorApartment = creator?.apartment || "";

        // Auto-add creator as a host participant (auto-accepted)
        const initialParticipants: Record<string, MealParticipant> = {};
        if (currentUserId) {
          initialParticipants[currentUserId] = {
            food: "none",
            specifics: "",
            role: "host",
            accepted: true,
          };
        }

        const defaultMeal: Meal = {
          title: "",
          host_apartment_id: creatorApartment,
          participants: initialParticipants,
          datetime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          created_at: new Date().toISOString(),
          instructions: "",
          allowGuestsFoodSelection: false,
          messages: {},
        };
        setMeal(defaultMeal);
        setOriginalMeal(structuredClone(defaultMeal)); // Track original state

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
              accepted: true, // Legacy participants are accepted
            };
          }
        }

        if (mealData.guests) {
          for (const [userId, data] of Object.entries(mealData.guests as any)) {
            participants[userId] = {
              food: (data as any).food || "none",
              specifics: (data as any).specifics || "",
              role: "guest",
              accepted: true, // Legacy participants are accepted
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
      setOriginalMeal(structuredClone(normalizedMeal)); // Track original state

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
      } catch (err) {
        console.error("Failed to load meal editor:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [mealId]);

  // Real-time listener for meal updates (edit mode only)
  useEffect(() => {
    if (isCreateMode || !mealId) return;

    const mealRef = ref(rtdb, `meal_events/${mealId}`);
    const unsubscribe = onValue(mealRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const mealData = snapshot.val();

      // Normalize meal data (handle legacy format)
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
    });

    return () => unsubscribe();
  }, [mealId, isCreateMode]);

  // Check if current user is a host (in create mode, user can always edit)
  const isHost = useMemo(() => {
    if (isCreateMode) return true; // Creator can always edit
    if (!meal || !currentUserId) return false;
    const participant = meal.participants[currentUserId];
    return participant && participant.role === "host";
  }, [meal, currentUserId, isCreateMode]);

  // Check if meal is in the past
  const isPastMeal = useMemo(() => {
    if (!meal) return false;
    return new Date(meal.datetime) < new Date();
  }, [meal]);

  // Check if meal has unsaved changes (compare with original, excluding messages)
  const hasChanges = useMemo(() => {
    if (!meal || !originalMeal) return false;
    // Compare relevant fields (exclude messages as they save immediately)
    const current = { ...meal, messages: {} };
    const original = { ...originalMeal, messages: {} };
    return JSON.stringify(current) !== JSON.stringify(original);
  }, [meal, originalMeal]);

  // Current user ID (numeric)
  const currentUserNumericId = useMemo(() => {
    if (!currentUserId) return null;
    return currentUserId;
  }, [currentUserId]);

  /**
   * Add a participant to the meal (host authorization required)
   * Hosts are auto-accepted, guests start as invited (accepted: false)
   */
  const addParticipant = () => {
    if (!isHost || !selectedUserId || !meal) return;
    if (selectedUserId in meal.participants) return;

    const user = users.find((u) => u.id === selectedUserId);
    if (!user) return;

    // Auto-determine role based on apartment
    const role = user.apartment === meal.host_apartment_id ? "host" : "guest";
    // Hosts are auto-accepted, guests must accept the invitation
    const accepted = role === "host";

    setMeal((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: {
          ...prev.participants,
          [selectedUserId]: { food: "none", specifics: "", role, accepted },
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
   * Allow current user to leave the meal (remove themselves)
   * Any participant can leave, but the last host cannot leave
   */
  const leaveMeal = async () => {
    if (!currentUserId || !meal) return;
    if (!(currentUserId in meal.participants)) return;

    const myParticipant = meal.participants[currentUserId];

    // Prevent last host from leaving
    if (myParticipant?.role === "host") {
      const otherAcceptedHosts = Object.entries(meal.participants)
        .filter(([id, p]) => id !== currentUserId && p.role === "host" && (p.accepted ?? true));

      if (otherAcceptedHosts.length === 0) {
        alert("You cannot leave as the last host. Delete the meal or assign another host first.");
        return;
      }
    }

    if (!window.confirm("Are you sure you want to leave this meal?")) return;

    // Update local state
    setMeal((prev) => {
      if (!prev) return prev;
      const updated = { ...prev.participants };
      delete updated[currentUserId];
      return { ...prev, participants: updated };
    });

    // Save to database immediately and close
    if (!isCreateMode && mealId) {
      try {
        await remove(ref(rtdb, `meal_events/${mealId}/participants/${currentUserId}`));
        if (onClose) onClose();
      } catch (err) {
        console.error("Failed to leave meal:", err);
        alert("Failed to leave meal");
      }
    }
  };

  /**
   * Check if a user is a resident of the host apartment
   */
  const isResidentOfHostApartment = (userId: string): boolean => {
    if (!meal) return false;
    const user = users.find((u) => u.id === userId);
    return user?.apartment === meal.host_apartment_id;
  };

  /**
   * Toggle participant role between host and guest (host authorization required)
   * Note: Residents of the host apartment cannot be made guests
   */
  const toggleRole = (userId: string) => {
    if (!isHost || !meal) return;

    const participant = meal.participants[userId];
    if (!participant) return;

    // If user is a resident of host apartment and currently a host, don't allow changing to guest
    if (isResidentOfHostApartment(userId) && participant.role === "host") {
      return; // Residents must remain hosts
    }

    setMeal((prev) => {
      if (!prev) return prev;
      const p = prev.participants[userId];
      if (!p) return prev;

      return {
        ...prev,
        participants: {
          ...prev.participants,
          [userId]: {
            ...p,
            role: p.role === "host" ? "guest" : "host",
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

  // Calculate allergen counts for accepted participants only
  const allergenCounts = useMemo(() => {
    if (!meal) return {};
    // Only count accepted participants (use ?? true for backward compatibility)
    const acceptedParticipantIds = Object.entries(meal.participants)
      .filter(([_, p]) => p.accepted ?? true)
      .map(([id]) => id);
    return getAllergenCounts(acceptedParticipantIds, users);
  }, [meal, users]);

  // Get users available to add (not already participants), friends first
  const friendSet = useMemo(() => new Set(friendIds || []), [friendIds]);
  const availableUsers = useMemo(() => {
    if (!meal) return [];
    const participantIds = new Set(Object.keys(meal.participants));
    const available = users.filter((u) => !participantIds.has(u.id));
    // Sort friends first, then alphabetical within each group
    return available.sort((a, b) => {
      const aIsFriend = friendSet.has(a.id) ? 0 : 1;
      const bIsFriend = friendSet.has(b.id) ? 0 : 1;
      if (aIsFriend !== bIsFriend) return aIsFriend - bIsFriend;
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    });
  }, [users, meal, friendSet]);

  // Get participants with user info
  const participantsWithInfo = useMemo(() => {
    if (!meal) return [];
    return Object.entries(meal.participants).map(([userId, participant]) => {
      const user = users.find((u) => u.id === userId);
      return { userId, participant, user };
    });
  }, [meal, users]);

  // Separate accepted participants from invited (pending)
  const acceptedParticipants = useMemo(() => {
    return participantsWithInfo.filter(({ participant }) => participant.accepted ?? true);
  }, [participantsWithInfo]);

  const invitedParticipants = useMemo(() => {
    return participantsWithInfo.filter(({ participant }) => !(participant.accepted ?? true));
  }, [participantsWithInfo]);

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
          {(isCreateMode
            ? (["info", "participants"] as const)
            : (["info", "participants", "messages"] as const)
          ).map((tab) => (
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
                    fontFamily: "Inter, sans-serif",
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
                    fontFamily: "Inter, sans-serif",
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
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <option value="">-- Select user --</option>
                    {friendSet.size > 0 && availableUsers.some((u) => friendSet.has(u.id)) && (
                      <optgroup label="Friends">
                        {availableUsers.filter((u) => friendSet.has(u.id)).map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.first_name} {u.last_name} (Apt: {u.apartment || "—"})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {availableUsers.some((u) => !friendSet.has(u.id)) && (
                      <optgroup label={friendSet.size > 0 ? "Other Users" : "Users"}>
                        {availableUsers.filter((u) => !friendSet.has(u.id)).map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.first_name} {u.last_name} (Apt: {u.apartment || "—"})
                          </option>
                        ))}
                      </optgroup>
                    )}
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
              Participants ({acceptedParticipants.length})
            </h4>

            {acceptedParticipants.length === 0 ? (
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
                    {acceptedParticipants.map(({ userId, participant, user }) => {
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
                            {onViewProfile ? (
                              <ClickableUserName
                                userId={userId}
                                firstName={user.first_name}
                                lastName={user.last_name}
                                onClick={onViewProfile}
                              />
                            ) : (
                              <>{user.first_name} {user.last_name}</>
                            )}
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
                                minWidth: 140,
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              <option value="none">{formatFood("none")}</option>
                              {foods.map((f) => (
                                <option key={f} value={f}>
                                  {formatFood(f)}
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
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                fontFamily: "Inter, sans-serif",
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px" }}>
                            {(() => {
                              const isResident = isResidentOfHostApartment(userId);
                              const canToggle = isHost && !isPastMeal && !(isResident && participant.role === "host");
                              return (
                                <button
                                  type="button"
                                  onClick={() => toggleRole(userId)}
                                  disabled={!canToggle}
                                  title={isResident && participant.role === "host" ? "Residents of host apartment must be hosts" : ""}
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
                                    cursor: canToggle ? "pointer" : "not-allowed",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    opacity: canToggle ? 1 : 0.6,
                                  }}
                                >
                                  {participant.role === "host" ? "Host" : "Guest"}
                                  {isResident && participant.role === "host" ? " 🏠" : ""}
                                </button>
                              );
                            })()}
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

            {/* Invited (pending) participants section */}
            {invitedParticipants.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 16, fontWeight: 800, fontSize: "1.05rem", color: "#9ca3af" }}>
                  Invited ({invitedParticipants.length})
                </h4>
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    padding: 16,
                  }}
                >
                  {invitedParticipants.map(({ userId, user }) => (
                    <div
                      key={userId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#374151" }}>
                        {onViewProfile && user ? (
                          <ClickableUserName
                            userId={userId}
                            firstName={user.first_name}
                            lastName={user.last_name}
                            onClick={onViewProfile}
                          />
                        ) : (
                          <>{user?.first_name} {user?.last_name}</>
                        )}
                      </span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                            color: "#92400e",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          Invited
                        </span>
                        {isHost && !isPastMeal && (
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
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div style={{ marginTop: 12 }}>
            <h4 style={{ marginBottom: 16, fontWeight: 800, fontSize: "1.05rem", color: "#374151" }}>
              💬 Messages
            </h4>
            {/* Check if current user is accepted - invited users cannot view messages */}
            {currentUserId && meal.participants[currentUserId] && !(meal.participants[currentUserId].accepted ?? true) ? (
              <div
                style={{
                  padding: 32,
                  textAlign: "center",
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  borderRadius: 12,
                  color: "#92400e",
                  fontWeight: 600,
                  border: "2px solid #fbbf24",
                }}
              >
                You must accept the invitation to view messages.
              </div>
            ) : (
              <>
                <div
                  style={{
                    maxHeight: 280,
                    overflowY: "auto",
                    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    border: "2px solid #e5e7eb",
                  }}
                >
                  {Object.entries(meal.messages).length === 0 ? (
                    <div style={{ color: "#9ca3af", textAlign: "center", fontWeight: 600, padding: 20 }}>
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    Object.entries(meal.messages).map(([id, msg]) => {
                      const user = users.find((u) => u.id === msg.user);
                      return (
                        <div
                          key={id}
                          style={{
                            marginBottom: 12,
                            padding: "10px 14px",
                            background: "white",
                            borderRadius: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
                            {user && onViewProfile ? (
                              <ClickableUserName
                                userId={msg.user}
                                firstName={user.first_name}
                                lastName={user.last_name}
                                onClick={onViewProfile}
                                style={{ color: "#10b981" }}
                              />
                            ) : (
                              user ? `${user.first_name} ${user.last_name}` : msg.user
                            )}
                          </div>
                          <div style={{ fontWeight: 500, color: "#374151", fontFamily: "Inter, sans-serif" }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 6 }}>
                            {new Date(msg.timestamp).toLocaleString()}
                          </div>
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
              </>
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
          {/* Leave Meal button - for any participant (not just hosts) */}
          {!isCreateMode && currentUserId && meal.participants[currentUserId] && (meal.participants[currentUserId].accepted ?? true) && (
            <button
              onClick={leaveMeal}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "white",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              Leave Meal
            </button>
          )}
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
                    fontWeight: 800,
                    fontSize: "1rem",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Delete Meal
                </button>
              )}
              {(() => {
                // Save button is disabled if saving, or for edit mode: past meal or no changes
                const isDisabled = saving || (!isCreateMode && (isPastMeal || !hasChanges));
                return (
                  <button
                    onClick={handleSave}
                    disabled={isDisabled}
                    style={{
                      padding: "12px 32px",
                      borderRadius: 12,
                      border: "none",
                      background: isDisabled
                        ? "#d1d5db"
                        : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      boxShadow: isDisabled ? "none" : "0 6px 16px rgba(16, 185, 129, 0.4)",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {saving
                      ? isCreateMode ? "Creating…" : "Saving…"
                      : isCreateMode ? "Create Meal" : "Save Changes"}
                  </button>
                );
              })()}
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
    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
        placeholder="Type a message..."
        disabled={sending}
        style={{
          flex: 1,
          padding: "12px 16px",
          borderRadius: 12,
          border: "2px solid #d1d5db",
          fontWeight: 600,
          fontSize: "0.95rem",
          fontFamily: "Inter, sans-serif",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        style={{
          padding: "12px 24px",
          borderRadius: 12,
          border: "none",
          background: !text.trim() || sending
            ? "#d1d5db"
            : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          cursor: !text.trim() || sending ? "not-allowed" : "pointer",
          fontWeight: 700,
          fontSize: "0.95rem",
          fontFamily: "Inter, sans-serif",
          boxShadow: !text.trim() || sending ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)",
        }}
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </div>
  );
}
