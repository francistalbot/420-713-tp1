import * as SQLite from 'expo-sqlite';

let dbPromise =  SQLite.openDatabaseAsync('tp1.db');

export const initDatabase = async () => {
 
  const db = await dbPromise;
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`);

await db.execAsync(
          `CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );`
  );

await db.execAsync(
            `CREATE TABLE IF NOT EXISTS waypoints (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              trip_id INTEGER,
              x_coordinate REAL NOT NULL,
              y_coordinate REAL NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (trip_id) REFERENCES trips (id)
            );`);
};
export default dbPromise;