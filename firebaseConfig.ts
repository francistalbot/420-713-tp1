// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhbe8-DBEAzjt0xyIzBEREqxrHR1wBerw",
  authDomain: "project-8b8d0.firebaseapp.com",
  projectId: "project-8b8d0",
  storageBucket: "project-8b8d0.firebasestorage.app",
  messagingSenderId: "125239615020",
  appId: "1:125239615020:web:3e4e4c37a85c62902d7b89"

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