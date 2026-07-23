/**
 * Subtiel merkelement: dunne lijnen geïnspireerd op perceelgrenzen en
 * technische bouwtekeningen (kadastrale sfeer). Puur decoratief.
 */
export function ParcelLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 140"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g stroke="#16313a" strokeWidth="1" fill="none" opacity="0.08">
        {/* perceelgrenzen */}
        <path d="M-20 96 L150 88 L262 102 L410 82 L536 94 L700 78 L845 92 L1010 80 L1220 90" />
        <path d="M150 88 L176 34 L318 26 L336 -10" />
        <path d="M410 82 L392 20 L520 12" />
        <path d="M700 78 L716 24 L860 30 L872 -8" />
        <path d="M1010 80 L996 30 L1120 22" />
        <path d="M262 102 L276 150" />
        <path d="M536 94 L524 150" />
        <path d="M845 92 L858 150" />
      </g>
      {/* maatvoeringslijn met eindstreepjes */}
      <g stroke="#0e5a4f" strokeWidth="1" fill="none" opacity="0.14">
        <path d="M392 56 H716" strokeDasharray="5 6" />
        <path d="M392 50 V62 M716 50 V62" />
      </g>
      {/* landmeetkruisjes op hoekpunten */}
      <g stroke="#16313a" strokeWidth="1.2" opacity="0.14">
        {[
          [176, 34],
          [520, 12],
          [716, 24],
          [996, 30],
          [318, 26],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <path d={`M${x! - 5} ${y} H${x! + 5}`} />
            <path d={`M${x} ${y! - 5} V${y! + 5}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
