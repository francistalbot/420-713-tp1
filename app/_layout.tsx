import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { initDatabase } from "../database/initDatabase";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/utils/authStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

const isLoggedIn = false;
export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        //await getAllUsers(); // Test fetching users to ensure DB is working
        console.log("Base de données initialisée avec succès");
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de la base de données:",
          error
        );
      }
    };

    setupDatabase();
  }, []);
  const { userId } = useAuthStore();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!!userId}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!userId}>
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="createAccount" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
