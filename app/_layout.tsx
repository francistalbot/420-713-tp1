import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { deleteDatabase, initDatabase } from "../database/initDatabase";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/utils/authStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, initAuth } = useAuthStore();

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await deleteDatabase();
        await initDatabase();
        console.log("Base de données initialisée avec succès");
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de la base de données:",
          error
        );
      }
    };
    setupDatabase();
    const unsubscribe = initAuth();
    return unsubscribe;
  }, []);
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="createAccount" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
