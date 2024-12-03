import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAleWPwaSYycCZpTojRy2zpxkl8b2J3-9M",
  authDomain: "globalsound-ab936.firebaseapp.com",
  projectId: "globalsound-ab936",
  storageBucket: "globalsound-ab936.firebasestorage.app",
  messagingSenderId: "542222313858",
  appId: "1:542222313858:web:d57c16df9c982eb054c79b",
  measurementId: "G-6WQWV2CXQ5"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error("Persistence error:", err);
});