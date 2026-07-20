import { FLAGS } from "@/lib/site";

/**
 * Advertentiemodule — voorbereid maar uitgeschakeld (ADS_ENABLED=false).
 *
 * Eisen bij latere activering (zie specificatie):
 * - geen layout shift (vaste hoogte reserveren zodra actief);
 * - duidelijke labeling "Advertentie" of "Gesponsord";
 * - eigen click-event met campagne-ID, frequency caps;
 * - nooit in kritieke vragen of boven de kernuitslag;
 * - geen trackingpixels zonder passende toestemming.
 *
 * Zolang de flag uit staat rendert dit component niets — ook geen lege ruimte.
 */
export function SponsoredSlot({ slotId }: { slotId: string }) {
  if (!FLAGS.adsEnabled) return null;
  return (
    <aside
      aria-label="Advertentie"
      data-slot-id={slotId}
      className="rounded-card border border-line bg-surface p-4"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
        Advertentie
      </p>
      {/* Campagne-rendering volgt bij activering; zie features/ads. */}
    </aside>
  );
}
