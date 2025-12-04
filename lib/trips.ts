import dbPromise from "../database/initDatabase";

// Créer un trajet
export async function createTrip(
  name: string,
  description: string,
  userId: number,
  type: string
) {
  const db = await dbPromise;
  const res = await db.runAsync(
    "INSERT INTO trips (name, description, user_id, type) VALUES (?, ?, ?, ?)",
    [name, description, userId, type]
  );
  return res.lastInsertRowId;
}

// Lister les trajets d’un utilisateur
/**
 * List trips for a user, with optional type filter and pagination.
 * Includes owned and shared trips.
 */
export async function listTrips(
  userId: number,
  type?: "personnel" | "affaire",
  page: number = 1,
  pageSize: number = 10
) {
  const db = await dbPromise;
  const offset = (page - 1) * pageSize;
  let whereClauses = ["t.user_id = ?"];
  let params: any[] = [userId];
  if (type) {
    whereClauses.push("t.type = ?");
    params.push(type);
  }
  const query = `SELECT t.*, COUNT(w.id) AS waypoint_count
    FROM trips t
    LEFT JOIN waypoints w ON w.trip_id = t.id
    WHERE ${whereClauses.join(" AND ")}
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);
  return db.getAllAsync(query, params);
}

// Obtenir un trajet avec ses points
export async function getTripById(tripId: number) {
  const db = await dbPromise;
  const trip = await db.getFirstAsync("SELECT * FROM trips WHERE id = ?", [
    tripId,
  ]);
  const waypoints = await db.getAllAsync(
    "SELECT * FROM waypoints WHERE trip_id = ? ORDER BY created_at ASC",
    [tripId]
  );
  return { ...trip, waypoints };
}

// Modifier un trajet
export async function updateTrip(
  tripId: number,
  name: string,
  description: string
) {
  const db = await dbPromise;
  await db.runAsync("UPDATE trips SET name = ?, description = ? WHERE id = ?", [
    name,
    description,
    tripId,
  ]);
  return true;
}

// Supprimer un trajet (et ses points)
export async function deleteTrip(tripId: number) {
  const db = await dbPromise;
  await db.runAsync("DELETE FROM waypoints WHERE trip_id = ?", [tripId]);
  await db.runAsync("DELETE FROM trips WHERE id = ?", [tripId]);
  return true;
}
