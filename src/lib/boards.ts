import "server-only";
import { db } from "./db";

export type Board = {
  id: string;
  name: string;
  blurb: string;
  readyToRide: boolean;
  lengthFt: number | null;
  brand: string | null;
  town: string;
  zip: string | null;
  photo: string | null; // file name in data/photos, served at /photos/<file>
  color: string | null; // drawing color for example boards without a photo
  isExample: boolean;
  createdAt: string;
};

export type BoardFilter = "all" | "ready" | "love";

type Row = {
  id: string;
  name: string;
  blurb: string;
  ready_to_ride: number;
  length_ft: number | null;
  brand: string | null;
  town: string;
  zip: string | null;
  photo: string | null;
  color: string | null;
  is_example: number;
  created_at: string;
};

function toBoard(r: Row): Board {
  return {
    id: r.id,
    name: r.name,
    blurb: r.blurb,
    readyToRide: r.ready_to_ride === 1,
    lengthFt: r.length_ft,
    brand: r.brand,
    town: r.town,
    zip: r.zip,
    photo: r.photo,
    color: r.color,
    isExample: r.is_example === 1,
    createdAt: r.created_at,
  };
}

export function listBoards(filter: BoardFilter = "all", limit = 100): Board[] {
  const where = filter === "ready" ? "WHERE ready_to_ride = 1" : filter === "love" ? "WHERE ready_to_ride = 0" : "";
  const rows = db.prepare(`SELECT * FROM boards ${where} ORDER BY created_at DESC LIMIT ?`).all(limit) as Row[];
  return rows.map(toBoard);
}

export function getBoard(id: string): Board | null {
  const row = db.prepare("SELECT * FROM boards WHERE id = ?").get(id) as Row | undefined;
  return row ? toBoard(row) : null;
}

export type NewBoard = Pick<Board, "name" | "blurb" | "readyToRide" | "lengthFt" | "brand" | "town" | "zip" | "photo">;

export function addBoard(id: string, ownerId: number, b: NewBoard) {
  db.prepare(`
    INSERT INTO boards (id, owner_id, name, blurb, ready_to_ride, length_ft, brand, town, zip, photo, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, ownerId, b.name, b.blurb, b.readyToRide ? 1 : 0, b.lengthFt, b.brand, b.town, b.zip, b.photo, new Date().toISOString());
}

export function daysListed(board: Board, now = Date.now()) {
  return Math.max(0, Math.floor((now - new Date(board.createdAt).getTime()) / (24 * 60 * 60 * 1000)));
}
