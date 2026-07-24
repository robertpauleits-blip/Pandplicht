"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  AssessmentInput,
  AssessmentOutcome,
  ElektriciteitBand,
  GasBand,
} from "@/rules/types";
import { ELEKTRA_BANDS, GAS_BANDS } from "@/rules/helpers";
import { runAssessment } from "@/rules/engine";
import { track } from "@/lib/analytics";
import { WizardSkeleton } from "@/features/assessment/WizardSkeleton";
import {
  CheckboxCards,
  FieldGroup,
  RadioCards,
  TextInput,
} from "./fields";
import type { AddressSuggestion } from "@/lib/address/pdok";
import type { EnergyLabelLookup } from "@/lib/address/ep-online";

const STORAGE_KEY = "pp-check-v1";
const TOTAL_STEPS = 6;

const STEP_NAMES = [
  "Locatie",
  "Uw relatie tot het pand",
  "Gebruik en omvang",
  "Energie en labels",
  "Aansluiting en plannen",
  "Controle",
];

function emptyInput(): AssessmentInput {
  return {
    adres: null,
    relatie: null,
    hoofdgebruik: null,
    oppervlakteBand: null,
    oppervlakteExactM2: null,
    kantoorAandeel: null,
    monument: null,
    transactieGepland: null,
    elektriciteit: null,
    gas: null,
    energielabel: null,
    eigenOpwek: null,
    terugleveringKwh: null,
    aansluiting: null,
    gecontracteerdVermogenKw: null,
    wachtOpAansluiting: null,
    beperkingen: null,
    plannen: [],
    grootsteProbleem: null,
    batterij: null,
  };
}

type Saved = { step: number; input: AssessmentInput };

function loadSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Saved;
  } catch {
    return null;
  }
}

/** Client-side onvoorspelbare token als fallback wanneer de API faalt. */
function clientToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function Wizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<AssessmentInput>(emptyInput);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Adres-zoekstate (stap 1)
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [toevoeging, setToevoeging] = useState("");
  const [suggesties, setSuggesties] = useState<AddressSuggestion[] | null>(null);
  const [adresFout, setAdresFout] = useState<string | null>(null);
  const [zoeken, setZoeken] = useState(false);
  const [handmatig, setHandmatig] = useState(false);
  const [plaatsHandmatig, setPlaatsHandmatig] = useState("");

  // EP-Online: automatisch label + oppervlakte ophalen
  const [labelLookup, setLabelLookup] = useState<
    EnergyLabelLookup | { status: "loading" } | null
  >(null);
  const [oppervlakteHandmatig, setOppervlakteHandmatig] = useState(false);
  const [labelHandmatig, setLabelHandmatig] = useState(false);
  const lookedUpKey = useRef<string | null>(null);
  const kiesSuggestieRef = useRef<(s: AddressSuggestion) => void>(() => {});
  const autoSearched = useRef(false);

  // Herstel opgeslagen sessie of neem querystring van de adresstarter over.
  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setInput(saved.input);
      setStep(saved.step);
      if (saved.input.adres) {
        setPostcode(saved.input.adres.postcode);
        setHuisnummer(saved.input.adres.huisnummer);
        setToevoeging(saved.input.adres.toevoeging ?? "");
      }
    } else {
      const qp = searchParams.get("postcode");
      const qh = searchParams.get("huisnummer");
      const qt = searchParams.get("toevoeging");
      if (qp) setPostcode(qp.toUpperCase());
      if (qh) setHuisnummer(qh);
      if (qt) setToevoeging(qt);
      track("assessment_started", {
        tool: searchParams.get("focus") ?? "pandcheck",
      });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatische opslag in sessionStorage.
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, input }));
    } catch {
      /* opslag is best effort */
    }
  }, [step, input, hydrated]);

  // Focusbeheer: naar de stapkop bij navigatie (niet bij eerste render).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    track("assessment_step_viewed", { step });
  }, [step]);

  // Komt de bezoeker met postcode + huisnummer vanaf de homepage?
  // Zoek het adres dan automatisch op, zodat stap 1 niet opnieuw hoeft.
  useEffect(() => {
    if (!hydrated || autoSearched.current) return;
    autoSearched.current = true;
    const qp = searchParams.get("postcode");
    const qh = searchParams.get("huisnummer");
    const qt = searchParams.get("toevoeging") ?? undefined;
    if (qp && qh && !input.adres) {
      void zoekAdres({ pc: qp, hn: qh, toev: qt });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const patch = useCallback((p: Partial<AssessmentInput>) => {
    setInput((cur) => ({ ...cur, ...p }));
  }, []);

  const goto = useCallback((n: number) => {
    setStepError(null);
    setStep(Math.min(Math.max(n, 1), TOTAL_STEPS));
  }, []);

  const next = useCallback(() => {
    track("assessment_step_completed", { step });
    goto(step + 1);
  }, [goto, step]);

  /* ---------------- Stap 1: adres zoeken ---------------- */

  const zoekAdres = useCallback(
    async (override?: { pc: string; hn: string; toev?: string }) => {
    setAdresFout(null);
    setSuggesties(null);
    // Bij de automatische start lezen we rechtstreeks uit de link (override),
    // zodat we niet afhankelijk zijn van nog niet-ingeladen invoervelden.
    const pc = (override?.pc ?? postcode).trim().toUpperCase().replace(/\s+/g, " ");
    const hn = (override?.hn ?? huisnummer).trim();
    const toev = (override?.toev ?? toevoeging).trim();
    if (!/^[1-9][0-9]{3}\s?[A-Z]{2}$/.test(pc) || !/^[0-9]{1,5}$/.test(hn)) {
      setAdresFout(
        "Vul een geldige Nederlandse postcode (bijv. 1234 AB) en een huisnummer in.",
      );
      track("assessment_validation_error", { step: 1, errorCode: "address_format" });
      return;
    }
    setZoeken(true);
    try {
      const q = `${pc} ${hn}${toev ? ` ${toev}` : ""}`;
      const res = await fetch(`/api/address/suggest?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("suggest_failed");
      const data = (await res.json()) as { suggestions: AddressSuggestion[] };
      // Alleen exacte treffers op postcode én huisnummer accepteren. Zo
      // voorkomen we dat een tikfout (bijv. 9999 ZZ) willekeurige adressen
      // door heel Nederland toont die alleen toevallig het huisnummer delen.
      const norm = (s: string) => s.toUpperCase().replace(/\s+/g, "");
      const exact = data.suggestions.filter(
        (s) =>
          s.postcode &&
          norm(s.postcode) === norm(pc) &&
          (s.huisnummer ?? "").replace(/\D/g, "") === hn,
      );
      if (exact.length === 1 && exact[0]) {
        // Eén exacte treffer: direct kiezen.
        kiesSuggestieRef.current(exact[0]);
      } else if (exact.length > 1) {
        // Meerdere exacte treffers (bijv. verschillende toevoegingen): toon
        // uitsluitend die sterk overeenkomende opties, gemaximeerd.
        setSuggesties(exact.slice(0, 6));
      } else {
        setAdresFout(
          "Wij konden dit adres niet exact vinden. Controleer de postcode en het huisnummer, of ga verder met handmatige invoer.",
        );
      }
    } catch {
      setAdresFout(
        "Wij kunnen dit adres nu niet automatisch ophalen. U kunt verdergaan met handmatige invoer; de uitslag wordt daardoor iets minder specifiek.",
      );
    } finally {
      setZoeken(false);
    }
    },
    [postcode, huisnummer, toevoeging],
  );

  // Haal automatisch het geregistreerde energielabel + oppervlakte op.
  // Vult de betreffende velden vooraf in; faalt het (geen sleutel/geen label),
  // dan blijven de handmatige velden gewoon beschikbaar.
  const lookupLabel = useCallback(
    async (pc: string, hn: string, toev?: string) => {
      const key = `${pc}-${hn}-${toev ?? ""}`.toUpperCase();
      if (lookedUpKey.current === key) return;
      lookedUpKey.current = key;
      setLabelLookup({ status: "loading" });
      setOppervlakteHandmatig(false);
      setLabelHandmatig(false);
      try {
        const qs = new URLSearchParams({ postcode: pc, huisnummer: hn });
        if (toev) qs.set("toevoeging", toev);
        const res = await fetch(`/api/energylabel?${qs.toString()}`);
        const data = (await res.json()) as EnergyLabelLookup;
        setLabelLookup(data);
        if (data.status === "found") {
          patch({
            energielabel: data.label,
            ...(data.oppervlakteM2
              ? { oppervlakteExactM2: data.oppervlakteM2, oppervlakteBand: null }
              : {}),
          });
        }
      } catch {
        setLabelLookup({ status: "error" });
      }
    },
    [patch],
  );

  const kiesSuggestie = useCallback(
    (s: AddressSuggestion) => {
      const pc = (s.postcode ?? postcode.trim()).toUpperCase().replace(/\s+/g, "");
      const hn = (s.huisnummer ?? huisnummer.trim()).replace(/\D/g, "");
      patch({
        adres: {
          postcode: s.postcode ?? postcode.trim().toUpperCase(),
          huisnummer: s.huisnummer ?? huisnummer.trim(),
          ...(toevoeging.trim() ? { toevoeging: toevoeging.trim() } : {}),
          ...(s.straat ? { straat: s.straat } : {}),
          ...(s.plaats ? { plaats: s.plaats } : {}),
          ...(s.gemeente ? { gemeente: s.gemeente } : {}),
          ...(s.provincie ? { provincie: s.provincie } : {}),
          handmatig: false,
        },
      });
      setSuggesties(null);
      void lookupLabel(pc, hn, toevoeging.trim() || undefined);
    },
    [patch, postcode, huisnummer, toevoeging, lookupLabel],
  );

  // Houd de ref actueel zodat de auto-zoek (bij één treffer) kan selecteren.
  useEffect(() => {
    kiesSuggestieRef.current = kiesSuggestie;
  }, [kiesSuggestie]);

  const bevestigHandmatig = useCallback(() => {
    const pc = postcode.trim().toUpperCase().replace(/\s+/g, " ");
    const hn = huisnummer.trim();
    if (!/^[1-9][0-9]{3}\s?[A-Z]{2}$/.test(pc) || !/^[0-9]{1,5}$/.test(hn)) {
      setAdresFout("Vul een geldige postcode en huisnummer in.");
      return;
    }
    patch({
      adres: {
        postcode: pc,
        huisnummer: hn,
        ...(toevoeging.trim() ? { toevoeging: toevoeging.trim() } : {}),
        ...(plaatsHandmatig.trim() ? { plaats: plaatsHandmatig.trim() } : {}),
        handmatig: true,
      },
    });
    setAdresFout(null);
    void lookupLabel(
      pc.replace(/\s+/g, ""),
      hn,
      toevoeging.trim() || undefined,
    );
  }, [patch, postcode, huisnummer, toevoeging, plaatsHandmatig, lookupLabel]);

  /* ---------------- Berekenen (stap 6) ---------------- */

  const bereken = useCallback(async () => {
    setBusy(true);
    setStepError(null);
    let token: string;
    let outcome: AssessmentOutcome;
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("api_failed");
      const data = (await res.json()) as { token: string; outcome: AssessmentOutcome };
      token = data.token;
      outcome = data.outcome;
    } catch {
      // Fallback: deterministische berekening in de browser met dezelfde
      // rules-package; uitslag blijft volledig beschikbaar.
      token = clientToken();
      outcome = runAssessment(input);
    }
    try {
      sessionStorage.setItem(
        `pp-uitslag-${token}`,
        JSON.stringify({ token, createdAt: new Date().toISOString(), input, outcome }),
      );
    } catch {
      /* best effort */
    }
    track("assessment_completed", {});
    router.push(`/pandcheck/uitslag/${token}`);
  }, [input, router]);

  const wissen = useCallback(() => {
    if (
      window.confirm(
        "Weet u zeker dat u alle ingevulde antwoorden wilt wissen? Dit kan niet ongedaan worden gemaakt.",
      )
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      setInput(emptyInput());
      setPostcode("");
      setHuisnummer("");
      setToevoeging("");
      setSuggesties(null);
      setHandmatig(false);
      goto(1);
    }
  }, [goto]);

  if (!hydrated) {
    return <WizardSkeleton />;
  }

  const stepName = STEP_NAMES[step - 1] ?? "";

  const toonBatterijvragen =
    input.eigenOpwek === "zon" ||
    input.plannen.some((p) => ["zonnepanelen", "uitbreiding", "wagenpark", "warmtepomp"].includes(p)) ||
    ["piekvermogen", "teruglevering", "uitbreiding", "leveringszekerheid"].includes(
      input.grootsteProbleem ?? "",
    ) ||
    searchParams.get("focus") === "batterij";

  return (
    <div className="mx-auto max-w-2xl">
      {/* Voortgang */}
      <div className="mb-6">
        <p className="text-sm font-bold text-pine" aria-live="polite">
          Stap {step} van {TOTAL_STEPS} • {stepName}
          <span className="font-normal text-ink-soft">
            {" "}
            • nog ± {Math.max(TOTAL_STEPS - step, 0)} min
          </span>
        </p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Stap ${step} van ${TOTAL_STEPS}`}
        >
          <div
            className="h-full rounded-full bg-action transition-[width] duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-8">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mb-6 text-2xl font-extrabold tracking-tight text-ink outline-none"
        >
          {stepName}
        </h2>

        {/* ---------------- STAP 1 ---------------- */}
        {step === 1 ? (
          <div>
            <p className="mb-5 text-ink-soft">
              Met uw adres halen wij openbare basisgegevens op (zoals gemeente
              en provincie). Uw adres wordt alleen voor deze check gebruikt.
            </p>
            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.8fr_0.7fr]">
              <TextInput
                id="w-postcode"
                label="Postcode"
                placeholder="1234 AB"
                autoComplete="postal-code"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              />
              <TextInput
                id="w-huisnummer"
                label="Huisnummer"
                placeholder="12"
                inputMode="numeric"
                value={huisnummer}
                onChange={(e) => setHuisnummer(e.target.value)}
              />
              <TextInput
                id="w-toevoeging"
                label="Toevoeging"
                placeholder="A"
                value={toevoeging}
                onChange={(e) => setToevoeging(e.target.value)}
              />
            </div>

            {!handmatig ? (
              <button
                type="button"
                onClick={() => zoekAdres()}
                disabled={zoeken}
                className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-pine px-6 py-3 font-bold text-white transition-colors hover:bg-pine-dark disabled:opacity-50"
              >
                {zoeken ? "Zoeken…" : "Zoek adres op"}
              </button>
            ) : null}

            {adresFout ? (
              <div
                role="alert"
                className="mt-4 rounded-card border border-status-yes-border bg-status-yes-bg p-4 text-[0.95rem] text-status-yes-ink"
              >
                <p>{adresFout}</p>
                {!handmatig ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHandmatig(true);
                      setAdresFout(null);
                    }}
                    className="mt-2 font-bold underline"
                  >
                    Ga verder met handmatige invoer
                  </button>
                ) : null}
              </div>
            ) : null}

            {suggesties ? (
              <div className="mt-4">
                <p className="mb-2 font-bold text-ink">Kies uw adres:</p>
                <ul className="space-y-2">
                  {suggesties.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => kiesSuggestie(s)}
                        className="w-full rounded-card border-2 border-line bg-white px-4 py-3 text-left font-semibold text-ink transition-colors hover:border-action"
                      >
                        {s.weergavenaam}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {handmatig ? (
              <div className="mt-4 rounded-card border border-line bg-white p-4">
                <p className="mb-3 text-sm text-ink-soft">
                  Handmatige invoer, vul eventueel uw plaats aan en bevestig.
                </p>
                <TextInput
                  id="w-plaats"
                  label="Plaats (optioneel)"
                  value={plaatsHandmatig}
                  onChange={(e) => setPlaatsHandmatig(e.target.value)}
                />
                <button
                  type="button"
                  onClick={bevestigHandmatig}
                  className="mt-3 rounded-full bg-pine px-5 py-2.5 font-bold text-white hover:bg-pine-dark"
                >
                  Gebruik dit adres
                </button>
              </div>
            ) : null}

            {input.adres ? (
              <div className="mt-5 rounded-card border border-status-no-border bg-status-no-bg p-4">
                <p className="font-bold text-status-no-ink">
                  {input.adres.straat
                    ? `${input.adres.straat} ${input.adres.huisnummer}${input.adres.toevoeging ?? ""}, ${input.adres.plaats ?? ""}`
                    : `${input.adres.postcode} ${input.adres.huisnummer}${input.adres.toevoeging ?? ""}${input.adres.plaats ? `, ${input.adres.plaats}` : ""}`}
                </p>
                <dl className="mt-1 text-sm text-status-no-ink/90">
                  {input.adres.gemeente ? (
                    <div className="flex gap-2">
                      <dt className="font-semibold">Gemeente:</dt>
                      <dd>{input.adres.gemeente}</dd>
                    </div>
                  ) : null}
                  {input.adres.provincie ? (
                    <div className="flex gap-2">
                      <dt className="font-semibold">Provincie:</dt>
                      <dd>{input.adres.provincie}</dd>
                    </div>
                  ) : null}
                  {input.adres.handmatig ? (
                    <div>Handmatig ingevoerd adres.</div>
                  ) : null}
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    patch({ adres: null });
                    setSuggesties(null);
                  }}
                  className="mt-2 text-sm font-bold text-status-no-ink underline"
                >
                  Klopt niet / ander adres kiezen
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------------- STAP 2 ---------------- */}
        {step === 2 ? (
          <FieldGroup
            legend="Wat is uw relatie tot dit pand?"
            hint="Hiermee passen wij de uitleg aan. Wij trekken géén automatische juridische conclusie over wie verantwoordelijk is."
          >
            <RadioCards
              name="relatie"
              value={input.relatie}
              onChange={(v) => patch({ relatie: v })}
              columns={1}
              options={[
                { value: "eigenaar_gebruiker", label: "Eigenaar én gebruiker" },
                { value: "eigenaar_verhuurder", label: "Eigenaar / verhuurder" },
                { value: "huurder", label: "Huurder / gebruiker" },
                { value: "beheerder_adviseur", label: "Beheerder of adviseur" },
                { value: "anders", label: "Anders" },
              ]}
            />
          </FieldGroup>
        ) : null}

        {/* ---------------- STAP 3 ---------------- */}
        {step === 3 ? (
          <div>
            <FieldGroup legend="Wat is het hoofdgebruik van het pand?">
              <RadioCards
                name="hoofdgebruik"
                value={input.hoofdgebruik}
                onChange={(v) => patch({ hoofdgebruik: v })}
                columns={2}
                options={[
                  { value: "kantoor", label: "Kantoor" },
                  { value: "winkel", label: "Winkel" },
                  { value: "horeca", label: "Horeca" },
                  { value: "industrie", label: "Bedrijfshal / industrie" },
                  { value: "opslag_logistiek", label: "Opslag / logistiek" },
                  { value: "zorg", label: "Zorg" },
                  { value: "onderwijs", label: "Onderwijs" },
                  { value: "sport", label: "Sport" },
                  { value: "bijeenkomst", label: "Bijeenkomst" },
                  { value: "gemengd", label: "Gemengd" },
                  { value: "anders", label: "Anders" },
                ]}
              />
            </FieldGroup>

            {labelLookup?.status === "found" &&
            labelLookup.oppervlakteM2 &&
            !oppervlakteHandmatig ? (
              <FieldGroup legend="Gebruiksoppervlakte">
                <EpAutoCard
                  waarde={`${labelLookup.oppervlakteM2.toLocaleString("nl-NL")} m²`}
                  toelichting="Gebruiksoppervlakte volgens het geregistreerde energielabel."
                  registratiedatum={labelLookup.registratiedatum}
                  onCorrigeer={() => setOppervlakteHandmatig(true)}
                />
              </FieldGroup>
            ) : (
              <FieldGroup
                legend="Hoe groot is de totale gebruiksoppervlakte?"
                hint="Een schatting is prima. De 100 m²-grens is relevant voor de label-C-plicht van kantoren."
              >
                {labelLookup?.status === "loading" ? (
                  <p className="mb-3 text-sm text-ink-soft">
                    Wij proberen de oppervlakte automatisch op te halen…
                  </p>
                ) : null}
                <RadioCards
                  name="oppervlakte"
                  value={input.oppervlakteBand}
                  onChange={(v) => {
                    patch({ oppervlakteBand: v });
                    if (v !== null) track("assessment_unknown_selected", { step: 3 });
                  }}
                  columns={3}
                  options={[
                    { value: "lt100", label: "Minder dan 100 m²" },
                    { value: "b100_250", label: "100 – 250 m²" },
                    { value: "b250_1000", label: "250 – 1.000 m²" },
                    { value: "b1000_5000", label: "1.000 – 5.000 m²" },
                    { value: "gt5000", label: "Meer dan 5.000 m²" },
                    { value: "onbekend", label: "Weet ik niet" },
                  ]}
                />
                <div className="mt-3 max-w-xs">
                  <TextInput
                    id="w-m2"
                    label="Exacte oppervlakte in m² (optioneel)"
                    inputMode="numeric"
                    placeholder="bijv. 650"
                    value={input.oppervlakteExactM2 ?? ""}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      patch({
                        oppervlakteExactM2:
                          e.target.value === "" || Number.isNaN(n) ? null : n,
                      });
                    }}
                  />
                </div>
              </FieldGroup>
            )}

            <FieldGroup
              legend="Welk deel van het oppervlak is kantoorfunctie?"
              hint="Beslaat het kantoordeel minder dan de helft van het gebouw, dan geldt de label-C-plicht meestal niet."
            >
              <RadioCards
                name="kantoorAandeel"
                value={input.kantoorAandeel}
                onChange={(v) => patch({ kantoorAandeel: v })}
                columns={3}
                options={[
                  { value: "lt50", label: "Minder dan 50%" },
                  { value: "gte50", label: "50% of meer" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
            </FieldGroup>

            <FieldGroup
              legend="Is het pand een monument?"
              hint="Voor monumenten gelden uitzonderingen op sommige labeleisen."
            >
              <RadioCards
                name="monument"
                value={input.monument}
                onChange={(v) => patch({ monument: v })}
                columns={3}
                options={[
                  { value: "ja", label: "Ja" },
                  { value: "nee", label: "Nee" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
            </FieldGroup>

            <FieldGroup legend="Speelt er verkoop, nieuwe verhuur of oplevering?">
              <RadioCards
                name="transactie"
                value={input.transactieGepland}
                onChange={(v) => patch({ transactieGepland: v })}
                columns={3}
                options={[
                  { value: "ja", label: "Ja" },
                  { value: "mogelijk", label: "Mogelijk" },
                  { value: "nee", label: "Nee" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
            </FieldGroup>
          </div>
        ) : null}

        {/* ---------------- STAP 4 ---------------- */}
        {step === 4 ? (
          <div>
            <p className="mb-5 rounded-card bg-mint-soft p-3.5 text-sm text-pine">
              <strong>Tip:</strong> uw jaarverbruik staat op de jaarafrekening
              van uw energieleverancier of in het klantportaal, meestal onder
              &lsquo;verbruik&rsquo; of &lsquo;afname&rsquo;.
            </p>

            <EnergieVraag
              legend="Jaarlijks elektriciteitsgebruik"
              eenheid="kWh"
              waarde={input.elektriciteit}
              bands={Object.entries(ELEKTRA_BANDS).map(([value, b]) => ({
                value: value as ElektriciteitBand,
                label: b.label,
              }))}
              onChange={(v) => patch({ elektriciteit: v })}
            />

            <EnergieVraag
              legend="Jaarlijks aardgasgebruik"
              eenheid="m³"
              waarde={input.gas}
              bands={Object.entries(GAS_BANDS).map(([value, b]) => ({
                value: value as GasBand,
                label: b.label,
              }))}
              onChange={(v) => patch({ gas: v })}
              extraOptieLabel="Geen gasaansluiting"
            />

            {labelLookup?.status === "found" && !labelHandmatig ? (
              <FieldGroup legend="Energielabel">
                <EpAutoCard
                  waarde={`Label ${labelLookup.labelRaw}`}
                  toelichting="Automatisch opgehaald uit het officiële energielabelregister."
                  registratiedatum={labelLookup.registratiedatum}
                  geldigTot={labelLookup.geldigTot}
                  onCorrigeer={() => setLabelHandmatig(true)}
                />
              </FieldGroup>
            ) : (
              <FieldGroup
                legend="Wat is het bekende energielabel?"
                hint="Gratis te controleren in EP-Online, de officiële labeldatabase."
              >
                {labelLookup?.status === "loading" ? (
                  <p className="mb-3 text-sm text-ink-soft">
                    Wij proberen het label automatisch op te halen…
                  </p>
                ) : labelLookup?.status === "not_found" ? (
                  <p className="mb-3 rounded-card bg-status-unknown-bg p-3 text-sm text-status-unknown-ink">
                    Voor dit adres vonden wij geen geregistreerd energielabel.
                    Vul het zelf in als u het weet, of kies &lsquo;Weet ik
                    niet&rsquo;.
                  </p>
                ) : labelLookup?.status === "error" ? (
                  <p className="mb-3 rounded-card bg-status-maybe-bg p-3 text-sm text-status-maybe-ink">
                    Automatisch ophalen lukte nu niet. U kunt het label zelf
                    invullen.
                  </p>
                ) : null}
                <RadioCards
                  name="label"
                  value={input.energielabel}
                  onChange={(v) => patch({ energielabel: v })}
                  columns={3}
                  options={[
                    { value: "A", label: "A (of beter)" },
                    { value: "B", label: "B" },
                    { value: "C", label: "C" },
                    { value: "D", label: "D" },
                    { value: "E", label: "E" },
                    { value: "F", label: "F" },
                    { value: "G", label: "G" },
                    { value: "geen", label: "Geen label" },
                    { value: "onbekend", label: "Weet ik niet" },
                  ]}
                />
              </FieldGroup>
            )}

            <FieldGroup legend="Heeft het pand eigen opwek?">
              <RadioCards
                name="opwek"
                value={input.eigenOpwek}
                onChange={(v) => patch({ eigenOpwek: v })}
                columns={2}
                options={[
                  { value: "geen", label: "Geen eigen opwek" },
                  { value: "zon", label: "Zonnepanelen" },
                  { value: "wind", label: "Wind" },
                  { value: "anders", label: "Anders" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
              {input.eigenOpwek && input.eigenOpwek !== "geen" ? (
                <div className="mt-3 max-w-xs">
                  <TextInput
                    id="w-teruglevering"
                    label="Teruglevering per jaar in kWh (optioneel)"
                    inputMode="numeric"
                    placeholder="bijv. 15000"
                    value={input.terugleveringKwh ?? ""}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      patch({
                        terugleveringKwh:
                          e.target.value === "" || Number.isNaN(n) ? null : n,
                      });
                    }}
                  />
                </div>
              ) : null}
            </FieldGroup>
          </div>
        ) : null}

        {/* ---------------- STAP 5 ---------------- */}
        {step === 5 ? (
          <div>
            <FieldGroup
              legend="Welke elektriciteitsaansluiting heeft het pand?"
              hint="Tot en met 3×80 ampère bent u kleinverbruiker; daarboven grootverbruiker. Dit staat op de factuur van uw netbeheerder."
            >
              <RadioCards
                name="aansluiting"
                value={input.aansluiting}
                onChange={(v) => patch({ aansluiting: v })}
                columns={1}
                options={[
                  { value: "klein", label: "Tot en met 3×80 A (kleinverbruik)" },
                  { value: "groot", label: "Groter dan 3×80 A (grootverbruik)" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
            </FieldGroup>

            <FieldGroup legend="Wacht u op een nieuwe of zwaardere aansluiting?">
              <RadioCards
                name="wacht"
                value={input.wachtOpAansluiting}
                onChange={(v) => patch({ wachtOpAansluiting: v })}
                columns={3}
                options={[
                  { value: "ja", label: "Ja" },
                  { value: "nee", label: "Nee" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
            </FieldGroup>

            <FieldGroup legend="Heeft de netbeheerder beperkingen gemeld op afname of teruglevering?">
              <RadioCards
                name="beperkingen"
                value={input.beperkingen}
                onChange={(v) => patch({ beperkingen: v })}
                columns={3}
                options={[
                  { value: "ja", label: "Ja" },
                  { value: "nee", label: "Nee" },
                  { value: "onbekend", label: "Weet ik niet" },
                ]}
              />
            </FieldGroup>

            <FieldGroup
              legend="Welke plannen heeft u binnen drie jaar?"
              hint="Meerdere antwoorden mogelijk."
            >
              <CheckboxCards
                values={input.plannen}
                onChange={(v) => patch({ plannen: v })}
                options={[
                  { value: "uitbreiding", label: "Uitbreiding van het bedrijf" },
                  { value: "warmtepomp", label: "Warmtepomp / elektrificatie" },
                  { value: "wagenpark", label: "Elektrisch wagenpark / laadplein" },
                  { value: "zonnepanelen", label: "(Extra) zonnepanelen" },
                  { value: "verhuizing", label: "Verhuizing" },
                  { value: "geen", label: "Geen van deze" },
                ]}
              />
            </FieldGroup>

            <FieldGroup legend="Wat is op dit moment uw grootste energievraagstuk?">
              <RadioCards
                name="probleem"
                value={input.grootsteProbleem}
                onChange={(v) => patch({ grootsteProbleem: v })}
                columns={2}
                options={[
                  { value: "piekvermogen", label: "Piekvermogen" },
                  { value: "teruglevering", label: "Teruglevering" },
                  { value: "uitbreiding", label: "Uitbreiding" },
                  { value: "kosten", label: "Energiekosten" },
                  { value: "leveringszekerheid", label: "Leveringszekerheid" },
                  { value: "onbekend", label: "Nog onbekend" },
                ]}
              />
            </FieldGroup>

            {toonBatterijvragen ? (
              <div className="rounded-card border-2 border-mint bg-mint-soft/50 p-4 sm:p-5">
                <h3 className="font-bold text-ink">
                  Batterijvragen{" "}
                  <span className="font-normal text-ink-soft">(optioneel, voor de batterijscan)</span>
                </h3>
                <p className="mt-1 mb-4 text-sm text-ink-soft">
                  Op basis van uw situatie kan een batterij-indicatie relevant
                  zijn. Overslaan mag; de scan geeft dan een lagere zekerheid.
                </p>

                <FieldGroup legend="Wat zou het hoofddoel van een batterij zijn?">
                  <RadioCards
                    name="b-doel"
                    value={input.batterij?.hoofddoel ?? null}
                    onChange={(v) =>
                      patch({
                        batterij: { ...leegBatterij(), ...input.batterij, hoofddoel: v },
                      })
                    }
                    columns={2}
                    options={[
                      { value: "peak_shaving", label: "Pieken afvlakken" },
                      { value: "zon_later_gebruiken", label: "Zonnestroom later gebruiken" },
                      { value: "uitbreiding_beperkt_vermogen", label: "Uitbreiden ondanks beperkt vermogen" },
                      { value: "energiehandel", label: "Energiehandel" },
                      { value: "noodstroom", label: "Noodstroom" },
                      { value: "combinatie", label: "Combinatie" },
                    ]}
                  />
                </FieldGroup>

                <FieldGroup
                  legend="Heeft u kwartierdata beschikbaar?"
                  hint="Kwartierdata (verbruik per 15 minuten) zijn nodig voor een serieuze batterijberekening."
                >
                  <RadioCards
                    name="b-kwartier"
                    value={input.batterij?.kwartierdataBeschikbaar ?? null}
                    onChange={(v) =>
                      patch({
                        batterij: {
                          ...leegBatterij(),
                          ...input.batterij,
                          kwartierdataBeschikbaar: v,
                        },
                      })
                    }
                    columns={3}
                    options={[
                      { value: "ja", label: "Ja" },
                      { value: "nee", label: "Nee" },
                      { value: "onbekend", label: "Weet ik niet" },
                    ]}
                  />
                </FieldGroup>

                <div className="mb-6 max-w-xs">
                  <TextInput
                    id="w-piek"
                    label="Hoogste gemeten piek in kW (optioneel)"
                    inputMode="numeric"
                    placeholder="bijv. 120"
                    value={input.batterij?.piekKw ?? ""}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      patch({
                        batterij: {
                          ...leegBatterij(),
                          ...input.batterij,
                          piekKw:
                            e.target.value === "" || Number.isNaN(n) ? null : n,
                        },
                      });
                    }}
                  />
                </div>

                <FieldGroup legend="Kan uw bedrijfsvoering flexibel laden en ontladen?">
                  <RadioCards
                    name="b-flex"
                    value={input.batterij?.flexibelProfiel ?? null}
                    onChange={(v) =>
                      patch({
                        batterij: { ...leegBatterij(), ...input.batterij, flexibelProfiel: v },
                      })
                    }
                    columns={3}
                    options={[
                      { value: "ja", label: "Ja" },
                      { value: "nee", label: "Nee" },
                      { value: "onbekend", label: "Weet ik niet" },
                    ]}
                  />
                </FieldGroup>

                <FieldGroup legend="Is er fysieke ruimte voor een batterijsysteem?">
                  <RadioCards
                    name="b-ruimte"
                    value={input.batterij?.ruimteBeschikbaar ?? null}
                    onChange={(v) =>
                      patch({
                        batterij: { ...leegBatterij(), ...input.batterij, ruimteBeschikbaar: v },
                      })
                    }
                    columns={2}
                    options={[
                      { value: "ja", label: "Ja, binnen of buiten" },
                      { value: "beperkt", label: "Beperkt" },
                      { value: "nee", label: "Nee" },
                      { value: "onbekend", label: "Weet ik niet" },
                    ]}
                  />
                </FieldGroup>

                <FieldGroup legend="Wat is uw investeringshorizon?">
                  <RadioCards
                    name="b-horizon"
                    value={input.batterij?.investeringshorizonJaren ?? null}
                    onChange={(v) =>
                      patch({
                        batterij: {
                          ...leegBatterij(),
                          ...input.batterij,
                          investeringshorizonJaren: v,
                        },
                      })
                    }
                    columns={2}
                    options={[
                      { value: "lt5", label: "Korter dan 5 jaar" },
                      { value: "b5_10", label: "5 – 10 jaar" },
                      { value: "gt10", label: "Langer dan 10 jaar" },
                      { value: "onbekend", label: "Weet ik niet" },
                    ]}
                  />
                </FieldGroup>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------------- STAP 6 ---------------- */}
        {step === 6 ? (
          <Samenvatting input={input} onEdit={goto} />
        ) : null}

        {stepError ? (
          <p role="alert" className="mt-4 font-semibold text-coral-ink">
            {stepError}
          </p>
        ) : null}

        {/* Navigatie */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <div className="flex gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goto(step - 1)}
                className="inline-flex min-h-[48px] items-center rounded-full border-2 border-line bg-white px-5 py-2.5 font-bold text-ink hover:border-pine"
              >
                ← Terug
              </button>
            ) : null}
            <button
              type="button"
              onClick={wissen}
              className="min-h-[48px] px-2 text-sm font-semibold text-ink-soft underline hover:text-coral-ink"
            >
              Alles wissen
            </button>
          </div>
          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !input.adres) {
                  setStepError(
                    "Kies eerst een adres of ga verder met handmatige invoer.",
                  );
                  track("assessment_validation_error", { step: 1, errorCode: "no_address" });
                  return;
                }
                next();
              }}
              className="inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
            >
              Volgende →
            </button>
          ) : (
            <button
              type="button"
              onClick={bereken}
              disabled={busy}
              className="inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 text-[1.05rem] font-bold text-white shadow-soft hover:bg-pine-dark disabled:opacity-60"
            >
              {busy ? "Berekenen…" : "Bereken mijn indicatieve uitslag"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-ink-soft">
        Uw antwoorden worden tijdelijk in uw browser bewaard en niet gedeeld
        zonder uw keuze. &lsquo;Weet ik niet&rsquo; is altijd een geldig antwoord.
      </p>
    </div>
  );
}

function leegBatterij() {
  return {
    hoofddoel: null,
    kwartierdataBeschikbaar: null,
    piekKw: null,
    flexibelProfiel: null,
    ruimteBeschikbaar: null,
    investeringshorizonJaren: null,
    noodstroomNodig: null,
  };
}

/* ---------------- EP-Online: automatisch opgehaald ---------------- */

function EpAutoCard({
  waarde,
  toelichting,
  registratiedatum,
  geldigTot,
  onCorrigeer,
}: {
  waarde: string;
  toelichting: string;
  registratiedatum?: string | null;
  geldigTot?: string | null;
  onCorrigeer: () => void;
}) {
  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("nl-NL") : null;
  const reg = fmt(registratiedatum);
  const geldig = fmt(geldigTot);
  return (
    <div className="rounded-card border-2 border-status-no-border bg-status-no-bg p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-no-ink/10 text-status-no-ink">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 10.3 3 3 7-7.6" />
          </svg>
        </span>
        <div>
          <p className="text-lg font-bold text-status-no-ink">{waarde}</p>
          <p className="mt-0.5 text-sm text-status-no-ink/90">{toelichting}</p>
          <p className="mt-1 text-xs text-status-no-ink/80">
            Bron: EP-Online (RVO)
            {reg ? ` • geregistreerd op ${reg}` : ""}
            {geldig ? ` • geldig tot ${geldig}` : ""}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCorrigeer}
        className="mt-3 text-sm font-bold text-pine underline"
      >
        Klopt niet? Pas handmatig aan
      </button>
    </div>
  );
}

/* ---------------- Energie-invoercomponent ---------------- */

function EnergieVraag<Band extends string>({
  legend,
  eenheid,
  waarde,
  bands,
  onChange,
  extraOptieLabel,
}: {
  legend: string;
  eenheid: string;
  waarde: { type: "exact"; value: number } | { type: "band"; band: Band } | { type: "onbekend" } | null;
  bands: { value: Band; label: string }[];
  onChange: (
    v: { type: "exact"; value: number } | { type: "band"; band: Band } | { type: "onbekend" },
  ) => void;
  extraOptieLabel?: string;
}) {
  const mode = waarde?.type ?? null;
  return (
    <FieldGroup legend={legend}>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={`${legend}: invoerwijze`}>
        {(
          [
            ["exact", `Exact (${eenheid})`],
            ["band", "Bandbreedte"],
            ["onbekend", "Weet ik niet"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => {
              if (m === "exact") onChange({ type: "exact", value: 0 });
              else if (m === "band") {
                const first = bands[0];
                if (first) onChange({ type: "band", band: first.value });
              } else onChange({ type: "onbekend" });
            }}
            className={`min-h-[40px] rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
              mode === m
                ? "border-pine bg-pine text-white"
                : "border-line bg-white text-ink hover:border-pine"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "exact" && waarde?.type === "exact" ? (
        <div className="max-w-xs">
          <label className="mb-1 block text-sm font-bold text-ink" htmlFor={`exact-${legend}`}>
            Waarde in {eenheid} per jaar
          </label>
          <input
            id={`exact-${legend}`}
            type="text"
            inputMode="numeric"
            value={waarde.value === 0 ? "" : waarde.value}
            placeholder={`bijv. ${eenheid === "kWh" ? "45000" : "12000"}`}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/[.\s]/g, ""));
              onChange({ type: "exact", value: Number.isNaN(n) ? 0 : n });
            }}
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-ink focus:border-action focus:outline-none"
          />
        </div>
      ) : null}

      {mode === "band" && waarde?.type === "band" ? (
        <RadioCards
          name={`band-${legend}`}
          value={waarde.band}
          onChange={(band) => onChange({ type: "band", band })}
          columns={2}
          options={bands.map((b) => ({ value: b.value, label: b.label }))}
        />
      ) : null}

      {extraOptieLabel && mode === null ? (
        <p className="text-sm text-ink-soft">
          Geen aansluiting? Kies &lsquo;Exact&rsquo; en laat de waarde leeg (0).
        </p>
      ) : null}
    </FieldGroup>
  );
}

/* ---------------- Samenvatting (stap 6) ---------------- */

function Samenvatting({
  input,
  onEdit,
}: {
  input: AssessmentInput;
  onEdit: (step: number) => void;
}) {
  const rows: { step: number; titel: string; waarde: string }[] = [
    {
      step: 1,
      titel: "Locatie",
      waarde: input.adres
        ? `${input.adres.postcode} ${input.adres.huisnummer}${input.adres.toevoeging ?? ""}${input.adres.plaats ? `, ${input.adres.plaats}` : ""}`
        : "Niet ingevuld",
    },
    {
      step: 2,
      titel: "Relatie tot het pand",
      waarde:
        {
          eigenaar_gebruiker: "Eigenaar én gebruiker",
          eigenaar_verhuurder: "Eigenaar / verhuurder",
          huurder: "Huurder / gebruiker",
          beheerder_adviseur: "Beheerder of adviseur",
          anders: "Anders",
        }[input.relatie ?? "anders"] ?? "Niet ingevuld",
    },
    {
      step: 3,
      titel: "Gebruik en omvang",
      waarde: [
        input.hoofdgebruik ?? "gebruik onbekend",
        input.oppervlakteExactM2
          ? `${input.oppervlakteExactM2} m²`
          : (input.oppervlakteBand ?? "oppervlakte onbekend"),
        input.monument === "ja" ? "monument" : null,
        input.transactieGepland === "ja" ? "transactie gepland" : null,
      ]
        .filter(Boolean)
        .join(" • "),
    },
    {
      step: 4,
      titel: "Energie en labels",
      waarde: [
        input.elektriciteit?.type === "exact"
          ? `${input.elektriciteit.value.toLocaleString("nl-NL")} kWh`
          : input.elektriciteit?.type === "band"
            ? "elektriciteit: bandbreedte"
            : "elektriciteit onbekend",
        input.gas?.type === "exact"
          ? `${input.gas.value.toLocaleString("nl-NL")} m³ gas`
          : input.gas?.type === "band"
            ? "gas: bandbreedte"
            : "gas onbekend",
        input.energielabel ? `label ${input.energielabel}` : "label onbekend",
        input.eigenOpwek === "zon" ? "zonnepanelen" : null,
      ]
        .filter(Boolean)
        .join(" • "),
    },
    {
      step: 5,
      titel: "Aansluiting en plannen",
      waarde: [
        input.aansluiting === "klein"
          ? "t/m 3×80 A"
          : input.aansluiting === "groot"
            ? "> 3×80 A"
            : "aansluiting onbekend",
        input.wachtOpAansluiting === "ja" ? "wacht op aansluiting" : null,
        input.beperkingen === "ja" ? "beperkingen gemeld" : null,
        input.plannen.length > 0 && !input.plannen.includes("geen")
          ? `${input.plannen.length} plan(nen)`
          : null,
      ]
        .filter(Boolean)
        .join(" • "),
    },
  ];

  return (
    <div>
      <p className="mb-5 text-ink-soft">
        Controleer uw antwoorden. U kunt iedere sectie nog aanpassen.
        Contactgegevens zijn <strong className="text-ink">niet</strong> nodig
        voor de uitslag.
      </p>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.step}
            className="flex flex-wrap items-center justify-between gap-2 rounded-card border border-line bg-white p-4"
          >
            <div>
              <p className="font-bold text-ink">{row.titel}</p>
              <p className="text-sm text-ink-soft">{row.waarde}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="min-h-[44px] rounded-full border-2 border-line px-4 font-bold text-pine hover:border-pine"
            >
              Bewerken
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
