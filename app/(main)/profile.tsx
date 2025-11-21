import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getUserById, updateUser } from "../../lib/users";

export default function ProfileScreen() {
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Charger les données dans les champs
  useEffect(() => {
    async function load() {
      if (!user) return;

      const u = await getUserById(user.id);
      if (u) {
        setUsername(u.username);
        setEmail(u.email);
      }
    }
    load();
  }, [user]);

  // Sauvegarde des modifications
  async function saveProfile() {
    try {
      if (!username || !email) {
        Alert.alert("Erreur", "Les champs email et nom sont obligatoires.");
        return;
      }

      const updated = await updateUser(user.id, {
        username,
        email,
        password: password ? password : undefined
      });

      if (updated) {
        setUser(updated); // mise à jour du AuthContext
        Alert.alert("Succès", "Informations mises à jour.");
      }
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Impossible de mettre à jour le profil.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <Text>Nom</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text>Mot de passe</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Laisser vide pour ne pas changer"
        style={styles.input}
      />

      <Button title="Enregistrer" onPress={saveProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
});
