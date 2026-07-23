import Link from "next/link";

const TEASER_ROWS = [
  ["Energielabel C kantoren", "Waarschijnlijk van toepassing", "bg-amber"],
  ["Energiebesparingsplicht", "Mogelijk van toepassing", "bg-amber"],
  ["Batterijkans", "Nader onderzoek kansrijk", "bg-action"],
] as const;

/**
 * Gedeeltelijk zichtbare voorbeeld-resultatenkaart onder het adresformulier.
 * Slechts de kop en tellers zijn zichtbaar; bij hover of toetsenbordfocus
 * schuift de kaart omhoog en worden de eerste onderwerpen zichtbaar. Wekt
 * nieuwsgierigheid naar de echte uitslag. Nadrukkelijk gelabeld als
 * voorbeeld met fictief adres (harde regel: geen nepdata die echt lijkt).
 */
export function PeekResultCard() {
  return (
    <Link
      href="/pandcheck"
      aria-label="Voorbeeld van een PandCheck-resultaat voor een fictief adres. Start de gratis PandCheck voor uw eigen uitslag."
      className="group relative z-0 -mt-2 block px-3 focus-visible:outline-none sm:px-6"
    >
      {/* Venster dat de kaart aan de onderkant afsnijdt */}
      <div className="peek-window h-[7.6rem] overflow-hidden">
        <div className="rounded-t-card border border-b-0 border-line bg-white/95 px-5 pt-4 shadow-soft backdrop-blur transition-transform duration-500 ease-out group-hover:-translate-y-7 group-focus-visible:-translate-y-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-ink">
              PandCheck-resultaat
              <span className="ml-2 rounded-full bg-amber-soft px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-amber-ink">
                Voorbeeld
              </span>
            </p>
            <p className="text-sm text-ink-soft">Industrieweg 12, Utrecht (fictief)</p>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />
              3 verplichtingen
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-action" aria-hidden="true" />
              2 kansen
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-coral" aria-hidden="true" />
              1 aandachtspunt
            </span>
          </div>
          <div className="mt-3 space-y-2 border-t border-line pt-3">
            {TEASER_ROWS.map(([title, status, dot]) => (
              <div
                key={title}
                className="flex items-center justify-between gap-3 text-[0.85rem]"
              >
                <span className="font-semibold text-ink">{title}</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-ink-soft">
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Zachte fade zodat de kaart in de pagina 'verzinkt' */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-0 h-12 bg-gradient-to-t from-[#eef4f3] to-transparent sm:inset-x-6"
      />
    </Link>
  );
}
