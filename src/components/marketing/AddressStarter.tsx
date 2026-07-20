/**
 * Adresstarter — werkt zonder JavaScript (GET-formulier naar /pandcheck).
 * Validatiepatronen volgen de Nederlandse postcode- en huisnummerconventie.
 */
export function AddressStarter({ compact = false }: { compact?: boolean }) {
  return (
    <form
      action="/pandcheck"
      method="get"
      className={`rounded-card border border-line bg-surface p-4 shadow-soft sm:p-5 ${
        compact ? "" : "mt-8"
      }`}
    >
      <div className="grid items-end gap-3 sm:grid-cols-[1.1fr_0.8fr_0.9fr]">
        <div>
          <label
            htmlFor="hs-postcode"
            className="mb-1 block text-sm font-bold text-ink"
          >
            Postcode
          </label>
          <input
            id="hs-postcode"
            name="postcode"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            required
            pattern="[1-9][0-9]{3}\s?[A-Za-z]{2}"
            title="Nederlandse postcode, bijvoorbeeld 1234 AB"
            placeholder="1234 AB"
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:border-action focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="hs-huisnummer"
            className="mb-1 block text-sm font-bold text-ink"
          >
            Huisnummer
          </label>
          <input
            id="hs-huisnummer"
            name="huisnummer"
            type="text"
            inputMode="numeric"
            required
            pattern="[0-9]{1,5}"
            title="Alleen het nummer, bijvoorbeeld 12"
            placeholder="12"
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:border-action focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="hs-toevoeging"
            className="mb-1 block text-sm font-bold text-ink"
          >
            Toevoeging{" "}
            <span className="font-normal text-ink-soft">(optie.)</span>
          </label>
          <input
            id="hs-toevoeging"
            name="toevoeging"
            type="text"
            maxLength={6}
            placeholder="A"
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:border-action focus:outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-pine px-7 py-3.5 text-[1.05rem] font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-pine-dark sm:w-auto"
      >
        Start de gratis PandCheck
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 10h12m-5-5 5 5-5 5" />
        </svg>
      </button>
      <p className="mt-3 text-sm text-ink-soft">
        Geen account nodig • U krijgt eerst uw uitslag • Indicatief, niet
        juridisch bindend
      </p>
    </form>
  );
}
