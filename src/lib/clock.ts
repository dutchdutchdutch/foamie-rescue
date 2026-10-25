import "server-only";
import { db } from "./db";

// The site's clock. Things like "expire after 30 days" are hard to try out for
// real, so the Behind the scenes page can move this clock forward by whole days.
export const DAY = 24 * 60 * 60 * 1000;

export function clockOffsetDays(): number {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'clock_offset_days'").get() as { value: string } | undefined;
  return row ? Number(row.value) : 0;
}

export function now(): Date {
  return new Date(Date.now() + clockOffsetDays() * DAY);
}

export function nowIso() {
  return now().toISOString();
}

export function daysAgoIso(days: number) {
  return new Date(now().getTime() - days * DAY).toISOString();
}

export function setClockOffset(days: number) {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES ('clock_offset_days', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(String(Math.max(0, Math.round(days))));
}
