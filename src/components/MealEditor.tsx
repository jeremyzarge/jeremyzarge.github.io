import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, get, set, remove, onValue } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { fetchAllUsers, fetchAllApartments, fetchAddressSuggestions, getAllergenCounts, formatFood, buildCalendarLinks } from "../utils";
import { generateMealInviteUrl } from "../inviteService";
import { createMeal } from "../index";
import { createOTEvent, updateOTEvent, requestOTNourishment, cancelOTEvent, cancelOTReservation, isOneTableAuthError, OT_RECONNECT_MESSAGE, hostCancelReservation } from "../onetableService";
import type { User } from "firebase/auth";
import type { Meal, MealParticipant, UserWithId, Apartment, FoodRequestItem } from "../types";
import ClickableUserName from "./ClickableUserName";
import { notifyUsers, logEvent } from "../notifications";
import FoodRequestsModal from "./FoodRequestsModal";
import ViewFoodRequestsModal from "./ViewFoodRequestsModal";
import ManageParticipantsModal from "./ManageParticipantsModal";
import InfoTooltip from "./InfoTooltip";

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

/**
 * Normalize raw `food_requests` data from RTDB into a clean array of FoodRequestItem.
 * Firebase drops empty arrays on write, so a saved `food_requests: []` can come back as
 * `undefined` — and a sparse array can come back as a plain object keyed by index.
 */
function sanitizeFoodRequests(raw: unknown): FoodRequestItem[] {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : Object.values(raw as Record<string, unknown>);
  return (arr as any[]).filter(Boolean).map((it) => ({
    food: it?.food ?? "",
    quantity: typeof it?.quantity === "number" ? it.quantity : 0,
  } as FoodRequestItem));
}


/** Returns true if userId already has a different OT-synced meal on the same Friday. */
async function hasOTMealThisWeek(userId: string, fridayDate: Date, excludeMealId?: string): Promise<boolean> {
  const snap = await get(ref(rtdb, "meal_events"));
  if (!snap.exists()) return false;
  const fridayStr = fridayDate.toDateString();
  for (const [id, data] of Object.entries(snap.val() as Record<string, any>)) {
    if (id === excludeMealId) continue;
    if (!data.onetable_event_id) continue;
    if (!data.participants?.[userId]) continue;
    if (!data.datetime) continue;
    if (new Date(data.datetime).toDateString() === fridayStr) return true;
  }
  return false;
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
  const [activeTab, setActiveTab] = useState<"info" | "participants" | "messages">(isCreateMode ? "info" : "participants");
  const [showManageFoodRequests, setShowManageFoodRequests] = useState(false);
  const [showViewFoodRequests, setShowViewFoodRequests] = useState(false);
  const [showManageParticipants, setShowManageParticipants] = useState(false);

  const [copiedInvite, setCopiedInvite] = useState(false);

  // OneTable sync
  const [otSyncEnabled, setOtSyncEnabled] = useState(false);
  const [otDescription, setOtDescription] = useState("");
  const [otNourishment, setOtNourishment] = useState(true);
  const [otToken, setOtToken] = useState<string | null>(null);
  const [otLat, setOtLat] = useState(0);
  const [otLng, setOtLng] = useState(0);
  const [otGeocoding, setOtGeocoding] = useState(false);
  const [otUnsyncing, setOtUnsyncing] = useState(false);
  const [otSyncing, setOtSyncing] = useState(false);
  const [otWeekConflict, setOtWeekConflict] = useState(false);

  // OT date-based eligibility (computed from meal.datetime)
  const otDateChecks = useMemo(() => {
    const dt = meal?.datetime;
    if (!dt) return { isFriday: false, canSync: false, canNourish: false };
    const mealDate = new Date(dt);
    const isFriday = mealDate.getDay() === 5;
    const tuesday = new Date(mealDate);
    tuesday.setDate(mealDate.getDate() - 3);
    tuesday.setHours(23, 59, 59, 999);
    const wednesday = new Date(mealDate);
    wednesday.setDate(mealDate.getDate() - 2);
    wednesday.setHours(23, 59, 59, 999);
    const now = new Date();
    return { isFriday, canSync: now <= tuesday, canNourish: now <= wednesday };
  }, [meal?.datetime]);

  // Check for OT week conflict whenever the date changes
  useEffect(() => {
    if (!currentUserId || !meal?.datetime || !otDateChecks.isFriday) {
      setOtWeekConflict(false);
      return;
    }
    hasOTMealThisWeek(currentUserId, new Date(meal.datetime), mealId ?? undefined)
      .then(setOtWeekConflict)
      .catch(() => setOtWeekConflict(false));
  }, [meal?.datetime, currentUserId, mealId, otDateChecks.isFriday]);

  // True only when all OT conditions are satisfied
  const otSyncEligible = !!meal?.datetime && otDateChecks.isFriday && otDateChecks.canSync && !otWeekConflict;

  // Uncheck sync if conditions are no longer met
  useEffect(() => {
    if (!otSyncEligible) setOtSyncEnabled(false);
  }, [otSyncEligible]);

  // Human-readable reason when not eligible (null when no date set yet)
  const otIneligibleReason = !meal?.datetime ? null
    : !otDateChecks.isFriday ? "Only available for Friday night meals"
    : !otDateChecks.canSync ? "Past the Tuesday deadline for this meal"
    : otWeekConflict ? "You already have a OneTable meal this week"
    : null;

  // Searchable combobox for host apartment selection
  const [aptSearch, setAptSearch] = useState("");
  const [aptDropdownOpen, setAptDropdownOpen] = useState(false);
  const aptComboRef = useRef<HTMLDivElement>(null);

  // Address autocomplete for custom location field
  const [locationBase, setLocationBase] = useState("");
  const [locationUnit, setLocationUnit] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const locationComboRef = useRef<HTMLDivElement>(null);
  const locationInitialized = useRef(false);

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

        // Load current user's OneTable token for the sync option
        if (currentUserId) {
          const otSnap = await get(ref(rtdb, `private/${currentUserId}/onetable_token`));
          if (otSnap.exists()) setOtToken(otSnap.val());
        }

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
        message_reads: mealData.message_reads || {},
        onetable_event_id: mealData.onetable_event_id,
        onetable_event_uuid: mealData.onetable_event_uuid,
        onetable_description: mealData.onetable_description,
        onetable_nourishment: mealData.onetable_nourishment,
        food_requests: sanitizeFoodRequests(mealData.food_requests),
        food_requests_enforced: !!mealData.food_requests_enforced,
      };

      setMeal(normalizedMeal);
      setOriginalMeal(structuredClone(normalizedMeal)); // Track original state

      // Load current user's OT token for sync option
      if (currentUserId) {
        const otSnap = await get(ref(rtdb, `private/${currentUserId}/onetable_token`));
        if (otSnap.exists()) setOtToken(otSnap.val());
      }

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
        message_reads: mealData.message_reads || {},
        onetable_event_id: mealData.onetable_event_id,
        onetable_event_uuid: mealData.onetable_event_uuid,
        onetable_description: mealData.onetable_description,
        onetable_nourishment: mealData.onetable_nourishment,
        food_requests: sanitizeFoodRequests(mealData.food_requests),
        food_requests_enforced: !!mealData.food_requests_enforced,
      };

      setMeal(normalizedMeal);
    });

    return () => unsubscribe();
  }, [mealId, isCreateMode]);

  // Close combobox dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (aptComboRef.current && !aptComboRef.current.contains(e.target as Node)) {
        setAptDropdownOpen(false);
      }
      if (locationComboRef.current && !locationComboRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Initialize locationBase from meal.location once when meal first loads
  useEffect(() => {
    if (meal && !locationInitialized.current) {
      locationInitialized.current = true;
      setLocationBase(meal.location || "");
      if (meal.location) setShowCustomLocation(true);
    }
  }, [meal]);

  // Debounced address autocomplete for custom location field
  useEffect(() => {
    const q = locationBase.trim();
    if (!q || q.length < 3) { setLocationSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const labels = await fetchAddressSuggestions(q);
        setLocationSuggestions(labels);
        if (labels.length > 0) setLocationDropdownOpen(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timeout);
  }, [locationBase]);

  // Jump to bottom instantly when switching to messages tab
  useEffect(() => {
    if (activeTab === "messages") {
      // Small delay to let DOM render, then jump instantly (no animation)
      setTimeout(() => jumpToBottom(), 50);
    }
  }, [activeTab, jumpToBottom]);

  // Unread count for the Messages tab badge — messages from others since this user last opened the tab
  const unreadMessageCount = useMemo(() => {
    if (!meal || !currentUserId) return 0;
    const lastRead = meal.message_reads?.[currentUserId] ?? 0;
    return Object.values(meal.messages).filter(
      (m) => m.timestamp > lastRead && m.user !== currentUserId
    ).length;
  }, [meal, currentUserId]);

  // Mark messages as read while the Messages tab is open (on open, and as new ones arrive)
  useEffect(() => {
    if (activeTab !== "messages" || !mealId || !currentUserId || unreadMessageCount === 0) return;
    set(ref(rtdb, `meal_events/${mealId}/message_reads/${currentUserId}`), Date.now());
  }, [activeTab, mealId, currentUserId, unreadMessageCount]);

  // Auto-geocode the meal address whenever OT sync is on and the apartment/location changes
  useEffect(() => {
    if (!otSyncEnabled || !meal) return;
    const address = meal.location?.trim() ||
      apartments.find((a) => a.id === meal.host_apartment_id)?.address?.trim();
    if (!address) return;
    setOtLat(0);
    setOtLng(0);
    setOtGeocoding(true);
    // Nominatim (OpenStreetMap): free, no API key, covers anywhere in the US
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&countrycodes=us&limit=1`,
      { headers: { Accept: "application/json" } }
    )
      .then((r) => r.json())
      .then((data) => {
        const f = data?.[0];
        if (f) {
          setOtLng(parseFloat(f.lon));
          setOtLat(parseFloat(f.lat));
        }
      })
      .catch(() => {})
      .finally(() => setOtGeocoding(false));
  }, [otSyncEnabled, meal?.host_apartment_id, meal?.location]);

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

  // Whether the host has explicitly turned on enforcement for this meal's food requests.
  const foodRequestsEnforced = useMemo(() => {
    return !!meal?.food_requests_enforced && (meal?.food_requests?.length ?? 0) > 0;
  }, [meal?.food_requests, meal?.food_requests_enforced]);

  // Tally of current food selections per food key, so we know how much of each
  // requested item's quantity is already spoken for.
  const foodConsumption = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};
    if (!meal) return counts;
    for (const [userId, p] of Object.entries(meal.participants)) {
      const claims: string[] = [p.food, ...(p.additional_items ?? []).map((it) => it.food)];
      for (const food of claims) {
        if (food === "none" || food === "other") continue;
        counts[food] ??= {};
        counts[food][userId] = (counts[food][userId] ?? 0) + 1;
      }
    }
    return counts;
  }, [meal]);

  const foodConsumptionCount = useCallback((food: string, excludeUserId: string): number => {
    const perUser = foodConsumption[food] ?? {};
    return Object.entries(perUser).reduce((s, [uid, c]) => (uid === excludeUserId ? s : s + c), 0);
  }, [foodConsumption]);

  /**
   * The list of food keys a participant may currently pick from, when food requests are
   * enforced: any requested item with remaining quantity > 0, plus "none".
   * Only meaningful when `foodRequestsEnforced` is true.
   */
  const getAllowedFoodsForParticipant = useCallback((userId: string): string[] => {
    if (!meal) return ["none"];
    const items = meal.food_requests ?? [];
    const allowed = new Set<string>(["none"]);
    for (const item of items) {
      const remaining = item.quantity - foodConsumptionCount(item.food, userId);
      if (remaining > 0) allowed.add(item.food);
    }
    return Array.from(allowed);
  }, [meal, foodConsumptionCount]);

  /** Whether a participant currently has any real (non-"none") food option — if not, "Other" opens up as a fallback. */
  const hasRealFoodOptions = useCallback((userId: string): boolean => {
    return getAllowedFoodsForParticipant(userId).some((f) => f !== "none");
  }, [getAllowedFoodsForParticipant]);

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
        // Cancel OneTable reservation if the user has one
        // Read fresh from DB in case local state is stale
        const freshMealSnap = await get(ref(rtdb, `meal_events/${mealId}/onetable_reservations`));
        const freshReservations = freshMealSnap.exists() ? freshMealSnap.val() : {};
        const reservationId = freshReservations[currentUserId] ?? meal.onetable_reservations?.[currentUserId];

        if (reservationId) {
          const tokenSnap = await get(ref(rtdb, `private/${currentUserId}/onetable_token`));
          if (tokenSnap.exists()) {
            try {
              await cancelOTReservation(tokenSnap.val(), reservationId);
              await remove(ref(rtdb, `meal_events/${mealId}/onetable_reservations/${currentUserId}`));
            } catch (err) {
              if (isOneTableAuthError(err)) alert(OT_RECONNECT_MESSAGE);
              else throw err;
            }
          }
        }

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
   * Set food for a participant (hosts can edit all, guests can edit their own)
   */
  const setFoodForParticipant = (userId: string, food: string) => {
    if (isPastMeal || !meal) return; // Lock past meals
    // Allow if user is host OR if user is editing their own
    const canEdit = isHost || userId === currentUserNumericId;
    if (!canEdit) return;
    if (foodRequestsEnforced && food !== "none") {
      if (food === "other") {
        if (hasRealFoodOptions(userId)) return; // real options exist — must pick from those instead
      } else if (!getAllowedFoodsForParticipant(userId).includes(food)) {
        return;
      }
    }
    if (!meal.participants[userId]) return;

    const apply = (m: Meal): Meal => {
      const participant = m.participants[userId];
      if (!participant) return m;
      return { ...m, participants: { ...m.participants, [userId]: { ...participant, food } } };
    };
    setMeal((prev) => (prev ? apply(prev) : prev));
  };

  /**
   * Set specifics for a participant (hosts can edit all, guests can edit their own)
   */
  const setSpecificsForParticipant = (userId: string, specifics: string) => {
    if (isPastMeal || !meal) return; // Lock past meals
    // Allow if user is host OR if user is editing their own
    const canEdit = isHost || userId === currentUserNumericId;
    if (!canEdit) return;
    if (!meal.participants[userId]) return;

    const apply = (m: Meal): Meal => {
      const participant = m.participants[userId];
      if (!participant) return m;
      return { ...m, participants: { ...m.participants, [userId]: { ...participant, specifics } } };
    };
    setMeal((prev) => (prev ? apply(prev) : prev));
  };

  /** Add an extra item row for a participant */
  const addAdditionalItem = (userId: string) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    const p = meal.participants[userId];
    if (!p) return;
    const additional_items = [...(p.additional_items || []), { food: "none", specifics: "" }];

    const apply = (m: Meal): Meal => {
      const mp = m.participants[userId];
      if (!mp) return m;
      return { ...m, participants: { ...m.participants, [userId]: { ...mp, additional_items } } };
    };
    setMeal((prev) => (prev ? apply(prev) : prev));
  };

  /** Remove an extra item row for a participant */
  const removeAdditionalItem = (userId: string, index: number) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    const p = meal.participants[userId];
    if (!p) return;
    const additional_items = (p.additional_items || []).filter((_, i) => i !== index);

    const apply = (m: Meal): Meal => {
      const mp = m.participants[userId];
      if (!mp) return m;
      return { ...m, participants: { ...m.participants, [userId]: { ...mp, additional_items } } };
    };
    setMeal((prev) => (prev ? apply(prev) : prev));
  };

  /** Set food for an additional item */
  const setAdditionalItemFood = (userId: string, index: number, food: string) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    if (foodRequestsEnforced && food !== "none") {
      if (food === "other") {
        if (hasRealFoodOptions(userId)) return;
      } else if (!getAllowedFoodsForParticipant(userId).includes(food)) {
        return;
      }
    }
    const p = meal.participants[userId];
    if (!p) return;
    const additional_items = [...(p.additional_items || [])];
    additional_items[index] = { ...additional_items[index], food };

    const apply = (m: Meal): Meal => {
      const mp = m.participants[userId];
      if (!mp) return m;
      return { ...m, participants: { ...m.participants, [userId]: { ...mp, additional_items } } };
    };
    setMeal((prev) => (prev ? apply(prev) : prev));
  };

  /** Set specifics for an additional item */
  const setAdditionalItemSpecifics = (userId: string, index: number, specifics: string) => {
    if (isPastMeal || !meal) return;
    if (!isHost && userId !== currentUserNumericId) return;
    const p = meal.participants[userId];
    if (!p) return;
    const additional_items = [...(p.additional_items || [])];
    additional_items[index] = { ...additional_items[index], specifics };

    const apply = (m: Meal): Meal => {
      const mp = m.participants[userId];
      if (!mp) return m;
      return { ...m, participants: { ...m.participants, [userId]: { ...mp, additional_items } } };
    };
    setMeal((prev) => (prev ? apply(prev) : prev));
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
        const newMealId = await createMeal(meal);
        logEvent("meal_created", { mealId: newMealId, userId: currentUserId, participantCount });

        // OneTable sync
        const otWeekConflictCheck = (otSyncEnabled && currentUserId && meal.datetime)
          ? await hasOTMealThisWeek(currentUserId, new Date(meal.datetime), newMealId)
          : false;
        if (otSyncEnabled && otToken && otLat && otLng && otDateChecks.isFriday && otDateChecks.canSync && !otWeekConflictCheck) {
          try {
            const aptAddress = apartments.find((a) => a.id === meal.host_apartment_id)?.address || "";
            const otResult = await createOTEvent(otToken, {
              full_address: meal.location?.trim() || aptAddress,
              lat: otLat,
              lng: otLng,
            }, meal, otDescription);
            if (otResult) {
              await set(ref(rtdb, `meal_events/${newMealId}/onetable_event_id`), otResult.eventId);
              await set(ref(rtdb, `meal_events/${newMealId}/onetable_event_uuid`), otResult.eventUuid);
              await set(ref(rtdb, `meal_events/${newMealId}/onetable_description`), otDescription);
              if (otNourishment && otDateChecks.canNourish) {
                await requestOTNourishment(otToken, otResult.eventId);
                await set(ref(rtdb, `meal_events/${newMealId}/onetable_nourishment`), true);
              }
            }
          } catch (otErr: any) {
            // Non-blocking — meal was created, just warn about OneTable
            alert(
              isOneTableAuthError(otErr)
                ? `Meal created, but OneTable sync failed: ${OT_RECONNECT_MESSAGE}`
                : `Meal created, but OneTable sync failed: ${otErr.message}`
            );
          }
        }

        alert("Meal created!");
        // Notify all invited participants (everyone except the creator)
        const invitedIds = Object.keys(newParticipants).filter((id) => id !== currentUserId);
        notifyUsers(invitedIds, {
          title: "New meal invitation 🍽️",
          body: `${myName} invited you to "${meal.title}"`,
          tag: `meal-invite-new`,
          data: { tab: "upcoming", mealId: newMealId, invited: "true" },
        }, "meal_food");
        if (invitedIds.length > 0) {
          logEvent("meal_invite_sent", { mealId: newMealId, userId: currentUserId, invitedCount: invitedIds.length });
        }
        if (onCreated) onCreated();
        if (onClose) onClose();
      } else {
        const editId = mealId!;
        // Firebase rejects undefined values — strip them before saving
        const mealToSave = Object.fromEntries(
          Object.entries(meal).filter(([, v]) => v !== undefined)
        ) as Meal;
        await set(ref(rtdb, `meal_events/${editId}`), mealToSave);
        logEvent("meal_updated", { mealId: editId, userId: currentUserId });
        setOriginalMeal(structuredClone(meal));
        alert("Meal updated!");

        // Newly added participants
        const addedIds = Object.keys(newParticipants).filter((id) => !prevParticipants[id] && id !== currentUserId);
        notifyUsers(addedIds, {
          title: "New meal invitation 🍽️",
          body: `${myName} invited you to "${meal.title}"`,
          tag: `meal-invite-${editId}`,
          data: { tab: "upcoming", mealId: editId, invited: "true" },
        }, "meal_food");
        if (addedIds.length > 0) {
          logEvent("meal_invite_sent", { mealId: editId, userId: currentUserId, invitedCount: addedIds.length });
        }

        // Removed participants — cancel their OneTable reservations if any
        const removedIds = Object.keys(prevParticipants).filter((id) => !newParticipants[id] && id !== currentUserId);
        for (const removedId of removedIds) {
          const reservationId = meal.onetable_reservations?.[removedId] ?? (originalMeal as any)?.onetable_reservations?.[removedId];
          if (reservationId) {
            try {
              await hostCancelReservation(editId, removedId, reservationId);
            } catch (err) {
              // Don't let this abort the rest of the save (notifications, etc).
              console.error("[OT] Failed to cancel removed participant's reservation:", err);
            }
          }
        }
        notifyUsers(removedIds, {
          title: "Removed from meal",
          body: `You were removed from "${meal.title}"`,
          tag: `meal-removed-${editId}`,
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
            tag: `meal-time-${editId}`,
            data: { tab: "upcoming", mealId: editId },
          }, "meal_updates");
        }

        // Sync changes to OneTable if the event is linked and time/location/title changed
        if (
          meal.onetable_event_id &&
          otToken &&
          meal.onetable_description &&
          originalMeal &&
          (meal.datetime !== originalMeal.datetime ||
            meal.location !== originalMeal.location ||
            meal.host_apartment_id !== originalMeal.host_apartment_id ||
            meal.title !== originalMeal.title)
        ) {
          const aptAddress = apartments.find((a) => a.id === meal.host_apartment_id)?.address || "";
          updateOTEvent(
            otToken,
            meal.onetable_event_id,
            { full_address: meal.location?.trim() || aptAddress, lat: otLat, lng: otLng },
            meal,
            meal.onetable_description
          ).catch((err) => {
            if (isOneTableAuthError(err)) alert(OT_RECONNECT_MESSAGE);
            else console.error("[OT] updateEvent failed silently:", err);
          });
        }

        if (originalMeal && meal.location !== originalMeal.location) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal location updated 📍",
            body: `The location for "${meal.title}" has changed`,
            tag: `meal-location-${editId}`,
            data: { tab: "upcoming", mealId: editId },
          }, "meal_updates");
        }

        if (originalMeal && meal.host_apartment_id !== originalMeal.host_apartment_id) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal location updated 📍",
            body: `The host apartment for "${meal.title}" has changed`,
            tag: `meal-apt-${editId}`,
            data: { tab: "upcoming", mealId: editId },
          }, "meal_updates");
        }

        if (originalMeal && meal.instructions !== originalMeal.instructions && meal.instructions.trim()) {
          notifyUsers(otherAcceptedIds, {
            title: "Meal instructions updated",
            body: `Instructions for "${meal.title}" were updated`,
            tag: `meal-instructions-${editId}`,
            data: { tab: "upcoming", mealId: editId },
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
                tag: `meal-role-${editId}-${uid}`,
                data: { tab: "upcoming", mealId: editId },
              }, "meal_food");
            }

            // Food assignment changed
            if (p.food !== prev.food) {
              if (p.food === "none") {
                notifyUsers([uid], {
                  title: "Food assignment removed",
                  body: `Your food assignment for "${meal.title}" was removed`,
                  tag: `meal-food-${editId}-${uid}`,
                  data: { tab: "upcoming", mealId: editId },
                }, "meal_food");
              } else {
                notifyUsers([uid], {
                  title: "Food assignment updated",
                  body: `Your food for "${meal.title}" was set to ${p.food}`,
                  tag: `meal-food-${editId}-${uid}`,
                  data: { tab: "upcoming", mealId: editId },
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
                tag: `meal-item-removed-${editId}-${uid}`,
                data: { tab: "upcoming", mealId: editId },
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
   * Apply participant changes from the Manage Participants modal.
   * In create mode there's no meal in the database yet, so changes are just staged
   * locally (picked up by the eventual Create Meal save). For an existing meal, this
   * writes straight to the database — invites, kicks, and role changes take effect
   * immediately rather than waiting on the overall meal Save.
   */
  const handleParticipantsSave = async (newParticipants: Record<string, MealParticipant>) => {
    if (!meal) return;

    if (isCreateMode || !mealId) {
      setMeal((prev) => (prev ? { ...prev, participants: newParticipants } : prev));
      return;
    }

    const prevParticipants = meal.participants;

    try {
      await set(ref(rtdb, `meal_events/${mealId}/participants`), newParticipants);
    } catch (err: any) {
      console.error(err);
      alert("Failed to save participant changes: " + err.message);
      throw err;
    }

    setOriginalMeal((prev) => (prev ? { ...prev, participants: structuredClone(newParticipants) } : prev));

    const myName = (() => {
      const me = users.find((u) => u.id === currentUserId);
      return me ? `${me.first_name} ${me.last_name}`.trim() : "The host";
    })();

    // Newly invited participants
    const addedIds = Object.keys(newParticipants).filter((id) => !prevParticipants[id] && id !== currentUserId);
    notifyUsers(addedIds, {
      title: "New meal invitation 🍽️",
      body: `${myName} invited you to "${meal.title}"`,
      tag: `meal-invite-${mealId}`,
      data: { tab: "upcoming", mealId, invited: "true" },
    }, "meal_food");
    if (addedIds.length > 0) {
      logEvent("meal_invite_sent", { mealId, userId: currentUserId, invitedCount: addedIds.length });
    }

    // Removed participants — cancel their OneTable reservations if any, then notify
    const removedIds = Object.keys(prevParticipants).filter((id) => !newParticipants[id] && id !== currentUserId);
    for (const removedId of removedIds) {
      const reservationId = meal.onetable_reservations?.[removedId];
      if (reservationId) {
        try {
          await hostCancelReservation(mealId, removedId, reservationId);
        } catch (err) {
          console.error("[OT] Failed to cancel removed participant's reservation:", err);
        }
      }
    }
    notifyUsers(removedIds, {
      title: "Removed from meal",
      body: `You were removed from "${meal.title}"`,
      tag: `meal-removed-${mealId}`,
      data: { tab: "upcoming" },
    }, "meal_food");

    // Role changes
    for (const [uid, p] of Object.entries(newParticipants)) {
      if (uid === currentUserId) continue;
      const prev = prevParticipants[uid];
      if (prev && p.role !== prev.role) {
        notifyUsers([uid], {
          title: "Your role was changed",
          body: `You are now a ${p.role} for "${meal.title}"`,
          tag: `meal-role-${mealId}-${uid}`,
          data: { tab: "upcoming", mealId },
        }, "meal_food");
      }
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
        data: { tab: "upcoming", mealId: mealId ?? "" },
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
      // Cancel OneTable event if linked
      if (meal.onetable_event_id && currentUserId) {
        const hostTokenSnap = await get(ref(rtdb, `private/${currentUserId}/onetable_token`));
        if (hostTokenSnap.exists()) {
          try {
            await cancelOTEvent(hostTokenSnap.val(), meal.onetable_event_id);
          } catch (err) {
            if (isOneTableAuthError(err)) alert(OT_RECONNECT_MESSAGE);
            else throw err;
          }
        }
      }

      // Notify all other participants before deleting
      const otherIds = Object.keys(meal.participants).filter((id) => id !== currentUserId);
      notifyUsers(otherIds, {
        title: "Meal cancelled",
        body: `"${meal.title}" has been cancelled`,
        tag: `meal-deleted-${mealId}`,
        data: { tab: "upcoming" },
      }, "meal_deleted");

      await remove(ref(rtdb, `meal_events/${mealId}`));
      logEvent("meal_deleted", { mealId, userId: currentUserId });
      alert("Meal deleted!");
      if (onClose) onClose();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete meal: " + err.message);
    }
  };

  /** Remove the OT link from this meal without cancelling the OT event. */
  const handleUnsync = async () => {
    if (!mealId || !window.confirm("Unsync from OneTable? The OneTable event will remain, but future changes here won't affect it.")) return;
    setOtUnsyncing(true);
    try {
      await remove(ref(rtdb, `meal_events/${mealId}/onetable_event_id`));
      await remove(ref(rtdb, `meal_events/${mealId}/onetable_event_uuid`));
      await remove(ref(rtdb, `meal_events/${mealId}/onetable_nourishment`));
    } catch (err: any) {
      alert("Failed to unsync: " + err.message);
    } finally {
      setOtUnsyncing(false);
    }
  };

  /** Create a new OT event and link it to this existing meal. */
  const handleSyncToOT = async () => {
    if (!mealId || !meal || !otToken || !otLat || !otLng) return;
    if (!otDateChecks.isFriday) { alert("OneTable events must be on Friday night."); return; }
    if (!otDateChecks.canSync) { alert("The deadline to create a OneTable event (Tuesday before the meal) has passed."); return; }
    if (currentUserId && meal.datetime) {
      const conflict = await hasOTMealThisWeek(currentUserId, new Date(meal.datetime), mealId ?? undefined);
      if (conflict) { alert("You already have a OneTable meal this week. Only one per week is allowed."); return; }
    }
    setOtSyncing(true);
    try {
      const aptAddress = apartments.find((a) => a.id === meal.host_apartment_id)?.address || "";
      const otResult = await createOTEvent(otToken, {
        full_address: meal.location?.trim() || aptAddress,
        lat: otLat,
        lng: otLng,
      }, meal, otDescription);
      if (otResult) {
        await set(ref(rtdb, `meal_events/${mealId}/onetable_event_id`), otResult.eventId);
        await set(ref(rtdb, `meal_events/${mealId}/onetable_event_uuid`), otResult.eventUuid);
        await set(ref(rtdb, `meal_events/${mealId}/onetable_description`), otDescription);
        if (otNourishment) {
          await requestOTNourishment(otToken, otResult.eventId);
          await set(ref(rtdb, `meal_events/${mealId}/onetable_nourishment`), true);
        }
        setOtSyncEnabled(false);
        setOtDescription("");
        setOtNourishment(false);
      }
    } catch (err: any) {
      alert(isOneTableAuthError(err) ? OT_RECONNECT_MESSAGE : "OneTable sync failed: " + err.message);
    } finally {
      setOtSyncing(false);
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

  // Apartments filtered by search text, user's own apartment first
  const filteredApartments = useMemo(() => {
    const q = aptSearch.toLowerCase();
    const list = apartments.filter((a) => !q || `${a.name} ${a.address}`.toLowerCase().includes(q));
    const ownAptId = users.find((u) => u.id === currentUserId)?.apartment || "";
    return list.sort((a, b) => {
      if (a.id === ownAptId) return -1;
      if (b.id === ownAptId) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [apartments, aptSearch, users, currentUserId]);

  // Get participants with user info
  const participantsWithInfo = useMemo(() => {
    if (!meal) return [];
    return Object.entries(meal.participants).map(([userId, participant]) => {
      const user = users.find((u) => u.id === userId);
      return { userId, participant, user };
    });
  }, [meal, users]);

  // Accepted participants — pending invites are managed in the Manage Participants modal (host-only)
  const acceptedParticipants = useMemo(() => {
    return participantsWithInfo.filter(({ participant }) => participant.accepted === true);
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
        className="modal-content no-content-padding"
        style={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          maxWidth: 950,
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #059669 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          position: "relative",
        }}
      >
        {/* Scrollable body */}
        <div className="modal-scroll-body" style={{ padding: 32, overflowY: "auto", flex: 1, position: "relative" }}>

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
                position: "relative",
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
              {tab === "messages" && activeTab !== "messages" && unreadMessageCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    borderRadius: 9,
                    background: "#ef4444",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                </span>
              )}
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
                {!isHost || isPastMeal ? (
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #d1d5db",
                    fontWeight: 700,
                    color: "#047857",
                    background: "#f9fafb",
                    fontSize: "1rem",
                    fontFamily: "Inter, sans-serif",
                  }}>
                    {apartments.find((a) => a.id === meal.host_apartment_id)?.name || "—"}
                  </div>
                ) : (
                  <div ref={aptComboRef} style={{ position: "relative" }}>
                    <input
                      value={aptDropdownOpen ? aptSearch : (apartments.find((a) => a.id === meal.host_apartment_id)?.name || "")}
                      onChange={(e) => { setAptSearch(e.target.value); setAptDropdownOpen(true); }}
                      onFocus={() => {
                        const apt = apartments.find((a) => a.id === meal.host_apartment_id);
                        setAptSearch(apt?.name || "");
                        setAptDropdownOpen(true);
                      }}
                      placeholder="Search for an apartment…"
                      style={{
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "2px solid #d1d5db",
                        width: "100%",
                        fontWeight: 700,
                        fontSize: "1rem",
                        fontFamily: "Inter, sans-serif",
                        color: meal.host_apartment_id ? "#047857" : "#374151",
                        boxSizing: "border-box" as const,
                      }}
                    />
                    {aptDropdownOpen && (
                      <div style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "2px solid #e5e7eb",
                        borderRadius: 12,
                        zIndex: 300,
                        maxHeight: 260,
                        overflowY: "auto",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      }}>
                        {filteredApartments.length === 0 ? (
                          <div style={{ padding: "12px 16px", color: "#9ca3af", fontSize: "0.9rem", fontWeight: 600 }}>
                            No apartments found
                          </div>
                        ) : filteredApartments.map((apt) => {
                          const isOwn = apt.id === (users.find((u) => u.id === currentUserId)?.apartment || "");
                          const isSelected = apt.id === meal.host_apartment_id;
                          return (
                            <div
                              key={apt.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setMeal((prev) => prev && { ...prev, host_apartment_id: apt.id });
                                setAptSearch(apt.name);
                                setAptDropdownOpen(false);
                              }}
                              style={{
                                padding: "12px 16px",
                                cursor: "pointer",
                                borderBottom: "1px solid #f3f4f6",
                                background: isSelected ? "#f0fdf4" : "white",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? "#f0fdf4" : "white")}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontWeight: 800, color: "#047857", fontSize: "0.95rem" }}>{apt.name}</span>
                                {isOwn && (
                                  <span style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    color: "white",
                                    padding: "2px 8px",
                                    borderRadius: 20,
                                  }}>Your Apartment</span>
                                )}
                                {isSelected && (
                                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, marginLeft: "auto" }}>✓</span>
                                )}
                              </div>
                              {apt.address && <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: 2 }}>{apt.address}</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {apartments.find((a) => a.id === meal.host_apartment_id)?.address && (
              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                  Address
                </label>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "2px solid #d1d5db",
                  fontWeight: 600,
                  color: "#374151",
                  background: "#f9fafb",
                  fontSize: "1rem",
                  fontFamily: "Inter, sans-serif",
                }}>
                  {apartments.find((a) => a.id === meal.host_apartment_id)?.address}
                </div>
              </div>
            )}

            {/* Optional custom location */}
            {isHost && !isPastMeal && (
              <div style={{ marginTop: 12 }}>
                {!showCustomLocation ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomLocation(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "Inter, sans-serif",
                      textDecoration: "underline",
                    }}
                  >
                    + Add custom location
                  </button>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <label style={{ fontWeight: 700, color: "#374151", fontSize: "0.9rem" }}>
                        📍 Custom Location <span style={{ fontWeight: 400, color: "#9ca3af" }}>(if different from host apartment)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomLocation(false);
                          setLocationBase("");
                          setLocationUnit("");
                          setLocationSuggestions([]);
                          setMeal((prev) => prev && { ...prev, location: "" });
                        }}
                        style={{ background: "none", border: "none", color: "#9ca3af", fontSize: "0.85rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                      >
                        Remove
                      </button>
                    </div>
                    <div ref={locationComboRef} style={{ position: "relative" }}>
                      <input
                        value={locationBase}
                        onChange={(e) => {
                          const base = e.target.value;
                          setLocationBase(base);
                          setMeal((prev) => prev && { ...prev, location: locationUnit.trim() ? `${base}, ${locationUnit.trim()}` : base });
                        }}
                        onFocus={() => { if (locationSuggestions.length > 0) setLocationDropdownOpen(true); }}
                        placeholder="Street address"
                        autoFocus
                        style={{
                          padding: "12px 16px",
                          borderRadius: 12,
                          border: "2px solid #d1d5db",
                          width: "100%",
                          fontWeight: 600,
                          fontSize: "1rem",
                          fontFamily: "Inter, sans-serif",
                          boxSizing: "border-box" as const,
                        }}
                      />
                      {locationDropdownOpen && locationSuggestions.length > 0 && (
                        <div style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          left: 0,
                          right: 0,
                          background: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: 12,
                          zIndex: 300,
                          maxHeight: 220,
                          overflowY: "auto",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}>
                          {locationSuggestions.map((label) => (
                            <div
                              key={label}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setLocationBase(label);
                                setMeal((prev) => prev && { ...prev, location: locationUnit.trim() ? `${label}, ${locationUnit.trim()}` : label });
                                setLocationDropdownOpen(false);
                                setLocationSuggestions([]);
                              }}
                              style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      value={locationUnit}
                      onChange={(e) => {
                        const unit = e.target.value;
                        setLocationUnit(unit);
                        setMeal((prev) => prev && { ...prev, location: unit.trim() ? `${locationBase}, ${unit.trim()}` : locationBase });
                      }}
                      placeholder="Apt / Unit (optional)"
                      style={{
                        marginTop: 8,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "2px solid #d1d5db",
                        width: "100%",
                        fontWeight: 600,
                        fontSize: "1rem",
                        fontFamily: "Inter, sans-serif",
                        boxSizing: "border-box" as const,
                      }}
                    />
                  </>
                )}
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
                  if (!isHost || isPastMeal || !!meal.onetable_event_id || !date) return;
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
                disabled={!isHost || isPastMeal || !!meal.onetable_event_id}
                placeholderText="Select date and time..."
                wrapperClassName="datepicker-full-width"
                className="datepicker-input"
              />
              {meal.onetable_event_id && !isPastMeal && (
                <div style={{ marginTop: 8, fontSize: "0.82rem", color: "#9a3412", fontWeight: 600 }}>
                  Date is locked — this meal is synced with OneTable. Unsync or delete and recreate to change the date.
                </div>
              )}
              {meal.datetime && (() => {
                const { googleUrl, icsDataUrl } = buildCalendarLinks({ ...meal, datetime: meal.datetime });
                return (
                  <div className="calendar-links-row" style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "nowrap" }}>
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="calendar-link-btn"
                      style={{
                        flex: "1 1 0",
                        minWidth: 0,
                        display: "block",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "8px 16px",
                        borderRadius: 10,
                        border: "2px solid #a78bfa",
                        background: "white",
                        color: "#5b21b6",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                      }}
                    >
                      📅 Add to Google Calendar
                    </a>
                    <a
                      href={icsDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="calendar-link-btn"
                      style={{
                        flex: "1 1 0",
                        minWidth: 0,
                        display: "block",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "8px 16px",
                        borderRadius: 10,
                        border: "2px solid #a78bfa",
                        background: "white",
                        color: "#5b21b6",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                      }}
                    >
                      📅 Add to Apple Calendar
                    </a>
                  </div>
                );
              })()}
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
                  onClick={() => {
                    navigator.clipboard.writeText(generateMealInviteUrl(mealId)).then(() => {
                      setCopiedInvite(true);
                      setTimeout(() => setCopiedInvite(false), 2000);
                    }).catch(() => {});
                  }}
                  title="Click to copy"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #d1d5db",
                    background: "#f9fafb",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    fontFamily: "monospace",
                    color: "#4f46e5",
                    wordBreak: "break-all",
                    cursor: "pointer",
                  }}
                >
                  {copiedInvite ? "✓ Copied!" : generateMealInviteUrl(mealId)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "participants" && (
          <div style={{ marginTop: 12 }}>
            {(isHost && !isPastMeal || (!isCreateMode && mealId)) && (
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {isHost && !isPastMeal && (
                  <button
                    type="button"
                    onClick={() => setShowManageParticipants(true)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    👥 Manage Participants
                  </button>
                )}
                {isHost && !isPastMeal && !isCreateMode && mealId && (
                  <button
                    type="button"
                    onClick={() => setShowManageFoodRequests(true)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    🍽️ Manage Food Requests
                  </button>
                )}
                {!isCreateMode && mealId && (meal.food_requests?.some((it) => it.quantity > 0) ?? false) && (
                  <button
                    type="button"
                    onClick={() => setShowViewFoodRequests(true)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "2px solid #fb923c",
                      background: "white",
                      color: "#ea580c",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    📋 View Food Requests
                  </button>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: "1.05rem", color: "#374151" }}>
                Participants ({acceptedParticipants.length})
              </h4>
              {!isPastMeal && (
                <InfoTooltip
                  title="Table icons"
                  items={[
                    {
                      icon: "+",
                      iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      text: "Add food item",
                    },
                    {
                      icon: "−",
                      iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      text: "Remove food item",
                    },
                  ]}
                />
              )}
            </div>

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
                      {!isPastMeal && <th style={{ width: 40, padding: "14px 12px 14px 4px" }} />}
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedParticipants.map(({ userId, participant, user }) => {
                      if (!user) return null;

                      // Profile-based food options for this participant
                      const profileFoods: string[] = [];
                      const userCanBring = user.can_bring;
                      if (userCanBring) {
                        const presets = ["drinks", "dessert", "salad", "main_dish", "snacks", "side", "utensils"] as const;
                        for (const key of presets) {
                          if (userCanBring[key] && !foods.includes(key)) profileFoods.push(key);
                        }
                        for (const c of userCanBring.custom || []) {
                          if (!foods.includes(c) && !profileFoods.includes(c)) profileFoods.push(c);
                        }
                      }
                      const knownFoods = foodRequestsEnforced
                        ? getAllowedFoodsForParticipant(userId)
                        : ["none", ...foods, ...profileFoods];

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
                          <td style={{ padding: "12px", fontWeight: 700, textAlign: "center" }}>
                            {onViewProfile ? (
                              <ClickableUserName
                                userId={userId}
                                firstName={user.first_name}
                                lastName={user.last_name}
                                onClick={onViewProfile}
                                style={{
                                  whiteSpace: "normal",
                                  overflow: "visible",
                                  textOverflow: "unset",
                                  textAlign: "center",
                                  color: participant.role === "host" ? "#2563eb" : "#374151",
                                }}
                              />
                            ) : (
                              <span style={{ color: participant.role === "host" ? "#2563eb" : "#374151" }}>
                                {user.first_name} {user.last_name}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {(() => {
                              const selectValue = knownFoods.includes(participant.food) ? participant.food : "__other__";
                              const canEdit = !isPastMeal && (isHost || userId === currentUserNumericId);
                              const showOther = !foodRequestsEnforced || hasRealFoodOptions(userId) === false;
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
                                  {knownFoods.map((f) => (
                                    <option key={f} value={f}>{formatFood(f)}</option>
                                  ))}
                                  {showOther && <option value="__other__">✏️ Other</option>}
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
                          {!isPastMeal && (
                            <td style={{ padding: "12px 12px 12px 4px", textAlign: "right" }}>
                              {(isHost || userId === currentUserNumericId) && !invitedMode && (
                                <button
                                  type="button"
                                  className="add-item-btn"
                                  onClick={() => addAdditionalItem(userId)}
                                  aria-label="Add another item"
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    color: "white",
                                    cursor: "pointer",
                                    fontWeight: 800,
                                    fontSize: "0.95rem",
                                    lineHeight: 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 6px rgba(16, 185, 129, 0.35)",
                                  }}
                                >
                                  +
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                        {(participant.additional_items || []).map((item, idx) => {
                          const canEditItem = !isPastMeal && (isHost || userId === currentUserNumericId) && !invitedMode;
                          const itemSelectValue = knownFoods.includes(item.food) ? item.food : "__other__";
                          const itemShowOther = !foodRequestsEnforced || hasRealFoodOptions(userId) === false;
                          return (
                            <tr
                              key={`${userId}-extra-${idx}`}
                              style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}
                            >
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
                                  {knownFoods.map((f) => (
                                    <option key={f} value={f}>{formatFood(f)}</option>
                                  ))}
                                  {itemShowOther && <option value="__other__">✏️ Other</option>}
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
                              {!isPastMeal && (
                                <td style={{ padding: "6px 12px 6px 4px", textAlign: "right" }}>
                                  {canEditItem && (
                                    <button
                                      type="button"
                                      className="remove-item-btn"
                                      onClick={() => removeAdditionalItem(userId, idx)}
                                      aria-label="Remove item"
                                      style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                        color: "white",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        fontSize: "1.05rem",
                                        lineHeight: 1,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      −
                                    </button>
                                  )}
                                </td>
                              )}
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

        {/* ── OneTable sync section (create mode, host with OT connected) ── */}
        {activeTab === "info" && isCreateMode && otToken && (
          <div
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 14,
              border: `2px solid ${otSyncEnabled && otSyncEligible ? "#fb923c" : "#e5e7eb"}`,
              background: otSyncEnabled && otSyncEligible ? "#fff7ed" : "#f9fafb",
              transition: "all 0.2s ease",
              opacity: otSyncEligible || !meal?.datetime ? 1 : 0.5,
            }}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: otSyncEligible || !meal?.datetime ? "pointer" : "not-allowed", userSelect: "none" }}
            >
              <input
                type="checkbox"
                checked={otSyncEnabled}
                onChange={(e) => setOtSyncEnabled(e.target.checked)}
                disabled={!otSyncEligible && !!meal?.datetime}
                style={{ width: 18, height: 18, cursor: otSyncEligible || !meal?.datetime ? "pointer" : "not-allowed" }}
              />
              <span style={{ fontWeight: 800, fontSize: "1rem", color: "#9a3412" }}>
                Sync to OneTable
              </span>
            </label>

            {otIneligibleReason && (
              <div style={{ fontSize: "0.82rem", color: "#9ca3af", fontWeight: 600, marginTop: 8 }}>
                {otIneligibleReason}
              </div>
            )}

            {otSyncEligible && otSyncEnabled && (
              <div style={{ marginTop: 16 }}>
                {otGeocoding && (
                  <div style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: 10 }}>
                    Looking up coordinates for your address…
                  </div>
                )}
                {!otGeocoding && otLat !== 0 && (
                  <div style={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 600, marginBottom: 10 }}>
                    ✓ Location ready
                  </div>
                )}
                {!otGeocoding && !otLat && (
                  <div style={{ fontSize: "0.82rem", color: "#f97316", fontWeight: 600, marginBottom: 10 }}>
                    ⚠ Set a host apartment or custom location above first
                  </div>
                )}

                <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", color: "#374151", marginBottom: 4 }}>
                  Description{" "}
                  <span style={{ color: "#ef4444" }}>*</span>{" "}
                  <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                    (min 150 chars — {otDescription.length}/150)
                  </span>
                </label>
                <textarea
                  value={otDescription}
                  onChange={(e) => setOtDescription(e.target.value)}
                  placeholder="Describe your meal for OneTable guests. At least 150 characters required…"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `2px solid ${otDescription.length >= 150 ? "#10b981" : "#fb923c"}`,
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    fontFamily: "Inter, sans-serif",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
                {otDescription.length > 0 && otDescription.length < 150 && (
                  <div style={{ color: "#f97316", fontSize: "0.82rem", marginTop: 4, fontWeight: 600 }}>
                    {150 - otDescription.length} more characters needed
                  </div>
                )}

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, cursor: otDateChecks.canNourish ? "pointer" : "not-allowed", userSelect: "none", opacity: otDateChecks.canNourish ? 1 : 0.5 }}>
                  <input
                    type="checkbox"
                    checked={otNourishment}
                    onChange={(e) => otDateChecks.canNourish && setOtNourishment(e.target.checked)}
                    disabled={!otDateChecks.canNourish}
                    style={{ width: 16, height: 16, cursor: otDateChecks.canNourish ? "pointer" : "not-allowed" }}
                  />
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#374151" }}>
                    Request Nourishment (up to $100 sponsorship)
                    {!otDateChecks.canNourish && (
                      <span style={{ display: "block", fontWeight: 500, fontSize: "0.8rem", color: "#ef4444" }}>
                        Past the Wednesday deadline
                      </span>
                    )}
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* OneTable — past meal: read-only link (visible to all participants) */}
        {activeTab === "info" && !isCreateMode && isPastMeal && meal.onetable_event_id && (
          <div style={{ marginTop: 24, padding: "14px 18px", borderRadius: 14, border: "2px solid #fb923c", background: "#fff7ed" }}>
            <div style={{ fontWeight: 800, color: "#9a3412", fontSize: "0.95rem" }}>🔗 OneTable Event</div>
            <a
              href={meal.onetable_event_uuid
                ? `https://dinners.onetable.org/events/${meal.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/${meal.onetable_event_uuid}/details`
                : `https://dinners.onetable.org/events/${meal.onetable_event_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.82rem", color: "#ea580c", marginTop: 4, display: "inline-block" }}
            >
              View on OneTable →
            </a>
            {meal.onetable_nourishment && (
              <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>Nourishment was requested</div>
            )}
          </div>
        )}

        {/* OneTable — upcoming meal: full management (hosts only) */}
        {activeTab === "info" && !isCreateMode && !isPastMeal && otToken && isHost && (
          <div
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 14,
              border: `2px solid ${meal.onetable_event_id ? "#fb923c" : "#e5e7eb"}`,
              background: meal.onetable_event_id ? "#fff7ed" : "#f9fafb",
              transition: "all 0.2s ease",
              opacity: meal.onetable_event_id || otSyncEligible ? 1 : 0.5,
            }}
          >
            {meal.onetable_event_id ? (
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#9a3412", fontSize: "0.95rem" }}>🔗 Synced to OneTable</div>
                  <a
                    href={meal.onetable_event_uuid
                      ? `https://dinners.onetable.org/events/${meal.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/${meal.onetable_event_uuid}/details`
                      : `https://dinners.onetable.org/events/${meal.onetable_event_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.82rem", color: "#ea580c", marginTop: 4, display: "inline-block" }}
                  >
                    View on OneTable →
                  </a>
                  {meal.onetable_nourishment && (
                    <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>Nourishment requested</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleUnsync}
                  disabled={otUnsyncing}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "2px solid #fca5a5",
                    background: "white",
                    color: "#ef4444",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: otUnsyncing ? "not-allowed" : "pointer",
                    flexShrink: 0,
                  }}
                >
                  {otUnsyncing ? "Unsyncing…" : "Unsync"}
                </button>
              </div>
            ) : (
              <>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: otSyncEligible ? "pointer" : "not-allowed", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={otSyncEnabled}
                    onChange={(e) => setOtSyncEnabled(e.target.checked)}
                    disabled={!otSyncEligible}
                    style={{ width: 18, height: 18, cursor: otSyncEligible ? "pointer" : "not-allowed" }}
                  />
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#9a3412" }}>
                    Sync to OneTable
                  </span>
                </label>

                {otIneligibleReason && (
                  <div style={{ fontSize: "0.82rem", color: "#9ca3af", fontWeight: 600, marginTop: 8 }}>
                    {otIneligibleReason}
                  </div>
                )}

                {otSyncEligible && otSyncEnabled && (
                  <div style={{ marginTop: 16 }}>
                    {otGeocoding && (
                      <div style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: 10 }}>
                        Looking up coordinates for your address…
                      </div>
                    )}
                    {!otGeocoding && otLat !== 0 && (
                      <div style={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 600, marginBottom: 10 }}>
                        ✓ Location ready
                      </div>
                    )}
                    {!otGeocoding && !otLat && (
                      <div style={{ fontSize: "0.82rem", color: "#f97316", fontWeight: 600, marginBottom: 10 }}>
                        ⚠ Set a host apartment or custom location above first
                      </div>
                    )}

                    <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", color: "#374151", marginBottom: 4 }}>
                      Description{" "}
                      <span style={{ color: "#ef4444" }}>*</span>{" "}
                      <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                        (min 150 chars — {otDescription.length}/150)
                      </span>
                    </label>
                    <textarea
                      value={otDescription}
                      onChange={(e) => setOtDescription(e.target.value)}
                      placeholder="Describe your meal for OneTable guests. At least 150 characters required…"
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: `2px solid ${otDescription.length >= 150 ? "#10b981" : "#fb923c"}`,
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        fontFamily: "Inter, sans-serif",
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                    {otDescription.length > 0 && otDescription.length < 150 && (
                      <div style={{ color: "#f97316", fontSize: "0.82rem", marginTop: 4, fontWeight: 600 }}>
                        {150 - otDescription.length} more characters needed
                      </div>
                    )}

                    <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, cursor: otDateChecks.canNourish ? "pointer" : "not-allowed", userSelect: "none", opacity: otDateChecks.canNourish ? 1 : 0.5 }}>
                      <input
                        type="checkbox"
                        checked={otNourishment}
                        onChange={(e) => otDateChecks.canNourish && setOtNourishment(e.target.checked)}
                        disabled={!otDateChecks.canNourish}
                        style={{ width: 16, height: 16, cursor: otDateChecks.canNourish ? "pointer" : "not-allowed" }}
                      />
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#374151" }}>
                        Request Nourishment (up to $100 sponsorship)
                        {!otDateChecks.canNourish && (
                          <span style={{ display: "block", fontWeight: 500, fontSize: "0.8rem", color: "#ef4444" }}>
                            Past the Wednesday deadline
                          </span>
                        )}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={handleSyncToOT}
                      disabled={otSyncing || !otLat || otDescription.length < 150 || !otDateChecks.isFriday || !otDateChecks.canSync || otWeekConflict}
                      style={{
                        marginTop: 16,
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 12,
                        border: "none",
                        background: (otSyncing || !otLat || otDescription.length < 150 || !otDateChecks.isFriday || !otDateChecks.canSync || otWeekConflict)
                          ? "#d1d5db"
                          : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: (otSyncing || !otLat || otDescription.length < 150 || !otDateChecks.isFriday || !otDateChecks.canSync || otWeekConflict) ? "not-allowed" : "pointer",
                        boxShadow: (otSyncing || !otLat || otDescription.length < 150 || !otDateChecks.isFriday || !otDateChecks.canSync || otWeekConflict) ? "none" : "0 4px 12px rgba(249,115,22,0.3)",
                      }}
                    >
                      {otSyncing ? "Syncing…" : "Sync to OneTable →"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        </div>

        {/* Footer — a real block below the scrollable body, not an overlay, so nothing shows through it */}
        <div
          className="button-bar modal-footer-bar"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 12,
            flexShrink: 0,
            padding: "28px 32px 32px",
            background: "white",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
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
                  !Object.values(meal.participants).some((p) => p.role === "host" && p.accepted === true) ||
                  (otSyncEnabled && otDescription.length < 150) ||
                  (otSyncEnabled && !otLat)
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
      {showManageFoodRequests && meal && mealId && (
        <FoodRequestsModal
          mealId={mealId}
          meal={meal}
          foods={foods}
          onClose={() => setShowManageFoodRequests(false)}
        />
      )}
      {showViewFoodRequests && meal && (
        <ViewFoodRequestsModal
          meal={meal}
          onClose={() => setShowViewFoodRequests(false)}
        />
      )}
      {showManageParticipants && meal && (
        <ManageParticipantsModal
          meal={meal}
          users={users}
          apartments={apartments}
          friendIds={friendIds}
          currentUserId={currentUserId}
          onViewProfile={onViewProfile}
          isResidentOfHostApartment={isResidentOfHostApartment}
          onSave={handleParticipantsSave}
          onClose={() => setShowManageParticipants(false)}
        />
      )}
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
        data: { tab: "upcoming", mealId },
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
