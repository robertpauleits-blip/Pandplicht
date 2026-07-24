/**
 * Mini-scenes voor de onderwerpkaarten, met één gedeelde visuele grammatica:
 * hetzelfde viewBox-grid (128×96), dezelfde optische grootte, dezelfde
 * lijndikte (2.5) met ronde uiteinden, dezelfde baseline (y≈82) en één
 * merkpalet (pine, mint-glas, amber, action-groen). Elke scene reageert op
 * hover van de kaart; alle beweging is CSS en staat uit bij reduced motion.
 */

const PINE = "#0e5a4f";
const PINE_D = "#0a4239";
const GLASS = "#cdf1e0";
const AMBER = "#f2bb4a";
const ACTION = "#18a978";
const LINE = "#d7e3e0";

const svgBase = {
  viewBox: "0 0 128 96",
  fill: "none",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: false as const,
};

const BASELINE = 82;

/** Grondschaduw zodat elke scene op dezelfde baseline 'staat'. */
function Ground() {
  return (
    <ellipse cx="64" cy={BASELINE + 4} rx="52" ry="4" fill="#16313a" opacity="0.06" />
  );
}

/** Pandverplichtingen: een checklist schuift uit het gebouw. */
export function ScenePand({ className = "" }: { className?: string }) {
  return (
    <svg {...svgBase} className={className}>
      <Ground />
      {/* gebouw */}
      <rect x="18" y="30" width="40" height="52" rx="4" fill={PINE} />
      <rect x="18" y="30" width="40" height="5" rx="2" fill={AMBER} />
      {[26, 42].map((x) =>
        [42, 56, 70].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="9" rx="1.5" fill={GLASS} />
        )),
      )}
      {/* checklist-kaart die uitschuift */}
      <g className="scene-slide">
        <rect x="66" y="28" width="52" height="46" rx="6" fill="#fff" stroke={LINE} />
        {[40, 51, 62].map((y, i) => (
          <g key={y}>
            <circle
              cx="77"
              cy={y}
              r="4.5"
              fill={i < 2 ? ACTION : "#fff"}
              stroke={i < 2 ? "none" : LINE}
            />
            {i < 2 && (
              <path
                d={`m74.6 ${y} 1.7 1.7 3.2-3.6`}
                stroke="#fff"
                strokeWidth="1.6"
              />
            )}
            <rect x="87" y={y - 2.5} width={i === 1 ? 20 : 26} height="5" rx="2.5" fill={LINE} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Energiebesparing: meter met gelijke openingen; naald zakt bij hover terug. */
export function SceneMeter({ className = "" }: { className?: string }) {
  // Halve boog (180°→360°) in drie segmenten met exact gelijke openingen.
  const cx = 64;
  const cy = BASELINE - 2;
  const r = 34;
  const pol = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  };
  const arc = (from: number, to: number) =>
    `M ${pol(from)} A ${r} ${r} 0 0 1 ${pol(to)}`;
  return (
    <svg {...svgBase} className={className}>
      <Ground />
      {/* drie segmenten, elk 54°, met 9° opening ertussen, ronde uiteinden */}
      <path d={arc(180, 234)} stroke={ACTION} />
      <path d={arc(243, 297)} stroke={AMBER} />
      <path d={arc(306, 360)} stroke="#d76652" />
      {/* naald: staat hoog, zakt bij hover richting groen */}
      <g className="scene-needle">
        <line x1={cx} y1={cy} x2={cx} y2={cy - 26} stroke={PINE_D} strokeWidth="3" />
      </g>
      <circle cx={cx} cy={cy} r="5" fill={PINE_D} />
      <circle cx={cx} cy={cy} r="2" fill="#fff" />
    </svg>
  );
}

/** Netcongestie: netwerkknopen kleuren bij hover van amber naar groen. */
export function SceneGrid({ className = "" }: { className?: string }) {
  const nodes: [number, number, number][] = [
    [28, 70, 0],
    [56, 40, 1],
    [78, 66, 2],
    [100, 36, 3],
    [112, 64, 4],
  ];
  const path = "M28 70 L56 40 L78 66 L100 36 L112 64";
  return (
    <svg {...svgBase} className={className}>
      <Ground />
      {/* verbindingen: mint, duidelijk zichtbaar */}
      <path d={path} stroke={GLASS} strokeWidth="3" />
      <path d="M56 40 L112 64" stroke={GLASS} strokeWidth="3" opacity="0.7" />
      {/* stroompuls over de route (bij hover) */}
      <path className="scene-pulse" d={path} stroke={ACTION} strokeWidth="3" />
      {/* knooppunten: amber → groen */}
      {nodes.map(([x, y, i]) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7.5" fill="#fff" stroke={LINE} strokeWidth="2" />
          <circle
            cx={x}
            cy={y}
            r="4"
            fill={AMBER}
            className="scene-node"
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        </g>
      ))}
    </svg>
  );
}

/** Zakelijke batterij: één vloeiende energieroute paneel → batterij → pand. */
export function SceneBattery({ className = "" }: { className?: string }) {
  return (
    <svg {...svgBase} className={className}>
      <Ground />
      {/* zonnepaneel (links): paneel en strepen in één gekantelde groep,
          zodat de strepen exact meelopen met het paneel */}
      <g transform="rotate(-8 28 60)">
        <rect x="14" y="52" width="28" height="16" rx="2.5" fill={PINE} />
        <path d="M17 56.5h22M17 60h22M17 63.5h22" stroke={GLASS} strokeWidth="1.4" />
      </g>
      <path d="M28 67v15" stroke={PINE} strokeWidth="2.5" />
      {/* batterij (midden, op de baseline) */}
      <rect x="54" y="60" width="30" height="22" rx="4" fill={PINE} />
      <rect x="84" y="66" width="4" height="10" rx="2" fill={PINE} />
      {/* laadniveau dat bij hover vult, blijft áchter het bliksemicoon */}
      <rect x="58" y="64" width="9" height="14" rx="2" fill={ACTION} className="scene-charge" />
      {/* bliksem staat vóór het laadniveau */}
      <path d="M71 64l-4 6h5l-4 6" stroke={AMBER} strokeWidth="2.2" />
      {/* pand (rechts, op de baseline) */}
      <rect x="98" y="44" width="24" height="38" rx="3" fill={PINE} />
      <rect x="98" y="44" width="24" height="4" rx="2" fill={AMBER} />
      {[103, 113].map((x) =>
        [52, 63, 74].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1.2" fill={GLASS} />
        )),
      )}
      {/* één vloeiende energieroute paneel → batterij → pand */}
      <path
        className="scene-flow"
        d="M30 74 C42 74 46 71 54 71 M84 71 C90 71 94 66 98 63"
        stroke={ACTION}
        strokeWidth="2.5"
        strokeDasharray="5 7"
      />
    </svg>
  );
}
