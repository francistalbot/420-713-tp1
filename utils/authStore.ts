import { changeUserPassword, createUser, findUserById } from "@/models/User";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { findUserByCredentials } from "../models/User";
const isWeb = Platform.OS === "web";

type UserState = {
  userId: number | null;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  createUser: (
    username: string,
    password: string,
    email: string
  ) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  getUserInfo: () => Promise<any>;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      userId: null,
      logIn: async (username: string, password: string) => {
        const result = await findUserByCredentials(username, password);
        if (result) {
          set((state) => ({ ...state, userId: result.id }));
        }
      },

      logOut: async () => {
        set((state) => ({ ...state, userId: null, username: null }));
      },
      createUser: async (username: string, email: string, password: string) => {
        // Implementation for creating a user goes here
        const insertId = await createUser(username, email, password);
        if (insertId) {
          set((state) => ({ ...state, userId: insertId }));
        }
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) throw new Error("User not logged in");
        await changeUserPassword(userId, oldPassword, newPassword);
      },

      getUserInfo: async () => {
        const userId = useAuthStore.getState().userId;
        if (!userId) throw new Error("User not logged in");

        const user = await findUserById(userId);
        if (!user) throw new Error("User not found");

        return user;
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
    }
  )
);
