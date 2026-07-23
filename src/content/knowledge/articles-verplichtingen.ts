import type { Article } from "../types";

const D = "2026-07-20";

export const ARTIKELEN_VERPLICHTINGEN: Article[] = [
  {
    slug: "welke-verplichtingen-gelden-voor-mijn-bedrijfspand",
    title: "Welke verplichtingen gelden mogelijk voor mijn bedrijfspand?",
    description:
      "Overzicht van de belangrijkste energie- en verduurzamingsverplichtingen voor Nederlandse bedrijfspanden: energiebesparingsplicht, informatieplicht, onderzoeksplicht en energielabel-eisen.",
    category: "Verplichtingen",
    searchIntent: "welke verplichtingen gelden voor mijn bedrijfspand",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: [
      "rvo-energy-saving-duty",
      "rvo-office-label-c",
      "government-utility-label",
      "rvo-information-duty",
    ],
    relatedTool: { href: "/tools/pandverplichtingencheck", label: "Doe de pandverplichtingencheck" },
    kortAntwoord:
      "Voor Nederlandse bedrijfspanden gelden vooral vier soorten energieverplichtingen: de energiebesparingsplicht (vanaf 50.000 kWh elektriciteit of 25.000 m³ aardgas per jaar), de bijbehorende informatie- of onderzoeksplicht, de label-C-plicht voor kantoren en de energielabelplicht bij verkoop, verhuur of oplevering. Welke verplichtingen op uw locatie van toepassing zijn, hangt af van gebruik, oppervlakte en energiegebruik.",
    sections: [
      { type: "kop", text: "Welke verplichtingen zijn er?" },
      {
        type: "paragraaf",
        text: "De regels voor bedrijfspanden komen uit verschillende wetten en worden door verschillende instanties uitgelegd: RVO, Rijksoverheid, gemeenten en omgevingsdiensten. Voor de meeste mkb-ondernemers zijn vier onderwerpen relevant.",
      },
      {
        type: "tabel",
        caption: "De vier belangrijkste verplichtingen in het kort (gecontroleerd op 20 juli 2026)",
        headers: ["Verplichting", "Voor wie", "Kern"],
        rows: [
          [
            "Energiebesparingsplicht",
            "Locaties vanaf 50.000 kWh elektriciteit of 25.000 m³ aardgas(equivalent) per jaar",
            "Alle energiebesparende maatregelen met een terugverdientijd van 5 jaar of korter nemen",
          ],
          [
            "Informatieplicht / onderzoeksplicht",
            "Locaties die onder de energiebesparingsplicht vallen",
            "Eens per vier jaar rapporteren welke maatregelen zijn genomen; grootverbruikers doen een onderzoek",
          ],
          [
            "Energielabel C kantoren",
            "Kantoorgebouwen (met uitzonderingen, o.a. < 100 m² en monumenten)",
            "Minimaal energielabel C of gelijkwaardige energieprestatie",
          ],
          [
            "Energielabel bij transactie",
            "Utiliteitsgebouwen bij verkoop, nieuwe verhuur of oplevering",
            "Een geldig, geregistreerd energielabel kunnen overleggen",
          ],
        ],
      },
      { type: "kop", text: "Wanneer geldt welke verplichting?" },
      {
        type: "lijst",
        items: [
          "Gebruikt uw locatie jaarlijks 50.000 kWh elektriciteit of 25.000 m³ aardgas(equivalent) of meer? Dan geldt waarschijnlijk de energiebesparingsplicht, en daarmee ook een rapportageverplichting.",
          "Is uw pand (grotendeels) een kantoor van 100 m² of meer? Dan geldt waarschijnlijk de label-C-plicht, tenzij een uitzondering van toepassing is.",
          "Gaat u verkopen, opnieuw verhuren of opleveren? Dan is in de regel een geldig energielabel verplicht.",
          "Gebruikt u meer dan 10 miljoen kWh of 170.000 m³ gas per jaar in een relevante bedrijfstak? Dan kan de onderzoeksplicht gelden.",
        ],
      },
      { type: "kop", text: "Wie is verantwoordelijk: eigenaar of gebruiker?" },
      {
        type: "paragraaf",
        text: "Dat verschilt per verplichting én per situatie. De energiebesparingsplicht ligt in beginsel bij degene die de activiteit uitvoert (vaak de gebruiker/huurder), terwijl de label-C-plicht aan het gebouw en daarmee vooral aan de eigenaar hangt. Bij verhuurde panden is afstemming tussen eigenaar en huurder daarom belangrijk. Lees hierover meer in ons artikel over de rolverdeling tussen eigenaar en huurder.",
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Zoek uw jaarlijkse energiegebruik op (jaarafrekening of klantportaal van uw energieleverancier).",
          "Controleer het energielabel van uw pand in EP-Online, de officiële labeldatabase.",
          "Stel vast welk deel van het gebruiksoppervlak kantoorfunctie heeft.",
          "Doe de gratis PandCheck voor een indicatief overzicht met bronnen en prioriteiten.",
        ],
      },
    ],
    faq: [
      {
        question: "Gelden deze verplichtingen ook voor huurders?",
        answer:
          "Ja, deels. De energiebesparingsplicht ligt vaak (mede) bij de gebruiker van het pand. De label-C-plicht is gebouwgebonden en raakt vooral de eigenaar, maar een huurder van een kantoor dat niet voldoet, kan er in de praktijk ook mee te maken krijgen.",
      },
      {
        question: "Wat gebeurt er als ik niet voldoe?",
        answer:
          "Toezicht ligt bij gemeenten en omgevingsdiensten. Die kunnen bij een controle om informatie vragen en handhaven. De precieze aanpak verschilt per regio; het is verstandig om aantoonbaar aan de slag te zijn met de verplichtingen die voor u gelden.",
      },
    ],
    related: [
      "energiebesparingsplicht-grenzen-uitzonderingen",
      "energielabel-c-kantoren-wanneer",
      "eigenaar-of-huurder-wie-regelt-wat",
    ],
    status: "published",
  },

  {
    slug: "energiebesparingsplicht-grenzen-uitzonderingen",
    title: "Energiebesparingsplicht: grenzen, uitzonderingen en vervolgstappen",
    description:
      "Wanneer geldt de energiebesparingsplicht? De drempels van 50.000 kWh en 25.000 m³ aardgas uitgelegd, met uitzonderingen en een praktisch stappenplan.",
    category: "Energiebesparing",
    searchIntent: "wanneer geldt de energiebesparingsplicht",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-energy-saving-duty", "rvo-eml", "rvo-information-duty"],
    relatedTool: {
      href: "/tools/energiebesparingsplicht-check",
      label: "Doe de energiebesparingsplichtcheck",
    },
    kortAntwoord:
      "De energiebesparingsplicht geldt voor locaties die per jaar 50.000 kWh elektriciteit of 25.000 m³ aardgas(equivalent) of meer gebruiken. Wie eronder valt, moet alle energiebesparende maatregelen nemen die zich binnen vijf jaar terugverdienen, en daarover periodiek rapporteren. Onder de drempels geldt de plicht niet, maar kunnen andere verplichtingen, zoals labeleisen, nog steeds spelen.",
    sections: [
      { type: "kop", text: "Wanneer geldt de energiebesparingsplicht?" },
      {
        type: "paragraaf",
        text: "De plicht kijkt naar het energiegebruik per locatie (Wm-inrichting of gebouw), niet naar uw hele onderneming. Het gaat om het jaarlijkse gebruik: 50.000 kWh elektriciteit óf 25.000 m³ aardgas(equivalent) is genoeg om onder de plicht te vallen, het hoeft niet allebei.",
      },
      {
        type: "tabel",
        caption: "Drempels energiebesparingsplicht (RVO, gecontroleerd 20 juli 2026)",
        headers: ["Energiedrager", "Drempel per locatie per jaar", "Voorbeeld"],
        rows: [
          ["Elektriciteit", "50.000 kWh", "Middelgroot kantoor, supermarkt, werkplaats met machines"],
          ["Aardgas(equivalent)", "25.000 m³", "Pand met gasgestookte verwarming of proceswarmte"],
        ],
      },
      { type: "kop", text: "Wanneer geldt de plicht mogelijk niet?" },
      {
        type: "lijst",
        items: [
          "Uw locatie blijft duidelijk onder beide drempels.",
          "Voor bepaalde activiteiten gelden aparte regimes (bijvoorbeeld deelnemers aan het EU-emissiehandelssysteem voor het betreffende deel); controleer dit bij RVO.",
          "Let op: 'geen besparingsplicht' betekent niet 'geen verplichtingen', labeleisen staan er los van.",
        ],
      },
      { type: "kop", text: "Wat houdt de plicht concreet in?" },
      {
        type: "paragraaf",
        text: "U moet alle energiebesparende maatregelen nemen met een terugverdientijd van vijf jaar of korter. Om dat praktisch te maken bestaat de Erkende Maatregelenlijst (EML): een lijst per gebouwtype en activiteit met maatregelen waarvan de overheid heeft vastgesteld dat ze zich doorgaans binnen vijf jaar terugverdienen, denk aan ledverlichting, isolatie van leidingen en slimme regelingen.",
      },
      { type: "kop", text: "Welke gegevens heeft u nodig?" },
      {
        type: "lijst",
        items: [
          "Jaarlijks elektriciteitsgebruik in kWh (jaarafrekening of klantportaal).",
          "Jaarlijks gasgebruik in m³, of het equivalent bij andere warmtebronnen.",
          "Een beeld van al genomen maatregelen (verlichting, isolatie, installaties).",
        ],
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Controleer uw jaarverbruik op de meest recente jaarafrekening.",
          "Ligt u op of boven een drempel? Loop dan de EML voor uw situatie door.",
          "Plan de maatregelen die nog ontbreken en documenteer wat u al deed.",
          "Houd rekening met de informatieplicht: eens per vier jaar rapporteren bij RVO.",
        ],
      },
    ],
    faq: [
      {
        question: "Telt het verbruik van zonnepanelen mee?",
        answer:
          "Het gaat om het energiegebruik van de locatie. Eigen opwek verandert uw bruto gebruik niet automatisch; kijk in de actuele RVO-uitleg hoe eigen opwek in uw situatie meetelt voordat u conclusies trekt.",
      },
      {
        question: "Mijn verbruik schommelt rond de grens. Wat nu?",
        answer:
          "Gebruik meerdere jaren als referentie en documenteer uw cijfers. Ligt u structureel rond de drempel, behandel de plicht dan als waarschijnlijk relevant en bekijk de EML, veel maatregelen zijn sowieso rendabel.",
      },
    ],
    related: [
      "informatieplicht-energiebesparing-uitgelegd",
      "onderzoeksplicht-energiebesparing-uitgelegd",
      "energiejaarafrekening-lezen-voor-pandcheck",
    ],
    status: "published",
  },

  {
    slug: "informatieplicht-energiebesparing-uitgelegd",
    title: "Informatieplicht energiebesparing uitgelegd",
    description:
      "Wat is de informatieplicht energiebesparing, wie moet rapporteren, wanneer en hoe? Praktische uitleg voor ondernemers en pandeigenaren.",
    category: "Energiebesparing",
    searchIntent: "informatieplicht energiebesparing",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-information-duty", "rvo-energy-saving-duty", "rvo-eml"],
    relatedTool: {
      href: "/tools/energiebesparingsplicht-check",
      label: "Check of de plicht voor u geldt",
    },
    kortAntwoord:
      "De informatieplicht is de rapportageverplichting die hoort bij de energiebesparingsplicht. Locaties die jaarlijks 50.000 kWh elektriciteit of 25.000 m³ aardgas(equivalent) of meer gebruiken, rapporteren eens per vier jaar aan RVO welke energiebesparende maatregelen zij hebben genomen. De rapportage gaat via het eLoket van RVO.",
    sections: [
      { type: "kop", text: "Wat is de informatieplicht?" },
      {
        type: "paragraaf",
        text: "De energiebesparingsplicht verplicht u maatregelen te nemen; de informatieplicht verplicht u te laten zien wát u heeft gedaan. U rapporteert per locatie welke erkende maatregelen (EML) zijn uitgevoerd, welke niet en waarom. Zo kunnen gemeenten en omgevingsdiensten gerichter toezicht houden.",
      },
      { type: "kop", text: "Wie moet rapporteren: eigenaar of gebruiker?" },
      {
        type: "paragraaf",
        text: "De rapportage ligt bij degene op wie de energiebesparingsplicht rust, vaak de gebruiker van het pand (de drijver van de activiteit). Sinds de actualisering van de regels zijn er ook maatregelen die juist het gebouw betreffen en daarmee de eigenaar raken. Bij verhuurde panden is het verstandig om samen vast te leggen wie wat rapporteert.",
      },
      { type: "kop", text: "Wanneer moet u rapporteren?" },
      {
        type: "lijst",
        items: [
          "De rapportage geldt in een cyclus van vier jaar.",
          "Nieuw boven de drempel? Controleer bij RVO wanneer uw eerstvolgende rapportage moet zijn ingediend.",
          "Valt uw locatie onder de onderzoeksplicht, dan gelden aanvullende eisen; de rapportage verloopt dan (deels) via het onderzoek.",
        ],
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Stel vast of uw locatie boven een van de drempels zit (jaarafrekening).",
          "Loop de EML door en noteer per maatregel de status.",
          "Verzamel bewijsstukken (facturen, foto's, onderhoudsrapporten).",
          "Dien de rapportage in via het eLoket van RVO en bewaar een kopie.",
        ],
      },
    ],
    faq: [
      {
        question: "Is de informatieplicht hetzelfde als de onderzoeksplicht?",
        answer:
          "Nee. De informatieplicht is een rapportage over genomen EML-maatregelen en geldt vanaf de reguliere drempels. De onderzoeksplicht geldt voor zeer grote verbruikers (vanaf circa 10 miljoen kWh of 170.000 m³ gas) en vraagt een uitgebreider onderzoek met een uitvoeringsplan.",
      },
    ],
    related: [
      "energiebesparingsplicht-grenzen-uitzonderingen",
      "onderzoeksplicht-energiebesparing-uitgelegd",
      "eigenaar-of-huurder-wie-regelt-wat",
    ],
    status: "published",
  },

  {
    slug: "onderzoeksplicht-energiebesparing-uitgelegd",
    title: "Onderzoeksplicht energiebesparing uitgelegd",
    description:
      "De onderzoeksplicht voor grote energiegebruikers: drempels van 10 miljoen kWh en 170.000 m³, wat het onderzoek inhoudt en hoe u zich voorbereidt.",
    category: "Energiebesparing",
    searchIntent: "onderzoeksplicht energiebesparing",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-research-duty", "rvo-energy-saving-duty"],
    relatedTool: {
      href: "/tools/energiebesparingsplicht-check",
      label: "Check uw drempels",
    },
    kortAntwoord:
      "De onderzoeksplicht geldt voor locaties met een zeer groot energiegebruik, RVO noemt als drempels 10 miljoen kWh elektriciteit of 170.000 m³ aardgas(equivalent) per jaar, binnen relevante (milieubelastende) bedrijfstakken. Deze bedrijven doen eens per vier jaar een onderzoek naar alle kosteneffectieve besparings- en verduurzamingsmaatregelen en stellen een uitvoeringsplan op.",
    sections: [
      { type: "kop", text: "Voor wie geldt de onderzoeksplicht?" },
      {
        type: "paragraaf",
        text: "De onderzoeksplicht richt zich op grote energiegebruikers met milieubelastende activiteiten. Naast de verbruiksdrempel telt dus ook de aard van de activiteiten mee. Een kantooromgeving met hoog verbruik valt er niet automatisch onder; een productielocatie eerder wel. Controleer de precieze doelgroep in de actuele RVO-uitleg.",
      },
      {
        type: "tabel",
        caption: "Startdrempels onderzoeksplicht (RVO, gecontroleerd 20 juli 2026)",
        headers: ["Energiedrager", "Drempel per locatie per jaar"],
        rows: [
          ["Elektriciteit", "10.000.000 kWh (10 mln)"],
          ["Aardgas(equivalent)", "170.000 m³"],
        ],
      },
      { type: "kop", text: "Wat houdt het onderzoek in?" },
      {
        type: "lijst",
        items: [
          "Een inventarisatie van alle kosteneffectieve energiebesparende maatregelen, breder dan de standaard-EML.",
          "Een beoordeling van verduurzamingsmaatregelen (bijvoorbeeld elektrificatie of restwarmte).",
          "Een concreet uitvoeringsplan met planning.",
        ],
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Stel per locatie het jaarlijkse energiegebruik vast.",
          "Controleer bij RVO of uw activiteiten binnen de doelgroep vallen.",
          "Schakel tijdig een gespecialiseerd adviseur in; zo'n onderzoek kost doorlooptijd.",
          "Stem intern af wie het uitvoeringsplan draagt en budgetteert.",
        ],
      },
    ],
    faq: [
      {
        question: "Vervalt de informatieplicht als ik onderzoeksplichtig ben?",
        answer:
          "De rapportages hangen samen: wie onderzoeksplichtig is, rapporteert via het onderzoek. Hoe dit precies voor uw situatie uitpakt, staat in de actuele RVO-uitleg, neem dit mee in uw planning.",
      },
    ],
    related: [
      "energiebesparingsplicht-grenzen-uitzonderingen",
      "informatieplicht-energiebesparing-uitgelegd",
    ],
    status: "published",
  },

  {
    slug: "energielabel-c-kantoren-wanneer",
    title: "Energielabel C voor kantoren: wanneer geldt het?",
    description:
      "De label-C-plicht voor kantoorgebouwen uitgelegd: voor wie, welke uitzonderingen (100 m², 50%-regel, monumenten) en wat u moet doen bij label D of lager.",
    category: "Energielabel",
    searchIntent: "energielabel c kantoor verplicht uitzonderingen",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-office-label-c", "rvo-office-label-c-faq", "ep-online"],
    relatedTool: { href: "/tools/pandverplichtingencheck", label: "Check uw kantoorpand" },
    kortAntwoord:
      "Een kantoorgebouw in Nederland moet minimaal energielabel C hebben, of een primair fossiel energiegebruik van maximaal 225 kWh per m² per jaar. De plicht geldt niet voor kantoren waar de kantoorfunctie minder dan 50% van het oppervlak beslaat, voor kleine kantoorgebouwen onder de 100 m²-grens en voor monumenten. Bij label D of lager is actie nodig.",
    sections: [
      { type: "kop", text: "Wanneer geldt de label-C-plicht?" },
      {
        type: "paragraaf",
        text: "De plicht geldt voor gebouwen met een kantoorfunctie. Bepalend zijn het gebruiksoppervlak en de verhouding tussen kantoor- en nevenfuncties. Voldoet het gebouw niet, dan mag het volgens de regelgeving in principe niet als kantoor worden gebruikt, reden om dit serieus op te pakken.",
      },
      { type: "kop", text: "Wanneer geldt de plicht mogelijk niet?" },
      {
        type: "tabel",
        caption: "Belangrijkste uitzonderingen (RVO, gecontroleerd 20 juli 2026)",
        headers: ["Uitzondering", "Uitleg"],
        rows: [
          [
            "Kantooraandeel < 50%",
            "Beslaat de kantoorfunctie minder dan de helft van het gebruiksoppervlak van het gebouw, dan geldt de plicht meestal niet.",
          ],
          [
            "Klein kantoorgebouw",
            "Voor kleine kantoorgebouwen geldt een ondergrens rond 100 m² gebruiksoppervlak.",
          ],
          [
            "Monument",
            "Voor (rijks)monumenten geldt een uitzondering; controleer de exacte beschermde status.",
          ],
          [
            "Bijzondere gevallen",
            "O.a. gebouwen die binnen twee jaar worden gesloopt, getransformeerd of onteigend.",
          ],
        ],
      },
      { type: "kop", text: "Hoe controleert u uw label?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Zoek uw gebouw op in EP-Online (gratis, officieel).",
          "Controleer de labelklasse én de geldigheidsdatum, labels zijn 10 jaar geldig.",
          "Geen label of D of lager? Vraag een gecertificeerd adviseur om een opname en maatwerkadvies.",
        ],
      },
      { type: "kop", text: "Praktisch voorbeeld" },
      {
        type: "paragraaf",
        text: "Fictief voorbeeld: een bedrijfsverzamelgebouw van 800 m² heeft 500 m² kantoren en 300 m² opslag. De kantoorfunctie beslaat ruim 60% van het oppervlak en het gebouw is groter dan de 100 m²-grens: de label-C-plicht is dan waarschijnlijk van toepassing. Heeft het gebouw label E, dan is verbetering naar minimaal C nodig, vaak haalbaar met ledverlichting, isolatie en installatie-optimalisatie.",
      },
    ],
    faq: [
      {
        question: "Mijn kantoor heeft label C. Ben ik klaar?",
        answer:
          "Voor de minimumeis wel, zolang het label geldig en correct geregistreerd is. Houd de geldigheidsdatum in de gaten en bedenk dat een beter label (A/B) waarde kan toevoegen bij verhuur of verkoop.",
      },
      {
        question: "Wie handhaaft de label-C-plicht?",
        answer:
          "De gemeente is bevoegd gezag, vaak via de omgevingsdienst. Handhaving verschilt per gemeente, maar de plicht geldt landelijk.",
      },
    ],
    related: [
      "energielabel-utiliteitsgebouw-verkoop-verhuur",
      "welke-verplichtingen-gelden-voor-mijn-bedrijfspand",
      "eigenaar-of-huurder-wie-regelt-wat",
    ],
    status: "published",
  },

  {
    slug: "energielabel-utiliteitsgebouw-verkoop-verhuur",
    title: "Energielabel voor utiliteitsgebouwen bij verkoop, verhuur en oplevering",
    description:
      "Wanneer is een energielabel verplicht voor een bedrijfspand? De regels bij verkoop, nieuwe verhuur en oplevering van utiliteitsgebouwen, met uitzonderingen.",
    category: "Energielabel",
    searchIntent: "energielabel bedrijfspand verplicht verkoop verhuur",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["government-utility-label", "rvo-utility-label", "ep-online"],
    relatedTool: { href: "/tools/pandverplichtingencheck", label: "Check uw pand" },
    kortAntwoord:
      "Bij verkoop, nieuwe verhuur of oplevering van een utiliteitsgebouw (zoals een kantoor, winkel of bedrijfshal met verblijfsfunctie) is een geldig, geregistreerd energielabel verplicht. Het label is tien jaar geldig. Uitzonderingen gelden onder meer voor monumenten en voor bepaalde gebouwtypen zonder verblijfsfunctie, zoals onverwarmde opslagloodsen.",
    sections: [
      { type: "kop", text: "Wanneer is het label verplicht?" },
      {
        type: "lijst",
        items: [
          "Bij verkoop van het gebouw: de verkoper moet een geldig label overleggen.",
          "Bij nieuwe verhuur: de verhuurder verstrekt het label aan de nieuwe huurder.",
          "Bij oplevering van nieuwbouw: het label hoort bij de oplevering.",
        ],
      },
      { type: "kop", text: "Wanneer geldt de plicht mogelijk niet?" },
      {
        type: "lijst",
        items: [
          "Beschermde monumenten (controleer de exacte status).",
          "Gebouwen zonder verblijfsfunctie, zoals onverwarmde opslag of bepaalde industriehallen.",
          "Tijdelijke bouwwerken en enkele bijzondere categorieën, zoals gebouwen voor religieuze activiteiten.",
        ],
      },
      { type: "kop", text: "Welke gegevens heeft u nodig?" },
      {
        type: "lijst",
        items: [
          "De huidige labelstatus van het gebouw (check EP-Online).",
          "De geldigheidsdatum van een bestaand label.",
          "Bij een nieuw label: gebouwgegevens voor de opname door een gecertificeerd adviseur.",
        ],
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Controleer in EP-Online of er een geldig label is geregistreerd.",
          "Plan bij een verlopen of ontbrekend label tijdig een labelopname, ruim vóór de transactie.",
          "Vermeld de labelklasse in verkoop- of verhuurinformatie waar dat vereist is.",
        ],
      },
    ],
    faq: [
      {
        question: "Hoe lang is een energielabel geldig?",
        answer:
          "Tien jaar na registratie. Verbetert u het gebouw ingrijpend, dan kan een nieuw label voordelig zijn omdat het de betere prestatie laat zien.",
      },
      {
        question: "Is dit dezelfde plicht als energielabel C voor kantoren?",
        answer:
          "Nee. De labelplicht bij transactie vraagt om een géldig label op het transactiemoment; de label-C-plicht stelt daarnaast een minimumklasse (C) voor kantoorgebouwen, los van een transactie.",
      },
    ],
    related: [
      "energielabel-c-kantoren-wanneer",
      "welke-verplichtingen-gelden-voor-mijn-bedrijfspand",
    ],
    status: "published",
  },

  {
    slug: "eigenaar-of-huurder-wie-regelt-wat",
    title: "Eigenaar of huurder: wie moet wat regelen?",
    description:
      "Wie is verantwoordelijk voor de energiebesparingsplicht, de informatieplicht en het energielabel: de eigenaar of de huurder van een bedrijfspand?",
    category: "Verplichtingen",
    searchIntent: "verplichtingen eigenaar versus huurder bedrijfspand",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: [
      "rvo-energy-saving-duty",
      "rvo-information-duty",
      "rvo-office-label-c",
      "government-utility-label",
    ],
    relatedTool: { href: "/pandcheck", label: "Doe de PandCheck" },
    kortAntwoord:
      "De rolverdeling verschilt per verplichting. De energiebesparingsplicht en informatieplicht liggen in beginsel bij degene die de activiteit op de locatie uitvoert, vaak de huurder, maar gebouwgebonden maatregelen raken de eigenaar. De label-C-plicht en het label bij verkoop of verhuur zijn gebouwgebonden en liggen primair bij de eigenaar. Goede afspraken in het huurcontract voorkomen discussie.",
    sections: [
      { type: "kop", text: "Hoe zit de verdeling per verplichting?" },
      {
        type: "tabel",
        caption: "Indicatieve rolverdeling eigenaar/huurder (gecontroleerd 20 juli 2026)",
        headers: ["Verplichting", "Primair aan zet", "Nuance"],
        rows: [
          [
            "Energiebesparingsplicht",
            "Gebruiker (drijver van de activiteit)",
            "Gebouwmaatregelen (isolatie, installaties) raken de eigenaar; sinds de actualisering kent de regelgeving ook een rol voor de eigenaar",
          ],
          [
            "Informatieplicht",
            "Degene op wie de besparingsplicht rust",
            "Bij verhuur: leg vast wie rapporteert, dubbel of niet rapporteren wilt u voorkomen",
          ],
          [
            "Energielabel C kantoren",
            "Eigenaar",
            "Huurder ondervindt de gevolgen als het gebouw niet voldoet; investeringen vragen vaak afstemming",
          ],
          [
            "Label bij verkoop/verhuur",
            "Eigenaar/verkoper/verhuurder",
            "Het label moet er zijn op het transactiemoment",
          ],
        ],
      },
      { type: "kop", text: "Waarom lopen eigenaar en huurder hier vaak vast?" },
      {
        type: "paragraaf",
        text: "De klassieke splitsing: de eigenaar betaalt gebouwinvesteringen, de huurder plukt de vruchten via een lagere energierekening (de zogenoemde split incentive). Zonder afspraken blijft rendabele verduurzaming dan liggen. Steeds vaker worden investeringen en besparingen daarom contractueel gedeeld, bijvoorbeeld via een groene-huurclausule.",
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Breng samen in kaart welke verplichtingen op het pand en op het gebruik rusten.",
          "Leg in het huurcontract of een addendum vast wie welke maatregelen neemt en wie rapporteert.",
          "Deel meetdata (verbruik, label) met elkaar; beide partijen hebben die nodig.",
          "Doe bij twijfel de PandCheck en bespreek de uitkomst gezamenlijk.",
        ],
      },
    ],
    faq: [
      {
        question: "Kan de huurder verplicht worden mee te betalen aan label C?",
        answer:
          "Dat hangt af van het huurcontract. De wettelijke plicht ligt bij het gebouw (eigenaar), maar contractuele afspraken over doorbelasting of huuraanpassing zijn mogelijk. Laat afspraken juridisch toetsen; PandPlicht geeft hierover geen bindend advies.",
      },
    ],
    related: [
      "welke-verplichtingen-gelden-voor-mijn-bedrijfspand",
      "energiebesparingsplicht-grenzen-uitzonderingen",
      "energielabel-c-kantoren-wanneer",
    ],
    status: "published",
  },
];
