import type { SourceRecord } from "./types";

/**
 * Centrale bronregistry. Iedere regel verwijst naar minimaal één bron-ID.
 * `checkedAt` = datum waarop de redactie de bron inhoudelijk controleerde.
 * Controleer alle bronnen opnieuw vlak vóór livegang; wetgeving is veranderlijk.
 */
export const SOURCES: Record<string, SourceRecord> = {
  "rvo-energy-saving-duty": {
    id: "rvo-energy-saving-duty",
    title: "Energiebesparingsplicht",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/energiebesparingsplicht",
    checkedAt: "2026-07-20",
    notes:
      "Hoofdgrens: locatiegebruik vanaf 50.000 kWh elektriciteit of 25.000 m³ aardgas(equivalent) per jaar.",
  },
  "rvo-information-duty": {
    id: "rvo-information-duty",
    title: "Informatieplicht energiebesparing",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/energiebesparingsplicht/informatieplicht-energiebesparing",
    checkedAt: "2026-07-20",
    notes: "Rapportage kan eens per vier jaar gelden.",
  },
  "rvo-research-duty": {
    id: "rvo-research-duty",
    title: "Onderzoeksplicht energiebesparing",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/energiebesparingsplicht/onderzoeksplicht",
    checkedAt: "2026-07-20",
    notes:
      "Voor relevante bedrijfstakken vanaf o.a. 10 miljoen kWh of 170.000 m³ aardgas(equivalent) per jaar.",
  },
  "rvo-eml": {
    id: "rvo-eml",
    title: "Erkende Maatregelenlijsten energiebesparing (EML)",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/energiebesparingsplicht/eml",
    checkedAt: "2026-07-20",
  },
  "rvo-office-label-c": {
    id: "rvo-office-label-c",
    title: "Energielabel C kantoren",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-c-kantoren",
    checkedAt: "2026-07-20",
    notes:
      "Minimaal label C of primair fossiel energiegebruik ≤ 225 kWh/m² per jaar.",
  },
  "rvo-office-label-c-faq": {
    id: "rvo-office-label-c-faq",
    title: "Veelgestelde vragen energielabel C kantoren",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-c-kantoren/veelgestelde-vragen-energielabel-c",
    checkedAt: "2026-07-20",
    notes:
      "Uitzonderingen o.a. kantoor(deel) < 50% van gebruiksoppervlak, kleine kantoorgebouwen (100 m²-grens), monumenten.",
  },
  "rvo-utility-label": {
    id: "rvo-utility-label",
    title: "Energielabel utiliteitsgebouwen",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-utiliteitsgebouwen",
    checkedAt: "2026-07-20",
  },
  "government-utility-label": {
    id: "government-utility-label",
    title: "Energielabel utiliteitsbouw",
    publisher: "Rijksoverheid",
    url: "https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/energielabel-woningen-en-gebouwen/energielabel-utiliteitsbouw",
    checkedAt: "2026-07-20",
    notes: "Label verplicht bij verkoop, verhuur en oplevering; uitzonderingen bestaan.",
  },
  "ep-online": {
    id: "ep-online",
    title: "EP-Online — officiële energielabeldatabase",
    publisher: "RVO",
    url: "https://www.ep-online.nl/",
    checkedAt: "2026-07-20",
  },
  "pdok-apis": {
    id: "pdok-apis",
    title: "PDOK API-overzicht en Locatieserver",
    publisher: "PDOK",
    url: "https://api.pdok.nl/",
    checkedAt: "2026-07-20",
  },
  "bag-viewer": {
    id: "bag-viewer",
    title: "BAG Viewer",
    publisher: "Kadaster",
    url: "https://bagviewer.kadaster.nl/",
    checkedAt: "2026-07-20",
  },
  "rvo-grid-congestion": {
    id: "rvo-grid-congestion",
    title: "Wat is netcongestie?",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/netcongestie/wat-netcongestie",
    checkedAt: "2026-07-20",
  },
  "rvo-grid-guide": {
    id: "rvo-grid-guide",
    title: "Wegwijzer netcongestie voor ondernemers",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/netcongestie/wegwijzer-netcongestie-ondernemers",
    checkedAt: "2026-07-20",
  },
  "rvo-battery-investment": {
    id: "rvo-battery-investment",
    title: "Investeren in een bedrijfsbatterij",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/netcongestie/investeren-batterij",
    checkedAt: "2026-07-20",
  },
  "rvo-battery-register": {
    id: "rvo-battery-register",
    title: "Registreer uw batterijsysteem",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/netcongestie/registreer-uw-batterijsysteem",
    checkedAt: "2026-07-20",
    notes:
      "Registratie geldt vanaf een vermogensgrens; RVO noemt momenteel 0,8 kW. Controleer vóór livegang.",
  },
  "rvo-grid-loket": {
    id: "rvo-grid-loket",
    title: "Loket Netcongestie",
    publisher: "RVO",
    url: "https://www.rvo.nl/onderwerpen/netcongestie",
    checkedAt: "2026-07-20",
  },
};

export function getSource(id: string): SourceRecord {
  const s = SOURCES[id];
  if (!s) {
    throw new Error(`Onbekende bron-ID: ${id}`);
  }
  return s;
}

export function getSources(ids: string[]): SourceRecord[] {
  return ids.map(getSource);
}
