import { Drawer } from "expo-router/drawer";
import { useAuth } from "../../context/AuthContext";

export default function MainLayout() {
  const { user } = useAuth();

  // 👇 Sécurité : si pas connecté → redirection assurée par AuthWrapper
  if (!user) return null;

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* Liste des trajets */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Liste des trajets",
          title: "Liste des trajets",
        }}
      />

      {/* Ajouter un trajet */}
      <Drawer.Screen
        name="add-trip"
        options={{
          drawerLabel: "Ajouter un trajet",
          title: "Ajouter un trajet",
        }}
      />

      {/* Détail trajet (pas visible dans le menu) */}
      <Drawer.Screen
        name="trip/[id]"
        options={{
          drawerLabel: () => null,
          title: "Détail du trajet",
        }}
      />

      {/* Profil */}
      <Drawer.Screen
        name="profile"  
        options={{
          drawerLabel: "Profil",
          title: "Mon Profil",
        }}
      />  
      
      {/* Déconnexion */}
      <Drawer.Screen
        name="logout"
        options={{
          drawerLabel: "Déconnexion",
          title: "Déconnexion",
        }}
      />
    </Drawer>
  );
}
