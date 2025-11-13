import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { createTrip } from "../../lib/trips";
import { addWaypoint } from "../../lib/waypoints";

interface Props {
  userId?: number; // tu pourras le passer via AuthContext
}

export default function AddTripScreen({ userId = 1 }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [tripId, setTripId] = useState<number | null>(null);
  const [positionCount, setPositionCount] = useState(0);

  let trackingTimer: NodeJS.Timer | null = null;

  // Nettoyer le timer si on quitte l'écran
  useEffect(() => {
    return () => {
      if (trackingTimer) clearInterval(trackingTimer);
    };
  }, []);

  const startTracking = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom de trajet.");
      return;
    }

    // Demande permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la localisation est requis.");
      return;
    }

    try {
      const newTripId = await createTrip(name, description, userId);
      setTripId(newTripId);
      setIsTracking(true);
      setPositionCount(0);

      trackingTimer = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        await addWaypoint(newTripId, loc.coords.latitude, loc.coords.longitude);
        setPositionCount((c) => c + 1);
      }, 5000);

      Alert.alert("Suivi démarré", "Le suivi GPS est actif (1 point/5s).");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de démarrer le trajet.");
    }
  };

  const stopTracking = async () => {
    if (trackingTimer) clearInterval(trackingTimer);
    setIsTracking(false);
    trackingTimer = null;

    Alert.alert(
      "Trajet enregistré",
      `Trajet sauvegardé avec ${positionCount} positions.`
    );
    setName("");
    setDescription("");
    setTripId(null);
    setPositionCount(0);
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
        placeholder="Description (facultative)"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {!isTracking ? (
        <Button title="Démarrer le trajet" onPress={startTracking} />
      ) : (
        <Button title="Arrêter et enregistrer" color="red" onPress={stopTracking} />
      )}

      {isTracking && (
        <Text style={styles.status}>
          Points enregistrés : {positionCount}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  status: {
    textAlign: "center",
    marginTop: 15,
    color: "green",
    fontWeight: "bold",
  },
});
