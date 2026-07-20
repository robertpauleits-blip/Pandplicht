import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/features/contact/ContactForm";
import { JsonLd, webPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met PandPlicht: vragen over de check, feedback op de inhoud of interesse in samenwerking als adviseur.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={webPageLd({
          title: "Contact",
          description: "Neem contact op met PandPlicht.",
          path: "/contact",
        })}
      />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Contact
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Vragen over de check, een inhoudelijke correctie of interesse in
          samenwerking? Gebruik het formulier hieronder. Ziet u een fout in
          onze informatie of een beveiligingsprobleem, dan horen wij dat graag
          — vermeld dat duidelijk in uw bericht.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
