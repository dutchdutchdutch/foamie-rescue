import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { now, nowIso } from "./clock";
import { db } from "./db";
import { send } from "./outbox";
import { site } from "./site";

export type Person = { id: number; contact: string };

const cookieName = "foamie_session";
const codeMinutes = 15;
const maxTries = 5;

// Turns what someone typed into one clean email or US phone number, or null.
export function cleanContact(input: string): string | null {
  const text = input.trim().toLowerCase();
  if (text.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? text : null;
  const digits = text.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export function isPhone(contact: string) {
  return contact.startsWith("+");
}

// Makes a 6-digit code and "sends" it to the pretend inbox.
export function sendCode(contact: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expires = new Date(now().getTime() + codeMinutes * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO codes (contact, code, tries, expires_at) VALUES (?, ?, 0, ?)
    ON CONFLICT(contact) DO UPDATE SET code = excluded.code, tries = 0, expires_at = excluded.expires_at
  `).run(contact, code, expires);
  send(
    contact,
    `Your ${site.name} code: ${code}`,
    `Your code is ${code}. Type it on the website to confirm it's you. It works for ${codeMinutes} minutes.`,
  );
}

// Checks a code. On success, signs the person in and returns true.
export async function checkCode(contact: string, code: string): Promise<"ok" | "wrong" | "expired"> {
  const row = db.prepare("SELECT * FROM codes WHERE contact = ?").get(contact) as
    | { code: string; tries: number; expires_at: string }
    | undefined;
  if (!row || row.tries >= maxTries || new Date(row.expires_at).getTime() < now().getTime()) return "expired";
  if (row.code !== code.trim()) {
    db.prepare("UPDATE codes SET tries = tries + 1 WHERE contact = ?").run(contact);
    return "wrong";
  }
  db.prepare("DELETE FROM codes WHERE contact = ?").run(contact);

  const at = nowIso();
  db.prepare("INSERT INTO people (contact, created_at) VALUES (?, ?) ON CONFLICT(contact) DO NOTHING").run(contact, at);
  const person = db.prepare("SELECT id FROM people WHERE contact = ?").get(contact) as { id: number };
  const token = randomBytes(24).toString("hex");
  db.prepare("INSERT INTO sessions (token, person_id, created_at) VALUES (?, ?, ?)").run(token, person.id, at);
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return "ok";
}

export async function currentPerson(): Promise<Person | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const row = db
    .prepare("SELECT people.id, people.contact FROM sessions JOIN people ON people.id = sessions.person_id WHERE token = ?")
    .get(token) as Person | undefined;
  return row ?? null;
}

export async function signOut() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  store.delete(cookieName);
}

// Only lets people be sent back to a page on this site after signing in.
export function safeNext(next: unknown) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
