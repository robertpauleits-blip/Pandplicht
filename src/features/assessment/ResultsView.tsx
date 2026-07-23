"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { AssessmentStatus, StoredAssessment } from "@/rules/types";
import { sortResults, summarize } from "@/rules/engine";
import {
  CONFIDENCE_META,
  PRIORITY_META,
  TOPIC_META,
} from "@/rules/topics";
import { getSources } from "@/rules/sources";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LeadForm } from "@/features/leads/LeadForm";
import { track } from "@/lib/analytics";

function maskAdres(a: StoredAssessment["input"]["adres"]): string {
  if (!a) return "Adres niet opgegeven";
  // Gedeeltelijk gemaskeerd voor delen/printen: cijfers postcode + plaats.
  const pc4 = a.postcode.replace(/\s/g, "").slice(0, 4);
  return `${pc4} ••, huisnr. ${a.huisnummer}${a.toevoeging ?? ""}${a.plaats ? `, ${a.plaats}` : ""}`;
}

function statusDot(status: AssessmentStatus): string {
  switch (status) {
    case "likely_applicable":
    case "possibly_applicable":
      return "bg-amber";
    case "likely_not_applicable":
      return "bg-action";
    default:
      return "bg-ink-soft";
  }
}

const SCAN_PHASES = [
  "Antwoorden controleren…",
  "Drempels uit officiële bronnen vergelijken…",
  "Bronnen en peildata koppelen…",
];

/** Korte scanceremonie vóór de onthulling van de uitslag. */
function ScanCeremony({ adres }: { adres: string }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setPhase((p) => Math.min(p + 1, SCAN_PHASES.length - 1)),
      650,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-xl rounded-panel border border-line bg-surface p-10 text-center shadow-soft"
    >
      <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14" aria-hidden="true">
        <rect x="9" y="11" width="19" height="30" rx="2" fill="#0e5a4f" />
        <rect x="9" y="11" width="19" height="3" fill="#f2bb4a" />
        <rect x="30" y="20" width="10" height="21" rx="1.5" fill="#116154" />
        {[14, 21].map((x) =>
          [17, 24, 31].map((y) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="4.5" height="5" rx="1" fill="#cdf1e0" />
          )),
        )}
        <rect x="32" y="24" width="5" height="5" rx="1" fill="#cdf1e0" />
        <rect x="32" y="32" width="5" height="5" rx="1" fill="#f2bb4a" />
      </svg>
      <p className="mt-3 text-lg font-bold text-ink">{adres}</p>
      <div className="relative mx-auto mt-6 h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r="30" stroke="#e6eceb" strokeWidth="8" fill="none" />
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke="#18a978"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="188.5"
            strokeDashoffset="188.5"
            className="res-ringbar"
          />
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold text-ink-soft">
        {SCAN_PHASES[phase]}
      </p>
    </div>
  );
}

type RevealMode = "scan" | "anim" | "instant";

export function ResultsView({ token }: { token: string }) {
  const [assessment, setAssessment] = useState<StoredAssessment | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "notfound">("loading");
  const [afgevinkt, setAfgevinkt] = useState<Set<string>>(new Set());
  const [reveal, setReveal] = useState<RevealMode | null>(null);

  // Het resultaatmoment: één keer per uitslag een korte scanceremonie,
  // daarna vallen de onderwerpen na elkaar op hun plek. Bij herbezoek of
  // reduced motion verschijnt alles direct. Let op: de timer mag niet worden
  // opgeruimd door de eigen state-wijziging, vandaar de ref in plaats van
  // `reveal` in de dependencies.
  const revealStarted = useRef(false);
  useEffect(() => {
    if (state !== "ok" || revealStarted.current) return;
    revealStarted.current = true;
    const key = `pp-onthuld-${token}`;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {
      /* privémodus */
    }
    if (reduced || seen) {
      setReveal("instant");
      return;
    }
    setReveal("scan");
    const t = setTimeout(() => {
      setReveal("anim");
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* privémodus */
      }
    }, 2100);
    return () => clearTimeout(t);
  }, [state, token]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // 1) Lokale kopie (sessionStorage), direct beschikbaar en privé.
      try {
        const raw = sessionStorage.getItem(`pp-uitslag-${token}`);
        if (raw) {
          if (!cancelled) {
            setAssessment(JSON.parse(raw) as StoredAssessment);
            setState("ok");
          }
          return;
        }
      } catch {
        /* door naar server */
      }
      // 2) Server-side kopie via beveiligde token.
      try {
        const res = await fetch(`/api/assessments/${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = (await res.json()) as { assessment: StoredAssessment };
          if (!cancelled) {
            setAssessment(data.assessment);
            setState("ok");
          }
          return;
        }
      } catch {
        /* valt door naar notfound */
      }
      if (!cancelled) setState("notfound");
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state === "loading") {
    return (
      <div className="rounded-panel border border-line bg-surface p-10 text-center text-ink-soft">
        Uw uitslag wordt geladen…
      </div>
    );
  }

  if (state === "notfound" || !assessment) {
    return (
      <div className="mx-auto max-w-xl rounded-panel border border-line bg-surface p-8 text-center">
        <h1 className="text-2xl font-extrabold text-ink">
          Deze uitslag is niet (meer) beschikbaar
        </h1>
        <p className="mt-3 text-ink-soft">
          Uitslagen worden om privacyredenen na een bewaartermijn automatisch
          verwijderd, en links zijn alleen geldig in de browser waarin de check
          is gedaan. U kunt de check opnieuw doorlopen, dat duurt maar een paar
          minuten.
        </p>
        <Link
          href="/pandcheck"
          className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white hover:bg-pine-dark"
        >
          Doe de PandCheck opnieuw
        </Link>
      </div>
    );
  }

  const results = sortResults(assessment.outcome.results);
  const alleStappen = results
    .filter((r) => r.priority === "now" || r.priority === "soon")
    .flatMap((r) =>
      r.nextSteps.slice(0, 2).map((s) => ({ topic: r.topicId, step: s })),
    )
    .slice(0, 8);
  const onzekerheden = results
    .filter((r) => r.missingInputs.length > 0)
    .map((r) => ({
      topic: TOPIC_META[r.topicId].title,
      missing: r.missingInputs,
    }));

  const datum = new Date(assessment.outcome.calculatedAt);

  // Tijdens de ceremonie alleen het scanpaneel tonen.
  if (reveal === null) return null;
  if (reveal === "scan") {
    return <ScanCeremony adres={maskAdres(assessment.input.adres)} />;
  }

  return (
    <div
      className={`mx-auto max-w-3xl ${reveal === "anim" ? "res-anim" : ""}`}
    >
      {/* Kop */}
      <header
        className="res-item print-block"
        style={{ "--ri": 0 } as CSSProperties}
      >
        <p className="text-sm font-bold uppercase tracking-wide text-pine">
          Uw indicatieve PandPlicht-overzicht
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {summarize(results)}
        </h1>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
          <div className="flex gap-1.5">
            <dt className="font-semibold">Pand:</dt>
            <dd>{maskAdres(assessment.input.adres)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-semibold">Check gedaan:</dt>
            <dd>
              <time dateTime={assessment.outcome.calculatedAt}>
                {datum.toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                {datum.toLocaleTimeString("nl-NL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-semibold">Regelset:</dt>
            <dd>v{assessment.outcome.rulesetVersion}</dd>
          </div>
        </dl>
        <p className="mt-3 rounded-card bg-mint-soft p-3 text-sm text-pine">
          Dit overzicht is indicatief en gebaseerd op uw antwoorden en openbare
          bronnen. Het is geen juridisch of technisch advies en geen besluit
          van een instantie.
        </p>
        <div className="no-print mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              track("report_printed", {});
              window.print();
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-line bg-surface px-5 font-bold text-ink hover:border-pine"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 7V3h10v4M5 13H3V7h14v6h-2m-10-2h10v6H5v-6Z" />
            </svg>
            Print of bewaar als PDF
          </button>
          <Link
            href="/pandcheck"
            className="inline-flex min-h-[44px] items-center rounded-full px-4 font-bold text-pine hover:underline"
          >
            Antwoorden aanpassen
          </Link>
        </div>
      </header>

      {/* Samenvatting: dit speelt mogelijk bij uw pand */}
      <section
        aria-labelledby="samenvatting-h"
        className="res-item print-block mt-8 rounded-panel border border-line bg-surface p-5 shadow-soft"
        style={{ "--ri": 1 } as CSSProperties}
      >
        <h2
          id="samenvatting-h"
          className="text-sm font-bold uppercase tracking-wide text-ink-soft"
        >
          Dit speelt mogelijk bij uw pand
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {results.map((r) => (
            <button
              key={r.topicId}
              type="button"
              onClick={() =>
                document
                  .getElementById(`topic-${r.topicId}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-pine/50"
            >
              <span
                className={`h-2 w-2 rounded-full ${statusDot(r.status)}`}
                aria-hidden="true"
              />
              {TOPIC_META[r.topicId].shortTitle}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Klik op een onderwerp voor de uitleg, bronnen en vervolgstappen.
        </p>
      </section>

      {/* Resultaatkaarten */}
      <section aria-label="Resultaten per onderwerp" className="mt-8 space-y-4">
        {results.map((r, resIndex) => {
          const meta = TOPIC_META[r.topicId];
          const sources = getSources(r.sourceIds).slice(0, 3);
          return (
            <article
              key={r.topicId}
              id={`topic-${r.topicId}`}
              className="res-item print-block scroll-mt-24 rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-6"
              style={{ "--ri": 2 + resIndex } as CSSProperties}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-ink">{meta.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-ink-soft">
                    {PRIORITY_META[r.priority].label} •{" "}
                    {CONFIDENCE_META[r.confidence].label}
                  </p>
                </div>
                <StatusBadge status={r.status} topicId={r.topicId} />
              </div>

              <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-ink-soft">
                Waarom ziet u dit?
              </h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[0.95rem] text-ink-soft">
                {r.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>

              {r.nextSteps.length > 0 ? (
                <>
                  <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-ink-soft">
                    Vervolgstappen
                  </h3>
                  <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-[0.95rem] text-ink-soft">
                    {r.nextSteps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </>
              ) : null}

              {r.missingInputs.length > 0 ? (
                <details className="no-print mt-3 rounded-card bg-status-unknown-bg p-3 text-sm text-status-unknown-ink">
                  <summary className="cursor-pointer font-bold">
                    Ontbrekende informatie ({r.missingInputs.length})
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {r.missingInputs.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </details>
              ) : null}

              {r.assumptions.length > 0 ? (
                <details className="no-print mt-2 text-sm text-ink-soft">
                  <summary className="cursor-pointer font-semibold">
                    Gebruikte aannames
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {r.assumptions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </details>
              ) : null}

              <div className="mt-4 border-t border-line pt-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  Bronnen
                </h3>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {sources.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("source_clicked", { topic: r.topicId })}
                        className="font-semibold text-pine underline decoration-mint decoration-2 underline-offset-2 hover:decoration-action"
                      >
                        {s.title}
                      </a>{" "}
                      <span className="text-ink-soft">
                       , {s.publisher}, gecontroleerd op{" "}
                        {new Date(s.checkedAt).toLocaleDateString("nl-NL")}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={meta.infoHref}
                  className="no-print mt-2 inline-block text-sm font-bold text-pine hover:underline"
                >
                  Meer uitleg over dit onderwerp →
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* Actieplan */}
      {alleStappen.length > 0 ? (
        <section aria-labelledby="actieplan-h" className="res-item print-block mt-10" style={{ "--ri": 6 } as CSSProperties}>
          <h2 id="actieplan-h" className="text-2xl font-extrabold tracking-tight text-ink">
            Uw actieplan
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Afvinken werkt in deze sessie; er is geen account nodig.
          </p>
          <ul className="mt-4 space-y-2">
            {alleStappen.map(({ topic, step }, i) => {
              const key = `${topic}-${i}`;
              const checked = afgevinkt.has(key);
              return (
                <li key={key}>
                  <label
                    className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-card border-2 p-3.5 transition-colors ${
                      checked ? "border-status-no-border bg-status-no-bg" : "border-line bg-surface"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setAfgevinkt((cur) => {
                          const nxt = new Set(cur);
                          if (nxt.has(key)) nxt.delete(key);
                          else nxt.add(key);
                          return nxt;
                        })
                      }
                      className="mt-0.5 h-5 w-5 accent-pine"
                    />
                    <span
                      className={`text-[0.95rem] ${checked ? "text-status-no-ink line-through" : "text-ink"}`}
                    >
                      <span className="font-semibold">{step}</span>{" "}
                      <span className="text-ink-soft">
                        ({TOPIC_META[topic].shortTitle})
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Wat wij nog niet weten */}
      {onzekerheden.length > 0 ? (
        <section aria-labelledby="onzeker-h" className="res-item print-block mt-10" style={{ "--ri": 6 } as CSSProperties}>
          <h2 id="onzeker-h" className="text-2xl font-extrabold tracking-tight text-ink">
            Wat wij nog niet weten
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Deze gegevens ontbreken nog. Hoe meer u aanvult, hoe scherper de
            indicatie.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {onzekerheden.map((o) => (
              <div key={o.topic} className="rounded-card border border-line bg-surface p-4">
                <h3 className="text-sm font-bold text-ink">{o.topic}</h3>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-ink-soft">
                  {o.missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Lead-CTA, pas ná de kernuitslag */}
      <div className="res-item mt-12" style={{ "--ri": 7 } as CSSProperties}>
        <LeadForm assessment={assessment} />
      </div>

      <p className="print-block mt-8 text-center text-sm text-ink-soft">
        PandPlicht biedt een indicatieve eerste check en geen juridisch of
        technisch advies. Bronnen en methodologie: www.pandplicht.nl/bronnen-en-methodologie
      </p>
    </div>
  );
}
