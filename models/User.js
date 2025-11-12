import dbPromise from '../database/initDatabase';

export const createUser = async (username, password) => {

  const db = await dbPromise;
  const result = await db.runAsync(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );
  return result.insertId;
};

export const getAllUsers = async () => {
  const db = await dbPromise;
  const result = await db.getAllAsync('SELECT * FROM users ORDER BY created_at DESC');
  console.log("result", result);
 
  return result;
};

export const updateUser = async (id, username, password) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    'UPDATE users SET username = ?, password = ? WHERE id = ?',
    [username, password, id]
  );
  return result.changes;
};

export const deleteUser = async (id) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result.changes;
};