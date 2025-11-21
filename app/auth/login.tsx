import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { loginUser } from "../../lib/users";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const user = await loginUser(email, password);

    if (!user) {
      Alert.alert("Erreur", "Email ou mot de passe invalide.");
      return;
    }

    await login(user.id); // sauvegarde session
    router.replace("/(main)");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Connexion
      </Text>

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

      <Button title="Connexion" onPress={handleLogin} />
    </View>
  );
}
