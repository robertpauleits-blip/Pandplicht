import type { ReactNode } from "react";

export type FaqEntry = { question: string; answer: string };

/**
 * FAQ met zichtbare, server-rendered antwoorden (details/summary,
 * volledige inhoud staat in de HTML).
 */
export function Faq({
  items,
  heading = "Veelgestelde vragen",
  intro,
}: {
  items: FaqEntry[];
  heading?: string;
  intro?: ReactNode;
}) {
  return (
    <section aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      >
        {heading}
      </h2>
      {intro ? <div className="mt-2 text-ink-soft">{intro}</div> : null}
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-card border border-line bg-surface px-5 py-1 open:pb-4"
          >
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 py-3 text-left font-bold text-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5 shrink-0 text-pine transition-transform group-open:rotate-45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M10 4v12M4 10h12" />
              </svg>
            </summary>
            <p className="pb-2 text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
