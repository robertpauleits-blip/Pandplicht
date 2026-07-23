import { NextResponse } from "next/server";
import { fetchEnergyLabel } from "@/lib/address/ep-online";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

/**
 * Haalt het geregistreerde energielabel + oppervlakte op via EP-Online.
 * De API-sleutel blijft server-side; de client krijgt alleen gesaneerde velden.
 * Bij geen sleutel/geen label/fout valt de wizard terug op handmatige invoer.
 */
export async function GET(req: Request) {
  const limit = rateLimit(clientKey(req, "energylabel"), 30, 60_000);
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

  const result = await fetchEnergyLabel({ postcode, huisnummer, toevoeging });

  // Uniforme, gesaneerde respons, nooit interne details of de sleutel.
  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, max-age=3600" },
  });
}
