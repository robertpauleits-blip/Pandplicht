import type { Article } from "../types";

const D = "2026-07-20";

export const ARTIKELEN_BATTERIJ: Article[] = [
  {
    slug: "zakelijke-batterij-onderzoeken-waard",
    title: "Wanneer is een zakelijke batterij het onderzoeken waard?",
    description:
      "Vijf signalen dat batterijonderzoek zinvol kan zijn voor uw bedrijf — en drie situaties waarin een batterij juist niet de eerste stap is.",
    category: "Zakelijke batterij",
    searchIntent: "zakelijke batterij rendabel wanneer interessant",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-battery-investment", "rvo-grid-guide"],
    relatedTool: { href: "/tools/zakelijke-batterijscan", label: "Doe de batterijscan" },
    kortAntwoord:
      "Batterijonderzoek is het overwegen waard wanneer minstens één van deze signalen speelt: een net- of uitbreidingsknelpunt, hoge kwartierpieken (peak shaving), structureel zonne-overschot, flexibiliteit in uw bedrijfsprofiel of een concreet economisch doel met een horizon van vijf jaar of langer. Zonder kwartierdata is geen serieuze batterijberekening mogelijk — verzamel die dus eerst.",
    sections: [
      { type: "kop", text: "Vijf signalen dat onderzoek zinvol kan zijn" },
      {
        type: "lijst",
        items: [
          "Uw netbeheerder heeft beperkingen gemeld of u wacht op een (zwaardere) aansluiting.",
          "Uw kwartierpieken liggen ver boven uw gemiddelde verbruik — de klassieke peak-shaving-casus.",
          "U levert structureel veel zonnestroom terug, zeker als teruglevering wordt begrensd of slecht wordt vergoed.",
          "Uw bedrijfsvoering is flexibel: laden en ontladen kan zonder het primaire proces te verstoren.",
          "U heeft een concreet doel (pieken, eigen gebruik, uitbreiding) en een investeringshorizon van 5+ jaar.",
        ],
      },
      { type: "kop", text: "Drie situaties waarin een batterij niet de eerste stap is" },
      {
        type: "lijst",
        items: [
          "U kent uw kwartierdata niet: dan is elke dimensionering en elk rendement giswerk.",
          "Uw pieken zijn met gedrag of planning te verlagen: dat is vrijwel altijd goedkoper dan opslag.",
          "Uw enige doel is noodstroom: daarvoor bestaan gerichtere oplossingen (UPS/noodstroomvoorziening).",
        ],
      },
      { type: "kop", text: "Waarom geven wij geen terugverdientijd?" },
      {
        type: "paragraaf",
        text: "Het rendement van een zakelijke batterij hangt af van uw werkelijke kwartierprofiel, uw contract, energieprijzen en de inzetstrategie. Een ROI op basis van alleen jaarverbruik is schijnzekerheid — die geven wij bewust niet. Onze batterijscan geeft een transparante onderzoeksscore die zegt of de vólgende stap (meten en laten doorrekenen) zinvol lijkt.",
      },
      { type: "kop", text: "Wat moet u nu doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Bepaal uw hoofddoel: peak shaving, eigen gebruik van zon, uitbreiding, handel of noodstroom.",
          "Exporteer minimaal 12 maanden kwartierdata bij uw meetbedrijf of netbeheerder.",
          "Doe de batterijscan voor een eerste indicatie.",
          "Laat bij een positief beeld een specialist dimensioneren op basis van uw data.",
        ],
      },
    ],
    faq: [
      {
        question: "Kan een zakelijke batterij netcongestie oplossen?",
        answer:
          "Voor uw eigen situatie kan een batterij knelpunten verzachten: pieken afvlakken bij afnamecongestie of overschot bufferen bij invoedingscongestie. De congestie in de regio lost hij niet op, en de businesscase moet per locatie worden doorgerekend.",
      },
    ],
    related: [
      "peak-shaving-met-zakelijke-batterij",
      "kwartierdata-batterijberekening",
      "zakelijke-batterij-registreren",
    ],
    status: "published",
  },

  {
    slug: "peak-shaving-met-zakelijke-batterij",
    title: "Peak shaving met een zakelijke batterij",
    description:
      "Hoe peak shaving werkt, wanneer het interessant is en welke gegevens u nodig heeft om te bepalen of een batterij uw vermogenspieken kan afvlakken.",
    category: "Zakelijke batterij",
    searchIntent: "batterij voor peak shaving",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-battery-investment", "rvo-grid-guide"],
    relatedTool: { href: "/tools/zakelijke-batterijscan", label: "Doe de batterijscan" },
    kortAntwoord:
      "Peak shaving betekent het afvlakken van uw hoogste vermogenspieken: een batterij ontlaadt op piekmomenten, zodat u minder gecontracteerd transportvermogen nodig heeft en binnen uw aansluiting blijft. Het is interessant wanneer korte, hoge pieken uw kosten of netcapaciteit bepalen. Of het werkt, blijkt uitsluitend uit uw kwartierdata: de hoogte, duur en frequentie van de pieken bepalen de batterijgrootte.",
    sections: [
      { type: "kop", text: "Hoe werkt peak shaving?" },
      {
        type: "paragraaf",
        text: "Grootverbruikers betalen mee aan het net op basis van hun hoogste kwartierpiek en hun gecontracteerd vermogen. Eén korte piek — bijvoorbeeld als machines gelijktijdig starten — kan zo onevenredig veel kosten of zelfs uw aansluitcapaciteit overschrijden. Een batterij levert op precies die momenten bij, waardoor de piek richting het net lager uitvalt.",
      },
      { type: "kop", text: "Wanneer is peak shaving interessant?" },
      {
        type: "lijst",
        items: [
          "Uw pieken zijn kort en voorspelbaar (starten van processen, laden van voertuigen).",
          "Het verschil tussen piek en gemiddelde is groot — een vlakke afname valt weinig te 'shaven'.",
          "U zit tegen uw gecontracteerd of fysiek aansluitvermogen aan en verzwaren kan niet of is duur.",
        ],
      },
      { type: "kop", text: "Een rekenvoorbeeld (fictief, met aannames)" },
      {
        type: "paragraaf",
        text: "Fictief voorbeeld: een productiebedrijf heeft een gemiddelde afname van 60 kW, maar kwartierpieken tot 140 kW doordat twee lijnen tegelijk opstarten. Als 30 kW van die piek gedurende maximaal een uur moet worden opgevangen, is indicatief een batterij nodig die 30 kW kan leveren met circa 30 kWh bruikbare capaciteit. Aannames: pieken overlappen niet, de batterij is op piekmomenten vol en de ontlaaddiepte is beperkt. Dit voorbeeld toont de denkwijze — geen advies; de werkelijke dimensionering vraagt kwartierdata en een specialist.",
      },
      { type: "kop", text: "Welke gegevens heeft u nodig?" },
      {
        type: "lijst",
        items: [
          "Minimaal 12 maanden kwartierdata (kWh per 15 minuten).",
          "Uw gecontracteerd transportvermogen en aansluitwaarde.",
          "Inzicht in wat de pieken veroorzaakt en of ze planbaar zijn.",
        ],
      },
    ],
    faq: [
      {
        question: "Kan ik pieken ook zonder batterij verlagen?",
        answer:
          "Vaak wel — en goedkoper. Machines gefaseerd starten, laadsessies spreiden of processen verschuiven verlaagt pieken zonder investering in opslag. Bekijk dat altijd eerst.",
      },
    ],
    related: [
      "zakelijke-batterij-onderzoeken-waard",
      "kwartierdata-batterijberekening",
      "oplossingen-volle-aansluiting-ondernemer",
    ],
    status: "published",
  },

  {
    slug: "kwartierdata-batterijberekening",
    title: "Welke kwartierdata zijn nodig voor een batterijberekening?",
    description:
      "Welke meetdata heeft een specialist nodig om een zakelijke batterij te dimensioneren? Kwartierdata uitgelegd: wat het is, waar u het opvraagt en waar u op let.",
    category: "Zakelijke batterij",
    searchIntent: "kwartierdata batterij berekenen",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-battery-investment"],
    relatedTool: { href: "/tools/zakelijke-batterijscan", label: "Doe de batterijscan" },
    kortAntwoord:
      "Voor een serieuze batterijberekening zijn minimaal twaalf maanden kwartierdata nodig: uw afname (en bij zonnepanelen ook uw invoeding) in kWh per kwartier. Grootverbruikers kunnen deze data opvragen bij hun meetverantwoordelijke of via het klantportaal van de netbeheerder. Jaarcijfers of maandtotalen zijn onvoldoende: juist de pieken en patronen binnen een dag bepalen de batterijgrootte.",
    sections: [
      { type: "kop", text: "Wat zijn kwartierdata?" },
      {
        type: "paragraaf",
        text: "Kwartierdata (ook wel kwartierwaarden of interval-data) zijn meetwaarden van uw elektriciteitsafname per 15 minuten. Grootverbruikaansluitingen (> 3×80 A) worden standaard zo bemeten. Voor kleinverbruik kan een slimme meter dag- of kwartierdata leveren, afhankelijk van uitlezing.",
      },
      { type: "kop", text: "Welke dataset heeft een specialist nodig?" },
      {
        type: "tabel",
        caption: "Checklist meetdata voor batterijdimensionering",
        headers: ["Gegeven", "Waarom nodig"],
        rows: [
          ["12 maanden afname per kwartier (kWh)", "Seizoenspatronen en piekfrequentie zichtbaar maken"],
          ["Invoeding per kwartier (bij zon)", "Overschotmomenten en curtailment bepalen"],
          ["Gecontracteerd transportvermogen (kW)", "Referentie voor peak shaving en contractoptimalisatie"],
          ["Aansluitwaarde (bijv. 3×80 A of kVA)", "Fysieke bovengrens van de aansluiting"],
          ["Tarief- en contractstructuur", "Waarde van pieken verlagen of verschuiven bepalen"],
        ],
      },
      { type: "kop", text: "Waar vraagt u kwartierdata op?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Grootverbruik: bij uw meetverantwoordelijke (meetbedrijf) of via het portaal van uw netbeheerder — vraag om een export (CSV/Excel).",
          "Kleinverbruik: via uw energieleverancier of een uitleesdienst van de slimme meter.",
          "Controleer of de export volledige kalendermaanden dekt en geen gaten bevat.",
        ],
      },
      { type: "kop", text: "Waar let u op bij de analyse?" },
      {
        type: "lijst",
        items: [
          "Hoogte én duur van pieken: één kwartier van 150 kW vraagt iets anders dan drie uur van 90 kW.",
          "Gelijktijdigheid met zonproductie: middagpieken vangen zonnepanelen deels zelf af.",
          "Uitzonderlijke dagen (storing, evenement) niet als maatgevend nemen.",
        ],
      },
    ],
    faq: [
      {
        question: "Mijn bedrijf heeft alleen jaarcijfers. Kan er dan geen indicatie komen?",
        answer:
          "Een grove richting kan, maar geen betrouwbare dimensionering. Onze batterijscan geeft in dat geval bewust een lagere zekerheid en adviseert eerst kwartierdata te verzamelen.",
      },
    ],
    related: [
      "peak-shaving-met-zakelijke-batterij",
      "zakelijke-batterij-onderzoeken-waard",
      "energiejaarafrekening-lezen-voor-pandcheck",
    ],
    status: "published",
  },

  {
    slug: "zakelijke-batterij-registreren",
    title: "Zakelijke batterij registreren: wat moet u weten?",
    description:
      "Batterijsystemen moeten vanaf een bepaald vermogen geregistreerd worden. Wat de registratie inhoudt, waarom die bestaat en hoe u het regelt.",
    category: "Zakelijke batterij",
    searchIntent: "batterij registreren verplicht",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-battery-register", "rvo-battery-investment"],
    relatedTool: { href: "/tools/zakelijke-batterijscan", label: "Doe de batterijscan" },
    kortAntwoord:
      "Batterijsystemen die op het net zijn aangesloten moeten vanaf een bepaald vermogen worden geregistreerd; RVO noemt momenteel een grens van 0,8 kW — praktisch gezien valt vrijwel elke zakelijke batterij daaronder. De registratie helpt netbeheerders het net veilig te beheren. Controleer de actuele grens en de registratieroute bij RVO vlak voordat u een systeem in gebruik neemt.",
    sections: [
      { type: "kop", text: "Waarom bestaat de registratieplicht?" },
      {
        type: "paragraaf",
        text: "Netbeheerders moeten weten welke installaties stroom kunnen leveren aan of opnemen van het net, om het net veilig en stabiel te houden. Net als zonnepanelen worden batterijsystemen daarom geregistreerd, met kerngegevens zoals vermogen en locatie.",
      },
      { type: "kop", text: "Voor welke systemen geldt het?" },
      {
        type: "lijst",
        items: [
          "Netgekoppelde batterijsystemen vanaf de actuele vermogensgrens (RVO noemt 0,8 kW — vrijwel elke zakelijke batterij).",
          "Zowel nieuwe installaties als bestaande systemen die nog niet geregistreerd zijn.",
          "Controleer bij een eilandsysteem (niet netgekoppeld) de actuele uitleg; de situatie kan afwijken.",
        ],
      },
      { type: "kop", text: "Hoe regelt u de registratie?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Verzamel de systeemgegevens: vermogen (kW), capaciteit (kWh), locatie en aansluitgegevens.",
          "Volg de actuele registratieroute die RVO beschrijft.",
          "Spreek met uw installateur af wie de registratie verzorgt — leg dat vast in de opdracht.",
          "Bewaar de registratiebevestiging bij uw installatiedossier.",
        ],
      },
      { type: "kop", text: "Vergeet de veiligheidskant niet" },
      {
        type: "paragraaf",
        text: "Naast registratie stellen verzekeraars en gemeenten vaak eisen aan opstelling, ventilatie en brandveiligheid van batterijsystemen. Informeer uw verzekeraar vóór plaatsing en vraag uw installateur naar de geldende richtlijnen voor veilige opstelling.",
      },
    ],
    faq: [
      {
        question: "Geldt de registratie ook voor thuisbatterijen bij een bedrijf aan huis?",
        answer:
          "De grens van 0,8 kW maakt geen onderscheid naar gebruik; ook kleinere systemen vallen er in de regel onder. Controleer de actuele RVO-uitleg voor uw specifieke situatie.",
      },
    ],
    related: [
      "zakelijke-batterij-onderzoeken-waard",
      "peak-shaving-met-zakelijke-batterij",
    ],
    status: "published",
  },

  {
    slug: "energiejaarafrekening-lezen-voor-pandcheck",
    title: "Zo leest u uw zakelijke energiejaarafrekening voor de PandCheck",
    description:
      "Waar vindt u kWh, m³ gas, gecontracteerd vermogen en teruglevering op uw zakelijke energieafrekening? Praktische leeswijzer voor de PandCheck.",
    category: "Praktisch",
    searchIntent: "zakelijke energieafrekening kwh m3 vinden",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-energy-saving-duty"],
    relatedTool: { href: "/pandcheck", label: "Start de PandCheck" },
    kortAntwoord:
      "Voor de PandCheck heeft u drie cijfers nodig die vrijwel altijd op uw jaarafrekening of in het klantportaal staan: uw jaarlijkse elektriciteitsafname in kWh, uw jaarlijkse gasafname in m³ en — bij zonnepanelen — uw teruglevering in kWh. Grootverbruikers vinden daarnaast het gecontracteerd transportvermogen (kW) op de factuur van de netbeheerder of in het energiecontract.",
    sections: [
      { type: "kop", text: "Welke cijfers zoekt u?" },
      {
        type: "tabel",
        caption: "Zoekhulp: waar staat welk cijfer?",
        headers: ["Gegeven", "Waar te vinden", "Let op"],
        rows: [
          [
            "Elektriciteit (kWh/jaar)",
            "Jaarafrekening: 'verbruik' of 'afname', vaak gesplitst in normaal/dal",
            "Tel normaal- en daltarief bij elkaar op",
          ],
          [
            "Gas (m³/jaar)",
            "Jaarafrekening: 'verbruik' in m³",
            "Soms gecorrigeerd weergegeven; gebruik het totaal per jaar",
          ],
          [
            "Teruglevering (kWh/jaar)",
            "Jaarafrekening: 'teruglevering' of 'invoeding'",
            "Alleen relevant bij eigen opwek",
          ],
          [
            "Gecontracteerd vermogen (kW)",
            "Factuur netbeheerder of energiecontract",
            "Alleen grootverbruik; ook 'transportvermogen' genoemd",
          ],
        ],
      },
      { type: "kop", text: "Geen jaarafrekening bij de hand?" },
      {
        type: "lijst",
        items: [
          "Log in op het klantportaal van uw energieleverancier; daar staan jaartotalen.",
          "Bij maandfacturen: tel twaalf maanden op of gebruik het jaaroverzicht.",
          "Alleen een eurobedrag? Deel het leveringsdeel (exclusief netkosten en belastingen) door uw gemiddelde tarief voor een grove schatting — en kies in de check dan een bandbreedte in plaats van een exact getal.",
        ],
      },
      { type: "kop", text: "Waarom vragen wij hiernaar?" },
      {
        type: "paragraaf",
        text: "De belangrijkste drempels in de regelgeving zijn verbruiksgrenzen: 50.000 kWh en 25.000 m³ voor de energiebesparingsplicht, 10 miljoen kWh en 170.000 m³ voor de onderzoeksplicht. Met uw werkelijke jaarcijfers wordt de PandCheck-indicatie direct scherper. Weet u een waarde niet, kies dan 'Weet ik niet' — dat is altijd beter dan gokken.",
      },
    ],
    faq: [
      {
        question: "Mijn pand heeft meerdere meters. Wat vul ik in?",
        answer:
          "Tel de meters van dezelfde locatie bij elkaar op; de verplichtingen kijken naar het gebruik per locatie. Houd afzonderlijke locaties gescheiden en doe per locatie een eigen check.",
      },
    ],
    related: [
      "energiebesparingsplicht-grenzen-uitzonderingen",
      "kwartierdata-batterijberekening",
    ],
    status: "published",
  },
];
