import React, { createContext, useContext, useEffect, useState } from "react";
import { clearSession, loadSession, saveSession } from "../lib/session";
import { getUserById } from "../lib/users";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chargement de la session stockée
  useEffect(() => {
    async function init() {
      const userId = await loadSession();
      if (userId) {
        const u = await getUserById(userId);
        setUser(u ?? null);
      }
      setLoading(false);
    }
    init();
  }, []);

  // Connexion
  async function login(userId: number) {
    await saveSession(userId);
    const u = await getUserById(userId);
    setUser(u);
  }

  // Déconnexion
  async function logout() {
    await clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
