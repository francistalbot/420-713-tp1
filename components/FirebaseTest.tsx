import { getApps } from "firebase/app";
import React from "react";
import { Text, View } from "react-native";
import { app } from "../firebaseConfig";

export default function FirebaseTest() {
    const appInstance = app;
    const apps = getApps();
    return (
        <View>
            <Text>Connexion Firebase : {apps.length > 0 ? "Connecté" : "Non connecté"}</Text>
        </View>
    );
}