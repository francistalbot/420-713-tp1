import { useAuthStore } from "@/utils/authStore";
import { Button, Text } from "react-native";

export default function signin() {
  const { logIn } = useAuthStore();
  return (
    <>
      <Text>Page Connexion</Text>
      <Button
        title="Se connecter"
        onPress={() => logIn("username", "password")}
      />
    </>
  );
}
