import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB8Yl7ylHSsIvW8939dHxTguY9bF5-OJKE",
  authDomain: "genz-tusion.firebaseapp.com",
  projectId: "genz-tusion",
  storageBucket: "genz-tusion.firebasestorage.app",
  messagingSenderId: "271524697525",
  appId: "1:271524697525:web:9420ff52fe9125b470b5fc",
  measurementId: "G-D2NSRJLNCB"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is only supported in browser environments
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics, firebaseConfig };
