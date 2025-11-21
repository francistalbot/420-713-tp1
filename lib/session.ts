import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "user_session_id";   // ← nom plus unique

export async function saveSession(userId: number) {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, String(userId));
  } catch (err) {
    console.error("SecureStore save error:", err);
  }
}

export async function loadSession() {
  try {
    const value = await SecureStore.getItemAsync(SESSION_KEY);

    if (!value || value === "null" || value === "undefined") {
      return null;
    }

    const id = Number(value);
    if (isNaN(id) || id <= 0) return null;

    return id;
  } catch (err) {
    console.error("SecureStore load error:", err);
    return null;
  }
}

export async function clearSession() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (err) {
    console.error("SecureStore clear error:", err);
  }
}
