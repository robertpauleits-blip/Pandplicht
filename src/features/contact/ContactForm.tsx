"use client";

import { useRef, useState } from "react";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());

  if (done) {
    return (
      <div
        role="status"
        className="rounded-panel border-2 border-status-no-border bg-status-no-bg p-6 text-center"
      >
        <h2 className="text-xl font-bold text-status-no-ink">Bericht verzonden</h2>
        <p className="mt-2 text-status-no-ink/90">
          Bedankt voor uw bericht. Wij reageren zo snel mogelijk.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          message: String(form.get("message") ?? ""),
          website: String(form.get("website") ?? ""),
          startedAt: startedAt.current,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Versturen is niet gelukt.");
      }
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Versturen is niet gelukt. Probeer het later opnieuw.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-8">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="c-website">Laat dit veld leeg</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1 block text-sm font-bold text-ink">
            Naam
          </label>
          <input
            id="c-name"
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1 block text-sm font-bold text-ink">
            E-mailadres
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="c-message" className="mb-1 block text-sm font-bold text-ink">
          Uw bericht
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          className="w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 focus:border-action focus:outline-none"
        />
      </div>
      {error ? (
        <p role="alert" className="mt-4 font-semibold text-coral-ink">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-5 inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 font-bold text-white shadow-soft hover:bg-pine-dark disabled:opacity-60"
      >
        {busy ? "Versturen…" : "Verstuur bericht"}
      </button>
      <p className="mt-3 text-sm text-ink-soft">
        Uw gegevens worden alleen gebruikt om uw bericht te beantwoorden. Zie de{" "}
        <a href="/privacy" className="underline hover:text-pine">
          privacyverklaring
        </a>
        .
      </p>
    </form>
  );
}
