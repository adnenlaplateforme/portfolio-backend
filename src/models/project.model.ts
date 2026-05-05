import db from '../config/db.ts';

export const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
  return rows;
};
