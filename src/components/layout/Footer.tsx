import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { DISCLAIMER_SHORT, LEGAL } from "@/lib/site";

const COLS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Checks",
    links: [
      { href: "/pandcheck", label: "Gratis PandCheck" },
      { href: "/tools/pandverplichtingencheck", label: "Pandverplichtingencheck" },
      { href: "/tools/energiebesparingsplicht-check", label: "Energiebesparingsplichtcheck" },
      { href: "/tools/netcongestiecheck", label: "Netcongestiecheck" },
      { href: "/tools/zakelijke-batterijscan", label: "Zakelijke batterijscan" },
    ],
  },
  {
    heading: "Onderwerpen",
    links: [
      { href: "/verplichtingen", label: "Alle verplichtingen" },
      { href: "/verplichtingen/energiebesparingsplicht", label: "Energiebesparingsplicht" },
      { href: "/verplichtingen/energielabel-c-kantoren", label: "Energielabel C kantoren" },
      { href: "/netcongestie", label: "Netcongestie" },
      { href: "/zakelijke-batterij", label: "Zakelijke batterij" },
      { href: "/kennisbank", label: "Kennisbank" },
    ],
  },
  {
    heading: "Over PandPlicht",
    links: [
      { href: "/over-pandplicht", label: "Over PandPlicht" },
      { href: "/bronnen-en-methodologie", label: "Bronnen en methodologie" },
      { href: "/voor-adviseurs", label: "Voor adviseurs" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Juridisch",
    links: [
      { href: "/privacy", label: "Privacyverklaring" },
      { href: "/cookies", label: "Cookies" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="no-print mt-20 border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <Logo className="h-8" />
            <p className="mt-4 max-w-xs text-[0.95rem] text-ink-soft">
              Eén gratis, indicatieve check voor de energie- en
              verduurzamingsverplichtingen van uw bedrijfspand — met bronnen en
              vervolgstappen.
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                {col.heading}
              </h2>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.95rem] text-ink-soft hover:text-pine hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">
          <p>{DISCLAIMER_SHORT}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} PandPlicht
            {LEGAL.kvkNummer ? ` • KvK ${LEGAL.kvkNummer}` : ""} • Gebaseerd op
            openbare overheidsbronnen; zie{" "}
            <Link href="/bronnen-en-methodologie" className="underline hover:text-pine">
              bronnen en methodologie
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
