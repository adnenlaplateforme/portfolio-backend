import db from '../config/db.js';
import type { ResultSetHeader } from 'mysql2/promise';
import type Tag from '../types/interfaces/tag.interface.js';
import type { TagInput } from '../types/interfaces/tag.interface.js';

export const findAll = async () => {
  const [rows] = await db.execute<Tag[]>('SELECT * FROM tags ORDER BY name');
  return rows;
};

export const findById = async (id: number) => {
  const [rows] = await db.execute<Tag[]>('SELECT * FROM tags WHERE id = ?', [id]);
  return rows[0] ?? null;
};

export const create = async (data: TagInput) => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO tags (name) VALUES (?)',
    [data.name],
  );
  return result.insertId;
};

export const update = async (id: number, data: TagInput) => {
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE tags SET name = ? WHERE id = ?',
    [data.name, id],
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
};

export const remove = async (id: number) => {
  const [result] = await db.execute<ResultSetHeader>('DELETE FROM tags WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
