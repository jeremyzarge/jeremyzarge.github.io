// src/App.jsx
import { useEffect, useState } from "react";
import firebaseClient, { rtdb, ensureUserNumericMapping, createNumericApartmentId } from "./firebaseClient.js";
import { ref, get } from "firebase/database";
import ProfileSetup from "./profileSetup.jsx";
import AddMealForm from "./components/AddMealForm.jsx";
import MealList from "./components/MealList.jsx";
import CreateMeal from "./components/CreateMeal.jsx";
import MyMeals from "./components/MyMeals.jsx";
import { createOrUpdateUserNumeric, getAllUsersNumeric, getMealsForNumericUser, recordMealNumeric } from "./index.js";
import MealLedger from "./components/MealLedger.jsx";
import Tabs from "./components/Tabs.jsx";
import FloatingAddButton from "./components/FloatingAddButton.jsx";
import Modal from "./components/Modal.jsx";

const { auth, loginWithGoogle } = firebaseClient;

export default function App() {
  const [authUser, setAuthUser] = useState(null);     // firebase auth user
  const [myId, setMyId] = useState(null);             // numeric id (string)
  const [profile, setProfile] = useState(null);       // users/{id}
  const [needsProfile, setNeedsProfile] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);   // array of {id, first_name,...}
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [mealEventsVersion, setMealEventsVersion] = useState(0); // increment to trigger reload in MyMeals
  const [activeTab, setActiveTab] = useState("ledger");
  const [showCreate, setShowCreate] = useState(false);



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
      // fetch apartments
      const aptSnap = await get(ref(rtdb, "apartments"));
      const aptData = aptSnap.exists() ? aptSnap.val() : {};
      const aptList = Object.entries(aptData).map(([id, a]) => ({ id, ...a }));
      setApartments(aptList);


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

    function refreshMeals() {
      setMealEventsVersion(prev => prev + 1);
  }


  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!profile || !myId) {
  return <div style={{ padding: 20 }}>Loading profile…</div>;
}

  return (
   <>
  <h1 style={{ color: '#1f2937' }}>
  Welcome back,{" "}
  {profile?.first_name
    ? `${profile.first_name} ${profile.last_name}`
    : authUser?.displayName ?? "User"}!
</h1>

  <Tabs active={activeTab} onChange={setActiveTab} />

  {activeTab === "ledger" && (
    <MealLedger currentUserId={myId} />
  )}

  {activeTab === "past" && (
    <MyMeals
      myId={myId}
      users={otherUsers.concat({ id: myId, ...profile })}
      apartments={apartments}
      mode="past"
    />
  )}

  {activeTab === "upcoming" && (
    <MyMeals
      myId={myId}
      users={otherUsers.concat({ id: myId, ...profile })}
      apartments={apartments}
      mode="upcoming"
    />
  )}

  <FloatingAddButton onClick={() => setShowCreate(true)} />

  {showCreate && (
    <Modal onClose={() => setShowCreate(false)}>
      <CreateMeal
        onCreated={() => {
          setShowCreate(false);
          refreshMeals();
        }}
      />
    </Modal>
  )}
</>);
}
