import { useAuthStore } from "@/utils/authStore";
import { useFocusEffect, useTheme } from "@react-navigation/native";
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

export default function tripListScreen() {
  const { user } = useAuthStore();
  const { colors } = useTheme();
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
      <View style={[styles.loader, { backgroundColor: colors.background }] }>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.text }]}>Liste des trajets</Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tripItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/(main)/trip/${item.id}`)}
            onLongPress={() => handleDelete(item.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.tripName, { color: colors.primary }]}>{item.name}</Text>

              {item.description ? (
                <Text style={[styles.desc, { color: colors.text }]}>{item.description}</Text>
              ) : null}

              <Text style={[styles.details, { color: colors.border }]}>
                {item.waypoint_count} points •{" "}
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {trips.length === 0 && (
        <Text style={[styles.empty, { color: colors.border }]}>Aucun trajet trouvé.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tripItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    marginTop: 4,
  },
  details: {
    marginTop: 6,
    fontSize: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
