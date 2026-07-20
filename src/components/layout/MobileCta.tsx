"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Compacte vaste CTA onderin op informatieve mobiele pagina's.
 * Sluitbaar, houdt rekening met safe areas en bedekt geen content
 * (de pagina krijgt onderaan extra ruimte via padding).
 */
export function MobileCta() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:hidden"
      role="complementary"
      aria-label="Snelle actie"
    >
      <div className="flex items-center gap-2">
        <Link
          href="/pandcheck"
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-pine px-5 font-bold text-white shadow-soft"
        >
          Controleer uw pand
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-line text-ink-soft"
        >
          <span className="sr-only">Sluit deze balk</span>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
