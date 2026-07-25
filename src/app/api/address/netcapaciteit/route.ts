import { NextResponse } from "next/server";
import { fetchNetcapaciteit } from "@/lib/address/netcapaciteit";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { FLAGS } from "@/lib/site";

/**
 * Geeft de gebiedsindicatie van de Capaciteitskaart elektriciteitsnet
 * (Netbeheer Nederland) bij een adres. Staat achter ENABLE_LIVE_GRID_DATA,
 * omdat het om netdata gaat die per gebied geldt en niet per aansluiting.
 */
export async function GET(req: Request) {
  if (!FLAGS.liveGridData) {
    return NextResponse.json({ status: "uitgeschakeld" });
  }

  const limit = rateLimit(clientKey(req, "netcapaciteit"), 30, 60_000);
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

  const result = await fetchNetcapaciteit({ postcode, huisnummer, toevoeging });
  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, max-age=3600" },
  });
}
