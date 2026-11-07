import { createHash, randomBytes } from "node:crypto";
import { query } from "@/lib/db";

export const SESSION_COOKIE = "mgxl_session";
export const SESSION_DAYS = 30;
export interface SessionUser { id: string; email: string; displayName: string | null; interfaceLocale: string; currentCourseId: string | null }

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await query("insert into sessions (user_id, token_hash, expires_at) values ($1, $2, $3)", [userId, hashToken(token), expiresAt.toISOString()]);
  return { token, expiresAt };
}

export async function userForToken(token: string): Promise<SessionUser | null> {
  if (!token || token.length > 200) return null;
  const rows = await query<{ id: string; email: string; display_name: string | null; interface_locale: string; current_course_id: string | null }>(
    `select u.id, u.email, u.display_name, u.interface_locale, u.current_course_id
       from sessions s join users u on u.id = s.user_id where s.token_hash = $1 and s.expires_at > now()`, [hashToken(token)]);
  const u = rows[0];
  return u ? { id: u.id, email: u.email, displayName: u.display_name, interfaceLocale: u.interface_locale, currentCourseId: u.current_course_id } : null;
}

export const deleteSession = (token: string) => query("delete from sessions where token_hash = $1", [hashToken(token)]);
export const deleteOtherSessions = (userId: string, keepToken: string) => query("delete from sessions where user_id = $1 and token_hash <> $2", [userId, hashToken(keepToken)]);
export const purgeExpiredSessions = () => query("delete from sessions where expires_at < now()");
