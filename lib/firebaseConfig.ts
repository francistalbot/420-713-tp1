import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXg0pPRoVAx3AWMCmMLvkx-OCq9uSX3q4",
  authDomain: "android-e6481.firebaseapp.com",
  projectId: "android-e6481",
  storageBucket: "android-e6481.firebasestorage.app",
  messagingSenderId: "618435124408",
  appId: "1:618435124408:web:12b958fd32c01acd5b684d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let auth = getAuth(app);
export let db = getFirestore(app);


if (__DEV__) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  console.log("Firestore connecté à l'émulateur local");
}