import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileCta } from "@/components/layout/MobileCta";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";
import type { ToolPageData } from "./tools-data";

export function ToolPageView({ data }: { data: ToolPageData }) {
  const { Icon } = data;
  return (
    <Container className="py-10 pb-24 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: data.metaTitle,
          description: data.description,
          path: data.path,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Checks", path: "/tools" },
          { name: data.title, path: data.path },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-soft text-pine">
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {data.title}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{data.intro}</p>

        <div className="no-print mt-6">
          <Link
            href={`/pandcheck?focus=${data.focus}`}
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-pine px-7 py-3.5 text-[1.05rem] font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-pine-dark"
          >
            Start deze gratis check
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12m-5-5 5 5-5 5" />
            </svg>
          </Link>
          <p className="mt-2 text-sm text-ink-soft">
            Geen account nodig • Uitslag eerst • Indicatief, niet juridisch bindend
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(
            [
              ["Wat checkt deze tool?", data.watChecktDeTool],
              ["Wat heeft u nodig?", data.watHeeftUNodig],
              ["Wat krijgt u?", data.watKrijgtU],
            ] as const
          ).map(([titel, items]) => (
            <section
              key={titel}
              className="rounded-panel border border-line bg-surface p-5"
              aria-label={titel}
            >
              <h2 className="font-bold text-ink">{titel}</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
                {items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section
          aria-labelledby="beperkingen-h"
          className="mt-8 rounded-panel border border-status-maybe-border bg-status-maybe-bg p-5"
        >
          <h2 id="beperkingen-h" className="font-bold text-status-maybe-ink">
            Eerlijk over de beperkingen
          </h2>
          <p className="mt-2 text-[0.95rem] text-status-maybe-ink">
            {data.beperkingen}
          </p>
        </section>
      </div>
      <MobileCta />
    </Container>
  );
}
