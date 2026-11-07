"use server";
import { cookies, headers } from "next/headers";
import { z } from "zod";
import { logFail } from "@/lib/log";
import { query, isDbConfigured } from "@/lib/db";
import { siteUrl } from "@/lib/seo";
import { isLocale } from "@/i18n/config";
import { courses } from "@/content/courses";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, createSession, deleteOtherSessions, deleteSession, purgeExpiredSessions } from "@/lib/auth/session";
import { attemptKey, clearAttempts, isBlocked, recordAttempt } from "@/lib/auth/rateLimit";
import { getCurrentUser, getSessionToken } from "@/lib/auth/current";

export type AuthError = "invalid" | "exists" | "badLogin" | "wrong_password" | "rate_limited" | "not_configured" | "unauthenticated" | "server";
export type AuthResult = { ok: true } | { ok: false; error: AuthError };
const fail = (error: AuthError): AuthResult => ({ ok: false, error });

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(8).max(200);

async function clientKey() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return attemptKey(`ip:${ip}`);
}
async function startSession(userId: string) {
  const { token, expiresAt } = await createSession(userId);
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: siteUrl.startsWith("https://"), path: "/", expires: expiresAt });
}
const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === "23505";

export async function signUpAction(input: unknown): Promise<AuthResult> {
  if (!isDbConfigured()) return fail("not_configured");
  const parsed = z.object({ email, password, displayName: z.string().trim().max(50).optional(), locale: z.string().max(10).optional() }).safeParse(input);
  if (!parsed.success) return fail("invalid");
  try {
    const ip = await clientKey();
    if (await isBlocked("signup", [{ key: ip, max: 8 }])) return fail("rate_limited");
    await recordAttempt("signup", [ip]);
    const { email: mail, password: pw, displayName, locale } = parsed.data;
    const hash = await hashPassword(pw);
    let id: string;
    try {
      const rows = await query<{ id: string }>("insert into users (email, password_hash, display_name, interface_locale) values ($1, $2, $3, $4) returning id",
        [mail, hash, displayName || null, locale && isLocale(locale) ? locale : "en"]);
      id = rows[0].id;
    } catch (e) { if (isUniqueViolation(e)) return fail("exists"); throw e; }
    await startSession(id);
    return { ok: true };
  } catch (e) { logFail("signUpAction", e); return fail("server"); }
}

export async function loginAction(input: unknown): Promise<AuthResult> {
  if (!isDbConfigured()) return fail("not_configured");
  const parsed = z.object({ email, password: z.string().min(1).max(200) }).safeParse(input);
  if (!parsed.success) return fail("badLogin");
  try {
    const emailKey = attemptKey(`email:${parsed.data.email}`); const ipKey = await clientKey();
    if (await isBlocked("login", [{ key: emailKey, max: 8 }, { key: ipKey, max: 40 }])) return fail("rate_limited");
    const rows = await query<{ id: string; password_hash: string }>("select id, password_hash from users where email = $1", [parsed.data.email]);
    // Always run one scrypt comparison so unknown emails take as long as wrong passwords.
    const match = await verifyPassword(parsed.data.password, rows[0]?.password_hash ?? DUMMY_HASH);
    if (!rows[0] || !match) { await recordAttempt("login", [emailKey, ipKey]); return fail("badLogin"); }
    await clearAttempts("login", emailKey);
    await startSession(rows[0].id);
    void purgeExpiredSessions().catch(() => {});
    return { ok: true };
  } catch (e) { logFail("loginAction", e); return fail("server"); }
}

export async function logoutAction(): Promise<AuthResult> {
  try {
    const token = await getSessionToken();
    if (token && isDbConfigured()) await deleteSession(token);
  } catch (e) { logFail("logoutAction", e); }
  (await cookies()).delete(SESSION_COOKIE);
  return { ok: true };
}

export async function changePasswordAction(input: unknown): Promise<AuthResult> {
  const parsed = z.object({ current: z.string().min(1).max(200), next: password }).safeParse(input);
  if (!parsed.success) return fail("invalid");
  const user = await getCurrentUser(); const token = await getSessionToken();
  if (!user || !token) return fail("unauthenticated");
  try {
    const keys = [{ key: attemptKey(`email:${user.email}`), max: 8 }];
    if (await isBlocked("login", keys)) return fail("rate_limited");
    const rows = await query<{ password_hash: string }>("select password_hash from users where id = $1", [user.id]);
    if (!rows[0] || !(await verifyPassword(parsed.data.current, rows[0].password_hash))) { await recordAttempt("login", [keys[0].key]); return fail("wrong_password"); }
    await query("update users set password_hash = $2 where id = $1", [user.id, await hashPassword(parsed.data.next)]);
    await deleteOtherSessions(user.id, token); // signs out every other device
    return { ok: true };
  } catch (e) { logFail("changePasswordAction", e); return fail("server"); }
}

export async function updateProfileAction(input: unknown): Promise<AuthResult> {
  const parsed = z.object({ displayName: z.string().trim().max(50), interfaceLocale: z.string().max(10), courseId: z.string().max(40) }).safeParse(input);
  if (!parsed.success || !isLocale(parsed.data.interfaceLocale) || (parsed.data.courseId && !courses.some((c) => c.id === parsed.data.courseId))) return fail("invalid");
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");
  try {
    await query("update users set display_name = $2, interface_locale = $3, current_course_id = $4 where id = $1", [user.id, parsed.data.displayName || null, parsed.data.interfaceLocale, parsed.data.courseId || null]);
    return { ok: true };
  } catch (e) { logFail("updateProfileAction", e); return fail("server"); }
}
