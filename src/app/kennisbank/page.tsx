import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getArticlesByCategory } from "@/content/knowledge";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Kennisbank, pandverplichtingen helder uitgelegd",
  description:
    "Alle uitleg over energieverplichtingen, energielabels, netcongestie en zakelijke batterijen voor Nederlandse bedrijfspanden. Met bronnen en controledata.",
  alternates: { canonical: "/kennisbank" },
};

export default function KennisbankPage() {
  const byCategory = getArticlesByCategory();

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Kennisbank",
          description:
            "Uitleg over energieverplichtingen, energielabels, netcongestie en zakelijke batterijen voor bedrijfspanden.",
          path: "/kennisbank",
        })}
      />
      <Breadcrumbs items={[{ name: "Kennisbank", path: "/kennisbank" }]} />
      <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Kennisbank
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Heldere uitleg over de regels voor bedrijfspanden, geschreven op basis
        van openbare overheidsbronnen, met per artikel een zichtbare
        controledatum.
      </p>

      {[...byCategory.entries()].map(([category, articles]) => (
        <section key={category} aria-labelledby={`cat-${category}`} className="mt-12">
          <h2
            id={`cat-${category}`}
            className="text-2xl font-extrabold tracking-tight text-ink"
          >
            {category}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.slug}
                className="flex flex-col rounded-panel border border-line bg-surface p-5 shadow-soft"
              >
                <h3 className="text-[1.05rem] font-bold leading-snug text-ink">
                  <Link href={`/kennisbank/${a.slug}`} className="hover:underline">
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-soft">{a.description}</p>
                <p className="mt-3 text-xs text-ink-soft">
                  Gecontroleerd op{" "}
                  <time dateTime={a.lastReviewedAt}>
                    {new Date(a.lastReviewedAt).toLocaleDateString("nl-NL")}
                  </time>
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </Container>
  );
}
