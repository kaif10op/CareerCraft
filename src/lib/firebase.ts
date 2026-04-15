import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDW0T91yX5ISK67NdcmgDhwESfpaRBcJvE",
  authDomain: "log-in-with-59978.firebaseapp.com",
  projectId: "log-in-with-59978",
  storageBucket: "log-in-with-59978.firebasestorage.app",
  messagingSenderId: "423009600149",
  appId: "1:423009600149:web:ad9f5e0b081c027eb7919c",
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add scopes for additional user info
googleProvider.addScope("profile");
googleProvider.addScope("email");

// IMPORTANT FIX: Force account selection prompt so the modal doesn't immediately close
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };
