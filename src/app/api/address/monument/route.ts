import { NextResponse } from "next/server";
import { fetchMonumentStatus } from "@/lib/address/monument";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

/**
 * Bepaalt of een pand een rijksmonument is (keyless, via PDOK Locatieserver +
 * RCE cultuurhistorie). Bij geen resultaat of fout blijft de monumentvraag in
 * de wizard gewoon handmatig te beantwoorden.
 */
export async function GET(req: Request) {
  const limit = rateLimit(clientKey(req, "monument"), 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { status: "error", message: "Te veel verzoeken. Probeer het zo weer." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const url = new URL(req.url);
  const postcode = (url.searchParams.get("postcode") ?? "").slice(0, 8);
  const huisnummer = (url.searchParams.get("huisnummer") ?? "").slice(0, 6);
  const toevoeging = (url.searchParams.get("toevoeging") ?? "").slice(0, 6);

  if (!postcode || !huisnummer) {
    return NextResponse.json(
      { status: "error", message: "Postcode en huisnummer zijn vereist." },
      { status: 400 },
    );
  }

  const result = await fetchMonumentStatus({ postcode, huisnummer, toevoeging });
  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, max-age=3600" },
  });
}
