import db from '../config/db.js';
import type { ResultSetHeader } from 'mysql2/promise';
import type { ContactInput } from '../types/interfaces/contact.interface.js';

export const create = async (data: ContactInput) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
    [data.name, data.email, data.message],
  );
  return result.insertId;
};
