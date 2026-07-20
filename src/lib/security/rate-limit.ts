/**
 * Eenvoudige in-memory rate limiter per routecategorie.
 * Voldoende voor één serverinstantie; vervang bij horizontale schaal door
 * een gedeelde store (bijv. Upstash/Redis) achter dit zelfde interface.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Client-sleutel zonder PII-opslag: gehashte combinatie van IP en categorie. */
export function clientKey(req: Request, category: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  // Eenvoudige niet-omkeerbare sleutel (geen ruwe IP's in memory dumps nodig).
  let hash = 0;
  const s = `${category}:${ip}`;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return `${category}:${hash}`;
}
