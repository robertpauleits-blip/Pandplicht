import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ResultsView } from "@/features/assessment/ResultsView";

export const metadata: Metadata = {
  title: "Uw indicatieve uitslag",
  // Persoonlijke uitslagen zijn nooit indexeerbaar.
  robots: { index: false, follow: false },
};

export default async function UitslagPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <Container className="py-10 sm:py-14">
      <ResultsView token={token} />
    </Container>
  );
}
