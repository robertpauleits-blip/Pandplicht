/**
 * Mini-scenes voor de onderwerpkaarten. Elke scene is een kleine SVG-wereld
 * die op hover van de kaart (Tailwind `group-hover`) subtiel reageert.
 * Alle beweging is puur CSS en wordt uitgeschakeld bij reduced motion.
 */

const svgProps = {
  viewBox: "0 0 160 96",
  fill: "none",
  "aria-hidden": true as const,
  focusable: false as const,
};

/** Pandverplichtingen: een checklist schuift uit het gebouw. */
export function ScenePand({ className = "" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      {/* gebouw */}
      <rect x="22" y="20" width="44" height="62" rx="4" fill="#0e5a4f" />
      <rect x="22" y="20" width="44" height="5" fill="#f2bb4a" opacity="0.9" />
      {[32, 46].map((x) =>
        [32, 46, 60].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="10" rx="1.5" fill="#cdf1e0" />
        )),
      )}
      <rect x="38" y="70" width="12" height="12" rx="1.5" fill="#bceedc" />
      {/* checklist-kaart die uitschuift */}
      <g className="scene-slide">
        <rect x="76" y="26" width="62" height="48" rx="6" fill="#ffffff" stroke="#e6eceb" />
        {[38, 50, 62].map((y, i) => (
          <g key={y}>
            <circle
              cx="86"
              cy={y}
              r="4"
              fill={i < 2 ? "#18a978" : "#fff"}
              stroke={i < 2 ? "none" : "#ccd9d8"}
              strokeWidth="1.5"
              className={i === 2 ? "scene-check-late" : undefined}
            />
            {i < 2 && (
              <path
                d={`m83.5 ${y} 1.8 1.8 3.4-3.8`}
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <rect x="95" y={y - 2.5} width={i === 1 ? 30 : 38} height="5" rx="2.5" fill="#e6eceb" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Energiebesparing: de meter loopt bij hover terug van hoog naar laag. */
export function SceneMeter({ className = "" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      {/* meterboog */}
      <path
        d="M40 76a40 40 0 0 1 80 0"
        stroke="#e6eceb"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M40 76a40 40 0 0 1 23-36"
        stroke="#18a978"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M74 37.5a40 40 0 0 1 24 4.5"
        stroke="#f2bb4a"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M105 46a40 40 0 0 1 15 30"
        stroke="#d76652"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* naald: staat hoog, zakt bij hover terug naar groen */}
      <g className="scene-needle">
        <line x1="80" y1="76" x2="80" y2="44" stroke="#16313a" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <circle cx="80" cy="76" r="6" fill="#16313a" />
      <circle cx="80" cy="76" r="2.5" fill="#fff" />
    </svg>
  );
}

/** Netcongestie: netwerkpunten kleuren bij hover van rood naar groen. */
export function SceneGrid({ className = "" }: { className?: string }) {
  const nodes: [number, number, number][] = [
    [26, 66, 0],
    [58, 30, 1],
    [80, 62, 2],
    [110, 26, 3],
    [134, 58, 4],
  ];
  return (
    <svg {...svgProps} className={className}>
      {/* verbindingen */}
      <g stroke="#ccd9d8" strokeWidth="2">
        <path d="M26 66 58 30M58 30l22 32M80 62l30-36M110 26l24 32M58 30h52M26 66l54-4 54-4" opacity="0.6" />
      </g>
      {/* stroompuls over de lijn (alleen bij hover zichtbaar) */}
      <path
        className="scene-pulse"
        d="M26 66 58 30l22 32 30-36 24 32"
        stroke="#18a978"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* knooppunten: rood -> groen */}
      {nodes.map(([x, y, i]) => (
        <g key={i}>
          <circle cx={x} cy={y} r="8" fill="#fff" stroke="#e6eceb" strokeWidth="1.5" />
          <circle
            cx={x}
            cy={y}
            r="4.5"
            fill="#d76652"
            className="scene-node"
            style={{ transitionDelay: `${i * 90}ms` }}
          />
        </g>
      ))}
    </svg>
  );
}

/** Zakelijke batterij: stroom loopt van paneel via batterij naar het pand. */
export function SceneBattery({ className = "" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      {/* zonnepaneel */}
      <g>
        <rect x="14" y="22" width="34" height="20" rx="2.5" fill="#16313a" transform="skewX(-8)" />
        <path d="M20 27h30M22 32h30M24 37h30" stroke="#3a5560" strokeWidth="1.4" transform="skewX(-8)" />
        <path d="M28 42v10h-6" stroke="#46606a" strokeWidth="2" />
      </g>
      {/* batterij */}
      <rect x="64" y="52" width="34" height="20" rx="4" fill="#0e5a4f" />
      <rect x="98" y="58" width="4" height="8" rx="2" fill="#0e5a4f" />
      <path
        d="M83 56l-5 7h6l-4 7"
        stroke="#f2bb4a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* laadniveau dat bij hover vult */}
      <rect x="68" y="56" width="10" height="12" rx="2" fill="#18a978" className="scene-charge" />
      {/* pand */}
      <rect x="118" y="34" width="30" height="44" rx="3" fill="#116154" />
      {[124, 136].map((x) =>
        [40, 52, 64].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="7" height="8" rx="1.2" fill="#cdf1e0" />
        )),
      )}
      {/* stroomlijnen paneel -> batterij -> pand */}
      <path
        className="scene-flow"
        d="M40 52c8 10 14 12 22 12"
        stroke="#18a978"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="scene-flow"
        d="M102 62c6 0 10-2 14-6"
        stroke="#18a978"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
