"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { AddressStarter } from "@/components/marketing/AddressStarter";
import { PandScan, type ScanPhase } from "@/components/marketing/PandScan";

const TRUST = [
  "Gebaseerd op overheidsbronnen",
  "Geen account nodig",
  "U krijgt eerst uw uitslag",
];

const SCAN_MS = 2000; // duur van de scanlijn + onthulling

/**
 * Hero met interactieve "pandscan". Links de headline en adresinvoer, rechts
 * een bedrijfspand met zwevende analysekaarten. Zodra iemand het
 * postcodeveld aanklikt (of typt) start een demo-scan: lampjes gaan aan, een
 * gouden scanlijn loopt over het pand, de kaarten verschijnen na elkaar en de
 * status gaat van "Klaar voor controle" naar "Pand analyseren..." naar
 * "Pand gevonden". Puur een visuele preview, de echte uitslag volgt pas na
 * de check. Respecteert prefers-reduced-motion en werkt zonder JavaScript.
 */
export function PandScanHero() {
  // Zonder JS (en dus zonder hydratatie) toont de server-render de volledige
  // compositie: fase "done", niet "enhanced" (geen verborgen kaarten).
  const [phase, setPhase] = useState<ScanPhase>("done");
  const [enhanced, setEnhanced] = useState(false);
  const [noAnim, setNoAnim] = useState(false);
  const [scanId, setScanId] = useState(0);
  const reduced = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const runScan = useCallback(() => {
    if (running.current) return;
    running.current = true;
    if (reduced.current) {
      // Geen beweging: alles direct zichtbaar in eindstand.
      setEnhanced(false);
      setPhase("done");
      return;
    }
    clearTimers();
    setScanId((n) => n + 1);
    // Eerst één frame zonder transitie terug naar verborgen, dan scannen.
    setNoAnim(true);
    setEnhanced(true);
    setPhase("idle");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setNoAnim(false);
        setPhase("scanning");
        timers.current.push(
          setTimeout(() => {
            setPhase("done");
            running.current = false;
          }, SCAN_MS),
        );
      });
    });
  }, []);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    // Na hydratatie: start met een rustpand ("Klaar voor controle") en draai
    // de demo eenmalig automatisch, zodat direct zichtbaar is wat de tool doet.
    setEnhanced(true);
    setNoAnim(true);
    setPhase("idle");
    const t = setTimeout(() => runScan(), 900);
    timers.current.push(t);
    return clearTimers;
  }, [runScan]);

  // Focus op het postcodeveld start de scan (opnieuw).
  const onPostcodeFocus = useCallback(() => {
    runScan();
  }, [runScan]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#eef4f3] pt-10 pb-16 sm:pt-14 sm:pb-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-mint/40 blur-3xl" />
        <div className="absolute right-0 -top-6 h-80 w-80 rounded-full bg-amber/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-action/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Links: scherpe headline + adresinvoer */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-pine px-4 py-1.5 text-sm font-bold text-white shadow-soft">
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-amber"
                aria-hidden="true"
              />
              Gratis check voor bedrijfspanden
            </p>
            <h1
              id="hero-heading"
              className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:mx-0 lg:text-[3.4rem]"
            >
              Weet u welke plichten uw{" "}
              <span className="relative whitespace-nowrap text-pine">
                bedrijfspand
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 18"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full text-amber"
                >
                  <path
                    d="M3 13c60-9 234-9 294 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              heeft?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft lg:mx-0">
              Vul uw postcode in en zie in een paar minuten welke plichten,
              risico&apos;s en kansen voor uw pand spelen. Helder en met bronnen.
            </p>

            <div className="mx-auto mt-8 max-w-2xl lg:mx-0">
              <AddressStarter compact onPostcodeFocus={onPostcodeFocus} />
            </div>

            <ul className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft lg:mx-0 lg:justify-start">
              {TRUST.map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-action"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m4 10.3 3.2 3.2L16 5.4" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Rechts: interactieve pandscan */}
          <div className="relative pb-8 pt-4 lg:pb-2">
            <PandScan
              phase={phase}
              scanId={scanId}
              enhanced={enhanced}
              noAnim={noAnim}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
