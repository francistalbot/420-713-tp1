import dbPromise from "../database/initDatabase";

export const createUser = async (username, email, password) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );
  return result.lastInsertRowId;
};

export const getAllUsers = async () => {
  const db = await dbPromise;
  const result = await db.getAllAsync(
    "SELECT * FROM users ORDER BY created_at DESC"
  );
  console.log("result", result);

  return result;
};

export const updateUser = async (id, username, password) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    "UPDATE users SET username = ?, password = ? WHERE id = ?",
    [username, password, id]
  );
  return result.changes;
};

export const deleteUser = async (id) => {
  const db = await dbPromise;
  const result = await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
  return result.changes;
};

export const changeUserPassword = async (id, oldPassword, newPassword) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    "UPDATE users SET password = ? WHERE id = ? AND password = ?",
    [newPassword, id, oldPassword]
  );

  if (result.changes === 0) {
    throw new Error("Ancien mot de passe incorrect");
  }

  return result.changes;
};

export const findUserByCredentials = async (username, password) => {
  const db = await dbPromise;
  const result = await db.getFirstAsync(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );
  return result;
};

export const findUserById = async (id) => {
  const db = await dbPromise;
  const result = await db.getFirstAsync("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  return result;
};
