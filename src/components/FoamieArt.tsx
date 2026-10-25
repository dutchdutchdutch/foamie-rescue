// A simple drawing of a soft-top board. Stands in for photos until real ones exist.
export function FoamieArt({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 300" className={className} aria-hidden="true">
      <rect x="22" y="10" width="76" height="280" rx="38" fill={color} />
      <rect x="22" y="10" width="76" height="280" rx="38" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="5" />
      <line x1="60" y1="30" x2="60" y2="270" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" />
      <path d="M50 255 L60 280 L70 255 Z" fill="#ffffff" fillOpacity="0.7" />
    </svg>
  );
}
