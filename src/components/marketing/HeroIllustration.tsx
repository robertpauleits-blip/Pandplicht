/**
 * Eigen abstracte lijnillustratie: bedrijfspand met signalen voor
 * energielabel, stroomnet en batterij. Decoratief, verborgen voor
 * screenreaders.
 */
export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 340"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {/* zachte achtergrondvorm */}
      <ellipse cx="210" cy="300" rx="185" ry="26" fill="var(--color-mint-soft)" />
      <circle cx="352" cy="72" r="40" fill="var(--color-mint)" opacity="0.5" />

      {/* bedrijfspand */}
      <g stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round">
        <path d="M84 298V150l68-44 68 44v148" fill="var(--color-surface)" />
        <path d="M220 298V128h116v170" fill="var(--color-surface)" />
        {/* zaagtanddak hal */}
        <path d="M220 128l30-24 28 24 30-24 28 24" fill="var(--color-mint-soft)" />
        {/* deur en ramen voorbouw */}
        <rect x="134" y="238" width="36" height="60" fill="var(--color-mint-soft)" />
        <rect x="104" y="170" width="28" height="26" rx="4" fill="var(--color-mint)" />
        <rect x="172" y="170" width="28" height="26" rx="4" fill="var(--color-mint)" />
        {/* ramen hal */}
        <rect x="240" y="156" width="24" height="22" rx="4" fill="var(--color-mint)" />
        <rect x="276" y="156" width="24" height="22" rx="4" fill="var(--color-mint)" />
        <rect x="240" y="196" width="60" height="18" rx="4" fill="var(--color-mint-soft)" />
      </g>

      {/* zonnepanelen op dak */}
      <g stroke="var(--color-pine)" strokeWidth="2.5">
        <rect x="96" y="132" width="22" height="15" rx="2" fill="var(--color-mint)" transform="rotate(-33 96 132)" />
        <rect x="122" y="115" width="22" height="15" rx="2" fill="var(--color-mint)" transform="rotate(-33 122 115)" />
      </g>

      {/* energielabel-kaartje */}
      <g>
        <rect x="30" y="60" width="88" height="58" rx="12" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="2" />
        <rect x="42" y="72" width="30" height="14" rx="4" fill="var(--color-action)" />
        <text x="50" y="83.5" fontSize="11" fontWeight="800" fill="#fff" fontFamily="inherit">C</text>
        <rect x="42" y="94" width="64" height="5" rx="2.5" fill="var(--color-line)" />
        <rect x="42" y="104" width="44" height="5" rx="2.5" fill="var(--color-line)" />
      </g>

      {/* hoogspanningsmast + lijn */}
      <g stroke="var(--color-ink-soft)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M382 298V206M370 298h24M372 236h20M374 220h16" />
        <path d="M382 206l-10 14h20l-10-14Z" fill="var(--color-mint-soft)" />
        <path d="M336 214c14 6 24 6 36 0" strokeDasharray="4 6" />
      </g>

      {/* batterij */}
      <g>
        <rect x="252" y="242" width="64" height="56" rx="10" fill="var(--color-ink)" />
        <rect x="262" y="252" width="44" height="8" rx="4" fill="var(--color-action)" />
        <rect x="262" y="266" width="44" height="8" rx="4" fill="var(--color-action)" />
        <rect x="262" y="280" width="28" height="8" rx="4" fill="var(--color-mint)" />
        {/* bliksem */}
        <path d="M330 236l-10 18h9l-7 16 18-22h-10l8-12h-8Z" fill="var(--color-amber)" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinejoin="round" />
      </g>

      {/* check-signaal boven pand */}
      <g>
        <circle cx="152" cy="74" r="22" fill="var(--color-action)" />
        <path d="m142 74.5 6.5 6.5 13-14" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
