import type { ContactRecord, LeadRecord } from "@/lib/db/storage";

/**
 * E-mailnotificatie bij een nieuwe aanvraag.
 *
 * Bij leadgeneratie telt snelheid van opvolgen: een aanvraag die pas na dagen
 * wordt gezien, is meestal al bij een ander terechtgekomen. Daarom sturen we
 * direct een mail zodra er een lead binnenkomt.
 *
 * Configuratie (Netlify environment variables):
 *   RESEND_API_KEY   = je Resend-sleutel
 *   LEAD_NOTIFY_TO   = ontvanger, bijv. jij@pandplicht.nl
 *   LEAD_NOTIFY_FROM = afzender op een geverifieerd domein
 *                      (standaard: onboarding@resend.dev, alleen voor tests)
 *
 * Ontbreekt de sleutel of de ontvanger, dan doet deze module niets en meldt
 * dat via de retourwaarde. Een mislukte notificatie mag nooit de opslag van de
 * lead of het antwoord aan de bezoeker beïnvloeden.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 5_000;

export type NotifyResultaat =
  | { verstuurd: true }
  | { verstuurd: false; reden: "niet_geconfigureerd" | "mislukt" };

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Bouwt een korte, leesbare samenvatting van de aanvraag. */
export function leadEmailHtml(lead: LeadRecord): string {
  const r = (label: string, waarde: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#5b6b6b">${esc(label)}</td>` +
    `<td style="padding:4px 0"><strong>${esc(waarde)}</strong></td></tr>`;

  const onderwerpen = lead.helpTopics.length
    ? lead.helpTopics.join(", ")
    : "niet opgegeven";

  return [
    `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#12211f">`,
    `<h2 style="margin:0 0 12px">Nieuwe aanvraag via PandPlicht</h2>`,
    `<table style="border-collapse:collapse">`,
    r("Naam", lead.contact.name),
    r("Bedrijf", lead.contact.company),
    r("E-mail", lead.contact.email),
    lead.contact.phone ? r("Telefoon", lead.contact.phone) : "",
    r("Onderwerpen", onderwerpen),
    lead.region ? r("Regio", lead.region) : "",
    r("Marketingtoestemming", lead.consent.marketing ? "ja" : "nee"),
    r("Binnengekomen", new Date(lead.createdAt).toLocaleString("nl-NL")),
    r("Lead-id", lead.id),
    `</table>`,
    lead.message
      ? `<p style="margin:16px 0 4px;color:#5b6b6b">Bericht</p>` +
        `<p style="margin:0;white-space:pre-wrap">${esc(lead.message)}</p>`
      : "",
    `</div>`,
  ].join("");
}

async function verstuur(opts: {
  subject: string;
  html: string;
  replyTo: string;
}): Promise<NotifyResultaat> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM || "onboarding@resend.dev";
  if (!apiKey || !to) return { verstuurd: false, reden: "niet_geconfigureerd" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) return { verstuurd: false, reden: "mislukt" };
    return { verstuurd: true };
  } catch {
    return { verstuurd: false, reden: "mislukt" };
  } finally {
    clearTimeout(timer);
  }
}

export async function notifyNieuweLead(
  lead: LeadRecord,
): Promise<NotifyResultaat> {
  return verstuur({
    subject: `Nieuwe aanvraag: ${lead.contact.company || lead.contact.name}`,
    html: leadEmailHtml(lead),
    replyTo: lead.contact.email,
  });
}

export async function notifyContactbericht(
  bericht: ContactRecord,
): Promise<NotifyResultaat> {
  const html =
    `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#12211f">` +
    `<h2 style="margin:0 0 12px">Nieuw contactbericht via PandPlicht</h2>` +
    `<p style="margin:0 0 4px"><strong>${esc(bericht.name)}</strong> ` +
    `&lt;${esc(bericht.email)}&gt;</p>` +
    `<p style="margin:12px 0 0;white-space:pre-wrap">${esc(bericht.message)}</p>` +
    `</div>`;
  return verstuur({
    subject: `Contactbericht van ${bericht.name}`,
    html,
    replyTo: bericht.email,
  });
}
