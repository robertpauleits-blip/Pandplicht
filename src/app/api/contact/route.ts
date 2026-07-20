import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getStorage } from "@/lib/db/storage";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(200).optional(), // honeypot
  startedAt: z.number(),
});

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "contact"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Te veel verzoeken. Probeer het later opnieuw." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Ongeldige aanvraag." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", message: "Controleer de ingevulde velden." },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (data.website || Date.now() - data.startedAt < 3_000) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    await getStorage().saveContact({
      id: randomBytes(12).toString("base64url"),
      createdAt: new Date().toISOString(),
      name: data.name,
      email: data.email,
      message: data.message,
    });
  } catch {
    return NextResponse.json(
      { error: "storage_unavailable", message: "Versturen lukt nu niet. Probeer het later opnieuw." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
