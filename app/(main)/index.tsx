import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userId = 1; // à remplacer par l'id du user connecté (via AuthContext plus tard)

  const loadTrips = async () => {
    try {
      setLoading(true);
      const results = await listTrips(userId);
      setTrips(results);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de charger les trajets.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (tripId: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce trajet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteTrip(tripId);
            loadTrips();
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadTrips();
  }, []);

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

      {trips.length === 0 ? (
        <Text style={styles.empty}>Aucun trajet enregistré.</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
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
                  {item.waypoint_count} points – {formatDate(item.created_at)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// 🔧 format de date YYYY-MM-DD HH:mm:ss → affichage local
function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return date.toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tripItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2b6cb0",
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginTop: 3,
  },
  details: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
