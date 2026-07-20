/**
 * Eigen SVG-woordmerk: gebouwsymbool met checkmark + "PandPlicht".
 */
export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-full w-auto shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        {/* pand */}
        <path
          d="M6 34V16.5L15.5 9l9.5 7.5V34h-7v-9h-5v9H6Z"
          fill="var(--color-ink)"
        />
        {/* checkmark-cirkel */}
        <circle cx="29.5" cy="27.5" r="9.5" fill="var(--color-action)" />
        <path
          d="m25.4 27.6 2.8 2.8 5.4-5.8"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[1.35rem] font-extrabold tracking-tight leading-none">
        <span className="text-ink">Pand</span>
        <span className="text-pine">Plicht</span>
      </span>
    </span>
  );
}
