"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

const NAV = [
  { href: "/pandcheck", label: "Doe de PandCheck" },
  { href: "/verplichtingen", label: "Verplichtingen" },
  { href: "/netcongestie", label: "Netcongestie" },
  { href: "/zakelijke-batterij", label: "Zakelijke batterij" },
  { href: "/kennisbank", label: "Kennisbank" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Subtiele schaduw zodra er is gescrold; geen layout shift.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu sluiten bij navigatie.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape sluit het menu en zet focus terug; body niet scrollen achter menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Focus naar het paneel voor toetsenbordgebruikers.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`no-print sticky top-0 z-50 bg-canvas/95 backdrop-blur-sm transition-shadow ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline-3 focus-visible:outline-action"
          aria-label="PandPlicht — naar de homepage"
        >
          <Logo className="h-8" />
        </Link>

        {/* Desktopnavigatie */}
        <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors hover:bg-mint-soft hover:text-pine ${
                    pathname === item.href ? "text-pine" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/voor-adviseurs"
                className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-ink-soft transition-colors hover:bg-mint-soft hover:text-pine"
              >
                Voor adviseurs
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/pandcheck" size="md">
            Start gratis PandCheck
          </ButtonLink>
        </div>

        {/* Mobiel: compacte CTA + menuknop */}
        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink
            href="/pandcheck"
            size="md"
            className="px-4 text-[0.85rem]"
          >
            Start check
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-line bg-surface text-ink"
          >
            <span className="sr-only">{open ? "Menu sluiten" : "Menu openen"}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobiel menupaneel */}
      {open ? (
        <div
          id={menuId}
          ref={panelRef}
          className="border-t border-line bg-surface lg:hidden"
        >
          <nav aria-label="Hoofdnavigatie mobiel" className="px-4 py-4">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block rounded-xl px-4 py-3 text-[1.05rem] font-semibold text-ink hover:bg-mint-soft hover:text-pine"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/voor-adviseurs"
                  className="block rounded-xl px-4 py-3 text-[1.05rem] font-medium text-ink-soft hover:bg-mint-soft hover:text-pine"
                >
                  Voor adviseurs
                </Link>
              </li>
              <li className="mt-2 border-t border-line pt-3">
                <ButtonLink href="/pandcheck" size="lg" className="w-full">
                  Start gratis PandCheck
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
