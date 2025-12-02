import { useAuthStore } from "@/utils/authStore";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import {
  Button, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

function UserSetting() {
  const { logOut, theme, setTheme } = useAuthStore();
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleProfileInputChange = (field: string, value: string) => {
    setUserInfo((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileChange = async () => {
    if (!userInfo?.first_name || !userInfo?.last_name || !userInfo?.email) return;
    try {
      //await modifyUserInfo(userInfo.first_name,userInfo.last_name,userInfo.email);
      setUserInfo((prev: any) => ({
        ...prev,
        message: "Informations mises à jour avec succès.",
      }));
    } catch (error) {
      setUserInfo((prev: any) => ({
        ...prev,
        message: "Une erreur est survenue lors de la mise à jour des informations.",
      }));
    }
  };

  const [passwordForm, setPasswordForm] = useState({
    message: null as string | null,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });



  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      handlePasswordInputChange(
        "message",
        "Les nouveaux mots de passe ne correspondent pas."
      );
      return;
    }
    try {
     // await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordForm({
        message: "Mot de passe changé avec succès.",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      handlePasswordInputChange(
        "message",
        error.message || "Erreur lors du changement de mot de passe"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paramètres Utilisateur</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thème de l'application</Text>
        <View style={{ marginBottom: 15 }}>
          <Picker
            selectedValue={theme === null ? '' : theme ? 'dark' : 'light'}
            onValueChange={value => setTheme(value === 'dark')}
            style={{ backgroundColor: '#f9f9f9', borderRadius: 8 }}
          >
            <Picker.Item label="Système" value="" />
            <Picker.Item label="Clair" value="light" />
            <Picker.Item label="Sombre" value="dark" />
          </Picker>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Utilisateur</Text>
        {userInfo?.message && (
          <Text style={styles.message}>{userInfo.message}</Text>
        )}
          <TextInput
            style={[styles.input]}
            value={userInfo?.first_name}
            onChangeText={(value) => handleProfileInputChange('first_name', value)}
            placeholder="Votre prénom"
            autoCapitalize="words"
          />

          <TextInput
            style={[styles.input]}
            value={userInfo?.last_name}
            onChangeText={(value) => handleProfileInputChange('last_name', value)}
            placeholder="Votre nom"
            autoCapitalize="words"
          />
    
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={userInfo?.email}
            onChangeText={(value) => handleProfileInputChange('email', value)}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
            autoCorrect={false}
          />
        <View style={styles.buttonContainer}>
          <Button title="Changer le mot de passe" onPress={handleProfileChange} />
        </View>
      </View>
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
          onChangeText={(value) => handlePasswordInputChange("oldPassword", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          secureTextEntry={true}
          value={passwordForm.newPassword}
          onChangeText={(value) => handlePasswordInputChange("newPassword", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le nouveau mot de passe"
          secureTextEntry={true}
          value={passwordForm.confirmNewPassword}
          onChangeText={(value) =>
            handlePasswordInputChange("confirmNewPassword", value)
          }
        />
        <View style={styles.buttonContainer}>
          <Button title="Changer le mot de passe" onPress={handlePasswordChange} />
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
  inputDisabled: {
    backgroundColor: "#e8e8e8",
    color: "#999",
    borderColor: "#ccc",
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
