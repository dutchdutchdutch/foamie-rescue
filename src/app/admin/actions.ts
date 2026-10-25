"use server";

import { redirect } from "next/navigation";
import { runDailyChecks } from "@/lib/checks";
import { clockOffsetDays, setClockOffset } from "@/lib/clock";

export async function runChecksAction() {
  const { reminders, followUps } = runDailyChecks();
  redirect(`/admin?ran=1&reminders=${reminders}&followUps=${followUps}`);
}

export async function moveClockAction(form: FormData) {
  const days = Number(form.get("days"));
  setClockOffset(days === 0 ? 0 : clockOffsetDays() + days);
  redirect("/admin");
}
