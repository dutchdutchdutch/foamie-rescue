# Foamie Rescue: Tech Plan

Draft, 2026-10-25. Goes with [foamie-rescue-spec.md](foamie-rescue-spec.md) and [brand.md](brand.md).

## The ground rules

- **Runs only on your Mac**, at `http://localhost:3000`. Nothing gets deployed, no hosting accounts, no outside services.
- **Nothing runs on a timer.** The site only does work when someone opens a page or clicks a button.
- **No real emails or texts.** Instead, a pretend inbox page shows every message the site *would* have sent.
- Small pull requests. You merge them; I never do.

## The tools (stack)

| Part | Choice | Why |
|---|---|---|
| Website | **Next.js** (with TypeScript) | One project for pages and server code. It's what Vercel is built for, so moving later is easy. |
| Look | **Tailwind CSS** | Quick to style the warm, rounded PetSpace look. |
| Data | **SQLite** (one file on your Mac), using the one built into Node.js | No database to install, nothing extra to download. All database code is in two small files (`src/lib/db.ts` and `src/lib/boards.ts`), so moving to a free hosted database later means rewriting just those. |
| Photos | Saved in a folder in the project (`data/photos/`) | Later, swap for Vercel Blob or Firebase Storage. |
| Email / phone check | **Fake.** The 6-digit code shows in the pretend inbox. | Real email/SMS needs outside accounts. Plug in later. |

All you need on your Mac is **Node.js** (free, one installer). The README will walk you through it: download, install, run, open the link.

## How the "timed" parts work without a timer

The spec has things that happen after some days (reminder at day 20, expire at day 30, "Did it find a home?" a day after a match). Instead of a scheduled job:

- Each time a page loads, the site checks dates. A listing older than 30 days just stops showing.
- An admin page has a **"Run daily checks"** button. Click it and the site writes any due reminders into the pretend inbox.

## Pages (first version)

Home ("See who's waiting…") · Board list with filters · Board profile · List a board · "I'd like this board" form · Giver's yes/no page · Pretend inbox · Admin (review queue for reports, "Run daily checks"). A map comes later.

## Answers to the 4 "Still open" items

1. **Money:** not needed yet. Version 1 costs $0 because it only runs on your Mac. Decide when we add texting.
2. **Name:** keep "Foamie Rescue" for now. The name lives in one settings file, so changing it later is one edit.
3. **Friendlier "Ready to surf as-is?":** ask **"Can it go surfing today?"** with two answers: **"Yes, ready to ride"** (green badge) and **"Needs some love"** (upcycle only badge).
4. **Upcyclers:** browse like everyone else, plus a **"Needs some love"** filter so they can find broken boards fast. Alerts and first pick can come later.

## Build order (one PR each)

1. Project setup, README with run steps, home page with the brand look.
2. Boards: list a board (with photo), board list, board profile. Fake sample boards so it doesn't look empty.
3. Sign-in by code (fake) and the pretend inbox.
4. "I'd like this board", giver yes/no, contact swap.
5. Expire, reminder, relist, and "Did it find a home?" (via the button).
6. Report button and admin review queue.
