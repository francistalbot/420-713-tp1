import * as SecureStore from "expo-secure-store";
import { useState } from "react";

// Clé pour stocker le token dans SecureStore
const TOKEN_KEY = "user_token";

type UserState = {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
};

export const useAuth = (): UserState => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const logIn = () => setIsLoggedIn(true);
  const logOut = () => setIsLoggedIn(false);
  return { isLoggedIn, logIn, logOut };
};

/**
 * Sauvegarder le token d'authentification
 */
export const saveToken = async (userId: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, userId);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du token:", error);
    throw error;
  }
};

/**
 * Récupérer le token d'authentification
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
};

/**
 * Supprimer le token d'authentification (déconnexion)
 */
export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Erreur lors de la suppression du token:", error);
    throw error;
  }
};

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};
