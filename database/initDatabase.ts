import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";

const DB_NAME = "tp1.db";
const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export async function resetDatabase() {
  try {
    await FileSystem.deleteAsync(DB_PATH, { idempotent: true });
    console.log("🔥 Database reset");
  } catch (e) {
    console.log("Erreur reset :", e);
  }
}

const dbPromise = SQLite.openDatabaseAsync('tp1.db');

export const initDatabase = async () => {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
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
