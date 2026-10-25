export function ReadyBadge({ ready, className = "" }: { ready: boolean; className?: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold text-white ${ready ? "bg-kelp" : "bg-coral"} ${className}`}
    >
      {ready ? "Ready to ride" : "Needs some love"}
    </span>
  );
}
