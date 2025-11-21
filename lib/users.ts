import * as Crypto from "expo-crypto";
import dbPromise from "../database/initDatabase";

// 🔸 Créer un utilisateur
export async function registerUser(username, email, password) {
  try {
    const db = await dbPromise;

    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    await db.runAsync(
      `INSERT INTO users (username, email, password)
       VALUES (?, ?, ?)`,
      username.trim(),
      email.trim().toLowerCase(),
      hashed
    );

    return { success: true };
  } catch (err) {
    if (String(err).includes("UNIQUE")) {
      return { success: false, message: "EMAIL_EXISTS" };
    }
    console.error("REGISTER ERROR:", err);
    return { success: false, message: "UNKNOWN_ERROR" };
  }
}

// 🔸 Authentifier un utilisateur
export async function loginUser(email, password) {
  const db = await dbPromise;

  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );

  const user = await db.getFirstAsync(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    email.toLowerCase(),
    hashed
  );

  return user || null;
}

// 🔸 Récupérer un utilisateur par ID
export async function getUserById(id: number) {
  const db = await dbPromise;

  const user = await db.getFirstAsync(
    "SELECT * FROM users WHERE id = ?",
    id
  );

  return user || null;
}

export async function updateUser(
  id: number,
  data: { username?: string; email?: string; password?: string }
) {
  const db = await dbPromise;

  // 1️⃣ Récupérer l’utilisateur actuel
  const currentUser = await getUserById(id);

  if (!currentUser) {
    throw new Error("Utilisateur introuvable");
  }

  // 2️⃣ Si email changé → vérifier s’il existe déjà
  if (data.email && data.email !== currentUser.email) {
    const existing = await db.getAsync(
      "SELECT id FROM users WHERE email = ?",
      [data.email]
    );

    if (existing) {
      throw new Error("Cet email est déjà utilisé par un autre compte.");
    }
  }

  // 3️⃣ Construire dynamiquement les champs modifiés
  const fields = [];
  const values = [];

  if (data.username) {
    fields.push("username = ?");
    values.push(data.username);
  }
  if (data.email) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.password) {
    fields.push("password = ?");
    values.push(data.password);
  }

  if (fields.length === 0) return currentUser;

  values.push(id);

  // 4️⃣ Update
  await db.runAsync(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  // 5️⃣ Retourner la version mise à jour
  return getUserById(id);
}
