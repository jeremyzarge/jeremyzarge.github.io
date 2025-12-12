import { auth } from "./firebaseClient.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // contains uid, displayName, email
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
}

export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback);
}
