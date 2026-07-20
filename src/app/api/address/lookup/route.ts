import { NextResponse } from "next/server";
import { lookupAddress } from "@/lib/address/pdok";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

export async function GET(req: Request) {
  const limit = rateLimit(clientKey(req, "address"), 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Te veel verzoeken. Probeer het zo weer." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json(
      { error: "invalid_request", message: "Geen adres-ID opgegeven." },
      { status: 400 },
    );
  }
  try {
    const address = await lookupAddress(id);
    if (!address) {
      return NextResponse.json(
        { error: "not_found", message: "Adres niet gevonden." },
        { status: 404 },
      );
    }
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json(
      {
        error: "address_service_unavailable",
        message:
          "Wij kunnen dit adres nu niet automatisch ophalen. U kunt verdergaan met handmatige invoer.",
      },
      { status: 502 },
    );
  }
}
