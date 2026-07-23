import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-pine">Fout 404</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
        Deze pagina bestaat niet (meer)
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft">
        Het adres klopt niet of de pagina is verplaatst. Geen zorgen, via de
        knoppen hieronder vindt u snel de juiste plek.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 py-3 font-bold text-white shadow-soft hover:bg-pine-dark"
        >
          Naar de homepage
        </Link>
        <Link
          href="/kennisbank"
          className="inline-flex min-h-[48px] items-center rounded-full border-2 border-line bg-surface px-6 py-3 font-bold text-pine hover:border-pine"
        >
          Naar de kennisbank
        </Link>
      </div>
    </Container>
  );
}
