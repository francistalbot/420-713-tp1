import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
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
        name="settings"
        options={{
          title: "Paramètres",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
