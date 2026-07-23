import { ParcelLines } from "@/components/marketing/ParcelLines";

const ITEMS: { label: string; tone: "green" | "amber" }[] = [
  { label: "Overheidsbronnen gecontroleerd", tone: "green" },
  { label: "EP-Online als officiële labelbron", tone: "green" },
  { label: "Bron en peildatum bij elke uitslag", tone: "green" },
  { label: "Geen account nodig", tone: "green" },
  { label: "Direct indicatief resultaat", tone: "amber" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center gap-10 pr-10 ${hidden ? "proof-dup" : ""}`}
    >
      {ITEMS.map(({ label, tone }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2.5 whitespace-nowrap text-sm font-semibold text-ink-soft"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              tone === "green" ? "bg-action" : "bg-amber"
            }`}
            aria-hidden="true"
          />
          {label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Rustige, doorlopende "systeemstatus"-strook onder de hero. Eerlijke,
 * feitelijke punten, geen logocarrousel en geen verzonnen aantallen.
 * Bij reduced motion staat de rij stil en mag hij wrappen.
 */
export function ProofStrip() {
  return (
    <aside
      aria-label="Betrouwbaarheidskenmerken van PandPlicht"
      className="relative overflow-hidden border-y border-line bg-surface py-4"
    >
      <ParcelLines className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="proof-viewport relative overflow-hidden">
        <div className="proof-track flex w-max items-center">
          <Row />
          <Row hidden />
          <Row hidden />
        </div>
      </div>
    </aside>
  );
}
