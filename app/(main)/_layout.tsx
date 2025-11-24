import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";

// Composant personnalisé pour le contenu du drawer
function CustomDrawerContent(props: any) {
  const router = useRouter();
  
   const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.drawerContainer}>
      {/* En-tête avec titre et logo */}
      <View style={[styles.headerSection, ]}>
        <View style={styles.logoContainer}>
          <Ionicons name="map" size={32} color="#2b6cb0" />
          <Text style={styles.appTitle}>RouteTracker</Text>
        </View>
        <Text style={styles.appSubtitle}>Enregistrez vos itinéraires</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.drawerItemsContainer}>
          <DrawerItem
            label="Liste des trajets"
            onPress={() => router.push("/(main)")}
            icon={({ color, size }: any) => (
              <Ionicons name="list-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Ajouter un trajet"
            onPress={() => router.push("/(main)/add-trip")}
            icon={({ color, size }: any) => (
              <Ionicons name="add-circle-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerLabel}
          />
        </View>
      </DrawerContentScrollView>
      
      {/* Bouton de paramètres en bas */}
      <View style={[styles.bottomSection,{borderTopColor: !isDark ? "#e2e8f0" : "transparent"}]}>
        <DrawerItem
          label="Paramètres utilisateur"
          onPress={() => router.push("/(main)/userSetting")}
          icon={({ color, size }: any) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerLabel}
        />
      </View>
    </View>
  );
}

export default function MainLayout() {

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerStyle: { 
          backgroundColor: "#2b6cb0" 
        },
        headerTitleStyle: { fontWeight: "bold" },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: "#bee3f8",
        drawerActiveTintColor: "#2b6cb0",
        headerTitle: "RouteTracker",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Mes Trajets",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="map" size={30} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}> Mes Trajets</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="add-trip"
        options={{
          title: "Nouveau Trajet",
          headerTitle:  () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="map" size={30} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Nouveau Trajet</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="trip/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Détail du trajet",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="map" size={30} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Détails</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="userSetting"
        options={{
          title: "Paramètres",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="map" size={30} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}> Paramètres</Text>
            </View>
          ),
          drawerItemStyle: { display: "none" }, // Caché car géré dans le drawer personnalisé
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: Platform.OS !== "web" ? 60 : 0,

  },
  headerSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomColor: "#e2e8f0",
      borderBottomWidth: 1,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2b6cb0",
    marginLeft: 12,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  drawerLabel: {
    fontSize: 16,
  },
});