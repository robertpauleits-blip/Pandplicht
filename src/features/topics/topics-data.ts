import { THRESHOLDS } from "@/rules/version";

const fmt = (n: number) => n.toLocaleString("nl-NL");

export type TopicPageData = {
  path: string;
  breadcrumb: { name: string; path: string }[];
  title: string;
  metaTitle: string;
  description: string;
  kortAntwoord: string;
  /** Feiten op een rij — gegenereerd uit dezelfde drempeldata als de rule engine. */
  feiten: { onderdeel: string; uitleg: string }[];
  wanneerGeldt: string[];
  wanneerNiet: string[];
  gegevensNodig: string[];
  verantwoordelijk: string;
  watNuDoen: string[];
  sourceIds: string[];
  toolHref: string;
  toolLabel: string;
  artikelSlugs: string[];
};

const CHECKED = "20 juli 2026";

export const TOPIC_PAGES: TopicPageData[] = [
  {
    path: "/verplichtingen/energiebesparingsplicht",
    breadcrumb: [
      { name: "Verplichtingen", path: "/verplichtingen" },
      { name: "Energiebesparingsplicht", path: "/verplichtingen/energiebesparingsplicht" },
    ],
    title: "Energiebesparingsplicht",
    metaTitle: "Energiebesparingsplicht: drempels en uitleg",
    description:
      "Wanneer geldt de energiebesparingsplicht voor uw bedrijfspand? De drempels van 50.000 kWh en 25.000 m³ aardgas uitgelegd, met vervolgstappen en bronnen.",
    kortAntwoord: `De energiebesparingsplicht geldt voor Nederlandse bedrijfslocaties die per jaar ${fmt(THRESHOLDS.besparingsplichtKwh)} kWh elektriciteit of ${fmt(THRESHOLDS.besparingsplichtGasM3)} m³ aardgas(equivalent) of meer gebruiken. Wie eronder valt, moet alle energiebesparende maatregelen met een terugverdientijd van vijf jaar of korter uitvoeren en daarover periodiek rapporteren.`,
    feiten: [
      {
        onderdeel: "Hoofdgrens energiegebruik",
        uitleg: `${fmt(THRESHOLDS.besparingsplichtKwh)} kWh elektriciteit of ${fmt(THRESHOLDS.besparingsplichtGasM3)} m³ aardgas(equivalent) per locatie per jaar, onder voorbehoud van actuele toepassingsvoorwaarden`,
      },
      {
        onderdeel: "Kern van de plicht",
        uitleg: "Alle maatregelen met een terugverdientijd van 5 jaar of korter nemen (zie de Erkende Maatregelenlijst)",
      },
      {
        onderdeel: "Rapportage",
        uitleg: "Informatie- en/of onderzoeksplicht kan eens per vier jaar gelden",
      },
    ],
    wanneerGeldt: [
      `Uw locatie gebruikt jaarlijks ${fmt(THRESHOLDS.besparingsplichtKwh)} kWh elektriciteit of meer.`,
      `Of uw locatie gebruikt jaarlijks ${fmt(THRESHOLDS.besparingsplichtGasM3)} m³ aardgas(equivalent) of meer.`,
      "Eén van de twee drempels is voldoende; het hoeft niet allebei.",
    ],
    wanneerNiet: [
      "Uw locatie blijft duidelijk onder beide drempels.",
      "Voor bepaalde activiteiten gelden aparte regimes (bijvoorbeeld EU-ETS voor het betreffende deel).",
      "Let op: andere verplichtingen, zoals labeleisen, staan hier los van.",
    ],
    gegevensNodig: [
      "Jaarlijks elektriciteitsgebruik in kWh (jaarafrekening).",
      "Jaarlijks gasgebruik in m³ of het equivalent daarvan.",
      "Overzicht van al genomen besparingsmaatregelen.",
    ],
    verantwoordelijk:
      "In beginsel degene die de activiteit op de locatie uitvoert — vaak de gebruiker/huurder. Gebouwgebonden maatregelen raken de eigenaar; leg de verdeling bij verhuur samen vast.",
    watNuDoen: [
      "Controleer uw jaarverbruik op de meest recente jaarafrekening.",
      "Loop bij (mogelijke) toepasselijkheid de Erkende Maatregelenlijst (EML) door.",
      "Plan ontbrekende maatregelen en documenteer wat u al deed.",
      "Houd rekening met de rapportage via de informatieplicht.",
    ],
    sourceIds: ["rvo-energy-saving-duty", "rvo-eml", "rvo-information-duty"],
    toolHref: "/tools/energiebesparingsplicht-check",
    toolLabel: "Doe de energiebesparingsplichtcheck",
    artikelSlugs: [
      "energiebesparingsplicht-grenzen-uitzonderingen",
      "informatieplicht-energiebesparing-uitgelegd",
      "energiejaarafrekening-lezen-voor-pandcheck",
    ],
  },
  {
    path: "/verplichtingen/informatieplicht-energiebesparing",
    breadcrumb: [
      { name: "Verplichtingen", path: "/verplichtingen" },
      {
        name: "Informatieplicht",
        path: "/verplichtingen/informatieplicht-energiebesparing",
      },
    ],
    title: "Informatieplicht energiebesparing",
    metaTitle: "Informatieplicht energiebesparing: wie rapporteert wat?",
    description:
      "De informatieplicht energiebesparing: wie moet eens per vier jaar rapporteren bij RVO, wat rapporteert u en hoe bereidt u zich voor?",
    kortAntwoord:
      "De informatieplicht is de rapportageverplichting die bij de energiebesparingsplicht hoort. Valt uw locatie boven de verbruiksdrempels, dan rapporteert u eens per vier jaar via het eLoket van RVO welke erkende maatregelen (EML) zijn uitgevoerd. Grote verbruikers met een onderzoeksplicht rapporteren via hun onderzoek.",
    feiten: [
      {
        onderdeel: "Rapportagefrequentie",
        uitleg: "Eens per vier jaar, via het eLoket van RVO",
      },
      {
        onderdeel: "Gekoppeld aan",
        uitleg: `De energiebesparingsplicht (drempels ${fmt(THRESHOLDS.besparingsplichtKwh)} kWh / ${fmt(THRESHOLDS.besparingsplichtGasM3)} m³ per jaar)`,
      },
      {
        onderdeel: "Inhoud rapportage",
        uitleg: "Per erkende maatregel (EML): uitgevoerd, niet uitgevoerd, of alternatief",
      },
    ],
    wanneerGeldt: [
      "Uw locatie valt onder de energiebesparingsplicht.",
      "Er is geen (volledige) vrijstelling via een ander regime van toepassing.",
    ],
    wanneerNiet: [
      "Uw locatie blijft onder beide verbruiksdrempels.",
      "Uw locatie valt onder de onderzoeksplicht; dan verloopt rapportage via het onderzoek — controleer de details bij RVO.",
    ],
    gegevensNodig: [
      "Jaarverbruik elektriciteit en gas.",
      "Status van de erkende maatregelen voor uw bedrijfstak.",
      "Bewijsstukken zoals facturen en onderhoudsrapporten.",
    ],
    verantwoordelijk:
      "Degene op wie de energiebesparingsplicht rust — vaak de gebruiker. Spreek bij verhuur af wie rapporteert, zodat er niet dubbel of juist niet wordt gerapporteerd.",
    watNuDoen: [
      "Stel vast of uw locatie boven een drempel zit.",
      "Inventariseer de EML-maatregelen en hun status.",
      "Controleer bij RVO wanneer de eerstvolgende rapportageronde is.",
      "Dien de rapportage in en bewaar een kopie.",
    ],
    sourceIds: ["rvo-information-duty", "rvo-energy-saving-duty", "rvo-eml"],
    toolHref: "/tools/energiebesparingsplicht-check",
    toolLabel: "Check of de plicht voor u geldt",
    artikelSlugs: [
      "informatieplicht-energiebesparing-uitgelegd",
      "eigenaar-of-huurder-wie-regelt-wat",
    ],
  },
  {
    path: "/verplichtingen/onderzoeksplicht-energiebesparing",
    breadcrumb: [
      { name: "Verplichtingen", path: "/verplichtingen" },
      {
        name: "Onderzoeksplicht",
        path: "/verplichtingen/onderzoeksplicht-energiebesparing",
      },
    ],
    title: "Onderzoeksplicht energiebesparing",
    metaTitle: "Onderzoeksplicht energiebesparing voor grootverbruikers",
    description:
      "De onderzoeksplicht voor grote energiegebruikers: drempels van 10 miljoen kWh en 170.000 m³, wat het onderzoek inhoudt en hoe u zich voorbereidt.",
    kortAntwoord: `De onderzoeksplicht geldt voor locaties met milieubelastende activiteiten die jaarlijks ${fmt(THRESHOLDS.onderzoeksplichtKwh)} kWh elektriciteit of ${fmt(THRESHOLDS.onderzoeksplichtGasM3)} m³ aardgas(equivalent) of meer gebruiken. Zij onderzoeken eens per vier jaar alle kosteneffectieve besparings- en verduurzamingsmaatregelen en stellen een uitvoeringsplan op.`,
    feiten: [
      {
        onderdeel: "Drempels",
        uitleg: `${fmt(THRESHOLDS.onderzoeksplichtKwh)} kWh elektriciteit of ${fmt(THRESHOLDS.onderzoeksplichtGasM3)} m³ aardgas(equivalent) per locatie per jaar, voor relevante bedrijfstakken`,
      },
      {
        onderdeel: "Inhoud",
        uitleg: "Onderzoek naar kosteneffectieve maatregelen plus een uitvoeringsplan",
      },
      { onderdeel: "Frequentie", uitleg: "Eens per vier jaar" },
    ],
    wanneerGeldt: [
      "Uw locatie overschrijdt een van de drempels én uw activiteiten vallen binnen de doelgroep (milieubelastende activiteiten).",
    ],
    wanneerNiet: [
      "Uw verbruik ligt duidelijk onder beide drempels.",
      "Uw activiteiten vallen buiten de doelgroep — controleer dit bij RVO; een hoog verbruik alleen is niet doorslaggevend.",
    ],
    gegevensNodig: [
      "Jaarverbruik per locatie (elektriciteit en gas).",
      "De aard van de activiteiten op de locatie.",
      "Eerdere onderzoeken of energieaudits.",
    ],
    verantwoordelijk:
      "Het bedrijf dat de activiteit uitvoert. Door de omvang van het onderzoek is een gespecialiseerd adviseur vrijwel altijd nodig.",
    watNuDoen: [
      "Toets uw verbruik aan de drempels.",
      "Controleer de doelgroep-omschrijving bij RVO.",
      "Plan het onderzoek tijdig in met een specialist.",
    ],
    sourceIds: ["rvo-research-duty", "rvo-energy-saving-duty"],
    toolHref: "/tools/energiebesparingsplicht-check",
    toolLabel: "Check uw drempels",
    artikelSlugs: [
      "onderzoeksplicht-energiebesparing-uitgelegd",
      "energiebesparingsplicht-grenzen-uitzonderingen",
    ],
  },
  {
    path: "/verplichtingen/energielabel-c-kantoren",
    breadcrumb: [
      { name: "Verplichtingen", path: "/verplichtingen" },
      { name: "Energielabel C kantoren", path: "/verplichtingen/energielabel-c-kantoren" },
    ],
    title: "Energielabel C voor kantoren",
    metaTitle: "Energielabel C kantoren: plicht en uitzonderingen",
    description:
      "Kantoorgebouwen moeten minimaal energielabel C hebben. Voor wie geldt het, welke uitzonderingen zijn er (100 m², 50%-regel, monument) en wat doet u bij label D of lager?",
    kortAntwoord: `Een kantoorgebouw moet minimaal energielabel C hebben, of een primair fossiel energiegebruik van maximaal 225 kWh per m² per jaar. Uitzonderingen gelden onder meer wanneer de kantoorfunctie minder dan 50% van het gebruiksoppervlak beslaat, voor kleine kantoorgebouwen onder de ${THRESHOLDS.kantoorLabelMinM2} m²-grens en voor monumenten.`,
    feiten: [
      {
        onderdeel: "Kantoorlabel",
        uitleg: "Een onder de plicht vallend kantoor moet minimaal label C of de equivalente energieprestatie (max. 225 kWh/m² per jaar primair fossiel) hebben",
      },
      {
        onderdeel: "Kleine gebouwen",
        uitleg: `Uitzondering voor kantoorgebouwen onder de relevante ${THRESHOLDS.kantoorLabelMinM2} m²-grens`,
      },
      {
        onderdeel: "50%-regel",
        uitleg: "Beslaat het kantoordeel minder dan 50% van het gebruiksoppervlak, dan geldt de plicht meestal niet",
      },
    ],
    wanneerGeldt: [
      "Het gebouw heeft (overwegend) een kantoorfunctie.",
      `Het gebruiksoppervlak ligt boven de ${THRESHOLDS.kantoorLabelMinM2} m²-grens.`,
      "Er is geen uitzondering (monument, sloop/transformatie binnen twee jaar) van toepassing.",
    ],
    wanneerNiet: [
      "Kantooraandeel kleiner dan 50% van het gebruiksoppervlak.",
      `Klein kantoorgebouw onder de ${THRESHOLDS.kantoorLabelMinM2} m²-grens.`,
      "Monumentstatus (controleer de precieze beschermde status).",
    ],
    gegevensNodig: [
      "Huidig label en geldigheid (EP-Online).",
      "Gebruiksoppervlak en aandeel kantoorfunctie.",
      "Monumentstatus.",
    ],
    verantwoordelijk:
      "De plicht is gebouwgebonden en ligt primair bij de eigenaar. Huurders ondervinden de gevolgen en investeringen vragen vaak gezamenlijke afspraken.",
    watNuDoen: [
      "Zoek het gebouw op in EP-Online.",
      "Bij label D of lager: vraag een maatwerkadvies aan.",
      "Bij geen label: laat een gecertificeerd adviseur een label opstellen.",
    ],
    sourceIds: ["rvo-office-label-c", "rvo-office-label-c-faq", "ep-online"],
    toolHref: "/tools/pandverplichtingencheck",
    toolLabel: "Check uw kantoorpand",
    artikelSlugs: [
      "energielabel-c-kantoren-wanneer",
      "energielabel-utiliteitsgebouw-verkoop-verhuur",
    ],
  },
  {
    path: "/verplichtingen/energielabel-utiliteitsgebouw",
    breadcrumb: [
      { name: "Verplichtingen", path: "/verplichtingen" },
      {
        name: "Energielabel utiliteitsgebouw",
        path: "/verplichtingen/energielabel-utiliteitsgebouw",
      },
    ],
    title: "Energielabel bij verkoop, verhuur of oplevering",
    metaTitle: "Energielabel utiliteitsgebouw bij verkoop en verhuur",
    description:
      "Bij verkoop, nieuwe verhuur of oplevering van een utiliteitsgebouw is een geldig energielabel verplicht. De regels en uitzonderingen op een rij.",
    kortAntwoord:
      "Bij verkoop, nieuwe verhuur of oplevering van een utiliteitsgebouw is in de regel een geldig, geregistreerd energielabel verplicht. Het label is tien jaar geldig. Uitzonderingen gelden onder meer voor monumenten en gebouwen zonder verblijfsfunctie, zoals onverwarmde opslag.",
    feiten: [
      {
        onderdeel: "Transactiemomenten",
        uitleg: "Verkoop, nieuwe verhuur en oplevering vragen een geldig label",
      },
      { onderdeel: "Geldigheid", uitleg: "Een energielabel is 10 jaar geldig" },
      {
        onderdeel: "Registratie",
        uitleg: "Alleen labels in EP-Online tellen; controleer registratie en datum",
      },
    ],
    wanneerGeldt: [
      "U verkoopt het gebouw, sluit een nieuw huurcontract of levert nieuwbouw op.",
      "Het gebouw is een utiliteitsgebouw met verblijfsfunctie.",
    ],
    wanneerNiet: [
      "Er speelt geen transactie (maar regel het label tijdig vóór een toekomstige).",
      "Het gebouw valt onder een uitzondering (monument, geen verblijfsfunctie, tijdelijk bouwwerk).",
    ],
    gegevensNodig: [
      "Labelstatus en geldigheidsdatum in EP-Online.",
      "Type transactie en planning.",
      "Gebouwfunctie.",
    ],
    verantwoordelijk:
      "De verkoper, verhuurder of opleverende partij — in de praktijk de eigenaar.",
    watNuDoen: [
      "Controleer het label in EP-Online.",
      "Plan bij een ontbrekend of verlopen label tijdig een labelopname.",
      "Vermeld de labelklasse waar dat vereist is in transactiedocumentatie.",
    ],
    sourceIds: ["government-utility-label", "rvo-utility-label", "ep-online"],
    toolHref: "/tools/pandverplichtingencheck",
    toolLabel: "Check uw pand",
    artikelSlugs: [
      "energielabel-utiliteitsgebouw-verkoop-verhuur",
      "energielabel-c-kantoren-wanneer",
    ],
  },
  {
    path: "/verplichtingen/batterij-registreren",
    breadcrumb: [
      { name: "Verplichtingen", path: "/verplichtingen" },
      { name: "Batterij registreren", path: "/verplichtingen/batterij-registreren" },
    ],
    title: "Batterijsysteem registreren",
    metaTitle: "Zakelijke batterij registreren: de regels",
    description:
      "Netgekoppelde batterijsystemen moeten vanaf een bepaald vermogen worden geregistreerd. Wat de registratie inhoudt en hoe u het regelt.",
    kortAntwoord: `Netgekoppelde batterijsystemen moeten vanaf een vermogensgrens worden geregistreerd; RVO noemt momenteel ${THRESHOLDS.batterijRegistratieKw} kW — praktisch elke zakelijke batterij valt daaronder. De registratie helpt netbeheerders het net veilig te beheren. Controleer de actuele grens en route bij RVO vóór ingebruikname.`,
    feiten: [
      {
        onderdeel: "Vermogensgrens",
        uitleg: `Registratie vanaf ${THRESHOLDS.batterijRegistratieKw} kW (actuele RVO-waarde; controleer vóór ingebruikname)`,
      },
      {
        onderdeel: "Doel",
        uitleg: "Zicht voor netbeheerders op installaties die het net beïnvloeden",
      },
    ],
    wanneerGeldt: [
      "Uw batterijsysteem is netgekoppeld en heeft een vermogen op of boven de actuele grens.",
      "Ook bestaande, nog niet geregistreerde systemen vallen eronder.",
    ],
    wanneerNiet: [
      "Volledig autonome (niet netgekoppelde) systemen kunnen afwijken — controleer de actuele uitleg.",
    ],
    gegevensNodig: [
      "Vermogen (kW) en capaciteit (kWh) van het systeem.",
      "Locatie- en aansluitgegevens.",
    ],
    verantwoordelijk:
      "De eigenaar van het systeem; spreek met uw installateur af wie de registratie feitelijk uitvoert.",
    watNuDoen: [
      "Controleer de actuele registratie-uitleg bij RVO.",
      "Leg de registratietaak vast in de installatieopdracht.",
      "Bewaar de bevestiging bij uw installatiedossier.",
    ],
    sourceIds: ["rvo-battery-register", "rvo-battery-investment"],
    toolHref: "/tools/zakelijke-batterijscan",
    toolLabel: "Doe de batterijscan",
    artikelSlugs: ["zakelijke-batterij-registreren", "zakelijke-batterij-onderzoeken-waard"],
  },
];

export function getTopicPage(path: string): TopicPageData | undefined {
  return TOPIC_PAGES.find((t) => t.path === path);
}

export const FEITEN_CHECKED_LABEL = `Bron gecontroleerd op ${CHECKED}`;
