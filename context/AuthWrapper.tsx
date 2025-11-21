import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "./AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Affichage pendant la récupération du user (évite écran blanc infini)
  if (loading) {
    return null; // tu peux mettre un spinner si tu veux
  }

  // Si pas connecté → redirection vers welcome
  if (!user) {
    return <Redirect href="/auth/welcome" />;
  }

  // Si connecté → affiche l’app
  return <>{children}</>;
}
