import dbPromise from "../database/initDatabase";

export const createTrip = async (nom, pointDepart, pointArrivee, userId) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    "INSERT INTO trips (nom, point_depart, point_arrivee, user_id) VALUES (?, ?, ?, ?)",
    [nom, pointDepart, pointArrivee, userId]
  );
  console.log(result.lastInsertRowId, result.changes);
  return result.insertId;
};

export const getAllTrips = async () => {
  const db = await dbPromise;
  const result = await db.getAllAsync("SELECT * FROM trips");
  return result;
};

export const updateTrip = async (id, nom, pointDepart, pointArrivee) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    "UPDATE trips SET nom = ?, point_depart = ?, point_arrivee = ? WHERE id = ?",
    [nom, pointDepart, pointArrivee, id]
  );
  return result.changes;
};

export const deleteTrip = async (id) => {
  const db = await dbPromise;
  const result = await db.runAsync("DELETE FROM trips WHERE id = ?", [id]);
  return result.changes;
};
