import { NextResponse } from "next/server";
import { getStorage } from "@/lib/db/storage";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const limit = rateLimit(clientKey(req, "assessments"), 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Te veel verzoeken. Probeer het zo weer." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const { token } = await params;
  if (!token || token.length > 64) {
    return NextResponse.json(
      { error: "invalid_request", message: "Ongeldige link." },
      { status: 400 },
    );
  }

  const assessment = await getStorage().getAssessment(token);
  if (!assessment) {
    return NextResponse.json(
      {
        error: "not_found",
        message:
          "Deze uitslag is niet (meer) beschikbaar. Uitslagen worden na een bewaartermijn automatisch verwijderd.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { assessment },
    { headers: { "Cache-Control": "no-store" } },
  );
}
