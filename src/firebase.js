import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiGKfkwog89yIQVILVg3vWrlPL1B8n8I8",
  authDomain: "eternofit-67a94.firebaseapp.com",
  projectId: "eternofit-67a94",
  storageBucket: "eternofit-67a94.firebasestorage.app",
  messagingSenderId: "143266529296",
  appId: "1:143266529296:web:50c8b939740c1180250a95",
  measurementId: "G-H46TNYLL2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);