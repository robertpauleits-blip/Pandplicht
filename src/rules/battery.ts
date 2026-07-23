import type { AssessmentInput, RuleResult } from "./types";
import { toRange } from "./helpers";
import { THRESHOLDS } from "./version";

const SOURCES = ["rvo-battery-investment", "rvo-battery-register", "rvo-grid-guide"];

const ASSUMPTIONS = [
  "De batterijscan beoordeelt of nader technisch en financieel onderzoek zinvol lijkt; het is geen batterijontwerp, ROI-berekening of offerte.",
  `Batterijsystemen moeten vanaf een actueel te verifiëren vermogensgrens worden geregistreerd; RVO noemt momenteel ${THRESHOLDS.batterijRegistratieKw} kW.`,
];

export type BatteryScore = {
  total: number;
  parts: {
    knelpunt: number; // max 20
    piek: number; // max 20
    opwek: number; // max 20
    flexibiliteit: number; // max 15
    economisch: number; // max 10
    meetdata: number; // max 10
    fysiek: number; // max 5
  };
  /** Aantal deelscores dat op aannames/ontbrekende data is gebaseerd. */
  missingCount: number;
};

/**
 * Transparante onderzoeksscore 0–100 volgens de vastgelegde weging.
 * Ontbrekende data geeft 0 punten voor dat onderdeel en verlaagt de zekerheid.
 */
export function computeBatteryScore(input: AssessmentInput): BatteryScore {
  const b = input.batterij;
  let missingCount = 0;

  // 1. Aantoonbaar net- of uitbreidingsknelpunt, max 20.
  let knelpunt = 0;
  if (input.beperkingen === "ja") knelpunt += 12;
  if (input.wachtOpAansluiting === "ja") knelpunt += 8;
  if (
    knelpunt === 0 &&
    (input.plannen.includes("uitbreiding") ||
      input.grootsteProbleem === "uitbreiding")
  ) {
    knelpunt = 6;
  }
  if (input.beperkingen === null || input.beperkingen === "onbekend") {
    missingCount += knelpunt === 0 ? 1 : 0;
  }
  knelpunt = Math.min(knelpunt, 20);

  // 2. Betekenisvolle piekvermogensvraag, max 20.
  let piek = 0;
  if (b?.piekKw != null) {
    if (b.piekKw >= 100) piek = 20;
    else if (b.piekKw >= 50) piek = 15;
    else if (b.piekKw >= 20) piek = 10;
    else piek = 4;
  } else if (
    input.grootsteProbleem === "piekvermogen" ||
    b?.hoofddoel === "peak_shaving"
  ) {
    piek = 10; // doel wijst op piekvraag, maar zonder meting blijft het een aanname
  } else {
    missingCount += 1;
  }

  // 3. Eigen opwek en structureel overschot, max 20.
  let opwek = 0;
  if (input.eigenOpwek === "zon" || input.eigenOpwek === "wind") {
    opwek += 8;
    if ((input.terugleveringKwh ?? 0) >= 20_000) opwek += 12;
    else if ((input.terugleveringKwh ?? 0) >= 5_000) opwek += 8;
    else if (input.terugleveringKwh == null) {
      opwek += 4; // opwek zonder bekende teruglevering
      missingCount += 1;
    }
  } else if (input.eigenOpwek === null) {
    missingCount += 1;
  } else if (input.plannen.includes("zonnepanelen")) {
    opwek = 6;
  }
  opwek = Math.min(opwek, 20);

  // 4. Flexibiliteit in laden/ontladen en bedrijfsprofiel, max 15.
  let flexibiliteit = 0;
  if (b?.flexibelProfiel === "ja") flexibiliteit = 13;
  else if (b?.flexibelProfiel === "nee") flexibiliteit = 4;
  else missingCount += 1;

  // 5. Economisch doel en investeringshorizon, max 10.
  let economisch = 0;
  if (b?.hoofddoel && b.hoofddoel !== "noodstroom") economisch += 5;
  if (b?.investeringshorizonJaren === "b5_10" || b?.investeringshorizonJaren === "gt10") {
    economisch += 5;
  } else if (b?.investeringshorizonJaren === "lt5") {
    economisch += 2;
  } else if (b?.investeringshorizonJaren == null) {
    missingCount += 1;
  }
  economisch = Math.min(economisch, 10);

  // 6. Voldoende meetdata, max 10.
  let meetdata = 0;
  if (b?.kwartierdataBeschikbaar === "ja") meetdata = 10;
  else if (b?.kwartierdataBeschikbaar === "nee") meetdata = 0;
  else missingCount += 1;
  const elektra = toRange(input.elektriciteit, "elektra");
  if (meetdata === 0 && elektra && input.elektriciteit?.type === "exact") {
    meetdata = 3; // jaarcijfers zijn beperkt bruikbaar, beter dan niets
  }
  meetdata = Math.min(meetdata, 10);

  // 7. Globale fysieke haalbaarheid, max 5.
  let fysiek = 0;
  if (b?.ruimteBeschikbaar === "ja") fysiek = 5;
  else if (b?.ruimteBeschikbaar === "beperkt") fysiek = 3;
  else if (b?.ruimteBeschikbaar === "nee") fysiek = 0;
  else missingCount += 1;

  const parts = { knelpunt, piek, opwek, flexibiliteit, economisch, meetdata, fysiek };
  const total = Math.min(
    100,
    knelpunt + piek + opwek + flexibiliteit + economisch + meetdata + fysiek,
  );
  return { total, parts, missingCount };
}

export function batteryCategory(
  total: number,
): "kansrijk" | "meer_data" | "niet_eerste_stap" {
  if (total >= 70) return "kansrijk";
  if (total >= 45) return "meer_data";
  return "niet_eerste_stap";
}

/**
 * Zakelijke batterijscan, beoordeelt of nader onderzoek zinvol lijkt.
 */
export function assessBatterijscan(input: AssessmentInput): RuleResult {
  const score = computeBatteryScore(input);
  const cat = batteryCategory(score.total);

  const missingInputs: string[] = [];
  const b = input.batterij;
  if (!b || b.kwartierdataBeschikbaar == null) {
    missingInputs.push("Beschikbaarheid van kwartierdata");
  }
  if (!b || b.piekKw == null) missingInputs.push("Hoogste gemeten piekvermogen (kW)");
  if (input.eigenOpwek === null) missingInputs.push("Eigen opwek en teruglevering");
  if (!b || b.ruimteBeschikbaar == null) {
    missingInputs.push("Globale fysieke ruimte voor een batterijsysteem");
  }

  // Alleen noodstroom als doel: batterij kan, maar dat is een ander vraagstuk.
  const alleenNoodstroom = b?.hoofddoel === "noodstroom";

  const confidence: RuleResult["confidence"] =
    score.missingCount >= 4 ? "low" : score.missingCount >= 2 ? "medium" : "high";

  const reasons: string[] = [
    `Onderzoeksscore: ${score.total} van 100 (knelpunt ${score.parts.knelpunt}/20, piek ${score.parts.piek}/20, opwek ${score.parts.opwek}/20, flexibiliteit ${score.parts.flexibiliteit}/15, economisch ${score.parts.economisch}/10, meetdata ${score.parts.meetdata}/10, ruimte ${score.parts.fysiek}/5).`,
  ];
  if (score.missingCount > 0) {
    reasons.push(
      `Voor ${score.missingCount} onderdeel${score.missingCount === 1 ? "" : "en"} ontbreken gegevens; ontbrekende data verlaagt de zekerheid van deze score.`,
    );
  }
  if (alleenNoodstroom) {
    reasons.push(
      "Uw hoofddoel is noodstroom; dat vraagt om een andere afweging (UPS/noodstroomvoorziening) dan een batterij voor pieken of eigen opwek.",
    );
  }

  const baseNextSteps = [
    "Exporteer kwartierdata bij uw meetbedrijf of netbeheerder voordat u offertes aanvraagt.",
    "Laat een specialist het batterijvermogen en de capaciteit dimensioneren op basis van die data.",
    `Houd rekening met registratie van het batterijsysteem (grens momenteel ${THRESHOLDS.batterijRegistratieKw} kW; controleer actueel bij RVO).`,
  ];

  if (cat === "kansrijk" && !alleenNoodstroom) {
    return {
      topicId: "batterijscan",
      status: "likely_applicable",
      confidence,
      priority: "soon",
      reasons: [
        "Meerdere signalen wijzen op mogelijke waarde: " +
          [
            score.parts.knelpunt >= 10 ? "een net- of uitbreidingsknelpunt" : null,
            score.parts.piek >= 10 ? "een betekenisvolle piekvraag" : null,
            score.parts.opwek >= 10 ? "eigen opwek met overschot" : null,
          ]
            .filter(Boolean)
            .join(", ") + ".",
        ...reasons,
      ],
      missingInputs,
      nextSteps: baseNextSteps,
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  if (cat === "meer_data") {
    return {
      topicId: "batterijscan",
      status: "possibly_applicable",
      confidence,
      priority: "soon",
      reasons,
      missingInputs,
      nextSteps: [
        "Verzamel eerst kwartierdata en uw werkelijke piekvermogen; daarmee wordt de afweging concreet.",
        ...baseNextSteps.slice(1),
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  return {
    topicId: "batterijscan",
    status: "likely_not_applicable",
    confidence,
    priority: "informational",
    reasons: [
      "Op basis van deze gegevens is een batterij niet de logische eerste stap; er is geen duidelijk knelpunt, piekvraag of opwekoverschot.",
      ...reasons,
    ],
    missingInputs,
    nextSteps: [
      "Kijk eerst naar energiebesparing en slimmer verbruik (bijvoorbeeld spreiding van pieken).",
      "Herhaal de scan wanneer uw situatie verandert (zonnepanelen, elektrificatie, netbeperkingen).",
    ],
    sourceIds: SOURCES,
    assumptions: ASSUMPTIONS,
  };
}
