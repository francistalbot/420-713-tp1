import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth } from "../../firebaseConfig";
import LogoutButton from "./LogoutButton";

export default function MainScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>État de la session</Text>
      <Text style={styles.status}>
        {user ? `Connecté : ${user.email}` : "Aucun utilisateur connecté"}
      </Text>
      {user && <LogoutButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  status: { fontSize: 16, marginVertical: 20 },
});
