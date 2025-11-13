import { useAuthStore } from "@/utils/authStore";
import { useState } from "react";
import { Button, Text, TextInput } from "react-native";

export default function signin() {
  const { logIn } = useAuthStore();
  const [formData, setFormData] = useState({
  username: '',
  password: ''
});
const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
  return (
    <>
      <Text>Page Connexion</Text>
      <TextInput placeholder="Nom d'utilisateur" value={formData.username}
  onChangeText={(text) => handleInputChange('username', text)}
    />
      <TextInput placeholder="Mot de passe" secureTextEntry={true} value={formData.password}
  onChangeText={(text) => handleInputChange('password', text)}
    />
      <Button
        title="Se connecter"
        onPress={() => logIn(formData.username, formData.password)}
      />
    </>
  );
}
