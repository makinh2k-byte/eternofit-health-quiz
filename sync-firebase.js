import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { products } from "./src/data/products.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiGKfkwog89yIQVILVg3vWrlPL1B8n8I8",
  authDomain: "eternofit-67a94.firebaseapp.com",
  projectId: "eternofit-67a94",
  storageBucket: "eternofit-67a94.firebasestorage.app",
  messagingSenderId: "143266529296",
  appId: "1:143266529296:web:50c8b939740c1180250a95",
  measurementId: "G-H46TNYLL2B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sync() {
  console.log("Starting sync to Firebase...");
  try {
    for (const prod of products) {
      await setDoc(doc(db, "products", prod.id.toString()), prod);
      console.log(`Synced: ${prod.name}`);
    }
    console.log("All products successfully synced!");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing:", error);
    process.exit(1);
  }
}

sync();
