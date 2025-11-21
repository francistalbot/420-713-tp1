import dbPromise from "../database/initDatabase";

// Créer un trajet
export async function createTrip(name: string, description: string, userId: number) {
  const db = await dbPromise;

  const result = await db.runAsync(
    `INSERT INTO trips (name, description, user_id)
     VALUES (?, ?, ?);`,
    [name, description, userId]
  );

  return result.lastInsertRowId;
}

// Lister les trajets d’un utilisateur
export async function listTrips(userId: number) {
  const db = await dbPromise;

  return await db.getAllAsync(
    `SELECT t.*, COUNT(w.id) AS waypoint_count
     FROM trips t
     LEFT JOIN waypoints w ON w.trip_id = t.id
     WHERE t.user_id = ?
     GROUP BY t.id
     ORDER BY t.created_at DESC;`,
    [userId]
  );
}

// Obtenir un trajet avec ses points
export async function getTripById(tripId: number) {
  const db = await dbPromise;
  const trip = await db.getFirstAsync("SELECT * FROM trips WHERE id = ?", [tripId]);
  const waypoints = await db.getAllAsync(
    "SELECT * FROM waypoints WHERE trip_id = ? ORDER BY created_at ASC",
    [tripId]
  );
  return { ...trip, waypoints };
}

// Modifier un trajet
export async function updateTrip(tripId: number, name: string, description: string) {
  const db = await dbPromise;
  await db.runAsync(
    "UPDATE trips SET name = ?, description = ? WHERE id = ?",
    [name, description, tripId]
  );
  return true;
}

// Supprimer un trajet (et ses points)
export async function deleteTrip(tripId: number) {
  const db = await dbPromise;
  await db.runAsync("DELETE FROM waypoints WHERE trip_id = ?", [tripId]);
  await db.runAsync("DELETE FROM trips WHERE id = ?", [tripId]);
  return true;
}
