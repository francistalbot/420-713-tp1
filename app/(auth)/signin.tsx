import { initialUserSignin, UserSignin, UserSigninErrors, userSigninSchema } from "@/schemas/userSchema";
import { useAuthStore } from "@/utils/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";


import { useTheme } from "@react-navigation/native";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Signin() {
  const { logIn } = useAuthStore();
  const { colors } = useTheme();

  const [formData, setFormData] = useState<UserSignin>(initialUserSignin);
  const [msg, setMsg] = useState(""); // Message global (connexion)
  const [fieldErrors, setFieldErrors] = useState<UserSigninErrors>({});

  const handleLogin = async () => {
    setMsg("");
    setFieldErrors({});
    // Validation Zod
    const result = userSigninSchema.safeParse(formData);
    if (!result.success) {
      // Regroupe les erreurs par champ
      const errors: UserSigninErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UserSigninErrors;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }
    try {
      if(formData && formData.email && formData.password)
      await logIn({ email: formData.email, password: formData.password });
    } catch (error: any) {
      console.log(error);
      if (error.code === "auth/invalid-credential") {
        setMsg("Email ou mot de passe incorrect.");
        return;
      }
      setMsg("Erreur de connexion.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.headerSection, { borderBottomColor: colors.border }]}> 
        <View style={styles.logoContainer}>
          <Ionicons name="map" size={40} color={colors.primary} />
          <Text style={[styles.appTitle, { color: colors.primary }]}>RouteTracker</Text>
        </View>
        <Text style={[styles.appSubtitle, { color: colors.text }]} >Enregistrez vos itinéraires</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Connexion</Text>

      {/* Message d'erreur global (connexion) */}
      {msg !== "" && (
        <Text style={{ color: colors.notification, textAlign: "center", marginBottom: 10 }}>{msg}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Adresse e-mail"
          placeholderTextColor={colors.border}
          value={formData?.email || ""}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          autoCapitalize="none"
        />
        {/* Erreur email */}
        {fieldErrors.email && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.email}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Mot de passe"
          placeholderTextColor={colors.border}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
        {/* Erreur mot de passe */}
        {fieldErrors.password && (
          <Text style={{ color: colors.notification, marginBottom: 5 }}>{fieldErrors.password}</Text>
        )}
      </View>
      <Button title="Se connecter" onPress={handleLogin} color={colors.primary} />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Créer un compte"
          onPress={() => router.push("/createAccount")}
          color={colors.primary}
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
  },
  headerSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingTop: 60, // Plus d'espace en haut pour la page signin
    borderBottomWidth: 1,
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
    marginLeft: 12,
  },
  appSubtitle: {
    fontSize: 16, // Légèrement plus grand pour la page signin
    fontStyle: "italic",
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
});
