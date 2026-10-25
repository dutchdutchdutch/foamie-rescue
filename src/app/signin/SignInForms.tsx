"use client";

import { useActionState } from "react";
import { FormError, inputClass, SubmitButton } from "@/components/forms";
import { finishSignIn, startSignIn, type SignInState } from "./actions";

export function ContactForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(startSignIn, {});
  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <FormError message={state.error} />
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5">
        <span className="font-bold text-sea-dark">Phone number or email</span>
        <input name="contact" required autoComplete="email" defaultValue={state.value} className={inputClass} placeholder="(714) 555-0123 or you@example.com" />
      </label>
      <SubmitButton pending={pending} pendingText="Sending…">Send me a code</SubmitButton>
    </form>
  );
}

export function CodeForm({ to, next }: { to: string; next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(finishSignIn, {});
  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <FormError message={state.error} />
      <input type="hidden" name="to" value={to} />
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5">
        <span className="font-bold text-sea-dark">6-digit code</span>
        <input
          name="code"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          defaultValue={state.value}
          className={`${inputClass} max-w-48 text-2xl tracking-[0.3em]`}
        />
      </label>
      <SubmitButton pending={pending} pendingText="Checking…">Confirm</SubmitButton>
    </form>
  );
}
