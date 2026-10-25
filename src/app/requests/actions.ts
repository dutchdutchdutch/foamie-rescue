"use server";

import { redirect } from "next/navigation";
import { currentPerson } from "@/lib/auth";
import { getBoard } from "@/lib/boards";
import { askForBoard, findRequest, getRequest, answerRequest, soonOptions, windowOptions } from "@/lib/requests";

export type AskState = { error?: string; values?: { soon: string; windows: string[]; note: string; anytime: boolean } };

export async function askAction(_prev: AskState, form: FormData): Promise<AskState> {
  const person = await currentPerson();
  if (!person) return { error: "Please confirm your phone or email first. Reload the page to do that." };
  const board = getBoard(String(form.get("boardId") ?? ""));
  if (!board || board.ownerId === null) return { error: "This board can't be asked for." };
  if (board.ownerId === person.id) return { error: "This is your own board." };
  const existing = findRequest(board.id, person.id);
  if (existing) redirect(`/requests/${existing.id}`);

  const soon = String(form.get("soon") ?? "");
  const anytime = form.get("when") !== "windows";
  const windows = anytime ? [] : form.getAll("windows").map(String).filter((w) => windowOptions.includes(w));
  const note = String(form.get("note") ?? "").trim().slice(0, 200);
  // Sent back with an error so the form keeps what was picked.
  const values = { soon, windows, note, anytime };
  if (!soonOptions.includes(soon)) return { error: "Please say how soon you can pick it up.", values };
  if (!anytime && windows.length === 0) return { error: "Pick at least one time window, or choose \"Any time\".", values };

  const id = askForBoard(board, person.id, { soon, windows, note });
  redirect(`/requests/${id}`);
}

export async function answerAction(form: FormData) {
  const person = await currentPerson();
  const req = getRequest(Number(form.get("requestId")));
  if (!person || !req) redirect("/");
  const board = getBoard(req.boardId);
  const answer = form.get("answer");
  if (board && board.ownerId === person.id && req.status === "waiting" && (answer === "yes" || answer === "no")) {
    answerRequest(req, board, answer);
  }
  redirect(`/requests/${req.id}`);
}
