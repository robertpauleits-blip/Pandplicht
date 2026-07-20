# Contentonderhoud PandPlicht

Compacte werkinstructie voor het actueel houden van regels, bronnen en content.

## 1. Bronnen controleren

1. Open `src/rules/sources.ts`.
2. Bezoek iedere bron-URL en controleer of drempels/uitleg nog kloppen.
3. Werk per gecontroleerde bron `checkedAt` bij (formaat `YYYY-MM-DD`).
4. Wijzigt een bron inhoudelijk? Volg dan ook §2 (ruleset wijzigen).

Richtlijn: controleer alle bronnen minimaal ieder kwartaal én vlak vóór
iedere livegang. De contenttest waarschuwt automatisch wanneer
`lastReviewedAt` van artikelen ouder dan 12 maanden wordt.

## 2. Ruleset wijzigen

1. Drempelwaarden staan uitsluitend in `src/rules/version.ts` (`THRESHOLDS`).
2. Pas de waarde aan; pas waar nodig de regelmodules en NL-teksten aan.
3. Verhoog `RULESET_VERSION` (semver) en voeg een entry toe aan
   `RULESET_CHANGELOG` — die verschijnt automatisch op
   `/bronnen-en-methodologie`.
4. Draai `npm run test`; werk falende drempeltests bewust bij (onder/op/boven
   de nieuwe grens).
5. Wijzig nooit tegelijk wettelijke inhoud én conversiecopy in één wijziging.

## 3. Artikel actualiseren of toevoegen

1. Artikelen staan in `src/content/knowledge/articles-*.ts` (typed objecten).
2. Bewerk de inhoud; zet `lastReviewedAt` op de controledatum van vandaag.
3. Nieuwe artikelen: voeg toe aan het juiste clusterbestand, met unieke
   `slug`, `description`, `kortAntwoord` (± 40–80 woorden), `sourceIds` uit de
   registry en `related`-verwijzingen.
4. Buildvalidatie faalt hard op: dubbele slugs, ontbrekende beschrijving of
   bronnen, onbekende bron-IDs en kapotte related-links.
5. Sitemap en `llms.txt` volgen automatisch uit de contentregistry — niets
   handmatig bijwerken.

## 4. Verificatiedatum aanpassen

- Bronnen: `checkedAt` in `src/rules/sources.ts`.
- Artikelen: `lastReviewedAt` in het artikelbestand.
- Themapagina's tonen de datum uit `FEITEN_CHECKED_LABEL`
  (`src/features/topics/topics-data.ts`) — werk die string mee bij.
- Verander historische metadata nooit alsof een latere reviewer het stuk
  oorspronkelijk schreef.

## 5. Sitemap en structured data controleren

1. `npm run build && npm start`, open `/sitemap.xml` en `/robots.txt`.
2. Controleer JSON-LD met de Schema.org Validator en (waar relevant) de
   Google Rich Results Test — markup moet exact overeenkomen met zichtbare
   content.
3. Persoonlijke uitslagen (`/pandcheck/uitslag/…`) horen nooit in de sitemap
   en dragen `noindex`.

## 6. GEO-citaties monitoren

- Bekijk maandelijks in analytics de referrergroepen `ai_chatgpt`,
  `ai_perplexity`, `ai_copilot` (zie `src/lib/analytics/index.ts`).
- Gebruik Bing Webmaster Tools "AI Performance" (indien beschikbaar) en
  Search Console voor AI-features-data.
- Doe maandelijks een handmatige benchmark met een vaste set neutrale vragen
  (zie specificatie §15.12) en log citatie-/antwoordfouten.
- Geen massale automatische scraping van AI-antwoorden.

## 7. Leadprivacy en bewaartermijn beheren

- Assessments verlopen automatisch na `ASSESSMENT_RETENTION_DAYS`
  (default 30, zie `.env.example`); verlopen bestanden worden opgeruimd.
- Leads bevatten alleen wat de bezoeker expliciet deelde, plus de
  toestemmingsversie (`privacyVersion`). Bij een nieuwe privacyverklaring:
  verhoog `PRIVACY_VERSION` in `src/app/api/leads/route.ts` én de versie op
  `/privacy`.
- Verwijder of anonimiseer leads zodra de aanvraag is afgerond; bouw bij
  productieopslag een export-/verwijderproces (P1).
- Nooit volledige adressen, e-mails of vrije tekst in analytics of logs.
