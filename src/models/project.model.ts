import db from '../config/db.js';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type Project from '../types/interfaces/project.interface.js';
import type { ProjectInput } from '../types/interfaces/project.interface.js';
import type Tag from '../types/interfaces/tag.interface.js';

const attachTags = async (projects: Project[]) => {
  if (projects.length === 0) return projects;

  const ids = projects.map(p => p.id);
  const placeholders = ids.map(() => '?').join(',');
  const [tagRows] = await db.execute<(Tag & { project_id: number } & RowDataPacket)[]>(
    `SELECT t.*, pt.project_id FROM tags t JOIN project_tags pt ON pt.tag_id = t.id WHERE pt.project_id IN (${placeholders})`,
    ids,
  );

  return projects.map(p => ({
    ...p,
    tags: tagRows.filter(t => t.project_id === p.id).map(({ project_id: _pid, ...tag }) => tag),
  }));
};

const syncTags = async (projectId: number, tagIds: number[]) => {
  await db.execute('DELETE FROM project_tags WHERE project_id = ?', [projectId]);
  if (tagIds.length > 0) {
    const placeholders = tagIds.map(() => '(?, ?)').join(', ');
    const params = tagIds.flatMap(tagId => [projectId, tagId]);
    await db.execute(`INSERT INTO project_tags (project_id, tag_id) VALUES ${placeholders}`, params);
  }
};

export const findAll = async () => {
  const [rows] = await db.execute<Project[]>('SELECT * FROM projects ORDER BY created_at DESC');
  return attachTags(rows);
};

export const findById = async (id: number) => {
  const [rows] = await db.execute<Project[]>('SELECT * FROM projects WHERE id = ?', [id]);
  const project = rows[0];
  if (!project) return null;
  const withTags = await attachTags([project]);
  return withTags[0];
};

export const create = async (data: ProjectInput) => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO projects (title, description, tech_stack, github_url, demo_url, image_url, image_key) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.title, data.description ?? null, data.tech_stack ?? null, data.github_url ?? null, data.demo_url ?? null, data.image_url ?? null, data.image_key ?? null],
  );
  const insertId = result.insertId;
  if (data.tag_ids) await syncTags(insertId, data.tag_ids);
  return insertId;
};

export const remove = async (id: number) => {
  const [result] = await db.execute<ResultSetHeader>('DELETE FROM projects WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const update = async (id: number, data: ProjectInput) => {
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE projects SET title = ?, description = ?, tech_stack = ?, github_url = ?, demo_url = ?, image_url = ?, image_key = ? WHERE id = ?',
    [data.title, data.description ?? null, data.tech_stack ?? null, data.github_url ?? null, data.demo_url ?? null, data.image_url ?? null, data.image_key ?? null, id],
  );
  if (result.affectedRows === 0) return null;
  if (data.tag_ids !== undefined) await syncTags(id, data.tag_ids);
  return findById(id);
};
