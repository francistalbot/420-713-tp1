import dbPromise from '../database/database';

export const createTrajet = async (nom, pointDepart, pointArrivee, userId) => {
  const db = await dbPromise;
  const result = await db.runAsync(
        'INSERT INTO trajets (nom, point_depart, point_arrivee, user_id) VALUES (?, ?, ?, ?)',
        [nom, pointDepart, pointArrivee, userId]
      );
      console.log(result.lastInsertRowId, result.changes);
  return result.insertId;
};

export const getAllTrajets = async () => {
  const db = await dbPromise;
  const result = await db.allAsync('SELECT * FROM trajets');
  return result;
};

export const updateTrajet = async (id, nom, pointDepart, pointArrivee) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    'UPDATE trajets SET nom = ?, point_depart = ?, point_arrivee = ? WHERE id = ?',
    [nom, pointDepart, pointArrivee, id]
  );
  return result.changes;
};

export const deleteTrajet = async (id) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    'DELETE FROM trajets WHERE id = ?',
    [id]
  );
  return result.changes;
};