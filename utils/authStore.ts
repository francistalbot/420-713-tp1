// utils/authStore.ts
import { create } from "zustand";
import { auth, db } from "@/lib/firebaseConfig";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

export const useAuthStore = create((set, get) => ({
  user: null,         // user Firebase (uid, email, etc.)
  profile: null,      // user Firestore (firstName, lastName…)

  /** Écouteur automatique au démarrage */
  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, profile: null });
        router.replace("/(main)/trip/signin"); 
        return;
      }

      set({ user: firebaseUser });

      // Charger le profil Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        set({ profile: snapshot.data() });
      }

      router.replace("/(main)/trip"); 
    });
  },

  /** Inscription */
  signUp: async (firstName, lastName, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      createdAt: new Date(),
    });

    set({ user: cred.user });
    router.replace("/(main)/trip");
  },

  /** Connexion */
  logIn: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    set({ user: cred.user });

    const userRef = doc(db, "users", cred.user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      set({ profile: snapshot.data() });
    }

    router.replace("/(main)/trip");
  },

  /** Déconnexion */
  logOut: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
    router.replace("/(main)/trip/signin");
  },
}));
