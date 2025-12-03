import { useAuthStore } from "@/utils/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteTrip, listTrips } from "../../lib/trips";

interface Trip {
  id: number;
  name: string;
  description: string;
  created_at: string;
  waypoint_count: number;
}

export default function TripListScreen() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadTrips = async () => {
    try {
      if (!user) return;
      const results = await listTrips(user.uid);
      setTrips(results as any[]);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de charger les trajets.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔥 Rafraîchit la page automatiquement à chaque retour sur l'écran
  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  // 🔄 Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const handleDelete = (tripId: number) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer ce trajet ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteTrip(tripId);
          loadTrips();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2b6cb0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des trajets</Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tripItem}
            onPress={() => router.push(`/(main)/trip/${item.id}`)}
            onLongPress={() => handleDelete(item.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.tripName}>{item.name}</Text>

              {item.description ? (
                <Text style={styles.desc}>{item.description}</Text>
              ) : null}

              <Text style={styles.details}>
                {item.waypoint_count} points •{" "}
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {trips.length === 0 && (
        <Text style={styles.empty}>Aucun trajet trouvé.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tripItem: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b6cb0",
  },
  desc: {
    color: "#666",
    marginTop: 4,
  },
  details: {
    color: "#888",
    marginTop: 6,
    fontSize: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
