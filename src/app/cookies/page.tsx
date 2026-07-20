import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "PandPlicht gebruikt geen tracking- of advertentiecookies. Lees welke strikt noodzakelijke opslag de website wél gebruikt.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Cookies", path: "/cookies" }]} />
      <div className="prose-pp mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Cookies</h1>
        <p className="mt-3 text-sm text-ink-soft">Laatst bijgewerkt op 20 juli 2026</p>

        <h2>Kort antwoord</h2>
        <p>
          PandPlicht plaatst op dit moment <strong>geen tracking-, marketing-
          of advertentiecookies</strong> en toont daarom ook geen
          cookiebanner. Wij gebruiken alleen strikt noodzakelijke opslag in uw
          eigen browser om de check te laten werken.
        </p>

        <h2>Welke opslag gebruiken wij wel?</h2>
        <div className="overflow-x-auto">
          <table>
            <caption>Strikt noodzakelijke browseropslag</caption>
            <thead>
              <tr>
                <th scope="col">Naam</th>
                <th scope="col">Type</th>
                <th scope="col">Doel</th>
                <th scope="col">Bewaartermijn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>pp-check-v1</td>
                <td>sessionStorage</td>
                <td>Uw antwoorden bewaren terwijl u de check invult</td>
                <td>Tot u het browsertabblad sluit</td>
              </tr>
              <tr>
                <td>pp-uitslag-*</td>
                <td>sessionStorage</td>
                <td>Uw uitslag lokaal tonen zonder serverafhankelijkheid</td>
                <td>Tot u het browsertabblad sluit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>En in de toekomst?</h2>
        <p>
          Als wij later functionaliteit toevoegen die toestemmingsplichtige
          cookies vereist (bijvoorbeeld advertentiemeting), vragen wij die
          toestemming vooraf via een duidelijke voorkeureninterface — zonder
          misleidende knoppen, en met &lsquo;weigeren&rsquo; net zo makkelijk
          als &lsquo;accepteren&rsquo;. Analytics houden wij bij voorkeur
          cookieloos en geaggregeerd.
        </p>
      </div>
    </Container>
  );
}
