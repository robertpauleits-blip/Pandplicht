/**
 * Skeleton van de wizardkaart. Toont meteen de vorm van het formulier met een
 * subtiele pulse, zodat laden voelt als bewust opbouwen in plaats van wachten
 * op een component. Puur decoratief (aria-hidden); een tekstlabel geeft de
 * status door aan hulptechnologie.
 */
export function WizardSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="sr-only" role="status">
        De PandCheck wordt geladen.
      </p>
      <div
        aria-hidden="true"
        className="rounded-panel border border-line bg-surface p-6 shadow-soft sm:p-8"
      >
        {/* Voortgangsbalk */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i === 0 ? "bg-pine/40" : "bg-line"}`}
            />
          ))}
        </div>
        <div className="skeleton-pulse mt-6 space-y-5">
          <div className="h-7 w-2/3 rounded-lg bg-line" />
          <div className="h-4 w-11/12 rounded bg-line/70" />

          <div className="grid gap-3 sm:grid-cols-[1.1fr_0.8fr_0.9fr]">
            <div className="space-y-2">
              <div className="h-3.5 w-20 rounded bg-line/70" />
              <div className="h-11 rounded-xl bg-line" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-16 rounded bg-line/70" />
              <div className="h-11 rounded-xl bg-line" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-24 rounded bg-line/70" />
              <div className="h-11 rounded-xl bg-line" />
            </div>
          </div>

          <div className="h-24 rounded-card bg-line/60" />

          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-24 rounded bg-line/70" />
            <div className="h-12 w-40 rounded-full bg-pine/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
