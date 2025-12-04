import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from "firebase/firestore";
import { Platform } from "react-native";

// -----------------------------
// CONFIG FIREBASE
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBXg0pPRoVAx3AWMCmMLvkx-OCq9uSX3q4",
  authDomain: "android-e6481.firebaseapp.com",
  projectId: "android-e6481",
  storageBucket: "android-e6481.firebasestorage.app",
  messagingSenderId: "618435124408",
  appId: "1:618435124408:web:12b958fd32c01acd5b684d",
};

// Init App
const app = initializeApp(firebaseConfig);

// -----------------------------
// AUTH (mobile vs web)
// -----------------------------
let auth;

if (Platform.OS === "web") {
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// -----------------------------
// FIRESTORE : OBLIGATOIRE SUR ANDROID !!
// -----------------------------
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// -----------------------------
// EMULATEURS (DEV uniquement)
// -----------------------------
if (__DEV__) {
  const EMU_IP = "192.168.2.13"; // IP de ton PC !!!

  try {
    connectAuthEmulator(auth, `http://${EMU_IP}:9099`);
    console.log("Auth connecté à l'émulateur local");

    connectFirestoreEmulator(db, EMU_IP, 8080);
    console.log("Firestore connecté à l'émulateur local");
  } catch (e) {
    console.log("Erreur connexion émulateur :", e);
  }
}

export { auth };

