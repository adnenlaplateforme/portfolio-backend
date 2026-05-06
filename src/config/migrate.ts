import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import db from './db.js';

const migrate = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL UNIQUE,
      run_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationsDir = path.resolve('database/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const [rows] = await db.execute<any[]>('SELECT id FROM migrations WHERE name = ?', [file]);
    if (rows.length > 0) {
      console.info(`⏭️  Déjà jouée : ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await db.execute(sql);
    await db.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
    console.info(`✅ Migration appliquée : ${file}`);
  }

  console.info('✅ Toutes les migrations sont à jour.');
  process.exit(0);
};

migrate().catch(err => {
  console.error('❌ Migration échouée :', err);
  process.exit(1);
});
