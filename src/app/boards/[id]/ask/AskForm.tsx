"use client";

import { useActionState, useState } from "react";
import { FormError, inputClass, SubmitButton } from "@/components/forms";
import { askAction, type AskState } from "@/app/requests/actions";

export function AskForm({ boardId, soonOptions, windowOptions }: { boardId: string; soonOptions: string[]; windowOptions: string[] }) {
  const [state, action, pending] = useActionState<AskState, FormData>(askAction, {});
  const v = state.values;
  const [when, setWhen] = useState<"anytime" | "windows">("anytime");

  return (
    // The key resets the fields to the last picked values after an error.
    <form action={action} key={JSON.stringify(v)} className="mt-8 flex flex-col gap-6">
      <FormError message={state.error} />
      <input type="hidden" name="boardId" value={boardId} />

      <fieldset>
        <legend className="font-bold text-sea-dark">How soon can you pick it up?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {soonOptions.map((s) => (
            <Pill key={s} type="radio" name="soon" value={s} label={s} required defaultChecked={v?.soon === s} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-bold text-sea-dark">What time works?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <Pill type="radio" name="when" value="anytime" label="Any time" checked={when === "anytime"} onChange={() => setWhen("anytime")} />
          <Pill type="radio" name="when" value="windows" label="Let me pick" checked={when === "windows"} onChange={() => setWhen("windows")} />
        </div>
        {when === "windows" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {windowOptions.map((w) => (
              <Pill key={w} type="checkbox" name="windows" value={w} label={w} defaultChecked={v?.windows.includes(w)} />
            ))}
          </div>
        )}
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-bold text-sea-dark">Anything else?</span>
        <textarea name="note" maxLength={200} rows={3} defaultValue={v?.note} className={inputClass} placeholder="I'm learning with my kids. Could meet near the pier." />
        <span className="text-sm text-gray-500">Optional. Don&apos;t put your address here.</span>
      </label>

      <SubmitButton pending={pending} pendingText="Sending…">
        Send my ask
      </SubmitButton>
    </form>
  );
}

function Pill(props: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  required?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
}) {
  const { label, ...input } = props;
  return (
    <label className="cursor-pointer rounded-full border-2 border-gray-200 px-4 py-2 font-bold text-sea-dark has-[:checked]:border-sea has-[:checked]:bg-sea has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-sea">
      <input {...input} className="sr-only" />
      {label}
    </label>
  );
}
