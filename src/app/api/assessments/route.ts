import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { runAssessment } from "@/rules/engine";
import { assessmentInputSchema } from "@/lib/validation/assessment-schema";
import { getStorage } from "@/lib/db/storage";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

const MAX_BODY_BYTES = 32 * 1024;

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "assessments"), 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Te veel verzoeken. Probeer het zo weer." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "payload_too_large", message: "De aanvraag is te groot." },
      { status: 413 },
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Ongeldige aanvraag." },
      { status: 400 },
    );
  }

  const parsed = assessmentInputSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", message: "De ingevulde gegevens zijn niet geldig." },
      { status: 400 },
    );
  }

  // Berekening server-side met de gedeelde, deterministische rules-package.
  const outcome = runAssessment(parsed.data);
  // Cryptografisch onvoorspelbare token, nooit een oplopend ID.
  const token = randomBytes(24).toString("base64url");

  try {
    await getStorage().saveAssessment({
      token,
      createdAt: new Date().toISOString(),
      input: parsed.data,
      outcome,
    });
  } catch {
    // Opslag is best effort: de client bewaart de uitslag ook lokaal
    // (sessionStorage) en kan die tonen zonder server-side kopie.
  }

  return NextResponse.json({ token, outcome }, { status: 201 });
}
