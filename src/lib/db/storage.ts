import { promises as fs } from "node:fs";
import path from "node:path";
import type { StoredAssessment } from "@/rules/types";

/**
 * Opslagadapter. Drie modi:
 * 1. Development/demo: bestandsadapter in `.data/` (deterministisch, lokaal).
 * 2. Production basic (P1): PostgreSQL, implementeer dit interface met een
 *    databaseclient; alle aanroepen lopen al via deze laag.
 * 3. Future integrations: externe data-adapters.
 *
 * Persoonlijke uitslagen worden na ASSESSMENT_RETENTION_DAYS opgeruimd.
 */

export type LeadRecord = {
  id: string;
  createdAt: string;
  status: "new" | "reviewed" | "matched" | "contacted" | "closed";
  contact: { name: string; company: string; email: string; phone?: string };
  helpTopics: string[];
  region?: string;
  assessmentId?: string;
  assessmentSummary?: {
    statuses: Record<string, string>;
    rulesetVersion: string;
  };
  message?: string;
  consent: {
    requestProcessing: true;
    marketing: boolean;
    consentedAt: string;
    privacyVersion: string;
  };
  attribution: {
    landingPage?: string;
    referrerGroup?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
};

export type ContactRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  message: string;
};

export interface Storage {
  saveAssessment(a: StoredAssessment): Promise<void>;
  getAssessment(token: string): Promise<StoredAssessment | null>;
  saveLead(lead: LeadRecord): Promise<void>;
  saveContact(c: ContactRecord): Promise<void>;
}

const RETENTION_DAYS = Number(process.env.ASSESSMENT_RETENTION_DAYS ?? "30");

/** Bestandsadapter voor development/demo. Geen PII in logs. */
class FileStorage implements Storage {
  private dir = path.join(process.cwd(), ".data");

  private async ensureDir(sub: string) {
    const p = path.join(this.dir, sub);
    await fs.mkdir(p, { recursive: true });
    return p;
  }

  async saveAssessment(a: StoredAssessment): Promise<void> {
    const dir = await this.ensureDir("assessments");
    // Token is cryptografisch onvoorspelbaar; bestandsnaam = token.
    const safe = a.token.replace(/[^a-zA-Z0-9_-]/g, "");
    await fs.writeFile(path.join(dir, `${safe}.json`), JSON.stringify(a));
    void this.cleanupExpired(dir);
  }

  async getAssessment(token: string): Promise<StoredAssessment | null> {
    const safe = token.replace(/[^a-zA-Z0-9_-]/g, "");
    try {
      const raw = await fs.readFile(
        path.join(this.dir, "assessments", `${safe}.json`),
        "utf8",
      );
      const parsed = JSON.parse(raw) as StoredAssessment;
      const age = Date.now() - new Date(parsed.createdAt).getTime();
      if (age > RETENTION_DAYS * 86_400_000) return null; // verlopen
      return parsed;
    } catch {
      return null;
    }
  }

  private async cleanupExpired(dir: string) {
    try {
      const files = await fs.readdir(dir);
      const cutoff = Date.now() - RETENTION_DAYS * 86_400_000;
      for (const f of files) {
        const p = path.join(dir, f);
        const st = await fs.stat(p);
        if (st.mtimeMs < cutoff) await fs.unlink(p);
      }
    } catch {
      /* opruimen is best effort */
    }
  }

  async saveLead(lead: LeadRecord): Promise<void> {
    const dir = await this.ensureDir("leads");
    await fs.writeFile(
      path.join(dir, `${lead.id}.json`),
      JSON.stringify(lead, null, 2),
    );
  }

  async saveContact(c: ContactRecord): Promise<void> {
    const dir = await this.ensureDir("contact");
    await fs.writeFile(path.join(dir, `${c.id}.json`), JSON.stringify(c, null, 2));
  }
}

let instance: Storage | null = null;

export function getStorage(): Storage {
  if (!instance) {
    // P1: kies hier een PostgresStorage wanneer DATABASE_URL is gezet.
    // De rest van de applicatie merkt daar niets van.
    instance = new FileStorage();
  }
  return instance;
}
