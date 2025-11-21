import { useAuthStore } from "@/utils/authStore";
import { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function userSetting() {
  const { logOut, changePassword } = useAuthStore();

  const [passwordForm, setPasswordForm] = useState({
    message: null as string | null,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const modifyPassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      handleInputChange(
        "message",
        "Les nouveaux mots de passe ne correspondent pas."
      );
      return;
    }
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordForm({
        message: "Mot de passe changé avec succès.",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      handleInputChange(
        "message",
        error.message || "Erreur lors du changement de mot de passe"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paramètres Utilisateur</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Changer le mot de passe</Text>
        {passwordForm.message && (
          <Text style={styles.message}>{passwordForm.message}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Ancien mot de passe"
          secureTextEntry={true}
          value={passwordForm.oldPassword}
          onChangeText={(value) => handleInputChange("oldPassword", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          secureTextEntry={true}
          value={passwordForm.newPassword}
          onChangeText={(value) => handleInputChange("newPassword", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le nouveau mot de passe"
          secureTextEntry={true}
          value={passwordForm.confirmNewPassword}
          onChangeText={(value) =>
            handleInputChange("confirmNewPassword", value)
          }
        />
        <View style={styles.buttonContainer}>
          <Button title="Changer le mot de passe" onPress={modifyPassword} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.buttonContainer}>
          <Button title="Se déconnecter" onPress={logOut} color="#f44336" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f9f9f9",
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
