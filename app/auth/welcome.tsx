import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>

      <View style={styles.button}>
        <Button title="Connexion" onPress={() => router.push("/auth/login")} />
      </View>

      <View style={styles.button}>
        <Button title="Créer un compte" onPress={() => router.push("/auth/register")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    marginVertical: 10,
  },
});
