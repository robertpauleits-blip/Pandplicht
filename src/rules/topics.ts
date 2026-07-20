import type { AssessmentStatus, Priority, TopicId } from "./types";

export const TOPIC_META: Record<
  TopicId,
  { title: string; shortTitle: string; infoHref: string }
> = {
  energiebesparingsplicht: {
    title: "Energiebesparingsplicht",
    shortTitle: "Energiebesparingsplicht",
    infoHref: "/verplichtingen/energiebesparingsplicht",
  },
  informatieplicht: {
    title: "Informatieplicht energiebesparing",
    shortTitle: "Informatieplicht",
    infoHref: "/verplichtingen/informatieplicht-energiebesparing",
  },
  onderzoeksplicht: {
    title: "Onderzoeksplicht energiebesparing",
    shortTitle: "Onderzoeksplicht",
    infoHref: "/verplichtingen/onderzoeksplicht-energiebesparing",
  },
  energielabel_c_kantoor: {
    title: "Energielabel C voor kantoren",
    shortTitle: "Label C kantoor",
    infoHref: "/verplichtingen/energielabel-c-kantoren",
  },
  energielabel_transactie: {
    title: "Energielabel bij verkoop, verhuur of oplevering",
    shortTitle: "Label bij transactie",
    infoHref: "/verplichtingen/energielabel-utiliteitsgebouw",
  },
  netcongestie: {
    title: "Netcongestie-risico",
    shortTitle: "Netcongestie",
    infoHref: "/netcongestie",
  },
  batterijscan: {
    title: "Zakelijke batterij: is onderzoek zinvol?",
    shortTitle: "Batterijonderzoek",
    infoHref: "/zakelijke-batterij",
  },
};

export const STATUS_META: Record<
  AssessmentStatus,
  { label: string; tone: "yes" | "maybe" | "no" | "unknown" }
> = {
  likely_applicable: { label: "Waarschijnlijk van toepassing", tone: "yes" },
  possibly_applicable: { label: "Mogelijk van toepassing", tone: "maybe" },
  likely_not_applicable: {
    label: "Waarschijnlijk niet van toepassing",
    tone: "no",
  },
  insufficient_data: { label: "Meer informatie nodig", tone: "unknown" },
};

/** Afwijkende statuslabels voor niet-plicht-onderwerpen (risico/kansen). */
export const STATUS_LABEL_OVERRIDES: Partial<
  Record<TopicId, Partial<Record<AssessmentStatus, string>>>
> = {
  netcongestie: {
    likely_applicable: "Actueel knelpunt aangegeven",
    possibly_applicable: "Verhoogde relevantie",
    likely_not_applicable: "Geen concreet knelpunt bekend",
    insufficient_data: "Onvoldoende informatie",
  },
  batterijscan: {
    likely_applicable: "Nader batterijonderzoek lijkt kansrijk",
    possibly_applicable: "Mogelijk interessant, meer meetdata nodig",
    likely_not_applicable: "Niet de logische eerste stap",
    insufficient_data: "Onvoldoende informatie",
  },
};

export const PRIORITY_META: Record<Priority, { label: string }> = {
  now: { label: "Nu bekijken" },
  soon: { label: "Binnenkort controleren" },
  monitor: { label: "Blijven volgen" },
  informational: { label: "Ter informatie" },
};

export const CONFIDENCE_META = {
  high: { label: "Hoge zekerheid" },
  medium: { label: "Gemiddelde zekerheid" },
  low: { label: "Lage zekerheid" },
} as const;
