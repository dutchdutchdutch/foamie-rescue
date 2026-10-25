"use server";

import { redirect } from "next/navigation";
import { currentPerson } from "@/lib/auth";
import { getBoard, isOpen } from "@/lib/boards";
import { askForBoard, findRequest, getRequest, answerRequest, reportByGiver, reportByTaker, soonOptions, windowOptions, type WouldBuy } from "@/lib/requests";
import { savePhoto } from "@/lib/photos";

export type AskState = { error?: string; values?: { soon: string; windows: string[]; note: string; anytime: boolean } };

export async function askAction(_prev: AskState, form: FormData): Promise<AskState> {
  const person = await currentPerson();
  if (!person) return { error: "Please confirm your phone or email first. Reload the page to do that." };
  const board = getBoard(String(form.get("boardId") ?? ""));
  if (!board || board.ownerId === null || !isOpen(board)) return { error: "This board can't be asked for anymore." };
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

// "Did it find a home?" from the person who picked it up.
export async function takerReportAction(_prev: AskState, form: FormData): Promise<AskState> {
  const person = await currentPerson();
  const req = getRequest(Number(form.get("requestId")));
  const board = req ? getBoard(req.boardId) : null;
  if (!person || !req || !board || req.takerId !== person.id || req.status !== "yes" || req.takerReported) {
    return { error: "Something went wrong. Reload the page and try again." };
  }
  const picked = form.get("picked");
  if (picked !== "yes" && picked !== "no") return { error: "Please say if you picked it up." };
  const wb = form.get("wouldBuy");
  const wouldBuy: WouldBuy | null = wb === "yes" || wb === "no" || wb === "maybe" ? wb : null;
  let photo: string | null = null;
  const file = form.get("photo");
  if (picked === "yes" && file instanceof File && file.size > 0) {
    const saved = await savePhoto(file);
    if ("error" in saved) return { error: saved.error };
    photo = saved.name;
  }
  reportByTaker(req, board, { pickedUp: picked === "yes", wouldBuy: picked === "yes" ? wouldBuy : null, photo });
  redirect(`/requests/${req.id}`);
}

// "Did it find a home?" from the owner.
export async function giverReportAction(form: FormData) {
  const person = await currentPerson();
  const req = getRequest(Number(form.get("requestId")));
  const board = req ? getBoard(req.boardId) : null;
  if (person && req && board && board.ownerId === person.id && req.status === "yes" && req.handoff === null) {
    reportByGiver(req, board, form.get("happened") === "yes");
  }
  redirect(req ? `/requests/${req.id}` : "/mine");
}
