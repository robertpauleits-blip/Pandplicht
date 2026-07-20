import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SOURCES } from "@/rules/sources";
import { RULESET_CHANGELOG, RULESET_VERSION } from "@/rules/version";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Bronnen en methodologie",
  description:
    "Hoe PandPlicht werkt: welke officiële bronnen wij gebruiken, hoe wij regels vertalen naar indicaties, en het changelog van onze regelset.",
  alternates: { canonical: "/bronnen-en-methodologie" },
};

export default function BronnenPage() {
  const sources = Object.values(SOURCES);
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Bronnen en methodologie",
          description:
            "De bronnen en werkwijze achter de indicatieve checks van PandPlicht.",
          path: "/bronnen-en-methodologie",
        })}
      />
      <Breadcrumbs
        items={[{ name: "Bronnen en methodologie", path: "/bronnen-en-methodologie" }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Bronnen en methodologie
        </h1>

        <div className="prose-pp mt-8 max-w-none">
          <h2>Hoe komt een PandPlicht-indicatie tot stand?</h2>
          <p>
            PandPlicht vertaalt openbare overheidsinformatie naar een
            regelgebaseerde, deterministische check: dezelfde antwoorden geven
            altijd dezelfde uitkomst. Iedere regel verwijst naar minimaal één
            primaire bron met de datum waarop onze redactie die bron voor het
            laatst controleerde. De actuele regelsetversie is{" "}
            <strong>v{RULESET_VERSION}</strong> en staat bij iedere uitslag
            vermeld.
          </p>
          <h2>Wat een indicatie wél en niet is</h2>
          <ul>
            <li>
              Wél: een gestructureerde eerste toets van uw situatie aan
              drempels en voorwaarden uit officiële bronnen, met uitleg en
              vervolgstappen.
            </li>
            <li>
              Niet: een juridisch oordeel, een beschikking, een garantie van
              een netbeheerder of een technisch (batterij)ontwerp.
            </li>
            <li>
              Bij twijfel of ontbrekende gegevens kiest ons systeem bewust voor
              &lsquo;Mogelijk van toepassing&rsquo; of &lsquo;Meer informatie
              nodig&rsquo; in plaats van schijnzekerheid.
            </li>
          </ul>
          <h2>Hoe houden wij bronnen actueel?</h2>
          <ul>
            <li>Iedere bron heeft een controledatum die u overal terugziet.</li>
            <li>
              Drempelwaarden staan centraal in de regelset en worden vóór
              livegang en daarna periodiek opnieuw geverifieerd.
            </li>
            <li>
              Materiële wijzigingen in regels worden vastgelegd in het
              changelog hieronder, met een nieuwe versienummer.
            </li>
            <li>
              Primaire bronnen (RVO, Rijksoverheid) gaan altijd vóór
              commerciële bronnen.
            </li>
          </ul>
          <h2>Redactionele verantwoordelijkheid</h2>
          <p>
            De inhoud wordt gepubliceerd door de redactie van PandPlicht. Wij
            claimen geen juridische of technische beoordeling door externe
            deskundigen zolang die niet daadwerkelijk heeft plaatsgevonden;
            zodra echte reviewers betrokken zijn, vermelden wij die met naam en
            expertise.
          </p>
        </div>

        <section aria-labelledby="register-h" className="mt-10">
          <h2 id="register-h" className="text-2xl font-extrabold tracking-tight text-ink">
            Bronregister
          </h2>
          <div className="prose-pp mt-4 max-w-none overflow-x-auto">
            <table>
              <caption>
                Alle bronnen die de regelset en content onderbouwen
              </caption>
              <thead>
                <tr>
                  <th scope="col">Bron</th>
                  <th scope="col">Uitgever</th>
                  <th scope="col">Door PandPlicht gecontroleerd op</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    </td>
                    <td>{s.publisher}</td>
                    <td>{new Date(s.checkedAt).toLocaleDateString("nl-NL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="changelog-h" className="mt-10">
          <h2 id="changelog-h" className="text-2xl font-extrabold tracking-tight text-ink">
            Changelog regelset
          </h2>
          <ul className="mt-4 space-y-4">
            {RULESET_CHANGELOG.map((entry) => (
              <li key={entry.version} className="rounded-card border border-line bg-surface p-4">
                <p className="font-bold text-ink">
                  v{entry.version}{" "}
                  <span className="font-normal text-ink-soft">
                    — {new Date(entry.date).toLocaleDateString("nl-NL")}
                  </span>
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {entry.changes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
