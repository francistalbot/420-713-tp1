import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function run() {
      await logout();     // efface la session
      router.replace("/auth/welcome"); // redirige correctement
    }
    run();
  }, []);

  return null;
}
