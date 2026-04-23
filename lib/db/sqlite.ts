import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const dataDir = path.join(process.cwd(), 'sqlite');
const dbPath = path.join(dataDir, 'clickrunclaw.db');
const schemaPath = path.join(dataDir, 'schema.sql');

let db: Database.Database | null = null;

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const instance = new Database(dbPath);
  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');

  if (fs.existsSync(schemaPath)) {
    instance.exec(fs.readFileSync(schemaPath, 'utf8'));
  }

  return instance;
}

export function getDb() {
  if (!db) {
    db = ensureDb();
  }
  return db;
}

export function withTransaction<T>(fn: (database: Database.Database) => T): T {
  const database = getDb();
  const tx = database.transaction(() => fn(database));
  return tx();
}
