import dbPromise from '../database/database';

export const createWaypoint = async (tripId, xCoordinate, yCoordinate) => {
  const db = await dbPromise;
    const result = await db.runAsync(
       'INSERT INTO waypoints (trip_id, longitude, latitude) VALUES (?, ?, ?)',
       [tripId, xCoordinate, yCoordinate]
  );
  return result.insertId;
};

export const getTripWaypoints = async (tripId) => {
 const db = await dbPromise;
 const result = await db.getAllAsync(
    'SELECT * FROM waypoints WHERE trip_id = ?',
    [tripId]
 );
 return result.rows._array;
};