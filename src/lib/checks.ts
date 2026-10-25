import "server-only";
import { daysListed, expireDays, getBoard, reminderDays } from "./boards";
import { daysAgoIso, nowIso } from "./clock";
import { db } from "./db";
import { send } from "./outbox";
import { contactOf, getRequest } from "./requests";

// The "daily checks". A real site would run these once a day by itself. This one
// only runs them when you press the button on the Behind the scenes page.
export function runDailyChecks() {
  return { reminders: sendReminders(), followUps: sendFollowUps() };
}

// Day 20: remind the owner that the listing runs out soon (or already has).
function sendReminders() {
  const due = db
    .prepare(`
      SELECT id FROM boards
      WHERE status = 'listed' AND is_example = 0 AND owner_id IS NOT NULL
        AND COALESCE(listed_at, created_at) <= ?
        AND (reminded_at IS NULL OR reminded_at < COALESCE(listed_at, created_at))
    `)
    .all(daysAgoIso(reminderDays)) as { id: string }[];
  for (const { id } of due) {
    const board = getBoard(id)!;
    const daysLeft = expireDays - daysListed(board);
    send(
      contactOf(board.ownerId!),
      daysLeft > 0 ? `Is ${board.name} still looking for a home?` : `${board.name}'s listing ran out`,
      [
        daysLeft > 0
          ? `${board.name} has been listed for ${daysListed(board)} days. The listing runs out in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}.`
          : `${board.name} has been listed for ${expireDays} days, so it's no longer shown.`,
        "Still have it? Relist it with one tap. Gone already? Let us know so nobody asks for it.",
        "Both buttons are here: /mine",
      ].join("\n"),
    );
    db.prepare("UPDATE boards SET reminded_at = ? WHERE id = ?").run(nowIso(), id);
  }
  return due.length;
}

// A day after a yes: ask both people "Did it find a home?"
function sendFollowUps() {
  const due = db
    .prepare(`
      SELECT requests.id FROM requests JOIN boards ON boards.id = requests.board_id
      WHERE requests.status = 'yes' AND requests.handoff IS NULL AND requests.followup_sent_at IS NULL
        AND requests.answered_at <= ? AND boards.status = 'listed'
    `)
    .all(daysAgoIso(1)) as { id: number }[];
  for (const { id } of due) {
    const req = getRequest(id)!;
    const board = getBoard(req.boardId)!;
    const link = `/requests/${id}`;
    send(req.takerContact, `Did you pick up ${board.name}?`, `Tell us how it went, and add a photo if you like: ${link}`);
    send(contactOf(board.ownerId!), `Did ${board.name} find a home?`, `Let us know if it was picked up: ${link}`);
    db.prepare("UPDATE requests SET followup_sent_at = ? WHERE id = ?").run(nowIso(), id);
  }
  return due.length;
}

// Our impact so far.
export function impact() {
  const adopted = (db.prepare("SELECT COUNT(*) AS n FROM boards WHERE status = 'adopted'").get() as { n: number }).n;
  const notBought = (db.prepare("SELECT COUNT(*) AS n FROM requests WHERE would_buy = 'yes'").get() as { n: number }).n;
  return { adopted, notBought };
}
