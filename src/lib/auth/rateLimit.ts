import { createHash } from "node:crypto";
import { query } from "@/lib/db";

export type AttemptKind = "login" | "signup";
export const attemptKey = (value: string) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

/** True when any key already has `max` attempts of this kind in the last 15 minutes. */
export async function isBlocked(kind: AttemptKind, limits: { key: string; max: number }[]): Promise<boolean> {
  for (const { key, max } of limits) {
    const rows = await query<{ n: number }>("select count(*)::int as n from auth_attempts where kind = $1 and key_hash = $2 and at > now() - interval '15 minutes'", [kind, key]);
    if ((rows[0]?.n ?? 0) >= max) return true;
  }
  return false;
}
export async function recordAttempt(kind: AttemptKind, keys: string[]) {
  await query("insert into auth_attempts (kind, key_hash) select $1, k from unnest($2::text[]) as k", [kind, keys]);
  await query("delete from auth_attempts where at < now() - interval '1 day'");
}
export const clearAttempts = (kind: AttemptKind, key: string) => query("delete from auth_attempts where kind = $1 and key_hash = $2", [kind, key]);
