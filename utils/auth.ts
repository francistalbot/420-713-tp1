import { useEffect, useState } from "react";
import { findUserByCredentials } from "../models/User";

import storageUtil from "./storage";
const { setItem, getItem, deleteItem } = storageUtil;

// Clé pour stocker le token dans SecureStore
const TOKEN_KEY = "user_token";

type UserState = {
  isLoggedIn: boolean;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

export const useAuth = (): UserState => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    isAuthenticated().then(setIsLoggedIn);
  }, []);

  const logIn = async (username: string, password: string) => {
    const result = await findUserByCredentials(username, password);
    if (result) {
      await saveToken("dummy_user_id");
      setIsLoggedIn(true);
    }
  };

  const logOut = async () => {
    await removeToken();
    setIsLoggedIn(false);
  };
  return { isLoggedIn, logIn, logOut };
};

/**
 * Sauvegarder le token d'authentification
 */
export const saveToken = async (userId: string): Promise<void> => {
  try {
    await setItem(TOKEN_KEY, userId);
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
    const token = await getItem(TOKEN_KEY);
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
    await deleteItem(TOKEN_KEY);
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
