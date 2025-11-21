import { Stack, useRouter, Slot } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function AuthWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // on attend SecureStore
    if (!user) {
      router.replace("/auth/welcome");
    }
  }, [user, loading]);

  if (loading) return null; // écran en attendant SecureStore
  return <Slot />; // continue vers layouts + pages enfants
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
