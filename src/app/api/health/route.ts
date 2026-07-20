import { NextResponse } from "next/server";
import { RULESET_VERSION } from "@/rules/version";

export function GET() {
  return NextResponse.json({
    status: "ok",
    rulesetVersion: RULESET_VERSION,
    time: new Date().toISOString(),
  });
}
