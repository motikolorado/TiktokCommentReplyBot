require('../patch/patch-sqlite3');
import * as path from 'path';
import knex, { Knex } from 'knex';
import * as os from 'os';
import * as fs from 'fs';
// Helper to resolve the database file path
export function getDatabasePath(): string {
  
  return path.join(os.homedir(), '.TiktokReplyBot', 'data', 'app.sqlite');
}

const dbPath = getDatabasePath();

function ensureDatabaseDir() {
  const dir = path.dirname(getDatabasePath());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDatabaseDir();
// Initialize knex
export const db: Knex = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

// Export for other modules
export default db;
