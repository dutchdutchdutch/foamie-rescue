// Shared pieces for the site's forms.
export const inputClass = "w-full rounded-2xl border-2 border-gray-200 px-4 py-2.5 focus:border-sea focus:outline-none";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-2xl bg-coral/10 p-4 font-bold text-coral">
      {message}
    </p>
  );
}

export function SubmitButton({ pending, children, pendingText }: { pending: boolean; children: React.ReactNode; pendingText: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-full bg-cta px-8 py-3 text-lg font-bold text-white hover:bg-cta-dark disabled:opacity-60"
    >
      {pending ? pendingText : children}
    </button>
  );
}
