import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileCta } from "@/components/layout/MobileCta";
import { Faq } from "@/components/marketing/Faq";
import { ARTICLES, getArticle, getRelatedArticles } from "@/content/knowledge";
import { getSources } from "@/rules/sources";
import { JsonLd, articleLd, faqLd } from "@/lib/seo/jsonld";
import type { ArticleSection } from "@/content/types";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/kennisbank/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

function Section({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case "kop":
      return <h2>{section.text}</h2>;
    case "paragraaf":
      return <p>{section.text}</p>;
    case "lijst":
      return section.geordend ? (
        <ol>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "tabel":
      return (
        <div className="overflow-x-auto">
          <table>
            <caption>{section.caption}</caption>
            <thead>
              <tr>
                {section.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArtikelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const sources = getSources(article.sourceIds);
  const related = getRelatedArticles(article);
  const reviewedDate = new Date(article.lastReviewedAt).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="py-10 pb-24 sm:py-14">
      <JsonLd
        data={[
          articleLd({
            title: article.title,
            description: article.description,
            path: `/kennisbank/${article.slug}`,
            publishedAt: article.publishedAt,
            lastReviewedAt: article.lastReviewedAt,
          }),
          ...(article.faq.length > 0 ? [faqLd(article.faq)] : []),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Kennisbank", path: "/kennisbank" },
          { name: article.title, path: `/kennisbank/${article.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-pine">
          {article.category}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          Redactie PandPlicht • Laatst inhoudelijk gecontroleerd op{" "}
          <time dateTime={article.lastReviewedAt}>{reviewedDate}</time>
        </p>

        {/* Kort antwoord, zelfstandig leesbaar, direct onder de H1 */}
        <div className="mt-6 rounded-panel border-2 border-mint bg-mint-soft/60 p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-pine">
            Kort antwoord
          </h2>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-ink">
            {article.kortAntwoord}
          </p>
        </div>

        <div className="prose-pp mt-8">
          {article.sections.map((section, i) => (
            <Section key={i} section={section} />
          ))}
        </div>

        {/* Bronnen en laatste controle */}
        <section aria-labelledby="bronnen-h" className="mt-10 rounded-panel border border-line bg-surface p-5 sm:p-6">
          <h2 id="bronnen-h" className="text-xl font-bold text-ink">
            Bronnen en laatste controle
          </h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {sources.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-pine underline decoration-mint decoration-2 underline-offset-2 hover:decoration-action"
                >
                  {s.title}
                </a>{" "}
                <span className="text-ink-soft">
                 , {s.publisher}, door PandPlicht gecontroleerd op{" "}
                  {new Date(s.checkedAt).toLocaleDateString("nl-NL")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink-soft">
            Wetgeving verandert. Zie{" "}
            <Link href="/bronnen-en-methodologie" className="underline hover:text-pine">
              onze methodologie
            </Link>{" "}
            voor hoe wij bronnen controleren en bijhouden.
          </p>
        </section>

        {article.faq.length > 0 ? (
          <div className="mt-10">
            <Faq items={article.faq} heading="Veelgestelde vragen" />
          </div>
        ) : null}

        {article.relatedTool ? (
          <div className="no-print mt-10 rounded-panel bg-mint-soft p-6 text-center">
            <p className="font-bold text-ink">
              Weten wat dit voor uw pand betekent?
            </p>
            <Link
              href={article.relatedTool.href}
              className="mt-3 inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
            >
              {article.relatedTool.label}
            </Link>
          </div>
        ) : null}

        {related.length > 0 ? (
          <nav aria-labelledby="gerelateerd-h" className="mt-10">
            <h2 id="gerelateerd-h" className="text-xl font-bold text-ink">
              Gerelateerde artikelen
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/kennisbank/${r.slug}`}
                    className="block rounded-card border border-line bg-surface p-4 font-semibold text-ink transition-colors hover:border-action"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </article>
      <MobileCta />
    </Container>
  );
}
