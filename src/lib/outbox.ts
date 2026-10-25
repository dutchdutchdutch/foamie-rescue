import "server-only";
import { db } from "./db";

// The pretend inbox. Instead of really sending an email or text, the site
// saves the message here, and you can read it at /inbox.
export type Message = { id: number; to: string; subject: string; body: string; createdAt: string };

export function send(to: string, subject: string, body: string) {
  db.prepare("INSERT INTO outbox (to_contact, subject, body, created_at) VALUES (?, ?, ?, ?)").run(
    to,
    subject,
    body,
    new Date().toISOString(),
  );
}

export function listMessages(limit = 100): Message[] {
  const rows = db.prepare("SELECT * FROM outbox ORDER BY id DESC LIMIT ?").all(limit) as {
    id: number;
    to_contact: string;
    subject: string;
    body: string;
    created_at: string;
  }[];
  return rows.map((r) => ({ id: r.id, to: r.to_contact, subject: r.subject, body: r.body, createdAt: r.created_at }));
}
