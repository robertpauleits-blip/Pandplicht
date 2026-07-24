import type { CSSProperties, ReactNode } from "react";
import {
  IconBattery,
  IconGrid,
  IconMeter,
  IconPand,
} from "@/components/marketing/ToolIcons";

export type ScanPhase = "idle" | "scanning" | "done";

/**
 * Eén gedeelde coördinatenruimte (viewBox 480×470) voor zowel het gebouw, de
 * verbindingslijnen als de kaartposities. Daardoor komt elke lijn precies uit
 * bij het bolletje van de kaart en bij een logisch ankerpunt op het gebouw.
 */
const VW = 480;
const VH = 470;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

type Card = {
  label: string;
  Icon: (p: { className?: string }) => ReactNode;
  tone: "amber" | "green";
  order: number;
  /** Positie van het kaart-anker in de gedeelde ruimte + hoe de kaart daaraan hangt. */
  at: { x: number; y: number; translate: string };
  /** Verbinding: van het kaart-bolletje (from) via twee controlepunten naar het gebouw (to). */
  link: { from: [number, number]; c1: [number, number]; c2: [number, number]; to: [number, number] };
};

const CARDS: Card[] = [
  {
    label: "Labelplicht",
    Icon: IconPand,
    tone: "amber",
    order: 0,
    at: { x: 236, y: 40, translate: "translate(-50%, -100%)" },
    link: { from: [236, 44], c1: [236, 62], c2: [236, 74], to: [236, 88] },
  },
  {
    label: "Energiebesparingsplicht",
    Icon: IconMeter,
    tone: "amber",
    order: 1,
    at: { x: 96, y: 178, translate: "translate(-100%, -50%)" },
    link: { from: [100, 178], c1: [126, 180], c2: [140, 192], to: [151, 202] },
  },
  {
    label: "Netcongestie",
    Icon: IconGrid,
    tone: "green",
    order: 2,
    at: { x: 418, y: 250, translate: "translate(0, -50%)" },
    link: { from: [414, 250], c1: [416, 266], c2: [412, 278], to: [409, 288] },
  },
  {
    label: "Batterijkans",
    Icon: IconBattery,
    tone: "green",
    order: 3,
    at: { x: 74, y: 348, translate: "translate(-100%, -50%)" },
    link: { from: [78, 348], c1: [104, 344], c2: [116, 316], to: [124, 290] },
  },
];

const linkPath = (l: Card["link"]) =>
  `M ${l.from[0]} ${l.from[1]} C ${l.c1[0]} ${l.c1[1]}, ${l.c2[0]} ${l.c2[1]}, ${l.to[0]} ${l.to[1]}`;

/** Vensterrasters. Sommige vensters 'branden' zodra de scan actief is. */
function windows(
  cols: number[],
  rows: number[],
  w: number,
  h: number,
  lit: (r: number, c: number) => boolean,
) {
  const out: ReactNode[] = [];
  rows.forEach((y, r) =>
    cols.forEach((x, c) => {
      out.push(
        <rect
          key={`${r}-${c}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={2.5}
          className={lit(r, c) ? "ps-win ps-win-lit" : "ps-win"}
          fill="url(#ps-glass)"
        />,
      );
    }),
  );
  return out;
}

function StatusPill({ phase }: { phase: ScanPhase }) {
  if (phase === "scanning") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white/95 px-4 py-2 text-[0.78rem] font-bold text-ink shadow-lift backdrop-blur sm:text-sm">
        <span className="pandscan-ping h-2.5 w-2.5 rounded-full bg-amber" />
        Pand analyseren&hellip;
      </span>
    );
  }
  if (phase === "done") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-pine px-4 py-2 text-[0.78rem] font-bold text-white shadow-lift sm:text-sm">
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 text-amber"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m4 10.3 3.2 3.2L16 5.4" />
        </svg>
        Pand gevonden
        <span className="h-1 w-1 rounded-full bg-white/50" aria-hidden="true" />
        <span className="font-semibold text-mint">4 mogelijke aandachtspunten</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-[0.78rem] font-bold text-ink-soft shadow-lift sm:text-sm">
      <span className="h-2.5 w-2.5 rounded-full bg-action/70" />
      Klaar voor controle
    </span>
  );
}

/**
 * Interactieve pandscan-illustratie. Puur presentatie, de fase komt van de
 * ouder. Zonder JS/animatie is dit een nette, volledig zichtbare compositie
 * (fase "done"). Het is een visuele preview, geen echte uitslag.
 */
export function PandScan({
  phase,
  scanId,
  enhanced,
  noAnim,
}: {
  phase: ScanPhase;
  scanId: number;
  enhanced: boolean;
  noAnim: boolean;
}) {
  const live = phase !== "idle";

  return (
    <div
      role="img"
      aria-label="Illustratie: een bedrijfspand wordt gescand op energiebesparingsplicht, labelplicht, netcongestie en batterijkans. Visuele preview: pand gevonden, 4 mogelijke aandachtspunten."
      data-revealed={live ? "true" : undefined}
      className={`relative mx-auto w-full max-w-[30rem] ${enhanced ? "pandscan-enh" : ""} ${
        noAnim ? "pandscan-noanim" : ""
      } ${live ? "pandscan-live" : ""}`}
    >
      {/* Zachte, diepe slagschaduw / gloed onder het pand */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] bottom-[15%] h-16 rounded-[50%] bg-ink/20 blur-2xl"
      />

      <svg
        viewBox="0 0 480 470"
        className="relative w-full drop-shadow-[0_26px_50px_rgba(22,49,58,0.16)]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ps-tower" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1c8571" />
            <stop offset="0.5" stopColor="#116154" />
            <stop offset="1" stopColor="#0a4239" />
          </linearGradient>
          <linearGradient id="ps-tower-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c4b41" />
            <stop offset="1" stopColor="#073730" />
          </linearGradient>
          <linearGradient id="ps-tower-roof" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2ea088" />
            <stop offset="1" stopColor="#1f8471" />
          </linearGradient>
          <linearGradient id="ps-annexR" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#127564" />
            <stop offset="1" stopColor="#083c34" />
          </linearGradient>
          <linearGradient id="ps-annexR-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a463d" />
            <stop offset="1" stopColor="#06322b" />
          </linearGradient>
          <linearGradient id="ps-annexR-roof" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#248b78" />
            <stop offset="1" stopColor="#166f5e" />
          </linearGradient>
          <linearGradient id="ps-annexL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22957f" />
            <stop offset="1" stopColor="#0f6153" />
          </linearGradient>
          <linearGradient id="ps-annexL-roof" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#37ac95" />
            <stop offset="1" stopColor="#249480" />
          </linearGradient>
          <linearGradient id="ps-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2fcf7" />
            <stop offset="0.5" stopColor="#cdf1e0" />
            <stop offset="1" stopColor="#a5e2ca" />
          </linearGradient>
          <pattern id="ps-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0V26" fill="none" stroke="#16313a" strokeWidth="1" opacity="0.07" />
          </pattern>
          <linearGradient id="ps-grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.4" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="ps-grid-mask">
            <rect x="90" y="40" width="320" height="360" fill="url(#ps-grid-fade)" />
          </mask>
        </defs>

        {/* technisch meetraster achter het pand */}
        <rect x="90" y="40" width="320" height="360" fill="url(#ps-grid)" mask="url(#ps-grid-mask)" />

        {/* grondlijn / diepe schaduw */}
        <ellipse cx="242" cy="424" rx="196" ry="16" fill="#16313a" opacity="0.10" />

        {/* ---- rechter blok ---- */}
        <polygon points="300,176 396,176 410,166 314,166" fill="url(#ps-annexR-roof)" />
        <polygon points="396,176 410,166 410,406 396,416" fill="url(#ps-annexR-side)" />
        <rect x="300" y="176" width="96" height="240" rx="4" fill="url(#ps-annexR)" />
        {windows(
          [316, 352],
          [200, 240, 280, 320, 360],
          22,
          24,
          (r, c) => (r === 1 && c === 1) || (r === 3 && c === 0),
        )}

        {/* zonnepanelen op dak rechter blok */}
        <g>
          <polygon points="322,170 384,170 392,164 330,164" fill="#16313a" />
          <line x1="338" y1="164" x2="330" y2="170" stroke="#3a5560" strokeWidth="1.2" />
          <line x1="354" y1="164" x2="346" y2="170" stroke="#3a5560" strokeWidth="1.2" />
          <line x1="370" y1="164" x2="362" y2="170" stroke="#3a5560" strokeWidth="1.2" />
          <line x1="326" y1="167" x2="388" y2="167" stroke="#3a5560" strokeWidth="1.2" />
        </g>

        {/* ---- hoofdtoren ---- */}
        <polygon points="150,86 302,86 316,74 164,74" fill="url(#ps-tower-roof)" />
        <polygon points="302,86 316,74 316,404 302,416" fill="url(#ps-tower-side)" />
        <rect x="150" y="86" width="152" height="330" rx="4" fill="url(#ps-tower)" />
        <rect x="150" y="86" width="152" height="6" fill="#f2bb4a" opacity="0.85" />
        {windows(
          [170, 207, 244],
          [110, 152, 194, 236, 278, 320],
          24,
          26,
          (r, c) =>
            (r === 0 && c === 1) ||
            (r === 1 && c === 2) ||
            (r === 3 && c === 0) ||
            (r === 4 && c === 1) ||
            (r === 2 && c === 2),
        )}

        {/* ---- linker blok ---- */}
        <polygon points="88,256 150,256 164,246 102,246" fill="url(#ps-annexL-roof)" />
        <rect x="88" y="256" width="62" height="160" rx="4" fill="url(#ps-annexL)" />
        {windows([100, 126], [280, 316, 352], 18, 20, (r) => r === 0)}

        {/* entree met luifel en glasreflectie */}
        <rect x="204" y="360" width="44" height="56" rx="3" fill="url(#ps-glass)" />
        <polygon points="206,362 222,362 210,414 206,414" fill="#ffffff" opacity="0.35" />
        <line x1="226" y1="360" x2="226" y2="416" stroke="#0a4239" strokeWidth="1.4" opacity="0.35" />
        <rect x="196" y="352" width="60" height="7" rx="3" fill="#f2bb4a" />

        {/* groen bij de entree */}
        <circle cx="76" cy="404" r="15" fill="#18a978" />
        <circle cx="66" cy="410" r="10" fill="#18a978" opacity="0.8" />
      </svg>

      {/* ---- verbindingslijnen: gedeelde ruimte, komen precies uit bij de kaarten ---- */}
      <svg
        viewBox="0 0 480 470"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        {CARDS.map((card) => {
          const stroke = card.tone === "amber" ? "#e0a92f" : "#12907b";
          return (
            <g
              key={card.label}
              className="pandscan-connector"
              style={{ transitionDelay: `${card.order * 150 + 120}ms` }}
            >
              <path
                d={linkPath(card.link)}
                fill="none"
                stroke={stroke}
                strokeWidth={1.8}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={card.link.to[0]} cy={card.link.to[1]} r={3} fill={stroke} />
            </g>
          );
        })}
      </svg>

      {/* gouden scanlijn (alleen tijdens de scan; verborgen bij reduced motion) */}
      {phase === "scanning" && (
        <div key={scanId} aria-hidden="true" className="pandscan-scanline" />
      )}

      {/* zwevende analysekaarten, verankerd in dezelfde ruimte als de lijnen */}
      {CARDS.map(({ label, Icon, tone, order, at }) => (
        <div
          key={label}
          className="absolute"
          style={{ left: pct(at.x, VW), top: pct(at.y, VH), transform: at.translate }}
        >
          <div
            className="par-el"
            style={{ "--par-depth": String(3 + order * 1.4) } as CSSProperties}
          >
            <div className="pandscan-card" style={{ transitionDelay: `${order * 180}ms` }}>
              <div className="pandscan-float" style={{ animationDelay: `${order * 400}ms` }}>
                <div className="flex items-center gap-2 rounded-[0.875rem] border border-line bg-white px-3 py-2 shadow-lift">
                  <Icon className="h-4 w-4 text-pine" />
                  <span className="whitespace-nowrap text-[0.8rem] font-semibold text-ink">
                    {label}
                  </span>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      tone === "amber" ? "bg-amber" : "bg-action"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* statusbalk, met ruimte onder het pand */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
        <div className="par-el" style={{ "--par-depth": "2" } as CSSProperties}>
          <div className="pandscan-float" style={{ animationDelay: "200ms" }}>
            <StatusPill phase={phase} />
          </div>
        </div>
      </div>
    </div>
  );
}
