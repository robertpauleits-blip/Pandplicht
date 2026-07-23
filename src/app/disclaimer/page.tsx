import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "De uitslagen van PandPlicht zijn indicatief en geen juridisch of technisch advies. Lees wat dat betekent en waar u definitieve antwoorden vindt.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Disclaimer", path: "/disclaimer" }]} />
      <div className="prose-pp mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Disclaimer</h1>
        <p className="mt-3 text-sm text-ink-soft">Laatst bijgewerkt op 20 juli 2026</p>

        <h2>Indicatief, geen advies</h2>
        <p>
          PandPlicht biedt een indicatieve eerste check en redactionele uitleg
          op basis van openbare overheidsbronnen. De uitslagen zijn{" "}
          <strong>geen</strong> juridisch advies, geen technisch advies, geen
          beschikking van een overheidsinstantie en geen garantie van een
          netbeheerder. Aan de uitslagen kunnen geen rechten worden ontleend.
        </p>

        <h2>Wetgeving verandert</h2>
        <p>
          Drempelwaarden, uitzonderingen en procedures kunnen wijzigen. Wij
          vermelden bij iedere regel en ieder artikel wanneer de onderliggende
          bron voor het laatst door onze redactie is gecontroleerd, maar de
          officiële bron (zoals RVO of Rijksoverheid) is altijd leidend.
          Raadpleeg die bron of een gekwalificeerd adviseur voordat u
          beslissingen neemt met juridische of financiële gevolgen.
        </p>

        <h2>Uw invoer bepaalt de uitkomst</h2>
        <p>
          De indicatie is gebaseerd op de gegevens die u zelf invult. Onjuiste
          of onvolledige invoer leidt tot een minder passende uitkomst. Waar
          gegevens ontbreken, geeft de check bewust een lagere zekerheid aan.
        </p>

        <h2>Externe links</h2>
        <p>
          Wij linken naar officiële bronnen en hulpmiddelen van derden. Voor de
          inhoud en beschikbaarheid daarvan zijn wij niet verantwoordelijk.
        </p>

        <h2>Fouten melden</h2>
        <p>
          Ziet u een inhoudelijke fout of een verouderde drempelwaarde? Meld
          het via het <a href="/contact">contactformulier</a>, wij controleren
          en corrigeren aantoonbare fouten zo snel mogelijk en houden een
          changelog bij op de{" "}
          <a href="/bronnen-en-methodologie">methodologiepagina</a>.
        </p>
      </div>
    </Container>
  );
}
