"use server";

import { redirect } from "next/navigation";
import { currentPerson } from "@/lib/auth";
import { getBoard, relistBoard, setBoardStatus } from "@/lib/boards";

// The owner's one-tap buttons: relist for another 30 days, or say it's gone.
export async function boardAction(form: FormData) {
  const person = await currentPerson();
  const board = getBoard(String(form.get("boardId") ?? ""));
  const back = String(form.get("back") ?? "/mine") === "board" && board ? `/boards/${board.id}` : "/mine";
  if (!person || !board || board.ownerId !== person.id || board.status === "adopted") redirect(back);
  if (form.get("do") === "relist") relistBoard(board.id);
  if (form.get("do") === "gone") setBoardStatus(board.id, "gone");
  redirect(back);
}
