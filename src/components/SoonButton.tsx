// A button for a feature that isn't built yet. It looks clearly "not ready"
// instead of like a broken orange button. Swap for a real link when the step lands.
export function SoonButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      disabled
      className={`cursor-not-allowed rounded-full bg-gray-100 px-6 py-2.5 font-bold text-gray-600 ${className}`}
    >
      {children} <span className="font-normal">· coming soon</span>
    </button>
  );
}
