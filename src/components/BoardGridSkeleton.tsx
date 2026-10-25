// Grey placeholder cards shown for a moment while boards load.
export function BoardGridSkeleton({ count }: { count: number }) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-96 animate-pulse rounded-3xl bg-sand" />
      ))}
    </div>
  );
}
