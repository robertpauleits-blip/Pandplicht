import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Wizard } from "@/features/assessment/Wizard";

export const metadata: Metadata = {
  title: "Gratis PandCheck",
  description:
    "Doorloop de gratis PandCheck: binnen enkele minuten een indicatief overzicht van energieverplichtingen, netcongestierisico's en batterijkansen voor uw bedrijfspand.",
  // Scanstappen zijn bewust niet indexeerbaar en staan niet in de sitemap.
  robots: { index: false, follow: false },
};

export default function PandcheckPage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          De gratis PandCheck
        </h1>
        <p className="mt-3 text-ink-soft">
          Zes korte stappen. Geen account nodig, uitslag eerst, indicatief en
          niet juridisch bindend.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl rounded-panel border border-line bg-surface p-8 text-center text-ink-soft">
            De check wordt geladen…
          </div>
        }
      >
        <Wizard />
      </Suspense>
    </Container>
  );
}
