import { initialUserForm, UserForm, UserFormErrors, userFormSchema } from "@/schemas/userSchema";
import { useAuthStore } from "@/utils/authStore";
import { router } from "expo-router";
import { useState } from "react";

import { useTheme } from "@react-navigation/native";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


export default function CreateAccount() {
  const { signUp } = useAuthStore();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<UserForm>(initialUserForm);
  const [msg, setMsg] = useState(""); // Message global (création de compte)
  const [fieldErrors, setFieldErrors] = useState<UserFormErrors>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateAccount = () => {
    setMsg("");
    setFieldErrors({});
    // Validation Zod
    const result = userFormSchema.safeParse(formData);
    if (!result.success) {
      // Regroupe les erreurs par champ
      const errors: UserFormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UserFormErrors;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMsg( "Veuillez remplir tous les champs.");
      return;
    }

    signUp(formData.firstName, formData.lastName, formData.email, formData.password)
      .catch((error: any) => {
        setMsg("Erreur lors de la création du compte.");
      });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Création de compte</Text>
      {msg !== "" && (
        <Text style={[styles.message, { backgroundColor: colors.notification, color: colors.card }]}>{msg}</Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Prénom"
          placeholderTextColor={colors.border}
          value={formData.firstName}
          onChangeText={(text) => handleInputChange("firstName", text)}
        />
        {fieldErrors.firstName && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.firstName}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Nom de famille"
          placeholderTextColor={colors.border}
          value={formData.lastName}
          onChangeText={(text) => handleInputChange("lastName", text)}
        />
        {fieldErrors.lastName && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.lastName}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Adresse e-mail"
          placeholderTextColor={colors.border}
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {fieldErrors.email && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.email}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Mot de passe"
          placeholderTextColor={colors.border}
          secureTextEntry={true}
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
        />      
        {fieldErrors.password && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.password}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Confirmer le mot de passe"
          placeholderTextColor={colors.border}
          secureTextEntry={true}
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange("confirmPassword", text)}
        />
        {fieldErrors.confirmPassword && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.confirmPassword}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Créer un compte" onPress={() => handleCreateAccount()} color={colors.primary} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Retour à la connexion"
          onPress={() => router.push("/signin")}
          color={colors.primary}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  message: {
    textAlign: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
