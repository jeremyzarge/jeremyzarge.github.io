import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, get, set, remove, onValue } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { fetchAllUsers, fetchAllApartments, getAllergenCounts } from "../utils";
import { generateMealInviteUrl } from "../inviteService";
import { createMeal } from "../index";
import type { User } from "firebase/auth";
import type { Meal, MealParticipant, UserWithId, Apartment } from "../types";
import ClickableUserName from "./ClickableUserName";
import { notifyUsers } from "../notifications";

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

/** Deterministic color from user ID for message names */
const nameColors = [
  "#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261",
  "#264653", "#6a4c93", "#1982c4", "#8ac926", "#ff595e",
  "#6d6875", "#b5838d", "#0077b6", "#d62828", "#588157",
];
function getNameColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  return nameColors[Math.abs(hash) % nameColors.length];
}


interface MealEditorProps {
  mealId?: string | null; // Optional - if not provided, create mode
  onClose?: () => void;
  onCreated?: () => void;
  authUser: User | null;
  currentUserId: string | null;
  friendIds?: string[];
  onViewProfile?: (userId: string) => void;
  /** Read-only invite preview — user can only Accept or Reject */
  invitedMode?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

type MealWithId = Meal & { id: string };

/**
 * Modal editor for creating new meals or modifying existing ones
 */
export default function MealEditor({ mealId, onClose, onCreated, authUser: _authUser, currentUserId, friendIds, onViewProfile, invitedMode, onAccept, onReject }: MealEditorProps) {
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
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Searchable combobox for participant selection
  const [userSearch, setUserSearch] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userComboRef = useRef<HTMLDivElement>(null);

  // Ref for auto-scrolling messages to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  /** Jump instantly to bottom (for initial load / tab switch) */
  const jumpToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  /** Smooth scroll to bottom (for after sending a new message) */
  const scrollToBottomSmooth = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
          datetime: "",
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
        location: mealData.location || "",
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
        location: mealData.location || "",
        allowGuestsFoodSelection: mealData.allowGuestsFoodSelection || false,
        messages: mealData.messages || {},
      };

      setMeal(normalizedMeal);
    });

    return () => unsubscribe();
  }, [mealId, isCreateMode]);

  // Close participant combobox dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userComboRef.current && !userComboRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Jump to bottom instantly when switching to messages tab
  useEffect(() => {
    if (activeTab === "messages") {
      // Small delay to let DOM render, then jump instantly (no animation)
      setTimeout(() => jumpToBottom(), 50);
    }
  }, [activeTab, jumpToBottom]);

  // Check if current user is a host (in create mode, user can always edit)
  const isHost = useMemo(() => {
    if (invitedMode) return false; // Read-only preview — no editing
    if (isCreateMode) return true; // Creator can always edit
    if (!meal || !currentUserId) return false;
    const participant = meal.participants[currentUserId];
    return participant && participant.role === "host";
  }, [meal, currentUserId, isCreateMode, invitedMode]);

  // Check if meal is in the past
  const isPastMeal = useMemo(() => {
    if (!meal) return false;
    return !!meal.datetime && new Date(meal.datetime) < new Date();
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

    // Auto-determine role based on apartment, but never auto-accept —
    // every added participant must accept their invitation individually
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
    setUserSearch("");
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
        .filter(([id, p]) => id !== currentUserId && p.role === "host" && p.accepted === true);

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
          [userId]: { ...p, role: p.role === "host" ? "guest" : "host" },
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

  /** Add an extra item row for a participant */
  const addAdditionalItem = (userId: string) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    setMeal((prev) => {
      if (!prev) return prev;
      const p = prev.participants[userId];
      if (!p) return prev;
      return {
        ...prev,
        participants: {
          ...prev.participants,
          [userId]: { ...p, additional_items: [...(p.additional_items || []), { food: "none", specifics: "" }] },
        },
      };
    });
  };

  /** Remove an extra item row for a participant */
  const removeAdditionalItem = (userId: string, index: number) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    setMeal((prev) => {
      if (!prev) return prev;
      const p = prev.participants[userId];
      if (!p) return prev;
      const updated = (p.additional_items || []).filter((_, i) => i !== index);
      return {
        ...prev,
        participants: {
          ...prev.participants,
          [userId]: { ...p, additional_items: updated },
        },
      };
    });
  };

  /** Set food for an additional item */
  const setAdditionalItemFood = (userId: string, index: number, food: string) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    setMeal((prev) => {
      if (!prev) return prev;
      const p = prev.participants[userId];
      if (!p) return prev;
      const items = [...(p.additional_items || [])];
      items[index] = { ...items[index], food };
      return {
        ...prev,
        participants: { ...prev.participants, [userId]: { ...p, additional_items: items } },
      };
    });
  };

  /** Set specifics for an additional item */
  const setAdditionalItemSpecifics = (userId: string, index: number, specifics: string) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    setMeal((prev) => {
      if (!prev) return prev;
      const p = prev.participants[userId];
      if (!p) return prev;
      const items = [...(p.additional_items || [])];
      items[index] = { ...items[index], specifics };
      return {
        ...prev,
        participants: { ...prev.participants, [userId]: { ...p, additional_items: items } },
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

    const prevParticipants = originalMeal?.participants ?? {};
    const newParticipants = meal.participants;
    const myName = (() => {
      const me = users.find((u) => u.id === currentUserId);
      return me ? `${me.first_name} ${me.last_name}`.trim() : "The host";
    })();

    setSaving(true);
    try {
      if (isCreateMode) {
        await createMeal(meal);
        alert("Meal created!");
        // Notify all invited participants (everyone except the creator)
        const invitedIds = Object.keys(newParticipants).filter((id) => id !== currentUserId);
        notifyUsers(invitedIds, {
          title: "New meal invitation 🍽️",
          body: `${myName} invited you to "${meal.title}"`,
          tag: `meal-invite-new`,
          data: { tab: "upcoming" },
        }, "meal_food");
        if (onCreated) onCreated();
        if (onClose) onClose();
      } else {
        await set(ref(rtdb, `meal_events/${mealId}`), meal);
        setOriginalMeal(structuredClone(meal));
        alert("Meal updated!");

        // Newly added participants
        const addedIds = Object.keys(newParticipants).filter((id) => !prevParticipants[id] && id !== currentUserId);
        notifyUsers(addedIds, {
          title: "New meal invitation 🍽️",
          body: `${myName} invited you to "${meal.title}"`,
          tag: `meal-invite-${mealId}`,
          data: { tab: "upcoming" },
        }, "meal_food");

        // Removed participants
        const removedIds = Object.keys(prevParticipants).filter((id) => !newParticipants[id] && id !== currentUserId);
        notifyUsers(removedIds, {
          title: "Removed from meal",
          body: `You were removed from "${meal.title}"`,
          tag: `meal-removed-${mealId}`,
          data: { tab: "upcoming" },
        }, "meal_food");

        // Datetime, location, or instructions changed — notify all other accepted participants
        const otherAcceptedIds = Object.entries(newParticipants)
          .filter(([id, p]) => id !== currentUserId && p.accepted === true)
          .map(([id]) => id);

        if (originalMeal?.datetime && meal.datetime !== originalMeal.datetime) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal time updated 🕐",
            body: `The time for "${meal.title}" has changed`,
            tag: `meal-time-${mealId}`,
            data: { tab: "upcoming" },
          }, "meal_updates");
        }

        if (originalMeal && meal.location !== originalMeal.location) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal location updated 📍",
            body: `The location for "${meal.title}" has changed`,
            tag: `meal-location-${mealId}`,
            data: { tab: "upcoming" },
          }, "meal_updates");
        }

        if (originalMeal && meal.host_apartment_id !== originalMeal.host_apartment_id) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal location updated 📍",
            body: `The host apartment for "${meal.title}" has changed`,
            tag: `meal-apt-${mealId}`,
            data: { tab: "upcoming" },
          }, "meal_updates");
        }

        if (originalMeal && meal.instructions !== originalMeal.instructions && meal.instructions.trim()) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal instructions updated",
            body: `Instructions for "${meal.title}" were updated`,
            tag: `meal-instructions-${mealId}`,
            data: { tab: "upcoming" },
          }, "meal_updates");
        }

        // Per-participant changes by host
        if (isHost) {
          for (const [uid, p] of Object.entries(newParticipants)) {
            if (uid === currentUserId) continue;
            const prev = prevParticipants[uid];
            if (!prev) continue;

            // Role changed
            if (p.role !== prev.role) {
              notifyUsers([uid], {
                title: "Your role was changed",
                body: `You are now a ${p.role} for "${meal.title}"`,
                tag: `meal-role-${mealId}-${uid}`,
                data: { tab: "upcoming" },
              }, "meal_food");
            }

            // Food assignment changed
            if (p.food !== prev.food) {
              if (p.food === "none") {
                notifyUsers([uid], {
                  title: "Food assignment removed",
                  body: `Your food assignment for "${meal.title}" was removed`,
                  tag: `meal-food-${mealId}-${uid}`,
                  data: { tab: "upcoming" },
                }, "meal_food");
              } else {
                notifyUsers([uid], {
                  title: "Food assignment updated",
                  body: `Your food for "${meal.title}" was set to ${p.food}`,
                  tag: `meal-food-${mealId}-${uid}`,
                  data: { tab: "upcoming" },
                }, "meal_food");
              }
            }

            // Additional item removed
            const prevItemCount = (prev.additional_items || []).length;
            const newItemCount = (p.additional_items || []).length;
            if (newItemCount < prevItemCount) {
              notifyUsers([uid], {
                title: "Food item removed",
                body: `A food item was removed from your assignment for "${meal.title}"`,
                tag: `meal-item-removed-${mealId}-${uid}`,
                data: { tab: "upcoming" },
              }, "meal_food");
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to ${isCreateMode ? 'create' : 'save'} meal: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save only the current user's own participant entry (for non-hosts)
   */
  const handleNonHostSave = async () => {
    if (!meal || !currentUserId || !mealId) return;
    const myParticipant = meal.participants[currentUserId];
    if (!myParticipant) return;

    setSaving(true);
    try {
      await set(ref(rtdb, `meal_events/${mealId}/participants/${currentUserId}`), myParticipant);
      setOriginalMeal(structuredClone(meal));
      // Notify hosts that this participant updated their info
      const hostIds = Object.entries(meal.participants)
        .filter(([id, p]) => p.role === "host" && id !== currentUserId)
        .map(([id]) => id);
      const me = users.find((u) => u.id === currentUserId);
      const myName = me ? `${me.first_name} ${me.last_name}`.trim() : "A participant";
      notifyUsers(hostIds, {
        title: "Participant updated",
        body: `${myName} updated their food for "${meal.title}"`,
        tag: `meal-participant-update-${mealId}-${currentUserId}`,
        data: { tab: "upcoming" },
      }, "host_guest_food");
    } catch (err: any) {
      console.error(err);
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Delete meal from database
   */
  const handleDelete = async () => {
    if (!meal || !window.confirm("Delete this meal?")) return;
    try {
      // Notify all other participants before deleting
      const otherIds = Object.keys(meal.participants).filter((id) => id !== currentUserId);
      notifyUsers(otherIds, {
        title: "Meal cancelled",
        body: `"${meal.title}" has been cancelled`,
        tag: `meal-deleted-${mealId}`,
        data: { tab: "upcoming" },
      }, "meal_deleted");

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
    // Only count accepted participants
    const acceptedParticipantIds = Object.entries(meal.participants)
      .filter(([_, p]) => p.accepted === true)
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

  // Filtered users for the combobox dropdown — empty until something is typed
  const filteredComboUsers = useMemo(() => {
    if (!userSearch.trim()) return [];
    const q = userSearch.toLowerCase();
    return availableUsers.filter((u) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      (apartments.find((a) => a.id === u.apartment)?.name || "").toLowerCase().includes(q)
    );
  }, [availableUsers, userSearch, apartments]);

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
    return participantsWithInfo.filter(({ participant }) => participant.accepted === true);
  }, [participantsWithInfo]);

  const invitedParticipants = useMemo(() => {
    return participantsWithInfo.filter(({ participant }) => participant.accepted !== true);
  }, [participantsWithInfo]);

  if (loading || !meal) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
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
        className="modal-content"
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
          position: "relative",
        }}
      >
        {/* X close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: "1.4rem",
            color: "#9ca3af",
            cursor: "pointer",
            lineHeight: 1,
            padding: "4px 8px",
            borderRadius: 8,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          ✕
        </button>

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
        <div className="tab-bar" style={{ display: "flex", gap: 10, marginBottom: 24, background: "#f3f4f6", padding: 6, borderRadius: 50, width: "fit-content" }}>
          {(isCreateMode || invitedMode
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
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                  Meal Title {isCreateMode && <span style={{ color: "#ef4444" }}>*</span>}
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
                  Host Apartment {isCreateMode && <span style={{ color: "#ef4444" }}>*</span>}
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

            {/* Optional custom location */}
            {(isHost || meal.location) && !isPastMeal && (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                  📍 Custom Location <span style={{ fontWeight: 400, color: "#9ca3af" }}>(if different from host apartment)</span>
                </label>
                <input
                  value={meal.location || ""}
                  onChange={(e) => isHost && !isPastMeal && setMeal((prev) => prev && { ...prev, location: e.target.value })}
                  placeholder="e.g., 123 Main St, Apt 4B"
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
            )}
            {meal.location && isPastMeal && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#f9fafb", borderRadius: 10, fontWeight: 600, color: "#374151" }}>
                📍 {meal.location}
              </div>
            )}

            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                borderRadius: 12,
                border: "2px solid #a78bfa",
              }}
            >
              <label style={{ display: "block", marginBottom: 8, fontWeight: 800, color: "#5b21b6", fontSize: "0.9rem" }}>
                📅 Date & Time {isCreateMode && <span style={{ color: "#ef4444" }}>*</span>}
              </label>
              <DatePicker
                selected={meal.datetime ? new Date(meal.datetime) : null}
                onChange={(date) => {
                  if (!isHost || isPastMeal || !date) return;
                  if (date <= new Date()) return;
                  setMeal((prev) => prev && { ...prev, datetime: date.toISOString() });
                }}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                filterTime={(time) => time > new Date()}
                onChangeRaw={(e) => e.preventDefault()}
                disabled={!isHost || isPastMeal}
                placeholderText="Select date and time..."
                wrapperClassName="datepicker-full-width"
                className="datepicker-input"
              />
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

            {isHost && !isCreateMode && mealId && (
              <div style={{ marginTop: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                  Invite Link
                </label>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #d1d5db",
                    background: "#f9fafb",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    fontFamily: "monospace",
                    color: "#4f46e5",
                    userSelect: "all",
                    wordBreak: "break-all",
                  }}
                >
                  {generateMealInviteUrl(mealId)}
                </div>
              </div>
            )}
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
                <div className="add-participant-row" style={{ display: "flex", gap: 12 }}>
                  <div ref={userComboRef} style={{ flex: 1, minWidth: 0, position: "relative" }}>
                    <input
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setSelectedUserId("");
                        setUserDropdownOpen(true);
                      }}
                      onFocus={() => setUserDropdownOpen(true)}
                      placeholder="Search for a user..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "2px solid #60a5fa",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        background: "white",
                        fontFamily: "Inter, sans-serif",
                        boxSizing: "border-box",
                      }}
                    />
                    {userDropdownOpen && filteredComboUsers.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          left: 0,
                          right: 0,
                          background: "white",
                          border: "2px solid #60a5fa",
                          borderRadius: 10,
                          zIndex: 200,
                          maxHeight: 220,
                          overflowY: "auto",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                      >
                        {filteredComboUsers.map((u) => (
                          <div
                            key={u.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedUserId(u.id);
                              setUserSearch(`${u.first_name} ${u.last_name}`);
                              setUserDropdownOpen(false);
                            }}
                            style={{
                              padding: "10px 16px",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "0.95rem",
                              borderBottom: "1px solid #f3f4f6",
                              display: "flex",
                              gap: 6,
                              alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                          >
                            <span>{u.first_name} {u.last_name}</span>
                            {friendSet.has(u.id) && (
                              <span style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: 700 }}>friend</span>
                            )}
                            <span style={{ fontSize: "0.8rem", color: "#9ca3af", marginLeft: "auto" }}>
                              {apartments.find((a) => a.id === u.apartment)?.name || "No apt"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                className={`participant-table${isPastMeal ? "" : " participant-table--active"}`}
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
                      {!isPastMeal && <th style={{ width: 44, padding: "14px 4px 14px 12px" }} />}
                      <th
                        style={{
                          textAlign: "center",
                          padding: "14px 12px",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: "#374151",
                        }}
                      >
                        Name
                      </th>
                      <th
                        className="col-food"
                        style={{
                          textAlign: "center",
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
                          textAlign: "center",
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
                          textAlign: "center",
                          padding: "14px 12px",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: "#374151",
                        }}
                      >
                        Role
                      </th>
                      {!isPastMeal && (
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

                      // Profile-based food options for this participant
                      const profileFoods: string[] = [];
                      const userCanBring = user.can_bring;
                      if (userCanBring) {
                        const presets = ["drinks", "dessert", "salad", "main_dish", "snacks", "sides", "utensils"] as const;
                        for (const key of presets) {
                          if (userCanBring[key] && !foods.includes(key)) profileFoods.push(key);
                        }
                        for (const c of userCanBring.custom || []) {
                          if (!foods.includes(c) && !profileFoods.includes(c)) profileFoods.push(c);
                        }
                      }
                      const knownFoods = ["none", ...foods, ...profileFoods];

                      return (
                        <React.Fragment key={userId}>
                        <tr
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {!isPastMeal && (
                            <td style={{ padding: "12px 4px 12px 12px" }}>
                              {isHost && (
                                <button
                                  type="button"
                                  className="remove-btn"
                                  onClick={() => removeParticipant(userId)}
                                  title="Remove from meal"
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                    color: "white",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    lineHeight: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  −
                                </button>
                              )}
                            </td>
                          )}
                          <td style={{ padding: "12px", fontWeight: 600, color: "#374151", textAlign: "center" }}>
                            {onViewProfile ? (
                              <ClickableUserName
                                userId={userId}
                                firstName={user.first_name}
                                lastName={user.last_name}
                                onClick={onViewProfile}
                                style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset", textAlign: "center" }}
                              />
                            ) : (
                              <>{user.first_name} {user.last_name}</>
                            )}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {(() => {
                              const selectValue = knownFoods.includes(participant.food) ? participant.food : "__other__";
                              const canEdit = !isPastMeal && (isHost || userId === currentUserNumericId);
                              return (
                                <select
                                  value={selectValue}
                                  onChange={(e) => {
                                    if (e.target.value === "__other__") setFoodForParticipant(userId, "other");
                                    else setFoodForParticipant(userId, e.target.value);
                                  }}
                                  disabled={!canEdit}
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
                                    <option key={f} value={f}>{formatFood(f)}</option>
                                  ))}
                                  {profileFoods.map((f) => (
                                    <option key={`p-${f}`} value={f}>{formatFood(f)}</option>
                                  ))}
                                  <option value="__other__">✏️ Other</option>
                                </select>
                              );
                            })()}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <input
                              type="text"
                              value={participant.specifics}
                              onChange={(e) => setSpecificsForParticipant(userId, e.target.value)}
                              disabled={isPastMeal || (!isHost && userId !== currentUserNumericId)}
                              placeholder="e.g. Chicken, Rice, etc"
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
                                  className="role-btn"
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
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {participant.role === "host" ? "🏠 Host" : "Guest"}
                                </button>
                              );
                            })()}
                          </td>
                          {!isPastMeal && (
                            <td style={{ padding: "12px" }}>
                              {(isHost || userId === currentUserNumericId) && !invitedMode && (
                                <button
                                  type="button"
                                  className="add-item-btn"
                                  onClick={() => addAdditionalItem(userId)}
                                  style={{
                                    padding: "6px 14px",
                                    borderRadius: 20,
                                    border: "none",
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    color: "white",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  }}
                                >
                                  Add Item
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                        {(participant.additional_items || []).map((item, idx) => {
                          const canEditItem = !isPastMeal && (isHost || userId === currentUserNumericId) && !invitedMode;
                          const itemSelectValue = knownFoods.includes(item.food) ? item.food : "__other__";
                          return (
                            <tr
                              key={`${userId}-extra-${idx}`}
                              style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}
                            >
                              {!isPastMeal && (
                                <td style={{ padding: "6px 4px 6px 12px" }}>
                                  {canEditItem && (
                                    <button
                                      type="button"
                                      className="remove-btn"
                                      onClick={() => removeAdditionalItem(userId, idx)}
                                      title="Remove item"
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                        color: "white",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        lineHeight: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      −
                                    </button>
                                  )}
                                </td>
                              )}
                              <td style={{ padding: "6px 12px 6px 28px", color: "#9ca3af", fontSize: "0.8rem", fontWeight: 700 }}>
                                ↳ extra
                              </td>
                              <td style={{ padding: "6px 12px" }}>
                                <select
                                  value={itemSelectValue}
                                  onChange={(e) => {
                                    if (e.target.value === "__other__") setAdditionalItemFood(userId, idx, "other");
                                    else setAdditionalItemFood(userId, idx, e.target.value);
                                  }}
                                  disabled={!canEditItem}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    border: "2px solid #d1d5db",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    minWidth: 140,
                                    fontFamily: "Inter, sans-serif",
                                  }}
                                >
                                  <option value="none">{formatFood("none")}</option>
                                  {foods.map((f) => (
                                    <option key={f} value={f}>{formatFood(f)}</option>
                                  ))}
                                  {profileFoods.map((f) => (
                                    <option key={`p-${f}`} value={f}>{formatFood(f)}</option>
                                  ))}
                                  <option value="__other__">✏️ Other</option>
                                </select>
                              </td>
                              <td style={{ padding: "6px 12px" }}>
                                <input
                                  type="text"
                                  value={item.specifics}
                                  onChange={(e) => setAdditionalItemSpecifics(userId, idx, e.target.value)}
                                  disabled={!canEditItem}
                                  placeholder="e.g. Chicken, Rice, etc"
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    border: "2px solid #d1d5db",
                                    width: "100%",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    fontFamily: "Inter, sans-serif",
                                  }}
                                />
                              </td>
                              <td />
                              {!isPastMeal && <td />}
                            </tr>
                          );
                        })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Invited (pending) participants section */}
            {invitedParticipants.length > 0 && !isPastMeal && (
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
                            style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }}
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
            {currentUserId && meal.participants[currentUserId] && meal.participants[currentUserId].accepted !== true ? (
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
                  ref={messagesContainerRef}
                  style={{
                    maxHeight: 280,
                    overflowY: "auto",
                    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    border: "2px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {Object.entries(meal.messages).length === 0 ? (
                    <div style={{ color: "#9ca3af", textAlign: "center", fontWeight: 600, padding: 20 }}>
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    Object.entries(meal.messages)
                      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
                      .map(([id, msg]) => {
                      const msgUser = users.find((u) => u.id === msg.user);
                      const nameColor = getNameColor(msg.user);
                      const isMe = msg.user === currentUserId;
                      return (
                        <div
                          key={id}
                          style={{
                            marginBottom: 12,
                            padding: "10px 14px",
                            background: isMe ? "#f0fdf4" : "white",
                            borderRadius: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                            borderLeft: `3px solid ${nameColor}`,
                          }}
                        >
                          <div style={{ fontWeight: 700, color: nameColor, marginBottom: 4, fontSize: "0.85rem" }}>
                            {msgUser && onViewProfile ? (
                              <ClickableUserName
                                userId={msg.user}
                                firstName={msgUser.first_name}
                                lastName={msgUser.last_name}
                                onClick={onViewProfile}
                                style={{ color: nameColor }}
                              />
                            ) : (
                              msgUser ? `${msgUser.first_name} ${msgUser.last_name}` : msg.user
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
                  <div ref={messagesEndRef} />
                </div>
                {mealId && currentUserId && (
                  <MessageInput
                    mealId={mealId}
                    currentUserId={currentUserId}
                    participantIds={meal ? Object.keys(meal.participants) : []}
                    mealTitle={meal?.title ?? ""}
                    senderName={(() => { const me = users.find(u => u.id === currentUserId); return me ? `${me.first_name} ${me.last_name}`.trim() : "Someone"; })()}
                    onMessageSent={() => {
                    // Reload meal to show new message
                    get(ref(rtdb, `meal_events/${mealId}`)).then((snap) => {
                      if (snap.exists()) {
                        const updatedMeal = snap.val() as Meal;
                        setMeal(updatedMeal);
                        // Smooth scroll to bottom after sending a new message
                        setTimeout(() => scrollToBottomSmooth(), 100);
                      }
                    });
                  }}
                  />
                )}
              </>
            )}
          </div>
        )}

        <div className="button-bar" style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28 }}>
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
          {invitedMode && (
            <>
              <button
                onClick={onAccept}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "1rem",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Accept
              </button>
              <button
                onClick={onReject}
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
                Reject
              </button>
            </>
          )}
          {isHost && !isCreateMode && !isPastMeal && mealId && currentUserId && (
            <button
              type="button"
              onClick={() => {
                const url = generateMealInviteUrl(mealId);
                navigator.clipboard.writeText(url).then(() => {
                  setCopiedInvite(true);
                  setTimeout(() => setCopiedInvite(false), 2000);
                }).catch(() => {});
              }}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: copiedInvite
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: copiedInvite
                  ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                  : "0 4px 12px rgba(99, 102, 241, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {copiedInvite ? "✓ Link Copied!" : "🔗 Copy Invite Link"}
            </button>
          )}
          {/* Leave Meal button - for any participant (not just hosts) */}
          {!isCreateMode && !isPastMeal && currentUserId && meal.participants[currentUserId] && meal.participants[currentUserId].accepted === true && (() => {
            const isLastHost = meal.participants[currentUserId]?.role === "host" &&
              Object.entries(meal.participants).filter(([id, p]) => id !== currentUserId && p.role === "host" && p.accepted === true).length === 0;
            return (
              <button
                onClick={leaveMeal}
                disabled={isLastHost}
                title={isLastHost ? "You are the only host — assign another host before leaving" : undefined}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: isLastHost
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  color: "white",
                  cursor: isLastHost ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  fontSize: "1rem",
                  boxShadow: isLastHost ? "none" : "0 4px 12px rgba(249, 115, 22, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Leave Meal
              </button>
            );
          })()}
          {/* Non-host save button */}
          {!isHost && !isCreateMode && !isPastMeal && !invitedMode && currentUserId && meal.participants[currentUserId]?.accepted === true && (
            (() => {
              const isDisabled = saving || !hasChanges;
              return (
                <button
                  onClick={handleNonHostSave}
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
                  }}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              );
            })()
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
                // For create mode: require title, host apartment, datetime, and at least one host participant
                const createModeInvalid = isCreateMode && (
                  !meal.title.trim() ||
                  !meal.host_apartment_id ||
                  !meal.datetime ||
                  !Object.values(meal.participants).some((p) => p.role === "host" && p.accepted === true)
                );
                const isDisabled = saving || createModeInvalid || (!isCreateMode && (isPastMeal || !hasChanges));
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
  participantIds,
  mealTitle,
  senderName,
  onMessageSent,
}: {
  mealId: string;
  currentUserId: string;
  participantIds: string[];
  mealTitle: string;
  senderName: string;
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

      await set(ref(rtdb, `meal_events/${mealId}/messages/${id}`), {
        user: currentUserId,
        text: text.trim(),
        timestamp,
      });

      // Notify all other participants
      const others = participantIds.filter((id) => id !== currentUserId);
      notifyUsers(others, {
        title: `New message in "${mealTitle}"`,
        body: `${senderName}: ${text.trim().slice(0, 80)}`,
        tag: `meal-message-${mealId}`,
        data: { tab: "upcoming" },
      }, "meal_messages");

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
