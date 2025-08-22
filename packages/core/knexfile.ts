require('./dist/patch/patch-sqlite3');
import * as path from 'path';
import { Knex } from 'knex';
import { getDatabasePath } from './dist/db/knex';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: getDatabasePath(),
  },
  migrations: {
    directory: path.resolve(__dirname, 'dist/db/migrations'),
    extension: 'js',
  },
  useNullAsDefault: true,
};

export default config;
