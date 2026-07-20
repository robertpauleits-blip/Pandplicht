import type { AssessmentInput, RuleResult } from "./types";

const SOURCES = ["government-utility-label", "rvo-utility-label", "ep-online"];

const ASSUMPTIONS = [
  "Bij verkoop, nieuwe verhuur of oplevering van een utiliteitsgebouw is in de regel een geldig energielabel verplicht; er bestaan uitzonderingen (o.a. monumenten en specifieke gebouwtypen).",
];

/**
 * Energielabel bij verkoop, verhuur of oplevering van een utiliteitsgebouw.
 */
export function assessEnergielabelTransactie(
  input: AssessmentInput,
): RuleResult {
  const missingInputs: string[] = [];
  if (input.transactieGepland === null || input.transactieGepland === "onbekend") {
    missingInputs.push("Is verkoop, nieuwe verhuur of oplevering aan de orde?");
  }
  if (input.energielabel === null || input.energielabel === "onbekend") {
    missingInputs.push("Huidig energielabel (controleer EP-Online)");
  }
  if (input.hoofdgebruik === null) {
    missingInputs.push("Gebouwfunctie");
  }

  if (input.transactieGepland === "nee") {
    return {
      topicId: "energielabel_transactie",
      status: "likely_not_applicable",
      confidence: "medium",
      priority: "informational",
      reasons: [
        "U geeft aan dat verkoop, nieuwe verhuur of oplevering nu niet speelt; het transactiemoment is juist wanneer het label verplicht wordt.",
      ],
      missingInputs,
      nextSteps: [
        "Regel een geldig label ruim vóór een toekomstige verkoop of nieuwe verhuur.",
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  if (input.transactieGepland === "ja" || input.transactieGepland === "mogelijk") {
    const heeftGeldigLabel =
      input.energielabel !== null &&
      input.energielabel !== "geen" &&
      input.energielabel !== "onbekend";

    const reasons = [
      input.transactieGepland === "ja"
        ? "U geeft aan dat verkoop, nieuwe verhuur of oplevering speelt. Op dat moment is voor utiliteitsgebouwen in de regel een geldig energielabel verplicht."
        : "Mogelijk speelt binnenkort verkoop, nieuwe verhuur of oplevering; dan is voor utiliteitsgebouwen in de regel een geldig energielabel verplicht.",
    ];
    if (heeftGeldigLabel) {
      reasons.push(
        `U geeft aan dat er een label (${input.energielabel}) is; controleer of het nog geldig is (labels zijn 10 jaar geldig) en correct is geregistreerd.`,
      );
    } else {
      reasons.push(
        "Er is volgens uw opgave geen (bekend) label; regel dit dan tijdig.",
      );
    }

    return {
      topicId: "energielabel_transactie",
      status:
        input.transactieGepland === "ja"
          ? "likely_applicable"
          : "possibly_applicable",
      confidence: input.hoofdgebruik === null ? "low" : "medium",
      priority: input.transactieGepland === "ja" ? "now" : "soon",
      reasons,
      missingInputs,
      nextSteps: [
        "Controleer in EP-Online of het gebouw een geldig, geregistreerd label heeft.",
        "Laat zo nodig tijdig een label opstellen door een gecertificeerd adviseur.",
        "Controleer of een uitzondering geldt (bijvoorbeeld monumentstatus of specifiek gebouwtype).",
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  return {
    topicId: "energielabel_transactie",
    status: "insufficient_data",
    confidence: "low",
    priority: "monitor",
    reasons: [
      "Zonder duidelijkheid over een geplande verkoop, nieuwe verhuur of oplevering is deze plicht niet in te schatten.",
    ],
    missingInputs,
    nextSteps: [
      "Bepaal of een transactie binnen afzienbare tijd aan de orde is.",
      "Controleer alvast in EP-Online of het gebouw een geldig label heeft.",
    ],
    sourceIds: SOURCES,
    assumptions: ASSUMPTIONS,
  };
}
