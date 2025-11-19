import { useAuthStore } from "@/utils/authStore";
import { Button } from "react-native";

export default function userSetting() {
    const { logOut } = useAuthStore();
  return (
    <>
      <Button title="Se déconnecter" onPress={logOut} />
    </>
  );
}