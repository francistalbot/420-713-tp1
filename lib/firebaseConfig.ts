import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXg0pPRoVAx3AWMCmMLvkx-OCq9uSX3q4",
  authDomain: "android-e6481.firebaseapp.com",
  projectId: "android-e6481",
  storageBucket: "android-e6481.firebasestorage.app",
  messagingSenderId: "618435124408",
  appId: "1:618435124408:web:12b958fd32c01acd5b684d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
