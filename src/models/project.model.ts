import db from '../config/db.js';
import type { ResultSetHeader } from 'mysql2/promise';
import type Project from '../types/interfaces/project.interface.js';
import type { ProjectInput } from '../types/interfaces/project.interface.js';

export const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
  return rows;
};

export const findById = async (id: number) => {
  const [rows] = await db.query<Project[]>('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0] ?? null;
};

export const create = async (data: ProjectInput) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO projects (title, description, tech_stack, github_url, demo_url, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [data.title, data.description ?? null, data.tech_stack ?? null, data.github_url ?? null, data.demo_url ?? null, data.image_url ?? null],
  );
  return result.insertId;
};

/* export const update = async (id:number,data: ProjectInput) => {

} */