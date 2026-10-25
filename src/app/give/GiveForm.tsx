"use client";

import { useActionState } from "react";
import { FormError, inputClass as input, SubmitButton } from "@/components/forms";
import { listBoard, type GiveState } from "./actions";

const towns = [
  "Huntington Beach", "Newport Beach", "Costa Mesa", "Laguna Beach", "Dana Point", "San Clemente",
  "Seal Beach", "Sunset Beach", "Irvine", "Fountain Valley", "Laguna Niguel", "San Juan Capistrano",
];

export function GiveForm() {
  const [state, action, pending] = useActionState<GiveState, FormData>(listBoard, {});
  const v = state.values ?? {};

  return (
    // The key resets the fields to the last typed values after an error.
    <form action={action} key={JSON.stringify(v)} className="mt-8 flex flex-col gap-6">
      <FormError message={state.error} />

      <Field label="Photo of the board" hint="Required. One clear photo of the whole board.">
        <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic" required className={input} />
      </Field>

      <fieldset>
        <legend className="font-bold text-sea-dark">Can it go surfing today?</legend>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Choice name="ready" value="yes" checked={v.ready === "yes"} title="Yes, ready to ride" text="It floats, no big cracks." />
          <Choice name="ready" value="no" checked={v.ready === "no"} title="Needs some love" text="Broken or soggy. Good for fixing or reusing the foam." />
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
        <Field label="Town or neighborhood" hint="Required. Never your exact address.">
          <input name="town" list="towns" required defaultValue={v.town} className={input} placeholder="Huntington Beach" />
          <datalist id="towns">
            {towns.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
        <Field label="Zip code" hint="Optional.">
          <input name="zip" inputMode="numeric" pattern="\d{5}" maxLength={5} defaultValue={v.zip} className={input} placeholder="92648" />
        </Field>
      </div>

      <Field label="Give it a name" hint="Optional. Leave it empty and we'll pick a fun one.">
        <input name="name" maxLength={40} defaultValue={v.name} className={input} placeholder="Big Blue" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Length in feet" hint="Optional.">
          <input name="length" type="number" min={3} max={12} step={0.5} defaultValue={v.length} className={input} placeholder="8" />
        </Field>
        <Field label="Brand or model" hint="Optional.">
          <input name="brand" maxLength={60} defaultValue={v.brand} className={input} placeholder="Wavestorm" />
        </Field>
      </div>

      <Field label="A few words about it" hint="Optional. Dings, good for kids, loves small days…">
        <textarea name="blurb" maxLength={200} rows={3} defaultValue={v.blurb} className={input} />
      </Field>

      <SubmitButton pending={pending} pendingText="Listing…">
        List my board
      </SubmitButton>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold text-sea-dark">{label}</span>
      {children}
      <span className="text-sm text-gray-500">{hint}</span>
    </label>
  );
}

function Choice(props: { name: string; value: string; checked: boolean; title: string; text: string }) {
  return (
    <label className="flex flex-1 cursor-pointer gap-3 rounded-2xl border-2 border-gray-200 p-4 has-[:checked]:border-sea has-[:checked]:bg-sand">
      <input type="radio" name={props.name} value={props.value} defaultChecked={props.checked} required className="mt-1 accent-sea" />
      <span>
        <span className="block font-bold text-sea-dark">{props.title}</span>
        <span className="text-sm text-gray-600">{props.text}</span>
      </span>
    </label>
  );
}
