import { useAuthStore } from "@/utils/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";


type FormData = {
  email: string;
  password: string;
  message?: string;
};

export default function signin() {
  const { logIn } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    email: "",
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
      await logIn(formData.email, formData.password);
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
       {/* En-tête avec titre et logo - même style que le drawer */}
      <View style={[styles.headerSection, { backgroundColor:  "#f8fafc" }]}>
        <View style={styles.logoContainer}>
          <Ionicons name="map" size={40} color="#2b6cb0" />
          <Text style={styles.appTitle}>RouteTracker</Text>
        </View>
        <Text style={styles.appSubtitle}>Enregistrez vos itinéraires</Text>
      </View>

      <Text style={styles.title}>Connexion</Text>
      {formData.message ? (
        <Text style={{ color: "red", marginBottom: 15 }}>
          {formData.message}
        </Text>
      ) : null}
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
  headerSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingTop: 60, // Plus d'espace en haut pour la page signin
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 28, // Légèrement plus grand pour la page signin
    fontWeight: "bold",
    color: "#2b6cb0",
    marginLeft: 12,
  },
  appSubtitle: {
    fontSize: 16, // Légèrement plus grand pour la page signin
    color: "#64748b",
    fontStyle: "italic",
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
  button: {
    backgroundColor: "#2b6cb0",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#2b6cb0",
    fontSize: 16,
  },
});
