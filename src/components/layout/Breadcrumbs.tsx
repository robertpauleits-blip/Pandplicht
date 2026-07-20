import Link from "next/link";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Kruimelpad" className="no-print mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink-soft">
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-pine hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
