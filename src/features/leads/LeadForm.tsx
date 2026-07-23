"use client";

import { useEffect, useRef, useState } from "react";
import type { StoredAssessment } from "@/rules/types";
import { TOPIC_META } from "@/rules/topics";
import { track } from "@/lib/analytics";

const TOPICS = [
  { value: "verplichtingen", label: "Verplichtingen algemeen" },
  { value: "energielabel", label: "Energielabel" },
  { value: "energiebesparing", label: "Energiebesparing" },
  { value: "netcongestie", label: "Netcongestie" },
  { value: "batterij", label: "Zakelijke batterij" },
  { value: "anders", label: "Anders" },
] as const;

export function LeadForm({ assessment }: { assessment: StoredAssessment | null }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deelUitslag, setDeelUitslag] = useState(true);
  const [topics, setTopics] = useState<string[]>([]);
  const startedAt = useRef(Date.now());
  const submitted = useRef(false); // dubbele inzending voorkomen

  useEffect(() => {
    if (open) {
      startedAt.current = Date.now();
      track("lead_form_opened", {});
    }
  }, [open]);

  if (done) {
    return (
      <div className="no-print rounded-panel border-2 border-status-no-border bg-status-no-bg p-6 text-center">
        <h2 className="text-xl font-bold text-status-no-ink">
          Bedankt voor uw aanvraag
        </h2>
        <p className="mx-auto mt-2 max-w-md text-status-no-ink/90">
          Wij bekijken uw aanvraag en brengen u vrijblijvend in contact met een
          passende specialist. U ontvangt geen ongevraagde marketing.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="no-print rounded-panel bg-mint-soft p-6 text-center sm:p-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">
          Wilt u weten wat dit concreet voor uw pand betekent?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-ink-soft">
          Laat uw situatie vrijblijvend bekijken door een passende specialist.
          U bepaalt zelf welke gegevens u deelt.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 text-[1.05rem] font-bold text-white shadow-soft hover:bg-pine-dark"
        >
          Vraag een vrijblijvende vervolgstap aan
        </button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitted.current || busy) return;
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const consent = form.get("consentProcessing") === "on";
    const marketing = form.get("consentMarketing") === "on";
    const website = String(form.get("website") ?? "");

    if (!name || !company || !email || topics.length === 0 || !consent) {
      setError(
        "Vul uw naam, bedrijfsnaam en e-mailadres in, kies minimaal één onderwerp en ga akkoord met de verwerking voor deze aanvraag.",
      );
      track("lead_form_error", { errorCode: "validation" });
      return;
    }

    setBusy(true);
    try {
      const summary =
        deelUitslag && assessment
          ? {
              statuses: Object.fromEntries(
                assessment.outcome.results.map((r) => [r.topicId, r.status]),
              ),
              rulesetVersion: assessment.outcome.rulesetVersion,
            }
          : undefined;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone: phone || undefined,
          helpTopics: topics,
          region: assessment?.input.adres?.postcode?.slice(0, 4),
          message: message || undefined,
          assessmentToken: deelUitslag ? assessment?.token : undefined,
          assessmentSummary: summary,
          consentProcessing: true,
          consentMarketing: marketing,
          website,
          startedAt: startedAt.current,
          attribution: { landingPage: "/pandcheck/uitslag" },
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Versturen is niet gelukt.");
      }
      submitted.current = true;
      setDone(true);
      track("lead_form_submitted", {});
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Versturen is niet gelukt. Probeer het later opnieuw.",
      );
      track("lead_form_error", { errorCode: "submit" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-ink">
        Vrijblijvende vervolgstap aanvragen
      </h2>
      <p className="mt-2 text-ink-soft">
        Na verzending bekijken wij uw aanvraag en brengen wij u, alleen met uw
        toestemming, in contact met een passende specialist voor de gekozen
        onderwerpen. Er ontstaat géén verplichting en u ontvangt geen
        ongevraagde marketing.
      </p>

      <form onSubmit={onSubmit} className="mt-6">
        {/* Honeypot: onzichtbaar voor mensen, bots vullen dit wel in. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="lead-website">Laat dit veld leeg</label>
          <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-name" className="mb-1 block text-sm font-bold text-ink">
              Naam
            </label>
            <input
              id="lead-name"
              name="name"
              required
              autoComplete="name"
              className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lead-company" className="mb-1 block text-sm font-bold text-ink">
              Bedrijfsnaam
            </label>
            <input
              id="lead-company"
              name="company"
              required
              autoComplete="organization"
              className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lead-email" className="mb-1 block text-sm font-bold text-ink">
              Zakelijk e-mailadres
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="mb-1 block text-sm font-bold text-ink">
              Telefoonnummer <span className="font-normal text-ink-soft">(optioneel)</span>
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
            />
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-bold text-ink">
            Waarbij wilt u hulp? <span className="font-normal text-ink-soft">(meerdere mogelijk)</span>
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <label
                key={t.value}
                className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-card border-2 px-3.5 py-2.5 text-[0.95rem] font-semibold ${
                  topics.includes(t.value)
                    ? "border-action bg-mint-soft text-ink"
                    : "border-line bg-white text-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={topics.includes(t.value)}
                  onChange={() =>
                    setTopics((cur) =>
                      cur.includes(t.value)
                        ? cur.filter((x) => x !== t.value)
                        : [...cur, t.value],
                    )
                  }
                  className="h-4 w-4 accent-pine"
                />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="lead-message" className="mb-1 block text-sm font-bold text-ink">
            Toelichting <span className="font-normal text-ink-soft">(optioneel)</span>
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={3}
            maxLength={2000}
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
          />
        </div>

        {assessment ? (
          <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={deelUitslag}
              onChange={() => setDeelUitslag((v) => !v)}
              className="mt-0.5 h-4 w-4 accent-pine"
            />
            <span>
              Stuur een <strong className="text-ink">samenvatting van mijn uitslag</strong> mee
              (alleen de statussen per onderwerp:{" "}
              {assessment.outcome.results
                .map((r) => TOPIC_META[r.topicId].shortTitle)
                .slice(0, 3)
                .join(", ")}
              , …), niet uw losse antwoorden.
            </span>
          </label>
        ) : null}

        <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="consentProcessing"
            required
            className="mt-0.5 h-4 w-4 accent-pine"
          />
          <span>
            Ik geef toestemming om mijn gegevens te verwerken voor{" "}
            <strong className="text-ink">deze aanvraag</strong>. Zie de{" "}
            <a href="/privacy" className="underline hover:text-pine">
              privacyverklaring
            </a>
            .
          </span>
        </label>

        <label className="mt-2 flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="consentMarketing"
            className="mt-0.5 h-4 w-4 accent-pine"
          />
          <span>
            Optioneel: houd mij per e-mail op de hoogte van relevante updates
            over pandverplichtingen. <em>(standaard uit)</em>
          </span>
        </label>

        {error ? (
          <p role="alert" className="mt-4 font-semibold text-coral-ink">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 font-bold text-white shadow-soft hover:bg-pine-dark disabled:opacity-60"
          >
            {busy ? "Versturen…" : "Verstuur aanvraag"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-[52px] rounded-full px-5 font-bold text-ink-soft hover:text-ink"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
