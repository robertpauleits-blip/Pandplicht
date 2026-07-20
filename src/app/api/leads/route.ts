import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getStorage, type LeadRecord } from "@/lib/db/storage";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

const PRIVACY_VERSION = "2026-07";
const MIN_FILL_MS = 3_000; // minimale invultijd tegen bots

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/)
    .optional()
    .or(z.literal("")),
  helpTopics: z
    .array(
      z.enum([
        "verplichtingen",
        "energielabel",
        "energiebesparing",
        "netcongestie",
        "batterij",
        "anders",
      ]),
    )
    .min(1)
    .max(6),
  region: z.string().trim().max(10).optional(),
  message: z.string().trim().max(2000).optional(),
  assessmentToken: z.string().max(64).optional(),
  assessmentSummary: z
    .object({
      statuses: z.record(z.string().max(40), z.string().max(40)),
      rulesetVersion: z.string().max(20),
    })
    .optional(),
  consentProcessing: z.literal(true),
  consentMarketing: z.boolean(),
  // Spambescherming
  website: z.string().max(200).optional(), // honeypot: moet leeg blijven
  startedAt: z.number(),
  attribution: z
    .object({
      landingPage: z.string().max(300).optional(),
      referrerGroup: z.string().max(60).optional(),
      utmSource: z.string().max(100).optional(),
      utmMedium: z.string().max(100).optional(),
      utmCampaign: z.string().max(100).optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "leads"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Te veel verzoeken. Probeer het later opnieuw." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const raw = await req.text();
  if (raw.length > 64 * 1024) {
    return NextResponse.json(
      { error: "payload_too_large", message: "De aanvraag is te groot." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Ongeldige aanvraag." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_input",
        message: "Controleer de ingevulde velden en probeer het opnieuw.",
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot gevuld of te snel ingevuld → stil accepteren zonder opslag.
  const tooFast = Date.now() - data.startedAt < MIN_FILL_MS;
  if (data.website || tooFast) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const lead: LeadRecord = {
    id: randomBytes(12).toString("base64url"),
    createdAt: new Date().toISOString(),
    status: "new",
    contact: {
      name: data.name,
      company: data.company,
      email: data.email,
      ...(data.phone ? { phone: data.phone } : {}),
    },
    helpTopics: data.helpTopics,
    ...(data.region ? { region: data.region } : {}),
    ...(data.assessmentToken ? { assessmentId: data.assessmentToken } : {}),
    ...(data.assessmentSummary
      ? { assessmentSummary: data.assessmentSummary }
      : {}),
    ...(data.message ? { message: data.message } : {}),
    consent: {
      requestProcessing: true,
      marketing: data.consentMarketing,
      consentedAt: new Date().toISOString(),
      privacyVersion: PRIVACY_VERSION,
    },
    attribution: data.attribution ?? {},
  };

  try {
    await getStorage().saveLead(lead);
  } catch {
    return NextResponse.json(
      {
        error: "storage_unavailable",
        message:
          "Uw aanvraag kan nu niet worden opgeslagen. Probeer het later opnieuw.",
      },
      { status: 503 },
    );
  }

  // P1: e-mailnotificatie via adapter (EMAIL_PROVIDER_API_KEY) — bewust
  // uitgeschakeld zolang er geen echt e-mailadres is geconfigureerd.

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
