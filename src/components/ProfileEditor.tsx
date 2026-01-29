import { useEffect, useState } from "react";
import { fetchAllApartments, createDefaultAllergies, createDefaultCanBring } from "../utils";
import { createNumericApartmentId } from "../firebaseClient";
import { createOrUpdateUserNumeric } from "../index";
import type { Apartment, CanBring, Allergies, UserProfile } from "../types";

interface ProfileEditorProps {
  userId: string;
  currentProfile: UserProfile;
  onSaved: () => void;
  onCancel: () => void;
}

/**
 * Component for editing an existing user profile
 */
export default function ProfileEditor({
  userId,
  currentProfile,
  onSaved,
  onCancel,
}: ProfileEditorProps) {
  const [firstName, setFirstName] = useState(currentProfile.first_name || "");
  const [lastName, setLastName] = useState(currentProfile.last_name || "");
  const [submitting, setSubmitting] = useState(false);

  // Apartment state
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState(currentProfile.apartment || "");
  const [newApartment, setNewApartment] = useState<{ name: string; address: string } | null>(null);

  // Foods user can bring
  const [canBring, setCanBring] = useState<CanBring>(
    currentProfile.can_bring || createDefaultCanBring()
  );

  // Allergies
  const [allergies, setAllergies] = useState<Allergies>(
    currentProfile.allergies || createDefaultAllergies()
  );
  const [customAllergyInput, setCustomAllergyInput] = useState("");

  const foodOptions: Array<{ key: keyof CanBring; label: string }> = [
    { key: "drinks", label: "Drinks" },
    { key: "dessert", label: "Dessert" },
    { key: "salad", label: "Salad" },
    { key: "main_dish", label: "Main Dish" },
    { key: "snacks", label: "Snacks" },
    { key: "sides", label: "Sides" },
    { key: "utensils", label: "Utensils" },
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

  const toggleCanBring = (key: keyof CanBring) => {
    setCanBring((prev) => ({ ...prev, [key]: !prev[key] }));
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
      let aptId: string | null = selectedApartmentId || null;
      if (newApartment) {
        aptId = await createNumericApartmentId(
          newApartment.name.trim(),
          newApartment.address.trim()
        );
      }

      const updatedProfile: UserProfile = {
        ...currentProfile,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        apartment: aptId || "",
        can_bring: canBring,
        allergies,
      };

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

  const isDisabled =
    !firstName.trim() ||
    !lastName.trim() ||
    (newApartment
      ? !newApartment.name.trim() || !newApartment.address.trim()
      : !selectedApartmentId);

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
        alignItems: "flex-start",
        padding: "40px 20px",
        zIndex: 1000,
        overflowY: "auto",
        backdropFilter: "blur(4px)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 580,
          gap: 20,
          backgroundColor: "white",
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "Inter, sans-serif",
          border: "4px solid transparent",
          backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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

        <select
          value={newApartment ? "new" : selectedApartmentId}
          onChange={(e) => {
            if (e.target.value === "new") {
              setNewApartment({ name: "", address: "" });
              setSelectedApartmentId("");
            } else {
              setNewApartment(null);
              setSelectedApartmentId(e.target.value);
            }
          }}
          style={inputStyle}
        >
          <option value="">-- Select Existing Apartment --</option>
          {apartments.map((apt) => (
            <option key={apt.id} value={apt.id}>
              {apt.name} — {apt.address}
            </option>
          ))}
          <option value="new" style={{ color: "#2563eb", fontWeight: 600 }}>
            + Create New Apartment
          </option>
        </select>

        {newApartment && (
          <>
            <input
              placeholder="Apartment name"
              value={newApartment.name}
              onChange={(e) => setNewApartment({ ...newApartment, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Apartment address"
              value={newApartment.address}
              onChange={(e) => setNewApartment({ ...newApartment, address: e.target.value })}
              style={inputStyle}
            />
          </>
        )}

        <SectionTitle text="What can you bring?" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {foodOptions.map((item) => (
            <label key={item.key} style={checkRowStyle}>
              <input
                type="checkbox"
                checked={canBring[item.key]}
                onChange={() => toggleCanBring(item.key)}
              />
              {item.label}
            </label>
          ))}
        </div>

        <SectionTitle text="Allergies / Dietary Restrictions" />
        {allergyPresets.map((a) => (
          <label key={a.key} style={checkRowStyle}>
            <input
              type="checkbox"
              checked={allergies[a.key]}
              onChange={() => toggleAllergy(a.key)}
            />
            {a.label}
          </label>
        ))}

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Add another allergy..."
            value={customAllergyInput}
            onChange={(e) => setCustomAllergyInput(e.target.value)}
            style={inputStyle}
          />
          <button type="button" onClick={addCustomAllergy} style={primarySmallButton}>
            Add Allergy
          </button>
        </div>

        {allergies.custom.length > 0 && (
          <ul style={{ marginTop: 10, paddingLeft: 0 }}>
            {allergies.custom.map((a) => (
              <li key={a} style={customAllergyItem}>
                {a}
                <button type="button" onClick={() => deleteCustomAllergy(a)} style={deleteButton}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

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
  );
}

/* Styles */

const inputStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  fontSize: "1rem",
  width: "100%",
  fontWeight: 500,
  transition: "all 0.2s ease",
};

const checkRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 0",
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

const deleteButton: React.CSSProperties = {
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  border: "none",
  borderRadius: 8,
  color: "white",
  padding: "4px 10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
};

const customAllergyItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
  padding: "10px 14px",
  borderRadius: 10,
  marginBottom: 8,
  fontSize: "0.95rem",
  alignItems: "center",
  fontWeight: 600,
  border: "2px solid #f9a8d4",
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
