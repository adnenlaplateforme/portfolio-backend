import db from '../config/db.js';
import type User from '../types/interfaces/user.interface.js';

export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.execute<User[]>('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] ?? null;
};
