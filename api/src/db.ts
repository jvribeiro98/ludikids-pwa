import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dbPath = path.join(process.cwd(), 'api-data.sqlite');
export const db = new Database(dbPath);

// Pragmas for reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables if not exists
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  pass_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'RESPONSAVEL',
  student_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  image TEXT,
  approved INTEGER NOT NULL DEFAULT 0,
  author_id TEXT,
  author_role TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  due_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_entries (
  id TEXT PRIMARY KEY,
  period TEXT NOT NULL,
  day TEXT NOT NULL,
  dish TEXT NOT NULL,
  image TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  desc TEXT
);

CREATE TABLE IF NOT EXISTS babycare (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  student_id TEXT NOT NULL,
  icons TEXT NOT NULL,
  obs TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export function uid() {
  // Simple cuid-like id
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

