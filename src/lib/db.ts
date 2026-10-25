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
  `);
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM boards").get() as { count: number };
  if (count === 0) addExamples(db);
  return db;
}

// Reuse one connection, even when the dev server reloads this file.
const globalForDb = globalThis as unknown as { foamieDb?: DatabaseSync };
export const db = globalForDb.foamieDb ?? (globalForDb.foamieDb = open());

function addExamples(db: DatabaseSync) {
  const insert = db.prepare(`
    INSERT INTO boards (id, name, blurb, ready_to_ride, length_ft, town, color, is_example, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);
  for (const b of exampleBoards) {
    const created = new Date(Date.now() - b.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    insert.run(b.id, b.name, b.blurb, b.readyToRide ? 1 : 0, b.lengthFt, b.town, b.color, created);
  }
}
