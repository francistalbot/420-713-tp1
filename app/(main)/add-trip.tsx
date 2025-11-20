import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { createTrip } from "../../lib/trips";
import { addWaypoint } from "../../lib/waypoints";

export default function AddTripScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);
  const [trackingCompleted, setTrackingCompleted] = useState(false);

  const [elapsed, setElapsed] = useState(0); // ⏱ compteur en secondes

  const trackingRef = useRef<NodeJS.Timer | null>(null);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  // Format date yyyy-MM-dd HH:mm:ss
  const formatDate = (d: Date) =>
    d.toISOString().slice(0, 19).replace("T", " ");

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

    // démarrer le compteur
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // démarrer le tracking GPS (1 point toutes les 5 secondes)
    trackingRef.current = setInterval(async () => {
      const loc = await Location.getCurrentPositionAsync({});
      const point = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: formatDate(new Date()),
      };
      setPositions((prev) => [...prev, point]);
    }, 5000);
  };

  const stopTracking = () => {
    if (trackingRef.current) clearInterval(trackingRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setIsTracking(false);
    setTrackingCompleted(true);
  };

  const sendTrip = async () => {
    if (positions.length < 1) {
      Alert.alert("Erreur", "Aucun point GPS enregistré.");
      return;
    }

    try {
      const createdAt = formatDate(new Date());
      const tripId = await createTrip(name, description, 1);

      for (const p of positions) {
        await addWaypoint(tripId, p.latitude, p.longitude);
      }

      Alert.alert("Succès", "Trajet sauvegardé !");

      // reset
      setName("");
      setDescription("");
      setPositions([]);
      setElapsed(0);
      setTrackingCompleted(false);

      router.push("/(main)");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible d'enregistrer le trajet.");
    }
  };

  const goBack = () => {
    router.push("/(main)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Trajet</Text>

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

      {/* Compteur visible seulement pendant le tracking */}
      {isTracking && (
        <Text style={styles.counter}>Temps écoulé : {elapsed}s</Text>
      )}

      {!isTracking && !trackingCompleted && (
        <Button title="Démarrer" onPress={startTracking} />
      )}

      {isTracking && (
        <Button title="Arrêter" color="red" onPress={stopTracking} />
      )}

      {trackingCompleted && (
        <>
          <Text style={styles.info}>
            {positions.length} points enregistrés
          </Text>

          <Button title="Envoyer le trajet" onPress={sendTrip} />

          <View style={{ marginTop: 10 }}>
            <Button title="Retour" onPress={goBack} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  counter: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b6cb0",
    marginBottom: 15,
  },
  info: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "green",
  },
});
