import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
  }, [id]);

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

      {/* Fallback Web */}
      {Platform.OS === "web" ? (
        <View style={styles.webFallback}>
          <Text style={{ fontSize: 16, textAlign: "center", color: "#444" }}>
            🖥️ La carte n’est pas disponible sur Web.
            Veuillez tester sur Android ou iOS.
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
                coordinate={{ latitude: start.latitude, longitude: start.longitude }}
                pinColor="green"
                title="Départ"
                description={new Date(start.created_at).toLocaleString()}
              />

              {/* Arrivée */}
              <Marker
                coordinate={{ latitude: end.latitude, longitude: end.longitude }}
                pinColor="red"
                title="Arrivée"
                description={new Date(end.created_at).toLocaleString()}
              />
            </>
          )}
        </MapView>
      )}

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
});
