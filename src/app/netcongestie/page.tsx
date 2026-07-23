import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileCta } from "@/components/layout/MobileCta";
import { getArticle } from "@/content/knowledge";
import { getSources } from "@/rules/sources";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Netcongestie voor ondernemers",
  description:
    "Wat betekent netcongestie voor uw bedrijf? Uitleg over afname- en invoedingscongestie, signalen, oplossingsrichtingen en de gratis netcongestiecheck.",
  alternates: { canonical: "/netcongestie" },
};

const ARTIKEL_SLUGS = [
  "wat-is-netcongestie-voor-ondernemers",
  "afnamecongestie-en-invoedingscongestie-verschil",
  "oplossingen-volle-aansluiting-ondernemer",
];

export default function NetcongestiePage() {
  const artikelen = ARTIKEL_SLUGS.map((s) => getArticle(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  );
  const sources = getSources(["rvo-grid-congestion", "rvo-grid-guide", "rvo-grid-loket"]);

  return (
    <Container className="py-10 pb-24 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Netcongestie voor ondernemers",
          description:
            "Uitleg over netcongestie voor bedrijven: afname- en invoedingscongestie, signalen en oplossingsrichtingen.",
          path: "/netcongestie",
        })}
      />
      <Breadcrumbs items={[{ name: "Netcongestie", path: "/netcongestie" }]} />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Netcongestie: wat betekent het voor uw bedrijf?
        </h1>

        <div className="mt-6 rounded-panel border-2 border-mint bg-mint-soft/60 p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-pine">
            Kort antwoord
          </h2>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-ink">
            Netcongestie is drukte op het elektriciteitsnet: op sommige plekken
            is de vraag naar transportcapaciteit groter dan het net aankan.
            Ondernemers merken dit via wachtlijsten voor (zwaardere)
            aansluitingen en beperkingen op afname of teruglevering. Een
            kaartkleur zegt niets definitiefs over uw specifieke aansluiting,
            uitsluitsel geeft alleen uw netbeheerder.
          </p>
        </div>

        <div className="prose-pp mt-8 max-w-none">
          <h2>Twee soorten congestie</h2>
          <p>
            <strong>Afnamecongestie</strong> is een tekort aan capaciteit om
            stroom aan bedrijven te leveren; dit raakt uitbreiding en
            elektrificatie. <strong>Invoedingscongestie</strong> is een tekort
            aan capaciteit om teruggeleverde stroom te ontvangen; dit raakt
            zonnedaken en teruglevering. Beide kunnen tegelijk spelen.
          </p>
          <h2>Wat kunt u doen?</h2>
          <ol>
            <li>Vraag uw netbeheerder schriftelijk naar de situatie op uw locatie.</li>
            <li>Breng uw werkelijke pieken in kaart met kwartierdata.</li>
            <li>Verken flexibiliteit: pieken spreiden, slim laden, processen verschuiven.</li>
            <li>Onderzoek samenwerking (energiehub) of opslag waar dat past.</li>
          </ol>
          <p>
            Onze netcongestiecheck gebruikt géén live netdata en doet geen
            capaciteitsbeloftes: het is een risico- en handelingsscan op basis
            van uw eigen situatie, met concrete vervolgstappen richting uw
            netbeheerder.
          </p>
        </div>

        <div className="no-print mt-8 rounded-panel bg-mint-soft p-6 text-center">
          <p className="font-bold text-ink">
            Breng uw aansluiting, plannen en knelpunten in beeld.
          </p>
          <Link
            href="/tools/netcongestiecheck"
            className="mt-3 inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
          >
            Doe de netcongestiecheck
          </Link>
        </div>

        <section className="mt-10 rounded-panel border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-xl font-bold text-ink">Bronnen en laatste controle</h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {sources.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-pine underline decoration-mint decoration-2 underline-offset-2 hover:decoration-action"
                >
                  {s.title}
                </a>{" "}
                <span className="text-ink-soft">
                 , {s.publisher}, gecontroleerd op{" "}
                  {new Date(s.checkedAt).toLocaleDateString("nl-NL")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-labelledby="nc-artikelen" className="mt-10">
          <h2 id="nc-artikelen" className="text-xl font-bold text-ink">
            Verdieping in de kennisbank
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {artikelen.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/kennisbank/${a.slug}`}
                  className="block rounded-card border border-line bg-surface p-4 font-semibold text-ink transition-colors hover:border-action"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <MobileCta />
    </Container>
  );
}
