"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-coral-ink">
        Er ging iets mis
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
        Deze pagina kan nu niet worden geladen
      </h1>
      <p className="mt-4 text-ink-soft">
        Dit ligt aan ons, niet aan u. Probeer het opnieuw; blijft het misgaan,
        kom dan later terug.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
        >
          Probeer opnieuw
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-full border-2 border-line bg-surface px-6 py-3 font-bold text-pine hover:border-pine"
        >
          Naar de homepage
        </Link>
      </div>
    </div>
  );
}
