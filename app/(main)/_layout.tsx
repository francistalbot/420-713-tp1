import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#2b6cb0" },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: "#bee3f8",
        drawerActiveTintColor: "#2b6cb0",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Liste des trajets",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="add-trip"
        options={{
          title: "Ajouter un trajet",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="userSetting"
        options={{
          title: "Paramètres utilisateur",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
            <Drawer.Screen
        name="trip/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Détail du trajet",
        }}
      />

    </Drawer>
  );
}
