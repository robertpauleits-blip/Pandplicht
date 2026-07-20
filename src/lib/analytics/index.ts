/**
 * Privacyvriendelijke analytics-adapter (cookieloos).
 * Provider "none" = geen netwerkverkeer. Plausible/Umami kunnen later via
 * dezelfde interface worden aangesloten zonder de call sites te wijzigen.
 *
 * Nooit meesturen: volledige adressen, e-mail, telefoon, vrije tekst,
 * exacte verbruikswaarden of assessmenttokens.
 */

export type AnalyticsEvent =
  | "page_view"
  | "hero_check_started"
  | "tool_selected"
  | "assessment_started"
  | "assessment_step_viewed"
  | "assessment_step_completed"
  | "assessment_unknown_selected"
  | "assessment_validation_error"
  | "assessment_completed"
  | "result_topic_viewed"
  | "source_clicked"
  | "report_printed"
  | "lead_form_opened"
  | "lead_form_submitted"
  | "lead_form_error"
  | "outbound_official_source_clicked"
  | "ai_referral_landing"
  | "sponsored_impression"
  | "sponsored_click";

export type AnalyticsProps = {
  tool?: string;
  step?: number;
  statusCategory?: string;
  errorCode?: string;
  device?: string;
  referrerGroup?: string;
  topic?: string;
};

const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  if (provider === "plausible") {
    const w = window as unknown as {
      plausible?: (e: string, o?: { props: AnalyticsProps }) => void;
    };
    w.plausible?.(event, { props });
    return;
  }
  if (provider === "umami") {
    const w = window as unknown as {
      umami?: { track?: (e: string, p?: AnalyticsProps) => void };
    };
    w.umami?.track?.(event, props);
    return;
  }
  // provider "none": bewust geen actie.
}

/** Groepeer een referrer zonder de volledige URL op te slaan. */
export function referrerGroup(ref: string): string {
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host.includes("chatgpt.com") || host.includes("openai.com")) return "ai_chatgpt";
    if (host.includes("perplexity.ai")) return "ai_perplexity";
    if (host.includes("copilot.microsoft.com")) return "ai_copilot";
    if (host.includes("google.")) return "google";
    if (host.includes("bing.com")) return "bing";
    if (host.includes("duckduckgo.com")) return "duckduckgo";
    return "other";
  } catch {
    return "other";
  }
}
