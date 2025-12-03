import { useAuthStore } from "@/utils/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  deleteSharedTrip,
  getSharedTripsForUser,
  shareTrip,
} from "../../../lib/shareTrip";
import { getTripById, updateTrip } from "../../../lib/trips";

// Import conditionnel pour éviter crash Web
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
}

interface Waypoint {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface Trip {
  id: number;
  name: string;
  description: string;
  created_at: string;
  waypoints: Waypoint[];
}

export default function TripDetailScreen() {
  // Charger les trajets partagés dont je suis propriétaire

  const { user } = useAuthStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // Partage
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [sharedTrips, setSharedTrips] = useState<any[]>([]);

  async function loadSharedTrips() {
    if (!trip) return;
    try {
      const trips = await getSharedTripsForUser(trip.id, user.uid);
      setSharedTrips(trips);
    } catch (e) {
      console.error("Erreur chargement sharedTrips:", e);
      Alert.alert("Erreur", "Impossible de charger les trajets partagés.");
    }
  }
  const loadTrip = async () => {
    try {
      const data = await getTripById(Number(id));
      setTrip(data);
      setName(data.name);
      setDescription(data.description || "");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de charger le trajet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, []);

  useEffect(() => {
    loadSharedTrips();
  }, [trip]);

  const handleUpdate = async () => {
    try {
      await updateTrip(Number(id), name, description);
      Alert.alert("Succès", "Trajet modifié !");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de modifier le trajet.");
    }
  };

  const handleDeleteSharedTrip = async (st: any) => {
    if (!trip) return;
    try {
      await deleteSharedTrip(trip.id, user.uid, st.targetUserId);
      await loadSharedTrips();
      Alert.alert("Succès", "Partage supprimé !");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de supprimer le partage.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2b6cb0" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Trajet introuvable.</Text>
      </View>
    );
  }

  const waypoints = trip.waypoints;
  const start = waypoints[0];
  const end = waypoints[waypoints.length - 1];

  const region =
    start && end
      ? {
          latitude: (start.latitude + end.latitude) / 2,
          longitude: (start.longitude + end.longitude) / 2,
          latitudeDelta: Math.abs(start.latitude - end.latitude) + 0.02,
          longitudeDelta: Math.abs(start.longitude - end.longitude) + 0.02,
        }
      : {
          latitude: 45.5,
          longitude: -73.6,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Détails du trajet</Text>

      {/* Bouton de partage */}
      <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
        <Button
          title="Partager le trajet"
          onPress={() => setShareModalVisible(true)}
        />
      </View>

      {/* Modal de partage */}
      <Modal
        visible={shareModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Partager ce trajet</Text>
            <TextInput
              style={styles.input}
              placeholder="Email du destinataire"
              value={shareEmail}
              onChangeText={setShareEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Button
              title={shareLoading ? "Partage en cours..." : "Partager"}
              onPress={async () => {
                if (!shareEmail.trim()) {
                  Alert.alert("Erreur", "Veuillez entrer un email valide.");
                  return;
                }
                setShareLoading(true);
                try {
                  await shareTrip(user.uid, trip.id, shareEmail.trim());
                  Alert.alert(
                    "Succès",
                    `Le trajet a été partagé avec ${shareEmail}`
                  );
                  setShareModalVisible(false);
                  setShareEmail("");
                  await loadSharedTrips();
                } catch (e) {
                  Alert.alert("Erreur", "Impossible de partager le trajet.");
                }
                setShareLoading(false);
              }}
              disabled={shareLoading}
            />
            <View style={{ marginTop: 10 }}>
              <Button
                title="Annuler"
                color="#888"
                onPress={() => setShareModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Fallback Web */}
      {Platform.OS === "web" ? (
        <View style={styles.webFallback}>
          <Text style={{ fontSize: 16, textAlign: "center", color: "#444" }}>
            🖥️ La carte n’est pas disponible sur Web. Veuillez tester sur
            Android ou iOS.
          </Text>
        </View>
      ) : (
        <MapView style={styles.map} region={region}>
          {waypoints.length > 0 && (
            <>
              <Polyline
                coordinates={waypoints.map((p) => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                }))}
                strokeWidth={4}
                strokeColor="#2b6cb0"
              />
              {/* Départ */}
              <Marker
                coordinate={{
                  latitude: start.latitude,
                  longitude: start.longitude,
                }}
                pinColor="green"
                title="Départ"
                description={new Date(start.created_at).toLocaleString()}
              />

              {/* Arrivée */}
              <Marker
                coordinate={{
                  latitude: end.latitude,
                  longitude: end.longitude,
                }}
                pinColor="red"
                title="Arrivée"
                description={new Date(end.created_at).toLocaleString()}
              />
            </>
          )}
        </MapView>
      )}

      {/* Liste des partages */}
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.label}>Trajet partagé avec :</Text>
        {sharedTrips.length === 0 ? (
          <Text style={{ color: "#888", marginBottom: 10 }}>
            Aucun partage pour ce trajet.
          </Text>
        ) : (
          sharedTrips.map((st, idx) => (
            <View
              key={idx}
              style={{
                padding: 8,
                borderBottomWidth: 1,
                borderColor: "#eee",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{st.targetEmail}</Text>
              <Button
                title="Delete"
                color="red"
                key={idx}
                onPress={async () => handleDeleteSharedTrip(st)}
              />
            </View>
          ))
        )}
      </View>
      {/* Formulaire modification */}
      <View style={styles.form}>
        <Text style={styles.label}>Nom :</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Description :</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Button title="Enregistrer les modifications" onPress={handleUpdate} />
        <View style={{ marginTop: 10 }}>
          <Button title="Retour" onPress={() => router.push("/(main)")} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  map: {
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  webFallback: {
    height: 300,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  form: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#2b6cb0",
  },
});
