import { NextResponse } from "next/server";
import { suggestAddresses } from "@/lib/address/pdok";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

export async function GET(req: Request) {
  const limit = rateLimit(clientKey(req, "address"), 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Te veel verzoeken. Probeer het zo weer." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const q = new URL(req.url).searchParams.get("q") ?? "";
  try {
    const suggestions = await suggestAddresses(q);
    return NextResponse.json({ suggestions });
  } catch {
    // Geen interne details naar de client; wizard valt terug op handmatige invoer.
    return NextResponse.json(
      {
        error: "address_service_unavailable",
        message:
          "Wij kunnen dit adres nu niet automatisch ophalen. U kunt verdergaan met handmatige invoer; de uitslag wordt daardoor iets minder specifiek.",
      },
      { status: 502 },
    );
  }
}
