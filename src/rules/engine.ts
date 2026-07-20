import type { AssessmentInput, AssessmentOutcome, RuleResult } from "./types";
import { RULESET_VERSION } from "./version";
import {
  assessEnergiebesparingsplicht,
  assessInformatieplicht,
  assessOnderzoeksplicht,
} from "./energy-obligations";
import { assessEnergielabelCKantoor } from "./office-label";
import { assessEnergielabelTransactie } from "./utility-label";
import { assessNetcongestie } from "./congestion";
import { assessBatterijscan } from "./battery";

/**
 * Draait alle regels deterministisch over de intake-invoer.
 * Zelfde invoer ⇒ zelfde uitkomst (op `calculatedAt` na).
 */
export function runAssessment(
  input: AssessmentInput,
  now: Date = new Date(),
): AssessmentOutcome {
  const besparingsplicht = assessEnergiebesparingsplicht(input);
  const onderzoeksplicht = assessOnderzoeksplicht(input);
  const informatieplicht = assessInformatieplicht(
    input,
    besparingsplicht,
    onderzoeksplicht,
  );

  const results: RuleResult[] = [
    besparingsplicht,
    informatieplicht,
    onderzoeksplicht,
    assessEnergielabelCKantoor(input),
    assessEnergielabelTransactie(input),
    assessNetcongestie(input),
    assessBatterijscan(input),
  ];

  const sourceIds = [...new Set(results.flatMap((r) => r.sourceIds))];

  return {
    rulesetVersion: RULESET_VERSION,
    calculatedAt: now.toISOString(),
    results,
    sourceIds,
  };
}

/** Sorteervolgorde voor presentatie: eerst urgent, dan status. */
const PRIORITY_ORDER = { now: 0, soon: 1, monitor: 2, informational: 3 } as const;
const STATUS_ORDER = {
  likely_applicable: 0,
  possibly_applicable: 1,
  insufficient_data: 2,
  likely_not_applicable: 3,
} as const;

export function sortResults(results: RuleResult[]): RuleResult[] {
  return [...results].sort(
    (a, b) =>
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );
}

/** Samenvatting in gewone taal voor bovenaan het rapport. */
export function summarize(results: RuleResult[]): string {
  const nAandacht = results.filter((r) => r.status === "likely_applicable").length;
  const nControle = results.filter(
    (r) => r.status === "possibly_applicable" || r.status === "insufficient_data",
  ).length;
  const nMinder = results.filter(
    (r) => r.status === "likely_not_applicable",
  ).length;

  const delen: string[] = [];
  if (nAandacht > 0) {
    delen.push(
      `${nAandacht === 1 ? "één onderwerp dat" : `${nAandacht} onderwerpen die`} waarschijnlijk direct aandacht ${nAandacht === 1 ? "vraagt" : "vragen"}`,
    );
  }
  if (nControle > 0) {
    delen.push(
      `${nControle === 1 ? "één onderwerp dat" : `${nControle} onderwerpen die`} u nader moet controleren`,
    );
  }
  if (nMinder > 0) {
    delen.push(
      `${nMinder === 1 ? "één onderwerp dat" : `${nMinder} onderwerpen die`} op dit moment minder waarschijnlijk ${nMinder === 1 ? "lijkt" : "lijken"}`,
    );
  }
  if (delen.length === 0) return "Op basis van uw antwoorden zijn er geen onderwerpen beoordeeld.";
  const laatste = delen.pop();
  const opsomming = delen.length > 0 ? `${delen.join(", ")} en ${laatste}` : laatste;
  return `Op basis van uw antwoorden zien wij ${opsomming}.`;
}
