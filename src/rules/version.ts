/**
 * Versie van de regelset. Verhoog bij iedere inhoudelijke wijziging en
 * documenteer de wijziging in het changelog hieronder.
 */
export const RULESET_VERSION = "1.0.0";

export const RULESET_CHANGELOG: {
  version: string;
  date: string;
  changes: string[];
}[] = [
  {
    version: "1.0.0",
    date: "2026-07-20",
    changes: [
      "Eerste regelset: energiebesparingsplicht (50.000 kWh / 25.000 m³), informatieplicht, onderzoeksplicht (10 mln kWh / 170.000 m³), energielabel C kantoren (incl. 100 m²-grens, <50% kantooraandeel en monumentuitzondering), energielabel bij verkoop/verhuur/oplevering, netcongestie-risicoscan en zakelijke batterij-onderzoeksscore.",
      "Alle drempels zijn configureerbare startwaarden op basis van RVO-bronnen, gecontroleerd op 2026-07-20.",
    ],
  },
];

/**
 * Configureerbare drempelwaarden. Dit zijn indicatieve startwaarden op basis
 * van de gecontroleerde bronnen — geen onveranderlijke waarheid. Controleer
 * vóór livegang opnieuw bij RVO.
 */
export const THRESHOLDS = {
  /** Energiebesparingsplicht: jaarlijks elektriciteitsgebruik per locatie (kWh). */
  besparingsplichtKwh: 50_000,
  /** Energiebesparingsplicht: jaarlijks aardgas(equivalent) per locatie (m³). */
  besparingsplichtGasM3: 25_000,
  /** Onderzoeksplicht: jaarlijks elektriciteitsgebruik (kWh). */
  onderzoeksplichtKwh: 10_000_000,
  /** Onderzoeksplicht: jaarlijks aardgas(equivalent) (m³). */
  onderzoeksplichtGasM3: 170_000,
  /** Label C kantoren: ondergrens gebruiksoppervlak kantoorgebouw (m²). */
  kantoorLabelMinM2: 100,
  /** Marge (fractie) waarbinnen "rond de grens" geldt. */
  grensMarge: 0.1,
  /** Batterijregistratie vanaf dit vermogen (kW); controleer vóór livegang. */
  batterijRegistratieKw: 0.8,
} as const;
