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
import { getAllSharedTripsForUser } from "../../lib/shareTrip";
import { deleteTrip, getTripsByIds, listTrips } from "../../lib/trips";

interface Trip {
  id: number;
  name: string;
  description: string;
  created_at: string;
  waypoint_count: number;
  type: "personnel" | "affaire";
  shared?: boolean;
}

export default function tripListScreen() {
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"personnel" | "affaire">("personnel");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Load trips with pagination and type filter
  const loadTrips = async (reset = false, type = tab, pageNum = page) => {
    try {
      if (!user) return;
      setLoading(reset ? true : false);
      // Load owned trips
      const ownedResults = await listTrips(user.uid, type, pageNum, 10);

      // Load shared trip IDs from Firebase
      let sharedTrips: any[] = [];
      if (pageNum === 1) {
        // Only fetch shared trips on first page
        const sharedRefs = await getAllSharedTripsForUser(user.uid);
        if (sharedRefs.length > 0) {
          // Get actual trip data from SQLite, filter by type
          const sharedIds = sharedRefs.map((ref) => ref.tripId);
          const allSharedTrips = await getTripsByIds(sharedIds);
          sharedTrips = allSharedTrips.filter((trip) => trip.type === type);
        }
      }

      // Merge owned and shared trips, avoiding duplicates
      const allTrips = [...ownedResults, ...sharedTrips].filter(
        (trip, idx, arr) => arr.findIndex((t) => t.id === trip.id) === idx
      );

      if (reset) {
        setTrips(allTrips as any[]);
      } else {
        setTrips((prev) => [
          ...prev,
          ...allTrips.filter((trip) => !prev.some((t) => t.id === trip.id)),
        ]);
      }
      setHasMore((ownedResults as any[]).length === 10);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de charger les trajets.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh on tab change or focus
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      loadTrips(true, tab, 1);
    }, [tab, user])
  );

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadTrips(true, tab, 1);
  };

  // Lazy loading: fetch next page
  const onEndReached = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTrips(false, tab, nextPage);
    }
  };

  const handleDelete = (tripId: number, shared?: boolean) => {
    if (shared) return; // Disable delete for shared trips
    Alert.alert("Supprimer", "Voulez-vous supprimer ce trajet ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteTrip(tripId);
          setPage(1);
          loadTrips(true, tab, 1);
        },
      },
    ]);
  };

  if (loading && trips.length === 0) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Liste des trajets
      </Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            tab === "personnel" && styles.tabActive,
            { borderColor: colors.primary },
          ]}
          onPress={() => {
            setTab("personnel");
            setPage(1);
          }}
        >
          <Text
            style={[
              styles.tabText,
              tab === "personnel" && { color: colors.primary },
            ]}
          >
            Personnels
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            tab === "affaire" && styles.tabActive,
            { borderColor: colors.primary },
          ]}
          onPress={() => {
            setTab("affaire");
            setPage(1);
          }}
        >
          <Text
            style={[
              styles.tabText,
              tab === "affaire" && { color: colors.primary },
            ]}
          >
            Affaires
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tripItem,
              { backgroundColor: colors.card, borderColor: colors.border },
              item.shared && { opacity: 0.6 },
            ]}
            onPress={() =>
              router.push({
                pathname: `/(main)/trip/${item.id}`,
                params: { shared: item.shared ? "1" : undefined },
              })
            }
            onLongPress={() => handleDelete(item.id, item.shared)}
            // Tous les trajets sont cliquables
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.tripName, { color: colors.primary }]}>
                {item.name} {item.shared ? "(partagé)" : ""}
              </Text>

              {item.description ? (
                <Text style={[styles.desc, { color: colors.text }]}>
                  {item.description}
                </Text>
              ) : null}

              <Text style={[styles.details, { color: colors.border }]}>
                {item.waypoint_count} points •{" "}
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && !loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null
        }
      />

      {trips.length === 0 && !loading && (
        <Text style={[styles.empty, { color: colors.border }]}>
          Aucun trajet trouvé.
        </Text>
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
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  tabActive: {
    backgroundColor: "#e0e0e0",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
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
