import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { exampleBoards } from "./examples";

// Everything the site saves lives in the data/ folder: the database file and
// the photos. Delete that folder to start fresh with only the example boards.
export const dataDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
export const photoDir = path.join(dataDir, "photos");

function open() {
  mkdirSync(photoDir, { recursive: true });
  const db = new DatabaseSync(path.join(/*turbopackIgnore: true*/ dataDir, "foamie-rescue.db"));
  // Wait a moment instead of failing when another process is using the file.
  db.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS boards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      blurb TEXT NOT NULL DEFAULT '',
      ready_to_ride INTEGER NOT NULL,
      length_ft REAL,
      brand TEXT,
      town TEXT NOT NULL,
      zip TEXT,
      photo TEXT,
      color TEXT,
      is_example INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY,
      contact TEXT NOT NULL UNIQUE, -- an email address or a phone number like +17145550123
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS codes (
      contact TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      tries INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      person_id INTEGER NOT NULL REFERENCES people(id),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY,
      board_id TEXT NOT NULL REFERENCES boards(id),
      taker_id INTEGER NOT NULL REFERENCES people(id),
      soon TEXT NOT NULL,      -- how soon they can pick it up
      windows TEXT NOT NULL,   -- "anytime", or 3-hour windows joined by commas
      note TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'waiting', -- waiting, yes, no
      created_at TEXT NOT NULL,
      answered_at TEXT,
      UNIQUE (board_id, taker_id)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS outbox (
      id INTEGER PRIMARY KEY,
      to_contact TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  addColumnIfMissing(db, "boards", "owner_id", "INTEGER REFERENCES people(id)");
  addColumnIfMissing(db, "boards", "status", "TEXT NOT NULL DEFAULT 'listed'"); // listed, gone, adopted
  addColumnIfMissing(db, "boards", "listed_at", "TEXT"); // set when relisted; otherwise created_at counts
  addColumnIfMissing(db, "boards", "reminded_at", "TEXT");
  addColumnIfMissing(db, "requests", "handoff", "TEXT"); // done or failed, once someone tells us
  addColumnIfMissing(db, "requests", "would_buy", "TEXT"); // yes, no or maybe: would the taker have bought a new one?
  addColumnIfMissing(db, "requests", "taker_photo", "TEXT");
  addColumnIfMissing(db, "requests", "taker_reported_at", "TEXT");
  addColumnIfMissing(db, "requests", "followup_sent_at", "TEXT");
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM boards").get() as { count: number };
  if (count === 0) addExamples(db);
  return db;
}

// Reuse one connection, even when the dev server reloads this file.
const globalForDb = globalThis as unknown as { foamieDb?: DatabaseSync };
export const db = globalForDb.foamieDb ?? (globalForDb.foamieDb = open());

// Databases made by an older version of the site are missing newer columns.
function addColumnIfMissing(db: DatabaseSync, table: string, column: string, type: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!columns.some((c) => c.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
}

function addExamples(db: DatabaseSync) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO boards (id, name, blurb, ready_to_ride, length_ft, town, color, is_example, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);
  for (const b of exampleBoards) {
    const created = new Date(Date.now() - b.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    insert.run(b.id, b.name, b.blurb, b.readyToRide ? 1 : 0, b.lengthFt, b.town, b.color, created);
  }
}
