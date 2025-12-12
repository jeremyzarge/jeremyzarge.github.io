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

  useEffect(() => {
    async function fetchApartments() {
      const snap = await get(ref(rtdb, "apartments"));
      const data = snap.exists() ? snap.val() : {};
      const list = Object.entries(data).map(([id, apt]) => ({
        id,
        ...apt,
      }));
      setApartments(list);
    }
    fetchApartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;
    setSubmitting(true);

    const profileData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
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
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        gap: 12,
        marginTop: 20,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(12,20,50,0.06)",
      }}
    >
      <h2 style={{ margin: 0 }}>Create your profile</h2>
      <p style={{ marginTop: 6, marginBottom: 10, color: "#555" }}>
        Enter your name and apartment so others can add meals with you.
      </p>

      <input
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e6e9ef",
        }}
        autoFocus
      />

      <input
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e6e9ef",
        }}
      />

      {/* ----- APARTMENT SELECT ----- */}
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
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e6e9ef",
          color: createNew ? "#2563eb" : "black",
          fontWeight: createNew ? "600" : "normal",
        }}
      >
        <option value="">-- Select Existing Apartment --</option>

        {apartments.map((apt) => (
          <option key={apt.id} value={apt.id}>
            {apt.name} — {apt.address}
          </option>
        ))}

        {/* Styled NEW APARTMENT OPTION */}
        <option
          value="new"
          style={{ color: "#2563eb", fontWeight: "600" }}
        >
          + Create New Apartment
        </option>
      </select>

      {/* ----- NEW APARTMENT FIELDS ----- */}
      {createNew && (
        <>
          <input
            placeholder="Apartment name"
            value={newApartmentName}
            onChange={(e) => setNewApartmentName(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />

          <input
            placeholder="Apartment address"
            value={newApartmentAddress}
            onChange={(e) => setNewApartmentAddress(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />
        </>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={isDisabled || submitting}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            backgroundColor: isDisabled ? "#ccc" : "#2563eb",
            color: "white",
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
