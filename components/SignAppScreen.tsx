import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { auth } from "../firebaseConfig";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    async function handleSignUp() {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Succès", "Compte créé avec succès !");
        } catch (error: any) {
        Alert.alert("Erreur", error.message);
        }
    }
    return (
    <View style={styles.container}>
    <Text
    style={styles.title}>Inscription</Text>
    <TextInput placeholder="Email"
    style={styles.input} onChangeText={setEmail}
    value={email} />
    <TextInput placeholder="Mot de passe"
    style={styles.input} secureTextEntry
    onChangeText={setPassword} value={password} />
    <Button title="Créer un compte"
    onPress={handleSignUp} />
    </View>
    );
}
const styles = StyleSheet.create({
container: { flex: 1, justifyContent:
"center", padding: 20 },
title: { fontSize: 24, fontWeight: "bold",
marginBottom: 20 },
input: { borderBottomWidth: 1, marginBottom:
15, padding: 8 }
});