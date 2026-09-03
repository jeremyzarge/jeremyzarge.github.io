import { useEffect, useState, useMemo, useRef } from "react";
import { ref, get, set, remove, onValue, off } from "firebase/database";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import firebaseClient, { rtdb, ensureUserNumericMapping, createNumericApartmentId, loginWithGoogle, redirectSignInError, isLikelyInAppBrowser } from "./firebaseClient";
import { createOrUpdateUserNumeric } from "./index";
import { fetchAllUsers, fetchAllApartments, getCurrentWeekStart } from "./utils";
import { subscribeToRelationships, getFriendIds } from "./friendsService";
import ProfileSetup from "./profileSetup";
import MealEditor from "./components/MealEditor";
import MyMeals from "./components/MyMeals";
import MealLedger from "./components/MealLedger";
import Tabs from "./components/Tabs";
import FloatingAddButton from "./components/FloatingAddButton";
import ProfileEditor from "./components/ProfileEditor";
import FriendsTab from "./components/FriendsTab";
import UserProfileView from "./components/UserProfileView";
import ApartmentProfileView from "./components/ApartmentProfileView";
import type { UserProfile, Apartment, UserWithId, UserRelationship, CanBring, Allergies, ApartmentInvite } from "./types";
import { claimMealInvite, claimFriendInvite, generateMealInviteUrl, generateFriendInviteUrl } from "./inviteService";
import { initPushNotifications, removePushSubscription, notifyUsers, logClientError, logEvent } from "./notifications";
import {
  subscribeToUserInvites,
  acceptApartmentInvite,
  declineApartmentInvite,
  clearAllInvitesForUser,
  requestToJoinApartment,
  cancelJoinRequest,
} from "./apartmentService";
import { createOTReservation, cancelOTReservation, isOneTableAuthError, OT_RECONNECT_MESSAGE, hostAcceptReservation } from "./onetableService";
import NotificationPrefsModal from "./components/NotificationPrefsModal";
import DataSecurityModal from "./components/DataSecurityModal";
import HeaderPillButton from "./components/HeaderPillButton";
import AdminStats from "./components/AdminStats";
import WeeklyStatusPrompt from "./components/WeeklyStatusPrompt";

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
  // Capture URL params once on load, then strip them from the bar.
  // Also fall back to sessionStorage: signInWithRedirect does a full page
  // navigation away and back, which destroys these refs — sessionStorage
  // (written in the effect below) survives that round trip.
  const pendingInviteToken = useRef<string | null>(
    new URLSearchParams(window.location.search).get("invite") ?? sessionStorage.getItem("_invite_pending")
  );
  const pendingFriendInviteId = useRef<string | null>(
    new URLSearchParams(window.location.search).get("friend_invite") ?? sessionStorage.getItem("_friend_invite_pending")
  );
  const pendingNotifData = useRef<Record<string, string> | null>((() => {
    const param = new URLSearchParams(window.location.search).get("notif");
    if (!param) return null;
    try { return JSON.parse(atob(param)); } catch { return null; }
  })());
  // Token arrives via postMessage from the bookmarklet (no URL params ever).
  // sessionStorage is a fallback in case the component remounts before auth fires.
  const pendingOTToken = useRef<string | null>(
    sessionStorage.getItem("_ot_pending")
  );
  useEffect(() => {
    const url = new URL(window.location.href);
    let changed = false;
    if (pendingInviteToken.current) {
      sessionStorage.setItem("_invite_pending", pendingInviteToken.current);
      url.searchParams.delete("invite");
      changed = true;
    }
    if (pendingFriendInviteId.current) {
      sessionStorage.setItem("_friend_invite_pending", pendingFriendInviteId.current);
      url.searchParams.delete("friend_invite");
      changed = true;
    }
    if (pendingNotifData.current) { url.searchParams.delete("notif"); changed = true; }
    if (changed) window.history.replaceState({}, "", url.toString());
  }, []);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"ledger" | "past" | "upcoming" | "friends" | "profile">("ledger");
  const [showCreate, setShowCreate] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Prevent duplicate saves when the bookmarklet fires postMessage multiple times
  const otSaved = useRef(false);

  // Receive the OneTable token from the bookmarklet via postMessage (no URL params).
  // The bookmarklet opens this page and fires {ot_token} repeatedly until we ACK by saving.
  useEffect(() => {
    const OT_ORIGINS = ["https://dinners.onetable.org", "https://onetable.org"];
    async function handleOTMessage(e: MessageEvent) {
      if (!OT_ORIGINS.includes(e.origin)) return;
      const token = e.data?.ot_token;
      if (typeof token !== "string" || !token || otSaved.current) return;
      pendingOTToken.current = token;
      sessionStorage.setItem("_ot_pending", token);
      const currentUser = auth.currentUser;
      if (currentUser) {
        otSaved.current = true;
        try {
          const numericId = await ensureUserNumericMapping(currentUser.uid);
          await set(ref(rtdb, `private/${numericId}/onetable_token`), token);
          logEvent("onetable_connected", { userId: numericId, via: "bookmarklet" });
          pendingOTToken.current = null;
          sessionStorage.removeItem("_ot_pending");
          const freshProfile = await loadProfile(numericId);
          if (freshProfile) setProfile(freshProfile);
          setActiveTab("profile");
          // Only open editor for first-time setup (no existing config)
          if (!freshProfile?.onetable_config) {
            setShowProfileEditor(true);
          }
        } catch (err) {
          otSaved.current = false;
          console.error("Failed to save OneTable token:", err);
        }
      }
    }
    window.addEventListener("message", handleOTMessage);
    return () => window.removeEventListener("message", handleOTMessage);
  }, []);
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string | null>(null);
  const [viewingMealId, setViewingMealId] = useState<string | null>(null);
  const [viewingInvitedMealId, setViewingInvitedMealId] = useState<string | null>(null);
  const [viewingApartmentId, setViewingApartmentId] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [showNotifPrefs, setShowNotifPrefs] = useState(false);
  const [showDataSecurity, setShowDataSecurity] = useState(false);
  const [showAdminStats, setShowAdminStats] = useState(false);
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);
  const [pwaBannerDismissed, setPwaBannerDismissed] = useState(
    () => localStorage.getItem("pwa_banner_dismissed") === "1"
  );
  const isMobilePWACandidate =
    window.innerWidth <= 768 && !window.matchMedia("(display-mode: standalone)").matches;
  const [showWeeklyStatusPrompt, setShowWeeklyStatusPrompt] = useState(false);
  const isAdmin = authUser?.email === "jeremyzarge@gmail.com";

  // Cache for users and apartments (loaded once when profile exists)
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  // Apartment invites for current user
  const [aptInvites, setAptInvites] = useState<ApartmentInvite[]>([]);

  // Friends / relationships
  const [relationships, setRelationships] = useState<Record<string, UserRelationship>>({});
  const friendIds = useMemo(() => getFriendIds(relationships), [relationships]);

  /** Navigate to the right screen based on notification data */
  function handleNotifNavigation(data: Record<string, string>) {
    const tab = data.tab as typeof activeTab | undefined;
    if (tab) setActiveTab(tab);
    if (data.aptId) setViewingApartmentId(data.aptId);
    if (data.mealId) {
      if (data.invited === "true") {
        setViewingInvitedMealId(data.mealId);
      } else {
        setViewingMealId(data.mealId);
      }
    }
    if (data.userId) setViewingProfileUserId(data.userId);
  }

  // Listen for postMessage from service worker (app already open case)
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "notification-click") return;
      handleNotifNavigation(event.data.data || {});
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  // Clear the app icon badge and any lingering tray notifications once the
  // user has actually seen the app (covers opening via icon tap, not just
  // clicking a specific notification).
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    async function clearBadge() {
      if (document.visibilityState !== "visible") return;
      if ("clearAppBadge" in navigator) navigator.clearAppBadge();
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      notifications.forEach((n) => n.close());
    }
    clearBadge();
    document.addEventListener("visibilitychange", clearBadge);
    return () => document.removeEventListener("visibilitychange", clearBadge);
  }, []);

  // Apply cold-start notification nav once the profile is ready
  useEffect(() => {
    if (!profile || !myId || !pendingNotifData.current) return;
    const data = pendingNotifData.current;
    pendingNotifData.current = null;
    handleNotifNavigation(data);
  }, [profile, myId]);

  /**
   * Load user profile from database
   */
  async function loadProfile(numericId: string): Promise<UserProfile | null> {
    const [snap, privateSnap] = await Promise.all([
      get(ref(rtdb, `users/${numericId}`)),
      get(ref(rtdb, `private/${numericId}`)),
    ]);
    if (!snap.exists()) return null;
    return { ...snap.val(), ...(privateSnap.exists() ? privateSnap.val() : {}) } as UserProfile;
  }

  // Surface a friendly message if a redirect-based sign-in (the fallback used
  // by in-app browsers / popup-blocked mobile browsers) failed to complete.
  useEffect(() => {
    redirectSignInError.then((msg) => {
      if (msg) setAuthError(msg);
    });
  }, []);

  /**
   * Handle authentication state changes
   */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setAuthInitialized(true);
      // If user manually signed out, immediately sign out again to prevent
      // Firebase/OS credential manager from re-authenticating silently
      if (u && localStorage.getItem("manually_signed_out") === "1") {
        await signOut(auth);
        return;
      }
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
      setAuthError(null);

      try {
        const numericId = await ensureUserNumericMapping(u.uid);
        setMyId(numericId);
        // Fires each time auth resolves, including silent session restores on
        // reload — not just fresh interactive sign-ins.
        logEvent("user_login", { userId: numericId });

        // Auto-save email from Google auth if not already stored
        if (u.email) {
          const emailSnap = await get(ref(rtdb, `private/${numericId}/email`));
          if (!emailSnap.exists() || emailSnap.val() !== u.email) {
            await set(ref(rtdb, `private/${numericId}/email`), u.email);
          }
        }

        // Save OneTable token if it arrived via postMessage before auth was ready
        let justSavedOT = false;
        const otToken = pendingOTToken.current || sessionStorage.getItem("_ot_pending");
        if (otToken && !otSaved.current) {
          otSaved.current = true;
          try {
            await set(ref(rtdb, `private/${numericId}/onetable_token`), otToken);
            logEvent("onetable_connected", { userId: numericId, via: "bookmarklet" });
            pendingOTToken.current = null;
            sessionStorage.removeItem("_ot_pending");
            justSavedOT = true;
          } catch (err) {
            otSaved.current = false;
            console.error("Failed to save OneTable token:", err);
          }
        }

        const prof = await loadProfile(numericId);
        if (!prof || !prof.first_name) {
          setNeedsProfile(true);
          setProfile(null);
        } else {
          setProfile(prof);
          setNeedsProfile(false);
          if (justSavedOT) {
            setActiveTab("profile");
            if (!prof?.onetable_config) {
              setShowProfileEditor(true);
            }
          }

          // Load users and apartments using utils functions
          const [allUsers, allApartments] = await Promise.all([
            fetchAllUsers(),
            fetchAllApartments(),
          ]);

          setUsers(allUsers);
          setApartments(allApartments);

          // Register this device for push notifications (non-blocking)
          initPushNotifications(numericId);

          // Claim a pending meal invite link if one was in the URL. A malformed
          // or garbage token (bad paste, corrupted link) shouldn't be able to
          // take down the rest of sign-in — isolate it and just show an
          // invite-specific error instead.
          if (pendingInviteToken.current) {
            const token = pendingInviteToken.current;
            pendingInviteToken.current = null;
            sessionStorage.removeItem("_invite_pending");
            try {
              const mealId = await claimMealInvite(token, numericId);
              if (mealId) await handleInviteNavigation(mealId, numericId);
              else setInviteError("This invite link is no longer valid.");
            } catch (err) {
              console.error("Failed to claim meal invite:", err);
              logClientError("meal_invite_claim_failed", {
                message: err instanceof Error ? err.message : String(err),
              });
              setInviteError("This invite link is no longer valid.");
            }
          }

          // Claim a pending friend invite link if one was in the URL — same
          // isolation as above.
          if (pendingFriendInviteId.current) {
            const inviterId = pendingFriendInviteId.current;
            pendingFriendInviteId.current = null;
            sessionStorage.removeItem("_friend_invite_pending");
            try {
              await claimFriendInvite(inviterId, numericId);
              setActiveTab("friends");
            } catch (err) {
              console.error("Failed to claim friend invite:", err);
              logClientError("friend_invite_claim_failed", {
                message: err instanceof Error ? err.message : String(err),
              });
              setInviteError("This invite link is no longer valid.");
            }
          }
        }
      } catch (err) {
        // Surfaced so a failed sign-in shows a message instead of silently
        // sitting on the login screen with no explanation.
        console.error("Sign-in setup failed:", err);
        logClientError("sign_in_setup_failed", {
          code: (err as { code?: string })?.code,
          message: err instanceof Error ? err.message : String(err),
        });
        setAuthError("Something went wrong signing you in. Please try again.");
        setAuthUser(null);
      }

      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to relationships when logged in
  useEffect(() => {
    if (!myId) {
      setRelationships({});
      return;
    }
    return subscribeToRelationships(myId, setRelationships);
  }, [myId]);

  // Prompt for this week's Shabbat status once, on the first login on/after Sunday midnight.
  useEffect(() => {
    if (!myId || !profile) return;
    if (getCurrentWeekStart() !== profile.last_status_prompt_week) {
      setShowWeeklyStatusPrompt(true);
    }
  }, [myId, profile]);

  // Subscribe to apartment invites for current user
  useEffect(() => {
    if (!myId) {
      setAptInvites([]);
      return;
    }
    return subscribeToUserInvites(myId, setAptInvites);
  }, [myId]);

  // Watch own join request record for approval or rejection.
  // Approval: approver sets approved:true on the record (apartment_requests allows auth writes).
  // Rejection: approver removes the record entirely.
  // Either way, the requester's app self-updates its own user node (self-writes are always allowed).
  useEffect(() => {
    if (!myId || !profile?.pending_apartment_request) return;
    const aptId = profile.pending_apartment_request;
    const r = ref(rtdb, `apartment_requests/${aptId}/${myId}`);
    const handler = async (snap: any) => {
      if (snap.exists() && !snap.val()?.approved) return; // still pending, nothing to do
      if (snap.exists() && snap.val()?.approved) {
        // Approved — set our own apartment, clean up request, clear all outstanding invites
        await Promise.all([
          set(ref(rtdb, `users/${myId}/apartment`), aptId),
          remove(ref(rtdb, `users/${myId}/pending_apartment_request`)),
          remove(ref(rtdb, `apartment_requests/${aptId}/${myId}`)),
        ]);
        logEvent("apartment_joined", { userId: myId, aptId });
        await clearAllInvitesForUser(myId);
      } else {
        // Rejected — clear pending
        await remove(ref(rtdb, `users/${myId}/pending_apartment_request`));
      }
      await refreshProfileAndUsers();
    };
    onValue(r, handler);
    return () => off(r, "value", handler);
  }, [myId, profile?.pending_apartment_request]);

  /** Refresh profile + user/apartment lists without closing any modals */
  async function refreshProfileAndUsers() {
    if (!myId) return;
    const [prof, allUsers, allApartments] = await Promise.all([
      loadProfile(myId),
      fetchAllUsers(),
      fetchAllApartments(),
    ]);
    setProfile(prof);
    setUsers(allUsers);
    setApartments(allApartments);
  }

  /**
   * Handle profile setup completion
   */
  async function handleProfileComplete(profileData: ProfileData) {
    if (!myId || !authUser) throw new Error("Missing auth or numeric id");
    setLoading(true);

    let aptId: string | null = null;
    let pendingAptId: string | undefined;

    if (profileData.newApartment) {
      aptId = await createNumericApartmentId(
        profileData.newApartment.name,
        profileData.newApartment.address
      );
      logEvent("apartment_created", { userId: myId, aptId });
    } else if (profileData.apartmentId) {
      // Requesting to join an existing apartment
      pendingAptId = profileData.apartmentId;
    }

    const profileObj: UserProfile = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      apartment: aptId || "",
      uid: authUser.uid,
      can_bring: profileData.can_bring,
      allergies: profileData.allergies,
      placeholder: false,
      ...(pendingAptId ? { pending_apartment_request: pendingAptId } : {}),
    };

    await createOrUpdateUserNumeric(myId, profileObj);
    logEvent("profile_created", { userId: myId });

    // Write the join request and notify members
    if (pendingAptId) {
      await requestToJoinApartment(myId, pendingAptId, `${profileData.first_name} ${profileData.last_name}`.trim());
    }

    // If user is joining/creating an apartment, clear any outstanding invites
    if (aptId || pendingAptId) {
      await clearAllInvitesForUser(myId);
    }

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

    // Notify existing members of the join request
    if (pendingAptId) {
      const memberIds = allUsers.filter((u) => u.apartment === pendingAptId).map((u) => u.id);
      const myName = `${profileData.first_name} ${profileData.last_name}`.trim();
      const aptObj = allApartments.find((a) => a.id === pendingAptId);
      notifyUsers(memberIds, {
        title: "New join request",
        body: `${myName} wants to join ${aptObj?.name ?? "your apartment"}.`,
        tag: `apt-request-${pendingAptId}-${myId}`,
        data: { tab: "profile", aptId: pendingAptId },
      }, "apartment_requests");
    }

    // Claim a pending meal invite link if one was in the URL. Isolated so a
    // malformed/garbage token can't leave profile setup stuck mid-save.
    if (pendingInviteToken.current) {
      const token = pendingInviteToken.current;
      pendingInviteToken.current = null;
      sessionStorage.removeItem("_invite_pending");
      try {
        const mealId = await claimMealInvite(token, myId);
        if (mealId) await handleInviteNavigation(mealId, myId);
        else setInviteError("This invite link is no longer valid.");
      } catch (err) {
        console.error("Failed to claim meal invite:", err);
        logClientError("meal_invite_claim_failed", {
          message: err instanceof Error ? err.message : String(err),
        });
        setInviteError("This invite link is no longer valid.");
      }
    }

    // Claim a pending friend invite link if one was in the URL — same isolation.
    if (pendingFriendInviteId.current) {
      const inviterId = pendingFriendInviteId.current;
      pendingFriendInviteId.current = null;
      sessionStorage.removeItem("_friend_invite_pending");
      try {
        await claimFriendInvite(inviterId, myId);
        setActiveTab("friends");
      } catch (err) {
        console.error("Failed to claim friend invite:", err);
        logClientError("friend_invite_claim_failed", {
          message: err instanceof Error ? err.message : String(err),
        });
        setInviteError("This invite link is no longer valid.");
      }
    }

    setLoading(false);
  }

  /**
   * After claiming an invite link, decide what to open based on meal state
   */
  async function handleInviteNavigation(mealId: string, userId: string) {
    const snap = await get(ref(rtdb, `meal_events/${mealId}`));
    if (!snap.exists()) {
      setInviteError("This invite link is no longer valid.");
      return;
    }
    const meal = snap.val();
    const isPast = meal.datetime && new Date(meal.datetime) < new Date();
    const participant = meal.participants?.[userId];
    const isAccepted = participant?.accepted === true;

    if (isPast) {
      if (isAccepted) {
        // Attended — open in past meals view
        setActiveTab("past");
        setViewingMealId(mealId);
      } else {
        // Didn't attend — invalid link
        setInviteError("This meal already happened and you weren't a participant.");
      }
    } else {
      setActiveTab("upcoming");
      if (isAccepted) {
        setViewingMealId(mealId);
      } else {
        setViewingInvitedMealId(mealId);
      }
    }
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
    await refreshProfileAndUsers();
    setLoading(false);
    setShowProfileEditor(false);
  }

  // Splash screen while Firebase resolves auth from IndexedDB (prevents login flash)
  if (!authInitialized) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: 20,
      }}>
        <img src="/icon.svg" alt="ViteMeals" style={{ width: 80, height: 80, borderRadius: 20 }} />
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,255,255,0.3)",
          borderTopColor: "white",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: 20,
      }}>
        <img src="/icon.svg" alt="ViteMeals" style={{ width: 80, height: 80, borderRadius: 20 }} />
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,255,255,0.3)",
          borderTopColor: "white",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
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
          className="login-card"
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
          {isLikelyInAppBrowser() && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
                textAlign: "left",
              }}
            >
              <p style={{ margin: 0, marginBottom: 8, fontSize: "0.85rem", color: "#92400e" }}>
                It looks like you're in an in-app browser (opened from Instagram, Facebook, TikTok, or a link preview). Google sign-in often fails here — copy this link and open it in Safari or Chrome instead.
              </p>
              <button
                onClick={() => {
                  const url = pendingInviteToken.current
                    ? generateMealInviteUrl(pendingInviteToken.current)
                    : pendingFriendInviteId.current
                    ? generateFriendInviteUrl(pendingFriendInviteId.current)
                    : window.location.href;
                  navigator.clipboard.writeText(url);
                  setInviteLinkCopied(true);
                  setTimeout(() => setInviteLinkCopied(false), 2500);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #d97706",
                  background: "white",
                  color: "#92400e",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {inviteLinkCopied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          )}
          <button
            onClick={() => { localStorage.removeItem("manually_signed_out"); loginWithGoogle(); }}
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
          {authError && (
            <p style={{ color: "#dc2626", marginTop: 16, marginBottom: 0, fontSize: "0.9rem" }}>
              {authError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show profile setup if user is authenticated but needs to create profile
  if (needsProfile && myId) {
    return (
      <ProfileSetup
        user={authUser}
        onComplete={handleProfileComplete}
        onCancel={() => { localStorage.setItem("manually_signed_out", "1"); signOut(auth); }}
      />
    );
  }

  // Show loading if we're still fetching profile data
  if (!profile || !myId) {
    return <div style={{ padding: 20 }}>Loading profile…</div>;
  }

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name}`
    : authUser?.displayName ?? "User";

  const initials = (
    (profile?.first_name?.charAt(0) ?? "") +
    (profile?.last_name?.charAt(0) ?? "")
  ).toUpperCase() || "?";

  return (
    <div className="has-bottom-nav" style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>

      {/* Mobile-only banner nudging people to add the app to their home screen.
          The CSS breakpoint (not just the JS width check) is what actually keeps
          this off desktop — same convention as .mobile-hidden elsewhere. */}
      {isMobilePWACandidate && !pwaBannerDismissed && (
        <div
          className="pwa-banner mobile-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            marginBottom: 12,
            borderRadius: 12,
            background: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("pwa_banner_dismissed", "1");
              setPwaBannerDismissed(true);
              setActiveTab("profile");
              setShowPWAInstructions(true);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              background: "none",
              border: "none",
              color: "white",
              fontWeight: 700,
              fontSize: "0.85rem",
              textAlign: "left",
              cursor: "pointer",
              padding: 0,
              fontFamily: "Inter, sans-serif",
            }}
          >
            📲 Add ViteMeals to your Home Screen — tap for instructions
          </button>
          <button
            type="button"
            onClick={() => { localStorage.setItem("pwa_banner_dismissed", "1"); setPwaBannerDismissed(true); }}
            aria-label="Dismiss"
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: "pointer",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Desktop welcome header — hidden on mobile (profile tab handles it) */}
      <div className="welcome-header mobile-hidden" style={{ marginBottom: 24 }}>
        <h1 style={{ color: "white", margin: "0 0 18px", textAlign: "center", textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
          Welcome back, {displayName}!
        </h1>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <HeaderPillButton variant="primary" onClick={() => setShowProfileEditor(true)}>
            ✏️ Edit Profile
          </HeaderPillButton>
          <HeaderPillButton onClick={() => setShowNotifPrefs(true)}>
            🔔 Notifications
          </HeaderPillButton>
          <HeaderPillButton onClick={() => setShowDataSecurity(true)}>
            🔒 Data & Security
          </HeaderPillButton>
          {isAdmin && (
            <HeaderPillButton onClick={() => setShowAdminStats(true)}>
              📊 Admin
            </HeaderPillButton>
          )}
          <HeaderPillButton
            onClick={() => { if (myId) { removePushSubscription(myId); logEvent("user_logout", { userId: myId }); } localStorage.setItem("manually_signed_out", "1"); signOut(auth); }}
          >
            👋 Sign Out
          </HeaderPillButton>
        </div>
      </div>

      <Tabs active={activeTab} onChange={(tab) => setActiveTab(tab as typeof activeTab)} />

      {activeTab === "ledger" && (
        <MealLedger
          currentUserId={myId}
          friendIds={friendIds}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
          onViewApartment={(id: string) => setViewingApartmentId(id)}
        />
      )}
      {activeTab === "past" && (
        <MyMeals
          myId={myId}
          users={users}
          apartments={apartments}
          mode="past"
          authUser={authUser}
          friendIds={friendIds}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
          onViewApartment={(id: string) => setViewingApartmentId(id)}
        />
      )}
      {activeTab === "upcoming" && (
        <MyMeals
          myId={myId}
          users={users}
          apartments={apartments}
          mode="upcoming"
          authUser={authUser}
          friendIds={friendIds}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
          onViewApartment={(id: string) => setViewingApartmentId(id)}
        />
      )}
      {activeTab === "friends" && (
        <FriendsTab
          currentUserId={myId}
          allUsers={users}
          relationships={relationships}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
        />
      )}

      {/* Mobile profile tab — desktop nav handles profile actions */}
      {activeTab === "profile" && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "24px 16px",
          minHeight: "60vh",
        }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            border: "3px solid rgba(255,255,255,0.8)",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "white", fontFamily: "Inter, sans-serif" }}>
              {initials}
            </span>
          </div>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "white", margin: "0 0 4px", textShadow: "2px 2px 4px rgba(0,0,0,0.2)", fontSize: "1.4rem" }}>
              {displayName}
            </h2>
            {authUser?.email && (
              <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "0.9rem" }}>
                {authUser.email}
              </p>
            )}
          </div>

          {/* Apartment link */}
          {profile?.apartment ? (
            <button
              onClick={() => setViewingApartmentId(profile.apartment)}
              style={{
                padding: "14px 32px",
                borderRadius: 50,
                border: "none",
                background: "white",
                color: "#059669",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: 280,
              }}
            >
              🏠 {apartments.find((a) => a.id === profile.apartment)?.name ?? "My Apartment"}
            </button>
          ) : profile?.pending_apartment_request ? (
            <div style={{ width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => setViewingApartmentId(profile.pending_apartment_request!)}
                style={{
                  padding: "12px 20px",
                  borderRadius: 14,
                  border: "none",
                  background: "rgba(255,255,255,0.9)",
                  color: "#047857",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textAlign: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                Request pending for {apartments.find((a) => a.id === profile.pending_apartment_request)?.name ?? "apartment"} →
              </button>
              <button
                onClick={async () => {
                  await cancelJoinRequest(myId, profile.pending_apartment_request!);
                  await refreshProfileAndUsers();
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                Cancel Request
              </button>
            </div>
          ) : null}

          <button
            onClick={() => setShowProfileEditor(true)}
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              border: "none",
              background: "white",
              color: "#4f46e5",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              width: "100%",
              maxWidth: 280,
            }}
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={() => setShowNotifPrefs(true)}
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              border: "none",
              background: "white",
              color: "#667eea",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              width: "100%",
              maxWidth: 280,
            }}
          >
            🔔 Notification Settings
          </button>
          <button
            onClick={() => setShowDataSecurity(true)}
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              border: "none",
              background: "white",
              color: "#667eea",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              width: "100%",
              maxWidth: 280,
            }}
          >
            🔒 Data & Security
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowAdminStats(true)}
              style={{
                padding: "14px 32px",
                borderRadius: 50,
                border: "none",
                background: "white",
                color: "#764ba2",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: 280,
              }}
            >
              📊 Admin Stats
            </button>
          )}
          {/* PWA install prompt — mobile only, not already installed */}
          {window.innerWidth <= 768 && !window.matchMedia("(display-mode: standalone)").matches && (
            <div style={{ width: "100%", maxWidth: 280 }}>
              <button
                onClick={() => setShowPWAInstructions((v) => !v)}
                style={{
                  width: "100%",
                  padding: "14px 32px",
                  borderRadius: 50,
                  border: "none",
                  background: "white",
                  color: "#f97316",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                📲 Add to Home Screen
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>{showPWAInstructions ? "▲" : "▼"}</span>
              </button>
              {showPWAInstructions && (
                <div style={{
                  marginTop: 12,
                  padding: "16px 18px",
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: 16,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#9a3412", marginBottom: 8 }}>iPhone / iPad — Safari</div>
                    <ol style={{ margin: 0, paddingLeft: 20, color: "#374151", fontSize: "0.88rem", lineHeight: 1.8 }}>
                      <li>Tap the <strong>Share</strong> button (box with arrow at the bottom of Safari)</li>
                      <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                      <li>Tap <strong>Add</strong> — ViteMeals will appear on your home screen</li>
                    </ol>
                  </div>
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1e3a5f", marginBottom: 8 }}>Android — Chrome</div>
                    <ol style={{ margin: 0, paddingLeft: 20, color: "#374151", fontSize: "0.88rem", lineHeight: 1.8 }}>
                      <li>Tap the <strong>⋮ menu</strong> in the top-right corner of Chrome</li>
                      <li>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong></li>
                      <li>Tap <strong>Add</strong> — ViteMeals will appear on your home screen</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ flex: 1 }} />
          <button
            onClick={() => { if (myId) { removePushSubscription(myId); logEvent("user_logout", { userId: myId }); } localStorage.setItem("manually_signed_out", "1"); signOut(auth); }}
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              border: "2px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              width: "100%",
              maxWidth: 280,
            }}
          >
            👋 Sign Out
          </button>
        </div>
      )}

      {activeTab !== "profile" && <FloatingAddButton onClick={() => setShowCreate(true)} />}

      {showCreate && (
        <MealEditor
          authUser={authUser}
          currentUserId={myId}
          friendIds={friendIds}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
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
          onViewApartment={(aptId) => setViewingApartmentId(aptId)}
          onProfileChanged={refreshProfileAndUsers}
          aptInvites={aptInvites}
          onAcceptInvite={async (invite) => {
            await acceptApartmentInvite(myId, invite.aptId);
            logEvent("apartment_joined", { userId: myId, aptId: invite.aptId });
            await refreshProfileAndUsers();
            notifyUsers([invite.invitedBy], {
              title: "Invitation accepted!",
              body: `${displayName} joined ${invite.aptName}.`,
              tag: `apt-invite-accepted-${invite.aptId}-${myId}`,
              data: { tab: "profile", aptId: invite.aptId },
            }, "apartment_requests");
          }}
          onDeclineInvite={async (invite) => {
            await declineApartmentInvite(myId, invite.aptId);
            await refreshProfileAndUsers();
          }}
        />
      )}

      {viewingProfileUserId && (
        <UserProfileView
          userId={viewingProfileUserId}
          currentUserId={myId}
          allUsers={users}
          relationships={relationships}
          onClose={() => setViewingProfileUserId(null)}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
          onViewMeal={(mealId: string) => {
            setViewingProfileUserId(null);
            setViewingMealId(mealId);
          }}
          onViewApartment={(aptId: string) => {
            setViewingProfileUserId(null);
            setViewingApartmentId(aptId);
          }}
        />
      )}

      {viewingMealId && (
        <MealEditor
          mealId={viewingMealId}
          authUser={authUser}
          currentUserId={myId}
          friendIds={friendIds}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
          onClose={() => setViewingMealId(null)}
        />
      )}

      {inviteError && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setInviteError(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 32,
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#374151" }}>Invalid Invite Link</h3>
            <p style={{ margin: "0 0 24px", color: "#6b7280" }}>{inviteError}</p>
            <button
              onClick={() => setInviteError(null)}
              style={{
                padding: "10px 28px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {viewingInvitedMealId && myId && (
        <MealEditor
          mealId={viewingInvitedMealId}
          authUser={authUser}
          currentUserId={myId}
          invitedMode
          onClose={() => setViewingInvitedMealId(null)}
          onAccept={async () => {
            await set(ref(rtdb, `meal_events/${viewingInvitedMealId}/participants/${myId}/accepted`), true);
            logEvent("meal_invite_accepted", { mealId: viewingInvitedMealId, userId: myId });

            const mealSnap = await get(ref(rtdb, `meal_events/${viewingInvitedMealId}`));
            if (mealSnap.exists()) {
              const mealData = mealSnap.val();
              const hostIds = Object.entries(mealData.participants ?? {})
                .filter(([id, p]: [string, any]) => p.role === "host" && id !== myId)
                .map(([id]) => id);
              const myName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "Someone";

              // OneTable: create reservation and auto-accept with host token
              if (mealData.onetable_event_id) {
                const guestTokenSnap = await get(ref(rtdb, `private/${myId}/onetable_token`));
                if (guestTokenSnap.exists()) {
                  let reservationId: number | null = null;
                  try {
                    reservationId = await createOTReservation(
                      guestTokenSnap.val(),
                      mealData.onetable_event_id
                    );
                  } catch (err) {
                    // Don't let this block the notification/close below.
                    if (isOneTableAuthError(err)) alert(OT_RECONNECT_MESSAGE);
                    else console.error("[OT] Failed to create reservation on accept:", err);
                  }
                  if (reservationId) {
                    await set(
                      ref(rtdb, `meal_events/${viewingInvitedMealId}/onetable_reservations/${myId}`),
                      reservationId
                    );
                    try {
                      await hostAcceptReservation(viewingInvitedMealId!, reservationId);
                    } catch (err) {
                      // Not this user's connection to fix (it's the host's) — just log it.
                      console.error("[OT] Failed to auto-accept reservation with host token:", err);
                    }
                  }
                }
              }

              notifyUsers(hostIds, {
                title: "Invitation accepted!",
                body: `${myName} accepted the invite to "${mealData.title ?? "your meal"}"`,
                tag: `meal-accepted-${viewingInvitedMealId}-${myId}`,
                data: { tab: "upcoming", mealId: viewingInvitedMealId! },
              }, "host_invites");
            }
            setViewingInvitedMealId(null);
          }}
          onReject={async () => {
            if (!window.confirm("Are you sure you want to reject this invitation?")) return;
            logEvent("meal_invite_declined", { mealId: viewingInvitedMealId, userId: myId });
            const mealSnap = await get(ref(rtdb, `meal_events/${viewingInvitedMealId}`));
            if (mealSnap.exists()) {
              const mealData = mealSnap.val();
              const hostIds = Object.entries(mealData.participants ?? {})
                .filter(([id, p]: [string, any]) => p.role === "host" && id !== myId)
                .map(([id]) => id);
              const myName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "Someone";

              // Cancel any existing OT reservation (in case they had previously accepted)
              const reservationId = mealData.onetable_reservations?.[myId];
              if (reservationId) {
                const tokenSnap = await get(ref(rtdb, `private/${myId}/onetable_token`));
                if (tokenSnap.exists()) {
                  try {
                    await cancelOTReservation(tokenSnap.val(), reservationId);
                    await remove(ref(rtdb, `meal_events/${viewingInvitedMealId}/onetable_reservations/${myId}`));
                  } catch (err) {
                    if (isOneTableAuthError(err)) alert(OT_RECONNECT_MESSAGE);
                    else console.error("[OT] Failed to cancel reservation on reject:", err);
                  }
                }
              }

              notifyUsers(hostIds, {
                title: "Invitation declined",
                body: `${myName} declined the invite to "${mealData.title ?? "your meal"}"`,
                tag: `meal-rejected-${viewingInvitedMealId}-${myId}`,
                data: { tab: "upcoming", mealId: viewingInvitedMealId! },
              }, "host_invites");
            }
            await remove(ref(rtdb, `meal_events/${viewingInvitedMealId}/participants/${myId}`));
            setViewingInvitedMealId(null);
          }}
          onViewProfile={(id: string) => setViewingProfileUserId(id)}
        />
      )}

      {showNotifPrefs && myId && (
        <NotificationPrefsModal
          userId={myId}
          onClose={() => setShowNotifPrefs(false)}
        />
      )}

      {showWeeklyStatusPrompt && myId && profile && (
        <WeeklyStatusPrompt
          userId={myId}
          currentDinnerStatus={profile.dinner_status}
          currentLunchStatus={profile.lunch_status}
          weekStart={getCurrentWeekStart()}
          onDone={async () => {
            setShowWeeklyStatusPrompt(false);
            await refreshProfileAndUsers();
          }}
        />
      )}

      {showAdminStats && (
        <AdminStats onClose={() => setShowAdminStats(false)} />
      )}

      {showDataSecurity && (
        <DataSecurityModal onClose={() => setShowDataSecurity(false)} />
      )}


      {viewingApartmentId && (
        <ApartmentProfileView
          apartmentId={viewingApartmentId}
          currentUserId={myId}
          currentUser={profile}
          allUsers={users}
          onClose={() => setViewingApartmentId(null)}
          onViewProfile={(id: string) => {
            setViewingApartmentId(null);
            setViewingProfileUserId(id);
          }}
          onViewMeal={(mealId: string) => {
            setViewingApartmentId(null);
            setViewingMealId(mealId);
          }}
          onApartmentUpdated={refreshProfileAndUsers}
        />
      )}
    </div>
  );
}
