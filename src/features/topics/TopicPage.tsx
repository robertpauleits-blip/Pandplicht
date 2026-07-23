import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileCta } from "@/components/layout/MobileCta";
import { getSources } from "@/rules/sources";
import { getArticle } from "@/content/knowledge";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";
import { FEITEN_CHECKED_LABEL, type TopicPageData } from "./topics-data";

/**
 * Vaste opbouw van een onderwerp-pagina volgens het antwoord-voorop-patroon:
 * kort antwoord → wanneer geldt dit (niet) → gegevens → verantwoordelijkheid →
 * wat nu doen → bronnen. Feitenblok komt uit dezelfde data als de rule engine.
 */
export function TopicPage({ data }: { data: TopicPageData }) {
  const sources = getSources(data.sourceIds);
  const artikelen = data.artikelSlugs
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <Container className="py-10 pb-24 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: data.metaTitle,
          description: data.description,
          path: data.path,
        })}
      />
      <Breadcrumbs items={data.breadcrumb} />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {data.title}
        </h1>

        <div className="mt-6 rounded-panel border-2 border-mint bg-mint-soft/60 p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-pine">
            Kort antwoord
          </h2>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-ink">
            {data.kortAntwoord}
          </p>
        </div>

        {/* Feiten op een rij, uit dezelfde brondata als de rule engine */}
        <section aria-labelledby="feiten-h" className="prose-pp mt-8 max-w-none">
          <h2 id="feiten-h">Feiten op een rij</h2>
          <div className="overflow-x-auto">
            <table>
              <caption>{FEITEN_CHECKED_LABEL}</caption>
              <thead>
                <tr>
                  <th scope="col">Onderdeel</th>
                  <th scope="col">Actuele uitleg</th>
                </tr>
              </thead>
              <tbody>
                {data.feiten.map((f) => (
                  <tr key={f.onderdeel}>
                    <td className="font-semibold">{f.onderdeel}</td>
                    <td>{f.uitleg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Wanneer geldt dit?</h2>
          <ul>
            {data.wanneerGeldt.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>Wanneer geldt dit mogelijk niet?</h2>
          <ul>
            {data.wanneerNiet.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>Welke gegevens heeft u nodig?</h2>
          <ul>
            {data.gegevensNodig.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h2>Wie is meestal verantwoordelijk?</h2>
          <p>{data.verantwoordelijk}</p>

          <h2>Wat moet u nu doen?</h2>
          <ol>
            {data.watNuDoen.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="topic-bronnen-h"
          className="mt-8 rounded-panel border border-line bg-surface p-5 sm:p-6"
        >
          <h2 id="topic-bronnen-h" className="text-xl font-bold text-ink">
            Bronnen en laatste controle
          </h2>
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
                 , {s.publisher}, door PandPlicht gecontroleerd op{" "}
                  {new Date(s.checkedAt).toLocaleDateString("nl-NL")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="no-print mt-8 rounded-panel bg-mint-soft p-6 text-center">
          <p className="font-bold text-ink">
            Benieuwd of dit voor uw pand speelt?
          </p>
          <Link
            href={data.toolHref}
            className="mt-3 inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
          >
            {data.toolLabel}
          </Link>
        </div>

        {artikelen.length > 0 ? (
          <nav aria-labelledby="verdieping-h" className="mt-10">
            <h2 id="verdieping-h" className="text-xl font-bold text-ink">
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
        ) : null}
      </div>
      <MobileCta />
    </Container>
  );
}
