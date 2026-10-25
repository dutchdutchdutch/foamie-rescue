"use server";

import { redirect } from "next/navigation";
import { checkCode, cleanContact, safeNext, sendCode, signOut } from "@/lib/auth";

export type SignInState = { error?: string; value?: string };

export async function startSignIn(_prev: SignInState, form: FormData): Promise<SignInState> {
  const typed = String(form.get("contact") ?? "");
  const next = safeNext(form.get("next"));
  const contact = cleanContact(typed);
  if (!contact) return { error: "That doesn't look like an email or a US phone number. Try again?", value: typed };
  sendCode(contact);
  redirect(`/signin/code?to=${encodeURIComponent(contact)}&next=${encodeURIComponent(next)}`);
}

export async function finishSignIn(_prev: SignInState, form: FormData): Promise<SignInState> {
  const contact = cleanContact(String(form.get("to") ?? ""));
  const code = String(form.get("code") ?? "");
  const next = safeNext(form.get("next"));
  if (!contact) redirect("/signin");
  const result = await checkCode(contact, code);
  if (result === "wrong") return { error: "That code isn't right. Check the inbox and try again.", value: code };
  if (result === "expired") return { error: "That code ran out. Go back and get a new one." };
  redirect(next);
}

export async function signOutAction() {
  await signOut();
  redirect("/");
}
