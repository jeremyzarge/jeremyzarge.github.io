import { useEffect, useRef, useState } from "react";
import { ref, set, get } from "firebase/database";
import { fetchAllApartments, fetchAddressSuggestions, createDefaultAllergies, createDefaultCanBring } from "../utils";
import { rtdb, createNumericApartmentId } from "../firebaseClient";
import { createOrUpdateUserNumeric } from "../index";
import { cancelJoinRequest, clearUserApartmentPending, requestToJoinApartment } from "../apartmentService";
import OneTableConnect from "./OneTableConnect";
import type { Apartment, ApartmentInvite, CanBring, Allergies, UserProfile, Meal } from "../types";

function getUpcomingShabbatWindows() {
  const now = new Date();
  const daysFromFriday = (now.getDay() - 5 + 7) % 7;
  const thisFriday = new Date(now);
  thisFriday.setDate(now.getDate() - daysFromFriday);
  thisFriday.setHours(0, 0, 0, 0);

  const dinnerStart = new Date(thisFriday); dinnerStart.setHours(17, 0, 0, 0);
  const dinnerEnd = new Date(thisFriday); dinnerEnd.setDate(thisFriday.getDate() + 1); dinnerEnd.setHours(0, 0, 0, 0);
  const lunchStart = new Date(thisFriday); lunchStart.setDate(thisFriday.getDate() + 1); lunchStart.setHours(12, 0, 0, 0);
  const lunchEnd = new Date(thisFriday); lunchEnd.setDate(thisFriday.getDate() + 1); lunchEnd.setHours(15, 0, 0, 0);

  if (now > lunchEnd) {
    [dinnerStart, dinnerEnd, lunchStart, lunchEnd].forEach(d => d.setDate(d.getDate() + 7));
  }
  return { dinnerStart, dinnerEnd, lunchStart, lunchEnd };
}

interface ProfileEditorProps {
  userId: string;
  currentProfile: UserProfile;
  onSaved: () => void;
  onCancel: () => void;
  onViewApartment?: (aptId: string) => void;
  onProfileChanged?: () => void;
  aptInvites?: ApartmentInvite[];
  onAcceptInvite?: (invite: ApartmentInvite) => void;
  onDeclineInvite?: (invite: ApartmentInvite) => void;
}

/**
 * Component for editing an existing user profile
 */
export default function ProfileEditor({
  userId,
  currentProfile,
  onSaved,
  onCancel,
  onViewApartment,
  onProfileChanged,
  aptInvites = [],
  onAcceptInvite,
  onDeclineInvite,
}: ProfileEditorProps) {
  const [firstName, setFirstName] = useState(currentProfile.first_name || "");
  const [lastName, setLastName] = useState(currentProfile.last_name || "");
  const [submitting, setSubmitting] = useState(false);
  const [showOTConnect, setShowOTConnect] = useState(false);
  const [otToken, setOtToken] = useState(currentProfile.onetable_token || "");
  const [otDisconnecting, setOtDisconnecting] = useState(false);

  // Always load fresh OT token on mount — the profile prop may be stale
  useEffect(() => {
    get(ref(rtdb, `users/${userId}/onetable_token`)).then((snap) => {
      setOtToken(snap.exists() ? snap.val() : "");
    });
  }, [userId]);

  // Apartment display name + search/create (only shown when user has no apartment)
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [aptSearch, setAptSearch] = useState("");
  const [aptDropdownOpen, setAptDropdownOpen] = useState(false);
  const [aptActionLoading, setAptActionLoading] = useState(false);
  const [creatingNewApt, setCreatingNewApt] = useState(false);
  const [newAptName, setNewAptName] = useState("");
  const [newAptAddress, setNewAptAddress] = useState("");
  const [newAptUnit, setNewAptUnit] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const aptComboRef = useRef<HTMLDivElement>(null);
  const addressComboRef = useRef<HTMLDivElement>(null);

  // Meal status overrides
  const [dinnerStatus, setDinnerStatus] = useState<"free" | "busy" | null>(currentProfile.dinner_status ?? null);
  const [lunchStatus, setLunchStatus] = useState<"free" | "busy" | null>(currentProfile.lunch_status ?? null);
  const [autoDinnerBusy, setAutoDinnerBusy] = useState(false);
  const [autoLunchBusy, setAutoLunchBusy] = useState(false);

  // Foods user can bring
  const [canBring, setCanBring] = useState<CanBring>(
    currentProfile.can_bring
      ? { ...currentProfile.can_bring, custom: currentProfile.can_bring.custom || [] }
      : createDefaultCanBring()
  );
  const [customCanBringInput, setCustomCanBringInput] = useState("");

  // Allergies
  const [allergies, setAllergies] = useState<Allergies>(
    currentProfile.allergies
      ? { ...currentProfile.allergies, custom: currentProfile.allergies.custom || [] }
      : createDefaultAllergies()
  );
  const [customAllergyInput, setCustomAllergyInput] = useState("");

  const foodOptions: Array<{ key: keyof Omit<CanBring, "custom">; label: string }> = [
    { key: "drinks", label: "🥤 Drinks" },
    { key: "dessert", label: "🍰 Dessert" },
    { key: "salad", label: "🥗 Salad" },
    { key: "main_dish", label: "🍝 Main Dish" },
    { key: "snacks", label: "🍿 Snacks" },
    { key: "sides", label: "🥔 Sides" },
    { key: "utensils", label: "🍴 Utensils" },
  ];

  const allergyPresets: Array<{ key: keyof Omit<Allergies, "custom">; label: string }> = [
    { key: "gluten_free", label: "Gluten-free" },
    { key: "dairy_free", label: "Dairy-free" },
    { key: "vegan", label: "Vegan" },
    { key: "vegetarian", label: "Vegetarian" },
    { key: "nut_allergy", label: "Nut Allergy" },
  ];

  useEffect(() => {
    fetchAllApartments().then(setApartments);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aptComboRef.current && !aptComboRef.current.contains(e.target as Node)) {
        setAptDropdownOpen(false);
      }
      if (addressComboRef.current && !addressComboRef.current.contains(e.target as Node)) {
        setAddressDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced address autocomplete
  useEffect(() => {
    const q = newAptAddress.trim();
    if (!q || q.length < 3) { setAddressSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const labels = await fetchAddressSuggestions(q);
        setAddressSuggestions(labels);
        if (labels.length > 0) setAddressDropdownOpen(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timeout);
  }, [newAptAddress]);

  useEffect(() => {
    get(ref(rtdb, "meal_events")).then((snap) => {
      if (!snap.exists()) return;
      const allMeals = snap.val() as Record<string, Meal>;
      const { dinnerStart, dinnerEnd, lunchStart, lunchEnd } = getUpcomingShabbatWindows();
      let dinner = false, lunch = false;
      for (const meal of Object.values(allMeals)) {
        const p = (meal.participants || {})[userId];
        if (p?.accepted === true && meal.datetime) {
          const dt = new Date(meal.datetime);
          if (dt >= dinnerStart && dt < dinnerEnd) dinner = true;
          if (dt >= lunchStart && dt < lunchEnd) lunch = true;
        }
      }
      setAutoDinnerBusy(dinner);
      setAutoLunchBusy(lunch);
    });
  }, [userId]);

  const handleOTDisconnect = async () => {
    if (!window.confirm("Disconnect OneTable? This will remove your saved token.")) return;
    setOtDisconnecting(true);
    try {
      await set(ref(rtdb, `users/${userId}/onetable_token`), null);
      setOtToken("");
    } finally {
      setOtDisconnecting(false);
    }
  };

  const toggleCanBring = (key: keyof Omit<CanBring, "custom">) => {
    setCanBring((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addCustomCanBring = () => {
    const trimmed = customCanBringInput.trim();
    if (!trimmed || (canBring.custom || []).includes(trimmed)) return;
    setCanBring((prev) => ({ ...prev, custom: [...(prev.custom || []), trimmed] }));
    setCustomCanBringInput("");
  };

  const deleteCustomCanBring = (item: string) => {
    setCanBring((prev) => ({ ...prev, custom: (prev.custom || []).filter((c) => c !== item) }));
  };

  const toggleAllergy = (key: keyof Omit<Allergies, "custom">) => {
    setAllergies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergyInput.trim();
    if (!trimmed || allergies.custom.includes(trimmed)) return;
    setAllergies((prev) => ({ ...prev, custom: [...prev.custom, trimmed] }));
    setCustomAllergyInput("");
  };

  const deleteCustomAllergy = (item: string) => {
    setAllergies((prev) => ({ ...prev, custom: prev.custom.filter((a) => a !== item) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    setSubmitting(true);

    try {
      const updatedProfile: UserProfile = {
        ...currentProfile,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        can_bring: canBring,
        allergies,
      };
      delete updatedProfile.dinner_status;
      delete updatedProfile.lunch_status;
      if (dinnerStatus) updatedProfile.dinner_status = dinnerStatus;
      if (lunchStatus) updatedProfile.lunch_status = lunchStatus;

      await createOrUpdateUserNumeric(userId, updatedProfile);
      alert("Profile updated!");
      onSaved();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = !firstName.trim() || !lastName.trim();

  return (
    <>
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
        alignItems: "flex-start",
        padding: "40px 20px",
        zIndex: 1000,
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="modal-content"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 580,
          gap: 20,
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "Inter, sans-serif",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fff1f2 100%), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 900,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
            fontSize: "2.2rem",
            letterSpacing: "-0.5px",
          }}
        >
          Edit Your Profile
        </h2>

        <input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
          autoFocus
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle}
        />

        {/* Apartment — read-only, managed via apartment popup */}
        {currentProfile.apartment ? (
          <div
            onClick={() => onViewApartment?.(currentProfile.apartment)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #d1fae5",
              background: "#f0fdf4",
              cursor: onViewApartment ? "pointer" : "default",
              fontWeight: 700,
              color: "#047857",
              fontSize: "0.95rem",
            }}
          >
            🏠 {apartments.find((a) => a.id === currentProfile.apartment)?.name ?? "Your Apartment"}
          </div>
        ) : currentProfile.pending_apartment_request ? (
          <div style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "2px solid #fde68a",
            background: "#fefce8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}>
            <div style={{ color: "#92400e", fontSize: "0.9rem", fontWeight: 600 }}>
              Request pending for {apartments.find((a) => a.id === currentProfile.pending_apartment_request)?.name ?? "apartment"}
            </div>
            <button
              type="button"
              onClick={async () => {
                await cancelJoinRequest(userId, currentProfile.pending_apartment_request!);
                onProfileChanged?.();
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #fca5a5",
                background: "white",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Cancel
            </button>
          </div>
        ) : creatingNewApt ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 16px", borderRadius: 12, border: "2px solid #d1fae5", background: "#f0fdf4" }}>
            <div style={{ fontWeight: 700, color: "#047857", fontSize: "0.9rem" }}>Create New Apartment</div>
            <input
              value={newAptName}
              onChange={(e) => setNewAptName(e.target.value)}
              placeholder="Apartment name *"
              autoFocus
              style={inputStyle}
            />
            <div ref={addressComboRef} style={{ position: "relative" }}>
              <input
                value={newAptAddress}
                onChange={(e) => { setNewAptAddress(e.target.value); }}
                onFocus={() => { if (addressSuggestions.length > 0) setAddressDropdownOpen(true); }}
                placeholder="Street address (optional)"
                style={inputStyle}
              />
              {addressDropdownOpen && addressSuggestions.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "2px solid #d1fae5",
                  borderRadius: 12,
                  zIndex: 300,
                  maxHeight: 220,
                  overflowY: "auto",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}>
                  {addressSuggestions.map((label) => (
                    <div
                      key={label}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setNewAptAddress(label);
                        setAddressDropdownOpen(false);
                        setAddressSuggestions([]);
                      }}
                      style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontSize: "0.9rem", fontWeight: 600, color: "#047857" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              value={newAptUnit}
              onChange={(e) => setNewAptUnit(e.target.value)}
              placeholder="Apt / Unit (optional)"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => { setCreatingNewApt(false); setNewAptName(""); setNewAptAddress(""); setNewAptUnit(""); setAddressSuggestions([]); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid #d1d5db", background: "white", color: "#6b7280", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!newAptName.trim() || aptActionLoading}
                onClick={async () => {
                  if (!newAptName.trim()) return;
                  setAptActionLoading(true);
                  try {
                    const fullAddress = newAptUnit.trim()
                      ? `${newAptAddress.trim()}, ${newAptUnit.trim()}`
                      : newAptAddress.trim();
                    const newAptId = await createNumericApartmentId(newAptName.trim(), fullAddress);
                    await set(ref(rtdb, `users/${userId}/apartment`), newAptId);
                    await clearUserApartmentPending(userId);
                    onProfileChanged?.();
                    setCreatingNewApt(false);
                    setNewAptName("");
                    setNewAptAddress("");
                    setNewAptUnit("");
                    setAddressSuggestions([]);
                  } finally {
                    setAptActionLoading(false);
                  }
                }}
                style={{
                  flex: 2,
                  padding: "9px 0",
                  borderRadius: 10,
                  border: "none",
                  background: !newAptName.trim() || aptActionLoading ? "#d1d5db" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: !newAptName.trim() || aptActionLoading ? "not-allowed" : "pointer",
                }}
              >
                {aptActionLoading ? "Creating…" : "Create Apartment"}
              </button>
            </div>
          </div>
        ) : (
          <div ref={aptComboRef} style={{ position: "relative" }}>
            <input
              value={aptSearch}
              onChange={(e) => { setAptSearch(e.target.value); setAptDropdownOpen(true); }}
              onFocus={() => setAptDropdownOpen(true)}
              placeholder="Search or create an apartment to join…"
              disabled={aptActionLoading}
              style={{ ...inputStyle, opacity: aptActionLoading ? 0.6 : 1 }}
            />
            {aptActionLoading && (
              <div style={{ fontSize: "0.8rem", color: "#059669", marginTop: 4, fontWeight: 600 }}>
                Sending request…
              </div>
            )}
            {aptDropdownOpen && aptSearch.trim() && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "white",
                border: "2px solid #e5e7eb",
                borderRadius: 12,
                zIndex: 200,
                maxHeight: 240,
                overflowY: "auto",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}>
                {apartments
                  .filter((a) => `${a.name} ${a.address}`.toLowerCase().includes(aptSearch.toLowerCase()))
                  .map((apt) => (
                    <div
                      key={apt.id}
                      onMouseDown={async (e) => {
                        e.preventDefault();
                        setAptDropdownOpen(false);
                        setAptSearch("");
                        setAptActionLoading(true);
                        try {
                          await requestToJoinApartment(userId, apt.id, `${currentProfile.first_name} ${currentProfile.last_name}`.trim());
                          onProfileChanged?.();
                        } finally {
                          setAptActionLoading(false);
                        }
                      }}
                      style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    >
                      <div style={{ fontWeight: 700, color: "#111827" }}>{apt.name}</div>
                      {apt.address && <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{apt.address}</div>}
                      <div style={{ color: "#059669", fontSize: "0.75rem", fontWeight: 600, marginTop: 2 }}>Request to Join →</div>
                    </div>
                  ))}
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setAptDropdownOpen(false);
                    setAptSearch("");
                    setCreatingNewApt(true);
                    setNewAptName(aptSearch.trim());
                    setNewAptAddress("");
                    setNewAptUnit("");
                    setAddressSuggestions([]);
                  }}
                  style={{ padding: "10px 16px", cursor: "pointer", color: "#2563eb", fontWeight: 700, fontSize: "0.9rem" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  + Create "{aptSearch.trim()}"
                </div>
              </div>
            )}
          </div>
        )}

        {aptInvites.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 700, color: "#047857", fontSize: "0.85rem", textAlign: "center" }}>
              Apartment Invitations
            </div>
            {aptInvites.map((invite) => (
              <div
                key={invite.aptId}
                style={{
                  background: "#f0fdf4",
                  border: "2px solid #bbf7d0",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: "#047857", fontSize: "0.95rem" }}>{invite.aptName}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Invited by {invite.invitedByName}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => onAcceptInvite?.(invite)}
                    style={{
                      padding: "7px 18px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeclineInvite?.(invite)}
                    style={{
                      padding: "7px 18px",
                      borderRadius: 10,
                      border: "1px solid #d1d5db",
                      background: "white",
                      color: "#374151",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <SectionTitle text="This Shabbat's Status" />
        <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {(["dinner", "lunch"] as const).map((meal) => {
            const value = meal === "dinner" ? dinnerStatus : lunchStatus;
            const setter = meal === "dinner" ? setDinnerStatus : setLunchStatus;
            const icon = meal === "dinner" ? "🍽️" : "🥗";
            const autoBusy = meal === "dinner" ? autoDinnerBusy : autoLunchBusy;
            const effectiveBusy = value === "busy" ? true : value === "free" ? false : autoBusy;
            const circleBg = effectiveBusy ? "#fee2e2" : "#dcfce7";
            const circleBorder = effectiveBusy ? "#dc2626" : "#16a34a";
            const labelColor = effectiveBusy ? "#dc2626" : "#16a34a";
            const labelText = meal.toUpperCase();
            return (
              <div key={meal} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: circleBg,
                  border: `2.5px solid ${circleBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem",
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: labelColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {labelText}
                </span>
                <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1.5px solid #e5e7eb" }}>
                  {([null, "free", "busy"] as const).map((opt, i) => {
                    const active = value === opt;
                    const optLabel = opt === null ? "Auto" : opt === "free" ? "Free" : "Busy";
                    return (
                      <button
                        key={optLabel}
                        type="button"
                        onClick={() => setter(opt)}
                        style={{
                          padding: "3px 8px",
                          border: "none",
                          borderRight: i < 2 ? "1px solid #e5e7eb" : "none",
                          background: active ? (opt === "busy" ? "#fee2e2" : opt === "free" ? "#dcfce7" : "#f3f4f6") : "white",
                          color: active ? (opt === "busy" ? "#dc2626" : opt === "free" ? "#16a34a" : "#374151") : "#9ca3af",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {optLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <SectionTitle text="What can you bring?" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {foodOptions.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleCanBring(item.key)}
              style={{
                padding: "10px 18px",
                borderRadius: 50,
                border: "none",
                background: canBring[item.key]
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "white",
                color: canBring[item.key] ? "white" : "#6b7280",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: canBring[item.key]
                  ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {canBring[item.key] ? "✓ " : ""}{item.label}
            </button>
          ))}
          {(canBring.custom || []).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => deleteCustomCanBring(c)}
              style={{
                padding: "10px 18px",
                borderRadius: 50,
                border: "none",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ✕ {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Add custom item (e.g. wine, hummus)..."
            value={customCanBringInput}
            onChange={(e) => setCustomCanBringInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomCanBring())}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={addCustomCanBring}
            disabled={!customCanBringInput.trim()}
            style={{
              ...primarySmallButton,
              marginTop: 0,
              opacity: customCanBringInput.trim() ? 1 : 0.5,
              cursor: customCanBringInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            + Add
          </button>
        </div>

        <SectionTitle text="Allergies / Dietary Restrictions" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {allergyPresets.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => toggleAllergy(a.key)}
              style={{
                padding: "10px 18px",
                borderRadius: 50,
                border: "none",
                background: allergies[a.key]
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : "white",
                color: allergies[a.key] ? "white" : "#6b7280",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: allergies[a.key]
                  ? "0 4px 12px rgba(245, 158, 11, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {allergies[a.key] ? "✓ " : ""}{a.label}
            </button>
          ))}
          {/* Custom allergies as pills - click to remove */}
          {allergies.custom.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => deleteCustomAllergy(a)}
              style={{
                padding: "10px 18px",
                borderRadius: 50,
                border: "none",
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ✕ {a}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input
            placeholder="Add custom allergy..."
            value={customAllergyInput}
            onChange={(e) => setCustomAllergyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAllergy())}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={addCustomAllergy}
            disabled={!customAllergyInput.trim()}
            style={{
              ...primarySmallButton,
              marginTop: 0,
              opacity: customAllergyInput.trim() ? 1 : 0.5,
              cursor: customAllergyInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            + Add
          </button>
        </div>

        {/* ── OneTable Integration ── */}
        <SectionTitle text="OneTable Integration" />
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            border: "2px solid #fed7aa",
            background: otToken ? "#fff7ed" : "#f9fafb",
          }}
        >
          {otToken ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#9a3412", fontSize: "0.95rem" }}>
                  ✓ Connected to OneTable
                </div>
                <a
                  href="https://dinners.onetable.org/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.8rem", color: "#ea580c", marginTop: 4, display: "inline-block" }}
                >
                  View OneTable profile →
                </a>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleOTDisconnect}
                  disabled={otDisconnecting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "2px solid #fca5a5",
                    background: "white",
                    color: "#ef4444",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: otDisconnecting ? "not-allowed" : "pointer",
                  }}
                >
                  {otDisconnecting ? "…" : "Disconnect"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOTConnect(true)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Refresh Token
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: 500 }}>
                Connect OneTable to auto-sync your meals and reservations.
              </div>
              <button
                type="button"
                onClick={() => setShowOTConnect(true)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
                }}
              >
                Connect OneTable
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "16px 0",
              borderRadius: 12,
              border: "2px solid #d1d5db",
              backgroundColor: "white",
              color: "#6b7280",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled || submitting}
            style={{
              flex: 1,
              padding: "16px 0",
              borderRadius: 12,
              border: "none",
              background: isDisabled || submitting
                ? "#d1d5db"
                : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: isDisabled || submitting ? "not-allowed" : "pointer",
              boxShadow: isDisabled || submitting ? "none" : "0 8px 20px rgba(240, 147, 251, 0.4)",
              transition: "all 0.2s ease",
              letterSpacing: "0.5px",
            }}
          >
            {submitting ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </form>

    </div>

    {showOTConnect && (
      <OneTableConnect
        userId={userId}
        existingToken={otToken || undefined}
        onSaved={async () => {
          const snap = await get(ref(rtdb, `users/${userId}/onetable_token`));
          setOtToken(snap.exists() ? snap.val() : "");
          setShowOTConnect(false);
        }}
        onClose={() => setShowOTConnect(false)}
      />
    )}
    </>
  );
}

/* Styles */

const inputStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  fontSize: "1rem",
  width: "100%",
  fontWeight: 600,
  transition: "all 0.2s ease",
  fontFamily: "Inter, sans-serif",
};

const primarySmallButton: React.CSSProperties = {
  marginTop: 8,
  padding: "10px 18px",
  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  border: "none",
  borderRadius: 10,
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(240, 147, 251, 0.3)",
  transition: "all 0.2s ease",
};

function SectionTitle({ text }: { text: string }) {
  return (
    <h3
      style={{
        marginTop: 16,
        marginBottom: 12,
        fontSize: "1.2rem",
        fontWeight: 800,
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: "-0.3px",
      }}
    >
      {text}
    </h3>
  );
}
