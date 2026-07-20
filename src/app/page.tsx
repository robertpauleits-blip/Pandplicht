import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddressStarter } from "@/components/marketing/AddressStarter";
import { HeroIllustration } from "@/components/marketing/HeroIllustration";
import { Faq, type FaqEntry } from "@/components/marketing/Faq";
import {
  IconBattery,
  IconGrid,
  IconMeter,
  IconPand,
} from "@/components/marketing/ToolIcons";
import {
  JsonLd,
  faqLd,
  organizationLd,
  websiteLd,
} from "@/lib/seo/jsonld";
import { getRecentArticles } from "@/content/knowledge";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const TOOLS = [
  {
    href: "/tools/pandverplichtingencheck",
    title: "Pandverplichtingencheck",
    text: "Bekijk welke verplichtingen mogelijk bij uw gebruik, oppervlakte en energieverbruik passen.",
    Icon: IconPand,
    accent: "bg-pine text-white",
    bar: "bg-pine",
  },
  {
    href: "/tools/energiebesparingsplicht-check",
    title: "Energiebesparingsplichtcheck",
    text: "Krijg een indicatie van de energie-, informatie- of onderzoeksplicht.",
    Icon: IconMeter,
    accent: "bg-action text-white",
    bar: "bg-action",
  },
  {
    href: "/tools/netcongestiecheck",
    title: "Netcongestiecheck",
    text: "Breng uw aansluiting, groeiplannen en mogelijke knelpunten in beeld.",
    Icon: IconGrid,
    accent: "bg-amber text-ink",
    bar: "bg-amber",
  },
  {
    href: "/tools/zakelijke-batterijscan",
    title: "Zakelijke batterijscan",
    text: "Ontdek of batterijonderzoek voor uw situatie logisch kan zijn.",
    Icon: IconBattery,
    accent: "bg-coral text-white",
    bar: "bg-coral",
  },
];

const FAQ_ITEMS: FaqEntry[] = [
  {
    question: "Is de PandCheck gratis?",
    answer:
      "Ja. De check en de indicatieve uitslag zijn volledig gratis. U hoeft geen account aan te maken en u ziet uw uitslag vóórdat wij om contactgegevens vragen. Alleen als u daarna vrijwillig een vervolgstap met een specialist wilt, laat u gegevens achter.",
  },
  {
    question: "Is de uitslag juridisch bindend?",
    answer:
      "Nee. De uitslag is een indicatie op basis van uw antwoorden en openbare overheidsbronnen. Het is geen juridisch advies, geen beschikking en geen garantie van een netbeheerder. Bij iedere uitkomst tonen wij de gebruikte bronnen en de controledatum, zodat u alles zelf kunt nalezen.",
  },
  {
    question: "Welke gegevens heb ik nodig?",
    answer:
      "Handig om bij de hand te hebben: uw postcode en huisnummer, uw jaarlijkse energiegebruik (kWh en m³ gas — dit staat op de jaarafrekening), en eventueel uw energielabel. Weet u iets niet? Kies dan 'Weet ik niet'; de check werkt ook met onvolledige gegevens, alleen wordt de indicatie dan wat minder scherp.",
  },
  {
    question: "Wat gebeurt er met mijn adres en antwoorden?",
    answer:
      "Uw antwoorden worden alleen gebruikt om uw indicatieve uitslag te berekenen. Wij plaatsen geen volledige adressen of antwoorden in analytics en delen niets met derden zonder dat u daar zelf expliciet voor kiest. In onze privacyverklaring leest u precies wat wij bewaren en hoe lang.",
  },
  {
    question: "Kan ik de check doen als huurder?",
    answer:
      "Ja. In de check geeft u aan wat uw relatie tot het pand is (eigenaar, verhuurder, huurder of beheerder). Sommige verplichtingen liggen vooral bij de eigenaar, andere bij de gebruiker; de uitslag legt per onderwerp uit wie meestal aan zet is — zonder daar een definitief juridisch oordeel over te geven.",
  },
  {
    question: "Kan PandPlicht mijn energielabel ophalen?",
    answer:
      "Nog niet automatisch. U kunt uw label zelf gratis opzoeken in EP-Online, de officiële energielabeldatabase van de overheid; wij linken daar op het juiste moment naartoe. In de check kunt u het label vervolgens zelf invullen, of 'Onbekend' kiezen.",
  },
  {
    question: "Krijg ik direct een offerte?",
    answer:
      "Nee. PandPlicht is een informatieplatform: u krijgt eerst een heldere, indicatieve uitslag met bronnen en vervolgstappen. Alleen als u dat zelf wilt, kunt u daarna vrijblijvend contact aanvragen met een passende specialist. U bepaalt welke gegevens u daarbij deelt.",
  },
];

export default function HomePage() {
  const articles = getRecentArticles(3);

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), faqLd(FAQ_ITEMS)]} />

      {/* --- Hero --- */}
      <section className="relative overflow-hidden pt-10 sm:pt-16">
        {/* Decoratieve kleurvlakken op de achtergrond */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-mint/50 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-action/15 blur-3xl" />
        </div>
        <Container>
          <div className="reveal relative overflow-hidden rounded-panel bg-gradient-to-br from-surface via-surface to-mint-soft p-6 shadow-lift ring-1 ring-line/60 sm:p-10 lg:p-14">
            {/* Accentrandje bovenaan het paneel */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pine via-action to-amber"
            />
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-pine px-4 py-1.5 text-sm font-bold text-white shadow-soft">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber" aria-hidden />
                  Gratis indicatieve check voor bedrijfspanden
                </p>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[4rem]">
                  Weet u welke plichten voor uw{" "}
                  <span className="relative whitespace-nowrap text-pine">
                    bedrijfspand
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 300 18"
                      preserveAspectRatio="none"
                      className="absolute -bottom-1 left-0 h-3 w-full text-amber"
                    >
                      <path
                        d="M3 13c60-9 234-9 294 0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  gelden?
                </h1>
                <p className="mt-6 max-w-xl text-lg text-ink-soft">
                  Controleer binnen enkele minuten mogelijke
                  energieverplichtingen, netcongestierisico&rsquo;s en kansen
                  voor batterijopslag. Helder uitgelegd en met bronnen.
                </p>
                <AddressStarter />
              </div>
              <div className="mx-auto hidden max-w-lg lg:block">
                <HeroIllustration className="w-full drop-shadow-sm" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- Vertrouwensbalk --- */}
      <section aria-label="Waar u op kunt rekenen" className="mt-10">
        <Container>
          <ul className="grid grid-cols-2 gap-3 text-sm font-semibold text-ink sm:grid-cols-4">
            {[
              { t: "Gebaseerd op openbare overheidsbronnen", c: "bg-mint-soft text-pine" },
              { t: "Uitslag in enkele minuten", c: "bg-amber-soft text-amber-ink" },
              { t: "Geen account nodig", c: "bg-status-no-bg text-status-no-ink" },
              { t: "Uw kernuitslag vóór het contactformulier", c: "bg-coral-soft text-coral-ink" },
            ].map((item) => (
              <li
                key={item.t}
                className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5 shadow-soft"
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.c}`}
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 10.3 3 3 7-7.6" />
                  </svg>
                </span>
                {item.t}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* --- Vier productkaarten --- */}
      <section aria-labelledby="tools-heading" className="mt-16 sm:mt-24">
        <Container>
          <h2
            id="tools-heading"
            className="max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Vier checks, één helder overzicht
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Doe de complete PandCheck of start bij het onderwerp dat nu speelt.
            Elke check is gratis en indicatief.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map(({ href, title, text, Icon, accent, bar }) => (
              <article
                key={href}
                className="group relative flex flex-col overflow-hidden rounded-panel border border-line bg-surface p-6 shadow-soft transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1.5 ${bar}`}
                />
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft transition-transform duration-200 group-hover:scale-110 ${accent}`}
                >
                  <Icon />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-ink-soft">{text}</p>
                <Link
                  href={href}
                  className="mt-4 inline-flex items-center gap-1.5 font-bold text-pine group-hover:gap-2.5"
                >
                  Bekijk deze check
                  <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10h12m-5-5 5 5-5 5" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* --- Voorbeeldrapport --- */}
      <section aria-labelledby="voorbeeld-heading" className="mt-16 sm:mt-24">
        <Container>
          <div className="rounded-panel bg-ink p-6 sm:p-10 lg:p-14">
            <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2
                  id="voorbeeld-heading"
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                >
                  Zo ziet uw uitslag eruit
                </h2>
                <p className="mt-4 text-white/75">
                  Per onderwerp ziet u een genuanceerde status, waarom u die
                  krijgt, welke bron is gebruikt en wat een logische volgende
                  stap is. Ook wat wij <em>niet</em> weten, benoemen we
                  expliciet.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    ["Waarom ziet u dit?", "Iedere status is herleidbaar naar uw antwoorden."],
                    ["Welke bron is gebruikt?", "Met uitgever en controledatum, direct te openen."],
                    ["Wat is de volgende stap?", "Concreet en in volgorde van prioriteit."],
                    ["Welke onzekerheid blijft er?", "Ontbrekende gegevens verlagen de zekerheid — dat ziet u terug."],
                  ].map(([q, a]) => (
                    <li key={q} className="flex gap-3 text-white/85">
                      <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0 text-action" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="10" cy="10" r="8" />
                        <path d="m6.5 10.3 2.3 2.3 4.7-5.2" />
                      </svg>
                      <span>
                        <strong className="text-white">{q}</strong> {a}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock van resultatenpaneel — duidelijk gelabeld als voorbeeld */}
              <div
                className="rounded-panel bg-surface p-5 shadow-lift sm:p-6"
                aria-label="Voorbeeld van een resultatenoverzicht met fictieve gegevens"
              >
                <p className="inline-flex rounded-full bg-amber-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-ink">
                  Voorbeeld
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  Indicatief overzicht • fictief kantoorpand, 650 m²
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-card border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-ink">Energielabel C kantoren</h3>
                      <StatusBadge status="likely_applicable" />
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">
                      Voorbeeld: opgegeven label E bij een kantoor van 650 m² —
                      minimaal label C is dan waarschijnlijk vereist. Bron: RVO.
                    </p>
                  </div>
                  <div className="rounded-card border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-ink">Energiebesparingsplicht</h3>
                      <StatusBadge status="possibly_applicable" />
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">
                      Voorbeeld: verbruik rond de 50.000&nbsp;kWh-grens — controleer
                      de jaarafrekening voor een scherpere indicatie.
                    </p>
                  </div>
                  <div className="rounded-card border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-ink">Netcongestie-risico</h3>
                      <StatusBadge status="likely_not_applicable" topicId="netcongestie" />
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">
                      Voorbeeld: geen gemelde beperkingen en geen groeiplannen —
                      wel blijven volgen bij nieuwe plannen.
                    </p>
                  </div>
                  <div className="rounded-card border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-ink">Batterijonderzoek</h3>
                      <StatusBadge status="insufficient_data" topicId="batterijscan" />
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">
                      Voorbeeld: zonder kwartierdata en piekvermogen is een
                      batterij-indicatie nog niet verantwoord te geven.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- Zo werkt het --- */}
      <section aria-labelledby="werkwijze-heading" className="mt-16 sm:mt-24">
        <Container>
          <h2
            id="werkwijze-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Zo werkt het
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Vul uw pand en gebruik in",
                text: "Start met postcode en huisnummer. Daarna beantwoordt u korte vragen over gebruik, oppervlakte en energie. 'Weet ik niet' is altijd een geldig antwoord.",
              },
              {
                title: "Wij toetsen uw antwoorden aan actuele regels en signalen",
                text: "Uw antwoorden worden vergeleken met drempels en voorwaarden uit openbare overheidsbronnen, met per regel een bron en controledatum.",
              },
              {
                title: "Ontvang een overzicht met prioriteiten en vervolgstappen",
                text: "U ziet direct wat waarschijnlijk speelt, wat u moet nakijken en wat nu minder relevant lijkt — inclusief een printbaar rapport.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className="rounded-panel border border-line bg-surface p-6"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pine text-lg font-extrabold text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* --- Waarom PandPlicht --- */}
      <section aria-labelledby="waarom-heading" className="mt-16 sm:mt-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2
                id="waarom-heading"
                className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
              >
                Waarom PandPlicht?
              </h2>
              <p className="mt-4 text-ink-soft">
                De regels bestaan al — maar ze staan verspreid over RVO,
                Rijksoverheid, EP-Online, netbeheerders en gemeenten. Wij
                zetten ze voor uw situatie op één rij.
              </p>
              <div className="mt-6">
                <ButtonLink href="/pandcheck" size="lg">
                  Start gratis PandCheck
                </ButtonLink>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                [
                  "Informatie staat op meerdere websites",
                  "RVO legt de plicht uit, EP-Online kent uw label, de netbeheerder weet uw aansluiting. Wij brengen die versnipperde informatie samen in één check.",
                ],
                [
                  "Verantwoordelijkheid verschilt per situatie",
                  "Eigenaar of huurder? Dat maakt uit per verplichting. De uitslag benoemt wie meestal aan zet is, zonder juridische schijnzekerheid.",
                ],
                [
                  "Drempelwaarden zijn moeilijk te onthouden",
                  "50.000 kWh, 25.000 m³, 100 m², label C — wij toetsen uw cijfers aan de actuele drempels en tonen de bron erbij.",
                ],
                [
                  "Een congestiekaart zegt niet wat ú moet doen",
                  "Een kleur op de kaart is geen antwoord. Onze scan vertaalt uw aansluiting en plannen naar concrete vervolgstappen richting de netbeheerder.",
                ],
                [
                  "Een batterij is niet altijd logisch",
                  "Wij rekenen geen rendement voor dat we niet kunnen onderbouwen. De scan zegt eerlijk of nader onderzoek zinvol lijkt — of juist niet.",
                ],
              ].map(([title, text]) => (
                <li
                  key={title}
                  className="rounded-card border border-line bg-surface p-5"
                >
                  <h3 className="font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-ink-soft">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* --- Kennis en actuele onderwerpen --- */}
      <section aria-labelledby="kennis-heading" className="mt-16 sm:mt-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="kennis-heading"
              className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            >
              Uit de kennisbank
            </h2>
            <Link href="/kennisbank" className="font-bold text-pine hover:underline">
              Alle artikelen →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.slug}
                className="flex flex-col rounded-panel border border-line bg-surface p-6 shadow-soft"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-pine">
                  {a.category}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug text-ink">
                  <Link href={`/kennisbank/${a.slug}`} className="hover:underline">
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-ink-soft">
                  {a.description}
                </p>
                <p className="mt-4 text-sm text-ink-soft">
                  Gecontroleerd op{" "}
                  <time dateTime={a.lastReviewedAt}>
                    {new Date(a.lastReviewedAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* --- FAQ --- */}
      <section className="mt-16 sm:mt-24">
        <Container className="max-w-3xl">
          <Faq items={FAQ_ITEMS} />
        </Container>
      </section>

      {/* --- Eind-CTA --- */}
      <section aria-labelledby="cta-heading" className="mt-16 sm:mt-24">
        <Container>
          <div className="relative overflow-hidden rounded-panel bg-gradient-to-br from-pine via-pine to-[#0a4239] p-8 text-center shadow-lift sm:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-action/30 blur-2xl" />
              <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-amber/20 blur-2xl" />
            </div>
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-mint">
                <span className="h-2 w-2 rounded-full bg-amber" aria-hidden />
                Gratis • geen account • uitslag in enkele minuten
              </p>
              <h2
                id="cta-heading"
                className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
              >
                Begin met duidelijkheid over uw pand.
              </h2>
              <div className="mt-8">
                <ButtonLink
                  href="/pandcheck"
                  size="lg"
                  className="bg-amber text-ink hover:bg-[#e6a92f]"
                >
                  Start gratis PandCheck
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
