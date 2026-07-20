import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Hoe PandPlicht met uw gegevens omgaat: welke gegevens wij verwerken, waarom, hoe lang wij ze bewaren en welke rechten u heeft.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Privacyverklaring", path: "/privacy" }]} />
      <div className="prose-pp mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          Privacyverklaring
        </h1>
        <p className="mt-3 text-sm text-ink-soft">Versie 2026-07 • Laatst bijgewerkt op 20 juli 2026</p>

        <h2>Uitgangspunt: zo min mogelijk gegevens</h2>
        <p>
          PandPlicht is ontworpen volgens het principe &lsquo;privacy als
          standaard&rsquo;: u kunt de volledige check doen zonder account en
          zonder contactgegevens. Wij verzamelen niet meer gegevens dan nodig
          en plaatsen geen volledige adressen of antwoorden in
          analysesystemen.
        </p>

        <h2>Welke gegevens verwerken wij, en waarom?</h2>
        <div className="overflow-x-auto">
          <table>
            <caption>Overzicht van verwerkingen</caption>
            <thead>
              <tr>
                <th scope="col">Gegevens</th>
                <th scope="col">Doel</th>
                <th scope="col">Grondslag</th>
                <th scope="col">Bewaartermijn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Uw checkantwoorden (adres, gebruik, energie)</td>
                <td>Berekenen van uw indicatieve uitslag</td>
                <td>Uitvoering van uw verzoek</td>
                <td>Tijdelijk in uw browser; server-side kopie maximaal 30 dagen, daarna automatisch verwijderd</td>
              </tr>
              <tr>
                <td>Contactgegevens bij een leadaanvraag (naam, bedrijf, e-mail, evt. telefoon)</td>
                <td>U in contact brengen met een passende specialist</td>
                <td>Uw expliciete toestemming</td>
                <td>Zolang nodig voor de aanvraag; daarna verwijderd of geanonimiseerd</td>
              </tr>
              <tr>
                <td>Contactformulier (naam, e-mail, bericht)</td>
                <td>Beantwoorden van uw bericht</td>
                <td>Gerechtvaardigd belang (correspondentie)</td>
                <td>Zolang de afhandeling loopt</td>
              </tr>
              <tr>
                <td>Geaggregeerde, cookieloze gebruiksstatistieken</td>
                <td>Verbeteren van de website</td>
                <td>Gerechtvaardigd belang</td>
                <td>Alleen geaggregeerd, niet herleidbaar</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Met wie delen wij gegevens?</h2>
        <ul>
          <li>
            Met niemand, tenzij u daar bij een leadaanvraag zelf expliciet voor
            kiest. U ziet vooraf precies welke samenvatting wordt gedeeld.
          </li>
          <li>
            Met verwerkers die nodig zijn om de website te laten draaien
            (hosting); met hen sluiten wij verwerkersovereenkomsten.
          </li>
          <li>Wij verkopen nooit gegevens aan derden.</li>
        </ul>

        <h2>Uw uitslag en de beveiligde link</h2>
        <p>
          Uw uitslag is bereikbaar via een cryptografisch onvoorspelbare link
          die niet wordt geïndexeerd en niet raadbaar is. Uitslagen worden na
          maximaal 30 dagen automatisch van de server verwijderd.
        </p>

        <h2>Uw rechten</h2>
        <p>
          U heeft recht op inzage, rectificatie, verwijdering, beperking en
          overdraagbaarheid van uw gegevens, en het recht om toestemming in te
          trekken. Neem hiervoor contact op via het{" "}
          <a href="/contact">contactformulier</a>. U kunt ook een klacht
          indienen bij de Autoriteit Persoonsgegevens.
        </p>

        <h2>Wijzigingen</h2>
        <p>
          Bij materiële wijzigingen van deze verklaring passen wij het
          versienummer bovenaan aan. Toestemming die u eerder gaf, blijft
          gekoppeld aan de versie die toen gold.
        </p>
      </div>
    </Container>
  );
}
