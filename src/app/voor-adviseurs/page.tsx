import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd, breadcrumbLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Voor adviseurs en specialisten",
  description:
    "Ontvang voorgekwalificeerde aanvragen van pandeigenaren die na de gratis PandCheck zelf om hulp vragen, gematcht op uw specialisme en werkgebied, met toestemming en zonder langdurige exclusiviteit. Meld uw interesse voor het partnernetwerk in opbouw.",
  alternates: { canonical: "/voor-adviseurs" },
};

const FLOW = [
  {
    n: 1,
    title: "Pandeigenaar doet de PandCheck",
    text: "Een mkb-ondernemer of eigenaar vult postcode en een paar vragen in over het bedrijfspand.",
    Icon: IconBuildingSearch,
  },
  {
    n: 2,
    title: "Krijgt een indicatieve uitslag",
    text: "Per onderwerp een heldere status met bron en vervolgstap. De uitslag blijft altijd onafhankelijk.",
    Icon: IconReport,
  },
  {
    n: 3,
    title: "Vraagt zelf om hulp, met toestemming",
    text: "Wil de eigenaar verder? Dan vraagt hij vrijwillig contact aan en geeft expliciet toestemming om gegevens te delen.",
    Icon: IconConsent,
  },
  {
    n: 4,
    title: "U ontvangt een gekwalificeerde aanvraag",
    text: "Gematcht op uw specialisme en werkgebied, inclusief onderwerp en context uit de check.",
    Icon: IconInbox,
  },
];

const BENEFITS: { title: string; text: string; Icon: IconType }[] = [
  {
    title: "Voorgekwalificeerd, geen koud contact",
    text: "De aanvrager heeft de check al gedaan en weet welk onderwerp speelt. U begint het gesprek met context, niet vanaf nul.",
    Icon: IconTarget,
  },
  {
    title: "Gematcht op specialisme en regio",
    text: "U ontvangt alleen aanvragen die bij uw vakgebied en werkgebied passen, nooit op basis van advertentiebudget.",
    Icon: IconMatch,
  },
  {
    title: "Met expliciete toestemming (AVG)",
    text: "De aanvrager deelt zelf zijn gegevens en geeft daar toestemming voor. Privacy en herleidbaarheid staan vast.",
    Icon: IconShield,
  },
  {
    title: "Onafhankelijke uitslag wekt vertrouwen",
    text: "De inhoudelijke uitslag blijft los van commerciële afspraken. Dat merkt de aanvrager, en dat helpt u aan tafel.",
    Icon: IconBalance,
  },
  {
    title: "Betalen per geldige aanvraag",
    text: "Transparante voorwaarden en geen langdurige exclusiviteitsverplichtingen. U betaalt alleen voor wat telt.",
    Icon: IconReceipt,
  },
  {
    title: "U houdt de regie",
    text: "U bepaalt zelf uw specialismen, werkgebied en hoeveel aanvragen u aankunt. Op- en afschalen kan altijd.",
    Icon: IconSliders,
  },
];

const VALID_CRITERIA = [
  "Het betreft een echt Nederlands bedrijfs- of utiliteitspand.",
  "Er is een concrete hulpvraag die binnen uw specialisme en werkgebied valt.",
  "De aanvrager heeft contactgegevens achtergelaten en expliciet toestemming gegeven om die te delen.",
  "Het is geen dubbele aanvraag en geen spam of testinvoer.",
];

const SPECIALISMS = [
  "Energieadvies / EPA-U",
  "Energielabel & maatwerkadvies",
  "Installatie & verduurzaming",
  "Warmtepomp & isolatie",
  "Netaansluiting & netcongestie-advies",
  "Zakelijke batterij & energieopslag",
  "Zonne-energie (PV)",
  "Vastgoedbeheer & -advies",
];

export default function VoorAdviseursPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            title: "Voor adviseurs en specialisten",
            description:
              "Ontvang voorgekwalificeerde aanvragen van pandeigenaren, gematcht op specialisme en werkgebied, met toestemming en zonder langdurige exclusiviteit.",
            path: "/voor-adviseurs",
          }),
          breadcrumbLd([{ name: "Voor adviseurs", path: "/voor-adviseurs" }]),
        ]}
      />

      {/* --- HERO --- */}
      <section className="relative overflow-hidden bg-[#eef4f3] pb-16 pt-6 sm:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-mint/40 blur-3xl" />
          <div className="absolute right-0 -top-6 h-80 w-80 rounded-full bg-amber/20 blur-3xl" />
        </div>
        <Container className="relative">
          <Breadcrumbs items={[{ name: "Voor adviseurs", path: "/voor-adviseurs" }]} />
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-pine px-4 py-1.5 text-sm font-bold text-white shadow-soft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber" aria-hidden="true" />
                Partnernetwerk in opbouw
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl">
                Aanvragen van pandeigenaren die al{" "}
                <span className="relative whitespace-nowrap text-pine">
                  weten wat er speelt
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 320 18"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-3 w-full text-amber"
                  >
                    <path d="M3 13c70-9 250-9 314 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink-soft">
                Bezoekers doen eerst de gratis PandCheck en zien hun indicatieve
                uitslag. Wie daarna hulp wil, vraagt zelf contact aan. U ontvangt
                een voorgekwalificeerde aanvraag, gematcht op uw specialisme en
                werkgebied, met toestemming en met context.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="lg">
                  Meld uw interesse
                </ButtonLink>
                <ButtonLink href="#hoe-het-werkt" size="lg" variant="secondary">
                  Bekijk hoe het werkt
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                Vrijblijvend. Betalen alleen per geldige aanvraag, zonder
                langdurige exclusiviteit.
              </p>
            </div>

            {/* Voorbeeld-aanvraagkaart */}
            <div className="relative">
              <div className="rounded-panel border border-line bg-surface p-5 shadow-lift sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">
                    Aanvraag voor een specialist
                  </p>
                  <span className="rounded-full bg-amber-soft px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-amber-ink">
                    Voorbeeld
                  </span>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Pand", "Kantoorpand ~650 m² (fictief), Utrecht"],
                    ["Onderwerp", "Energielabel C, waarschijnlijk van toepassing"],
                    ["Hulpvraag", "Advies over route naar label C vóór 2027"],
                    ["Werkgebied", "Provincie Utrecht"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="shrink-0 font-semibold text-ink-soft">{k}</dt>
                      <dd className="text-right font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 flex items-center gap-2 rounded-card border border-line bg-[#f0faf5] px-3 py-2.5 text-sm font-semibold text-pine">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 2.5 4 5v4.2c0 3.7 2.5 6.4 6 7.8 3.5-1.4 6-4.1 6-7.8V5l-6-2.5Z" />
                    <path d="m7.4 10 1.8 1.8 3.6-3.9" />
                  </svg>
                  Met expliciete toestemming gedeeld
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-ink-soft">
                Fictief voorbeeld ter illustratie, geen echte aanvraag.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --- LEADFLOW --- */}
      <section id="hoe-het-werkt" className="scroll-mt-24 bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Zo ontvangt u een aanvraag
            </h2>
            <p className="mt-3 text-ink-soft">
              Van pandeigenaar tot gekwalificeerde aanvraag, in vier stappen.
              De eigenaar houdt bij elke stap zelf de regie.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {FLOW.map(({ n, title, text, Icon }, i) => (
              <li
                key={n}
                className="vt-rise relative flex flex-col rounded-panel border border-line bg-surface p-6 shadow-soft"
              >
                {i < FLOW.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-pine lg:flex"
                  >
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h12m-5-5 5 5-5 5" />
                    </svg>
                  </span>
                ) : null}
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine text-sm font-extrabold text-white">
                    {n}
                  </span>
                  <Icon className="h-7 w-7 text-pine" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-ink-soft">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* --- WAAROM ANDERS --- */}
      <section className="bg-[#eef4f3] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Waarom deze aanvragen anders zijn
            </h2>
            <p className="mt-3 text-ink-soft">
              Geen gekochte adreslijst en geen koude leads, maar mensen die zelf
              op zoek zijn naar hulp bij een concreet onderwerp.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ title, text, Icon }) => (
              <div
                key={title}
                className="vt-rise flex flex-col rounded-panel border border-line bg-surface p-6 shadow-soft"
              >
                <Icon className="h-8 w-8 text-pine" />
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- GELDIGE AANVRAAG --- */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Wat is een geldige aanvraag?
              </h2>
              <p className="mt-4 text-ink-soft">
                Volledige transparantie: u betaalt alleen voor aanvragen die aan
                heldere criteria voldoen. Voldoet een aanvraag niet, dan betaalt
                u er niet voor.
              </p>
              <div className="mt-6 rounded-card border border-line bg-[#eef4f3] p-5 text-sm text-ink-soft">
                <span className="font-bold text-ink">Geen match?</span> Aanvragen
                buiten uw specialisme of werkgebied, dubbele aanvragen en
                testinvoer tellen niet mee en worden niet in rekening gebracht.
              </div>
            </div>
            <ul className="space-y-3">
              {VALID_CRITERIA.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-soft"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-soft text-pine">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 10.3 3 3 7-7.6" />
                    </svg>
                  </span>
                  <span className="text-[0.95rem] text-ink">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* --- SPECIALISMEN & WERKGEBIED (navy) --- */}
      <section className="bg-ink py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Specialismen en werkgebied
              </h2>
              <p className="mt-4 text-white/75">
                U geeft aan wat u doet en waar u actief bent. Wij matchen elke
                aanvraag op onderwerp én op postcode/regio, zodat u alleen
                relevante aanvragen in uw eigen werkgebied ontvangt.
              </p>
              <ul className="mt-6 space-y-3 text-white/85">
                {[
                  ["Onderwerp-match", "De aanvraag past bij uw vakgebied, bijvoorbeeld label C of netcongestie."],
                  ["Regio-match", "U kiest provincies, regio's of postcodegebieden waarin u werkt."],
                  ["Capaciteit", "U bepaalt zelf hoeveel aanvragen u wilt ontvangen."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-action" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="10" cy="10" r="8" />
                      <path d="m6.5 10.3 2.3 2.3 4.7-5.2" />
                    </svg>
                    <span>
                      <strong className="text-white">{t}.</strong> {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-panel bg-white/5 p-6 ring-1 ring-white/10">
              <p className="text-sm font-bold uppercase tracking-wide text-mint">
                Voorbeelden van specialismen
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {SPECIALISMS.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/60">
                Ander specialisme? Vermeld het bij uw aanmelding, we denken graag
                mee.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --- STATUS (eerlijk) --- */}
      <section className="bg-[#eef4f3] py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Status: netwerk in zorgvuldige opbouw
          </h2>
          <div className="prose-pp mt-5 max-w-none">
            <p>
              PandPlicht is recent gelanceerd en bouwt het partnernetwerk
              zorgvuldig op. Automatische doorsturing van aanvragen staat nog
              niet aan; we starten pas wanneer processen, overeenkomsten en
              privacyafspraken volledig staan. Zo weet u zeker dat een aanvraag
              die u ontvangt, correct en met toestemming tot stand is gekomen.
            </p>
            <p>
              Concrete resultaten, zoals het aantal aanvragen en conversies,
              delen we hier zodra er echte cijfers zijn. We tonen bewust geen
              verzonnen aantallen of logo&apos;s; dat past niet bij een platform
              dat draait om betrouwbare informatie.
            </p>
            <p>
              Interesse om als eerste aan te sluiten? Laat uw gegevens achter met
              vermelding van uw specialisme en werkgebied. We nemen contact op
              zodra de onboarding start.
            </p>
          </div>
        </Container>
      </section>

      {/* --- CTA --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pine via-pine to-[#0a4239] py-16 text-center sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-action/30 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-amber/20 blur-2xl" />
        </div>
        <Container className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Word partner in het PandPlicht-netwerk
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-mint">
            Meld uw interesse met uw specialisme en werkgebied. Vrijblijvend, en
            u hoort van ons zodra de onboarding begint.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact" size="lg" className="bg-amber text-ink hover:bg-[#e6a92f]">
              Meld uw interesse
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

/* --- Iconen (flat, monochroom, currentColor) --- */
type IconType = ({ className }: { className?: string }) => React.JSX.Element;

const svg = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: false as const,
};

function IconBuildingSearch({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M6 28V8l9-3v23" />
      <path d="M15 12h7v16" />
      <path d="M9 12h2M9 16h2M9 20h2M18 16h1M18 20h1" />
      <circle cx="24" cy="22" r="4" />
      <path d="m27 25 3 3" strokeWidth={2.2} />
    </svg>
  );
}
function IconReport({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M8 4h11l5 5v19H8z" />
      <path d="M19 4v5h5" />
      <path d="m11 15 2 2 3-3.5M11 21l2 2 3-3.5" strokeWidth={2} />
      <path d="M19 15h2M19 21h2" />
    </svg>
  );
}
function IconConsent({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M16 5 7 8v6c0 6 4 9.5 9 11 5-1.5 9-5 9-11V8l-9-3Z" />
      <path d="m11.5 15.5 3 3 6-6.5" strokeWidth={2.1} />
    </svg>
  );
}
function IconInbox({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M5 18 8 6h16l3 12v8H5z" />
      <path d="M5 18h6l2 3h6l2-3h6" />
    </svg>
  );
}
function IconTarget({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconMatch({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <circle cx="10" cy="16" r="5" />
      <circle cx="22" cy="16" r="5" />
      <path d="M13.5 14.5 18.5 17.5M13.5 17.5l5-3" strokeWidth={1.6} />
    </svg>
  );
}
function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M16 4 6 7.5v7C6 22 10.5 26.5 16 28.5 21.5 26.5 26 22 26 14.5v-7L16 4Z" />
      <path d="m11.5 15.5 3 3 6-6.5" strokeWidth={2.1} />
    </svg>
  );
}
function IconBalance({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M16 5v22M9 27h14" />
      <path d="M7 9h18" />
      <path d="M7 9 3.5 17h7L7 9ZM25 9l-3.5 8h7L25 9Z" />
    </svg>
  );
}
function IconReceipt({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M8 4v24l3-2 2.5 2 2.5-2 2.5 2 2.5-2 3 2V4z" />
      <path d="M12 11h8M12 16h8M12 21h5" />
    </svg>
  );
}
function IconSliders({ className = "" }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 32 32" className={className}>
      <path d="M7 6v20M16 6v20M25 6v20" />
      <circle cx="7" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="16" cy="20" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="25" cy="10" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
