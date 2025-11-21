import * as Crypto from "expo-crypto";
import dbPromise from "../database/initDatabase";
export const createUser = async (username, email, password) => {
  try {
    const db = await dbPromise;

    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    const result = await db.runAsync(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email.trim().toLowerCase(), hashed]
    );
    const insertId = result.lastInsertRowId;
    return { success: insertId !== undefined, id: insertId };
  } catch (error) {
    if (String(error).includes("UNIQUE")) {
      throw new Error("EMAIL_EXISTS");
    }
    console.error("Error creating user:", error);
    throw new Error("UNKNOWN_ERROR");
  }
};

export const getAllUsers = async () => {
  const db = await dbPromise;
  const result = await db.getAllAsync(
    "SELECT * FROM users ORDER BY created_at DESC"
  );
  console.log("result", result);

  return result;
};

export const deleteUser = async (id) => {
  const db = await dbPromise;
  const result = await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
  return result.changes;
};

export const changeUserPassword = async (id, oldPassword, newPassword) => {
  const db = await dbPromise;

  const hashedOldPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    oldPassword
  );

  const hashedNewPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    newPassword
  );

  const result = await db.runAsync(
    "UPDATE users SET password = ? WHERE id = ? AND password = ?",
    [hashedNewPassword, id, hashedOldPassword]
  );

  if (result.changes === 0) {
    throw new Error("INVALID_PASSWORD");
  }

  return result.changes;
};

export const findUserByCredentials = async (username, password) => {
  const db = await dbPromise;

  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  const result = await db.getFirstAsync(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, hashed]
  );
  console.log("findUserByCredentials result:", result);
  if (!result) {
    console.log("No user found with the provided credentials.");
    throw new Error("INVALID_PASSWORD");
  }

  return result;
};

export const findUserById = async (id) => {
  const db = await dbPromise;
  const result = await db.getFirstAsync("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  return result;
};
