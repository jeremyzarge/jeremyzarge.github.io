import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import type { User } from "firebase/auth";
import firebaseClient, { rtdb, ensureUserNumericMapping, createNumericApartmentId, loginWithGoogle } from "./firebaseClient";
import { createOrUpdateUserNumeric } from "./index";
import { fetchAllUsers, fetchAllApartments } from "./utils";
import ProfileSetup from "./profileSetup";
import MealEditor from "./components/MealEditor";
import MyMeals from "./components/MyMeals";
import MealLedger from "./components/MealLedger";
import Tabs from "./components/Tabs";
import FloatingAddButton from "./components/FloatingAddButton";
import ProfileEditor from "./components/ProfileEditor";
import type { UserProfile, Apartment, UserWithId, CanBring, Allergies } from "./types";

const { auth } = firebaseClient;

interface ProfileData {
  first_name: string;
  last_name: string;
  can_bring: CanBring;
  allergies: Allergies;
  apartmentId?: string;
  newApartment?: { name: string; address: string };
}

/**
 * Main application component
 */
export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ledger" | "past" | "upcoming">("ledger");
  const [showCreate, setShowCreate] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Cache for users and apartments (loaded once when profile exists)
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  /**
   * Load user profile from database
   */
  async function loadProfile(numericId: string): Promise<UserProfile | null> {
    const snap = await get(ref(rtdb, `users/${numericId}`));
    return snap.exists() ? (snap.val() as UserProfile) : null;
  }

  /**
   * Handle authentication state changes
   */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setAuthUser(u);
      if (!u) {
        setMyId(null);
        setProfile(null);
        setNeedsProfile(false);
        setUsers([]);
        setApartments([]);
        return;
      }

      setLoading(true);

      const numericId = await ensureUserNumericMapping(u.uid);
      setMyId(numericId);

      const prof = await loadProfile(numericId);
      if (!prof || !prof.first_name) {
        setNeedsProfile(true);
        setProfile(null);
      } else {
        setProfile(prof);
        setNeedsProfile(false);

        // Load users and apartments using utils functions
        const [allUsers, allApartments] = await Promise.all([
          fetchAllUsers(),
          fetchAllApartments(),
        ]);

        setUsers(allUsers);
        setApartments(allApartments);
      }

      setLoading(false);
    });
    return () => unsub();
  }, []);

  /**
   * Handle profile setup completion
   */
  async function handleProfileComplete(profileData: ProfileData) {
    if (!myId || !authUser) throw new Error("Missing auth or numeric id");
    setLoading(true);

    let aptId: string | null = profileData.apartmentId ?? null;
    if (profileData.newApartment) {
      aptId = await createNumericApartmentId(
        profileData.newApartment.name,
        profileData.newApartment.address
      );
    }

    const profileObj: UserProfile = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      apartment: aptId || "",
      uid: authUser.uid,
      can_bring: profileData.can_bring,
      allergies: profileData.allergies,
      placeholder: false,
    };

    await createOrUpdateUserNumeric(myId, profileObj);

    const prof = await loadProfile(myId);
    setProfile(prof);
    setNeedsProfile(false);

    // Load users and apartments
    const [allUsers, allApartments] = await Promise.all([
      fetchAllUsers(),
      fetchAllApartments(),
    ]);

    setUsers(allUsers);
    setApartments(allApartments);

    setLoading(false);
  }

  /**
   * Refresh meals list after creating a new meal
   */
  function refreshMeals() {
    // Trigger re-render by updating a key prop or refetching data
    // MyMeals will automatically refetch on mount
    setActiveTab((prev) => prev);
  }

  /**
   * Handle profile editor save - reload profile and users
   */
  async function handleProfileSaved() {
    if (!myId) return;
    setLoading(true);

    const prof = await loadProfile(myId);
    setProfile(prof);

    // Reload users and apartments
    const [allUsers, allApartments] = await Promise.all([
      fetchAllUsers(),
      fetchAllApartments(),
    ]);

    setUsers(allUsers);
    setApartments(allApartments);

    setLoading(false);
    setShowProfileEditor(false);
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // Show login screen if not authenticated
  if (!authUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 20,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: 40,
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
            border: "4px solid transparent",
            backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: 12,
              fontWeight: 900,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "2.2rem",
              letterSpacing: "-0.5px",
            }}
          >
            VitePotLock
          </h1>
          <p style={{ color: "#6b7280", marginBottom: 24, fontSize: "1.05rem" }}>
            Sign in to manage your Shabbat meals
          </p>
          <button
            onClick={() => loginWithGoogle()}
            style={{
              padding: "14px 28px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>G</span>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Show profile setup if user is authenticated but needs to create profile
  if (needsProfile && myId) {
    return <ProfileSetup user={authUser} onComplete={handleProfileComplete} />;
  }

  // Show loading if we're still fetching profile data
  if (!profile || !myId) {
    return <div style={{ padding: 20 }}>Loading profile…</div>;
  }

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ color: "white", margin: 0, textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
          Welcome back,{" "}
          {profile?.first_name
            ? `${profile.first_name} ${profile.last_name}`
            : authUser?.displayName ?? "User"}
          !
        </h1>
        <button
          onClick={() => setShowProfileEditor(true)}
          style={{
            padding: "12px 20px",
            borderRadius: 50,
            border: "none",
            background: "white",
            color: "#4f46e5",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          title="Edit your profile"
        >
          ✏️ Edit Profile
        </button>
      </div>

      <Tabs active={activeTab} onChange={(tab) => setActiveTab(tab as "ledger" | "past" | "upcoming")} />

      {activeTab === "ledger" && <MealLedger currentUserId={myId} />}
      {activeTab === "past" && (
        <MyMeals
          myId={myId}
          users={users}
          apartments={apartments}
          mode="past"
          authUser={authUser}
        />
      )}
      {activeTab === "upcoming" && (
        <MyMeals
          myId={myId}
          users={users}
          apartments={apartments}
          mode="upcoming"
          authUser={authUser}
        />
      )}

      <FloatingAddButton onClick={() => setShowCreate(true)} />

      {showCreate && (
        <MealEditor
          authUser={authUser}
          currentUserId={myId}
          onCreated={() => {
            setShowCreate(false);
            refreshMeals();
          }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {showProfileEditor && myId && profile && (
        <ProfileEditor
          userId={myId}
          currentProfile={profile}
          onSaved={handleProfileSaved}
          onCancel={() => setShowProfileEditor(false)}
        />
      )}
    </div>
  );
}
