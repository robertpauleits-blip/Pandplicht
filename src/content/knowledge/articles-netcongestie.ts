import type { Article } from "../types";

const D = "2026-07-20";

export const ARTIKELEN_NETCONGESTIE: Article[] = [
  {
    slug: "wat-is-netcongestie-voor-ondernemers",
    title: "Wat is netcongestie en wat betekent het voor ondernemers?",
    description:
      "Netcongestie uitgelegd voor ondernemers: wat het is, hoe u merkt dat het stroomnet vol is en welke stappen u kunt zetten richting uw netbeheerder.",
    category: "Netcongestie",
    searchIntent: "wat is netcongestie bedrijf",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-grid-congestion", "rvo-grid-guide", "rvo-grid-loket"],
    relatedTool: { href: "/tools/netcongestiecheck", label: "Doe de netcongestiecheck" },
    kortAntwoord:
      "Netcongestie is drukte op het elektriciteitsnet: de vraag naar transportcapaciteit is op sommige plekken en momenten groter dan het net aankan. Voor ondernemers betekent dit dat een nieuwe of zwaardere aansluiting lang kan duren, en dat afname of teruglevering beperkt kan worden. Een kaartkleur zegt niets definitiefs over uw aansluiting; uitsluitsel geeft alleen uw netbeheerder.",
    sections: [
      { type: "kop", text: "Wat is netcongestie precies?" },
      {
        type: "paragraaf",
        text: "Netcongestie is file op het elektriciteitsnet. Door elektrificatie (warmtepompen, laadpalen, machines) en veel nieuwe zonne- en windprojecten is de vraag naar transportcapaciteit in delen van Nederland groter dan het net op dit moment kan leveren. Netbeheerders breiden uit, maar dat kost jaren.",
      },
      { type: "kop", text: "Hoe merkt een ondernemer netcongestie?" },
      {
        type: "lijst",
        items: [
          "Een aanvraag voor een nieuwe of zwaardere aansluiting komt op een wachtlijst.",
          "U krijgt geen (extra) gecontracteerd transportvermogen voor afname.",
          "Teruglevering van zonnestroom wordt begrensd of geweigerd.",
          "Uitbreidings- of elektrificatieplannen lopen vertraging op.",
        ],
      },
      { type: "kop", text: "Wat kunt u doen?" },
      {
        type: "lijst",
        geordend: true,
        items: [
          "Vraag uw netbeheerder schriftelijk naar de situatie op uw locatie en de status van eventuele aanvragen.",
          "Breng uw werkelijke verbruikspieken in kaart met kwartierdata — vaak is er binnen het bestaande contract meer mogelijk dan gedacht.",
          "Verken flexibiliteit: pieken spreiden, processen verschuiven, slim laden.",
          "Onderzoek alternatieven zoals opslag of samenwerking met buurbedrijven (energiehub).",
        ],
      },
      {
        type: "paragraaf",
        text: "Belangrijk: PandPlicht gebruikt geen live netdata. Onze netcongestiecheck is een risico- en handelingsscan op basis van uw eigen situatie en verwijst u voor de actuele stand altijd naar uw netbeheerder en de officiële capaciteitskaart.",
      },
    ],
    faq: [
      {
        question: "Is het stroomnet op mijn bedrijventerrein vol?",
        answer:
          "Dat is per locatie en per moment verschillend. De openbare capaciteitskaart geeft een regionale indicatie, maar alleen uw netbeheerder kan voor uw specifieke aansluiting uitsluitsel geven. Vraag het schriftelijk na.",
      },
      {
        question: "Geldt netcongestie ook voor kleinverbruikers?",
        answer:
          "Kleinverbruikaansluitingen (t/m 3×80 A) merken er tot nu toe minder van, maar bij verzwaring naar grootverbruik of grootschalige teruglevering kunt u er ook mee te maken krijgen.",
      },
    ],
    related: [
      "afnamecongestie-en-invoedingscongestie-verschil",
      "oplossingen-volle-aansluiting-ondernemer",
      "zakelijke-batterij-onderzoeken-waard",
    ],
    status: "published",
  },

  {
    slug: "afnamecongestie-en-invoedingscongestie-verschil",
    title: "Afnamecongestie en invoedingscongestie: het verschil",
    description:
      "Het verschil tussen afnamecongestie (stroom afnemen) en invoedingscongestie (stroom terugleveren) uitgelegd, en wat elk type betekent voor uw bedrijf.",
    category: "Netcongestie",
    searchIntent: "afnamecongestie versus invoedingscongestie",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-grid-congestion", "rvo-grid-guide"],
    relatedTool: { href: "/tools/netcongestiecheck", label: "Doe de netcongestiecheck" },
    kortAntwoord:
      "Afnamecongestie betekent dat het net onvoldoende ruimte heeft om stroom aan bedrijven te léveren; invoedingscongestie betekent dat het net onvoldoende ruimte heeft om teruggeleverde stroom (bijvoorbeeld van zonnepanelen) te ontvangen. Een regio kan met één van beide of met allebei te maken hebben, en de oplossingsrichtingen verschillen per type.",
    sections: [
      { type: "kop", text: "Wat is afnamecongestie?" },
      {
        type: "paragraaf",
        text: "Afnamecongestie is een tekort aan transportcapaciteit voor levering áán afnemers. Gevolg: nieuwe of zwaardere aansluitingen voor afname komen op een wachtlijst en extra gecontracteerd vermogen is beperkt beschikbaar. Dit raakt vooral bedrijven die willen uitbreiden of elektrificeren.",
      },
      { type: "kop", text: "Wat is invoedingscongestie?" },
      {
        type: "paragraaf",
        text: "Invoedingscongestie is een tekort aan capaciteit voor het ontvángen van opgewekte stroom. Gevolg: teruglevering van zonnestroom kan worden begrensd of geweigerd. Dit raakt vooral bedrijven met (plannen voor) grote zonnedaken.",
      },
      {
        type: "tabel",
        caption: "Afname- versus invoedingscongestie in het kort",
        headers: ["", "Afnamecongestie", "Invoedingscongestie"],
        rows: [
          ["Knelpunt", "Stroom léveren aan bedrijven", "Stroom óntvangen van opwekkers"],
          ["Raakt vooral", "Uitbreiding, elektrificatie, laadinfra", "Zonnedaken, teruglevering"],
          [
            "Typische signalen",
            "Wachtlijst aansluiting, geen extra vermogen",
            "Terugleverbegrenzing, negatieve prijzen",
          ],
          [
            "Denkrichtingen",
            "Pieken spreiden, flexibel contract, opslag",
            "Eigen gebruik verhogen, curtailment, opslag",
          ],
        ],
      },
      { type: "kop", text: "Wat betekent dit voor uw plannen?" },
      {
        type: "lijst",
        items: [
          "Check bij uitbreidings- of elektrificatieplannen éérst of afname beperkt is op uw locatie.",
          "Check bij zonneplannen of invoeding beperkt is — soms is eigen gebruik (met of zonder opslag) aantrekkelijker dan terugleveren.",
          "Beide typen kunnen tegelijk spelen; vraag uw netbeheerder om het volledige beeld.",
        ],
      },
    ],
    faq: [
      {
        question: "Kan een batterij bij beide typen helpen?",
        answer:
          "Mogelijk. Bij afnamecongestie kan een batterij pieken afvlakken (peak shaving); bij invoedingscongestie kan hij middagoverschot opslaan voor eigen gebruik. Of dat rendabel is, vraagt onderzoek met kwartierdata.",
      },
    ],
    related: [
      "wat-is-netcongestie-voor-ondernemers",
      "oplossingen-volle-aansluiting-ondernemer",
      "peak-shaving-met-zakelijke-batterij",
    ],
    status: "published",
  },

  {
    slug: "oplossingen-volle-aansluiting-ondernemer",
    title: "Welke oplossingen heeft een ondernemer bij een volle aansluiting?",
    description:
      "Praktische opties bij netcongestie: van kwartierdata en pieken spreiden tot flexibele contracten, cable pooling, energiehubs en batterijopslag.",
    category: "Netcongestie",
    searchIntent: "oplossingen netcongestie ondernemer volle aansluiting",
    publishedAt: D,
    lastReviewedAt: D,
    publisher: "PandPlicht",
    sourceIds: ["rvo-grid-guide", "rvo-grid-loket", "rvo-battery-investment"],
    relatedTool: { href: "/tools/netcongestiecheck", label: "Doe de netcongestiecheck" },
    kortAntwoord:
      "Bij een volle aansluiting of wachtlijst zijn er grofweg vijf routes: (1) uw werkelijke pieken kennen en verlagen met kwartierdata, (2) verbruik spreiden of processen flexibiliseren, (3) flexibele contractvormen met de netbeheerder verkennen, (4) samenwerken met buurbedrijven (energiehub, cable pooling) en (5) opslag inzetten. Begin altijd met meten: vaak zit er binnen het bestaande contract meer ruimte dan gedacht.",
    sections: [
      { type: "kop", text: "Route 1: ken en verlaag uw pieken" },
      {
        type: "paragraaf",
        text: "Uw gecontracteerd vermogen wordt bepaald door uw hoogste kwartierpiek, niet door uw gemiddelde verbruik. Vraag kwartierdata op bij uw meetbedrijf en kijk wanneer die pieken vallen. Vaak zijn ze te verlagen door apparaten niet gelijktijdig te starten of processen iets te verschuiven.",
      },
      { type: "kop", text: "Route 2: flexibiliseer verbruik" },
      {
        type: "lijst",
        items: [
          "Laad elektrische voertuigen gespreid of buiten piekuren (slim laden).",
          "Verschuif energie-intensieve processen naar rustige momenten.",
          "Gebruik gebouwautomatisering om gelijktijdigheid te beperken.",
        ],
      },
      { type: "kop", text: "Route 3: flexibele afspraken met de netbeheerder" },
      {
        type: "paragraaf",
        text: "Netbeheerders bieden in congestiegebieden steeds vaker alternatieve contractvormen aan, waarbij u bijvoorbeeld op piekmomenten minder capaciteit gebruikt in ruil voor eerdere aansluiting of lagere kosten. De beschikbaarheid verschilt per regio; informeer actief.",
      },
      { type: "kop", text: "Route 4: samenwerken op het bedrijventerrein" },
      {
        type: "lijst",
        items: [
          "Energiehub: bedrijven delen capaciteit, opwek en opslag binnen een gebied.",
          "Cable pooling: opwek (zon/wind) deelt één aansluiting, wat netruimte bespaart.",
          "Gezamenlijke inkoop van flexibiliteit of opslag kan de businesscase verbeteren.",
        ],
      },
      { type: "kop", text: "Route 5: opslag" },
      {
        type: "paragraaf",
        text: "Een batterij kan pieken afvlakken of zonne-overschot bufferen. Het is zelden de éérste stap: zonder kwartierdata en duidelijk doel is een batterij niet te dimensioneren. Doe eerst de batterijscan en verzamel meetdata.",
      },
      { type: "kop", text: "Wat betekent 3×80 A eigenlijk?" },
      {
        type: "paragraaf",
        text: "3×80 ampère is de grens tussen een kleinverbruik- en grootverbruikaansluiting. Tot en met 3×80 A bent u kleinverbruiker met een relatief eenvoudig aansluitregime; daarboven gelden andere tarieven, meetverplichtingen (kwartierdata) en congestieregels.",
      },
    ],
    faq: [
      {
        question: "Hoe lang duurt een verzwaring in een congestiegebied?",
        answer:
          "Dat verschilt sterk per regio en netvlak — van maanden tot meerdere jaren. Uw netbeheerder kan een indicatie geven; reken in congestiegebieden niet op snelle uitbreiding en plan parallel aan de alternatieven hierboven.",
      },
    ],
    related: [
      "wat-is-netcongestie-voor-ondernemers",
      "afnamecongestie-en-invoedingscongestie-verschil",
      "zakelijke-batterij-onderzoeken-waard",
    ],
    status: "published",
  },
];
