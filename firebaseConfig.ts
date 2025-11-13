// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhbe8-DBEAzjt0xyIzBEREqxrHR1wBerw",
  authDomain: "project-8b8d0.firebaseapp.com",
  projectId: "project-8b8d0",
  storageBucket: "project-8b8d0.firebasestorage.app",
  messagingSenderId: "125239615020",
  appId: "1:125239615020:web:72ab513a20ccbd6d2d7b89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);