import type { ComponentType } from "react";
import {
  IconBattery,
  IconGrid,
  IconMeter,
  IconPand,
} from "@/components/marketing/ToolIcons";

export type ToolPageData = {
  path: string;
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  intro: string;
  watChecktDeTool: string[];
  watHeeftUNodig: string[];
  watKrijgtU: string[];
  beperkingen: string;
  /** Focus-parameter voor de centrale wizard. */
  focus: string;
};

export const TOOL_PAGES: ToolPageData[] = [
  {
    path: "/tools/pandverplichtingencheck",
    slug: "pandverplichtingencheck",
    title: "Pandverplichtingencheck",
    metaTitle: "Pandverplichtingencheck voor bedrijfspanden",
    description:
      "Check gratis welke energie- en labelverplichtingen mogelijk voor uw bedrijfspand gelden, op basis van gebruik, oppervlakte en energieverbruik.",
    Icon: IconPand,
    intro:
      "Eén check die de belangrijkste pandverplichtingen langsloopt: de energiebesparingsplicht, de informatie- en onderzoeksplicht, de label-C-plicht voor kantoren en het energielabel bij verkoop of verhuur.",
    watChecktDeTool: [
      "Energiebesparingsplicht (drempels 50.000 kWh / 25.000 m³).",
      "Informatieplicht en onderzoeksplicht.",
      "Energielabel C voor kantoren, inclusief de belangrijkste uitzonderingen.",
      "Energielabel bij verkoop, nieuwe verhuur of oplevering.",
    ],
    watHeeftUNodig: [
      "Postcode en huisnummer van het pand.",
      "Jaarverbruik elektriciteit en gas (of een bandbreedte).",
      "Uw energielabel, als u dat kent — anders kiest u 'Onbekend'.",
    ],
    watKrijgtU: [
      "Per verplichting een genuanceerde status met uitleg.",
      "De gebruikte bronnen met controledatum.",
      "Een geordend actieplan en een printbaar rapport.",
    ],
    beperkingen:
      "De uitslag is indicatief en geen juridisch oordeel. Definitieve toepasselijkheid hangt af van details die alleen een volledige beoordeling kan vaststellen.",
    focus: "pandcheck",
  },
  {
    path: "/tools/energiebesparingsplicht-check",
    slug: "energiebesparingsplicht-check",
    title: "Energiebesparingsplichtcheck",
    metaTitle: "Energiebesparingsplichtcheck: toets de drempels",
    description:
      "Toets gratis of de energiebesparingsplicht, informatieplicht of onderzoeksplicht op uw locatie van toepassing kan zijn, op basis van uw jaarverbruik.",
    Icon: IconMeter,
    intro:
      "Deze check toetst uw jaarverbruik aan de actuele drempels van de energiebesparingsplicht (50.000 kWh / 25.000 m³) en de onderzoeksplicht (10 mln kWh / 170.000 m³), en legt uit wat de bijbehorende rapportageplicht betekent.",
    watChecktDeTool: [
      "Ligt uw locatie boven, onder of rond de drempels?",
      "Geldt daarmee mogelijk de informatieplicht (rapportage eens per vier jaar)?",
      "Is de onderzoeksplicht voor grootverbruikers mogelijk in beeld?",
    ],
    watHeeftUNodig: [
      "Jaarlijks elektriciteitsgebruik in kWh (jaarafrekening).",
      "Jaarlijks gasgebruik in m³ — of kies een bandbreedte of 'Weet ik niet'.",
    ],
    watKrijgtU: [
      "Een heldere drempeltoets met de gebruikte grenswaarden en bron.",
      "Concrete vervolgstappen, zoals de Erkende Maatregelenlijst doorlopen.",
      "Duidelijkheid over welke gegevens uw indicatie scherper maken.",
    ],
    beperkingen:
      "Rond de grens geeft de check bewust géén hard oordeel: een klein verschil in verbruik kan de uitkomst veranderen. Controleer altijd uw werkelijke jaarafrekening.",
    focus: "energiebesparing",
  },
  {
    path: "/tools/netcongestiecheck",
    slug: "netcongestiecheck",
    title: "Netcongestiecheck",
    metaTitle: "Netcongestiecheck voor ondernemers",
    description:
      "Breng gratis in beeld of netcongestie een risico is voor uw bedrijf: aansluiting, groeiplannen, teruglevering en concrete stappen richting uw netbeheerder.",
    Icon: IconGrid,
    intro:
      "Geen kaartkleuren of capaciteitsbeloftes, maar een eerlijke risico- en handelingsscan: wat betekenen uw aansluiting, plannen en signalen van de netbeheerder — en wat is uw logische volgende stap?",
    watChecktDeTool: [
      "Actuele knelpunten: gemelde beperkingen of een wachtende aanvraag.",
      "Verhoogde relevantie door uitbreidings- of elektrificatieplannen.",
      "Terugleverrisico's bij (geplande) zonnepanelen.",
    ],
    watHeeftUNodig: [
      "Uw aansluitingstype (t/m 3×80 A of groter) — staat op de netbeheerderfactuur.",
      "Eventuele berichten van uw netbeheerder.",
      "Uw plannen voor de komende drie jaar.",
    ],
    watKrijgtU: [
      "Een risico-indicatie met uitleg en prioriteit.",
      "Concrete vragen om aan uw netbeheerder te stellen.",
      "Oplossingsrichtingen zoals flexibiliteit, spreiding en opslag.",
    ],
    beperkingen:
      "PandPlicht gebruikt geen live netdata. De scan verzint geen capaciteit of kaartkleur; voor de actuele situatie verwijzen wij naar uw netbeheerder en de officiële kanalen, met de datum van onze indicatie erbij.",
    focus: "netcongestie",
  },
  {
    path: "/tools/zakelijke-batterijscan",
    slug: "zakelijke-batterijscan",
    title: "Zakelijke batterijscan",
    metaTitle: "Zakelijke batterijscan: is onderzoek zinvol?",
    description:
      "Ontdek gratis of nader onderzoek naar een zakelijke batterij zinvol lijkt — met een transparante onderzoeksscore, zonder ROI-beloftes.",
    Icon: IconBattery,
    intro:
      "De batterijscan beoordeelt of nader technisch en financieel onderzoek zinvol lijkt, met een transparante score van 0 tot 100 waarvan u alle onderdelen ziet. Géén definitieve capaciteit, géén terugverdientijd — wel een eerlijke volgende stap.",
    watChecktDeTool: [
      "Net- of uitbreidingsknelpunten (max. 20 punten).",
      "Piekvermogensvraag (20) en eigen opwek met overschot (20).",
      "Flexibiliteit (15), economisch doel en horizon (10), meetdata (10), ruimte (5).",
    ],
    watHeeftUNodig: [
      "Uw hoofddoel: pieken, zon, uitbreiding, handel of noodstroom.",
      "Indien beschikbaar: kwartierdata en uw hoogste piek in kW.",
      "Uw teruglevering per jaar bij zonnepanelen.",
    ],
    watKrijgtU: [
      "Een onderzoeksscore met alle deelscores zichtbaar.",
      "Eerlijke duiding: kansrijk, meer meetdata nodig, of niet de eerste stap.",
      "Het advies om kwartierdata te exporteren vóór u offertes aanvraagt.",
    ],
    beperkingen:
      "De scan geeft nooit een ROI, batterijvermogen of capaciteit als exact advies. Ontbrekende meetdata verlaagt de zekerheid — dat ziet u terug in de uitslag. Denk ook aan de registratieplicht voor batterijsystemen.",
    focus: "batterij",
  },
];

export function getToolPage(slug: string): ToolPageData | undefined {
  return TOOL_PAGES.find((t) => t.slug === slug);
}
