import { useAuthStore } from "@/utils/authStore";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";


type FormData = {
  username: string;
  password: string;
  message?: string;
};

export default function signin() {
  const { logIn } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleLogin = async () => {
    try {
      await logIn(formData.username, formData.password);
    } catch (error: any) {
      if (error.message == "INVALID_PASSWORD") {
        handleInputChange("message", "Mot de passe invalide.");
        return;
      }
      handleInputChange("message", "Erreur de connexion.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      {formData.message ? (
        <Text style={{ color: "red", marginBottom: 15 }}>
          {formData.message}
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Se connecter" onPress={() => handleLogin()} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Créer un compte"
          onPress={() => router.push("/createAccount")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
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
  buttonContainer: {
    marginVertical: 8,
  },
});
