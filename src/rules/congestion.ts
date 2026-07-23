import type { AssessmentInput, RuleResult } from "./types";

const SOURCES = ["rvo-grid-congestion", "rvo-grid-guide", "rvo-grid-loket"];

const ASSUMPTIONS = [
  "Dit is een risico- en handelingsscan zonder live netdata: een postcode of kaartkleur garandeert niets over één specifieke aansluiting.",
  "De definitieve situatie hoort u altijd van uw netbeheerder.",
];

const GROEI_PLANNEN = new Set([
  "uitbreiding",
  "warmtepomp",
  "wagenpark",
  "zonnepanelen",
]);

/**
 * Netcongestie, risico- en handelingsscan (geen capaciteitsbelofte).
 */
export function assessNetcongestie(input: AssessmentInput): RuleResult {
  const missingInputs: string[] = [];
  if (input.aansluiting === null || input.aansluiting === "onbekend") {
    missingInputs.push("Type aansluiting (t/m 3×80 A of groter)");
  }
  if (input.beperkingen === null || input.beperkingen === "onbekend") {
    missingInputs.push("Heeft de netbeheerder beperkingen gemeld?");
  }

  const groeiplannen = input.plannen.filter((p) => GROEI_PLANNEN.has(p));
  const heeftKnelpunt =
    input.beperkingen === "ja" || input.wachtOpAansluiting === "ja";
  const terugleverFocus =
    input.eigenOpwek === "zon" &&
    (input.grootsteProbleem === "teruglevering" ||
      (input.terugleveringKwh ?? 0) > 0);

  if (heeftKnelpunt) {
    const reasons: string[] = [];
    if (input.beperkingen === "ja") {
      reasons.push(
        "U geeft aan dat er beperkingen op afname of teruglevering bestaan.",
      );
    }
    if (input.wachtOpAansluiting === "ja") {
      reasons.push(
        "U wacht op een nieuwe of zwaardere aansluiting; wachttijden zijn in congestiegebieden vaak lang.",
      );
    }
    return {
      topicId: "netcongestie",
      status: "likely_applicable",
      confidence: "medium",
      priority: "now",
      reasons,
      missingInputs,
      nextSteps: [
        "Vraag uw netbeheerder schriftelijk naar de actuele status van uw aanvraag of beperking.",
        "Controleer uw gecontracteerd transportvermogen en werkelijke pieken (kwartierdata).",
        "Bekijk de RVO-wegwijzer netcongestie voor oplossingsrichtingen (flexibiliteit, spreiding, opslag).",
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  if (groeiplannen.length > 0) {
    return {
      topicId: "netcongestie",
      status: "possibly_applicable",
      confidence: input.aansluiting === "onbekend" ? "low" : "medium",
      priority: "soon",
      reasons: [
        "U heeft plannen die het elektriciteitsgebruik of de teruglevering kunnen verhogen (zoals uitbreiding, elektrificatie of extra zon).",
        "In gebieden met netcongestie kan extra capaciteit beperkt beschikbaar zijn; check dit vóór u investeert.",
      ],
      missingInputs,
      nextSteps: [
        "Vraag uw netbeheerder vroegtijdig of uw plannen binnen de huidige aansluiting passen.",
        "Breng uw piekverbruik in kaart met kwartierdata voordat u een zwaardere aansluiting aanvraagt.",
        "Verken alternatieven zoals slim laden, spreiding van verbruik of opslag.",
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  if (terugleverFocus) {
    return {
      topicId: "netcongestie",
      status: "possibly_applicable",
      confidence: "medium",
      priority: "soon",
      reasons: [
        "U levert zonnestroom terug (of wilt dat gaan doen); in congestiegebieden kan invoeding beperkt of begrensd worden.",
      ],
      missingInputs,
      nextSteps: [
        "Controleer bij uw netbeheerder of er beperkingen op teruglevering gelden op uw locatie.",
        "Onderzoek of eigen gebruik van zonnestroom (eventueel met opslag) aantrekkelijker is dan terugleveren.",
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  const teWeinigData =
    (input.aansluiting === null || input.aansluiting === "onbekend") &&
    (input.beperkingen === null || input.beperkingen === "onbekend") &&
    input.plannen.length === 0;

  if (teWeinigData) {
    return {
      topicId: "netcongestie",
      status: "insufficient_data",
      confidence: "low",
      priority: "monitor",
      reasons: [
        "Er is te weinig informatie over uw aansluiting, meldingen van de netbeheerder en plannen voor een locatiespecifieke indicatie.",
      ],
      missingInputs,
      nextSteps: [
        "Zoek uw aansluitgegevens op (contract of factuur van de netbeheerder).",
        "Vraag uw netbeheerder naar de situatie op uw locatie.",
      ],
      sourceIds: SOURCES,
      assumptions: ASSUMPTIONS,
    };
  }

  return {
    topicId: "netcongestie",
    status: "likely_not_applicable",
    confidence: "medium",
    priority: "monitor",
    reasons: [
      "Op basis van uw antwoorden is er nu geen concreet knelpunt bekend: geen gemelde beperkingen, geen wachtende aanvraag en geen grote groeiplannen.",
      "Netcongestie kan zich wel ontwikkelen; blijf de situatie volgen bij plannen of signalen van de netbeheerder.",
    ],
    missingInputs,
    nextSteps: [
      "Bewaar uw aansluit- en contractgegevens overzichtelijk.",
      "Check de situatie opnieuw vóór grote investeringen in elektrificatie of uitbreiding.",
    ],
    sourceIds: SOURCES,
    assumptions: ASSUMPTIONS,
  };
}
