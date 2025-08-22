import path from 'path';
import db from './knex';

export async function runMigrations() {
  await db.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
    extension: 'js'
  });
  console.log('Database migrations applied successfully.');
}
