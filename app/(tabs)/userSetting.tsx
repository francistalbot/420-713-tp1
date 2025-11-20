import { useAuthStore } from "@/utils/authStore";
import { useState } from "react";
import { Button, Text, TextInput } from "react-native";

export default function userSetting() {
  const { logOut, changePassword, getUserInfo } = useAuthStore();
  const [userInfo, setUserInfo] = useState<any>(null);

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

  const modifyPassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      handleInputChange(
        "message",
        "Les nouveaux mots de passe ne correspondent pas."
      );
      console.error("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      .catch((error) => {
        handleInputChange(
          "message",
          "Erreur lors du changement de mot de passe."
        );
        console.error("Erreur lors du changement de mot de passe :", error);
      })
      .finally(() => {
        setPasswordForm({
          message: "Mot de passe changé avec succès.",
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      });
  };

  return (
    <>
      <Text>Paramètres Utilisateur</Text>

      {/*Modifier le mot de passe*/}
      <Text>Changer le mot de passe</Text>
      {passwordForm.message && <Text>{passwordForm.message}</Text>}
      <TextInput
        placeholder="Ancien mot de passe"
        secureTextEntry={true}
        onChangeText={(value) => handleInputChange("oldPassword", value)}
      />
      <TextInput
        placeholder="Nouveau mot de passe"
        secureTextEntry={true}
        onChangeText={(value) => handleInputChange("newPassword", value)}
      />
      <TextInput
        placeholder="Confirmer le nouveau mot de passe"
        secureTextEntry={true}
        onChangeText={(value) => handleInputChange("confirmNewPassword", value)}
      />
      <Button title="Changer le mot de passe" onPress={modifyPassword} />

      <Button title="Se déconnecter" onPress={logOut} />
    </>
  );
}
