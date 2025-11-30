import dbPromise from "../database/initDatabase";

// Ajouter un point GPS
export async function addWaypoint(
  tripId: number,
  latitude: number,
  longitude: number
) {
  const db = await dbPromise;
  await db.runAsync(
    "INSERT INTO waypoints (trip_id, latitude, longitude) VALUES (?, ?, ?)",
    [tripId, latitude, longitude]
  );
}

// Lister les points d’un trajet
export async function getWaypointsByTrip(tripId: number) {
  const db = await dbPromise;
  return db.getAllAsync(
    "SELECT * FROM waypoints WHERE trip_id = ? ORDER BY created_at ASC",
    [tripId]
  );
}

// Supprimer tous les points d’un trajet
export async function deleteWaypointsByTrip(tripId: number) {
  const db = await dbPromise;
  await db.runAsync("DELETE FROM waypoints WHERE trip_id = ?", [tripId]);
}
