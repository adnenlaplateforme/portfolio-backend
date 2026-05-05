import type { ResultSetHeader } from 'mysql2/promise';
import type User from '../types/interfaces/user.interface.js';
import db from './connection.js';
import bcrypt from 'bcrypt';

const seed = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env');
      process.exit(1);
    }

    const [rows] = await db.execute<User[]>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );

    if (rows.length > 0) {
      console.info('ℹ️ Admin account already exists. Skipping creation.');
      process.exit(0);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, passwordHash, 'admin'],
    );

    console.info('✅ Admin account created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

await seed();
