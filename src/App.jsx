// src/App.jsx
import { useEffect, useState } from "react";
import firebaseClient, { rtdb, ensureUserNumericMapping, createNumericApartmentId } from "./firebaseClient.js";
import { ref, get } from "firebase/database";
import ProfileSetup from "./profileSetup.jsx";
import CreateMeal from "./components/CreateMeal.jsx";
import MyMeals from "./components/MyMeals.jsx";
import { createOrUpdateUserNumeric, getAllUsersNumeric, getMealsForNumericUser, recordMealNumeric } from "./index.js";
import MealLedger from "./components/MealLedger.jsx";
import Tabs from "./components/Tabs.jsx";
import FloatingAddButton from "./components/FloatingAddButton.jsx";
import Modal from "./components/Modal.jsx";

const { auth, loginWithGoogle } = firebaseClient;

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [myId, setMyId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [mealEventsVersion, setMealEventsVersion] = useState(0);
  const [activeTab, setActiveTab] = useState("ledger");
  const [showCreate, setShowCreate] = useState(false);

  async function loadProfile(numericId) {
    const snap = await get(ref(rtdb, `users/${numericId}`));
    return snap.exists() ? snap.val() : null;
  }

  async function loadOtherUsers(myNumericId) {
    const all = await getAllUsersNumeric();
    return Object.entries(all || {})
      .filter(([id]) => id !== String(myNumericId))
      .map(([id, u]) => ({ id, ...u }));
  }

  async function loadMealLedger(myNumericId, othersArr) {
    const ledger = await getMealsForNumericUser(myNumericId);
    const normalized = {};
    (othersArr || []).forEach((u) => {
      normalized[u.id] = ledger && ledger[u.id] !== undefined ? ledger[u.id] : 0;
    });
    setMeals(normalized);
  }

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

      const numericId = await ensureUserNumericMapping(u.uid);
      setMyId(numericId);

      const prof = await loadProfile(numericId);
      if (!prof || !prof.first_name) {
        setNeedsProfile(true);
        setProfile(null);
      } else {
        setProfile(prof);
        setNeedsProfile(false);
        const others = await loadOtherUsers(numericId);
        setOtherUsers(others);
        await loadMealLedger(numericId, others);
      }

      const aptSnap = await get(ref(rtdb, "apartments"));
      const aptData = aptSnap.exists() ? aptSnap.val() : {};
      const aptList = Object.entries(aptData).map(([id, a]) => ({ id, ...a }));
      setApartments(aptList);

      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleProfileComplete(profileData) {
    if (!myId || !authUser) throw new Error("missing auth or numeric id");
    setLoading(true);

    let aptId = profileData.apartmentId ?? null;
    if (profileData.newApartment) {
      aptId = await createNumericApartmentId(profileData.newApartment.name, profileData.newApartment.address);
    }

    // Include new fields: can_bring + allergies
    const profileObj = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      apartment: aptId,
      uid: authUser.uid,
      can_bring: profileData.can_bring || {},
      allergies: profileData.allergies || {},
    };

    await createOrUpdateUserNumeric(String(myId), profileObj);

    const prof = await loadProfile(String(myId));
    setProfile(prof);
    setNeedsProfile(false);

    const others = await loadOtherUsers(String(myId));
    setOtherUsers(others);
    await loadMealLedger(String(myId), others);

    setLoading(false);
  }

  async function handleAddMeal(hostId, count) {
    if (!myId) return;
    setLoading(true);
    await recordMealNumeric(String(myId), String(hostId), Number(count));
    setMeals((prev) => ({ ...prev, [hostId]: (prev[hostId] || 0) + Number(count) }));
    setLoading(false);
  }

  function refreshMeals() {
    setMealEventsVersion((prev) => prev + 1);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (needsProfile && authUser && myId) {
    return <ProfileSetup user={authUser} onComplete={handleProfileComplete} />;
  }

  if (!profile || !myId) return <div style={{ padding: 20 }}>Loading profile…</div>;

  return (
    <>
      <h1 style={{ color: "#1f2937" }}>
        Welcome back, {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : authUser?.displayName ?? "User"}!
      </h1>

      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "ledger" && <MealLedger currentUserId={myId} />}
      {activeTab === "past" && <MyMeals myId={myId} users={otherUsers.concat({ id: myId, ...profile })} apartments={apartments} mode="past" />}
      {activeTab === "upcoming" && <MyMeals myId={myId} users={otherUsers.concat({ id: myId, ...profile })} apartments={apartments} mode="upcoming" />}

      <FloatingAddButton onClick={() => setShowCreate(true)} />

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <CreateMeal onCreated={() => { setShowCreate(false); refreshMeals(); }} />
        </Modal>
      )}
    </>
  );
}
