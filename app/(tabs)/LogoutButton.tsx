import { signOut } from "firebase/auth";
import { Alert, Button } from "react-native";
import { auth } from "../../firebaseConfig";

export default function LogoutButton() {
  async function handleLogout() {
    try {
      await signOut(auth);
      Alert.alert("Déconnecté", "Vous êtes maintenant déconnecté.");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  }

  return <Button title="Se déconnecter" onPress={handleLogout} />;
}
