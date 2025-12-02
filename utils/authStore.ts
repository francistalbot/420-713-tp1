// utils/authStore.ts
import { auth, db } from "@/lib/firebaseConfig";
import { User, UserSignin } from "@/schemas/userSchema";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

type AuthStore = {
  user: any; // user Firebase (uid, email, etc.)
  profile: User | null; // user Firestore (firstName, lastName…)
  setTheme: (theme: boolean) => Promise<void>;
  initAuth: () => void;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logIn: ({ email, password }: UserSignin) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: (profileUpdates: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null, // user Firebase (uid, email, etc.)
  profile: null, // user Firestore (firstName, lastName…)
  setTheme: async (darkTheme) => {
    if (!get().profile) return;
    set({
      profile: {
        ...get().profile,
        darkTheme: darkTheme,
      } as User
    });
    await setDoc(doc(db, "users", get().user.uid), { ...get().profile });
  },
  /** Écouteur automatique au démarrage */
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Changement d'état d'authentification détecté", firebaseUser);
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
        set({ profile: snapshot.data() as User });
      }

      router.replace("/");
    });
    return unsubscribe;
  },

  /** Inscription */
  signUp: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
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
  logIn: async ({ email, password }: UserSignin) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  /** Déconnexion */
  logOut: async () => {
    await signOut(auth);
  },

  /** Met à jour le profil */
  updateProfile: async (profileUpdates: Partial<User>) => {
    if (!get().profile) return;
    const updatedProfile = {
      ...get().profile,
      ...profileUpdates,
    } as User;
    set({ profile: updatedProfile });
    console.log("Mise à jour du profil dans Firestore :", updatedProfile);
    await setDoc(doc(db, "users", get().user.uid), updatedProfile);
  },

  /** Change le mot de passe */
  changePassword: async (oldPassword: string, newPassword: string) => {
    if (!get().user) return;
      const user = get().user;
      await signInWithEmailAndPassword(auth, user.email, oldPassword);
      await updatePassword(user, newPassword);
  },
}));
