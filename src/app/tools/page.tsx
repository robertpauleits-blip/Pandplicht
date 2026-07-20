import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TOOL_PAGES } from "@/features/tools/tools-data";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Gratis checks voor uw bedrijfspand",
  description:
    "Vier gratis, indicatieve checks: pandverplichtingen, energiebesparingsplicht, netcongestie en de zakelijke batterijscan. Zonder account, met bronnen.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Gratis checks",
          description:
            "Vier gratis, indicatieve checks voor bedrijfspanden: verplichtingen, energiebesparing, netcongestie en batterij.",
          path: "/tools",
        })}
      />
      <Breadcrumbs items={[{ name: "Checks", path: "/tools" }]} />
      <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Gratis checks
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Start bij het onderwerp dat nu speelt, of doe de complete PandCheck —
        die dekt alle vier de onderwerpen in één keer.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {TOOL_PAGES.map(({ path, title, description, Icon }) => (
          <article
            key={path}
            className="flex flex-col rounded-panel border border-line bg-surface p-6 shadow-soft"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-soft text-pine">
              <Icon />
            </span>
            <h2 className="mt-4 text-xl font-bold text-ink">
              <Link href={path} className="hover:underline">
                {title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-[0.95rem] text-ink-soft">{description}</p>
            <Link href={path} className="mt-4 font-bold text-pine hover:underline">
              Bekijk deze check →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-panel bg-mint-soft p-6 text-center sm:p-8">
        <p className="text-lg font-bold text-ink">Alles in één keer checken?</p>
        <Link
          href="/pandcheck"
          className="mt-4 inline-flex min-h-[52px] items-center rounded-full bg-pine px-7 py-3.5 font-bold text-white shadow-soft hover:bg-pine-dark"
        >
          Start de complete PandCheck
        </Link>
      </div>
    </Container>
  );
}
