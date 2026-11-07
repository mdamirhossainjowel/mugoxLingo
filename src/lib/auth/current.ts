import "server-only";
import { cookies } from "next/headers";
import { isDbConfigured } from "@/lib/db";
import { logFail } from "@/lib/log";
import { SESSION_COOKIE, userForToken, type SessionUser } from "./session";

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}
/** The signed-in user, or null when signed out, when the database is not set up, or when it is unreachable. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!isDbConfigured()) return null;
  const token = await getSessionToken();
  if (!token) return null;
  try { return await userForToken(token); } catch (e) { logFail("getCurrentUser", e); return null; }
}
