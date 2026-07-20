import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileCta } from "@/components/layout/MobileCta";
import { TOPIC_PAGES } from "@/features/topics/topics-data";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Verplichtingen voor bedrijfspanden",
  description:
    "Overzicht van energie- en verduurzamingsverplichtingen voor Nederlandse bedrijfspanden: energiebesparingsplicht, informatieplicht, onderzoeksplicht, energielabels en batterijregistratie.",
  alternates: { canonical: "/verplichtingen" },
};

export default function VerplichtingenPage() {
  return (
    <Container className="py-10 pb-24 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Verplichtingen voor bedrijfspanden",
          description:
            "Overzicht van energie- en verduurzamingsverplichtingen voor bedrijfspanden.",
          path: "/verplichtingen",
        })}
      />
      <Breadcrumbs items={[{ name: "Verplichtingen", path: "/verplichtingen" }]} />
      <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Verplichtingen voor bedrijfspanden
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Welke regels gelden, hangt af van gebruik, oppervlakte en
        energiegebruik van uw locatie. Per onderwerp vindt u de hoofdregel,
        de uitzonderingen en de bron.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {TOPIC_PAGES.map((t) => (
          <article
            key={t.path}
            className="flex flex-col rounded-panel border border-line bg-surface p-6 shadow-soft"
          >
            <h2 className="text-xl font-bold text-ink">
              <Link href={t.path} className="hover:underline">
                {t.title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-[0.95rem] text-ink-soft">
              {t.description}
            </p>
            <Link href={t.path} className="mt-3 font-bold text-pine hover:underline">
              Lees de uitleg →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-panel bg-mint-soft p-6 text-center sm:p-8">
        <p className="text-lg font-bold text-ink">
          Niet zeker welke verplichtingen voor uw pand gelden?
        </p>
        <Link
          href="/pandcheck"
          className="mt-4 inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 font-bold text-white shadow-soft hover:bg-pine-dark"
        >
          Start gratis PandCheck
        </Link>
      </div>
      <MobileCta />
    </Container>
  );
}
