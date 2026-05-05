import db from '../config/db.ts';
import type Project from '../types/interfaces/project.interface.ts';

export const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
  return rows;
};

export const findById = async (id: number) => {
  const [rows] = await db.query<Project[]>('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0] ?? null;
};
