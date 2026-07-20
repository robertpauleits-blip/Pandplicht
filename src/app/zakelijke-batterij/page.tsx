import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileCta } from "@/components/layout/MobileCta";
import { getArticle } from "@/content/knowledge";
import { getSources } from "@/rules/sources";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Zakelijke batterij: wanneer is onderzoek zinvol?",
  description:
    "Wanneer is een zakelijke batterij interessant? Uitleg over peak shaving, eigen opwek, kwartierdata en registratie — zonder loze ROI-beloftes.",
  alternates: { canonical: "/zakelijke-batterij" },
};

const ARTIKEL_SLUGS = [
  "zakelijke-batterij-onderzoeken-waard",
  "peak-shaving-met-zakelijke-batterij",
  "kwartierdata-batterijberekening",
  "zakelijke-batterij-registreren",
];

export default function ZakelijkeBatterijPage() {
  const artikelen = ARTIKEL_SLUGS.map((s) => getArticle(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  );
  const sources = getSources(["rvo-battery-investment", "rvo-battery-register"]);

  return (
    <Container className="py-10 pb-24 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Zakelijke batterij",
          description:
            "Wanneer is een zakelijke batterij interessant? Peak shaving, eigen opwek, kwartierdata en registratie uitgelegd.",
          path: "/zakelijke-batterij",
        })}
      />
      <Breadcrumbs
        items={[{ name: "Zakelijke batterij", path: "/zakelijke-batterij" }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          De zakelijke batterij, zonder mooie praatjes
        </h1>

        <div className="mt-6 rounded-panel border-2 border-mint bg-mint-soft/60 p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-pine">
            Kort antwoord
          </h2>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-ink">
            Een zakelijke batterij kan waardevol zijn bij netknelpunten, hoge
            kwartierpieken of structureel zonne-overschot — maar niet voor
            iedere locatie. Een serieuze afweging vraagt kwartierdata en een
            specialist; een rendement berekend op alleen jaarverbruik is
            schijnzekerheid. Onze batterijscan zegt eerlijk of nader onderzoek
            zinvol lijkt, of juist niet.
          </p>
        </div>

        <div className="prose-pp mt-8 max-w-none">
          <h2>Waarvoor wordt een batterij ingezet?</h2>
          <ul>
            <li>
              <strong>Peak shaving:</strong> pieken afvlakken zodat u binnen uw
              aansluiting en gecontracteerd vermogen blijft.
            </li>
            <li>
              <strong>Eigen gebruik van zon:</strong> middagoverschot opslaan
              voor gebruik in de avond, zeker bij terugleverbeperkingen.
            </li>
            <li>
              <strong>Uitbreiden bij beperkt vermogen:</strong> groei mogelijk
              maken zonder (directe) netverzwaring.
            </li>
            <li>
              <strong>Energiehandel en noodstroom:</strong> aanvullende
              toepassingen met eigen afwegingen en risico&rsquo;s.
            </li>
          </ul>
          <h2>Waarom wij geen terugverdientijd noemen</h2>
          <p>
            Het rendement hangt af van uw werkelijke kwartierprofiel, uw
            contract, energieprijzen en de inzetstrategie. Daarom geeft
            PandPlicht een transparante <em>onderzoeksscore</em> (0–100) met
            alle deelscores zichtbaar — geen ROI-belofte. Scoort uw situatie
            hoog, dan is de logische volgende stap: kwartierdata verzamelen en
            een specialist laten dimensioneren.
          </p>
        </div>

        <div className="no-print mt-8 rounded-panel bg-mint-soft p-6 text-center">
          <p className="font-bold text-ink">
            Ontdek in een paar minuten of batterijonderzoek logisch is.
          </p>
          <Link
            href="/tools/zakelijke-batterijscan"
            className="mt-3 inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
          >
            Doe de zakelijke batterijscan
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
                  — {s.publisher}, gecontroleerd op{" "}
                  {new Date(s.checkedAt).toLocaleDateString("nl-NL")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-labelledby="bat-artikelen" className="mt-10">
          <h2 id="bat-artikelen" className="text-xl font-bold text-ink">
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
