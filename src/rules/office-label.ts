import type { AssessmentInput, RuleResult } from "./types";
import { THRESHOLDS } from "./version";

const SOURCES = ["rvo-office-label-c", "rvo-office-label-c-faq", "ep-online"];

const BASE_ASSUMPTIONS = [
  "Startpunt: een kantoorgebouw moet minimaal energielabel C hebben of een primair fossiel energiegebruik van maximaal 225 kWh/m² per jaar (RVO, gecontroleerd 2026-07-20).",
  "Het BAG-gebruiksdoel bewijst op zichzelf niet dat de label-C-plicht geldt; werkelijk gebruik en uitzonderingen tellen mee.",
];

function isKantoor(input: AssessmentInput): boolean | null {
  if (input.hoofdgebruik === "kantoor") return true;
  if (input.hoofdgebruik === "gemengd") {
    if (input.kantoorAandeel === "gte50") return true;
    if (input.kantoorAandeel === "lt50") return false;
    return null; // gemengd, aandeel onbekend
  }
  if (input.hoofdgebruik === null) return null;
  // Ander hoofdgebruik: label-C-kantoorplicht waarschijnlijk niet relevant,
  // tenzij het kantooraandeel alsnog overheerst.
  if (input.kantoorAandeel === "gte50") return true;
  return false;
}

function oppervlakteOnderGrens(input: AssessmentInput): boolean | null {
  if (input.oppervlakteExactM2 !== null) {
    return input.oppervlakteExactM2 < THRESHOLDS.kantoorLabelMinM2;
  }
  switch (input.oppervlakteBand) {
    case "lt100":
      return true;
    case "b100_250":
    case "b250_1000":
    case "b1000_5000":
    case "gt5000":
      return false;
    default:
      return null;
  }
}

/**
 * Energielabel C voor kantoren, indicatief, met de belangrijkste
 * uitzonderingen: kantooraandeel < 50%, kleine gebouwen (< 100 m²-grens)
 * en monumenten.
 */
export function assessEnergielabelCKantoor(input: AssessmentInput): RuleResult {
  const kantoor = isKantoor(input);
  const klein = oppervlakteOnderGrens(input);

  const missingInputs: string[] = [];
  if (input.hoofdgebruik === null) missingInputs.push("Hoofdgebruik van het pand");
  if (kantoor === null && input.hoofdgebruik === "gemengd") {
    missingInputs.push("Aandeel kantoorfunctie (meer of minder dan 50%)");
  }
  if (klein === null) missingInputs.push("Gebruiksoppervlakte van het gebouw");
  if (input.energielabel === null || input.energielabel === "onbekend") {
    missingInputs.push("Huidig energielabel (controleer EP-Online)");
  }
  if (input.monument === "onbekend" || input.monument === null) {
    missingInputs.push("Monumentstatus");
  }

  // Niet-kantoor: plicht waarschijnlijk niet van toepassing.
  if (kantoor === false) {
    return {
      topicId: "energielabel_c_kantoor",
      status: "likely_not_applicable",
      confidence: "medium",
      priority: "informational",
      reasons: [
        "De label-C-plicht geldt specifiek voor kantoorgebouwen. Op basis van uw opgave is kantoor niet het (overheersende) gebruik.",
        input.kantoorAandeel === "lt50"
          ? "Wanneer het kantoordeel minder dan 50% van het gebruiksoppervlak beslaat, geldt de plicht volgens de RVO-uitleg meestal niet."
          : "Uw hoofdgebruik valt buiten de kantoorcategorie.",
      ],
      missingInputs,
      nextSteps: [
        "Controleer of voor uw gebouwtype andere labeleisen gelden (bijvoorbeeld bij verkoop of verhuur).",
      ],
      sourceIds: SOURCES,
      assumptions: BASE_ASSUMPTIONS,
    };
  }

  // Kantoorstatus onbekend → meer informatie nodig.
  if (kantoor === null) {
    return {
      topicId: "energielabel_c_kantoor",
      status: "insufficient_data",
      confidence: "low",
      priority: "soon",
      reasons: [
        "Zonder duidelijkheid over het (kantoor)gebruik kan de label-C-plicht niet worden ingeschat.",
      ],
      missingInputs,
      nextSteps: [
        "Stel vast welk deel van het gebruiksoppervlak kantoorfunctie heeft.",
        "Controleer het huidige label van het gebouw in EP-Online.",
      ],
      sourceIds: SOURCES,
      assumptions: BASE_ASSUMPTIONS,
    };
  }

  // Monument: uitzondering.
  if (input.monument === "ja") {
    return {
      topicId: "energielabel_c_kantoor",
      status: "likely_not_applicable",
      confidence: "medium",
      priority: "informational",
      reasons: [
        "Voor (rijks)monumenten geldt volgens de RVO-uitleg een uitzondering op de label-C-plicht.",
        "Controleer wel om welk type monumentstatus het gaat; niet elke beschermde status geeft dezelfde uitzondering.",
      ],
      missingInputs,
      nextSteps: [
        "Controleer de exacte monumentstatus van het gebouw bij uw gemeente of het Kadaster.",
        "Bekijk of vrijwillige verduurzaming alsnog interessant is.",
      ],
      sourceIds: SOURCES,
      assumptions: BASE_ASSUMPTIONS,
    };
  }

  // Klein kantoorgebouw: uitzondering.
  if (klein === true) {
    return {
      topicId: "energielabel_c_kantoor",
      status: "likely_not_applicable",
      confidence: "medium",
      priority: "informational",
      reasons: [
        `Voor kleine kantoorgebouwen onder de relevante ${THRESHOLDS.kantoorLabelMinM2} m²-grens geldt volgens de RVO-uitleg een uitzondering.`,
        "De grens gaat over het gebruiksoppervlak van het gebouw (inclusief nevenfuncties); controleer dit zorgvuldig.",
      ],
      missingInputs,
      nextSteps: [
        "Controleer het exacte gebruiksoppervlak, bijvoorbeeld via de BAG Viewer.",
      ],
      sourceIds: [...SOURCES, "bag-viewer"],
      assumptions: BASE_ASSUMPTIONS,
    };
  }

  // Kantoor, mogelijk onder de plicht, beoordeel op label.
  const label = input.energielabel;

  if (label === "D" || label === "E" || label === "F" || label === "G") {
    return {
      topicId: "energielabel_c_kantoor",
      status: "likely_applicable",
      confidence: klein === null ? "medium" : "high",
      priority: "now",
      reasons: [
        `Uw opgegeven label (${label}) voldoet niet aan het minimum van label C voor kantoren die onder de plicht vallen.`,
        klein === null
          ? "De oppervlakte is nog niet bevestigd; kleine kantoorgebouwen kunnen uitgezonderd zijn."
          : "Op basis van gebruik en omvang lijkt uw kantoor onder de plicht te vallen.",
      ],
      missingInputs,
      nextSteps: [
        "Controleer de geldigheid en registratie van het label in EP-Online.",
        "Vraag een maatwerkadvies aan voor stappen richting label C of beter.",
        "Bespreek met eigenaar of huurder wie welke maatregelen neemt.",
      ],
      sourceIds: SOURCES,
      assumptions: BASE_ASSUMPTIONS,
    };
  }

  if (label === "A" || label === "B" || label === "C") {
    return {
      topicId: "energielabel_c_kantoor",
      status: "likely_not_applicable",
      confidence: "medium",
      priority: "monitor",
      reasons: [
        `Met label ${label} voldoet het gebouw aan het minimum van label C; de actie "verbeteren naar C" lijkt niet nodig.`,
        "Controleer wel of het label nog geldig en correct geregistreerd is.",
      ],
      missingInputs,
      nextSteps: [
        "Controleer de geldigheidsdatum van het label in EP-Online.",
        "Plan tijdig een nieuw label wanneer het huidige verloopt.",
      ],
      sourceIds: SOURCES,
      assumptions: BASE_ASSUMPTIONS,
    };
  }

  // Geen of onbekend label.
  return {
    topicId: "energielabel_c_kantoor",
    status: "possibly_applicable",
    confidence: "low",
    priority: "soon",
    reasons: [
      label === "geen"
        ? "Er is volgens uw opgave geen energielabel geregistreerd, terwijl uw kantoor mogelijk onder de label-C-plicht valt."
        : "Het energielabel is onbekend, terwijl uw kantoor mogelijk onder de label-C-plicht valt.",
    ],
    missingInputs,
    nextSteps: [
      "Zoek het gebouw op in EP-Online om te zien of er een geldig label is.",
      "Laat zo nodig een energielabel opstellen door een gecertificeerd adviseur.",
    ],
    sourceIds: SOURCES,
    assumptions: BASE_ASSUMPTIONS,
  };
}
