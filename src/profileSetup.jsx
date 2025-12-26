// src/profileSetup.jsx
import { useEffect, useState } from "react";
import { rtdb } from "./firebaseClient.js";
import { ref, get } from "firebase/database";

export default function ProfileSetup({ user, onComplete }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newApartmentName, setNewApartmentName] = useState("");
  const [newApartmentAddress, setNewApartmentAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Foods user can bring
  const foodOptions = [
    "Drinks",
    "Dessert",
    "Salad",
    "Main Dish",
    "Snacks",
    "Sides",
    "Utensils",
  ];
  const [canBring, setCanBring] = useState({});

  // Allergies
  const allergyPresets = [
    { key: "gluten_free", label: "Gluten-free" },
    { key: "dairy_free", label: "Dairy-free" },
    { key: "vegan", label: "Vegan" },
    { key: "vegetarian", label: "Vegetarian" },
    { key: "nut_allergy", label: "Nut Allergy" },
  ];
  const [allergies, setAllergies] = useState({});
  const [customAllergyInput, setCustomAllergyInput] = useState("");
  const [customAllergies, setCustomAllergies] = useState([]);

  // Load apartments
  useEffect(() => {
    async function fetchApartments() {
      const snap = await get(ref(rtdb, "apartments"));
      const data = snap.exists() ? snap.val() : {};
      const list = Object.entries(data).map(([id, apt]) => ({ id, ...apt }));
      setApartments(list);
    }
    fetchApartments();
  }, []);

  const toggleCanBring = (item) => {
    setCanBring((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleAllergy = (key) => {
    setAllergies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergyInput.trim();
    if (!trimmed || customAllergies.includes(trimmed)) return;
    setCustomAllergies((prev) => [...prev, trimmed]);
    setCustomAllergyInput("");
  };

  const deleteCustomAllergy = (item) => {
    setCustomAllergies((prev) => prev.filter((a) => a !== item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setSubmitting(true);

    const profileData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      can_bring: canBring,
      allergies: {
        ...allergies,
        custom: customAllergies,
      },
    };

    if (createNew) {
      profileData.newApartment = {
        name: newApartmentName.trim(),
        address: newApartmentAddress.trim(),
      };
    } else {
      profileData.apartmentId = selectedApartment;
    }

    await onComplete(profileData);
    setSubmitting(false);
  };

  const isDisabled =
    !firstName.trim() ||
    !lastName.trim() ||
    (createNew
      ? !newApartmentName.trim() || !newApartmentAddress.trim()
      : !selectedApartment);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
        background: "#eef2f7",
        minHeight: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 520,
          gap: 20,
          backgroundColor: "white",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#1f2937",
            textAlign: "center",
            fontSize: "1.8rem",
          }}
        >
          Create Your Profile
        </h2>
        <p
          style={{
            marginTop: -4,
            marginBottom: 12,
            color: "#4b5563",
            textAlign: "center",
          }}
        >
          Tell us about yourself so you can join meals.
        </p>

        {/* name */}
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

        {/* apartment selector */}
        <select
          value={createNew ? "new" : selectedApartment}
          onChange={(e) => {
            if (e.target.value === "new") {
              setCreateNew(true);
              setSelectedApartment("");
            } else {
              setCreateNew(false);
              setSelectedApartment(e.target.value);
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

        {createNew && (
          <>
            <input
              placeholder="Apartment name"
              value={newApartmentName}
              onChange={(e) => setNewApartmentName(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Apartment address"
              value={newApartmentAddress}
              onChange={(e) => setNewApartmentAddress(e.target.value)}
              style={inputStyle}
            />
          </>
        )}

        {/* Foods they can bring */}
        <SectionTitle text="What can you bring?" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {foodOptions.map((item) => (
            <label key={item} style={checkRowStyle}>
              <input
                type="checkbox"
                checked={!!canBring[item]}
                onChange={() => toggleCanBring(item)}
              />
              {item}
            </label>
          ))}
        </div>

        {/* Allergies */}
        <SectionTitle text="Allergies / Dietary Restrictions" />
        {allergyPresets.map((a) => (
          <label key={a.key} style={checkRowStyle}>
            <input
              type="checkbox"
              checked={!!allergies[a.key]}
              onChange={() => toggleAllergy(a.key)}
            />
            {a.label}
          </label>
        ))}

        {/* custom allergies */}
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

        {customAllergies.length > 0 && (
          <ul style={{ marginTop: 10, paddingLeft: 0 }}>
            {customAllergies.map((a) => (
              <li key={a} style={customAllergyItem}>
                {a}
                <button type="button" onClick={() => deleteCustomAllergy(a)} style={deleteButton}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={isDisabled || submitting}
          style={{
            padding: "14px 0",
            borderRadius: 10,
            border: "none",
            backgroundColor: isDisabled ? "#a5b4fc" : "#4f46e5",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: isDisabled ? "not-allowed" : "pointer",
            marginTop: 14,
          }}
        >
          {submitting ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

/* ---------- STYLES ---------- */

const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  width: "100%",
};

const checkRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 0",
};

const primarySmallButton = {
  marginTop: 8,
  padding: "8px 14px",
  backgroundColor: "#4f46e5",
  border: "none",
  borderRadius: 8,
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteButton = {
  background: "#ef4444",
  border: "none",
  borderRadius: 6,
  color: "white",
  padding: "2px 8px",
  cursor: "pointer",
};

const customAllergyItem = {
  display: "flex",
  justifyContent: "space-between",
  background: "#eef2ff",
  padding: "6px 10px",
  borderRadius: 6,
  marginBottom: 6,
  fontSize: "0.9rem",
  alignItems: "center",
};

function SectionTitle({ text }) {
  return (
    <h3
      style={{
        marginTop: 12,
        marginBottom: 6,
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "#374151",
      }}
    >
      {text}
    </h3>
  );
}
