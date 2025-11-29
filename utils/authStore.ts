// utils/authStore.ts
import { auth, db } from "@/lib/firebaseConfig";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

type AuthStore = {
  user: any;    // user Firebase (uid, email, etc.)
  profile: any; // user Firestore (firstName, lastName…)
  initAuth: () => void;
  signUp: (firstName:string,  lastName:string, email:string, password:string) => Promise<void>;
  logIn: (email:string, password:string) => Promise<void>;
  logOut: () => Promise<void>;
};
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null ,         // user Firebase (uid, email, etc.)
  profile: null,      // user Firestore (firstName, lastName…)

  /** Écouteur automatique au démarrage */
  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, profile: null });
        router.replace("/signin"); 
        return;
      }
      set({ user: firebaseUser });
      // Charger le profil Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        set({ profile: snapshot.data() });
      }

      router.replace("/"); 
    });
  },

  /** Inscription */
  signUp: async (firstName:string, lastName:string, email:string, password:string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile = {
      uid: cred.user.uid,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      createdAt: new Date(),
    };
    await setDoc(doc(db, "users", cred.user.uid), profile);
    await signInWithEmailAndPassword(auth, email, password);
    
  },

  /** Connexion */
  logIn: async (email:string, password:string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  /** Déconnexion */
  logOut: async () => {
    await signOut(auth);
  },
}));
