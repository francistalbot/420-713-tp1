import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { registerUser } from "../../lib/users";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const result = await registerUser(username, email, password);

    if (result.success) {
      Alert.alert("Succès", "Compte créé !");
      router.replace("/auth/login");
    } else if (result.message === "EMAIL_EXISTS") {
      Alert.alert("Erreur", "Cet email est déjà utilisé.");
    } else {
      Alert.alert("Erreur", "Impossible de créer le compte.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Créer un compte
      </Text>

      <Text>Nom d'utilisateur :</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={username}
        onChangeText={setUsername}
      />

      <Text>Email :</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Mot de passe :</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Créer le compte" onPress={handleRegister} />
    </View>
  );
}
