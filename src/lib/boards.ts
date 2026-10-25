import "server-only";
import { DAY, daysAgoIso, now, nowIso } from "./clock";
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
  ownerId: number | null;
  status: BoardStatus;
  listedAt: string; // when it was listed or last relisted
  createdAt: string;
};

export type BoardStatus = "listed" | "gone" | "adopted";

// A listing runs out after this many days, and the owner gets a reminder a while before.
export const expireDays = 30;
export const reminderDays = 20;

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
  owner_id: number | null;
  status: BoardStatus;
  listed_at: string | null;
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
    ownerId: r.owner_id,
    status: r.status,
    listedAt: r.listed_at ?? r.created_at,
    createdAt: r.created_at,
  };
}

// Boards people can still ask for: listed and not run out. Example boards never run out.
export function listBoards(filter: BoardFilter = "all", limit = 100): Board[] {
  const ready = filter === "ready" ? "AND ready_to_ride = 1" : filter === "love" ? "AND ready_to_ride = 0" : "";
  const rows = db
    .prepare(`
      SELECT * FROM boards
      WHERE status = 'listed' AND (is_example = 1 OR COALESCE(listed_at, created_at) > ?) ${ready}
      ORDER BY COALESCE(listed_at, created_at) DESC LIMIT ?
    `)
    .all(daysAgoIso(expireDays), limit) as Row[];
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
  `).run(id, ownerId, b.name, b.blurb, b.readyToRide ? 1 : 0, b.lengthFt, b.brand, b.town, b.zip, b.photo, nowIso());
}

export function listBoardsByOwner(ownerId: number): Board[] {
  const rows = db.prepare("SELECT * FROM boards WHERE owner_id = ? ORDER BY created_at DESC").all(ownerId) as Row[];
  return rows.map(toBoard);
}

export function daysListed(board: Board) {
  return Math.max(0, Math.floor((now().getTime() - new Date(board.listedAt).getTime()) / DAY));
}

export function isExpired(board: Board) {
  return board.status === "listed" && !board.isExample && daysListed(board) >= expireDays;
}

// Can people still ask for this board?
export function isOpen(board: Board) {
  return board.status === "listed" && !isExpired(board);
}

// One tap to put a board back up for another 30 days.
export function relistBoard(id: string) {
  db.prepare("UPDATE boards SET status = 'listed', listed_at = ?, reminded_at = NULL WHERE id = ?").run(nowIso(), id);
}

export function setBoardStatus(id: string, status: BoardStatus) {
  db.prepare("UPDATE boards SET status = ? WHERE id = ?").run(status, id);
}
