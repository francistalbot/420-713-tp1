import { useAuthStore } from "@/utils/authStore";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  message?: string;
};

const initialFormData: FormData = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
};

export default function createAccount() {
  const { createUser } = useAuthStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createAccount = () => {
    if (formData.password !== formData.confirmPassword) {
      handleInputChange("message", "Les mots de passe ne correspondent pas.");
      return;
    }
    if (!formData.username || !formData.email || !formData.password) {
      handleInputChange("message", "Veuillez remplir tous les champs.");
      return;
    }

    createUser(formData.username, formData.email, formData.password)
      .then(() => {
        handleInputChange("message", "Compte créé avec succès !");
        router.push("/signin");
      })
      .catch((error) => {
        handleInputChange("message", "Erreur lors de la création du compte.");
        console.error("Erreur lors de la création du compte :", error);
      });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Création de compte</Text>
      {formData.message && (
        <Text style={styles.message}>{formData.message}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        secureTextEntry={true}
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange("confirmPassword", text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Créer un compte" onPress={() => createAccount()} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Retour à la connexion"
          onPress={() => router.push("/signin")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    justifyContent: "center",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  message: {
    textAlign: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e3f2fd",
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
