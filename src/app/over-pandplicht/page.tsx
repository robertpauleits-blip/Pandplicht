import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd, organizationLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Over PandPlicht",
  description:
    "PandPlicht maakt de versnipperde regels voor bedrijfspanden begrijpelijk: één gratis indicatieve check met bronnen, prioriteiten en vervolgstappen.",
  alternates: { canonical: "/over-pandplicht" },
};

export default function OverPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={[
          organizationLd(),
          webPageLd({
            title: "Over PandPlicht",
            description: "Waarom PandPlicht bestaat en hoe wij werken.",
            path: "/over-pandplicht",
          }),
        ]}
      />
      <Breadcrumbs items={[{ name: "Over PandPlicht", path: "/over-pandplicht" }]} />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Over PandPlicht
        </h1>
        <div className="prose-pp mt-8 max-w-none">
          <p>
            De regels voor bedrijfspanden, energiebesparingsplicht,
            energielabels, netcongestie, batterijopslag, bestaan allemaal al.
            Ze staan alleen verspreid over RVO, Rijksoverheid, EP-Online,
            netbeheerders en gemeenten, in taal die niet voor ondernemers is
            geschreven. Daardoor weten veel mkb-ondernemers niet wélke regels
            voor hun locatie gelden, laat staan waar ze moeten beginnen.
          </p>
          <p>
            PandPlicht zet die versnipperde informatie op één plek en vertaalt
            haar naar uw situatie: een gratis, indicatieve check met per
            onderwerp een genuanceerde status, de gebruikte bron met
            controledatum, en concrete vervolgstappen.
          </p>
          <h2>Waar wij voor staan</h2>
          <ul>
            <li>
              <strong>Eerst waarde, dan pas gegevens.</strong> U ziet uw
              uitslag vóórdat wij om contactgegevens vragen, en die blijven
              altijd optioneel.
            </li>
            <li>
              <strong>Eerlijk over onzekerheid.</strong> Een online check weet
              niet alles. Wat wij niet weten, benoemen we expliciet.
            </li>
            <li>
              <strong>Bronnen zijn onderdeel van het product.</strong> Iedere
              regel verwijst naar een officiële bron met controledatum; zie{" "}
              <Link href="/bronnen-en-methodologie">onze methodologie</Link>.
            </li>
            <li>
              <strong>Geen juridisch advies.</strong> De check is een
              indicatief startpunt, geen beschikking of complianceverklaring.
            </li>
          </ul>
          <h2>Hoe verdient PandPlicht geld?</h2>
          <p>
            De check is en blijft gratis. Wie dat wil, kan na de uitslag
            vrijblijvend in contact komen met een passende specialist; daarvoor
            kunnen wij op termijn een vergoeding van die specialist ontvangen.
            Die keuze is altijd aan u, de uitslag is er nooit van afhankelijk,
            en commerciële vermeldingen worden altijd duidelijk gelabeld.
          </p>
        </div>

        <div className="mt-10 rounded-panel bg-mint-soft p-6 text-center sm:p-8">
          <p className="text-lg font-bold text-ink">
            Benieuwd wat er voor uw pand geldt?
          </p>
          <Link
            href="/pandcheck"
            className="mt-4 inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 font-bold text-white shadow-soft hover:bg-pine-dark"
          >
            Start gratis PandCheck
          </Link>
        </div>
      </div>
    </Container>
  );
}
