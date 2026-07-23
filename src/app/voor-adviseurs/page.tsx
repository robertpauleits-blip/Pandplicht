import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Voor adviseurs en specialisten",
  description:
    "Bent u energieadviseur, installateur of vastgoedspecialist? Lees hoe PandPlicht werkt en meld uw interesse voor het toekomstige partnernetwerk.",
  alternates: { canonical: "/voor-adviseurs" },
};

export default function VoorAdviseursPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Voor adviseurs",
          description:
            "Informatie voor energieadviseurs, installateurs en vastgoedspecialisten over samenwerken met PandPlicht.",
          path: "/voor-adviseurs",
        })}
      />
      <Breadcrumbs items={[{ name: "Voor adviseurs", path: "/voor-adviseurs" }]} />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Voor adviseurs en specialisten
        </h1>
        <div className="prose-pp mt-8 max-w-none">
          <p>
            PandPlicht helpt mkb-ondernemers ontdekken welke energie- en
            verduurzamingsverplichtingen mogelijk voor hun bedrijfspand gelden.
            Bezoekers die na hun indicatieve uitslag hulp willen, kunnen
            vrijwillig een aanvraag doen voor contact met een passende
            specialist, bijvoorbeeld een energieadviseur, labeladviseur of
            installatiebedrijf.
          </p>
          <h2>Hoe gaat samenwerking eruitzien?</h2>
          <ul>
            <li>
              Aanvragen worden gekoppeld op <strong>specialisme en regio</strong>,
              nooit op advertentiebudget.
            </li>
            <li>
              De bezoeker bepaalt zelf welke gegevens worden gedeeld en geeft
              daar expliciet toestemming voor.
            </li>
            <li>
              Vergoeding per geldige aanvraag, met transparante voorwaarden en
              zonder langdurige exclusiviteitsverplichtingen.
            </li>
            <li>
              De inhoudelijke uitslag van de check blijft altijd onafhankelijk
              van commerciële afspraken.
            </li>
          </ul>
          <h2>Status: netwerk in opbouw</h2>
          <p>
            PandPlicht is recent gelanceerd en bouwt het partnernetwerk
            zorgvuldig op. Automatische doorsturing van aanvragen staat nog
            niet aan; wij starten pas wanneer processen, overeenkomsten en
            privacyafspraken volledig staan. Interesse? Laat uw gegevens achter
            via het contactformulier met vermelding van uw specialisme en
            werkgebied, wij nemen contact op zodra onboarding start.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 font-bold text-white shadow-soft hover:bg-pine-dark"
          >
            Meld uw interesse via het contactformulier
          </Link>
        </div>
      </div>
    </Container>
  );
}
