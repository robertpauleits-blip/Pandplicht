import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LeadRecord } from "@/lib/db/storage";
import { leadEmailHtml, notifyNieuweLead } from "./email";

function lead(overrides: Partial<LeadRecord> = {}): LeadRecord {
  return {
    id: "abc123",
    createdAt: "2026-07-27T10:00:00.000Z",
    status: "new",
    contact: {
      name: "Jan Jansen",
      company: "Jansen Vastgoed BV",
      email: "jan@example.nl",
    },
    helpTopics: ["energielabel_c_kantoor"],
    consent: {
      requestProcessing: true,
      marketing: false,
      consentedAt: "2026-07-27T10:00:00.000Z",
      privacyVersion: "2026-07",
    },
    attribution: {},
    ...overrides,
  };
}

describe("leadEmailHtml", () => {
  it("bevat de contactgegevens van de aanvrager", () => {
    const html = leadEmailHtml(lead());
    expect(html).toContain("Jan Jansen");
    expect(html).toContain("Jansen Vastgoed BV");
    expect(html).toContain("jan@example.nl");
  });

  it("ontsnapt HTML uit gebruikersinvoer", () => {
    const html = leadEmailHtml(
      lead({ message: '<script>alert("xss")</script>' }),
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("laat optionele velden weg wanneer ze ontbreken", () => {
    expect(leadEmailHtml(lead())).not.toContain("Telefoon");
    expect(leadEmailHtml(lead({ contact: { ...lead().contact, phone: "0612345678" } })))
      .toContain("0612345678");
  });
});

describe("notifyNieuweLead", () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it("doet niets zonder configuratie en meldt dat netjes", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.LEAD_NOTIFY_TO;
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const r = await notifyNieuweLead(lead());

    expect(r).toEqual({ verstuurd: false, reden: "niet_geconfigureerd" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("verstuurt met reply-to naar de aanvrager", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.LEAD_NOTIFY_TO = "info@pandplicht.nl";
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    const r = await notifyNieuweLead(lead());

    expect(r).toEqual({ verstuurd: true });
    const body = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body));
    expect(body.to).toEqual(["info@pandplicht.nl"]);
    expect(body.reply_to).toBe("jan@example.nl");
    expect(body.subject).toContain("Jansen Vastgoed BV");
  });

  it("een fout bij de mailprovider levert 'mislukt', geen exception", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.LEAD_NOTIFY_TO = "info@pandplicht.nl";
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("netwerk stuk"));

    await expect(notifyNieuweLead(lead())).resolves.toEqual({
      verstuurd: false,
      reden: "mislukt",
    });
  });
});
