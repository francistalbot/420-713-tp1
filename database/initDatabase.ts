import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "tp1.db";
let dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);

export const deleteDatabase = async () => {
  console.log("Suppression de la base de données existante...");
  const db = await dbPromise;
  await db.execAsync("DROP TABLE IF EXISTS trips;");
  await db.execAsync("DROP TABLE IF EXISTS waypoints;");
};

export const initDatabase = async () => {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      positions_count INTEGER DEFAULT 0,
      description TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      sync BOOLEAN DEFAULT false
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS waypoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips (id)
    );
  `);
};

export default dbPromise;
