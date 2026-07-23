import type { ReactNode } from "react";
import {
  IconBattery,
  IconGrid,
  IconMeter,
  IconPand,
} from "@/components/marketing/ToolIcons";

export type ScanPhase = "idle" | "armed" | "revealing";

type Card = {
  label: string;
  Icon: (p: { className?: string }) => ReactNode;
  tone: "amber" | "green";
  /** Positionering rond het pand (responsief, blijft binnen de sectie). */
  pos: string;
  /** Volgorde waarin de kaart verschijnt tijdens de scan. */
  order: number;
};

const CARDS: Card[] = [
  {
    label: "Energiebesparingsplicht",
    Icon: IconMeter,
    tone: "amber",
    pos: "left-0 top-[10%] sm:-left-4",
    order: 0,
  },
  {
    label: "Labelplicht",
    Icon: IconPand,
    tone: "amber",
    pos: "right-0 top-[3%] sm:-right-3",
    order: 1,
  },
  {
    label: "Netcongestie",
    Icon: IconGrid,
    tone: "green",
    pos: "right-0 top-[45%] sm:-right-6",
    order: 2,
  },
  {
    label: "Batterijkans",
    Icon: IconBattery,
    tone: "green",
    pos: "left-0 bottom-[24%] sm:-left-4",
    order: 3,
  },
];

/** Vensters als eenvoudige rasters, met een enkel 'brandend' venster. */
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
          fill={lit(r, c) ? "#f2bb4a" : "#bceedc"}
          opacity={lit(r, c) ? 0.95 : 0.85}
        />,
      );
    }),
  );
  return out;
}

/**
 * Interactieve pandscan-illustratie. Puur presentatie: de statusfase komt van
 * de ouder. Zonder JS/animatie is dit een nette, volledig zichtbare compositie.
 */
export function PandScan({
  phase,
  scanId,
}: {
  phase: ScanPhase;
  scanId: number;
}) {
  return (
    <div
      role="img"
      aria-label="Illustratie: een bedrijfspand wordt gescand op energiebesparingsplicht, labelplicht, netcongestie en batterijkans. Voorbeeld: 4 relevante verplichtingen gevonden."
      data-revealed={phase === "revealing" ? "true" : undefined}
      className={`relative mx-auto w-full max-w-[30rem] ${
        phase !== "idle" ? "pandscan-enh" : ""
      } ${phase === "armed" ? "pandscan-noanim" : ""}`}
    >
      {/* Zachte vloer/gloed onder het pand */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] bottom-[14%] h-24 rounded-[50%] bg-pine/15 blur-2xl"
      />

      <svg
        viewBox="0 0 480 470"
        className="relative w-full drop-shadow-[0_20px_40px_rgba(22,49,58,0.14)]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ps-tower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14675a" />
            <stop offset="1" stopColor="#0a4239" />
          </linearGradient>
          <linearGradient id="ps-annexR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e5a4f" />
            <stop offset="1" stopColor="#083c34" />
          </linearGradient>
          <linearGradient id="ps-annexL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#18836f" />
            <stop offset="1" stopColor="#0e5a4f" />
          </linearGradient>
          <linearGradient id="ps-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dff6ec" />
            <stop offset="1" stopColor="#bceedc" />
          </linearGradient>
        </defs>

        {/* grondlijn */}
        <ellipse cx="240" cy="432" rx="196" ry="20" fill="#16313a" opacity="0.08" />

        {/* rechter blok (achter) */}
        <rect x="300" y="176" width="96" height="240" rx="12" fill="url(#ps-annexR)" />
        {windows(
          [316, 352],
          [204, 244, 284, 324, 364],
          22,
          24,
          (r, c) => r === 1 && c === 1,
        )}

        {/* hoofdtoren (midden) */}
        <rect x="150" y="78" width="152" height="338" rx="16" fill="url(#ps-tower)" />
        {/* dakrand accent */}
        <rect x="150" y="78" width="152" height="12" rx="6" fill="#f2bb4a" opacity="0.9" />
        {windows(
          [170, 207, 244],
          [112, 154, 196, 238, 280, 322],
          24,
          26,
          (r, c) => (r === 1 && c === 2) || (r === 3 && c === 0) || (r === 4 && c === 1),
        )}

        {/* zonnepanelen op het dak van het rechterblok */}
        <g transform="translate(312 150)">
          <rect x="0" y="0" width="72" height="22" rx="3" fill="#16313a" />
          <line x1="18" y1="0" x2="18" y2="22" stroke="#3a5560" strokeWidth="1.5" />
          <line x1="36" y1="0" x2="36" y2="22" stroke="#3a5560" strokeWidth="1.5" />
          <line x1="54" y1="0" x2="54" y2="22" stroke="#3a5560" strokeWidth="1.5" />
          <line x1="0" y1="11" x2="72" y2="11" stroke="#3a5560" strokeWidth="1.5" />
        </g>

        {/* linker blok (voor) */}
        <rect x="96" y="250" width="82" height="166" rx="12" fill="url(#ps-annexL)" />
        {windows([110, 142], [278, 316, 354], 20, 22, () => false)}

        {/* entree met luifel */}
        <rect x="204" y="360" width="44" height="56" rx="4" fill="url(#ps-glass)" />
        <line x1="226" y1="360" x2="226" y2="416" stroke="#0a4239" strokeWidth="1.5" opacity="0.4" />
        <rect x="196" y="352" width="60" height="8" rx="4" fill="#f2bb4a" />

        {/* subtiel groen bij de entree */}
        <circle cx="82" cy="404" r="16" fill="#18a978" opacity="0.9" />
        <circle cx="70" cy="410" r="11" fill="#18a978" opacity="0.75" />
      </svg>

      {/* scanlijn (alleen tijdens/na trigger; verborgen bij reduced motion) */}
      {phase !== "idle" && (
        <div key={scanId} aria-hidden="true" className="pandscan-scanline" />
      )}

      {/* zwevende analysekaarten */}
      {CARDS.map(({ label, Icon, tone, pos, order }) => (
        <div key={label} className={`absolute ${pos}`}>
          <div
            className="pandscan-card"
            style={{ transitionDelay: `${order * 130}ms` }}
          >
            <div
              className="pandscan-float"
              style={{ animationDelay: `${order * 400}ms` }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-lift">
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
      ))}

      {/* samenvattingschip */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
        <div
          className="pandscan-card"
          style={{ transitionDelay: `${CARDS.length * 130}ms` }}
        >
          <div className="pandscan-float" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 rounded-full bg-pine px-4 py-2 shadow-lift">
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
              <span className="whitespace-nowrap text-sm font-bold text-white">
                4 relevante verplichtingen gevonden
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
