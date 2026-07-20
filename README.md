# PandPlicht.nl

Nederlands informatie- en leadgeneratieplatform voor mkb-ondernemers en
eigenaren van bedrijfspanden. Bezoekers ontdekken via een gratis, indicatieve
check welke energie- en verduurzamingsverplichtingen mogelijk voor hun locatie
gelden: energiebesparingsplicht, informatie-/onderzoeksplicht,
energielabel-eisen, netcongestierisico's en de afweging rond zakelijke
batterijopslag.

**Kernprincipes:** waarde vóór leadformulier, indicatief maar serieus, bronnen
met controledatum bij iedere regel, privacy als standaard, WCAG 2.2 AA.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript strict**
- **Tailwind CSS v4** met semantische designtokens (`src/app/globals.css`)
- **Zod** voor server-side invoervalidatie
- **Vitest** voor unit tests (rule engine + contentvalidatie)
- Self-hosted **Plus Jakarta Sans** (variabel font, geen externe requests)
- PDOK Locatieserver via server-side proxy (adresautocomplete, gratis/open)

## Lokaal starten

```bash
npm install
npm run dev        # ontwikkelserver op http://localhost:3000
```

Kwaliteitscontroles:

```bash
npm run typecheck  # TypeScript strict
npm run test       # Vitest: rule engine + contentvalidatie
npm run build      # production build
npm start          # production server
```

Er zijn géén verplichte environment-variabelen voor lokaal gebruik: de
opslagadapter schrijft naar `.data/` (git-ignored) en analytics staat op
`none`. Zie `.env.example` voor alle opties.

## Architectuur

```
src/
  app/                  # routes (App Router), API-routes, sitemap/robots/llms.txt
  components/           # ui-, layout- en marketingcomponenten
  features/
    assessment/         # PandCheck-wizard + resultatenweergave
    leads/              # leadformulier
    topics/             # verplichtingen-hubpagina's (uit regeldata)
    tools/              # de vier toolpagina's
    ads/                # SponsoredSlot (feature flag, uit)
  rules/                # ★ rule engine: bronnen, drempels, regels, tests
  content/knowledge/    # 15 kennisbankartikelen (typed, met buildvalidatie)
  lib/                  # site-config, PDOK-client, storage, security, seo, analytics
```

### De rule engine (`src/rules/`)

- `sources.ts` — centrale bronregistry; iedere bron heeft `checkedAt`.
- `version.ts` — `RULESET_VERSION`, changelog en **alle drempelwaarden**
  (50.000 kWh / 25.000 m³, 10 mln kWh / 170.000 m³, 100 m², 0,8 kW).
- Per onderwerp een module; `engine.ts` draait alles deterministisch.
- Statussen zijn altijd genuanceerd (`likely/possibly/likely_not/insufficient`),
  nooit "verplicht/niet verplicht" als juridisch oordeel.
- Unit tests dekken drempels (onder/op/boven), uitzonderingen en de
  batterijscoregrenzen (44/45/69/70).

### Dataflow PandCheck

1. Wizard (client) bewaart antwoorden in `sessionStorage`.
2. Bij "Bereken" → `POST /api/assessments`: server valideert (Zod), draait de
   engine en slaat op met een cryptografisch onvoorspelbare token.
3. Faalt de API, dan rekent de browser zelf met dezelfde rules-package
   (fallback) — de uitslag blijft altijd beschikbaar.
4. Uitslagpagina (`noindex`, `no-store`) leest eerst lokaal, dan via token-API.
5. Leadformulier is optioneel, met honeypot, minimale invultijd, expliciete
   toestemming en een keuze om de uitslag-samenvatting wel/niet mee te sturen.

### Opslag

`src/lib/db/storage.ts` definieert het `Storage`-interface. Nu actief: een
bestandsadapter (`.data/`) voor development/demo, met automatische opruiming
van assessments na `ASSESSMENT_RETENTION_DAYS` (default 30). Voor productie:
implementeer hetzelfde interface met PostgreSQL/Supabase (P1) — de rest van de
app merkt daar niets van.

## SEO / GEO

- Canonicals naar `https://www.pandplicht.nl`, sitemap en `llms.txt` uit één
  routebron (`src/lib/seo/routes.ts`).
- `robots.txt`: OAI-SearchBot toegestaan, GPTBot (training) geblokkeerd —
  bewuste, apart documenteerde keuze; scanflow en API's uitgesloten.
- JSON-LD: Organization, WebSite, WebPage, BreadcrumbList, Article, FAQPage —
  altijd gelijk aan zichtbare content, geen fictieve reviews/ratings.
- Ieder artikel en iedere themapagina volgt het antwoord-voorop-patroon
  ("Kort antwoord" direct onder de H1) met zichtbare controledata.
- Persoonlijke uitslagen: `noindex, nofollow` + `Cache-Control: no-store`.

## Deployment (bijv. Vercel)

1. Repository koppelen; build command `npm run build`, output standaard.
2. Environment-variabelen zetten volgens `.env.example`
   (minimaal `NEXT_PUBLIC_SITE_URL=https://www.pandplicht.nl`).
3. Domeinen: `www.pandplicht.nl` als primair; apex `pandplicht.nl` →
   permanente 301 naar `www`. `pandplicht.online` → 301 naar de equivalente
   URL op het hoofddomein. Nooit dezelfde content op beide domeinen indexeren.
4. Preview-deployments zijn via de headers al `noindex` voor uitslagen;
   zet voor previews bij voorkeur platformbrede `X-Robots-Tag: noindex` aan.
5. Health check: `GET /api/health`.

### Resterende handmatige acties vóór livegang

- [ ] **Drempels en bronnen opnieuw juridisch/inhoudelijk verifiëren** bij RVO
      (alle `checkedAt`-datums in `src/rules/sources.ts` verversen).
- [ ] DNS voor `pandplicht.nl` (www primair) en 301 vanaf `pandplicht.online`.
- [ ] Productieopslag (PostgreSQL/Supabase) achter het Storage-interface.
- [ ] Echt contact-/lead-e-mailadres + e-mailadapter (Resend o.i.d.) activeren.
- [ ] EP-Online API-sleutel aanvragen bij RVO en zetten (`EPONLINE_API_KEY` +
      `ENABLE_EP_ONLINE_INTEGRATION=true`) om label/oppervlakte automatisch op te
      halen; controleer de veldnamen tegen de live API bij eerste gebruik.
- [ ] Privacyvriendelijke analytics kiezen (Plausible/Umami) en site-ID zetten.
- [ ] Google Search Console + Bing Webmaster Tools verifiëren, sitemap indienen.
- [ ] KvK-gegevens in `src/lib/site.ts` (`LEGAL`) invullen zodra die bestaan.
- [ ] Responsible-disclosure-route publiceren zodra een echt e-mailadres bestaat.

### Integratiestatus (eerlijk overzicht)

| Integratie | Status |
|---|---|
| PDOK Locatieserver (adressen) | **Live** via server-side proxy met cache/timeout en handmatige fallback |
| EP-Online (energielabels) | **Adapter gebouwd**, standaard uit. Zet `ENABLE_EP_ONLINE_INTEGRATION=true` + `EPONLINE_API_KEY` (gratis bij RVO aan te vragen) → de PandCheck haalt dan automatisch label + oppervlakte op. Zonder sleutel/label valt de wizard terug op handmatige invoer; er wordt nooit een label verzonnen |
| Live netcapaciteitsdata | **Uit** (`ENABLE_LIVE_GRID_DATA=false`); scan verzint géén capaciteit |
| E-mail | **Uit**; leads worden alleen opgeslagen |
| Advertenties | **Uit** (`ADS_ENABLED=false`); `SponsoredSlot` rendert niets |

Zie ook `CONTENT_MAINTENANCE.md` voor redactioneel onderhoud.
