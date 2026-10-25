"use client";

import { useActionState, useState } from "react";
import { FormError, inputClass, SubmitButton } from "@/components/forms";
import { takerReportAction, type AskState } from "../actions";

// "Did you pick it up?" for the person who asked for the board.
export function TakerReport({ requestId, boardName }: { requestId: number; boardName: string }) {
  const [state, action, pending] = useActionState<AskState, FormData>(takerReportAction, {});
  const [picked, setPicked] = useState<"yes" | "no" | null>(null);
  const choice =
    "cursor-pointer rounded-full border-2 border-gray-200 px-4 py-2 font-bold text-sea-dark has-[:checked]:border-sea has-[:checked]:bg-sea has-[:checked]:text-white";

  return (
    <form action={action} className="mt-8 flex flex-col gap-5 rounded-3xl bg-sand p-6">
      <p className="text-lg font-extrabold text-sea-dark">Did you pick up {boardName}?</p>
      <FormError message={state.error} />
      <input type="hidden" name="requestId" value={requestId} />
      <div className="flex flex-wrap gap-2">
        <label className={choice}>
          <input type="radio" name="picked" value="yes" required className="sr-only" checked={picked === "yes"} onChange={() => setPicked("yes")} />
          Yes, I got it!
        </label>
        <label className={choice}>
          <input type="radio" name="picked" value="no" className="sr-only" checked={picked === "no"} onChange={() => setPicked("no")} />
          No, it didn&apos;t happen
        </label>
      </div>

      {picked === "yes" && (
        <>
          <fieldset>
            <legend className="font-bold text-sea-dark">Would you have bought a new foamie otherwise?</legend>
            <p className="text-sm text-gray-600">This is how we count new foamies that didn&apos;t get made.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ["yes", "Yes"],
                ["maybe", "Maybe"],
                ["no", "No"],
              ].map(([value, label]) => (
                <label key={value} className={choice}>
                  <input type="radio" name="wouldBuy" value={value} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1.5">
            <span className="font-bold text-sea-dark">A photo of you with {boardName}</span>
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic" className={`${inputClass} bg-white`} />
            <span className="text-sm text-gray-500">Optional. We send it to the person who gave it away. It makes their day.</span>
          </label>
        </>
      )}

      <SubmitButton pending={pending} pendingText="Sending…">
        Send
      </SubmitButton>
    </form>
  );
}
