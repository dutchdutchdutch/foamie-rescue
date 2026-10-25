import "server-only";
import { getBoard, setBoardStatus, type Board } from "./boards";
import { nowIso } from "./clock";
import { db } from "./db";
import { send } from "./outbox";

// A taker asking for a board, and the giver's yes or no.
export type Status = "waiting" | "yes" | "no";

export type BoardRequest = {
  id: number;
  boardId: string;
  takerId: number;
  takerContact: string;
  soon: string;
  windows: string[]; // empty means anytime
  note: string;
  status: Status;
  handoff: "done" | "failed" | null; // did the pickup happen?
  wouldBuy: WouldBuy | null;
  takerPhoto: string | null;
  takerReported: boolean;
  createdAt: string;
};

export type WouldBuy = "yes" | "no" | "maybe";

export const soonOptions = ["Today", "In the next few days", "This weekend", "Next week"];
export const windowOptions = ["6–9 am", "9 am–12 pm", "12–3 pm", "3–6 pm", "6–9 pm"];

type Row = {
  id: number;
  board_id: string;
  taker_id: number;
  taker_contact: string;
  soon: string;
  windows: string;
  note: string;
  status: Status;
  handoff: "done" | "failed" | null;
  would_buy: WouldBuy | null;
  taker_photo: string | null;
  taker_reported_at: string | null;
  created_at: string;
};

const select = `
  SELECT requests.*, people.contact AS taker_contact
  FROM requests JOIN people ON people.id = requests.taker_id
`;

function toRequest(r: Row): BoardRequest {
  return {
    id: r.id,
    boardId: r.board_id,
    takerId: r.taker_id,
    takerContact: r.taker_contact,
    soon: r.soon,
    windows: r.windows === "anytime" ? [] : r.windows.split(","),
    note: r.note,
    status: r.status,
    handoff: r.handoff,
    wouldBuy: r.would_buy,
    takerPhoto: r.taker_photo,
    takerReported: r.taker_reported_at !== null,
    createdAt: r.created_at,
  };
}

export function whenText(req: Pick<BoardRequest, "soon" | "windows">) {
  return `${req.soon}, ${req.windows.length === 0 ? "any time" : req.windows.join(" or ")}`;
}

export function getRequest(id: number): BoardRequest | null {
  const row = db.prepare(`${select} WHERE requests.id = ?`).get(id) as Row | undefined;
  return row ? toRequest(row) : null;
}

export function findRequest(boardId: string, takerId: number): BoardRequest | null {
  const row = db.prepare(`${select} WHERE board_id = ? AND taker_id = ?`).get(boardId, takerId) as Row | undefined;
  return row ? toRequest(row) : null;
}

export function requestsForBoard(boardId: string): BoardRequest[] {
  const rows = db.prepare(`${select} WHERE board_id = ? ORDER BY requests.id DESC`).all(boardId) as Row[];
  return rows.map(toRequest);
}

export function requestsByTaker(takerId: number): (BoardRequest & { board: Board })[] {
  const rows = db.prepare(`${select} WHERE taker_id = ? ORDER BY requests.id DESC`).all(takerId) as Row[];
  return rows.flatMap((r) => {
    const board = getBoard(r.board_id);
    return board ? [{ ...toRequest(r), board }] : [];
  });
}

export function contactOf(personId: number) {
  return (db.prepare("SELECT contact FROM people WHERE id = ?").get(personId) as { contact: string }).contact;
}

// Saves the ask and lets the giver know.
export function askForBoard(board: Board, takerId: number, ask: { soon: string; windows: string[]; note: string }) {
  if (board.ownerId === null) throw new Error("This board has no owner to ask.");
  const result = db
    .prepare("INSERT INTO requests (board_id, taker_id, soon, windows, note, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(board.id, takerId, ask.soon, ask.windows.length ? ask.windows.join(",") : "anytime", ask.note, nowIso());
  const id = Number(result.lastInsertRowid);
  send(
    contactOf(board.ownerId),
    `Someone would like ${board.name}!`,
    [
      `Good news: someone wants to adopt ${board.name}.`,
      `When they can pick it up: ${whenText(ask)}.`,
      ask.note ? `Their note: "${ask.note}"` : "",
      `Say yes or no here: /requests/${id}`,
      "You can say yes to more than one person. Whoever shows up first gets the board.",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return id;
}

// The giver's answer. On yes, both people get each other's contact.
export function answerRequest(req: BoardRequest, board: Board, answer: "yes" | "no") {
  db.prepare("UPDATE requests SET status = ?, answered_at = ? WHERE id = ? AND status = 'waiting'").run(
    answer,
    nowIso(),
    req.id,
  );
  if (board.ownerId === null) return;
  const giver = contactOf(board.ownerId);
  if (answer === "yes") {
    send(
      req.takerContact,
      `Yes! You can pick up ${board.name}`,
      [
        `The owner of ${board.name} said yes.`,
        `Reach them at ${giver} to agree on the exact spot and time.`,
        "Heads up: they may say yes to more than one person, so whoever shows up first gets it.",
        `Details: /requests/${req.id}`,
      ].join("\n"),
    );
    send(
      giver,
      `You said yes for ${board.name}`,
      [
        `Here's how to reach the person picking up ${board.name}: ${req.takerContact}.`,
        `They said: ${whenText(req)}.`,
        `Details: /requests/${req.id}`,
      ].join("\n"),
    );
  } else {
    send(
      req.takerContact,
      `About ${board.name}`,
      `The owner of ${board.name} can't make it work this time. Don't give up, there are more boards waiting: /boards`,
    );
  }
}

// After a yes: did the board find a home? The taker can also say if they'd
// have bought a new foamie otherwise (our impact count) and add a photo.
export function reportByTaker(
  req: BoardRequest,
  board: Board,
  report: { pickedUp: boolean; wouldBuy: WouldBuy | null; photo: string | null },
) {
  const handoff = report.pickedUp ? "done" : "failed";
  db.prepare(`
    UPDATE requests SET handoff = COALESCE(handoff, ?), would_buy = ?, taker_photo = ?, taker_reported_at = ? WHERE id = ?
  `).run(handoff, report.wouldBuy, report.photo, nowIso(), req.id);
  if (board.ownerId === null) return;
  const giver = contactOf(board.ownerId);
  if (report.pickedUp) {
    markAdopted(board);
    send(
      giver,
      `🎉 ${board.name} found a home!`,
      [
        `${board.name} was picked up. Thank you for giving it a second life!`,
        report.photo ? `Here's a photo of ${board.name} with its new owner: /photos/${report.photo}` : "",
        report.wouldBuy === "yes" ? "They told us they would have bought a new foamie otherwise. That's one less made!" : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    send(req.takerContact, `Enjoy ${board.name}!`, `Thanks for adopting ${board.name}. When you're done with it, pass it on.`);
  } else if (board.status === "listed") {
    send(giver, `${board.name} wasn't picked up`, `The pickup for ${board.name} didn't happen. It's still listed: /boards/${board.id}`);
  }
}

export function reportByGiver(req: BoardRequest, board: Board, happened: boolean) {
  db.prepare("UPDATE requests SET handoff = ? WHERE id = ? AND handoff IS NULL").run(happened ? "done" : "failed", req.id);
  if (happened) {
    markAdopted(board);
    if (!req.takerReported) {
      send(
        req.takerContact,
        `Enjoy ${board.name}!`,
        `Thanks for adopting ${board.name}. One quick question for us, and a photo if you like: /requests/${req.id}`,
      );
    }
  }
}

function markAdopted(board: Board) {
  if (board.status === "listed") setBoardStatus(board.id, "adopted");
}
