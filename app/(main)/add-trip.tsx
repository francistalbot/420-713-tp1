import { useAuthStore } from "@/utils/authStore";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createTrip } from "../../lib/trips";
import { addWaypoint } from "../../lib/waypoints";

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

export default function AddTripScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"personnel" | "affaire">("personnel");
  const [isTracking, setIsTracking] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [trackingCompleted, setTrackingCompleted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const trackingRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);

  // Format date yyyy-MM-dd HH:mm:ss
  const formatDate = (d: Date) =>
    d.toISOString().slice(0, 19).replace("T", " ");

  // Effet pour obtenir la position initiale
  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          const initialPos = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: formatDate(new Date()),
          };
          setCurrentPosition(initialPos);
        }
      } catch (error) {
        console.log(
          "Erreur lors de l'obtention de la position initiale:",
          error
        );
      }
    };

    getInitialLocation();
  }, []);

  const capturePosition = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    const point = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      timestamp: formatDate(new Date()),
    };
    setPositions((prev) => [...prev, point]);
    setCurrentPosition(point); // Met à jour la position courante pour la carte
  };

  const startTracking = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom de trajet.");
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Autorisez la localisation.");
      return;
    }

    setPositions([]);
    setTrackingCompleted(false);
    setIsTracking(true);
    setElapsed(0);

    // Capturer immédiatement la première position
    await capturePosition();

    // Démarrer le compteur
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // Démarrer le suivi de position en temps réel
    if (Platform.OS !== "web") {
      locationWatchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // Mise à jour toutes les 2 secondes
          distanceInterval: 5, // Ou quand on bouge de 5 mètres
        },
        (location) => {
          const point = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: formatDate(new Date()),
          };
          setCurrentPosition(point);
        }
      );
    }

    // Démarrer le tracking GPS (1 point toutes les 5 secondes)
    trackingRef.current = setInterval(capturePosition, 5000);
  };

  const stopTracking = async () => {
    await capturePosition(); // Capturer la dernière position

    if (trackingRef.current) clearInterval(trackingRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }

    setIsTracking(false);
    setTrackingCompleted(true);
  };

  const sendTrip = async () => {
    if (positions.length < 1) {
      Alert.alert("Erreur", "Aucun point GPS enregistré.");
      setTrackingCompleted(false);
      return;
    }

    try {
      if (!user.uid) return;

      console.log("Enregistrement du trajet...", name, description, user.uid);
      const tripId = await createTrip(name, description, user.uid, type);

      for (const p of positions) {
        await addWaypoint(tripId, p.latitude, p.longitude);
      }

      Alert.alert("Succès", "Trajet sauvegardé !");
      router.push("/(main)");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible d'enregistrer le trajet.");
    }
  };

  // Calculer la région de la carte
  const getMapRegion = () => {
    if (positions.length === 0 && currentPosition) {
      return {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (positions.length === 1) {
      return {
        latitude: positions[0].latitude,
        longitude: positions[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (positions.length > 1) {
      const lats = positions.map((p) => p.latitude);
      const lngs = positions.map((p) => p.longitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(maxLat - minLat + 0.01, 0.01),
        longitudeDelta: Math.max(maxLng - minLng + 0.01, 0.01),
      };
    }

    // Valeur par défaut
    return {
      latitude: 45.5017,
      longitude: -73.5673,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Ajouter un Trajet</Text>

      {!trackingCompleted && !isTracking && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom du trajet"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* Picker pour le type de trajet */}
          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Button
                title="Personnel"
                color={type === "personnel" ? "#2b6cb0" : "#ccc"}
                onPress={() => setType("personnel")}
              />
              <View style={{ width: 10 }} />
              <Button
                title="Affaire"
                color={type === "affaire" ? "#2b6cb0" : "#ccc"}
                onPress={() => setType("affaire")}
              />
            </View>
          </View>
        </>
      )}

      {/* Carte en temps réel */}
      {Platform.OS === "web" ? (
        <View style={styles.webFallback}>
          <Text style={{ fontSize: 16, textAlign: "center", color: "#444" }}>
            🖥️ La carte n'est pas disponible sur Web.
          </Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={getMapRegion()}
            showsUserLocation={true}
            followsUserLocation={isTracking}
          >
            {/* Points enregistrés du trajet */}
            {positions.length > 0 && (
              <Marker
                coordinate={{
                  latitude: positions[0].latitude,
                  longitude: positions[0].longitude,
                }}
                title="Départ"
                description={`Démarré à: ${positions[0].timestamp}`}
                pinColor="green"
              />
            )}

            {/* Ligne du trajet */}
            {positions.length > 1 && (
              <Polyline
                coordinates={positions.map((p) => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                }))}
                strokeColor="#2b6cb0"
                strokeWidth={3}
              />
            )}
            {/* Point d'arrivée */}
            {trackingCompleted && (
              <Marker
                coordinate={{
                  latitude: positions[positions.length - 1].latitude,
                  longitude: positions[positions.length - 1].longitude,
                }}
                title="Arrivée"
                description={`Terminé à: ${
                  positions[positions.length - 1].timestamp
                }`}
                pinColor="red"
              />
            )}
          </MapView>
        </View>
      )}

      {/* Informations en temps réel */}
      {isTracking && (
        <Text style={styles.counter}>Temps écoulé : {elapsed}s</Text>
      )}

      {/* Contrôles */}
      <View style={styles.controlsContainer}>
        {!isTracking && !trackingCompleted && (
          <Button title="Démarrer" onPress={startTracking} />
        )}

        {isTracking && (
          <Button title="Arrêter" color="red" onPress={stopTracking} />
        )}

        {trackingCompleted && (
          <>
            <View style={styles.completedInfo}>
              <Text style={styles.completedText}>Tracking terminé !</Text>
              <Text style={styles.info}>
                {positions.length} points enregistrés
              </Text>
            </View>

            <Button title="Envoyer le trajet" onPress={sendTrip} />

            <View style={styles.buttonSpacing}>
              <Button
                title="Nouveau Trajet"
                onPress={() => {
                  setTrackingCompleted(false);
                  setPositions([]);
                  setElapsed(0);
                }}
              />
            </View>

            <View style={styles.buttonSpacing}>
              <Button title="Retour" onPress={() => router.push("/(main)")} />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2b6cb0",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2b6cb0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  mapContainer: {
    marginVertical: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    height: 300,
  },
  webFallback: {
    height: 300,
    borderRadius: 15,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  positionText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    fontFamily: "monospace",
  },
  trackingInfo: {
    alignItems: "center",
  },
  counter: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b6cb0",
    marginBottom: 5,
  },
  pointsCount: {
    textAlign: "center",
    fontSize: 16,
    color: "#28a745",
    fontWeight: "600",
  },
  controlsContainer: {
    marginTop: 15,
  },
  completedInfo: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#c3e6cb",
  },
  completedText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#155724",
    marginBottom: 5,
  },
  info: {
    textAlign: "center",
    fontWeight: "600",
    color: "#155724",
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
