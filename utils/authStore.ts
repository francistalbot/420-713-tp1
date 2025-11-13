import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { findUserByCredentials } from "../models/User";

const isWeb = Platform.OS === "web";

type UserState = {
  userId: string | null;
  _hasHydrated: boolean;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      userId: null,
      _hasHydrated: false,
      logIn: async (username: string, password: string) => {
        console.log("Tentative de connexion pour :", username);
        const result = await findUserByCredentials(username, password);
        console.log("Résultat de la connexion :", result);
        if (result) {
          set((state) => ({ ...state, userId: result.id }));
        }
      },

      logOut: async () => {
        set((state) => ({ ...state, userId: null }));
      },
      setHasHydrated: (value: boolean) => {
        set((state) => ({ ...state, _hasHydrated: value }));
      },
    }),
    {
      name: "auth-store",
      storage: isWeb
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => ({
            setItem: (key: string, value: string) =>
              SecureStore.setItemAsync(key, value),
            getItem: (key: string) => SecureStore.getItemAsync(key),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          })),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);
