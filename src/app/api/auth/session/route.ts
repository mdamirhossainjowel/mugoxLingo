import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current";

export const dynamic = "force-dynamic";

/** Tells the page header whether accounts exist and whether the visitor is signed in. */
export async function GET() {
  const enabled = isDbConfigured();
  const user = enabled ? await getCurrentUser() : null;
  return NextResponse.json({ enabled, signedIn: Boolean(user) }, { headers: { "Cache-Control": "no-store" } });
}
