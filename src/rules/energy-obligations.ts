import type { AssessmentInput, RuleResult } from "./types";
import { THRESHOLDS } from "./version";
import { compareToThreshold, formatGas, formatKwh, toRange } from "./helpers";

/**
 * Energiebesparingsplicht, indicatieve beoordeling op basis van jaarlijks
 * energiegebruik per locatie. Startwaarden: 50.000 kWh of 25.000 m³
 * aardgas(equivalent) per jaar (bron: RVO, zie sources.ts).
 */
export function assessEnergiebesparingsplicht(
  input: AssessmentInput,
): RuleResult {
  const elektra = toRange(input.elektriciteit, "elektra");
  const gas = toRange(input.gas, "gas");
  const m = THRESHOLDS.grensMarge;

  const reasons: string[] = [];
  const missingInputs: string[] = [];
  const assumptions: string[] = [
    "Drempels: 50.000 kWh elektriciteit of 25.000 m³ aardgas(equivalent) per locatie per jaar (RVO, gecontroleerd 2026-07-20).",
  ];
  const nextSteps: string[] = [];
  const sourceIds = ["rvo-energy-saving-duty", "rvo-eml"];

  const elektraCmp = elektra
    ? compareToThreshold(elektra, THRESHOLDS.besparingsplichtKwh, m)
    : null;
  const gasCmp = gas
    ? compareToThreshold(gas, THRESHOLDS.besparingsplichtGasM3, m)
    : null;

  if (!elektra) missingInputs.push("Jaarlijks elektriciteitsgebruik (kWh)");
  if (!gas) missingInputs.push("Jaarlijks aardgasgebruik (m³ of equivalent)");

  let result: RuleResult;

  if (elektraCmp === "above" || gasCmp === "above") {
    if (elektraCmp === "above" && elektra) {
      reasons.push(
        `Uw opgegeven elektriciteitsgebruik ligt op of boven de drempel van ${formatKwh(
          THRESHOLDS.besparingsplichtKwh,
        )} per jaar.`,
      );
    }
    if (gasCmp === "above" && gas) {
      reasons.push(
        `Uw opgegeven aardgasgebruik ligt op of boven de drempel van ${formatGas(
          THRESHOLDS.besparingsplichtGasM3,
        )} per jaar.`,
      );
    }
    nextSteps.push(
      "Controleer uw werkelijke jaarverbruik op de meest recente jaarafrekening.",
      "Bekijk de Erkende Maatregelenlijst (EML) voor uw situatie.",
      "Controleer of voor uw locatie uitzonderingen of specifieke activiteiten gelden.",
    );
    result = {
      topicId: "energiebesparingsplicht",
      status: "likely_applicable",
      confidence:
        input.elektriciteit?.type === "exact" || input.gas?.type === "exact"
          ? "high"
          : "medium",
      priority: "now",
      reasons,
      missingInputs,
      nextSteps,
      sourceIds,
      assumptions,
    };
  } else if (elektraCmp === "below" && gasCmp === "below") {
    reasons.push(
      "Zowel uw elektriciteits- als aardgasgebruik ligt volgens uw opgave duidelijk onder de drempels.",
    );
    nextSteps.push(
      "Bewaar uw jaarafrekening als onderbouwing van het verbruik.",
      "Controleer het verbruik opnieuw wanneer uw bedrijfsvoering verandert (uitbreiding, elektrificatie).",
    );
    assumptions.push(
      "Andere verplichtingen (zoals energielabel-eisen) kunnen los hiervan nog gelden.",
    );
    result = {
      topicId: "energiebesparingsplicht",
      status: "likely_not_applicable",
      confidence:
        input.elektriciteit?.type === "exact" && input.gas?.type === "exact"
          ? "high"
          : "medium",
      priority: "monitor",
      reasons,
      missingInputs,
      nextSteps,
      sourceIds,
      assumptions,
    };
  } else if (elektraCmp === null && gasCmp === null) {
    reasons.push(
      "U heeft geen jaarverbruik opgegeven; zonder verbruiksgegevens is geen indicatie mogelijk.",
    );
    nextSteps.push(
      "Zoek het jaarverbruik op uw energiejaarafrekening of in het klantportaal van uw leverancier.",
      "Doe de check opnieuw met (een bandbreedte van) uw jaarverbruik.",
    );
    result = {
      topicId: "energiebesparingsplicht",
      status: "insufficient_data",
      confidence: "low",
      priority: "soon",
      reasons,
      missingInputs,
      nextSteps,
      sourceIds,
      assumptions,
    };
  } else {
    // Rond de grens, of één waarde onbekend terwijl de andere onder de grens ligt.
    if (elektraCmp === "around" || gasCmp === "around") {
      reasons.push(
        "Uw opgegeven verbruik ligt rond een van de drempels; een klein verschil kan de uitkomst veranderen.",
      );
    }
    if (elektraCmp === null || gasCmp === null) {
      reasons.push(
        "Eén van de twee verbruiksgegevens ontbreekt, waardoor de drempeltoets niet volledig kan worden gedaan.",
      );
    }
    nextSteps.push(
      "Controleer het exacte jaarverbruik op uw jaarafrekening (kWh en m³).",
      "Doe de check opnieuw met exacte waarden voor een scherpere indicatie.",
    );
    result = {
      topicId: "energiebesparingsplicht",
      status: "possibly_applicable",
      confidence: "low",
      priority: "soon",
      reasons,
      missingInputs,
      nextSteps,
      sourceIds,
      assumptions,
    };
  }

  return result;
}

/**
 * Informatieplicht energiebesparing, volgt de energiebesparingsplicht.
 * Rapportage kan eens per vier jaar gelden. Wanneer de onderzoeksplicht
 * geldt, verloopt rapportage (deels) via het onderzoek; wij trekken daarover
 * geen definitieve conclusie.
 */
export function assessInformatieplicht(
  input: AssessmentInput,
  besparingsplicht: RuleResult,
  onderzoeksplicht: RuleResult,
): RuleResult {
  const sourceIds = ["rvo-information-duty", "rvo-energy-saving-duty"];
  const assumptions = [
    "De informatieplicht volgt in de regel de energiebesparingsplicht; rapportage kan eens per vier jaar gelden (RVO).",
  ];

  if (besparingsplicht.status === "likely_applicable") {
    const reasons = [
      "De energiebesparingsplicht lijkt op uw locatie waarschijnlijk van toepassing; daarmee kan ook de rapportageplicht gelden.",
    ];
    if (onderzoeksplicht.status !== "likely_not_applicable") {
      reasons.push(
        "Mogelijk valt uw locatie onder de onderzoeksplicht; in dat geval verloopt de rapportage anders. Controleer dit bij RVO.",
      );
    }
    return {
      topicId: "informatieplicht",
      status: "likely_applicable",
      confidence: besparingsplicht.confidence === "high" ? "medium" : "low",
      priority: "now",
      reasons,
      missingInputs: besparingsplicht.missingInputs,
      nextSteps: [
        "Controleer op de RVO-website wanneer de eerstvolgende rapportageronde geldt.",
        "Verzamel uw verbruiksgegevens en genomen maatregelen (EML) vóór het rapporteren.",
      ],
      sourceIds,
      assumptions,
    };
  }

  if (besparingsplicht.status === "likely_not_applicable") {
    return {
      topicId: "informatieplicht",
      status: "likely_not_applicable",
      confidence: besparingsplicht.confidence,
      priority: "monitor",
      reasons: [
        "Omdat de energiebesparingsplicht op basis van uw opgave waarschijnlijk niet geldt, lijkt ook de informatieplicht niet aan de orde.",
      ],
      missingInputs: besparingsplicht.missingInputs,
      nextSteps: [
        "Herhaal de toets wanneer uw energiegebruik structureel stijgt.",
      ],
      sourceIds,
      assumptions,
    };
  }

  return {
    topicId: "informatieplicht",
    status: besparingsplicht.status,
    confidence: "low",
    priority: "soon",
    reasons: [
      "De uitkomst volgt de energiebesparingsplicht, die op basis van uw opgave nog niet duidelijk is.",
    ],
    missingInputs: besparingsplicht.missingInputs,
    nextSteps: [
      "Stel eerst uw jaarverbruik vast; daarmee wordt ook deze indicatie duidelijk.",
    ],
    sourceIds,
    assumptions,
  };
}

/**
 * Onderzoeksplicht energiebesparing, voor relevante bedrijfstakken vanaf
 * o.a. 10 mln kWh of 170.000 m³ aardgas(equivalent) per jaar (startwaarden).
 */
export function assessOnderzoeksplicht(input: AssessmentInput): RuleResult {
  const elektra = toRange(input.elektriciteit, "elektra");
  const gas = toRange(input.gas, "gas");
  const m = THRESHOLDS.grensMarge;
  const sourceIds = ["rvo-research-duty", "rvo-energy-saving-duty"];
  const assumptions = [
    "Startwaarden onderzoeksplicht: 10 miljoen kWh of 170.000 m³ aardgas(equivalent) per jaar voor relevante bedrijfstakken (RVO). Toepassingsvoorwaarden zijn activiteit-afhankelijk.",
  ];

  const elektraCmp = elektra
    ? compareToThreshold(elektra, THRESHOLDS.onderzoeksplichtKwh, m)
    : null;
  const gasCmp = gas
    ? compareToThreshold(gas, THRESHOLDS.onderzoeksplichtGasM3, m)
    : null;

  const missingInputs: string[] = [];
  if (!elektra) missingInputs.push("Jaarlijks elektriciteitsgebruik (kWh)");
  if (!gas) missingInputs.push("Jaarlijks aardgasgebruik (m³ of equivalent)");

  if (elektraCmp === "above" || gasCmp === "above") {
    return {
      topicId: "onderzoeksplicht",
      status: "possibly_applicable",
      confidence: "medium",
      priority: "now",
      reasons: [
        "Uw opgegeven energiegebruik ligt op of boven een van de onderzoeksplicht-drempels.",
        "Of de onderzoeksplicht echt geldt, hangt af van de aard van uw activiteiten; dat kan een online check niet definitief vaststellen.",
      ],
      missingInputs: [...missingInputs, "Aard van de (milieubelastende) activiteiten"],
      nextSteps: [
        "Controleer op de RVO-pagina over de onderzoeksplicht of uw activiteiten binnen de doelgroep vallen.",
        "Overweeg een gespecialiseerd energieadviseur voor het verplichte onderzoek.",
      ],
      sourceIds,
      assumptions,
    };
  }

  if (elektraCmp === "below" && gasCmp === "below") {
    return {
      topicId: "onderzoeksplicht",
      status: "likely_not_applicable",
      confidence: "medium",
      priority: "informational",
      reasons: [
        "Uw opgegeven energiegebruik ligt duidelijk onder de onderzoeksplicht-drempels.",
      ],
      missingInputs,
      nextSteps: [
        "Geen actie nodig; herbeoordeel bij sterke groei van het energiegebruik.",
      ],
      sourceIds,
      assumptions,
    };
  }

  if (elektraCmp === null && gasCmp === null) {
    return {
      topicId: "onderzoeksplicht",
      status: "insufficient_data",
      confidence: "low",
      priority: "monitor",
      reasons: [
        "Zonder verbruiksgegevens kan de onderzoeksplicht-drempel niet worden getoetst.",
      ],
      missingInputs,
      nextSteps: ["Stel eerst uw jaarverbruik vast."],
      sourceIds,
      assumptions,
    };
  }

  return {
    topicId: "onderzoeksplicht",
    status: "possibly_applicable",
    confidence: "low",
    priority: "soon",
    reasons: [
      "Uw opgegeven verbruik ligt rond een drempel of is deels onbekend; de onderzoeksplicht kan niet worden uitgesloten.",
    ],
    missingInputs,
    nextSteps: [
      "Controleer het exacte jaarverbruik en vergelijk dit met de actuele RVO-drempels.",
    ],
    sourceIds,
    assumptions,
  };
}
