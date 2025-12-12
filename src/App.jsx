// src/App.jsx
import { useEffect, useState } from "react";
import firebaseClient, { rtdb, ensureUserNumericMapping, createNumericApartmentId } from "./firebaseClient.js";
import { ref, get } from "firebase/database";
import ProfileSetup from "./profileSetup.jsx";
import AddMealForm from "./components/AddMealForm.jsx";
import MealList from "./components/MealList.jsx";
import CreateMeal from "./components/CreateMeal.jsx";
import { createOrUpdateUserNumeric, getAllUsersNumeric, getMealsForNumericUser, recordMealNumeric } from "./index.js";
import MealLedger from "./components/MealLedger.jsx";

const { auth, loginWithGoogle } = firebaseClient;

export default function App() {
  const [authUser, setAuthUser] = useState(null);     // firebase auth user
  const [myId, setMyId] = useState(null);             // numeric id (string)
  const [profile, setProfile] = useState(null);       // users/{id}
  const [needsProfile, setNeedsProfile] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);   // array of {id, first_name,...}
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(false);

  // Load a numeric user's profile
  async function loadProfile(numericId) {
    const snap = await get(ref(rtdb, `users/${numericId}`));
    return snap.exists() ? snap.val() : null;
  }

  // load other users
  async function loadOtherUsers(myNumericId) {
    const all = await getAllUsersNumeric();
    const arr = Object.entries(all || {})
      .filter(([id]) => id !== String(myNumericId))
      .map(([id, u]) => ({ id, ...u }));
    return arr;
  }

  // load meals row and normalize
  async function loadMealLedger(myNumericId, othersArr) {
    const ledger = await getMealsForNumericUser(myNumericId);
    const normalized = {};
    (othersArr || []).forEach((u) => {
      normalized[u.id] = ledger && ledger[u.id] !== undefined ? ledger[u.id] : 0;
    });
    setMeals(normalized);
  }

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setAuthUser(u);
      if (!u) {
        setMyId(null);
        setProfile(null);
        setNeedsProfile(false);
        setOtherUsers([]);
        setMeals({});
        return;
      }

      setLoading(true);

      // ensure mapping exists (create id mapping & placeholder user if needed)
      const numericId = await ensureUserNumericMapping(u.uid);
      setMyId(numericId);

      // load profile; if missing required fields -> needsProfile true
      const prof = await loadProfile(numericId);
      if (!prof || !prof.first_name) {
        setNeedsProfile(true);
        setProfile(null);
      } else {
        setProfile(prof);
        setNeedsProfile(false);
        // fetch others and ledger
        const others = await loadOtherUsers(numericId);
        setOtherUsers(others);
        await loadMealLedger(numericId, others);
      }

      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Called by ProfileSetup when user fills form
  async function handleProfileComplete(profileData) {
    if (!myId || !authUser) throw new Error("missing auth or numeric id");

    setLoading(true);

    // create apartment if requested
    let aptId = profileData.apartmentId ?? null;
    if (profileData.newApartment) {
      aptId = await createNumericApartmentId(profileData.newApartment.name, profileData.newApartment.address);
    }

    const profileObj = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      apartment: aptId,
      uid: authUser.uid
    };

    // write profile and initialize meals (createOrUpdateUserNumeric ensures meals exist & zeros)
    await createOrUpdateUserNumeric(String(myId), profileObj);

    // reload state
    const prof = await loadProfile(String(myId));
    setProfile(prof);
    setNeedsProfile(false);

    const others = await loadOtherUsers(String(myId));
    setOtherUsers(others);
    await loadMealLedger(String(myId), others);

    setLoading(false);
  }

  // Add meal handler (numeric ids passed from AddMealForm)
  async function handleAddMeal(hostId, count) {
    if (!myId) return;
    setLoading(true);
    await recordMealNumeric(String(myId), String(hostId), Number(count));
    // local update
    setMeals((prev) => ({ ...prev, [hostId]: (prev[hostId] || 0) + Number(count) }));
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 30, fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f7fafc", minHeight: '100vh' }}>
      {!authUser ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
          <button onClick={loginWithGoogle} style={{ padding: '12px 20px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>
            Login with Google
          </button>
        </div>
      ) : needsProfile ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <ProfileSetup user={authUser} onComplete={handleProfileComplete} />
        </div>
      ) : (
        <>
          <h1 style={{ color: '#1f2937' }}>Welcome back, {profile ? `${profile.first_name} ${profile.last_name}` : authUser.displayName}!</h1>

          <MealLedger currentUserId={myId}/>

          <CreateMeal onCreated={(mealId) => {
            // optional: refresh lists / ledger if desired, or console.log
            console.log("New meal created:", mealId);
            // Optionally reload meal matrix or other state here
          }} />
        </>
      )}
    </div>
  );
}
