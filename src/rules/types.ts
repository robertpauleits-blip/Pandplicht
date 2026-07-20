/**
 * Domeintypes voor de PandPlicht rule engine.
 * Regels zijn indicatief: nooit "verplicht/niet verplicht" als juridisch oordeel.
 */

export type AssessmentStatus =
  | "likely_applicable" // Waarschijnlijk van toepassing
  | "possibly_applicable" // Mogelijk van toepassing
  | "likely_not_applicable" // Waarschijnlijk niet van toepassing
  | "insufficient_data"; // Meer informatie nodig

export type Confidence = "high" | "medium" | "low";

export type Priority = "now" | "soon" | "monitor" | "informational";

export type SourceRecord = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** Datum waarop de PandPlicht-redactie deze bron voor het laatst controleerde. */
  checkedAt: string;
  effectiveFrom?: string;
  notes?: string;
};

export type RuleResult = {
  topicId: TopicId;
  status: AssessmentStatus;
  confidence: Confidence;
  priority: Priority;
  /** Waarom ziet u dit? — leesbare redenen op basis van de invoer. */
  reasons: string[];
  /** Welke invoer ontbreekt nog voor een scherpere indicatie. */
  missingInputs: string[];
  /** Concrete vervolgstappen, in volgorde. */
  nextSteps: string[];
  sourceIds: string[];
  /** Aannames die in de beoordeling zijn gebruikt. */
  assumptions: string[];
};

export type TopicId =
  | "energiebesparingsplicht"
  | "informatieplicht"
  | "onderzoeksplicht"
  | "energielabel_c_kantoor"
  | "energielabel_transactie"
  | "netcongestie"
  | "batterijscan";

/* ------------------------------------------------------------------ */
/* Intake-invoer                                                       */
/* ------------------------------------------------------------------ */

export type Relatie =
  | "eigenaar_gebruiker"
  | "eigenaar_verhuurder"
  | "huurder"
  | "beheerder_adviseur"
  | "anders";

export type Hoofdgebruik =
  | "kantoor"
  | "winkel"
  | "horeca"
  | "industrie"
  | "opslag_logistiek"
  | "zorg"
  | "onderwijs"
  | "sport"
  | "bijeenkomst"
  | "gemengd"
  | "anders";

export type OppervlakteBand =
  | "lt100"
  | "b100_250"
  | "b250_1000"
  | "b1000_5000"
  | "gt5000"
  | "onbekend";

export type KantoorAandeel = "lt50" | "gte50" | "onbekend";

export type JaNeeOnbekend = "ja" | "nee" | "onbekend";

export type TransactieGepland = "ja" | "nee" | "mogelijk" | "onbekend";

export type ElektriciteitBand =
  | "lt10k"
  | "b10k_50k"
  | "b50k_200k"
  | "b200k_10m"
  | "gt10m";

export type GasBand = "lt3k" | "b3k_25k" | "b25k_75k" | "b75k_170k" | "gt170k";

export type EnergieWaarde<Band extends string> =
  | { type: "exact"; value: number }
  | { type: "band"; band: Band }
  | { type: "onbekend" };

export type Energielabel =
  | "A" // dekt ook A+ t/m A++++
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "geen"
  | "onbekend";

export type Aansluiting = "klein" | "groot" | "onbekend"; // t/m 3×80 A vs. groter

export type Plan =
  | "uitbreiding"
  | "warmtepomp"
  | "wagenpark"
  | "zonnepanelen"
  | "verhuizing"
  | "geen";

export type GrootsteProbleem =
  | "piekvermogen"
  | "teruglevering"
  | "uitbreiding"
  | "kosten"
  | "leveringszekerheid"
  | "onbekend";

export type BatterijDoel =
  | "peak_shaving"
  | "zon_later_gebruiken"
  | "uitbreiding_beperkt_vermogen"
  | "energiehandel"
  | "noodstroom"
  | "combinatie";

export type BatterijDetail = {
  hoofddoel: BatterijDoel | null;
  kwartierdataBeschikbaar: JaNeeOnbekend | null;
  piekKw: number | null;
  flexibelProfiel: JaNeeOnbekend | null;
  ruimteBeschikbaar: "ja" | "beperkt" | "nee" | "onbekend" | null;
  investeringshorizonJaren: "lt5" | "b5_10" | "gt10" | "onbekend" | null;
  noodstroomNodig: JaNeeOnbekend | null;
};

export type AdresGegevens = {
  postcode: string;
  huisnummer: string;
  toevoeging?: string;
  straat?: string;
  plaats?: string;
  gemeente?: string;
  provincie?: string;
  bouwjaar?: number;
  bagGebruiksdoelen?: string[];
  bagOppervlakteM2?: number;
  /** true wanneer de bezoeker handmatig invoerde (bijv. bij PDOK-storing). */
  handmatig?: boolean;
};

export type AssessmentInput = {
  adres: AdresGegevens | null;
  relatie: Relatie | null;
  hoofdgebruik: Hoofdgebruik | null;
  oppervlakteBand: OppervlakteBand | null;
  oppervlakteExactM2: number | null;
  kantoorAandeel: KantoorAandeel | null;
  monument: JaNeeOnbekend | null;
  transactieGepland: TransactieGepland | null;
  elektriciteit: EnergieWaarde<ElektriciteitBand> | null;
  gas: EnergieWaarde<GasBand> | null;
  energielabel: Energielabel | null;
  eigenOpwek: "geen" | "zon" | "wind" | "anders" | null;
  terugleveringKwh: number | null;
  aansluiting: Aansluiting | null;
  gecontracteerdVermogenKw: number | null;
  wachtOpAansluiting: JaNeeOnbekend | null;
  beperkingen: JaNeeOnbekend | null;
  plannen: Plan[];
  grootsteProbleem: GrootsteProbleem | null;
  batterij: BatterijDetail | null;
};

export type AssessmentOutcome = {
  rulesetVersion: string;
  calculatedAt: string;
  results: RuleResult[];
  /** Alle bron-IDs die in deze run zijn gebruikt. */
  sourceIds: string[];
};

/** Opgeslagen assessment (server-side, met onvoorspelbare token). */
export type StoredAssessment = {
  token: string;
  createdAt: string;
  input: AssessmentInput;
  outcome: AssessmentOutcome;
};
