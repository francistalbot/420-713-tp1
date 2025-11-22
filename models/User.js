import * as Crypto from "expo-crypto";
import dbPromise from "../database/initDatabase";
export const createUser = async (firstName, lastName, email, password) => {
  try {
    const db = await dbPromise;

    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    const result = await db.runAsync(
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email.trim().toLowerCase(), hashed]
    );
    const insertId = result.lastInsertRowId;
    return { id: insertId };
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

export const updateUserProfile = async (id, first_name, last_name, email) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
    [first_name, last_name, email, id]
  );
  
    if (result.changes === 0) {
      throw new Error("UPDATE_FAILED");
    }
    
  return result.changes;
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

export const findUserByCredentials = async (email, password) => {
  const db = await dbPromise;

  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  const result = await db.getFirstAsync(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, hashed]
  );
  if (!result) {
    throw new Error("INVALID_PASSWORD");
  }

  return result;
};

export const findUserById = async (id) => {
  try{
  const db = await dbPromise;
  const result = await db.getFirstAsync("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  return result;
} catch (error) {
   throw new Error("USER_NOT_FOUND");
}
};
