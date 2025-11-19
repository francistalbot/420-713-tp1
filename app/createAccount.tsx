import { router } from "expo-router";
import { createUser } from "@/models/User";
import { useAuthStore } from "@/utils/authStore";
import { useState } from "react";
import { Button, Text, TextInput } from "react-native";

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
  const { logIn } = useAuthStore();

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
        logIn(formData.username, formData.password);
      })
      .catch((error) => {
        console.error("Erreur lors de la création du compte :", error);
      });
  };

  return (
    <>
      <Text>Page Création de compte</Text>
      {formData.message && <Text>{formData.message}</Text>}
      <TextInput
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
      />
      <TextInput
        placeholder="Adresse e-mail"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />
      <TextInput
        placeholder="Confirmer le mot de passe"
        secureTextEntry={true}
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange("confirmPassword", text)}
      />
      <Button title="Se connecter" onPress={() => createAccount()} />
      <Button
        title="Retour à la connexion"
        onPress={() => router.push("/signin")}
      />
    </>
  );
}
